import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./firebase";

//onfiguración Cognito
const cognitoAuthConfig = {
  authority: process.env.REACT_APP_COGNITO_AUTHORITY,
  client_id: process.env.REACT_APP_COGNITO_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_COGNITO_REDIRECT_URI,
  post_logout_redirect_uri: process.env.REACT_APP_COGNITO_LOGOUT_URI,
  response_type: process.env.REACT_APP_COGNITO_RESPONSE_TYPE,
  scope: process.env.REACT_APP_COGNITO_SCOPE,
  hostedUI: {
    domain: process.env.REACT_APP_COGNITO_DOMAIN,
  },
};



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
