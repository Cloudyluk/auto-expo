import { useEffect } from 'react';
import { EXHIBITIONS } from './data/exhibitions';
import { ExhibitionCard } from './components/ExhibitionCard';
import { LanguageMenu } from './components/LanguageMenu';
import { t } from './i18n/translate';

export function App({ pathname = window.location.pathname }) {
  const locale = pathname.startsWith('/zh') ? 'zh' : 'en';
  const featured = EXHIBITIONS.filter((exhibition) => exhibition.meta.star >= 3).slice(0, 12);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t(locale, 'documentTitle');
  }, [locale]);

  return (
    <main data-locale={locale}>
      <nav aria-label="Primary navigation">
        <strong>{t(locale, 'brand')}</strong>
        <a href="#map">{t(locale, 'nav.map')}</a>
        <a href="#overview">{t(locale, 'nav.overview')}</a>
        <a href="#procurement">{t(locale, 'nav.procurement')}</a>
        <a href="#sales">{t(locale, 'nav.sales')}</a>
        <LanguageMenu locale={locale} />
      </nav>
      <section id="overview">
        <h1>{t(locale, 'overview.featured')}</h1>
        <div className="expo-grid">{featured.map((exhibition) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} locale={locale} />)}</div>
      </section>
    </main>
  );
}
