/* ============================================================
   CHAPITRE 2 — Portraits « gros plan »
   Utilisés par la quête (étapes avec `portrait: "…"`) : le
   personnage s'avance en grand devant l'écran pour parler.
   Même construction que ceux du chapitre 1 : halo, chevelure
   arrière, buste, cou, visage ovale, yeux/nez/bouche, coiffe et
   accessoire caractéristique. Libres de droits.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

/* GUNA — le garde de la porte. Casque de cuir, courte barbe,
   la hampe de sa lance sur l'épaule, le bord de son bouclier
   rond : sévère mais pas méchant. */
export function PortraitGuna() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pGunaHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffe0a4" stopOpacity="0.45" /><stop offset="60%" stopColor="#e8b880" stopOpacity="0.14" /><stop offset="100%" stopColor="#e8b880" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pGunaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#cf9f6f" /><stop offset="55%" stopColor="#bd8f61" /><stop offset="100%" stopColor="#9e7248" /></linearGradient>
        <linearGradient id="pGunaLeather" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5a34" /><stop offset="100%" stopColor="#5a3a20" /></linearGradient>
      </defs>
      {HB({ skin: "#c6965f", hair: "#2c2013", look: "short", hat: "leather", hatColor: "#7a4e2c" })}
      <circle cx="150" cy="138" r="130" fill="url(#pGunaHalo)" />

      {/* LA LANCE, en travers derrière l'épaule : hampe de bois, liure de
          cuir, et un grand fer de lance en feuille — pour qu'on la lise bien */}
      <path d="M52 306 L212 120" stroke="#6e4c2e" strokeWidth="9" strokeLinecap="round" />
      <path d="M52 306 L212 120" stroke="#8a6a44" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <g stroke="#4a2f18" strokeWidth="2.4" strokeLinecap="round"><path d="M204 130 l14 -12 M208 136 l14 -12 M212 142 l14 -12" /></g>
      <path d="M205 114 L221 130 L250 74 Z" fill="#9aa0ac" stroke="#e2e6ee" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M213 122 L247 80" stroke="#e2e6ee" strokeWidth="1.4" opacity="0.85" />
      <path d="M210 120 L238 86" stroke="#6a707c" strokeWidth="1.1" fill="none" opacity="0.55" />

      {/* LE BUSTE : cuirasse de cuir sur les épaules */}
      <path d="M42 340 Q44 258 92 236 Q122 224 150 226 Q178 224 208 236 Q256 258 258 340 Z" fill="url(#pGunaLeather)" />
      <path d="M96 250 q54 -20 108 0" stroke="#5a3a20" strokeWidth="3" fill="none" opacity="0.6" />
      {/* écailles de cuir */}
      <g stroke="#4a2f18" strokeWidth="2" fill="none" opacity="0.55">
        <path d="M104 268 q12 -8 24 0 M140 264 q12 -8 24 0 M176 270 q12 -7 22 0 M120 292 q12 -7 24 0 M158 290 q12 -7 24 0 M100 314 q12 -7 24 0 M148 312 q12 -7 24 0 M192 306 q11 -6 22 0" />
      </g>
      {/* le bord du bouclier rond, à l'épaule droite */}
      <path d="M208 300 A54 54 0 0 1 250 250" stroke="#7a4e2c" strokeWidth="14" fill="none" />
      <path d="M208 300 A54 54 0 0 1 250 250" stroke="#a06a3a" strokeWidth="4" fill="none" opacity="0.6" />

      {/* LE COU */}
      <path d="M134 190 L166 190 L169 240 Q150 248 131 240 Z" fill="url(#pGunaSkin)" />

      {HF({ skin: "#c6965f", hair: "#2c2013", look: "short", hat: "leather", hatColor: "#7a4e2c" })}
    </svg>
  );
}

/* TANNIS — le roi de la cité. Couronne d'or à pointes et gemme
   rouge, barbe soignée, collier d'or, manteau pourpre : l'autorité
   qui juge d'un regard. */
