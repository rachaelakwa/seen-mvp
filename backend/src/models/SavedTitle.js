import mongoose from 'mongoose';

const savedTitleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  titleId: {
    type: String,
    required: true,
  },
  moodId: {
    type: String,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate saves: unique compound index
savedTitleSchema.index({ userId: 1, titleId: 1 }, { unique: true });

export default mongoose.model('SavedTitle', savedTitleSchema);
