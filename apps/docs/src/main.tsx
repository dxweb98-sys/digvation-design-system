import React from 'react';
import ReactDOM from 'react-dom/client';
import '@digvation/ui/styles.css';
import './docs.css';
import './component-lab.css';
import { App } from './App';
import { ComponentLab } from './component-lab';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ComponentLab />
  </React.StrictMode>,
);
