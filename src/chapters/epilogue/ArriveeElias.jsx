import { useState, useEffect } from "react";
import { PortraitElias } from "./StationChronautes.jsx";

/* ============================================================
   ÉPILOGUE — ARRIVÉE À LA STATION DES CHRONAUTES
   ------------------------------------------------------------
   Séquence courte qui joue JUSTE APRÈS le saut temporel, AVANT
   la lecture du carnet et le décor général de la station.
   Elias accueille le/la chronaute mais la maladie de la mémoire
   le confond : il cherche ses mots, doute de son nom, oublie
   ce qu'il voulait dire. Alors il tend son carnet — ce qui
   introduit naturellement la lecture des 7 planches qui suit.
   ============================================================ */

/* Petit typewriter local (repart de zéro quand text change).
   skip() affiche tout d'un coup. */
function useTypewriter(text, speed = 22) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    if (!text) { setDone(true); return; }
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { shown, done, skip: () => { setShown(text); setDone(true); } };
}

/* Répliques d'Elias confus : hésitations, silences, pause avant
   qu'il se souvienne du carnet. La 4e ligne est celle du carnet. */
const REPLIQUES = [
  { mood: "neutre",
    text: "Oh… tu… tu viens d'arriver ? Le portail… oui, le portail vient de s'éteindre. Tu es {prenom} — c'est bien ça ?" },
  { mood: "vexe",
    text: "Je voulais te dire tellement de choses… mais… comment ça s'appelait, déjà… c'est là, juste là dans ma tête, et ça glisse." },
  { mood: "vexe",
    text: "Excuse-moi. On m'a dit que ça arrive de plus en plus souvent. Je crois que… je crois que je m'appelle Elias. Oui. Elias. C'est ça." },
  { mood: "content",
    text: "Attends. J'ai… j'ai écrit tout ça, avant. Quand j'étais encore… moi. Tiens. Prends mon carnet. Lis-le, tu comprendras mieux que si je m'embrouille encore." },
];

