import en from './en';
import zh from './zh';
import es from './es';
import pt from './pt';
import fr from './fr';
import de from './de';
import ja from './ja';

const dictionaries = { en, zh, es, pt, fr, de, ja };

export function t(locale, key, variables = {}) {
  const value = key.split('.').reduce((current, segment) => current?.[segment], dictionaries[locale]);
  if (typeof value !== 'string') throw new Error(`Missing ${locale} translation: ${key}`);
  return value.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? `{${name}}`);
}

export function officialName(record, locale) {
  return record.official.names[locale] || record.official.defaultName;
}
