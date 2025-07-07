import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';           // ✅ Make sure Tailwind directives are inside this
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Performance monitoring
reportWebVitals();
