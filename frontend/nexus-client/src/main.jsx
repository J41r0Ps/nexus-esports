import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/theme_context';
import { LiveUpdatesProvider } from './context/live_updates_context';
import AuthProvider from './auth/auth0_provider';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LiveUpdatesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LiveUpdatesProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)