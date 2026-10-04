import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";

/* ============================================================
   CHAPITRE 9 — Tableau : Salon, 21 juillet 1969, 3h56 du matin.
   Petit salon fin années 60 : moquette orange, canapé skaï,
   table basse, plantes en pot, tableau abstrait, et surtout un
   gros meuble TV cathodique. Nathalie 12 ans en chemise de nuit
   devant la TV encore neigeuse. Il faut assembler l'antenne
   râteau + les oreilles de lapin pour capter l'image de la Lune.
   ============================================================ */

export default function SceneSalon1969({ collect, action, reveal, made = [], flags = [] }) {
  const rateauPose = !!flags.rateau_pose;
  const lapinPose  = !!flags.lapin_pose;
  const capte      = made.includes("msg_tv_lune");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="s69-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c88a48" /><stop offset="100%" stopColor="#8a5828" /></linearGradient>
        <linearGradient id="s69-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8663a" /><stop offset="100%" stopColor="#8a3010" /></linearGradient>
        <linearGradient id="s69-couch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a3020" /><stop offset="100%" stopColor="#2a1a10" /></linearGradient>
        <linearGradient id="s69-tv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5030" /><stop offset="100%" stopColor="#3a1e10" /></linearGradient>
        <radialGradient id="s69-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0f0e8" stopOpacity="0.85" /><stop offset="100%" stopColor="#f0f0e8" stopOpacity="0" /></radialGradient>
        <radialGradient id="s69-lava" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8830" stopOpacity="0.55" /><stop offset="100%" stopColor="#ff8830" stopOpacity="0" /></radialGradient>
        <linearGradient id="s69-lava-fluid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffb060" /><stop offset="100%" stopColor="#e04a10" /></linearGradient>
      </defs>

      {/* ═══ mur + tapisserie années 60 + FENÊTRE sur Paris ═══ */}
      <PLayer depth={4}>
        <rect width="1000" height="560" fill="url(#s69-wall)" />
        {/* motifs géométriques années 60 */}
        {[...Array(6)].map((_, r) => [...Array(12)].map((_, c) => (
          <circle key={`p-${r}-${c}`} cx={40 + c * 82} cy={40 + r * 70} r="6" fill="#a86a30" opacity="0.4" />
        )))}

        {/* FENÊTRE haute donnant sur Paris — c'est la nuit (3h56 du matin) */}
        <g>
          <rect x="700" y="80" width="220" height="160" fill="#0a1428" stroke="#3a2418" strokeWidth="6" />
          {/* croisillons de fenêtre */}
          <path d="M810 80 L810 240 M700 160 L920 160" stroke="#3a2418" strokeWidth="3" />
          {/* skyline parisienne nocturne : silhouette d'immeubles + Tour Eiffel */}
          <path d="M700 220 L700 200 L720 200 L720 190 L740 190 L740 210 L770 210 L770 180 L790 180 L790 220 Z" fill="#1a0e04" opacity="0.85" />
          <path d="M830 220 L830 200 L860 200 L860 210 L890 210 L890 190 L920 190 L920 220 Z" fill="#1a0e04" opacity="0.85" />
          {/* Tour Eiffel au loin */}
          <g transform="translate(810,148)">
            <path d="M-12 72 L-3 -32 L3 -32 L12 72 L7 72 L4 30 L-4 30 L-7 72 Z" fill="#1a0e04" opacity="0.9" />
            <path d="M-7 44 L7 44 L5 30 L-5 30 Z" fill="#1a0e04" opacity="0.9" />
          </g>
          {/* fenêtres allumées ici et là */}
          {[[710, 205], [750, 200], [780, 190], [850, 205], [880, 200], [905, 195]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.2" fill="#f8b840" opacity="0.85" />
          ))}
          {/* lune quart croissant */}
          <circle cx="880" cy="110" r="14" fill="#f8f0d8" opacity="0.85" />
          <circle cx="884" cy="106" r="12" fill="#0a1428" />
          {/* étoiles */}
          {[[720, 100], [760, 120], [790, 100], [860, 130], [905, 120], [740, 140], [800, 135]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.7" fill="#f0e8d0" opacity="0.85" />
          ))}
        </g>

        {/* tableau abstrait cadre orange à gauche */}
        <g transform="translate(80,100)">
          <rect x="0" y="0" width="80" height="60" fill="#e83820" stroke="#3a1608" strokeWidth="3" />
          <path d="M8 8 L24 32 L48 16 L64 42 L72 24" stroke="#f8b800" strokeWidth="3" fill="none" />
          <circle cx="16" cy="46" r="6" fill="#3a80c8" />
          <rect x="46" y="38" width="16" height="14" fill="#5aa030" />
        </g>
      </PLayer>

      {/* ═══ ÉTAGÈRES avec JOUETS & bric-à-brac de Nathalie ═══
           Les antennes sont RANGÉES DANS le bric-à-brac : il faut
           les repérer. Reveal (👁) aide bien. */}
      <PLayer depth={3.2}>
        {/* étagère haute à gauche, sous le tableau, dessus : jouets */}
        <g>
          {/* planche */}
          <rect x="20" y="200" width="240" height="10" fill="#8a5828" stroke="#3a1e10" strokeWidth="1.5" />
          {/* supports muraux */}
          <path d="M28 200 L28 190 L48 200 Z" fill="#5a3818" />
          <path d="M232 200 L232 190 L252 200 Z" fill="#5a3818" />

          {/* poupée en robe rose */}
          {!made.includes("poupee") && (
            <g transform="translate(50,180)">
              <circle cx="0" cy="-4" r="6" fill="#f4d8b8" />
              <path d="M-4 -6 Q0 -12 4 -6" stroke="#a83020" strokeWidth="1.4" fill="none" />
              <path d="M-6 0 L-8 12 L8 12 L6 0 Z" fill="#e880a0" />
              <rect x="-5" y="10" width="3" height="8" fill="#f4d8b8" />
              <rect x="2" y="10" width="3" height="8" fill="#f4d8b8" />
            </g>
          )}

          {/* ours en peluche marron */}
          {!made.includes("ours") && (
            <g transform="translate(90,178)">
              <circle cx="0" cy="0" r="8" fill="#8a5828" />
              <circle cx="-5" cy="-5" r="3" fill="#8a5828" />
              <circle cx="5" cy="-5" r="3" fill="#8a5828" />
              <circle cx="-2" cy="-1" r="1" fill="#0a0806" />
              <circle cx="2" cy="-1" r="1" fill="#0a0806" />
              <path d="M-4 12 L-8 20 L-2 20 L-2 12 M4 12 L8 20 L2 20 L2 12" fill="#8a5828" />
              <rect x="-6" y="8" width="12" height="8" fill="#8a5828" />
            </g>
          )}

          {/* cubes empilés */}
          {!made.includes("cubes") && (
            <g transform="translate(130,182)">
              <rect x="-6" y="0" width="12" height="12" fill="#e83820" stroke="#0a0806" strokeWidth="0.5" />
              <text x="0" y="9" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">A</text>
              <rect x="-3" y="-12" width="12" height="12" fill="#3a80c8" stroke="#0a0806" strokeWidth="0.5" />
              <text x="3" y="-3" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">B</text>
            </g>
          )}

          {/* balle rayée */}
          {!made.includes("balle") && (
            <g>
              <circle cx="160" cy="188" r="8" fill="#f8b800" stroke="#0a0806" strokeWidth="0.6" />
              <path d="M152 188 h16 M154 184 h12 M154 192 h12" stroke="#e83820" strokeWidth="1.4" />
            </g>
          )}

          {/* petit livre */}
          {!made.includes("livre_enfant") && (
            <g transform="translate(190,188)">
              <rect x="-8" y="-6" width="16" height="12" fill="#5aa030" stroke="#0a0806" strokeWidth="0.6" />
              <path d="M-6 -3 h12 M-6 0 h10 M-6 3 h12" stroke="#3a6a20" strokeWidth="0.4" />
            </g>
          )}

          {/* toupie */}
          {!made.includes("toupie") && (
            <g transform="translate(220,188)">
              <path d="M-6 0 L6 0 L0 8 Z" fill="#c8a8e0" stroke="#5a3818" strokeWidth="0.6" />
              <rect x="-0.5" y="-6" width="1" height="6" fill="#5a3818" />
            </g>
          )}

          {/* ★ L'ANTENNE RÂTEAU ★ posée sur l'étagère parmi les jouets */}
          {!rateauPose && (
            <g transform="translate(255,188)">
              <path d="M-24 -12 h48" stroke="#8a8a8a" strokeWidth="2.4" />
              {[-18, -12, -6, 0, 6, 12, 18].map((x, i) => (
                <path key={i} d={`M${x} -12 L${x} -26`} stroke="#8a8a8a" strokeWidth="1.4" />
              ))}
              <path d="M0 -12 L0 4" stroke="#5a5a5a" strokeWidth="1.6" />
              <ellipse cx="0" cy="6" rx="8" ry="2" fill="#5a5a5a" />
            </g>
          )}
        </g>

        {/* étagère basse à droite, au-dessus du canapé, dessus : bric-à-brac + oreilles de lapin */}
        <g>
          <rect x="740" y="320" width="240" height="10" fill="#8a5828" stroke="#3a1e10" strokeWidth="1.5" />
          <path d="M748 320 L748 310 L768 320 Z" fill="#5a3818" />
          <path d="M952 320 L952 310 L972 320 Z" fill="#5a3818" />

          {/* pot en céramique */}
          {!made.includes("pot_ceramique") && (
            <g transform="translate(770,304)">
              <path d="M-8 0 Q-10 12 -6 16 L6 16 Q10 12 8 0 Z" fill="#c8a8e0" stroke="#3a1e10" strokeWidth="0.8" />
              <path d="M-8 4 h16" stroke="#8a5828" strokeWidth="0.6" />
            </g>
          )}

          {/* radio-réveil vintage */}
          {!made.includes("reveil_vintage") && (
            <g transform="translate(810,306)">
              <rect x="-12" y="0" width="24" height="14" fill="#c8963e" stroke="#3a1e10" strokeWidth="0.8" />
              <rect x="-9" y="3" width="18" height="4" fill="#0a0806" />
              <text x="0" y="7" textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fill="#e83820">3:56</text>
            </g>
          )}

          {/* photo encadrée */}
          {!made.includes("photo_encadree") && (
            <g transform="translate(858,308)">
              <rect x="-8" y="-6" width="16" height="14" fill="#e8d8b0" stroke="#5a3818" strokeWidth="0.8" />
              <path d="M-6 -4 h12 v10 h-12 z" fill="#5a7a90" />
              <circle cx="-3" cy="-1" r="1" fill="#f0d0b0" />
              <circle cx="3" cy="-1" r="1" fill="#f0d0b0" />
            </g>
          )}

          {/* ★ ORREILLES DE LAPIN ★ posées à droite parmi le bric-à-brac
              — disparaissent dès qu'elles sont posées sur la TV. */}
          {!lapinPose && !capte && (
            <g transform="translate(910,306)">
              <path d="M0 14 L-18 -18" stroke="#c8963e" strokeWidth="2.2" />
              <path d="M0 14 L18 -18" stroke="#c8963e" strokeWidth="2.2" />
              <circle cx="0" cy="14" r="5" fill="#5a3818" />
            </g>
          )}

          {/* petit vase à droite */}
          {!made.includes("vase_fleurs") && (
            <g transform="translate(960,308)">
              <path d="M-6 -2 Q-8 10 -4 14 L4 14 Q8 10 6 -2 Z" fill="#5aa030" stroke="#3a2818" strokeWidth="0.6" />
              <path d="M-3 -3 q4 -6 6 0" stroke="#a83020" strokeWidth="0.8" fill="none" />
              <circle cx="0" cy="-6" r="2" fill="#e83820" />
            </g>
          )}
        </g>
      </PLayer>

      {/* ═══ MEUBLE TV + télévision ═══ */}
      <PLayer depth={3}>
        {/* meuble bois clair années 60 */}
        <rect x="380" y="280" width="240" height="180" fill="url(#s69-tv)" stroke="#1a0e04" strokeWidth="3" />
        <rect x="380" y="280" width="240" height="20" fill="#a06848" />
        {/* pieds pointus caractéristiques */}
        <path d="M380 460 L370 500 L385 500 Z" fill="#3a1e10" />
        <path d="M620 460 L610 500 L625 500 Z" fill="#3a1e10" />
        {/* ÉCRAN cathodique arrondi */}
        <rect x="410" y="308" width="180" height="120" rx="18" fill="#3a3830" stroke="#1a1006" strokeWidth="3" />
        {/* contenu de l'écran : neige puis image nette */}
        {!capte ? (
          <g clipPath="inset(0)">
            <rect x="410" y="308" width="180" height="120" rx="18" fill="#8a8a8a" opacity="0.6" />
            {/* NEIGE de TV mal captee : chaque grain clignote a un tempo
                different pour un vrai effet fourmillant. */}
            {[...Array(60)].map((_, i) => (
              <circle key={i}
                cx={410 + (i * 37) % 180}
                cy={308 + (i * 23) % 120}
                r={1 + (i % 3) * 0.5}
                fill={i % 2 ? "#ffffff" : "#1a1a1a"}>
                <animate attributeName="opacity"
                  values={i % 3 === 0 ? "0.1;0.9;0.2;0.7;0.1" : "0.7;0.15;0.85;0.2;0.7"}
                  dur={`${0.1 + (i % 5) * 0.05}s`}
                  begin={`${(i % 7) * 0.03}s`}
                  repeatCount="indefinite" />
              </circle>
            ))}
            {/* bandes de retour de balayage horizontal */}
            <rect x="410" y="308" width="180" height="6" fill="#ffffff" opacity="0.15">
              <animate attributeName="y" values="308;428;308" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.05;0.35;0.05" dur="1.6s" repeatCount="indefinite" />
            </rect>
            {/* écran clair progressivement quand rateau posé */}
            {rateauPose && (
              <g opacity="0.7">
                <path d="M500 380 L494 402 L506 402 Z" fill="#e8e8e8" />
                <rect x="490" y="402" width="20" height="10" fill="#a8a8a8" />
              </g>
            )}
          </g>
        ) : (
          <g>
            {/* image nette : Armstrong sur l'échelle du LM (silhouette) */}
            <rect x="410" y="308" width="180" height="120" rx="18" fill="#1a1a1a" />
            {/* le sol lunaire */}
            <rect x="410" y="400" width="180" height="28" fill="#4a4a4a" />
            {/* le LM à droite */}
            <g transform="translate(560,388)">
              <path d="M-24 12 L-16 -8 L16 -8 L24 12 Z" fill="#8a8a8a" />
              {/* pieds */}
              <path d="M-20 12 L-28 24 M20 12 L28 24" stroke="#6a6a6a" strokeWidth="2" />
              {/* échelle */}
              <path d="M-14 -8 L-14 20 M-10 -4 L-10 20 M-14 -4 h4 M-14 4 h4 M-14 12 h4" stroke="#8a8a8a" strokeWidth="1.4" />
            </g>
            {/* Armstrong descend l'échelle : silhouette */}
            <g transform="translate(548,398)">
              <circle r="4" fill="#c8c8c8" />
              <rect x="-3" y="3" width="6" height="10" fill="#c8c8c8" />
              <path d="M-3 13 L-6 20 M3 13 L6 20" stroke="#c8c8c8" strokeWidth="2" />
            </g>
            {/* halo image lunaire */}
            <circle cx="500" cy="370" r="80" fill="url(#s69-glow)" opacity="0.3" />
            {/* petit texte incrusté */}
            <rect x="410" y="418" width="180" height="10" fill="#0a0a0a" />
            <text x="500" y="426" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#e8d8b0">LIVE FROM THE MOON · 21 JUL 1969</text>
          </g>
        )}
        {/* boutons rotatifs */}
        <circle cx="605" cy="332" r="7" fill="#c8963e" stroke="#5a3818" strokeWidth="1.5" />
        <circle cx="605" cy="360" r="7" fill="#c8963e" stroke="#5a3818" strokeWidth="1.5" />
        <circle cx="605" cy="388" r="7" fill="#c8963e" stroke="#5a3818" strokeWidth="1.5" />
        <path d="M605 328 L605 336" stroke="#5a3818" strokeWidth="1.5" />

        {/* Antenne râteau posée sur la TV (dès son propre flag OU la Lune captée) */}
        {(rateauPose || capte) && (
          <g transform="translate(500,280)">
            <path d="M-40 -30 h80" stroke="#8a8a8a" strokeWidth="3" />
            {[-32, -20, -8, 0, 8, 20, 32].map((x, i) => (
              <path key={i} d={`M${x} -30 L${x} -50`} stroke="#8a8a8a" strokeWidth="1.6" />
            ))}
            <path d="M0 -30 L0 0" stroke="#5a5a5a" strokeWidth="2" />
          </g>
        )}
        {/* Oreilles de lapin posées sur la TV (dès leur propre flag OU la Lune captée) */}
        {(lapinPose || capte) && (
          <g transform="translate(500,290)">
            <path d="M0 -10 L-24 -60" stroke="#c8963e" strokeWidth="2.5" />
            <path d="M0 -10 L24 -60" stroke="#c8963e" strokeWidth="2.5" />
          </g>
        )}
      </PLayer>

      {/* ═══ meubles + décor du salon ═══ */}
      <PLayer depth={2}>
        {/* moquette orange */}
        <rect y="440" width="1000" height="120" fill="url(#s69-floor)" />
        <rect y="440" width="1000" height="4" fill="#5a2010" opacity="0.6" />

        {/* CANAPÉ skaï marron à droite */}
        <g>
          <rect x="740" y="380" width="240" height="90" fill="url(#s69-couch)" stroke="#1a0e04" strokeWidth="2" />
          <rect x="720" y="380" width="30" height="90" fill="#3a2010" />
          <rect x="740" y="380" width="240" height="20" fill="#5a3820" />
          {/* coussins */}
          <rect x="750" y="386" width="70" height="14" rx="4" fill="#6a4028" />
          <rect x="830" y="386" width="70" height="14" rx="4" fill="#6a4028" />
        </g>

        {/* TABLE BASSE devant */}
        <g transform="translate(500,490)">
          <ellipse cx="0" cy="8" rx="80" ry="10" fill="#1a1006" opacity="0.5" />
          <ellipse cx="0" cy="0" rx="80" ry="10" fill="#c8963e" stroke="#5a3818" strokeWidth="1.5" />
          <path d="M-40 0 L-40 30 M40 0 L40 30" stroke="#5a3818" strokeWidth="2" />
        </g>

        {/* LAVA LAMP orange derriere la plante : halo doux, corps
            transparent, bulles qui montent/descendent lentement. */}
        <g>
          {/* halo orange qui baigne le coin */}
          <ellipse cx="140" cy="380" rx="120" ry="90" fill="url(#s69-lava)">
            <animate attributeName="rx" values="115;128;115" dur="6s" repeatCount="indefinite" />
            <animate attributeName="ry" values="85;95;85"    dur="6s" repeatCount="indefinite" />
          </ellipse>
          <g transform="translate(140,380)">
            {/* socle */}
            <path d="M-18 80 L18 80 L14 92 L-14 92 Z" fill="#3a1e10" stroke="#0a0604" strokeWidth="1" />
            <rect x="-22" y="76" width="44" height="6" fill="#5a3018" stroke="#1a0e04" strokeWidth="0.8" />
            {/* corps en verre (cône eleve) */}
            <path d="M-14 76 Q-16 40 -8 -20 Q-4 -50 0 -60 Q4 -50 8 -20 Q16 40 14 76 Z" fill="#3a1808" opacity="0.35" stroke="#2a1004" strokeWidth="1" />
            {/* fluide orange qui remplit la base */}
            <path d="M-13 74 Q-16 40 -7 -18 Q-4 -46 0 -56 Q4 -46 7 -18 Q16 40 13 74 Z" fill="url(#s69-lava-fluid)" opacity="0.85" />
            {/* reflet blanc */}
            <path d="M-8 60 Q-10 20 -4 -30" stroke="#ffd9a8" strokeWidth="1.2" fill="none" opacity="0.55" />
            {/* BULLES qui montent/descendent en cycle */}
            <ellipse cx="-4" cy="0" rx="7" ry="8" fill="#ffcf78">
              <animate attributeName="cy"    values="60;-30;60"        dur="9s"  repeatCount="indefinite" />
              <animate attributeName="rx"    values="7;9;6;8;7"        dur="9s"  repeatCount="indefinite" />
              <animate attributeName="ry"    values="8;7;10;8;8"       dur="9s"  repeatCount="indefinite" />
              <animate attributeName="cx"    values="-4;2;-3;1;-4"     dur="9s"  repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.85;1;0.7" dur="9s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="3" cy="40" rx="5" ry="6" fill="#ffb060">
              <animate attributeName="cy"    values="60;-20;-40;60"    dur="11s" repeatCount="indefinite" />
              <animate attributeName="rx"    values="5;7;6;5"          dur="11s" repeatCount="indefinite" />
              <animate attributeName="ry"    values="6;5;7;6"          dur="11s" repeatCount="indefinite" />
              <animate attributeName="cx"    values="3;-2;4;-1;3"      dur="11s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="70" rx="10" ry="6" fill="#e04a10">
              <animate attributeName="cy" values="70;40;70;60;70" dur="13s" repeatCount="indefinite" />
              <animate attributeName="rx" values="10;8;11;9;10"    dur="13s" repeatCount="indefinite" />
            </ellipse>
            {/* petites bulles decoratives */}
            <ellipse cx="-5" cy="30" rx="2.4" ry="3" fill="#ffd9a8" opacity="0.7">
              <animate attributeName="cy" values="60;-10;60" dur="7s" repeatCount="indefinite" />
            </ellipse>
            {/* chapeau conique */}
            <path d="M-10 -56 L10 -56 L6 -66 L-6 -66 Z" fill="#3a1e10" stroke="#0a0604" strokeWidth="1" />
            <rect x="-6" y="-70" width="12" height="4" fill="#5a3018" />
          </g>
        </g>

        {/* PLANTE en pot à gauche */}
        <g transform="translate(80,420)">
          <path d="M-16 40 L-20 60 L20 60 L16 40 Z" fill="#8a5828" />
          <path d="M0 40 Q-10 20 -20 24 M0 40 Q10 20 20 24 M0 40 Q-6 10 -14 8 M0 40 Q6 10 14 8 M0 40 Q0 5 -4 -12" stroke="#4a7a30" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-10 -4 Q-16 -10 -12 -18" fill="#5a9040" stroke="#3a6a20" strokeWidth="1" />
          <path d="M8 -8 Q14 -14 10 -22" fill="#5a9040" stroke="#3a6a20" strokeWidth="1" />
        </g>
      </PLayer>

      {/* ═══ AVANT-PLAN : NATHALIE en chemise de nuit assise en tailleur devant la TV ═══ */}
      <PLayer depth={1}>
        <g transform="translate(340,450)">
          {/* corps assis en tailleur */}
          <path d="M-20 60 Q-18 20 0 14 Q18 20 20 60 Z" fill="#d89aa8" />
          {/* jambes croisées */}
          <ellipse cx="0" cy="70" rx="30" ry="12" fill="#d89aa8" />
          {/* col */}
          <path d="M-8 22 L0 32 L8 22 Z" fill="#efc8d0" />
          {/* tête */}
          <ellipse cx="0" cy="0" rx="14" ry="16" fill="#f4d8b8" />
          {/* cheveux carré + frange */}
          <path d="M-12 -8 Q-6 -18 0 -18 Q12 -18 12 -8 Q10 -14 0 -14 Q-10 -14 -12 -8 Z" fill="#5a3018" />
          <path d="M-10 -4 Q0 0 10 -4" stroke="#4a2612" strokeWidth="3" fill="none" />
          {/* barrette */}
          <path d="M8 -6 L14 -8 L14 -5 L8 -3 Z" fill="#e8506a" />
          {/* yeux ronds ouverts */}
          <circle cx="-4" cy="-1" r="1.6" fill="#5a3818" />
          <circle cx="4" cy="-1" r="1.6" fill="#5a3818" />
          {/* bouche béate */}
          <path d="M-3 8 Q0 12 3 8" stroke="#c04858" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>

        {/* « ? » de quête au-dessus de Nathalie */}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={340} cy={460} r={54} label="Nathalie" reveal={reveal} onClick={() => action("nathalie")} />

      {/* Les VRAIS objets utiles — chacune disparaît une fois posée. */}
      {!rateauPose && !capte && (
        <Hotspot cx={255} cy={178} r={22} label="antenne râteau (sur l'étagère à jouets)" item="antenne_rateau" reveal={reveal} onClick={() => collect("antenne_rateau")} />
      )}
      {!lapinPose && !capte && (
        <Hotspot cx={910} cy={300} r={22} label="oreilles de lapin (bric-à-brac)" item="antenne_lapin" reveal={reveal} onClick={() => collect("antenne_lapin")} />
      )}

      {/* Les FAUSSES pistes — jouets et bric-à-brac (disparaissent au tableau suivant) */}
      {!made.includes("poupee") && (
        <Hotspot cx={50} cy={180} r={14} label="poupée" item="poupee" reveal={reveal} onClick={() => collect("poupee")} />
      )}
      {!made.includes("ours") && (
        <Hotspot cx={90} cy={180} r={14} label="ours en peluche" item="ours" reveal={reveal} onClick={() => collect("ours")} />
      )}
      {!made.includes("cubes") && (
        <Hotspot cx={130} cy={180} r={14} label="cubes A/B" item="cubes" reveal={reveal} onClick={() => collect("cubes")} />
      )}
      {!made.includes("balle") && (
        <Hotspot cx={160} cy={188} r={12} label="balle rayée" item="balle" reveal={reveal} onClick={() => collect("balle")} />
      )}
      {!made.includes("livre_enfant") && (
        <Hotspot cx={190} cy={188} r={14} label="petit livre vert" item="livre_enfant" reveal={reveal} onClick={() => collect("livre_enfant")} />
      )}
      {!made.includes("toupie") && (
        <Hotspot cx={220} cy={188} r={12} label="toupie" item="toupie" reveal={reveal} onClick={() => collect("toupie")} />
      )}
      {!made.includes("pot_ceramique") && (
        <Hotspot cx={770} cy={310} r={14} label="pot en céramique" item="pot_ceramique" reveal={reveal} onClick={() => collect("pot_ceramique")} />
      )}
      {!made.includes("reveil_vintage") && (
        <Hotspot cx={810} cy={310} r={16} label="radio-réveil" item="reveil_vintage" reveal={reveal} onClick={() => collect("reveil_vintage")} />
      )}
      {!made.includes("photo_encadree") && (
        <Hotspot cx={858} cy={308} r={14} label="photo de famille" item="photo_encadree" reveal={reveal} onClick={() => collect("photo_encadree")} />
      )}
      {!made.includes("vase_fleurs") && (
        <Hotspot cx={960} cy={310} r={14} label="petit vase" item="vase_fleurs" reveal={reveal} onClick={() => collect("vase_fleurs")} />
      )}
      {/* la TV = support de dépôt — étiquette adaptative selon ce qui reste à poser */}
      <Hotspot cx={500} cy={370} r={100} label={
        capte ? "TV — Armstrong sur la Lune" :
        (rateauPose && !lapinPose) ? "TV — pose les oreilles de lapin dessus" :
        (lapinPose && !rateauPose) ? "TV — pose l'antenne râteau dessus" :
        "TV — pose une antenne dessus"
      } item="television" reveal={reveal} onClick={() => action("nathalie")} />
    </svg>
  );
}
