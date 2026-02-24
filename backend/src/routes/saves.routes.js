import express from 'express';
import { getSaves, createSave, deleteSave } from '../controllers/saves.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSaves);
router.post('/', createSave);
router.delete('/:id', deleteSave);

export default router;
