import { useState, useEffect, useRef } from "react";

/* ============================================================
   MINI-JEU : « Enregistrer le tube sur cassette » (1985)
   ------------------------------------------------------------
   La radio joue en boucle : DJ qui parle, jingle pub, DJ,
   LE TUBE, DJ. Le joueur doit presser PLAY+REC pile au
   moment où le tube commence.
   Cette v2 ajoute :
   - du SON synthétisé sur la radio, différent selon le
     segment (parlé DJ, jingle pub bright, motif tube +
     kick) ;
   - une phase d'ENREGISTREMENT de 10 s après le bon clic,
     pendant laquelle la boucle du tube joue en continu
     (kick + mélodie + snare) et une barre de progression
     avance. Le joueur voit son enregistrement se faire.
   ============================================================ */

const SEGMENTS = [
  { type: "dj",   dur: 1.6, label: "…et voilà pour la météo. Restez avec nous sur Skyrap, tout de suite…" },
  { type: "pub",  dur: 1.4, label: "🎵 (jingle) MEUBLES CONFORIMA — le confort à petit prix ! 🎵" },
  { type: "dj",   dur: 1.4, label: "…on enchaîne avec le nouveau tube qui cartonne partout en Europe…" },
  { type: "tube", dur: 2.2, label: "🎸 ♪♪ LE TUBE ! ♪♪ (intro guitare + batterie qui démarre) 🎸" },
  { type: "dj",   dur: 1.6, label: "…c'était le nouveau single, à retrouver en 45-tours chez votre disquaire…" },
];
const TOTAL = SEGMENTS.reduce((s, x) => s + x.dur, 0);
const REC_DURATION = 10; // secondes d'enregistrement de la face A

function segmentAt(pos) {
  let acc = 0;
  for (const s of SEGMENTS) {
    if (pos >= acc && pos < acc + s.dur) return { ...s, start: acc };
    acc += s.dur;
  }
  return SEGMENTS[SEGMENTS.length - 1];
}

let _ac = null;
function getAC() {
  try {
    _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
    if (_ac.state === "suspended") _ac.resume();
    return _ac;
  } catch { return null; }
}

/* Cue court joué à chaque changement de segment. */
function playCue(type) {
  const ac = getAC(); if (!ac) return;
  const now = ac.currentTime;
  if (type === "dj") {
    /* voix DJ : deux courts « duh-dum » sawtooth grave */
    [[220, 0], [175, 0.18]].forEach(([f, offset]) => {
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
      const g = ac.createGain(); g.gain.value = 0.0001;
      const t = now + offset;
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + 0.16);
    });
  } else if (type === "pub") {
    /* jingle pub : 4 notes montantes bright triangle */
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ac.createOscillator(); o.type = "triangle"; o.frequency.value = f;
      const g = ac.createGain(); g.gain.value = 0.0001;
      const t = now + i * 0.09;
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + 0.14);
    });
  } else if (type === "tube") {
    /* tube : motif 3 notes carré + kick sub */
    [440, 523.25, 659.25].forEach((f, i) => {
      const o = ac.createOscillator(); o.type = "square"; o.frequency.value = f;
      const g = ac.createGain(); g.gain.value = 0.0001;
      const t = now + i * 0.12;
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + 0.24);
    });
    const k = ac.createOscillator(); k.type = "sine";
    k.frequency.setValueAtTime(120, now);
    k.frequency.exponentialRampToValueAtTime(40, now + 0.14);
    const kg = ac.createGain(); kg.gain.value = 0.14;
    kg.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    k.connect(kg); kg.connect(ac.destination);
    k.start(now); k.stop(now + 0.18);
  }
}

/* Boucle du tube pour la phase d'enregistrement (~10 s).
   Programme tous les événements audio en une passe, puis rend
   la fonction de rappel qui les stoppe si besoin. */
function playTubeLoop(seconds) {
  const ac = getAC(); if (!ac) return () => {};
  const start = ac.currentTime + 0.05;
  const period = 0.42;
  const notes = [440, 523.25, 659.25, 587.33, 523.25, 440, 392, 523.25];
  const scheduled = [];
  const nSteps = Math.floor(seconds / period);
  for (let step = 0; step < nSteps; step++) {
    const t = start + step * period;
    const f = notes[step % notes.length];
    /* mélodie */
    const o = ac.createOscillator(); o.type = "square"; o.frequency.value = f;
    const g = ac.createGain(); g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.055, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + period - 0.03);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + period);
    scheduled.push(o);
    /* kick sur chaque pas */
    const k = ac.createOscillator(); k.type = "sine";
    k.frequency.setValueAtTime(120, t);
    k.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    const kg = ac.createGain(); kg.gain.value = 0.12;
    kg.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    k.connect(kg); kg.connect(ac.destination);
    k.start(t); k.stop(t + 0.16);
    scheduled.push(k);
    /* snare bruité tous les 2 pas */
    if (step % 2 === 1) {
      const n = ac.createOscillator(); n.type = "square"; n.frequency.value = 260;
      const ng = ac.createGain(); ng.gain.value = 0.05;
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      n.connect(ng); ng.connect(ac.destination);
      n.start(t); n.stop(t + 0.08);
      scheduled.push(n);
    }
  }
  return () => scheduled.forEach((n) => { try { n.stop(); } catch {} });
}

