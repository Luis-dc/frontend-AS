import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import "bootstrap/dist/css/bootstrap.min.css";

//onfiguración Cognito
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_jxPATqPYJ", //user pool ID
  client_id: "4pj32ltqhib5s1vkap8r5p0qn3", //client ID
  redirect_uri: "http://localhost:3000/",
  response_type: "code",
  scope: "openid email profile",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
