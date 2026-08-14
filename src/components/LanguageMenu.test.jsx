import { render, screen } from '@testing-library/react';
import { LanguageMenu } from './LanguageMenu';

test('uses a flag menu, links Portuguese, and keeps future locales disabled', () => {
  render(<LanguageMenu locale="en" />);
  expect(screen.getByLabelText('Language: English')).toHaveTextContent('🇬🇧');
  expect(screen.getByRole('link', { name: /Español/i })).toHaveTextContent('🇪🇸');
  expect(screen.getByRole('link', { name: /Português/i })).toHaveAttribute('href', '/pt/');
  expect(screen.getByRole('link', { name: /Deutsch/i })).toHaveAttribute('href', '/de/');
  expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0);
});
