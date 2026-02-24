import SavedTitle from '../models/SavedTitle.js';

export async function getSaves(req, res, next) {
  try {
    const saves = await SavedTitle.find({ userId: req.user.id }).sort({
      savedAt: -1,
    });

    res.json({ saves });
  } catch (error) {
    next(error);
  }
}

export async function createSave(req, res, next) {
  try {
    const { titleId, moodId } = req.body;

    if (!titleId) {
      return res.status(400).json({ message: 'titleId required' });
    }

    // Check if already saved
    const existing = await SavedTitle.findOne({
      userId: req.user.id,
      titleId,
    });

    if (existing) {
      return res.status(409).json({ message: 'Already saved', save: existing });
    }

    const save = new SavedTitle({
      userId: req.user.id,
      titleId,
      moodId,
    });

    await save.save();

    res.status(201).json({ save });
  } catch (error) {
    next(error);
  }
}

export async function deleteSave(req, res, next) {
  try {
    const { id } = req.params;

    const save = await SavedTitle.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!save) {
      return res.status(404).json({ message: 'Save not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
}
