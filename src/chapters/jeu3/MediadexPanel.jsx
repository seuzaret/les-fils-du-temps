import { CHAPTERS } from "../index.js";

/* ============================================================
   JEU 3 — Panneau MÉDIADEX
   ------------------------------------------------------------
   Vue d'ensemble des époques et de leurs dates clés, reconstruite
   à partir du registre des chapitres (CHAPTERS). Sert d'aide-
   mémoire au joueur pendant le rangement des fiches de Jorge et
   plus largement toute la mission Archives. Ouvert via un objet
   cliquable dans la chambre N-27.
   ============================================================ */
export default function MediadexPanel({ onClose }) {
  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141008", border: "2px solid #c8a848", borderRadius: 12,
          padding: 20, maxWidth: 760, width: "100%", maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 0 40px rgba(200,168,72,0.25)",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848" }}>
              📘 MÉDIADEX
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#e8dfc8", marginTop: 2 }}>
              Ton carnet de voyage temporel
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#8a7050", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        <p style={{ margin: "4px 0 14px", fontSize: 13, color: "#c8b090", lineHeight: 1.55, fontStyle: "italic" }}>
          Les dates et lieux clés des époques que tu as traversées avec MARTINE. Garde-les sous la main — on te mentira dessus.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHAPTERS.map((ch, i) => (
            <div key={ch.id}
              style={{
                background: "#1a1408", border: "1px solid #5a4028", borderRadius: 8,
                padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start",
              }}>
              <div style={{
                flex: "0 0 auto", width: 38, height: 38, borderRadius: 6,
                background: "#2a1808", border: "1px solid #c8a848",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                {ch.emoji || "📖"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8a848" }}>
                    {String(i + 1).padStart(2, "0")} · {(ch.epoque || "").toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#e0a848", fontWeight: 700 }}>
                    {ch.date}
                  </div>
                </div>
                {ch.presentation && (
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#c8b090", lineHeight: 1.5 }}>
                    {ch.presentation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a4028", textAlign: "right", fontStyle: "italic" }}>
          Clique en dehors pour refermer ▸
        </div>
      </div>
    </div>
  );
}
