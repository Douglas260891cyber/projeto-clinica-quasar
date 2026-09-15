import { api } from './api'
import { obterUsuarioAutenticado } from './auth'

export function criarVacina (data) {
  return api.post('/vacinas', { ...data, usuario_id: obterUsuarioAutenticado()?.id }).then((res) => res.data)
}

export function listarVacinas () {
  return api.get('/vacinas', { params: { usuario_id: obterUsuarioAutenticado()?.id } }).then((res) => res.data)
}

export default {
  criarVacina,
  listarVacinas,
}
