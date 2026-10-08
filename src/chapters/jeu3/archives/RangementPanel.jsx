import { useMemo, useState } from "react";
import MediadexPanel from "../MediadexPanel.jsx";
import { tirerFiches } from "./fiches.js";

/* ============================================================
   JEU 3 — Mission de l'archiviste Jorge : ranger 6 fiches
   ------------------------------------------------------------
   Boucle de jeu simple :
   - 6 fiches sont posées une à une (pile verticale), chacune
     avec 2 actions : "✓ Ranger" ou "⚠ Signaler à Jorge".
   - Les fiches falsifiées déclenchent, au clic "Ranger", une
     voix off ("ça ne colle pas avec ce que je me rappelle…")
     et ré-affichent les 2 boutons.
   - Le bouton "Signaler" sur une fiche falsifiée pose le flag
     correspondant au dossier + Jorge dit "chut".
   - Le bouton "Signaler" sur une fiche honnête vaut un
     feedback négatif de Jorge, sans conséquence.
   - Le bouton "Consulter mon médiadex" ouvre le vrai Mediadex
     (grisé tant que mediadex_retrouve n'est pas posé).
   ============================================================ */
export default function RangementPanel({ j3, onDone }) {
  const [fiches] = useState(() => tirerFiches());
  const [idx, setIdx] = useState(0);
  const [resolved, setResolved] = useState({}); // { fid: "range"|"signale" }
  const [feedback, setFeedback] = useState(null);
  const [mediadexOpen, setMediadexOpen] = useState(false);
  const mediadexRetrouve = !!j3.flags.mediadex_retrouve;

  const fiche = fiches[idx];
  const total = fiches.length;
  const done = idx >= total;

  const next = () => {
    setFeedback(null);
    setIdx((i) => i + 1);
  };

  const ranger = () => {
    if (!fiche) return;
    if (fiche.falsified) {
      /* Voix off : le joueur hésite, les boutons restent. */
      setFeedback({
        type: "doute",
        text: "« Tiens… cette date ne colle pas avec ce que je me rappelle. »",
      });
      return;
    }
    setResolved((r) => ({ ...r, [fiche.id]: "range" }));
    next();
  };

  const signaler = () => {
    if (!fiche) return;
    if (fiche.falsified) {
      j3.setFlag(`archives_signalement_${fiche.dossierId}`);
      j3.setFlag("archives_signalement_fait");
      setFeedback({
        type: "chut",
        text: "Jorge se raidit, baisse la voix : « Chut. On en reparlera plus tard. Range-la, pour l'instant. »",
      });
      setResolved((r) => ({ ...r, [fiche.id]: "signale" }));
      setTimeout(next, 1600);
    } else {
      setFeedback({
        type: "mauvais",
        text: "Jorge jette un œil : « Non, cette date est correcte. Range-la. »",
      });
      setTimeout(() => {
        setResolved((r) => ({ ...r, [fiche.id]: "range" }));
        next();
      }, 1600);
    }
  };

  const nbSignale = useMemo(
    () => Object.values(resolved).filter((v) => v === "signale").length,
    [resolved]
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.86)", zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#141008", border: "2px solid #c8a848", borderRadius: 12,
        padding: 18, maxWidth: 720, width: "100%", maxHeight: "92vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848" }}>
              📂 RANGEMENT · JORGE
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: "#e8dfc8", marginTop: 2 }}>
              Classe mes fiches, chronaute.
            </div>
          </div>
          <button onClick={onDone}
            style={{ background: "transparent", border: "none", color: "#8a7050", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        {!done && (
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#c8b090", flex: 1 }}>
              FICHE {idx + 1} / {total}
            </div>
            <button onClick={() => setMediadexOpen(true)} disabled={!mediadexRetrouve}
              title={mediadexRetrouve ? "" : "À récupérer dans ta chambre d'abord."}
              style={{
                background: mediadexRetrouve ? "#2a1808" : "#1a1408",
                color: mediadexRetrouve ? "#ffd166" : "#5a4028",
                border: `1px solid ${mediadexRetrouve ? "#c8a848" : "#3a2818"}`,
                borderRadius: 8, padding: "6px 12px",
                fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 700,
                cursor: mediadexRetrouve ? "pointer" : "not-allowed", letterSpacing: 1,
              }}>
              📘 Consulter mon médiadex
            </button>
          </div>
        )}

        {!done && (
          <FicheCard fiche={fiche} />
        )}

        {!done && feedback && (
          <div style={{
            marginTop: 10, padding: "10px 12px",
            background: feedback.type === "chut" ? "#2a1808" : "#1a1408",
            border: `1px solid ${feedback.type === "chut" ? "#e0a848" : feedback.type === "doute" ? "#7fd8ff" : "#5a4028"}`,
            borderRadius: 8,
          }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#e8dfc8", fontStyle: "italic" }}>
              {feedback.text}
            </p>
          </div>
        )}

        {!done && (
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button onClick={signaler}
              style={{
                background: "#2a1408", color: "#e0a848",
                border: "1px solid #e0a848", borderRadius: 8, padding: "9px 14px",
                fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1,
              }}>
              ⚠ Signaler à Jorge
            </button>
            <button onClick={ranger}
              style={{
                background: "#0e2818", color: "#5eff9e",
                border: "1px solid #5eff9e", borderRadius: 8, padding: "9px 14px",
                fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1,
              }}>
              ✓ Ranger
            </button>
          </div>
        )}

        {done && (
          <div style={{
            marginTop: 14, padding: "12px 14px",
            background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 8,
          }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#5eff9e", marginBottom: 4 }}>
              ✓ RANGEMENT TERMINÉ · {nbSignale} fiche{nbSignale > 1 ? "s" : ""} signalée{nbSignale > 1 ? "s" : ""}
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#c8ffdd" }}>
              {nbSignale > 0
                ? "Jorge empile les fiches en silence. « Pas mal, chronaute. Reviens me voir plus tard. »"
                : "Jorge empile les fiches en silence. « Tout est en ordre, à ce qu'il paraît. »"}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button onClick={onDone}
                style={{
                  background: "#5eff9e", color: "#06110b",
                  border: "none", borderRadius: 8, padding: "9px 18px",
                  fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800,
                  cursor: "pointer", letterSpacing: 1,
                }}>
                Fermer ▸
              </button>
            </div>
          </div>
        )}

        {mediadexOpen && <MediadexPanel onClose={() => setMediadexOpen(false)} />}
      </div>
    </div>
  );
}

/* --------- Carte fiche --------- */
function FicheCard({ fiche }) {
  return (
    <div style={{
      marginTop: 10, padding: "12px 14px",
      background: "#1a1408", border: "1px solid #5a4028", borderRadius: 8,
    }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7050", letterSpacing: 2 }}>
        FICHE D'ARCHIVE · {fiche.sujet.toUpperCase()}
      </div>
      <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "90px 1fr", gap: "4px 10px" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050" }}>DATE</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#e0a848", fontWeight: 700 }}>{fiche.dateFiche}</div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050" }}>LIEU</div>
        <div style={{ fontSize: 13.5, color: "#e8dfc8" }}>{fiche.lieuFiche}</div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050" }}>PAR QUI</div>
        <div style={{ fontSize: 13.5, color: "#e8dfc8" }}>{fiche.qui}</div>
      </div>
    </div>
  );
}
