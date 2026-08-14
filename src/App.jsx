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
import { SUPPORTED_LOCALES } from './i18n/locales';

const NAV = ['map', 'overview', 'procurement', 'sales', 'monthly', 'category', 'country', 'preview', 'starred'];
const TASKS = ['supplier', 'technology', 'cost', 'qualification', 'aftermarket'];
const countryFor = (event) => {
  const text = event.location.label || '';
  const countries = [['中国', 'CN'], ['美国', 'US'], ['德国', 'DE'], ['日本', 'JP'], ['韩国', 'KR'], ['泰国', 'TH'], ['印度', 'IN'], ['巴西', 'BR'], ['英国', 'GB'], ['法国', 'FR'], ['意大利', 'IT'], ['加拿大', 'CA'], ['墨西哥', 'MX'], ['阿联酋', 'AE']];
  return countries.find(([name]) => text.includes(name))?.[1] || (/[A-Za-z]/.test(text) ? 'INTL' : 'CN');
};
const countryNames = { en: { CN: 'China', US: 'United States', DE: 'Germany', JP: 'Japan', KR: 'South Korea', TH: 'Thailand', IN: 'India', BR: 'Brazil', GB: 'United Kingdom', FR: 'France', IT: 'Italy', CA: 'Canada', MX: 'Mexico', AE: 'United Arab Emirates', INTL: 'International' }, zh: { CN: '中国', US: '美国', DE: '德国', JP: '日本', KR: '韩国', TH: '泰国', IN: '印度', BR: '巴西', GB: '英国', FR: '法国', IT: '意大利', CA: '加拿大', MX: '墨西哥', AE: '阿联酋', INTL: '国际' }, es: { CN: 'China', US: 'Estados Unidos', DE: 'Alemania', JP: 'Japón', KR: 'Corea del Sur', TH: 'Tailandia', IN: 'India', BR: 'Brasil', GB: 'Reino Unido', FR: 'Francia', IT: 'Italia', CA: 'Canadá', MX: 'México', AE: 'Emiratos Árabes Unidos', INTL: 'Internacional' }, pt: { CN: 'China', US: 'Estados Unidos', DE: 'Alemanha', JP: 'Japão', KR: 'Coreia do Sul', TH: 'Tailândia', IN: 'Índia', BR: 'Brasil', GB: 'Reino Unido', FR: 'França', IT: 'Itália', CA: 'Canada', MX: 'México', AE: 'Emirados Árabes Unidos', INTL: 'Internacional' }, fr: { CN: 'Chine', US: 'États-Unis', DE: 'Allemagne', JP: 'Japon', KR: 'Corée du Sud', TH: 'Thaïlande', IN: 'Inde', BR: 'Brésil', GB: 'Royaume-Uni', FR: 'France', IT: 'Italie', CA: 'Canada', MX: 'Mexique', AE: 'Émirats arabes unis', INTL: 'International' }, de: { CN: 'China', US: 'Vereinigte Staaten', DE: 'Deutschland', JP: 'Japan', KR: 'Südkorea', TH: 'Thailand', IN: 'Indien', BR: 'Brasilien', GB: 'Vereinigtes Königreich', FR: 'Frankreich', IT: 'Italien', CA: 'Kanada', MX: 'Mexiko', AE: 'Vereinigte Arabische Emirate', INTL: 'International' }, ja: { CN: '中国', US: '米国', DE: 'ドイツ', JP: '日本', KR: '韓国', TH: 'タイ', IN: 'インド', BR: 'ブラジル', GB: '英国', FR: 'フランス', IT: 'イタリア', CA: 'カナダ', MX: 'メキシコ', AE: 'アラブ首長国連邦', INTL: '海外' } };

