// Arquivo principal do backend. Inicializa o Express, configura as rotas e sobe o servidor.
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { initDatabase, testConnection } from './src/config/database.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const app = express();

app.use(express.json());

// Habilita o CORS para permitir requisições do frontend para a API.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Registra as rotas da API sob o prefixo /api.
app.use('/api', routes);

// Retorna um status simples para confirmar que o serviço está ativo.
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'pet-market-api'
  });
});

const port = process.env.PORT || 3000;

// Inicia o servidor e tenta validar a conexão com o banco antes de aceitar requisições.
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
