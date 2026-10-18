/* ============================================================
   MOTEUR — Portrait AL3X1A « dans le décor » (silhouette SVG).
   ------------------------------------------------------------
   Version SVG à intégrer DANS un <svg viewBox="0 0 1000 560">
   pour marquer AL3X1A à sa place trouvée : tunique grise,
   cheveux mi-longs, halo bleuté discret. Coordonnées relatives
   au groupe parent (translate déjà appliqué). ~80 px de haut.
   ============================================================ */
import { HeadBack, HeadFront, AL3X1A_LOOK } from "./chars.jsx";

export default function PortraitAl3x1AInScene() {
  return (
    <g>
      {/* halo bleuté derrière la silhouette pour la repérer sans marqueur */}
      <ellipse cx="0" cy="0" rx="42" ry="52" fill="rgba(127,216,255,0.22)" />
      <ellipse cx="0" cy="0" rx="28" ry="38" fill="rgba(127,216,255,0.32)" />
      <g transform="translate(0,-26) scale(0.7)"><HeadBack {...AL3X1A_LOOK} /></g>
      {/* Corps : tunique de voyage grise */}
      <path d="M-14 40 L-14 -6 Q-14 -14 -6 -14 L6 -14 Q14 -14 14 -6 L14 40 Z" fill="#606878" stroke="#3a4048" strokeWidth="1" />
      {/* insigne chronaute dorée */}
      <circle cx="-8" cy="0" r="2.4" fill="#c8a848" stroke="#5a4020" strokeWidth="0.4" />
      {/* cou + tête (kit commun, apparence canonique) */}
      <ellipse cx="0" cy="-16" rx="4" ry="3" fill="#c09474" />
      <g transform="translate(0,-26) scale(0.7)"><HeadFront {...AL3X1A_LOOK} mood="content" blush={false} /></g>
    </g>
  );
}
