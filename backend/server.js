import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { initDatabase, testConnection } from './src/config/database.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const app = express();

app.use(express.json());
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
