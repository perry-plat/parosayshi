import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/400-italic.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/xanh-mono/400.css";
import "@fontsource-variable/geist-mono";
import "./styles/newspaper.css";
import "./styles/library.css";
import "./styles/bottom-sheet.css";
import "./styles/wiz-reader.css";
import "./styles/annual-cover.css";
import "./styles/invoice-folio.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
