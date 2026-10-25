/* ============================================================
   JEU 3 — Les papiers d'Al3x1a
   ------------------------------------------------------------
   Papier          : un papier plié (ou la page du carnet), écrit à
                     la main au stylo bleu, signé « — A. ».
   CaillouTrouve   : la modale qui s'ouvre quand on en trouve un
                     (le lieu, puis le papier qui se déplie) ;
                     « Garder le papier » pose le flag du caillou.
   ============================================================ */
const ENCRE = "#23366e";
const MAIN = "Georgia, serif";

export function Papier({ caillou, anime = false }) {
  const carnet = !!caillou.carnet;
  return (
    <div style={{
      position: "relative", margin: "0 auto", maxWidth: carnet ? 460 : 340,
      background: carnet
        ? "repeating-linear-gradient(180deg, #f3ecd8 0 25px, #c9d4e6 25px 26px)"
        : "linear-gradient(135deg, #efe6cf 0%, #e6dbbf 48%, #ece2c8 52%, #e2d6b8 100%)",
      color: ENCRE, fontFamily: MAIN, fontStyle: "italic",
      padding: carnet ? "18px 22px 16px 46px" : "16px 22px",
      borderRadius: 3, boxShadow: "0 6px 22px rgba(0,0,0,0.55)",
      transform: carnet ? "rotate(-0.6deg)" : "rotate(1.2deg)",
      transformOrigin: "top center",
      animation: anime ? "cpDeplie 900ms cubic-bezier(.2,.8,.3,1) both" : "none",
    }}>
      {carnet && <div style={{ position: "absolute", left: 34, top: 0, bottom: 0, width: 1.5, background: "#d88a8a" }} />}
      {caillou.papier.map((ligne, i) => (
        <p key={i} style={{
          margin: i === 0 ? 0 : "8px 0 0",
          fontSize: !carnet && i === 0 && /^\d/.test(ligne) ? 34 : carnet ? 16 : 18,
          lineHeight: carnet ? "26px" : 1.4,
          fontWeight: !carnet && /^\d/.test(ligne) ? 700 : 400,
          letterSpacing: /^\d/.test(ligne) ? 3 : 0,
          textAlign: carnet && i === 0 ? "right" : "left",
          opacity: carnet && i === 0 ? 0.7 : 1,
        }}>{ligne}</p>
      ))}
      <p style={{ margin: "10px 0 0", textAlign: "right", fontSize: 20 }}>— A.</p>
    </div>
  );
}

export function CaillouTrouve({ caillou, onGarder }) {
  return (
    <div onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(4,8,14,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "Palatino, Georgia, serif" }}>
      <style>{`@keyframes cpDeplie { from { opacity: 0; transform: scaleY(0.08) rotate(1.2deg); } to { opacity: 1; } }
        @keyframes cpIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
      <div style={{ maxWidth: 560, width: "100%", maxHeight: "calc(100dvh - 32px)", overflowY: "auto", textAlign: "center" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", marginBottom: 10 }}>
          🪨 {caillou.carnet ? "LA PAGE DU CARNET" : "UN PAPIER"}
        </div>
        <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.55, color: "#c8d4e2", fontStyle: "italic", animation: "cpIn 600ms ease-out both" }}>
          {caillou.trouve}
        </p>
        <Papier caillou={caillou} anime />
        <button onClick={onGarder} autoFocus
          style={{ marginTop: 22, background: "#c8a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 800, fontSize: 13, letterSpacing: 1, fontFamily: "ui-monospace,monospace", cursor: "pointer" }}>
          Garder le papier 🪨
        </button>
        <div style={{ marginTop: 8, fontSize: 12, color: "#7a879e", fontStyle: "italic" }}>
          Tu le retrouveras dans tes cailloux, en haut de l'écran.
        </div>
      </div>
    </div>
  );
}
