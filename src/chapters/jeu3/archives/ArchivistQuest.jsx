import { useState } from "react";
import BigDialogue from "../BigDialogue.jsx";
import MediadexPanel from "../MediadexPanel.jsx";
import { tirerFiches, anneeOf } from "./fiches.js";

/* ============================================================
   JEU 3 — Quête de Jorge : briefing → tri → debrief
   ------------------------------------------------------------
   États internes :
   - "intro"      : BigDialogue de Jorge, 3 répliques + "Accepter"
   - "tri"        : mini-jeu de classement chronologique de 4 fiches
   - "debrief"    : BigDialogue "Alors ?" avec 2 choix
   - "signaler"   : écran de sélection de la fiche à signaler
   - "reaction"   : BigDialogue de Jorge réagissant au signalement
   - "fin"        : BigDialogue de clôture → onDone
   ============================================================ */
const JORGE_STYLE = {
  color: "#3a2818", pants: "#1a1408", hair: "#8a8070", skin: "#c8a888",
  facing: "front", accessory: "coat", activity: "write",
  bald: true, beard: "#8a8070",
};

export default function ArchivistQuest({ j3, onDone }) {
  const [phase, setPhase] = useState("intro");
  const [fiches, setFiches] = useState(() => tirerFiches());
  const [order, setOrder] = useState(() => fiches.map((f, i) => i)); // ordre d'affichage
  const [tamponne, setTamponne] = useState(false);
  const [signaled, setSignaled] = useState({}); // { ficheIdx: true/false (si vrai=falsifiée) }
  const [lastReaction, setLastReaction] = useState(null); // {text, falsified, closed}

  const move = (idx, dir) => {
    const i = order.indexOf(idx);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };

  const valider = () => {
    setTamponne(true);
    setTimeout(() => setPhase("debrief"), 1300);
  };

  const choixDebrief = (hasProblem) => {
    if (!hasProblem) {
      setPhase("fin");
    } else {
      setPhase("signaler");
    }
  };

  const signaler = (idx) => {
    const f = fiches[idx];
    const already = signaled[idx] !== undefined;
    if (already) return;
    setSignaled((s) => ({ ...s, [idx]: f.falsified }));
    if (f.falsified) {
      j3.setFlag(`archives_signalement_${f.dossierId}`);
      j3.setFlag("archives_signalement_fait");
      setLastReaction({
        text: "Jorge se raidit, baisse brutalement la voix : « Chut. Oui, celle-là… tais-toi. On en reparlera. » Il range la fiche à part.",
        falsified: true,
      });
    } else {
      setLastReaction({
        text: "Jorge jette un œil, sec : « Non. Celle-là est correcte. Tu te trompes. »",
        falsified: false,
      });
    }
    setPhase("reaction");
  };

  const back = () => setPhase("signaler");

  const closeAll = () => onDone();

  /* ---------- RENDUS ---------- */
  if (phase === "intro") {
    return (
      <BigDialogue
        topic="ARCHIVES · JORGE"
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent="#c8a848"
        lignes={[
          "Tu es l'assistant·e de Vez, à ce qu'on dit. Je te vois arriver depuis une heure.",
          "J'ai des fiches à classer. On me donne ça chaque semaine, c'est pénible. Tu veux m'aider ? Classe-les dans l'ordre chronologique. Rien de plus.",
          "Si une date te paraît bizarre, tu me le diras ensuite — pas pendant. Tu as un médiadex, j'imagine ? Vas-y.",
        ]}
        actionLabel="Accepter la mission ▸"
        onDone={() => setPhase("tri")} />
    );
  }

  if (phase === "tri") {
    return (
      <TriPanel fiches={fiches} order={order} onMove={move}
        onValider={valider} tamponne={tamponne}
        mediadexRetrouve={!!j3.flags.mediadex_retrouve}
        onClose={onDone} />
    );
  }

  if (phase === "debrief") {
    const nbCorrect = countCorrect(order, fiches);
    return (
      <BigDialogue
        topic="ARCHIVES · JORGE"
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent="#c8a848"
        lignes={[
          nbCorrect === fiches.length
            ? "Pas mal, chronaute. Tout est bien rangé."
            : "Il reste quelques erreurs dans ton classement, mais passons.",
          "Alors — tout te paraît en ordre, ou il y a quelque chose de bizarre dans ces fiches ?",
        ]}
        actionLabel="Répondre ▸"
        onDone={() => setPhase("choix")} />
    );
  }

  if (phase === "choix") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
        <div style={{
          background: "#141008", border: "2px solid #c8a848", borderRadius: 12,
          padding: 20, maxWidth: 520, width: "100%", textAlign: "center",
        }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", marginBottom: 10 }}>
            TA RÉPONSE À JORGE
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => choixDebrief(false)}
              style={{ background: "#0e2818", color: "#5eff9e", border: "1px solid #5eff9e", borderRadius: 8, padding: "10px 16px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
              ✓ Tout est en ordre
            </button>
            <button onClick={() => choixDebrief(true)}
              style={{ background: "#2a1408", color: "#e0a848", border: "1px solid #e0a848", borderRadius: 8, padding: "10px 16px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
              ⚠ Il y a un truc bizarre
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "signaler") {
    return (
      <SignalerPanel fiches={fiches} signaled={signaled}
        onSignaler={signaler} onFin={() => setPhase("fin")} />
    );
  }

  if (phase === "reaction") {
    return (
      <BigDialogue
        topic="ARCHIVES · JORGE"
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent={lastReaction?.falsified ? "#e0a848" : "#5a6678"}
        lignes={[lastReaction?.text || ""]}
        actionLabel="Continuer ▸"
        onDone={back} />
    );
  }

  if (phase === "fin") {
    const nbSignale = Object.values(signaled).filter(Boolean).length;
    return (
      <BigDialogue
        topic="ARCHIVES · JORGE"
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent="#c8a848"
        lignes={
          nbSignale > 0
            ? [
                "Jorge empile ses fiches en silence. Il regarde vers la caméra au-dessus de la porte, puis parle plus bas :",
                "« Tu as bon œil. Reviens me voir plus tard. Pas tout de suite — on nous surveille. »",
              ]
            : [
                "Jorge pose son stylo, hoche la tête : « Bon. Range-toi, chronaute. Repasse à l'occasion. »",
              ]
        }
        actionLabel="Fermer ▸"
        onDone={closeAll} />
    );
  }

  return null;
}

/* -------------- Mini-jeu de tri chronologique -------------- */
function TriPanel({ fiches, order, onMove, onValider, tamponne, mediadexRetrouve, onClose }) {
  const [mediadexOpen, setMediadexOpen] = useState(false);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#141008", border: "2px solid #c8a848", borderRadius: 12,
        padding: 18, maxWidth: 740, width: "100%", maxHeight: "92vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848" }}>
              📂 CLASSEMENT CHRONOLOGIQUE
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#e8dfc8", marginTop: 2 }}>
              Range les fiches du plus ancien au plus récent.
            </div>
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
            📘 Vérifier avec le médiadex
          </button>
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {order.map((idx, posIdx) => {
            const f = fiches[idx];
            return (
              <FicheRow key={f.id} fiche={f} pos={posIdx + 1} total={order.length}
                canUp={posIdx > 0} canDown={posIdx < order.length - 1}
                onUp={() => onMove(idx, -1)} onDown={() => onMove(idx, +1)}
                tamponne={tamponne} />
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 8 }}>
          <button onClick={onClose}
            style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 8, padding: "9px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
            ← Abandonner
          </button>
          <button onClick={onValider} disabled={tamponne}
            style={{
              background: tamponne ? "#2a3648" : "#5eff9e",
              color: tamponne ? "#5a6678" : "#06110b",
              border: "none", borderRadius: 8, padding: "11px 22px",
              fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800,
              cursor: tamponne ? "default" : "pointer", letterSpacing: 2,
            }}>
            {tamponne ? "✓ VALIDÉ" : "✓ Valider mon classement"}
          </button>
        </div>

        {mediadexOpen && <MediadexPanel onClose={() => setMediadexOpen(false)} />}
      </div>
    </div>
  );
}

/* Carte-fiche en ligne, avec ↑ / ↓ et place dans l'ordre. */
function FicheRow({ fiche, pos, total, canUp, canDown, onUp, onDown, tamponne }) {
  return (
    <div style={{
      position: "relative",
      display: "grid", gridTemplateColumns: "28px 44px 1fr 60px", gap: 10, alignItems: "center",
      background: "#1a1408", border: "1px solid #5a4028", borderRadius: 8, padding: "10px 12px",
    }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#c8a848", textAlign: "center", fontWeight: 800 }}>
        {pos}/{total}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <button onClick={onUp} disabled={!canUp || tamponne}
          style={{ background: canUp && !tamponne ? "#2a1808" : "#141008", color: canUp && !tamponne ? "#e8dfc8" : "#3a2818", border: "1px solid #5a4028", borderRadius: 4, padding: "0 6px", cursor: canUp && !tamponne ? "pointer" : "default", fontSize: 12 }}>
          ↑
        </button>
        <button onClick={onDown} disabled={!canDown || tamponne}
          style={{ background: canDown && !tamponne ? "#2a1808" : "#141008", color: canDown && !tamponne ? "#e8dfc8" : "#3a2818", border: "1px solid #5a4028", borderRadius: 4, padding: "0 6px", cursor: canDown && !tamponne ? "pointer" : "default", fontSize: 12 }}>
          ↓
        </button>
      </div>
      <div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7050", letterSpacing: 1 }}>
          FICHE
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 13.5, color: "#e8dfc8" }}>
          {fiche.sujet}
        </div>
        <div style={{ fontSize: 11, color: "#c8b090", marginTop: 2 }}>
          {fiche.lieuFiche} · {fiche.qui}
        </div>
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, color: "#e0a848", textAlign: "right" }}>
        {fiche.dateFiche}
      </div>
      {tamponne && (
        <div style={{
          position: "absolute", right: 20, top: "50%", transform: "translateY(-50%) rotate(-14deg)",
          padding: "3px 10px", border: "2px solid #5eff9e", borderRadius: 4,
          color: "#5eff9e", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 14, letterSpacing: 3,
          background: "rgba(94,255,158,0.08)", textShadow: "0 0 6px rgba(94,255,158,0.4)",
        }}>
          VALIDÉ
        </div>
      )}
    </div>
  );
}

