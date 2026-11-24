// Persistência e regras compartilhadas dos usuários da clínica.
import bcrypt from 'bcrypt';
import { executarConsulta } from '../config/bancoDeDados.js';
import { NivelPerfil } from '../enums/nivelPerfil.js';

export const criarUsuario = async ({ nome, email, senha, cpf, data_nascimento, telefone, endereco, tipo = 'tutor', nivel_perfil = NivelPerfil.CLIENTE, crmv = null, especialidade = null, clinica_id = null }) => {
  if (!clinica_id) {
    const erro = new Error('É obrigatório selecionar uma clínica.');
    erro.status = 400;
    throw erro;
  }
  if (clinica_id) {
    const clinica = await executarConsulta('SELECT id FROM clinicas WHERE id = $1', [clinica_id]);
    if (!clinica.rows[0]) {
      const erro = new Error('A clínica selecionada não existe.');
      erro.status = 400;
      throw erro;
    }
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  const resultado = await executarConsulta(
    `INSERT INTO usuarios (nome, email, cpf, data_nascimento, senha_hash, telefone, endereco, tipo, nivel_perfil, crmv, especialidade, clinica_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING id, nome, email, cpf, data_nascimento, telefone, endereco, tipo, nivel_perfil, crmv, especialidade, clinica_id, criado_em`,
    [nome, email, cpf, data_nascimento, senhaHash, telefone || null, endereco || null, tipo, nivel_perfil, crmv, especialidade, clinica_id]
  );
  return resultado.rows[0];
};

export const buscarUsuarioPorEmail = async (email) => {
  const resultado = await executarConsulta('SELECT * FROM usuarios WHERE email = $1', [email]);
  return resultado.rows[0] || null;
};

export const verificarSenha = (senha, senhaHash) => bcrypt.compare(senha, senhaHash);

export const buscarUsuarioPorId = async (id) => {
  const resultado = await executarConsulta(
    'SELECT id, nome, email, cpf, data_nascimento, telefone, endereco, nivel_perfil, criado_em FROM usuarios WHERE id = $1',
    [id]
  );
  return resultado.rows[0] || null;
};

export const atualizarUsuarioPorId = async (id, { nome, email, cpf, data_nascimento, telefone, endereco }) => {
  const resultado = await executarConsulta(
    `UPDATE usuarios
       SET nome = $1, email = $2, cpf = $3, data_nascimento = $4, telefone = $5, endereco = $6
     WHERE id = $7
     RETURNING id, nome, email, cpf, data_nascimento, telefone, endereco, nivel_perfil, criado_em`,
    [nome, email, cpf, data_nascimento, telefone || null, endereco || null, id]
  );
  return resultado.rows[0] || null;
};

export const atualizarSenhaUsuario = async (id, senha) => {
  const senhaHash = await bcrypt.hash(senha, 10);
  await executarConsulta('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);
};
