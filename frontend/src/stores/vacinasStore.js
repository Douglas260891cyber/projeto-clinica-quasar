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
      // Recebe uma referência para hoje e calcula segunda (inicio) e domingo (fim)
      const hoje = new Date()
      // dayIndex: 0 => segunda, 1 => terça, ..., 6 => domingo
      const dayIndex = (hoje.getDay() + 6) % 7
      const inicio = new Date(hoje)
      inicio.setDate(hoje.getDate() - dayIndex)
      inicio.setHours(0, 0, 0, 0)

      const fim = new Date(inicio)
      fim.setDate(inicio.getDate() + 6)
      fim.setHours(23, 59, 59, 999)

      // Normaliza e filtra comparando timestamps
      this.semana = this.lista.filter((ev) => {
        if (!ev?.data) return false

        // garante parsing sem problemas de fuso (trata 'YYYY-MM-DD' como local)
        // se seus dados já tiverem timezone, adapte conforme necessário
        const dataEv = new Date(ev.data + 'T12:00:00') // meio-dia evita cross-day por timezone
        const ts = dataEv.getTime()
        return ts >= inicio.getTime() && ts <= fim.getTime()
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
