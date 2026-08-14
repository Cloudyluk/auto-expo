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

test('renders Spanish when served from the GitHub Pages project path', () => {
  render(<App pathname="/auto-expo/es/" />);
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

test('renders Japanese at /ja/', () => {
  render(<App pathname="/ja/" />);
  expect(screen.getByText('世界地図')).toBeInTheDocument();
  expect(screen.getByText('今月の世界の展示会')).toBeInTheDocument();
});

test('renders Korean at /ko/', () => {
  render(<App pathname="/ko/" />);
  expect(screen.getByText('세계 지도')).toBeInTheDocument();
  expect(screen.getByText('이번 달 글로벌 전시회')).toBeInTheDocument();
});

test('renders Arabic at /ar/', () => {
  render(<App pathname="/ar/" />);
  expect(screen.getByText('الخريطة العالمية')).toBeInTheDocument();
  expect(screen.getByText('المعارض العالمية هذا الشهر')).toBeInTheDocument();
  expect(document.documentElement.dir).toBe('rtl');
});

test('renders Hindi at /hi/', () => {
  render(<App pathname="/hi/" />);
  expect(screen.getByText('विश्व मानचित्र')).toBeInTheDocument();
  expect(screen.getByText('इस महीने की वैश्विक प्रदर्शनियाँ')).toBeInTheDocument();
});

test('renders Indonesian at /id/', () => {
  render(<App pathname="/id/" />);
  expect(screen.getByText('Peta dunia')).toBeInTheDocument();
  expect(screen.getByText('Pameran global bulan ini')).toBeInTheDocument();
});

test('renders Russian at /ru/', () => {
  render(<App pathname="/ru/" />);
  expect(screen.getByText('Карта мира')).toBeInTheDocument();
  expect(screen.getByText('Мировые выставки в этом месяце')).toBeInTheDocument();
});

test('renders Italian at /it/', () => {
  render(<App pathname="/it/" />);
  expect(screen.getByText('Mappa globale')).toBeInTheDocument();
  expect(screen.getByText('Fiere globali di questo mese')).toBeInTheDocument();
});

test('renders Turkish at /tr/', () => {
  render(<App pathname="/tr/" />);
  expect(screen.getByText('Dünya haritası')).toBeInTheDocument();
  expect(screen.getByText('Bu ayın küresel fuarları')).toBeInTheDocument();
});
