import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { CATEGORY_IDS } from '../src/data/taxonomy.js';

const legacy = execFileSync('git', ['show', '99f4e00:index.html'], { encoding: 'utf8' });
const start = legacy.indexOf('const exhibitions = [');
const end = legacy.indexOf('\n];\n\nconst catIcons', start);
if (start < 0 || end < 0) throw new Error('Legacy exhibition array was not found.');

const arraySource = legacy.slice(start + 'const exhibitions = '.length, end + 2);
const legacyExhibitions = vm.runInNewContext(`(${arraySource})`);
const slug = (value, index) => {
  const ascii = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return ascii ? `${ascii}-${index + 1}` : `expo-${String(index + 1).padStart(4, '0')}`;
};
const records = legacyExhibitions.map((event, index) => ({
  id: slug(event.name, index),
  official: { defaultName: event.name, names: { zh: event.name }, url: event.source || '' },
  taxonomy: { categoryId: CATEGORY_IDS[event.cat] || 'automotive-supply-chain', supplyChainId: event.sc || '', countryCode: event.country || '' },
  date: { year: event.year || 2026, month: event.month, label: event.date, sortDate: event.sortDate, status: event.status || '' },
  location: { label: event.location || '', address: event.address || '', region: event.region || '' },
  content: {
    zh: { focus: event.focus || '', audience: event.audience || '', buyerValue: event.buyerValue || [], sellerValue: event.sellerValue || [], buyerTasks: event.buyerTasks || [], sellerTargets: event.sellerTargets || [] },
    en: {}
  },
  matching: { categories: [event.cat, ...(event.relatedCategories || [])].map(category => CATEGORY_IDS[category]).filter(Boolean), keywords: [event.name, event.focus, event.audience, event.vertical, event.sc].filter(Boolean), audiences: event.audience ? [event.audience] : [] },
  meta: { market: event.market || '', star: event.star || 0 }
}));

writeFileSync('src/data/exhibitions.js', `// Generated from the preserved pre-refactor exhibition dataset.\nexport const EXHIBITIONS = ${JSON.stringify(records, null, 2)};\n\nexport function getLocalizedExhibition(record, locale) {\n  const content = record.content[locale] || {};\n  return {\n    name: record.official.names[locale] || record.official.defaultName,\n    focus: content.focus || (locale === 'en' ? 'English content is being verified.' : ''),\n    audience: content.audience || (locale === 'en' ? 'English content is being verified.' : ''),\n    buyerValue: content.buyerValue || [],\n    sellerValue: content.sellerValue || [],\n    buyerTasks: content.buyerTasks || [],\n    sellerTargets: content.sellerTargets || []\n  };\n}\n`);
