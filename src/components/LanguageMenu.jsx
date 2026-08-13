import { LANGUAGE_MENU } from '../i18n/locales';
import { t } from '../i18n/translate';

export function LanguageMenu({ locale }) {
  return <div className="language-menu" aria-label="Language">
    {LANGUAGE_MENU.map((language) => language.status === 'available'
      ? <a key={language.code} data-language-name="true" href={language.code === 'en' ? '/' : `/${language.code}/`} aria-current={language.code === locale ? 'page' : undefined}>{language.label}</a>
      : <span key={language.code} aria-disabled="true"><span data-language-name="true" aria-disabled="true">{language.label}</span> · <span>{t(locale, 'common.comingSoon')}</span></span>)}
  </div>;
}
