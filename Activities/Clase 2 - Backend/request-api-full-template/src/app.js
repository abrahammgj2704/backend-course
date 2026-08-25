// Application setup: middlewares and route mounting. It does not open any port.
import express from 'express';
import requestsRoutes from './routes/requests.routes.js';

const app = express();

// Parses incoming JSON bodies into req.body.
app.use(express.json());

// Every route inside the router is served under /requests.
app.use('/requests', requestsRoutes);

// Keep errors from unknown API routes in the same JSON format.
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
	if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
		return res.status(400).json({ error: 'Invalid JSON' });
	}

	next(error);
});

export default app;
