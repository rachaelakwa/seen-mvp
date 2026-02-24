/**
 * Get picks filtered by mood and limited by count
 * @param {Object} options
 * @param {string} options.moodId - The mood ID to filter by
 * @param {Array} options.picks - All available picks
 * @param {number} options.count - Number of picks to return (default 3)
 * @returns {Array} Filtered picks (deterministic ordering)
 */
export function getPicksForMood({ moodId, picks, count = 3 }) {
  if (!moodId) {
    return picks.slice(0, count);
  }

  const filtered = picks.filter(pick => pick.moodId === moodId);
  return filtered.slice(0, count);
}

export default { getPicksForMood };
