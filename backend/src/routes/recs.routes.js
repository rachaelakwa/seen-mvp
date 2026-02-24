import express from 'express';
import { createRec, getInbox, getSent } from '../controllers/recs.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRec);
router.get('/inbox', getInbox);
router.get('/sent', getSent);

export default router;
