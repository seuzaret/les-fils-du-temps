import { useState, useEffect, useRef } from "react";

/* ============================================================
   MINI-JEU : « Le cylindre de James » (NY, 1878)
   ------------------------------------------------------------
   Tourner la manivelle du phonographe Edison à la BONNE VITESSE :
   trop vite, la voix devient aiguë (Mickey) ; trop lent, elle devient
   caverneuse ; à ~60 tr/min, elle sonne juste.
   Le joueur clique/tape une fois par « demi-tour » : on mesure la
   cadence. La barre reste dans la zone verte pendant 10 secondes.
   Leçon : c'est le premier support qui GRAVE et RESTITUE la voix.
   ============================================================ */

const TARGET_BASE = 500;   // cadence cible moyenne (2 clics/seconde)
const TARGET_SWING = 140;  // amplitude d'oscillation de la cible (±140 ms)
const TARGET_PERIOD = 3.4; // secondes pour un cycle complet
const TOL_MS = 110;        // tolérance autour de la cible (± ms)
const HOLD_MS = 10000;     // maintenir dans la zone 10 s

/* la cible bouge — elle glisse doucement en sinusoïde autour de 500 ms.
   Le joueur doit ralentir/accélérer pour la suivre. */
function targetAt(elapsedMs) {
  return TARGET_BASE + Math.sin((elapsedMs / 1000) * (2 * Math.PI / TARGET_PERIOD)) * TARGET_SWING;
}

/* Un vrai bruit de VOIX NASILLARDE sur étain : un cornet grave qui grince
   (triangle grave + formant nasal) + un CRRR de vinyle en fond (bruit
   blanc filtré passe-bande). Chaque clic joue un demi-mot enregistré. */
let AC = null;
function playCue(pitchMul) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const t = AC.currentTime;
    /* --- 1) le CORPS de la voix : deux oscillateurs légèrement désaccordés
       + un filtre passe-bas pour l'aspect « vieux cornet » --- */
    const base = 180 * pitchMul; // hauteur qui suit la cadence (trop vite = aigu)
    const o1 = AC.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = base;
    const o2 = AC.createOscillator(); o2.type = "triangle"; o2.frequency.value = base * 1.005;
    const filt = AC.createBiquadFilter(); filt.type = "lowpass";
    filt.frequency.value = 900 * pitchMul; filt.Q.value = 6; // formant nasal
    const g1 = AC.createGain();
    g1.gain.setValueAtTime(0.0001, t);
    g1.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
    g1.gain.setValueAtTime(0.09, t + 0.14);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o1.connect(filt); o2.connect(filt); filt.connect(g1); g1.connect(AC.destination);
    o1.start(t); o2.start(t); o1.stop(t + 0.24); o2.stop(t + 0.24);

    /* --- 2) le CRRR de vinyle : bruit blanc bref filtré passe-bande --- */
    const noiseBuf = AC.createBuffer(1, AC.sampleRate * 0.22, AC.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / nd.length);
    const noise = AC.createBufferSource(); noise.buffer = noiseBuf;
    const bp = AC.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2200; bp.Q.value = 1.4;
    const g2 = AC.createGain();
    g2.gain.setValueAtTime(0.06, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    noise.connect(bp); bp.connect(g2); g2.connect(AC.destination);
    noise.start(t); noise.stop(t + 0.24);
  } catch { /* audio indisponible : le jeu marche quand même */ }
}

/* CRRR de fond en LOOP : bruit blanc filtré très doux, joué en boucle
   tant que le mini-jeu est ouvert. Volume plus fort quand on tourne. */
function startCrackle() {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const dur = 2.0;
    const buf = AC.createBuffer(1, AC.sampleRate * dur, AC.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
    const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
    const hp = AC.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1400;
    const g = AC.createGain(); g.gain.value = 0.02;
    src.connect(hp); hp.connect(g); g.connect(AC.destination);
    src.start(); return { src, g };
  } catch { return null; }
}

