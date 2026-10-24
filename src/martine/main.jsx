import { createRoot } from "react-dom/client";
import MondeMartine from "./MondeMartine.jsx";
import "../styles/global.css";

/* les images de public/ sont à la racine du site principal : un dossier
   plus haut (…/les-fils-du-temps/martine/), sauf si l'amorce du site
   …/martine/ (site-martine/index.html) a déjà posé le bon chemin */
globalThis.__ASSET_ROOT ??= "../";

createRoot(document.getElementById("root")).render(<MondeMartine />);
