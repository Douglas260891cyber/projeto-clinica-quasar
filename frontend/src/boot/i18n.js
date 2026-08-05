import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  // Detectar idioma do navegador ou usar pt-BR por padrão
  const browserLocale = navigator.language || navigator.userLanguage || 'pt-BR'
  const locale = messages[browserLocale] ? browserLocale : messages['pt-BR'] ? 'pt-BR' : 'en-US'

  const i18n = createI18n({
    locale: locale,
    globalInjection: true,
    messages,
  })

  // Set i18n instance on app
  app.use(i18n)
})
