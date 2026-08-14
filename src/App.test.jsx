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

test('renders Portuguese at /pt/', () => {
  render(<App pathname="/pt/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('Mapa global');
  expect(screen.getByText('Exposições globais deste mês')).toBeInTheDocument();
});

test('renders French at /fr/', () => {
  render(<App pathname="/fr/" />);
  expect(screen.getByRole('navigation')).toHaveTextContent('Carte mondiale');
  expect(screen.getByText('Expositions mondiales ce mois-ci')).toBeInTheDocument();
});

test('renders German at /de/', () => {
  render(<App pathname="/de/" />);
  expect(screen.getByText('Weltkarte')).toBeInTheDocument();
  expect(screen.getByText('Globale Messen in diesem Monat')).toBeInTheDocument();
});
