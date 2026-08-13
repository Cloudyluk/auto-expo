import { getProcurementEventMatch } from './procurement';

test('a match requires assembly evidence plus category or task evidence', () => {
  const result = getProcurementEventMatch(
    { taxonomy: { categoryId: 'thermal-management' }, matching: { keywords: ['HVAC'], topics: ['technology'] } },
    { categoryIds: ['thermal-management'], keywords: ['HVAC'] },
    'technology'
  );
  expect(result.precise).toBe(true);
});
