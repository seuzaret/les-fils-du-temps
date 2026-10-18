/* ============================================================
   CHAPITRE 4 — Portraits « gros plan »
   Caius, le riche marchand d'olives de Pompéi. Même cadre que
   les autres chapitres, avec les codes romains : toge blanche à
   bande, cheveux courts ramenés sur le front, visage rasé de près,
   air prospère et un brin vaniteux. Libre de droits.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

export function PortraitCaius() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pCaiHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.5" /><stop offset="60%" stopColor="#f0c890" stopOpacity="0.16" /><stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pCaiSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d8a878" /><stop offset="55%" stopColor="#c89868" /><stop offset="100%" stopColor="#a87848" /></linearGradient>
        <linearGradient id="pCaiToge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f4efe2" /><stop offset="100%" stopColor="#d8cfb8" /></linearGradient>
      </defs>
      {HB({ skin: "#cfa070", hair: "#3a2818", look: "short", mood: "content", hat: "laurel" })}
      <circle cx="150" cy="138" r="130" fill="url(#pCaiHalo)" />

      {/* LA TOGE blanche drapée, une bande pourpre (clavus) */}
      <path d="M40 340 Q42 250 92 232 Q122 220 150 222 Q178 220 208 232 Q258 250 260 340 Z" fill="url(#pCaiToge)" />
      {/* les plis du drapé */}
      <path d="M96 250 Q120 300 108 340 M150 236 Q150 300 150 340 M204 250 Q180 300 192 340" stroke="#c4b898" strokeWidth="2.5" fill="none" opacity="0.6" />
      {/* la bande pourpre en écharpe (marque du notable) */}
      <path d="M108 240 Q150 268 176 340" stroke="#8a2a4a" strokeWidth="12" fill="none" opacity="0.85" />
      <path d="M108 240 Q150 268 176 340" stroke="#5a1c34" strokeWidth="3" fill="none" opacity="0.5" />

      {/* LE COU */}
      <path d="M134 190 L166 190 L169 240 Q150 248 131 240 Z" fill="url(#pCaiSkin)" />

      {HF({ skin: "#cfa070", hair: "#3a2818", look: "short", mood: "content", hat: "laurel" })}
    </svg>
  );
}
