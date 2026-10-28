const TITRE_FONT = "'Cinzel', 'Trajan Pro', 'Copperplate Gothic Bold', 'Perpetua Titling MT', 'Constantia', 'Palatino Linotype', Georgia, serif";

/* ============================================================
   MOTEUR — Écran placeholder du JEU 2 (obsolète, gardé pour
   compatibilité). Le vrai jeu 2 vit via `screen === "play"` en
   mode "jeu2". Cet écran ne s'affiche que si une ancienne save
   demande explicitement `jeu2Placeholder`.
   ============================================================ */
export default function Jeu2Placeholder({ onRetourMenu }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #14233a 0%, #080d16 70%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5",
    }}>
      <div style={{ maxWidth: 540, textAlign: "center" }}>
        <div style={{ fontSize: 58 }}>🌀</div>
        <div style={{ fontFamily: "ui-monospace,monospace", color: "#7fd8ff", letterSpacing: 3, fontSize: 12, marginTop: 6 }}>JEU 2 · AL3X1A</div>
        <h1 style={{
          fontFamily: TITRE_FONT, fontSize: 38, textTransform: "uppercase", letterSpacing: "0.09em",
          background: "linear-gradient(100deg, #7fd8ff 0%, #ffd166 60%)",
          WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          margin: "8px 0 4px",
        }}>
          En construction
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "#c8d4e2", marginTop: 14 }}>
          L'enquête pour retrouver Al3x1a n'est pas encore prête à jouer.
          Ta partie de jeu 2 est déjà réservée dans un slot séparé — dès
          que les notes, les époques et le remède seront branchés, tu
          reprendras ici même sans rien perdre.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#8fa3bd", marginTop: 12, fontStyle: "italic" }}>
          En attendant, tu peux rejouer le voyage principal pour explorer
          les époques que tu n'as pas encore visitées.
        </p>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={onRetourMenu}
            style={{
              background: "#141b26", color: "#c8d4e2", border: "1px solid #2a3648",
              borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer",
              fontFamily: "ui-monospace,monospace", letterSpacing: 1,
            }}>
            ← Retour au menu
          </button>
        </div>
      </div>
    </div>
  );
}
