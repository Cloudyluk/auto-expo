import { render, screen } from '@testing-library/react';
import { ExhibitionCard } from './ExhibitionCard';

const fixture = { official: { defaultName: '中文展会名', names: { en: 'Official English' }, url: '' }, taxonomy: { categoryId: 'new-energy-ev' }, date: { label: 'June 1–3, 2026' }, location: { label: 'Shanghai' }, content: { en: { focus: 'English focus', audience: 'English audience' } }, meta: { star: 0 } };

test('English card uses official English and English focus', () => {
  render(<ExhibitionCard locale="en" exhibition={fixture} />);
  expect(screen.getByText('Official English')).toBeInTheDocument();
  expect(screen.getByText('English focus')).toBeInTheDocument();
  expect(screen.queryByText('中文展会名')).not.toBeInTheDocument();
});
