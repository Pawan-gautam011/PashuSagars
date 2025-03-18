// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store"; 
import "./App.css";
import "./index.css";
import MyRoute from "./Route/MyRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MyRoute />
    </Provider>
  </StrictMode>
);
