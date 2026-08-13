import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import vm from 'node:vm';

const legacy = execFileSync('git', ['show', '99f4e00:index.html'], { encoding: 'utf8' });
const start = legacy.indexOf('const BUYER_PATHS=');
const end = legacy.indexOf('\nconst SALES_ROUTES=', start);
if (start < 0 || end < 0) throw new Error('Legacy procurement paths were not found.');

const source = legacy.slice(start + 'const BUYER_PATHS='.length, end);
const buyerPaths = vm.runInNewContext(`(${source.replace(/;\s*$/, '')})`);
writeFileSync('src/domain/paths.js', `// Generated from the preserved pre-refactor procurement paths.\nexport const BUYER_PATHS = ${JSON.stringify(buyerPaths, null, 2)};\n`);
