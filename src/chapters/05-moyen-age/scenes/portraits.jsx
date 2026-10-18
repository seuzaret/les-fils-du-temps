/* ============================================================
   CHAPITRE 5 — Portraits « gros plan »
   Charles Bannister (seigneur), le frère Jorge (moine copiste) et
   Johannes Gutenberg (imprimeur de Mayence).
   Même cadre que les autres chapitres. Libres de droits.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

/* CHARLES BANNISTER — seigneur. Cercle d'or (couronne comtale),
   manteau doublé d'hermine, barbe courte, regard fier. */
export function PortraitCharles() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pChHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.5" /><stop offset="60%" stopColor="#f0c890" stopOpacity="0.16" /><stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pChSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d8a878" /><stop offset="55%" stopColor="#c89868" /><stop offset="100%" stopColor="#a87848" /></linearGradient>
        <linearGradient id="pChRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a2a34" /><stop offset="100%" stopColor="#521c24" /></linearGradient>
        <linearGradient id="pChGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2cf6a" /><stop offset="100%" stopColor="#c89a2a" /></linearGradient>
      </defs>
      {HB({ skin: "#cf9f70", hair: "#5a3a20", look: "short", beard: "short", hat: "circlet" })}
      <circle cx="150" cy="138" r="130" fill="url(#pChHalo)" />

      {/* le manteau seigneurial + col d'hermine (blanc moucheté de noir) */}
      <path d="M38 340 Q40 250 92 232 Q122 220 150 222 Q178 220 208 232 Q260 250 262 340 Z" fill="url(#pChRobe)" />
      <path d="M70 250 Q150 300 230 250 L222 292 Q150 336 78 292 Z" fill="#efe9dc" />
      {[[110, 276], [135, 288], [160, 290], [185, 284], [95, 262], [205, 264]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l3 6 l3 -6 l-3 4 Z`} fill="#2a2018" />
      ))}
      {/* fermail d'or au col */}
      <circle cx="150" cy="256" r="9" fill="url(#pChGold)" stroke="#a8842a" strokeWidth="1.4" /><circle cx="150" cy="256" r="3.2" fill="#8a2a34" />

      {/* LE COU */}
      <path d="M134 192 L166 192 L169 240 Q150 248 131 240 Z" fill="url(#pChSkin)" />

      {HF({ skin: "#cf9f70", hair: "#5a3a20", look: "short", beard: "short", hat: "circlet" })}
    </svg>
  );
}

/* FRÈRE JORGE — moine copiste. Tonsure (crâne rasé cerné de cheveux),
   coule brune, visage serein et savant. */
export function PortraitJorge() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pJoHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#fdeccb" stopOpacity="0.5" /><stop offset="60%" stopColor="#e6d6b6" stopOpacity="0.15" /><stop offset="100%" stopColor="#e6d6b6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pJoSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d0a072" /><stop offset="55%" stopColor="#bf9066" /><stop offset="100%" stopColor="#a3764e" /></linearGradient>
        <linearGradient id="pJoRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5a38" /><stop offset="100%" stopColor="#4e3a22" /></linearGradient>
      </defs>
      {HB({ skin: "#c8986c", hair: "#5a3a20", look: "ring", mood: "content" })}
      <circle cx="150" cy="138" r="130" fill="url(#pJoHalo)" />

      {/* la COULE (robe à capuchon) brune */}
      <path d="M36 340 Q40 244 92 226 Q122 214 150 216 Q178 214 208 226 Q260 244 264 340 Z" fill="url(#pJoRobe)" />
      {/* le capuchon rabattu dans le dos + l'encolure */}
      <path d="M96 236 Q150 214 204 236 Q150 262 96 236 Z" fill="#3e2e1a" />
      <path d="M110 244 Q150 292 150 340 M190 244 Q150 292 150 340" stroke="#3e2e1a" strokeWidth="3" fill="none" opacity="0.5" />
      {/* corde à la taille (esquissée sous le col) */}
      <path d="M116 254 Q150 268 184 254" stroke="#c8b488" strokeWidth="3" fill="none" opacity="0.7" />

      {/* LE COU */}
      <path d="M135 190 L165 190 L168 236 Q150 244 132 236 Z" fill="url(#pJoSkin)" />

      {HF({ skin: "#c8986c", hair: "#5a3a20", look: "ring", mood: "content" })}
    </svg>
  );
}

/* JOHANNES GUTENBERG — imprimeur de Mayence. Bonnet souple, robe
   d'artisan-bourgeois à col de fourrure, longue barbe grisonnante. */
export function PortraitGutenberg() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pGuHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.45" /><stop offset="60%" stopColor="#e8cfa0" stopOpacity="0.14" /><stop offset="100%" stopColor="#e8cfa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pGuSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d6a678" /><stop offset="55%" stopColor="#c69668" /><stop offset="100%" stopColor="#a67648" /></linearGradient>
        <linearGradient id="pGuRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a5248" /><stop offset="100%" stopColor="#243a32" /></linearGradient>
      </defs>
      {HB({ skin: "#cf9f70", hair: "#9a948a", look: "ring", beard: "long", hat: "toque", hatColor: "#2a3a30", hatColor2: "#1a2a22", wrinkles: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pGuHalo)" />

      {/* robe d'artisan-bourgeois + large col de fourrure brune */}
      <path d="M34 340 Q38 248 92 230 Q122 218 150 220 Q178 218 208 230 Q262 248 266 340 Z" fill="url(#pGuRobe)" />
      {/* col de fourrure (deux pans qui descendent) */}
      <path d="M150 232 Q120 236 96 250 Q84 300 92 340 L128 340 Q126 292 150 268 Z" fill="#6a5238" />
      <path d="M150 232 Q180 236 204 250 Q216 300 208 340 L172 340 Q174 292 150 268 Z" fill="#6a5238" />
      {/* moucheté de la fourrure */}
      {[[104, 288], [116, 316], [186, 288], [196, 314], [110, 262], [190, 262]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q3 6 6 0`} stroke="#3a2c1e" strokeWidth="2" fill="none" />
      ))}

      {/* LE COU */}
      <path d="M134 194 L166 194 L169 242 Q150 250 131 242 Z" fill="url(#pGuSkin)" />

      {HF({ skin: "#cf9f70", hair: "#9a948a", look: "ring", beard: "long", hat: "toque", hatColor: "#2a3a30", hatColor2: "#1a2a22", wrinkles: true })}
    </svg>
  );
}

