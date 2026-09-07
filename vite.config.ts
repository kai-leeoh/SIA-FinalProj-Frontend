import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: resolve("./node_modules/react"),
      "react-dom": resolve("./node_modules/react-dom"),
    },
  },
});