function Decision({ locale, match, taskId }) {
  const copy = locale === 'ja' ? ['展示会のカテゴリー、公開テーマ、対象者プロフィールがこのマッチングを裏付けています。', 'RFQを発行する前に、サプライヤー、能力、品質、技術適合性を確認します。', '関連出展者と面談を確認できない場合は、出張を優先しません。', 'オンラインで事前選定し、適格サプライヤーとの面談を設定します。'] : locale === 'de' ? ['Kategorie, veröffentlichter Schwerpunkt und Zielgruppenprofil der Messe stützen diese Zuordnung.', 'Prüfen Sie Lieferanten, Kapazität, Qualität und technische Eignung vor einer RFQ.', 'Priorisieren Sie die Reise nicht, solange relevante Aussteller und Gespräche nicht bestätigt sind.', 'Vorselektion online durchführen und Gespräche mit qualifizierten Lieferanten planen.'] : locale === 'fr' ? ['La catégorie de l’exposition, son thème publié et le profil du public justifient cette correspondance.', 'Vérifiez les fournisseurs, la capacité, la qualité et l’adéquation technique avant d’émettre une RFQ.', 'Ne priorisez pas le déplacement sans confirmer les exposants et les rendez-vous pertinents.', 'Présélectionnez en ligne et planifiez des rendez-vous avec des fournisseurs qualifiés.'] : locale === 'pt' ? ['A categoria da exposição, o foco publicado e o perfil do público sustentam esta correspondência.', 'Verifique fornecedores, capacidade, qualidade e adequação técnica antes de emitir uma RFQ.', 'Não priorize a viagem sem confirmar expositores e reuniões relevantes.', 'Faça uma pré-seleção on-line e agende reuniões com fornecedores qualificados.'] : locale === 'es' ? ['La categoría de la feria, el enfoque publicado y el perfil de público apoyan esta coincidencia.', 'Verifique proveedores, capacidad, calidad y compatibilidad técnica antes de solicitar una RFQ.', 'No priorice el viaje si no puede confirmar expositores y reuniones relevantes.', 'Preseleccione en línea y programe reuniones con proveedores cualificados.'] : locale === 'zh' ? ['展会分类、已发布主题与受众画像共同支持本次匹配。', '在发出 RFQ 前核验供应商、产能、质量与技术兼容性。', '无法确认相关展商和会议时，不应优先安排差旅。', '先在线预筛选，并与合格供应商预约会议。'] : ['The exhibition category, published focus and audience profile support this match.', 'Verify suppliers, capacity, quality and technical fit before issuing an RFQ.', 'Do not prioritize travel unless relevant exhibitors and meetings can be confirmed.', 'Pre-screen online and schedule meetings with qualified suppliers.'];
  const localizedCopy = locale === 'ko' ? ['전시회의 카테고리, 공개된 주제와 대상 고객 프로필이 이 매칭을 뒷받침합니다.', 'RFQ 발행 전에 공급업체, 생산능력, 품질 및 기술 적합성을 확인합니다.', '관련 전시업체와 미팅을 확인할 수 없다면 출장을 우선하지 않습니다.', '온라인으로 사전 선별하고 적격 공급업체와 미팅을 잡습니다.'] : copy;
  return <div className="decision"><strong>{t(locale, 'procurement.whyMatch')}</strong><p>{localizedCopy[0]}</p><strong>{t(locale, 'procurement.obtain')}</strong><p>{localizedCopy[1]}</p><strong>{t(locale, 'procurement.doNotAttend')}</strong><p>{localizedCopy[2]}</p><strong>{t(locale, 'procurement.alternative')}</strong><p>{localizedCopy[3]}</p></div>;
}

