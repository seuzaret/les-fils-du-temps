import { useState } from "react";
import PnjSprite from "./PnjSprite.jsx";
import { findMissionTemoinForPnj } from "./missions.js";
import { SMALLTALK_QUESTIONS } from "./pnj.js";
import { teaserFor } from "./teasers.js";

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
  const [smalltalk, setSmalltalk] = useState(null); // id du PNJ en mode orientation
  const current = selected ? pnjList.find((p) => p.id === selected) : null;
  const chatPnj = smalltalk ? pnjList.find((p) => p.id === smalltalk) : null;
  const activeMission = j3?.activeMission;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 1600, height: "100%", padding: 4, boxSizing: "border-box", overflowY: "auto" }}>
      {titre && (
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#8fa3bd" }}>
          {titre}
        </div>
      )}
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%", cursor: selected ? "pointer" : "default" }}
        onClick={() => setSelected(null)}>
        {bg}
        {pnjList.map((p) => {
          /* Si ce PNJ est un témoin de l'enquête active, cliquer l'ouvre
             en mode interrogatoire (modal top-level) au lieu de la
             réplique d'ambiance. Un halo doré signale cette qualité. */
          const temoin = findMissionTemoinForPnj(activeMission, p.id);
          const heardAsPnj = !!j3.heardPnj[p.id];
          const asked = temoin ? (j3.enqAnswered?.[temoin.id]?.size || 0) : 0;
          /* Loupe visible :
             - avant Kova faite → sur tous les PNJ (phase orientation)
             - après Kova faite → uniquement sur les témoins de l'enquête
               active (teaser avant interrogatoire officiel). */
          const kovaDone = !!j3.flags?.mission_kova_done;
          const showLoupe = !kovaDone || !!temoin;
          return (
            <PnjSprite key={p.id}
              x={p.pose.x} y={p.pose.y}
              color={p.color} hair={p.hair} pants={p.pants} skin={p.skin}
              facing={p.facing || "front"}
              pose={p.poseKind || "stand"} accessory={p.accessory || null}
              activity={p.activity || null}
              nom={p.nom} role={p.role}
              heard={temoin ? asked > 0 : heardAsPnj}
              active={!!temoin && asked === 0}
              onSmalltalk={showLoupe ? () => setSmalltalk(p.id) : null}
              onClick={() => {
                if (temoin) {
                  j3.openInterview(temoin.id);
                  j3.hear(p.id);
                } else {
                  setSelected(p.id);
                  j3.hear(p.id);
                }
              }} />
          );
        })}
      </svg>
      <div style={{ maxWidth: 820, width: "100%", minHeight: 90 }} onClick={() => setSelected(null)}>
        {current ? (
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: "#141020", border: "1px solid #3a80c8", borderRadius: 10, padding: "12px 16px", cursor: "default" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#7fd8ff" }}>
              {current.nom.toUpperCase()} · {current.role}
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 17, lineHeight: 1.55, color: "#e8eef5" }}>
              {current.replique}
            </p>
            <div style={{ marginTop: 6, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a7a90", fontStyle: "italic", textAlign: "right" }}>
              Clique ailleurs pour fermer ▸
            </div>
          </div>
        ) : (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#7a879e", fontStyle: "italic" }}>
              Clique un PNJ pour écouter ce qu'il ou elle a à dire.
            </p>
          </div>
        )}
      </div>

      {chatPnj && (
        <SmalltalkModal
          pnj={chatPnj}
          temoin={findMissionTemoinForPnj(activeMission, chatPnj.id)}
          kovaDone={!!j3.flags?.mission_kova_done}
          onInterview={(temoinId) => {
            setSmalltalk(null);
            j3.openInterview(temoinId);
            j3.hear(chatPnj.id);
          }}
          onClose={() => setSmalltalk(null)} />
      )}
    </div>
  );
}

/* --------- Modale d'orientation / teaser d'enquête ---------
   Deux modes selon le contexte :
   - Avant Kova → mode orientation (3 questions : où / pourquoi moi / toi).
   - Après Kova, PNJ témoin de l'enquête active → mode teaser (1 phrase
     d'amorce + bouton pour lancer l'interrogatoire officiel). */
function SmalltalkModal({ pnj, temoin, kovaDone, onInterview, onClose }) {
  const [picked, setPicked] = useState(null);
  const teaserMode = kovaDone && !!temoin;
  const teaser = teaserMode ? teaserFor(temoin.id) : null;
  const answerFor = (qid) => qid === "toi" ? pnj.replique : pnj[qid];
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
            🔍 {pnj.nom.toUpperCase()} · {pnj.role}
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#8fa3bd", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        {teaserMode ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#e0a848", letterSpacing: 1, marginBottom: 6 }}>
              « Un indice avant qu'on commence ? »
            </div>
            <div style={{ padding: "10px 14px", background: "#141b26", borderLeft: "2px solid #e0a848", borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "#e8eef5", fontStyle: "italic" }}>
                « {teaser || "— Pas grand-chose à ajouter avant l'interrogatoire. —"} »
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button onClick={() => onInterview(temoin.id)}
                style={{ background: "#e0a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                Interroger officiellement ▸
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {SMALLTALK_QUESTIONS.map((row) => {
                const isPicked = picked === row.id;
                const hasAnswer = !!answerFor(row.id);
                return (
                  <div key={row.id}>
                    <button onClick={() => hasAnswer && setPicked(isPicked ? null : row.id)}
                      disabled={!hasAnswer}
                      style={{
                        width: "100%", textAlign: "left",
                        background: isPicked ? "#0e2a3a" : "#141b26",
                        color: hasAnswer ? (isPicked ? "#7fd8ff" : "#e8eef5") : "#5a6678",
                        border: `1px solid ${isPicked ? "#7fd8ff" : "#3a4048"}`,
                        borderRadius: 8, padding: "8px 12px",
                        fontFamily: "ui-monospace,monospace", fontSize: 12.5,
                        cursor: hasAnswer ? "pointer" : "default",
                      }}>
                      {isPicked ? "▾" : "▸"} {row.q}
                    </button>
                    {isPicked && hasAnswer && (
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
            <div style={{ marginTop: 10, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a7a90", textAlign: "right", fontStyle: "italic" }}>
              Clique une question pour entendre la réponse.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
