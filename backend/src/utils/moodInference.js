const MOOD_IDS = [
  'soft',
  'fried',
  'drained',
  'chaotic',
  'lockedin',
  'overwhelmed',
  'wired',
];

const FALLBACK_MOOD = 'soft';
const STRONG_SIGNAL_MIN_SCORE = 3;
const SECONDARY_SIGNAL_MIN_SCORE = 4;

const GENRE_MOOD_MAP = {
  Comedy: ['fried', 'soft', 'chaotic'],
  Romance: ['soft', 'overwhelmed'],
  Drama: ['lockedin', 'overwhelmed', 'drained'],
  Thriller: ['wired', 'lockedin', 'chaotic'],
  Horror: ['wired', 'chaotic'],
  Action: ['wired', 'chaotic'],
  Adventure: ['wired', 'soft'],
  Family: ['soft', 'fried', 'drained'],
  Animation: ['soft', 'fried', 'drained'],
  Documentary: ['lockedin', 'drained'],
  Crime: ['lockedin', 'wired'],
  Mystery: ['lockedin', 'chaotic'],
  Biography: ['lockedin', 'overwhelmed'],
  'Sci-Fi': ['lockedin', 'wired', 'chaotic'],
  'Science Fiction': ['lockedin', 'wired', 'chaotic'],
};

const KEYWORD_BOOSTS = {
  soft: ['heartwarming', 'gentle', 'feel-good', 'friendship', 'warm', 'tender', 'cozy', 'sincere', 'healing', 'hopeful'],
  fried: ['easy', 'light', 'funny', 'simple', 'comfort', 'playful', 'silly', 'low stakes', 'familiar', 'hangout'],
  drained: ['quiet', 'slow', 'calm', 'easygoing', 'minimal', 'soothing', 'peaceful', 'restful', 'slice of life'],
  chaotic: ['wild', 'absurd', 'chaotic', 'unpredictable', 'messy', 'surreal', 'bizarre', 'frenetic', 'madcap'],
  lockedin: ['complex', 'thoughtful', 'moral', 'layered', 'psychological', 'investigation', 'mystery', 'puzzle', 'strategic', 'conspiracy'],
  overwhelmed: ['emotional', 'grief', 'loss', 'heartbreak', 'pain', 'love', 'cathartic', 'moving', 'family drama', 'healing'],
  wired: ['intense', 'thrilling', 'high stakes', 'tense', 'danger', 'adrenaline', 'fast-paced', 'chase', 'survival', 'violent'],
};

function createEmptyScores() {
  return MOOD_IDS.reduce((acc, moodId) => {
    acc[moodId] = 0;
    return acc;
  }, {});
}

function asLowerText(value) {
  if (typeof value !== 'string') return '';
  return value.toLowerCase();
}

function addKeywordBoosts(text, scores, weight) {
  if (!text) return;
  Object.entries(KEYWORD_BOOSTS).forEach(([moodId, keywords]) => {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        scores[moodId] += weight;
      }
    });
  });
}

function addGenreBoosts(genreNames, scores) {
  const orderedBoosts = [3, 2, 1];
  genreNames.forEach((genre) => {
    const mappedMoods = GENRE_MOOD_MAP[genre];
    if (!mappedMoods) return;

    mappedMoods.forEach((moodId, index) => {
      const boost = orderedBoosts[index];
      if (!boost) return;
      scores[moodId] += boost;
    });
  });
}

/**
 * Rule-based mood inference for a Watchmode title.
 * Simple and editable for capstone use:
 * - genres provide the base signal
 * - plot_overview provides extra context
 * - will_you_like_this is weighted more heavily
 */
export function inferMoodsFromWatchmodeTitle(title = {}) {
  const scores = createEmptyScores();

  // Safely handle genre_names being undefined or non-array.
  const genreNames = Array.isArray(title.genre_names) ? title.genre_names : [];
  addGenreBoosts(genreNames, scores);

  const plotOverviewText = asLowerText(title.plot_overview);
  const willYouLikeText = asLowerText(title.will_you_like_this);

  // Secondary text signal (+1 per keyword hit).
  addKeywordBoosts(plotOverviewText, scores, 1);
  // Stronger text signal (+2 per keyword hit).
  addKeywordBoosts(willYouLikeText, scores, 2);

  const positiveScores = Object.entries(scores).filter(([, score]) => score > 0);
  positiveScores.sort((a, b) => b[1] - a[1]);

  const topMood = positiveScores[0];
  const secondMood = positiveScores[1];

  const hasStrongSignal = topMood && topMood[1] >= STRONG_SIGNAL_MIN_SCORE;
  if (!hasStrongSignal) {
    return {
      inferred_moods: [FALLBACK_MOOD],
      mood_scores: { [FALLBACK_MOOD]: 1 },
    };
  }

  // Keep secondary moods rare so one title does not flood multiple mood pools.
  const inferredMoods = [topMood[0]];
  if (secondMood && topMood[1] === secondMood[1] && secondMood[1] >= SECONDARY_SIGNAL_MIN_SCORE) {
    inferredMoods.push(secondMood[0]);
  }

  const moodScores = Object.fromEntries(positiveScores);
  return {
    inferred_moods: inferredMoods,
    mood_scores: moodScores,
  };
}

export default { inferMoodsFromWatchmodeTitle };
