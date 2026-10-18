/* ============================================================
   CHAPITRE 8 — Portraits « gros plan »
   ------------------------------------------------------------
   Arthur Smith : ingénieur du son à la BBC, Bush House, Londres.
   La quarantaine, cheveux bruns lissés, moustache fine, chemise
   blanche, cravate sombre, casque de studio autour du cou.
   Marthe Dupont : veuve de 14-18, 68 ans, Parisienne, cheveux
   gris en chignon, châle noir, air digne — dure à cuire.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

export function PortraitArthur() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pArHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#b0c8e0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3a4a60" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pArSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#eec8a0" /><stop offset="100%" stopColor="#c8946a" /></linearGradient>
        <linearGradient id="pArShirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0e8d8" /><stop offset="100%" stopColor="#c8bfa8" /></linearGradient>
      </defs>
      {HB({ skin: "#e0b48a", hair: "#4a3020", look: "slick", mustache: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pArHalo)" />

      {/* veste sombre + chemise blanche + cravate rayée BBC */}
      <path d="M40 340 Q46 244 100 228 Q126 220 150 222 Q174 220 200 228 Q254 244 260 340 Z" fill="#1a2438" />
      <path d="M100 232 L150 268 L200 232 L214 340 L86 340 Z" fill="url(#pArShirt)" />
      {/* cravate rayée */}
      <path d="M140 234 L160 234 L156 280 L150 340 L144 280 Z" fill="#8a1a1a" />
      <path d="M143 246 L157 246 M144 258 L156 258 M144 270 L156 270 M145 282 L155 282" stroke="#e0a848" strokeWidth="1.2" />
      {/* col de chemise */}
      <path d="M136 228 L150 258 L164 228 L154 224 L150 232 L146 224 Z" fill="#fff" />

      {/* casque de studio autour du cou (headphones) */}
      <path d="M110 220 Q150 200 190 220" fill="none" stroke="#2a2a2a" strokeWidth="4" />
      <ellipse cx="110" cy="222" rx="10" ry="12" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1.5" />
      <ellipse cx="190" cy="222" rx="10" ry="12" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1.5" />
      <ellipse cx="110" cy="222" rx="6" ry="8" fill="#6a4a30" />
      <ellipse cx="190" cy="222" rx="6" ry="8" fill="#6a4a30" />

      {/* cou */}
      <path d="M137 186 L163 186 L165 226 Q150 234 135 226 Z" fill="url(#pArSkin)" />

      {HF({ skin: "#e0b48a", hair: "#4a3020", look: "slick", mustache: true })}
    </svg>
  );
}

export function PortraitKay() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pKaHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#c8d8e0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2a3040" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pKaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#f0d0b0" /><stop offset="100%" stopColor="#c8a080" /></linearGradient>
        <linearGradient id="pKaSuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a6a80" /><stop offset="100%" stopColor="#243848" /></linearGradient>
      </defs>
      {HB({ skin: "#ecc8a4", hair: "#5a3820", look: "rolls", lips: "#c02030", mood: "content" })}
      <circle cx="150" cy="138" r="130" fill="url(#pKaHalo)" />

      {/* tailleur bleu-gris + col chemise blanche */}
      <path d="M40 340 Q46 244 100 228 Q126 220 150 222 Q174 220 200 228 Q254 244 260 340 Z" fill="url(#pKaSuit)" />
      <path d="M100 232 L150 268 L200 232 L212 340 L88 340 Z" fill="#efe6d2" />
      {/* revers du tailleur */}
      <path d="M108 234 L150 262 L192 234 L184 254 L150 274 L116 254 Z" fill="url(#pKaSuit)" />
      {/* broche ronde de blouse */}
      <circle cx="150" cy="276" r="3.5" fill="#c8963e" stroke="#8a5a20" strokeWidth="1" />
      {/* col ras-du-cou */}
      <path d="M136 230 L150 254 L164 230 L156 226 L150 234 L144 226 Z" fill="#fff" />

      {/* cou */}
      <path d="M137 190 L163 190 L165 226 Q150 234 135 226 Z" fill="url(#pKaSkin)" />

      {HF({ skin: "#ecc8a4", hair: "#5a3820", look: "rolls", lips: "#c02030", mood: "content" })}
    </svg>
  );
}

export function PortraitMarchand() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pMcHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#e8c8a0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3a2818" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pMcSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#e0b088" /><stop offset="100%" stopColor="#a87860" /></linearGradient>
      </defs>
      {HB({ skin: "#d4a47c", hair: "#3a2818", look: "short", mustache: true, hat: "flatcap", hatColor: "#5a5048" })}
      <circle cx="150" cy="138" r="130" fill="url(#pMcHalo)" />

      {/* manteau brun long + écharpe grise */}
      <path d="M40 340 Q46 244 100 228 Q126 220 150 222 Q174 220 200 228 Q254 244 260 340 Z" fill="#5a3820" />
      <path d="M100 232 L150 268 L200 232 L214 340 L86 340 Z" fill="#4a2c18" />
      {/* écharpe en laine grise nouée */}
      <path d="M110 230 Q150 218 190 230 L192 258 Q150 246 108 258 Z" fill="#8a8a8a" />
      <path d="M118 246 Q150 240 182 246" stroke="#6a6a6a" strokeWidth="1.4" fill="none" />
      {/* boutons du manteau */}
      <circle cx="150" cy="278" r="3" fill="#3a2018" />
      <circle cx="150" cy="298" r="3" fill="#3a2018" />

      {/* cou */}
      <path d="M137 190 L163 190 L165 228 Q150 236 135 228 Z" fill="url(#pMcSkin)" />

      {HF({ skin: "#d4a47c", hair: "#3a2818", look: "short", mustache: true, hat: "flatcap", hatColor: "#5a5048" })}
    </svg>
  );
}

export function PortraitMarthe() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pMaHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#e8d8b0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#403a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pMaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#efd0b0" /><stop offset="100%" stopColor="#c8a080" /></linearGradient>
      </defs>
      {HB({ skin: "#e4c4a4", hair: "#a8a49c", look: "bun", wrinkles: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pMaHalo)" />

      {/* robe noire + châle noir à franges */}
      <path d="M40 340 Q48 250 106 230 Q128 224 150 226 Q172 224 194 230 Q252 250 260 340 Z" fill="#1a1a1a" />
      {/* franges du châle */}
      {[70, 90, 110, 130, 150, 170, 190, 210, 230].map((x, i) => (
        <path key={i} d={`M${x} 250 v${8 + (i % 3) * 3}`} stroke="#2a2a2a" strokeWidth="1.6" />
      ))}
      {/* broche or (souvenir du mari mort en 14-18) */}
      <circle cx="150" cy="248" r="5" fill="#c8963e" stroke="#8a5a20" strokeWidth="1" />
      <circle cx="150" cy="248" r="1.8" fill="#5a3a10" />

      {/* cou */}
      <path d="M137 190 L163 190 L165 228 Q150 236 135 228 Z" fill="url(#pMaSkin)" />

      {HF({ skin: "#e4c4a4", hair: "#a8a49c", look: "bun", wrinkles: true })}
    </svg>
  );
}
