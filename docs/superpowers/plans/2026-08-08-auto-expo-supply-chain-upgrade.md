# Auto Expo Supply Chain Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair current exhibition library data quality and add a supply-chain expert roadmap for the next product iteration.

**Architecture:** Keep the current static single-file site working on GitHub Pages. Add low-risk normalization helpers and richer display badges around the existing exhibition array instead of doing a large framework migration.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, GitHub Pages.

## Global Constraints

- Do not edit ChatGPT synced project sources.
- Keep `index.html` deployable as a standalone static file.
- Do not introduce a build step in this repair pass.
- Keep existing navigation and visual language stable.

---

### Task 1: Repair Data Trust Signals

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `exhibitions` array records.
- Produces: normalized display helpers used by every page render.

- [ ] Add `isChinaLocation()`, `normalizeRecord()`, and `normalizeExhibitions()` after helper declarations.
- [ ] Correct China/Hong Kong/Taiwan location records that were accidentally marked as overseas at runtime.
- [ ] Replace hard-coded search count text with `exhibitions.length`.
- [ ] Verify domestic/overseas counts no longer classify China-based events as overseas.

### Task 2: Add Missing Overseas Events

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing record shape `{month,name,cat,date,sortDate,location,focus,market,star}`.
- Produces: additional overseas records that render automatically in overview, month, category, overseas and search pages.

- [ ] Add Automechanika Ho Chi Minh City 2026.
- [ ] Add Automechanika Istanbul 2026.
- [ ] Add The Battery Show North America 2026.
- [ ] Add Power2Drive Europe 2026.
- [ ] Add AutoSens Europe 2026.
- [ ] Add MOVE America 2026.
- [ ] Add Automotive Manufacturing Thailand 2026 with date review note.
- [ ] Add JSAE Automotive Engineering Exposition Yokohama 2026.
- [ ] Add JSAE Automotive Engineering Exposition Nagoya 2026.
- [ ] Add Automotive Parts Expo Warsaw 2026.

### Task 3: Add Supply Chain Decision Layer

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: category, focus, location and optional `sc`, `audience`, `region`, `status`, `source` fields.
- Produces: badges visible on cards and searchable decision metadata.

- [ ] Add `supplyChainLabel()` for category-to-supply-chain-stage mapping.
- [ ] Add `regionLabel()` for overseas grouping and search metadata.
- [ ] Add compact badges to `expoItem()` and `starCard()`.
- [ ] Include `sc`, `audience`, `region`, and `status` in search matching.

### Task 4: Project Roadmap Document

**Files:**
- Create: `docs/auto-expo-supply-chain-roadmap.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: current product state and supply-chain expert recommendations.
- Produces: a project-level roadmap for data model, scoring, features, QA and release phases.

- [ ] Document current issues fixed in this pass.
- [ ] Define the target data model for supply-chain decision making.
- [ ] Define scoring dimensions and recommended filters.
- [ ] Define phased roadmap: data trust, decision layer, sourcing workflow, collaboration/export.
- [ ] Link the roadmap from README.

### Task 5: Verification

**Files:**
- Verify: `index.html`

**Interfaces:**
- Consumes: updated static page.
- Produces: browser and data-quality evidence.

- [ ] Run a syntax/data extraction check with Node.
- [ ] Start a local static server.
- [ ] Validate page load, search, domestic page, overseas page and category filters.
- [ ] Capture desktop and mobile screenshots.
