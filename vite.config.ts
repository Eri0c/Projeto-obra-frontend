import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// import mkcert from "vite-plugin-mkcert"; // Comentar ou remover
import path from "path";
import { fileURLToPath } from "url";

// Converte import.meta.url para caminho de arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    // mkcert(), // Comentar ou remover
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ agora funciona no ESM
    },
  },
  server: {
    // https: true, // Mudar para false ou remover
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Mudar para a URL HTTP do seu backend
        changeOrigin: true,
        secure: false, // porque certificado autoassinado
      }
    }
  }

});
