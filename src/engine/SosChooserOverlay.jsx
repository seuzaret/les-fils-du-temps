/* ============================================================
   MOTEUR — Overlay du CHOIX du support SOS (fin de chapitre).
   ------------------------------------------------------------
   L'élève choisit UN seul message de l'époque où CACHER son SOS
   (codé : pour les gens de l'époque, des points et des traits),
   adressé aux chronautes de 2045 (textes validés le 2026-11-05).
   La durabilité du support détermine le flux temporel gagné :
   gravure préhistorique > cassette d'aujourd'hui.
   Le clic déclenche : mémorise le choix, bumpFlux(durabilité),
   ferme la modale, ouvre l'animation Morse.
   Aucun état propre : tout via props.
   ============================================================ */
export default function SosChooserOverlay({
  chapterIndex, chapter, msgs, sosSent,
  onChoose, // (msgId, durabilite) => void
}) {
  const chapMsgs = msgs.filter((id) => chapter.messages?.[id])
    .map((id) => ({ id, ...chapter.messages[id] }));
  const alreadyChosen = sosSent.find((id) => chapMsgs.some((m) => m.id === id));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.88)", zIndex: 85, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
      <div style={{ maxWidth: 720, width: "100%", maxHeight: "94vh", overflowY: "auto", background: "#17110a", border: "2px solid #c8963e", borderRadius: 16, padding: 24, color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#e0a848" }}>
          🆘 CHOIX DU SUPPORT SOS · CHAPITRE {chapterIndex + 1}
        </div>
        <h2 style={{ textAlign: "center", margin: "8px 0 12px", color: "#ffd166", fontSize: 22 }}>
          Dans quel message cacher ton SOS ?
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, lineHeight: 1.5, color: "#c8b090", margin: "0 0 18px" }}>
          Les chronautes ne savent pas qu'on arrive. Cachons un SOS (··· −−− ···) dans un message de l'époque : pour les gens d'ici, ce ne seront que des points et des traits, rien qui change leur histoire. S'il tient jusqu'en 2045, les chronautes le liront. <strong>Un seul</strong> par chapitre : plus le support est <strong>durable</strong>, plus le SOS a de chances d'arriver, et plus je me recharge.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {chapMsgs.map((m) => {
            const dur = m.jauges?.durabilite ?? 1;
            return (
              <button key={m.id}
                onClick={() => onChoose(m.id, dur)}
                style={{ background: "#2a1608", border: "2px solid #5a4028", borderRadius: 10, padding: "18px 14px", cursor: "pointer", color: "inherit", fontFamily: "inherit", textAlign: "center", transition: "transform .15s, border-color .15s, box-shadow .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e0a848"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(200,150,62,0.35)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#5a4028"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ fontSize: 40, marginBottom: 6 }}>{m.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#ffd166", lineHeight: 1.3 }}>{m.title}</div>
              </button>
            );
          })}
        </div>
        {alreadyChosen && (
          <p style={{ textAlign: "center", marginTop: 14, color: "#e08048", fontSize: 13.5 }}>
            ⚠ Tu as déjà choisi un support pour ce chapitre. Le nouveau remplacera l'ancien.
          </p>
        )}
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12.5, color: "#8a7a5a", fontStyle: "italic" }}>
          (Un vieux dessin pariétal dure plus longtemps qu'une cassette — c'est ça, la leçon.)
        </div>
      </div>
    </div>
  );
}
