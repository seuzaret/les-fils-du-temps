import { useEffect, useRef, useState } from "react";
import { TemporalCompass } from "./TemporalCompass.jsx";
import { Avatar } from "./Martine.jsx";
import SceneExterieur from "../chapters/01-paleolithique/scenes/SceneExterieur.jsx";
import { playMaterialize } from "./sfx.js";
import TimeMachine from "./TimeMachine.jsx";

/* ============================================================
   VAISSEAU TEMPOREL — cadre narratif du saut de chapitre.
   Phases :
     1) martine     : grand plan MARTINE, texte en bas centré
                      (fond = "Devant la grotte" nu, sans persos)
     2) materialize : la machine se materialise au centre, posée au sol
     3) cockpit     : vue interieure, gros bouton GO
     4) compass     : TemporalCompass (win -> onDone, caught -> cockpit)
   ============================================================ */

const noop = () => {};
/* Fond par défaut si l'appelant n'en passe pas — la scène préhistorique nue. */
const defaultBackdropScene = (
  <SceneExterieur bare collect={noop} action={noop} reveal={null} made={[]} queteQui={null} />
);

/* ---------- PHASE MATERIALIZE : machine + zone cliquable large ---------- */
function MaterializePhase({ onEnter }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    playMaterialize();
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* La machine — SVG en fond, NON cliquable (pointer-events:none) */}
      <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMax meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true">
        <defs>
          <radialGradient id="tvHaloBig" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0"    stopColor="#b0ffdc" stopOpacity="0.9" />
            <stop offset="0.45" stopColor="#5eff9e" stopOpacity="0.5" />
            <stop offset="1"    stopColor="#5eff9e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="320" fill="url(#tvHaloBig)">
          <animate attributeName="r" values="20;380;340" keyTimes="0;0.65;1" dur="2s" repeatCount="1" fill="freeze" />
          <animate attributeName="opacity" values="0;1;0.7" keyTimes="0;0.55;1" dur="2s" repeatCount="1" fill="freeze" />
        </circle>
        <g transform="translate(300 330)" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.2s" fill="freeze" />
          <TimeMachine landed={true} />
        </g>
      </svg>

      {/* Grande zone cliquable invisible qui couvre la MACHINE et sa PORTE.
          Une fois la machine matérialisée (ready), tout clic dessus fait entrer. */}
      {ready && (
        <button onClick={onEnter}
          title="Entrer dans la machine"
          style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(52%, 420px)", aspectRatio: "0.9",
            background: "transparent", border: "none", cursor: "pointer",
            padding: 0, margin: 0, outline: "none",
            animation: "tvHintPulse 1.8s ease-in-out infinite",
          }}
          aria-label="Entrer dans la machine temporelle" />
      )}

      {/* Bouton ENTRER — visible dès que la machine est prête */}
      {ready && (
        <button onClick={onEnter}
          autoFocus
          style={{
            position: "absolute", left: "50%", bottom: "5%", transform: "translateX(-50%)",
            background: "#5eff9e", color: "#06110b", border: "none",
            borderRadius: 12, padding: "14px 40px", fontSize: 17, fontWeight: 800,
            cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 4,
            boxShadow: "0 0 22px rgba(94,255,158,0.5)",
            animation: "tvBtnAppear 0.4s ease-out",
          }}>▶ ENTRER DANS LA MACHINE</button>
      )}

      {/* Indice "clique sur la porte" */}
      {ready && (
        <div style={{
          position: "absolute", left: "50%", top: "12%", transform: "translateX(-50%)",
          fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 2,
          color: "#5eff9e", background: "rgba(4,8,14,0.7)",
          padding: "8px 16px", borderRadius: 8,
          border: "1px solid rgba(94,255,158,0.4)",
          animation: "tvBtnAppear 0.4s ease-out",
          pointerEvents: "none",
        }}>Clique sur la porte de la machine ↓</div>
      )}

      <style>{`
        @keyframes tvBtnAppear { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tvHintPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(94,255,158,0); }
          50%     { box-shadow: 0 0 0 8px rgba(94,255,158,0.15); }
        }
      `}</style>
    </div>
  );
}

