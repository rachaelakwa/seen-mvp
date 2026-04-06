import express from 'express';
import {
  createInviteLink,
  getInviteByToken,
  getMyInviteLink,
  useInviteLink,
} from '../controllers/invites.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/link/:token', getInviteByToken);
router.get('/link', authMiddleware, getMyInviteLink);
router.post('/link', authMiddleware, createInviteLink);
router.post('/link/:token/use', authMiddleware, useInviteLink);

export default router;
