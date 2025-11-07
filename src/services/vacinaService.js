import { api } from 'boot/axios'

export const vacinaService = {
  async listarVacinas() {
    const response = await api.get('/vacinas')
    return response.data
  },

  async criarVacina(dados) {
    const response = await api.post('/vacinas', dados)
    return response.data
  },

  async excluirVacina(id) {
    await api.delete(`/vacinas/${id}`)
  },
}
