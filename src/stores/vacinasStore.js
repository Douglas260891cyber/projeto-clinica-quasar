import { defineStore } from 'pinia'
import axios from 'axios'

export const useVacinasStore = defineStore('vacinas', {
  state: () => ({
    lista: [], // todas vacinas
    semana: [], // vacinas da semana
  }),

  actions: {
    async carregarVacinas() {
      try {
        const { data } = await axios.get('http://localhost:3000/vacinas')
        this.lista = data
      } catch (err) {
        console.error('Erro ao carregar vacinas:', err)
      }
    },

    async adicionarVacina(payload) {
      try {
        const { data } = await axios.post('http://localhost:3000/vacinas', payload)

        this.lista.push(data)
        this.filtrarSemana()

        return data
      } catch (err) {
        console.error('Erro ao adicionar vacina:', err)
      }
    },

    filtrarSemana() {
      const hoje = new Date()
      const inicio = new Date(hoje)
      inicio.setDate(hoje.getDate() - hoje.getDay() + 1)

      const fim = new Date(inicio)
      fim.setDate(inicio.getDate() + 6)

      this.semana = this.lista.filter((ev) => {
        const dataEv = new Date(ev.data)
        return dataEv >= inicio && dataEv <= fim
      })
    },

    async carregarSemana() {
      await this.carregarVacinas()
      this.filtrarSemana()
    },
  },
})
