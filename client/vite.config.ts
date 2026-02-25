import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ aponta para src/, assim seus imports tipo "@/components/..." funcionam
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist", // pasta de saída do build
    sourcemap: false, // opcional, evita gerar mapas
  },
});