export function PortraitTannis() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pTanHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.5" /><stop offset="60%" stopColor="#f0c890" stopOpacity="0.16" /><stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pTanSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#cf9f6f" /><stop offset="55%" stopColor="#bd8f61" /><stop offset="100%" stopColor="#9e7248" /></linearGradient>
        <linearGradient id="pTanRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a2a4a" /><stop offset="100%" stopColor="#5a1c34" /></linearGradient>
        <linearGradient id="pTanGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2cf6a" /><stop offset="100%" stopColor="#c89a2a" /></linearGradient>
      </defs>
      {HB({ skin: "#c6965f", hair: "#1a1408", look: "short", hat: "crown", hatColor: "#e8c050", earrings: "#e8c050" })}
      <circle cx="150" cy="138" r="130" fill="url(#pTanHalo)" />

      {/* LE MANTEAU pourpre, large sur les épaules */}
      <path d="M38 340 Q40 254 92 232 Q122 220 150 222 Q178 220 208 232 Q260 254 262 340 Z" fill="url(#pTanRobe)" />
      <path d="M96 246 Q150 226 204 246" stroke="#3a1222" strokeWidth="3" fill="none" opacity="0.6" />
      {/* bordure brodée d'or au col */}
      <path d="M108 250 Q150 292 192 250" stroke="url(#pTanGold)" strokeWidth="9" fill="none" />
      <path d="M108 250 Q150 292 192 250" stroke="#8a6a1a" strokeWidth="2" fill="none" opacity="0.5" />
      {/* LE COLLIER d'or à pendentif */}
      <path d="M120 250 Q150 280 180 250" stroke="url(#pTanGold)" strokeWidth="5" fill="none" />
      <circle cx="150" cy="276" r="9" fill="url(#pTanGold)" stroke="#a8842a" strokeWidth="1.4" />
      <circle cx="150" cy="276" r="3.4" fill="#c8382e" />

      {/* LE COU */}
      <path d="M134 190 L166 190 L169 240 Q150 248 131 240 Z" fill="url(#pTanSkin)" />

      {HF({ skin: "#c6965f", hair: "#1a1408", look: "short", hat: "crown", hatColor: "#e8c050", earrings: "#e8c050" })}
    </svg>
  );
}

/* JALA — la potière. Cheveux bruns noués en chignon, un fichu,
   une trace d'argile sur la joue, robe bleue, sourire ouvert :
   la fierté de l'artisane. */
export function PortraitJala() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pJalaHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffe4b0" stopOpacity="0.45" /><stop offset="60%" stopColor="#f0cc94" stopOpacity="0.14" /><stop offset="100%" stopColor="#f0cc94" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pJalaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d8a97a" /><stop offset="55%" stopColor="#c89a72" /><stop offset="100%" stopColor="#b0855c" /></linearGradient>
        <linearGradient id="pJalaDress" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a6a8a" /><stop offset="100%" stopColor="#274e6c" /></linearGradient>
        <linearGradient id="pJalaScarf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8502e" /><stop offset="100%" stopColor="#9a3a20" /></linearGradient>
      </defs>
      <circle cx="150" cy="138" r="130" fill="url(#pJalaHalo)" />

      {HB({ skin: "#cf9f72", hair: "#4a3020", look: "bun", mood: "content", hat: "headband", hatColor: "#b84828" })}
      {/* LE BUSTE : robe bleue, tablier de potière */}
      <path d="M44 340 Q46 260 94 238 Q122 226 150 228 Q178 226 206 238 Q254 260 256 340 Z" fill="url(#pJalaDress)" />
      <path d="M118 244 Q150 236 182 244 L176 340 L124 340 Z" fill="#8a6a4a" opacity="0.55" />
      <path d="M96 250 q54 -18 108 0" stroke="#1e3e58" strokeWidth="3" fill="none" opacity="0.6" />
      {/* éclaboussures d'argile sur le tablier */}
      {[[132, 280], [162, 300], [140, 318], [176, 274]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="3.4" fill="#c8b090" opacity="0.5" />)}

      {/* LE COU */}
      <path d="M135 190 L165 190 L168 238 Q150 246 132 238 Z" fill="url(#pJalaSkin)" />

      {HF({ skin: "#cf9f72", hair: "#4a3020", look: "bun", mood: "content", hat: "headband", hatColor: "#b84828" })}
      {/* la trace d'argile sur la joue */}
      <path d="M176 150 q10 4 12 12" stroke="#c8b090" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />

    </svg>
  );
}

/* AHMID — le marchand. Coiffe de tissu, barbe fournie, regard
   futé et chaleureux, robe ocre, un collier de perles d'échange :
   l'homme qui compte tout. */
