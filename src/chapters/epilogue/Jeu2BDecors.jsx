import { Bust, Figure } from "./cineChars.jsx";
import { rng, Speckle } from "../../engine/scenery.jsx";
import { DomeHall } from "./FinJeu2Scenes.jsx";
import { LEVELS } from "../jeu3/levels.js";
import NightStreetDecor from "../../engine/NightStreetDecor.jsx";
import TimeMachine from "../../engine/TimeMachine.jsx";
import { Avatar } from "../../engine/Martine.jsx";

/* ============================================================
   JEU 2B — décors et portrait de Léa
   ------------------------------------------------------------
   Décors plein cadre (viewBox 1000×560, `slice`) :
     StageStation  : 2045, la grande salle de la station pendant une
                     panne ; sur l'écran de MARTINE, le plan du Puits
                     (les étages du Jeu 3, lus dans jeu3/levels.js)
     StageMaison   : la rue du joueur à 03 h 14 (décor de l'intro),
                     MARTINE posée sur la chaussée — fin « je rentre »
     StageChantier : galerie au-dessus du Puits, la veille du scellement
     StageAtelier  : l'atelier de Léa (fond discret, les deux documents
                     de l'activité s'affichent par-dessus)
     StageToast    : la salle commune, la longue table et les verres
   Décor étoffé avec le kit (scenery.jsx) : roche des voûtes, cuvelage,
   tuyaux, salle de contrôle, brume du Puits ; établi garni ; cuisine,
   bocaux, bacs de culture et fresque des enfants dans la salle commune.
   Le bandeau de dialogue occupe le bas de l'écran (≈ y > 410) :
   tout ce qui compte est dessiné plus haut.
   ============================================================ */

/* Paysage : le décor remplit l'écran (rogné). Portrait (téléphone) : décor entier, centré. */
const PAR = () => (typeof window !== "undefined" && window.innerHeight > window.innerWidth * 1.1 ? "xMidYMid meet" : "xMidYMid slice");
const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [(Math.cos(a) * r).toFixed(1), (Math.sin(a) * r).toFixed(1)];
};
/* secteur d'anneau entre deux rayons et deux angles */
const wedge = (a0, a1, r0, r1) => {
  const [x0, y0] = polar(r1, a0), [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1), [x3, y3] = polar(r0, a0);
  return `M${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z`;
};

/* ───────────────────────── 2045 · La proposition ─────────────────────────
   Chaque réplique a son image (`viz`, posé dans le script de Jeu2B.jsx) :
   l'écran de la station montre ce dont on parle, Mira (à gauche) et
   Elias (à droite) sont dans la salle, celui qui parle est éclairé.
   Quand MARTINE parle, son visage apparaît sur l'écran. */
const MONO_F = "ui-monospace,monospace";

function MartineFace({ x, y, size, mood = "neutre", talking = false }) {
  return <g transform={`translate(${x - size / 2},${y - size / 2})`}><Avatar size={size} mood={mood} talking={talking} /></g>;
}
function Cross({ x, y, r = 16, delay = 0 }) {
  return (
    <path d={`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`} stroke="#ff5a4a" strokeWidth="4" strokeLinecap="round" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.3s" begin={`${delay}s`} fill="freeze" />
    </path>
  );
}
const Title = ({ children, color = "#7fd8ff", y = 38 }) => (
  <text x="0" y={y} textAnchor="middle" fontFamily={MONO_F} fontSize="15" fontWeight="800" fill={color} letterSpacing="3">{children}</text>
);

