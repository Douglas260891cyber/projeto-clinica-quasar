// Regras e persistência específicas do cadastro de veterinários.
import { criarUsuario, buscarUsuarioPorEmail } from './servicoUsuarios.js';
import { executarConsulta } from '../config/bancoDeDados.js';
import { NivelPerfil } from '../enums/nivelPerfil.js';

export const cadastrarVeterinario = async (dados) => {
  if (await buscarUsuarioPorEmail(dados.email)) {
    const erro = new Error('Já existe um usuário com este e-mail.');
    erro.status = 409;
    throw erro;
  }

  const consulta = await executarConsulta('SELECT id FROM usuarios WHERE LOWER(crmv) = LOWER($1)', [dados.crmv]);
  if (consulta.rows[0]) {
    const erro = new Error('Já existe um veterinário com este CRMV.');
    erro.status = 409;
    throw erro;
  }

  return criarUsuario({ ...dados, tipo: 'veterinario', nivel_perfil: NivelPerfil.PROFISSIONAL, crmv: dados.crmv.trim() });
};
