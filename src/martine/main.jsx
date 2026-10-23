import { createRoot } from "react-dom/client";
import MondeMartine from "./MondeMartine.jsx";
import "../styles/global.css";

/* les images de public/ sont à la racine du site, un dossier plus haut */
globalThis.__ASSET_ROOT = "../";

createRoot(document.getElementById("root")).render(<MondeMartine />);
