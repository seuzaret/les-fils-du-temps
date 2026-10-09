import { useState } from "react";
import BigDialogue from "../BigDialogue.jsx";
import MediadexPanel from "../MediadexPanel.jsx";
import { tirerFiches, anneeOf } from "./fiches.js";

/* ============================================================
   JEU 3 — Quête de Jorge : briefing → tri (drag/drop) → debrief
   ------------------------------------------------------------
   Phases :
   - "intro"     : BigDialogue bougon de Jorge → "Accepter"
   - "tri"       : plateau avec stock + 4 cases, drag-drop réel
   - "signaler"  : overlay dans "tri" pour pointer une fiche
   - "reaction"  : BigDialogue de Jorge réagissant au signalement
   - "fin"       : BigDialogue de clôture
   ============================================================ */
const JORGE_STYLE = {
  color: "#3a2818", pants: "#1a1408", hair: "#8a8070", skin: "#c8a888",
  facing: "front", accessory: "coat", activity: "write",
  bald: true, beard: "#8a8070",
};

/* Textes variant selon le numéro de passe (triIdx = 1, 2 ou 3). */
const INTRO_LINES = {
  1: [
    "Toi, là. Puisque tu traînes, aide-moi.",
    "Classe ces fiches dans l'ordre chronologique. J'ai mieux à faire.",
    "Si une date te paraît bizarre, tu me la signales. Au boulot.",
  ],
  2: [
    "Encore toi. Tant mieux, il m'en reste un lot.",
    "Pareil que la dernière fois : chronologique, et tu signales ce qui cloche.",
    "Discrètement, cette fois.",
  ],
  3: [
    "Dernier lot. Ne discute pas.",
    "Classe. Vérifie. Signale. Tu sais faire.",
    "Fais vite.",
  ],
};

const REACTION_SIGNALE_LINES = {
  1: [
    "Jorge regarde la fiche. Il se fige un instant.",
    "Il baisse la voix : « Tu l'as vue, toi aussi. »",
    "« Range-la. Ne la montre à personne. Pas maintenant. »",
    "Un peu plus fort, pour se reprendre : « Pas mal. File, maintenant. »",
  ],
  2: [
    "Jorge prend la fiche sans un mot. Il la lit, la relit.",
    "« Deuxième fois. Ce n'est plus un hasard. »",
    "Il range la fiche sous une pile, regarde la porte : « Reviens. Et apprends à te taire. »",
  ],
  3: [
    "Jorge saisit la fiche. Il la fixe longuement.",
    "« Incroyable… il ne peut pourtant pas y avoir d'erreurs. »",
    "Il se lève, inquiet : « Je vais vérifier. File chez toi. Vite. »",
  ],
};

const END_NEUTRE_LINES = {
  1: {
    trie:   "Jorge regarde ton classement : « Bon. Rangé. File, j'ai à faire. »",
    desor:  "Jorge pousse ta pile : « Mouais. J'aurais voulu plus propre. Allez, file. »",
  },
  2: {
    trie:   "Jorge jette un œil : « Rangé. File. »",
    desor:  "Jorge grommelle : « Faut remettre de l'ordre là-dedans. Mais passons. File. »",
  },
  3: {
    trie:   "Jorge te fixe sans parler. Il acquiesce, replonge dans ses papiers.",
    desor:  "Jorge pose la pile sans la regarder : « … soit. File. »",
  },
};

