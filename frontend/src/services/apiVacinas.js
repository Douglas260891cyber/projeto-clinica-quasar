import { api } from './clienteApi'
import { obterUsuarioAutenticado } from './autenticacao'

export function criarVacina (dados) {
  return api.post('/vacinas', { ...dados, usuario_id: obterUsuarioAutenticado()?.id }).then((resposta) => resposta.data)
}

export function listarVacinas () {
  return api.get('/vacinas', { params: { usuario_id: obterUsuarioAutenticado()?.id } }).then((resposta) => resposta.data)
}

export default {
  criarVacina,
  listarVacinas,
}
