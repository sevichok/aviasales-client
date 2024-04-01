import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import '../src/i18n/i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
