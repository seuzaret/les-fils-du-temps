import { useEffect, useState, useRef } from "react";
import PnjSprite from "../PnjSprite.jsx";

/* ============================================================
   JEU 3 — SCÈNE : « Voyage dans le temps » (mission appel)
   ------------------------------------------------------------
   Le dossier actif (j3.activeDossier) détermine l'époque, le lieu
   et le témoin historique à interroger. 3 questions pré-écrites,
   chacune remplit une case du bordereau (QUI / OÙ-QUAND / QUOI).
   Les 3 cases remplies → bouton "Rapporter au futur" → retour aux
   Archives, où la modale de comparaison se lance.
   ============================================================ */
export default function BunkerVoyage({ onGo, j3 }) {
  const dossier = j3?.activeDossier;
  const [phase, setPhase] = useState("flash"); // flash → past → return
  const [asked, setAsked] = useState({}); // { 0: true, 1: true, 2: true }
  const [currentReply, setCurrentReply] = useState(null); // { idx, text }
  const rafRef = useRef(null);

  /* Phase flash : ~1.4s de voyage. */
  useEffect(() => {
    if (phase !== "flash") return;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("past"), 180);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  /* Pas de dossier actif : erreur de navigation, on renvoie aux Archives. */
  if (!dossier) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: 20 }}>
        <p style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, color: "#c8d4e2" }}>
          Aucun dossier actif. La machine n'a pas de destination.
        </p>
        <button onClick={() => onGo("archives")}
          style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          ← Retour aux Archives
        </button>
      </div>
    );
  }

  const nbAsked = Object.keys(asked).length;
  const allAsked = nbAsked >= dossier.questions.length;

  const askQ = (idx) => {
    const q = dossier.questions[idx];
    setAsked((a) => ({ ...a, [idx]: true }));
    setCurrentReply({ idx, text: q.reponse });
    j3.fillBordereau(q.remplit, dossier.verite[q.remplit]);
  };

  const finish = () => {
    setPhase("return");
    setTimeout(() => onGo("archives"), 1200);
  };

  /* Flash d'arrivée ou de retour. */
  if (phase === "flash" || phase === "return") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative", width: "100%" }}>
        <svg viewBox="0 0 1100 560" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
          <defs>
            <radialGradient id="bv-flash" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="40%" stopColor="#c8a848" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8a5030" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1100" height="560" fill="#050810" />
          {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
            <circle key={i} cx="550" cy="280" r="60" fill="none" stroke="#c8a848" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="20;420" dur="1.2s" begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.2s" begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <circle cx="550" cy="280" r="320" fill="url(#bv-flash)" />
        </svg>
        <div style={{ position: "absolute", top: "36%", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#c8a848" }}>
            {phase === "return" ? "◈ RETOUR AU BUNKER" : "⏳ VOYAGE EN COURS"}
          </div>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 32, fontWeight: 900, color: "#fff", textShadow: "0 0 14px #c8a848", marginTop: 6 }}>
            {phase === "return" ? "2087 · Archives" : dossier.anneeCible}
          </div>
        </div>
      </div>
    );
  }

  /* Phase past : décor générique + témoin historique + questions. */
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: 10, boxSizing: "border-box" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", textAlign: "center" }}>
        📻 {dossier.lieuCible.toUpperCase()} — {dossier.anneeCible}
      </div>

      <PastDecor annee={dossier.anneeCible} temoin={dossier.temoin} />

      {/* Bordereau en bas gauche */}
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 1100, flexWrap: "wrap" }}>
        <Bordereau bordereau={j3.bordereau} />

        <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Zone questions / réponse */}
          <div style={{ background: "#141020", border: "1px solid #c8a848", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8a848", marginBottom: 6 }}>
              {dossier.temoin.nom.toUpperCase()} · {dossier.temoin.role.toUpperCase()}
            </div>
            {currentReply ? (
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#e8eef5" }}>
                « {currentReply.text} »
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: 12.5, color: "#8fa3bd", fontStyle: "italic" }}>
                Pose-lui tes questions pour remplir le bordereau de vérification.
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {dossier.questions.map((q, i) => {
              const done = !!asked[i];
              return (
                <button key={i} onClick={() => askQ(i)} disabled={done}
                  style={{
                    textAlign: "left",
                    background: done ? "#0e2818" : "#141b26",
                    color: done ? "#5eff9e" : "#e8eef5",
                    border: `1px solid ${done ? "#5eff9e" : "#3a80c8"}`,
                    borderRadius: 8, padding: "7px 11px",
                    fontFamily: "ui-monospace,monospace", fontSize: 12,
                    cursor: done ? "default" : "pointer", lineHeight: 1.4,
                  }}>
                  {done ? "✓ " : "☐ "}{q.q}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {allAsked && (
        <button onClick={finish} autoFocus
          style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "12px 26px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 18px rgba(94,255,158,0.4)" }}>
          ⏵ RAPPORTER AU FUTUR
        </button>
      )}
    </div>
  );
}

/* --------- Bordereau de vérification (3 cases) --------- */
function Bordereau({ bordereau }) {
  const ROWS = [
    { key: "qui", label: "QUI ?" },
    { key: "ouQuand", label: "OÙ ET QUAND ?" },
    { key: "quoi", label: "QUOI EXACTEMENT ?" },
  ];
  return (
    <div style={{ flex: "0 1 300px", background: "#0a0e14", border: "2px solid #c8a848", borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#c8a848", marginBottom: 8 }}>
        📝 BORDEREAU DE VÉRIFICATION
      </div>
      {ROWS.map((row) => {
        const filled = !!bordereau[row.key];
        return (
          <div key={row.key} style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 9, color: "#8fa3bd", letterSpacing: 1 }}>
              {row.label}
            </div>
            <div style={{
              background: filled ? "#0e2818" : "#141b26",
              border: `1px solid ${filled ? "#5eff9e" : "#3a4048"}`,
              borderRadius: 6, padding: "5px 8px",
              fontSize: 11.5, color: filled ? "#c8ffdd" : "#5a6678",
              fontStyle: filled ? "normal" : "italic", minHeight: 20,
            }}>
              {filled ? bordereau[row.key] : "— vide —"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------- Décor du passé (générique, teinté selon l'année) --------- */
function PastDecor({ annee, temoin }) {
  /* Palette de ciel qui vieillit : plus ancien → plus doré/orangé. */
  const ancient = annee < 1700;
  const old = annee < 1850;
  const skyTop = ancient ? "#4a2820" : old ? "#5a3828" : "#2a3848";
  const skyBottom = ancient ? "#c86840" : old ? "#e0a848" : "#8fa3bd";
  const groundTop = ancient ? "#5a3818" : old ? "#5a4028" : "#3a4048";
  const groundBottom = ancient ? "#2a1408" : old ? "#2a1808" : "#141c26";
  return (
    <svg viewBox="0 0 1100 420" style={{ display: "block", width: "100%", maxHeight: 320, flexShrink: 0 }}>
      <defs>
        <linearGradient id="past-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id="past-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={groundTop} />
          <stop offset="100%" stopColor={groundBottom} />
        </linearGradient>
      </defs>
      <rect width="1100" height="260" fill="url(#past-sky)" />
      {/* Soleil / lune doré */}
      <circle cx="800" cy="90" r="38" fill="#ffd870" opacity="0.85" />
      <circle cx="800" cy="90" r="26" fill="#fff4b0" opacity="0.95" />
      {/* Silhouette d'horizon (varie peu, suffit à poser un cadre) */}
      <path d="M0 260 L0 220 L80 220 L80 180 L160 180 L160 210 L260 210 L260 170 L360 170 L360 210 L480 210 L480 190 L580 190 L580 220 L720 220 L720 190 L840 190 L840 210 L960 210 L960 180 L1100 180 L1100 260 Z" fill={ancient ? "#2a1408" : old ? "#1a0e08" : "#0a0e14"} opacity="0.9" />
      <rect y="260" width="1100" height="160" fill="url(#past-ground)" />

      {/* Objet d'ambiance : table avec livre/outil, varie selon l'époque */}
      <g transform="translate(430,330)">
        <rect x="0" y="0" width="130" height="12" fill="#5a3818" stroke="#1a0e08" strokeWidth="1" />
        <rect x="10" y="12" width="8" height="40" fill="#5a3818" stroke="#1a0e08" strokeWidth="0.5" />
        <rect x="112" y="12" width="8" height="40" fill="#5a3818" stroke="#1a0e08" strokeWidth="0.5" />
        {/* Un livre posé */}
        <rect x="20" y="-10" width="40" height="10" fill="#8a3820" stroke="#1a0e08" strokeWidth="0.6" />
        <line x1="20" y1="-6" x2="60" y2="-6" stroke="#1a0e08" strokeWidth="0.4" />
      </g>

      {/* Témoin */}
      <PnjSprite x={620} y={340}
        color={temoin.color} pants={temoin.pants} hair={temoin.hair} skin={temoin.skin}
        facing="left" activity="write"
        nom={temoin.nom} role={temoin.role}
        heard />
    </svg>
  );
}