export function App({ pathname = window.location.pathname }) {
  const locale = pathname.split('/').find((segment) => SUPPORTED_LOCALES.includes(segment)) || 'en';
  const [page, setPage] = useState('map');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [mapYear, setMapYear] = useState(2026);
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [selection, setSelection] = useState(null);
  const [taskId, setTaskId] = useState('supplier');
  const featured = EXHIBITIONS.filter((exhibition) => exhibition.meta.star >= 3).slice(0, 12);
  const filtered = useMemo(() => EXHIBITIONS.filter((event) => JSON.stringify(event).toLowerCase().includes(query.toLowerCase())), [query]);
  const categories = [...new Set(EXHIBITIONS.map((event) => event.taxonomy.categoryId))].sort();
  const countries = [...new Set(EXHIBITIONS.map(countryFor))].sort();
  const activeAssembly = selection && BUYER_PATHS[selection.mode]?.assemblies.find((assembly) => assembly.id === selection.id);
  const matched = activeAssembly ? rankProcurementEvents(getProcurementAssemblyEvents(EXHIBITIONS, { ...activeAssembly, categoryIds: activeAssembly.cats.map((cat) => CATEGORY_IDS[cat]).filter(Boolean) }, taskId)) : [];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
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
      {page === 'map' && <section><h1>{t(locale, 'map.title')}</h1><p>{t(locale, 'map.distribution')}</p><WorldMap locale={locale} events={filtered} year={mapYear} month={month} onYear={setMapYear} onMonth={setMonth} /></section>}
      {page === 'monthly' && <section><h1>{t(locale, 'nav.monthly')}</h1><div className="chips">{Array.from({ length: 12 }, (_, index) => <button className={month === index + 1 ? 'active' : ''} key={index} onClick={() => setMonth(index + 1)}>{index + 1}</button>)}</div><Cards events={filtered.filter((event) => event.date.month === month)} locale={locale} /></section>}
      {page === 'category' && <section><h1>{t(locale, 'nav.category')}</h1><div className="chips"><button onClick={() => setCategory('all')}>{t(locale, 'common.all')}</button>{categories.map((id) => <button key={id} onClick={() => setCategory(id)}>{categoryLabel(id, locale)}</button>)}</div><Cards events={filtered.filter((event) => category === 'all' || event.taxonomy.categoryId === category)} locale={locale} /></section>}
      {page === 'country' && <section><h1>{t(locale, 'nav.country')}</h1><div className="chips"><button onClick={() => setCountry('all')}>{t(locale, 'common.all')}</button>{countries.map((code) => <button key={code} onClick={() => setCountry(code)}>{(countryNames[locale] || countryNames.en)[code]}</button>)}</div><Cards events={filtered.filter((event) => country === 'all' || countryFor(event) === country)} locale={locale} /></section>}
      {page === 'starred' && <section><h1>{t(locale, 'nav.starred')}</h1><Cards events={filtered.filter((event) => event.meta.star > 0)} locale={locale} /></section>}
      {page === 'preview' && <section><h1>{t(locale, 'nav.preview')}</h1><Cards events={filtered.filter((event) => event.date.year >= 2027)} locale={locale} /></section>}
      {page === 'procurement' && <section><h1>{t(locale, 'procurement.title')}</h1><p>{t(locale, 'procurement.intro')}</p>{activeAssembly ? <><button onClick={() => setSelection(null)}>{t(locale, 'common.back')}</button><h2>{pathLabel(activeAssembly, locale)}</h2><div className="chips">{TASKS.map((id) => <button className={taskId === id ? 'active' : ''} key={id} onClick={() => setTaskId(id)}>{t(locale, `procurement.tasks.${id}`)}</button>)}</div>{matched.length ? <div className="expo-grid">{matched.map((match) => <article key={match.event.id}><ExhibitionCard exhibition={match.event} locale={locale} /><Decision locale={locale} match={match} taskId={taskId} /></article>)}</div> : <p>{t(locale, 'procurement.noMatches')}</p>}</> : <div className="path-grid">{Object.entries(BUYER_PATHS).map(([mode, path]) => <section key={mode}><h2>{pathLabel({ id: mode, label: path.label }, locale)}</h2>{path.assemblies.map((assembly) => <button key={assembly.id} onClick={() => setSelection({ mode, id: assembly.id })}>{pathLabel(assembly, locale)}</button>)}</section>)}</div>}</section>}
      {page === 'sales' && <section><h1>{t(locale, 'sales.title')}</h1><div className="path-grid">{Object.entries(SALES_ROUTES).map(([routeId, route]) => <section key={routeId}><h2>{pathLabel({ id: routeId, label: route.label }, locale)}</h2>{getSalesRouteProducts(routeId).map((id) => { const item = Object.entries(BUYER_PATHS).flatMap(([mode, path]) => path.assemblies.map((assembly) => ({ mode, assembly }))).find((entry) => entry.assembly.id === id); const rule = getSalesRule(id); const buyers = locale === 'ja' ? '関連するOEM、Tier 1、サプライチェーンの購買担当者' : locale === 'de' ? 'Relevante OEM-, Tier-1- und Lieferketten-Einkäufer' : locale === 'fr' ? 'OEM, Tier 1 et acheteurs concernés de la chaîne d’approvisionnement' : locale === 'pt' ? 'OEM, Tier 1 e compradores relevantes da cadeia de suprimentos' : locale === 'es' ? 'OEM, Tier 1 y compradores de la cadena de suministro pertinentes' : locale === 'zh' ? rule.buyers.join('、') : 'Relevant OEM, Tier 1 and supply-chain buyers'; const specifiers = locale === 'ja' ? '関連するエンジニアリング、品質、プログラムチーム' : locale === 'de' ? 'Relevante Teams aus Engineering, Qualität und Programmmanagement' : locale === 'fr' ? 'Équipes concernées d’ingénierie, qualité et programmes' : locale === 'pt' ? 'Equipes relevantes de engenharia, qualidade e programas' : locale === 'es' ? 'Ingeniería, calidad y equipos de programas pertinentes' : locale === 'zh' ? rule.specifiers.join('、') : 'Relevant engineering, quality and program teams'; return item && <article key={id}><h3>{pathLabel(item.assembly, locale)}</h3><p><strong>{t(locale, 'sales.directCustomers')}:</strong> {buyers}</p><p><strong>{t(locale, 'sales.technicalSpecifiers')}:</strong> {specifiers}</p></article>; })}</section>)}</div></section>}
    </main>
  );
}

function Cards({ events, locale }) {
  return events.length ? <div className="expo-grid">{events.map((exhibition) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} locale={locale} />)}</div> : <p>{t(locale, 'common.noResults')}</p>;
}
