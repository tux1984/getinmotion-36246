
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Exportar componentes para que estén disponibles
export { default as Dashboard } from './pages/Dashboard.tsx';
export { default as MaturityCalculator } from './pages/MaturityCalculator.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
