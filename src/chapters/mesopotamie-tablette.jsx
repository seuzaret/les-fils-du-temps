import { useState } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Le registre de Narâm-Sîn »
   ------------------------------------------------------------
   Vers −3300, on invente l'écriture pour COMPTER : impossible de
   retenir de tête tout ce qui entre au temple. Le joueur presse
   dans l'argile des pictogrammes sumériens pour noter le contenu
   d'une étable : 6 bœufs et 3 ballots de blé. Des distracteurs
   (poisson, eau, homme) rappellent que chaque signe est le dessin
   d'une chose. Réussite = le registre correspond à la commande.

   Tout est dessiné ici : libre de droit et hors-ligne.
   ============================================================ */

const OBJECTIF = { boeuf: 6, ble: 3 };

/* --- pictogrammes sumériens (dessins au trait) --- */
function Picto({ type, stroke = "#e8dcc0", sw = 3.4 }) {
  const g = { fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "boeuf": // tête de bœuf : museau + cornes
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M16 18 L24 34 L32 18" /><path d="M16 18 Q8 8 4 13" /><path d="M32 18 Q40 8 44 13" />
        <circle cx="24" cy="25" r="1.4" fill={stroke} stroke="none" /></g></svg>);
    case "ble": // épi de blé : tige + grains
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M24 44 L24 12" /><path d="M24 12 q-6 2 -8 8 M24 12 q6 2 8 8 M24 20 q-6 2 -8 8 M24 20 q6 2 8 8 M24 28 q-6 2 -7 7 M24 28 q6 2 7 7" /></g></svg>);
    case "etable": // maison / étable : enclos à toit
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M9 22 L24 10 L39 22" /><path d="M12 22 L12 40 L36 40 L36 22" /><path d="M20 40 L20 28 L28 28 L28 40" /></g></svg>);
    case "poisson": // poisson
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M8 24 Q20 12 34 24 Q20 36 8 24 Z" /><path d="M34 24 L44 16 L44 32 Z" /><circle cx="16" cy="22" r="1.4" fill={stroke} stroke="none" /></g></svg>);
    case "eau": // l'eau : ondes
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M6 16 q6 -8 12 0 t12 0 t12 0" /><path d="M6 26 q6 -8 12 0 t12 0 t12 0" /><path d="M6 36 q6 -8 12 0 t12 0 t12 0" /></g></svg>);
    case "homme": // homme : silhouette
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <circle cx="24" cy="12" r="5" /><path d="M24 17 L24 32" /><path d="M24 20 L14 26 M24 20 L34 26 M24 32 L17 44 M24 32 L31 44" /></g></svg>);
    default: return null;
  }
}

const PALETTE_BASE = [
  { type: "boeuf", nom: "gud", sens: "le bœuf", cible: "boeuf" },
  { type: "ble", nom: "še", sens: "le grain", cible: "ble" },
  { type: "etable", nom: "é", sens: "la maison", cible: null },
  { type: "poisson", nom: "ku", sens: "le poisson", cible: null },
  { type: "eau", nom: "a", sens: "l'eau", cible: null },
  { type: "homme", nom: "lu", sens: "l'homme", cible: null },
];

/* Mélange stable au montage : on ne veut pas que bœuf et blé soient
   toujours en tête de palette — l'élève doit repérer les bons signes
   parmi tous les pictogrammes sumériens connus. */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const RATE = [
  "Ça, ce n'est pas dans l'étable ! Le scribe note ce qu'il VOIT entrer.",
  "Joli dessin… mais hors sujet. On compte les bœufs et le blé.",
  "Narâm-Sîn fronce les sourcils : ce signe-là n'a rien à faire au registre.",
];

