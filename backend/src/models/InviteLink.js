import mongoose from 'mongoose';

const inviteLinkSchema = new mongoose.Schema({
  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'disabled', 'expired'],
    default: 'active',
    index: true,
  },
  maxUses: {
    type: Number,
    default: null,
  },
  useCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('InviteLink', inviteLinkSchema);
