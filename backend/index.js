import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from parent directory's .env.local first
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Loading environment from:', path.resolve(__dirname, '../.env.local'));
const result = dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
if (result.error) {
  console.error('Error loading .env.local:', result.error);
} else {
  console.log('.env.local loaded successfully');
}

// Then load any overrides from backend's .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import stripeRoutes from './routes/stripe.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON payloads
app.use(express.json());

// Routes
app.use('/api', stripeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment variables status:');
  console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? `exists (${process.env.STRIPE_SECRET_KEY.slice(0, 7)}...)` : 'missing');
  console.log('- VITE_STRIPE_PUBLIC_KEY:', process.env.VITE_STRIPE_PUBLIC_KEY ? `exists (${process.env.VITE_STRIPE_PUBLIC_KEY.slice(0, 7)}...)` : 'missing');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
});
