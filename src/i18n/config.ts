import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  lng: 'he',
  fallbackLng: 'he',
  interpolation: { escapeValue: false },
  resources: {
    he: {
      translation: {} // loaded dynamically
    },
    en: {
      translation: {}
    }
  }
})

// Load translations dynamically
async function loadTranslations(lang: string) {
  try {
    const response = await fetch(`/locales/${lang}/translation.json`)
    const data = await response.json()
    i18n.addResourceBundle(lang, 'translation', data, true, true)
  } catch (e) {
    console.error(`Failed to load ${lang} translations`, e)
  }
}

Promise.all([loadTranslations('he'), loadTranslations('en')]).then(() => {
  i18n.changeLanguage('he')
})

export default i18n
