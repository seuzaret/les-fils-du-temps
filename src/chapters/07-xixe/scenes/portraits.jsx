/* ============================================================
   CHAPITRE 7 — Portrait « gros plan »
   James O'Sullivan : émigré irlandais parti chercher fortune dans
   l'Ouest américain. Cheveux et barbe auburn, taches de rousseur,
   chapeau de prospecteur repoussé en arrière, et — depuis qu'il a
   trouvé le filon — un gilet et une chaîne de montre en or.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

export function PortraitJames() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pJaHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.45" /><stop offset="60%" stopColor="#e8cfa0" stopOpacity="0.14" /><stop offset="100%" stopColor="#e8cfa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pJaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#eec098" /><stop offset="55%" stopColor="#e0b084" /><stop offset="100%" stopColor="#c8946a" /></linearGradient>
        <linearGradient id="pJaVest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a4a30" /><stop offset="100%" stopColor="#463020" /></linearGradient>
      </defs>
      {HB({ skin: "#e4b48a", hair: "#a0522d", look: "short", mustache: "handlebar", freckles: true, mood: "content", hat: "brim", hatColor: "#8a5a30", hatColor2: "#3a2818" })}
      <circle cx="150" cy="138" r="130" fill="url(#pJaHalo)" />

      {/* chemise à carreaux rouge + GILET brun (le prospecteur enrichi) */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="#a8352a" />
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="none" />
      {/* carreaux de la chemise */}
      <g stroke="#7a201a" strokeWidth="2" opacity="0.5"><path d="M70 300 h160 M70 330 h160 M110 250 v90 M150 244 v96 M190 250 v90" /></g>
      {/* le gilet ouvert par-dessus */}
      <path d="M108 232 L150 268 L192 232 L214 340 L176 340 L150 280 L124 340 L86 340 Z" fill="url(#pJaVest)" />
      {/* chaîne de montre en or + petite pépite */}
      <path d="M132 268 Q150 284 168 270" stroke="#e6c25a" strokeWidth="2.4" fill="none" />
      <circle cx="168" cy="270" r="4" fill="#e6c25a" stroke="#a8801f" strokeWidth="1" />
      {/* col ouvert + foulard */}
      <path d="M140 236 Q150 250 160 236 L156 262 Q150 270 144 262 Z" fill="#efe6d2" />

      {/* LE COU (plus étroit, sous un menton plus petit) */}
      <path d="M137 186 L163 186 L165 230 Q150 238 135 230 Z" fill="url(#pJaSkin)" />

      {HF({ skin: "#e4b48a", hair: "#a0522d", look: "short", mustache: "handlebar", freckles: true, mood: "content", hat: "brim", hatColor: "#8a5a30", hatColor2: "#3a2818" })}
    </svg>
  );
}

/* GUGLIELMO MARCONI — inventeur italien de la TSF, la trentaine.
   Costume sombre de la Belle Époque, col empesé, moustache noire,
   air concentré, cheveux bruns coiffés en arrière. */
