import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CombatMartine from "./chapters/jeu3/CombatMartine.jsx";
import { Filet } from "./engine/FiletSecurite.jsx";
import "./styles/global.css";
/* polices embarquées (licence OFL, @fontsource) : Cinzel pour le titre du
   jeu, Cormorant Garamond pour l'accroche de l'écran titre */
import "@fontsource/cinzel/latin-700.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";

/* ?combat=1 : le prototype du combat contre MARTINE, seul (pour le tester et le régler) */
const combat = (() => { try { return new URLSearchParams(window.location.search).has("combat"); } catch { return false; } })();
/* <Filet> : en cas de plantage, une carte « Recharger » au lieu d'une page blanche */
createRoot(document.getElementById("root")).render(<Filet>{combat ? <CombatMartine /> : <App />}</Filet>);
