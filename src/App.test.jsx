import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders English at the root route and Chinese at /zh/', () => {
  const { rerender } = render(<App pathname="/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('Global map');

  rerender(<App pathname="/zh/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('全球地图');
});

test('renders Spanish at /es/', () => {
  render(<App pathname="/es/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('Mapa global');
  expect(screen.getByText('Ferias mundiales de este mes')).toBeInTheDocument();
});
