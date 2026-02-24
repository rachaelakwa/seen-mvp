import Recommendation from '../models/Recommendation.js';

export async function createRec(req, res, next) {
  try {
    const { receiverId, titleId, moodId, note } = req.body;

    if (!receiverId || !titleId) {
      return res.status(400).json({ message: 'receiverId and titleId required' });
    }

    const rec = new Recommendation({
      senderId: req.user.id,
      receiverId,
      titleId,
      moodId,
      note,
    });

    await rec.save();

    res.status(201).json({ rec });
  } catch (error) {
    next(error);
  }
}

export async function getInbox(req, res, next) {
  try {
    const recs = await Recommendation.find({ receiverId: req.user.id })
      .populate('senderId', 'email')
      .sort({ createdAt: -1 });

    res.json({ recs });
  } catch (error) {
    next(error);
  }
}

export async function getSent(req, res, next) {
  try {
    const recs = await Recommendation.find({ senderId: req.user.id })
      .populate('receiverId', 'email')
      .sort({ createdAt: -1 });

    res.json({ recs });
  } catch (error) {
    next(error);
  }
}
