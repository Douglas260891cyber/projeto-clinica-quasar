import { query, initDatabase } from './src/config/database.js';

await initDatabase();
const res = await query('INSERT INTO users (name, email, cpf, date_of_birth, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, cpf, date_of_birth', ['Teste', 'teste4@example.com', '555.666.777-88', '2000-04-04', 'hash']);
console.log(JSON.stringify(res.rows[0]));
const check = await query('SELECT * FROM users WHERE email = $1', ['teste4@example.com']);
console.log(JSON.stringify(check.rows));
