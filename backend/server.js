import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { initDatabase, testConnection } from './src/config/database.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'pet-market-api'
  });
});

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initDatabase();
    await testConnection();
    console.log('Database connection successful.');
  } catch (error) {
    console.warn('Database connection unavailable. Starting server without initial DB validation.', error.message);
  }

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
};

startServer();
