import MoodEvent from '../models/MoodEvent.js';
import RecommendationImpression from '../models/RecommendationImpression.js';

export async function createEvent(req, res, next) {
  try {
    const { moodId, pickCount } = req.body;

    if (!moodId || pickCount === undefined) {
      return res.status(400).json({ message: 'moodId and pickCount required' });
    }

    const event = new MoodEvent({
      userId: req.user.id,
      moodId,
      pickCount,
    });

    await event.save();

    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
}

export async function getEvents(req, res, next) {
  try {
    const events = await MoodEvent.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ events });
  } catch (error) {
    next(error);
  }
}

export async function createImpressions(req, res, next) {
  try {
    const { moodId, titleIds } = req.body;

    if (!moodId || !Array.isArray(titleIds)) {
      return res.status(400).json({ message: 'moodId and titleIds required' });
    }

    const uniqueTitleIds = [...new Set(titleIds.filter(Boolean))].slice(0, 10);
    if (!uniqueTitleIds.length) {
      return res.status(201).json({ impressions: [] });
    }

    const impressions = uniqueTitleIds.map((titleId) => ({
      userId: req.user.id,
      titleId,
      moodId,
    }));

    const savedImpressions = await RecommendationImpression.insertMany(impressions);
    res.status(201).json({ impressions: savedImpressions });
  } catch (error) {
    next(error);
  }
}

export async function getRecentImpressions(req, res, next) {
  try {
    const impressions = await RecommendationImpression.find({ userId: req.user.id })
      .sort({ shownAt: -1 })
      .limit(100);

    res.json({ impressions });
  } catch (error) {
    next(error);
  }
}