/* le plan du Puits (étages du Jeu 3), réutilisé par plusieurs images */
function PlanPuits({ animate = true }) {
  const levels = LEVELS.filter((l) => !l.hidden);
  const appear = (i) => (animate ? { animation: `j2sIn 500ms ease-out ${0.3 + i * 0.35}s both` } : undefined);
  return (
    <g>
      <path d="M-210 92 H210" stroke="#a89078" strokeWidth="2" />
      <path d="M-60 92 Q0 50 60 92" fill="#1a2a3a" stroke="#7fd8ff" strokeWidth="1.6" />
      <path d="M-150 92 V270 M-138 92 V270" stroke="#7fd8ff" strokeWidth="1" opacity="0.7" />
      {/* l'air : ventilateur en haut du puits */}
      <g transform="translate(-144,82)">
        <circle r="9" fill="#08182a" stroke="#7fd8ff" strokeWidth="1.2" />
        <g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="2s" repeatCount="indefinite" />
          {[0, 120, 240].map((a) => <path key={a} d="M0 0 L7 -2 L7 2 Z" fill="#7fd8ff" transform={`rotate(${a})`} />)}
        </g>
      </g>
      {levels.map((l, i) => (
        <g key={l.id} style={appear(i)}>
          <rect x={-132 + i * 14} y={102 + i * 26} width={300 - i * 14} height="20" fill="#0e2236" stroke={l.color} strokeWidth="1.2" />
          <text x={-124 + i * 14} y={117 + i * 26} fontFamily={MONO_F} fontSize="11.5" fontWeight="800" fill={l.color} letterSpacing="1">{l.id.replace("-", "−")} · {l.name.toUpperCase()}</text>
          {l.id === "-2" && [0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${70 + k * 18} ${120 + i * 26} q-4 -8 0 -14 q4 6 0 14`} fill="#8aff70" opacity="0.9" />
          ))}
          {l.id === "-3" && [0, 1, 2].map((k) => (
            <g key={k}><rect x={86 + k * 16} y={105 + i * 26} width="11" height="14" fill="#1a0a08" stroke="#ff5030" strokeWidth="0.8" />
              <circle cx={91 + k * 16} cy={109 + i * 26} r="1.4" fill="#5eff9e"><animate attributeName="opacity" values="0.3;1;0.3" dur={`${0.8 + k * 0.3}s`} repeatCount="indefinite" /></circle></g>
          ))}
        </g>
      ))}
      <path d="M-210 276 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="#4aa8e8" strokeWidth="2.4" fill="none" opacity="0.85" />
      <text x="-206" y="266" fontFamily={MONO_F} fontSize="11" fontWeight="700" fill="#4aa8e8">nappe d'eau</text>
      <circle r="3" fill="#7fd8ff" cx="-144" cy="110"><animate attributeName="cy" values="100;262;100" dur="5s" repeatCount="indefinite" /></circle>
    </g>
  );
}

function ScreenViz({ viz, prenom }) {
  switch (viz) {
    case "panne":
      return (
        <g>
          <rect x="-228" y="12" width="456" height="280" fill="#020406" />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x="-228" y={20 + i * 19} width="456" height="2" fill="#c8d4e2" opacity="0.06">
              <animate attributeName="opacity" values="0.02;0.12;0.02" dur={`${0.3 + (i % 4) * 0.1}s`} repeatCount="indefinite" />
            </rect>
          ))}
          <text x="0" y="160" textAnchor="middle" fontFamily={MONO_F} fontSize="40" fontWeight="900" fill="#ff5a4a" letterSpacing="6">
            ⚠ PANNE<animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </text>
          <text x="0" y="196" textAnchor="middle" fontFamily={MONO_F} fontSize="12" fill="#8fa3bd" letterSpacing="3">RÉSEAU HORS SERVICE</text>
        </g>
      );
    case "reseaux": {
      const nodes = [[-160, 90], [-120, 120], [-110, 200], [-10, 80], [0, 150], [10, 200], [80, 80], [130, 100], [170, 120], [150, 205], [-60, 100], [60, 130]];
      return (
        <g>
          <Title>LES RÉSEAUX DU MONDE</Title>
          {["M-200 70 Q-150 50 -100 70 Q-80 100 -110 130 Q-130 150 -150 140 Q-190 120 -200 70 Z",
            "M-120 160 Q-95 160 -90 190 Q-95 240 -115 260 Q-130 230 -130 190 Z",
            "M-30 70 Q10 60 30 75 Q20 95 -10 95 Q-30 90 -30 70 Z",
            "M-20 105 Q20 100 35 130 Q30 190 0 220 Q-20 190 -30 140 Z",
            "M40 65 Q120 50 190 80 Q200 120 150 140 Q100 150 60 120 Q40 100 40 65 Z",
            "M130 190 Q170 180 190 200 Q180 225 150 225 Q125 215 130 190 Z"].map((d, i) => (
            <path key={i} d={d} fill="#14324a" stroke="#2a5a7a" strokeWidth="1" />
          ))}
          {nodes.slice(1).map(([x, y], i) => {
            const [px, py] = nodes[i];
            return (
              <line key={`l${i}`} x1={px} y1={py} x2={x} y2={y} stroke="#5eff9e" strokeWidth="1.4" opacity="0.7">
                <animate attributeName="stroke" values="#5eff9e;#3a2020" dur="0.3s" begin={`${0.5 + i * 0.35}s`} fill="freeze" />
              </line>
            );
          })}
          {nodes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#5eff9e" stroke="#06110b" strokeWidth="1">
              <animate attributeName="fill" values="#5eff9e;#ff5a4a" dur="0.3s" begin={`${0.4 + i * 0.35}s`} fill="freeze" />
            </circle>
          ))}
          <text x="0" y="282" textAnchor="middle" fontFamily={MONO_F} fontSize="12" fill="#ff8a7a" letterSpacing="2">3 PANNES CETTE SEMAINE</text>
        </g>
      );
    }
    case "gel":
      return (
        <g>
          <defs>
            <linearGradient id="j2s-gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9aa8b8" /><stop offset="100%" stopColor="#d8e0e8" /></linearGradient>
          </defs>
          <rect x="-228" y="12" width="456" height="130" fill="url(#j2s-gsky)" />
          <rect x="-228" y="142" width="456" height="150" fill="#e4ecf2" />
          {[-200, -120, -40, 40, 120, 200].map((x, i) => <path key={i} d={`M${x * 0.3} 142 L${x} 292`} stroke="#b8c8d4" strokeWidth="1.4" />)}
          {/* le blé gelé, couché et blanc */}
          {Array.from({ length: 34 }).map((_, i) => {
            const x = -210 + (i % 17) * 26 + (i > 16 ? 13 : 0), y = i > 16 ? 270 : 210;
            return (
              <g key={i}>
                <path d={`M${x} ${y} q4 -22 16 -28`} stroke="#a89878" strokeWidth="2" fill="none" />
                <ellipse cx={x + 17} cy={y - 29} rx="5" ry="2.6" fill="#f4f8fc" stroke="#c8d4dc" strokeWidth="0.6" transform={`rotate(-30 ${x + 17} ${y - 29})`} />
              </g>
            );
          })}
          {/* neige */}
          {Array.from({ length: 22 }).map((_, i) => (
            <circle key={i} cx={-220 + ((i * 47) % 440)} r="2" fill="#ffffff">
              <animate attributeName="cy" values={`${12 + (i % 5) * 10};292`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* thermomètre */}
          <g transform="translate(-188,40)">
            <rect x="-9" y="0" width="18" height="120" rx="9" fill="#ffffff" stroke="#5a6678" strokeWidth="1.5" />
            <circle cx="0" cy="128" r="14" fill="#3a80e8" stroke="#5a6678" strokeWidth="1.5" />
            <rect x="-4" y="94" width="8" height="34" fill="#3a80e8" />
            <text x="22" y="112" fontFamily={MONO_F} fontSize="15" fontWeight="900" fill="#1a3a6a">−6 °C</text>
          </g>
          {/* calendrier : on est en été */}
          <g transform="translate(150,24)">
            <rect width="64" height="58" rx="4" fill="#ffffff" stroke="#5a6678" />
            <rect width="64" height="17" rx="4" fill="#d23a3a" />
            <text x="32" y="13" textAnchor="middle" fontFamily={MONO_F} fontSize="10" fontWeight="800" fill="#fff">JUILLET</text>
            <text x="32" y="48" textAnchor="middle" fontFamily="Georgia,serif" fontSize="24" fontWeight="800" fill="#2a2418">14</text>
          </g>
          <g transform="translate(-214,26)"><circle r="4" fill="#d23a3a"><animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" /></circle>
            <text x="9" y="4" fontFamily={MONO_F} fontSize="9" fontWeight="800" fill="#2a2418">CAMÉRA · CHAMPS</text></g>
        </g>
      );
    case "calcul":
      return (
        <g>
          <Title>LE CALCUL DE MARTINE</Title>
          <path d="M-110 70 V200 H200" stroke="#5a6678" strokeWidth="1.5" fill="none" />
          <text x="-116" y="78" textAnchor="end" fontFamily={MONO_F} fontSize="10" fill="#8fa3bd">tout marche</text>
          <text x="-110" y="216" textAnchor="middle" fontFamily={MONO_F} fontSize="11" fontWeight="800" fill="#c8d4e2">2045</text>
          <text x="196" y="216" textAnchor="middle" fontFamily={MONO_F} fontSize="11" fontWeight="800" fill="#ff8a7a">2047</text>
          <path d="M-110 78 C-20 84 60 140 196 198" stroke="#ff5a4a" strokeWidth="4" fill="none" strokeDasharray="420" strokeDashoffset="420">
            <animate attributeName="stroke-dashoffset" values="420;0" dur="1.8s" begin="0.3s" fill="freeze" />
          </path>
          {/* courant, chauffage, messages */}
          <g transform="translate(-100,254)">
            <path d="M0 -18 a12 12 0 1 1 0.1 0 Z" fill="#ffd166" transform="translate(0,4)" />
            <rect x="-6" y="0" width="12" height="9" fill="#8a94a8" />
            <Cross x={0} y={-4} delay={1.8} />
          </g>
          <g transform="translate(0,254)">
            <path d="M0 10 C-14 4 -10 -10 -2 -20 C-2 -10 6 -8 6 -16 C14 -6 12 6 0 10 Z" fill="#ff8a3a" />
            <Cross x={0} y={-4} delay={2.2} />
          </g>
          <g transform="translate(100,254)">
            <rect x="-16" y="-14" width="32" height="22" fill="#e8eef5" stroke="#5a6678" />
            <path d="M-16 -14 L0 -2 L16 -14" stroke="#5a6678" fill="none" />
            <Cross x={0} y={-4} delay={2.6} />
          </g>
          {[["courant", -100], ["chauffage", 0], ["messages", 100]].map(([t, x]) => (
            <text key={t} x={x} y={287} textAnchor="middle" fontFamily={MONO_F} fontSize="12.5" fontWeight="700" fill="#c8d4e2">{t}</text>
          ))}
        </g>
      );
    case "memoire":
      return (
        <g>
          <Title>LA MÉMOIRE COMMUNE</Title>
          {[-150, -75, 0, 75, 150].map((x, s) => (
            <g key={x}>
              {Array.from({ length: 6 }).map((_, k) => (
                <g key={k} transform={`translate(${x},${200 - k * 18})`}>
                  <rect x="-28" y="-12" width="56" height="16" rx="2" fill="#f0e8d0" stroke="#8a7a50" />
                  <path d="M-20 -6 H20 M-20 -1 H10" stroke="#5a4a28" strokeWidth="1.2" />
                  {(s + k) % 4 === 0 && <animate attributeName="opacity" values="1;0.15;1" dur="2.4s" begin={`${(s + k) * 0.3}s`} repeatCount="indefinite" />}
                </g>
              ))}
            </g>
          ))}
          <text x="0" y="246" textAnchor="middle" fontFamily={MONO_F} fontSize="13" fill="#c8d4e2" letterSpacing="1">124 512 témoignages</text>
          <text x="0" y="278" textAnchor="middle" fontFamily={MONO_F} fontSize="14" fontWeight="800" fill="#ff8a7a" letterSpacing="2">⚠ SANS COURANT, TOUT S'EFFACE</text>
        </g>
      );
    case "mine":
      return (
        <g>
          <Title>UNE VIEILLE MINE, SOUS LA STATION</Title>
          <rect x="-228" y="92" width="456" height="200" fill="#2a1e14" />
          {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={-220 + ((i * 53) % 440)} cy={100 + ((i * 37) % 185)} r={1 + (i % 3)} fill="#4a3a2a" />)}
          <path d="M-210 92 H210" stroke="#a89078" strokeWidth="2" />
          <path d="M-60 92 Q0 50 60 92" fill="#1a2a3a" stroke="#7fd8ff" strokeWidth="1.6" />
          <text x="0" y="84" textAnchor="middle" fontFamily={MONO_F} fontSize="8" fill="#7fd8ff">station</text>
          <path d="M-40 92 V260 M-40 140 H120 M-40 190 H160 M-40 240 H90 M60 140 V190" stroke="#d8b878" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="600" strokeDashoffset="600" opacity="0.85">
            <animate attributeName="stroke-dashoffset" values="600;0" dur="2.4s" begin="0.2s" fill="freeze" />
          </path>
          <text x="170" y="276" textAnchor="middle" fontFamily={MONO_F} fontSize="14" fontWeight="900" fill="#ffd166" opacity="0">
            → LE PUITS<animate attributeName="opacity" values="0;1" dur="0.4s" begin="2.6s" fill="freeze" />
          </text>
        </g>
      );
    case "plan":
      return <g><Title>LE PUITS</Title><PlanPuits /></g>;
    case "places":
      return (
        <g>
          <Title>LES PLACES, COMPTÉES PAR MARTINE</Title>
          {Array.from({ length: 40 }).map((_, i) => {
            const c = i % 10, r = Math.floor(i / 10);
            const x = -180 + c * 40, y = 92 + r * 46;
            const inside = c < 8;
            return (
              <g key={i} opacity={inside ? 1 : 0.35}>
                <circle cx={x} cy={y} r="7" fill="#3a4658">
                  {inside && <animate attributeName="fill" values="#3a4658;#5eff9e" dur="0.2s" begin={`${0.2 + (r * 8 + c) * 0.06}s`} fill="freeze" />}
                </circle>
                <path d={`M${x - 10} ${y + 24} Q${x} ${y + 6} ${x + 10} ${y + 24} Z`} fill="#3a4658">
                  {inside && <animate attributeName="fill" values="#3a4658;#5eff9e" dur="0.2s" begin={`${0.2 + (r * 8 + c) * 0.06}s`} fill="freeze" />}
                </path>
              </g>
            );
          })}
          <path d="M120 78 V268" stroke="#ff5a4a" strokeWidth="3" strokeDasharray="8 5" />
          <text x="120" y="284" textAnchor="middle" fontFamily={MONO_F} fontSize="12" fontWeight="800" fill="#ff8a7a" letterSpacing="2">LIMITE</text>
        </g>
      );
    case "decider":
    case "machine":
      return (
        <g>
          <circle cx="0" cy="146" r="110" fill="#5eff9e" opacity="0.08" />
          <MartineFace x={0} y={146} size={200} mood={viz === "decider" ? "content" : "neutre"} />
        </g>
      );
    case "capteurs":
      return (
        <g>
          <Title>LE TOIT DE LA STATION</Title>
          <path d="M-210 262 Q0 70 210 262 Z" fill="#1a2a3a" stroke="#7fd8ff" strokeWidth="1.5" />
          {[[-110, 176], [0, 132], [110, 176]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y} V${y - 44}`} stroke="#c8d4e2" strokeWidth="2.4" />
              <path d={`M${x - 12} ${y - 44} Q${x} ${y - 58} ${x + 12} ${y - 44} Z`} fill="#e8eef5" />
              <circle cx={x} cy={y - 50} r="3" fill="#ff9a5a"><animate attributeName="opacity" values="0.2;1;0.2" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" /></circle>
              <text x={x} y={y + 18} textAnchor="middle" fontFamily={MONO_F} fontSize="11.5" fontWeight="700" fill="#c8d4e2">capteur {i + 1}</text>
            </g>
          ))}
          <Figure x={46} y={150} s={0.42} skin="#e8c0a0" hair="#c85a28" look="curls" coat="#7a5a3a" garment="coat" mood="content" arms={[{ a1: 150, a2: 160 }, { a1: 20, a2: 10 }]} />
          <text x="0" y="284" textAnchor="middle" fontFamily={MONO_F} fontSize="12" fontWeight="800" fill="#ff9a5a" letterSpacing="2">LES MESURES DE LÉA</text>
        </g>
      );
    case "sousterre":
      return (
        <g>
          <rect x="-228" y="12" width="456" height="108" fill="#2a3446" />
          {[[-160, 40], [-40, 30], [90, 44]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="60" ry="16" fill="#4a5466" />)}
          <path d="M20 50 L8 76 L22 76 L10 104" stroke="#ffd166" strokeWidth="3" fill="none"><animate attributeName="opacity" values="0;1;0;0;0" dur="2s" repeatCount="indefinite" /></path>
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={-220 + ((i * 61) % 440)} r="1.8" fill="#fff"><animate attributeName="cy" values="20;118" dur={`${1.5 + (i % 3) * 0.5}s`} repeatCount="indefinite" /></circle>
          ))}
          <rect x="-228" y="120" width="456" height="172" fill="#2a1e14" />
          <path d="M-228 120 H228" stroke="#a89078" strokeWidth="2" />
          <path d="M-60 120 V280 M-46 120 V280" stroke="#7fd8ff" strokeWidth="1.2" opacity="0.7" />
          <text x="-186" y="36" fontFamily={MONO_F} fontSize="14" fontWeight="800" fill="#e8eef5">DEHORS</text>
          <text x="-210" y="146" fontFamily={MONO_F} fontSize="14" fontWeight="800" fill="#d8b878">SOUS TERRE</text>
          {/* thermomètre de surface : il monte et descend sans arrêt */}
          <g transform="translate(150,22)">
            <rect x="-7" y="0" width="14" height="78" rx="7" fill="#fff" stroke="#5a6678" />
            <rect x="-3" y="30" width="6" height="48" fill="#ff5a4a"><animate attributeName="y" values="62;8;62" dur="2.2s" repeatCount="indefinite" /><animate attributeName="height" values="16;70;16" dur="2.2s" repeatCount="indefinite" /></rect>
            <text x="-14" y="44" textAnchor="end" fontFamily={MONO_F} fontSize="13" fontWeight="800" fill="#ffd0c8">−20 à +40 °C</text>
          </g>
          {/* thermomètre sous terre : immobile */}
          <g transform="translate(150,150)">
            <rect x="-7" y="0" width="14" height="78" rx="7" fill="#fff" stroke="#5a6678" />
            <rect x="-3" y="44" width="6" height="34" fill="#ff9a5a" />
            <text x="-14" y="50" textAnchor="end" fontFamily={MONO_F} fontSize="15" fontWeight="900" fill="#ffd166">12 °C</text>
            <text x="-14" y="68" textAnchor="end" fontFamily={MONO_F} fontSize="11" fill="#d8b878">toute l'année</text>
          </g>
        </g>
      );
    case "demande":
      return (
        <g>
          <Title>L'ÉQUIPE DU CHANTIER</Title>
          {[-170, -100, -30, 40].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="140" r="20" fill={["#c8946a", "#e0b898", "#d8a880", "#e8c0a0"][i]} />
              <path d={`M${x - 24} 132 Q${x} 104 ${x + 24} 132 Z`} fill="#ffd166" stroke="#a88a20" />
              <path d={`M${x - 30} 210 Q${x} 160 ${x + 30} 210 Z`} fill={["#3a5878", "#c8a878", "#5a3818", "#7a5a3a"][i]} />
            </g>
          ))}
          <g>
            <circle cx="120" cy="140" r="20" fill="none" stroke="#5eff9e" strokeWidth="2.4" strokeDasharray="6 4" />
            <path d="M90 210 Q120 160 150 210 Z" fill="none" stroke="#5eff9e" strokeWidth="2.4" strokeDasharray="6 4" />
            <text x="120" y="150" textAnchor="middle" fontFamily="Georgia,serif" fontSize="26" fontWeight="800" fill="#5eff9e">?<animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" /></text>
            <text x="120" y="232" textAnchor="middle" fontFamily={MONO_F} fontSize="12" fontWeight="800" fill="#5eff9e">{prenom}</text>
          </g>
          <g transform="translate(-60,262) rotate(-30)"><rect x="-2" y="-26" width="4" height="40" fill="#8a6a40" /><path d="M-16 -26 Q0 -34 16 -26 L14 -22 Q0 -28 -14 -22 Z" fill="#8a94a8" /></g>
          <g transform="translate(-30,262) rotate(30)"><rect x="-2" y="-26" width="4" height="34" fill="#8a6a40" /><path d="M-8 8 h16 l-2 14 h-12 Z" fill="#8a94a8" /></g>
        </g>
      );
    case "promesse":
      return (
        <g>
          <text x="0" y="132" textAnchor="middle" fontFamily={MONO_F} fontSize="76" fontWeight="900" fill="#5eff9e" letterSpacing="6">03:14</text>
          <circle cx="150" cy="190" r="16" fill="#f0e4c8" opacity="0.9" />
          <path d="M-70 270 V214 L-30 184 L10 214 V270 Z" fill="#1a2030" stroke="#3a4658" />
          <rect x="-44" y="224" width="18" height="18" fill="#ffc060" />
          <path d="M-228 270 H228" stroke="#3a4658" strokeWidth="2" />
          <text x="110" y="250" textAnchor="middle" fontFamily={MONO_F} fontSize="13" fontWeight="800" fill="#c8d4e2" letterSpacing="2">LA NUIT MÊME</text>
        </g>
      );
    case "chantier":
      return (
        <g>
          <Title>LE CHANTIER</Title>
          <rect x="-228" y="92" width="456" height="200" fill="#2a1e14" />
          <path d="M-210 92 H210" stroke="#a89078" strokeWidth="2" />
          <path d="M-60 92 Q0 50 60 92" fill="#1a2a3a" stroke="#7fd8ff" strokeWidth="1.6" />
          <rect x="-20" y="92" width="40" height="10" fill="#0a0806"><animate attributeName="height" values="10;150" dur="3s" fill="freeze" /></rect>
          <g transform="translate(40,120)"><g><animateTransform attributeName="transform" type="rotate" values="-30;20;-30" dur="0.8s" repeatCount="indefinite" />
            <rect x="-2" y="-30" width="4" height="40" fill="#8a6a40" /><path d="M-16 -30 Q0 -38 16 -30 L14 -26 Q0 -32 -14 -26 Z" fill="#8a94a8" /></g></g>
          <rect x="-160" y="262" width="320" height="12" rx="6" fill="#0a0806" stroke="#5a6678" />
          <rect x="-158" y="264" width="10" height="8" rx="4" fill="#ffd166"><animate attributeName="width" values="10;316" dur="3s" fill="freeze" /></rect>
          <text x="-160" y="256" fontFamily={MONO_F} fontSize="12" fontWeight="800" fill="#c8d4e2">2045</text>
          <text x="160" y="256" textAnchor="end" fontFamily={MONO_F} fontSize="12" fontWeight="800" fill="#ffd166">2047</text>
        </g>
      );
    default:
      return <g><Title>LE PUITS</Title><PlanPuits animate={false} /></g>;
  }
}

