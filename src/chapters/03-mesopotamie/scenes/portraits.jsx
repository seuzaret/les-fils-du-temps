/* ============================================================
   CHAPITRE 3 — Portraits « gros plan »
   Le roi Mesannepada et le collecteur d'impôt Narâm-Sîn.
   Même cadre que les autres chapitres (halo, buste, cou, visage
   ovale, yeux/nez/bouche animée), avec les codes sumériens :
   grands yeux soulignés, barbe bouclée royale, coiffe d'Ur,
   châle de laine à touffes (kaunakès). Libres de droits.
   ============================================================ */
import { HeadBack, HeadFront } from "../../../engine/chars.jsx";

/* Tête commune du jeu (engine/chars.jsx), posée à la place de l'ancien visage. */
const HB = (p) => <g transform="translate(150,128) scale(4.7)"><HeadBack {...p} /></g>;
const HF = (p) => <g transform="translate(150,128) scale(4.7)"><HeadFront {...p} /></g>;

import { Mouth } from "../../../engine/faces.jsx";

/* MESANNEPADA — roi d'Ur. Longue barbe noire bouclée en rangées,
   coiffe royale à bourrelet, châle de laine à touffes (kaunakès),
   grands yeux soulignés de khôl : l'autorité sumérienne. */
export function PortraitMesannepada() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pMesHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.5" /><stop offset="60%" stopColor="#f0c890" stopOpacity="0.16" /><stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pMesSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#cf9f6f" /><stop offset="55%" stopColor="#bd8f61" /><stop offset="100%" stopColor="#9e7248" /></linearGradient>
        <linearGradient id="pMesWool" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e6dcc4" /><stop offset="100%" stopColor="#c4b493" /></linearGradient>
        <linearGradient id="pMesCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a67c46" /><stop offset="100%" stopColor="#75552e" /></linearGradient>
        <linearGradient id="pMesGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2cf6a" /><stop offset="100%" stopColor="#c89a2a" /></linearGradient>
      </defs>
      {HB({ skin: "#c6965f", hair: "#1a1008", look: "short", beard: "royal", kohl: true, hat: "turban", hatColor: "#8a6a3e", hatColor2: "#e8c050" })}
      <circle cx="150" cy="138" r="130" fill="url(#pMesHalo)" />

      {/* LE CHÂLE de laine à touffes (kaunakès) sur les épaules */}
      <path d="M38 340 Q40 254 92 232 Q122 220 150 222 Q178 220 208 232 Q260 254 262 340 Z" fill="url(#pMesWool)" />
      {/* les rangées de touffes de laine */}
      <g fill="none" stroke="#b0a077" strokeWidth="2" opacity="0.7">
        {[250, 274, 298, 322].map((y, r) => (
          <path key={r} d={`M60 ${y} q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0`} />
        ))}
      </g>
      {/* liseré d'or au col */}
      <path d="M110 250 Q150 288 190 250" stroke="url(#pMesGold)" strokeWidth="7" fill="none" />
      <circle cx="150" cy="272" r="7" fill="url(#pMesGold)" stroke="#a8842a" strokeWidth="1.2" />

      {/* LE COU */}
      <path d="M134 190 L166 190 L169 240 Q150 248 131 240 Z" fill="url(#pMesSkin)" />

      {HF({ skin: "#c6965f", hair: "#1a1008", look: "short", beard: "royal", kohl: true, hat: "turban", hatColor: "#8a6a3e", hatColor2: "#e8c050" })}
    </svg>
  );
}

/* NARÂM-SÎN — le collecteur d'impôt. Crâne rasé de scribe, visage
   rasé et soucieux, une tablette d'argile et un calame en main,
   tunique de lin : l'homme qui doit tout compter, et n'y arrive plus. */
