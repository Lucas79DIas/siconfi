import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // agora @ aponta para a pasta src
    },
  },
  build: {
    rollupOptions: {
      external: [], // se precisar externalizar algum pacote, adicione aqui
    },
  },
});