const MIRA_MOOD = { reseaux: "vexe", memoire: "vexe", capteurs: "content", accord: "content", demande: "content", chantier: "content" };
const ELIAS_MOOD = { gel: "vexe", decider: "vexe", machine: "vexe", reseaux: "vexe", panne: "surpris" };

export function StageStation({ viz = "panne", who = null, prenom = "chronaute" }) {
  const dark = viz === "panne";
  const lit = (w) => who === w;
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <style>{`@keyframes j2sFlick { 0%, 100% { opacity: 0; } 46% { opacity: 0; } 48% { opacity: 0.55; } 50% { opacity: 0.1; } 53% { opacity: 0.7; } 56% { opacity: 0; } }
@keyframes j2sIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <DomeHall id="j2s" dim={dark ? 0.6 : 0.2} />
      {/* petits écrans éteints par la panne */}
      {[[70, 110], [860, 110]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="70" height="50" rx="3" fill="#05080e" stroke="#2a3446" strokeWidth="2" />
          <text x={x + 35} y={y + 29} textAnchor="middle" fontFamily={MONO_F} fontSize="8" fill="#5a6678" letterSpacing="1">RÉSEAU ✕</text>
        </g>
      ))}
      {/* l'écran de la station : ce dont on parle */}
      <g transform="translate(500,42) scale(1.08)">
        <rect x="-240" y="0" width="480" height="304" rx="8" fill="#05080e" stroke={lit("martine") ? "#5eff9e" : "#7fd8ff"} strokeWidth={lit("martine") ? 6 : 4} />
        <rect x="-228" y="12" width="456" height="280" fill="#08182a" />
        <g key={viz} style={{ animation: "j2sIn 500ms ease-out both" }}>
          <ScreenViz viz={viz} prenom={prenom} />
        </g>
        {/* MARTINE qui parle : son visage, à cheval sur le bord de l'écran */}
        {lit("martine") && !["decider", "machine"].includes(viz) && (
          <g style={{ animation: "j2sIn 400ms ease-out both" }}>
            <circle cx="-246" cy="44" r="40" fill="#06110b" stroke="#5eff9e" strokeWidth="2" />
            <MartineFace x={-246} y={46} size={70} talking />
          </g>
        )}
      </g>
      {/* Mira (à gauche) et Elias (à droite) ; celui qui parle est éclairé */}
      <ellipse cx="180" cy="404" rx="70" ry="11" fill="#7fd8ff" opacity="0.12" />
      <ellipse cx="820" cy="404" rx="70" ry="11" fill="#ffd166" opacity="0.12" />
      {lit("mira") && <ellipse cx="180" cy="300" rx="80" ry="160" fill="#7fd8ff" opacity="0.18" />}
      {lit("elias") && <ellipse cx="820" cy="300" rx="80" ry="160" fill="#ffd166" opacity="0.18" />}
      <g opacity={who && !lit("mira") ? 0.78 : 1}>
        <Figure x={180} y={406} s={1.5} skin="#c8946a" hair="#1a1408" look="braids" earrings="#c8a848" lips="#c85028"
          coat="#3a5878" pants="#1a2838" garment="jacket" mood={MIRA_MOOD[viz] || "neutre"}
          arms={lit("mira") ? [{ a1: 9, a2: 6 }, { a1: 60, a2: 80 }] : [{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }]} />
      </g>
      <g opacity={who && !lit("elias") ? 0.78 : 1}>
        <Figure x={820} y={406} s={1.5} skin="#e0b898" hair="#e8e8e0" look="short" beard
          coat="#c8a878" pants="#4a3a28" garment="tunic" mood={ELIAS_MOOD[viz] || "neutre"}
          arms={lit("elias") ? [{ a1: 60, a2: 80 }, { a1: 9, a2: 6 }] : [{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }]} />
      </g>
      {/* la panne : la lumière vacille */}
      <rect width="1000" height="560" fill="#000" style={{ animation: `j2sFlick ${dark ? 2.5 : 7}s linear infinite`, pointerEvents: "none" }} />
    </svg>
  );
}

/* ───────────────────────── 03 h 14 · Ta rue ───────────────────────── */
/* Décor de l'intro (viewBox 1200×680), cadré un peu plus haut pour que
   MARTINE reste visible au-dessus du bandeau de dialogue. */
/* viz « telephone » : le message d'Al3x1a, toujours là. */
export function StageMaison({ viz = null }) {
  return (
    <svg viewBox="0 70 1200 680" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <radialGradient id="j2m-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b0ffdc" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#5eff9e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="600" width="1200" height="160" fill="#14141c" />
      <NightStreetDecor />
      <circle cx="600" cy="560" r="240" fill="url(#j2m-halo)">
        <animate attributeName="opacity" values="0.55;0.8;0.55" dur="3s" repeatCount="indefinite" />
      </circle>
      <g transform="translate(600,540) scale(0.95)"><TimeMachine landed={true} /></g>
      {viz === "telephone" && (
        <g transform="translate(860,170)" style={{ animation: "j2bIn 600ms ease-out both" }}>
          <rect x="0" y="0" width="230" height="400" rx="26" fill="#0a0c12" stroke="#3a4050" strokeWidth="4" />
          <rect x="12" y="34" width="206" height="340" rx="6" fill="#e8ddd0" />
          <rect x="12" y="34" width="206" height="46" fill="#1f3a34" />
          <circle cx="38" cy="57" r="13" fill="#8a6a50" />
          <text x="60" y="54" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="15" fontWeight="700" fill="#fff">Al3x1a</text>
          <text x="60" y="71" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10" fill="#9fd8c0">03:14</text>
          <rect x="24" y="100" width="182" height="86" rx="10" fill="#ffffff" />
          {["Ma famille", "est en danger.", "Ceci te concerne aussi."].map((t, i) => (
            <text key={i} x="36" y={128 + i * 22} fontFamily="Segoe UI, system-ui, sans-serif" fontSize={i === 2 ? 13 : 15} fontStyle={i === 2 ? "italic" : "normal"} fontWeight="600" fill="#111b21">{t}</text>
          ))}
          <rect x="95" y="14" width="40" height="8" rx="4" fill="#1a1c24" />
        </g>
      )}
    </svg>
  );
}

/* ───────────────────────── Léa Vermet ───────────────────────── */
export function PortraitLea({ mood = "neutre" }) {
  const eyes = mood === "content" ? -1 : mood === "vexe" ? 1.5 : 0;
  return (
    <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="200" height="240" fill="#26303a" />
      <circle cx="100" cy="90" r="80" fill="#ff9a5a" opacity="0.13" />
      {/* salopette bleu-vert, tee-shirt jaune */}
      <path d="M20 240 L20 190 Q20 158 56 150 L144 150 Q180 158 180 190 L180 240 Z" fill="#2f7f86" stroke="#123c40" strokeWidth="1.5" />
      <path d="M62 148 L100 170 L138 148 L130 140 Q100 156 70 140 Z" fill="#f2c14e" stroke="#9a7a20" strokeWidth="1" />
      <path d="M70 150 L76 184 L88 184 L84 154 Z M130 150 L124 184 L112 184 L116 154 Z" fill="#2f7f86" stroke="#123c40" strokeWidth="1.2" />
      <rect x="72" y="184" width="56" height="56" fill="#34909a" stroke="#123c40" strokeWidth="1.2" />
      {/* poche de bavette avec outils */}
      <rect x="82" y="196" width="36" height="26" fill="#2a7078" stroke="#123c40" strokeWidth="1" />
      <path d="M90 196 L90 188 M100 196 L100 186 M110 196 L110 190" stroke="#d8d2c0" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="76" cy="184" r="2.4" fill="#f2c14e" /><circle cx="124" cy="184" r="2.4" fill="#f2c14e" />
      {/* cou */}
      <ellipse cx="100" cy="135" rx="16" ry="12" fill="#e8b996" />
      {/* tête */}
      <ellipse cx="100" cy="82" rx="49" ry="57" fill="#f4cfae" stroke="#8a5a38" strokeWidth="1.5" />
      {/* cheveux courts bouclés, auburn */}
      <g fill="#b8501f" stroke="#7a3412" strokeWidth="0.8">
        {[[58, 56, 15], [76, 38, 16], [100, 32, 17], [124, 38, 16], [142, 56, 15], [50, 80, 11], [150, 80, 11], [64, 46, 12], [136, 46, 12]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M58 70 Q66 52 100 50 Q134 52 142 70 Q124 62 100 64 Q76 62 58 70 Z" fill="#c25a24" />
      {/* lunettes de soudeur relevées sur le front */}
      <path d="M52 58 Q100 44 148 58" stroke="#33333c" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="53" r="10" fill="#9ad6e8" stroke="#22222a" strokeWidth="3" opacity="0.92" />
      <circle cx="120" cy="53" r="10" fill="#9ad6e8" stroke="#22222a" strokeWidth="3" opacity="0.92" />
      <path d="M74 49 q4 -4 9 -3" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />
      {/* taches de rousseur + trace de graisse */}
      {[[72, 100], [78, 104], [84, 99], [116, 99], [122, 104], [128, 100]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="#b87850" opacity="0.8" />
      ))}
      <path d="M128 92 q8 2 12 8" stroke="#3a2a22" strokeWidth="3" strokeLinecap="round" opacity="0.28" fill="none" />
      {/* yeux */}
      <ellipse cx="82" cy="84" rx="6.5" ry="4.6" fill="#f8f4e8" />
      <ellipse cx="118" cy="84" rx="6.5" ry="4.6" fill="#f8f4e8" />
      <circle cx={82 + eyes} cy="84" r="2.9" fill="#3a6a4a" />
      <circle cx={118 + eyes} cy="84" r="2.9" fill="#3a6a4a" />
      <circle cx={82 + eyes} cy="84" r="1.2" fill="#10201a" />
      <circle cx={118 + eyes} cy="84" r="1.2" fill="#10201a" />
      <path d={mood === "vexe" ? "M73 74 q8 -1 16 3 M111 77 q8 -4 16 -3" : "M73 75 q8 -4 16 -1 M111 74 q8 -3 16 1"} stroke="#8a3c14" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M100 90 L97 106 L103 106" stroke="#b07850" strokeWidth="1" fill="none" />
      {mood === "content"
        ? <path d="M82 120 Q100 134 118 120" stroke="#9a3c2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        : mood === "vexe"
        ? <path d="M86 127 Q100 120 114 127" stroke="#9a3c2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        : <path d="M86 124 Q100 128 114 124" stroke="#9a3c2c" strokeWidth="2.2" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

/* ───────────────────────── 1 · le Puits ───────────────────────── */
export function StageChantier() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <linearGradient id="j2c-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080d18" /><stop offset="55%" stopColor="#152036" /><stop offset="100%" stopColor="#262130" />
        </linearGradient>
        <linearGradient id="j2c-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#222a3a" /><stop offset="100%" stopColor="#090d15" />
        </linearGradient>
        <linearGradient id="j2c-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a8498" /><stop offset="100%" stopColor="#303848" />
        </linearGradient>
        <radialGradient id="j2c-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bdf0ff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#4aa8d8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4aa8d8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="j2c-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc880" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffc880" stopOpacity="0" />
        </radialGradient>
        <filter id="j2c-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <linearGradient id="j2c-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffd8a0" stopOpacity="0.22" /><stop offset="100%" stopColor="#ffd8a0" stopOpacity="0" /></linearGradient>
        <linearGradient id="j2c-pipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a7488" /><stop offset="50%" stopColor="#3a4254" /><stop offset="100%" stopColor="#1a2030" /></linearGradient>
        <pattern id="j2c-hazard" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="16" fill="#f2c14e" /><rect x="8" width="8" height="16" fill="#1a1408" />
        </pattern>
      </defs>
      <rect width="1000" height="560" fill="url(#j2c-wall)" />

      {/* la roche brute de la caverne, entre les nervures de la voûte */}
      {(() => { const r = rng(2047); return Array.from({ length: 70 }, (_, i) => {
        const x = r() * 1060 - 30, y = r() * 200, w = 30 + r() * 70, h = 16 + r() * 34;
        return <path key={`rk${i}`} d={`M${x} ${y} l${w * 0.4} ${-h * 0.5} l${w * 0.6} ${h * 0.2} l${-w * 0.1} ${h * 0.7} l${-w * 0.7} ${h * 0.1} Z`} fill={r() < 0.5 ? "#1a2438" : "#121a2a"} stroke="#26324a" strokeWidth="0.8" opacity="0.45" />;
      }); })()}
      <Speckle seed={2048} x0={0} x1={1000} y0={0} y1={230} n={160} colors={["#3a4a66", "#0a0f1a"]} r={[0.6, 1.6]} opacity={0.5} perspective={false} />
      {/* voûte de la grande salle : nervures */}
      <g stroke="#2c3c58" strokeWidth="2" fill="none" opacity="0.75">
        <path d="M-120 300 Q500 -250 1120 300" />
        <path d="M-40 300 Q500 -150 1040 300" />
        <path d="M60 300 Q500 -60 940 300" />
        <path d="M500 -10 L500 300 M300 20 L250 300 M700 20 L750 300 M130 70 L90 300 M870 70 L910 300" />
      </g>
      {/* le cuvelage de béton au fond, ses gros tuyaux et la salle de contrôle */}
      <rect x="-20" y="150" width="1040" height="86" fill="#1c2436" />
      {Array.from({ length: 14 }).map((_, i) => <path key={`cv${i}`} d={`M${i * 76} 150 v86`} stroke="#141a28" strokeWidth="2" />)}
      <rect x="-20" y="150" width="1040" height="4" fill="#2e3a52" />
      {[176, 196, 214].map((y, i) => (
        <g key={`tp${y}`}>
          <rect x="-20" y={y} width="1040" height={10 - i * 2} rx="4" fill="url(#j2c-pipe)" />
          {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={40 + k * 120 + i * 30} y={y - 2} width="6" height={14 - i * 2} fill="#4a5468" />)}
        </g>
      ))}
      <g transform="translate(500,118)">
        <rect x="-110" y="0" width="220" height="34" fill="#0c1220" stroke="#4a5a74" strokeWidth="2" />
        <rect x="-104" y="5" width="208" height="24" fill="#7fd8ff" opacity="0.18" />
        {[-80, -46, 40, 76].map((x, i) => <g key={x}><circle cx={x} cy="16" r="5" fill="#0a0e18" /><path d={`M${x - 7} 29 q7 -10 14 0 Z`} fill="#0a0e18" /></g>)}
        {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={-100 + k * 21} y="24" width="12" height="3" fill={["#5eff9e", "#ffb04a", "#7fd8ff"][k % 3]} opacity="0.8" />)}
        <text x="0" y="-5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8aa0c0" letterSpacing="2">CONTRÔLE · NIVEAU −120 m</text>
      </g>
      {/* sas latéraux */}
      {[70, 872].map((x) => (
        <g key={x} transform={`translate(${x},190)`}>
          <rect width="58" height="110" fill="#10182a" stroke="#4a5a74" strokeWidth="2" />
          <path d="M8 24 l21 -12 l21 12 M8 48 l21 -12 l21 12" stroke="#f2c14e" strokeWidth="2.4" fill="none" opacity="0.7" />
        </g>
      ))}
      {/* lampes de chantier */}
      {[[170, 62], [335, 36], [500, 28], [665, 36], [830, 62]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="70" fill="url(#j2c-lamp)">
            <animate attributeName="opacity" values="0.8;1;0.7;1" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r="6" fill="#ffe2b0" />
          <path d={`M${x - 8} ${y + 4} L${x + 8} ${y + 4} L${x + 40 + (500 - x) * 0.25} 330 L${x - 40 + (500 - x) * 0.25} 330 Z`} fill="url(#j2c-cone)" />
        </g>
      ))}

      {/* sol */}
      <rect y="232" width="1000" height="330" fill="url(#j2c-floor)" />
      <g stroke="#2e3850" strokeWidth="1" opacity="0.7">
        {[-300, -100, 100, 300, 500, 700, 900, 1100, 1300].map((x) => <line key={x} x1="500" y1="250" x2={x} y2="560" />)}
        {[262, 290, 330, 390, 470].map((y) => <line key={y} x1="0" y1={y} x2="1000" y2={y} />)}
      </g>

      {/* le Puits, vu en perspective : lèvre, anneau, plaques d'obturation */}
      <ellipse cx="500" cy="347" rx="306" ry="80" fill="#2a3242" />
      <g transform="translate(500,335) scale(1,0.26)">
        <circle r="300" fill="#0d121b" stroke="#6a7486" strokeWidth="16" />
        <circle r="280" fill="#04070c" />
        <circle r="262" fill="none" stroke="#1c283c" strokeWidth="6" />
        <circle r="238" fill="none" stroke="#17223a" strokeWidth="6" />
        <circle r="200" fill="url(#j2c-glow)" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0;-3;0;2;0" dur="11s" repeatCount="indefinite" />
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={wedge(i * 45 + 3, i * 45 + 42, 150, 284)} fill="url(#j2c-plate)" stroke="#10151e" strokeWidth="4" />
          ))}
        </g>
        {/* balises sur la lèvre */}
        {Array.from({ length: 16 }).map((_, i) => {
          const [x, y] = polar(300, i * 22.5);
          return (
            <circle key={i} cx={x} cy={y} r="7" fill="#ff9a3c">
              <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" begin={`${(i % 4) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </g>
      {/* brume froide qui monte du Puits et s'étire */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={`mi${i}`} cx={440 + i * 40} cy="300" rx="120" ry="26" fill="#bfe8ff" opacity="0.08" filter="url(#j2c-blur)">
          <animate attributeName="cy" values="320;200;320" dur={`${12 + i * 3}s`} begin={`${i * 2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.12;0" dur={`${12 + i * 3}s`} begin={`${i * 2}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* bande de danger autour de la lèvre */}
      <ellipse cx="500" cy="347" rx="322" ry="86" fill="none" stroke="url(#j2c-hazard)" strokeWidth="8" opacity="0.55" />
      {/* lueur froide qui monte du fond */}
      <ellipse cx="500" cy="300" rx="190" ry="60" fill="#7fd8ff" opacity="0.1" />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={430 + (i * 37) % 140} cy="330" r="1.6" fill="#cfefff" opacity="0.7">
          <animate attributeName="cy" values="330;150" dur={`${5 + (i % 5)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur={`${5 + (i % 5)}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* portique + dernière plaque suspendue */}
      <g fill="#2a3244" stroke="#4a566c" strokeWidth="1.5">
        <rect x="168" y="70" width="16" height="232" />
        <rect x="816" y="70" width="16" height="232" />
        <rect x="168" y="64" width="664" height="18" />
      </g>
      <g stroke="#4a566c" strokeWidth="2" opacity="0.8">
        <path d="M184 82 L260 64 M816 82 L740 64 M184 150 L168 120 M816 150 L832 120" />
      </g>
      <rect x="486" y="82" width="28" height="12" fill="#f2c14e" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 500 94;1.4 500 94;0 500 94;-1.4 500 94;0 500 94" dur="6.5s" repeatCount="indefinite" />
        <line x1="500" y1="94" x2="500" y2="178" stroke="#8a94a8" strokeWidth="3" strokeDasharray="6 3" />
        <path d="M426 178 L574 178 L558 214 L442 214 Z" fill="url(#j2c-plate)" stroke="#10151e" strokeWidth="2" />
        <path d="M434 192 L566 192 L561 205 L439 205 Z" fill="url(#j2c-hazard)" opacity="0.9" />
      </g>

      {/* panneau de chantier */}
      <g transform="translate(76,96)">
        <line x1="20" y1="-30" x2="20" y2="0" stroke="#5a6270" strokeWidth="2" />
        <line x1="190" y1="-30" x2="190" y2="0" stroke="#5a6270" strokeWidth="2" />
        <rect width="210" height="58" fill="#120f08" stroke="#f2c14e" strokeWidth="2" />
        <rect width="210" height="9" fill="url(#j2c-hazard)" />
        <text x="105" y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="800" fill="#f2c14e" letterSpacing="2">PUITS · SCELLEMENT</text>
        <text x="105" y="48" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="#c8d4e2" letterSpacing="2">DEMAIN · 12 MARS 2047</text>
      </g>

      {/* ouvriers qui font les derniers réglages : combinaison orange,
          bandes réfléchissantes, casque de chantier */}
      {[[130, 330, 0, "#e8742a", "#d8a888", "#3a2418"], [250, 350, 1, "#e0662a", "#a8704a", "#1a1410"]].map(([x, y, k, c, sk, hr]) => (
        <g key={k} transform={`translate(${x},${y})`}>
          <animateTransform attributeName="transform" type="translate" values={`${x} ${y};${x + 46} ${y};${x} ${y}`} dur={`${9 + k * 3}s`} repeatCount="indefinite" additive="replace" />
          <Figure x={0} y={0} s={0.46} skin={sk} hair={hr} look="short" hat="hardhat" hatColor="#f2c14e" mood="neutre"
            garment="jacket" coat={c} pants={c} shoes="#222a36" arms={k ? [{ a1: 10, a2: 6 }, { a1: 60, a2: 90 }] : [{ a1: 30, a2: 60 }, { a1: 10, a2: 6 }]}>
            <path d="M-20 -62 h40 M-20 -40 h40" stroke="#e8f0d0" strokeWidth="3" opacity="0.85" />
            {k === 0 && <rect x="-36" y="-56" width="14" height="10" rx="2" fill="#2a3244" stroke="#7fd8ff" strokeWidth="1" />}
          </Figure>
        </g>
      ))}
      {/* caisses de matériel */}
      <g>
        <rect x="860" y="304" width="50" height="34" fill="#4a3a28" stroke="#2a2014" strokeWidth="1.5" />
        <rect x="900" y="316" width="42" height="26" fill="#3a4a58" stroke="#1a2430" strokeWidth="1.5" />
        <path d="M860 304 l50 34 M860 338 l50 -34" stroke="#2a2014" strokeWidth="1" opacity="0.6" />
      </g>
      {/* garde-corps premier plan */}
      <g fill="#10151e" stroke="#3a4458" strokeWidth="1.5">
        <rect x="0" y="392" width="1000" height="6" />
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 76 + 10} y="392" width="6" height="56" />)}
      </g>
    </svg>
  );
}

