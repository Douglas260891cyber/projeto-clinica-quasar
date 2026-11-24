// Cadastro, perfil e segurança das contas de usuário.
import { criarUsuario, buscarUsuarioPorEmail, verificarSenha, buscarUsuarioPorId, atualizarUsuarioPorId, atualizarSenhaUsuario } from '../services/servicoUsuarios.js';

export const cadastrarUsuario = async (requisicao, resposta) => {
  try {
    const { nome, email, senha, confirmar_senha, cpf, data_nascimento, telefone, endereco, clinica_id } = requisicao.body;
    if (!nome || !email || !senha || !confirmar_senha || !cpf || !data_nascimento || !clinica_id) {
      return resposta.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios e selecione uma clínica.' });
    }
    if (typeof senha !== 'string' || senha.length < 6) {
      return resposta.status(400).json({ mensagem: 'A senha deve ter ao menos 6 caracteres.' });
    }
    if (senha !== confirmar_senha) {
      return resposta.status(400).json({ mensagem: 'As senhas não coincidem.' });
    }
    if (await buscarUsuarioPorEmail(email)) {
      return resposta.status(409).json({ mensagem: 'Já existe um usuário com este e-mail.' });
    }
    const usuario = await criarUsuario({ nome, email, senha, cpf, data_nascimento, telefone, endereco, clinica_id });
    return resposta.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario });
  } catch (erro) {
    if (erro.status) return resposta.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    return resposta.status(500).json({ mensagem: 'Erro ao cadastrar usuário.', erro: erro.message });
  }
};

export const obterPerfil = async (requisicao, resposta) => {
  try {
    const usuario = await buscarUsuarioPorId(requisicao.params.id);
    if (!usuario) return resposta.status(404).json({ mensagem: 'Usuário não encontrado.' });
    return resposta.json(usuario);
  } catch (erro) {
    return resposta.status(500).json({ mensagem: 'Erro ao carregar o perfil.', erro: erro.message });
  }
};

export const atualizarPerfil = async (requisicao, resposta) => {
  try {
    const { nome, email, cpf, data_nascimento, telefone, endereco } = requisicao.body;
    if (!nome || !email || !cpf || !data_nascimento) {
      return resposta.status(400).json({ mensagem: 'Nome, CPF, data de nascimento e e-mail são obrigatórios.' });
    }
    const existente = await buscarUsuarioPorEmail(email);
    if (existente && String(existente.id) !== String(requisicao.params.id)) {
      return resposta.status(409).json({ mensagem: 'Já existe um usuário com este e-mail.' });
    }
    const usuario = await atualizarUsuarioPorId(requisicao.params.id, { nome, email, cpf, data_nascimento, telefone, endereco });
    if (!usuario) return resposta.status(404).json({ mensagem: 'Usuário não encontrado.' });
    return resposta.json({ mensagem: 'Perfil atualizado com sucesso.', usuario });
  } catch (erro) {
    return resposta.status(500).json({ mensagem: 'Erro ao atualizar o perfil.', erro: erro.message });
  }
};

export const alterarSenha = async (requisicao, resposta) => {
  try {
    const { senhaAtual, novaSenha } = requisicao.body;
    if (!senhaAtual || !novaSenha || novaSenha.length < 6) {
      return resposta.status(400).json({ mensagem: 'Informe a senha atual e uma nova senha com ao menos 6 caracteres.' });
    }
    const usuario = await buscarUsuarioPorId(requisicao.params.id);
    const usuarioComSenha = usuario && await buscarUsuarioPorEmail(usuario.email);
    if (!usuarioComSenha || !(await verificarSenha(senhaAtual, usuarioComSenha.senha_hash))) {
      return resposta.status(401).json({ mensagem: 'A senha atual está incorreta.' });
    }
    await atualizarSenhaUsuario(requisicao.params.id, novaSenha);
    return resposta.json({ mensagem: 'Senha alterada com sucesso.' });
  } catch (erro) {
    return resposta.status(500).json({ mensagem: 'Erro ao alterar a senha.', erro: erro.message });
  }
};
