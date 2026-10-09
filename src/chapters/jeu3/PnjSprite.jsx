/* ============================================================
   JEU 3 — Sprite PNJ (v2, corps complet + orientation + tenue)
   ------------------------------------------------------------
   Personnage entier (tête + torse + bras + jambes) dessiné dans
   un SVG parent. Trois "faces" possibles pour ne pas toujours
   regarder le joueur, deux "poses" (debout / assis), et un
   accessoire de métier optionnel (blouse, tablier, ceinture
   d'outils, robe, casque).

   Props :
     x, y        — position dans le SVG parent (pieds au sol à y)
     color       — couleur du haut (tunique/veste)
     pants       — couleur du bas (défaut #3a2818)
     hair        — couleur des cheveux (défaut brun foncé)
     skin        — couleur de peau (défaut ocre)
     facing      — "front" | "left" | "right"   (défaut "front")
     pose        — "stand" | "sit"              (défaut "stand")
     accessory   — "apron" | "coat" | "toolbelt" | "robe" | "hardhat" | null
     activity    — "wipe" | "stir" | "write" | "clipboard" | "wrench" |
                   "hammer" | "torch" | "pray" | "crossed" | "cup" | null
                   (Si présente : remplace les bras par-dessus la posture
                    de base et ajoute l'outil + une petite animation.)
     nom, role   — étiquettes affichées sous le personnage
     heard       — pastille verte ✓ si vrai
     active      — halo doré pulsant si vrai
     onClick     — callback clic
   ============================================================ */
import { useState } from "react";

