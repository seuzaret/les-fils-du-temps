import Mediadex from "../../engine/Mediadex.jsx";
import { MEDIADEX_MAP } from "../../engine/mediadex.js";

/* ============================================================
   JEU 3 — Panneau MÉDIADEX dans le bunker
   ------------------------------------------------------------
   Réutilise l'écran Mediadex du jeu principal (grille de cartes-
   inventions façon Pokédex). Le joueur a vécu le Jeu 1 avant son
   réveil au Puits — on affiche donc toutes les cartes comme
   découvertes. Le trophée est désactivé (fluxTotal=0 affiche la
   silhouette la plus basse, c'est OK pour un carnet personnel).
   ============================================================ */
const ALL_UNLOCKED = Object.keys(MEDIADEX_MAP);

export default function MediadexPanel({ onClose }) {
  return <Mediadex unlocked={ALL_UNLOCKED} onClose={onClose} fluxTotal={0} bonusChapters={[]} />;
}
