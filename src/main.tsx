import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StyledEngineProvider } from '@mui/material/styles'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import ContextsProvider from './context/ContextsProvider.tsx'
import "./features/Language/language.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ContextsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContextsProvider>
    </StyledEngineProvider>
  </StrictMode>
)
