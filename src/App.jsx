import { useEffect, useMemo, useState } from 'react';
import { EXHIBITIONS } from './data/exhibitions';
import { ExhibitionCard } from './components/ExhibitionCard';
import { LanguageMenu } from './components/LanguageMenu';
import { t } from './i18n/translate';
import { BUYER_PATHS } from './domain/paths';
import { getProcurementAssemblyEvents, rankProcurementEvents } from './domain/procurement';
import { getSalesRouteProducts, getSalesRule, SALES_ROUTES } from './domain/sales';
import { CATEGORY_IDS, categoryLabel } from './data/taxonomy';
import { pathLabel } from './data/path-content';
import { localizeLocation } from './data/display';
import { WorldMap } from './components/WorldMap';

const NAV = ['map', 'overview', 'procurement', 'sales', 'monthly', 'category', 'country', 'preview', 'starred'];
const TASKS = ['supplier', 'technology', 'cost', 'qualification', 'aftermarket'];
const countryFor = (event) => {
  const text = event.location.label || '';
  const countries = [['中国', 'CN'], ['美国', 'US'], ['德国', 'DE'], ['日本', 'JP'], ['韩国', 'KR'], ['泰国', 'TH'], ['印度', 'IN'], ['巴西', 'BR'], ['英国', 'GB'], ['法国', 'FR'], ['意大利', 'IT'], ['加拿大', 'CA'], ['墨西哥', 'MX'], ['阿联酋', 'AE']];
  return countries.find(([name]) => text.includes(name))?.[1] || (/[A-Za-z]/.test(text) ? 'INTL' : 'CN');
};
const countryNames = { en: { CN: 'China', US: 'United States', DE: 'Germany', JP: 'Japan', KR: 'South Korea', TH: 'Thailand', IN: 'India', BR: 'Brazil', GB: 'United Kingdom', FR: 'France', IT: 'Italy', CA: 'Canada', MX: 'Mexico', AE: 'United Arab Emirates', INTL: 'International' }, zh: { CN: '中国', US: '美国', DE: '德国', JP: '日本', KR: '韩国', TH: '泰国', IN: '印度', BR: '巴西', GB: '英国', FR: '法国', IT: '意大利', CA: '加拿大', MX: '墨西哥', AE: '阿联酋', INTL: '国际' }, es: { CN: 'China', US: 'Estados Unidos', DE: 'Alemania', JP: 'Japón', KR: 'Corea del Sur', TH: 'Tailandia', IN: 'India', BR: 'Brasil', GB: 'Reino Unido', FR: 'Francia', IT: 'Italia', CA: 'Canadá', MX: 'México', AE: 'Emiratos Árabes Unidos', INTL: 'Internacional' } };

function Decision({ locale, match, taskId }) {
  const evidence = locale === 'es' ? 'La categoría de la feria, el enfoque publicado y el perfil de público apoyan esta coincidencia.' : locale === 'zh' ? '展会分类、已发布主题与受众画像共同支持本次匹配。' : 'The exhibition category, published focus and audience profile support this match.';
  return <div className="decision"><strong>{t(locale, 'procurement.whyMatch')}</strong><p>{evidence || t(locale, 'procurement.preliminary')}</p><strong>{t(locale, 'procurement.obtain')}</strong><p>{locale === 'es' ? 'Verifique proveedores, capacidad, calidad y compatibilidad técnica antes de solicitar una RFQ.' : locale === 'zh' ? '在发出 RFQ 前核验供应商、产能、质量与技术兼容性。' : 'Verify suppliers, capacity, quality and technical fit before issuing an RFQ.'}</p><strong>{t(locale, 'procurement.doNotAttend')}</strong><p>{locale === 'es' ? 'No priorice el viaje si no puede confirmar expositores y reuniones relevantes.' : locale === 'zh' ? '无法确认相关展商和会议时，不应优先安排差旅。' : 'Do not prioritize travel unless relevant exhibitors and meetings can be confirmed.'}</p><strong>{t(locale, 'procurement.alternative')}</strong><p>{locale === 'es' ? 'Preseleccione en línea y programe reuniones con proveedores cualificados.' : locale === 'zh' ? '先在线预筛选，并与合格供应商预约会议。' : 'Pre-screen online and schedule meetings with qualified suppliers.'}</p></div>;
}

