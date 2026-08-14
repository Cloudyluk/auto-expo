import { render, screen } from '@testing-library/react';
import { LanguageMenu } from './LanguageMenu';

test('uses a flag menu and keeps future locales disabled', () => {
  render(<LanguageMenu locale="en" />);
  expect(screen.getByLabelText('Language: English')).toHaveTextContent('🇬🇧');
  expect(screen.getByRole('link', { name: /Español/i })).toHaveTextContent('🇪🇸');
  expect(screen.getByText('Português')).toHaveAttribute('aria-disabled', 'true');
  expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0);
});
