import { executarConsulta } from '../config/bancoDeDados.js';

export const listarClinicas = async () => {
  const resultado = await executarConsulta(
    'SELECT id, nome, cidade, estado FROM clinicas ORDER BY nome ASC'
  );
  return resultado.rows;
};

export const criarClinica = async ({ nome, cnpj, email, telefone, endereco, cidade, estado }) => {
  const resultado = await executarConsulta(
    `INSERT INTO clinicas (nome, cnpj, email, telefone, endereco, cidade, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, nome, cnpj, email, telefone, endereco, cidade, estado, criado_em`,
    [nome.trim(), cnpj || null, email || null, telefone || null, endereco || null, cidade || null, estado || null]
  );
  return resultado.rows[0];
};

export const buscarClinicaComVeterinarios = async (clinicaId) => {
  const clinicaResultado = await executarConsulta(
    'SELECT id, nome, cidade, estado FROM clinicas WHERE id = $1',
    [clinicaId]
  );
  const clinica = clinicaResultado.rows[0];
  if (!clinica) return null;

  const veterinariosResultado = await executarConsulta(
    `SELECT id, nome, crmv, especialidade
     FROM usuarios
     WHERE clinica_id = $1 AND tipo = 'veterinario'
     ORDER BY nome ASC`,
    [clinicaId]
  );
  return { ...clinica, veterinarios: veterinariosResultado.rows };
};
