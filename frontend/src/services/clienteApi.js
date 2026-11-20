// Serviço central de comunicação com a API backend.
import axios from 'axios'

// Cria uma instância do Axios com o endereço base da API.
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})
