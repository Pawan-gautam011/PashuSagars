// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./App.css";
import "./index.css";
import MyRoute from "./Route/MyRoute.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="dev-0dxli2liaejazv04.us.auth0.com"
        clientId="n9D9K2B7jauznAU887Kd3tjLRbJm2cEA"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <MyRoute />
      </Auth0Provider>
    
    </Provider>
  </StrictMode>
);
