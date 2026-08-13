# Static Multilingual Automotive Exhibition Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file site with a GitHub Pages-compatible Vite + React application that publishes a complete English default site and complete Chinese site, with controlled-language exhibition content and visible placeholders for future languages.

**Architecture:** Keep exhibition, supply-chain, procurement, and sales matching logic locale-neutral through IDs and structured matching fields. Move display strings to locale packages and per-record localized content. Build the same React route tree for `/` (English) and `/zh/` (Chinese); unavailable locale choices are rendered as disabled `Coming soon` entries.

**Tech Stack:** Vite, React, JavaScript modules, Vitest, React Testing Library, static GitHub Pages deployment.

## Global Constraints

- English is the default route `/`; Chinese is `/zh/`.
- All English user-visible UI and business content is English; only an `officialName` may retain a non-English official name when no official English name is available.
- Chinese exhibition names use official Chinese when available; English exhibition names use the organizer's official English name when available.
- OEM, Tier 1, Tier 2, BMS, PACK, ADAS, PPAP, IATF 16949, FMEA, SiC, APQP, SOP, ECU, VCU, SDV, SOTIF, and SQE are controlled terms and must not be rewritten.
- Procurement matching remains `keywords + category + focus/audience + procurement task`; locale cannot influence match ranking.
- Preserve GitHub Pages static deployment; add no server, authentication, CMS, purchase, RFQ, or payment flow.
- Future language menu entries: Español, Português, Français, Deutsch, 日本語, 한국어, العربية, हिन्दी, Bahasa Indonesia, Русский, Italiano, Türkçe. They display `Coming soon` and are disabled.

---

### Task 1: Establish the static React application and GitHub Pages build contract

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/styles/global.css`
- Create: `src/test/setup.js`
- Create: `index.html`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`
- Test: `src/App.test.jsx`

**Interfaces:**
- Produces `mountApp(root, { pathname })` from `src/main.jsx` for browser and test bootstrapping.
- Produces `App({ pathname })`, which chooses a locale from the path but does not contain exhibition business data.

- [ ] **Step 1: Write the failing app-route test**

```jsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders English at the root route and Chinese at /zh/', () => {
  const { rerender } = render(<App pathname="/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('Global map');
  rerender(<App pathname="/zh/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('全球地图');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/App.test.jsx`

Expected: FAIL because the Vite React application does not exist.

- [ ] **Step 3: Add Vite, React, Vitest, the app mount, and a minimal locale-aware shell**

```jsx
export function App({ pathname = window.location.pathname }) {
  const locale = pathname.startsWith('/zh') ? 'zh' : 'en';
  return <main data-locale={locale}><nav>{locale === 'en' ? 'Global map' : '全球地图'}</nav></main>;
}
```

Configure `vite.config.js` with `base: process.env.GITHUB_ACTIONS ? '/auto-expo/' : '/'`; configure GitHub Actions to build `npm run build` and publish `dist` via `actions/upload-pages-artifact` and `actions/deploy-pages`.

- [ ] **Step 4: Run the route test and production build**

Run: `npm test -- --run src/App.test.jsx && npm run build`

Expected: PASS and a `dist/` directory with static assets.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.js index.html src .github/workflows/deploy-pages.yml README.md
git commit -m "feat: scaffold static multilingual React site"
```

### Task 2: Define locale registry, UI dictionaries, and official-name fallback

**Files:**
- Create: `src/i18n/locales.js`
- Create: `src/i18n/en.js`
- Create: `src/i18n/zh.js`
- Create: `src/i18n/translate.js`
- Test: `src/i18n/translate.test.js`

**Interfaces:**
- `SUPPORTED_LOCALES` is `['en', 'zh']`.
- `LANGUAGE_MENU` contains every released and placeholder language with `{ code, label, status }`.
- `t(locale, key, variables?)` returns a string and throws for a missing released-language key in development.
- `officialName(record, locale)` returns `record.official.names[locale] || record.official.defaultName`.

- [ ] **Step 1: Write failing dictionary and name fallback tests**

```js
import { officialName, t } from './translate';

test('English UI dictionary contains procurement match copy', () => {
  expect(t('en', 'procurement.whyMatch')).toBe('Why this match?');
});

