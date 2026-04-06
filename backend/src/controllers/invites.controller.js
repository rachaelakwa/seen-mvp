import crypto from 'crypto';
import InviteLink from '../models/InviteLink.js';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
import { config } from '../config/env.js';
import { buildPairKey, toUserPreview } from '../utils/friends.js';

function isLinkUsable(link) {
  if (!link || link.status !== 'active') return false;
  if (link.expiresAt && link.expiresAt <= new Date()) return false;
  if (link.maxUses && link.useCount >= link.maxUses) return false;
  return true;
}

async function generateUniqueToken() {
  for (let i = 0; i < 5; i += 1) {
    const token = crypto.randomBytes(24).toString('base64url');
    const exists = await InviteLink.exists({ token });
    if (!exists) return token;
  }
  throw new Error('Failed to generate unique invite token');
}

async function createLinkForUser(userId) {
  await InviteLink.updateMany(
    { createdByUserId: userId, status: 'active' },
    { $set: { status: 'disabled' } }
  );

  const token = await generateUniqueToken();
  const invite = new InviteLink({
    createdByUserId: userId,
    token,
    status: 'active',
  });
  await invite.save();
  return invite;
}

function toInviteResponse(invite) {
  return {
    id: String(invite._id),
    token: invite.token,
    status: invite.status,
    useCount: invite.useCount,
    maxUses: invite.maxUses,
    expiresAt: invite.expiresAt,
    createdAt: invite.createdAt,
    shareUrl: `${config.clientOrigin}/invite/${invite.token}`,
  };
}

export async function createInviteLink(req, res, next) {
  try {
    const invite = await createLinkForUser(req.user.id);
    res.status(201).json({ invite: toInviteResponse(invite) });
  } catch (error) {
    next(error);
  }
}

export async function getMyInviteLink(req, res, next) {
  try {
    let invite = await InviteLink.findOne({
      createdByUserId: req.user.id,
      status: 'active',
    }).sort({ createdAt: -1 });

    if (!isLinkUsable(invite)) {
      invite = await createLinkForUser(req.user.id);
    }

    res.json({ invite: toInviteResponse(invite) });
  } catch (error) {
    next(error);
  }
}

export async function getInviteByToken(req, res, next) {
  try {
    const invite = await InviteLink.findOne({ token: req.params.token })
      .populate('createdByUserId', 'email username firstName lastName');

    if (!invite) {
      return res.status(404).json({ message: 'Invite link not found' });
    }

    const usable = isLinkUsable(invite);
    res.json({
      invite: {
        ...toInviteResponse(invite),
        usable,
        inviter: toUserPreview(invite.createdByUserId),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function useInviteLink(req, res, next) {
  try {
    const token = req.params.token;
    const currentUserId = req.user.id;
    const invite = await InviteLink.findOne({ token });

    if (!invite) {
      return res.status(404).json({ message: 'Invite link not found' });
    }

    if (!isLinkUsable(invite)) {
      return res.status(400).json({ message: 'Invite link is no longer active' });
    }

    if (String(invite.createdByUserId) === String(currentUserId)) {
      return res.status(400).json({ message: 'You cannot use your own invite link' });
    }

    const pairKey = buildPairKey(currentUserId, invite.createdByUserId);
    let friendRequest = await FriendRequest.findOne({ pairKey });

    if (friendRequest?.status === 'accepted') {
      return res.json({
        request: friendRequest,
        message: 'You are already connected in circles',
        alreadyConnected: true,
      });
    }

    if (!friendRequest) {
      friendRequest = new FriendRequest({
        fromUserId: currentUserId,
        toUserId: invite.createdByUserId,
        inviteLinkId: invite._id,
        status: 'pending',
      });
    } else {
      friendRequest.fromUserId = currentUserId;
      friendRequest.toUserId = invite.createdByUserId;
      friendRequest.inviteLinkId = invite._id;
      friendRequest.status = 'pending';
      friendRequest.respondedAt = null;
    }

    await friendRequest.save();

    invite.useCount += 1;
    if (invite.maxUses && invite.useCount >= invite.maxUses) {
      invite.status = 'disabled';
    }
    await invite.save();

    const inviter = await User.findById(invite.createdByUserId).select('email username firstName lastName');
    res.status(201).json({
      request: friendRequest,
      inviter: toUserPreview(inviter),
      message: 'Request sent. They can accept from their invite inbox.',
    });
  } catch (error) {
    next(error);
  }
}
