import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </HelmetProvider>
    </React.StrictMode>,
  )
}
