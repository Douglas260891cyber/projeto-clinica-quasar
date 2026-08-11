// Chave única para manter a sessão do usuário no navegador.
const CHAVE_SESSAO = 'clinica-usuario'

// Salva somente os dados públicos retornados pela API; a senha nunca é armazenada.
export const salvarUsuarioAutenticado = (usuario) => {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario))
}

// Informa ao roteador se existe uma sessão criada após um login válido.
export const estaAutenticado = () => Boolean(localStorage.getItem(CHAVE_SESSAO))

// Recupera os dados públicos para personalizar as telas após o login.
export const obterUsuarioAutenticado = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO))
  } catch {
    return null
  }
}

// Remove a sessão local ao encerrar o acesso ao sistema.
export const limparUsuarioAutenticado = () => {
  localStorage.removeItem(CHAVE_SESSAO)
}
