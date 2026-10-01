/* ============================================================
   JEU 3 — Overlay : le BILLET glissé
   ------------------------------------------------------------
   Apparaît quand le joueur a entendu les 3 PNJ d'accroche
   (Lior, Anselme, Via). Un billet manuscrit lui est "tombé de
   la veste" et l'oriente vers le Bureau des Rumeurs. En le
   gardant, il déverrouille le Bureau (flag "puits_billet").
   ============================================================ */
export default function BilletOverlay({ onKeep }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 220, background: "rgba(4,8,14,0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Palatino, Georgia, serif" }}>
      <div style={{ maxWidth: 520, width: "100%", background: "#f2e6cc", color: "#2a1810", border: "2px solid #5a3818", borderRadius: 4, padding: "24px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.7)", transform: "rotate(-1.5deg)", position: "relative" }}>
        {/* Petit coin corné */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 24px 24px 0", borderColor: "transparent #d8c8a4 transparent transparent" }} />
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#8a5030", marginBottom: 10 }}>
          UN BILLET EST TOMBÉ DE TA VESTE
        </div>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#3a2010", fontStyle: "italic" }}>
          « Assistant du Juge — poste vacant depuis trois mois. Ceux qui posent les bonnes questions savent qu'ils sont attendus.
          <br /><br />
          Bureau des Rumeurs, R-01, niveau −1.
          <br /><br />
          — V. »
        </p>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onKeep}
            style={{ background: "#5a3818", color: "#f2e6cc", border: "none", borderRadius: 6, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
            Garder le billet
          </button>
        </div>
      </div>
    </div>
  );
}
