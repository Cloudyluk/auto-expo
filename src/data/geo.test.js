import { getExhibitionGeo, getMapGroups } from './geo';

const shanghai = { location: { label: '上海新国际博览中心' }, date: { year: 2026, month: 3 } };
const munich = { location: { label: '德国慕尼黑展览中心' }, date: { year: 2026, month: 3 } };

test('maps exhibition venues to their city before falling back to country centre', () => {
  expect(getExhibitionGeo(shanghai)).toMatchObject({ country: 'China', city: 'Shanghai', latitude: 31.2304 });
  expect(getExhibitionGeo({ location: { label: '德国' } })).toMatchObject({ country: 'Germany', city: '', latitude: 51 });
});

test('groups only exhibitions in the selected map month and year', () => {
  const groups = getMapGroups([shanghai, munich, { ...shanghai, date: { year: 2027, month: 3 } }], 2026, 3);
  expect(groups).toHaveLength(2);
  expect(groups.map((group) => group.events)).toEqual([[shanghai], [munich]]);
});
