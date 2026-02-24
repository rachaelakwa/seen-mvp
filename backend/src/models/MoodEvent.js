import mongoose from 'mongoose';

const moodEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  moodId: {
    type: String,
    required: true,
  },
  pickCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MoodEvent', moodEventSchema);
