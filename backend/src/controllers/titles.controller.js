import { getTitlesByMood } from '../services/watchmodeService.js';

const VALID_MOODS = new Set([
  'soft', 'fried', 'drained', 'chaotic', 'lockedin',
  'overwhelmed', 'wired',
]);

export async function getTitles(req, res, next) {
  try {
    const { mood } = req.query;

    if (!mood) {
      return res.status(400).json({ message: 'mood query parameter is required' });
    }

    if (!VALID_MOODS.has(mood)) {
      return res.status(400).json({ message: `Invalid mood. Valid options: ${[...VALID_MOODS].join(', ')}` });
    }

    const titles = await getTitlesByMood(mood);
    res.json({ titles });
  } catch (err) {
    next(err);
  }
}
