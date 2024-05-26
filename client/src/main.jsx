
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { reduxStore } from "./context/store.js"
import { environmentVariables } from './helper/helper.js';
import App from './App.jsx'

createRoot(document.getElementById('media-drive')).render(
  //<StrictMode>
    <Provider store={reduxStore}> {/** Redux toolkit State management ***/}
      <GoogleOAuthProvider clientId={environmentVariables.googleAuthClientId}> {/** Google auth provider ***/}
        <Router>
          <HelmetProvider>
          <App /> {/** Main app component ***/}
          </HelmetProvider>
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  //</StrictMode>,
)
