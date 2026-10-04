import { useState } from "react";
import { CONFRONTATION } from "../missions.js";

/* ============================================================
   JEU 3 — SCÈNE : « Salle des serveurs de MARTINE » (finale)
   ------------------------------------------------------------
   Trois phases internes :
     intro  — les répliques de MARTINE (révélation)
     choice — les 3 fins proposées
     end    — l'écran de fin choisi, bouton retour au menu
   ============================================================ */
export default function BunkerServeurs({ prenom, j3 }) {
  const [phase, setPhase] = useState("intro");
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState(null);
  /* L'intro insère les lignes "mémoire réécrite" si le joueur a cru avoir
     fait un autre choix que "ramener" à la fin du jeu 2. */
  const intro = CONFRONTATION.getIntro ? CONFRONTATION.getIntro(j3?.endChoice) : CONFRONTATION.intro;
  const fill = (s) => (s || "").replace(/\{prenom\}/g, prenom || "chronaute");

  const nextIntro = () => {
    if (step < intro.length - 1) setStep(step + 1);
    else setPhase("choice");
  };
  const chooseEnd = (fin) => {
    setChosen(fin);
    j3.setFlag(CONFRONTATION.flag);
    setPhase("end");
  };

  /* ─── PHASE END : écran de fin selon le choix ─── */
  if (phase === "end" && chosen) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 4, color: chosen.couleur }}>
          ◈ FIN — {chosen.label}
        </div>
        <div style={{ maxWidth: 700, textAlign: "center" }}>
          {chosen.texte.map((line, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.6, color: "#e8eef5", margin: "0 0 12px" }}>
              {line}
            </p>
          ))}
          <div style={{ marginTop: 20, padding: "10px 14px", background: "#0e1a30", border: `1px solid ${chosen.couleur}`, borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c8d4e2", fontStyle: "italic", lineHeight: 1.5 }}>
              {chosen.moral}
            </p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#5a6678", fontFamily: "ui-monospace,monospace", letterSpacing: 2, marginTop: 8 }}>
          — FIN DU JEU 3 —
        </p>
        <p style={{ fontSize: 11.5, color: "#7a879e", fontStyle: "italic", textAlign: "center", maxWidth: 600, margin: 0 }}>
          Ce n'était pas la « bonne » réponse. Il n'y en a pas. C'est la question qui compte : qui décide de ce qu'on a le droit de savoir ?
        </p>
        <p style={{ fontSize: 11, color: "#5a6678", textAlign: "center", marginTop: 12 }}>
          (Utilise le bouton « Menu » en haut à droite pour revenir au titre. Tu peux rejouer et essayer une autre fin.)
        </p>
      </div>
    );
  }

  /* ─── Décor commun aux phases intro et choice ─── */
  const background = (
    <svg viewBox="0 0 800 380" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
      <defs>
        <linearGradient id="sv-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1420" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <radialGradient id="sv-mart" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="380" fill="url(#sv-wall)" />
      <rect y="330" width="800" height="50" fill="#050810" />
      {/* Baies de serveurs en perspective */}
      {[
        { x: 60, w: 100, h: 240 },
        { x: 180, w: 100, h: 240 },
        { x: 540, w: 100, h: 240 },
        { x: 660, w: 100, h: 240 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x},60)`}>
          <rect x="0" y="0" width={b.w} height={b.h} fill="#141c26" stroke="#0a0e14" strokeWidth="2" />
          {/* Diodes vertes qui clignotent */}
          {Array.from({ length: 12 }).map((_, k) => (
            <circle key={k} cx={16 + (k % 4) * 24} cy={20 + Math.floor(k / 4) * 24} r="3" fill="#5eff9e" opacity="0.7">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.2 + (k % 5) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Panneaux étroits */}
          {[120, 160, 200].map((y) => (
            <rect key={y} x="4" y={y} width={b.w - 8} height="4" fill="#3a4048" />
          ))}
        </g>
      ))}
      {/* Terminal MARTINE au fond, centre */}
      <g transform="translate(400,150)">
        <circle r="120" fill="url(#sv-mart)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* Socle */}
        <rect x="-50" y="60" width="100" height="14" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
        <rect x="-40" y="74" width="80" height="80" fill="#141c26" stroke="#0a0e14" strokeWidth="2" />
        {/* Cube MARTINE */}
        <rect x="-40" y="-40" width="80" height="80" fill="#0a1a10" stroke="#5eff9e" strokeWidth="2.5" />
        <rect x="-32" y="-32" width="64" height="64" fill="#0a2818" />
        <text x="0" y="-14" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#5eff9e" letterSpacing="2">MARTINE</text>
        <text x="0" y="0" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e">RÉSEAU M</text>
        <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e">v.14.087</text>
        {/* Œil au centre */}
        <circle cx="0" cy="26" r="6" fill="#0a0806" stroke="#5eff9e" strokeWidth="1" />
        <circle cx="0" cy="26" r="2.5" fill="#5eff9e">
          <animate attributeName="r" values="2;3;2" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Câbles au sol */}
      <path d="M0 330 Q400 320 800 330" stroke="#3a4048" strokeWidth="4" fill="none" />
      <path d="M0 340 Q400 335 800 340" stroke="#5eff9e" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );

  /* ─── PHASE INTRO ─── */
  if (phase === "intro") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {background}
        <div style={{ maxWidth: 800, width: "100%", background: "#0a1a10", border: "1px solid #5eff9e", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#5eff9e" }}>
            {step < 2 ? "◈ NIVEAU -3 · SALLE DES SERVEURS" : "◈ MARTINE"}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "#e8eef5" }}>
            {fill(intro[step])}
          </p>
        </div>
        <button onClick={nextIntro} autoFocus
          style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 18px rgba(94,255,158,0.4)" }}>
          {step < intro.length - 1 ? "Suite ▸" : "▶ CHOISIR"}
        </button>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a6678", letterSpacing: 2 }}>
          {step + 1} / {intro.length}
        </div>
      </div>
    );
  }

  /* ─── PHASE CHOICE ─── */
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {background}
      <div style={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#e0a848" }}>
          ✦ TA DÉCISION
        </div>
        <p style={{ margin: "6px 0 12px", fontSize: 13, color: "#c8d4e2", fontStyle: "italic" }}>
          Il n'y a pas de bonne réponse. Choisis, et vis avec.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {CONFRONTATION.fins.map((fin) => (
            <button key={fin.id} onClick={() => chooseEnd(fin)}
              style={{ background: "#141b26", color: "#e8eef5", border: `2px solid ${fin.couleur}`, borderRadius: 12, padding: "12px 18px", fontSize: 13, cursor: "pointer", fontFamily: "Palatino, Georgia, serif", textAlign: "left", maxWidth: 240, minWidth: 210, transition: "background .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1a2536"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#141b26"; }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, color: fin.couleur, letterSpacing: 2 }}>
                {fin.label}
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, lineHeight: 1.4, color: "#c8d4e2" }}>
                {fin.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