export default function PnjSprite({
  x, y, color = "#5a5060", pants = "#3a2818", hair = "#2a1808", skin = "#e0a878",
  facing = "front", pose = "stand", accessory = null, activity = null,
  bald = false, beard = null,
  nom = "?", role = "", heard = false, active = false, onClick, onSmalltalk,
}) {
  const hasActivity = !!activity;
  const [hover, setHover] = useState(false);
  return (
    <g transform={`translate(${x},${y})`}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(e); } : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: onClick ? "pointer" : "default" }}>
      {/* Zone de hit invisible : couvre tout le sprite pour que le hover
          ne s'interrompe pas quand le curseur passe sur un pixel
          transparent entre le corps, la tête et la loupe. */}
      <rect x="-36" y="-110" width="72" height="140" fill="transparent" pointerEvents="all" />
      {/* Halo actif */}
      {active && (
        <circle cx="0" cy="-40" r="66" fill="none" stroke="#ffd166" strokeWidth="2" strokeDasharray="4 4">
          <animate attributeName="r" values="60;72;60" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Ombre au sol */}
      <ellipse cx="0" cy="0" rx="18" ry="4" fill="#000" opacity="0.35" />

      {/* Corps selon la pose (les bras par défaut sont cachés si le PNJ
          est en activité — l'activité dessinera ses propres bras). */}
      {pose === "sit" ? <SitBody color={color} pants={pants} skin={skin} facing={facing} hideArms={hasActivity} /> :
                        <StandBody color={color} pants={pants} skin={skin} facing={facing} hideArms={hasActivity} />}

      {/* Accessoire de métier (par-dessus la tunique) */}
      {accessory && <Accessory kind={accessory} facing={facing} pose={pose} />}

      {/* Activité (bras + outil + animation) */}
      {hasActivity && <Activity kind={activity} skin={skin} facing={facing} pose={pose} />}

      {/* Tête + cheveux + visage — orientation selon `facing` */}
      <Head hair={hair} skin={skin} facing={facing} bald={bald} beard={beard} />

      {/* Pastille "déjà entendu" */}
      {heard && (
        <g transform="translate(20,-96)">
          <circle r="8" fill="#5eff9e" stroke="#0a0806" strokeWidth="1.2" />
          <path d="M-4 0 L-1 3 L5 -3" stroke="#0a0806" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* Étiquettes nom + rôle sous les pieds */}
      <text x="0" y="20" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="700" fill="#e8dfc8">{nom}</text>
      <text x="0" y="31" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8a7050">{role}</text>

      {/* Loupe « questionner » : visible seulement au survol, et seulement
          si un handler onSmalltalk est fourni. Clic → ouvre la modal
          d'orientation (où / pourquoi moi / toi). */}
      {hover && onSmalltalk && (
        <g transform="translate(-24,-96)"
          onClick={(e) => { e.stopPropagation(); onSmalltalk(); }}
          style={{ cursor: "pointer" }}>
          <circle r="11" fill="#141020" stroke="#7fd8ff" strokeWidth="1.5" />
          <circle r="4.5" cx="-1" cy="-1" fill="none" stroke="#7fd8ff" strokeWidth="1.3" />
          <line x1="2.5" y1="2.5" x2="6" y2="6" stroke="#7fd8ff" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/* ═══ CORPS DEBOUT ═══ */
function StandBody({ color, pants, skin, facing, hideArms = false }) {
  if (facing === "left") {
    return (
      <g>
        <rect x="-8" y="-40" width="7" height="40" fill={pants} stroke="#0a0806" strokeWidth="0.6" />
        <rect x="1"  y="-40" width="7" height="40" fill={pants} stroke="#0a0806" strokeWidth="0.6" opacity="0.85" />
        <ellipse cx="-4" cy="-1" rx="6" ry="2" fill="#141c26" />
        <ellipse cx="4"  cy="-1" rx="6" ry="2" fill="#141c26" opacity="0.85" />
        <path d="M-14 -84 Q-18 -70 -16 -42 L 12 -42 Q 14 -70 10 -84 Z" fill={color} stroke="#0a0806" strokeWidth="0.8" />
        {!hideArms && (
          <>
            <path d="M-14 -80 Q-24 -70 -22 -56 Q-20 -50 -14 -50" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="-14" cy="-50" r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
          </>
        )}
      </g>
    );
  }
  if (facing === "right") {
    return (
      <g>
        <rect x="-8" y="-40" width="7" height="40" fill={pants} stroke="#0a0806" strokeWidth="0.6" opacity="0.85" />
        <rect x="1"  y="-40" width="7" height="40" fill={pants} stroke="#0a0806" strokeWidth="0.6" />
        <ellipse cx="-4" cy="-1" rx="6" ry="2" fill="#141c26" opacity="0.85" />
        <ellipse cx="4"  cy="-1" rx="6" ry="2" fill="#141c26" />
        <path d="M-10 -84 Q-14 -70 -12 -42 L 16 -42 Q 18 -70 14 -84 Z" fill={color} stroke="#0a0806" strokeWidth="0.8" />
        {!hideArms && (
          <>
            <path d="M14 -80 Q24 -70 22 -56 Q20 -50 14 -50" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="14" cy="-50" r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
          </>
        )}
      </g>
    );
  }
  /* front */
  return (
    <g>
      <rect x="-9" y="-40" width="8" height="40" fill={pants} stroke="#0a0806" strokeWidth="0.6" />
      <rect x="1"  y="-40" width="8" height="40" fill={pants} stroke="#0a0806" strokeWidth="0.6" />
      <ellipse cx="-5" cy="-1" rx="6" ry="2" fill="#141c26" />
      <ellipse cx="5"  cy="-1" rx="6" ry="2" fill="#141c26" />
      <path d="M-16 -84 Q-20 -68 -18 -42 L 18 -42 Q 20 -68 16 -84 Z" fill={color} stroke="#0a0806" strokeWidth="0.8" />
      <path d="M-8 -84 Q0 -80 8 -84" stroke="#0a0806" strokeWidth="0.6" fill="none" opacity="0.5" />
      {!hideArms && (
        <>
          <path d="M-18 -80 Q-26 -66 -22 -50" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 18 -80 Q 26 -66 22 -50" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="-22" cy="-50" r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
          <circle cx=" 22" cy="-50" r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
        </>
      )}
    </g>
  );
}

/* ═══ CORPS ASSIS (sur un banc, jambes pendantes) ═══ */
function SitBody({ color, pants, skin, hideArms = false }) {
  return (
    <g>
      <path d="M-10 -30 Q-14 -6 -6 0 L 6 0 Q 14 -6 10 -30 Z" fill={pants} stroke="#0a0806" strokeWidth="0.6" />
      <ellipse cx="-5" cy="0" rx="6" ry="2" fill="#141c26" />
      <ellipse cx="5"  cy="0" rx="6" ry="2" fill="#141c26" />
      <path d="M-16 -74 Q-20 -60 -16 -32 L 16 -32 Q 20 -60 16 -74 Z" fill={color} stroke="#0a0806" strokeWidth="0.8" />
      {!hideArms && (
        <path d="M-16 -60 Q-8 -50 0 -46 Q 8 -50 16 -60" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

/* ═══ TÊTE (avec cheveux et visage — orientation) ═══ */
function Head({ hair, skin, facing, bald = false, beard = null }) {
  return (
    <g transform="translate(0,-96)">
      {/* cou */}
      <rect x="-4" y="6" width="8" height="10" fill={skin} stroke="#5a3018" strokeWidth="0.5" />
      {/* tête ovale */}
      <ellipse rx="12" ry="14" fill={skin} stroke="#5a3018" strokeWidth="0.8" />
      {/* Crâne chauve : liseré clair sur la tempe pour le volume */}
      {bald && (
        <path d="M-9 -10 Q0 -14 9 -10" stroke="#5a3018" strokeWidth="0.4" fill="none" opacity="0.6" />
      )}
      {/* Couronne de cheveux (demi-tour arrière, caractéristique des chauves) */}
      {bald && facing === "front" && (
        <path d="M-12 2 Q-13 -4 -11 -6 L-9 -6 L-9 2 Z M12 2 Q13 -4 11 -6 L9 -6 L9 2 Z" fill={hair} />
      )}
      {bald && facing === "left" && (
        <path d="M-11 -2 Q-13 -4 -10 -6 L-6 -4 L-6 2 Z" fill={hair} />
      )}
      {bald && facing === "right" && (
        <path d="M11 -2 Q13 -4 10 -6 L6 -4 L6 2 Z" fill={hair} />
      )}
      {/* Cheveux : la coupe change avec l'orientation */}
      {!bald && facing === "front" && (
        <path d="M-11 -6 q0 -14 6 -16 q4 2 5 -4 q3 4 5 -2 q4 3 6 8 q0 8 -1 14 Z" fill={hair} />
      )}
      {!bald && facing === "left" && (
        <path d="M-11 -6 q0 -14 6 -16 q6 -2 8 4 q0 12 -2 16 L-4 -2 Z" fill={hair} />
      )}
      {!bald && facing === "right" && (
        <path d="M11 -6 q0 -14 -6 -16 q-6 -2 -8 4 q0 12 2 16 L4 -2 Z" fill={hair} />
      )}
      {/* Visage : yeux + bouche différents selon l'orientation */}
      {facing === "front" && (
        <>
          <circle cx="-4" cy="0" r="1.3" fill="#0a0806" />
          <circle cx=" 4" cy="0" r="1.3" fill="#0a0806" />
          <path d="M-3 5 Q0 7 3 5" stroke="#5a2818" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </>
      )}
      {facing === "left" && (
        <>
          {/* Un œil visible (le gauche), nez qui saille à gauche */}
          <circle cx="-2" cy="0" r="1.3" fill="#0a0806" />
          <path d="M-10 2 Q-11 4 -9 5" stroke="#5a3018" strokeWidth="0.5" fill="none" />
          <path d="M-4 5 Q-1 6 1 5" stroke="#5a2818" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </>
      )}
      {facing === "right" && (
        <>
          <circle cx="2" cy="0" r="1.3" fill="#0a0806" />
          <path d="M10 2 Q11 4 9 5" stroke="#5a3018" strokeWidth="0.5" fill="none" />
          <path d="M4 5 Q1 6 -1 5" stroke="#5a2818" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Barbe (recouvre la bouche + le menton + les joues) */}
      {beard && facing === "front" && (
        <path d="M-10 4 Q-11 10 -6 13 Q0 15 6 13 Q11 10 10 4 Q7 7 4 7 Q0 9 -4 7 Q-7 7 -10 4 Z" fill={beard} stroke="#2a1808" strokeWidth="0.4" />
      )}
      {beard && facing === "left" && (
        <path d="M-9 4 Q-11 10 -6 13 Q-2 14 1 11 Q3 8 2 4 Q-2 7 -5 6 Q-7 6 -9 4 Z" fill={beard} stroke="#2a1808" strokeWidth="0.4" />
      )}
      {beard && facing === "right" && (
        <path d="M9 4 Q11 10 6 13 Q2 14 -1 11 Q-3 8 -2 4 Q2 7 5 6 Q7 6 9 4 Z" fill={beard} stroke="#2a1808" strokeWidth="0.4" />
      )}
    </g>
  );
}

/* ═══ ACCESSOIRES DE MÉTIER ═══ */
function Accessory({ kind, facing, pose }) {
  const isSit = pose === "sit";
  const bodyTop = isSit ? -74 : -84;
  const bodyBot = isSit ? -32 : -42;
  switch (kind) {
    case "apron": {
      /* Tablier blanc/beige avec attache autour du cou */
      return (
        <g>
          {/* Bavette */}
          <path d={`M-10 ${bodyTop + 10} L 10 ${bodyTop + 10} L 12 ${bodyBot} L -12 ${bodyBot} Z`}
            fill="#e8dfc8" stroke="#8a7050" strokeWidth="0.6" />
          {/* Attaches cou */}
          <path d={`M-6 ${bodyTop + 10} Q-8 ${bodyTop - 6} 0 ${bodyTop - 4}`} stroke="#8a7050" strokeWidth="0.7" fill="none" />
          <path d={`M 6 ${bodyTop + 10} Q 8 ${bodyTop - 6} 0 ${bodyTop - 4}`} stroke="#8a7050" strokeWidth="0.7" fill="none" />
          {/* Poche */}
          <rect x="-6" y={bodyTop + 22} width="12" height="8" fill="none" stroke="#8a7050" strokeWidth="0.5" />
        </g>
      );
    }
    case "coat": {
      /* Blouse blanche ouverte */
      return (
        <g>
          <path d={`M-18 ${bodyTop} L-18 ${bodyBot} L 18 ${bodyBot} L 18 ${bodyTop} Z`}
            fill="#e8eef5" stroke="#3a4048" strokeWidth="0.6" opacity="0.9" />
          {/* Revers ouvert (V au niveau du cou) */}
          <path d={`M-6 ${bodyTop + 2} L 0 ${bodyTop + 14} L 6 ${bodyTop + 2}`}
            fill="#141c26" stroke="#3a4048" strokeWidth="0.5" />
          {/* Boutons */}
          <circle cx="0" cy={bodyTop + 20} r="1" fill="#3a4048" />
          <circle cx="0" cy={bodyTop + 30} r="1" fill="#3a4048" />
          {/* Petite poche */}
          <rect x="-14" y={bodyTop + 24} width="8" height="6" fill="none" stroke="#3a4048" strokeWidth="0.4" />
        </g>
      );
    }
    case "toolbelt": {
      /* Ceinture d'outils à la taille */
      const yBelt = bodyBot - 4;
      return (
        <g>
          <rect x="-18" y={yBelt} width="36" height="6" fill="#3a2010" stroke="#0a0806" strokeWidth="0.5" />
          <rect x="-18" y={yBelt + 6} width="36" height="10" fill="#5a3818" stroke="#0a0806" strokeWidth="0.4" opacity="0.75" />
          {/* Outils suspendus */}
          <rect x="-14" y={yBelt + 5} width="3" height="10" fill="#8a5030" />
          <rect x="-4" y={yBelt + 5} width="3" height="12" fill="#5a6270" />
          <rect x="6" y={yBelt + 5} width="4" height="10" fill="#c8a848" />
        </g>
      );
    }
    case "robe": {
      /* Longue robe qui descend jusqu'aux pieds */
      return (
        <g>
          <path d={`M-16 ${bodyTop + 6} L-22 -4 L 22 -4 L 16 ${bodyTop + 6} Z`}
            fill="#3a2818" stroke="#1a0e08" strokeWidth="0.6" opacity="0.9" />
          {/* Corde à la taille */}
          <path d="M-16 -50 L 16 -50" stroke="#c8a848" strokeWidth="1.2" />
          {/* Petit médaillon */}
          <circle cx="0" cy={bodyTop + 24} r="3" fill="#c8a848" stroke="#5a4020" strokeWidth="0.5" />
        </g>
      );
    }
    case "hardhat": {
      /* Casque de chantier — position au-dessus de la tête */
      return (
        <g transform="translate(0,-108)">
          <path d="M-14 4 Q0 -14 14 4 Z" fill="#e0a848" stroke="#5a3818" strokeWidth="0.8" />
          <rect x="-14" y="4" width="28" height="3" fill="#5a3818" />
          {/* Lampe frontale */}
          <circle cx="0" cy="-2" r="2.5" fill="#fff" stroke="#5a3818" strokeWidth="0.5" />
        </g>
      );
    }
    default:
      return null;
  }
}

/* ═══ ACTIVITÉ (bras + outil + animation en boucle) ═══
   Rendue APRÈS le corps (donc devant). Dessine ses propres bras
   dans une pose adaptée à l'activité, et anime l'outil discrètement.
   L'ancre est y=0 (pieds) ; les mains typiques sont vers y=-55/-70. */
function Activity({ kind, skin, facing, pose }) {
  const isSit = pose === "sit";
  const shoulderY = isSit ? -70 : -80;
  const handY = isSit ? -50 : -55;
  const arm = (fromX, fromY, toX, toY) => (
    <path d={`M${fromX} ${fromY} Q${(fromX + toX) / 2} ${(fromY + toY) / 2 + 4} ${toX} ${toY}`}
      stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
  );
  const hand = (x, y) => <circle cx={x} cy={y} r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />;

  switch (kind) {
    case "wipe": {
      /* Essuyage : bras droit tenant un chiffon, mouvement horizontal */
      return (
        <g>
          {/* Bras gauche le long du corps */}
          {arm(-18, shoulderY, -22, handY)}
          {hand(-22, handY)}
          {/* Bras droit + chiffon animé */}
          <g style={{ transformOrigin: `18px ${shoulderY}px`, animation: "actWipe 1.4s ease-in-out infinite alternate" }}>
            {arm(18, shoulderY, 26, handY)}
            {hand(26, handY)}
            {/* Chiffon */}
            <rect x="22" y={handY - 2} width="14" height="8" fill="#f0f4ff" stroke="#3a4048" strokeWidth="0.5" transform="rotate(-8 30 -55)" />
          </g>
          <style>{`@keyframes actWipe { 0% { transform: translateX(-6px); } 100% { transform: translateX(6px); } }`}</style>
        </g>
      );
    }
    case "stir": {
      /* Cuistot : bras droit qui remue une louche au-dessus d'une casserole invisible */
      return (
        <g>
          {arm(-18, shoulderY, -22, handY)}
          {hand(-22, handY)}
          {arm(18, shoulderY, 8, handY - 8)}
          {hand(8, handY - 8)}
          {/* Manche de louche qui tourne */}
          <g style={{ transformOrigin: `8px ${handY - 8}px`, animation: "actStir 1.6s linear infinite" }}>
            <line x1="8" y1={handY - 8} x2="14" y2={handY - 24} stroke="#5a3818" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="14" cy={handY - 26} rx="5" ry="3" fill="#8a9098" stroke="#3a4048" strokeWidth="0.5" />
          </g>
          {/* Petit "S" de vapeur qui monte */}
          <path d="M4 -95 q-3 -6 0 -12 q 3 -6 0 -12" stroke="#c8d4e2" strokeWidth="0.8" fill="none" opacity="0.6">
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur="2s" repeatCount="indefinite" />
          </path>
          <style>{`@keyframes actStir { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
        </g>
      );
    }
    case "write": {
      /* Écrit : bras posé devant, main qui bouge en petites lignes */
      return (
        <g>
          {arm(-18, shoulderY, -14, handY - 4)}
          {hand(-14, handY - 4)}
          <g style={{ transformOrigin: `14px ${handY - 4}px`, animation: "actWrite 1s linear infinite alternate" }}>
            {arm(18, shoulderY, 14, handY - 4)}
            {hand(14, handY - 4)}
            {/* Plume/stylo */}
            <line x1="14" y1={handY - 4} x2="20" y2={handY - 12} stroke="#3a2010" strokeWidth="1.6" strokeLinecap="round" />
          </g>
          {/* Petit carnet devant */}
          <rect x="-4" y={handY - 2} width="20" height="10" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.5" />
          <style>{`@keyframes actWrite { 0% { transform: translate(-3px,0); } 100% { transform: translate(3px,0); } }`}</style>
        </g>
      );
    }
    case "clipboard": {
      /* Clipboard tenu à deux mains devant la poitrine */
      return (
        <g>
          {arm(-18, shoulderY, -6, handY)}
          {hand(-6, handY)}
          {arm(18, shoulderY, 6, handY)}
          {hand(6, handY)}
          <rect x="-10" y={handY - 12} width="20" height="20" fill="#c8b090" stroke="#3a2818" strokeWidth="0.7" />
          <rect x="-6" y={handY - 8} width="12" height="14" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.4" />
          <line x1="-4" y1={handY - 4} x2="4" y2={handY - 4} stroke="#3a2818" strokeWidth="0.4" />
          <line x1="-4" y1={handY} x2="4" y2={handY} stroke="#3a2818" strokeWidth="0.4" />
          <line x1="-4" y1={handY + 4} x2="4" y2={handY + 4} stroke="#3a2818" strokeWidth="0.4" />
        </g>
      );
    }
    case "wrench": {
      /* Clé à molette qui tourne (rotation continue) */
      return (
        <g>
          {arm(-18, shoulderY, -10, handY)}
          {hand(-10, handY)}
          {arm(18, shoulderY, 10, handY)}
          {hand(10, handY)}
          <g style={{ transformOrigin: `0px ${handY}px`, animation: "actWrench 2s linear infinite" }}>
            <rect x="-2" y={handY - 14} width="4" height="14" fill="#5a6270" stroke="#0a0806" strokeWidth="0.4" />
            <path d="M-6 -74 L6 -74 L6 -68 L2 -68 L2 -62 L-2 -62 L-2 -68 L-6 -68 Z" fill="#5a6270" stroke="#0a0806" strokeWidth="0.4" />
          </g>
          <style>{`@keyframes actWrench { from { transform: rotate(-30deg); } to { transform: rotate(30deg); } }`}</style>
        </g>
      );
    }
    case "hammer": {
      /* Marteau qui frappe : bras droit levé haut puis descend */
      return (
        <g>
          {arm(-18, shoulderY, -6, handY - 2)}
          {hand(-6, handY - 2)}
          <g style={{ transformOrigin: `18px ${shoulderY}px`, animation: "actHammer 0.8s ease-in-out infinite alternate" }}>
            {arm(18, shoulderY, 22, handY - 20)}
            {hand(22, handY - 20)}
            {/* Manche + tête */}
            <line x1="22" y1={handY - 20} x2="22" y2={handY - 34} stroke="#5a3818" strokeWidth="2" />
            <rect x="14" y={handY - 40} width="16" height="8" fill="#3a4048" stroke="#0a0806" strokeWidth="0.5" />
          </g>
          {/* Petit clou en cours */}
          <rect x="-8" y={handY} width="2" height="6" fill="#5a6270" />
          <style>{`@keyframes actHammer { 0% { transform: rotate(-20deg); } 100% { transform: rotate(10deg); } }`}</style>
        </g>
      );
    }
    case "torch": {
      /* Lampe torche pointée avec faisceau */
      return (
        <g>
          {arm(-18, shoulderY, -10, handY)}
          {hand(-10, handY)}
          {arm(18, shoulderY, 20, handY - 6)}
          {hand(20, handY - 6)}
          {/* Corps de la lampe */}
          <rect x="20" y={handY - 10} width="14" height="6" fill="#3a4048" stroke="#0a0806" strokeWidth="0.5" />
          <rect x="32" y={handY - 12} width="4" height="10" fill="#c8a848" />
          {/* Faisceau lumineux */}
          <path d="M36 -63 L64 -74 L64 -52 L36 -61 Z" fill="#ffd870" opacity="0.35">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.4s" repeatCount="indefinite" />
          </path>
        </g>
      );
    }
    case "pray": {
      /* Mains jointes devant la poitrine, immobiles */
      const y = isSit ? -56 : -68;
      return (
        <g>
          {arm(-18, shoulderY, -4, y)}
          {arm(18, shoulderY, 4, y)}
          <ellipse cx="0" cy={y} rx="6" ry="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
          <line x1="-3" y1={y - 2} x2="3" y2={y - 2} stroke="#8a5030" strokeWidth="0.5" />
        </g>
      );
    }
    case "crossed": {
      /* Bras croisés sur la poitrine */
      const y = handY + 6;
      return (
        <g>
          <path d={`M-18 ${shoulderY} Q-6 ${y - 4} 12 ${y}`} stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d={`M18 ${shoulderY} Q6 ${y - 4} -12 ${y}`} stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="12" cy={y} r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
          <circle cx="-12" cy={y} r="4" fill={skin} stroke="#8a5030" strokeWidth="0.6" />
        </g>
      );
    }
    case "cup": {
      /* Une main tient un gobelet à hauteur de la poitrine */
      return (
        <g>
          {arm(-18, shoulderY, -22, handY)}
          {hand(-22, handY)}
          {arm(18, shoulderY, 12, handY - 4)}
          {hand(12, handY - 4)}
          <rect x="8" y={handY - 14} width="10" height="10" rx="1" fill="#c8b090" stroke="#3a2818" strokeWidth="0.5" />
          <ellipse cx="13" cy={handY - 14} rx="5" ry="1.2" fill="#5a3818" opacity="0.7" />
          {/* Petite anse */}
          <path d="M18 -66 q4 -2 4 4 q0 4 -4 4" stroke="#3a2818" strokeWidth="0.8" fill="none" />
        </g>
      );
    }
    default:
      return null;
  }
}