export function PortraitAhmid() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pAhmHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffdca0" stopOpacity="0.45" /><stop offset="60%" stopColor="#e8b878" stopOpacity="0.14" /><stop offset="100%" stopColor="#e8b878" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pAhmSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#c2905e" /><stop offset="55%" stopColor="#b0824f" /><stop offset="100%" stopColor="#946638" /></linearGradient>
        <linearGradient id="pAhmRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b5803a" /><stop offset="100%" stopColor="#8a5c24" /></linearGradient>
        <linearGradient id="pAhmCloth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e6dcc4" /><stop offset="100%" stopColor="#c4b493" /></linearGradient>
      </defs>
      <circle cx="150" cy="138" r="130" fill="url(#pAhmHalo)" />

      {HB({ skin: "#b8885a", hair: "#1a1408", look: "short", mood: "content", hat: "keffieh", hatColor: "#e2d6bc", hatColor2: "#5a3a20", wrinkles: true })}
      {/* LE BUSTE : robe ocre */}
      <path d="M44 340 Q46 258 94 236 Q122 224 150 226 Q178 224 206 236 Q254 258 256 340 Z" fill="url(#pAhmRobe)" />
      <path d="M96 248 q54 -18 108 0" stroke="#6a4418" strokeWidth="3" fill="none" opacity="0.6" />
      <path d="M150 232 L150 340" stroke="#6a4418" strokeWidth="2.4" opacity="0.4" />
      {/* LE COLLIER de perles d'échange */}
      <path d="M120 250 Q150 278 180 250" stroke="#5a3a1a" strokeWidth="2.4" fill="none" />
      {[[128, 258], [139, 264], [150, 266], [161, 264], [172, 258]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={i % 2 ? "#3a8a9a" : "#c8a860"} stroke="#5a3a1a" strokeWidth="0.8" />)}

      {/* LE COU */}
      <path d="M135 190 L165 190 L168 238 Q150 246 132 238 Z" fill="url(#pAhmSkin)" />

      {HF({ skin: "#b8885a", hair: "#1a1408", look: "short", mood: "content", hat: "keffieh", hatColor: "#e2d6bc", hatColor2: "#5a3a20", wrinkles: true })}
    </svg>
  );
}

/* IMIR — le prêtre. Crâne rasé sous un léger voile, traits d'ocre
   rituels sur le front et les joues, amulette d'os en croissant,
   robe claire : la gravité de celui qui parle aux dieux. */
export function PortraitImir() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pImirHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#fdeccb" stopOpacity="0.5" /><stop offset="60%" stopColor="#e6d6b6" stopOpacity="0.15" /><stop offset="100%" stopColor="#e6d6b6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pImirSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#c99a6c" /><stop offset="55%" stopColor="#b78a5e" /><stop offset="100%" stopColor="#9c704a" /></linearGradient>
        <linearGradient id="pImirRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8e0d0" /><stop offset="100%" stopColor="#c8bda4" /></linearGradient>
      </defs>
      {HB({ skin: "#c0926a", hair: "#2a1a10", look: "bald", paint: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pImirHalo)" />

      {/* LE BUSTE : robe claire de lin, drapé sobre */}
      <path d="M42 340 Q44 256 92 234 Q122 222 150 224 Q178 222 208 234 Q256 256 258 340 Z" fill="url(#pImirRobe)" />
      <path d="M96 248 Q150 228 204 248" stroke="#b0a488" strokeWidth="3" fill="none" opacity="0.6" />
      <path d="M110 246 Q140 300 150 340 M190 246 Q160 300 150 340" stroke="#b0a488" strokeWidth="3" fill="none" opacity="0.5" />
      {/* bande rituelle rouge à l'épaule */}
      <path d="M104 244 Q150 268 150 340" stroke="#a83a2a" strokeWidth="7" fill="none" opacity="0.5" />

      {/* L'AMULETTE d'os en croissant */}
      <path d="M126 250 Q150 264 174 250" stroke="#7a6a4a" strokeWidth="2.4" fill="none" />
      <path d="M150 258 q-16 4 -16 20 q4 -12 16 -12 q12 0 16 12 q0 -16 -16 -20 Z" fill="#eee2c8" stroke="#b0a080" strokeWidth="1.4" />

      {/* LE COU */}
      <path d="M135 190 L165 190 L168 236 Q150 244 132 236 Z" fill="url(#pImirSkin)" />

      {HF({ skin: "#c0926a", hair: "#2a1a10", look: "bald", paint: true })}
    </svg>
  );
}

/* DOKA — le tailleur de pierre. Bandeau de cuir, barbe courte et
   dure, poussière de granit sur la peau, mâchoire volontaire, un
   éclat de cuivre à l'oreille : la force concentrée. */
