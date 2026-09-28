import { useState } from "react";

/* ============================================================
   ÉPILOGUE — LE CARNET D'ELIAS
   ------------------------------------------------------------
   Séquence narrative en 6 planches illustrées (SVG) qui joue
   AVANT l'arrivée à la station des chronautes. Chaque planche
   est une case dessinée + un court paragraphe manuscrit dessous.
   Navigation : ‹ Précédent · Suivant ›. Skippable.
   ------------------------------------------------------------
   0. Couverture           (« carnet d'un survivant », signé)
   1. Notre monde d'avant  (2200, hyperconnecté)
   2. Le grand silence     (tout s'éteint)
   3. Cinq siècles envolés (les supports numériques disparaissent)
   4. Ce qui a tenu        (paroies, livres, vitraux)
   5. La maladie de la mémoire
   ------------------------------------------------------------
   Note : Al3x1A n'apparaît PAS dans le carnet. Sa révélation est
   réservée aux dialogues de Mira et au portrait dans la station.
   ============================================================ */

/* ─── Planche 0 : la couverture du carnet ─── */
function P0() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p0-cover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3818" /><stop offset="100%" stopColor="#2a1808" />
        </linearGradient>
        <radialGradient id="p0-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* fond cuir usé */}
      <rect width="800" height="460" fill="url(#p0-cover)" />
      {/* texture cuir : petites craquelures */}
      {Array.from({ length: 60 }).map((_, i) => (
        <path key={i} d={`M${(i * 71) % 800} ${(i * 43) % 460} l${4 + (i % 5)} ${1 + (i % 3)}`}
          stroke="#1a0808" strokeWidth="0.5" opacity="0.35" fill="none" />
      ))}
      {/* halo chaud au centre */}
      <ellipse cx="400" cy="230" rx="260" ry="180" fill="url(#p0-halo)" />
      {/* cadre gravé */}
      <rect x="60" y="60" width="680" height="340" fill="none" stroke="#c9a54a" strokeWidth="2" opacity="0.7" />
      <rect x="70" y="70" width="660" height="320" fill="none" stroke="#8a5a2a" strokeWidth="0.8" opacity="0.7" />
      {/* Titre */}
      <text x="400" y="140" textAnchor="middle" fontFamily="Georgia, serif" fontSize="30" fontStyle="italic" fill="#f4e4b0" letterSpacing="4">Carnet d'Elias</text>
      <text x="400" y="172" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#c9a54a" letterSpacing="3" opacity="0.9">— survivant, station des chronautes —</text>

      {/* Petit dessin central : main qui tient une plume au-dessus d'une bougie */}
      <g transform="translate(400,260)">
        {/* bougie */}
        <rect x="-6" y="0" width="12" height="40" fill="#e8d8a8" />
        <path d="M-6 0 L6 0 L4 -6 L-4 -6 Z" fill="#c9a54a" />
        <path d="M0 -6 L0 -14" stroke="#3a2818" strokeWidth="0.6" />
        <ellipse cx="0" cy="-18" rx="4" ry="8" fill="#ffe090" opacity="0.9">
          <animate attributeName="ry" values="8;6;8" dur="1.2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="0" cy="-18" rx="10" ry="14" fill="url(#p0-halo)" />
        {/* main + plume à droite */}
        <g transform="translate(38,-4)">
          <path d="M0 40 L-4 12 Q-4 4 4 4 L14 4 Q22 8 22 16 L20 40 Z" fill="#d0a888" />
          {/* doigts serrant la plume */}
          <path d="M-6 8 Q-2 10 4 10 L14 12 Q18 14 18 20" stroke="#a08068" strokeWidth="0.8" fill="none" />
          {/* plume qui pointe vers la bougie */}
          <path d="M8 6 L-30 -30" stroke="#1a1010" strokeWidth="2" strokeLinecap="round" />
          <path d="M-30 -30 L-20 -18 M-24 -24 L-14 -14 M-18 -18 L-8 -10" stroke="#c9a54a" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
          <path d="M-30 -30 L-32 -32" stroke="#5a3818" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* Date + lieu */}
      <text x="400" y="360" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fill="#c9a54a" letterSpacing="4" opacity="0.85">STATION DES CHRONAUTES · 2287</text>

      {/* Note manuscrite / dédicace */}
      <g transform="translate(400,390)">
        <text x="0" y="0" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="#f4e4b0" opacity="0.95">
          « Pour ne pas oublier ce que nous avons été. »
        </text>
        <text x="120" y="18" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontStyle="italic" fill="#f4e4b0" opacity="0.85">— E.</text>
      </g>
    </svg>
  );
}

