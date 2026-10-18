import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 3 — Tableau adjacent : LE PORT DE BYBLOS
   ------------------------------------------------------------
   Chantier naval phénicien : squelette de navire en cèdre du
   Liban en construction sur la plage, charpentier au maillet,
   rondins empilés, amphores de pourpre, coquillages murex,
   Méditerranée au loin. Byblos → biblios → Bible (papyrus).
   ============================================================ */

export default function SceneByblos({ collect, action, reveal, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="by-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8ab0d0" /><stop offset="60%" stopColor="#f0c898" /><stop offset="100%" stopColor="#f8d0a0" /></linearGradient>
        <linearGradient id="by-mer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a80a8" /><stop offset="100%" stopColor="#1a4868" /></linearGradient>
        <linearGradient id="by-sable" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8c890" /><stop offset="100%" stopColor="#a08858" /></linearGradient>
        <linearGradient id="by-cedre" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5a2e" /><stop offset="100%" stopColor="#4a3018" /></linearGradient>
        <radialGradient id="by-soleil" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff8d8" /><stop offset="70%" stopColor="#f8d878" stopOpacity="0.4" /><stop offset="100%" stopColor="#f8c058" stopOpacity="0" /></radialGradient>
      </defs>

      <PLayer depth={5}>
        <rect width="1000" height="320" fill="url(#by-sky)" />
        {/* soleil bas */}
        <circle cx="840" cy="180" r="130" fill="url(#by-soleil)" />
        <circle cx="840" cy="180" r="36" fill="#fff4c8" />
        {/* traînée de nuages */}
        <ellipse cx="240" cy="90" rx="130" ry="8" fill="#f0e0c0" opacity="0.6" />
        <ellipse cx="480" cy="140" rx="100" ry="6" fill="#f0e0c0" opacity="0.55" />
        {/* mouettes qui planent */}
        <g opacity="0.7" transform="translate(340,160)" style={{ animation: "float 5s ease-in-out infinite" }}>
          <path d="M0 0 q-4 -4 -8 0 M0 0 q4 -4 8 0" stroke="#f0e8d0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M0 0 q-4 -4 -8 0 M0 0 q4 -4 8 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M22 14 q-3 -3 -6 0 M22 14 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M-24 16 q-3 -3 -6 0 M-24 16 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
        {/* petite mouette isolée qui plonge */}
        <g opacity="0.65" transform="translate(180,220)" style={{ animation: "float 3s ease-in-out infinite" }}>
          <path d="M0 0 q-3 -3 -6 0 M0 0 q3 -3 6 0" stroke="#3a2818" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      <PLayer depth={4}>
        {/* Collines côtières du Liban (mont Liban en arrière) */}
        <path d="M0 320 L0 220 Q150 180 300 210 Q450 240 600 200 Q750 220 900 190 L1000 210 L1000 320 Z" fill="#8a7898" opacity="0.6" />
        {/* cèdres du Liban stylisés sur les crêtes */}
        {[80, 260, 460, 640, 820].map((x, i) => {
          const y = 210 + (i % 2) * 8;
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <path d="M0 0 L0 -14" stroke="#3a2818" strokeWidth="1" />
              <path d="M-8 -8 L8 -8 L0 -14 Z M-10 -3 L10 -3 L0 -9 Z" fill="#2a4020" opacity="0.9" />
            </g>
          );
        })}
      </PLayer>

      <PLayer depth={3}>
        {/* la mer Méditerranée */}
        <rect y="320" width="1000" height="80" fill="url(#by-mer)" />
        {/* vagues */}
        <path d="M0 340 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0" stroke="#a8d0e8" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M0 360 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0 q60 -3 120 0" stroke="#78a8c8" strokeWidth="0.8" fill="none" opacity="0.65" />
        {/* reflets brillants animés */}
        {[[120, 350], [340, 356], [560, 348], [780, 356], [900, 344]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="16" ry="1.6" fill="#f8f8e8" opacity="0.55" style={{ animation: `float ${2.4 + (i % 3) * 0.3}s ease-in-out infinite` }} />
        ))}
        {/* petit banc de dauphins qui saute */}
        {[[540, 348], [560, 352], [580, 350]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`} style={{ animation: `float ${1.6 + i * 0.2}s ease-in-out infinite` }}>
            <path d="M-6 0 Q0 -6 6 0 Q4 2 0 1 Q-4 2 -6 0 Z" fill="#3a5878" opacity="0.85" />
          </g>
        ))}
        {/* NAVIRE au large (bateau phénicien avec voile carrée) */}
        <g transform="translate(720,340)" style={{ animation: "float 5s ease-in-out infinite" }}>
          {/* coque */}
          <path d="M-40 0 Q-30 12 30 12 Q40 6 40 0 L-40 0 Z" fill="#5a3818" stroke="#2a1810" strokeWidth="0.8" />
          <path d="M-40 0 L-46 -6 M40 0 L46 -6" stroke="#3a2010" strokeWidth="1" />
          {/* mât + voile carrée */}
          <path d="M0 0 L0 -36" stroke="#3a2010" strokeWidth="1.5" />
          <path d="M-24 -32 L24 -32" stroke="#3a2010" strokeWidth="1.5" />
          <path d="M-22 -32 L-22 -6 L22 -6 L22 -32 Z" fill="#c85028" stroke="#5a1810" strokeWidth="0.6" />
          <path d="M-22 -20 h44 M-22 -12 h44" stroke="#8a2818" strokeWidth="0.5" />
          {/* proue en tête de cheval (marotte phénicienne) */}
          <path d="M40 0 L48 -12 L44 -14 L38 -8 Z" fill="#5a3818" stroke="#2a1810" strokeWidth="0.6" />
        </g>
      </PLayer>

      <PLayer depth={2}>
        {/* plage / sable devant */}
        <path d="M0 400 L1000 400 L1000 560 L0 560 Z" fill="url(#by-sable)" />
        {/* petites vagues qui viennent lécher la plage */}
        <path d="M0 402 q50 -2 100 0 q50 2 100 0 q50 -2 100 0 q50 2 100 0 q50 -2 100 0 q50 2 100 0 q50 -2 100 0 q50 2 100 0 q50 -2 100 0 q50 2 100 0" stroke="#c0dce8" strokeWidth="0.8" fill="none" opacity="0.7" />
        {/* limite mouillée */}
        <path d="M0 405 L1000 405 L1000 420 L0 420 Z" fill="#8a7048" opacity="0.5" />
        {/* traces de pas dans le sable */}
        {[[140, 470], [180, 484], [220, 470], [260, 484]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="6" ry="3" fill="#5a4028" opacity="0.4" />
        ))}
        {/* SQUELETTE du navire en construction (à gauche, sur cales de bois) */}
        <g transform="translate(280,470)">
          {/* cales de bois */}
          <rect x="-160" y="60" width="320" height="8" fill="#5a3818" stroke="#2a1810" strokeWidth="0.6" />
          <rect x="-100" y="50" width="8" height="18" fill="#3a2010" />
          <rect x="0" y="50" width="8" height="18" fill="#3a2010" />
          <rect x="100" y="50" width="8" height="18" fill="#3a2010" />
          {/* quille */}
          <path d="M-150 40 L150 40 L120 20 L-120 20 Z" fill="url(#by-cedre)" stroke="#2a1810" strokeWidth="1" />
          {/* membrures = côtes du bateau */}
          {[-90, -60, -30, 0, 30, 60, 90].map((x, i) => (
            <path key={i} d={`M${x} 40 Q${x * 1.2} 0 ${x * 1.3} -50`} stroke="#6a4018" strokeWidth="4" fill="none" strokeLinecap="round" />
          ))}
          {/* étrave qui pointe */}
          <path d="M150 40 L180 -20 L160 -8 Q150 20 150 40 Z" fill="url(#by-cedre)" stroke="#2a1810" strokeWidth="0.8" />
          {/* copeaux au sol */}
          <path d="M-140 70 q6 -4 12 0 q-6 4 -12 0 Z M-100 74 q6 -4 12 0 q-6 4 -12 0 Z M120 72 q6 -4 12 0 q-6 4 -12 0 Z" fill="#c8946a" opacity="0.85" />
        </g>
        {/* Rondins de cèdre empilés (à droite) */}
        <g transform="translate(760,510)">
          <ellipse cx="0" cy="30" rx="80" ry="6" fill="#0a0604" opacity="0.55" />
          {/* rangée du bas */}
          {[-60, -20, 20, 60].map((x, i) => (
            <g key={`b${i}`} transform={`translate(${x},20)`}>
              <ellipse cx="0" cy="0" rx="20" ry="8" fill="#8a5a2e" stroke="#2a1810" strokeWidth="0.8" />
              <ellipse cx="0" cy="-1" rx="14" ry="5" fill="#c8946a" opacity="0.7" />
              <circle cx="0" cy="-1" r="4" fill="#5a3818" opacity="0.8" />
              <path d="M-10 -1 q10 -3 20 0 M-6 1 q6 -2 12 0" stroke="#3a2010" strokeWidth="0.4" fill="none" opacity="0.6" />
            </g>
          ))}
          {/* rangée du haut */}
          {[-40, 0, 40].map((x, i) => (
            <g key={`t${i}`} transform={`translate(${x},4)`}>
              <ellipse cx="0" cy="0" rx="20" ry="8" fill="#8a5a2e" stroke="#2a1810" strokeWidth="0.8" />
              <ellipse cx="0" cy="-1" rx="14" ry="5" fill="#c8946a" opacity="0.7" />
              <circle cx="0" cy="-1" r="4" fill="#5a3818" opacity="0.8" />
            </g>
          ))}
        </g>
      </PLayer>

      <PLayer depth={1}>
        {/* LE CHARPENTIER phénicien accroupi près du bateau, maillet levé */}
        <g transform="translate(390,494)">
          <ellipse cx="0" cy="34" rx="24" ry="4" fill="#0a0604" opacity="0.55" />
          <Figure x={0} y={34} s={0.76} pose="kneel" skin="#a06838" look="curls" hair="#1a1408" beard="short" beardColor="#2a1a10" earrings
            garment="tunic" coat="#c85028" pants="#6a4028" shoes="#3a2414" bareArms mood="colere"
            arms={[{ a1: 40, a2: 70 }, { a1: 150, a2: 120 }]}>
            {/* rayures du chiton */}
            <path d="M-20 -50 h40 M-21 -40 h42 M-22 -30 h44" stroke="#8a2010" strokeWidth="0.8" opacity="0.7" />
            {/* maillet en bois, levé pour frapper */}
            <g transform="translate(44.6,-85) rotate(28)">
              <rect x="-2.6" y="-24" width="5.2" height="28" rx="1.4" fill="#5a3818" />
              <rect x="-11" y="-36" width="22" height="13" rx="2" fill="#8a5a2e" stroke="#2a1810" strokeWidth="0.8" />
            </g>
          </Figure>
        </g>
        {/* Amphores de pourpre à droite (le fameux commerce phénicien) */}
        <g transform="translate(560,510)">
          <ellipse cx="0" cy="34" rx="28" ry="4" fill="#0a0604" opacity="0.55" />
          <path d="M-10 30 L-12 6 Q-16 -6 -8 -12 L-4 -18 M10 30 L12 6 Q16 -6 8 -12 L4 -18" stroke="#5a2044" strokeWidth="1" fill="none" />
          <path d="M-14 6 Q-14 30 -8 32 L8 32 Q14 30 14 6 Q14 -8 0 -14 Q-14 -8 -14 6 Z" fill="#7a3868" stroke="#3a1428" strokeWidth="0.8" />
          <path d="M-8 -12 L8 -12" stroke="#3a1428" strokeWidth="1.2" />
          {/* poignées */}
          <path d="M-14 -4 Q-20 -8 -14 -14 M14 -4 Q20 -8 14 -14" stroke="#5a2044" strokeWidth="2" fill="none" />
          {/* reflet */}
          <path d="M-6 -6 q3 12 -2 22" stroke="#a06888" strokeWidth="1.2" fill="none" opacity="0.7" />
        </g>
        <g transform="translate(600,522)">
          <path d="M-8 22 L-10 4 Q-12 -4 -6 -8 M8 22 L10 4 Q12 -4 6 -8" stroke="#5a2044" strokeWidth="0.8" fill="none" />
          <path d="M-10 4 Q-10 22 -6 24 L6 24 Q10 22 10 4 Q10 -6 0 -10 Q-10 -6 -10 4 Z" fill="#7a3868" stroke="#3a1428" strokeWidth="0.6" />
        </g>

        {/* Ephemere : coquillage murex + algue sèche (disparaissent au ramassage) */}
        {!inv.includes("coquillage_murex") && (
        <g transform="translate(180,538)">
          {/* coquille murex épineuse (le fameux mollusque à pourpre) */}
          <path d="M0 -6 Q10 -2 12 6 Q10 12 0 12 Q-10 12 -12 6 Q-10 -2 0 -6 Z" fill="#e8c890" stroke="#5a3820" strokeWidth="0.6" />
          <path d="M-2 -2 q4 -1 6 0 q-2 3 -6 0 Z" fill="#8a5a2e" opacity="0.7" />
          {/* épines caractéristiques du murex */}
          <path d="M0 -6 l0 -4 M-8 -2 l-3 -2 M-10 4 l-4 0 M-8 10 l-3 3 M0 12 l0 4 M8 10 l3 3 M10 4 l4 0 M8 -2 l3 -2" stroke="#5a3820" strokeWidth="1" strokeLinecap="round" />
          <path d="M-4 4 q4 3 8 0" stroke="#a06888" strokeWidth="0.5" fill="none" opacity="0.5" />
        </g>
        )}
        {!inv.includes("algue_seche") && (
        <g transform="translate(920,540) rotate(-20)">
          <path d="M0 0 q-3 -14 6 -18 M0 0 q3 -12 -4 -16 M0 0 q6 -8 12 -12 M0 0 q-8 -8 -14 -12" stroke="#3a5028" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M0 0 q0 4 -2 6" stroke="#3a5028" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="6" cy="-14" r="1.4" fill="#3a5028" />
          <circle cx="-4" cy="-14" r="1.2" fill="#3a5028" />
          <circle cx="10" cy="-8" r="1.2" fill="#3a5028" />
        </g>
        )}
      </PLayer>

      <Hotspot cx={390} cy={468} r={40} label="le charpentier phénicien" reveal={reveal} onClick={() => action("charpentier")} />
      <Hotspot cx={280} cy={440} r={80} label="squelette du navire en cèdre" reveal={reveal} onClick={() => action("squelette_navire")} />
      <Hotspot cx={760} cy={510} r={60} label="rondins de cèdre du Liban" reveal={reveal} onClick={() => action("rondins")} />
      <Hotspot cx={580} cy={510} r={30} label="amphores de pourpre" reveal={reveal} onClick={() => action("pourpre")} />
      <Hotspot cx={720} cy={330} r={40} label="navire phénicien au large" reveal={reveal} onClick={() => action("navire_large")} />
      <Hotspot cx={180} cy={538} r={16} label="coquillage murex" item="coquillage_murex" reveal={reveal} onClick={() => collect("coquillage_murex")} />
      <Hotspot cx={920} cy={540} r={16} label="algue sèche" item="algue_seche" reveal={reveal} onClick={() => collect("algue_seche")} />
      {/* MOUETTES BLANCHES qui planent au-dessus du port — descente
          en diagonale du haut-droit vers le milieu-gauche, contraste
          blanc sur la mer bleue. */}
      <g opacity="0.9">
        <animateTransform attributeName="transform" type="translate"
          values="1080,60; -40,240; 1080,60" dur="26s" repeatCount="indefinite" />
        <path d="M0 100 q6 -8 12 0 q6 -8 12 0" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M32 118 q5 -6 10 0 q5 -6 10 0" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M56 90 q5 -6 10 0 q5 -6 10 0" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
</svg>
  );
}
