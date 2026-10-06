import { executarConsulta } from '../config/database.js';

const campos = ['pet', 'tipo', 'data', 'horario', 'local', 'profissional', 'observacao', 'vacina', 'motivo_consulta', 'porte', 'servico_outro'];

export const listarAgendamentos = async (usuarioId) => {
  const resultado = usuarioId
    ? await executarConsulta('SELECT * FROM agendamentos WHERE usuario_id = $1 OR usuario_id IS NULL ORDER BY data ASC, horario ASC', [usuarioId])
    : await executarConsulta('SELECT * FROM agendamentos ORDER BY data ASC, horario ASC');
  return resultado.rows;
};

export const buscarAgendamentoPorId = async (id) => {
  const resultado = await executarConsulta('SELECT * FROM agendamentos WHERE id = $1', [id]);
  return resultado.rows[0] || null;
};

function valoresDoAgendamento(dados) {
  return campos.map((campo) => dados[campo] || null);
}

export const criarAgendamento = async (dados) => {
  const resultado = await executarConsulta(
    `INSERT INTO agendamentos (${campos.join(', ')}, usuario_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [...valoresDoAgendamento(dados), dados.usuario_id || null]
  );
  return resultado.rows[0];
};

export const atualizarAgendamentoPorId = async (id, dados) => {
  const resultado = await executarConsulta(
    `UPDATE agendamentos SET ${campos.map((campo, indice) => `${campo} = $${indice + 1}`).join(', ')}
     WHERE id = $12 RETURNING *`,
    [...valoresDoAgendamento(dados), id]
  );
  return resultado.rows[0] || null;
};

export const excluirAgendamentoPorId = async (id) => {
  const resultado = await executarConsulta('DELETE FROM agendamentos WHERE id = $1 RETURNING id', [id]);
  return resultado.rows[0] || null;
};
