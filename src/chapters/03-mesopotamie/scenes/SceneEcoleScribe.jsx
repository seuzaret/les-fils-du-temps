import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Speckle } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 3 — Tableau adjacent : L'ÉCOLE DU SCRIBE (Edubba)
   ------------------------------------------------------------
   La « maison des tablettes » (é-dubba, la plus vieille école
   du monde). Un maître ummia sévère, deux apprentis courbés
   sur leurs tablettes, un mur d'exercices ratés, un panier
   d'argile fraîche dans le coin, une brique de comptage.
   Anachronisme géré au niveau du chapitre (stylo Bic ailleurs).
   ============================================================ */

export default function SceneEcoleScribe({ collect, action, reveal, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ec-mur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b28454" /><stop offset="100%" stopColor="#8a5c2e" /></linearGradient>
        <linearGradient id="ec-sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5a34" /><stop offset="100%" stopColor="#4a3020" /></linearGradient>
        <linearGradient id="ec-argile" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8956a" /><stop offset="100%" stopColor="#8a5f34" /></linearGradient>
        <radialGradient id="ec-lampe" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#ffe4a8" stopOpacity="0.85" /><stop offset="70%" stopColor="#f8b048" stopOpacity="0.4" /><stop offset="100%" stopColor="#f8a848" stopOpacity="0" /></radialGradient>
        <linearGradient id="ec-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1a0e06" stopOpacity="0.75" /><stop offset="100%" stopColor="#1a0e06" stopOpacity="0" /></linearGradient>
        <linearGradient id="ec-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe6b0" stopOpacity="0.32" /><stop offset="100%" stopColor="#ffe6b0" stopOpacity="0" /></linearGradient>
        <filter id="ec-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="ec-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.4 0" /></filter>
      </defs>

      <PLayer depth={1}>
        {/* mur du fond en briques crues */}
        <rect width="1000" height="440" fill="url(#ec-mur)" />
        <rect width="1000" height="440" fill="#3a2818" opacity="0.3" filter="url(#ec-grain)" />
        {/* rangées de briques */}
        {Array.from({ length: 10 }).map((_, r) => (
          <g key={r}>
            {Array.from({ length: 14 }).map((_, c) => (
              <rect key={c} x={c * 72 + (r % 2 ? -36 : 0)} y={r * 44} width="70" height="42" fill="none" stroke="#5a3818" strokeWidth="0.5" opacity="0.6" />
            ))}
          </g>
        ))}
        {/* petite ouverture haute (fente d'aération) */}
        <rect x="60" y="60" width="120" height="30" fill="#e0b878" opacity="0.55" />
        <rect x="60" y="60" width="120" height="30" fill="none" stroke="#3a1810" strokeWidth="1.5" />
        <rect x="820" y="60" width="120" height="30" fill="#e0b878" opacity="0.55" />
        <rect x="820" y="60" width="120" height="30" fill="none" stroke="#3a1810" strokeWidth="1.5" />
        {/* le ciel par les fentes d'aération, et les rais de lumière qui descendent */}
        <rect x="64" y="64" width="112" height="22" fill="#a8c8e0" opacity="0.85" />
        <rect x="824" y="64" width="112" height="22" fill="#a8c8e0" opacity="0.85" />
        <path d="M64 88 L176 88 L330 440 L190 440 Z" fill="url(#ec-shaft)" filter="url(#ec-blur)" />
        <path d="M824 88 L936 88 L810 440 L670 440 Z" fill="url(#ec-shaft)" filter="url(#ec-blur)" />
        {/* plafond de troncs de palmier */}
        <rect x="-40" y="-20" width="1080" height="34" fill="#3a2818" />
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <ellipse cx={i * 90 - 10} cy="14" rx="40" ry="10" fill="#5a3e24" />
            <ellipse cx={i * 90 - 10} cy="12" rx="38" ry="6" fill="#7a5634" />
            <path d={`M${i * 90 - 44} 12 h68`} stroke="#3a2818" strokeWidth="1" opacity="0.6" />
          </g>
        ))}
        {/* les angles de la pièce dans l'ombre */}
        <rect x="-40" y="0" width="160" height="440" fill="url(#ec-side)" />
        <rect x="880" y="0" width="160" height="440" fill="url(#ec-side)" transform="translate(1920,0) scale(-1,1)" />
        {/* niches creusées dans le mur, remplies de tablettes */}
        {[[30, 330], [930, 330]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 26} y={y - 46} width="52" height="56" fill="#2a180c" />
            <path d={`M${x - 26} ${y - 46} h52 v56`} stroke="#c89a62" strokeWidth="1.4" fill="none" opacity="0.4" />
            {[0, 1, 2].map((k) => <rect key={k} x={x - 22 + k * 15} y={y - 8} width="13" height="16" rx="2" fill="#a8784a" stroke="#5a3818" strokeWidth="0.6" />)}
            {[0, 1, 2].map((k) => <rect key={`b${k}`} x={x - 22 + k * 15} y={y - 34} width="13" height="16" rx="2" fill="#b8865a" stroke="#5a3818" strokeWidth="0.6" />)}
          </g>
        ))}
        {/* halo de lampe au centre */}
        <ellipse cx="500" cy="140" rx="220" ry="80" fill="url(#ec-lampe)" />
        {/* poussière qui danse dans le rai de lumière */}
        {[[420, 120, 1.4], [480, 160, 2], [520, 100, 1.6], [560, 180, 2.2], [500, 200, 1.8]].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r="1.2" fill="#f8e0a0" opacity="0.65" style={{ animation: `float ${d}s ease-in-out infinite` }} />
        ))}
        {/* lampe à huile suspendue */}
        <g transform="translate(500,60)">
          <path d="M0 0 L0 30" stroke="#3a2818" strokeWidth="0.6" />
          <path d="M-14 30 Q-14 44 -6 46 L6 46 Q14 44 14 30 Q14 24 0 22 Q-14 24 -14 30 Z" fill="#8a6828" stroke="#3a2010" strokeWidth="0.6" />
          <path d="M-8 40 Q-8 44 0 44 Q8 44 8 40" stroke="#5a3818" strokeWidth="0.4" fill="none" />
          <path d="M14 32 L22 30 L22 34" stroke="#3a2010" strokeWidth="0.4" fill="none" />
          <ellipse cx="22" cy="32" rx="2.5" ry="3.5" fill="#f8c058" opacity="0.9" />
          <ellipse cx="22" cy="30" rx="1.2" ry="2" fill="#fff4c8" opacity="0.85" />
        </g>
      </PLayer>

      <PLayer depth={1.5}>
        {/* MUR D'EXERCICES : rangée de tablettes accrochées, certaines cassées */}
        <g transform="translate(260,180)">
          {Array.from({ length: 6 }).map((_, i) => {
            const casse = i === 2 || i === 4;
            const x = i * 82;
            return (
              <g key={i} transform={`translate(${x},0) rotate(${(i % 2 ? -3 : 3)})`}>
                {/* corde */}
                <path d={`M18 -14 l0 -20`} stroke="#5a3818" strokeWidth="1.2" />
                {/* tablette */}
                <rect x="0" y="-10" width="60" height="72" rx="6" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="1.2" />
                {casse && <path d="M0 30 L60 40 M20 -10 L40 62" stroke="#3a1810" strokeWidth="1.2" opacity="0.85" />}
                {/* stries cunéiformes */}
                {[0, 1, 2, 3, 4].map((r) => (
                  <g key={r} transform={`translate(6,${4 + r * 10})`}>
                    <path d="M0 0 l3 -3 l3 3 M8 2 l3 -3 l3 3 M16 0 l3 -3 l3 3 M24 2 l3 -3 l3 3 M32 0 l3 -3 l3 3 M40 2 l3 -3 l3 3" stroke="#3a1810" strokeWidth="0.8" fill="none" />
                  </g>
                ))}
              </g>
            );
          })}
        </g>
        {/* étagère basse : rouleaux d'argile prête */}
        <g transform="translate(60,280)">
          <rect x="0" y="0" width="160" height="14" fill="#5a3818" stroke="#2a1810" strokeWidth="0.8" />
          {[10, 40, 70, 100, 130].map((x, i) => (
            <ellipse key={i} cx={x + 8} cy="-4" rx="12" ry="6" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.6" />
          ))}
        </g>
      </PLayer>

      <PLayer depth={2.5}>
        {/* SOL de terre battue */}
        <rect y="440" width="1000" height="120" fill="url(#ec-sol)" />
        <rect y="440" width="1000" height="120" fill="#2a1810" opacity="0.25" filter="url(#ec-grain)" />
        <rect y="436" width="1000" height="6" fill="#5a3818" />
        <Speckle seed={251} x0={0} x1={1000} y0={444} y1={560} n={220} colors={["#3a2414", "#a07850", "#5a3e26"]} opacity={0.4} />
        {/* taches de lumière des rais sur le sol */}
        <ellipse cx="260" cy="452" rx="90" ry="12" fill="#ffe6b0" opacity="0.14" filter="url(#ec-blur)" />
        <ellipse cx="740" cy="452" rx="90" ry="12" fill="#ffe6b0" opacity="0.14" filter="url(#ec-blur)" />
        {/* tapis / natte au sol devant les élèves — tressage détaillé */}
        <ellipse cx="500" cy="500" rx="380" ry="34" fill="#5a3820" opacity="0.75" />
        {/* motif tressage */}
        {Array.from({ length: 40 }).map((_, i) => (
          <path key={i} d={`M${140 + i * 18} 486 q6 4 12 0 q6 -4 12 0`} stroke="#3a2010" strokeWidth="0.4" fill="none" opacity="0.55" />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <path key={`b${i}`} d={`M${140 + i * 18} 512 q6 4 12 0 q6 -4 12 0`} stroke="#3a2010" strokeWidth="0.4" fill="none" opacity="0.55" />
        ))}
        {/* franges tapis */}
        <path d="M120 500 v6 M132 500 v6 M144 500 v6 M156 500 v6 M844 500 v6 M856 500 v6 M868 500 v6 M880 500 v6" stroke="#3a2010" strokeWidth="0.8" />
        {/* poussière au sol */}
        <ellipse cx="700" cy="530" rx="40" ry="4" fill="#3a2010" opacity="0.25" />
        <ellipse cx="300" cy="530" rx="30" ry="3" fill="#3a2010" opacity="0.2" />
      </PLayer>

      <PLayer depth={3}>
        {/* LE MAÎTRE UMMIA (assis au centre-droit, sur natte, canne posée) */}
        <g transform="translate(680,470)">
          <ellipse cx="0" cy="26" rx="34" ry="5" fill="#0a0604" opacity="0.5" />
          <Figure x={0} y={30} s={0.81} pose="ground" skin="#c8946a" look="bald" hair="#2a1a10" beard="full" beardColor="#1a1408" mood="vexe" kohl
            garment="robe" coat="#e8dcc0" pants="#5a3818" shoes="#3a2418" trim="#8a6a48"
            arms={[{ a1: 20, a2: -30 }, { a1: 40, a2: 24 }]}>
            {/* la canne posée, tenue de la main droite */}
            <path d="M34 -40 L46 2" stroke="#3a2418" strokeWidth="3.6" strokeLinecap="round" />
          </Figure>
        </g>
        {/* 2 APPRENTIS courbés sur leur tablette (à gauche) */}
        {[[260, 480], [360, 484]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="22" rx="24" ry="4" fill="#0a0604" opacity="0.5" />
            {/* courbé sur sa tablette, calame à la main */}
            <g transform="rotate(6 0 26)">
              <Figure x={0} y={26} s={0.62} pose="ground" facing="right" skin="#c8946a" look={i ? "mid" : "short"} hair="#2a1a10" mood="vexe"
                garment="tunic" coat={i === 0 ? "#c8a848" : "#a86828"} pants="#6a4028" shoes="#3a2418"
                arms={[{ a1: 20, a2: -40 }, { a1: 20, a2: -40 }]}>
                <rect x="-17" y="-24" width="34" height="20" rx="2.4" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.8" />
                <path d="M-12 -16 l3 -3 l3 3 M-4 -16 l3 -3 l3 3 M4 -16 l3 -3 l3 3 M-12 -9 l3 -3 l3 3 M-4 -9 l3 -3 l3 3" stroke="#3a1810" strokeWidth="0.8" fill="none" />
                <path d="M14 -19 L22 -32" stroke="#5a3818" strokeWidth="2" strokeLinecap="round" />
              </Figure>
            </g>
          </g>
        ))}

        {/* Panier d'argile fraîche (collectable) — disparaît quand ramassé */}
        {!inv.includes("argile") && (
        <g transform="translate(120,506)">
          <ellipse cx="0" cy="20" rx="30" ry="5" fill="#0a0604" opacity="0.55" />
          {/* panier tressé */}
          <path d="M-26 0 L-22 18 L22 18 L26 0 Z" fill="#8a5c2e" stroke="#3a1810" strokeWidth="0.8" />
          <path d="M-24 4 h48 M-24 10 h48 M-24 15 h48" stroke="#5a3818" strokeWidth="0.4" />
          <path d="M-22 0 L-22 18 M-14 0 L-14 18 M-6 0 L-6 18 M2 0 L2 18 M10 0 L10 18 M18 0 L18 18" stroke="#5a3818" strokeWidth="0.4" />
          {/* mottes d'argile qui débordent */}
          <ellipse cx="-8" cy="-3" rx="10" ry="6" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.6" />
          <ellipse cx="8" cy="-4" rx="9" ry="5" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.6" />
          <ellipse cx="0" cy="-8" rx="7" ry="4" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.6" />
        </g>
        )}

        {/* Ephemere : boulette d'argile + tablette cassée (disparaissent au ramassage) */}
        {!inv.includes("boulette_argile") && (
        <g transform="translate(420,536)">
          <circle r="6" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.6" />
          <path d="M-3 -1 q3 -2 5 0" stroke="#5a3818" strokeWidth="0.4" fill="none" />
        </g>
        )}
        {!inv.includes("tablette_cassee") && (
        <g transform="translate(560,540) rotate(15)">
          <path d="M-14 -6 L10 -8 L14 6 L-8 8 Z" fill="url(#ec-argile)" stroke="#3a1810" strokeWidth="0.6" />
          <path d="M14 6 L-8 8" stroke="#2a1408" strokeWidth="1" fill="none" />
          <path d="M-10 -3 l2 -2 l2 2 M-4 -3 l2 -2 l2 2 M2 -3 l2 -2 l2 2 M-10 2 l2 -2 l2 2 M-4 2 l2 -2 l2 2" stroke="#3a1810" strokeWidth="0.5" fill="none" />
        </g>
        )}
      </PLayer>

      {/* zones cliquables */}
      <Hotspot cx={680} cy={450} r={40} label="le maître ummia" reveal={reveal} onClick={() => action("ummia")} />
      <Hotspot cx={260} cy={470} r={30} label="apprenti scribe" reveal={reveal} onClick={() => action("apprenti")} />
      <Hotspot cx={360} cy={472} r={30} label="apprenti scribe" reveal={reveal} onClick={() => action("apprenti")} />
      <Hotspot cx={470} cy={220} r={40} label="mur d'exercices" reveal={reveal} onClick={() => action("mur_exercices")} />
      <Hotspot cx={120} cy={500} r={30} label="panier d'argile fraîche" item="argile" reveal={reveal} onClick={() => collect("argile")} />
      <Hotspot cx={420} cy={536} r={12} label="boulette d'argile" item="boulette_argile" reveal={reveal} onClick={() => collect("boulette_argile")} />
      {/* PETITE SOURIS qui detale au sol de l'ecole — silhouette
          tete-a-gauche, se deplace donc de droite a gauche. */}
      <g opacity="0.85">
        <animateTransform attributeName="transform" type="translate"
          values="1050,0; -40,-3; 1050,0" dur="30s" repeatCount="indefinite" />
        <g transform="translate(0,552)">
          <ellipse cx="0" cy="0" rx="5" ry="2.4" fill="#3a2818" />
          <circle cx="-4" cy="-1" r="2" fill="#3a2818" />
          <circle cx="-5.5" cy="-3" r="1.2" fill="#3a2818" />
          <circle cx="-2.5" cy="-3" r="1.2" fill="#3a2818" />
          <path d="M5 0 q6 4 8 -2" stroke="#3a2818" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
