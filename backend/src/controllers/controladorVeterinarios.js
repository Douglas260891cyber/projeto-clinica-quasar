// Recebe e valida as requisições de cadastro de veterinários.
import { cadastrarVeterinario as criarCadastroVeterinario } from '../services/servicoVeterinarios.js';

export const cadastrarVeterinario = async (requisicao, resposta) => {
  try {
    const { nome, email, senha, confirmar_senha, cpf, data_nascimento, telefone, endereco, crmv, especialidade, clinica_id } = requisicao.body;
    if (!nome || !email || !senha || !cpf || !data_nascimento || !crmv || !especialidade || !clinica_id) {
      return resposta.status(400).json({ mensagem: 'Preencha os campos obrigatórios e selecione uma clínica.' });
    }
    if (typeof senha !== 'string' || senha.length < 6) {
      return resposta.status(400).json({ mensagem: 'A senha deve ter ao menos 6 caracteres.' });
    }
    if (senha !== confirmar_senha) {
      return resposta.status(400).json({ mensagem: 'As senhas não coincidem.' });
    }

    const usuario = await criarCadastroVeterinario({ nome, email, senha, cpf, data_nascimento, telefone, endereco, crmv, especialidade, clinica_id });
    return resposta.status(201).json({ mensagem: 'Veterinário cadastrado com sucesso.', usuario });
  } catch (erro) {
    if (erro.status) return resposta.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    return resposta.status(500).json({ mensagem: 'Erro ao cadastrar veterinário.', erro: erro.message });
  }
};