export default function ArchivistQuest({ j3, triIdx = 1, onDone, onCancel }) {
  const [phase, setPhase] = useState("intro");
  const [fiches] = useState(() => tirerFiches(triIdx));
  /* slots : tableau de 4 cases (index 0..3) qui contiennent un
     ficheIdx ou null. Stock : fiches pas encore posées. */
  const [slots, setSlots] = useState([null, null, null, null]);
  const [showSignalerOverlay, setShowSignalerOverlay] = useState(false);
  const [signaled, setSignaled] = useState({});
  const [lastReaction, setLastReaction] = useState(null);

  const inStock = (idx) => !slots.includes(idx);

  const placeInSlot = (ficheIdx, slotIdx) => {
    setSlots((prev) => {
      const next = [...prev];
      /* si cette fiche est déjà quelque part, on l'enlève */
      const oldSlot = next.indexOf(ficheIdx);
      if (oldSlot !== -1) next[oldSlot] = null;
      /* si la case cible contient déjà une fiche, échange */
      if (next[slotIdx] !== null && next[slotIdx] !== ficheIdx) {
        if (oldSlot !== -1) next[oldSlot] = next[slotIdx];
      }
      next[slotIdx] = ficheIdx;
      return next;
    });
  };

  const sendToStock = (ficheIdx) => {
    setSlots((prev) => prev.map((v) => (v === ficheIdx ? null : v)));
  };

  const valider = () => setPhase("fin");

  const signalerFiche = (idx) => {
    const f = fiches[idx];
    const already = signaled[idx] !== undefined;
    if (already) return;
    setSignaled((s) => ({ ...s, [idx]: f.falsified }));
    if (f.falsified) {
      /* Vrai signalement : flags posés, le plateau passe en mode
         "tampons" (anomalie rouge sur la fiche signalée, VALIDÉ vert
         sur les autres), puis dialogue encourageant → fin. */
      j3.setFlag(`archives_signalement_${f.dossierId}`);
      j3.setFlag("archives_signalement_fait");
      setShowSignalerOverlay(false);
      setPhase("stamping");
    } else {
      /* Faux signalement : Jorge recadre, retour au plateau. */
      setLastReaction({
        text: "Jorge jette un œil, soupire : « Tu me fais perdre mon temps. Celle-là est correcte. Range-la et retourne travailler. »",
      });
      setShowSignalerOverlay(false);
      setPhase("reactionBack");
    }
  };

  /* ---------- RENDUS ---------- */
  if (phase === "intro") {
    return (
      <BigDialogue
        topic={`ARCHIVES · JORGE · PASSE ${triIdx}`}
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent="#c8a848"
        lignes={INTRO_LINES[triIdx] || INTRO_LINES[1]}
        actionLabel="Accepter ▸"
        onDone={() => setPhase("tri")}
        secondaryActionLabel="Refuser"
        onSecondary={() => onCancel?.()} />
    );
  }

  if (phase === "tri" || phase === "stamping") {
    return (
      <TriBoard
        fiches={fiches} slots={slots}
        inStock={inStock}
        onPlaceInSlot={placeInSlot}
        onSendToStock={sendToStock}
        mediadexRetrouve={!!j3.flags.mediadex_retrouve}
        onValider={valider}
        onSignaler={() => setShowSignalerOverlay(true)}
        showSignalerOverlay={showSignalerOverlay}
        onCloseSignalerOverlay={() => setShowSignalerOverlay(false)}
        onSignalerFiche={signalerFiche}
        signaled={signaled}
        stamping={phase === "stamping"}
        onContinueStamping={() => setPhase("fin")}
        onAbandon={onDone} />
    );
  }

  /* Après signalement FAUX, Jorge réagit puis on retourne au plateau. */
  if (phase === "reactionBack") {
    return (
      <BigDialogue
        topic="ARCHIVES · JORGE"
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent="#5a6678"
        lignes={[lastReaction?.text || ""]}
        actionLabel="Retourner aux fiches ▸"
        onDone={() => setPhase("tri")} />
    );
  }

  if (phase === "fin") {
    const trueSignale = Object.entries(signaled).find(([, v]) => v === true);
    const nbCorrect = countCorrect(slots, fiches);
    const allPlaced = slots.every((s) => s !== null);
    const trie = allPlaced && nbCorrect === slots.length;
    return (
      <BigDialogue
        topic={`ARCHIVES · JORGE · PASSE ${triIdx}`}
        speakerNom="Jorge" speakerRole="Archiviste du Puits"
        speakerStyle={JORGE_STYLE}
        accent="#c8a848"
        lignes={
          trueSignale
            ? (REACTION_SIGNALE_LINES[triIdx] || REACTION_SIGNALE_LINES[1])
            : [trie ? END_NEUTRE_LINES[triIdx].trie : END_NEUTRE_LINES[triIdx].desor]
        }
        actionLabel="Sortir ▸"
        onDone={onDone} />
    );
  }

  return null;
}

