#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const dataPath = path.join(root, 'data', 'exhibitions.js');
const html = fs.readFileSync(indexPath, 'utf8');
const match = html.match(/const exhibitions = \[(.*?)\n\];/s);

if (!match) throw new Error('Unable to find inline exhibitions array.');

const data = `// Generated from the exhibition data source. Edit this file, not index.html.\nconst EXHIBITIONS = [${match[1]}\n];\n\nif (typeof module !== 'undefined') module.exports = { EXHIBITIONS };\n`;
fs.writeFileSync(dataPath, data);
fs.writeFileSync(indexPath, html.replace(match[0], 'const exhibitions = EXHIBITIONS;'));
console.log(`Extracted exhibitions to ${path.relative(root, dataPath)}.`);
