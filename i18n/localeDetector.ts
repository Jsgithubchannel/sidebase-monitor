// Detect language to enable server side translations https://i18n.nuxtjs.org/docs/guide/server-side-translations
export default defineI18nLocaleDetector((event, config) => {
  // try to get locale from query
  const query = tryQueryLocale(event, { lang: '' })
  if (query) {
    return query.toString()
  }

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_locale' })
  if (cookie) {
    return cookie.toString()
  }

  // try to get locale from header accept-header
  const header = tryHeaderLocale(event, { lang: '' })
  if (header) {
    return header.toString()
  }

  // fallback to default locale
  return config.defaultLocale
})
