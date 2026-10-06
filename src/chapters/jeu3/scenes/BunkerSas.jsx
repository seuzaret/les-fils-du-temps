import { useState } from "react";

/* ============================================================
   JEU 3 — SCÈNE : « Sas de voyage temporel » (sous-sol Archives)
   ------------------------------------------------------------
   Machine temporelle cachée construite par Léa Vermet avant 2047.
   Interface mécanique, pas de MARTINE. Au premier passage, lecture
   du message d'accueil de Léa (bande magnéto). Ensuite, le joueur
   voit le cadran réglé sur l'année cible du dossier actif, abaisse
   3 leviers (sécurité, chauffe, propulsion) puis part en voyage.
   ============================================================ */
export default function BunkerSas({ onGo, j3 }) {
  const dossier = j3?.activeDossier;
  const leaHeard = !!j3?.flags?.lea_intro_heard;
  const [intro, setIntro] = useState(!leaHeard);
  const [introIdx, setIntroIdx] = useState(0);
  const [levers, setLevers] = useState([false, false, false]);

  /* Intro Léa : prioritaire sur tout le reste au premier passage.
     Lu une seule fois, pose le flag puis bascule à la suite. */
  if (intro) {
    const lignes = j3.missions.appel.leaIntro;
    const last = introIdx >= lignes.length - 1;
    const nextLigne = () => {
      if (last) {
        j3.setFlag("lea_intro_heard");
        setIntro(false);
      } else {
        setIntroIdx((i) => i + 1);
      }
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", padding: 20, boxSizing: "border-box", background: "#050810" }}>
        <SasDecor idle />
        <div style={{ background: "#141020", border: "1px solid #c8a848", borderRadius: 10, padding: "14px 18px", maxWidth: 680 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8a848", marginBottom: 8 }}>
            📼 BANDE MAGNÉTO · LÉA VERMET — 15 JUIN 2046
          </div>
          <p style={{ margin: 0, fontSize: 15, color: "#e8eef5", lineHeight: 1.6 }}>
            « {lignes[introIdx]} »
          </p>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a" }}>
              {introIdx + 1} / {lignes.length}
            </div>
            <button onClick={nextLigne}
              style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              {last ? (dossier ? "Lancer la machine ▸" : "Remonter aux Archives ▸") : "Suite ▸"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Pas de dossier actif : le joueur a entendu l'intro de Léa mais n'a
     pas encore choisi de dossier aux Archives. On lui dit de remonter. */
  if (!dossier) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", padding: 20, boxSizing: "border-box" }}>
        <SasDecor idle />
        <div style={{ background: "#0a0e14", border: "1px dashed #c8a848", borderRadius: 10, padding: "12px 16px", maxWidth: 620, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c8d4e2", lineHeight: 1.55 }}>
            La machine est en veille. Pour l'activer, remonte aux Archives et choisis un dossier à vérifier.
          </p>
        </div>
        <button onClick={() => onGo("archives")}
          style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          ← Retour aux Archives
        </button>
      </div>
    );
  }

  /* Cadran + leviers. Les 3 leviers doivent être abaissés dans l'ordre
     (0 → 1 → 2) pour que le voyage se lance. */
  const toggle = (i) => {
    if (i > 0 && !levers[i - 1]) return; // ordre forcé
    setLevers((L) => L.map((v, k) => k === i ? !v : v));
  };
  const ready = levers.every(Boolean);
  const LEVER_LABELS = ["SÉCURITÉ", "CHAUFFE", "PROPULSION"];
  const LEVER_HELP = [
    "1. Verrouillage de la cabine (SÉCURITÉ)",
    "2. Mise en chauffe du condensateur (CHAUFFE)",
    "3. Enclenchement du voyage (PROPULSION)",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: 10, boxSizing: "border-box" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848" }}>
        ⚙ MACHINE DE LÉA · CADRAN RÉGLÉ SUR {dossier.anneeCible}
      </div>
      <SasDecor idle={false} annee={dossier.anneeCible} lieu={dossier.lieuCible} levers={levers} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {LEVER_LABELS.map((label, i) => {
          const canPull = i === 0 || levers[i - 1];
          const pulled = levers[i];
          return (
            <button key={i} onClick={() => toggle(i)} disabled={!canPull && !pulled}
              style={{
                background: pulled ? "#5eff9e" : canPull ? "#2a1638" : "#1a141c",
                color: pulled ? "#06110b" : canPull ? "#c8a848" : "#5a4a6a",
                border: `1px solid ${pulled ? "#5eff9e" : "#7a3ca8"}`,
                borderRadius: 8, padding: "8px 14px",
                fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 800,
                cursor: canPull || pulled ? "pointer" : "default",
                letterSpacing: 2, minWidth: 150,
              }}>
              {pulled ? "✓ " : "☐ "}{label}
            </button>
          );
        })}
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd", textAlign: "center", maxWidth: 520 }}>
        {LEVER_HELP[levers.findIndex((v) => !v) === -1 ? 2 : levers.findIndex((v) => !v)]}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button onClick={() => { j3.cancelDossier(); onGo("archives"); }}
          style={{ background: "#141b26", color: "#8fa3bd", border: "1px solid #3a4048", borderRadius: 10, padding: "9px 16px", fontSize: 12, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
          ← Annuler
        </button>
        <button onClick={() => onGo("voyage")} disabled={!ready}
          style={{
            background: ready ? "#5eff9e" : "#2a3648",
            color: ready ? "#06110b" : "#5a6678",
            border: "none", borderRadius: 10, padding: "11px 22px",
            fontSize: 13, fontWeight: 800, cursor: ready ? "pointer" : "default",
            fontFamily: "ui-monospace,monospace", letterSpacing: 2,
            boxShadow: ready ? "0 0 18px rgba(94,255,158,0.4)" : "none",
          }}>
          ⏵ VOYAGER EN {dossier.anneeCible}
        </button>
      </div>
    </div>
  );
}

/* --------- Décor du sas (SVG) --------- */
function SasDecor({ idle, annee, lieu, levers = [] }) {
  return (
    <svg viewBox="0 0 1000 400" style={{ display: "block", width: "100%", maxHeight: 480 }}>
      <defs>
        <linearGradient id="sas-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2420" />
          <stop offset="100%" stopColor="#0e0806" />
        </linearGradient>
        <radialGradient id="sas-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c8a848" stopOpacity={idle ? "0.15" : "0.55"} />
          <stop offset="100%" stopColor="#c8a848" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="400" fill="url(#sas-wall)" />

      {/* Tuyauterie cuivre et vapeur */}
      {[70, 150, 850, 930].map((x, i) => (
        <g key={i}>
          <rect x={x} y="20" width="14" height="360" fill="#8a5030" stroke="#3a1808" strokeWidth="0.8" />
          <rect x={x + 2} y="20" width="4" height="360" fill="#c8a848" opacity="0.6" />
          {[80, 180, 280].map((y) => (
            <circle key={y} cx={x + 7} cy={y} r="4" fill="#c8a848" stroke="#3a1808" strokeWidth="0.6" />
          ))}
        </g>
      ))}

      {/* Grand cadran central */}
      <g transform="translate(500,180)">
        <circle r="140" fill="#1a1408" stroke="#8a5030" strokeWidth="6" />
        <circle r="130" fill="#2a1808" stroke="#c8a848" strokeWidth="1" />
        <circle r="150" fill="url(#sas-glow)" />
        {/* Graduations années */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = i % 3 === 0 ? 110 : 118;
          const r2 = 128;
          return (
            <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
              stroke={i % 3 === 0 ? "#c8a848" : "#5a4028"} strokeWidth={i % 3 === 0 ? 1.5 : 0.8} />
          );
        })}
        {/* Chiffres saillants */}
        {[-1800, 1400, 1800, 1900, 2000, 2047].map((y, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          return (
            <text key={y} x={Math.cos(a) * 95} y={Math.sin(a) * 95 + 4} textAnchor="middle"
              fontFamily="ui-monospace,monospace" fontSize="10" fill="#c8a848">
              {y}
            </text>
          );
        })}
        {/* Aiguille (pointe sur l'année cible si fournie) */}
        {annee && (
          <g style={{ transformOrigin: "0 0", transform: `rotate(${((annee - 1700) / 400) * 360 - 90}deg)`, transition: "transform 1.5s cubic-bezier(.4,0,.2,1)" }}>
            <path d="M0 0 L0 -120 L4 -112 L-4 -112 Z" fill="#e83820" stroke="#1a0e08" strokeWidth="1" />
            <circle r="6" fill="#c8a848" stroke="#1a0e08" strokeWidth="1" />
          </g>
        )}
        {!annee && (
          <g>
            <path d="M0 0 L0 -120" stroke="#5a4028" strokeWidth="2" />
            <circle r="6" fill="#5a4028" />
          </g>
        )}
        {/* Vitre affichage numérique */}
        {annee && (
          <g transform="translate(0,52)">
            <rect x="-56" y="-10" width="112" height="20" fill="#0a0e14" stroke="#c8a848" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="800" fill="#5eff9e" letterSpacing="2">
              {annee}
            </text>
          </g>
        )}
        {lieu && (
          <text x="0" y="110" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#8fa3bd" letterSpacing="1">
            {lieu}
          </text>
        )}
      </g>

      {/* 3 ampoules de leviers (haut du décor) */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${260 + i * 240},50)`}>
          <circle r="12" fill={levers[i] ? "#5eff9e" : "#2a1638"} stroke="#c8a848" strokeWidth="1.5">
            {levers[i] && <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" repeatCount="indefinite" />}
          </circle>
          <text y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#c8a848" letterSpacing="1">
            {["SÉCURITÉ", "CHAUFFE", "PROPULSION"][i]}
          </text>
        </g>
      ))}

      {/* Plaque de laiton signée */}
      <g transform="translate(500,355)">
        <rect x="-120" y="-14" width="240" height="24" fill="#8a5030" stroke="#3a1808" strokeWidth="1" />
        <text x="0" y="2" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fontWeight="700" fill="#1a0e08" letterSpacing="2">
          CHRONOTYPE — L. VERMET & COLL., 2046
        </text>
      </g>
    </svg>
  );
}
