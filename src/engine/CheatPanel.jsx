/* ============================================================
   MOTEUR — Panneau de triche (dev-only) réutilisé dans tous les
   écrans. Aucun état propre : tout vient des props.
   Affichage conditionné à la prop `cheat` (par le parent).
   ============================================================ */

const CHEAT_BTN = {
  background: "#2a1638", border: "1px solid #7a3ca8", color: "#e8d4ff",
  borderRadius: 7, padding: "6px 8px", cursor: "pointer", fontSize: 11,
  textAlign: "left", width: "100%", fontFamily: "ui-monospace,monospace",
};

export default function CheatPanel({
  cheat, onClose,
  chapters, jeu2, mode, chapterIndex, jeu2Target, jeu2Notes,
  onFillFrise,
  onPlayChapter,
  onSetChapterIndex, onSetScreen, onSetEpiChoice, onSetTab,
  onNewGameJeu2, onNewGameJeu3,
  onCheatJeu3Kova, onCheatJeu3Vitamine, onCheatJeu3Jour40, onCheatJeu3Enfant, onCheatJeu3Champble,
}) {
  if (!cheat) return null;
  return (
    <div style={{
      position: "fixed", left: 8, bottom: 8, zIndex: 300, width: 208,
      background: "rgba(18,8,28,0.96)", border: "1px solid #a04ce8",
      borderRadius: 10, padding: 10, boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 1, color: "#c88aff", fontWeight: 700 }}>🎛️ TRICHE</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#8a7a9a", cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button style={CHEAT_BTN} onClick={onFillFrise}>◆ Remplir la frise (toutes époques)</button>
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a", margin: "8px 0 4px" }}>Aller au chapitre :</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {chapters.map((ch, i) => (
          <button key={ch.id} onClick={() => onPlayChapter(i)} title={ch.epoque}
            style={{ ...CHEAT_BTN, width: 30, textAlign: "center", padding: "6px 0" }}>{i + 1}</button>
        ))}
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a", margin: "10px 0 4px" }}>Écrans de fin :</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button style={CHEAT_BTN} onClick={() => { onSetChapterIndex(chapters.length - 1); onSetScreen("chronautes"); }}>🌀 Station des chronautes</button>
        <button style={CHEAT_BTN} onClick={() => { onSetChapterIndex(chapters.length - 1); onSetEpiChoice(null); onSetScreen("epilogue"); }}>❓ Épilogue (support ?)</button>
        <button style={CHEAT_BTN} onClick={() => { onSetChapterIndex(chapters.length - 1); onSetScreen("end"); }}>🏁 Écran de fin</button>
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a", margin: "10px 0 4px" }}>Jeu 2 (Al3x1A) :</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button style={CHEAT_BTN} onClick={onNewGameJeu2}>🎲 Démarrer nouveau Jeu 2</button>
        <button style={CHEAT_BTN}
          onClick={() => { if (mode === "jeu2" && jeu2Target >= 0) { onSetChapterIndex(jeu2Target); onSetTab(jeu2[jeu2Target].al3x1aHotspot.tab); } }}
          title="Aller directement au chapitre cible d'Al3x1A">📍 Aller à Al3x1A</button>
        {mode === "jeu2" && jeu2Target >= 0 && (
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#c88aff", padding: "3px 6px" }}>
            Cible : ch.{jeu2Target + 1} · notes : {jeu2Notes.length}/9
          </div>
        )}
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a", margin: "10px 0 4px" }}>Jeu 3 (Le Puits · 2087) :</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button style={CHEAT_BTN} onClick={onNewGameJeu3}>🌑 Démarrer le Jeu 3</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Kova}>🎯 Direct enquête 1 · Kova</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Vitamine}>🎯 Direct enquête 2 · Vitamine</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Jour40}>🎯 Direct enquête 3 · 40e jour</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Enfant}>🎯 Direct enquête 4 · Enfant du haut</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Champble}>🎯 Direct enquête 5 · Champ de blé</button>
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 9.5, color: "#6a5a7a", marginTop: 8 }}>tape « triche » pour fermer</div>
    </div>
  );
}
