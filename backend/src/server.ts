import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`⚡️ ProfileMind Backend Server running on port ${PORT} [${env.NODE_ENV}]`);
  logger.info(`👉 Health check URL: http://localhost:${PORT}/health`);
  logger.info(`👉 API Base URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Graceful SIGTERM signal handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});