/* LE PAPETIER — artisan du moulin à papier. Coiffe de toile, tablier de
   cuir, manches retroussées, barbe courte, air jovial et robuste. */
export function PortraitPapetier() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pPaHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#e6f0f4" stopOpacity="0.45" /><stop offset="60%" stopColor="#cadce2" stopOpacity="0.14" /><stop offset="100%" stopColor="#cadce2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pPaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#dcac7c" /><stop offset="55%" stopColor="#cc9c6c" /><stop offset="100%" stopColor="#ac7c4c" /></linearGradient>
        <linearGradient id="pPaApron" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5a34" /><stop offset="100%" stopColor="#5a3a1e" /></linearGradient>
      </defs>
      {HB({ skin: "#d4a474", hair: "#5a3a20", look: "short", beard: "short", mood: "content", hat: "cap", hatColor: "#e2d8c0" })}
      <circle cx="150" cy="138" r="130" fill="url(#pPaHalo)" />

      {/* chemise de toile écrue, manches retroussées */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="#c2b492" />
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="#8a7c5a" opacity="0.2" />
      {/* le tablier de cuir par-dessus */}
      <path d="M108 236 Q150 250 192 236 L204 340 L96 340 Z" fill="url(#pPaApron)" />
      <path d="M108 236 Q150 250 192 236 L204 340 L96 340 Z" fill="none" stroke="#3a2412" strokeWidth="2" opacity="0.5" />
      {/* bavette + bretelles du tablier */}
      <path d="M126 234 L120 210 M174 234 L180 210" stroke="#5a3a1e" strokeWidth="6" strokeLinecap="round" />
      <path d="M124 250 h52 v10 h-52 Z" fill="#6a4424" />
      {/* taches d'humidité du métier */}
      {[[120, 300], [176, 296], [150, 320]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="5" fill="#4a2e16" opacity="0.4" />)}

      {/* LE COU */}
      <path d="M134 194 L166 194 L169 242 Q150 250 131 242 Z" fill="url(#pPaSkin)" />

      {HF({ skin: "#d4a474", hair: "#5a3a20", look: "short", beard: "short", mood: "content", hat: "cap", hatColor: "#e2d8c0" })}
    </svg>
  );
}
