import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export function criarVacina(data) {
  return api.post('/vacinas', data).then((res) => res.data)
}

export function listarVacinas() {
  return api.get('/vacinas').then((res) => res.data)
}

export default {
  criarVacina,
  listarVacinas,
}
