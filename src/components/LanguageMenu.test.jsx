import { render, screen } from '@testing-library/react';
import { LanguageMenu } from './LanguageMenu';

test('future locales are visible but disabled', () => {
  render(<LanguageMenu locale="en" />);
  expect(screen.getByText('Español')).toHaveAttribute('aria-disabled', 'true');
  expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0);
});
