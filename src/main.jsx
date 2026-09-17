import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

hydrateRoot(document.getElementById('root'),
  <StrictMode>
    <App />
  </StrictMode>,
)

addEventListener('load', () => {
  const startMonitoring = () => import('./performance.js');
  if ('requestIdleCallback' in window) requestIdleCallback(startMonitoring, { timeout: 3000 });
  else setTimeout(startMonitoring, 0);
}, { once: true });
