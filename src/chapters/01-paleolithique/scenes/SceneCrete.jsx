import { useState } from "react";
import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Grass, Haze, Ridge, Rock, Speckle, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 1 — Tableau : LE POINT DE VUE (crête)
   ------------------------------------------------------------
   Une crête rocheuse en surplomb. Panorama vaste : la plaine
   avec un troupeau au loin, la rivière qui serpente, un aigle
   qui passe. Lieu d'observation calme, sans action complexe.
   ============================================================ */

export default function SceneCrete({ collect, action, reveal, made = [], inv = [], flags = {} }) {
  /* TARDIS caché dans la plaine — clin d'œil à Dr Who. Une fois cliqué,
     un drapeau global "tardis_gone" est posé (via l'action `tardis` qui
     a `grant: "tardis_gone"`) : le TARDIS ne reviendra jamais, même
     si le joueur quitte et revient sur ce tableau. */
  const alreadyGone = flags.tardis_gone || made.includes("tardis_gone");
  const [phase, setPhase] = useState(alreadyGone ? "gone" : "here"); // here | leaving | gone
  const dematerialize = () => {
    if (phase !== "here") return;
    setPhase("leaving");
    /* mémorise le clic côté App (drapeau global + made) */
    action("tardis");
    setTimeout(() => setPhase("gone"), 1600);
  };
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c90bc" /><stop offset="40%" stopColor="#b8c8d4" /><stop offset="75%" stopColor="#f0dcb0" /><stop offset="100%" stopColor="#f0c88a" /></linearGradient>
        <linearGradient id="cr-plaine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8a878" /><stop offset="40%" stopColor="#a08a50" /><stop offset="100%" stopColor="#6a5430" /></linearGradient>
        <linearGradient id="cr-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a7868" /><stop offset="60%" stopColor="#5a4838" /><stop offset="100%" stopColor="#2a1a10" /></linearGradient>
        <radialGradient id="cr-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff4c8" stopOpacity="1" /><stop offset="40%" stopColor="#f8e098" stopOpacity="0.9" /><stop offset="100%" stopColor="#f8c058" stopOpacity="0" /></radialGradient>
        <filter id="cr-grain"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="9" /><feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.3 0" /></filter>
      </defs>

      <PLayer depth={5}>
        {/* ciel dégradé matin, plus riche */}
        <rect x="-40" y="-20" width="1080" height="420" fill="url(#cr-sky)" />
        {/* halo solaire */}
        <circle cx="720" cy="140" r="120" fill="url(#cr-sun)" />
        {/* rayons de soleil */}
        <g opacity="0.35" transform="translate(720,140)">
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i} x1={Math.cos(rad) * 50} y1={Math.sin(rad) * 50} x2={Math.cos(rad) * 90} y2={Math.sin(rad) * 90} stroke="#fff4c8" strokeWidth="1.5" strokeLinecap="round" />;
          })}
        </g>
        {/* soleil */}
        <circle cx="720" cy="140" r="42" fill="#f8f0d0" opacity="0.85" />
        <circle cx="720" cy="140" r="28" fill="#fff8d8" opacity="0.95" />
        {/* nuages allongés */}
        <Clouds id="cr-cl" seed={8} items={[[110, 92, 180], [330, 70, 210], [540, 112, 150], [900, 84, 170], [210, 140, 110]]} color="#fbf3e2" shadow="#d8c8b0" opacity="0.8" drift={16} />
        {/* Vol d'oiseaux en V au loin */}
        <g opacity="0.55" transform="translate(300,180)">
          {[[0, 0], [-14, 6], [14, 6], [-26, 12], [26, 12], [-38, 18], [38, 18]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q-3 -3 -6 0 M${x} ${y} q3 -3 6 0`} stroke="#2a1e10" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          ))}
        </g>
        {/* AIGLE qui PLANE — traverse le ciel horizontalement bien AU-DESSUS
            des montagnes (les crêtes montent à y=180). */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="200,100; 800,130; 200,100" dur="34s" repeatCount="indefinite" />
          <g>
            {/* ombre légère sous les ailes */}
            <path d="M0 4 Q-40 -4 -50 4 Q-40 8 -20 8 L20 8 Q40 8 50 4 Q40 -4 0 4 Z" fill="#0a0604" opacity="0.35" />
            {/* ailes déployées avec forme + rémiges */}
            <path d="M0 0 Q-40 -10 -54 0 Q-42 4 -20 4 L20 4 Q42 4 54 0 Q40 -10 0 0 Z" fill="#2a1e10" />
            {/* plumes primaires en éventail */}
            <path d="M-50 2 l-8 -2 M-46 4 l-6 -1 M-42 4 l-5 -1 M50 2 l8 -2 M46 4 l6 -1 M42 4 l5 -1" stroke="#1a1408" strokeWidth="1" strokeLinecap="round" />
            {/* corps + tête */}
            <ellipse cx="0" cy="1" rx="6" ry="3" fill="#1a1408" />
            <circle cx="0" cy="-3" r="2" fill="#3a2818" />
            <path d="M-1 -5 l-1 -1 M1 -5 l1 -1" stroke="#f0c848" strokeWidth="0.4" />
            {/* queue en éventail */}
            <path d="M-8 4 L-4 14 L0 4 L4 14 L8 4" fill="#2a1e10" />
          </g>
        </g>
      </PLayer>

      <PLayer depth={4}>
        {/* trois plans de montagnes : bleu glacé au loin, plus sombre devant */}
        <Ridge id="cr-r1" seed={31} y={262} amp={120} rough={0.6} fill="#8a9cbc" lit="#c0cce0" light={1} snow="#f4f4f0" snowLine={190} />
        <Haze id="cr-h1" y0={200} y1={290} color="#e8e0d0" opacity={0.5} />
        <Ridge id="cr-r2" seed={47} y={300} amp={84} rough={0.58} fill="#6c7c98" lit="#9aa6bc" light={1} snow="#e8ece8" snowLine={232} />
        <Haze id="cr-h2" y0={250} y1={330} color="#f0dcb0" opacity={0.45} />
        <Ridge id="cr-r3" seed={53} y={350} amp={60} rough={0.55} fill="#6a7458" lit="#8a9068" light={1} />
        <TreeLine seed={12} y={350} x0={-20} x1={1020} n={70} h={[10, 20]} kinds={["conifer"]} colors={["#3a4a34", "#46553a", "#34442e"]} light={1} jitter={10} />
        <Haze id="cr-h3" y0={320} y1={390} color="#f0d8a8" opacity={0.4} />
      </PLayer>

      <PLayer depth={3}>
        {/* la plaine en contrebas */}
        <path d="M-40 372 Q260 360 520 370 Q760 380 1040 366 L1040 480 L-40 480 Z" fill="url(#cr-plaine)" />
        <Speckle seed={21} x0={-20} x1={1020} y0={376} y1={480} n={420} colors={["#7a6a38", "#c8b880", "#5a6a30", "#8a7840"]} r={[0.5, 1.4]} opacity={0.55} />
        {/* bosquets et ombres de nuages qui passent sur la plaine */}
        <TreeLine seed={17} y={392} x0={560} x1={700} n={10} h={[12, 22]} kinds={["conifer", "leafy"]} colors={["#3a4a2a", "#4a5a30"]} light={1} jitter={6} />
        <TreeLine seed={19} y={404} x0={40} x1={150} n={7} h={[12, 22]} kinds={["conifer", "leafy"]} colors={["#3a4a2a", "#4a5a30"]} light={1} jitter={6} />
        <TreeLine seed={27} y={398} x0={860} x1={990} n={8} h={[12, 22]} kinds={["conifer", "leafy"]} colors={["#3a4a2a", "#4a5a30"]} light={1} jitter={6} />
        <ellipse cx="180" cy="392" rx="160" ry="10" fill="#4a3a20" opacity="0.18">
          <animateTransform attributeName="transform" type="translate" values="0 0; 260 0; 0 0" dur="80s" repeatCount="indefinite" />
        </ellipse>
        {/* texture grain sur la plaine */}
        <rect x="0" y="380" width="1000" height="100" filter="url(#cr-grain)" opacity="0.35" />
        {/* touches de végétation basse (buissons) sur la plaine */}
        {[[80, 470], [140, 465], [240, 472], [520, 470], [620, 465], [720, 472], [880, 468]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="0" rx="10" ry="3" fill="#4a5828" opacity="0.7" />
            <ellipse cx="-4" cy="-2" rx="5" ry="2.5" fill="#5a6a30" opacity="0.7" />
            <ellipse cx="4" cy="-2" rx="5" ry="2.5" fill="#5a6a30" opacity="0.7" />
          </g>
        ))}

        {/* TARDIS — petite cabine de police bleue posée dans la plaine,
             clin d'œil au Docteur. Clic → dématérialisation (fondu + pulsation),
             puis disparaît. */}
        {phase !== "gone" && (
          <g transform="translate(720,400) scale(0.55)"
             onClick={dematerialize}
             style={{ cursor: phase === "here" ? "pointer" : "default" }}>
            <title>Une petite cabine de police bleue…</title>
            <g style={{
              transformOrigin: "0px 25px",
              animation: phase === "leaving"
                ? "tardisFade 1.6s ease-out forwards"
                : "tardisPulse 2.2s ease-in-out infinite",
            }}>
              {/* halo au sol (lueur bleutée) */}
              <ellipse cx="0" cy="30" rx="18" ry="3" fill="#3a80c8" opacity="0.55" />
              {/* corps principal — 4 côtés de la boîte, bleu Doctor Who */}
              <rect x="-14" y="-30" width="28" height="60" fill="#1c3a68" stroke="#0a1a30" strokeWidth="0.6" />
              {/* montants d'angle plus foncés */}
              <rect x="-15" y="-30" width="2" height="60" fill="#0e2242" />
              <rect x="13"  y="-30" width="2" height="60" fill="#0e2242" />
              {/* panneaux vitrés (fenêtres blanches sur les portes) */}
              <rect x="-11" y="-24" width="9" height="8" fill="#e8f0ff" stroke="#0a1a30" strokeWidth="0.4" />
              <rect x="2"   y="-24" width="9" height="8" fill="#e8f0ff" stroke="#0a1a30" strokeWidth="0.4" />
              {/* barreaux des fenêtres */}
              <path d="M-11 -20 h9 M2 -20 h9 M-6.5 -24 v8 M6.5 -24 v8" stroke="#0a1a30" strokeWidth="0.4" />
              {/* enseigne "POLICE BOX" en haut */}
              <rect x="-14" y="-38" width="28" height="8" fill="#0a1a30" stroke="#000" strokeWidth="0.4" />
              <text x="0" y="-32" textAnchor="middle" fontSize="4" fill="#e8f0ff"
                fontFamily="ui-monospace,monospace" fontWeight="700" letterSpacing="0.5">
                POLICE BOX
              </text>
              {/* mini panneaux "Public Call" sur les portes */}
              <rect x="-11" y="-13" width="9" height="4" fill="#0a1a30" />
              <rect x="2"   y="-13" width="9" height="4" fill="#0a1a30" />
              {/* poignée + serrure */}
              <circle cx="-1" cy="0" r="0.9" fill="#c8b090" />
              <rect x="-0.8" y="6" width="1.6" height="2" fill="#0a1a30" />
              {/* toit à corniches */}
              <rect x="-16" y="-42" width="32" height="4" fill="#0e2242" />
              <rect x="-14" y="-46" width="28" height="4" fill="#1c3a68" />
              {/* lanterne au sommet — pulse blanche */}
              <rect x="-2" y="-52" width="4" height="6" fill="#0a1a30" />
              <ellipse cx="0" cy="-52" rx="3" ry="3" fill="#fff8e0" opacity="0.9">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="0" cy="-52" rx="6" ry="6" fill="#fff8e0" opacity="0.4">
                <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.6s" repeatCount="indefinite" />
              </ellipse>
              {/* mini couvre-lanterne pyramide */}
              <path d="M-3 -55 L3 -55 L0 -58 Z" fill="#0e2242" />
            </g>
          </g>
        )}
        {phase === "leaving" && (
          <style>{`
            @keyframes tardisFade {
              0%   { opacity: 1; transform: scale(0.55); filter: none; }
              30%  { opacity: 1; transform: scale(0.60); filter: brightness(1.4) blur(0.5px); }
              60%  { opacity: 0.6; transform: scale(0.45); filter: brightness(1.6) blur(1px); }
              100% { opacity: 0; transform: scale(0.30); filter: brightness(2) blur(2px); }
            }
          `}</style>
        )}
        <style>{`
          @keyframes tardisPulse {
            0%,100% { transform: scale(1); }
            50%     { transform: scale(1.03); }
          }
        `}</style>
        {/* rivière qui serpente — plus détaillée */}
        <path d="M0 430 Q200 410 400 430 Q600 450 800 425 Q900 415 1000 425 L1000 445 Q900 435 800 445 Q600 470 400 450 Q200 430 0 450 Z" fill="#6a95b0" opacity="0.9" />
        <path d="M0 434 Q200 416 400 436 Q600 456 800 431 Q900 421 1000 430" stroke="#f8f0d8" strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M0 450 Q200 430 400 450 Q600 470 800 445 Q900 435 1000 445" stroke="#5a7a50" strokeWidth="3" fill="none" opacity="0.6" />
        {/* reflets sur la rivière */}
        <path d="M100 428 q60 -4 120 0 M400 442 q80 6 160 0 M700 432 q60 -2 120 0" stroke="#c8dce8" strokeWidth="0.8" fill="none" opacity="0.65" />
        {/* berges sombres */}
        <path d="M0 430 Q200 410 400 430 Q600 450 800 425 Q900 415 1000 425" stroke="#3a4858" strokeWidth="0.6" fill="none" opacity="0.7" />
        {/* TROUPEAU au loin — bisons esquissés avec bosse */}
        {[[280, 445, 1], [310, 448, 0.9], [335, 442, 1.1], [360, 448, 0.85], [388, 445, 1], [412, 450, 0.9], [440, 442, 1.1], [468, 448, 0.85], [268, 452, 0.75]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            {/* ombre au sol */}
            <ellipse cx="0" cy="4" rx="9" ry="1.5" fill="#0a0604" opacity="0.5" />
            {/* corps */}
            <ellipse cx="0" cy="0" rx="9" ry="4.5" fill="#3a2818" />
            {/* bosse caractéristique du bison */}
            <ellipse cx="-4" cy="-3" rx="5" ry="3" fill="#4a3020" />
            {/* tête */}
            <ellipse cx="-8" cy="-1" rx="3.5" ry="2.5" fill="#2a1a10" />
            {/* pattes */}
            <path d="M-6 4 v3 M-2 4 v3 M4 4 v3 M6 4 v3" stroke="#2a1a10" strokeWidth="1" />
          </g>
        ))}
      </PLayer>

      <PLayer depth={2}>
        {/* premier plan : la crête rocheuse où on est */}
        <path d="M0 480 L120 470 L220 490 L340 475 L460 495 L580 480 L700 490 L820 478 L1000 490 L1000 560 L0 560 Z" fill="url(#cr-rock)" />
        {/* strates de la roche */}
        <path d="M0 500 q200 4 400 -2 q200 -4 400 2 q100 3 200 -2" stroke="#3a2818" strokeWidth="0.8" fill="none" opacity="0.55" />
        <path d="M0 522 q200 -6 400 0 q200 6 400 -2 q100 -3 200 2" stroke="#4a3828" strokeWidth="0.6" fill="none" opacity="0.55" />
        {/* affleurements rocheux */}
        <Rock x={270} y={538} w={190} h={46} color="#6a5a4a" light={1} seed={13} moss="#5a6a30" />
        <Rock x={730} y={540} w={220} h={50} color="#6e5e4e" light={1} seed={17} moss="#5a6a30" />
        <Rock x={60} y={520} w={110} h={40} color="#7a6a5a" light={1} seed={2} moss="#5a6a30" />
        <Rock x={960} y={526} w={130} h={48} color="#6e5e50" light={1} seed={5} moss="#5a6a30" />
        <Rock x={520} y={540} w={80} h={22} color="#7a6a5a" light={1} seed={9} />
        <Speckle seed={6} x0={0} x1={1000} y0={490} y1={560} n={200} colors={["#2a1a10", "#9a8878", "#5a4838"]} opacity={0.5} />
        {[[330, 496, 1], [610, 492, 2], [900, 498, 3], [40, 492, 4]].map(([x, y, sd]) => <Grass key={sd} x={x} y={y} seed={sd} color="#7a7a3a" s={0.8} />)}
        {/* mousses / lichens variés (orange + vert) */}
        {[[100, 495], [400, 485], [560, 500], [880, 495]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q6 -4 12 0 q-6 4 -12 0 Z`} fill="#5a6a30" opacity="0.75" />
        ))}
        {[[160, 512], [420, 502], [540, 518], [740, 502], [820, 522]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q4 -3 8 0 q-4 3 -8 0 Z`} fill="#c88030" opacity="0.55" />
        ))}
        {/* petites herbes sauvages penchées par le vent (à droite = vent d'ouest) */}
        {[[80, 480], [280, 480], [400, 485], [480, 490], [600, 480], [700, 486], [880, 484], [950, 488]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <path d="M0 0 q3 -12 -2 -18 M4 0 q6 -14 0 -20 M-4 0 q3 -10 -3 -14" stroke="#5a6828" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.85" />
          </g>
        ))}
        {/* petits cailloux éparpillés */}
        {[[60, 545], [420, 550], [560, 548], [880, 546], [940, 552]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="4" ry="1.5" fill="#5a4838" stroke="#1a0e08" strokeWidth="0.3" />
        ))}
      </PLayer>

      <PLayer depth={1}>
        {/* petit CAIRN de pierres empilées à gauche (repère de chasseurs) — mieux modelé */}
        <g transform="translate(240,470)">
          <ellipse cx="0" cy="18" rx="30" ry="4" fill="#0a0604" opacity="0.6" />
          <ellipse cx="0" cy="10" rx="22" ry="9" fill="url(#cr-rock)" stroke="#1a1408" strokeWidth="1" />
          <ellipse cx="-8" cy="7" rx="10" ry="4" fill="#8a7868" opacity="0.55" />
          <ellipse cx="-2" cy="-2" rx="15" ry="7" fill="url(#cr-rock)" stroke="#1a1408" strokeWidth="1" />
          <ellipse cx="-6" cy="-5" rx="7" ry="3" fill="#8a7868" opacity="0.55" />
          <ellipse cx="1" cy="-13" rx="10" ry="5" fill="url(#cr-rock)" stroke="#1a1408" strokeWidth="1" />
          <ellipse cx="-2" cy="-15" rx="4" ry="2" fill="#8a7868" opacity="0.55" />
          <ellipse cx="0" cy="-21" rx="6" ry="3" fill="url(#cr-rock)" stroke="#1a1408" strokeWidth="1" />
          {/* petite plume de rite plantée sur le sommet */}
          <path d="M0 -24 q3 -8 -1 -14 q-3 6 1 14 Z" fill="#c88848" stroke="#5a2818" strokeWidth="0.4" />
          <path d="M0 -24 L0 -36" stroke="#3a2418" strokeWidth="0.6" />
        </g>

        {/* Personnage debout au bord (l'aîné qui observe) — plus détaillé */}
        <g transform="translate(800,480)">
          <ellipse cx="0" cy="44" rx="22" ry="4" fill="#0a0604" opacity="0.55" />
          <Figure x={0} y={44} s={0.66} skin="#c8946a" hair="#c0b8a8" look="long" beard="long" beardColor="#e0d8c8" wrinkles
            garment="coat" coat="#5a3818" pants="#3a2010" trim="#3a2010" arms={[{ a1: 8, a2: 4 }, { a1: 24, a2: -30 }]} />
          <path d="M22 -22 L28 44" stroke="#3a2418" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 -22 q-6 -2 -8 4 q-2 4 4 4 z" fill="#c85028" stroke="#5a1810" strokeWidth="0.4" />
        </g>
        {/* Objets ephemere : disparaissent une fois ramassés */}
        {!inv.includes("plume") && (
        <g transform="translate(440,506) rotate(20)">
          <path d="M0 -14 Q4 -10 4 0 Q4 8 -2 12 Q-4 8 -4 0 Q-4 -10 0 -14 Z" fill="#8a6a48" stroke="#3a2818" strokeWidth="0.5" />
          <path d="M0 -12 L0 10" stroke="#3a2818" strokeWidth="0.5" />
          {[-8, -4, 0, 4, 8].map((y, i) => (<path key={i} d={`M-2 ${y} l-2 ${-1 - (i%2)} M2 ${y} l2 ${-1 - (i%2)}`} stroke="#5a4028" strokeWidth="0.3" />))}
        </g>
        )}
        {!inv.includes("champignon") && (
        <g transform="translate(140,520)">
          <path d="M-8 0 Q-8 -10 0 -12 Q8 -10 8 0 Z" fill="#c8382e" stroke="#5a1810" strokeWidth="0.6" />
          <circle cx="-3" cy="-6" r="1.2" fill="#f0e4c8" />
          <circle cx="3" cy="-4" r="1" fill="#f0e4c8" />
          <circle cx="0" cy="-9" r="0.8" fill="#f0e4c8" />
          <rect x="-2" y="0" width="4" height="7" fill="#e8dfc8" stroke="#5a4028" strokeWidth="0.4" />
        </g>
        )}
        {!inv.includes("feuille_morte") && (
        <g transform="translate(700,536) rotate(45)">
          <path d="M0 0 q-10 -12 -16 -6 q-4 6 8 12 q12 4 8 -6 Z" fill="#c8632a" stroke="#5a2810" strokeWidth="0.8" />
          <path d="M-2 0 q-6 -6 -10 -4" stroke="#5a2810" strokeWidth="0.5" fill="none" />
        </g>
        )}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={800} cy={460} r={40} label="l'aîné qui observe" reveal={reveal} onClick={() => action("aine")} />
      <Hotspot cx={240} cy={470} r={30} label="petit cairn de pierres" reveal={reveal} onClick={() => action("cairn")} />
      <Hotspot cx={340} cy={447} r={40} label="troupeau au loin" reveal={reveal} onClick={() => action("troupeau_loin")} />
      <Hotspot cx={500} cy={205} r={30} label="un aigle qui plane" reveal={reveal} onClick={() => action("aigle")} />
      <Hotspot cx={440} cy={506} r={16} label="plume d'oiseau" item="plume" reveal={reveal} onClick={() => collect("plume")} />
      <Hotspot cx={140} cy={520} r={14} label="champignon" item="champignon" reveal={reveal} onClick={() => collect("champignon")} />
      <Hotspot cx={700} cy={536} r={14} label="feuille morte" item="feuille_morte" reveal={reveal} onClick={() => collect("feuille_morte")} />
    </svg>
  );
}
