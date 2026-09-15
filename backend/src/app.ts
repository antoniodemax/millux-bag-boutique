import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

const app: Application = express();

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / non-browser requests (no Origin header) and the configured frontend(s)
    // Unknown origins simply get no CORS headers (the browser blocks them); no server error.
    callback(null, !origin || allowedOrigins.includes(origin));
  },
  credentials: true
}));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register API routes
registerRoutes(app);

// 404 handler
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
