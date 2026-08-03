import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import orgRoutes from './routes/org.routes';

const app: Express = express();

// Middleware config
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
// Global Error Handler (must be after routes)
app.use(errorHandler);

export default app;
