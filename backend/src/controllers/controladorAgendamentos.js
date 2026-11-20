import { atualizarAgendamentoPorId, buscarAgendamentoPorId, criarAgendamento, excluirAgendamentoPorId, listarAgendamentos } from '../services/servicoAgendamentos.js';

const tipos = ['consulta', 'vacina', 'banho', 'tosa', 'outro'];
const validar = ({ pet, tipo, data, local }) => pet && data && local && tipos.includes(tipo);

export const obterAgendamentos = async (requisicao, resposta) => {
  try { return resposta.json(await listarAgendamentos(requisicao.query.usuario_id)); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao listar agendamentos.', erro: erro.message }); }
};
export const obterAgendamento = async (requisicao, resposta) => {
  try { const item = await buscarAgendamentoPorId(requisicao.params.id); return item ? resposta.json(item) : resposta.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao carregar agendamento.', erro: erro.message }); }
};
export const cadastrarAgendamento = async (requisicao, resposta) => {
  try { if (!validar(requisicao.body)) return resposta.status(400).json({ mensagem: 'Pet, tipo, data e local são obrigatórios.' }); return resposta.status(201).json(await criarAgendamento(requisicao.body)); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao cadastrar agendamento.', erro: erro.message }); }
};
export const atualizarAgendamento = async (requisicao, resposta) => {
  try { if (!validar(requisicao.body)) return resposta.status(400).json({ mensagem: 'Pet, tipo, data e local são obrigatórios.' }); const item = await atualizarAgendamentoPorId(requisicao.params.id, requisicao.body); return item ? resposta.json(item) : resposta.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao atualizar agendamento.', erro: erro.message }); }
};
export const excluirAgendamento = async (requisicao, resposta) => {
  try { const item = await excluirAgendamentoPorId(requisicao.params.id); return item ? resposta.sendStatus(204) : resposta.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao excluir agendamento.', erro: erro.message }); }
};
