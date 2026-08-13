const labels = {
  en: 'Global map',
  zh: '全球地图'
};

export function App({ pathname = window.location.pathname }) {
  const locale = pathname.startsWith('/zh') ? 'zh' : 'en';

  return (
    <main data-locale={locale}>
      <nav aria-label="Primary navigation">{labels[locale]}</nav>
    </main>
  );
}
