#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const strict = process.argv.includes('--strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const match = html.match(/const exhibitions = \[(.*?)\n\];/s);

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

function canonicalName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/20\d{2}/g, '')
    .replace(/[（）()【】\[\]·\s-]/g, '')
    .replace(/第\d+届/g, '');
}

const duplicateMap = new Map();
for (const event of exhibitions) {
  const key = canonicalName(event.name);
  if (!duplicateMap.has(key)) duplicateMap.set(key, []);
  duplicateMap.get(key).push(event.name);
}
const duplicates = [...duplicateMap.values()]
  .filter((names) => names.length > 1)
  .map((names) => [...new Set(names)]);

const invalid2027 = exhibitions.filter((event) => event.year === 2027 && event.status !== '2027预告');
const chinaMarketConflicts = exhibitions.filter((event) => chineseLocationPattern.test(event.location || '') && event.market !== '中国');
const coverage = Object.fromEntries(
  coverageFields.map((field) => [field, exhibitions.filter((event) => event[field] !== undefined && event[field] !== '').length])
);

console.log('Exhibition data audit');
console.log(`Records: ${exhibitions.length}`);
console.log(`2027 previews: ${exhibitions.filter((event) => event.year === 2027).length}`);
console.log(`Field coverage: ${JSON.stringify(coverage)}`);
console.log(`Duplicate groups: ${duplicates.length}`);
for (const names of duplicates) console.log(`  duplicate: ${names.join(' | ')}`);
console.log(`Invalid 2027 status: ${invalid2027.length}`);
console.log(`China market conflicts: ${chinaMarketConflicts.length}`);

if (strict && (duplicates.length || invalid2027.length || chinaMarketConflicts.length)) {
  console.error('Strict audit failed. Resolve duplicate, annual-status, and market-conflict findings.');
  process.exitCode = 1;
}
