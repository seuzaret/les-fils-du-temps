/* ============================================================
   CHAPITRE 9 — Portraits gros plan
   Nathalie 12 ans (1969, chemise de nuit), Julien 15 ans (1985,
   T-shirt de groupe et walkman autour du cou), Céline 25 ans
   (1990, tailleur épaulettes, coupe carrée).
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

export function PortraitNathalie() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pNaHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#e0d0c8" stopOpacity="0.4" /><stop offset="100%" stopColor="#2a2418" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pNaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#f4d8b8" /><stop offset="100%" stopColor="#e0b088" /></linearGradient>
      </defs>
      {HB({ skin: "#f0d0b0", hair: "#5a3820", look: "bob", mood: "content" })}
      <circle cx="150" cy="138" r="130" fill="url(#pNaHalo)" />

      {/* chemise de nuit en flanelle rose à motifs (elle a été réveillée à 3h du mat) */}
      <path d="M40 340 Q46 240 100 224 Q126 216 150 218 Q174 216 200 224 Q254 240 260 340 Z" fill="#d89aa8" />
      {/* petits nœuds papillon sur la chemise */}
      {[[110, 260], [150, 268], [190, 260]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d="M-4 -3 L4 3 L4 -3 L-4 3 Z" fill="#b06a80" />
          <circle r="1.4" fill="#8a4060" />
        </g>
      ))}
      {/* col carré chemise de nuit */}
      <path d="M136 226 L164 226 L162 250 L138 250 Z" fill="#efc8d0" stroke="#a86a80" strokeWidth="1" />

      {/* cou */}
      <path d="M138 190 L162 190 L164 226 Q150 234 136 226 Z" fill="url(#pNaSkin)" />

      {HF({ skin: "#f0d0b0", hair: "#5a3820", look: "bob", mood: "content" })}
    </svg>
  );
}

export function PortraitJulien() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pJuHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#c8d0e0" stopOpacity="0.35" /><stop offset="100%" stopColor="#241a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pJuSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#f0c8a0" /><stop offset="100%" stopColor="#c89070" /></linearGradient>
      </defs>
      {HB({ skin: "#e8bc96", hair: "#4a3020", look: "mid", mood: "content" })}
      <circle cx="150" cy="138" r="130" fill="url(#pJuHalo)" />

      {/* T-shirt noir de groupe rock + veste en jean */}
      <path d="M40 340 Q48 244 100 228 Q126 220 150 222 Q174 220 200 228 Q252 244 260 340 Z" fill="#3a5680" />
      {/* T-shirt noir */}
      <path d="M96 232 L150 268 L204 232 L212 340 L88 340 Z" fill="#1a1a1a" />
      {/* logo/texte du groupe imprimé */}
      <text x="150" y="290" textAnchor="middle" fontFamily="ui-monospace,monospace" fontWeight="800" fontSize="14" fill="#e8506a" style={{ letterSpacing: "2px" }}>ROCK</text>
      <path d="M120 300 h60" stroke="#8a2030" strokeWidth="1" opacity="0.8" />

      {/* écouteurs de walkman autour du cou (câble rouge coquette) */}
      <path d="M115 220 Q150 236 185 220" fill="none" stroke="#e83820" strokeWidth="2" />
      <circle cx="115" cy="220" r="8" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="185" cy="220" r="8" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="115" cy="220" r="4" fill="#f8b800" />
      <circle cx="185" cy="220" r="4" fill="#f8b800" />

      {/* cou */}
      <path d="M138 190 L162 190 L164 226 Q150 234 136 226 Z" fill="url(#pJuSkin)" />

      {HF({ skin: "#e8bc96", hair: "#4a3020", look: "mid", mood: "content" })}
    </svg>
  );
}

export function PortraitCeline() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pCeHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#f0d0c8" stopOpacity="0.35" /><stop offset="100%" stopColor="#2a1a18" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pCeSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#f4d8b8" /><stop offset="100%" stopColor="#d0a080" /></linearGradient>
        <linearGradient id="pCeSuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a2030" /><stop offset="100%" stopColor="#3a1420" /></linearGradient>
      </defs>
      {HB({ skin: "#ecc8a8", hair: "#c89060", look: "bob", earrings: "#f4f0e4", lips: "#7a1a2a" })}
      <circle cx="150" cy="138" r="130" fill="url(#pCeHalo)" />

      {/* tailleur bordeaux avec ÉPAULETTES très marquées années 90 */}
      <path d="M30 340 Q40 244 100 228 Q126 220 150 222 Q174 220 200 228 Q260 244 270 340 Z" fill="url(#pCeSuit)" />
      {/* renforts épaulettes en carré */}
      <path d="M60 240 L100 228 L112 250 L74 262 Z" fill="#4a1826" />
      <path d="M240 240 L200 228 L188 250 L226 262 Z" fill="#4a1826" />
      {/* blouse chemisier crème */}
      <path d="M108 232 L150 264 L192 232 L188 280 L112 280 Z" fill="#f0e0d0" />
      {/* nœud lavallière */}
      <path d="M138 236 L162 236 L156 260 L150 254 L144 260 Z" fill="#c02830" />

      {/* cou */}
      <path d="M138 190 L162 190 L164 226 Q150 234 136 226 Z" fill="url(#pCeSkin)" />

      {HF({ skin: "#ecc8a8", hair: "#c89060", look: "bob", earrings: "#f4f0e4", lips: "#7a1a2a" })}
    </svg>
  );
}