function playClack() {
  const ac = getAC(); if (!ac) return;
  const t = ac.currentTime;
  const o = ac.createOscillator(); o.type = "square"; o.frequency.value = 180;
  const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.15, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.09);
}
function playRate() {
  const ac = getAC(); if (!ac) return;
  const t = ac.currentTime;
  const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = 220;
  o.frequency.exponentialRampToValueAtTime(60, t + 0.4);
  const g = ac.createGain(); g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.42);
}

export function CassetteGame({ onClose, onWin }) {
  const [pos, setPos] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [verdict, setVerdict] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recElapsed, setRecElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const raf = useRef(null);
  const lastT = useRef(null);
  const lastSegType = useRef(null);
  const stopLoopRef = useRef(null);

  /* boucle radio */
  useEffect(() => {
    if (won || recording) return;
    lastT.current = performance.now();
    const tick = (t) => {
      const dt = (t - (lastT.current || t)) / 1000;
      lastT.current = t;
      setPos((p) => (p + dt * 0.6) % TOTAL);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [won, recording]);

  /* changement de segment → cue sonore */
  const seg = segmentAt(pos);
  useEffect(() => {
    if (recording || won) return;
    if (lastSegType.current !== seg.type) {
      lastSegType.current = seg.type;
      playCue(seg.type);
    }
  }, [seg.type, recording, won]);

  /* phase enregistrement : progresse jusqu'à 10 s, joue le tube */
  useEffect(() => {
    if (!recording) return;
    stopLoopRef.current = playTubeLoop(REC_DURATION + 0.3);
    const start = performance.now();
    let localRaf;
    const tick = () => {
      const el = (performance.now() - start) / 1000;
      setRecElapsed(Math.min(el, REC_DURATION));
      if (el < REC_DURATION) localRaf = requestAnimationFrame(tick);
      else setWon(true);
    };
    localRaf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(localRaf);
      if (stopLoopRef.current) stopLoopRef.current();
    };
  }, [recording]);

  useEffect(() => { if (won) onWin?.(); }, [won]); // eslint-disable-line

  const tubeSeg = SEGMENTS.find((s) => s.type === "tube");
  let tubeStart = 0; for (const s of SEGMENTS) { if (s.type === "tube") break; tubeStart += s.dur; }
  const tubeEnd = tubeStart + tubeSeg.dur;

  const presser = () => {
    if (won || recording) return;
    playClack();
    setAttempts((n) => n + 1);
    if (pos >= tubeStart && pos < tubeStart + 0.55) {
      setVerdict("top");
      setRecording(true);
    } else if (pos < tubeStart) {
      setVerdict("trop_tot");
      playRate();
    } else if (pos > tubeStart + 0.55 && pos < tubeEnd) {
      setVerdict("trop_tard");
      playRate();
    } else {
      setVerdict("hors_zone");
      playRate();
    }
  };

  const cursorPct = (pos / TOTAL) * 100;
  const recPct = (recElapsed / REC_DURATION) * 100;
  /* segment courant utilisé pour animer les hauts-parleurs :
     pulsation légère qui dépend du type de son. */
  const pulseAnim = recording ? "hp-tube 0.42s ease-in-out infinite"
                   : seg.type === "tube" ? "hp-tube 0.42s ease-in-out infinite"
                   : seg.type === "pub"  ? "hp-pub 0.28s ease-in-out infinite"
                   : "hp-dj 0.30s ease-in-out infinite";

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#17110a", border: "2px solid #c8963e66", borderRadius: 18, padding: 20, maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848" }}>📼 CHAMBRE DE JULIEN · 17H · 1985</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 21 }}>
          {recording ? "Enregistrement en cours…" : "Enregistrer le tube sans le DJ !"}
        </h2>

        {!won ? (
          <>
            <p style={{ textAlign: "center", fontSize: 13, color: "#d8c9a8", margin: "0 0 12px" }}>
              {recording
                ? "Ne touche plus à rien. La face A se remplit tout seul — on écoute jusqu'à ce que ce soit bon."
                : <>Écoute la radio. Presse <strong>PLAY+REC</strong> PILE au moment où le tube commence — pas pendant que le DJ parle.</>}
            </p>

            {/* la radio-cassette dessinée en gros au centre */}
            <svg viewBox="0 0 400 130" style={{ width: "100%", height: "auto", background: "#1a1006", borderRadius: 8, border: "2px solid #5a4028", marginBottom: 10 }}>
              <rect x="20" y="20" width="360" height="90" rx="6" fill="#3a3830" stroke="#0a0806" strokeWidth="2" />
              <rect x="20" y="20" width="360" height="14" fill="#5a5850" />
              {/* haut-parleurs latéraux — le centre pulse au rythme du son */}
              <circle cx="55" cy="70" r="22" fill="#0a0806" stroke="#6a6a6a" strokeWidth="1.4" />
              <circle cx="55" cy="70" r="16" fill="#2a2820" />
              {[6, 10, 14].map((r, i) => <circle key={i} cx="55" cy="70" r={r} fill="none" stroke="#5a5850" strokeWidth="0.5" />)}
              <circle cx="55" cy="70" r="5" fill={seg.type === "tube" || recording ? "#e0a848" : seg.type === "pub" ? "#c8a8e0" : "#8a8a8a"}
                style={{ transformOrigin: "55px 70px", transformBox: "fill-box", animation: pulseAnim }} />
              <circle cx="345" cy="70" r="22" fill="#0a0806" stroke="#6a6a6a" strokeWidth="1.4" />
              <circle cx="345" cy="70" r="16" fill="#2a2820" />
              {[6, 10, 14].map((r, i) => <circle key={i} cx="345" cy="70" r={r} fill="none" stroke="#5a5850" strokeWidth="0.5" />)}
              <circle cx="345" cy="70" r="5" fill={seg.type === "tube" || recording ? "#e0a848" : seg.type === "pub" ? "#c8a8e0" : "#8a8a8a"}
                style={{ transformOrigin: "345px 70px", transformBox: "fill-box", animation: pulseAnim }} />
              {/* deux platines : LEC (gauche) + REC (droite) */}
              <rect x="110" y="42" width="80" height="34" fill="#0a0806" stroke="#6a6a6a" strokeWidth="0.8" />
              <rect x="118" y="50" width="64" height="18" fill="#3a3a3a" />
              <circle cx="128" cy="59" r="4" fill="#8a8a8a">
                {(seg.type === "tube" || recording) && (
                  <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                    from="0 128 59" to="360 128 59" dur="1.4s" repeatCount="indefinite" />
                )}
              </circle>
              <circle cx="172" cy="59" r="4" fill="#8a8a8a">
                {(seg.type === "tube" || recording) && (
                  <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                    from="0 172 59" to="360 172 59" dur="1.4s" repeatCount="indefinite" />
                )}
              </circle>
              <rect x="210" y="42" width="80" height="34" fill="#0a0806" stroke="#c8963e" strokeWidth="0.8" />
              <rect x="218" y="50" width="64" height="18" fill={recording ? "#e0a848" : "#3a3a3a"} />
              <circle cx="228" cy="59" r="4" fill={recording ? "#f8b800" : "#8a8a8a"}>
                {recording && (
                  <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                    from="0 228 59" to="360 228 59" dur="1.4s" repeatCount="indefinite" />
                )}
              </circle>
              <circle cx="272" cy="59" r="4" fill={recording ? "#f8b800" : "#8a8a8a"}>
                {recording && (
                  <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                    from="0 272 59" to="360 272 59" dur="1.4s" repeatCount="indefinite" />
                )}
              </circle>
              {/* LED REC clignotante pendant l'enregistrement */}
              <circle cx="278" cy="30" r="3" fill={recording ? "#e83820" : "#3a1a10"}
                style={recording ? { animation: "pulse 0.5s ease-in-out infinite" } : {}} />
              <text x="285" y="32" fontSize="7" fontFamily="ui-monospace,monospace" fontWeight="800" fill={recording ? "#e83820" : "#5a3018"}>REC</text>
              {/* boutons */}
              {[[124, 96, "⏮"], [148, 96, "⏹"], [172, 96, "▶"], [196, 96, "⏭"], [232, 96, "⏹"], [258, 96, "▶"], [284, 96, "⏺"]].map(([x, y, lbl], i) => (
                <g key={i}>
                  <rect x={x - 8} y={y - 6} width="16" height="12" fill={i === 6 ? "#c02010" : "#8a8a8a"} stroke="#3a3a3a" strokeWidth="0.4" rx="1" />
                  <text x={x} y={y + 2} textAnchor="middle" fontSize="7" fill="#fff">{lbl}</text>
                </g>
              ))}
              <path d="M370 20 L390 -18" stroke="#8a8a8a" strokeWidth="1.6" />
              <circle cx="390" cy="-18" r="2" fill="#8a8a8a" />
            </svg>

            {/* ce qu'on ENTEND (ou ce qui S'ENREGISTRE) */}
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 8, padding: "10px 14px", minHeight: 46, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontFamily: "ui-monospace,monospace", color: "#7a6a4a", letterSpacing: 1 }}>
                {recording ? "SUR LA CASSETTE :" : "ON ENTEND :"}
              </div>
              <div style={{ fontSize: 13.5, color: recording ? "#7fe0a8" : seg.type === "tube" ? "#7fe0a8" : seg.type === "pub" ? "#c8a8e0" : "#c8b090", fontStyle: "italic", fontFamily: "Georgia,serif" }}>
                {recording ? "🎸 ♪♪ LE TUBE ! ♪♪ (le morceau tourne, tu tiens ton enregistrement)" : seg.label}
              </div>
            </div>

            {/* pendant la phase d'ÉCOUTE : timeline discrète.
               pendant la phase d'ENREGISTREMENT : barre de progression 10 s. */}
            {!recording ? (
              <div style={{ position: "relative", height: 16, background: "#1a140a", border: "1px solid #5a4028", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                {(() => { let acc = 0; const seps = []; for (let i = 0; i < SEGMENTS.length - 1; i++) { acc += SEGMENTS[i].dur; seps.push(<div key={i} style={{ position: "absolute", left: `${(acc / TOTAL) * 100}%`, top: 0, bottom: 0, width: 1, background: "#3a2818" }} />); } return seps; })()}
                <div style={{ position: "absolute", left: `${cursorPct}%`, top: 0, bottom: 0, width: 2, background: "#ffd166", transform: "translateX(-1px)" }} />
              </div>
            ) : (
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#a89878", marginBottom: 4 }}>
                  <span>Face A · piste 1</span>
                  <span>{recElapsed.toFixed(1)} / {REC_DURATION.toFixed(1)} s</span>
                </div>
                <div style={{ position: "relative", height: 18, background: "#1a140a", border: "1px solid #5a4028", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${recPct}%`, background: "linear-gradient(90deg,#c02010,#e83820)", transition: "width 60ms linear" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#fff", letterSpacing: 2, textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
                    ● REC · GRAVURE EN COURS
                  </div>
                </div>
              </div>
            )}

            {!recording && (
              <div style={{ minHeight: 22, marginBottom: 8, textAlign: "center", fontSize: 12.5, fontStyle: "italic",
                color: verdict === "top" ? "#7fe0a8" : verdict ? "#e0a848" : "transparent" }}>
                {verdict === "top" && "✓ Pile au bon moment ! On enregistre…"}
                {verdict === "trop_tot" && "Trop tôt — tu enregistrerais le DJ par-dessus le tube !"}
                {verdict === "trop_tard" && "Trop tard — début du tube raté."}
                {verdict === "hors_zone" && "Raté — le tube n'est même pas encore passé."}
                {!verdict && " "}
              </div>
            )}

            {!recording ? (
              <button onPointerDown={presser}
                style={{ width: "100%", background: "#e83820", color: "#fff", border: "2px solid #a02010", borderRadius: 10, padding: "18px", fontWeight: 800, cursor: "pointer", fontSize: 20, fontFamily: "ui-monospace,monospace", letterSpacing: 3 }}>
                ⏵ PLAY + ⏺ REC
              </button>
            ) : (
              <div style={{ background: "#2a1a10", border: "1px solid #5a2a10", borderRadius: 10, padding: "12px", fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#f8c088", textAlign: "center", letterSpacing: 1 }}>
                🔴 REC · ne touche plus à la platine, la bande défile
              </div>
            )}
            {!recording && (
              <div style={{ fontSize: 10.5, textAlign: "center", color: "#a89878", marginTop: 6 }}>
                tentatives : {attempts} — reste calme, écoute bien
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Tu as attrapé le tube dès la première note, et la face A est pleine — dix secondes du morceau, gravées sur ta bande. Cassette Philips en 1963, magnétoscope VHS en 1976 : pour la PREMIÈRE FOIS de l'Histoire, chaque foyer peut enregistrer chez soi ce qui passe à la radio ou à la télé — puis copier, prêter, échanger. L'industrie du disque crie déjà au « piratage ». Attention : la bande se démagnétise, se casse, s'aimante. Des archives entières de radio et de télé ont été perdues. Un support qui EXISTE ne garantit pas la SURVIE du message. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 13, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Tube enregistré — Julien te fait un high-five !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
        <style>{`
          @keyframes hp-dj   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.35); } }
          @keyframes hp-pub  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.55); } }
          @keyframes hp-tube { 0%,100% { transform: scale(1); } 30% { transform: scale(1.7); } 70% { transform: scale(1.2); } }
        `}</style>
      </div>
    </div>
  );
}
