/* ============================================================
   ÉCRAN TITRE — pièces communes aux maquettes (?titre=a|b|c)
   ------------------------------------------------------------
   TitreLettres : « Les fils du temps » en Cinzel (embarquée,
                  @fontsource), or en dégradé, un reflet qui passe
                  lentement ; les mots ne se coupent jamais.
   Accroche     : « avec MARTINE » et la phrase qui dit ce qu'est
                  le jeu.
   MenuTitre    : le menu, même logique que l'écran actuel
                  (reprendre / démarrer, Jeu 2 débloqué à la fin du
                  Jeu 1, Jeu 3 en bêta, réglages, médiadex, son),
                  mais hiérarchisé et lisible sur n'importe quel fond.
   ============================================================ */
export const CINZEL = "'Cinzel', 'Trajan Pro', Georgia, serif";
export const CORMORANT = "'Cormorant Garamond', Georgia, serif";
const MONO = "ui-monospace, monospace";
const OR = "#ffd166";

export const CSS_TITRE = `
@keyframes ttReflet { 0% { background-position: 120% 0; } 55%, 100% { background-position: -120% 0; } }
@keyframes ttIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes ttPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
.tt-btn { transition: transform .15s ease, box-shadow .15s ease, background .15s ease; }
.tt-btn:hover { transform: translateY(-1px); }
.tt-btn:focus-visible { outline: 2px solid #fff3c4; outline-offset: 3px; }
`;

export function TitreLettres({ taille = 64, align = "center" }) {
  return (
    <h1 style={{ margin: 0, fontFamily: CINZEL, fontWeight: 700, fontSize: taille, lineHeight: 1.02, letterSpacing: "0.08em",
      textAlign: align, textWrap: "balance", textTransform: "uppercase",
      backgroundImage: `linear-gradient(100deg, #e8a24a 0%, ${OR} 30%, #fff3c4 46%, ${OR} 54%, #e8934a 80%, #c8703a 100%)`,
      backgroundSize: "250% 100%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      filter: "drop-shadow(0 2px 0 rgba(60,30,8,0.55)) drop-shadow(0 0 22px rgba(255,190,90,0.28))",
      animation: "ttReflet 9s ease-in-out infinite" }}>
      {"Les fils du temps".split(" ").map((m, i, t) => (
        <span key={i}><span style={{ whiteSpace: "nowrap" }}>{m}</span>{i < t.length - 1 ? " " : ""}</span>
      ))}
    </h1>
  );
}

export function Accroche({ align = "center", clair = false, petit = false }) {
  return (
    <div style={{ textAlign: align, animation: "ttIn 1.2s ease-out 0.4s both" }}>
      <div style={{ fontFamily: MONO, fontSize: petit ? 11 : 12.5, letterSpacing: 4, color: "#5eff9e", textShadow: "0 0 10px rgba(94,255,158,0.45)", marginTop: 8 }}>
        AVEC M.A.R.T.I.N.E.
      </div>
      <p style={{ margin: petit ? "6px 0 0" : "10px 0 0", fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 500, fontSize: petit ? 17 : 21, lineHeight: 1.3,
        color: clair ? "#3a2410" : "#e8dcc4", textShadow: clair ? "none" : "0 1px 8px rgba(0,0,0,0.6)", textWrap: "balance" }}>
        20 000 ans d'histoire de la communication,<br />de Lascaux au smartphone.
      </p>
    </div>
  );
}

const pill = (fond, texte, bord) => ({ background: fond, color: texte, border: `1px solid ${bord}`, borderRadius: 999, padding: "9px 16px", fontFamily: MONO, fontSize: 12.5, fontWeight: 700, letterSpacing: 1, cursor: "pointer", whiteSpace: "nowrap" });

/* m : { saved, saveExists, jeu1Fini, savedJeu2, son, onReprendre, onNouvelle, onDemarrer, onReprendreJeu2,
         onNouvelleJeu2, onJeu2, onJeu3, onReglages, onMediadex, onSon }
   compact : téléphone (portrait ou paysage) — marges et textes resserrés */
