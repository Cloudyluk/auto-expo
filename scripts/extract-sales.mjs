import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import vm from 'node:vm';

const legacy = execFileSync('git', ['show', '99f4e00:index.html'], { encoding: 'utf8' });
const start = legacy.indexOf('const SALES_ROUTES=');
const end = legacy.indexOf('\nconst PROCUREMENT_TASKS=', start);
if (start < 0 || end < 0) throw new Error('Legacy sales rules were not found.');
const source = legacy.slice(start, end).replace('const SALES_ROUTES=', 'const SALES_ROUTES = ').replace('const SALES_RULES=', 'const SALES_RULES = ');
const context = {};
vm.runInNewContext(`${source}; this.routes = SALES_ROUTES; this.rules = SALES_RULES;`, context);
writeFileSync('src/domain/sales.js', `export const SALES_ROUTES = ${JSON.stringify(context.routes, null, 2)};\nexport const SALES_RULES = ${JSON.stringify(context.rules, null, 2)};\n\nexport function getSalesRouteProducts(routeId) {\n  return Object.entries(SALES_RULES).filter(([, rule]) => rule.routes.includes(routeId)).map(([assemblyId]) => assemblyId);\n}\n\nexport function getSalesRule(assemblyId) {\n  return SALES_RULES[assemblyId];\n}\n`);
