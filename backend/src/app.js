import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import savesRoutes from './routes/saves.routes.js';
import recsRoutes from './routes/recs.routes.js';
import moodRoutes from './routes/mood.routes.js';
import titlesRoutes from './routes/titles.routes.js';
import invitesRoutes from './routes/invites.routes.js';
import friendsRoutes from './routes/friends.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { config } from './config/env.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server and local tools without Origin header.
      if (!origin) return callback(null, true);
      if (config.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/saves', savesRoutes);
app.use('/api/recs', recsRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/titles', titlesRoutes);
app.use('/api/invites', invitesRoutes);
app.use('/api/friends', friendsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;
