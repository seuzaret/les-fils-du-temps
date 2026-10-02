/* ============================================================
   JEU 3 — Panneau d'interview (modal centré)
   ------------------------------------------------------------
   Rend l'interrogatoire d'un témoin : 3 questions type cliquables,
   réponse affichée en citation. Clic sur le backdrop (en dehors
   de l'encadré) = fermer. S'utilise au niveau Jeu3 (quelle que
   soit la pièce où le joueur se trouve) ou dans BunkerRumeurs
   pour les témoins convoqués.
   Props :
     temoin   — l'objet témoin de la mission active
     asked    — Set des indices de questions déjà posées
     answer   — l'objet question actuellement affiché (ou null)
     onAsk    — (idx) => void : poser la question
     onClose  — () => void : fermer le modal
   ============================================================ */
export default function InterviewPanel({ temoin, asked, answer, onAsk, onClose }) {
  if (!temoin) return null;
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 170, background: "rgba(4,8,14,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer", fontFamily: "Palatino, Georgia, serif" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, width: "100%", maxHeight: "85vh", overflowY: "auto", background: "#141020", border: "2px solid #3a80c8", borderRadius: 10, padding: "18px 22px", cursor: "default", boxShadow: "0 20px 60px rgba(0,0,0,0.75)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 2, color: "#7fd8ff", fontWeight: 700 }}>
            {temoin.nom.toUpperCase()} · {temoin.role}
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 6, padding: "3px 10px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
            Fermer ✕
          </button>
        </div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd", marginBottom: 10 }}>
          Au Puits depuis {temoin.ancienneteAns} ans · {temoin.lieu}
        </div>

        {answer && (
          <div style={{ background: "#0a0e14", borderLeft: "3px solid #7fd8ff", padding: "12px 16px", marginBottom: 12, borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "#e8eef5" }}>{answer.r}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {temoin.questions.map((q, i) => {
            const doneQ = asked?.has(i);
            return (
              <button key={i} onClick={() => onAsk(i)}
                style={{
                  background: doneQ ? "#0e1420" : "#1a2436",
                  color: doneQ ? "#7a879e" : "#e8eef5",
                  border: `1px solid ${doneQ ? "#2a3648" : "#3a80c8"}`,
                  borderRadius: 6, padding: "11px 16px", textAlign: "left",
                  fontFamily: "Georgia, serif", fontSize: 17, cursor: "pointer",
                }}>
                {doneQ ? "✓ " : "▸ "}{q.q}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a7a90", fontStyle: "italic", textAlign: "right" }}>
          Clique en dehors de l'encadré pour fermer ▸
        </div>
      </div>
    </div>
  );
}
