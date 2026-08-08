#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const strict = process.argv.includes('--strict');
const root = path.resolve(__dirname, '..');
const sourcePath = fs.existsSync(path.join(root, 'data', 'exhibitions.js'))
  ? path.join(root, 'data', 'exhibitions.js')
  : path.join(root, 'index.html');
const source = fs.readFileSync(sourcePath, 'utf8');
const match = source.match(/(?:const EXHIBITIONS|const exhibitions) = \[(.*?)\n\];/s);

if (!match) {
  console.error('Unable to find the exhibitions array in index.html.');
  process.exit(1);
}

let exhibitions;
try {
  exhibitions = Function(`"use strict"; return [${match[1]}];`)();
} catch (error) {
  console.error(`Unable to parse exhibition data: ${error.message}`);
  process.exit(1);
}

const chineseLocationPattern = /中国|北京|上海|广州|深圳|重庆|成都|武汉|天津|苏州|南京|宁波|温州|瑞安|邯郸|永年|济南|青岛|石家庄|长沙|大连|哈尔滨|兰州|西安|沈阳|南昌|福州|佛山|昆山|玉环|广饶|海口|喀什/;
const coverageFields = ['year', 'address', 'sc', 'vertical', 'audience', 'source', 'buyerValue', 'sellerValue', 'sellerTargets', 'marketUse', 'action', 'confidence'];
const requiredFields = ['name', 'month', 'date', 'sortDate', 'location', 'cat', 'market', 'star'];
const missingRequired = exhibitions.filter((event) => requiredFields.some((field) => event[field] === undefined || event[field] === ''));
const invalidSortDates = exhibitions.filter((event) => !Number.isInteger(event.sortDate) || event.sortDate < 100 || event.sortDate > 99999999);
const invalidSources = exhibitions.filter((event) => event.source && !/^https?:\/\//.test(event.source));

function canonicalName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/20\d{2}/g, '')
    .replace(/[（(][^）)]*[）)]/g, '')
    .replace(/[【】\[\]·\s-]/g, '')
    .replace(/第\d+届/g, '');
}

function exhibitionIdentity(event) {
  const year = event.year || (event.sortDate >= 10000000 ? Math.floor(event.sortDate / 10000) : 2026);
  return `${canonicalName(event.name)}|${year}|${event.sortDate}`;
}

const duplicateMap = new Map();
for (const event of exhibitions) {
  const key = exhibitionIdentity(event);
  if (!duplicateMap.has(key)) duplicateMap.set(key, []);
  duplicateMap.get(key).push(`${event.name} (${event.date})`);
}
const duplicates = [...duplicateMap.values()]
  .filter((names) => names.length > 1)
  .map((names) => [...new Set(names)]);

const invalid2027 = exhibitions.filter((event) => event.year === 2027 && event.status !== '2027预告');
const chinaMarketConflicts = exhibitions.filter((event) => chineseLocationPattern.test(event.location || '') && event.market !== '中国');
const coverage = Object.fromEntries(
  coverageFields.map((field) => [field, exhibitions.filter((event) => event[field] !== undefined && event[field] !== '').length])
);

if (process.argv.includes('--taxonomy')) {
  const { SUPPLY_CHAIN_TAXONOMY, getSupplyChainProfile } = require(path.join(root, 'data', 'supply-chain-taxonomy.js'));
  const categories = [...new Set(exhibitions.map((event) => event.cat))];
  const missingTaxonomy = categories.filter((category) => !SUPPLY_CHAIN_TAXONOMY[category]);
  const missingBuyerGuidance = exhibitions.filter((event) => !getSupplyChainProfile(event).buyerValue.length);
  console.log(`Taxonomy categories: ${Object.keys(SUPPLY_CHAIN_TAXONOMY).length}`);
  console.log(`Missing taxonomy categories: ${missingTaxonomy.length}`);
  console.log(`Missing buyer guidance: ${missingBuyerGuidance.length}`);
  if (missingTaxonomy.length) {
    console.error(`Missing taxonomy: ${missingTaxonomy.join(', ')}`);
    process.exitCode = 1;
  }
  if (missingBuyerGuidance.length) {
    console.error(`Missing buyer guidance for: ${missingBuyerGuidance.map((event) => event.name).join(', ')}`);
    process.exitCode = 1;
  }
}

if (process.argv.includes('--geo')) {
  const { CITY_COORDINATES, getExhibitionGeo } = require(path.join(root, 'data', 'exhibition-geo.js'));
  const expectedCities = ['上海', '慕尼黑', '底特律', '曼谷', '东京'];
  const missingCities = expectedCities.filter((city) => !CITY_COORDINATES[city]);
  const current = exhibitions.filter((event) => !event.year || event.year === 2026);
  const covered = current.filter((event) => getExhibitionGeo(event)).length;
  console.log(`Geo coverage: ${covered}/${current.length}`);
  console.log(`Missing expected city coordinates: ${missingCities.length}`);
  if (missingCities.length) { console.error(`Missing city coordinates: ${missingCities.join(', ')}`); process.exitCode = 1; }
}

console.log('Exhibition data audit');
console.log(`Records: ${exhibitions.length}`);
console.log(`2027 previews: ${exhibitions.filter((event) => event.year === 2027).length}`);
console.log(`Field coverage: ${JSON.stringify(coverage)}`);
console.log(`Missing required fields: ${missingRequired.length}`);
console.log(`Invalid sortDate values: ${invalidSortDates.length}`);
console.log(`Invalid source URLs: ${invalidSources.length}`);
console.log(`Duplicate groups: ${duplicates.length}`);
for (const names of duplicates) console.log(`  duplicate: ${names.join(' | ')}`);
console.log(`Invalid 2027 status: ${invalid2027.length}`);
console.log(`China market conflicts: ${chinaMarketConflicts.length}`);

if (strict && (duplicates.length || invalid2027.length || chinaMarketConflicts.length || missingRequired.length || invalidSortDates.length || invalidSources.length)) {
  console.error('Strict audit failed. Resolve duplicate, annual-status, market-conflict, required-field, date, and source findings.');
  process.exitCode = 1;
}