export function TabletteGame({ onClose, onWin }) {
  const [reg, setReg] = useState({ boeuf: 0, ble: 0 }); // ce qui est inscrit
  const [flash, setFlash] = useState(null);   // message d'erreur passager
  const [won, setWon] = useState(false);
  /* Palette mélangée une fois pour la session. Les pictogrammes
     changent de place à chaque partie — le bœuf et le blé ne sont
     plus systématiquement en tête. */
  const [palette] = useState(() => shuffle(PALETTE_BASE));
  /* Ordre des lignes du registre également mélangé, pour ne pas
     figer le bœuf et le blé en tête. Toutes les lignes partagent
     le même style : c'est à l'élève de repérer les signes utiles. */
  const [rowOrder] = useState(() => shuffle(["boeuf", "ble", "poisson", "eau", "homme"]));
  useWinOnce(won, onWin);


  const presser = (p) => {
    if (won) return;
    if (p.cible) {
      setReg((r) => ({ ...r, [p.cible]: r[p.cible] + 1 }));
      setFlash(null);
    } else {
      setFlash(RATE[Math.floor(Math.random() * RATE.length)]);
    }
  };
  const effacer = () => { setReg({ boeuf: 0, ble: 0 }); setFlash(null); };
  const valider = () => {
    if (reg.boeuf === OBJECTIF.boeuf && reg.ble === OBJECTIF.ble) { setWon(true); return; }
    const trop = reg.boeuf > OBJECTIF.boeuf || reg.ble > OBJECTIF.ble;
    setFlash(trop
      ? "Trop de marques ! Efface la tablette et recompte : 6 bœufs, 3 blés."
      : "Il en manque. Regarde bien : 6 bœufs et 3 blés dans l'étable.");
  };

  const okB = reg.boeuf === OBJECTIF.boeuf, okBle = reg.ble === OBJECTIF.ble;

  /* petite ligne de pictogrammes inscrits sur la tablette.
     Toutes les lignes partagent le MÊME style : c'est à l'élève de
     repérer les signes utiles parmi les 5 pictogrammes du scribe. */
  const Ligne = ({ type, n, ok }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, minHeight: 40 }}>
      <div style={{ width: 30, height: 30, flex: "0 0 auto", padding: 3, border: "1px dashed #3a6a9a", borderRadius: 6, background: "rgba(47,106,154,0.12)" }}><Picto type={type} stroke="#2f6a9a" sw={3} /></div>
      <span style={{ color: "#3a6a9a", fontFamily: "ui-monospace,monospace", fontSize: 16, fontWeight: 700, flex: "0 0 auto" }}>→</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, flex: 1, minHeight: 20 }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ width: 22, height: 22, animation: "popIn .25s ease-out" }}><Picto type={type} stroke="#3a2614" sw={3.4} /></div>
        ))}
      </div>
      <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 14.5, fontWeight: 700, color: ok ? "#2e7d4a" : "#8a5a2e" }}>{n}</span>
    </div>
  );

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "2px solid #e8934a66", borderRadius: 18, padding: 20, maxWidth: 660, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e8934a" }}>✍ NAISSANCE DE L'ÉCRITURE</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 2px", color: "#ffd166", fontSize: 21 }}>Le registre de Narâm-Sîn</h2>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: "#c8d4e2", textAlign: "center", margin: "0 0 12px" }}>
          Impossible de tout retenir de tête ! Presse les signes dans l'argile pour noter ce qu'il y a dans l'étable :
          <strong style={{ color: "#ffd166" }}> 6 bœufs</strong> et <strong style={{ color: "#ffd166" }}>3 ballots de blé</strong>.
        </p>

        {!won ? (
          <>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {/* LA TABLETTE */}
              <div style={{ flex: "1 1 240px", background: "linear-gradient(160deg,#cda878,#a9814f)", border: "3px solid #8a6a44", borderRadius: "14px 16px 12px 15px", padding: "12px 14px", boxShadow: "inset 0 2px 10px rgba(255,255,255,0.25), inset 0 -6px 14px rgba(60,40,20,0.4)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #7a5a3a66", paddingBottom: 6, marginBottom: 6 }}>
                  <div style={{ width: 30, height: 30 }}><Picto type="etable" stroke="#2f6a9a" sw={3} /></div>
                  <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, color: "#3a6a9a", fontWeight: 700 }}>é — l'étable</span>
                </div>
                {rowOrder.map((type) => {
                  const n = reg[type] || 0;
                  const ok = type === "boeuf" ? okB : type === "ble" ? okBle : false;
                  return <Ligne key={type} type={type} n={n} ok={ok} />;
                })}
              </div>

              {/* LA PALETTE de signes */}
              <div style={{ flex: "1 1 240px" }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 1, color: "#8fa3bd", marginBottom: 6 }}>LES SIGNES — touche pour inscrire</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
                  {palette.map((p) => (
                    <button key={p.type} onClick={() => presser(p)}
                      style={{ background: "#1a130c", border: "1px solid #3a2c1c", borderRadius: 10, padding: "7px 4px 5px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 40, height: 40 }}><Picto type={p.type} /></div>
                      <div style={{ fontSize: 11.5, fontFamily: "ui-monospace,monospace", color: "#c9a877", textAlign: "center", lineHeight: 1.15 }}>
                        {p.nom}<br /><span style={{ color: "#8a97ad" }}>{p.sens}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* compteurs + erreur */}
            <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 12, fontFamily: "ui-monospace,monospace", fontSize: 16 }}>
              <span style={{ color: okB ? "#5eff9e" : "#c9a877" }}>🐂 {reg.boeuf}/6</span>
              <span style={{ color: okBle ? "#5eff9e" : "#c9a877" }}>🌾 {reg.ble}/3</span>
            </div>
            <p style={{ minHeight: 18, textAlign: "center", color: "#e8934a", fontSize: 14, fontStyle: "italic", margin: "8px 0 0" }}>{flash}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button onClick={effacer}
                style={{ flex: "0 0 auto", background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 18px", fontWeight: 700, cursor: "pointer", fontSize: 14.5, fontFamily: "ui-monospace,monospace" }}>
                ✕ Effacer
              </button>
              <button onClick={valider}
                style={{ flex: 1, background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                ✓ Valider le registre
              </button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 6 }}>
            <div style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Voilà comment naît l'ÉCRITURE : pas pour un poème, mais pour un inventaire ! On presse dans
                l'argile molle des signes en forme de coins — le cunéiforme. Le message ne dépend plus de la
                mémoire de personne : il survit à celui qui l'a écrit, sans se déformer. Cuite au feu, la tablette
                défie les millénaires. L'Histoire, la vraie, commence ici. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ◆ « Écriture cunéiforme » transmise au futur !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
