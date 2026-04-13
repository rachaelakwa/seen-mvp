import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
import { buildPairKey, toUserPreview } from '../utils/friends.js';

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

export async function discoverUsers(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const search = String(req.query.search || '').trim();
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);

    const query = {
      _id: { $ne: currentUserId },
    };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$or = [
        { email: searchRegex },
        { username: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
      ];
    }

    const users = await User.find(query)
      .select('email username firstName lastName')
      .sort({ firstName: 1, username: 1, email: 1 })
      .limit(limit);

    const pairKeys = users.map((user) => buildPairKey(currentUserId, user._id));
    const requests = await FriendRequest.find({ pairKey: { $in: pairKeys } });
    const requestByPairKey = new Map(requests.map((request) => [request.pairKey, request]));

    res.json({
      users: users.map((user) => {
        const request = requestByPairKey.get(buildPairKey(currentUserId, user._id));
        return {
          ...toUserPreview(user),
          friendshipStatus: request?.status || 'none',
          requestId: request ? String(request._id) : null,
          requestDirection: request
            ? (String(request.fromUserId) === String(currentUserId) ? 'sent' : 'incoming')
            : null,
        };
      }),
    });
  } catch (error) {
    next(error);
  }
}

export async function sendRequest(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId required' });
    }

    if (String(userId) === String(currentUserId)) {
      return res.status(400).json({ message: 'You cannot add yourself' });
    }

    const targetUser = await User.findById(userId).select('email username firstName lastName');
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pairKey = buildPairKey(currentUserId, userId);
    let request = await FriendRequest.findOne({ pairKey });

    if (request?.status === 'accepted') {
      return res.status(409).json({
        request,
        user: toUserPreview(targetUser),
        message: 'You are already friends',
      });
    }

    if (!request) {
      request = new FriendRequest({
        fromUserId: currentUserId,
        toUserId: userId,
        status: 'pending',
      });
    } else {
      request.fromUserId = currentUserId;
      request.toUserId = userId;
      request.status = 'pending';
      request.respondedAt = null;
      request.inviteLinkId = null;
    }

    await request.save();

    res.status(201).json({
      request,
      user: toUserPreview(targetUser),
      message: 'Friend request sent',
    });
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
