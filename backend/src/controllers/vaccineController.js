import { atualizarVacinaPorId, buscarVacinaPorId, criarVacina, excluirVacinaPorId, listarVacinas } from '../services/vaccineService.js';

const validar = ({ pet, data, local }) => pet && data && local;

export const obterVacinas = async (requisicao, resposta) => {
  try { return resposta.json(await listarVacinas(requisicao.query.usuario_id)); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao listar vacinas.', erro: erro.message }); }
};
export const obterVacina = async (requisicao, resposta) => {
  try { const vacina = await buscarVacinaPorId(requisicao.params.id); return vacina ? resposta.json(vacina) : resposta.status(404).json({ mensagem: 'Vacina não encontrada.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao carregar vacina.', erro: erro.message }); }
};
export const cadastrarVacina = async (requisicao, resposta) => {
  try {
    if (!validar(requisicao.body)) return resposta.status(400).json({ mensagem: 'Pet, data e local são obrigatórios.' });
    return resposta.status(201).json(await criarVacina(requisicao.body));
  } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao cadastrar vacina.', erro: erro.message }); }
};
export const atualizarVacina = async (requisicao, resposta) => {
  try {
    if (!validar(requisicao.body)) return resposta.status(400).json({ mensagem: 'Pet, data e local são obrigatórios.' });
    const vacina = await atualizarVacinaPorId(requisicao.params.id, requisicao.body);
    return vacina ? resposta.json(vacina) : resposta.status(404).json({ mensagem: 'Vacina não encontrada.' });
  } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao atualizar vacina.', erro: erro.message }); }
};
export const excluirVacina = async (requisicao, resposta) => {
  try { const vacina = await excluirVacinaPorId(requisicao.params.id); return vacina ? resposta.sendStatus(204) : resposta.status(404).json({ mensagem: 'Vacina não encontrada.' }); } catch (erro) { return resposta.status(500).json({ mensagem: 'Erro ao excluir vacina.', erro: erro.message }); }
};
