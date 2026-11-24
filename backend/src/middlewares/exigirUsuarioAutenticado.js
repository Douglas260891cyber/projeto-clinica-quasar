import { buscarUsuarioDaSessao } from '../services/servicoSessoes.js';

export const exigirUsuarioAutenticado = async (requisicao, resposta, proximo) => {
  const token = requisicao.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return resposta.status(401).json({ mensagem: 'Autenticação necessária.' });

  try {
    const usuario = await buscarUsuarioDaSessao(token);
    if (!usuario) return resposta.status(401).json({ mensagem: 'Sessão inválida ou expirada.' });
    requisicao.usuarioAutenticado = usuario;
    return proximo();
  } catch {
    return resposta.status(500).json({ mensagem: 'Não foi possível validar a sessão.' });
  }
};
