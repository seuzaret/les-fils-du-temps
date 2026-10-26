import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
/* polices embarquées (licence OFL, @fontsource) : Cinzel pour le titre du
   jeu, Cormorant Garamond pour l'accroche de l'écran titre */
import "@fontsource/cinzel/latin-700.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";

createRoot(document.getElementById("root")).render(<App />);