/* ================= Plateau de tri (drag-drop) ================= */
function TriBoard({
  fiches, slots, inStock,
  onPlaceInSlot, onSendToStock,
  mediadexRetrouve, onValider, onSignaler,
  showSignalerOverlay, onCloseSignalerOverlay, onSignalerFiche,
  signaled, stamping, onContinueStamping, onAbandon,
}) {
  const [mediadexOpen, setMediadexOpen] = useState(false);
  const [dragging, setDragging] = useState(null); // ficheIdx en cours de drag
  const stockFiches = fiches.map((_, i) => i).filter(inStock);

  const onDragStart = (idx) => { if (!stamping) setDragging(idx); };
  const onDragEnd = () => setDragging(null);
  const onDropSlot = (slotIdx) => {
    if (stamping || dragging === null) return;
    onPlaceInSlot(dragging, slotIdx);
    setDragging(null);
  };
  const onDropStock = () => {
    if (stamping || dragging === null) return;
    onSendToStock(dragging);
    setDragging(null);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#141008", border: "2px solid #c8a848", borderRadius: 12,
        padding: 16, maxWidth: 920, width: "100%", maxHeight: "95vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848" }}>
              📂 CLASSEMENT CHRONOLOGIQUE
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#c8b090", marginTop: 2 }}>
              Glisse les fiches dans les cases, du plus ancien (gauche) au plus récent (droite).
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

        {/* Zone des 4 cases numérotées */}
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {slots.map((ficheIdx, slotIdx) => (
            <SlotCase key={slotIdx} slotIdx={slotIdx} ficheIdx={ficheIdx} fiches={fiches}
              dragging={dragging}
              onDragStart={onDragStart} onDragEnd={onDragEnd}
              onDrop={() => onDropSlot(slotIdx)}
              stamping={stamping}
              signaled={signaled} />
          ))}
        </div>

        <div style={{ marginTop: 6, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7050", letterSpacing: 2, textAlign: "center" }}>
          ← plus ancien · plus récent →
        </div>

        {/* Stock */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#8a7050", marginBottom: 6 }}>
            PILE DE FICHES À CLASSER
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropStock}
            style={{
              display: "flex", gap: 10, flexWrap: "wrap",
              background: "#0e0a04", border: "1px dashed #5a4028", borderRadius: 8,
              padding: 10, minHeight: 120,
            }}>
            {stockFiches.length === 0 ? (
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#5a4028", margin: "auto", fontStyle: "italic" }}>
                — pile vide, tout est dans les cases —
              </div>
            ) : (
              stockFiches.map((idx) => (
                <FicheCard key={idx} fiche={fiches[idx]} idx={idx}
                  dragging={dragging}
                  onDragStart={onDragStart} onDragEnd={onDragEnd}
                  stamping={stamping}
                  signaled={signaled} />
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        {stamping ? (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button onClick={onContinueStamping}
              style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2 }}>
              Jorge te répond ▸
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 8, flexWrap: "wrap" }}>
            <button onClick={onAbandon}
              style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 8, padding: "9px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
              ← Abandonner
            </button>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={onSignaler}
                style={{ background: "#2a1408", color: "#e0a848", border: "1px solid #e0a848", borderRadius: 8, padding: "10px 16px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                ⚠ Signaler une anomalie
              </button>
              <button onClick={onValider}
                style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2 }}>
                ✓ Valider mon classement
              </button>
            </div>
          </div>
        )}

        {mediadexOpen && <MediadexPanel onClose={() => setMediadexOpen(false)} />}
      </div>

      {/* Overlay signalement */}
      {showSignalerOverlay && (
        <SignalerOverlay fiches={fiches} signaled={signaled}
          onSignaler={onSignalerFiche} onClose={onCloseSignalerOverlay} />
      )}
    </div>
  );
}

