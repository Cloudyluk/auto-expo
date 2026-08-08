#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'exhibitions.js');
const source = fs.readFileSync(dataPath, 'utf8');
const match = source.match(/const EXHIBITIONS = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Unable to find EXHIBITIONS data.');

const exhibitions = Function(`"use strict"; return ${match[1]}`)();
function canonicalName(name) {
  return (name || '').toLowerCase().replace(/20\d{2}/g, '').replace(/[（(][^）)]*[）)]/g, '').replace(/[【】\[\]·\s-]/g, '').replace(/第\d+届/g, '');
}
function year(event) { return event.year || (event.sortDate >= 10000000 ? Math.floor(event.sortDate / 10000) : 2026); }
function identity(event) { return `${canonicalName(event.name)}|${year(event)}|${event.sortDate}`; }
function score(event) {
  return ['address', 'source', 'audience', 'buyerValue', 'sellerValue', 'sellerTargets', 'marketUse', 'vertical', 'sc']
    .reduce((total, field) => total + (event[field] && (!Array.isArray(event[field]) || event[field].length) ? 1 : 0), 0);
}
function mergeField(best, group, field) {
  if (best[field] !== undefined && best[field] !== '') return;
  const donor = group.find(event => event[field] !== undefined && event[field] !== '');
  if (donor) best[field] = donor[field];
}

const groups = new Map();
for (const event of exhibitions) {
  const key = identity(event);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(event);
}

const merged = [];
for (const group of groups.values()) {
  const best = { ...[...group].sort((a, b) => score(b) - score(a))[0] };
  if (group.length > 1) {
    for (const field of ['address', 'source', 'audience', 'focus', 'status', 'region', 'sc', 'vertical']) mergeField(best, group, field);
    best.relatedCategories = [...new Set(group.flatMap(event => [event.cat, ...(event.relatedCategories || [])]))];
    best.relatedSupplyChains = [...new Set(group.flatMap(event => [event.sc, ...(event.relatedSupplyChains || [])].filter(Boolean)))];
    best.aliases = [...new Set(group.map(event => event.name).filter(name => name !== best.name))];
  }
  merged.push(best);
}

const output = `// Maintained exhibition data source. Update records here, not in index.html.\nconst EXHIBITIONS = ${JSON.stringify(merged, null, 2)};\n\nif (typeof module !== 'undefined') module.exports = { EXHIBITIONS };\n`;
fs.writeFileSync(dataPath, output);
console.log(`Merged ${exhibitions.length - merged.length} duplicate records; ${merged.length} primary records remain.`);
