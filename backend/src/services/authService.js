// Serviço responsável pela lógica de autenticação e persistência de usuários.
import bcrypt from 'bcrypt';
import { executarConsulta } from '../config/database.js';

// Cria um novo usuário com senha criptografada no banco.
export const criarUsuario = async ({ nome, email, senha, cpf, data_nascimento }) => {
  const senhaHash = await bcrypt.hash(senha, 10);

  const resultado = await executarConsulta(
    'INSERT INTO usuarios (nome, email, cpf, data_nascimento, senha_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, cpf, data_nascimento',
    [nome, email, cpf, data_nascimento, senhaHash]
  );

  return resultado.rows[0];
};

// Busca um usuário pelo e-mail para validar login ou duplicidade.
export const buscarUsuarioPorEmail = async (email) => {
  const resultado = await executarConsulta('SELECT * FROM usuarios WHERE email = $1', [email]);
  return resultado.rows[0] || null;
};

// Compara a senha informada com o hash salvo no banco.
export const verificarSenha = async (senha, senhaHash) => {
  return bcrypt.compare(senha, senhaHash);
};
