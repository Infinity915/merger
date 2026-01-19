// src/main.jsx

// Ensure browser polyfills are loaded before other libs
import './polyfills/global.js';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);