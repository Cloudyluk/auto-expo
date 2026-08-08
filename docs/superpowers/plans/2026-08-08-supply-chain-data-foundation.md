# Supply Chain Data Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the exhibition library’s supply-chain classification from page-only inference into a maintainable data foundation for buyer and seller guidance.

**Architecture:** Keep the static GitHub Pages architecture. Add a dedicated taxonomy and decision-guidance script loaded before `index.html`’s existing application script, then let the existing `normalizeRecord()` merge its stable rules into every exhibition. Add a Node data-audit script that reads the current embedded array without evaluating page-rendering code, so each future data update can be verified locally.

**Tech Stack:** Static HTML, vanilla JavaScript, Node.js built-in modules, GitHub Pages.

## Global Constraints

- Keep `index.html` deployable as a standalone GitHub Pages page.
- Do not edit, rename, move, or delete any content under `sources/`.
- Preserve the existing 36 theme categories and the 2026 / 2027 display split.
- Use official exhibition data as the preferred source; unknown facts remain explicitly marked for review.
- Do not add a build system or third-party runtime dependency.

---

### Task 1: Add a repeatable data-audit command

**Files:**
- Create: `scripts/audit-exhibitions.js`
- Modify: `docs/DATA_MAINTENANCE.md`

**Interfaces:**
- Consumes: `index.html`, specifically the `const exhibitions = [...]` array.
- Produces: process exit code `0` for valid data, non-zero for validation failures; text report with record count, field coverage, duplicates, 2027 status and country-market conflicts.

- [ ] **Step 1: Write the audit script with an initial failing assertion for the existing duplicate data**

```js
if (duplicates.length > 0) {
  console.error(`Duplicate records: ${duplicates.join(', ')}`);
  process.exitCode = 1;
}
```

- [ ] **Step 2: Run the audit to establish the current baseline**

Run: `node scripts/audit-exhibitions.js`

Expected: non-zero exit with known duplicate names, proving that the script detects the current quality problem.

- [ ] **Step 3: Extend the report with the required field coverage and annual-status checks**

```js
const coverage = ['address', 'source', 'audience', 'buyerValue', 'sellerValue']
  .map((field) => [field, exhibitions.filter((event) => event[field]).length]);
const invalid2027 = exhibitions.filter((event) => event.year === 2027 && event.status !== '2027预告');
```

- [ ] **Step 4: Add an explicit baseline mode so known historical duplicates do not block unrelated updates**

```js
const strict = process.argv.includes('--strict');
if (strict && duplicates.length > 0) process.exitCode = 1;
```

- [ ] **Step 5: Run the audit in normal and strict modes**

Run: `node scripts/audit-exhibitions.js`

Expected: printed baseline report with duplicate list and coverage counts.

Run: `node scripts/audit-exhibitions.js --strict`

Expected: non-zero exit until duplicate consolidation is completed in a later task.

- [ ] **Step 6: Document the command in the data maintenance guide**

Add this exact verification command to the update checklist:

```bash
node scripts/audit-exhibitions.js
```

- [ ] **Step 7: Commit**

```bash
git add scripts/audit-exhibitions.js docs/DATA_MAINTENANCE.md
git commit -m "Add exhibition data audit script"
```

### Task 2: Create the canonical supply-chain taxonomy and buyer-seller guidance rules

**Files:**
- Create: `data/supply-chain-taxonomy.js`
- Modify: `index.html`
- Test: `scripts/audit-exhibitions.js`

**Interfaces:**
- Consumes: exhibition `cat`, `market`, `region` and optional existing `sc` / `vertical` fields.
- Produces: global `SUPPLY_CHAIN_TAXONOMY` with `getSupplyChainProfile(event)` returning `{ sc, vertical, buyerValue, sellerValue, buyerTasks, sellerTargets, marketUse }`.

- [ ] **Step 1: Add a failing taxonomy assertion to the audit script**

```js
const requiredCategories = ['新能源/EV', '汽车半导体/芯片', '汽车电子元器件', '汽车物流', '汽配/汽保'];
for (const category of requiredCategories) {
  if (!SUPPLY_CHAIN_TAXONOMY[category]) throw new Error(`Missing taxonomy for ${category}`);
}
```

- [ ] **Step 2: Verify the assertion currently fails because the taxonomy module does not exist**

Run: `node scripts/audit-exhibitions.js --taxonomy`

Expected: non-zero exit with `Missing taxonomy` or module load error.

- [ ] **Step 3: Create the taxonomy module**

Implement plain JavaScript using this shape:

```js
const SUPPLY_CHAIN_TAXONOMY = {
  '新能源/EV': {
    sc: '三电/新能源',
    vertical: '动力电池/电驱/充换电',
    buyerValue: ['找电池材料', '找Pack设备', '找充电方案'],
    sellerValue: ['接触电池厂', '对接OEM采购', '开发能源与充电客户'],
    buyerTasks: ['供应商开发', '技术选型'],
    sellerTargets: ['OEM', 'Tier1', '电池厂', '充电运营商']
  }
};
```

Cover all 36 existing `cat` values. Use category defaults only; event-specific fields remain authoritative.

