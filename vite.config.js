import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// base "./" => relative Asset-Pfade, damit der Build sowohl auf einer
// eigenen Domain als auch unter einem Unterpfad (z. B. GitHub Pages) funktioniert.
export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        rechtliches: resolve(import.meta.dirname, "rechtliches.html"),
      },
    },
  },
});
