import mongoose from 'mongoose';
import { buildPairKey } from '../utils/friends.js';

const friendRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  pairKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  inviteLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InviteLink',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
    index: true,
  },
  respondedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

friendRequestSchema.pre('validate', function (next) {
  if (!this.fromUserId || !this.toUserId) return next();
  this.pairKey = buildPairKey(this.fromUserId, this.toUserId);
  next();
});

export default mongoose.model('FriendRequest', friendRequestSchema);
