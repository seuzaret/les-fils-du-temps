/* ============================================================
   CHAPITRE 6 — Portraits « gros plan »
   Jules (le jeune journaliste), Sigismond (le rédacteur en chef)
   et Alessandro Volta (le savant). Costume fin XVIIIe : col haut,
   jabot, gilet. Même cadre que les autres chapitres.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

/* JULES — jeune journaliste enthousiaste. Cheveux en catogan, jabot
   défait, une plume glissée derrière l'oreille, l'œil vif. */
export function PortraitJules() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pJuHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.45" /><stop offset="60%" stopColor="#e8cfa0" stopOpacity="0.14" /><stop offset="100%" stopColor="#e8cfa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pJuSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#e2b488" /><stop offset="55%" stopColor="#d2a472" /><stop offset="100%" stopColor="#b48454" /></linearGradient>
        <linearGradient id="pJuCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a5a6a" /><stop offset="100%" stopColor="#243c48" /></linearGradient>
      </defs>
      {HB({ skin: "#dcae82", hair: "#4a3020", look: "ponytail", mood: "content" })}
      <circle cx="150" cy="138" r="130" fill="url(#pJuHalo)" />

      {/* habit bleu à col haut + gilet clair + jabot défait */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="url(#pJuCoat)" />
      <path d="M124 234 L150 268 L176 234 L176 340 L124 340 Z" fill="#d8cdae" />
      {/* revers du col */}
      <path d="M124 234 L108 262 L120 300 L150 268 Z" fill="#2c4652" />
      <path d="M176 234 L192 262 L180 300 L150 268 Z" fill="#2c4652" />
      {/* jabot de dentelle un peu froissé */}
      <path d="M150 250 Q142 276 150 306 Q158 276 150 250 Z" fill="#eee7d4" />
      {[262, 278, 294].map((y, i) => <path key={i} d={`M143 ${y} q7 5 14 0`} stroke="#c9be9a" strokeWidth="1.4" fill="none" />)}

      {/* LE COU */}
      <path d="M134 192 L166 192 L169 240 Q150 248 131 240 Z" fill="url(#pJuSkin)" />

      {HF({ skin: "#dcae82", hair: "#4a3020", look: "ponytail", mood: "content" })}
      {/* la PLUME glissée derrière l'oreille */}
      <g transform="translate(196,150) rotate(28)">
        <path d="M0 0 Q6 -30 2 -52 Q-3 -30 0 0 Z" fill="#f4efe2" stroke="#c9be9a" strokeWidth="1" />
        <path d="M1 -6 V-46" stroke="#c9be9a" strokeWidth="1" />
        <path d="M1 2 l0 8" stroke="#3a2a1a" strokeWidth="2" />
      </g>
    </svg>
  );
}

/* SIGISMOND — rédacteur en chef, la cinquantaine. Bésicles sur le nez,
   catogan poudré grisonnant, habit sobre, air malin et sûr de lui. */
export function PortraitSigismond() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pSiHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#fdeccb" stopOpacity="0.45" /><stop offset="60%" stopColor="#e6d6b6" stopOpacity="0.14" /><stop offset="100%" stopColor="#e6d6b6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pSiSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d8ac80" /><stop offset="55%" stopColor="#c89c70" /><stop offset="100%" stopColor="#a87c50" /></linearGradient>
        <linearGradient id="pSiCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a4030" /><stop offset="100%" stopColor="#3a281c" /></linearGradient>
      </defs>
      {HB({ skin: "#d0a478", hair: "#d0ccc4", look: "short", glasses: true, wrinkles: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pSiHalo)" />

      {/* habit brun sobre + gilet bordeaux + cravate blanche */}
      <path d="M36 340 Q40 248 94 230 Q122 220 150 222 Q178 220 206 230 Q260 248 264 340 Z" fill="url(#pSiCoat)" />
      <path d="M120 232 L150 266 L180 232 L180 340 L120 340 Z" fill="#6a2530" />
      <path d="M120 232 L104 260 L118 300 L150 266 Z" fill="#4a3226" />
      <path d="M180 232 L196 260 L182 300 L150 266 Z" fill="#4a3226" />
      {/* cravate/col montant blanc */}
      <path d="M138 236 Q150 252 162 236 L160 262 Q150 272 140 262 Z" fill="#efe9dc" />
      {/* boutons du gilet */}
      {[280, 300, 320].map((y, i) => <circle key={i} cx="150" cy={y} r="3" fill="#c8a84a" />)}

      {/* LE COU */}
      <path d="M134 192 L166 192 L169 240 Q150 248 131 240 Z" fill="url(#pSiSkin)" />

      {HF({ skin: "#d0a478", hair: "#d0ccc4", look: "short", glasses: true, wrinkles: true })}
    </svg>
  );
}

/* ALESSANDRO VOLTA — le savant, la quarantaine. Cheveux naturels
   brun-gris, habit vert élégant, jabot fin, regard réfléchi et curieux. */
export function PortraitVolta() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pVoHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#d8f0e2" stopOpacity="0.45" /><stop offset="60%" stopColor="#c2dcc8" stopOpacity="0.14" /><stop offset="100%" stopColor="#c2dcc8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pVoSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#dcac80" /><stop offset="55%" stopColor="#cc9c70" /><stop offset="100%" stopColor="#ac7c50" /></linearGradient>
        <linearGradient id="pVoCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a5a44" /><stop offset="100%" stopColor="#243c2e" /></linearGradient>
      </defs>
      {HB({ skin: "#d6a67a", hair: "#6a5a4a", look: "slick" })}
      <circle cx="150" cy="138" r="130" fill="url(#pVoHalo)" />

      {/* habit vert brodé + jabot fin */}
      <path d="M38 340 Q42 248 94 230 Q122 220 150 222 Q178 220 206 230 Q258 248 262 340 Z" fill="url(#pVoCoat)" />
      <path d="M126 232 L150 266 L174 232 L174 340 L126 340 Z" fill="#e6dfc8" />
      <path d="M126 232 L110 260 L122 300 L150 266 Z" fill="#2c4636" />
      <path d="M174 232 L190 260 L178 300 L150 266 Z" fill="#2c4636" />
      {/* jabot */}
      <path d="M150 248 Q141 278 150 308 Q159 278 150 248 Z" fill="#f0ebda" />
      {[264, 282, 300].map((y, i) => <path key={i} d={`M143 ${y} q7 5 14 0`} stroke="#cbc0a0" strokeWidth="1.3" fill="none" />)}
      {/* broderie dorée du revers */}
      <path d="M118 250 q-4 24 6 46 M182 250 q4 24 -6 46" stroke="#c8a84a" strokeWidth="1.6" fill="none" opacity="0.7" />

      {/* LE COU */}
      <path d="M134 192 L166 192 L169 240 Q150 248 131 240 Z" fill="url(#pVoSkin)" />

      {HF({ skin: "#d6a67a", hair: "#6a5a4a", look: "slick" })}
    </svg>
  );
}