export function PhonoGame({ onClose, onWin }) {
  const [interval_, setInterval_] = useState(TARGET_BASE);
  const [inZone, setInZone] = useState(0);   // ms cumulés dans la zone
  const [won, setWon] = useState(false);
  const [target, setTarget] = useState(TARGET_BASE); // cible mobile (état affiché)
  const lastClick = useRef(null);
  const raf = useRef(null);
  const lastT = useRef(null);
  const t0 = useRef(performance.now());
  const angle = useRef(0);
  const [_, force] = useState(0);
  const crackle = useRef(null);

  /* CRRR de fond permanent tant que le mini-jeu est ouvert */
  useEffect(() => {
    crackle.current = startCrackle();
    return () => { try { crackle.current?.src.stop(); } catch {} };
  }, []);

  useEffect(() => {
    lastT.current = performance.now();
    const tick = (t) => {
      const dt = t - (lastT.current || t);
      lastT.current = t;
      const elapsed = t - t0.current;
      const tgt = targetAt(elapsed);
      setTarget(tgt);
      // rotation visuelle : plus l'intervalle est court, plus ça tourne vite
      angle.current = (angle.current + dt / (interval_ * 0.5) * 180) % 360;
      // décompte "dans la zone verte" si l'intervalle actuel est OK par rapport à la CIBLE mobile
      const ok = Math.abs(interval_ - tgt) <= TOL_MS;
      setInZone((z) => {
        const nz = ok ? Math.min(HOLD_MS, z + dt) : Math.max(0, z - dt * 0.7);
        if (nz >= HOLD_MS && !won) setWon(true);
        return nz;
      });
      /* le crrr monte en volume quand on tourne (dernier clic récent) */
      if (crackle.current) {
        const sinceClick = lastClick.current ? (t - lastClick.current) : 9999;
        const vol = sinceClick < 1500 ? 0.05 : 0.02;
        try { crackle.current.g.gain.setTargetAtTime(vol, AC.currentTime, 0.4); } catch {}
      }
      force((x) => x + 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [interval_, won]);

  useEffect(() => { if (won) onWin?.(); }, [won]); // eslint-disable-line

  const clickCrank = () => {
    if (won) return;
    const now = performance.now();
    if (lastClick.current) {
      const dt = now - lastClick.current;
      // lissage : moyenne pondérée
      setInterval_((prev) => Math.round(prev * 0.4 + dt * 0.6));
      // hauteur du son inversement proportionnelle à l'intervalle
      playCue(TARGET_BASE / Math.max(80, dt));
    }
    lastClick.current = now;
  };

  const diagnosis = won ? "" :
    interval_ < target - TOL_MS ? "Trop vite ! La voix monte dans les aigus…" :
    interval_ > target + TOL_MS ? "Trop lent — la voix devient caverneuse." :
    "Parfait ! Suis la zone verte qui glisse.";

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#17110a", border: "2px solid #c8963e66", borderRadius: 18, padding: 20, maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848" }}>🎙️ PHONOGRAPHE EDISON · NY 1878</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 21 }}>La voix de James, sur étain</h2>

        {!won ? (
          <>
            <p style={{ textAlign: "center", fontSize: 13, color: "#d8c9a8", margin: "0 0 12px" }}>
              James parle dans le pavillon. Tourne la manivelle à la BONNE VITESSE en cliquant
              régulièrement (environ 2 clics par seconde). Trop vite ou trop lent : la voix se
              déforme.
            </p>

            {/* La manivelle (rotation visuelle basée sur l'intervalle) */}
            <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 10px" }}>
              <svg viewBox="0 0 200 200"
                onPointerDown={clickCrank} style={{ width: 200, height: 200, cursor: "pointer", userSelect: "none" }}>
                <circle cx="100" cy="100" r="86" fill="#3a2410" stroke="#5a4028" strokeWidth="4" />
                <circle cx="100" cy="100" r="70" fill="#e0d0a0" />
                {[4, 8, 12, 16, 20, 24].map((r, i) => (
                  <circle key={i} cx="100" cy="100" r={r * 3} fill="none" stroke="#a89878" strokeWidth="1" />
                ))}
                {/* manivelle qui tourne */}
                <g style={{ transformOrigin: "100px 100px", transform: `rotate(${angle.current}deg)` }}>
                  <rect x="100" y="96" width="80" height="8" rx="3" fill="#a89878" />
                  <circle cx="180" cy="100" r="10" fill="#c8963e" stroke="#5a4028" strokeWidth="2" />
                </g>
                <circle cx="100" cy="100" r="6" fill="#5a4028" />
              </svg>
            </div>

            <p style={{ textAlign: "center", fontSize: 12.5, color: "#e0a848", fontStyle: "italic", minHeight: 20, margin: "0 0 8px" }}>{diagnosis}</p>

            {/* barre de vitesse + boutons ◀ ▶ pour ajuster la cadence */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <button onClick={() => { setInterval_((v) => Math.max(80, v - 30)); playCue(TARGET_BASE / Math.max(80, interval_ - 30)); lastClick.current = performance.now(); }}
                style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #5a4028", background: "#2a1e10", color: "#ffd166", fontSize: 18, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>◀</button>
              <div style={{ position: "relative", height: 22, background: "#1a140a", border: "1px solid #5a4028", borderRadius: 6, overflow: "hidden", flex: 1 }}>
                {/* zone verte mobile */}
                <div style={{ position: "absolute", left: `${((target - TOL_MS) / (TARGET_BASE * 2)) * 100}%`, width: `${(TOL_MS * 2 / (TARGET_BASE * 2)) * 100}%`, top: 0, bottom: 0, background: "#7fe0a8", opacity: 0.4, transition: "left 0.1s linear" }} />
                {/* petit repère vertical au centre de la cible */}
                <div style={{ position: "absolute", left: `${(target / (TARGET_BASE * 2)) * 100}%`, top: 0, bottom: 0, width: 1, background: "#3a9a6a", opacity: 0.7, transition: "left 0.1s linear" }} />
                {/* curseur du joueur */}
                <div style={{ position: "absolute", left: `${Math.max(0, Math.min(100, (interval_ / (TARGET_BASE * 2)) * 100))}%`, top: 0, bottom: 0, width: 3, background: "#ffd166", transform: "translateX(-1px)" }} />
              </div>
              <button onClick={() => { setInterval_((v) => Math.min(TARGET_BASE * 2, v + 30)); playCue(TARGET_BASE / Math.min(TARGET_BASE * 2, interval_ + 30)); lastClick.current = performance.now(); }}
                style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #5a4028", background: "#2a1e10", color: "#ffd166", fontSize: 18, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>▶</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#a89878", marginBottom: 12 }}>
              <span>◀ plus vite (aigu)</span><span>cadence</span><span>plus lent (grave) ▶</span>
            </div>

            {/* barre de maintien */}
            <div style={{ margin: "10px 0 4px", background: "#1a140a", border: "1px solid #5a4028", borderRadius: 6, height: 14, overflow: "hidden" }}>
              <div style={{ width: `${(inZone / HOLD_MS) * 100}%`, height: "100%", background: "#7fe0a8", transition: "width 0.1s" }} />
            </div>
            <div style={{ fontSize: 11, textAlign: "center", color: "#a89878" }}>maintien : {Math.max(0, Math.ceil((HOLD_MS - inZone) / 1000))} s dans la zone</div>
          </>
        ) : (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Une voix HUMAINE, gravée dans une feuille d'étain — c'est prodigieux ! Le 21 novembre 1877, Thomas Edison annonce son phonographe : un cylindre entouré d'étain, qu'on tourne à la manivelle. Pour la première fois de l'Histoire, un SON survit à celui qui l'a émis. Après l'image (photo), voici le son : nos morts pourront désormais nous parler. Attention : l'étain est FRAGILE, il se froisse et s'use au bout de quelques écoutes. Viendront le disque plat d'Emile Berliner (le gramophone, 1887), facile à copier, puis les cylindres de cire (vers 1888), plus solides. Combien de voix du XIXᵉ nous sont-elles arrivées ? Très peu. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 13, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Feuille d'étain gravée — la voix de James est enregistrée !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
