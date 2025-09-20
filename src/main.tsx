import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import favicon from '/logo.png';

const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (faviconLink) {
  faviconLink.href = favicon;
}

createRoot(document.getElementById('root')!).render(
    <App />
);
