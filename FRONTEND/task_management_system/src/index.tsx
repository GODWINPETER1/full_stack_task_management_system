import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './microsoftConfig';
import { ThemeProviderWrapper } from './context/ThemeContext'; // Import ThemeProvider

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <AuthProvider>
      <MsalProvider instance={msalInstance}>
        <ThemeProviderWrapper> {/* Wrap your app */}
          <App />
        </ThemeProviderWrapper>
      </MsalProvider>
    </AuthProvider>
  </Provider>
);
