import express from 'express';
import {
  createEvent,
  createImpressions,
  getEvents,
  getRecentImpressions,
} from '../controllers/mood.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/events', createEvent);
router.get('/events', getEvents);
router.post('/impressions', createImpressions);
router.get('/impressions', getRecentImpressions);

export default router;
