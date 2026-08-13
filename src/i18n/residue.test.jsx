import { fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';

function unexpectedHan(container) {
  return [...container.querySelectorAll('*')]
    .filter((element) => element.children.length === 0 && /[\u3400-\u9fff]/.test(element.textContent || '') && !element.closest('[data-official-name],[data-language-name]'))
    .map((element) => element.textContent.trim())
    .filter(Boolean);
}

test.each([
  ['/', 'Featured exhibitions'],
  ['/es/', 'Ferias destacadas']
])('published locale %s has no unexpected Chinese business copy in exhibition cards', (pathname, pageLabel) => {
  const { container } = render(<App pathname={pathname} />);
  fireEvent.click(screen.getByText(pageLabel, { exact: true }));
  expect(unexpectedHan(container)).toEqual([]);
});

test.each([
  ['/', 'Sales route'],
  ['/es/', 'Ruta comercial']
])('published locale %s has no unexpected Chinese business copy in sales routes', (pathname, pageLabel) => {
  const { container } = render(<App pathname={pathname} />);
  fireEvent.click(screen.getByText(pageLabel, { exact: true }));
  expect(unexpectedHan(container)).toEqual([]);
});

test.each([
  ['/', 'Procurement route', 'Cooling, lubrication & HVAC'],
  ['/es/', 'Ruta de compras', 'Refrigeración, lubricación y HVAC']
])('published locale %s has no unexpected Chinese business copy in procurement results', (pathname, pageLabel, assemblyLabel) => {
  const { container } = render(<App pathname={pathname} />);
  fireEvent.click(screen.getByText(pageLabel, { exact: true }));
  fireEvent.click(screen.getByText(assemblyLabel, { exact: true }));
  expect(unexpectedHan(container)).toEqual([]);
});
