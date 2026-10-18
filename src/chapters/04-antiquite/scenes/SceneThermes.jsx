import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 4 — Tableau adjacent : LES THERMES DE POMPÉI
   ------------------------------------------------------------
   Le caldarium (salle chaude) des thermes du Forum : voûte à
   caissons, mosaïque au sol, alcôve avec labrum (vasque d'eau
   chaude), niches à statues, baigneurs qui discutent (la vraie
   « place publique » sociale de Rome). Vapeur qui monte.
   ============================================================ */

export default function SceneThermes({ collect, action, reveal, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="th-voute" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8c890" /><stop offset="100%" stopColor="#a07840" /></linearGradient>
        <linearGradient id="th-mur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c89058" /><stop offset="100%" stopColor="#7a5028" /></linearGradient>
        <linearGradient id="th-marbre" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0e8d8" /><stop offset="100%" stopColor="#a89880" /></linearGradient>
        <radialGradient id="th-eau" cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor="#c8e8f0" /><stop offset="100%" stopColor="#5090a8" /></radialGradient>
        <radialGradient id="th-vapeur" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0f0e8" stopOpacity="0.7" /><stop offset="100%" stopColor="#f0f0e8" stopOpacity="0" /></radialGradient>
      </defs>

      <PLayer depth={5}>
        {/* Voûte en berceau à caissons — arrière-plan */}
        <rect width="1000" height="380" fill="url(#th-voute)" />
        {/* caissons décoratifs (grille) */}
        {Array.from({ length: 5 }).map((_, r) => (
          <g key={r}>
            {Array.from({ length: 12 }).map((_, c) => (
              <g key={c} transform={`translate(${c * 84 + 12},${r * 60 + 20})`}>
                <rect width="72" height="48" fill="none" stroke="#5a3818" strokeWidth="0.6" opacity="0.5" />
                {/* rosette centrale */}
                <circle cx="36" cy="24" r="6" fill="#8a5828" opacity="0.35" />
                <path d="M30 24 h12 M36 18 v12" stroke="#5a3818" strokeWidth="0.4" opacity="0.5" />
              </g>
            ))}
          </g>
        ))}
        {/* halo doré de lampe à huile suspendue */}
        <circle cx="500" cy="70" r="90" fill="#f8d878" opacity="0.15" />
      </PLayer>

      <PLayer depth={4}>
        {/* Grande niche voûtée du fond (labrum au centre) */}
        <g transform="translate(500,340)">
          <path d="M-120 0 L-120 -140 Q-120 -220 0 -220 Q120 -220 120 -140 L120 0 Z" fill="url(#th-mur)" stroke="#5a3818" strokeWidth="1" />
          {/* dégradé d'ombre dans la niche */}
          <path d="M-100 -20 L-100 -140 Q-100 -200 0 -200 Q100 -200 100 -140 L100 -20 Z" fill="#3a2010" opacity="0.55" />
          {/* colonnes fines de part et d'autre */}
          <rect x="-134" y="-160" width="10" height="160" fill="url(#th-marbre)" stroke="#8a7860" strokeWidth="0.4" />
          <rect x="124" y="-160" width="10" height="160" fill="url(#th-marbre)" stroke="#8a7860" strokeWidth="0.4" />
          <rect x="-138" y="-168" width="18" height="10" fill="url(#th-marbre)" stroke="#5a5040" strokeWidth="0.5" />
          <rect x="120" y="-168" width="18" height="10" fill="url(#th-marbre)" stroke="#5a5040" strokeWidth="0.5" />
        </g>
        {/* Petites niches latérales avec statues */}
        {[[180, 340], [820, 340]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <path d="M-40 0 L-40 -110 Q-40 -140 0 -140 Q40 -140 40 -110 L40 0 Z" fill="url(#th-mur)" stroke="#5a3818" strokeWidth="0.8" />
            <path d="M-32 -20 L-32 -110 Q-32 -132 0 -132 Q32 -132 32 -110 L32 -20 Z" fill="#3a2010" opacity="0.55" />
            {/* statuette */}
            <g transform="translate(0,-30)">
              <ellipse cx="0" cy="0" rx="12" ry="4" fill="#f0e8d8" opacity="0.85" />
              <path d="M-10 0 Q-8 -40 0 -46 Q8 -40 10 0 Z" fill="url(#th-marbre)" stroke="#8a7860" strokeWidth="0.5" />
              <ellipse cx="0" cy="-52" rx="6" ry="7" fill="#f0e8d8" stroke="#8a7860" strokeWidth="0.4" />
              {/* drapé */}
              <path d="M-8 -20 q0 -8 8 -12 M8 -20 q0 -8 -8 -12" stroke="#8a7860" strokeWidth="0.4" fill="none" />
            </g>
          </g>
        ))}
      </PLayer>

      <PLayer depth={3}>
        {/* LABRUM au centre : grande vasque de marbre avec eau chaude */}
        <g transform="translate(500,410)">
          {/* pied de la vasque */}
          <rect x="-16" y="20" width="32" height="30" fill="url(#th-marbre)" stroke="#5a5040" strokeWidth="0.8" />
          <ellipse cx="0" cy="52" rx="46" ry="8" fill="url(#th-marbre)" stroke="#5a5040" strokeWidth="0.8" />
          {/* coupe */}
          <path d="M-56 0 Q-56 -20 0 -22 Q56 -20 56 0 L44 20 Q0 26 -44 20 Z" fill="url(#th-marbre)" stroke="#5a5040" strokeWidth="1" />
          {/* eau chaude à l'intérieur */}
          <ellipse cx="0" cy="-6" rx="48" ry="12" fill="url(#th-eau)" stroke="#3a6878" strokeWidth="0.8" />
          {/* reflets */}
          <path d="M-30 -8 q30 -6 60 0" stroke="#f0f8f8" strokeWidth="0.6" fill="none" opacity="0.7" />
          {/* vapeur qui monte — 2 couches à rythmes différents */}
          <g style={{ animation: "float 3s ease-in-out infinite" }}>
            <ellipse cx="-20" cy="-30" rx="20" ry="10" fill="url(#th-vapeur)" />
            <ellipse cx="10" cy="-40" rx="24" ry="12" fill="url(#th-vapeur)" />
            <ellipse cx="30" cy="-30" rx="18" ry="9" fill="url(#th-vapeur)" />
          </g>
          <g style={{ animation: "float 4.5s ease-in-out infinite" }} opacity="0.7">
            <ellipse cx="-30" cy="-56" rx="26" ry="12" fill="url(#th-vapeur)" />
            <ellipse cx="20" cy="-70" rx="30" ry="14" fill="url(#th-vapeur)" />
            <ellipse cx="0" cy="-96" rx="34" ry="16" fill="url(#th-vapeur)" />
          </g>
          {/* petites gouttes qui coulent sur la vasque */}
          <path d="M-42 12 q0 8 -2 12 M46 10 q0 8 2 14" stroke="#8ab0c8" strokeWidth="1" fill="none" opacity="0.7" />
        </g>
        {/* Rayons de lumière obliques qui descendent de la voûte */}
        <path d="M600 40 L820 200 L860 200 L640 40 Z" fill="#f8e8b8" opacity="0.18" />
        <path d="M400 40 L200 200 L160 200 L360 40 Z" fill="#f8e8b8" opacity="0.15" />
      </PLayer>

      <PLayer depth={2}>
        {/* MOSAÏQUE au sol : damier noir et blanc avec motif géométrique */}
        <rect y="440" width="1000" height="120" fill="#e0d0b8" />
        {/* tesselles noires en damier */}
        {Array.from({ length: 22 }).map((_, c) => (
          <g key={c}>
            {Array.from({ length: 6 }).map((_, r) => (
              (c + r) % 2 === 0
                ? <rect key={r} x={c * 46} y={440 + r * 20} width="46" height="20" fill="#2a2018" />
                : null
            ))}
          </g>
        ))}
        {/* motif central circulaire (dauphin/rosette stylisé) */}
        <g transform="translate(500,500)">
          <circle r="42" fill="#e0d0b8" stroke="#2a2018" strokeWidth="2" />
          <circle r="30" fill="none" stroke="#2a2018" strokeWidth="1" />
          {/* dauphin stylisé */}
          <path d="M-24 4 Q-14 -12 0 -10 Q14 -12 24 4 Q14 8 8 -2 Q0 -14 -8 -2 Q-14 8 -24 4 Z" fill="#2a2018" />
          <circle cx="-14" cy="0" r="1.5" fill="#e0d0b8" />
        </g>
        {/* eau ruisselante sur le sol devant le labrum */}
        <path d="M470 448 q-4 20 -14 40 M530 448 q4 20 14 40" stroke="#78b0c8" strokeWidth="1.5" fill="none" opacity="0.7" />
      </PLayer>

      <PLayer depth={1}>
        {/* DEUX BAIGNEURS qui discutent, drapés dans une serviette (à droite) */}
        <g transform="translate(760,490)">
          {/* baigneur 1 (assis sur banc) */}
          <ellipse cx="0" cy="42" rx="26" ry="4" fill="#0a0604" opacity="0.5" />
          {/* banc */}
          <rect x="-30" y="24" width="60" height="16" fill="#8a5a2e" stroke="#3a1810" strokeWidth="0.6" />
          <rect x="-26" y="40" width="6" height="8" fill="#3a2010" />
          <rect x="20" y="40" width="6" height="8" fill="#3a2010" />
          <Figure x={0} y={42} s={0.7} pose="sit" skin="#b88050" hair="#3a2418" look="short" mood="content"
            garment="kilt" coat="#f0e8d0" pants="#b88050" shoes="#6a4a2a" belt={false}
            arms={[{ a1: 14, a2: -30 }, { a1: 70, a2: 110 }]} />
        </g>
        {/* baigneur 2 debout face au 1er */}
        <g transform="translate(680,490)">
          <ellipse cx="0" cy="42" rx="20" ry="4" fill="#0a0604" opacity="0.5" />
          {/* serviette nouée à la taille, une autre sur l'épaule */}
          <Figure x={0} y={42} s={0.68} skin="#c8946a" hair="#3a2418" look="ring" beard="short" beardColor="#5a4030" mood="surpris"
            garment="kilt" coat="#f0e8d0" pants="#c8946a" shoes="#6a4a2a" belt={false}
            arms={[{ a1: 12, a2: 4 }, { a1: 20, a2: -50 }]}>
            <path d="M-22 -88 Q-6 -70 18 -50 L20 -42 Q-4 -60 -22 -76 Z" fill="#e8e0c8" stroke="#8a7860" strokeWidth="0.7" />
          </Figure>
        </g>
        {/* Petits objets thermaux : strigile + fiole d'huile posés (collectable action) */}
        <g transform="translate(280,510)">
          <ellipse cx="0" cy="14" rx="24" ry="3" fill="#0a0604" opacity="0.5" />
          {/* strigile (racloir en bronze courbé) */}
          <path d="M-20 6 q-4 -20 0 -30" stroke="#a88848" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M-20 6 q-4 -20 0 -30" stroke="#e0c088" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* fiole ronde en verre */}
          <ellipse cx="14" cy="0" rx="8" ry="9" fill="#8ab0c8" stroke="#3a5060" strokeWidth="0.6" opacity="0.85" />
          <rect x="12" y="-14" width="4" height="6" fill="#3a5060" />
          <ellipse cx="10" cy="-3" rx="2" ry="4" fill="#c8e0e8" opacity="0.7" />
        </g>

        {/* Ephemere : petite fiole cassée + tessera (disparaissent au ramassage) */}
        {!inv.includes("fiole_cassee") && (
        <g transform="translate(140,538) rotate(30)">
          <path d="M-6 0 L6 -2 L4 4 L-4 4 Z" fill="#a8c8d8" stroke="#3a5060" strokeWidth="0.5" opacity="0.85" />
        </g>
        )}
        {!inv.includes("tessera") && (
        <g transform="translate(920,540)">
          <rect x="-6" y="-6" width="12" height="12" fill="#2a2018" stroke="#8a7860" strokeWidth="0.5" transform="rotate(15)" />
        </g>
        )}
      </PLayer>

      <Hotspot cx={760} cy={470} r={40} label="deux baigneurs qui discutent" reveal={reveal} onClick={() => action("baigneurs")} />
      <Hotspot cx={500} cy={400} r={60} label="le labrum (vasque d'eau chaude)" reveal={reveal} onClick={() => action("labrum")} />
      <Hotspot cx={500} cy={500} r={40} label="mosaïque au dauphin" reveal={reveal} onClick={() => action("mosaique")} />
      <Hotspot cx={280} cy={500} r={30} label="strigile et fiole d'huile" reveal={reveal} onClick={() => action("strigile")} />
      <Hotspot cx={180} cy={280} r={40} label="statue dans la niche" reveal={reveal} onClick={() => action("statue")} />
      <Hotspot cx={820} cy={280} r={40} label="statue dans la niche" reveal={reveal} onClick={() => action("statue")} />
      <Hotspot cx={140} cy={538} r={14} label="fiole cassée" item="fiole_cassee" reveal={reveal} onClick={() => collect("fiole_cassee")} />
      <Hotspot cx={920} cy={540} r={14} label="tessera de mosaïque" item="tessera" reveal={reveal} onClick={() => collect("tessera")} />
    </svg>
  );
}