/* ---------- PHASE COCKPIT : paysage teinté + console demi-cercle ---------- */
function CockpitPhase({ onGo, onCancel, backdropScene }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#050810" }}>
      {/* ---- PAYSAGE plein écran, vu depuis le cockpit (teinté jaunâtre) ---- */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {backdropScene}
        {/* teinte jaunâtre du verre du cockpit */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(255,205,110,0.28) 0%, rgba(255,175,80,0.22) 60%, rgba(200,130,50,0.35) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />
        {/* léger reflet en haut du verre */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "18%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* petits reflets diagonaux sur le verre */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 60 20 L 200 30 L 220 100 L 80 90 Z" fill="rgba(255,255,255,0.06)" />
          <path d="M 620 20 L 720 40 L 700 80 L 600 60 Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* ---- CONSOLE demi-cercle métal — POSÉE PAR-DESSUS le paysage
             (le paysage descend jusqu'à la courbe convexe, plus de bande noire) ---- */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "50%", minHeight: 300, overflow: "visible" }}>
        <svg viewBox="0 0 1000 420" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
          aria-hidden="true">
          <defs>
            <linearGradient id="ckMetal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0"    stopColor="#3a4552" />
              <stop offset="0.4"  stopColor="#5a6874" />
              <stop offset="0.7"  stopColor="#2a3542" />
              <stop offset="1"    stopColor="#141c26" />
            </linearGradient>
            <linearGradient id="ckMetalHi" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0"    stopColor="#8a98a8" />
              <stop offset="1"    stopColor="#3a4552" />
            </linearGradient>
            <linearGradient id="ckScreen" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0"    stopColor="#0a2a1a" />
              <stop offset="1"    stopColor="#062010" />
            </linearGradient>
            <radialGradient id="ckKnobG" cx="0.35" cy="0.35" r="0.7">
              <stop offset="0"    stopColor="#b0bcc8" />
              <stop offset="0.6"  stopColor="#4a5460" />
              <stop offset="1"    stopColor="#1a2028" />
            </radialGradient>
            <radialGradient id="ckLedR" cx="0.4" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#ffdcdc" /><stop offset="0.4" stopColor="#ff5030" /><stop offset="1" stopColor="#6a1010" />
            </radialGradient>
            <radialGradient id="ckLedG" cx="0.4" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#e8ffdc" /><stop offset="0.4" stopColor="#5eff9e" /><stop offset="1" stopColor="#0a4020" />
            </radialGradient>
            <radialGradient id="ckLedY" cx="0.4" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#fff4c0" /><stop offset="0.4" stopColor="#ffd166" /><stop offset="1" stopColor="#6a4a10" />
            </radialGradient>
            <radialGradient id="ckLedB" cx="0.4" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#dcf0ff" /><stop offset="0.4" stopColor="#7fd8ff" /><stop offset="1" stopColor="#103a5a" />
            </radialGradient>
          </defs>

          {/* Console : dashboard CONVEXE, bord supérieur qui MONTE au centre
             (le pilote a la console qui culmine devant lui). */}
          <path d="M 0 420 L 0 200 Q 500 60 1000 200 L 1000 420 Z" fill="url(#ckMetal)" />
          {/* Bord supérieur brillant : la vraie courbe visible du cockpit */}
          <path d="M 0 200 Q 500 60 1000 200" stroke="url(#ckMetalHi)" strokeWidth="6" fill="none" />
          <path d="M 0 208 Q 500 68 1000 208" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" />
          {/* Deuxième arc parallèle (double liseré chromé, effet cerclage) */}
          <path d="M 0 232 Q 500 92 1000 232" stroke="#8a98a8" strokeWidth="2" fill="none" opacity="0.5" />
          {/* Rivets le long du bord supérieur */}
          {Array.from({ length: 18 }).map((_, i) => {
            const t = i / 17;
            const x = t * 1000;
            const y = 200 * (1 - t) * (1 - t) + 2 * 60 * (1 - t) * t + 200 * t * t;
            return <circle key={i} cx={x} cy={y + 12} r="3" fill="#141c26" stroke="#6a7a88" strokeWidth="0.8" />;
          })}

          {/* Helper : y le long de la courbe du bord haut du cockpit (convexe).
             Correspond à Q 500 60 1000 200 → y(t) = 200 - 280·t·(1-t). */}
          {(() => {
            const arcY = (x) => 200 - 280 * (x / 1000) * (1 - x / 1000);
            const DIAL_R = 26;
            const BTN_R = 8;
            const dials = [
              { x: 90,  hue: "#ffd166" },
              { x: 220, hue: "#7fd8ff" },
              { x: 350, hue: "#5eff9e" },
              { x: 650, hue: "#ff9060" },
              { x: 780, hue: "#c8a8f0" },
              { x: 910, hue: "#ffd166" },
            ];
            /* deux lignes de boutons LED qui suivent la courbe (12 par ligne) */
            const ledColors = ["ckLedR", "ckLedY", "ckLedG", "ckLedB"];
            const btnRow1 = Array.from({ length: 12 }).map((_, i) => ({
              x: 60 + i * 80,
              g: ledColors[i % 4],
              i,
            }));
            const btnRow2 = Array.from({ length: 12 }).map((_, i) => ({
              x: 60 + i * 80,
              g: ledColors[(i + 2) % 4],
              i: i + 12,
            }));
            return (
              <>
                {/* --- CADRANS analogiques (r=28), suivant la courbe --- */}
                {dials.map((d, i) => {
                  const cy = arcY(d.x) + DIAL_R + 20;
                  return (
                    <g key={i}>
                      <circle cx={d.x} cy={cy} r={DIAL_R} fill="#0a1018" stroke="#8a98a8" strokeWidth="2" />
                      <circle cx={d.x} cy={cy} r={DIAL_R - 3} fill="#0e1a24" stroke="#2a3542" strokeWidth="0.8" />
                      {Array.from({ length: 11 }).map((_, k) => {
                        const a = -Math.PI * 0.75 + (k / 10) * Math.PI * 1.5;
                        const x1 = d.x + Math.cos(a) * (DIAL_R - 8), y1 = cy + Math.sin(a) * (DIAL_R - 8);
                        const x2 = d.x + Math.cos(a) * (DIAL_R - 3), y2 = cy + Math.sin(a) * (DIAL_R - 3);
                        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k > 7 ? "#ff5030" : d.hue} strokeWidth={k % 5 === 0 ? 1.4 : 0.8} />;
                      })}
                      <g style={{ transformOrigin: `${d.x}px ${cy}px` }}>
                        <animateTransform attributeName="transform" type="rotate"
                          values={`${-60 + i * 8};${30 + i * 4};${-60 + i * 8}`}
                          dur={`${3.5 + i * 0.3}s`} repeatCount="indefinite" />
                        <line x1={d.x} y1={cy} x2={d.x} y2={cy - (DIAL_R - 8)} stroke={d.hue} strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx={d.x} cy={cy} r="2.6" fill={d.hue} />
                      </g>
                    </g>
                  );
                })}

                {/* --- ECRAN CENTRAL (oscilloscope) --- */}
                {(() => {
                  const cyCenter = arcY(500) + 50;
                  return (
                    <g>
                      <rect x="420" y={cyCenter - 30} width="160" height="60" rx="6" fill="url(#ckScreen)" stroke="#8a98a8" strokeWidth="2" />
                      <rect x="424" y={cyCenter - 26} width="152" height="52" rx="4" fill="none" stroke="#0e2818" strokeWidth="0.8" />
                      {[440, 460, 480, 500, 520, 540, 560].map((x) => (
                        <line key={x} x1={x} y1={cyCenter - 26} x2={x} y2={cyCenter + 22} stroke="#144030" strokeWidth="0.5" />
                      ))}
                      {[cyCenter - 15, cyCenter, cyCenter + 15].map((y, k) => (
                        <line key={k} x1="424" y1={y} x2="576" y2={y} stroke="#144030" strokeWidth="0.5" />
                      ))}
                      <path fill="none" stroke="#5eff9e" strokeWidth="1.6" strokeLinecap="round"
                        d={`M 424 ${cyCenter} Q 445 ${cyCenter - 22} 465 ${cyCenter} T 505 ${cyCenter} T 545 ${cyCenter} T 585 ${cyCenter}`}>
                        <animate attributeName="d" dur="2.4s" repeatCount="indefinite"
                          values={`M 424 ${cyCenter} Q 445 ${cyCenter - 22} 465 ${cyCenter} T 505 ${cyCenter} T 545 ${cyCenter} T 585 ${cyCenter};
                                   M 424 ${cyCenter} Q 445 ${cyCenter + 22} 465 ${cyCenter} T 505 ${cyCenter} T 545 ${cyCenter} T 585 ${cyCenter};
                                   M 424 ${cyCenter} Q 445 ${cyCenter - 22} 465 ${cyCenter} T 505 ${cyCenter} T 545 ${cyCenter} T 585 ${cyCenter}`} />
                      </path>
                      <text x="500" y={cyCenter + 20} textAnchor="middle" fontSize="7" fill="#5eff9e" fontFamily="ui-monospace,monospace" letterSpacing="2">SIGNAL LOCK</text>
                    </g>
                  );
                })()}

                {/* --- BOUTONS LED : deux rangées le long de la courbe --- */}
                {btnRow1.map((b) => {
                  const y = arcY(b.x) + DIAL_R * 2 + 45;
                  return (
                    <g key={`r1-${b.i}`}>
                      <circle cx={b.x} cy={y} r={BTN_R + 2} fill="#141c26" stroke="#4a5460" strokeWidth="1" />
                      <circle cx={b.x} cy={y} r={BTN_R} fill={`url(#${b.g})`}>
                        <animate attributeName="opacity" values="0.55;1;0.55" dur={`${1.2 + (b.i % 5) * 0.3}s`} begin={`${(b.i * 0.13) % 2}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx={b.x - 2} cy={y - 2} r="1.6" fill="#ffffff" opacity="0.4" />
                    </g>
                  );
                })}
                {btnRow2.map((b) => {
                  const y = arcY(b.x) + DIAL_R * 2 + 70;
                  return (
                    <g key={`r2-${b.i}`}>
                      <circle cx={b.x} cy={y} r={BTN_R + 2} fill="#141c26" stroke="#4a5460" strokeWidth="1" />
                      <circle cx={b.x} cy={y} r={BTN_R} fill={`url(#${b.g})`}>
                        <animate attributeName="opacity" values="0.55;1;0.55" dur={`${1.4 + (b.i % 4) * 0.3}s`} begin={`${(b.i * 0.17) % 2}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx={b.x - 2} cy={y - 2} r="1.6" fill="#ffffff" opacity="0.4" />
                    </g>
                  );
                })}

                {/* --- Interrupteurs à bascule (2) --- */}
                {[220, 780].map((x, i) => {
                  const y = arcY(x) + DIAL_R * 2 + 100;
                  return (
                    <g key={i}>
                      <rect x={x - 14} y={y - 6} width="28" height="12" rx="2" fill="#141c26" stroke="#4a5460" strokeWidth="1" />
                      <rect x={x - 1.5} y={y - 16} width="3" height="12" rx="0.8" fill="url(#ckMetalHi)" stroke="#141c26" strokeWidth="0.5" />
                      <circle cx={x} cy={y - 18} r="2.5" fill="url(#ckKnobG)" />
                    </g>
                  );
                })}

                {/* --- Petits écrans texte --- */}
                {[
                  { x: 350, txt1: "NODE:", txt2: "NEXT ERA", c1: "#7fd8ff", c2: "#ffd166" },
                  { x: 650, txt1: "T-FLUX:", txt2: "READY", c1: "#5eff9e", c2: "#ffd166" },
                ].map((s, i) => {
                  const y = arcY(s.x) + DIAL_R * 2 + 95;
                  return (
                    <g key={i}>
                      <rect x={s.x - 45} y={y - 10} width="90" height="22" rx="3" fill="#0a1a10" stroke="#4a5460" strokeWidth="1" />
                      <text x={s.x - 40} y={y + 4} fontSize="9" fill={s.c1} fontFamily="ui-monospace,monospace" letterSpacing="1">
                        {s.txt1} <tspan fill={s.c2}>{s.txt2}</tspan>
                      </text>
                    </g>
                  );
                })}

                {/* --- Volant central chromé --- */}
                {(() => {
                  const cx = 500;
                  const cy = arcY(cx) + DIAL_R * 2 + 130;
                  return (
                    <g transform={`translate(${cx} ${cy})`}>
                      <circle r="26" fill="none" stroke="url(#ckMetalHi)" strokeWidth="5" />
                      <circle r="22" fill="none" stroke="#141c26" strokeWidth="1.5" />
                      <line x1="-26" y1="0" x2="26" y2="0" stroke="url(#ckMetalHi)" strokeWidth="3" />
                      <line x1="0" y1="-26" x2="0" y2="26" stroke="url(#ckMetalHi)" strokeWidth="3" />
                      <circle r="7" fill="url(#ckKnobG)" stroke="#141c26" strokeWidth="1" />
                      <circle r="2.4" fill="#ff5030">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                })()}
              </>
            );
          })()}
        </svg>

        {/* Interface interactive HTML positionnée par-dessus la console */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "flex-start", paddingTop: "3%", gap: 8,
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 4,
            color: "#ffd166", textShadow: "0 0 10px rgba(255,209,102,0.7)",
            background: "rgba(4,8,14,0.55)", padding: "5px 14px", borderRadius: 4,
            border: "1px solid rgba(255,209,102,0.4)",
          }}>
            ▶ COCKPIT — MACHINE TEMPORELLE
          </div>
          <p style={{
            margin: "6px 20px 0", maxWidth: 640, textAlign: "center",
            color: "#e8eef5", fontSize: 14, lineHeight: 1.45,
            fontFamily: "Palatino, Georgia, serif",
            background: "rgba(4,8,14,0.55)", padding: "8px 14px", borderRadius: 8,
          }}>
            « Plonge dans le <strong style={{ color: "#7fd8ff" }}>flux temporel</strong>
            {" "}et verrouille le prochain <strong style={{ color: "#ffd166" }}>nœud de communication</strong>. »
          </p>
        </div>

        {/* Bouton GO — grand, positionné juste au-dessus du volant */}
        <button onClick={onGo} autoFocus
          style={{
            position: "absolute", left: "50%", bottom: "18%", transform: "translateX(-50%)",
            background: "linear-gradient(180deg,#ff8a3a,#c0501a)",
            color: "#fff", border: "3px solid #ffd166",
            borderRadius: 999, width: 96, height: 96,
            fontSize: 22, fontWeight: 900, cursor: "pointer",
            fontFamily: "ui-monospace,monospace", letterSpacing: 3,
            boxShadow: "0 0 32px rgba(255,140,60,0.7), inset 0 -6px 12px rgba(0,0,0,0.35), inset 0 6px 12px rgba(255,255,255,0.3)",
            animation: "tvGoPulse 1.6s ease-in-out infinite",
          }} title="Lancer la boussole temporelle">GO</button>

        <button onClick={onCancel}
          style={{
            position: "absolute", right: 14, bottom: 8,
            background: "rgba(0,0,0,0.45)", color: "#8fa3bd",
            border: "1px solid #2a3542",
            borderRadius: 6, padding: "5px 10px", fontSize: 11,
            cursor: "pointer", fontFamily: "ui-monospace,monospace",
          }}>← retour</button>

        <style>{`
          @keyframes tvGoPulse {
            0%,100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 32px rgba(255,140,60,0.7), inset 0 -6px 12px rgba(0,0,0,0.35), inset 0 6px 12px rgba(255,255,255,0.3); }
            50%     { transform: translateX(-50%) scale(1.06); box-shadow: 0 0 48px rgba(255,140,60,0.9), inset 0 -6px 12px rgba(0,0,0,0.35), inset 0 6px 12px rgba(255,255,255,0.3); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ============================================================
   COMPOSANT PRINCIPAL
   ============================================================ */
export function TimeVessel({ nextLabel, onDone, onCancel, backdrop: backdropProp }) {
  /* Départ direct dans le COCKPIT : la scène MARTINE/matérialisation n'est
     jouée qu'au tout premier chapitre (elle est skippée par défaut ici). */
  const [phase, setPhase] = useState("cockpit");
  const backdropScene = backdropProp || defaultBackdropScene;
  const [flux, setFlux] = useState(0);
  const rafRef = useRef(null);

  /* Anime la jauge de flux temporel : 0 → 100 % en ~3.2 s */
  useEffect(() => {
    if (phase !== "martine") return;
    const start = performance.now();
    const dur = 3200;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 2);
      setFlux(Math.round(eased * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  /* ---------- PHASE COMPASS : le mini-jeu ---------- */
  if (phase === "compass") {
    return (
      <TemporalCompass
        nextLabel={nextLabel}
        onLock={() => onDone?.()}
        onCaught={() => setPhase("cockpit")}
        onClose={() => setPhase("cockpit")}
      />
    );
  }

  /* ---------- FOND : le tableau prehistorique "devant la grotte" NU ---------- */
  const backdrop = (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {backdropScene}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,8,14,0.35)" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "#080d16", overflow: "hidden", fontFamily: "Palatino, Georgia, serif" }}>
      {backdrop}

      {/* Bouton PASSER discret, coin haut droit — saute directement le jeu
          temporel et déclenche onDone (arrivée au chapitre suivant). */}
      <button onClick={() => onDone?.()}
        title="Sauter le jeu temporel"
        style={{ position: "absolute", top: 12, right: 16, zIndex: 20, background: "rgba(20,27,38,0.6)", border: "1px solid rgba(200,212,226,0.25)", color: "#8fa3bd", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
        passer ›
      </button>

      {/* ---------- 1. MARTINE ANNONCE (gros plan) ---------- */}
      {phase === "martine" && (
        <>
          {/* MARTINE : GRAND PLAN, ancrée à gauche */}
          <div style={{
            position: "absolute", top: "50%", left: "22%", transform: "translate(-50%, -50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{
              padding: 24, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(94,255,158,0.4) 0%, rgba(94,255,158,0) 70%)",
              animation: "tvMartineGlow 2.8s ease-in-out infinite",
            }}>
              <Avatar mood="content" size={340} talking />
            </div>
            <div style={{
              fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 3, color: "#5eff9e",
              background: "rgba(4,8,14,0.7)", padding: "6px 14px", borderRadius: 6,
            }}>▶ MARTINE</div>
          </div>

          {/* Bulle de dialogue centrée en bas */}
          <div style={{
            position: "absolute", left: "50%", bottom: "6%", transform: "translateX(-50%)",
            maxWidth: 720, width: "min(94%, 720px)",
          }}>
            <div style={{
              background: "#0e1a30", border: "2px solid #5eff9e", borderRadius: 14,
              padding: "20px 26px", color: "#e8eef5",
              boxShadow: "0 0 30px rgba(94,255,158,0.35)",
              textAlign: "center",
            }}>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55 }}>
                « Le SOS a rechargé mon <strong style={{ color: "#ffd166" }}>flux temporel</strong> —
                {" "}je peux matérialiser la <strong style={{ color: "#5eff9e" }}>machine temporelle</strong>. »
              </p>
              <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.5, color: "#c8d4e2" }}>
                Regarde — elle apparaît sous nos yeux.
              </p>
              <button onClick={() => setPhase("materialize")}
                autoFocus
                style={{
                  marginTop: 14, background: "#5eff9e", color: "#06110b", border: "none",
                  borderRadius: 12, padding: "12px 34px", fontSize: 15, fontWeight: 800,
                  cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 3,
                  boxShadow: "0 0 18px rgba(94,255,158,0.45)",
                }}>▶ CONTINUER</button>
            </div>
          </div>

          <style>{`
            @keyframes tvMartineGlow { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
            @keyframes tvGaugeShine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          `}</style>
        </>
      )}

      {/* ---------- 2. MATERIALISATION DE LA MACHINE (centrée, posée) ---------- */}
      {phase === "materialize" && (
        <MaterializePhase onEnter={() => setPhase("cockpit")} />
      )}

      {/* ---------- 3. COCKPIT ---------- */}
      {phase === "cockpit" && (
        <CockpitPhase
          onGo={() => setPhase("compass")}
          onCancel={onCancel}
          backdropScene={backdropScene}
        />
      )}
    </div>
  );
}