export function MenuTitre({ m, largeur = 440, compact = false }) {
  const pied = { ...pill("transparent", "#b8c4d6", "transparent"), padding: compact ? "5px 9px" : "7px 12px", fontSize: compact ? 12 : 12.5 };
  return (
    <nav aria-label="Menu" style={{ width: "100%", maxWidth: largeur, boxSizing: "border-box", padding: compact ? "12px 12px 8px" : "16px 18px 10px", borderRadius: 18,
      background: "linear-gradient(180deg, rgba(10,14,24,0.78), rgba(6,9,16,0.88))", border: "1px solid rgba(255,209,102,0.22)",
      boxShadow: "0 18px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column", alignItems: "stretch", gap: compact ? 7 : 10, animation: "ttIn 1s ease-out 0.7s both" }}>
      {m.saveExists && m.saved?.prenom && (
        <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 12, color: "#5eff9e", letterSpacing: 2 }}>► Salut, {m.saved.prenom} !</div>
      )}
      <button className="tt-btn" onClick={m.saveExists ? m.onReprendre : m.onDemarrer} autoFocus
        style={{ background: "linear-gradient(180deg, #ffe08a, #f0a848)", color: "#1e1004", border: "none", borderRadius: 12, padding: compact ? "11px 14px" : "14px 18px",
          fontFamily: CINZEL, fontWeight: 700, fontSize: compact ? 16 : 18, letterSpacing: compact ? "0.08em" : "0.12em", cursor: "pointer", whiteSpace: "nowrap",
          boxShadow: "0 6px 22px rgba(240,168,72,0.35), inset 0 -2px 0 rgba(120,60,10,0.35), inset 0 1px 0 rgba(255,255,255,0.6)" }}>
        ▶&nbsp; {m.saveExists ? "Reprendre le voyage" : "Commencer le voyage"}
      </button>
      {m.saveExists && (
        <button className="tt-btn" onClick={m.onNouvelle} style={{ ...pill("transparent", "#a8b4c8", "transparent"), alignSelf: "center", padding: "2px 10px", fontWeight: 600 }}>
          ↺ Nouvelle partie
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0 0" }}>
        <span style={{ flex: 1, height: 1, background: "rgba(255,209,102,0.18)" }} />
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: "#c8a868" }}>LA SUITE</span>
        <span style={{ flex: 1, height: 1, background: "rgba(255,209,102,0.18)" }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {m.savedJeu2 ? (
          <span style={{ display: "inline-flex", gap: 4 }}>
            <button className="tt-btn" onClick={m.onReprendreJeu2} style={pill("rgba(127,216,255,0.14)", "#bfeaff", "rgba(127,216,255,0.55)")}>▶ II · Reprendre Al3x1a</button>
            <button className="tt-btn" onClick={m.onNouvelleJeu2} title="Nouvelle enquête" style={pill("transparent", "#8fa3bd", "rgba(143,163,189,0.35)")}>↺</button>
          </span>
        ) : m.jeu1Fini ? (
          <button className="tt-btn" onClick={m.onJeu2} style={pill("rgba(127,216,255,0.14)", "#bfeaff", "rgba(127,216,255,0.55)")}>▶ II · Al3x1a</button>
        ) : (
          <span title="À débloquer en terminant le voyage" style={{ ...pill("rgba(255,255,255,0.03)", "#8a96aa", "rgba(143,163,189,0.25)"), cursor: "default" }}>🔒 II · Al3x1a</span>
        )}
        <button className="tt-btn" onClick={m.onJeu3} title="Jeu 3 · Le Puits, 2087 (bêta)" style={pill("rgba(200,168,240,0.12)", "#e0ccff", "rgba(200,168,240,0.5)")}>▶ III · Le Puits <small style={{ opacity: 0.7 }}>β</small></button>
      </div>
      {!m.jeu1Fini && !m.savedJeu2 && (
        <div style={{ textAlign: "center", fontSize: 12.5, color: "#a8b4c8", fontFamily: CORMORANT, fontStyle: "italic", marginTop: -2 }}>
          Al3x1a t'attend à la fin du voyage.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: compact ? 2 : 6, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: compact ? 4 : 6 }}>
        <button className="tt-btn" onClick={m.onReglages} style={pied}>⚙ Réglages</button>
        <button className="tt-btn" onClick={m.onMediadex} style={{ ...pied, color: "#e8b860" }}>🃏 Médiadex</button>
        <button className="tt-btn" onClick={m.onSon} title={m.son ? "Couper la musique" : "Mettre la musique"} style={{ ...pied, color: m.son ? "#b8f0cc" : "#8a96aa" }}>
          {m.son ? "🔊 Musique" : "🔇 Musique"}
        </button>
      </div>
    </nav>
  );
}
