import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : L'ATELIER DE SILEX
   VERSION « PEINTURE FINE » (mêmes ingrédients que « Devant la
   grotte » : ciel dégradé, plans de crêtes, brume, textures
   fractales, lumière rasante du matin, ombres longues,
   végétation soignée, premier plan qui cadre).
   ------------------------------------------------------------
   Une clairière abritée par la falaise, Ough le tailleur y débite
   des nucléus sur un rocher plat. Les positions cliquables n'ont
   PAS bougé, pour rester compatible avec la logique du chapitre.
   ============================================================ */

export default function SceneAtelier({ collect, action, reveal, made = [], inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* ciel du petit matin : bleu-lavande qui rosit vers l'horizon */}
        <linearGradient id="at-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a3c74" />
          <stop offset="24%"  stopColor="#465894" />
          <stop offset="50%"  stopColor="#8078a8" />
          <stop offset="72%"  stopColor="#cc9aa2" />
          <stop offset="88%"  stopColor="#f0c288" />
          <stop offset="100%" stopColor="#ffdea0" />
        </linearGradient>
        <radialGradient id="at-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff8e0" />
          <stop offset="35%"  stopColor="#ffe4a8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffe0a0" stopOpacity="0" />
        </radialGradient>
        {/* plans de montagnes : bleutés au loin (perspective atmosphérique) */}
        <linearGradient id="at-mFar"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c78b4" /><stop offset="100%" stopColor="#4c5a90" /></linearGradient>
        <linearGradient id="at-mMid"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c6094" /><stop offset="100%" stopColor="#4e4472" /></linearGradient>
        <linearGradient id="at-mNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a3e56" /><stop offset="100%" stopColor="#302638" /></linearGradient>
        <linearGradient id="at-soil"  x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a48258" />
          <stop offset="18%"  stopColor="#8a6844" />
          <stop offset="55%"  stopColor="#6a5034" />
          <stop offset="100%" stopColor="#402e1e" />
        </linearGradient>
        <linearGradient id="at-cliff" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%"   stopColor="#8a6448" />
          <stop offset="35%"  stopColor="#6e4c36" />
          <stop offset="70%"  stopColor="#523828" />
          <stop offset="100%" stopColor="#38261c" />
        </linearGradient>
        <radialGradient id="at-cave" cx="50%" cy="26%" r="85%">
          <stop offset="0%"   stopColor="#040201" />
          <stop offset="62%"  stopColor="#0f0804" />
          <stop offset="100%" stopColor="#26150e" />
        </radialGradient>
        {/* rocher établi : gris pierre lumineux */}
        <linearGradient id="at-rock" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%"   stopColor="#a89d90" />
          <stop offset="35%"  stopColor="#8a7f72" />
          <stop offset="70%"  stopColor="#5a5044" />
          <stop offset="100%" stopColor="#2e281e" />
        </linearGradient>
        <radialGradient id="at-nodule" cx="35%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#6a5a48" />
          <stop offset="60%"  stopColor="#3a3028" />
          <stop offset="100%" stopColor="#1a1408" />
        </radialGradient>
        <linearGradient id="at-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4c3626" />
          <stop offset="45%"  stopColor="#6a4c34" />
          <stop offset="100%" stopColor="#2e2016" />
        </linearGradient>
        <radialGradient id="at-canopy" cx="40%" cy="35%" r="70%">
          <stop offset="0%"   stopColor="#4c6244" />
          <stop offset="70%"  stopColor="#2c4030" />
          <stop offset="100%" stopColor="#1e2c22" />
        </radialGradient>
        {/* flou doux pour brume et halos */}
        <filter id="at-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* grain fin de matière (roche, sol, voile général) */}
        <filter id="at-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        {/* marbrures larges (plaques d'usure du sol, taches de la roche) */}
        <filter id="at-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel (fixe) ═══ */}
      <rect width="1000" height="560" fill="url(#at-sky)" />
      {/* dernières étoiles qui s'effacent */}
      {[[80, 40, 1.2, 0.4], [280, 24, 1.4, 0.35], [520, 28, 1.1, 0.3], [860, 46, 1.3, 0.35]].map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={o} style={{ animation: `twinkle ${3 + i}s infinite` }} />
      ))}
      {/* SOLEIL levant, encore bas — sort derrière les crêtes */}
      <circle cx="742" cy="220" r="170" fill="url(#at-sun)" />
      <circle cx="742" cy="220" r="76"  fill="#ffe4a8" opacity="0.45" filter="url(#at-blur)" />
      <circle cx="742" cy="220" r="40"  fill="#fff8e2" />
      <circle cx="742" cy="220" r="40"  fill="none" stroke="#fffbe8" strokeWidth="1.5" opacity="0.8" />
      {/* nuages du matin, rosés par la lumière rasante */}
      <g filter="url(#at-blur)">
        <ellipse cx="240" cy="112" rx="140" ry="12" fill="#f0b8a0" opacity="0.4" />
        <ellipse cx="310" cy="128" rx="86"  ry="7"  fill="#e8987a" opacity="0.32" />
        <ellipse cx="600" cy="164" rx="180" ry="10" fill="#f8d0a8" opacity="0.45" />
        <ellipse cx="670" cy="180" rx="88"  ry="6"  fill="#ffe8c0" opacity="0.5" />
        <ellipse cx="870" cy="100" rx="110" ry="8"  fill="#d8a0a8" opacity="0.35" />
      </g>

      {/* ═══ couche lointaine (bouge peu) ═══ */}
      <PLayer depth={1}>
        {/* crête lointaine dentelée */}
        <path d="M0 302 L60 262 L108 224 L134 246 L160 262 L214 240 L258 268 L306 240 L346 210 L384 226 L426 252 L460 234 L502 260 L544 278 L590 246 L628 260 L664 296 L706 268 L748 292 L790 258 L840 278 L878 254 L920 272 L964 252 L1000 288 L1000 420 L0 420 Z" fill="url(#at-mFar)" opacity="0.95" />
        <rect y="286" width="1000" height="30" fill="#ffe6b0" opacity="0.2" filter="url(#at-blur)" />
        {/* crête intermédiaire */}
        <path d="M0 340 L66 300 L118 266 L148 288 L196 272 L246 310 L296 340 L348 300 L398 276 L440 296 L486 320 L540 288 L590 306 L648 344 L700 316 L756 288 L804 314 L860 296 L912 322 L1000 334 L1000 430 L0 430 Z" fill="url(#at-mMid)" />
        <rect y="330" width="1000" height="24" fill="#ffe6b0" opacity="0.16" filter="url(#at-blur)" />
        {/* collines proches — forêt en silhouette avec sapins piqués */}
        <path d="M0 384 Q90 344 180 366 Q270 388 360 360 Q450 334 540 366 Q630 396 720 372 Q810 348 900 376 Q950 390 1000 372 L1000 440 L0 440 Z" fill="url(#at-mNear)" />
        {[150, 190, 228, 262, 566, 600, 636, 850, 884].map((x, i) => (
          <path key={i} d={`M${x} ${i < 4 ? 372 - (i % 2) * 6 : i < 7 ? 366 + (i % 2) * 4 : 374} l7 -${13 + (i % 3) * 3} l7 ${13 + (i % 3) * 3} Z`} fill="#2a1830" opacity="0.75" />
        ))}
        {/* HIRONDELLES qui traversent le ciel du matin */}
        <g opacity="0.85">
          <animateTransform attributeName="transform" type="translate"
            values="-60,0; 1060,-20" dur="26s" repeatCount="indefinite" />
          <path d="M0 190 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M30 204 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M58 186 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : la falaise et la grotte ═══ */}
      <PLayer depth={2}>
        {/* sol */}
        <rect y="398" width="1000" height="162" fill="url(#at-soil)" />
        {/* nappe de lumière dorée du matin */}
        <ellipse cx="720" cy="402" rx="430" ry="46" fill="#ffe0a0" opacity="0.18" filter="url(#at-blur)" />
        <ellipse cx="420" cy="406" rx="380" ry="18" fill="#f0e0c0" opacity="0.16" filter="url(#at-blur)" />
        {/* textures du sol : marbrures + grain */}
        <rect y="400" width="1000" height="160" fill="#241608" opacity="0.35" filter="url(#at-mottle)" />
        <rect y="400" width="1000" height="160" fill="#2c1c10" opacity="0.5" filter="url(#at-grain)" />
        {/* ondulations du terrain */}
        <path d="M0 408 Q260 396 520 408 T1000 402 L1000 424 Q700 436 380 424 T0 432 Z" fill="#a08050" opacity="0.4" />
        <path d="M120 452 Q300 444 470 452 M560 470 Q740 462 920 472" stroke="#3c2a1a" strokeWidth="2" fill="none" opacity="0.35" />

        {/* LA FALAISE (côté gauche) — silhouette irrégulière, strates, lumière rasante */}
        <path d="M0 430 L0 90 Q30 70 62 82 Q82 60 108 90 Q138 70 158 96 Q186 84 214 118 Q244 108 264 138 Q294 132 312 176 Q332 214 322 258 Q340 292 316 328 Q338 372 306 396 Q322 414 296 430 Z" fill="url(#at-cliff)" />
        <path d="M0 430 L0 90 Q30 70 62 82 Q82 60 108 90 Q138 70 158 96 Q186 84 214 118 Q244 108 264 138 Q294 132 312 176 Q332 214 322 258 Q340 292 316 328 Q338 372 306 396 Q322 414 296 430 Z" fill="#1c1006" opacity="0.3" filter="url(#at-mottle)" />
        <path d="M0 430 L0 90 Q30 70 62 82 Q82 60 108 90 Q138 70 158 96 Q186 84 214 118 Q244 108 264 138 Q294 132 312 176 Q332 214 322 258 Q340 292 316 328 Q338 372 306 396 Q322 414 296 430 Z" fill="#221408" opacity="0.6" filter="url(#at-grain)" />
        {/* piquetage de la roche */}
        {[[66, 140], [122, 190], [86, 246], [156, 210], [190, 168], [132, 302], [98, 344], [206, 268], [246, 196], [174, 386], [228, 342], [270, 240]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={2.2 + (i % 3)} ry={1.4 + (i % 2)} fill="#241608" opacity="0.45" />
        ))}
        {/* strates */}
        <path d="M22 148 q72 -14 148 4 q40 10 74 26 M18 214 q86 -10 168 12 q36 10 66 24 M26 288 q74 -6 148 14 q40 12 68 26 M40 352 q64 -4 128 12" stroke="#33210f" strokeWidth="4" fill="none" opacity="0.4" />
        <path d="M30 176 q60 -8 128 6 M22 246 q70 -6 142 12 M34 318 q58 -4 120 10" stroke="#241608" strokeWidth="2" fill="none" opacity="0.35" />
        {/* fissures */}
        <path d="M120 100 q12 56 -6 118 q-8 34 4 66 M212 130 q16 62 4 124 q-6 34 6 62 M282 168 q10 44 -2 92" stroke="#2a1a0e" strokeWidth="2.5" fill="none" opacity="0.55" />
        {/* lumière rasante sur les arêtes */}
        <path d="M264 138 Q294 132 312 176 Q332 214 322 258 Q340 292 316 328" stroke="#ffe0a0" strokeWidth="4" fill="none" opacity="0.45" />
        <path d="M214 118 Q244 108 264 138 M108 90 Q138 70 158 96" stroke="#ffe0a0" strokeWidth="3" fill="none" opacity="0.32" />
        <path d="M316 328 Q338 372 306 396" stroke="#f0c890" strokeWidth="3" fill="none" opacity="0.32" />
        {/* mousses accrochées */}
        {[[236, 150], [274, 210], [252, 300], [296, 258]].map(([x, y], i) => (
          <g key={i} opacity="0.8">
            <ellipse cx={x} cy={y} rx={9 + (i % 2) * 3} ry={4} fill="#3c4a24" />
            <ellipse cx={x - 4} cy={y - 2} rx={5} ry={2.5} fill="#4c5c2c" />
          </g>
        ))}
        {/* ABRI SOUS ROCHE — une saillie horizontale de la falaise
           forme un dais rocheux au-dessus de l'atelier. Rien à voir
           avec la grotte du campement : ici, on travaille à l'air
           libre, à l'abri d'une avancée de pierre. */}
        {/* la saillie qui déborde vers l'avant */}
        <path d="M0 296 Q140 288 300 306 Q380 316 388 340 Q286 344 176 342 Q80 340 0 336 Z" fill="url(#at-cliff)" />
        <path d="M0 296 Q140 288 300 306 Q380 316 388 340 Q286 344 176 342 Q80 340 0 336 Z" fill="#1c1006" opacity="0.35" filter="url(#at-mottle)" />
        {/* trait d'ombre sous la saillie */}
        <path d="M0 340 Q160 348 320 342 L320 356 Q160 362 0 354 Z" fill="#1a0e06" opacity="0.55" />
        {/* zone d'ombre au sol, sous l'abri, là où Ough travaille */}
        <ellipse cx="150" cy="418" rx="180" ry="18" fill="#1a0e06" opacity="0.35" filter="url(#at-blur)" />
        {/* éclats de silex éparpillés sous l'abri (résidus de taille) */}
        {[[60, 424], [96, 432], [130, 420], [162, 428], [198, 424], [58, 440], [104, 444], [148, 442], [190, 440], [76, 452], [122, 452], [174, 452]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l${3 + (i % 3)} ${-2 - (i % 2)} l${2 + (i % 2)} ${2 + (i % 2)} z`} fill={i % 2 ? "#c8bfae" : "#8a7f6c"} opacity="0.75" />
        ))}
      </PLayer>

      {/* ═══ premier plan (bouge le plus) ═══ */}
      <PLayer depth={3}>
        {/* Grand arbre à droite qui cadre la scène (comme SceneExterieur avec ses herbes) */}
        <g>
          <rect x="922" y="128" width="34" height="290" fill="url(#at-trunk)" rx="8" />
          <rect x="922" y="128" width="34" height="290" fill="#221408" opacity="0.5" filter="url(#at-grain)" rx="8" />
          <path d="M930 170 q5 90 -1 200 M944 148 q4 100 1 240" stroke="#33231a" strokeWidth="2" fill="none" opacity="0.7" />
          <ellipse cx="940" cy="118" rx="90" ry="70" fill="url(#at-canopy)" />
          <ellipse cx="882" cy="146" rx="52" ry="38" fill="url(#at-canopy)" />
          {[[900, 92], [948, 76], [984, 102]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q6 -8 14 -8 q-3 8 -14 8 Z`} fill="#54724a" opacity="0.85" />
          ))}
          {/* lumière du soleil sur le tronc côté droit */}
          <path d="M952 140 q4 130 -2 260" stroke="#a8865c" strokeWidth="2" fill="none" opacity="0.4" />
        </g>
        {/* branche basse qui descend, encadre le coin haut-droit */}
        <g>
          <path d="M1000 204 q-40 20 -80 30" stroke="#4c3626" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="908" cy="236" rx="34" ry="20" fill="url(#at-canopy)" />
          <ellipse cx="944" cy="222" rx="22" ry="14" fill="url(#at-canopy)" opacity="0.85" />
        </g>

        {/* ZONE D'ATELIER : sol tassé + ombres longues (le soleil vient de droite) */}
        <ellipse cx="500" cy="460" rx="310" ry="42" fill="#1a0e04" opacity="0.42" />
        <ellipse cx="500" cy="450" rx="240" ry="26" fill="#2a1e10" opacity="0.5" />
        {/* Traces de pas dans la terre autour de l'établi */}
        {[[380, 500, -20], [420, 522, 10], [590, 500, 22], [620, 520, -14], [400, 540, 0], [610, 542, 30]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#1a0e04" opacity="0.35" />
            <ellipse cx="0" cy="-5" rx="3" ry="2" fill="#1a0e04" opacity="0.3" />
          </g>
        ))}

        {/* Rocher-établi central — plus sculpté, avec fossiles et éclats */}
        <g>
          {/* ombre longue vers la gauche (soleil à droite) */}
          <ellipse cx="470" cy="486" rx="130" ry="14" fill="#0a0604" opacity="0.55" />
          {/* corps du rocher, silhouette organique */}
          <path d="M418 458 Q436 442 476 440 Q510 436 552 444 Q578 448 588 464 L586 484 Q564 496 512 494 Q450 494 424 484 Q414 476 418 458 Z" fill="url(#at-rock)" stroke="#1a0e08" strokeWidth="2" />
          {/* texture grain + marbrures */}
          <path d="M418 458 Q436 442 476 440 Q510 436 552 444 Q578 448 588 464 L586 484 Q564 496 512 494 Q450 494 424 484 Q414 476 418 458 Z" fill="#3a3428" opacity="0.5" filter="url(#at-grain)" />
          <path d="M418 458 Q436 442 476 440 Q510 436 552 444 Q578 448 588 464 L586 484 Q564 496 512 494 Q450 494 424 484 Q414 476 418 458 Z" fill="#241608" opacity="0.25" filter="url(#at-mottle)" />
          {/* stries et fissures anciennes */}
          <path d="M436 456 q30 -8 60 -2 M508 452 q30 4 68 8 M448 480 q40 -4 88 0" stroke="#3a3020" strokeWidth="0.8" fill="none" opacity="0.7" />
          <path d="M470 448 q10 8 22 12 M528 452 q6 10 14 20" stroke="#241608" strokeWidth="0.6" fill="none" opacity="0.55" />
          {/* petit fossile d'ammonite (détail savant) */}
          <g transform="translate(462,470)" opacity="0.7">
            <circle r="5" fill="none" stroke="#5a4c38" strokeWidth="0.8" />
            <path d="M-4 0 q0 -6 6 -4 q3 3 -1 6 q-2 2 -3 -2 Z" fill="none" stroke="#5a4c38" strokeWidth="0.6" />
          </g>
          {/* lumière rasante sur l'arête haute (le soleil vient d'en haut-droite) */}
          <path d="M476 440 Q510 436 552 444 Q578 448 588 464" stroke="#ffe0a8" strokeWidth="1.5" fill="none" opacity="0.55" />
          {/* mousse au bord humide (côté ombre) */}
          <path d="M416 468 q4 -3 8 0 q-2 4 -8 0 Z" fill="#5a7030" opacity="0.75" />
          <path d="M584 470 q4 -3 8 0 q-2 4 -8 0 Z" fill="#5a7030" opacity="0.7" />
          <ellipse cx="422" cy="464" rx="6" ry="2" fill="#4c6224" opacity="0.5" />
          {/* nodule de silex en cours de taille, sur le rocher — halo + brillant */}
          <ellipse cx="500" cy="460" rx="26" ry="16" fill="url(#at-nodule)" stroke="#0a0806" strokeWidth="1.8" />
          <path d="M482 452 Q500 446 518 454" stroke="#a89478" strokeWidth="1.4" fill="none" opacity="0.75" />
          <path d="M488 460 Q500 458 512 462" stroke="#8a7860" strokeWidth="0.8" fill="none" opacity="0.55" />
          <ellipse cx="488" cy="452" rx="5" ry="2" fill="#e8dfc8" opacity="0.35" />
          {/* petit éclat frais qui vient de se détacher */}
          <path d="M522 458 L534 452 L536 460 L526 462 Z" fill="#5a4e40" stroke="#1a1408" strokeWidth="0.5" />
          <path d="M522 458 L534 452" stroke="#e8d8b0" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* Éclats de silex éparpillés (variés en taille, orientation, valeur) */}
        {[[368, 500, -12, 1.1], [418, 512, 8, 0.8], [560, 512, -20, 1.3], [608, 500, 15, 0.9], [340, 522, 30, 1.1],
          [658, 522, -8, 0.7], [468, 528, 45, 0.7], [522, 534, -12, 1.0], [396, 486, 60, 0.6], [590, 490, 20, 0.8],
          [700, 512, -35, 0.9], [320, 500, 12, 0.8]].map(([x, y, r, s], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
            <ellipse cx="0" cy="4" rx="6" ry="1.5" fill="#0a0604" opacity="0.45" />
            <path d="M-6 0 L4 -4 L6 2 L-2 6 Z" fill="#4a4238" stroke="#1a1408" strokeWidth="0.6" />
            <path d="M-3 -1 L3 -2" stroke="#c8b8a0" strokeWidth="0.5" opacity="0.75" />
            <path d="M-6 0 L4 -4" stroke="#e8d8b0" strokeWidth="0.35" opacity="0.6" />
          </g>
        ))}

        {/* Tas de silex bruts à droite — plus sculpté, chaque nodule distinct */}
        {!inv.includes("silex_brut") && (
        <g transform="translate(760,500)">
          <ellipse cx="0" cy="14" rx="50" ry="10" fill="#0a0604" opacity="0.6" />
          {/* base large */}
          <path d="M-38 4 Q-32 -18 -4 -22 Q18 -24 34 -14 Q46 -2 36 12 L24 16 Q0 18 -24 16 L-38 12 Z" fill="url(#at-rock)" stroke="#1a0e08" strokeWidth="1.5" />
          <path d="M-38 4 Q-32 -18 -4 -22 Q18 -24 34 -14 Q46 -2 36 12 L24 16 Q0 18 -24 16 L-38 12 Z" fill="#3a3020" opacity="0.35" filter="url(#at-grain)" />
          {/* nodules individuels bien lisibles */}
          <ellipse cx="-18" cy="-6" rx="14" ry="9" fill="url(#at-nodule)" stroke="#1a0e08" strokeWidth="0.8" />
          <ellipse cx="12"  cy="-8" rx="12" ry="7" fill="url(#at-nodule)" stroke="#1a0e08" strokeWidth="0.8" />
          <ellipse cx="-4"  cy="0"  rx="10" ry="6" fill="url(#at-nodule)" stroke="#1a0e08" strokeWidth="0.8" />
          <ellipse cx="22"  cy="4"  rx="8"  ry="5" fill="url(#at-nodule)" stroke="#1a0e08" strokeWidth="0.7" />
          {/* petits reflets clairs — lumière du matin */}
          <path d="M-22 -10 q3 -2 6 0 M6 -12 q3 -2 6 0 M18 2 q3 -1 5 1" stroke="#c8b8a0" strokeWidth="0.6" fill="none" opacity="0.7" />
          <path d="M-18 -12 q6 -1 12 -1" stroke="#e8d8b0" strokeWidth="0.5" opacity="0.5" />
        </g>
        )}

        {/* Percuteur en bois de cerf posé — anatomiquement plus soigné */}
        <g transform="translate(600,478) rotate(-28)">
          <ellipse cx="0" cy="8" rx="4" ry="1.6" fill="#0a0604" opacity="0.5" />
          {/* manche */}
          <rect x="-2.5" y="-26" width="5" height="32" rx="1.2" fill="#8a6a4a" stroke="#3a2818" strokeWidth="0.8" />
          <path d="M-2 -20 L-2 4 M2 -20 L2 4" stroke="#5a4028" strokeWidth="0.4" />
          {/* lien de cuir qui fixe la tête au manche */}
          <rect x="-3" y="-20" width="6" height="3" rx="0.5" fill="#3a2010" />
          <path d="M-3 -19 L3 -19" stroke="#7a5030" strokeWidth="0.4" />
          {/* tête bois de cerf */}
          <ellipse cx="0" cy="-26" rx="7" ry="5" fill="#a88848" stroke="#3a2818" strokeWidth="0.8" />
          <ellipse cx="-1" cy="-27" rx="3" ry="2" fill="#c8a878" opacity="0.6" />
          {/* ramifications */}
          <path d="M-5 -28 l-4 -4 M5 -28 l4 -4 M0 -32 l0 -6" stroke="#a88848" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M-8 -32 l-2 -3 M8 -32 l2 -3 M-1 -36 l-2 -3 M1 -36 l2 -3" stroke="#a88848" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Bol en écorce à côté du percuteur, avec chutes de silex — plus texturé */}
        <g transform="translate(555,510)">
          <ellipse cx="0" cy="4" rx="15" ry="4" fill="#0a0604" opacity="0.5" />
          <path d="M-12 0 Q-14 -8 0 -10 Q14 -8 12 0 Q10 4 0 6 Q-10 4 -12 0 Z" fill="#6a4a2c" stroke="#3a2418" strokeWidth="0.8" />
          <path d="M-12 0 Q-14 -8 0 -10 Q14 -8 12 0" fill="none" stroke="#8a6238" strokeWidth="0.5" opacity="0.55" />
          <ellipse cx="0" cy="-4" rx="9" ry="2.5" fill="#3a2818" />
          <path d="M-4 -5 l3 -1 M2 -6 l3 -1 M-1 -3 l2 -2" stroke="#c8b8a0" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Séchoir à peaux à l'extrême-droite — trépied + peau tendue avec liens */}
        <g transform="translate(880,470)">
          <path d="M-30 30 L0 -60 M30 30 L0 -60 M0 30 L0 -60" stroke="#4a3018" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M-8 -50 L8 -50" stroke="#4a3018" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-22 -32 Q0 -42 22 -32 L20 20 Q0 26 -20 20 Z" fill="#8a6240" />
          <path d="M-22 -32 Q0 -42 22 -32 L20 20 Q0 26 -20 20 Z" fill="#5c3a22" opacity="0.4" filter="url(#at-grain)" />
          <path d="M-22 -32 l-6 -4 M22 -32 l6 -4 M-20 20 l-6 6 M20 20 l6 6" stroke="#3a2418" strokeWidth="1.2" />
          <path d="M-16 -22 q16 -6 32 0 M-16 -6 q16 -6 32 0 M-14 10 q14 -5 28 0" stroke="#6e4a2c" strokeWidth="1.4" fill="none" opacity="0.7" />
          <path d="M-18 -30 q18 -5 36 0" stroke="#c9a878" strokeWidth="1.2" fill="none" opacity="0.5" />
        </g>

        {/* Petites touffes d'herbe éparpillées */}
        {[[80, 510], [220, 500], [700, 508], [820, 515]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`} opacity="0.9">
            <path d="M-6 4 q4 -14 0 -18 M0 4 q4 -16 0 -20 M6 4 q4 -14 0 -18" stroke="#4a5820" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M-8 2 q2 -8 -2 -12" stroke="#5d6b2e" strokeWidth="0.8" fill="none" />
          </g>
        ))}
        {/* herbes sombres qui cadrent le bas de l'image (comme SceneExterieur) */}
        <g opacity="0.9">
          <path d="M-4 560 q10 -34 4 -52 M14 560 q2 -28 14 -44 M34 560 q-6 -24 2 -40 M60 560 q8 -26 0 -38" stroke="#241a10" strokeWidth="4" fill="none" />
          <path d="M950 560 q-8 -30 -2 -46 M972 560 q4 -26 12 -38 M992 560 q-4 -22 4 -34 M928 560 q6 -20 -2 -32" stroke="#241a10" strokeWidth="4" fill="none" />
        </g>

        {/* PAPILLON qui vole en boucle (ambiance vivante) */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="150,480; 300,440; 480,470; 620,430; 750,470; 900,440; 150,480"
            dur="20s" repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="scale"
              values="1,1; 0.35,1; 1,1" dur="0.28s" repeatCount="indefinite" />
            <ellipse cx="0" cy="0" rx="0.8" ry="3" fill="#1a1408" />
            <path d="M0 -1 q-6 -4 -6 1 q0 4 6 2 Z" fill="#e08840" stroke="#5a2810" strokeWidth="0.3" />
            <path d="M0 -1 q6 -4 6 1 q0 4 -6 2 Z" fill="#e08840" stroke="#5a2810" strokeWidth="0.3" />
            <circle cx="-3" cy="0" r="0.6" fill="#1a1408" />
            <circle cx="3" cy="0" r="0.6" fill="#1a1408" />
          </g>
        </g>

        {/* POUSSIÈRE de taille qui monte de l'établi — silex qui se débite en direct */}
        <g opacity="0.75">
          {[[494, 440, 0], [502, 448, 0.5], [510, 434, 1.1], [488, 456, 1.6],
            [516, 452, 0.3], [498, 428, 2.2], [508, 460, 1.4]].map(([x, y, d], i) => (
            <circle key={i} cx={x} cy={y} r={1.2 + (i % 3) * 0.5} fill="#e8dfc8"
              style={{ animation: `spark ${2.5 + (i % 4) * 0.7}s linear ${d}s infinite` }} />
          ))}
        </g>
        {/* poussière dorée qui flotte dans la lumière du matin */}
        {[[620, 470], [700, 440], [780, 460]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#ffe8b8" opacity="0.6" style={{ animation: `drift ${4 + i}s ease-in-out infinite` }} />
        ))}

        {/* OUGH — le tailleur de silex, accroupi, concentré sur son nodule.
             Corps plus soigné : anatomie, drapé de la peau de bête, mèches
             de cheveux, ombres, doigts qui tiennent le percuteur. */}
        <g transform="translate(340,458)">
          <ellipse cx="-10" cy="52" rx="42" ry="10" fill="#0a0604" opacity="0.55" />
          <Figure x={0} y={52} s={1.1} pose="ground" skin="#c8946a" hair="#3a2418" look="long" mustache mood="colere"
            garment="fur" coat="#5a3818" pants="#5a3818" bareArms arms={[{ a1: 22, a2: -24 }, { a1: 55, a2: 64 }]} />
          <rect x="54" y="8" width="3" height="12" rx="1" fill="#8a6a4a" stroke="#3a2818" strokeWidth="0.6" transform="rotate(20 56 14)" />
        </g>

        {/* Petits ephemères ramassables — feuille morte, coccinelle, brindille */}
        {!inv.includes("feuille_morte") && (
        <g transform="translate(120,540) rotate(-8)">
          <path d="M0 0 q-8 -10 -14 -6 q-4 6 6 10 q10 4 8 -4 Z" fill="#a05820" stroke="#5a2810" strokeWidth="0.8" />
          <path d="M-2 0 q-4 -6 -8 -4" stroke="#5a2810" strokeWidth="0.6" fill="none" />
        </g>
        )}
        {!inv.includes("coccinelle") && (
        <g transform="translate(660,542)">
          <ellipse cx="0" cy="0" rx="5" ry="4" fill="#c8382e" stroke="#3a0a0a" strokeWidth="0.5" />
          <path d="M0 -4 L0 4" stroke="#3a0a0a" strokeWidth="0.8" />
          <circle cx="-2" cy="-1" r="0.6" fill="#3a0a0a" />
          <circle cx="2"  cy="-1" r="0.6" fill="#3a0a0a" />
          <circle cx="-2" cy="1.5" r="0.6" fill="#3a0a0a" />
          <circle cx="2"  cy="1.5" r="0.6" fill="#3a0a0a" />
          <ellipse cx="0" cy="-4.5" rx="1.5" ry="1.2" fill="#1a0a06" />
        </g>
        )}
        {!inv.includes("brindille") && (
        <g transform="translate(280,528) rotate(30)">
          <path d="M0 0 L18 0" stroke="#8a6a48" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4 0 l3 -3 M9 0 l3 3 M14 0 l3 -3" stroke="#5a4028" strokeWidth="0.8" />
        </g>
        )}
      </PLayer>

      {/* léger voile de grain sur toute l'image (unifie la matière) */}
      <rect width="1000" height="560" fill="#1a1410" opacity="0.1" filter="url(#at-grain)" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables (positions inchangées pour préserver la logique) ═══ */}
      <Hotspot cx={340} cy={430} r={44} label="Ough, le tailleur de silex" reveal={reveal} onClick={() => action("ough")} />
      <Hotspot cx={500} cy={470} r={50} label="rocher de taille — glisse un silex brut dessus" item="rocher_taille" reveal={reveal} onClick={() => action("tailler_silex")} />
      <Hotspot cx={760} cy={490} r={44} label="tas de silex bruts" item="silex_brut" reveal={reveal} onClick={() => collect("silex_brut")} />
      <Hotspot cx={600} cy={470} r={20} label="percuteur en bois de cerf" item="percuteur" reveal={reveal} onClick={() => collect("percuteur")} />
      <Hotspot cx={120} cy={540} r={16} label="feuille morte" item="feuille_morte" reveal={reveal} onClick={() => collect("feuille_morte")} />
      <Hotspot cx={660} cy={542} r={12} label="coccinelle" item="coccinelle" reveal={reveal} onClick={() => collect("coccinelle")} />
      <Hotspot cx={294} cy={528} r={16} label="brindille" item="brindille" reveal={reveal} onClick={() => collect("brindille")} />
    </svg>
  );
}