/* ─── Planche 1 : 2200, la ville hyperconnectée ─── */
function P1() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1428" /><stop offset="100%" stopColor="#1a2a58" />
        </linearGradient>
        <radialGradient id="p1-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p1-sky)" />
      {/* étoiles / drones qui clignotent */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 41) % 800} cy={20 + (i * 17) % 140} r={i % 5 === 0 ? 1.6 : 0.8}
          fill={i % 6 === 0 ? "#5eff9e" : "#c8d4e2"} opacity="0.7">
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* gratte-ciels illuminés en couches */}
      {[[0, 260, 90, 200], [80, 240, 60, 220], [130, 200, 100, 260], [220, 260, 70, 200], [280, 180, 90, 280],
        [360, 220, 60, 240], [410, 240, 110, 220], [510, 200, 80, 260], [580, 240, 70, 220], [640, 210, 90, 250],
        [720, 240, 80, 220]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#0e1a34" />
          {/* fenêtres allumées en grille */}
          {Array.from({ length: Math.floor(h / 14) }).map((_, r) => (
            Array.from({ length: Math.floor(w / 12) }).map((__, c) => {
              const on = ((r * 7 + c * 11 + i * 3) % 5) !== 0;
              return on ? <rect key={`${r}-${c}`} x={x + 3 + c * 12} y={y + 4 + r * 14} width="6" height="6"
                fill={((r + c + i) % 7 === 0) ? "#ffd166" : "#7fd8ff"} opacity="0.85" /> : null;
            })
          ))}
          {/* panneau pub géant */}
          {i % 3 === 0 && (
            <g>
              <rect x={x + 8} y={y + 24} width={w - 16} height="30" fill="#ff5a7a" opacity="0.9">
                <animate attributeName="fill" values="#ff5a7a;#4ae0ff;#ffd166;#ff5a7a" dur="4s" repeatCount="indefinite" />
              </rect>
              <text x={x + w / 2} y={y + 44} textAnchor="middle" fontSize="10" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#fff">STREAM</text>
            </g>
          )}
        </g>
      ))}
      {/* drones qui volent */}
      {[[120, 90], [340, 60], [560, 100], [700, 70]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-6" y="-2" width="12" height="4" fill="#5eff9e" opacity="0.9" />
          <circle cx="-8" cy="0" r="2" fill="none" stroke="#7fe0a8" strokeWidth="0.8" opacity="0.85">
            <animate attributeName="r" values="2;4;2" dur="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="0" r="2" fill="none" stroke="#7fe0a8" strokeWidth="0.8" opacity="0.85">
            <animate attributeName="r" values="2;4;2" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* passants au sol, chacun avec halo bleu du tel */}
      <rect y="420" width="800" height="40" fill="#0a0a14" />
      {[80, 190, 320, 460, 600, 720].map((x, i) => (
        <g key={i} transform={`translate(${x},420)`}>
          <ellipse cx="0" cy="-4" rx="18" ry="10" fill="url(#p1-halo)" />
          <path d="M-6 0 L-8 -22 L-2 -30 L2 -30 L8 -22 L6 0 Z" fill="#0e1a30" />
          <circle cx="0" cy="-34" r="4" fill="#0e1a30" />
          {/* téléphone tenu */}
          <rect x="-3" y="-24" width="6" height="10" fill="#7fd8ff" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Planche 2 : le grand silence ─── */
function P2() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#181820" /><stop offset="100%" stopColor="#2a2820" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p2-sky)" />
      {/* lueur d'aube froide */}
      <ellipse cx="600" cy="120" rx="180" ry="40" fill="#a89870" opacity="0.35" />
      {/* même skyline mais entièrement éteinte */}
      {[[0, 260, 90, 200], [80, 240, 60, 220], [130, 200, 100, 260], [220, 260, 70, 200], [280, 180, 90, 280],
        [360, 220, 60, 240], [410, 240, 110, 220], [510, 200, 80, 260], [580, 240, 70, 220], [640, 210, 90, 250],
        [720, 240, 80, 220]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#0e0e18" />
          {/* fenêtres toutes noires — sauf 2-3 bougies isolées */}
          {i === 3 && <rect x={x + 12} y={y + 40} width="4" height="4" fill="#ff9040" opacity="0.9" />}
          {i === 7 && <rect x={x + 8} y={y + 80} width="4" height="4" fill="#ff9040" opacity="0.7" />}
        </g>
      ))}
      {/* sol */}
      <rect y="420" width="800" height="40" fill="#0a0a10" />
      {/* passants qui lèvent les yeux, incrédules */}
      <g transform="translate(200,420)">
        <path d="M-6 0 L-8 -22 L-2 -30 L2 -30 L8 -22 L6 0 Z" fill="#141420" />
        <circle cx="0" cy="-34" r="4" fill="#c88870" />
        {/* main levée, tel dans l'autre */}
        <path d="M6 -20 L14 -32" stroke="#c88870" strokeWidth="2" strokeLinecap="round" />
        <rect x="-3" y="-24" width="6" height="10" fill="#141420" />
        {/* ! au-dessus */}
        <text x="14" y="-40" fontSize="14" fontWeight="800" fill="#ffd166">?</text>
      </g>
      {/* enfant qui secoue son téléphone */}
      <g transform="translate(440,420)">
        <path d="M-5 0 L-7 -18 L-1 -24 L1 -24 L7 -18 L5 0 Z" fill="#3a2818" />
        <circle cx="0" cy="-28" r="3" fill="#e8c4a0" />
        <path d="M0 -22 L8 -14" stroke="#e8c4a0" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="6" y="-16" width="4" height="7" fill="#141420">
          <animateTransform attributeName="transform" type="rotate" values="-15 8 -12;15 8 -12;-15 8 -12" dur="0.4s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* silhouette au loin avec une bougie */}
      <g transform="translate(640,420)">
        <path d="M-6 0 L-8 -20 L-2 -28 L2 -28 L8 -20 L6 0 Z" fill="#1a1408" />
        <circle cx="0" cy="-32" r="4" fill="#c88870" opacity="0.6" />
        <ellipse cx="10" cy="-16" rx="10" ry="8" fill="#ff9040" opacity="0.35" />
        <rect x="7" y="-16" width="6" height="10" fill="#c8a870" />
        <ellipse cx="10" cy="-22" rx="2" ry="4" fill="#ffd88a" />
      </g>
    </svg>
  );
}

/* ─── Planche 3 : cinq siècles envolés ─── */
function P3() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p3-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a1a" /><stop offset="100%" stopColor="#1a0e0a" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p3-bg)" />
      {/* mur de datacenter éventré */}
      <path d="M0 100 L800 100 L800 340 L0 340 Z" fill="#3a2418" opacity="0.3" />
      {/* étagères de serveurs cassées */}
      {[[80, 140, 200], [320, 130, 220], [540, 145, 200]].map(([x, y, h], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="0" y="0" width="120" height={h} fill="#1a1420" stroke="#3a3040" strokeWidth="1" />
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <g key={r}>
              <rect x="4" y={4 + r * 26} width="112" height="22" fill="#0a0a12" stroke="#3a2418" strokeWidth="0.5" />
              <circle cx="8" cy={15 + r * 26} r="1.2" fill={r % 3 === 0 ? "#5a1010" : "#2a2418"} />
              <rect x="14" y={13 + r * 26} width="90" height="4" fill="#2a2418" />
            </g>
          ))}
          {/* fissure diagonale */}
          <path d={`M${20 + i * 10} 20 L${100 - i * 20} ${h - 20}`} stroke="#1a0808" strokeWidth="4" opacity="0.7" />
          {/* poussière/toile araignée */}
          <path d="M0 30 L20 40 M120 40 L100 60" stroke="#a8a898" strokeWidth="0.4" opacity="0.4" />
        </g>
      ))}
      {/* clés USB, cartes SD, disques éparpillés au sol */}
      <rect y="340" width="800" height="120" fill="#1a0e08" />
      {[[100, 380, "usb"], [180, 400, "sd"], [280, 390, "cd"], [400, 410, "usb"], [500, 385, "sd"],
        [600, 400, "cd"], [680, 395, "usb"]].map(([x, y, t], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${(i * 37) % 60 - 30})`}>
          {t === "usb" && <><rect x="-12" y="-4" width="24" height="8" fill="#3a4058" /><rect x="8" y="-3" width="8" height="6" fill="#c8b8a0" /></>}
          {t === "sd" && <rect x="-6" y="-8" width="12" height="16" fill="#7a5828" />}
          {t === "cd" && <><circle cx="0" cy="0" r="12" fill="#c8c8d0" opacity="0.8" /><circle cx="0" cy="0" r="3" fill="#0a0a10" /></>}
        </g>
      ))}
      {/* PERSO 1 : adulte tenant une clé USB, dépité */}
      <g transform="translate(220,340)">
        <path d="M-12 0 L-16 -60 L-4 -70 L4 -70 L16 -60 L12 0 Z" fill="#5a3020" />
        <circle cx="0" cy="-78" r="10" fill="#e0b898" />
        <path d="M-8 -80 Q0 -90 8 -80 L8 -70 L-8 -70 Z" fill="#3a2418" />
        {/* bras qui tient la clé */}
        <path d="M-12 -40 L-24 -20" stroke="#e0b898" strokeWidth="4" strokeLinecap="round" />
        <rect x="-32" y="-24" width="14" height="6" fill="#3a4058" />
        <rect x="-20" y="-23" width="4" height="4" fill="#c8b8a0" />
        {/* ? au-dessus */}
        <text x="-8" y="-96" fontSize="14" fontWeight="800" fill="#8a8878">?</text>
      </g>
      {/* PERSO 2 : enfant qui demande "c'est quoi ?" */}
      <g transform="translate(300,340)">
        <path d="M-8 0 L-10 -40 L-2 -46 L2 -46 L10 -40 L8 0 Z" fill="#3a5878" />
        <circle cx="0" cy="-52" r="8" fill="#f0d0a8" />
        <path d="M-6 -54 Q0 -62 6 -54 L6 -46 L-6 -46 Z" fill="#5a3818" />
        {/* bulle "c'est quoi ?" */}
        <g transform="translate(28,-60)">
          <rect x="-4" y="-12" width="70" height="20" fill="#fff" rx="4" />
          <path d="M0 4 L-6 10 L0 4 Z" fill="#fff" />
          <text x="30" y="2" textAnchor="middle" fontSize="10" fontFamily="Georgia, serif" fill="#3a2418">c'est quoi ?</text>
        </g>
      </g>
      {/* cadres photo vides accrochés au mur */}
      {[[80, 160], [660, 180], [720, 220]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${i * 5 - 5})`}>
          <rect x="-16" y="-20" width="32" height="26" fill="#8a6838" stroke="#3a2818" strokeWidth="1" />
          <rect x="-13" y="-17" width="26" height="20" fill="#1a1408" />
          <text x="0" y="-4" textAnchor="middle" fontSize="16" fill="#3a2818" opacity="0.6">✕</text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Planche 4 : ce qui a tenu ─── */
function P4() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p4-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2818" /><stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
        <radialGradient id="p4-torch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe090" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffe090" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p4-bg)" />
      {/* halo torche au centre */}
      <ellipse cx="400" cy="230" rx="360" ry="220" fill="url(#p4-torch)" />

      {/* CASE 1 : paroi de Lascaux (main sur bison) */}
      <g transform="translate(180,180)">
        <rect x="-140" y="-80" width="280" height="160" fill="#c8a878" stroke="#5a3818" strokeWidth="2" rx="6" />
        <rect x="-130" y="-70" width="260" height="140" fill="#8a6838" opacity="0.4" />
        {/* bison ocre stylisé */}
        <g transform="translate(-30,10)">
          <path d="M-60 0 Q-70 -20 -50 -32 Q-30 -40 0 -34 Q30 -30 50 -20 Q60 -10 55 8 Q40 20 20 20 Q-20 24 -50 18 Q-64 12 -60 0 Z" fill="#7a3818" />
          <path d="M-50 -32 L-56 -44" stroke="#7a3818" strokeWidth="3" strokeLinecap="round" />
          <path d="M-42 -30 L-48 -42" stroke="#5a2810" strokeWidth="2" strokeLinecap="round" />
          <circle cx="-42" cy="-16" r="1.6" fill="#1a0808" />
          <path d="M-56 4 L-56 20 M-40 6 L-40 22 M32 6 L32 20 M48 4 L48 18" stroke="#5a2810" strokeWidth="2" />
        </g>
        {/* main qui touche */}
        <g transform="translate(80,20)">
          <ellipse cx="0" cy="0" rx="16" ry="10" fill="#e0b898" />
          {[-14, -8, 0, 8].map((dx, i) => (
            <rect key={i} x={dx - 2} y={-14 + (i === 0 || i === 3 ? 4 : 0)} width="4" height={12 + (i === 1 || i === 2 ? 4 : 0)} fill="#e0b898" />
          ))}
        </g>
        <text x="0" y="72" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fontStyle="italic" fill="#5a3818" opacity="0.85">— la paroi</text>
      </g>

      {/* CASE 2 : livre ouvert */}
      <g transform="translate(560,150)">
        <rect x="-100" y="-56" width="200" height="112" fill="#3a2818" />
        {/* pages ouvertes */}
        <path d="M-90 -46 L0 -50 L90 -46 L90 46 L0 42 L-90 46 Z" fill="#e8d8a8" />
        <path d="M0 -50 L0 42" stroke="#8a6838" strokeWidth="1" />
        {/* lignes de texte */}
        {[-30, -22, -14, -6, 2, 10, 18, 26, 34].map((y, i) => (
          <g key={i}>
            <line x1="-82" y1={y} x2="-10" y2={y} stroke="#3a2818" strokeWidth="0.8" opacity="0.7" />
            <line x1="8" y1={y} x2="82" y2={y} stroke="#3a2818" strokeWidth="0.8" opacity="0.7" />
          </g>
        ))}
        {/* enluminure lettrine */}
        <rect x="-82" y="-42" width="14" height="18" fill="#c02020" opacity="0.7" />
        <text x="-75" y="-28" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffe090">A</text>
      </g>

      {/* CASE 3 : pierre gravée (stèle avec hiéroglyphes) */}
      <g transform="translate(180,370)">
        <path d="M-40 -70 Q-42 -80 -30 -84 L30 -84 Q42 -80 40 -70 L36 30 L-36 30 Z" fill="#8a7040" stroke="#3a2818" strokeWidth="1.5" />
        {[-56, -44, -32, -20, -8, 4, 16].map((y, i) => (
          <g key={i}>
            <text x="-24" y={y} fontSize="10" fill="#3a2818" fontFamily="serif">☥</text>
            <text x="-4" y={y} fontSize="10" fill="#3a2818" fontFamily="serif">𓂀</text>
            <text x="16" y={y} fontSize="10" fill="#3a2818" fontFamily="serif">𓅓</text>
          </g>
        ))}
      </g>

      {/* CASE 4 : vitrail éclairé */}
      <g transform="translate(560,370)">
        <rect x="-50" y="-70" width="100" height="140" fill="#1a0e08" />
        <path d="M-46 -66 A 46 46 0 0 1 46 -66 L46 66 L-46 66 Z" fill="#3a2418" stroke="#5a3818" strokeWidth="2" />
        {/* vitrail : segments colorés */}
        <g>
          <path d="M-42 -60 A 42 42 0 0 1 -14 -66 L-14 -20 L-42 -20 Z" fill="#4a2078" opacity="0.85" />
          <path d="M-14 -66 L14 -66 L14 -20 L-14 -20 Z" fill="#c02020" opacity="0.85" />
          <path d="M14 -66 A 42 42 0 0 1 42 -60 L42 -20 L14 -20 Z" fill="#2a5088" opacity="0.85" />
          <path d="M-42 -20 L42 -20 L42 20 L-42 20 Z" fill="#e0a020" opacity="0.85" />
          <path d="M-42 20 L42 20 L42 66 L-42 66 Z" fill="#2a7048" opacity="0.85" />
        </g>
        {/* meneaux */}
        <line x1="-14" y1="-66" x2="-14" y2="66" stroke="#1a1408" strokeWidth="1.5" />
        <line x1="14" y1="-66" x2="14" y2="66" stroke="#1a1408" strokeWidth="1.5" />
        <line x1="-46" y1="-20" x2="46" y2="-20" stroke="#1a1408" strokeWidth="1.5" />
        <line x1="-46" y1="20" x2="46" y2="20" stroke="#1a1408" strokeWidth="1.5" />
        {/* torche accrochée */}
        <g transform="translate(-70,-30)">
          <rect x="-2" y="0" width="4" height="30" fill="#3a2418" />
          <ellipse cx="0" cy="-6" rx="6" ry="10" fill="#ffe090" opacity="0.85">
            <animate attributeName="ry" values="10;8;10" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </g>
    </svg>
  );
}

