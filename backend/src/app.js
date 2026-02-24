import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import savesRoutes from './routes/saves.routes.js';
import recsRoutes from './routes/recs.routes.js';
import moodRoutes from './routes/mood.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { config } from './config/env.js';

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/saves', savesRoutes);
app.use('/api/recs', recsRoutes);
app.use('/api/moods', moodRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;
