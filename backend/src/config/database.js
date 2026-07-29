import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const { Pool } = pkg;
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'petmarket',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

export const query = (text, params) => pool.query(text, params);

export const initDatabase = async () => {
  await pool.query('SELECT NOW()');
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        species VARCHAR(100) NOT NULL,
        age INTEGER,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
};

export const testConnection = async () => {
  const result = await pool.query('SELECT NOW() AS now');
  return result.rows[0];
};

export default pool;
