import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@/styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  const swPath = `${import.meta.env.BASE_URL || '/'}sw.js`;
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(swPath);
  });
}
