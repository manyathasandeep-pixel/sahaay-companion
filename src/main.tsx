import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root');

try {
  if (!rootElement) throw new Error("Could not find the 'root' element in index.html");
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error: any) {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; background: black; color: lime; font-family: monospace; height: 100vh;">
        <h1 style="color: red;">⚠️ CRASH DETECTED</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> ${error.stack}</p>
        <hr />
        <p>Check if your 'App.tsx' is missing or has a typo.</p>
      </div>
    `;
  }
}
