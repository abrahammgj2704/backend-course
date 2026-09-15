import express from 'express';
import { corsPolicy } from './middleware/cors.js';
import authRoutes from './modules/auth/auth.routes.js';
import requestsRoutes from './modules/requests/requests.routes.js';
import { authenticate } from './middleware/authenticate.js';

const app = express();

app.use(corsPolicy);

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/requests', authenticate, requestsRoutes);

export default app;