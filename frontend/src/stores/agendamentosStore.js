import { defineStore } from 'pinia'
import { api } from 'src/services/api'
import { obterUsuarioAutenticado } from 'src/services/auth'

export const useAgendamentosStore = defineStore('agendamentos', {
  state: () => ({ lista: [], semana: [] }),
  actions: {
    async carregarSemana () {
      try { const { data } = await api.get('/agendamentos', { params: { usuario_id: obterUsuarioAutenticado()?.id } }); this.lista = data; this.filtrarSemana() } catch (erro) { console.error('Erro ao carregar agendamentos:', erro) }
    },
    filtrarSemana () {
      const hoje = new Date(); const inicio = new Date(hoje); inicio.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7)); inicio.setHours(0, 0, 0, 0)
      const fim = new Date(inicio); fim.setDate(inicio.getDate() + 6); fim.setHours(23, 59, 59, 999)
      this.semana = this.lista.filter((item) => item.data && new Date(`${item.data}T12:00:00`) >= inicio && new Date(`${item.data}T12:00:00`) <= fim)
    },
    async deletarAgendamento (id) { await api.delete(`/agendamentos/${id}`); this.lista = this.lista.filter((item) => item.id !== id); this.filtrarSemana() },
  },
})
