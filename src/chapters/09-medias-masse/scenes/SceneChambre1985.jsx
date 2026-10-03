import { useState } from "react";
import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import PacManEgg from "./PacManEgg.jsx";

/* ============================================================
   CHAPITRE 9 — Tableau : Chambre de Julien, 15 ans, 1985.
   Chambre d'ado : lit défait, papier peint bleu, poster de rock
   band, bureau encombré avec une radio-cassette double platine,
   pile de cassettes TDK, un ZX Spectrum, une pile de disquettes,
   BD, sac de sport. On enregistre un tube à la radio ; on ramasse
   aussi la disquette (héritage pour ch.10).
   ============================================================ */

export default function SceneChambre1985({ collect, action, reveal, made = [], flags = [], mode }) {
  const cassetteChargee = !!flags.cassette_chargee;
  const cassetteFaite = made.includes("msg_cassette");
  const disquettePrise = made.includes("disquette");
  const [pacman, setPacman] = useState(false);

  return (
    <>
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="c85-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a7098" /><stop offset="100%" stopColor="#2a4058" /></linearGradient>
        <linearGradient id="c85-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5828" /><stop offset="100%" stopColor="#3a2010" /></linearGradient>
        <linearGradient id="c85-bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c83028" /><stop offset="100%" stopColor="#8a1a18" /></linearGradient>
        <linearGradient id="c85-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a06840" /><stop offset="100%" stopColor="#5a3018" /></linearGradient>
      </defs>

      {/* ═══ MUR + papier peint années 80 + FENÊTRE sur la ville ═══ */}
      <PLayer depth={4}>
        <rect width="1000" height="560" fill="url(#c85-wall)" />
        {/* motif géométrique 80s */}
        {[...Array(6)].map((_, r) => [...Array(12)].map((_, c) => (
          <g key={`m-${r}-${c}`} transform={`translate(${40 + c * 82},${30 + r * 68})`}>
            <path d="M-3 -3 L3 -3 L0 3 Z" fill="#68a0c0" opacity="0.4" />
          </g>
        )))}

        {/* FENÊTRE sur la ville — vue de banlieue années 80, ciel d'après-midi orangé */}
        <g>
          <rect x="450" y="60" width="200" height="180" fill="#f8b060" stroke="#3a1e10" strokeWidth="5" />
          {/* croisillons */}
          <path d="M550 60 L550 240 M450 150 L650 150" stroke="#3a1e10" strokeWidth="2.5" />
          {/* dégradé ciel */}
          <rect x="450" y="60" width="200" height="90" fill="#f8b060" />
          <rect x="450" y="150" width="200" height="90" fill="#8a6040" />
          {/* soleil couchant */}
          <circle cx="560" cy="130" r="18" fill="#f8e070" opacity="0.9" />
          {/* silhouette d'HLM et immeubles de banlieue */}
          <path d="M450 220 L450 175 L470 175 L470 165 L490 165 L490 220 Z" fill="#3a2818" opacity="0.85" />
          <path d="M500 220 L500 155 L540 155 L540 145 L580 145 L580 220 Z" fill="#3a2818" opacity="0.9" />
          <path d="M590 220 L590 170 L610 170 L610 160 L640 160 L640 220 Z" fill="#3a2818" opacity="0.85" />
          {/* fenêtres allumées ici et là (soirée qui tombe) */}
          {[[476, 195], [510, 165], [518, 175], [526, 185], [548, 155], [556, 165], [568, 175], [600, 180], [618, 175], [626, 190]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="3" height="3" fill="#f8e070" opacity="0.9" />
          ))}
          {/* antenne râteau silhouettée sur l'immeuble d'en face */}
          <g transform="translate(520,145)">
            <path d="M0 0 L0 -20" stroke="#1a0e04" strokeWidth="1" />
            <path d="M-6 -20 h12 M-4 -18 h8 M-3 -16 h6" stroke="#1a0e04" strokeWidth="0.8" />
          </g>
          {/* fils électriques traversants (parisien) */}
          <path d="M450 100 Q550 108 650 100" stroke="#1a0e04" strokeWidth="0.6" opacity="0.7" />
          {/* rideau à motif rouge fripé sur le côté */}
          <path d="M650 60 L680 60 L676 240 L650 240 Z" fill="#c02830" />
          <path d="M660 70 v170 M670 70 v170" stroke="#8a1820" strokeWidth="1" opacity="0.7" />
        </g>
      </PLayer>

      {/* ═══ POSTER de groupe rock au mur ═══ */}
      <PLayer depth={3.5}>
        <g transform="translate(200,90)">
          <rect x="0" y="0" width="180" height="220" fill="#1a1a1a" stroke="#e8d8b0" strokeWidth="4" />
          {/* silhouette guitariste stylisée */}
          <path d="M40 30 L60 20 L80 30 L90 60 L70 100 L100 140 L80 190 L60 190 L40 140 L30 100 L20 60 Z" fill="#e83820" opacity="0.85" />
          <circle cx="60" cy="40" r="14" fill="#f8b800" />
          {/* nom du groupe */}
          <text x="90" y="205" textAnchor="middle" fontFamily="ui-monospace,monospace" fontWeight="800" fontSize="18" fill="#f8b800" style={{ letterSpacing: "3px" }}>ELECTRIC</text>
        </g>
        {/* punaises */}
        <circle cx="205" cy="95" r="3" fill="#c8c8c8" />
        <circle cx="375" cy="95" r="3" fill="#c8c8c8" />
        <circle cx="205" cy="305" r="3" fill="#c8c8c8" />
        <circle cx="375" cy="305" r="3" fill="#c8c8c8" />

        {/* PLAQUE d'immatriculation OUTATIME (clin d'oeil Back to the
            Future) accrochee sur le mur au-dessus du bureau. */}
        <g transform="translate(770,140) rotate(-3)">
          {/* ombre portee */}
          <rect x="-52" y="-16" width="104" height="34" rx="3" fill="#0a0604" opacity="0.35" transform="translate(2,3)" />
          {/* plaque : fond blanc creme, cadre bleu */}
          <rect x="-52" y="-16" width="104" height="34" rx="3" fill="#f0e6d2" stroke="#3a2818" strokeWidth="1" />
          <rect x="-52" y="-16" width="104" height="34" rx="3" fill="none" stroke="#c8382e" strokeWidth="1.4" />
          {/* bandeau CALIFORNIA rouge en haut */}
          <text x="0" y="-6" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="6.5" fontWeight="700" fill="#c8382e" letterSpacing="1">California</text>
          {/* le texte OUTATIME en gros, style embossage */}
          <text x="0" y="12" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="18" fontWeight="900" fill="#1a2a54" letterSpacing="2.5">OUTATIME</text>
          <text x="0" y="12" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="18" fontWeight="900" fill="none" stroke="#0a1230" strokeWidth="0.4" letterSpacing="2.5">OUTATIME</text>
          {/* vignette SEP 85 en bas a droite */}
          <rect x="34" y="12" width="14" height="6" fill="#f8b800" stroke="#3a2818" strokeWidth="0.4" />
          <text x="41" y="17" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fontWeight="700" fill="#3a2818">SEP</text>
          {/* petits trous de fixation */}
          <circle cx="-46" cy="-10" r="1" fill="#5a4028" />
          <circle cx="46"  cy="-10" r="1" fill="#5a4028" />
        </g>
      </PLayer>

      {/* ═══ meubles ═══ */}
      <PLayer depth={2}>
        {/* sol parquet */}
        <rect y="440" width="1000" height="120" fill="url(#c85-floor)" />
        <path d="M0 460 h1000 M0 480 h1000 M0 500 h1000 M0 520 h1000" stroke="#5a3818" strokeWidth="0.6" opacity="0.5" />

        {/* BORNE d'ARCADE plantee au sol entre le lit et le bureau, avec
            un ecran ou tourne un Pac-Man. Un clic ouvre le mini-jeu. */}
        <g transform="translate(410,320)"
           onClick={(e) => { e.stopPropagation(); setPacman(true); }}
           style={{ cursor: "pointer" }}>
          {/* Halo doré clignotant pour signaler le mini-jeu */}
          <ellipse cx="0" cy="140" rx="56" ry="10" fill="none" stroke="#ffd700" strokeWidth="1" strokeDasharray="3 4" opacity="0.5">
            <animate attributeName="opacity" values="0.25;0.75;0.25" dur="2s" repeatCount="indefinite" />
          </ellipse>
          {/* silhouette cabinet (haute et etroite) */}
          <path d="M-40 140 L40 140 L44 0 L36 -30 L36 -70 L-36 -70 L-36 -30 L-44 0 Z" fill="#181818" stroke="#0a0a0a" strokeWidth="1.5" />
          {/* enseigne "ARCADE" en haut */}
          <rect x="-32" y="-66" width="64" height="14" rx="2" fill="#3a80c8" stroke="#0a0a0a" strokeWidth="0.8" />
          <text x="0" y="-56" textAnchor="middle" fontFamily="ui-monospace,monospace" fontWeight="800" fontSize="9" fill="#ffe08a" letterSpacing="2">ARCADE</text>
          {/* filet neon rose autour de la borne */}
          <path d="M-40 140 L40 140 L44 0 L36 -30 L36 -70 L-36 -70 L-36 -30 L-44 0 Z" fill="none" stroke="#ff4aa0" strokeWidth="0.8" opacity="0.8" />
          {/* ecran (fond noir) */}
          <rect x="-30" y="-46" width="60" height="42" rx="3" fill="#000000" stroke="#3a3a3a" strokeWidth="1.4" />
          {/* labyrinthe simplifie */}
          <g transform="translate(-30,-46)">
            <rect x="0" y="0" width="60" height="42" fill="#000" />
            <path d="M4 6 h20 M32 6 h24 M4 12 v14 M56 12 v14 M4 36 h52 M18 18 h8 M34 18 h8 M18 24 h8 M34 24 h8 M12 32 h6 M42 32 h6" stroke="#3a3aff" strokeWidth="0.9" fill="none" />
            {/* points a manger */}
            {[[10,10],[26,10],[42,10],[52,10],[10,20],[26,20],[42,20],[10,28],[26,28],[42,28],[52,28]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="0.9" fill="#ffe08a" />
            ))}
            {/* pastilles de puissance clignotantes */}
            <circle cx="6" cy="10" r="1.8" fill="#ffe08a">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="54" cy="10" r="1.8" fill="#ffe08a">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" begin="0.3s" repeatCount="indefinite" />
            </circle>
            {/* PAC-MAN qui traverse le labyrinthe en boucle */}
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="8,20; 50,20; 50,28; 8,28; 8,20"
                keyTimes="0; 0.35; 0.5; 0.85; 1"
                dur="6s" repeatCount="indefinite" />
              {/* bouche qui claque : deux path qui alternent */}
              <path fill="#ffe000">
                <animate attributeName="d" dur="0.28s" repeatCount="indefinite"
                  values="M0 0 m-3 0 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 Z;
                          M0 0 l3 0 l1 -3 l-4 3 l4 3 l-1 -3 l-3 0 a3 3 0 1 1 0 0 Z;
                          M0 0 m-3 0 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 Z" />
              </path>
            </g>
            {/* petit fantome rouge qui suit */}
            <g fill="#ff4a4a">
              <animateTransform attributeName="transform" type="translate"
                values="4,20; 46,20; 46,28; 4,28; 4,20"
                keyTimes="0; 0.35; 0.5; 0.85; 1"
                dur="6s" repeatCount="indefinite" />
              <path d="M-3 0 a3 3 0 0 1 6 0 L3 3 L2 2 L1 3 L0 2 L-1 3 L-2 2 L-3 3 Z" />
              <circle cx="-1" cy="-0.4" r="0.7" fill="#fff" />
              <circle cx="1.2" cy="-0.4" r="0.7" fill="#fff" />
              <circle cx="-1" cy="-0.4" r="0.35" fill="#0a0aff" />
              <circle cx="1.2" cy="-0.4" r="0.35" fill="#0a0aff" />
            </g>
            {/* HUD */}
            <text x="4" y="4.5" fontSize="3" fontFamily="ui-monospace,monospace" fill="#ffe08a">1UP</text>
            <text x="56" y="4.5" textAnchor="end" fontSize="3" fontFamily="ui-monospace,monospace" fill="#ffe08a">HI</text>
          </g>
          {/* tableau de commande (joystick + boutons) */}
          <rect x="-30" y="0" width="60" height="18" fill="#2a2a2a" stroke="#0a0a0a" strokeWidth="1" />
          <circle cx="-14" cy="9" r="4" fill="#e83820" stroke="#3a0a08" strokeWidth="0.8" />
          <path d="M-14 9 v-4" stroke="#0a0a0a" strokeWidth="1.2" />
          <circle cx="4" cy="7" r="2.5" fill="#f8b800" />
          <circle cx="12" cy="7" r="2.5" fill="#3a80c8" />
          <circle cx="20" cy="7" r="2.5" fill="#c02830" />
          {/* fente pieces */}
          <rect x="-4" y="24" width="10" height="6" fill="#3a3a3a" stroke="#0a0a0a" strokeWidth="0.6" />
          <path d="M-2 26 h6" stroke="#0a0a0a" strokeWidth="0.8" />
          {/* base ombre */}
          <ellipse cx="0" cy="142" rx="42" ry="4" fill="#0a0a0a" opacity="0.5" />
        </g>
        {/* LIT à gauche */}
        <g>
          <rect x="30" y="380" width="180" height="80" fill="url(#c85-bed)" stroke="#3a1808" strokeWidth="2" />
          <rect x="30" y="380" width="180" height="16" fill="#e0c880" />
          <path d="M30 396 Q60 400 100 396 Q140 400 180 396 Q210 400 210 396" stroke="#a0803a" strokeWidth="1.4" fill="none" />
          {/* oreiller défait */}
          <rect x="40" y="360" width="60" height="26" rx="6" fill="#e8e0d0" transform="rotate(-8 70 373)" />
          {/* couverture chiffonnée */}
          <path d="M110 400 Q130 388 150 402 Q170 386 200 400 L200 458 L110 458 Z" fill="#8a1a10" />
        </g>

        {/* BUREAU à droite */}
        <g>
          <rect x="460" y="360" width="450" height="20" fill="url(#c85-desk)" stroke="#2a1608" strokeWidth="2" />
          <rect x="475" y="380" width="20" height="80" fill="#3a1e10" />
          <rect x="880" y="380" width="20" height="80" fill="#3a1e10" />
          {/* tiroirs sous le bureau */}
          <rect x="700" y="380" width="180" height="80" fill="url(#c85-desk)" stroke="#2a1608" strokeWidth="1.5" />
          <rect x="710" y="392" width="160" height="30" fill="#5a3018" stroke="#8a5828" strokeWidth="1" />
          <rect x="710" y="426" width="160" height="30" fill="#5a3018" stroke="#8a5828" strokeWidth="1" />
          <circle cx="790" cy="407" r="3" fill="#c8963e" />
          <circle cx="790" cy="441" r="3" fill="#c8963e" />

          {/* RADIO-CASSETTE double platine sur le bureau */}
          <g transform="translate(560,340)">
            <rect x="-70" y="0" width="140" height="30" fill="#3a3830" stroke="#0a0806" strokeWidth="2" />
            <rect x="-70" y="0" width="140" height="8" fill="#5a5850" />
            {/* deux platines */}
            <rect x="-60" y="10" width="45" height="16" fill="#0a0806" stroke="#6a6a6a" strokeWidth="0.8" />
            <rect x="-52" y="14" width="30" height="8" fill="#3a3a3a" />
            {[-46, -30].map((x, i) => <circle key={i} cx={x} cy="18" r="2.5" fill="#8a8a8a" />)}
            <rect x="15" y="10" width="45" height="16" fill="#0a0806" stroke="#c8963e" strokeWidth="0.8" />
            <rect x="23" y="14" width="30" height="8" fill={cassetteFaite ? "#c8963e" : "#3a3a3a"} />
            {[29, 45].map((x, i) => <circle key={i} cx={x} cy="18" r="2.5" fill={cassetteFaite ? "#e0a848" : "#8a8a8a"} />)}
            {/* haut : boutons */}
            {[[-55, 4], [-40, 4], [-25, 4], [-10, 4], [5, 4], [20, 4], [35, 4], [50, 4]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="10" height="3" fill={i === 6 ? "#e83820" : "#8a8a8a"} rx="0.5" />
            ))}
            {/* logo REC LED */}
            {cassetteFaite && <circle cx="40" cy="4" r="2" fill="#e83820" style={{ animation: "pulse 1s ease-in-out infinite" }} />}
            {/* antenne */}
            <path d="M60 0 L70 -30" stroke="#8a8a8a" strokeWidth="1.4" />
          </g>

          {/* PILE de CASSETTES TDK — posée sur le bureau, entre le radio-cassette et le ZX Spectrum */}
          {!cassetteFaite && (
            <g transform="translate(700,354)">
              <rect x="-18" y="-2" width="36" height="10" fill="#e83820" stroke="#0a0806" strokeWidth="0.8" />
              <rect x="-18" y="-12" width="36" height="10" fill="#f8b800" stroke="#0a0806" strokeWidth="0.8" />
              <rect x="-18" y="-22" width="36" height="10" fill="#68a0c0" stroke="#0a0806" strokeWidth="0.8" />
              <text x="0" y="5" textAnchor="middle" fontSize="5" fontFamily="ui-monospace,monospace" fontWeight="700" fill="#000">TDK 60</text>
              <text x="0" y="-5" textAnchor="middle" fontSize="5" fontFamily="ui-monospace,monospace" fontWeight="700" fill="#000">TDK 90</text>
              <text x="0" y="-15" textAnchor="middle" fontSize="5" fontFamily="ui-monospace,monospace" fontWeight="700" fill="#000">TDK 60</text>
            </g>
          )}

          {/* MICRO-ORDINATEUR old school beige : gros ecran CRT sur son
              boitier + clavier avec ligne d'invite qui clignote. */}
          <g transform="translate(830,340)">
            {/* boitier plat sous le moniteur */}
            <rect x="-50" y="14" width="100" height="12" fill="#d8ccb0" stroke="#3a2818" strokeWidth="0.8" />
            <rect x="-46" y="16" width="10" height="8" fill="#3a2818" />
            <text x="-41" y="22" textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fill="#d8ccb0">A:▸</text>
            <path d="M20 20 h20" stroke="#8a7c60" strokeWidth="0.4" />
            {/* moniteur CRT arrondi */}
            <rect x="-40" y="-40" width="80" height="52" rx="6" fill="#e0d4b8" stroke="#3a2818" strokeWidth="1.2" />
            {/* ecran noir avec halo */}
            <rect x="-32" y="-32" width="64" height="40" rx="3" fill="#0a0a0a" stroke="#5a4028" strokeWidth="1" />
            {/* ligne d'invite verte qui clignote */}
            <text x="-28" y="-18" fontFamily="ui-monospace,monospace" fontSize="5" fill="#5eff9e">C:\{'>'}</text>
            <rect x="-14" y="-22" width="4" height="6" fill="#5eff9e">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>
            <text x="-28" y="-10" fontFamily="ui-monospace,monospace" fontSize="4" fill="#5eff9e" opacity="0.7">READY.</text>
            {/* petit voyant marche */}
            <circle cx="34" cy="8" r="1.2" fill="#5eff9e" />
            {/* marque */}
            <text x="0" y="8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="3.5" fill="#5a4028">PC 1985</text>
          </g>

          {/* DISQUETTE 3½ » posée à côté (héritage) */}
          {!disquettePrise && (
            <g transform="translate(830,306)">
              <rect x="-14" y="-14" width="28" height="28" fill="#3a3a3a" stroke="#0a0a0a" strokeWidth="1" />
              <rect x="-10" y="-10" width="20" height="10" fill="#c8c8c8" />
              <rect x="-4" y="-8" width="8" height="6" fill="#5a5a5a" />
              {/* étiquette */}
              <rect x="-12" y="0" width="24" height="10" fill="#f0e8d0" />
              <path d="M-10 3 h20 M-10 6 h20" stroke="#5a3818" strokeWidth="0.6" />
            </g>
          )}
        </g>
      </PLayer>

      {/* ═══ AVANT-PLAN : JULIEN sur sa chaise devant le bureau ═══ */}
      <PLayer depth={1}>
        <g transform="translate(620,410)">
          {/* corps assis */}
          <path d="M-24 60 Q-22 20 0 14 Q22 20 24 60 L24 90 L-24 90 Z" fill="#1a1a1a" />
          <text x="0" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontWeight="800" fontSize="12" fill="#e83820">ROCK</text>
          {/* veste en jean déboutonnée */}
          <path d="M-24 20 L-14 40 L-16 60" stroke="#3a5680" strokeWidth="6" fill="none" />
          <path d="M24 20 L14 40 L16 60" stroke="#3a5680" strokeWidth="6" fill="none" />
          {/* tête */}
          <ellipse cx="0" cy="0" rx="14" ry="16" fill="#f0c8a0" />
          {/* cheveux mulet */}
          <path d="M-12 -8 Q-6 -18 0 -18 Q10 -18 12 -8 Z" fill="#3a2010" />
          <path d="M12 -4 Q16 6 12 14" stroke="#3a2010" strokeWidth="4" fill="none" />
          {/* yeux */}
          <circle cx="-4" cy="-2" r="1.4" fill="#4a7a48" />
          <circle cx="4" cy="-2" r="1.4" fill="#4a7a48" />
          {/* bouche */}
          <path d="M-3 6 q3 2 6 0" stroke="#a05040" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* casque walkman autour du cou */}
          <path d="M-14 14 Q0 8 14 14" fill="none" stroke="#3a3a3a" strokeWidth="2.5" />
          <ellipse cx="-14" cy="15" rx="4" ry="5" fill="#3a3a3a" />
          <ellipse cx="14" cy="15" rx="4" ry="5" fill="#3a3a3a" />
        </g>

        {/* « ? » de quête au-dessus de Julien */}
        {/* ANACHRONISME : boîtier AirPods sur le parquet au premier plan */}
        {!made.includes("airpods") && mode !== "jeu2" && (
          <g transform="translate(240,520) rotate(-8)">
            {/* boîtier blanc, forme galet horizontal */}
            <rect x={-14} y={-6} width={28} height={12} rx={5} fill="#f0e8e0" stroke="#8a8078" strokeWidth="1" />
            {/* ligne de séparation couvercle */}
            <path d="M-14 0 h28" stroke="#a0968a" strokeWidth="0.6" />
            {/* les deux écouteurs qui dépassent en haut */}
            <ellipse cx={-6} cy={-6} rx={3.5} ry={3} fill="#f0e8e0" stroke="#8a8078" strokeWidth="0.6" />
            <ellipse cx={-6} cy={-7} rx={2} ry={1.6} fill="#3a3a3a" />
            <path d="M-6 -4 v6" stroke="#f0e8e0" strokeWidth="2" />
            <ellipse cx={6} cy={-6} rx={3.5} ry={3} fill="#f0e8e0" stroke="#8a8078" strokeWidth="0.6" />
            <ellipse cx={6} cy={-7} rx={2} ry={1.6} fill="#3a3a3a" />
            <path d="M6 -4 v6" stroke="#f0e8e0" strokeWidth="2" />
            {/* LED verte de charge */}
            <circle cx={0} cy={4} r={1} fill="#5eff9e" style={{ animation: "pulse 1.6s infinite" }} />
          </g>
        )}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={620} cy={430} r={54} label="Julien" reveal={reveal} onClick={() => action("julien")} />
      {/* la radio-cassette = support — devient bouton d'ouverture du mini-jeu une fois la cassette chargée */}
      {!cassetteChargee && (
        <Hotspot cx={570} cy={356} r={46} label="radio-cassette — glisse-y la cassette" item="radio_cassette" reveal={reveal} onClick={() => action("julien")} />
      )}
      {cassetteChargee && !cassetteFaite && (
        <Hotspot cx={570} cy={356} r={46} label="radio-cassette — attends le tube et appuie PLAY+REC" reveal={reveal} onClick={() => action("platine_rec")} />
      )}
      {cassetteFaite && (
        <Hotspot cx={570} cy={356} r={46} label="radio-cassette (REC ON !)" reveal={reveal} onClick={() => action("julien")} />
      )}
      {!cassetteChargee && (
        <Hotspot cx={700} cy={346} r={28} label="pile de cassettes TDK" item="cassette_vierge" reveal={reveal} onClick={() => collect("cassette_vierge")} />
      )}
      {!disquettePrise && (
        <Hotspot cx={830} cy={306} r={24} label="disquette 3½ » (héritage pour + tard)" item="disquette" reveal={reveal} onClick={() => collect("disquette")} />
      )}
      {mode !== "jeu2" && (
        <Hotspot cx={240} cy={520} r={22} label="… quelque chose ne va pas ici" item="airpods" reveal={reveal} onClick={() => collect("airpods")} />
      )}
      {/* Hotspot sur la borne d'arcade : "jouer à Pac-Man" */}
      <Hotspot cx={410} cy={290} r={46} label="borne d'arcade (jouer à Pac-Man)" reveal={reveal} onClick={() => setPacman(true)} />
    </svg>
    {pacman && <PacManEgg onClose={() => setPacman(false)} />}
    </>
  );
}
