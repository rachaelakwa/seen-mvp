function hashString(value = '') {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) % 2147483647;
  }
  return Math.abs(hash);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function rotatePicks(picks, key) {
  if (picks.length <= 1) return picks;
  const start = hashString(key) % picks.length;
  return [...picks.slice(start), ...picks.slice(0, start)];
}

function prioritizeFreshPicks(picks, savedIds = new Set(), seenTitleIds = new Set()) {
  if (!savedIds.size && !seenTitleIds.size) return picks;

  return [...picks].sort((a, b) => {
    const aSaved = savedIds.has(a.id) ? 1 : 0;
    const bSaved = savedIds.has(b.id) ? 1 : 0;
    const aSeen = seenTitleIds.has(a.id) ? 1 : 0;
    const bSeen = seenTitleIds.has(b.id) ? 1 : 0;
    return (aSaved + aSeen) - (bSaved + bSeen);
  });
}

export function getPicksForMood({
  moodId,
  picks,
  count = 3,
  savedIds = new Set(),
  seenTitleIds = new Set(),
  rotationKey = todayKey(),
}) {
  if (!moodId) {
    return prioritizeFreshPicks(rotatePicks(picks, rotationKey), savedIds, seenTitleIds).slice(0, count);
  }

  const filtered = picks.filter((pick) => {
    // Backward-compatible filtering:
    // - static picks use moodId
    // - Watchmode picks can include inferred_moods
    if (pick.moodId === moodId) return true;
    if (Array.isArray(pick.inferred_moods)) {
      return pick.inferred_moods.includes(moodId);
    }
    return false;
  });
  const fallbackPicks = picks.filter((pick) => !filtered.includes(pick));
  const primaryMoodPicks = filtered.filter((pick) => pick.moodId === moodId);
  const secondaryMoodPicks = filtered.filter((pick) => pick.moodId !== moodId);
  const rotated = [
    ...rotatePicks(primaryMoodPicks, `${rotationKey}:primary`),
    ...rotatePicks(secondaryMoodPicks, `${rotationKey}:secondary`),
    ...rotatePicks(fallbackPicks, `${rotationKey}:fallback`),
  ];
  return prioritizeFreshPicks(rotated, savedIds, seenTitleIds).slice(0, count);
}

export default { getPicksForMood };
