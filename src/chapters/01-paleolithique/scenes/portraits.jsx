/* ============================================================
   CHAPITRE 1 — Portraits « gros plan »
   Utilisés par la quête (étapes avec `portrait: "…"`) : le
   personnage apparaît en grand, face au joueur, comme s'il
   s'avançait devant l'écran. Dessinés ici : libres de droits.
   Même construction pour les quatre : halo du matin, chevelure
   arrière, buste en peau de bête, visage ovale, détails.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

/* ANA — l'accueillante du clan. Longs cheveux bruns qui couvrent
   tout le crâne, un collier de coquillages, les traits d'ocre du
   clan sur la pommette, un sourire doux. */
export function PortraitAna() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pAnaHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffe4a8" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#f0c890" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pAnaSkin" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#d8a97a" />
          <stop offset="55%" stopColor="#c89a72" />
          <stop offset="100%" stopColor="#b0855c" />
        </linearGradient>
        <linearGradient id="pAnaFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#96754f" />
          <stop offset="100%" stopColor="#6a4f34" />
        </linearGradient>
        <linearGradient id="pAnaHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#453222" />
          <stop offset="100%" stopColor="#2b1d10" />
        </linearGradient>
      </defs>

      <circle cx="150" cy="138" r="130" fill="url(#pAnaHalo)" />

      {HB({ skin: "#cf9f72", hair: "#3a2818", look: "long", mood: "content", paint: true, earrings: "#e8dcc4" })}
      {/* LE BUSTE : la peau de bête nouée, une épaule nue */}
      <path d="M44 340 Q46 260 94 238 Q122 226 150 228 Q180 226 208 238 Q254 260 256 340 Z" fill="url(#pAnaFur)" />
      <path d="M94 238 Q120 226 150 228 L150 272 Q112 268 94 250 Z" fill="url(#pAnaSkin)" />
      <path d="M98 244 q22 -12 48 -12" stroke="#e0b68a" strokeWidth="3" fill="none" opacity="0.5" />
      <g stroke="#54381e" strokeWidth="2.4" fill="none" opacity="0.65">
        <path d="M160 246 q12 -6 24 -1 M196 258 q12 -6 23 0 M170 272 q13 -6 25 0 M120 286 q13 -7 25 0 M150 296 q13 -6 25 0 M196 292 q12 -6 23 0 M84 306 q13 -6 25 0 M172 316 q13 -6 25 0 M120 322 q13 -6 25 0 M220 318 q12 -5 22 0" />
      </g>
      <path d="M196 240 Q206 262 202 290" stroke="#4a3018" strokeWidth="3" fill="none" opacity="0.6" strokeDasharray="6 5" />

      {/* LE COU */}
      <path d="M134 190 L166 190 L169 240 Q150 248 131 240 Z" fill="url(#pAnaSkin)" />
      <path d="M136 196 q14 8 28 0" stroke="#9a7050" strokeWidth="4" fill="none" opacity="0.4" />

      {HF({ skin: "#cf9f72", hair: "#3a2818", look: "long", mood: "content", paint: true, earrings: "#e8dcc4" })}
      {/* LE COLLIER de coquillages */}
      <path d="M116 252 Q150 272 184 252" stroke="#54381e" strokeWidth="2.6" fill="none" />
      {[[127, 260, -18], [139, 266, -8], [150, 268, 0], [161, 266, 8], [173, 260, 18]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <path d="M0 0 Q-3.5 4 0 9 Q3.5 4 0 0 Z" fill="#e8dcc4" stroke="#b8a884" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/* RAYA — le chef. Cheveux poivre et sel ramenés en arrière, barbe
   fournie, regard droit sous des sourcils épais, collier de crocs :
   l'autorité tranquille. */
export function PortraitRaya() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pRayaHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#e8b880" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#e8b880" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pRayaSkin" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#c99a6c" />
          <stop offset="55%" stopColor="#b78a5e" />
          <stop offset="100%" stopColor="#9c704a" />
        </linearGradient>
        <linearGradient id="pRayaFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7e5f3e" />
          <stop offset="100%" stopColor="#523c26" />
        </linearGradient>
        <linearGradient id="pRayaHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#57503f" />
          <stop offset="100%" stopColor="#332c1e" />
        </linearGradient>
      </defs>

      <circle cx="150" cy="138" r="130" fill="url(#pRayaHalo)" />

      {HB({ skin: "#c0926a", hair: "#5e5646", look: "slick", wrinkles: true })}
      {/* LE MANTEAU du chef : fourrure épaisse sur les DEUX épaules */}
      <path d="M40 340 Q42 256 92 234 Q122 222 150 224 Q178 222 208 234 Q258 256 260 340 Z" fill="url(#pRayaFur)" />
      <g stroke="#3e2c18" strokeWidth="2.6" fill="none" opacity="0.6">
        <path d="M96 250 q13 -7 26 0 M140 244 q13 -6 26 0 M184 252 q13 -6 25 0 M76 280 q13 -6 26 0 M120 274 q13 -6 26 0 M168 278 q13 -6 26 0 M212 286 q12 -6 24 0 M96 306 q13 -6 26 0 M148 302 q13 -6 26 0 M196 314 q13 -6 25 0 M120 330 q13 -6 26 0" />
      </g>
      {/* l'attache en os du manteau */}
      <rect x="138" y="284" width="24" height="7" rx="3.5" fill="#e0d4bc" stroke="#a89878" strokeWidth="1.2" transform="rotate(-8 150 287)" />

      {/* LE COU */}
      <path d="M134 188 L166 188 L169 234 Q150 242 131 234 Z" fill="url(#pRayaSkin)" />

      {HF({ skin: "#c0926a", hair: "#5e5646", look: "slick", wrinkles: true })}
      {/* LE COLLIER de crocs — trophées du chef */}
      <path d="M116 248 Q150 268 184 248" stroke="#3e2c18" strokeWidth="2.8" fill="none" />
      {[[129, 256, -22], [141, 262, -10], [150, 264, 0], [159, 262, 10], [171, 256, 22]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <path d="M-3 0 Q-3 8 0 13 Q3 8 3 0 Q0 -2 -3 0 Z" fill="#eee2c8" stroke="#b0a080" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/* DORU — le chasseur. Jeune, vif, un bandeau de cuir avec une plume,
   une fine cicatrice au sourcil, la sangle de son carquois en travers
   de la poitrine. */
export function PortraitDoru() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pDoruHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#d8e4c0" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#b8cc98" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#b8cc98" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pDoruSkin" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#d0a072" />
          <stop offset="55%" stopColor="#bf9066" />
          <stop offset="100%" stopColor="#a3764e" />
        </linearGradient>
        <linearGradient id="pDoruFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6a44" />
          <stop offset="100%" stopColor="#5e4629" />
        </linearGradient>
      </defs>

      <circle cx="150" cy="138" r="130" fill="url(#pDoruHalo)" />

      {HB({ skin: "#c8986c", hair: "#2c2013", look: "ponytail", mood: "colere", hat: "headband", hatColor: "#8a5a30", paint: true })}
      {/* LE BUSTE : tenue légère de chasse, une épaule nue */}
      <path d="M46 340 Q48 262 96 240 Q124 228 150 230 Q178 228 206 240 Q252 262 254 340 Z" fill="url(#pDoruFur)" />
      <path d="M150 230 Q178 228 206 240 L206 262 Q176 250 150 252 Z" fill="url(#pDoruSkin)" />
      <g stroke="#4a3419" strokeWidth="2.4" fill="none" opacity="0.6">
        <path d="M96 258 q13 -6 25 0 M130 250 q13 -6 25 0 M92 288 q13 -6 25 0 M136 282 q13 -6 25 0 M110 314 q13 -6 25 0 M160 306 q13 -6 25 0 M204 296 q12 -6 24 0 M186 326 q13 -6 25 0" />
      </g>
      {/* LA SANGLE du carquois, en travers */}
      <path d="M98 246 Q150 290 214 330" stroke="#5a3a20" strokeWidth="11" fill="none" />
      <path d="M98 246 Q150 290 214 330" stroke="#7a5230" strokeWidth="3" fill="none" opacity="0.7" strokeDasharray="8 7" />

      {/* LE COU */}
      <path d="M134 188 L166 188 L169 238 Q150 246 131 238 Z" fill="url(#pDoruSkin)" />
      <path d="M136 194 q14 8 28 0" stroke="#96684a" strokeWidth="4" fill="none" opacity="0.4" />

      {HF({ skin: "#c8986c", hair: "#2c2013", look: "ponytail", mood: "colere", hat: "headband", hatColor: "#8a5a30", paint: true })}
      {/* la plume, glissée dans le bandeau */}
      <g transform="translate(196,102) rotate(24)">
        <path d="M0 0 Q-7 -16 -2 -38 Q10 -20 6 -2 Q3 2 0 0 Z" fill="#9a8a72" />
        <path d="M1 -2 L-1 -34" stroke="#6e6250" strokeWidth="1.6" />
        <path d="M0 -10 l-5 -3 M1 -16 l6 -3 M0 -22 l-5 -3 M1 -28 l5 -3" stroke="#6e6250" strokeWidth="1" opacity="0.8" />
      </g>

      {/* LE PENDENTIF : une seule griffe, celle de sa première chasse */}
      <path d="M126 252 Q150 266 174 252" stroke="#4a3419" strokeWidth="2.6" fill="none" />
      <g transform="translate(150,262) rotate(4)">
        <path d="M-4 0 Q-5 10 0 16 Q5 10 4 0 Q0 -3 -4 0 Z" fill="#eee2c8" stroke="#b0a080" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

/* KYAN — la mémoire du clan. Cheveux blancs, rides profondes et
   douces, les points d'ocre rituels sur le front, un pendentif
   d'ivoire gravé d'une spirale : tout ce qu'elle sait, elle le porte. */
export function PortraitKyan() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pKyanHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ffe8c0" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#f0d0a0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f0d0a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pKyanSkin" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#c69468" />
          <stop offset="55%" stopColor="#b3835a" />
          <stop offset="100%" stopColor="#95693f" />
        </linearGradient>
        <linearGradient id="pKyanFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6e5a44" />
          <stop offset="100%" stopColor="#48392a" />
        </linearGradient>
        <linearGradient id="pKyanHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4dccc" />
          <stop offset="100%" stopColor="#b8ae9a" />
        </linearGradient>
      </defs>

      <circle cx="150" cy="138" r="130" fill="url(#pKyanHalo)" />

      {HB({ skin: "#c09064", hair: "#e4dccc", look: "long", mood: "content", paint: "dots", wrinkles: true })}
      {/* LE CHÂLE de fourrure, serré sur les épaules */}
      <path d="M46 340 Q48 262 94 240 Q122 228 150 230 Q180 228 206 240 Q252 262 254 340 Z" fill="url(#pKyanFur)" />
      <g stroke="#332818" strokeWidth="2.4" fill="none" opacity="0.6">
        <path d="M92 256 q13 -6 25 0 M136 248 q13 -6 25 0 M182 256 q13 -6 25 0 M76 288 q13 -6 25 0 M118 280 q13 -6 25 0 M166 284 q13 -6 25 0 M210 292 q12 -6 24 0 M96 314 q13 -6 25 0 M146 308 q13 -6 25 0 M194 320 q13 -6 25 0" />
      </g>
      {/* le châle se croise devant */}
      <path d="M104 248 Q140 290 150 340 M196 248 Q160 290 150 340" stroke="#332818" strokeWidth="4" fill="none" opacity="0.5" />

      {/* LE COU */}
      <path d="M135 188 L165 188 L168 238 Q150 246 132 238 Z" fill="url(#pKyanSkin)" />
      <path d="M138 196 q12 7 24 0 M136 206 q14 8 28 0" stroke="#8a6040" strokeWidth="2.6" fill="none" opacity="0.45" />

      {HF({ skin: "#c09064", hair: "#e4dccc", look: "long", mood: "content", paint: "dots", wrinkles: true })}
      {/* LE PENDENTIF d'ivoire gravé d'une spirale */}
      <path d="M122 252 Q150 268 178 252" stroke="#332818" strokeWidth="2.6" fill="none" />
      <circle cx="150" cy="266" r="12" fill="#eee2c8" stroke="#b0a080" strokeWidth="1.6" />
      <path d="M150 266 m0 -1 a1.5 1.5 0 0 1 1.5 1.5 a3.2 3.2 0 0 1 -3.2 3.2 a5.2 5.2 0 0 1 -5.2 -5.2 a7.4 7.4 0 0 1 7.4 -7.4" stroke="#8a7a5c" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
