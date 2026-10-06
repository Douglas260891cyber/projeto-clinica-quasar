import { atualizarAgendamentoPorId, buscarAgendamentoPorId, criarAgendamento, excluirAgendamentoPorId, listarAgendamentos } from '../services/appointmentService.js';

const tipos = ['consulta', 'vacina', 'banho', 'tosa', 'outro'];
const validar = ({ pet, tipo, data, local }) => pet && data && local && tipos.includes(tipo);

export const obterAgendamentos = async (req, res) => {
  try { return res.json(await listarAgendamentos(req.query.usuario_id)); } catch (erro) { return res.status(500).json({ mensagem: 'Erro ao listar agendamentos.', erro: erro.message }); }
};
export const obterAgendamento = async (req, res) => {
  try { const item = await buscarAgendamentoPorId(req.params.id); return item ? res.json(item) : res.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return res.status(500).json({ mensagem: 'Erro ao carregar agendamento.', erro: erro.message }); }
};
export const cadastrarAgendamento = async (req, res) => {
  try { if (!validar(req.body)) return res.status(400).json({ mensagem: 'Pet, tipo, data e local são obrigatórios.' }); return res.status(201).json(await criarAgendamento(req.body)); } catch (erro) { return res.status(500).json({ mensagem: 'Erro ao cadastrar agendamento.', erro: erro.message }); }
};
export const atualizarAgendamento = async (req, res) => {
  try { if (!validar(req.body)) return res.status(400).json({ mensagem: 'Pet, tipo, data e local são obrigatórios.' }); const item = await atualizarAgendamentoPorId(req.params.id, req.body); return item ? res.json(item) : res.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return res.status(500).json({ mensagem: 'Erro ao atualizar agendamento.', erro: erro.message }); }
};
export const excluirAgendamento = async (req, res) => {
  try { const item = await excluirAgendamentoPorId(req.params.id); return item ? res.sendStatus(204) : res.status(404).json({ mensagem: 'Agendamento não encontrado.' }); } catch (erro) { return res.status(500).json({ mensagem: 'Erro ao excluir agendamento.', erro: erro.message }); }
};
