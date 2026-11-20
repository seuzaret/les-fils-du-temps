import { useEffect, useRef, useState } from "react";
import PnjSprite from "./PnjSprite.jsx";
import { findMissionTemoinForPnj } from "./missions.js";
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
     pnjList  — [{id, nom, role, pose, color, hair, replique,
                 repliqueApres, ou}] (voir pnj.js)
     j3       — l'état partagé (heardPnj, hear(), flags)
     onGo     — callback navigation
   ============================================================ */
export default function PnjRoom({ titre, bg, pnjList, j3, onGo }) {
  const [selected, setSelected] = useState(null);
  const [smalltalk, setSmalltalk] = useState(null); // id du témoin dont on lit l'amorce
  const [ouPour, setOuPour] = useState(null); // id du PNJ qui a répondu à « On est où, ici ? »
  const current = selected ? pnjList.find((p) => p.id === selected) : null;
  const chatPnj = smalltalk ? pnjList.find((p) => p.id === smalltalk) : null;
  const activeMission = j3?.activeMission;
  /* La réplique change avec l'histoire : confiance en MARTINE avant
     l'arrestation de Jorge, doutes à voix haute après (pnj.js). */
  const apres = !!j3.flags?.jorge_arrete;
  const repliqueDe = (p) => (apres && p.repliqueApres) || p.replique;
  /* Avant le billet de Vez, le joueur vient de se réveiller et ne sait
     pas où il est : chaque PNJ peut lui répondre. */
  const perdu = !j3.flags?.puits_billet;
  /* Sur un écran bas (portable 1366×768, téléphone), le panneau de
     réplique tombe sous le bord : on le fait défiler jusqu'à lui quand
     il s'ouvre ou qu'il s'agrandit (réponse à « On est où, ici ? »). */
  const panneauRef = useRef(null);
  useEffect(() => {
    if (!selected || !panneauRef.current) return;
    const calme = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-calme");
    panneauRef.current.scrollIntoView({ block: "nearest", behavior: calme ? "auto" : "smooth" });
  }, [selected, ouPour]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 1600, height: "100%", padding: 4, boxSizing: "border-box", overflowY: "auto" }}>
      {titre && (
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#8fa3bd" }}>
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
          /* Loupe visible seulement sur les témoins de l'enquête active,
             une fois le briefing de Vez lu (amorce avant l'interrogatoire
             officiel). Sinon aucune loupe, pour ne rien spoiler. */
          const activeBriefed = !!activeMission && !!j3.flags?.[`briefing_${activeMission.id}_done`];
          const showLoupe = activeBriefed && !!temoin;
          /* L'interrogatoire officiel ne s'ouvre qu'après briefing — sinon
             on retombe sur la réplique d'ambiance. Évite que la cantine
             déballe l'enquête Viande (ou autre) avant que Vez ait donné
             la mission. */
          const canInterview = !!temoin && activeBriefed;
          return (
            <PnjSprite key={p.id}
              x={p.pose.x} y={p.pose.y}
              color={p.color} hair={p.hair} pants={p.pants} skin={p.skin}
              look={p.look} hat={p.hat} hatColor={p.hatColor} hatColor2={p.hatColor2} mustache={p.mustache} glasses={p.glasses} earrings={p.earrings}
              mood={p.mood} bald={p.bald} beard={p.beard} beardKind={p.beardKind}
              facing={p.facing || "front"}
              pose={p.poseKind || "stand"} accessory={p.accessory || null}
              activity={p.activity || null}
              nom={p.nom} role={p.role}
              heard={canInterview ? asked > 0 : heardAsPnj}
              active={canInterview && asked === 0}
              onSmalltalk={showLoupe ? () => setSmalltalk(p.id) : null}
              onClick={() => {
                if (canInterview) {
                  j3.openInterview(temoin.id);
                  j3.hear(p.id);
                } else {
                  setSelected(p.id);
                  setOuPour(null);
                  j3.hear(p.id);
                }
              }} />
          );
        })}
      </svg>
      <div style={{ maxWidth: 820, width: "100%", minHeight: 90 }} onClick={() => setSelected(null)}>
        {current ? (
          <div ref={panneauRef} onClick={(e) => e.stopPropagation()}
            style={{ background: "#141020", border: "1px solid #3a80c8", borderRadius: 10, padding: "12px 16px", cursor: "default" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, letterSpacing: 2, color: "#7fd8ff" }}>
              {current.nom.toUpperCase()} · {current.role}
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 17, lineHeight: 1.55, color: "#e8eef5" }}>
              {repliqueDe(current)}
            </p>
            {perdu && current.ou && (ouPour === current.id ? (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px dashed #2a3a50" }}>
                <p style={{ margin: 0, fontSize: 15.5, color: "#8fa3bd", fontStyle: "italic" }}>
                  Toi : « On est où, ici ? »
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 17, lineHeight: 1.55, color: "#e8eef5" }}>
                  {current.ou}
                </p>
              </div>
            ) : (
              <button onClick={() => setOuPour(current.id)}
                style={{ marginTop: 10, background: "#0e2a3a", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 8, padding: "8px 14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
                ❓ On est où, ici ?
              </button>
            ))}
            <div style={{ marginTop: 6, fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#5a7a90", fontStyle: "italic", textAlign: "right" }}>
              Clique ailleurs pour fermer ▸
            </div>
          </div>
        ) : (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 14.5, color: "#7a879e", fontStyle: "italic" }}>
              Clique un PNJ pour écouter ce qu'il ou elle a à dire.
            </p>
          </div>
        )}
      </div>

      {chatPnj && (
        <SmalltalkModal
          pnj={chatPnj}
          temoin={findMissionTemoinForPnj(activeMission, chatPnj.id)}
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

/* --------- Modale d'amorce d'enquête ---------
   Sur un PNJ témoin de l'enquête active (briefing lu) : une phrase
   d'amorce + le bouton qui lance l'interrogatoire officiel. (L'ancien
   mode « orientation » à trois questions a été retiré le 2026-11-20 :
   « Et toi ? » répétait la réplique ; « On est où, ici ? » est
   maintenant un bouton du panneau, avant le billet.) */
function SmalltalkModal({ pnj, temoin, onInterview, onClose }) {
  if (!temoin) return null;
  const teaser = teaserFor(temoin.id);
  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1218", border: "2px solid #7fd8ff", borderRadius: 12, padding: 18, maxWidth: 620, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, letterSpacing: 2, color: "#7fd8ff" }}>
            🔍 {pnj.nom.toUpperCase()} · {pnj.role}
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#8fa3bd", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#e0a848", letterSpacing: 1, marginBottom: 6 }}>
            « Un indice avant qu'on commence ? »
          </div>
          <div style={{ padding: "10px 14px", background: "#141b26", borderLeft: "2px solid #e0a848", borderRadius: 6 }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55, color: "#e8eef5", fontStyle: "italic" }}>
              « {teaser || "— Pas grand-chose à ajouter avant l'interrogatoire. —"} »
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button onClick={() => onInterview(temoin.id)}
              style={{ background: "#e0a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Interroger officiellement ▸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
