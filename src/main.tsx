import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">
      <h1>App Crash Detected</h1>
      <pre>${error.toString()}</pre>
    </div>`;
  }
}