export function PortraitMarconi() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pMaHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#d8e4f0" stopOpacity="0.45" /><stop offset="60%" stopColor="#b8c4d0" stopOpacity="0.14" /><stop offset="100%" stopColor="#b8c4d0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pMaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d8b088" /><stop offset="55%" stopColor="#c8a078" /><stop offset="100%" stopColor="#a8805a" /></linearGradient>
        <linearGradient id="pMaSuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1e2a" /><stop offset="100%" stopColor="#0a0e18" /></linearGradient>
      </defs>
      {HB({ skin: "#d0a67e", hair: "#1a1008", look: "slick", mustache: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pMaHalo)" />

      {/* costume noir + gilet + col empesé + cravate */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="url(#pMaSuit)" />
      {/* revers du veston */}
      <path d="M124 232 L108 260 L120 300 L150 260 Z" fill="#0a0a12" />
      <path d="M176 232 L192 260 L180 300 L150 260 Z" fill="#0a0a12" />
      {/* col empesé blanc + cravate noire fine */}
      <path d="M138 236 Q150 252 162 236 L160 266 Q150 274 140 266 Z" fill="#efe9dc" />
      <path d="M146 254 L150 262 L154 254 L152 292 L148 292 Z" fill="#0a0a12" />
      {/* petit ordre honorifique (rosette) sur le revers */}
      <circle cx="122" cy="272" r="4" fill="#a83828" /><circle cx="122" cy="272" r="2" fill="#e0b040" />

      {/* LE COU */}
      <path d="M137 186 L163 186 L165 230 Q150 238 135 230 Z" fill="url(#pMaSkin)" />

      {HF({ skin: "#d0a67e", hair: "#1a1008", look: "slick", mustache: true })}
    </svg>
  );
}

/* SEAN O'SULLIVAN — le fils de James, jeune homme (30 ans) en 1915.
   Cheveux auburn plus foncés que son père, rasé de près, costume clair
   moderne (col fermé, cravate rayée), l'air éveillé. */
export function PortraitSean() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pSeHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.45" /><stop offset="60%" stopColor="#e8cfa0" stopOpacity="0.14" /><stop offset="100%" stopColor="#e8cfa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pSeSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#eec098" /><stop offset="55%" stopColor="#e0b084" /><stop offset="100%" stopColor="#c8946a" /></linearGradient>
        <linearGradient id="pSeSuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a5a6a" /><stop offset="100%" stopColor="#2c3846" /></linearGradient>
      </defs>
      {HB({ skin: "#e4b48a", hair: "#8a3a1a", look: "short", freckles: true, mood: "content" })}
      <circle cx="150" cy="138" r="130" fill="url(#pSeHalo)" />

      {/* costume gris-bleu + col fermé + cravate rayée verte/or (Irish) */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="url(#pSeSuit)" />
      <path d="M124 232 L108 264 L124 300 L150 268 Z" fill="#2a3846" />
      <path d="M176 232 L192 264 L176 300 L150 268 Z" fill="#2a3846" />
      {/* chemise blanche + cravate rayée */}
      <path d="M140 232 L150 246 L160 232 L158 280 L142 280 Z" fill="#efe9dc" />
      <path d="M146 244 L152 244 L154 296 L148 296 Z" fill="#2a6a3a" />
      {[248, 258, 268, 278, 288].map((y, i) => <path key={i} d={`M146 ${y} l6 0`} stroke="#e0b040" strokeWidth="1.5" />)}

      {/* LE COU */}
      <path d="M137 186 L163 186 L165 230 Q150 238 135 230 Z" fill="url(#pSeSkin)" />

      {HF({ skin: "#e4b48a", hair: "#8a3a1a", look: "short", freckles: true, mood: "content" })}
    </svg>
  );
}

/* JAMES ÂGÉ — même homme, 30 ans plus tard (~1878, 66 ans). Cheveux et
   moustache blancs, petites lunettes rondes de la Belle Époque, redingote
   noire. Un cylindre de cire dans la main, symbole du chapitre. */
