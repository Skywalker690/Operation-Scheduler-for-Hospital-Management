import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/AdminDashboard'; // or './App' if you have App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
