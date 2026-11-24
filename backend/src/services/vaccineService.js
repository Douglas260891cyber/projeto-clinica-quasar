import { executarConsulta } from '../config/database.js';

export const listarVacinas = async (usuarioId) => {
  const resultado = usuarioId
    ? await executarConsulta('SELECT * FROM vacinas WHERE usuario_id = $1 OR usuario_id IS NULL ORDER BY data ASC, horario ASC', [usuarioId])
    : await executarConsulta('SELECT * FROM vacinas ORDER BY data ASC, horario ASC');
  return resultado.rows;
};

export const buscarVacinaPorId = async (id) => {
  const resultado = await executarConsulta('SELECT * FROM vacinas WHERE id = $1', [id]);
  return resultado.rows[0] || null;
};

export const criarVacina = async ({ pet, data, horario, local, veterinario, observacao, usuario_id }) => {
  const resultado = await executarConsulta(
    `INSERT INTO vacinas (pet, data, horario, local, veterinario, observacao, usuario_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [pet, data, horario || null, local, veterinario || null, observacao || null, usuario_id || null]
  );
  return resultado.rows[0];
};

export const atualizarVacinaPorId = async (id, { pet, data, horario, local, veterinario, observacao }) => {
  const resultado = await executarConsulta(
    `UPDATE vacinas SET pet = $1, data = $2, horario = $3, local = $4, veterinario = $5, observacao = $6
     WHERE id = $7 RETURNING *`,
    [pet, data, horario || null, local, veterinario || null, observacao || null, id]
  );
  return resultado.rows[0] || null;
};

export const excluirVacinaPorId = async (id) => {
  const resultado = await executarConsulta('DELETE FROM vacinas WHERE id = $1 RETURNING id', [id]);
  return resultado.rows[0] || null;
};