export function PortraitJamesVieux() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pJvHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.4" /><stop offset="60%" stopColor="#e8cfa0" stopOpacity="0.12" /><stop offset="100%" stopColor="#e8cfa0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pJvSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#e8b898" /><stop offset="55%" stopColor="#d8a884" /><stop offset="100%" stopColor="#b88864" /></linearGradient>
        <linearGradient id="pJvCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c1610" /><stop offset="100%" stopColor="#0a0806" /></linearGradient>
      </defs>
      {HB({ skin: "#dcac8a", hair: "#e8e4dc", look: "ring", glasses: true, mustache: "handlebar", wrinkles: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pJvHalo)" />

      {/* redingote noire + gilet gris + col empesé */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="url(#pJvCoat)" />
      <path d="M124 232 L108 262 L118 306 L150 262 Z" fill="#0a0806" />
      <path d="M176 232 L192 262 L182 306 L150 262 Z" fill="#0a0806" />
      <path d="M132 232 L150 262 L168 232 L164 300 L136 300 Z" fill="#3a2a20" />
      <path d="M138 236 Q150 250 162 236 L160 262 Q150 268 140 262 Z" fill="#efe6d2" />
      <path d="M146 254 L150 262 L154 254 L152 292 L148 292 Z" fill="#0a0806" />
      {/* chaîne de montre en or */}
      <path d="M132 270 Q150 286 168 272" stroke="#e6c25a" strokeWidth="2.4" fill="none" />
      <circle cx="168" cy="272" r="4" fill="#e6c25a" stroke="#a8801f" strokeWidth="1" />

      {/* LE COU (plus ridé, mais tenons la même géométrie) */}
      <path d="M137 186 L163 186 L165 230 Q150 238 135 230 Z" fill="url(#pJvSkin)" />
      <path d="M138 220 q12 4 24 0" stroke="#a8886a" strokeWidth="1.4" fill="none" opacity="0.6" />

      {HF({ skin: "#dcac8a", hair: "#e8e4dc", look: "ring", glasses: true, mustache: "handlebar", wrinkles: true })}
    </svg>
  );
}

/* LE PHOTOGRAPHE — un homme d'affaires du Wild West (fin 1850s), un peu
   théâtral : redingote sombre, cravate lavallière, favoris fournis,
   tête un peu inclinée sous l'ombre de son voile noir. */
export function PortraitPhotographe() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pPhHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#f0d8b0" stopOpacity="0.4" /><stop offset="60%" stopColor="#d8b898" stopOpacity="0.12" /><stop offset="100%" stopColor="#d8b898" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pPhSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#e8c090" /><stop offset="55%" stopColor="#d0a874" /><stop offset="100%" stopColor="#a88254" /></linearGradient>
        <linearGradient id="pPhCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a2018" /><stop offset="100%" stopColor="#1a0c08" /></linearGradient>
      </defs>
      {HB({ skin: "#dcb282", hair: "#5a3a20", look: "slick", beard: "chops", mustache: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pPhHalo)" />

      {/* redingote brun sombre + gilet fauve + col empesé + lavallière noire */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="url(#pPhCoat)" />
      <path d="M124 232 L108 262 L120 300 L150 262 Z" fill="#1a0c08" />
      <path d="M176 232 L192 262 L180 300 L150 262 Z" fill="#1a0c08" />
      <path d="M132 232 L150 262 L168 232 L164 306 L136 306 Z" fill="#8a6a2a" />
      <path d="M138 236 Q150 250 162 236 L160 262 Q150 268 140 262 Z" fill="#efe6d2" />
      {/* la lavallière (nœud papillon large) */}
      <path d="M138 256 L162 256 L156 274 L150 268 L144 274 Z" fill="#0a0806" />

      {/* LE COU */}
      <path d="M137 186 L163 186 L165 230 Q150 238 135 230 Z" fill="url(#pPhSkin)" />

      {HF({ skin: "#dcb282", hair: "#5a3a20", look: "slick", beard: "chops", mustache: true })}
    </svg>
  );
}

/* L'OUVREUSE DU NICKELODEON — jeune femme, uniforme sombre orné d'un
   liseré doré, chapeau plat, lampe torche à la main. Un rôle très
   répandu dans les salles obscures du début XXᵉ. */
export function PortraitOuvreuse() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pOuHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#f0d8b0" stopOpacity="0.4" /><stop offset="60%" stopColor="#d8b898" stopOpacity="0.12" /><stop offset="100%" stopColor="#d8b898" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pOuSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#f0c8a0" /><stop offset="55%" stopColor="#e0b088" /><stop offset="100%" stopColor="#c0906a" /></linearGradient>
        <linearGradient id="pOuUnif" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a1818" /><stop offset="100%" stopColor="#3a0808" /></linearGradient>
      </defs>
      {HB({ skin: "#e8bc94", hair: "#7a5030", look: "bun", earrings: "#f4f0e4", lips: "#b02030", mood: "content", hat: "pillbox", hatColor: "#7a1a24", hatColor2: "#e8c040" })}
      <circle cx="150" cy="138" r="130" fill="url(#pOuHalo)" />

      {/* uniforme grenat + galon or aux boutonnières + col fermé */}
      <path d="M40 340 Q44 250 96 232 Q122 222 150 224 Q178 222 204 232 Q256 250 260 340 Z" fill="url(#pOuUnif)" />
      {/* rangée de boutons dorés */}
      {[250, 268, 286, 304, 322].map((y, i) => <circle key={i} cx="150" cy={y} r="4" fill="#e0b040" stroke="#a8801f" strokeWidth="1" />)}
      {/* galons épaulettes */}
      <path d="M96 232 L108 232 L112 246 L100 246 Z" fill="#e0b040" />
      <path d="M204 232 L192 232 L188 246 L200 246 Z" fill="#e0b040" />
      {/* le col fermé */}
      <path d="M136 226 L164 226 L162 244 L138 244 Z" fill="#3a0808" />
      <path d="M138 228 h24 M138 236 h24" stroke="#e0b040" strokeWidth="1.2" opacity="0.7" />

      {/* LE COU */}
      <path d="M137 190 L163 190 L165 230 Q150 238 135 230 Z" fill="url(#pOuSkin)" />

      {HF({ skin: "#e8bc94", hair: "#7a5030", look: "bun", earrings: "#f4f0e4", lips: "#b02030", mood: "content", hat: "pillbox", hatColor: "#7a1a24", hatColor2: "#e8c040" })}
    </svg>
  );
}
