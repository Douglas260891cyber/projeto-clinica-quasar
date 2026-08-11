// Chave única para manter a sessão do usuário no navegador.
const SESSION_KEY = 'clinica-user'

// Salva somente os dados públicos retornados pela API; a senha nunca é armazenada.
export const saveAuthenticatedUser = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

// Informa ao roteador se existe uma sessão criada após um login válido.
export const isAuthenticated = () => Boolean(localStorage.getItem(SESSION_KEY))

// Recupera os dados públicos para personalizar as telas após o login.
export const getAuthenticatedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

// Remove a sessão local ao encerrar o acesso ao sistema.
export const clearAuthenticatedUser = () => {
  localStorage.removeItem(SESSION_KEY)
}
