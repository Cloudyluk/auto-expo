import { EXHIBITIONS, getLocalizedExhibition } from './exhibitions';
import { categoryLabel } from './taxonomy';

test('all exhibitions have stable IDs and official source URLs when a source is known', () => {
  for (const exhibition of EXHIBITIONS) {
    expect(exhibition.id).toMatch(/^[a-z0-9-]+$/);
    expect(exhibition.official.defaultName).toBeTruthy();
  }
});

test('category IDs have an English display label independent of the source language', () => {
  expect(categoryLabel('new-energy-ev', 'en')).toBe('New Energy & EV');
});

test('English content does not fall back to Chinese business copy', () => {
  const record = { official: { defaultName: '展会名', names: {} }, content: { zh: { focus: '中文说明' }, en: {} } };
  expect(getLocalizedExhibition(record, 'en').focus).toBe('English content is being verified.');
});
