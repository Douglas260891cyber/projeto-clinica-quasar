import { buscarClinicaComVeterinarios, criarClinica, listarClinicas } from '../services/servicoClinicas.js';

export const obterClinicas = async (_requisicao, resposta) => {
  try {
    return resposta.json(await listarClinicas());
  } catch (erro) {
    return resposta.status(500).json({ mensagem: 'Erro ao carregar clínicas.', erro: erro.message });
  }
};

export const obterClinicaDoUsuario = async (requisicao, resposta) => {
  const clinicaId = requisicao.usuarioAutenticado.clinica_id;
  if (!clinicaId) return resposta.status(403).json({ mensagem: 'Sua conta ainda não está vinculada a uma clínica.' });
  try {
    const clinica = await buscarClinicaComVeterinarios(clinicaId);
    return clinica ? resposta.json(clinica) : resposta.status(404).json({ mensagem: 'Clínica vinculada não encontrada.' });
  } catch (erro) {
    return resposta.status(500).json({ mensagem: 'Erro ao carregar a clínica e seus veterinários.', erro: erro.message });
  }
};

export const cadastrarClinica = async (requisicao, resposta) => {
  try {
    const { nome, cnpj, email, telefone, endereco, cidade, estado } = requisicao.body;
    if (!nome?.trim()) return resposta.status(400).json({ mensagem: 'O nome da clínica é obrigatório.' });
    const clinica = await criarClinica({ nome, cnpj, email, telefone, endereco, cidade, estado });
    return resposta.status(201).json({ mensagem: 'Clínica cadastrada com sucesso.', clinica });
  } catch (erro) {
    if (erro.code === '23505') return resposta.status(409).json({ mensagem: 'Já existe uma clínica com este CNPJ.' });
    return resposta.status(500).json({ mensagem: 'Erro ao cadastrar clínica.', erro: erro.message });
  }
};
