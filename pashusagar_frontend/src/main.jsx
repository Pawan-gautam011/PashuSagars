import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";
import MyRoute from "./Route/MyRoute.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    

    <MyRoute/>
    
   
  </StrictMode>
);
