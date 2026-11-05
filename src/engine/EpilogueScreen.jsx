import { Avatar } from "./Martine.jsx";
import Gauges from "./Gauges.jsx";
import { playSfx } from "./audio.js";
import * as EPILOGUE from "../chapters/epilogue/data.js";
import { PortraitElias } from "../chapters/epilogue/StationChronautes.jsx";

/* ============================================================
   MOTEUR — Écran ÉPILOGUE : « Ton support pour +20 000 ans ».
   ------------------------------------------------------------
   Deux phases dans le même écran :
   - `epiChoice === null` : Elias pose la question ; l'élève
     choisit un support parmi ceux affichés.
   - `epiChoice !== null` : MARTINE réagit avec la réponse
     argumentée du support, la chute commune, puis boutons
     "Essayer un autre support" / "Le bilan du voyage".
   Aucun état propre : `epiChoice` vient du parent, qui gère
   aussi `setScreen("end")` pour aller au bilan.
   ============================================================ */
export default function EpilogueScreen({ epiChoice, onChoose, onReset, onEnd }) {
  const choisi = EPILOGUE.SUPPORTS.find((s) => s.id === epiChoice);
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 20%, #1a2f4a 0%, #080d16 70%)", padding: 20, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
      <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
        {/* Portrait : ELIAS pour la question, MARTINE pour la réponse. */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          {choisi ? (
            <Avatar mood="content" size={92} date="+20 000" />
          ) : (
            <div style={{ width: 92, height: 110, borderRadius: 12, overflow: "hidden", border: "2px solid #ffd166", boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }}>
              <PortraitElias mood="content" />
            </div>
          )}
        </div>
        <div style={{ fontFamily: "ui-monospace,monospace", color: choisi ? "#5eff9e" : "#ffd166", letterSpacing: 3, fontSize: 12, marginTop: 8 }}>
          {choisi ? "MARTINE" : "ELIAS · ULTIME QUESTION"}
        </div>

        {!choisi ? (
          <>
            {EPILOGUE.QUESTION.map((l, i) => (
              <p key={i} style={{ fontSize: 16.5, lineHeight: 1.65, color: "#c8d4e2", margin: "10px 0" }}>« {l} »</p>
            ))}
            <h1 style={{ fontFamily: "ui-monospace,monospace", color: "#ffd166", fontSize: 24, letterSpacing: 2, marginTop: 20 }}>
              {EPILOGUE.QUESTION_TITRE}
            </h1>
            <p style={{ color: "#8fa3bd", fontSize: 14, fontStyle: "italic", marginTop: 2 }}>
              Il n'y a pas de bonne réponse. Choisis, et écoute ce que MARTINE en pense.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, marginTop: 20, marginBottom: 40 }}>
              {EPILOGUE.SUPPORTS.map((s) => (
                <button key={s.id} onClick={() => { playSfx("craft"); onChoose(s.id); }}
                  style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 10px", cursor: "pointer", color: "#e8eef5", fontFamily: "Palatino, Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 30 }}>{s.emoji}</span>
                  <span style={{ fontSize: 15.5, fontWeight: 700 }}>{s.name}</span>
                  <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#8fa3bd" }}>
                    ⏳ durabilité {s.jauges.durabilite}/5
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 52, marginTop: 10 }}>{choisi.emoji}</div>
            <h1 style={{ fontFamily: "ui-monospace,monospace", color: "#ffd166", fontSize: 22, letterSpacing: 1, margin: "4px 0 0" }}>
              {choisi.name}
            </h1>
            {/* réponse argumentée de MARTINE */}
            <div style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 18px", marginTop: 14, textAlign: "left" }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#e8eef5", margin: 0 }}>« {choisi.reponse} » — MARTINE</p>
              <div style={{ marginTop: 12 }}><Gauges values={choisi.jauges} /></div>
            </div>
            {/* la chute (identique quel que soit le choix) */}
            <div style={{ background: "#0e1420", border: "1px solid #5a4a20", borderRadius: 12, padding: "14px 18px", marginTop: 12, textAlign: "left" }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#ffd166", fontStyle: "italic", margin: 0 }}>« {EPILOGUE.CHUTE} »</p>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", margin: "20px 0 40px" }}>
              <button onClick={onReset}
                style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 12, padding: "11px 20px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
                ← Essayer un autre support
              </button>
              <button onClick={onEnd}
                style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 12, padding: "12px 26px", fontSize: 15.5, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1.5, boxShadow: "0 0 24px rgba(94,255,158,0.35)" }}>
                LE BILAN DU VOYAGE →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
