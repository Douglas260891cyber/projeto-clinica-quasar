import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const { Pool } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

// Configurar a conexão com PostgreSQL usando variáveis de ambiente
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'petmarket',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Função para executar queries no PostgreSQL
export const executarConsulta = async (texto, parametros = []) => {
  try {
    const resultado = await pool.query(texto, parametros);
    return resultado;
  } catch (erro) {
    console.error('Erro ao executar consulta:', erro.message);
    throw erro;
  }
};

// Inicializar o banco de dados e criar as tabelas se não existirem
export const inicializarBancoDeDados = async () => {
  try {
    // Atualiza instalações criadas com a nomenclatura anterior em inglês.
    await executarConsulta(`
      DO $$
      BEGIN
        IF to_regclass('public.users') IS NOT NULL AND to_regclass('public.usuarios') IS NULL THEN
          ALTER TABLE users RENAME TO usuarios;
        END IF;
        IF to_regclass('public.pets') IS NOT NULL AND to_regclass('public.animais') IS NULL THEN
          ALTER TABLE pets RENAME TO animais;
        END IF;
      END $$;
    `);

    // Criar tabela de usuários se não existir
    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        data_nascimento DATE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Criar tabela de animais se não existir
    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS animais (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        especie VARCHAR(100) NOT NULL,
        idade INTEGER,
        descricao TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await executarConsulta(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'name') THEN ALTER TABLE usuarios RENAME COLUMN name TO nome; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'date_of_birth') THEN ALTER TABLE usuarios RENAME COLUMN date_of_birth TO data_nascimento; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'password_hash') THEN ALTER TABLE usuarios RENAME COLUMN password_hash TO senha_hash; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'created_at') THEN ALTER TABLE usuarios RENAME COLUMN created_at TO criado_em; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'name') THEN ALTER TABLE animais RENAME COLUMN name TO nome; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'species') THEN ALTER TABLE animais RENAME COLUMN species TO especie; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'age') THEN ALTER TABLE animais RENAME COLUMN age TO idade; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'description') THEN ALTER TABLE animais RENAME COLUMN description TO descricao; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'created_at') THEN ALTER TABLE animais RENAME COLUMN created_at TO criado_em; END IF;
      END $$;
    `);

    console.log('Tabelas do banco de dados criadas/verificadas com sucesso.');
    return true;
  } catch (erro) {
    console.error('Erro ao inicializar banco de dados:', erro.message);
    throw erro;
  }
};

// Testar a conexão com o banco de dados
export const testarConexao = async () => {
  try {
    const resultado = await executarConsulta('SELECT NOW()');
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');
    return resultado.rows[0];
  } catch (erro) {
    console.error('Erro ao conectar ao PostgreSQL:', erro.message);
    throw erro;
  }
};

export default pool;
