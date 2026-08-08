# Monthly Exhibition Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static interactive world map that highlights countries and cities with 2026 exhibitions for the selected month and shows the matching exhibition list after a map selection.

**Architecture:** Keep the current single-page static application. Add a dedicated geographic lookup module, use it to aggregate the existing 2026 exhibition records by country and city, and render a responsive inline SVG map without external map tiles or services. The map writes selection state into the existing monthly rendering flow rather than duplicating exhibition data.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, SVG, Node.js built-in modules, GitHub Pages.

## Global Constraints

- Keep `index.html` deployable as a standalone GitHub Pages page.
- Do not edit, rename, move, or delete any content under `sources/`.
- Render only 2026 main data on the monthly map; 2027 previews remain separate.
- Do not introduce external map services, map API keys, remote map tiles, or third-party runtime dependencies.
- Preserve the existing monthly tabs, display counts, domestic/overseas pages, search and theme switching.

---

### Task 1: Add maintainable country and city geographic lookup data

**Files:**
- Create: `data/exhibition-geo.js`
- Modify: `index.html`
- Modify: `scripts/audit-exhibitions.js`

**Interfaces:**
- Consumes: `event.location`, `event.market`, `event.region`, `event.year` and `event.month`.
- Produces: global `getExhibitionGeo(event)` returning `{ country, city, latitude, longitude, precision }` or `null`.

- [ ] **Step 1: Add a failing geo-audit mode for selected known cities**

```js
const expectedCities = ['上海', '慕尼黑', '底特律', '曼谷', '东京'];
for (const city of expectedCities) {
  if (!CITY_COORDINATES[city]) throw new Error(`Missing coordinate for ${city}`);
}
```

- [ ] **Step 2: Run the audit and confirm it fails before the module exists**

Run: `node scripts/audit-exhibitions.js --geo`

Expected: non-zero exit with a missing-module or missing-city error.

- [ ] **Step 3: Create `data/exhibition-geo.js`**

Use this public interface:

```js
function getExhibitionGeo(event) {
  // Returns city coordinates when a supported city is found.
  // Falls back to country center with precision: 'country'.
  // Returns null only when the country cannot be inferred.
}
```

Include a city lookup for every city currently used by the 2026 data where possible, plus country centers for all supported regions. Export to `globalThis` and `module.exports`, following `data/supply-chain-taxonomy.js`.

- [ ] **Step 4: Load the geo module before the existing application script**

```html
<script src="data/exhibition-geo.js"></script>
```

- [ ] **Step 5: Extend the audit command with geo coverage**

```js
const currentYear = exhibitions.filter((event) => !event.year || event.year === 2026);
const geoCoverage = currentYear.filter((event) => getExhibitionGeo(event)).length;
console.log(`Geo coverage: ${geoCoverage}/${currentYear.length}`);
```

- [ ] **Step 6: Verify the module and page script**

Run:

```bash
node scripts/audit-exhibitions.js --geo
node --check data/exhibition-geo.js
node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d')
```

Expected: every supported 2026 exhibition resolves to at least a country center and all expected cities resolve at city precision.

- [ ] **Step 7: Commit**

```bash
git add data/exhibition-geo.js index.html scripts/audit-exhibitions.js
git commit -m "Add exhibition geographic lookup"
```

### Task 2: Render the monthly SVG map and aggregate city markers

**Files:**
- Modify: `index.html`
- Test: `scripts/audit-exhibitions.js`

**Interfaces:**
- Consumes: `getExhibitionGeo(event)`, `currentExhibitions()`, `curMonth`.
- Produces: `getMonthlyMapGroups(month)` returning arrays of `{ key, country, city, latitude, longitude, events }`; `renderMonthlyMap()` that updates `#monthlyMap`.

- [ ] **Step 1: Add the monthly-map container above the existing monthly event list**

```html
<div class="monthly-map-shell">
  <div class="monthly-map-header">
    <span>当月全球展会分布</span>
    <button id="clearMapSelection" type="button" onclick="clearMapSelection()" hidden>清除地图筛选</button>
  </div>
  <div id="monthlyMap" class="monthly-map" aria-live="polite"></div>
  <div id="mapSelectionSummary" class="month-count" hidden></div>
  <div id="mapSelectionContent" class="expo-list" hidden></div>
</div>
```

- [ ] **Step 2: Add stable responsive CSS for the map and markers**

```css
.monthly-map { min-height: 300px; aspect-ratio: 2 / 1; overflow: hidden; }
.map-marker { min-width: 24px; min-height: 24px; }
@media (max-width: 700px) { .monthly-map { min-height: 220px; } }
```

Use CSS variables already defined in the page and do not let map labels resize the map.

- [ ] **Step 3: Add a simplified inline SVG world silhouette and projection helper**

Use a fixed equirectangular projection:

```js
function projectGeo(latitude, longitude) {
  return { x: ((longitude + 180) / 360) * 1000, y: ((90 - latitude) / 180) * 500 };
}
```

The SVG must include a visible world outline, accessible marker buttons, and a legend that explains the highlighted country and city-count markers.

