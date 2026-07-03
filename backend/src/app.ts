import 'express-async-errors'; // must be imported before routes
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import assessmentRoutes from './routes/assessment.routes';
import recommendTrackRoutes from './routes/recommendTrack.routes';
import selectTrackRoutes from './routes/selectTrack.routes';
import learningTracksRoutes from './routes/learningTracks.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim());

  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  // ---- Expected APIs -------------------------------------------------
  app.use('/assessment', assessmentRoutes);
  app.use('/recommend-track', recommendTrackRoutes);
  app.use('/select-track', selectTrackRoutes);
  app.use('/learning-tracks', learningTracksRoutes);
  // ----------------------------------------------------------------------

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
