import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// base: './' → le build utilise des chemins relatifs :
// le dossier dist/ fonctionne tel quel sur n'importe quel hébergement
// (mutualisé PHP, GitHub Pages, itch.io…), même dans un sous-dossier.
// Deux pages : le jeu (index.html) et le prototype du « monde de
// MARTINE » (martine/index.html), servi sous …/martine/.
const page = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        martine: page("./martine/index.html"),
      },
    },
  },
});
