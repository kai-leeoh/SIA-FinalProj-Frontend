import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { theme } from "./theme";

const clientId =
  "938739633029-kfchnili84oo5vqblfn2vo84q06i0697.apps.googleusercontent.com";

console.log("Google Client ID:", clientId);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