/* ─── Planche 5 : la maladie de la mémoire ─── */
function P5() {
  return (
    <svg viewBox="0 0 800 460" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="p5-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2028" /><stop offset="100%" stopColor="#0a0e18" />
        </linearGradient>
        <radialGradient id="p5-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe090" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffe090" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#p5-bg)" />

      {/* la personne âgée, moitié gauche nette, moitié droite qui s'efface */}
      <g transform="translate(340,220)">
        {/* épaules — moitié gauche solide, moitié droite pointillée */}
        <path d="M-100 200 L-100 90 Q-100 50 -60 40 L0 40 L0 200 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5" />
        <path d="M0 40 L60 40 Q100 50 100 90 L100 200 L0 200 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.35" />

        {/* tête */}
        <ellipse cx="-30" cy="-10" rx="42" ry="50" fill="#e0b898" stroke="#5a3818" strokeWidth="1.5" />
        <path d="M-72 -30 Q-70 -60 -30 -60 Q10 -60 30 -30" stroke="#e8e8e0" strokeWidth="10" fill="none" strokeLinecap="round" />
        {/* traits nets côté gauche */}
        <ellipse cx="-46" cy="-14" rx="4" ry="3" fill="#f8f4e8" />
        <circle cx="-46" cy="-14" r="1.8" fill="#3a3050" />
        <path d="M-52 -24 q4 -3 10 -1" stroke="#8a7048" strokeWidth="1.6" fill="none" />
        <path d="M-60 -4 q4 4 8 4" stroke="#8a5828" strokeWidth="0.6" fill="none" opacity="0.6" />
        <path d="M-56 -4 q4 4 8 4" stroke="#8a5828" strokeWidth="0.6" fill="none" opacity="0.5" />
        {/* moitié droite du visage qui s'estompe (pointillés) */}
        <path d="M12 -50 Q30 -30 30 -10 Q30 30 12 40" stroke="#5a3818" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
        <circle cx="-12" cy="-14" r="1.8" fill="#3a3050" opacity="0.35" />
        <path d="M-14 4 L-14 20 L-4 22" stroke="#8a5828" strokeWidth="0.8" fill="none" opacity="0.4" strokeDasharray="2 2" />
        {/* particules qui s'échappent du côté effacé, comme mémoire qui part au vent */}
        {[[20, -40], [30, -20], [40, 0], [26, 20], [40, -50]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#c8d4e2" opacity="0.5">
            <animate attributeName="cx" values={`${x};${x + 30};${x + 60}`} dur={`${3 + i}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0" dur={`${3 + i}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* pancarte "Je m'appelle ..." pendue au cou */}
        <path d="M-30 50 L-30 90" stroke="#8a6838" strokeWidth="1" />
        <rect x="-72" y="90" width="84" height="30" fill="#f0e0c0" stroke="#8a6838" strokeWidth="1" />
        <text x="-64" y="103" fontSize="9" fontFamily="Georgia, serif" fill="#3a2418">Je m'appelle</text>
        <text x="-64" y="115" fontSize="10" fontFamily="Georgia, serif" fill="#8a6838" letterSpacing="2">. . . . . . .</text>
      </g>

      {/* enfant qui tend une photo, halo doré autour de la photo */}
      <g transform="translate(560,320)">
        <ellipse cx="0" cy="-30" rx="60" ry="45" fill="url(#p5-glow)" />
        <path d="M-14 60 L-16 -10 L-4 -18 L4 -18 L16 -10 L14 60 Z" fill="#e05028" />
        <circle cx="0" cy="-24" r="14" fill="#f0d0a8" stroke="#5a3818" strokeWidth="0.8" />
        <path d="M-12 -30 Q0 -40 12 -30 L12 -18 L-12 -18 Z" fill="#3a2818" />
        {/* petit sourire */}
        <path d="M-6 -20 Q0 -16 6 -20" stroke="#5a2810" strokeWidth="1" fill="none" />
        {/* bras tendu avec photo */}
        <path d="M-14 -6 L-40 -20" stroke="#f0d0a8" strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(-50,-28) rotate(-8)">
          <rect x="-20" y="-16" width="40" height="32" fill="#fff" stroke="#8a6838" strokeWidth="1" />
          {/* photo : une jeune femme avec un enfant */}
          <ellipse cx="-6" cy="-4" rx="6" ry="8" fill="#e0b898" />
          <path d="M-12 -8 Q-6 -14 0 -8 L0 4 L-12 4 Z" fill="#3a2818" />
          <ellipse cx="8" cy="4" rx="4" ry="5" fill="#f0d0a8" />
        </g>
        {/* bulle "c'est toi, mamie" */}
        <g transform="translate(30,-58)">
          <rect x="-4" y="-14" width="90" height="24" fill="#fff" rx="4" />
          <path d="M4 8 L-4 14 L4 8 Z" fill="#fff" />
          <text x="40" y="0" textAnchor="middle" fontSize="10" fontFamily="Georgia, serif" fill="#3a2418">c'est toi, mamie…</text>
        </g>
      </g>

      {/* photos qui tombent, feuilles envolées en fond */}
      {[[100, 80], [180, 140], [80, 300], [700, 100], [640, 220]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${i * 20 - 40})`} opacity="0.6">
          <rect x="-12" y="-9" width="24" height="18" fill="#fff" stroke="#8a6838" strokeWidth="0.6" />
          <rect x="-10" y="-7" width="20" height="10" fill="#c8b8a0" />
          <animateTransform attributeName="transform" type="translate" values={`${x} ${y};${x + 20} ${y + 60};${x} ${y}`} dur={`${6 + i}s`} repeatCount="indefinite" additive="sum" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Séquence complète ─── */
const PLANCHES = [
  { titre: "Carnet d'Elias",            date: "2287",   Vignette: P0, cover: true,
    texte: "Je m'appelle Elias. Je vis à la station des chronautes. J'écris ces pages pour que ce qui nous est arrivé ne s'efface pas tout à fait. Tourne, si tu veux lire." },
  { titre: "Notre monde d'avant",       date: "vers 2200",   Vignette: P1,
    texte: "Notre ville ne s'endormait jamais. Écrans partout, réseaux partout — et nous, la tête dedans. C'était il y a longtemps, avant ma naissance. Mes grands-parents me l'ont raconté." },
  { titre: "Le grand silence",          date: "un matin",    Vignette: P2,
    texte: "Un matin, tout s'est éteint. Serveurs, satellites, écrans, téléphones. Personne n'a jamais su rallumer. On a d'abord cru à une panne. Puis les jours ont passé." },
  { titre: "Cinq siècles envolés",      date: "les années suivantes", Vignette: P3,
    texte: "Photos, films, livres, journaux, courrier : tout était sur des supports qu'on ne pouvait plus lire. Les enfants nous demandaient ce qu'était une clé USB — nous n'avions plus rien à leur montrer." },
  { titre: "Ce qui a tenu",             date: "à travers les âges", Vignette: P4,
    texte: "Il restait ce que le temps avait déjà éprouvé : les parois gravées, les livres imprimés, les stèles, les vitraux. Ce sont eux qui nous ont rendu, morceau par morceau, un peu de mémoire." },
  { titre: "La maladie de la mémoire",  date: "aujourd'hui", Vignette: P5,
    texte: "Mais quelque chose nous ronge. On perd nos souvenirs, un peu chaque jour. Certains oublient jusqu'à leur propre nom. Ceux qui oublient tout oublient même qu'ils oublient. C'est le pire." },
];

export default function CarnetElias({ onDone }) {
  const [i, setI] = useState(0);
  const p = PLANCHES[i];
  const total = PLANCHES.length;
  const dernier = i === total - 1;

  /* Clic n'importe où sur l'écran = tourner la page.
     Sur la dernière planche : ferme le carnet. */
  const advance = () => { if (dernier) onDone(); else setI(i + 1); };

  return (
    <div onClick={advance}
      style={{ position: "fixed", inset: 0, background: "#050810", color: "#e8eef5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: 20, zIndex: 80, fontFamily: "Georgia, serif", overflowY: "auto", cursor: "pointer" }}>
      {/* en-tête : indication + option skip discret */}
      <div style={{ width: "100%", maxWidth: 900, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 3, color: "#ffd166" }}>📖 LE CARNET D'ELIAS · {i + 1}/{total}</div>
        <button onClick={(e) => { e.stopPropagation(); onDone(); }}
          title="Sauter le carnet"
          style={{ background: "rgba(20,27,38,0.6)", color: "#8fa3bd", border: "1px solid rgba(200,212,226,0.25)", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, fontFamily: "ui-monospace,monospace", cursor: "pointer", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
          passer ›
        </button>
      </div>

      {/* la page du carnet : couleur parchemin, ombre douce */}
      <div style={{ width: "100%", maxWidth: 900, background: "#f2e6cc", color: "#2a1810", border: "1px solid #8a6838", borderRadius: 6, boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 2px 0 #d8c8a0 inset", padding: 22, position: "relative" }}>
        {/* petite indication de chapitre en haut */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #a89058", paddingBottom: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{p.titre}</div>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#8a5828" }}>{p.date}</div>
        </div>

        {/* la case dessinée */}
        <div style={{ border: "1px solid #8a6838", boxShadow: "inset 0 0 0 3px #f2e6cc, inset 0 0 0 4px #8a6838", borderRadius: 3, overflow: "hidden", background: "#0a0a12" }}>
          <p.Vignette />
        </div>

        {/* texte narratif */}
        <p style={{ fontSize: 16, lineHeight: 1.7, margin: "16px 4px 4px", fontStyle: "italic", color: "#2a1810" }}>
          « {p.texte} »
        </p>
      </div>

      {/* barre de navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={(e) => { e.stopPropagation(); setI(Math.max(0, i - 1)); }} disabled={i === 0}
          style={{ background: i === 0 ? "#26324a" : "#141b26", color: i === 0 ? "#5a7a90" : "#c8d4e2", border: "1px solid #3a4a68", borderRadius: 10, padding: "10px 18px", fontFamily: "ui-monospace,monospace", fontWeight: 700, cursor: i === 0 ? "default" : "pointer" }}>
          ‹ Précédent
        </button>
        {/* points de progression */}
        <div style={{ display: "flex", gap: 6 }}>
          {PLANCHES.map((_, k) => (
            <div key={k} onClick={(e) => { e.stopPropagation(); setI(k); }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: k === i ? "#ffd166" : k < i ? "#8a6838" : "#26324a", cursor: "pointer", border: "1px solid #3a2818" }} />
          ))}
        </div>
        {!dernier ? (
          <button onClick={(e) => { e.stopPropagation(); setI(i + 1); }}
            style={{ background: "#8a6838", color: "#f2e6cc", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "ui-monospace,monospace", fontWeight: 700, cursor: "pointer" }}>
            Suivant ›
          </button>
        ) : (
          <button onClick={onDone}
            style={{ background: "#e8934a", color: "#160c02", border: "none", borderRadius: 10, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontWeight: 800, letterSpacing: 1, cursor: "pointer", boxShadow: "0 0 20px rgba(232,150,74,0.5)" }}>
            ▸ Rejoindre la station
          </button>
        )}
      </div>
    </div>
  );
}
