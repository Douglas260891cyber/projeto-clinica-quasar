import { buscarUsuarioDaSessao } from '../services/servicoSessoes.js';
import { NivelPerfil } from '../enums/nivelPerfil.js';

export const exigirMaster = async (requisicao, resposta, proximo) => {
  const token = requisicao.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return resposta.status(401).json({ mensagem: 'Autenticação necessária.' });

  try {
    const usuario = await buscarUsuarioDaSessao(token);
    if (!usuario) return resposta.status(401).json({ mensagem: 'Sessão inválida ou expirada.' });
    if (usuario.nivel_perfil !== NivelPerfil.MASTER) {
      return resposta.status(403).json({ mensagem: 'Acesso permitido somente a usuários Master.' });
    }
    requisicao.usuarioAutenticado = usuario;
    return proximo();
  } catch {
    return resposta.status(500).json({ mensagem: 'Não foi possível validar o acesso.' });
  }
};
