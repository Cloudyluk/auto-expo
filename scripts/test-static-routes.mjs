import { existsSync, readFileSync, readdirSync } from 'node:fs';

const routes = [
  ['dist/index.html', 'lang="en"'],
  ['dist/zh/index.html', 'lang="zh-CN"'],
  ['dist/es/index.html', 'lang="es"'],
  ['dist/pt/index.html', 'lang="pt-BR"'],
  ['dist/fr/index.html', 'lang="fr-FR"'],
  ['dist/de/index.html', 'lang="de-DE"'],
  ['dist/ja/index.html', 'lang="ja-JP"'],
  ['dist/ko/index.html', 'lang="ko-KR"'],
  ['dist/ar/index.html', 'lang="ar-SA"'],
  ['dist/hi/index.html', 'lang="hi-IN"'],
  ['dist/id/index.html', 'lang="id-ID"'],
  ['dist/ru/index.html', 'lang="ru-RU"'],
  ['dist/it/index.html', 'lang="it-IT"'],
  ['dist/tr/index.html', 'lang="tr-TR"']
];

for (const [path, language] of routes) {
  if (!existsSync(path)) throw new Error(`Missing generated static route: ${path}`);
  if (!readFileSync(path, 'utf8').includes(language)) throw new Error(`Wrong document language in ${path}`);
}

const bundle = readdirSync('dist/assets').find((file) => file.startsWith('main-') && file.endsWith('.js'));
if (!bundle) throw new Error('Missing built JavaScript bundle.');
const bundleText = readFileSync(`dist/assets/${bundle}`, 'utf8');
const expectedBase = process.env.GITHUB_ACTIONS ? '/auto-expo/' : '/';
if (!bundleText.includes('href:t.code===`en`?n:`${n}${t.code}/`') || !bundleText.includes(expectedBase)) {
  throw new Error('Language links or GitHub Pages base path are missing from the production bundle.');
}

console.log('Static locale routes passed.');
