import { existsSync, readFileSync } from 'node:fs';

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
  ['dist/id/index.html', 'lang="id-ID"']
];

for (const [path, language] of routes) {
  if (!existsSync(path)) throw new Error(`Missing generated static route: ${path}`);
  if (!readFileSync(path, 'utf8').includes(language)) throw new Error(`Wrong document language in ${path}`);
}

console.log('Static locale routes passed.');
