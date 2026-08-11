// Arquivo principal do backend. Inicializa o Express, configura as rotas e sobe o servidor.
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import rotas from './src/routes/index.js';
import { inicializarBancoDeDados, testarConexao } from './src/config/database.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const aplicativo = express();

aplicativo.use(express.json());

// Habilita o CORS para permitir requisições do frontend para a API.
aplicativo.use((requisicao, resposta, proximo) => {
  resposta.header('Access-Control-Allow-Origin', '*');
  resposta.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  resposta.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (requisicao.method === 'OPTIONS') {
    return resposta.sendStatus(204);
  }
  proximo();
});

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
    console.warn('Conexão com o banco indisponível. Servidor iniciado sem validação inicial.', erro.message);
  }

  aplicativo.listen(porta, () => {
    console.log(`Backend em execução em http://localhost:${porta}`);
  });
};

iniciarServidor();
