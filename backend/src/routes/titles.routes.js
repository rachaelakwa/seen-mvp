import express from 'express';
import { getTitles } from '../controllers/titles.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTitles);

export default router;
