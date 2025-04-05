import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LocationProvider } from "./context/LocationContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocationProvider>
      <App />
    </LocationProvider>
  </React.StrictMode>
);

