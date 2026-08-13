import { BUYER_PATHS } from './paths';

test('procurement paths retain ICE, electrified, and cross-functional assemblies', () => {
  expect(Object.keys(BUYER_PATHS)).toEqual(['ice', 'ev', 'shared']);
  expect(BUYER_PATHS.ice.assemblies.length).toBeGreaterThanOrEqual(10);
  expect(BUYER_PATHS.ev.assemblies.some((assembly) => assembly.id === 'smart')).toBe(false);
  expect(BUYER_PATHS.shared.assemblies.some((assembly) => assembly.id === 'smart')).toBe(true);
  expect(BUYER_PATHS.shared.assemblies.some((assembly) => assembly.id === 'software')).toBe(true);
});
