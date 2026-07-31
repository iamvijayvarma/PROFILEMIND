import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';

const app: Express = express();

// Security and HTTP logging middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL || '*',
    credentials: true
  })
);
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static local uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Mount API routes (supports both /api/... and direct /auth/... routes)
app.use('/api', routes);
app.use('/', routes);

// Centralized error handling
app.use(errorHandler);

export default app;
