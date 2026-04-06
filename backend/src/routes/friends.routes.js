import express from 'express';
import {
  acceptRequest,
  declineRequest,
  getFriends,
  getIncomingRequests,
  getSentRequests,
} from '../controllers/friends.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getFriends);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/sent', getSentRequests);
router.post('/requests/:id/accept', acceptRequest);
router.post('/requests/:id/decline', declineRequest);

export default router;
