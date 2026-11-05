import { useState, useEffect } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Le télégraphe de Chappe » (placer les bras selon le code)
   ------------------------------------------------------------
   Le télégraphe optique de Chappe (1794) forme des signes en plaçant
   ses grands bras dans des positions précises. Un « régulateur »
   central + deux « indicateurs » aux extrémités : chaque position a
   un sens, lu dans le CAHIER DE CODES. Ici, le joueur doit reproduire
   EXACTEMENT le signal indiqué par le cahier (la victoire de Condé) en
   faisant tourner les trois bras. Leçon : ces gestes ne veulent rien
   dire sans le code partagé — coder, c'est se mettre d'accord.
   ============================================================ */

/* les positions possibles (en degrés) de chaque bras */
const REG = [0, -45, -90, -135];         // le régulateur (barre centrale)
const IND = [40, 90, 140, 200];          // un indicateur (bras d'extrémité)
/* le signal à reproduire (index dans les tableaux ci-dessus) */
const TARGET = { reg: 2, left: 0, right: 3 };

/* Un télégraphe dessiné. `interactif` → les bras sont cliquables. */
function Telegraphe({ reg, left, right, interactif, onReg, onLeft, onRight, ok }) {
  const knob = interactif ? { cursor: "pointer" } : {};
  const arm = ok ? "#5eff9e" : "#d8c9a8";
  return (
    <svg viewBox="-120 -150 240 260" style={{ width: "100%", height: "auto", display: "block" }}>
      {/* fût de la tour */}
      <rect x="-26" y="40" width="52" height="70" fill="#6a604a" />
      <rect x="-26" y="40" width="52" height="70" fill="none" stroke="#4a4234" strokeWidth="2" />
      <rect x="-10" y="66" width="20" height="30" fill="#2c2618" />
      <path d="M0 40 v-30" stroke="#3a2c1c" strokeWidth="6" />
      {/* le régulateur + les 2 indicateurs (pivot au sommet du mât : 0,10) */}
      <g transform={`translate(0,10) rotate(${REG[reg]})`}>
        {/* barre centrale (régulateur) */}
        <rect x="-70" y="-7" width="140" height="14" rx="6" fill={arm} stroke="#8a7a56" strokeWidth="1.5"
          onClick={interactif ? onReg : undefined} style={knob} />
        {/* indicateur GAUCHE, pivot à (-70,0) */}
        <g transform={`translate(-70,0) rotate(${IND[left] - REG[reg]})`}>
          <rect x="-4" y="-2" width="8" height="46" rx="4" fill={arm} stroke="#8a7a56" strokeWidth="1.4"
            onClick={interactif ? onLeft : undefined} style={knob} />
          <circle cx="0" cy="44" r="5" fill={arm} onClick={interactif ? onLeft : undefined} style={knob} />
        </g>
        {/* indicateur DROIT, pivot à (70,0) */}
        <g transform={`translate(70,0) rotate(${IND[right] - REG[reg]})`}>
          <rect x="-4" y="-2" width="8" height="46" rx="4" fill={arm} stroke="#8a7a56" strokeWidth="1.4"
            onClick={interactif ? onRight : undefined} style={knob} />
          <circle cx="0" cy="44" r="5" fill={arm} onClick={interactif ? onRight : undefined} style={knob} />
        </g>
        {/* pivot central */}
        <circle cx="0" cy="0" r="6" fill="#3a2c1c" />
      </g>
    </svg>
  );
}

export function ChappeGame({ onClose, onWin }) {
  const [reg, setReg] = useState(1);
  const [left, setLeft] = useState(2);
  const [right, setRight] = useState(1);
  const [won, setWon] = useState(false);
  useWinOnce(won, onWin);

  const ok = reg === TARGET.reg && left === TARGET.left && right === TARGET.right;
  useEffect(() => { if (ok && !won) { const t = setTimeout(() => setWon(true), 550); return () => clearTimeout(t); } }, [ok, won]);

  const cyc = (setter) => () => { if (!won) setter((v) => (v + 1) % 4); };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "2px solid #7fb0e066", borderRadius: 18, padding: 20, maxWidth: 620, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#e8eef5", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#7fb0e0" }}>🚦 LE TÉLÉGRAPHE DE CHAPPE</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 20 }}>Compose le signal de la victoire de Condé</h2>
        <p style={{ textAlign: "center", fontSize: 14.5, color: "#c8d4e2", margin: "0 0 12px" }}>
          Place les trois bras <strong>exactement</strong> comme le cahier de codes l'indique. Clique un bras pour le faire tourner.
        </p>

        {!won ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", alignItems: "flex-start" }}>
            {/* LE MODÈLE (cahier de codes) */}
            <div style={{ flex: "1 1 180px", maxWidth: 230, textAlign: "center" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#8fa3bd", marginBottom: 4 }}>📓 LE CAHIER DE CODES</div>
              <div style={{ background: "#efe6ce", borderRadius: 10, padding: 8, border: "2px solid #b09a6e" }}>
                <Telegraphe reg={TARGET.reg} left={TARGET.left} right={TARGET.right} />
              </div>
            </div>
            {/* LE TÉLÉGRAPHE À MANŒUVRER */}
            <div style={{ flex: "1 1 180px", maxWidth: 230, textAlign: "center" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: ok ? "#5eff9e" : "#ffd166", marginBottom: 4 }}>🗼 TA TOUR {ok ? "· BON SIGNAL !" : "· clique les bras"}</div>
              <div style={{ background: "#101827", borderRadius: 10, padding: 8, border: `2px solid ${ok ? "#5eff9e" : "#2a3648"}` }}>
                <Telegraphe reg={reg} left={left} right={right} ok={ok} interactif
                  onReg={cyc(setReg)} onLeft={cyc(setLeft)} onRight={cyc(setRight)} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Bras en place, signal formé ! De colline en colline, la nouvelle de Condé file vers Paris — en moins d'une heure au lieu de plusieurs jours. Mais regarde bien : ces trois bras ne veulent RIEN dire pour qui n'a pas le cahier de codes. Coder, ce n'est pas cacher le message : c'est se mettre d'accord, à l'avance, sur ce que chaque geste signifie. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Signal codé formé — la tour suivante peut le lire !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#7fb0e0", color: "#06121e", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
