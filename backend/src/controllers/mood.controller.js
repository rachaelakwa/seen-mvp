import MoodEvent from '../models/MoodEvent.js';

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
