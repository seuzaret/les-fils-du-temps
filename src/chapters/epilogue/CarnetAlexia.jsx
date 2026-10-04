import { JEU2 } from "./jeu2Data.js";
import { CHAPTERS } from "../index.js";

/* ============================================================
   CARNET D'AL3X1A — pages collectées pendant le jeu 2
   ------------------------------------------------------------
   Chaque note lue (dans une mauvaise OU une bonne époque) ajoute
   une page qui raconte un morceau de la vie d'Al3x1A dans cette
   époque. Si l'époque portait un INDICE de recoupement, il est
   affiché en bandeau doré sur la page.
   Le joueur ouvre ce carnet quand il veut — c'est son outil de
   déduction : chaque fois qu'il reprend une page, l'indice est
   là, et il peut rapprocher 2-3 indices pour déduire l'époque
   cible.
   ============================================================ */

export default function CarnetAlexia({ pages = [], clueMap = {}, target = -1, onClose }) {
  const total = pages.length;
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 95, padding: 16, backdropFilter: "blur(5px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg,#f8ecc8 0%,#e8d8a8 100%)",
          color: "#2a1810",
          border: "4px solid #8a6838",
          borderRadius: 14,
          width: "min(640px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "22px 26px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), inset 0 2px 0 #ffe8a0",
          fontFamily: "Palatino, Georgia, serif",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #8a6838", paddingBottom: 8, marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#8a5a2a", fontWeight: 800 }}>📓 CARNET D'AL3X1A</div>
            <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 900, color: "#3a2214", letterSpacing: 1 }}>Pages collectées <span style={{ color: "#8a5a2a", fontSize: 16, fontWeight: 700 }}>({total}/10)</span></h2>
          </div>
          <button onClick={onClose}
            style={{ background: "#8a5a2a", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, letterSpacing: 1, cursor: "pointer" }}>
            Refermer ✕
          </button>
        </div>

        {total === 0 ? (
          <div style={{ padding: "30px 10px", textAlign: "center", color: "#5a3818", fontStyle: "italic", fontSize: 15 }}>
            Pas encore de page. Trouve une première note dans une époque pour commencer à reconstituer son voyage.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pages.map((idx, k) => {
              const cfg = JEU2[idx];
              const chap = CHAPTERS[idx];
              const isRight = idx === target;
              const clueIdx = clueMap?.[idx];
              const hasClue = Number.isInteger(clueIdx) && target >= 0;
              const clueText = hasClue ? JEU2[target]?.clues?.[clueIdx] : null;
              return (
                <div key={idx} style={{
                  background: "#fff8e4",
                  border: `2px solid ${isRight ? "#5eff9e" : hasClue ? "#ffd166" : "#c8a870"}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  boxShadow: isRight ? "0 0 14px rgba(94,255,158,0.3)" : hasClue ? "0 0 10px rgba(255,209,102,0.25)" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#8a5a2a", fontWeight: 800 }}>
                      PAGE {k + 1} · {(chap?.epoque || "").toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 1, color: "#8a5a2a", opacity: 0.75 }}>
                      {chap?.date || ""}
                    </div>
                  </div>
                  {clueText && (
                    <div style={{ background: "linear-gradient(90deg,#ffd16633,#fff8e4)", border: "1px dashed #c08030", borderRadius: 6, padding: "6px 10px", marginBottom: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 14 }}>✦</span>
                      <div>
                        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 9.5, letterSpacing: 2, color: "#a06030", fontWeight: 800 }}>INDICE DE RECOUPEMENT</div>
                        <div style={{ fontSize: 14, color: "#3a2214", fontStyle: "italic", lineHeight: 1.4 }}>« {clueText} »</div>
                      </div>
                    </div>
                  )}
                  {isRight && (
                    <div style={{ background: "linear-gradient(90deg,#5eff9e33,#fff8e4)", border: "1px dashed #2a8030", borderRadius: 6, padding: "6px 10px", marginBottom: 8 }}>
                      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#2a8030", fontWeight: 800 }}>✦ ELLE EST ICI</div>
                    </div>
                  )}
                  <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, color: "#2a1810", fontStyle: "italic" }}>
                    « {cfg.page} »
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 14, padding: "8px 12px", background: "#f0e4bc", border: "1px dashed #a08048", borderRadius: 6, fontSize: 12, color: "#5a3818", fontStyle: "italic" }}>
          Les pages marquées <strong style={{ color: "#a06030" }}>✦ indice</strong> décrivent l'époque où Al3x1A s'est arrêtée. Rapproche 2 ou 3 indices pour trouver la bonne.
        </div>
      </div>
    </div>
  );
}