/* ───────────────────────── 2 · l'atelier de Léa ───────────────────────── */
export function StageAtelier() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <linearGradient id="j2a-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1820" /><stop offset="100%" stopColor="#14242c" />
        </linearGradient>
        <linearGradient id="j2a-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.38" /><stop offset="100%" stopColor="#ffd98a" stopOpacity="0" />
        </linearGradient>
        <pattern id="j2a-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 L0 40" fill="none" stroke="#2a4a5a" strokeWidth="0.7" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="1000" height="560" fill="url(#j2a-wall)" />
      {/* paroi de béton projeté sur la roche, panneaux et joints */}
      {Array.from({ length: 6 }).map((_, i) => <rect key={`pn${i}`} x={i * 170 - 10} y="30" width="166" height="322" fill={i % 2 ? "#10202a" : "#0e1c24"} stroke="#0a141a" strokeWidth="2" />)}
      <Speckle seed={2049} x0={0} x1={1000} y0={30} y1={350} n={180} colors={["#1e3440", "#08121a"]} r={[0.6, 1.6]} opacity={0.6} perspective={false} />
      <rect width="1000" height="360" fill="url(#j2a-grid)" opacity="0.6" />
      {/* plafond : chemin de câbles, gaine et bande lumineuse */}
      <rect x="-20" y="0" width="1040" height="30" fill="#0a1218" />
      <rect x="-20" y="22" width="1040" height="8" rx="3" fill="#2a3a44" />
      {Array.from({ length: 12 }).map((_, i) => <path key={`cb${i}`} d={`M${i * 90 + 30} 22 v8`} stroke="#4a5a64" strokeWidth="2" />)}
      <path d="M-20 26 Q200 34 420 26 T860 26 T1040 28" stroke="#c84a2a" strokeWidth="2" fill="none" opacity="0.6" />
      <rect x="250" y="32" width="500" height="4" rx="2" fill="#bfe8ff" opacity="0.5" />
      <ellipse cx="500" cy="44" rx="280" ry="14" fill="#bfe8ff" opacity="0.08" />

      {/* plan du Puits punaisé au mur */}
      <g transform="translate(500,170)" opacity="0.5">
        <rect x="-190" y="-120" width="380" height="240" fill="#0e2a3a" stroke="#4a8aa8" strokeWidth="1.5" />
        {[100, 76, 52, 28].map((r) => <circle key={r} r={r} fill="none" stroke="#5aa8c8" strokeWidth="1" />)}
        <path d="M-100 0 H100 M0 -100 V100" stroke="#5aa8c8" strokeWidth="0.8" />
        <text x="-176" y="-100" fontFamily="ui-monospace,monospace" fontSize="10" fill="#8ad0e8" letterSpacing="2">PUITS · COUPE A-A</text>
        <text x="-176" y="108" fontFamily="ui-monospace,monospace" fontSize="9" fill="#8ad0e8" letterSpacing="2">L. VERMET · ÉCHELLE 1/200</text>
      </g>

      {/* étagères de pièces, à gauche */}
      <g transform="translate(24,70)">
        {[0, 80, 160, 240].map((y, k) => (
          <g key={y} transform={`translate(0,${y})`}>
            <rect y="62" width="190" height="8" fill="#3a2a1c" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={8 + i * 46} y={62 - (24 + ((i + k) % 3) * 8)} width={34} height={24 + ((i + k) % 3) * 8} fill={["#3a5a68", "#5a4a30", "#4a3a5a", "#2a5a4a"][(i + k) % 4]} stroke="#10181e" strokeWidth="1" />
            ))}
          </g>
        ))}
      </g>
      {/* sur les étagères : bobine de fil, maquette du bouchon du Puits, pothos qui retombe */}
      <g transform="translate(160,124)">
        <ellipse cx="0" cy="0" rx="12" ry="5" fill="#c86a2a" /><rect x="-12" y="-14" width="24" height="14" fill="#c86a2a" /><ellipse cx="0" cy="-14" rx="12" ry="5" fill="#e8843a" /><ellipse cx="0" cy="-14" rx="4" ry="2" fill="#3a2a1c" />
      </g>
      <g transform="translate(118,286)">
        <ellipse cx="0" cy="0" rx="30" ry="9" fill="#5a6474" /><ellipse cx="0" cy="-4" rx="26" ry="7" fill="#8a94a8" />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M0 -4 L${(Math.cos((i * Math.PI) / 4) * 26).toFixed(1)} ${(-4 + Math.sin((i * Math.PI) / 4) * 7).toFixed(1)}`} stroke="#3a4454" strokeWidth="1.2" />)}
        <ellipse cx="0" cy="-4" rx="8" ry="2.4" fill="#7fd8ff" opacity="0.7" />
      </g>
      <g transform="translate(40,70)">
        <path d="M13 -40 L13 0 M13 -40 L2 0 M13 -40 L24 0" stroke="#8a7a64" strokeWidth="1" />
        <path d="M0 0 h26 l-4 14 h-18 Z" fill="#c8a070" />
        <path d="M6 12 q-10 40 -2 90 M14 12 q6 50 -4 120 M20 12 q12 30 8 70" stroke="#3a8a4a" strokeWidth="2" fill="none" />
        {[[2, 40], [-4, 70], [6, 96], [18, 56], [12, 100], [26, 70], [4, 120]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="6" ry="4" fill={i % 2 ? "#4aa05a" : "#3a8a4a"} transform={`rotate(${i * 40} ${x} ${y})`} />)}
      </g>
      {/* panneau d'outils, à droite */}
      <g transform="translate(790,86)">
        <rect width="186" height="190" fill="#1c2a30" stroke="#3a4a52" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${24 + i * 40},26)`}>
            <circle r="9" fill="none" stroke="#c8d0d8" strokeWidth="3" />
            <rect x="-2.5" y="8" width="5" height="52" fill="#c8d0d8" />
            <rect x="-5" y="62" width="10" height="18" fill="#e8742a" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${40 + i * 52},128)`}>
            <rect x="-4" y="-18" width="8" height="48" fill="#8a94a4" />
            <rect x="-9" y="26" width="18" height="30" rx="3" fill={["#f2c14e", "#e8742a", "#3a9a8a"][i]} />
          </g>
        ))}
      </g>

      {/* lampe d'établi : cône de lumière */}
      <path d="M868 40 L600 380 L960 380 Z" fill="url(#j2a-cone)" />
      <g transform="translate(868,34)">
        <path d="M0 0 L-40 40 L-80 20" stroke="#6a7486" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-96 8 L-62 28 L-78 44 L-104 28 Z" fill="#c8d0d8" stroke="#6a7486" strokeWidth="1.5" />
      </g>

      {/* établi */}
      <rect y="352" width="1000" height="40" fill="#3a2a1c" />
      <rect y="392" width="1000" height="170" fill="#1e150d" />
      <rect y="352" width="1000" height="4" fill="#5a4230" />
      {Array.from({ length: 6 }).map((_, i) => <g key={`dr${i}`}><rect x={i * 170 + 10} y="400" width="150" height="44" fill="#251a10" stroke="#120c06" strokeWidth="2" /><rect x={i * 170 + 70} y="418" width="30" height="5" rx="2" fill="#8a7a64" /></g>)}
      {/* étau, à gauche de l'établi */}
      <g transform="translate(60,352)">
        <rect x="-20" y="-8" width="40" height="8" fill="#3a5a88" /><rect x="-16" y="-26" width="12" height="18" fill="#3a5a88" /><rect x="6" y="-26" width="12" height="18" fill="#3a5a88" />
        <path d="M18 -16 h18" stroke="#8a94a4" strokeWidth="3" /><circle cx="38" cy="-16" r="4" fill="#8a94a4" />
      </g>
      {/* imprimante 3D sous la lampe, qui travaille */}
      <g transform="translate(800,352)">
        <rect x="-40" y="-80" width="80" height="80" fill="none" stroke="#3a4a52" strokeWidth="4" />
        <rect x="-36" y="-10" width="72" height="8" fill="#2a3238" />
        <g><animateTransform attributeName="transform" type="translate" values="-20 0;20 0;-20 0" dur="3s" repeatCount="indefinite" /><rect x="-8" y="-60" width="16" height="12" fill="#e8742a" /><path d="M0 -48 v8" stroke="#ff9a3a" strokeWidth="2" /></g>
        <path d="M-40 -60 h80" stroke="#5a6a74" strokeWidth="3" />
        <path d="M-14 -10 q14 -16 28 0 Z" fill="#7fd8ff" opacity="0.7" />
      </g>
      {/* vis et rondelles éparpillées */}
      {[[420, 346], [436, 348], [452, 345], [560, 347], [574, 349], [700, 346]].map(([x, y], i) => <circle key={`vs${i}`} cx={x} cy={y} r={i % 2 ? 2 : 2.8} fill="#8a94a4" stroke="#3a4454" strokeWidth="0.6" />)}
      <g transform="translate(120,352)">
        <rect y="-14" width="120" height="14" fill="#1a3a30" stroke="#0a1a14" strokeWidth="1.5" />
        {[14, 40, 66, 92].map((x, i) => (
          <rect key={x} x={x} y="-12" width="9" height="5" fill={["#5eff9e", "#ffd166", "#7fd8ff", "#ff5a7a"][i]}>
            <animate attributeName="opacity" values="1;0.2;1" dur={`${1.2 + i * 0.4}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <g transform="translate(640,352)">
        <rect x="-36" y="-26" width="46" height="26" rx="4" fill="#5a4a38" /><path d="M10 -18 q16 2 10 14 q-4 6 -10 4" stroke="#5a4a38" strokeWidth="4" fill="none" />
        <circle cx="-22" cy="-34" r="5" fill="#e8e0d0" opacity="0.3"><animate attributeName="cy" values="-34;-54" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" /></circle>
      </g>
      <g transform="translate(300,352)">
        <rect x="0" y="-6" width="90" height="6" fill="#8a94a4" />
        <path d="M90 -3 L130 -8" stroke="#c8d0d8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="132" cy="-8" r="3" fill="#ff8a3a"><animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" /></circle>
      </g>
    </svg>
  );
}

