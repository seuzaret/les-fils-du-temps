import { useState } from "react";
import PnjSprite from "./PnjSprite.jsx";
import useEcran from "../../engine/useEcran.js";

/* ============================================================
   JEU 3 — Dialogue plein écran (type scènes du jeu 1)
   ------------------------------------------------------------
   Modal plein écran pour les dialogues narratifs longs : le
   personnage occupe le côté gauche (SVG grand format), le texte
   se révèle à droite une réplique à la fois. Clic n'importe où
   = avance. À la dernière réplique, un bouton d'action apparaît.
   Props :
     speakerNom, speakerRole — libellé en haut à droite
     speakerStyle — { color, pants, hair, skin, facing, accessory, activity }
     lignes — tableau de répliques
     onDone — appelé après la dernière réplique (si pas d'actionLabel)
             ou quand on clique le bouton d'action
     actionLabel — texte du bouton final optionnel
     accent — couleur d'accent (défaut doré Vez)
   Téléphone : en portrait, le personnage passe au-dessus du texte
   (bandeau de 130 px) ; en paysage, panneaux resserrés et texte
   plus petit, pour que tout tienne dans la hauteur.
   ============================================================ */
export default function BigDialogue({
  speakerNom = "?", speakerRole = "",
  speakerStyle = {}, lignes = [],
  onDone, actionLabel, accent = "#e0a848",
  topic = null,
  secondaryActionLabel = null, onSecondary = null,
}) {
  const [i, setI] = useState(0);
  const isLast = i === lignes.length - 1;
  const { etroit, bas } = useEcran();
  const compact = etroit || bas;
  const advance = (e) => {
    if (e) e.stopPropagation();
    if (!isLast) setI(i + 1);
    else if (!actionLabel) onDone?.();
  };
  return (
    <div onClick={advance}
      style={{ position: "fixed", inset: 0, zIndex: 180, background: "rgba(4,8,14,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: compact ? "flex-start" : "center", padding: compact ? 8 : 20, overflowY: "auto", cursor: "pointer", fontFamily: "Palatino, Georgia, serif" }}>
      {topic && (
        <div style={{ maxWidth: 960, width: "100%", marginBottom: compact ? 6 : 12, textAlign: "center", flex: "0 0 auto" }}>
          <div style={{ display: "inline-block", background: "#141020", border: `1px solid ${accent}`, borderRadius: 6, padding: compact ? "4px 10px" : "6px 18px", fontFamily: "ui-monospace,monospace", fontSize: compact ? 10 : 12, letterSpacing: compact ? 1.5 : 3, color: accent, fontWeight: 700 }}>
            {topic}
          </div>
        </div>
      )}
      <div onClick={advance}
        style={{ maxWidth: 960, width: "100%", display: "flex", flexDirection: etroit ? "column" : "row", gap: compact ? 8 : 20, alignItems: "stretch", flex: "0 0 auto", margin: compact ? "auto 0" : 0 }}>
        {/* Portrait resserré — panneau plus petit, mais viewBox cadrée sur Vez pour qu'il remplisse */}
        <div style={{ flex: etroit ? "0 0 130px" : `0 0 ${bas ? 120 : 220}px`, height: etroit ? 130 : undefined, background: "#0e1420", border: `2px solid ${accent}`, borderRadius: 12, padding: 6, display: "flex", alignItems: "flex-end", justifyContent: "center", boxShadow: `0 0 24px ${accent}44`, overflow: "hidden" }}>
          <svg viewBox="58 180 84 230" style={etroit ? { height: "100%", width: "auto" } : { width: "100%", height: "auto" }}>
            <PnjSprite x={100} y={400}
              {...speakerStyle}
              color={speakerStyle.color || "#3a2818"}
              pants={speakerStyle.pants || "#1a1408"}
              hair={speakerStyle.hair || "#c8b090"}
              skin={speakerStyle.skin || "#c8a888"}
              facing={speakerStyle.facing || "front"}
              accessory={speakerStyle.accessory || null}
              activity={speakerStyle.activity || null}
              bald={!!speakerStyle.bald}
              beard={speakerStyle.beard || null}
              nom="" role="" />
          </svg>
        </div>

        {/* Panneau texte */}
        <div style={{ flex: 1, minWidth: 0, background: "#141020", border: `2px solid ${accent}`, borderRadius: 12, padding: compact ? "12px 14px" : "22px 28px", color: "#e8eef5", boxShadow: `0 0 24px ${accent}44`, display: "flex", flexDirection: "column", minHeight: compact ? 0 : 360 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: compact ? 8 : 14, paddingBottom: compact ? 6 : 10, borderBottom: `1px solid ${accent}44` }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 14, letterSpacing: 2, color: accent, fontWeight: 800 }}>
              {speakerNom.toUpperCase()}
            </div>
            {speakerRole && (
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#8fa3bd", fontStyle: "italic" }}>
                {speakerRole}
              </div>
            )}
          </div>

          <p style={{ margin: 0, fontSize: compact ? 16 : 20, lineHeight: compact ? 1.5 : 1.6, color: "#e8eef5" }}>
            {lignes[i]}
          </p>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: compact ? 12 : 20, paddingTop: compact ? 6 : 10, borderTop: `1px solid ${accent}22` }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd" }}>
              {i + 1} / {lignes.length}
            </div>
            {isLast && actionLabel ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {secondaryActionLabel && (
                  <button onClick={(e) => { e.stopPropagation(); onSecondary?.(); }}
                    style={{ background: "transparent", color: accent, border: `1px solid ${accent}`, borderRadius: 8, padding: "10px 18px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                    {secondaryActionLabel}
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); onDone?.(); }}
                  style={{ background: accent, color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                  {actionLabel}
                </button>
              </div>
            ) : (
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd", fontStyle: "italic" }}>
                Clique pour continuer ▸
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
