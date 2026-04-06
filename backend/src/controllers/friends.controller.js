import FriendRequest from '../models/FriendRequest.js';
import { toUserPreview } from '../utils/friends.js';

function toRequestResponse(request, direction = 'incoming') {
  const otherUser = direction === 'incoming' ? request.fromUserId : request.toUserId;
  return {
    id: String(request._id),
    status: request.status,
    createdAt: request.createdAt,
    respondedAt: request.respondedAt,
    inviteLinkId: request.inviteLinkId ? String(request.inviteLinkId) : null,
    user: toUserPreview(otherUser),
  };
}

export async function getFriends(req, res, next) {
  try {
    const userId = req.user.id;
    const accepted = await FriendRequest.find({
      status: 'accepted',
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .populate('fromUserId', 'email username firstName lastName')
      .populate('toUserId', 'email username firstName lastName')
      .sort({ respondedAt: -1, createdAt: -1 });

    const friends = accepted.map((request) => {
      const isSender = String(request.fromUserId?._id) === String(userId);
      const friendUser = isSender ? request.toUserId : request.fromUserId;
      const preview = toUserPreview(friendUser);
      return {
        ...preview,
        connectedAt: request.respondedAt || request.createdAt,
      };
    });

    res.json({ friends });
  } catch (error) {
    next(error);
  }
}

export async function getIncomingRequests(req, res, next) {
  try {
    const requests = await FriendRequest.find({ toUserId: req.user.id })
      .populate('fromUserId', 'email username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      requests: requests.map((request) => toRequestResponse(request, 'incoming')),
    });
  } catch (error) {
    next(error);
  }
}

export async function getSentRequests(req, res, next) {
  try {
    const requests = await FriendRequest.find({ fromUserId: req.user.id })
      .populate('toUserId', 'email username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      requests: requests.map((request) => toRequestResponse(request, 'sent')),
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptRequest(req, res, next) {
  try {
    const request = await FriendRequest.findOne({
      _id: req.params.id,
      toUserId: req.user.id,
      status: 'pending',
    });

    if (!request) {
      return res.status(404).json({ message: 'Pending request not found' });
    }

    request.status = 'accepted';
    request.respondedAt = new Date();
    await request.save();

    res.json({ request, message: 'Friend request accepted' });
  } catch (error) {
    next(error);
  }
}

export async function declineRequest(req, res, next) {
  try {
    const request = await FriendRequest.findOne({
      _id: req.params.id,
      toUserId: req.user.id,
      status: 'pending',
    });

    if (!request) {
      return res.status(404).json({ message: 'Pending request not found' });
    }

    request.status = 'declined';
    request.respondedAt = new Date();
    await request.save();

    res.json({ request, message: 'Friend request declined' });
  } catch (error) {
    next(error);
  }
}