/* -------------- Écran de sélection de la fiche à signaler -------------- */
function SignalerPanel({ fiches, signaled, onSignaler, onFin }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#141008", border: "2px solid #e0a848", borderRadius: 12,
        padding: 18, maxWidth: 680, width: "100%", maxHeight: "92vh", overflowY: "auto",
      }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#e0a848" }}>
          ⚠ SIGNALER UNE FICHE À JORGE
        </div>
        <p style={{ margin: "6px 0 12px", fontSize: 13, color: "#c8b090", fontStyle: "italic" }}>
          Clique sur la fiche qui te paraît fausse. Tu pourras en signaler plusieurs.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fiches.map((f, i) => {
            const seen = signaled[i] !== undefined;
            const good = signaled[i] === true;
            const bad = signaled[i] === false;
            return (
              <button key={f.id} onClick={() => !seen && onSignaler(i)} disabled={seen}
                style={{
                  textAlign: "left",
                  background: good ? "#0e2818" : bad ? "#2a1408" : "#1a1408",
                  color: good ? "#5eff9e" : bad ? "#8a7050" : "#e8dfc8",
                  border: `1px solid ${good ? "#5eff9e" : bad ? "#5a6678" : "#5a4028"}`,
                  borderRadius: 8, padding: "10px 12px", cursor: seen ? "default" : "pointer",
                  fontFamily: "inherit",
                }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 13.5, fontWeight: 700 }}>
                  {good ? "⚠ " : bad ? "✗ " : ""}{f.sujet} — <span style={{ color: "#e0a848" }}>{f.dateFiche}</span>
                </div>
                <div style={{ fontSize: 11, color: "#c8b090", marginTop: 2 }}>
                  {f.lieuFiche} · {f.qui}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button onClick={onFin}
            style={{
              background: "#c8a848", color: "#1a0e08", border: "none",
              borderRadius: 8, padding: "9px 18px",
              fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800,
              cursor: "pointer", letterSpacing: 1,
            }}>
            Rien d'autre à signaler ▸
          </button>
        </div>
      </div>
    </div>
  );
}

/* Compte combien de fiches sont dans l'ordre chronologique ATTENDU
   d'après leur année réelle (annéeOf de leur date affichée). */
function countCorrect(order, fiches) {
  const ideal = [...order].sort((a, b) => anneeOf(fiches[a].dateFiche) - anneeOf(fiches[b].dateFiche));
  return order.filter((idx, i) => idx === ideal[i]).length;
}
