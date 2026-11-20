import { defineStore, acceptHMRUpdate } from 'pinia'

export const usarArmazenamentoContador = defineStore('contador', {
  state: () => ({
    contador: 0,
  }),

  getters: {
    contadorEmDobro: (state) => state.contador * 2,
  },

  actions: {
    incrementar() {
      this.contador++
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usarArmazenamentoContador, import.meta.hot))
}
