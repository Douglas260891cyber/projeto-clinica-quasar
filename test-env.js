import dotenv from 'dotenv';
import path from 'path';

console.log('Current directory:', process.cwd());
console.log('__dirname would be:', import.meta.url);

// Carregar .env da mesma forma que o banco faz
const envPath = path.resolve(process.cwd(), 'backend/.env');
console.log('Loading .env from:', envPath);

const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result);

console.log('\nVariáveis de ambiente carregadas:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);
console.log('DB_PASSWORD bytes:', Buffer.from(process.env.DB_PASSWORD || '').toString('hex'));
