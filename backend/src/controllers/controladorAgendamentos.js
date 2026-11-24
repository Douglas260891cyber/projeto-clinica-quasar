import { atualizarAgendamentoPorId, buscarAgendamentoPorId, criarAgendamento, excluirAgendamentoPorId, listarAgendamentos } from '../services/servicoAgendamentos.js';
import { executarConsulta } from '../config/bancoDeDados.js';

const tipos = ['consulta', 'vacina', 'banho', 'tosa', 'outro'];
const validar = ({ pet, tipo, data, local }) => pet && data && local && tipos.includes(tipo);

export const obterAgendamentos = async (requisicao, resposta) => {
  try { return resposta.json(await listarAgendamentos(requisicao.query.usuario_id)); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao listar agendamentos.', erro: erro.message }); }
};
export const obterAgendamento = async (requisicao, resposta) => {
  try { const item = await buscarAgendamentoPorId(requisicao.params.id); return item ? resposta.json(item) : resposta.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao carregar agendamento.', erro: erro.message }); }
};
export const cadastrarAgendamento = async (requisicao, resposta) => {
  try {
    const usuario = requisicao.usuarioAutenticado;
    if (!usuario.clinica_id) return resposta.status(403).json({ mensagem: 'Sua conta precisa estar vinculada a uma clínica para agendar.' });
    const dados = { ...requisicao.body, usuario_id: usuario.id, clinica_id: usuario.clinica_id };
    if (dados.profissional_id) {
      const resultado = await executarConsulta("SELECT nome FROM usuarios WHERE id = $1 AND clinica_id = $2 AND tipo = 'veterinario'", [dados.profissional_id, usuario.clinica_id]);
      if (!resultado.rows[0]) return resposta.status(400).json({ mensagem: 'O veterinário selecionado não pertence à sua clínica.' });
      dados.profissional = resultado.rows[0].nome;
    }
    if (!validar(dados)) return resposta.status(400).json({ mensagem: 'Pet, tipo, data e clínica são obrigatórios.' });
    return resposta.status(201).json(await criarAgendamento(dados));
  } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao cadastrar agendamento.', erro: erro.message }); }
};
export const atualizarAgendamento = async (requisicao, resposta) => {
  try {
    const usuario = requisicao.usuarioAutenticado;
    if (!usuario.clinica_id) return resposta.status(403).json({ mensagem: 'Sua conta precisa estar vinculada a uma clínica para agendar.' });
    const dados = { ...requisicao.body, clinica_id: usuario.clinica_id };
    if (dados.profissional_id) {
      const resultado = await executarConsulta("SELECT nome FROM usuarios WHERE id = $1 AND clinica_id = $2 AND tipo = 'veterinario'", [dados.profissional_id, usuario.clinica_id]);
      if (!resultado.rows[0]) return resposta.status(400).json({ mensagem: 'O veterinário selecionado não pertence à sua clínica.' });
      dados.profissional = resultado.rows[0].nome;
    }
    if (!validar(dados)) return resposta.status(400).json({ mensagem: 'Pet, tipo, data e clínica são obrigatórios.' });
    const item = await atualizarAgendamentoPorId(requisicao.params.id, dados);
    return item ? resposta.json(item) : resposta.status(404).json({ mensagem: 'Agendamento não encontrado.' });
  } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao atualizar agendamento.', erro: erro.message }); }
};
export const excluirAgendamento = async (requisicao, resposta) => {
  try { const item = await excluirAgendamentoPorId(requisicao.params.id); return item ? resposta.sendStatus(204) : resposta.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao excluir agendamento.', erro: erro.message }); }
};
