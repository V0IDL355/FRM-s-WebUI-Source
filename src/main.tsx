import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter basename="/">
      <App />
    </HashRouter>
  </React.StrictMode>,
);
