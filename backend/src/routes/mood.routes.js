import express from 'express';
import { createEvent, getEvents } from '../controllers/mood.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/events', createEvent);
router.get('/events', getEvents);

export default router;
