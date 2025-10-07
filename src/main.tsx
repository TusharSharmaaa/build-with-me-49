// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Log any uncaught errors to the console (so we can see the real cause if it happens)
window.addEventListener('error', (e) => {
  console.error('[GlobalError]', e.error || e.message || e)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[UnhandledPromiseRejection]', e.reason || e)
})

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found in index.html')
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
