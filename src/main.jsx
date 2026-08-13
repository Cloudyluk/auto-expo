import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

export function mountApp(root, { pathname = window.location.pathname } = {}) {
  createRoot(root).render(<App pathname={pathname} />);
}

mountApp(document.getElementById('root'));
