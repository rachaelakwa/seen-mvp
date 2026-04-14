// Watchmode API: https://api.watchmode.com/
// Docs: https://api.watchmode.com/docs/
import { inferMoodsFromWatchmodeTitle } from '../utils/moodInference.js';
import { config } from '../config/env.js';

const BASE_URL = 'https://api.watchmode.com/v1';

// Watchmode genre IDs
const MOOD_GENRES = {
  soft:        [9, 21, 10, 11],  // drama, romance, family, fantasy
  fried:       [6],               // comedy
  drained:     [9, 10, 4],        // drama, family, animation
  chaotic:     [26, 7, 1],        // thriller, crime, action
  lockedin:    [9, 26, 18],       // drama, thriller, mystery
  overwhelmed: [10, 4, 21],       // family, animation, romance
  wired:       [1, 26],           // action, thriller
};

// In-memory cache: moodId → { data, expiresAt }
const cache = new Map();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const TITLES_PER_MOOD = 10;
const WATCHMODE_CANDIDATE_LIMIT = 25;
const WATCHMODE_DETAIL_BATCH_SIZE = 5;
const MIN_GOOD_FIT_SCORE = 3;
// In-memory detail cache: watchmodeId → { data, expiresAt }
const detailCache = new Map();
const DETAIL_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getApiKey() {
  return config.watchmodeApiKey;
}

async function watchmodeFetch(path) {
  const apiKey = getApiKey();
  const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}apiKey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Watchmode API error ${res.status}: ${path}`);
  }
  return res.json();
}

async function fetchTitlesByMood(moodId) {
  const genres = MOOD_GENRES[moodId];
  if (!genres) throw new Error(`Unknown moodId: ${moodId}`);

  const genreParam = genres.join(',');
  const data = await watchmodeFetch(
    `/list-titles/?types=movie,tv_series&genres=${genreParam}&limit=${WATCHMODE_CANDIDATE_LIMIT}&regions=US&sort_by=popularity_desc`
  );

  return data.titles || [];
}

async function fetchTitleDetails(watchmodeId) {
  const cachedDetail = detailCache.get(watchmodeId);
  if (cachedDetail && cachedDetail.expiresAt > Date.now()) {
    return cachedDetail.data;
  }

  const detail = await watchmodeFetch(
    `/title/${watchmodeId}/details/?append_to_response=sources&regions=US`
  );
  detailCache.set(watchmodeId, { data: detail, expiresAt: Date.now() + DETAIL_CACHE_TTL_MS });
  return detail;
}

function normalizePlatform(sources = []) {
  // Keep only US subscription/free sources (not rent/buy)
  const streaming = sources.filter(s => s.region === 'US' && (s.type === 'sub' || s.type === 'free'));
  if (streaming.length === 0) return null;
  return streaming[0].name;
}

function normalizeTitle(moodId, detail) {
  const { inferred_moods, mood_scores } = inferMoodsFromWatchmodeTitle(detail);
  const primaryMoodId = inferred_moods[0] || moodId;

  return {
    id: `wm_${detail.id}`,
    moodId: primaryMoodId,
    requestedMoodId: moodId,
    title: detail.title,
    year: detail.year,
    imageUrl: detail.poster || null,
    platform: normalizePlatform(detail.sources),
    platforms: [...new Set(
      (detail.sources || [])
        .filter(s => s.region === 'US' && (s.type === 'sub' || s.type === 'free'))
        .map(s => s.name)
    )],
    inferred_moods,
    mood_scores,
  };
}

function moodFitScore(title, moodId) {
  const moodScores = title.mood_scores || {};
  const selectedMoodScore = moodScores[moodId] || 0;
  const strongestOtherScore = Object.entries(moodScores)
    .filter(([key]) => key !== moodId)
    .reduce((max, [, score]) => Math.max(max, score), 0);
  const directMoodBonus = title.inferred_moods?.includes(moodId) ? 4 : 0;
  return selectedMoodScore * 3 + directMoodBonus - strongestOtherScore;
}

function hasGoodMoodFit(title, moodId) {
  return moodFitScore(title, moodId) >= MIN_GOOD_FIT_SCORE;
}

async function fetchStreamableTitlesFromListings(listings, moodId) {
  const streamableTitles = [];
  const seenTitleIds = new Set();

  for (let start = 0; start < listings.length; start += WATCHMODE_DETAIL_BATCH_SIZE) {
    const batch = listings.slice(start, start + WATCHMODE_DETAIL_BATCH_SIZE);
    const detailResults = await Promise.allSettled(
      batch.map(t => fetchTitleDetails(t.id))
    );

    detailResults
      .filter(r => r.status === 'fulfilled')
      .map(r => normalizeTitle(moodId, r.value))
      .filter(t => t.platform !== null)
      .forEach((title) => {
        if (seenTitleIds.has(title.id)) return;
        seenTitleIds.add(title.id);
        streamableTitles.push(title);
      });

    const goodMoodFitCount = streamableTitles.filter((title) => hasGoodMoodFit(title, moodId)).length;
    if (streamableTitles.length >= TITLES_PER_MOOD && goodMoodFitCount >= TITLES_PER_MOOD) {
      break;
    }
  }

  return streamableTitles;
}

export async function getTitlesByMood(moodId) {
  // Optional local/demo mode: skip Watchmode network calls entirely.
  if (config.disableWatchmode) {
    return [];
  }

  // Check cache
  const cached = cache.get(moodId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const listings = await fetchTitlesByMood(moodId);
    const streamableTitles = await fetchStreamableTitlesFromListings(listings, moodId);

    const titles = streamableTitles
      .map((title, index) => ({ title, index }))
      .sort((a, b) => {
        const scoreDiff = moodFitScore(b.title, moodId) - moodFitScore(a.title, moodId);
        return scoreDiff || a.index - b.index;
      })
      .map(({ title }) => title)
      .slice(0, TITLES_PER_MOOD);

    cache.set(moodId, { data: titles, expiresAt: Date.now() + CACHE_TTL_MS });
    return titles;
  } catch (error) {
    // If Watchmode fails (including rate-limit/network errors), serve stale cache when available.
    if (cached?.data) {
      return cached.data;
    }
    throw error;
  }
}
