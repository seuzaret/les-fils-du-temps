/* ============================================================
   JEU 3 — Carnet d'enquête (fiches témoins)
   ------------------------------------------------------------
   Modal plein écran qui liste les témoins interrogés dans
   l'enquête en cours. Chaque fiche présente des faits BRUTS :
   rôle, ancienneté, lieu, ce que le témoin a dit avoir VU, ce
   qu'il RAPPORTE, et des notes de contexte. Aucune "note
   d'autorité" — c'est au joueur d'en juger.

   Props :
     temoins    — tableau brut de la mission (avec .questions)
     answered   — { [temoinId]: Set<questionIdx> } indique quelles
                  questions ont déjà été posées (une entrée par
                  témoin = fiche apparaît dans le carnet)
     onClose    — ferme le modal
   ============================================================ */
export default function EnqueteCarnet({ mission, temoins, answered, onClose }) {
  const visited = (temoins || []).filter((t) => answered[t.id] && answered[t.id].size > 0);
  const notVisited = (temoins || []).filter((t) => !(answered[t.id] && answered[t.id].size > 0));
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,14,0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Palatino, Georgia, serif" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 780, width: "100%", maxHeight: "88vh", overflowY: "auto", background: "#f2e6cc", color: "#2a1810", border: "6px solid #5a3818", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>
        {/* En-tête du carnet */}
        <div style={{ padding: "14px 22px", borderBottom: "2px dashed #8a5030", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 3, color: "#8a5030" }}>ASSISTANT DU JUGE · CARNET</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 800, color: "#3a2010", marginTop: 2 }}>Fiches des personnes interrogées</div>
          </div>
          <button onClick={onClose}
            style={{ background: "#5a3818", color: "#f2e6cc", border: "none", borderRadius: 6, padding: "6px 14px", fontFamily: "ui-monospace,monospace", fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
            Refermer ✕
          </button>
        </div>

        {/* Rappel coloré de l'enquête courante */}
        {mission && (
          <div style={{ padding: "12px 22px", background: "#faf0d8", borderBottom: "1px solid #c8a848" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#8a1010", fontWeight: 800, marginBottom: 4 }}>
              ENQUÊTE EN COURS
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#3a2010", fontStyle: "italic" }}>
              « {mission.affirmation} »
            </p>
          </div>
        )}

        {/* Corps : liste des fiches */}
        <div style={{ padding: "16px 22px 22px" }}>
          {visited.length === 0 ? (
            <p style={{ margin: 0, fontStyle: "italic", color: "#8a5030" }}>
              Aucune fiche pour l'instant. Va interroger les personnes que le Juge t'a désignées.
            </p>
          ) : (
            visited.map((t) => {
              const askedSet = answered[t.id] || new Set();
              const asked = t.questions.filter((_, idx) => askedSet.has(idx));
              const aVu = asked.filter((q) => q.type === "aVu");
              const rapporte = asked.filter((q) => q.type === "rapporte");
              const notes = asked.filter((q) => q.type === "note");
              return (
                <div key={t.id}
                  style={{ background: "#f8f0d8", border: "1px solid #8a5030", borderRadius: 4, padding: "12px 16px", marginBottom: 12 }}>
                  {/* Bandeau identité */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 800, color: "#3a2010" }}>
                      👤 {t.nom}
                    </div>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a5030" }}>
                      {asked.length} / {t.questions.length} question{asked.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#5a3818", marginBottom: 10, letterSpacing: 0.5 }}>
                    {t.role} · Au Puits depuis {t.ancienneteAns} ans · {t.lieu}
                  </div>
                  {/* Colonnes brutes */}
                  <Section titre="Ce qu'il/elle A VU (de première main)" items={aVu.map((q) => q.val)} vide="—" />
                  <Section titre="Ce qu'il/elle RAPPORTE (paroles d'un tiers)" items={rapporte.map((q) => q.val)} vide="—" />
                  <Section titre="Autres notes" items={notes.map((q) => q.val)} vide="—" small />
                </div>
              );
            })
          )}
        </div>

        {notVisited.length > 0 && (
          <div style={{ padding: "0 22px 14px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#8a5030", marginBottom: 6 }}>
              ENCORE À VOIR
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.6, color: "#5a3818" }}>
              {notVisited.map((t) => (
                <li key={t.id}>
                  ☐ <strong>{t.nom}</strong>
                  <span style={{ color: "#8a5030" }}> · {t.role} · {t.lieu}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ padding: "10px 22px 14px", borderTop: "1px dashed #8a5030", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 12, color: "#5a3818", textAlign: "center" }}>
          Un témoin qui A VU pèse davantage qu'un témoin qui RAPPORTE. À toi d'en juger.
        </div>
      </div>
    </div>
  );
}

function Section({ titre, items, vide, small }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: small ? 9 : 10, letterSpacing: 1.5, color: "#8a1010", fontWeight: 800, textTransform: "uppercase", marginBottom: 3 }}>
        {titre}
      </div>
      {items.length === 0 ? (
        <div style={{ fontStyle: "italic", color: "#8a5030", fontSize: small ? 11 : 12.5 }}>{vide}</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: small ? 12 : 13, lineHeight: 1.5, color: "#3a2010" }}>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
    </div>
  );
}
