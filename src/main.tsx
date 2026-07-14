import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/newspaper.css";
import "./styles/library.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
