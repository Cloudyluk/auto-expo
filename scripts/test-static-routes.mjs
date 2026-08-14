import { existsSync, readFileSync } from 'node:fs';

const routes = [
  ['dist/index.html', 'lang="en"'],
  ['dist/zh/index.html', 'lang="zh-CN"'],
  ['dist/es/index.html', 'lang="es"'],
  ['dist/pt/index.html', 'lang="pt-BR"'],
  ['dist/fr/index.html', 'lang="fr-FR"'],
  ['dist/de/index.html', 'lang="de-DE"']
];

for (const [path, language] of routes) {
  if (!existsSync(path)) throw new Error(`Missing generated static route: ${path}`);
  if (!readFileSync(path, 'utf8').includes(language)) throw new Error(`Wrong document language in ${path}`);
}

console.log('Static locale routes passed.');
