import { LANGUAGE_MENU } from '../i18n/locales';
import { t } from '../i18n/translate';

export function LanguageMenu({ locale }) {
  const current = LANGUAGE_MENU.find((language) => language.code === locale) || LANGUAGE_MENU[0];
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return <details className="language-menu">
    <summary aria-label={`Language: ${current.label}`}><span aria-hidden="true">{current.flag}</span><span className="language-chevron" aria-hidden="true">⌄</span></summary>
    <div className="language-popover" aria-label="Language">
      {LANGUAGE_MENU.map((language) => language.status === 'available'
        ? <a key={language.code} data-language-name="true" href={language.code === 'en' ? base : `${base}${language.code}/`} aria-current={language.code === locale ? 'page' : undefined}><span aria-hidden="true">{language.flag}</span><span>{language.label}</span></a>
        : <span className="language-disabled" key={language.code} aria-disabled="true"><span aria-hidden="true">{language.flag}</span><span data-language-name="true" aria-disabled="true">{language.label}</span><em>{t(locale, 'common.comingSoon')}</em></span>)}
    </div>
  </details>;
}