export function PortraitNaram() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pNarHalo" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#fdeccb" stopOpacity="0.5" /><stop offset="60%" stopColor="#e6d6b6" stopOpacity="0.15" /><stop offset="100%" stopColor="#e6d6b6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pNarSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#c99a6c" /><stop offset="55%" stopColor="#b78a5e" /><stop offset="100%" stopColor="#9c704a" /></linearGradient>
        <linearGradient id="pNarLin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8e0d0" /><stop offset="100%" stopColor="#cabfa4" /></linearGradient>
        <linearGradient id="pNarClay" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9a878" /><stop offset="100%" stopColor="#9a7648" /></linearGradient>
      </defs>
      {HB({ skin: "#c0926a", hair: "#2a1a10", look: "bald", kohl: true, mood: "vexe" })}
      <circle cx="150" cy="138" r="130" fill="url(#pNarHalo)" />

      {/* LE BUSTE : tunique de lin, drapé sobre */}
      <path d="M42 340 Q44 256 92 234 Q122 222 150 224 Q178 222 208 234 Q256 256 258 340 Z" fill="#e6ddcc" />
      <path d="M96 248 Q150 228 204 248" stroke="#b0a488" strokeWidth="3" fill="none" opacity="0.6" />
      <path d="M110 246 Q140 300 150 340 M190 246 Q160 300 150 340" stroke="#b0a488" strokeWidth="2.6" fill="none" opacity="0.5" />

      {/* LA TABLETTE d'argile + le calame, tenus contre la poitrine */}
      <g transform="translate(96,286) rotate(-10)">
        <rect x="-26" y="-20" width="52" height="42" rx="5" fill="url(#pNarClay)" stroke="#7a5636" strokeWidth="1.4" />
        <g stroke="#5c3f22" strokeWidth="1.3" opacity="0.8">
          <path d="M-18 -12 l5 2.5 M-11 -12 l5 2.5 M-4 -12 l5 2.5 M-18 -4 l5 2.5 M-11 -4 l5 2.5 M-18 4 l5 2.5 M-11 4 l5 2.5 M-4 4 l5 2.5" />
        </g>
      </g>
      {/* la main gauche qui tient la tablette */}
      <path d="M120 250 q-14 12 -20 26" stroke="url(#pNarSkin)" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* le calame, dans l'autre main */}
      <g transform="translate(196,268) rotate(28)"><rect x="-2" y="-26" width="4" height="46" rx="2" fill="#c9a86a" /><path d="M-2 -26 l4 0 l-2 -5 Z" fill="#8a6e34" /></g>
      <path d="M182 252 q10 6 14 16" stroke="url(#pNarSkin)" strokeWidth="9" fill="none" strokeLinecap="round" />

      {/* LE COU */}
      <path d="M135 190 L165 190 L168 236 Q150 244 132 236 Z" fill="url(#pNarSkin)" />

      {HF({ skin: "#c0926a", hair: "#2a1a10", look: "bald", kohl: true, mood: "vexe" })}
    </svg>
  );
}

/* SNÉFROU — pharaon d'Égypte. Coiffe némès rayée bleu-or, cobra
   uraeus au front, barbe postiche tressée, large collier ousekh :
   le fils du Soleil qui veut son nom pour l'éternité. */
export function PortraitSnefrou() {
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="pSneHalo" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.5" /><stop offset="60%" stopColor="#f0c890" stopOpacity="0.16" /><stop offset="100%" stopColor="#f0c890" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pSneSkin" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#d29a5e" /><stop offset="55%" stopColor="#c08a4e" /><stop offset="100%" stopColor="#9e6c38" /></linearGradient>
        <linearGradient id="pSneGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2cf6a" /><stop offset="100%" stopColor="#c89a2a" /></linearGradient>
      </defs>
      {HB({ skin: "#c48c52", hair: "#1a1008", look: "bald", beard: "postiche", kohl: true, hat: "nemes", hatColor: "#e8c040", hatColor2: "#2a50a0" })}
      <circle cx="150" cy="138" r="130" fill="url(#pSneHalo)" />

      {/* LE COLLIER OUSEKH large (rangées de perles) sur les épaules */}
      <path d="M40 340 Q42 250 92 236 Q122 224 150 226 Q178 224 208 236 Q258 250 260 340 Z" fill="#e8c04a" />
      <g fill="none" strokeLinecap="round">
        <path d="M96 252 Q150 292 204 252" stroke="#2f6a9a" strokeWidth="7" opacity="0.85" />
        <path d="M92 268 Q150 314 208 268" stroke="#c8382e" strokeWidth="6" opacity="0.8" />
        <path d="M88 284 Q150 334 212 284" stroke="#3a8a6a" strokeWidth="6" opacity="0.8" />
      </g>
      {[110, 128, 146, 164, 182, 200].map((x, i) => <path key={i} d={`M${x} 244 L${x} 250`} stroke="#8a6a1a" strokeWidth="2" />)}

      {/* LE COU */}
      <path d="M134 196 L166 196 L169 240 Q150 248 131 240 Z" fill="url(#pSneSkin)" />

      {HF({ skin: "#c48c52", hair: "#1a1008", look: "bald", beard: "postiche", kohl: true, hat: "nemes", hatColor: "#e8c040", hatColor2: "#2a50a0" })}
    </svg>
  );
}
