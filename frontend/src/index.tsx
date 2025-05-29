import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? '' // Empty baseURL for production since API and frontend will be served from same origin
  : 'http://localhost:5000'; // Development server URL

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
