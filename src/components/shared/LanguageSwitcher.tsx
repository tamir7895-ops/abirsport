import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isHe = i18n.language === 'he'

  const toggle = () => {
    const newLang = isHe ? 'en' : 'he'
    i18n.changeLanguage(newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr'
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(0,0,0,0.04)',
        color: '#1a1a2e',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8, padding: '5px 10px',
        fontSize: 11, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'Heebo, sans-serif',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
    >
      {isHe ? 'EN' : 'עב'}
    </button>
  )
}
