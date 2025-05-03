import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    script: {
      defineModel: true,
      propsDestructure: true
    }
  })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
