import { createHash, randomBytes } from 'node:crypto';
import { executarConsulta } from '../config/bancoDeDados.js';

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export const criarSessao = async (usuarioId) => {
  const token = randomBytes(32).toString('hex');
  await executarConsulta(
    `INSERT INTO sessoes_autenticacao (token_hash, usuario_id, expira_em)
     VALUES ($1, $2, NOW() + INTERVAL '12 hours')`,
    [hashToken(token), usuarioId]
  );
  return token;
};

export const buscarUsuarioDaSessao = async (token) => {
  const resultado = await executarConsulta(
    `SELECT u.id, u.nivel_perfil, u.clinica_id
     FROM sessoes_autenticacao s
     JOIN usuarios u ON u.id = s.usuario_id
     WHERE s.token_hash = $1 AND s.expira_em > NOW()`,
    [hashToken(token)]
  );
  return resultado.rows[0] || null;
};
