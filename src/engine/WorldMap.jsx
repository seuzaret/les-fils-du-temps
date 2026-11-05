/* ============================================================
   CARTE dépliable — coquille modale générique
   ------------------------------------------------------------
   Montre où l'on se trouve dans le chapitre courant. Chaque
   chapitre fournit sa propre carte régionale (`chapter.carte`,
   un composant SVG) ; le moteur ne connaît pas la géographie.
   On lui passe `tab` (l'index du tableau courant) pour qu'il
   fasse briller le bon lieu.
   ============================================================ */

/* Mini-carte toujours visible, dockée sur le côté de la zone de jeu.
   Un aperçu réduit de la carte du chapitre (le lieu courant brille) ;
   un clic ouvre la grande carte. */
export function MiniMap({ Carte, tab, label, onOpen }) {
  if (!Carte) return null;
  return (
    <button onClick={onOpen} title="Voir la carte du voyage"
      style={{ marginTop: 8, flex: "0 0 auto", width: "100%", background: "linear-gradient(180deg,#141b28,#0c1220)", border: "1px solid #26324a", borderRadius: 10, padding: 5, cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 8, letterSpacing: 1, color: "#7fd8ff", textAlign: "center" }}>🗺 OÙ SUIS-JE ?</div>
      <div style={{ borderRadius: 6, overflow: "hidden", border: "1px solid #2a3648", lineHeight: 0 }}>
        <Carte tab={tab} />
      </div>
      {label && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#ffd166", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>◉ {label}</div>}
    </button>
  );
}

export function WorldMap({ Carte, tab, titre = "Où sommes-nous ?", onClose }) {
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "2px solid #e8934a66", borderRadius: 18, padding: 18, maxWidth: 720, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e8934a" }}>🗺 LE VOYAGE DU CHAPITRE</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 12px", color: "#ffd166", fontSize: 21 }}>{titre}</h2>

        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #2a3648" }}>
          {Carte ? <Carte tab={tab} /> : (
            <p style={{ padding: 24, textAlign: "center", color: "#8fa3bd" }}>Carte à venir pour cette époque.</p>
          )}
        </div>

        <button onClick={onClose}
          style={{ marginTop: 12, width: "100%", background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "11px", fontWeight: 800, cursor: "pointer", fontSize: 15.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          Fermer
        </button>
      </div>
    </div>
  );
}
