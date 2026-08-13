import { getSalesRouteProducts, getSalesRule } from './sales';

test('sales routes preserve product routing by assembly ID', () => {
  expect(getSalesRouteProducts('production')).toContain('engine');
  expect(getSalesRule('engine').buyers.length).toBeGreaterThan(0);
});
