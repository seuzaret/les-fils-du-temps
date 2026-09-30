import { useState } from "react";
import PnjSprite from "./PnjSprite.jsx";

/* ============================================================
   JEU 3 — Pièce peuplée de PNJ (helper Cluedo)
   ------------------------------------------------------------
   Rend un décor SVG en fond, y superpose les PNJ (cliquables),
   et affiche sous le SVG un panneau de dialogue avec la
   réplique du PNJ actuellement sélectionné. Un bouton
   « Retour au couloir » en bas.
   Props :
     titre    — libellé du bandeau
     bg       — JSX du décor à insérer dans le SVG (viewBox 0 0 800 400)
     pnjList  — [{id, nom, role, pose, color, hair, replique}]
     j3       — l'état partagé (heardPnj, hear())
     onGo     — callback navigation
   ============================================================ */
export default function PnjRoom({ titre, bg, pnjList, j3, onGo }) {
  const [selected, setSelected] = useState(null);
  const current = selected ? pnjList.find((p) => p.id === selected) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 1600, height: "100%", padding: 4, boxSizing: "border-box", overflowY: "auto" }}>
      {titre && (
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#8fa3bd" }}>
          {titre}
        </div>
      )}
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        {bg}
        {pnjList.map((p) => (
          <PnjSprite key={p.id}
            x={p.pose.x} y={p.pose.y}
            color={p.color} hair={p.hair} pants={p.pants} skin={p.skin}
            facing={p.facing || "front"}
            pose={p.poseKind || "stand"} accessory={p.accessory || null}
            activity={p.activity || null}
            nom={p.nom} role={p.role}
            heard={!!j3.heardPnj[p.id]}
            active={selected === p.id}
            onClick={() => { setSelected(p.id); j3.hear(p.id); }} />
        ))}
      </svg>
      <div style={{ maxWidth: 800, width: "100%", minHeight: 78 }}>
        {current ? (
          <div style={{ background: "#141020", border: "1px solid #3a80c8", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#7fd8ff" }}>
              {current.nom.toUpperCase()} · {current.role}
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#e8eef5" }}>
              « {current.replique} »
            </p>
          </div>
        ) : (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#7a879e", fontStyle: "italic" }}>
              Clique un PNJ pour écouter ce qu'il ou elle a à dire.
            </p>
          </div>
        )}
      </div>
      <button onClick={() => onGo(j3?.hubRoom || "hub")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Retour au couloir
      </button>
    </div>
  );
}
