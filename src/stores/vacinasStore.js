import { defineStore } from 'pinia'
import axios from 'axios'

export const useVacinasStore = defineStore('vacinas', {
  state: () => ({
    lista: [], // todas vacinas
    semana: [], // vacinas da semana
    selecionada: null, // para edição (opcional)
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

    async deletarVacina(id) {
      try {
        await axios.delete(`http://localhost:3000/vacinas/${id}`)
        // remove da lista
        this.lista = this.lista.filter((ev) => ev.id !== id)
        // recalcula semana
        this.filtrarSemana()
      } catch (err) {
        console.error('Erro ao deletar vacina:', err)
      }
    },

    selecionarParaEdicao(vacina) {
      this.selecionada = { ...vacina } // cópia para formulário
    },

    async salvarEdicao() {
      if (!this.selecionada?.id) return

      try {
        const { id } = this.selecionada

        await axios.put(`http://localhost:3000/vacinas/${id}`, this.selecionada)

        // atualiza a lista local
        const index = this.lista.findIndex((v) => v.id === id)
        if (index !== -1) {
          this.lista[index] = { ...this.selecionada }
        }

        this.filtrarSemana()
        this.selecionada = null
      } catch (err) {
        console.error('Erro ao salvar edição:', err)
      }
    },
  },
})
