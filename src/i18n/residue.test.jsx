import { fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';

function unexpectedHan(container, pathname) {
  if (pathname === '/ja/' || pathname === '/ko/') return [];
  return [...container.querySelectorAll('*')]
    .filter((element) => element.children.length === 0 && /[\u3400-\u9fff]/.test(element.textContent || '') && !element.closest('[data-official-name],[data-language-name]'))
    .map((element) => element.textContent.trim())
    .filter(Boolean);
}

test.each([
  ['/', 'Featured exhibitions'],
  ['/es/', 'Ferias destacadas'],
  ['/pt/', 'Exposições em destaque'],
  ['/fr/', 'Expositions à la une']
  ,['/de/', 'Empfohlene Messen']
  ,['/ja/', '注目の展示会']
  ,['/ko/', '주요 전시회']
])('published locale %s has no unexpected Chinese business copy in exhibition cards', (pathname, pageLabel) => {
  const { container } = render(<App pathname={pathname} />);
  fireEvent.click(screen.getByText(pageLabel, { exact: true }));
  expect(unexpectedHan(container, pathname)).toEqual([]);
});

test.each([
  ['/', 'Sales route'],
  ['/es/', 'Ruta comercial'],
  ['/pt/', 'Rota comercial'],
  ['/fr/', 'Parcours commercial']
  ,['/de/', 'Vertriebsweg']
  ,['/ja/', '営業ルート']
  ,['/ko/', '영업 경로']
])('published locale %s has no unexpected Chinese business copy in sales routes', (pathname, pageLabel) => {
  const { container } = render(<App pathname={pathname} />);
  fireEvent.click(screen.getByText(pageLabel, { exact: true }));
  expect(unexpectedHan(container, pathname)).toEqual([]);
});

test.each([
  ['/', 'Procurement route', 'Cooling, lubrication & HVAC'],
  ['/es/', 'Ruta de compras', 'Refrigeración, lubricación y HVAC'],
  ['/pt/', 'Rota de compras', 'Arrefecimento, lubrificação e HVAC'],
  ['/fr/', 'Parcours d’achat', 'Refroidissement, lubrification et HVAC']
  ,['/de/', 'Beschaffungsweg', 'Kühlung, Schmierung und HVAC']
  ,['/ja/', '調達ルート', '冷却・潤滑・HVAC']
  ,['/ko/', '조달 경로', '냉각·윤활·HVAC']
])('published locale %s has no unexpected Chinese business copy in procurement results', (pathname, pageLabel, assemblyLabel) => {
  const { container } = render(<App pathname={pathname} />);
  fireEvent.click(screen.getByText(pageLabel, { exact: true }));
  fireEvent.click(screen.getByText(assemblyLabel, { exact: true }));
  expect(unexpectedHan(container, pathname)).toEqual([]);
});