export function App({ pathname = window.location.pathname }) {
  const locale = pathname.startsWith('/zh') ? 'zh' : pathname.startsWith('/es') ? 'es' : 'en';
  const [page, setPage] = useState('map');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [selection, setSelection] = useState(null);
  const [taskId, setTaskId] = useState('supplier');
  const featured = EXHIBITIONS.filter((exhibition) => exhibition.meta.star >= 3).slice(0, 12);
  const filtered = useMemo(() => EXHIBITIONS.filter((event) => JSON.stringify(event).toLowerCase().includes(query.toLowerCase())), [query]);
  const categories = [...new Set(EXHIBITIONS.map((event) => event.taxonomy.categoryId))].sort();
  const countries = [...new Set(EXHIBITIONS.map(countryFor))].sort();
  const countryCounts = Object.fromEntries(countries.map((code) => [code, EXHIBITIONS.filter((event) => countryFor(event) === code).length]));
  const activeAssembly = selection && BUYER_PATHS[selection.mode]?.assemblies.find((assembly) => assembly.id === selection.id);
  const matched = activeAssembly ? rankProcurementEvents(getProcurementAssemblyEvents(EXHIBITIONS, { ...activeAssembly, categoryIds: activeAssembly.cats.map((cat) => CATEGORY_IDS[cat]).filter(Boolean) }, taskId)) : [];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t(locale, 'documentTitle');
  }, [locale]);

  return (
    <main data-locale={locale}>
      <nav aria-label="Primary navigation">
        <strong>{t(locale, 'brand')}</strong>
        {NAV.map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => { setPage(item); setSelection(null); }}>{t(locale, `nav.${item}`)}</button>)}
        <LanguageMenu locale={locale} />
      </nav>
      <label className="search"><span>{t(locale, 'common.search')}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t(locale, 'search.placeholder')} /></label>
      {page === 'overview' && <section><h1>{t(locale, 'overview.featured')}</h1><div className="expo-grid">{featured.map((exhibition) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} locale={locale} />)}</div></section>}
      {page === 'map' && <section><h1>{t(locale, 'map.title')}</h1><p>{t(locale, 'map.distribution')}</p><WorldMap locale={locale} counts={countryCounts} labels={countryNames[locale] || countryNames.en} onCountry={(code) => { setCountry(code); setPage('country'); }} /><div className="country-map">{countries.map((code) => <button key={code} onClick={() => { setCountry(code); setPage('country'); }}>{(countryNames[locale] || countryNames.en)[code]} <b>{countryCounts[code]}</b></button>)}</div></section>}
      {page === 'monthly' && <section><h1>{t(locale, 'nav.monthly')}</h1><div className="chips">{Array.from({ length: 12 }, (_, index) => <button className={month === index + 1 ? 'active' : ''} key={index} onClick={() => setMonth(index + 1)}>{index + 1}</button>)}</div><Cards events={filtered.filter((event) => event.date.month === month)} locale={locale} /></section>}
      {page === 'category' && <section><h1>{t(locale, 'nav.category')}</h1><div className="chips"><button onClick={() => setCategory('all')}>{t(locale, 'common.all')}</button>{categories.map((id) => <button key={id} onClick={() => setCategory(id)}>{categoryLabel(id, locale)}</button>)}</div><Cards events={filtered.filter((event) => category === 'all' || event.taxonomy.categoryId === category)} locale={locale} /></section>}
      {page === 'country' && <section><h1>{t(locale, 'nav.country')}</h1><div className="chips"><button onClick={() => setCountry('all')}>{t(locale, 'common.all')}</button>{countries.map((code) => <button key={code} onClick={() => setCountry(code)}>{(countryNames[locale] || countryNames.en)[code]}</button>)}</div><Cards events={filtered.filter((event) => country === 'all' || countryFor(event) === country)} locale={locale} /></section>}
      {page === 'starred' && <section><h1>{t(locale, 'nav.starred')}</h1><Cards events={filtered.filter((event) => event.meta.star > 0)} locale={locale} /></section>}
      {page === 'preview' && <section><h1>{t(locale, 'nav.preview')}</h1><Cards events={filtered.filter((event) => event.date.year >= 2027)} locale={locale} /></section>}
      {page === 'procurement' && <section><h1>{t(locale, 'procurement.title')}</h1><p>{t(locale, 'procurement.intro')}</p>{activeAssembly ? <><button onClick={() => setSelection(null)}>{t(locale, 'common.back')}</button><h2>{pathLabel(activeAssembly, locale)}</h2><div className="chips">{TASKS.map((id) => <button className={taskId === id ? 'active' : ''} key={id} onClick={() => setTaskId(id)}>{t(locale, `procurement.tasks.${id}`)}</button>)}</div>{matched.length ? <div className="expo-grid">{matched.map((match) => <article key={match.event.id}><ExhibitionCard exhibition={match.event} locale={locale} /><Decision locale={locale} match={match} taskId={taskId} /></article>)}</div> : <p>{t(locale, 'procurement.noMatches')}</p>}</> : <div className="path-grid">{Object.entries(BUYER_PATHS).map(([mode, path]) => <section key={mode}><h2>{pathLabel({ id: mode, label: path.label }, locale)}</h2>{path.assemblies.map((assembly) => <button key={assembly.id} onClick={() => setSelection({ mode, id: assembly.id })}>{pathLabel(assembly, locale)}</button>)}</section>)}</div>}</section>}
      {page === 'sales' && <section><h1>{t(locale, 'sales.title')}</h1><div className="path-grid">{Object.entries(SALES_ROUTES).map(([routeId, route]) => <section key={routeId}><h2>{pathLabel({ id: routeId, label: route.label }, locale)}</h2>{getSalesRouteProducts(routeId).map((id) => { const item = Object.entries(BUYER_PATHS).flatMap(([mode, path]) => path.assemblies.map((assembly) => ({ mode, assembly }))).find((entry) => entry.assembly.id === id); const rule = getSalesRule(id); return item && <article key={id}><h3>{pathLabel(item.assembly, locale)}</h3><p><strong>{t(locale, 'sales.directCustomers')}:</strong> {locale === 'es' ? 'OEM, Tier 1 y compradores de la cadena de suministro pertinentes' : locale === 'zh' ? rule.buyers.join('、') : 'Relevant OEM, Tier 1 and supply-chain buyers'}</p><p><strong>{t(locale, 'sales.technicalSpecifiers')}:</strong> {locale === 'es' ? 'Ingeniería, calidad y equipos de programas pertinentes' : locale === 'zh' ? rule.specifiers.join('、') : 'Relevant engineering, quality and program teams'}</p></article>; })}</section>)}</div></section>}
    </main>
  );
}

function Cards({ events, locale }) {
  return events.length ? <div className="expo-grid">{events.map((exhibition) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} locale={locale} />)}</div> : <p>{t(locale, 'common.noResults')}</p>;
}
