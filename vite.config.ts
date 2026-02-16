import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  base: "/",
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // This 'es2015' is the secret—it works on almost all mobile phones
    target: 'es2015', 
    outDir: "dist",
    assetsDir: "assets",
    cssCodeSplit: false, // Keeps CSS simple for mobile
    rollupOptions: {
      output: {
        manualChunks: undefined, // Prevents files from being split and lost
      },
    },
  },
});
