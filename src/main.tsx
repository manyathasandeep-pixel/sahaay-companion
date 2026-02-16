import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// This line connects the firebase file you just made
import './firebase' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
