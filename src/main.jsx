import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Analytics } from '@vercel/analytics/react'

window.onerror = (msg, url, line, col, error) => {
  console.error("[Global Error]:", { msg, url, line, col, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error("[Unhandled Promise Rejection]:", event.reason);
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