export default function ArriveeElias({ prenom, onDone }) {
  const [idx, setIdx] = useState(0);
  const step = REPLIQUES[idx];
  const raw = step.text.replace("{prenom}", prenom || "chronaute");
  const { shown, done, skip } = useTypewriter(raw);
  const dernier = idx === REPLIQUES.length - 1;

  /* Clic n'importe où sur l'écran : d'abord révèle tout le texte,
     puis passe à la réplique suivante (ou prend le carnet si dernière). */
  const advance = () => { if (!done) skip(); else if (dernier) onDone(); else setIdx(idx + 1); };

  return (
    <div onClick={advance}
      style={{ height: "100dvh", overflow: "hidden", background: "#080d16", display: "flex", flexDirection: "column", position: "relative", fontFamily: "Georgia, serif", cursor: "pointer" }}>
      {/* ═══ décor : silhouette de la station en fond, portail temporel qui s'estompe ═══ */}
      <svg viewBox="0 0 1000 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ae-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e1420" />
            <stop offset="60%" stopColor="#1a2438" />
            <stop offset="100%" stopColor="#2a2028" />
          </linearGradient>
          <radialGradient id="ae-portal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7fd8ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1000" height="560" fill="url(#ae-sky)" />
        {/* étoiles au loin */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle key={i} cx={(i * 37) % 1000} cy={20 + (i * 23) % 200} r={i % 5 === 0 ? 1.6 : 0.8} fill="#c8d4e2" opacity="0.55" />
        ))}
        {/* silhouette de dôme au loin */}
        <path d="M0 460 Q200 420 500 430 Q800 420 1000 460 L1000 560 L0 560 Z" fill="#1a1408" opacity="0.9" />
        <g transform="translate(700,430)" opacity="0.7">
          <path d="M-90 0 A 90 60 0 0 1 90 0 Z" fill="#3a4858" stroke="#5a6878" strokeWidth="1" />
          <path d="M-50 -50 L0 -58 L50 -50" stroke="#5a6878" strokeWidth="0.5" fill="none" />
          <circle cx="0" cy="-70" r="2.2" fill="#5eff9e">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* portail temporel qui s'estompe à gauche */}
        <g transform="translate(220,300)">
          <ellipse cx="0" cy="0" rx="150" ry="180" fill="url(#ae-portal)">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="0" rx="60" ry="80" fill="none" stroke="#7fd8ff" strokeWidth="1.5" opacity="0.85">
            <animate attributeName="rx" values="60;80;60" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0;0.85" dur="3s" repeatCount="indefinite" />
          </ellipse>
          {/* petites particules qui remontent du portail */}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={(i * 23 - 60) % 40 - 20} cy={80 - i * 12} r="1.4" fill="#c8e8ff" opacity="0.7">
              <animate attributeName="cy" values={`${80 - i * 12};${-80 - i * 12}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
        {/* ELIAS silhouette agrandie, au centre, un peu tremblante */}
        <g transform="translate(560,340)">
          <animateTransform attributeName="transform" type="translate"
            values="560 340; 559 341; 560 340; 561 339; 560 340"
            dur="3.6s" repeatCount="indefinite" />
          <ellipse cx="0" cy="72" rx="46" ry="8" fill="#0a0603" opacity="0.6" />
          {/* jambes tunique */}
          <rect x="-20" y="14" width="14" height="58" fill="#8a6848" stroke="#5a3820" strokeWidth="0.6" />
          <rect x="6" y="14" width="14" height="58" fill="#8a6848" stroke="#5a3820" strokeWidth="0.6" />
          {/* tunique */}
          <path d="M-38 20 Q-40 -22 -6 -34 L6 -34 Q40 -22 38 20 Z" fill="#c8a878" stroke="#5a3818" strokeWidth="0.8" />
          {/* épaules */}
          <ellipse cx="-32" cy="-18" rx="9" ry="7" fill="#e0b898" />
          <ellipse cx="32" cy="-18" rx="9" ry="7" fill="#e0b898" />
          {/* bras qui tend le carnet (bras droit tendu vers le joueur) */}
          <path d="M32 -14 Q46 4 60 20" stroke="#e0b898" strokeWidth="12" fill="none" strokeLinecap="round" />
          {dernier && (
            <g transform="translate(66,26)">
              <animateTransform attributeName="transform" type="translate"
                values="66 26; 66 22; 66 26" dur="1.6s" repeatCount="indefinite" />
              {/* carnet tendu */}
              <rect x="-16" y="-20" width="32" height="42" fill="#5a3818" stroke="#3a2418" strokeWidth="1.2" rx="1" />
              <rect x="-14" y="-18" width="28" height="38" fill="#8a6838" />
              <text x="0" y="-4" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="7" fill="#f4e4b0">Carnet</text>
              <text x="0" y="4" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="7" fill="#f4e4b0">d'Elias</text>
              {/* halo doré autour */}
              <ellipse cx="0" cy="0" rx="26" ry="34" fill="none" stroke="#ffd166" strokeWidth="1" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite" />
              </ellipse>
            </g>
          )}
          {/* main gauche qui tremble un peu */}
          <path d="M-32 -14 Q-42 6 -46 22" stroke="#e0b898" strokeWidth="10" fill="none" strokeLinecap="round" />
          {/* tête (grosse par rapport aux plans standards) */}
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; 0.4 0; 0 0; -0.4 0; 0 0" dur="2.4s" repeatCount="indefinite" />
            <ellipse cx="0" cy="-58" rx="22" ry="26" fill="#e0b898" stroke="#5a3818" strokeWidth="0.8" />
            {/* cheveux blancs */}
            <path d="M-20 -74 q6 -22 20 -22 q14 0 20 22 q-8 -6 -20 -4 q-12 -2 -20 4 Z" fill="#e8e8e0" />
            {/* barbe blanche */}
            <path d="M-14 -46 q14 18 28 0 q-2 12 -8 18 q-6 4 -12 0 q-6 -6 -8 -18 z" fill="#e8e8e0" />
            {/* yeux fatigués */}
            <circle cx="-6" cy="-58" r="1.6" fill="#2a3860" />
            <circle cx="6" cy="-58" r="1.6" fill="#2a3860" />
            {/* rides */}
            <path d="M-14 -50 q4 2 8 2 M14 -50 q-4 2 -8 2" stroke="#8a6828" strokeWidth="0.6" fill="none" opacity="0.5" />
          </g>
        </g>
      </svg>

      {/* ═══ bandeau titre ═══ */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "12px 12px 0", pointerEvents: "none" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#ffd166" }}>
          ÉPILOGUE · STATION DES CHRONAUTES · 2287
        </div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#7fd8ff", marginTop: 4, opacity: 0.75 }}>
          … le portail vient de se refermer …
        </div>
      </div>

      {/* espaceur */}
      <div style={{ flex: 1 }} />

      {/* ═══ boîte de dialogue d'Elias en bas ═══ */}
      <div style={{ position: "relative", zIndex: 2, padding: "12px 20px 24px", background: "linear-gradient(180deg,#0c122000 0%,#0c1220ee 40%,#080d16 100%)", display: "flex", gap: 16, alignItems: "flex-end" }}>
        <div style={{ width: 140, height: 170, flex: "0 0 auto", borderRadius: 12, overflow: "hidden", border: "2px solid #ffd166", boxShadow: "0 8px 32px rgba(0,0,0,0.65)" }}>
          <PortraitElias mood={step.mood} />
        </div>
        <div title={done ? "Cliquer n'importe où pour continuer" : "Cliquer pour tout afficher"}
          style={{ flex: 1, background: "#0e1420ee", border: "1px solid #2a3648", borderRadius: 12, padding: "12px 16px", minHeight: 130, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: done ? "default" : "pointer" }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#ffd166", marginBottom: 6 }}>ELIAS</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#e8eef5", margin: 0, fontStyle: "italic" }}>
              « {shown}{!done && <span style={{ opacity: 0.7 }}>▮</span>} »
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd" }}>{idx + 1} / {REPLIQUES.length}</div>
            {!dernier ? (
              <button onClick={(e) => { e.stopPropagation(); if (done) setIdx(idx + 1); }}
                disabled={!done}
                style={{ background: done ? "#141b26" : "#0e1420", color: done ? "#ffd166" : "#3a3020", border: `1px solid ${done ? "#5a4a20" : "#26324a"}`, borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: done ? "pointer" : "default", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                Suite ▸
              </button>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); if (done) onDone(); }}
                disabled={!done}
                style={{ background: done ? "#5a3818" : "#2a1a08", color: done ? "#f4e4b0" : "#5a4820", border: `1px solid ${done ? "#8a6838" : "#3a2818"}`, borderRadius: 10, padding: "10px 22px", fontWeight: 800, cursor: done ? "pointer" : "default", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1, boxShadow: done ? "0 0 20px rgba(232,150,74,0.4)" : "none" }}>
                📖 Prendre le carnet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
