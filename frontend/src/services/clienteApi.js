// Serviço central de comunicação com a API backend.
import axios from 'axios'
import { obterUsuarioAutenticado } from './autenticacao'

// Cria uma instância do Axios com o endereço base da API.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = obterUsuarioAutenticado()?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

