import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  // Force absolute paths so Vercel doesn't lose your files
  base: '/',
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // This 'es2015' target makes it work on almost all mobile phones
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    // This ensures your main file isn't too heavy for mobile memory
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
