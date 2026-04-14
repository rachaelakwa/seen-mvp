import mongoose from 'mongoose';

const recommendationImpressionSchema = new mongoose.Schema({
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
    required: true,
  },
  shownAt: {
    type: Date,
    default: Date.now,
  },
});

recommendationImpressionSchema.index({ userId: 1, moodId: 1, shownAt: -1 });
recommendationImpressionSchema.index({ userId: 1, titleId: 1, shownAt: -1 });

export default mongoose.model('RecommendationImpression', recommendationImpressionSchema);
