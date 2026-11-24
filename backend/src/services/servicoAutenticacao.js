// Autenticação de usuários usando os dados e hashes mantidos pelo serviço de usuários.
import { executarConsulta } from '../config/bancoDeDados.js';
import { verificarSenha } from './servicoUsuarios.js';

export const autenticarUsuario = async (email, senha) => {
  const resultado = await executarConsulta(
    `SELECT usuarios.*, clinicas.nome AS clinica_nome
     FROM usuarios LEFT JOIN clinicas ON clinicas.id = usuarios.clinica_id
     WHERE usuarios.email = $1`,
    [email]
  );
  const usuario = resultado.rows[0] || null;
  if (!usuario || !(await verificarSenha(senha, usuario.senha_hash))) return null;
  return usuario;
};
