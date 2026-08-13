import { officialName, t } from './translate';

test('English UI dictionary contains procurement match copy', () => {
  expect(t('en', 'procurement.whyMatch')).toBe('Why this match?');
});

test('official English wins, then official original name is retained', () => {
  expect(officialName({ official: { defaultName: '中国名称', names: { en: 'Official English' } } }, 'en')).toBe('Official English');
  expect(officialName({ official: { defaultName: '中国名称', names: {} } }, 'en')).toBe('中国名称');
});
