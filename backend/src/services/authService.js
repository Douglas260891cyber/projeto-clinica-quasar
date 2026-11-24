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

// Retorna apenas dados próprios para exibição e edição no perfil.
export const buscarUsuarioPorId = async (id) => {
  const resultado = await executarConsulta(
    'SELECT id, nome, email, cpf, data_nascimento, telefone, endereco, criado_em FROM usuarios WHERE id = $1',
    [id]
  );
  return resultado.rows[0] || null;
};

export const atualizarUsuarioPorId = async (id, { nome, email, cpf, data_nascimento, telefone, endereco }) => {
  const resultado = await executarConsulta(
    `UPDATE usuarios
       SET nome = $1, email = $2, cpf = $3, data_nascimento = $4, telefone = $5, endereco = $6
     WHERE id = $7
     RETURNING id, nome, email, cpf, data_nascimento, telefone, endereco, criado_em`,
    [nome, email, cpf, data_nascimento, telefone || null, endereco || null, id]
  );
  return resultado.rows[0] || null;
};

export const atualizarSenhaUsuario = async (id, senha) => {
  const senhaHash = await bcrypt.hash(senha, 10);
  await executarConsulta('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);
};