export function PortraitDoka() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pDokaHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#e8dcc0" stopOpacity="0.4" /><stop offset="60%" stopColor="#c8b898" stopOpacity="0.12" /><stop offset="100%" stopColor="#c8b898" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pDokaSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#c2905e" /><stop offset="55%" stopColor="#b0824f" /><stop offset="100%" stopColor="#946638" /></linearGradient>
        <linearGradient id="pDokaFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5636" /><stop offset="100%" stopColor="#523a22" /></linearGradient>
      </defs>
      {HB({ skin: "#b8885a", hair: "#3a2818", look: "short", mood: "colere", hat: "headband", hatColor: "#6a4628", earrings: "#c87a3a" })}
      <circle cx="150" cy="138" r="130" fill="url(#pDokaHalo)" />

      {/* LE BUSTE : torse robuste, une bretelle de cuir, poussière claire */}
      <path d="M40 340 Q42 256 92 234 Q122 222 150 224 Q178 222 208 234 Q258 256 260 340 Z" fill="url(#pDokaSkin)" />
      <path d="M96 246 q54 -14 108 0" stroke="#946638" strokeWidth="2.4" fill="none" opacity="0.4" />
      {/* la bretelle de cuir en travers */}
      <path d="M100 244 Q150 288 212 328" stroke="#5a3a20" strokeWidth="12" fill="none" />
      <path d="M100 244 Q150 288 212 328" stroke="#7a5230" strokeWidth="3" fill="none" opacity="0.6" strokeDasharray="8 7" />
      {/* poussière de granit sur l'épaule */}
      {[[110, 258], [130, 250], [190, 256], [206, 268]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#d8d0c0" opacity="0.5" />)}

      {/* LE COU épais */}
      <path d="M133 190 L167 190 L170 238 Q150 246 130 238 Z" fill="url(#pDokaSkin)" />

      {HF({ skin: "#b8885a", hair: "#3a2818", look: "short", mood: "colere", hat: "headband", hatColor: "#6a4628", earrings: "#c87a3a" })}
    </svg>
  );
}

/* ÖTZI — l'homme des glaces, le mineur. Capuchon de fourrure serré,
   peau tannée par le froid, joues rougies, regard épuisé mais
   plein d'espoir, buée de son souffle, deux traits de tatouage à
   la tempe : la fragilité qui espère guérir. */
export function PortraitOtzi() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pOtziHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#cfe0ec" stopOpacity="0.4" /><stop offset="60%" stopColor="#aac2d4" stopOpacity="0.12" /><stop offset="100%" stopColor="#aac2d4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pOtziSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#c89a72" /><stop offset="55%" stopColor="#b3835a" /><stop offset="100%" stopColor="#94663c" /></linearGradient>
        <linearGradient id="pOtziFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6e4a" /><stop offset="100%" stopColor="#5a4530" /></linearGradient>
        <linearGradient id="pOtziHood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6e5638" /><stop offset="100%" stopColor="#463320" /></linearGradient>
      </defs>
      {HB({ skin: "#bf9068", hair: "#3a2a1a", look: "short", mood: "vexe", hood: true, hoodColor: "#6e5638", wrinkles: true })}
      <circle cx="150" cy="138" r="130" fill="url(#pOtziHalo)" />

      {/* buée du souffle, dans le froid */}
      <ellipse cx="196" cy="196" rx="26" ry="12" fill="#e8f0f6" opacity="0.35" style={{ animation: "drift 3.6s ease-in-out infinite" }} />
      <ellipse cx="214" cy="204" rx="16" ry="8" fill="#e8f0f6" opacity="0.25" style={{ animation: "drift 4.2s ease-in-out infinite" }} />

      {/* LE MANTEAU de fourrure épaisse, touffue */}
      <path d="M36 340 Q40 250 90 230 Q120 218 150 220 Q180 218 210 230 Q260 250 264 340 Z" fill="url(#pOtziFur)" />
      <g stroke="#3e2e1c" strokeWidth="2.6" fill="none" opacity="0.6">
        <path d="M92 246 q13 -8 26 0 M138 240 q13 -7 26 0 M184 248 q13 -7 25 0 M74 278 q13 -7 26 0 M120 272 q13 -7 26 0 M170 276 q13 -7 26 0 M96 306 q13 -7 26 0 M150 300 q13 -7 26 0 M200 310 q12 -6 24 0" />
      </g>
      {/* brins d'herbe du manteau (comme le vrai Ötzi) */}
      <g stroke="#7a6a44" strokeWidth="1.4" opacity="0.5"><path d="M104 300 l-2 26 M118 306 l0 26 M188 302 l2 26 M202 308 l0 24" /></g>

      {/* LE COU emmitouflé */}
      <path d="M136 192 L164 192 L167 232 Q150 240 133 232 Z" fill="url(#pOtziSkin)" />

      {HF({ skin: "#bf9068", hair: "#3a2a1a", look: "short", mood: "vexe", hood: true, hoodColor: "#6e5638", wrinkles: true })}
    </svg>
  );
}
