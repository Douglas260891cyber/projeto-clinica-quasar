import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // conectar ao banco padrão primeiro
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});

async function testConnection() {
    try {
        console.log('Tentando conectar ao PostgreSQL...');
        console.log('Host:', process.env.DB_HOST);
        console.log('Port:', process.env.DB_PORT);
        console.log('User:', process.env.DB_USER);

        const result = await pool.query('SELECT NOW()');
        console.log('✓ Conexão bem-sucedida!');
        console.log('Servidor PostgreSQL:', result.rows[0]);

        // Tentar criar database
        console.log('\nTentando criar database petmarket...');
        await pool.query('CREATE DATABASE petmarket;').catch(() => console.log('Database já existe'));

        // Conectar ao banco petmarket
        await pool.end();

        const pool2 = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Conectando ao banco petmarket...');
        const test = await pool2.query('SELECT NOW()');
        console.log('✓ Conectado ao petmarket com sucesso!');

        await pool2.end();
    } catch (error) {
        console.error('✗ Erro na conexão:', error.message);
        process.exit(1);
    }
}

testConnection();
