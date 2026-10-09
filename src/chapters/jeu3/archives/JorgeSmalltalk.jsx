import { useState } from "react";
import { SMALLTALK_QUESTIONS } from "../pnj.js";

/* ============================================================
   JEU 3 — Modale smalltalk pour Jorge (archives)
   ------------------------------------------------------------
   Mêmes 3 questions que les autres PNJ, mais Jorge n'est pas
   dans PnjRoom (les Archives sont une scène custom). On duplique
   donc la modale ici, avec ses propres réponses.
   ============================================================ */
const JORGE_REPLIES = {
  ou:          "Salle des Archives, niveau -1. Secteur mémoire. Je range des fiches ici depuis trente ans. On me laisse tranquille, c'est bien.",
  pourquoiMoi: "Toi ? Si Vez t'a convoqué·e, c'est que tu auras à vérifier des choses. Évite de me déranger sans raison, j'ai du travail.",
  toi:         "Je rentre les fiches, je les range, je les tamponne. On ne touche pas à ce que MARTINE a écrit. On classe, on range, c'est tout.",
};

export default function JorgeSmalltalk({ onClose }) {
  const [picked, setPicked] = useState(null);
  const answerFor = (qid) => JORGE_REPLIES[qid];
  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1218", border: "2px solid #7fd8ff", borderRadius: 12, padding: 18, maxWidth: 620, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#7fd8ff" }}>
            🔍 JORGE · ARCHIVISTE
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#8fa3bd", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {SMALLTALK_QUESTIONS.map((row) => {
            const isPicked = picked === row.id;
            return (
              <div key={row.id}>
                <button onClick={() => setPicked(isPicked ? null : row.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    background: isPicked ? "#0e2a3a" : "#141b26",
                    color: isPicked ? "#7fd8ff" : "#e8eef5",
                    border: `1px solid ${isPicked ? "#7fd8ff" : "#3a4048"}`,
                    borderRadius: 8, padding: "8px 12px",
                    fontFamily: "ui-monospace,monospace", fontSize: 12.5, cursor: "pointer",
                  }}>
                  {isPicked ? "▾" : "▸"} {row.q}
                </button>
                {isPicked && (
                  <div style={{ margin: "6px 4px 0 20px", padding: "8px 12px", background: "#0a0e14", borderLeft: "2px solid #7fd8ff", borderRadius: 4 }}>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#e8eef5", fontStyle: "italic" }}>
                      « {answerFor(row.id)} »
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
