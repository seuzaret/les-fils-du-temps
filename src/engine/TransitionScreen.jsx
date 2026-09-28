/* ============================================================
   MOTEUR — Écran de TRANSITION entre deux chapitres.
   ------------------------------------------------------------
   Affiché juste après le saut temporel réussi, avant que le
   décor du nouveau chapitre n'apparaisse. Le grand 🌀 grandit
   à l'entrée, MARTINE annonce la destination, puis un bouton
   ATTERRIR → déclenche onLand(index) chez le parent.
   Aucun état propre.
   ============================================================ */
export default function TransitionScreen({ target, transitionTo, onLand }) {
  return (
    <div style={{
      minHeight: "100vh", position: "relative",
      background: "radial-gradient(ellipse at 50% 40%, #1a2f4a 0%, #060a12 75%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      fontFamily: "Palatino, Georgia, serif", color: "#e8eef5",
    }}>
      {/* Bouton PASSER discret, coin haut droit */}
      <button onClick={() => onLand(transitionTo)}
        title="Atterrir sans regarder l'annonce"
        style={{ position: "absolute", top: 12, right: 16, zIndex: 20, background: "rgba(20,27,38,0.6)", border: "1px solid rgba(200,212,226,0.25)", color: "#8fa3bd", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
        passer ›
      </button>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{ fontSize: 96, animation: "spinGrow 1.2s ease-out" }}>🌀</div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 4, color: "#5eff9e", marginTop: 10 }}>
          SAUT TEMPOREL EN COURS
        </div>
        <h1 style={{ fontFamily: "ui-monospace,monospace", color: "#e8934a", fontSize: "clamp(26px,6vw,40px)", letterSpacing: 2, margin: "10px 0 2px" }}>
          {target.epoque}
        </h1>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 15, color: "#8fa3bd" }}>
          {target.emoji} Chapitre {transitionTo + 1} · {target.date}
        </div>
        <p style={{ fontFamily: "ui-monospace,monospace", fontSize: 14, color: "#c8ffdd", lineHeight: 1.6, marginTop: 22, textShadow: "0 0 6px rgba(94,255,158,0.3)" }}>
          « Direction {target.epoque}. Accroche-toi — l'atterrissage, ce n'est toujours pas ma spécialité. »
        </p>
        <button onClick={() => onLand(transitionTo)}
          style={{
            marginTop: 24, background: "#5eff9e", color: "#06110b", border: "none",
            borderRadius: 12, padding: "13px 30px", fontSize: 15, fontWeight: 800,
            cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2,
            boxShadow: "0 0 24px rgba(94,255,158,0.4)",
          }}>
          ATTERRIR →
        </button>
      </div>
    </div>
  );
}
