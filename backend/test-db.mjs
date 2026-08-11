import { executarConsulta, inicializarBancoDeDados } from './src/config/database.js';

await inicializarBancoDeDados();
const resultado = await executarConsulta('INSERT INTO usuarios (nome, email, cpf, data_nascimento, senha_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, cpf, data_nascimento', ['Teste', 'teste4@example.com', '555.666.777-88', '2000-04-04', 'hash']);
console.log(JSON.stringify(resultado.rows[0]));
const verificacao = await executarConsulta('SELECT * FROM usuarios WHERE email = $1', ['teste4@example.com']);
console.log(JSON.stringify(verificacao.rows));
