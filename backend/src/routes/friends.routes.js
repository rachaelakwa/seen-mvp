import express from 'express';
import {
  acceptRequest,
  declineRequest,
  discoverUsers,
  getFriends,
  getIncomingRequests,
  getSentRequests,
  sendRequest,
} from '../controllers/friends.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/discover', discoverUsers);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/sent', getSentRequests);
router.post('/requests', sendRequest);
router.post('/requests/:id/accept', acceptRequest);
router.post('/requests/:id/decline', declineRequest);
router.get('/', getFriends);

export default router;