/* ------- Case numérotée ------- */
function SlotCase({ slotIdx, ficheIdx, fiches,
  dragging, onDragStart, onDragEnd, onDrop, stamping, signaled }) {
  const [hover, setHover] = useState(false);
  const occupied = ficheIdx !== null;
  return (
    <div
      onDragOver={(e) => { if (!stamping) { e.preventDefault(); setHover(true); } }}
      onDragLeave={() => setHover(false)}
      onDrop={() => { if (!stamping) { onDrop(); setHover(false); } }}
      style={{
        minHeight: 160,
        background: hover ? "#2a2010" : "#1a1408",
        border: `2px dashed ${hover ? "#ffd166" : "#5a4028"}`,
        borderRadius: 8, padding: 6,
        display: "flex", flexDirection: "column", alignItems: "center",
        transition: "background 0.15s, border-color 0.15s",
      }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#c8a848", fontWeight: 800, letterSpacing: 1 }}>
        CASE {slotIdx + 1}
      </div>
      {occupied ? (
        <div style={{ marginTop: 4, width: "100%" }}>
          <FicheCard fiche={fiches[ficheIdx]} idx={ficheIdx}
            dragging={dragging}
            onDragStart={onDragStart} onDragEnd={onDragEnd}
            stamping={stamping} signaled={signaled} compact />
        </div>
      ) : (
        <div style={{ margin: "auto", fontSize: 11, color: "#5a4028", fontStyle: "italic" }}>
          — vide —
        </div>
      )}
    </div>
  );
}

/* ------- Petite fiche catalographique ------- */
function FicheCard({ fiche, idx, dragging, onDragStart, onDragEnd, compact = false, stamping = false, signaled = {} }) {
  const isDragging = dragging === idx;
  const isAnomaly = stamping && signaled[idx] === true;
  const isValid = stamping && signaled[idx] !== true;
  return (
    <div
      draggable={!stamping}
      onDragStart={(e) => { if (!stamping) { e.dataTransfer.effectAllowed = "move"; onDragStart(idx); } }}
      onDragEnd={onDragEnd}
      style={{
        cursor: stamping ? "default" : "grab",
        opacity: isDragging ? 0.4 : 1,
        width: compact ? "100%" : 160,
        background: isAnomaly
          ? "linear-gradient(180deg,#f8d8c8,#e8b0a0)"
          : "linear-gradient(180deg,#f0e4c8,#d8ccb0)",
        border: `1px solid ${isAnomaly ? "#8a2010" : "#5a4028"}`,
        borderRadius: 4,
        padding: "8px 10px 10px",
        position: "relative",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        fontFamily: "Georgia, serif",
        color: "#1a0e08",
      }}>
      {/* Trou de classement en haut */}
      <div style={{
        position: "absolute", left: "50%", top: -3, transform: "translateX(-50%)",
        width: 8, height: 8, background: "#141008", borderRadius: "50%",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
      }} />
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 8, color: "#8a5030", letterSpacing: 1, borderBottom: "1px dashed #8a5030", paddingBottom: 2 }}>
        FICHE № {String(idx + 1).padStart(3, "0")}
      </div>
      <div style={{ marginTop: 4, fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>
        {fiche.sujet}
      </div>
      <div style={{ marginTop: 2, fontSize: 13, fontWeight: 800, color: "#8a2010", letterSpacing: 0.5 }}>
        {fiche.dateFiche}
      </div>
      <div style={{ marginTop: 2, fontSize: 9, color: "#5a4028", fontStyle: "italic", lineHeight: 1.3 }}>
        {fiche.lieuFiche} · {fiche.qui}
      </div>
      {isAnomaly && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%) rotate(-10deg)",
          padding: "4px 10px", border: "3px solid #c81010", borderRadius: 4,
          color: "#c81010", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 15, letterSpacing: 2,
          background: "rgba(200,16,16,0.08)", textShadow: "0 0 4px rgba(200,16,16,0.3)",
          pointerEvents: "none",
        }}>
          ANOMALIE
        </div>
      )}
      {isValid && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%) rotate(-12deg)",
          padding: "3px 10px", border: "2px solid #2a8030", borderRadius: 4,
          color: "#2a8030", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 14, letterSpacing: 2,
          background: "rgba(42,128,48,0.08)",
          pointerEvents: "none",
        }}>
          VALIDÉ
        </div>
      )}
    </div>
  );
}

/* ------- Overlay de sélection pour "Signaler une anomalie" ------- */
function SignalerOverlay({ fiches, signaled, onSignaler, onClose }) {
  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 410,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141008", border: "2px solid #e0a848", borderRadius: 12,
          padding: 18, maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto",
        }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#e0a848" }}>
          ⚠ POINTER LA FICHE DOUTEUSE
        </div>
        <p style={{ margin: "6px 0 12px", fontSize: 13, color: "#c8b090", fontStyle: "italic" }}>
          Clique sur la fiche que tu penses être fausse. Jorge en jugera.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
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
                  fontFamily: "inherit", opacity: seen ? 0.7 : 1,
                }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 12, fontWeight: 700 }}>
                  {good ? "⚠ " : bad ? "✗ " : ""}{f.sujet}
                </div>
                <div style={{ fontSize: 11, color: "#e0a848", marginTop: 2 }}>{f.dateFiche}</div>
                <div style={{ fontSize: 10, color: "#8a7050", marginTop: 1 }}>{f.lieuFiche} · {f.qui}</div>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button onClick={onClose}
            style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 8, padding: "8px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

/* Compte combien de fiches sont dans l'ordre chronologique ATTENDU
   d'après leur année réelle. Les cases vides (null) sont ignorées. */
function countCorrect(slots, fiches) {
  const placed = slots.map((s, i) => ({ s, i })).filter((x) => x.s !== null);
  const ideal = [...placed].sort((a, b) => anneeOf(fiches[a.s].dateFiche) - anneeOf(fiches[b.s].dateFiche));
  return placed.filter((x, k) => x.s === ideal[k].s).length;
}
