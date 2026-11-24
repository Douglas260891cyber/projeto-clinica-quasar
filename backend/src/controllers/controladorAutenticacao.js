// Controlador responsável pelo login e validação das credenciais.
import { autenticarUsuario } from '../services/servicoAutenticacao.js';
import { NivelPerfil } from '../enums/nivelPerfil.js';
import { criarSessao } from '../services/servicoSessoes.js';

export const entrarUsuario = async (requisicao, resposta) => {
  try {
    const { email, senha } = requisicao.body;
    if (!email || !senha) {
      return resposta.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await autenticarUsuario(email, senha);
    if (!usuario) return resposta.status(401).json({ mensagem: 'Credenciais inválidas.' });
    const token = await criarSessao(usuario.id);

    return resposta.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo || 'tutor', nivel_perfil: usuario.nivel_perfil ?? NivelPerfil.CLIENTE, clinica_id: usuario.clinica_id, clinica_nome: usuario.clinica_nome }
    });
  } catch (erro) {
    console.error(erro);
    return resposta.status(500).json({ mensagem: 'Erro ao autenticar usuário.', erro: erro.message });
  }
};
