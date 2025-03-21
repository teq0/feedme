import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import { AppDataSource } from './config/data-source';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { setupAuth } from './config/auth';
import { logger } from './utils/logger';
import { apiRoutes } from './routes';

// Initialize express app
const app = express();
const port = config.server.port;
const apiPrefix = config.server.apiPrefix;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Setup authentication
setupAuth(app);

// API routes
app.use(apiPrefix, apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Start listening
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`API available at http://localhost:${port}${apiPrefix}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

export default app;