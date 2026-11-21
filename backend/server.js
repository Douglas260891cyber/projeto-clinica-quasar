
// Arquivo principal do backend. Inicializa o Express, configura as rotas e sobe o servidor.
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import rotas from './src/routes/index.js';
import { inicializarBancoDeDados, testarConexao } from './src/config/bancoDeDados.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const aplicativo = express();

// Lista de origens permitidas.
const origensPermitidas = (process.env.FRONTEND_URL || 'https://projeto-clinica-quasar-frontend.vercel.app,http://localhost:9000')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

const configuracaoCors = {
  origin: (origem, callback) => {
    // Aceita o domínio principal e as URLs de preview do Vercel.
    const dominioVercelPermitido =
      /^https:\/\/projeto-clinica-quasar-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origem || '');

    if (
      !origem ||
      origensPermitidas.includes(origem) ||
      dominioVercelPermitido
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origem não permitida pelo CORS: ${origem}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Trata as requisições antes de encaminhá-las às rotas.
aplicativo.use(cors(configuracaoCors));
aplicativo.options('*', cors(configuracaoCors));
aplicativo.use(express.json());

// Registra as rotas da API sob o prefixo /api.
aplicativo.use('/api', rotas);

// Retorna um status simples para confirmar que o serviço está ativo.
aplicativo.get('/saude', (_requisicao, resposta) => {
  resposta.json({
    status: 'ok',
    servico: 'api-clinica-pet'
  });
});

const porta = process.env.PORT || 3000;

// Inicia o servidor e tenta validar a conexão com o banco antes de aceitar requisições.
const iniciarServidor = async () => {
  try {
    await inicializarBancoDeDados();
    await testarConexao();
    console.log('Conexão com o banco de dados estabelecida.');
  } catch (erro) {
    console.warn(
      'Conexão com o banco indisponível. Servidor iniciado sem validação inicial.',
      erro.message
    );
  }

  aplicativo.listen(porta, () => {
    console.log(`Backend em execução na porta ${porta}`);
  });
};

iniciarServidor();
