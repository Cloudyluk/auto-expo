#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'exhibitions.js');
const source = fs.readFileSync(dataPath, 'utf8');
const match = source.match(/const EXHIBITIONS = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Unable to find EXHIBITIONS data.');
const exhibitions = Function(`"use strict"; return ${match[1]}`)();
const { getOfficialExhibitionUrl } = require(path.join(root, 'data', 'official-exhibition-links.js'));
const { getSupplyChainProfile } = require(path.join(root, 'data', 'supply-chain-taxonomy.js'));

let sources = 0;
let audiences = 0;
let addressPlaceholders = 0;
for (const event of exhibitions) {
  if (!event.source) {
    const url = getOfficialExhibitionUrl(event);
    if (url) { event.source = url; sources += 1; }
  }
  if (!event.audience) {
    const profile = getSupplyChainProfile(event);
    const buyer = (profile.buyerValue || []).slice(0, 2).join('、');
    const seller = (profile.sellerTargets || []).slice(0, 2).join('、');
    event.audience = `${buyer || '供应链采购'}与${seller || '产业客户'}团队`;
    audiences += 1;
  }
  if (!event.address) {
    event.address = `Venue to be confirmed, ${event.location}`;
    event.addressStatus = '待核验';
    addressPlaceholders += 1;
  }
}

fs.writeFileSync(dataPath, `// Maintained exhibition data source. Update records here, not in index.html.\nconst EXHIBITIONS = ${JSON.stringify(exhibitions, null, 2)};\n\nif (typeof module !== 'undefined') module.exports = { EXHIBITIONS };\n`);
console.log(JSON.stringify({ sources, audiences, addressPlaceholders }));
