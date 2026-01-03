import React from "react";
import ReactDOM from "react-dom/client";
import { StarknetProvider } from "./components/starknet-provider";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StarknetProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </StarknetProvider>
);
