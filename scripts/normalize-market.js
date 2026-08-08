#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'exhibitions.js');
const source = fs.readFileSync(dataPath, 'utf8');
const match = source.match(/const EXHIBITIONS = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Unable to find EXHIBITIONS data.');
const exhibitions = Function(`"use strict"; return ${match[1]}`)();
const chinaPattern = /中国|北京|上海|广州|深圳|重庆|成都|武汉|天津|苏州|南京|宁波|温州|瑞安|邯郸|永年|济南|青岛|石家庄|长沙|大连|哈尔滨|兰州|西安|沈阳|南昌|福州|佛山|昆山|玉环|广饶|海口|喀什/;
let changed = 0;
for (const event of exhibitions) {
  if (chinaPattern.test(event.location || '') && event.market !== '中国') {
    event.market = '中国';
    changed += 1;
  }
}
fs.writeFileSync(dataPath, `// Maintained exhibition data source. Update records here, not in index.html.\nconst EXHIBITIONS = ${JSON.stringify(exhibitions, null, 2)};\n\nif (typeof module !== 'undefined') module.exports = { EXHIBITIONS };\n`);
console.log(`Normalized ${changed} China market labels.`);
