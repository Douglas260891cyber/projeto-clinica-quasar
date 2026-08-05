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
export const query = async (text, params = []) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Erro ao executar query:', error.message);
    throw error;
  }
};

// Inicializar o banco de dados e criar as tabelas se não existirem
export const initDatabase = async () => {
  try {
    // Criar tabela de usuários se não existir
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        date_of_birth DATE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Criar tabela de pets se não existir
    await query(`
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        species VARCHAR(100) NOT NULL,
        age INTEGER,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tabelas do banco de dados criadas/verificadas com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error.message);
    throw error;
  }
};

// Testar a conexão com o banco de dados
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error.message);
    throw error;
  }
};

export default pool;