- [ ] **Step 4: Aggregate current-month events by country and city**

```js
function getMonthlyMapGroups(month) {
  const groups = new Map();
  currentExhibitions().filter((event) => getMonth(event) === month).forEach((event) => {
    const geo = getExhibitionGeo(event);
    if (!geo) return;
    const key = `${geo.country}:${geo.city || '国家中心'}`;
    if (!groups.has(key)) groups.set(key, { key, ...geo, events: [] });
    groups.get(key).events.push(event);
  });
  return [...groups.values()];
}
```

- [ ] **Step 5: Render the map when the monthly page initializes and whenever the month changes**

Call `renderMonthlyMap()` from `renderMonthTabs()` and `selectMonth(m)`. The current month tab and existing list behavior must remain intact.

- [ ] **Step 6: Verify map aggregation with the audit command and local page**

Run: `node scripts/audit-exhibitions.js --geo`

Expected: the audit reports a non-zero geo coverage and no missing expected city coordinates.

Start a local server and check that August and November render city markers without a JavaScript error.

- [ ] **Step 7: Commit**

```bash
git add index.html scripts/audit-exhibitions.js
git commit -m "Render monthly exhibition world map"
```

### Task 3: Connect map clicks to the selected-month exhibition list

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: map group key and `events` array from `getMonthlyMapGroups(month)`.
- Produces: `selectMapGroup(key)`, `clearMapSelection()` and filtered map-selection content without mutating the normal monthly list.

- [ ] **Step 1: Add map selection state**

```js
let selectedMapGroupKey = '';
```

- [ ] **Step 2: Render clickable country and city targets**

Each city marker is a button with:

```html
<button class="map-marker" type="button" aria-label="德国 慕尼黑，3场展会" onclick="selectMapGroup('德国:慕尼黑')">3</button>
```

Country targets select all grouped events in that country; city markers select the city group only.

- [ ] **Step 3: Render the selected group below the map**

```js
function selectMapGroup(key) {
  selectedMapGroupKey = key;
  const group = getMonthlyMapGroups(curMonth).find((item) => item.key === key);
  const content = document.getElementById('mapSelectionContent');
  document.getElementById('mapSelectionSummary').textContent = `${group.country} ${group.city || ''} · ${group.events.length} 场展会`;
  content.innerHTML = group.events.sort((a, b) => a.sortDate - b.sortDate).map(expoItem).join('');
  content.hidden = false;
}
```

`clearMapSelection()` clears the state, hides the selected list, and restores the existing monthly list unchanged.

- [ ] **Step 4: Reset selection when the user switches month**

Set `selectedMapGroupKey = ''` before rendering the next month’s map and hide selection content.

- [ ] **Step 5: Perform browser interaction verification**

Verify all of the following:

1. A visible marker appears for a known event city in the selected month.
2. Clicking that marker displays only the matching city events.
3. Switching month removes the prior selection and redraws marker counts.
4. 2027 previews do not appear on the map.
5. Mobile width does not overlap month tabs, map labels, or event cards.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Filter monthly exhibitions from map markers"
```

### Task 4: Document the map data baseline and upkeep process

**Files:**
- Modify: `docs/PROJECT_INDEX.md`
- Modify: `docs/DATA_MAINTENANCE.md`
- Modify: `docs/CHANGELOG.md`

**Interfaces:**
- Consumes: audit coverage produced by `scripts/audit-exhibitions.js --geo`.
- Produces: documented map scope, geo-data maintenance instructions, and a release record.

- [ ] **Step 1: Add the map to the project capability list**

Document that it covers 2026 monthly data only and uses city coordinates with country-level fallback.

- [ ] **Step 2: Add geographic update rules to the data maintenance guide**

Require new city names to be added to `data/exhibition-geo.js`; unknown cities fall back to country centers until verified.

- [ ] **Step 3: Add the final audit coverage and browser checks to the changelog**

Record the exact geo coverage reported at release time, plus the months checked interactively.

- [ ] **Step 4: Run final verification**

Run:

```bash
node scripts/audit-exhibitions.js --geo
node scripts/audit-exhibitions.js --taxonomy
node --check data/exhibition-geo.js
node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d')
git diff --check
```

Expected: all commands exit `0`; the audit may report known duplicate and source-market findings but must not report a map-module failure.

- [ ] **Step 5: Commit**

```bash
git add docs/PROJECT_INDEX.md docs/DATA_MAINTENANCE.md docs/CHANGELOG.md
git commit -m "Document monthly exhibition map"
```

## Plan Review

| Design requirement | Plan coverage |
|---|---|
| Static GitHub Pages map | Tasks 1–2 |
| Month-sensitive country and city highlights | Task 2 |
| Click to show monthly exhibition list | Task 3 |
| Keep 2027 separate | Tasks 1–3 verification |
| Maintainable geography data | Tasks 1 and 4 |
| Desktop and mobile safety | Tasks 2–3 verification |

The plan deliberately defers polygon-level national boundaries and paid map services; the SVG silhouette, country target zones and city markers provide the requested interaction while preserving static-site reliability.