- [ ] **Step 4: Load the taxonomy before the existing application script**

Add immediately before the application `<script>` in `index.html`:

```html
<script src="data/supply-chain-taxonomy.js"></script>
```

- [ ] **Step 5: Change `normalizeRecord()` to merge the canonical profile without overwriting specific data**

```js
const profile = getSupplyChainProfile(e);
e.sc ||= profile.sc;
e.vertical ||= profile.vertical;
e.buyerValue ||= profile.buyerValue;
e.sellerValue ||= profile.sellerValue;
e.buyerTasks ||= profile.buyerTasks;
e.sellerTargets ||= profile.sellerTargets;
e.marketUse ||= profile.marketUse[regionLabel(e)] || profile.marketUse.default;
```

- [ ] **Step 6: Run taxonomy and page syntax verification**

Run: `node scripts/audit-exhibitions.js --taxonomy`

Expected: every existing theme category has exactly one taxonomy profile.

Run: `node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d')`

Expected: exit code `0`.

- [ ] **Step 7: Commit**

```bash
git add data/supply-chain-taxonomy.js index.html scripts/audit-exhibitions.js
git commit -m "Add buyer seller supply chain taxonomy"
```

### Task 3: Make buyer-seller guidance visible and searchable

**Files:**
- Modify: `index.html`
- Test: `scripts/audit-exhibitions.js`

**Interfaces:**
- Consumes: normalized `buyerValue`, `sellerValue`, `buyerTasks`, `sellerTargets`, `marketUse` fields.
- Produces: card badges and search matches for buyer/seller decision metadata without changing the existing monthly, domestic, overseas or 2027 result counts.

- [ ] **Step 1: Add a failing browser-data assertion to the audit script**

```js
const missingGuidance = exhibitions.filter((event) => !getSupplyChainProfile(event).buyerValue.length);
if (missingGuidance.length) throw new Error(`Missing buyer guidance for ${missingGuidance.length} records`);
```

- [ ] **Step 2: Add compact guide labels in `expoItem()` and `starCard()`**

Render the first buyer task and seller target only, so cards remain scannable:

```js
<span class="decision-badge">采购：${escapeHtml(e.buyerTasks[0])}</span>
<span class="decision-badge">客户：${escapeHtml(e.sellerTargets[0])}</span>
```

- [ ] **Step 3: Add buyer/seller fields to search matching**

```js
const decisionText = [
  ...(e.buyerValue || []), ...(e.sellerValue || []),
  ...(e.buyerTasks || []), ...(e.sellerTargets || []), e.marketUse || ''
].join(' ').toLowerCase();
return decisionText.includes(q) || existingMatch;
```

- [ ] **Step 4: Verify the page behavior locally**

Run a static server and verify:

1. A battery exhibition shows `采购：供应商开发` and a customer-type badge.
2. Search for `经销商` returns aftermarket and channel-oriented exhibitions.
3. Search for `供应商开发` returns relevant battery, component and manufacturing exhibitions.
4. The 2027 page remains separate from 2026 statistics.

- [ ] **Step 5: Commit**

```bash
git add index.html scripts/audit-exhibitions.js
git commit -m "Show buyer seller exhibition guidance"
```

### Task 4: Record the baseline and next data-cleanup scope

**Files:**
- Modify: `docs/PROJECT_INDEX.md`
- Modify: `docs/PROJECT_BACKLOG.md`
- Modify: `docs/CHANGELOG.md`

**Interfaces:**
- Consumes: audit output and taxonomy coverage from Tasks 1–3.
- Produces: a documented baseline, a dedicated duplicate-consolidation backlog item, and clear readiness criteria for the next V6 item.

- [ ] **Step 1: Update the project index with the audited data baseline**

Record total records, taxonomy coverage, source coverage, address coverage and known duplicate count from the final audit output.

- [ ] **Step 2: Split the backlog into the next independently testable items**

Add these ordered items:

```markdown
- [ ] Consolidate duplicate exhibition master records.
- [ ] Add dedicated buyer/seller task entry points and filters.
- [ ] Add transparent multi-dimensional scoring.
- [ ] Add exhibition detail panels with official action links.
```

- [ ] **Step 3: Add a changelog entry with verification results**

Include the audit command, final field coverage and the commit reference.

- [ ] **Step 4: Run final verification**

Run:

```bash
node scripts/audit-exhibitions.js --taxonomy
node --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d')
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 5: Commit**

```bash
git add docs/PROJECT_INDEX.md docs/PROJECT_BACKLOG.md docs/CHANGELOG.md
git commit -m "Document supply chain data baseline"
```

## Plan Review

| Design requirement | Plan coverage |
|---|---|
| Stable supply-chain layers | Task 2 |
| Buyer/seller decision guidance | Tasks 2–3 |
| Data quality and duplicate visibility | Task 1 |
| Preserve annual split and current site | Tasks 2–3 verification |
| Maintainable project documentation | Task 4 |

The plan contains no placeholder implementation steps. It intentionally defers duplicate record merging, dedicated task-entry pages, transparent scoring and detail panels to separate plans because each is independently reviewable and deployable.
