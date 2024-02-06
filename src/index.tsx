import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, Navigate, HashRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/tailwind.css';

import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
reportWebVitals();
