/* ============================================================
   JEU 3 — SCÈNE : « Salle temporelle abandonnée » (K-01) — Phase 4
   ------------------------------------------------------------
   Grande salle oubliée, antérieure à la machine de Léa Vermet.
   Pupitre central, trois gros disjoncteurs à relever (POWER →
   CRYSTAL → LAUNCH), poussière en suspension, lanterne UV.
   Après réactivation, pose le flag "salle_k_reactivee" qui
   servira de prérequis à la Phase 5 (voyages dans les décors
   Jeu 1).
   ============================================================ */
import { useState, useEffect } from "react";

const BREAKERS = [
  { id: "power",   label: "ALIMENTATION", sub: "secteur K · 400V" },
  { id: "crystal", label: "CRISTAL",      sub: "chambre de résonance" },
  { id: "launch",  label: "SÉQUENCE",     sub: "allumage central" },
];

export default function BunkerSalleK({ onGo, j3 }) {
  const alreadyActive = !!j3?.flags?.salle_k_reactivee;
  const [intro, setIntro] = useState(!j3?.flags?.salle_k_vue);
  const [introIdx, setIntroIdx] = useState(0);
  const [levers, setLevers] = useState(alreadyActive ? [true, true, true] : [false, false, false]);
  const [announced, setAnnounced] = useState(alreadyActive);

  const activatedCount = levers.filter(Boolean).length;
  const allOn = activatedCount === BREAKERS.length;

  useEffect(() => {
    if (allOn && !announced) {
      /* On pose le flag dès que les 3 disjoncteurs sont relevés dans
         l'ordre. On garde un petit délai pour le ressenti. */
      const t = setTimeout(() => {
        j3.setFlag("salle_k_reactivee");
        setAnnounced(true);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [allOn, announced, j3]);

  const toggleLever = (i) => {
    if (announced) return;
    if (levers[i]) return; // levier déjà levé, pas de retour en arrière
    if (i > 0 && !levers[i - 1]) return; // ordre forcé
    setLevers((L) => L.map((v, k) => k === i ? true : v));
  };

  /* Intro narrative au premier passage. */
  if (intro) {
    const lignes = [
      "L'ascenseur s'ouvre sur un couloir qui n'a pas vu de pas depuis quarante ans.",
      "La poussière danse dans le faisceau du plafonnier. Au bout, une double porte entrouverte.",
      "Dedans : un pupitre circulaire au centre d'une pièce ronde, trois gros disjoncteurs noirs, un cristal éteint au-dessus.",
      "Jorge avait raison. La vraie machine est ici — celle que Léa Vermet a copiée, discrètement, pour la sauver.",
      "Rallume-la.",
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
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="sk-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1408" />
            <stop offset="100%" stopColor="#050408" />
          </linearGradient>
          <radialGradient id="sk-crystal" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#c8a848" stopOpacity={allOn ? "0.9" : "0.15"} />
            <stop offset="100%" stopColor="#c8a848" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sk-dust" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#c8b090" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c8b090" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Mur du fond et sol */}
        <rect width="1000" height="520" fill="url(#sk-wall)" />
        <rect y="380" width="1000" height="140" fill="#0a0806" />

        {/* Plafond haut avec poutres */}
        <rect x="0" y="0" width="1000" height="40" fill="#1a0e08" />
        {[200, 500, 800].map((x, i) => (
          <rect key={i} x={x - 60} y="20" width="120" height="4" fill="#5a3818" opacity="0.75" />
        ))}

        {/* Dalle sol circulaire — pupitre central */}
        <ellipse cx="500" cy="400" rx="340" ry="40" fill="#1a1408" opacity="0.55" />
        <ellipse cx="500" cy="400" rx="340" ry="40" fill="none" stroke="#c8a848" strokeWidth="1.2" opacity="0.4" />
        {/* Dalles concentriques */}
        {[260, 180, 100].map((r, i) => (
          <ellipse key={i} cx="500" cy="400" rx={r} ry={r * 0.12} fill="none" stroke="#c8a848" strokeWidth="0.6" opacity={0.3 - i * 0.08} />
        ))}

        {/* CRISTAL suspendu au plafond */}
        <g transform="translate(500,180)">
          {/* Chaîne */}
          <line x1="0" y1="-140" x2="0" y2="-20" stroke="#5a4028" strokeWidth="1.5" />
          {/* Halo du cristal */}
          <circle r="90" fill="url(#sk-crystal)" />
          {/* Cristal (losange) */}
          <path d="M0 -34 L24 0 L0 42 L-24 0 Z"
            fill={allOn ? "#ffd870" : "#3a2818"}
            stroke={allOn ? "#fff8c8" : "#8a7050"}
            strokeWidth="1.5">
            {allOn && <animate attributeName="opacity" values="0.75;1;0.75" dur="2s" repeatCount="indefinite" />}
          </path>
          <path d="M0 -34 L24 0 L0 42" fill="none" stroke={allOn ? "#fff8c8" : "#5a4028"} strokeWidth="0.6" opacity="0.6" />
        </g>

        {/* PUPITRE central circulaire */}
        <g transform="translate(500,340)">
          <ellipse rx="60" ry="18" fill="#1a1408" stroke="#c8a848" strokeWidth="1.5" />
          <rect x="-56" y="-50" width="112" height="40" fill="#141008" stroke="#c8a848" strokeWidth="1" rx="4" />
          {/* Écran du pupitre */}
          <rect x="-48" y="-44" width="96" height="28" fill="#0a0806" stroke="#c8a848" strokeWidth="0.8" />
          <text x="0" y="-32" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8a848" letterSpacing="2">
            CHRONO · K-01
          </text>
          <text x="0" y="-22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill={allOn ? "#5eff9e" : "#8a5a10"} letterSpacing="2">
            {allOn ? "✓ EN LIGNE" : activatedCount === 0 ? "⚠ HORS SERVICE" : `… ${activatedCount}/3 CIRCUITS`}
          </text>
          {/* Petits voyants */}
          {[-30, 0, 30].map((dx, i) => (
            <circle key={i} cx={dx} cy="-6" r="2.5"
              fill={levers[i] ? "#5eff9e" : "#5a4028"}
              stroke="#0a0806" strokeWidth="0.4">
              {levers[i] && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />}
            </circle>
          ))}
        </g>

        {/* TROIS DISJONCTEURS — rangée en bas */}
        {BREAKERS.map((br, i) => {
          const x = 260 + i * 240;
          const y = 430;
          const on = levers[i];
          const canUse = !announced && !on && (i === 0 || levers[i - 1]);
          return (
            <g key={br.id} transform={`translate(${x},${y})`}
              onClick={canUse ? () => toggleLever(i) : undefined}
              style={{ cursor: canUse ? "pointer" : "default" }}>
              {/* Boîtier */}
              <rect x="-60" y="-50" width="120" height="80" fill="#28303a" stroke="#0a0806" strokeWidth="2" rx="4" />
              <rect x="-54" y="-44" width="108" height="68" fill="#141c26" stroke="#0a0806" strokeWidth="0.8" />
              {/* Levier */}
              <g transform={`translate(0, ${on ? -14 : 14}) rotate(${on ? 0 : 30})`}
                style={{ transition: "transform 0.3s" }}>
                <rect x="-6" y="-18" width="12" height="36" fill={on ? "#c8a848" : "#5a4028"} stroke="#0a0806" strokeWidth="1" rx="2" />
                <circle cy="-18" r="7" fill={on ? "#ffd870" : "#8a5a10"} stroke="#0a0806" strokeWidth="1" />
              </g>
              {/* Repères ON/OFF */}
              <text x="0" y="-30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="700"
                fill={on ? "#5eff9e" : "#5a6678"} letterSpacing="2">
                {on ? "ON" : "OFF"}
              </text>
              {/* Étiquette */}
              <rect x="-60" y="34" width="120" height="26" fill="#e8dfc8" stroke="#3a2010" strokeWidth="0.8" />
              <text x="0" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="800" fill="#1a0e08" letterSpacing="1">
                {br.label}
              </text>
              <text x="0" y="55" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5a4028">
                {br.sub}
              </text>
              {/* Pastille d'ordre */}
              <circle cx="-50" cy="-40" r="8" fill={on ? "#5eff9e" : canUse ? "#c8a848" : "#3a4048"} stroke="#0a0806" strokeWidth="0.6">
                {canUse && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />}
              </circle>
              <text x="-50" y="-37" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="800" fill="#0a0806">
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Poussière en suspension */}
        {[[200, 180], [400, 220], [600, 200], [800, 160], [320, 300], [720, 280]].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="40" ry="12" fill="url(#sk-dust)" opacity={allOn ? 0.2 : 0.5} />
            <circle cx={x} cy={y} r="1" fill="#e8dfc8" opacity="0.6">
              <animate attributeName="cy" values={`${y};${y - 10};${y}`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Plaque murale */}
        <g transform="translate(500,70)">
          <rect x="-70" y="0" width="140" height="18" fill="#e8dfc8" stroke="#3a2010" strokeWidth="1" />
          <text x="0" y="13" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="700" fill="#0a0806" letterSpacing="3">
            K-01 · PROTOTYPE
          </text>
        </g>

        {/* Titre au sol phosphorescent une fois en ligne */}
        <text x="500" y="498" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9"
          fill={allOn ? "#c8a848" : "#5a4028"} letterSpacing="3"
          opacity={allOn ? 0.8 : 0.5}>
          {allOn ? "⟡ CHRONOGRAPHE PRÊT — DESTINATION À CHOISIR" : "ORDRE : 1 · ALIMENTATION  →  2 · CRISTAL  →  3 · SÉQUENCE"}
        </text>
      </svg>

      {/* Panneau bas d'état */}
      <div style={{ maxWidth: 1200, width: "100%" }}>
        {announced ? (
          <div style={{ background: "#2a1808", border: "1px solid #c8a848", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>
              ⟡ CHRONOGRAPHE K-01 EN LIGNE
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#e8dfc8", lineHeight: 1.55, fontStyle: "italic" }}>
              La machine ronronne pour la première fois depuis quarante ans. L'écran du pupitre attend une destination.
              Il va falloir choisir vers quelle époque voyager — ce sera pour la suite.
            </p>
          </div>
        ) : (
          <div style={{ background: "#0a0806", border: "1px dashed #c8a848", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c8b090", fontStyle: "italic", lineHeight: 1.55 }}>
              Trois disjoncteurs à relever, dans l'ordre : <strong style={{ color: "#c8a848" }}>1 Alimentation</strong>, puis <strong style={{ color: "#c8a848" }}>2 Cristal</strong>, puis <strong style={{ color: "#c8a848" }}>3 Séquence</strong>. Clique sur un levier pour le lever.
            </p>
          </div>
        )}
      </div>

      <button onClick={() => onGo("elevator")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Reprendre l'ascenseur
      </button>
    </div>
  );
}
