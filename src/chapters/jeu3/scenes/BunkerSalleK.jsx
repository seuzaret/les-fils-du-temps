/* ============================================================
   JEU 3 — SCÈNE : « Salle temporelle abandonnée » (K-01) — Phase 4+5
   ------------------------------------------------------------
   Grande salle oubliée au niveau K, enfouie sous la roche. Fermée
   depuis 2047. Trois états :
     1. intro      : courte narration au premier passage
     2. noir       : la salle dans le noir, seul un vieil
                     interrupteur près de la porte luit faiblement.
     3. lit        : l'ampoule au-dessus du bureau se rallume ;
                     la scène apparaît en détail. Puzzle à 4 leviers
                     cachés dans le décor — à activer dans l'ordre
                     correspondant à la date 2047 (indice sur un
                     papier du bureau et dans les équations du
                     tableau blanc). Combinaison bonne → le tableau
                     blanc coulisse et dévoile le pupitre du portail.
     4. resolu     : panneau de destinations (Phase 5).
   ============================================================ */
import { useState, useEffect } from "react";

const CODE = [2, 0, 4, 7];

export default function BunkerSalleK({ onGo, j3 }) {
  const alreadyActive = !!j3?.flags?.salle_k_reactivee;
  const alreadyVue = !!j3?.flags?.salle_k_vue;
  const [intro, setIntro] = useState(!alreadyVue);
  const [introIdx, setIntroIdx] = useState(0);
  const [lit, setLit] = useState(alreadyActive); // lumières ON si déjà réactivée
  const [sequence, setSequence] = useState([]);  // digits cliqués dans l'ordre
  const [pulled, setPulled] = useState({});      // leviers tirés visuellement
  const [resolu, setResolu] = useState(alreadyActive);
  const [shake, setShake] = useState(false);     // feedback faux code

  /* Si séquence courante === CODE → résolu. Si prefix faux → reset. */
  useEffect(() => {
    if (sequence.length === 0) return;
    const matchesPrefix = CODE.slice(0, sequence.length).every((d, i) => d === sequence[i]);
    if (!matchesPrefix) {
      setShake(true);
      const t1 = setTimeout(() => { setShake(false); setSequence([]); setPulled({}); }, 600);
      return () => clearTimeout(t1);
    }
    if (sequence.length === CODE.length) {
      const t = setTimeout(() => {
        j3.setFlag("salle_k_reactivee");
        setResolu(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [sequence, j3]);

  const pullLever = (digit, id) => {
    if (resolu) return;
    if (pulled[id]) return;
    setPulled((p) => ({ ...p, [id]: true }));
    setSequence((s) => [...s, digit]);
  };

  /* --- Intro narrative --- */
  if (intro) {
    const lignes = [
      "L'ascenseur s'ouvre sur un couloir qui n'a pas vu de pas depuis quarante ans.",
      "L'air est lourd, chargé de poussière. Au bout, une double porte entrouverte sur une pièce noire.",
      "Jorge avait raison. Il y a quelque chose ici — tu le sens avant de le voir.",
      "Il faut rallumer.",
    ];
    const last = introIdx >= lignes.length - 1;
    return (
      <div onClick={() => (last ? (j3.setFlag("salle_k_vue"), setIntro(false)) : setIntroIdx((i) => i + 1))}
        style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.96)", zIndex: 320, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ maxWidth: 680, color: "#e8dfc8", textAlign: "center" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 4, color: "#c8a848", marginBottom: 18 }}>
            ⟡ ÉTAGE K — SALLE OUBLIÉE
          </div>
          <p style={{ fontSize: 20, lineHeight: 1.6, margin: 0 }}>{lignes[introIdx]}</p>
          <div style={{ marginTop: 24, fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050", fontStyle: "italic" }}>
            {last ? "Clique pour entrer ▸" : `${introIdx + 1} / ${lignes.length} · clique ▸`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520"
        style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%",
          filter: shake ? "hue-rotate(-15deg)" : "none",
          transition: "filter 0.2s" }}>
        <SalleKDecor lit={lit} resolu={resolu} shake={shake}
          onSwitch={() => setLit(true)}
          sequence={sequence}
          pulled={pulled}
          onLever={pullLever} />
      </svg>

      {/* Panneau bas d'état */}
      <div style={{ maxWidth: 1200, width: "100%" }}>
        {!lit ? (
          <div style={{ background: "#0a0806", border: "1px dashed #5a4028", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#8a7050", fontStyle: "italic", lineHeight: 1.55 }}>
              Il fait nuit noire. Tu devines à peine les contours de la pièce. Quelque chose luit faiblement, près de la porte sur la droite.
            </p>
          </div>
        ) : !resolu ? (
          <div style={{ background: "#2a1808", border: "1px dashed #c8a848", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>
              ⟡ SALLE K — HORS SERVICE
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#c8b090", lineHeight: 1.55, fontStyle: "italic" }}>
              Quatre leviers sont dissimulés dans la pièce. Ils portent chacun un chiffre. Il faut deviner la combinaison et les tirer dans le bon ordre. Un indice traîne sur le bureau — un autre, peut-être, dans les équations du tableau. Promène la souris sur la scène pour les débusquer.
            </p>
            {sequence.length > 0 && (
              <div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#ffd870", letterSpacing: 4 }}>
                séquence · {sequence.join(" ")}{"_".repeat(Math.max(0, CODE.length - sequence.length)).replace(/_/g, " _")}
              </div>
            )}
            {shake && (
              <div style={{ marginTop: 6, fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#e83820", fontWeight: 700, letterSpacing: 2 }}>
                ⚠ MAUVAISE COMBINAISON — réessaie
              </div>
            )}
          </div>
        ) : (
          <DestinationsPanel j3={j3} onGo={onGo} />
        )}
      </div>

      <button onClick={() => onGo("elevator")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Reprendre l'ascenseur
      </button>
    </div>
  );
}

/* ============================================================
   DÉCOR SVG — grand tableau de la salle K
   La structure reste la même, lit/resolu modulent l'affichage.
   Les leviers du puzzle sont posés à des endroits précis. Les
   autres leviers/machines autour sont purement décoratifs.
   ============================================================ */
function SalleKDecor({ lit, resolu, shake, onSwitch, sequence, pulled, onLever }) {
  return (
    <>
      <defs>
        <linearGradient id="sk-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#2a2420" : "#0a0806"} />
          <stop offset="100%" stopColor={lit ? "#141008" : "#020202"} />
        </linearGradient>
        <linearGradient id="sk-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#2a1e10" : "#060402"} />
          <stop offset="100%" stopColor={lit ? "#0e0804" : "#010101"} />
        </linearGradient>
        <linearGradient id="sk-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#d8a848" : "#2a2010"} />
          <stop offset="100%" stopColor={lit ? "#8a5820" : "#1a0e08"} />
        </linearGradient>
        <linearGradient id="sk-copper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#a86838" : "#1a1008"} />
          <stop offset="100%" stopColor={lit ? "#5a3818" : "#0a0804"} />
        </linearGradient>
        <radialGradient id="sk-bulb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c8" stopOpacity={lit ? 1 : 0} />
          <stop offset="40%" stopColor="#ffd870" stopOpacity={lit ? 0.6 : 0} />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sk-portal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity={resolu ? 0.7 : 0.08} />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sk-dust" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#c8b090" stopOpacity={lit ? 0.35 : 0} />
          <stop offset="100%" stopColor="#c8b090" stopOpacity="0" />
        </radialGradient>
        <pattern id="sk-brick" x="0" y="0" width="80" height="36" patternUnits="userSpaceOnUse">
          <rect width="80" height="36" fill={lit ? "#2a1e14" : "#060404"} />
          <path d="M0 18 L80 18 M40 0 L40 18 M0 36 L80 36 M20 18 L20 36 M60 18 L60 36"
            stroke={lit ? "#1a1008" : "#030202"} strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Mur et sol */}
      <rect width="1000" height="520" fill="url(#sk-wall)" />
      <rect width="1000" height="340" fill="url(#sk-brick)" opacity="0.5" />
      <rect y="380" width="1000" height="140" fill="url(#sk-floor)" />
      {/* Plinthe */}
      <rect y="376" width="1000" height="8" fill={lit ? "#1a1008" : "#030202"} />

      {/* Plafond + grosses poutres + tuyaux */}
      <rect y="0" width="1000" height="36" fill={lit ? "#1a0e08" : "#020202"} />
      {/* Poutres */}
      {[180, 500, 820].map((x, i) => (
        <rect key={i} x={x - 50} y="18" width="100" height="6" fill={lit ? "#3a2010" : "#060402"} />
      ))}
      {/* Gros tuyau cuivre horizontal haut */}
      <g>
        <rect x="0" y="42" width="1000" height="18" fill="url(#sk-copper)" />
        <rect x="0" y="42" width="1000" height="3" fill={lit ? "#e8a868" : "#0a0804"} opacity="0.5" />
        <rect x="0" y="57" width="1000" height="3" fill={lit ? "#2a1808" : "#010101"} opacity="0.9" />
        {/* Colliers de serrage */}
        {[120, 320, 520, 720, 920].map((x, i) => (
          <g key={i} transform={`translate(${x},50)`}>
            <rect x="-6" y="-10" width="12" height="22" fill={lit ? "#3a2010" : "#030302"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
            <circle r="2" fill={lit ? "#c8a848" : "#1a1008"} />
          </g>
        ))}
        {/* Dérivation à 90° qui plonge */}
        <rect x="920" y="60" width="18" height="200" fill="url(#sk-copper)" />
        <circle cx="929" cy="60" r="12" fill={lit ? "#8a5020" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1" />
        <circle cx="929" cy="60" r="4" fill={lit ? "#c8a848" : "#1a1008"} />
      </g>
      {/* Gros tuyau brass au sol côté droit */}
      <rect x="620" y="356" width="340" height="12" fill="url(#sk-brass)" />
      <rect x="620" y="356" width="340" height="2" fill={lit ? "#f0d890" : "#0a0804"} opacity="0.5" />

      {/* Ampoule au centre, pendue */}
      <g>
        <line x1="500" y1="24" x2="500" y2="110" stroke={lit ? "#5a3818" : "#0a0804"} strokeWidth="1.2" />
        <circle cx="500" cy="110" r="36" fill="url(#sk-bulb)" />
        <circle cx="500" cy="110" r="12" fill={lit ? "#ffd870" : "#141008"} stroke={lit ? "#8a5020" : "#1a0e08"} strokeWidth="1.2">
          {lit && <animate attributeName="opacity" values="0.85;1;0.9" dur="4s" repeatCount="indefinite" />}
        </circle>
        <path d="M498 100 Q500 94 502 100" stroke={lit ? "#8a5020" : "#0a0804"} strokeWidth="0.8" fill="none" />
      </g>

      {/* Toiles d'araignée dans les coins */}
      <Cobweb cx="18" cy="42" r={60} lit={lit} />
      <Cobweb cx="982" cy="42" r={70} lit={lit} />
      <Cobweb cx="18" cy="520" r={48} lit={lit} />

      {/* ═══ GAUCHE : PORTAIL TEMPOREL ═══ */}
      <g transform="translate(140,260)">
        {/* Halo */}
        <circle r="130" fill="url(#sk-portal)" />
        {/* Arche en pierre massive */}
        <path d="M-90 110 L-90 -20 Q-90 -100 0 -100 Q90 -100 90 -20 L90 110 L68 110 L68 -20 Q68 -78 0 -78 Q-68 -78 -68 -20 L-68 110 Z"
          fill={lit ? "#3a2818" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="2" />
        {/* Blocs de pierre taillés sur l'arche */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = -Math.PI / 2 + (i - 5.5) * (Math.PI / 12);
          const x = Math.cos(a) * 78;
          const y = Math.sin(a) * 78;
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="none" stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
          );
        })}
        {/* Verre terne au centre */}
        <ellipse rx="56" ry="76" fill={lit ? "#0a1420" : "#020408"} stroke={lit ? "#1a2838" : "#000"} strokeWidth="1" />
        {/* Reflet oblique */}
        <path d="M-30 -60 L-10 -70 L30 50 L10 60 Z" fill="#e8eef5" opacity={lit ? 0.08 : 0} />
        {/* Runes ternes autour */}
        {lit && [[-70, -40, "⚛"], [70, -40, "✦"], [-70, 70, "⟡"], [70, 70, "☌"]].map(([x, y, s], i) => (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="14" fill="#5a4028" opacity="0.6">{s}</text>
        ))}
        {/* Plaque */}
        <rect x="-50" y="112" width="100" height="14" fill={lit ? "#1a0e08" : "#010101"} stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="0.8" />
        <text x="0" y="123" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8"
          fill={lit ? "#c8a848" : "#2a2010"} letterSpacing="3">
          PORTAIL · HORS SERVICE
        </text>
      </g>

      {/* Pile de câbles qui serpentent du portail vers le centre */}
      <path d="M220 360 Q320 380 420 370 Q500 365 540 358" stroke={lit ? "#2a1808" : "#030202"} strokeWidth="4" fill="none" />
      <path d="M220 370 Q340 388 450 378 Q520 374 560 368" stroke={lit ? "#1a0e08" : "#020101"} strokeWidth="3" fill="none" />

      {/* ═══ CENTRE-FOND : BUREAU DE RECHERCHE ABANDONNÉ ═══ */}
      <g transform="translate(500,310)">
        {/* Chaise à l'arrière */}
        <g transform="translate(0,-60)">
          <rect x="-18" y="0" width="36" height="48" fill={lit ? "#2a1808" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
          <rect x="-20" y="-20" width="40" height="22" fill={lit ? "#3a2010" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        </g>
        {/* Bureau */}
        <rect x="-120" y="0" width="240" height="20" fill={lit ? "#5a3818" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1.2" />
        <rect x="-120" y="0" width="240" height="4" fill={lit ? "#8a5820" : "#0a0804"} opacity="0.5" />
        {/* Pieds */}
        <rect x="-112" y="20" width="12" height="60" fill={lit ? "#3a2010" : "#060402"} />
        <rect x="100" y="20" width="12" height="60" fill={lit ? "#3a2010" : "#060402"} />
        {/* Tiroir latéral */}
        <rect x="-112" y="22" width="60" height="36" fill={lit ? "#3a2010" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <circle cx="-82" cy="40" r="2.5" fill={lit ? "#c8a848" : "#1a1008"} />

        {/* Lampe de bureau cassée (abat-jour penché) */}
        <g transform="translate(-80,-10)">
          <circle r="3" fill={lit ? "#5a3818" : "#060402"} />
          <line x1="0" y1="0" x2="-8" y2="-20" stroke={lit ? "#5a3818" : "#060402"} strokeWidth="1.5" />
          <path d="M-16 -24 L0 -24 L-4 -34 L-12 -34 Z" fill={lit ? "#8a5020" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" transform="rotate(-20 -8 -29)" />
        </g>
        {/* Moniteur CRT massif */}
        <g transform="translate(10,-70)">
          <rect x="-56" y="0" width="112" height="68" fill={lit ? "#8a8070" : "#0a0a08"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1.4" rx="4" />
          <rect x="-48" y="6" width="96" height="52" fill={lit ? "#0a1808" : "#010101"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.8" />
          {lit && (
            <>
              <text x="0" y="24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e" letterSpacing="1">BOOT 2047</text>
              <text x="0" y="36" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5a6678">[err 0x7F] no signal</text>
              <text x="0" y="48" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5a6678">memory dump : --:--</text>
              <rect x="-44" y="52" width="2" height="4" fill="#5eff9e">
                <animate attributeName="opacity" values="0;1;0" dur="1.1s" repeatCount="indefinite" />
              </rect>
            </>
          )}
          {/* Boutons du CRT */}
          <circle cx="-42" cy="62" r="2" fill={lit ? "#c8a848" : "#1a1008"} />
          <circle cx="-32" cy="62" r="2" fill={lit ? "#5a6270" : "#0a0804"} />
        </g>
        {/* Clavier massif */}
        <rect x="-50" y="4" width="100" height="12" fill={lit ? "#5a5a5a" : "#060606"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.5" rx="2" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={-48 + i * 7} y={6} width="6" height="4" fill={lit ? "#3a3a3a" : "#030303"} />
        ))}

        {/* Papier froissé avec un indice visible sous lumière */}
        <g transform="translate(60,8) rotate(14)">
          <rect x="-18" y="-10" width="36" height="20" fill={lit ? "#e8dfc8" : "#1a1810"} stroke={lit ? "#8a7050" : "#1a1810"} strokeWidth="0.5" />
          <line x1="-14" y1="-5" x2="14" y2="-5" stroke={lit ? "#5a4028" : "#0a0804"} strokeWidth="0.3" opacity="0.7" />
          <text x="0" y="2" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="5"
            fill={lit ? "#3a2010" : "#1a1810"} fontStyle="italic">
            année de scellement :
          </text>
          <text x="0" y="8" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="7"
            fontWeight="700" fill={lit ? "#8a2010" : "#1a1810"}>
            2 0 4 7
          </text>
        </g>

        {/* Tasse renversée + flaque */}
        <ellipse cx="-50" cy="18" rx="12" ry="3" fill={lit ? "#3a2010" : "#060402"} opacity="0.65" />
        <path d="M-56 10 L-44 10 L-48 20 L-52 20 Z" fill={lit ? "#8a7050" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.4" transform="rotate(60 -50 15)" />

        {/* Toile d'araignée au-dessus du bureau */}
        <Cobweb cx={-120} cy={-80} r={56} lit={lit} />
      </g>

      {/* ═══ MUR DU FOND : TABLEAU BLANC avec équations ═══ */}
      <TableauBlanc lit={lit} resolu={resolu} />

      {/* ═══ MACHINES & LEVIERS « EN BAZAR » ═══ */}
      {/* Oscilloscope à côté du bureau */}
      <g transform="translate(680,320)">
        <rect x="-30" y="0" width="60" height="42" fill={lit ? "#3a4048" : "#060606"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1" rx="2" />
        <circle r="16" cx="-6" cy="20" fill={lit ? "#0a1a0a" : "#020202"} stroke={lit ? "#5eff9e" : "#1a1008"} strokeWidth="1.2" />
        {lit && (
          <path d="M-20 20 Q-14 10 -8 20 Q-2 30 4 20 Q10 10 16 20"
            stroke="#5eff9e" strokeWidth="0.9" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.3s" repeatCount="indefinite" />
          </path>
        )}
        <rect x="14" y="8" width="12" height="6" fill={lit ? "#c8a848" : "#1a1008"} />
        <rect x="14" y="18" width="12" height="6" fill={lit ? "#5a6270" : "#0a0804"} />
      </g>

      {/* Bobine Tesla décorative */}
      <g transform="translate(830,330)">
        <rect x="-14" y="20" width="28" height="12" fill={lit ? "#3a2010" : "#060402"} />
        <rect x="-8" y="-10" width="16" height="34" fill={lit ? "#8a5020" : "#0a0804"} />
        <circle cy="-18" r="12" fill={lit ? "#5a6270" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        {lit && (
          <path d="M0 -30 L-6 -40 L4 -36 L-8 -48" stroke="#7fd8ff" strokeWidth="0.9" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0;0.9;0" dur="1.7s" repeatCount="indefinite" />
          </path>
        )}
      </g>

      {/* Groupe électrogène rouillé en bas gauche */}
      <g transform="translate(300,370)">
        <rect x="-40" y="0" width="80" height="24" fill={lit ? "#5a3818" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1" />
        <rect x="-30" y="-14" width="60" height="14" fill={lit ? "#3a2010" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <circle cx="-20" cy="7" r="4" fill={lit ? "#8a5020" : "#0a0804"} />
        <circle cx="20" cy="7" r="4" fill={lit ? "#8a5020" : "#0a0804"} />
        {/* Rouille sur les coins */}
        <path d="M-40 24 L-32 24 L-36 20 Z" fill={lit ? "#8a3820" : "#060402"} opacity="0.7" />
      </g>

      {/* Caisses en bois empilées devant le portail */}
      <g transform="translate(280,370)">
        <rect x="-20" y="0" width="40" height="20" fill={lit ? "#5a3818" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <rect x="-14" y="-18" width="36" height="18" fill={lit ? "#5a3818" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <line x1="-20" y1="10" x2="20" y2="10" stroke={lit ? "#3a2010" : "#060402"} strokeWidth="0.5" />
        <text x="0" y="14" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill={lit ? "#8a5020" : "#1a1008"}>
          LAB-K
        </text>
      </g>

      {/* ═══ 4 LEVIERS CACHÉS (interactifs) ═══ */}
      {/* L1 : digit 2 — collier du tuyau haut (x=320) */}
      <HiddenLever x={320} y={80} digit={2} id="L1"
        hint="dans le collier du tuyau de cuivre"
        lit={lit} active={pulled["L1"]} onClick={() => onLever(2, "L1")} />
      {/* L2 : digit 0 — sous le bureau (tiroir) */}
      <HiddenLever x={430} y={360} digit={0} id="L2"
        hint="attaché au tiroir latéral du bureau"
        lit={lit} active={pulled["L2"]} onClick={() => onLever(0, "L2")} />
      {/* L3 : digit 4 — sur le groupe électrogène */}
      <HiddenLever x={340} y={356} digit={4} id="L3"
        hint="greffé au groupe électrogène rouillé"
        lit={lit} active={pulled["L3"]} onClick={() => onLever(4, "L3")} />
      {/* L4 : digit 7 — à côté de la bobine Tesla */}
      <HiddenLever x={790} y={340} digit={7} id="L4"
        hint="vissé contre la bobine, à droite"
        lit={lit} active={pulled["L4"]} onClick={() => onLever(7, "L4")} />

      {/* ═══ PORTE ANCIENNE À DROITE ═══ */}
      <g transform="translate(930,180)">
        <path d="M-40 180 L-40 -20 Q-40 -40 0 -40 Q40 -40 40 -20 L40 180 Z"
          fill={lit ? "#5a3818" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="2" />
        {/* Lamelles bois */}
        {[-30, -14, 2, 18].map((x, i) => (
          <line key={i} x1={x} y1="-20" x2={x} y2="180" stroke={lit ? "#3a2010" : "#060402"} strokeWidth="1" />
        ))}
        {/* Pentures en fer */}
        {[-10, 60, 150].map((y, i) => (
          <rect key={i} x="-40" y={y} width="80" height="12" fill={lit ? "#3a4048" : "#060606"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        ))}
        {/* Clous */}
        {[-10, 60, 150].map((y) => (
          <g key={y}>
            <circle cx="-28" cy={y + 6} r="2" fill={lit ? "#8a9098" : "#1a1a1a"} />
            <circle cx="28" cy={y + 6} r="2" fill={lit ? "#8a9098" : "#1a1a1a"} />
          </g>
        ))}
        {/* Poignée en anneau */}
        <circle cx="-20" cy="90" r="8" fill="none" stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="2.5" />
        {/* Plaque gravée */}
        <rect x="-30" y="30" width="60" height="12" fill={lit ? "#141008" : "#010101"} stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="0.8" />
        <text x="0" y="40" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7"
          fill={lit ? "#c8a848" : "#2a2010"} letterSpacing="3">
          K-01
        </text>
      </g>

      {/* ═══ INTERRUPTEUR près de la porte (phase noir) ═══ */}
      {!lit && (
        <g transform="translate(866,290)"
          onClick={(e) => { e.stopPropagation(); onSwitch(); }}
          style={{ cursor: "pointer" }}>
          <rect x="-14" y="-18" width="28" height="36" fill="#141008" stroke="#5a4028" strokeWidth="1" rx="2" />
          <circle r="7" fill="#141008" stroke="#c8a848" strokeWidth="1.2">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="#ffd870">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#8a7050" letterSpacing="2">
            INTERRUPTEUR
          </text>
        </g>
      )}

      {/* Mouchetures de poussière en suspension (lumière seulement) */}
      {lit && [[200, 180], [400, 220], [600, 200], [800, 160], [320, 300], [720, 280]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="30" ry="8" fill="url(#sk-dust)" opacity="0.3" />
          <circle cx={x} cy={y} r="1" fill="#e8dfc8" opacity="0.5">
            <animate attributeName="cy" values={`${y};${y - 10};${y}`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Plaque murale K-01 au centre haut */}
      {lit && (
        <g transform="translate(500,74)">
          <rect x="-60" y="0" width="120" height="16" fill="#141008" stroke="#c8a848" strokeWidth="1" />
          <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700"
            fill="#c8a848" letterSpacing="3">
            K-01 · PROTOTYPE
          </text>
        </g>
      )}
    </>
  );
}

/* ============================================================
   Tableau blanc : équations qui laissent deviner "2047", puis
   coulisse une fois le code trouvé pour révéler le pupitre.
   ============================================================ */
function TableauBlanc({ lit, resolu }) {
  return (
    <g transform="translate(500,180)">
      {/* Cadre */}
      <rect x="-170" y="-80" width="340" height="130" fill={lit ? "#141008" : "#030202"} stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="2" />
      {/* Panneau coulissant (le "tableau blanc" lui-même) */}
      <g style={{ transition: "transform 1.4s cubic-bezier(0.3,0,0.3,1)",
        transform: resolu ? "translateX(-320px)" : "translateX(0)" }}>
        <rect x="-166" y="-76" width="332" height="122" fill={lit ? "#e8dfc8" : "#0a0804"} stroke={lit ? "#5a4028" : "#1a1008"} strokeWidth="0.6" />
        {/* Rails */}
        <rect x="-170" y="-82" width="340" height="4" fill={lit ? "#3a2010" : "#060402"} />
        <rect x="-170" y="48" width="340" height="4" fill={lit ? "#3a2010" : "#060402"} />
        {/* Équations */}
        {lit && (
          <>
            <text x="-156" y="-56" fontFamily="Georgia, serif" fontSize="12" fill="#1a0e08" fontStyle="italic">
              ∂t/∂τ · η(ρ) = 2
            </text>
            <text x="-156" y="-32" fontFamily="Georgia, serif" fontSize="12" fill="#1a0e08" fontStyle="italic">
              ψ(0) = ψ(T) ⇒ T ≡ 0 (mod 10)
            </text>
            <text x="-156" y="-6" fontFamily="Georgia, serif" fontSize="12" fill="#1a0e08" fontStyle="italic">
              Δν · 10³ = 4,0 kHz
            </text>
            <text x="-156" y="20" fontFamily="Georgia, serif" fontSize="12" fill="#1a0e08" fontStyle="italic">
              Σ(E) : 7 modes · scellé.
            </text>
            {/* Petite note en bas à droite entourée */}
            <g transform="translate(100,30)">
              <ellipse rx="30" ry="12" fill="none" stroke="#c81010" strokeWidth="1.2" />
              <text x="0" y="4" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fontWeight="700" fill="#c81010">
                2047 →
              </text>
            </g>
          </>
        )}
      </g>
      {/* Derrière : pupitre de contrôle du portail — visible après résolution */}
      {resolu && (
        <g>
          <rect x="-160" y="-70" width="320" height="110" fill="#141008" stroke="#5eff9e" strokeWidth="1.5" />
          <text x="0" y="-54" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5eff9e" letterSpacing="4">
            PUPITRE PORTAIL · K-01
          </text>
          <line x1="-150" y1="-46" x2="150" y2="-46" stroke="#5eff9e" strokeWidth="0.4" opacity="0.5" />
          {/* Simule des cadrans */}
          {[-100, -30, 40, 110].map((x, i) => (
            <g key={i} transform={`translate(${x},0)`}>
              <circle r="18" fill="#0a1a10" stroke="#5eff9e" strokeWidth="1" />
              <line x1="0" y1="0" x2={Math.cos(i) * 14} y2={Math.sin(i) * 14} stroke="#5eff9e" strokeWidth="1.4" />
              <circle r="2" fill="#5eff9e">
                <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.4 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          <text x="0" y="38" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#5eff9e">
            ✓ EN LIGNE — DESTINATION À CHOISIR
          </text>
        </g>
      )}
    </g>
  );
}

/* ============================================================
   Lever caché : petit sprite discret quand lit=false, visible mais
   fondu dans le décor quand lit=true. Tooltip au survol avec hint.
   ============================================================ */
function HiddenLever({ x, y, digit, id, hint, lit, active, onClick }) {
  const [hover, setHover] = useState(false);
  if (!lit) return null;
  return (
    <g transform={`translate(${x},${y})`}
      style={{ cursor: active ? "default" : "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={active ? undefined : (e) => { e.stopPropagation(); onClick?.(); }}>
      {/* Hit area invisible plus grand pour la souris */}
      <circle r="20" fill="transparent" />
      {/* Petit socle */}
      <rect x="-7" y="-4" width="14" height="12" fill="#28303a" stroke="#0a0e14" strokeWidth="0.6" />
      {/* Manette */}
      <g style={{ transition: "transform 0.3s", transform: `rotate(${active ? 25 : -25}deg)`, transformOrigin: "0 2px" }}>
        <rect x="-1.5" y="-14" width="3" height="18" fill={active ? "#ffd870" : "#5a4028"} stroke="#0a0806" strokeWidth="0.5" rx="1" />
        <circle cx="0" cy="-14" r="3" fill={active ? "#ffd870" : "#8a5a10"} stroke="#0a0806" strokeWidth="0.5" />
      </g>
      {/* Petit halo discret quand pas encore activé — doit se repérer sans être criard */}
      {!active && (
        <circle r="10" fill="none" stroke="#ffd870" strokeWidth="0.6" opacity={hover ? 0.9 : 0.35}>
          <animate attributeName="opacity" values={hover ? "0.6;1;0.6" : "0.15;0.4;0.15"} dur="2.2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Pastille digit (visible seulement si actif ou survolé) */}
      {(hover || active) && (
        <g transform="translate(0,-28)">
          <rect x="-14" y="-10" width="28" height="16" fill="#141008" stroke="#c8a848" strokeWidth="0.8" rx="2" />
          <text x="0" y="2" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="900"
            fill={active ? "#5eff9e" : "#ffd870"}>
            {digit}
          </text>
          {hover && !active && (
            <text x="0" y="20" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8b090">
              « levier · {hint} »
            </text>
          )}
        </g>
      )}
    </g>
  );
}

/* ============================================================
   Petite toile d'araignée dans un coin (quart de cercle)
   ============================================================ */
function Cobweb({ cx, cy, r = 50, lit }) {
  const col = lit ? "#8a8070" : "#1a1a1a";
  const op = lit ? 0.4 : 0.15;
  return (
    <g transform={`translate(${cx},${cy})`} opacity={op}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 4) * (Math.PI / 2);
        return (
          <line key={i} x1="0" y1="0" x2={Math.cos(a) * r} y2={Math.sin(a) * r}
            stroke={col} strokeWidth="0.4" />
        );
      })}
      {[0.3, 0.5, 0.7, 0.9].map((t, j) => (
        <path key={j}
          d={`M ${r * t} 0 Q ${Math.cos(Math.PI / 4) * r * t * 1.05} ${Math.sin(Math.PI / 4) * r * t * 1.05} 0 ${r * t}`}
          stroke={col} strokeWidth="0.3" fill="none" />
      ))}
    </g>
  );
}

/* ============================================================
   PHASE 5 — Panneau de destinations (identique à avant)
   ============================================================ */
const DESTINATIONS = [
  { id: "gutenberg", annee: "~1450", lieu: "Mayence",
    titre: "L'imprimerie de Gutenberg",
    pitch: "Vérifier si c'est bien Johannes Gutenberg qui a inventé la presse à caractères mobiles en métal, et non un moine chinois anonyme." },
  { id: "chappe",    annee: "1794",  lieu: "Paris–Lille",
    titre: "Le télégraphe de Chappe",
    pitch: "Vérifier si c'est Claude Chappe qui a tendu le premier télégraphe (optique, à bras articulés), et non Samuel Morse à Washington." },
  { id: "marconi",   annee: "1901",  lieu: "Cornouailles → Terre-Neuve",
    titre: "Le signal transatlantique de Marconi",
    pitch: "Vérifier si c'est bien Guglielmo Marconi qui a envoyé le premier signal radio à travers l'Atlantique, et non la BBC en 1920." },
];

function DestinationsPanel({ j3, onGo }) {
  const flags = j3?.flags || {};
  const done = DESTINATIONS.map((d) => !!flags[`voyageK_${d.id}_done`]);
  const nbDone = done.filter(Boolean).length;
  const allDone = nbDone === DESTINATIONS.length;
  useEffect(() => {
    if (allDone && !flags.phase5_done) j3.setFlag("phase5_done");
  }, [allDone, flags.phase5_done, j3]);
  const launchVoyage = (id) => {
    j3.setFlag("voyageK_target", id);
    onGo("voyageK");
  };
  return (
    <div style={{ background: "#2a1808", border: "1px solid #c8a848", borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>
          ⟡ PUPITRE K-01 — DESTINATIONS DISPONIBLES
        </div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050" }}>
          {nbDone} / {DESTINATIONS.length} vérifiée{nbDone > 1 ? "s" : ""}
        </div>
      </div>
      <p style={{ margin: "8px 0 12px", fontSize: 12.5, color: "#c8b090", lineHeight: 1.5, fontStyle: "italic" }}>
        Trois dossiers falsifiés dans les Archives. Trois destinations pour aller vérifier sur place ce qui a vraiment eu lieu.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
        {DESTINATIONS.map((d, i) => {
          const isDone = done[i];
          return (
            <button key={d.id} onClick={() => !isDone && launchVoyage(d.id)}
              disabled={isDone}
              style={{
                textAlign: "left",
                background: isDone ? "#0e2818" : "#141008",
                color: isDone ? "#5eff9e" : "#e8dfc8",
                border: `1px solid ${isDone ? "#5eff9e" : "#c8a848"}`,
                borderRadius: 8, padding: "10px 12px",
                cursor: isDone ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: isDone ? 0.8 : 1,
              }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: isDone ? "#5eff9e" : "#c8a848" }}>
                {isDone ? "✓ VÉRIFIÉ" : `DESTINATION ${i + 1}`}
              </div>
              <div style={{ fontFamily: "Palatino, Georgia, serif", fontSize: 14.5, fontWeight: 700, marginTop: 4 }}>
                {d.titre}
              </div>
              <div style={{ fontSize: 11, color: "#8a7050", marginTop: 2 }}>
                {d.annee} · {d.lieu}
              </div>
              <div style={{ fontSize: 11.5, marginTop: 6, lineHeight: 1.45, color: isDone ? "#8affb0" : "#c8b090" }}>
                {d.pitch}
              </div>
            </button>
          );
        })}
      </div>
      {allDone && (
        <div style={{ marginTop: 12, background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#5eff9e", fontWeight: 800 }}>
            ✓ TROIS DOSSIERS RESTAURÉS
          </div>
          <p style={{ margin: "6px 0 10px", fontSize: 12.5, color: "#c8ffdd", lineHeight: 1.55, fontStyle: "italic" }}>
            Tu as vu de tes yeux ce que Jorge essayait de garder vrai. Les sources ne sont plus réécrites — elles sont, dans ta mémoire, à leur juste place.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => onGo("epilogueJeu3")}
              style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2 }}>
              ⟡ Remonter rapporter ▸
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
