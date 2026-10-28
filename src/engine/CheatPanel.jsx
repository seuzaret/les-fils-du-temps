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
  chapters, jeu2, mode, chapterIndex, jeu2Target, jeu2Notes, jeu2AlxPick = 0,
  onFillFrise,
  onPlayChapter,
  onSetChapterIndex, onSetScreen, onSetEpiChoice, onSetTab, onCheatFinJeu2,
  onNewGameJeu2, onNewGameJeu3,
  onCheatJeu3Kova,
  onCheatJeu3Archives,
  onCheatJeu3Tri2,
  onCheatJeu3Tri3,
  onCheatJeu3Phase3,
  onCheatJeu3Phase4,
  onCheatJeu3Phase5,
  onCheatJeu3Phase6,
  onCheatJeu3Cailloux,
  onCheatJeu3Final,
  onCheatJeu3Epilogue,
}) {
  if (!cheat) return null;
  return (
    /* le panneau ne dépasse jamais de l'écran : il défile à l'intérieur,
       l'en-tête (et la croix) reste collé en haut */
    <div style={{
      position: "fixed", left: 8, bottom: 8, zIndex: 300, width: 208,
      maxHeight: "calc(100dvh - 16px)", overflowY: "auto", overscrollBehavior: "contain",
      background: "rgba(18,8,28,0.96)", border: "1px solid #a04ce8",
      borderRadius: 10, padding: "0 10px 10px", boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1,
        background: "rgba(18,8,28,1)", padding: "10px 0 8px", marginBottom: 2 }}>
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
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a", marginTop: 2 }}>Fin du Jeu 2 (cinématiques) :</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {[["💊 Remède", 0], ["🧠 Mémoire", 1], ["🥂 Jeu 2B", 2], ["🕳 Puits", 3], ["🌑 Discern.", 4]].map(([l, ph]) => (
            <button key={ph} style={{ ...CHEAT_BTN, width: "auto", flex: "1 1 45%" }} onClick={() => onCheatFinJeu2(ph)}>{l}</button>
          ))}
        </div>
        <button style={CHEAT_BTN}
          onClick={() => { if (mode === "jeu2" && jeu2Target >= 0) { onSetChapterIndex(jeu2Target); const spots = jeu2[jeu2Target].al3x1aSpots || []; onSetTab((spots[jeu2AlxPick] || spots[0])?.tab ?? 0); } }}
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
        <button style={CHEAT_BTN} onClick={onCheatJeu3Kova}>🎯 Direct Bureau (billet reçu)</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Archives}>🗂 Direct Archives (Kova faite)</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Tri2}>🗂 Jorge · Tri 2 prêt</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Tri3}>🗂 Jorge · Tri 3 prêt</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Phase3}>🔒 Phase 3 (Jorge arrêté)</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Phase4}>⟡ Phase 4 (étage K)</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Phase5}>⟲ Phase 5 (voyages)</button>
        <button style={CHEAT_BTN} onClick={onCheatJeu3Phase6}>⧗ Phase 6 (pont Jorge → −3)</button>
        <button style={CHEAT_BTN} onClick={() => onCheatJeu3Cailloux(false)}>🪨 Cailloux · bibliothèque (1er papier)</button>
        <button style={CHEAT_BTN} onClick={() => onCheatJeu3Cailloux(true)}>🗝 Cailloux · réserve (clé + 4 papiers)</button>
        <button style={CHEAT_BTN} onClick={() => onCheatJeu3Final(1)}>⚠ −3 · 1re visite (note en poche)</button>
        <button style={CHEAT_BTN} onClick={() => onCheatJeu3Final(2)}>⚔ −3 · 2e visite (monde 2 fini, combat)</button>
        <button style={CHEAT_BTN} onClick={() => onCheatJeu3Epilogue("eteindre")}>🌅 Épilogue (après T'ÉTEINDRE)</button>
        <button style={CHEAT_BTN} onClick={() => onCheatJeu3Epilogue("modifier")}>🌅 Épilogue (après TE MODIFIER)</button>
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7a9a", margin: "10px 0 4px" }}>Monde 2 (chez MARTINE) :</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button style={CHEAT_BTN} onClick={() => { window.location.href = "martine/"; }}>🙃 Entrer dans le monde 2</button>
        <button style={CHEAT_BTN} onClick={() => { window.location.href = "martine/?fin=1"; }}>✨ La finale (« Le temps est rétabli »)</button>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 9.5, color: "#6a5a7a" }}>dans le monde 2, tape « triche » (ou 🐛) : ranger une époque, tout ranger…</div>
      </div>

      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 9.5, color: "#6a5a7a", marginTop: 8 }}>tape « triche » (ou 🐛) pour fermer · sur téléphone : ?triche dans l'adresse</div>
    </div>
  );
}