test('official English wins, then official original name is retained', () => {
  expect(officialName({ official: { defaultName: '中国名称', names: { en: 'Official English' } } }, 'en')).toBe('Official English');
  expect(officialName({ official: { defaultName: '中国名称', names: {} } }, 'en')).toBe('中国名称');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run src/i18n/translate.test.js`

Expected: FAIL because locale modules are absent.

- [ ] **Step 3: Implement complete UI dictionaries and language menu**

Include keys for document title, brand, every navigation item, headings, button labels, map controls, search, filters, category/country labels, empty states, procurement/sales labels, match explanation labels, ARIA labels, and `Coming soon`. Use `Why this match?`, `Preliminary match based on the information available.`, `No exhibitions match your current filters.`, `No matches found based on the information provided.`, and `We couldn't load the results.` verbatim in English.

- [ ] **Step 4: Run tests**

Run: `npm test -- --run src/i18n/translate.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n
git commit -m "feat: add controlled locale dictionaries"
```

### Task 3: Migrate exhibition and taxonomy data into locale-neutral records with Chinese and English content

**Files:**
- Create: `src/data/exhibitions.js`
- Create: `src/data/taxonomy.js`
- Create: `src/data/localized-content.js`
- Create: `src/data/official-names.js`
- Modify: `data/supply-chain-taxonomy.js`
- Modify: `data/official-exhibition-links.js`
- Test: `src/data/exhibitions.test.js`

**Interfaces:**
- `EXHIBITIONS` is an array of normalized records with `id`, `official`, `taxonomy`, `date`, `location`, `content`, and `matching`.
- `getLocalizedExhibition(exhibition, locale)` returns `{ name, focus, audience, buyerValue, sellerValue }`; it never falls back from English content to Chinese content.
- `CATEGORY_LABELS[locale][categoryId]`, `COUNTRY_LABELS[locale][countryCode]`, and `SUPPLY_CHAIN_LABELS[locale][supplyChainId]` provide display strings.

- [ ] **Step 1: Write failing data invariants**

```js
import { EXHIBITIONS, getLocalizedExhibition } from './exhibitions';

test('all exhibitions have stable IDs and official source URLs when a source is known', () => {
  for (const exhibition of EXHIBITIONS) {
    expect(exhibition.id).toMatch(/^[a-z0-9-]+$/);
    expect(exhibition.official.defaultName).toBeTruthy();
  }
});

test('English content does not fall back to Chinese business copy', () => {
  const record = { official: { defaultName: '展会名', names: {} }, content: { zh: { focus: '中文说明' }, en: {} } };
  expect(getLocalizedExhibition(record, 'en').focus).toBe('English content is being verified.');
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/data/exhibitions.test.js`

Expected: FAIL because normalized localized records do not exist.

- [ ] **Step 3: Convert current exhibition records systematically**

Move records from the existing `index.html` into `EXHIBITIONS`. Preserve source URLs, date facts, locations, category relationships, stars, status, audience, supply-chain fields, and matching keywords. Populate `official.names.en` from organizer official English names; populate `official.names.zh` when official Chinese is present. Use the three completed review outputs to author English `focus`, `audience`, buyer, seller, and procurement content with controlled automotive terminology. Do not invent English names for events lacking organizer English naming.

- [ ] **Step 4: Run data tests and the existing data audit**

Run: `npm test -- --run src/data/exhibitions.test.js && node scripts/audit-exhibitions.js`

Expected: PASS; audit identifies no newly broken known official links.

- [ ] **Step 5: Commit**

```bash
git add src/data data/supply-chain-taxonomy.js data/official-exhibition-links.js
git commit -m "feat: localize exhibition and taxonomy data"
```

### Task 4: Extract locale-neutral procurement and sales decision services

**Files:**
- Create: `src/domain/procurement.js`
- Create: `src/domain/sales.js`
- Create: `src/domain/paths.js`
- Test: `src/domain/procurement.test.js`
- Test: `src/domain/sales.test.js`

**Interfaces:**
- `getProcurementEventMatch(event, assembly, taskId)` returns `{ score, precise, keywordMatches, taskEvidence, categoryMatch }`.
- `getProcurementAssemblyEvents(events, assembly, taskId)` returns matching records only.
- `rankProcurementEvents(matches, assembly, taskId)` sorts without accessing locale display strings.
- `getSalesRouteProducts(routeId)` and `getSalesRule(assemblyId)` expose existing sales decisions by ID.

- [ ] **Step 1: Port current procurement contract tests as module tests**

```js
import { getProcurementEventMatch } from './procurement';

test('a match requires assembly evidence plus category or task evidence', () => {
  const result = getProcurementEventMatch(
    { categoryId: 'thermal', matching: { keywords: ['HVAC'], topics: ['technology'] } },
    { categoryIds: ['thermal'], keywords: ['HVAC'] },
    'technology'
  );
  expect(result.precise).toBe(true);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/domain/procurement.test.js src/domain/sales.test.js`

Expected: FAIL because domain modules are absent.

- [ ] **Step 3: Move the existing matching and sales rules without translating identifiers**

Convert category strings and task strings to IDs; keep the existing score behavior. Return match facts only; localized reasons and task text are rendered by components using language data.

- [ ] **Step 4: Run domain and legacy contracts**

Run: `npm test -- --run src/domain/procurement.test.js src/domain/sales.test.js && node scripts/test-procurement-decisions.js && node scripts/test-country-browser.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain src/data scripts
git commit -m "refactor: isolate locale-neutral decision services"
```

### Task 5: Implement shared application shell, language navigation, and all discovery views

**Files:**
- Create: `src/components/AppShell.jsx`
- Create: `src/components/LanguageMenu.jsx`
- Create: `src/components/ExhibitionCard.jsx`
- Create: `src/components/FilterChips.jsx`
- Create: `src/pages/OverviewPage.jsx`
- Create: `src/pages/MonthlyPage.jsx`
- Create: `src/pages/CategoryPage.jsx`
- Create: `src/pages/CountryPage.jsx`
- Create: `src/pages/StarredPage.jsx`
- Create: `src/pages/PreviewPage.jsx`
- Test: `src/components/LanguageMenu.test.jsx`
- Test: `src/components/ExhibitionCard.test.jsx`

**Interfaces:**
- `AppShell({ locale, children })` owns document language/title, navigation, language menu, theme control, and search entry point.
- `ExhibitionCard({ exhibition, locale, decision? })` uses `officialName` and `getLocalizedExhibition`; it never reads raw Chinese display fields.
- `LanguageMenu({ locale })` links `en` to `/` and `zh` to `/zh/`; placeholders are disabled.

- [ ] **Step 1: Write failing English card and menu tests**

```jsx
test('English card uses official English and English focus', () => {
  render(<ExhibitionCard locale="en" exhibition={fixture} />);
  expect(screen.getByText('Official English')).toBeInTheDocument();
  expect(screen.queryByText('中文主题')).not.toBeInTheDocument();
});

test('future locales are visible but disabled', () => {
  render(<LanguageMenu locale="en" />);
  expect(screen.getByText('Español')).toHaveAttribute('aria-disabled', 'true');
  expect(screen.getByText('Coming soon')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/components/LanguageMenu.test.jsx src/components/ExhibitionCard.test.jsx`

Expected: FAIL because shared components do not exist.

- [ ] **Step 3: Build components and migrate discovery pages**

Render metrics, featured exhibitions, monthly timeline, category filters, country filters, starred exhibitions, and 2027 preview through localized labels and localized record content. Keep the existing visual layout and light/dark theme. Use language-aware sorting but keep filter state in IDs.

- [ ] **Step 4: Run component tests and build**

Run: `npm test -- --run src/components/LanguageMenu.test.jsx src/components/ExhibitionCard.test.jsx && npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/pages src/styles
git commit -m "feat: add localized exhibition discovery views"
```

### Task 6: Implement localized procurement and sales routes with per-exhibition explanations

**Files:**
- Create: `src/pages/ProcurementPage.jsx`
- Create: `src/pages/ProcurementDetailPage.jsx`
- Create: `src/pages/SalesPage.jsx`
- Create: `src/pages/SalesDetailPage.jsx`
- Create: `src/components/MatchDecision.jsx`
- Test: `src/pages/ProcurementDetailPage.test.jsx`
- Test: `src/pages/SalesDetailPage.test.jsx`

**Interfaces:**
- `ProcurementDetailPage({ locale, assemblyId, taskId })` consumes `rankProcurementEvents` and presents localized decision output.
- `MatchDecision({ locale, match, assembly, task })` renders `Why this match?`, `What to obtain onsite`, `When not to attend`, and `Alternative action` from localized templates and match facts.
- `SalesDetailPage({ locale, assemblyId, routeId })` renders localized buyer, specifier, sales-mode, and partner labels.

- [ ] **Step 1: Write failing English decision-page tests**

```jsx
test('English procurement detail has no Chinese explanatory copy', () => {
  render(<ProcurementDetailPage locale="en" assemblyId="thermal" taskId="supplier" />);
  expect(screen.getByText('Why this match?')).toBeInTheDocument();
  expect(screen.queryByText(/为什么去|现场要拿到什么/)).not.toBeInTheDocument();
});

test('sales detail labels direct customers in English', () => {
  render(<SalesDetailPage locale="en" assemblyId="thermal" routeId="production" />);
  expect(screen.getByText('Direct customers')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/pages/ProcurementDetailPage.test.jsx src/pages/SalesDetailPage.test.jsx`

Expected: FAIL because localized decision pages do not exist.

- [ ] **Step 3: Implement all buyer and sales paths**

Migrate ICE, electrified, and cross-functional procurement assemblies. Render task selector, decision evidence, focus, audience, caveats, and alternatives with approved English. Migrate the sales routes and product details. Keep all existing IDs and the procurement match behavior from Task 4.

- [ ] **Step 4: Run tests**

Run: `npm test -- --run src/pages/ProcurementDetailPage.test.jsx src/pages/SalesDetailPage.test.jsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages src/components src/i18n src/data
git commit -m "feat: localize procurement and sales decision paths"
```

### Task 7: Migrate the interactive map, search, and accessibility text

**Files:**
- Create: `src/pages/MapPage.jsx`
- Create: `src/components/GlobalSearch.jsx`
- Create: `src/services/map.js`
- Test: `src/pages/MapPage.test.jsx`
- Test: `src/components/GlobalSearch.test.jsx`

**Interfaces:**
- `MapPage({ locale })` exposes zoom, reset, country selection, and localizes marker tooltip/result labels.
- `GlobalSearch({ locale, exhibitions })` searches locale-specific content plus official names, while rendering only current-locale labels.
- `map.js` exports `projectGeo`, `geometryToPath`, and `getMonthlyMapGroups`.

- [ ] **Step 1: Write failing interaction and English text tests**

```jsx
test('English map control and result summary are localized', () => {
  render(<MapPage locale="en" />);
  expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
  expect(screen.getByText(/Global exhibition distribution/)).toBeInTheDocument();
});

test('English search returns official English name without Chinese fallback text', async () => {
  render(<GlobalSearch locale="en" exhibitions={[fixture]} />);
  await userEvent.type(screen.getByRole('textbox'), 'Official English');
  expect(screen.getByText('Official English')).toBeInTheDocument();
  expect(screen.queryByText('中文主题')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/pages/MapPage.test.jsx src/components/GlobalSearch.test.jsx`

Expected: FAIL because map and search modules do not exist.

- [ ] **Step 3: Port map and search behavior**

Keep external GeoJSON loading behavior and the current selection/zoom interaction. Localize all status, tooltips, controls, errors, and ARIA labels. Search against `officialName`, localized focus/audience, and stable taxonomy terms; do not render Chinese fallback content in English.

- [ ] **Step 4: Run interaction tests and production build**

Run: `npm test -- --run src/pages/MapPage.test.jsx src/components/GlobalSearch.test.jsx && npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MapPage.jsx src/components/GlobalSearch.jsx src/services/map.js src/i18n
git commit -m "feat: localize map search and accessibility text"
```

### Task 8: Add English-residue audit, static-route verification, visual QA, and remove legacy page code

**Files:**
- Create: `scripts/test-english-residue.js`
- Create: `scripts/test-static-routes.js`
- Modify: `package.json`
- Delete: legacy inline data and behavior from `index.html`
- Modify: `docs/DATA_MAINTENANCE.md`
- Modify: `docs/PROJECT_PROGRESS.md`
- Test: `src/App.test.jsx`

**Interfaces:**
- `npm run test:english` fails if rendered English text includes Han characters outside `officialName` nodes marked `data-official-name="true"`.
- `npm run test:routes` verifies `/` and `/zh/` entry points exist in `dist` and reference correct document language metadata.
- `npm run verify` runs unit tests, procurement/country contracts, English audit, static-route verification, and production build.

- [ ] **Step 1: Write the failing residue audit fixture**

```js
const html = '<main><p>Why this match?</p><span>中文说明</span></main>';
expect(findUnexpectedHan(html)).toEqual(['中文说明']);
expect(findUnexpectedHan('<span data-official-name="true">中文展会名</span>')).toEqual([]);
```

- [ ] **Step 2: Run the audit test to verify failure**

Run: `node scripts/test-english-residue.js`

Expected: FAIL against a fixture containing unmarked Chinese business text.

- [ ] **Step 3: Implement verification scripts and remove legacy implementation**

Use `data-official-name="true"` exclusively around `officialName()` output. Render English and Chinese routes in the test environment, inspect text nodes, and fail unapproved Chinese in English. Remove all runtime string-replacement code and the legacy giant `index.html` dataset after React pages cover every current feature. Update maintenance documentation with the required localized-field and review workflow.

- [ ] **Step 4: Run complete verification**

Run: `npm run verify && node scripts/test-procurement-decisions.js && node scripts/test-country-browser.js`

Expected: PASS.

- [ ] **Step 5: Visual and interaction verification**

Run the built site through the in-app browser at desktop and mobile widths. Verify `/` and `/zh/`, language navigation, filters, map selection/zoom, search, procurement task switching, sales detail navigation, official external links, dark/light theme, and future-language disabled behavior. Capture screenshots and confirm English content has no non-official Chinese text.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts docs index.html src
git commit -m "feat: ship audited English and Chinese static sites"
```