/* ───────────────────────── 3 · la salle commune ───────────────────────── */
export function StageToast({ raised = false }) {
  /* verres au repos (x, y) → point de tintement (tx, ty), à droite de Léa et
     à gauche d'Elias pour ne pas masquer les visages. Le dernier verre est celui du joueur. */
  const cups = [
    { x: 310, y: 322, tx: 548, ty: 272, c: "#bfe8ff" },
    { x: 440, y: 326, tx: 566, ty: 262, c: "#bfe8ff" },
    { x: 700, y: 322, tx: 592, ty: 272, c: "#bfe8ff" },
    { x: 580, y: 360, tx: 570, ty: 280, c: "#ffe2a8" },
  ];
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <defs>
        <linearGradient id="j2t-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1018" /><stop offset="100%" stopColor="#2a2028" />
        </linearGradient>
        <radialGradient id="j2t-warm" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffb870" stopOpacity="0.4" /><stop offset="100%" stopColor="#ffb870" stopOpacity="0" />
        </radialGradient>
        <filter id="j2t-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
        <linearGradient id="j2t-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2430" /><stop offset="100%" stopColor="#1a161e" /></linearGradient>
        <radialGradient id="j2t-water" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bdf0ff" stopOpacity="0.8" /><stop offset="100%" stopColor="#bdf0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="560" fill="url(#j2t-wall)" />
      <ellipse cx="500" cy="170" rx="520" ry="220" fill="url(#j2t-warm)" />

      {/* la roche de la voûte, à peine visible dans la pénombre */}
      {(() => { const r = rng(1203); return Array.from({ length: 50 }, (_, i) => {
        const x = r() * 1060 - 30, y = r() * 150, w = 30 + r() * 60, h = 14 + r() * 26;
        return <path key={`rk${i}`} d={`M${x} ${y} l${w * 0.4} ${-h * 0.5} l${w * 0.6} ${h * 0.2} l${-w * 0.1} ${h * 0.7} l${-w * 0.7} ${h * 0.1} Z`} fill="#16141e" stroke="#2a2634" strokeWidth="0.8" opacity="0.12" />;
      }); })()}
      {/* le mur du fond : passe-plat de la cuisine, étagères de bocaux, bacs
          de culture sous lampes, et la fresque des enfants (le ciel qu'ils n'ont jamais vu) */}
      <rect x="-20" y="196" width="1040" height="110" fill="url(#j2t-back)" />
      <rect x="-20" y="196" width="1040" height="3" fill="#3a3444" />
      <g transform="translate(110,214)">
        <rect x="-80" y="0" width="160" height="60" fill="#3a2a1c" stroke="#1a120a" strokeWidth="2" />
        <rect x="-74" y="6" width="148" height="40" fill="#ffb870" opacity="0.5" />
        <ellipse cx="0" cy="30" rx="90" ry="40" fill="#ffb870" opacity="0.2" filter="url(#j2t-blur)" />
        {[-50, -20, 14, 44].map((x, i) => <g key={x}><rect x={x - 6} y={18 - (i % 2) * 4} width="12" height={22 + (i % 2) * 4} rx="3" fill="#5a4a3a" /></g>)}
        <circle cx="-30" cy="18" r="7" fill="#2a1e14" /><path d="M-40 40 q10 -14 20 0 Z" fill="#2a1e14" />
        <rect x="-84" y="46" width="168" height="8" fill="#5a4a38" />
      </g>
      <g transform="translate(880,206)">
        {[0, 34, 68].map((y) => <rect key={y} x="-90" y={y + 26} width="180" height="5" fill="#4a3a2c" />)}
        {Array.from({ length: 15 }).map((_, k) => {
          const row = Math.floor(k / 5), x = -80 + (k % 5) * 36;
          return <g key={k}><rect x={x} y={row * 34 + 8} width="20" height="18" rx="3" fill={["#c8763a", "#8aa04a", "#d8b85a", "#a84a3a", "#e8d8b0"][(k + row) % 5]} opacity="0.75" /><rect x={x + 2} y={row * 34 + 4} width="16" height="5" fill="#8a8478" /></g>;
        })}
      </g>
      {/* bacs de culture sous lampes violettes */}
      <g transform="translate(220,288)">
        <rect x="-50" y="-10" width="100" height="14" fill="#3a3028" />
        {[-36, -18, 0, 18, 36].map((x, i) => <path key={x} d={`M${x} -10 q-6 -12 0 -18 q6 6 0 18 M${x} -10 q8 -8 10 -16`} stroke="#5ab04a" strokeWidth="2.4" fill="none" />)}
        <rect x="-54" y="-50" width="108" height="5" rx="2" fill="#c87aff" opacity="0.8" />
        <path d="M-54 -45 L-60 -10 L60 -10 L54 -45 Z" fill="#c87aff" opacity="0.08" />
      </g>
      {/* fresque des enfants : soleil, arbres, nuages */}
      <g transform="translate(640,234)" opacity="0.8">
        <rect x="-50" y="-22" width="100" height="40" fill="#2a4a6a" opacity="0.6" />
        <circle cx="-26" cy="-8" r="9" fill="#f2c14e" />
        {[0, 18, 36].map((x) => <g key={x}><rect x={x - 6} y="0" width="3" height="12" fill="#6a4a2a" /><circle cx={x - 4.5} cy="-2" r="7" fill="#4a9a4a" /></g>)}
        <path d="M-10 -14 q6 -6 12 0 q6 -4 10 2" stroke="#e8e8f0" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* d'autres tablées, au fond, dans la pénombre */}
      {[[40, 294], [86, 290], [940, 292], [972, 296]].map(([x, y], i) => (
        <g key={`ot${i}`} opacity="0.55"><circle cx={x} cy={y - 26} r="10" fill="#141018" /><path d={`M${x - 16} ${y} q16 -22 32 0 Z`} fill="#141018" /></g>
      ))}
      {/* suspensions chaudes au-dessus de la table */}
      {[240, 760].map((x) => (
        <g key={`sp${x}`}>
          <path d={`M${x} 0 v100`} stroke="#3a3444" strokeWidth="1.5" />
          <path d={`M${x - 20} 116 Q${x} 92 ${x + 20} 116 Z`} fill="#c8963e" />
          <ellipse cx={x} cy="118" rx="16" ry="4" fill="#ffe2b0" />
          <path d={`M${x - 18} 118 L${x - 70} 300 L${x + 70} 300 L${x + 18} 118 Z`} fill="#ffd8a0" opacity="0.06" />
        </g>
      ))}

      {/* voûte + nervures */}
      <g stroke="#2c3850" strokeWidth="1.6" fill="none" opacity="0.7">
        <path d="M-60 250 Q500 -190 1060 250" />
        <path d="M60 250 Q500 -80 940 250" />
        <path d="M500 -20 L500 250 M280 30 L220 250 M720 30 L780 250" />
      </g>
      {/* guirlandes lumineuses */}
      {[[130, 70], [320, 112], [500, 132], [680, 112], [870, 70]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 90} ${y - 24} Q${x} ${y + 26} ${x + 90} ${y - 24}`} stroke="#4a5060" strokeWidth="1" fill="none" />
          {[-66, -34, 0, 34, 66].map((dx, j) => (
            <circle key={j} cx={x + dx} cy={y + (Math.abs(dx) < 40 ? 14 : 3)} r="3" fill={["#ff8a3a", "#5eff9e", "#7fd8ff", "#ffd166", "#ff5a7a"][(i + j) % 5]}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.6 + ((i + j) % 3) * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
      {/* banderole */}
      <g transform="translate(500,176)">
        <rect x="-170" y="-14" width="340" height="28" fill="#1a1408" stroke="#c8a848" strokeWidth="1.5" opacity="0.92" />
        <text y="5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="700" fill="#e8c878" letterSpacing="3">LA VEILLE DU PUITS</text>
      </g>

      {/* convives, derrière la table */}
      <Bust x={290} y={222} skin="#c8946a" cloth="#3a5878" hair="#1a1408" look="braids" mood="content" />
      <Bust x={430} y={228} skin="#f4cfae" cloth="#2f7f86" hair="#b8501f" look="curls" mood="content" />
      <Bust x={730} y={222} skin="#e0b898" cloth="#8a6848" hair="#e8e8e0" look="short" beard mood="vexe" />

      {/* longue table nappée */}
      <path d="M90 300 L910 300 L990 396 L10 396 Z" fill="#e8e0d0" stroke="#9a8a6a" strokeWidth="1.5" />
      <path d="M90 300 L910 300 L912 306 L88 306 Z" fill="#c8bca0" />
      {/* carafe d'eau du Puits au centre */}
      <g transform="translate(868,318)">
        <ellipse cx="0" cy="-20" rx="44" ry="34" fill="url(#j2t-water)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <path d="M-14 0 L-18 -34 Q-16 -52 -6 -54 L6 -54 Q16 -52 18 -34 L14 0 Z" fill="#cfefff" stroke="#6aa8c8" strokeWidth="1.5" opacity="0.9" />
        <path d="M-14 -26 L14 -26" stroke="#6aa8c8" strokeWidth="1" opacity="0.8" />
      </g>
      {/* flaques de lumière chaude des suspensions sur la nappe */}
      {[240, 760].map((x) => <ellipse key={`lp${x}`} cx={x} cy="330" rx="140" ry="24" fill="#ffcf8a" opacity="0.2" filter="url(#j2t-blur)" />)}
      {/* assiettes, serviettes, bols */}
      {[200, 330, 470, 640, 770].map((x) => <ellipse key={x} cx={x} cy={350} rx="30" ry="7" fill="#f4eee0" stroke="#bfb298" strokeWidth="1" />)}
      {[200, 330, 470, 640, 770].map((x, i) => <path key={`sv${x}`} d={`M${x + 34} 344 l12 0 l3 12 l-12 0 Z`} fill={["#a84a3a", "#2f7f86", "#d8b85a"][i % 3]} opacity="0.8" />)}
      {/* pain de la cantine, bougies */}
      <g transform="translate(380,322)">
        <ellipse cx="0" cy="0" rx="28" ry="9" fill="#b8763a" /><ellipse cx="0" cy="-3" rx="24" ry="7" fill="#d8964a" />
        {[-12, 0, 12].map((x) => <path key={x} d={`M${x - 4} -6 l8 4`} stroke="#8a5a2a" strokeWidth="1.4" />)}
      </g>
      {[[150, 316], [520, 312], [720, 314]].map(([x, y], i) => (
        <g key={`bg${i}`}>
          <ellipse cx={x} cy={y} rx="22" ry="12" fill="#ffd890" opacity="0.25" filter="url(#j2t-blur)" />
          <rect x={x - 3} y={y - 14} width="6" height="14" fill="#efe6d2" />
          <path d={`M${x} ${y - 14} q-3 -5 0 -9 q3 4 0 9 Z`} fill="#ffcf6a"><animate attributeName="opacity" values="1;0.7;1" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" /></path>
        </g>
      ))}

      {/* verres : se lèvent au moment du toast */}
      {cups.map((c, i) => (
        <g key={i} style={{ transform: raised ? `translate(${c.tx - c.x}px,${c.ty - c.y}px)` : "translate(0px,0px)", transition: "transform 900ms cubic-bezier(.3,.8,.3,1)" }}>
          <path d={`M${c.x - 10} ${c.y} L${c.x - 7} ${c.y - 26} L${c.x + 7} ${c.y - 26} L${c.x + 10} ${c.y} Z`} fill={c.c} stroke="#6a8aa0" strokeWidth="1.4" opacity="0.9" />
          <path d={`M${c.x - 8} ${c.y - 10} L${c.x + 8} ${c.y - 10}`} stroke="#fff" strokeWidth="1" opacity="0.6" />
        </g>
      ))}
      {/* étincelle du tintement */}
      {raised && (
        <g transform="translate(570,250)">
          <g>
            <animateTransform attributeName="transform" type="scale" values="0.2;1.4;1" dur="0.7s" fill="freeze" />
            <path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z" fill="#fff6c8" opacity="0.95" />
            <path d="M-18 -18 L-4 -4 M18 -18 L4 -4 M-18 18 L-4 4 M18 18 L4 4" stroke="#ffe08a" strokeWidth="2" />
          </g>
        </g>
      )}
    </svg>
  );
}
