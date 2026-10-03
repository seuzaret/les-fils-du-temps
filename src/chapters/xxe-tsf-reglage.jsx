import { useState, useEffect, useRef } from "react";

/* ============================================================
   MINI-JEU : « Chercher Londres dans le brouillage » (Paris, 5 juin 1944, nuit)
   ------------------------------------------------------------
   Marthe tourne le bouton de fréquence de sa TSF. La bande FM
   n'est parcourue que par du grésillement, des marches allemandes,
   une voix de propagande… et quelque part, très étroite, la BBC.
   L'aiguille doit rester 3 secondes dans la zone BBC (verte
   étroite) pour capter « Les sanglots longs des violons de
   l'automne » — le signal du Débarquement.
   Leçon : la radio est FRAGILE, la censure BROUILLE — mais la
   voix libre passe quand même, pour qui sait la chercher.
   ============================================================ */

/* Bande de fréquence de 0 à 100. Zones fixes (distracteurs) :
   grésillement partout, sauf dans quelques îlots où on entend quelque chose. */
const STATIC_ZONES = [
  { start: 12,  end: 22,  type: "musique",    label: "Musique de Vienne (Wehrmachtsender)" },
  { start: 34,  end: 42,  type: "propagande", label: "Voix allemande : « Achtung… Frankreich… »" },
  { start: 76,  end: 84,  type: "propagande", label: "Radio-Paris (collaboration) : marche militaire" },
];
/* Zone BBC : elle FUIT — son centre glisse en sinusoïde autour d'un
   centre TIRÉ AU HASARD à chaque partie (entre 30 et 80, en évitant
   les zones parasites fixes des STATIC_ZONES). On rejoue = elle bouge. */
const BBC_SWING  = 2.5;   // amplitude d'oscillation ±2.5
const BBC_PERIOD = 6;     // secondes pour un cycle complet (lent)
const BBC_HALF   = 3;     // demi-largeur de la zone (span = 6)

const HOLD_MS = 3000; // temps à tenir dans la zone BBC

/* Tire un centre BBC aléatoire entre 25 et 85, mais évite les zones
   déjà occupées par les stations parasites (grâce à un check simple). */
function randomBbcCenter(zones = STATIC_ZONES) {
  for (let tries = 0; tries < 30; tries++) {
    const c = 25 + Math.random() * 60; // 25..85
    const clash = zones.some((z) => c + BBC_HALF > z.start - 4 && c - BBC_HALF < z.end + 4);
    if (!clash) return c;
  }
  return 60; // fallback
}

/* Les stations parasites bougent aussi d'une partie à l'autre : chaque
   zone est décalée aléatoirement de ±8, dans les limites de la bande. */
function randomizeZones() {
  return STATIC_ZONES.map((z) => {
    const width = z.end - z.start;
    const minStart = 6;
    const maxStart = 94 - width;
    const shift = (Math.random() - 0.5) * 16;
    const newStart = Math.max(minStart, Math.min(maxStart, z.start + shift));
    return { ...z, start: newStart, end: newStart + width };
  });
}

function bbcAt(center, elapsedMs) {
  const c = center + Math.sin((elapsedMs / 1000) * (2 * Math.PI / BBC_PERIOD)) * BBC_SWING;
  return { start: c - BBC_HALF, end: c + BBC_HALF };
}

/* Un léger son de fond en WebAudio : bruit blanc filtré (« friture » de radio). */
let AC = null;
function startBruit() {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const dur = 2.0;
    const buf = AC.createBuffer(1, AC.sampleRate * dur, AC.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
    const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = AC.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1600; bp.Q.value = 0.8;
    const g = AC.createGain(); g.gain.value = 0.05;
    src.connect(bp); bp.connect(g); g.connect(AC.destination);
    src.start(); return { src, g };
  } catch { return null; }
}
/* Un tick de knob quand on tourne. */
function playClick() {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const t = AC.currentTime;
    const o = AC.createOscillator(); o.type = "square"; o.frequency.value = 380;
    const g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.06);
  } catch { /* pas d'audio */ }
}

export function TsfReglageGame({ onClose, onWin }) {
  const [freq, setFreq] = useState(0);        // position de l'aiguille : 0..100
  const [inZone, setInZone] = useState(0);    // ms cumulés dans la zone BBC
  const [won, setWon] = useState(false);
  const [, force] = useState(0);              // re-render pour le label courant
  /* ★ Les stations parasites ET le centre BBC sont tirés au sort à
     chaque partie — la fouille de la bande n'est jamais la même. */
  const zones = useRef(randomizeZones());
  const bbcCenter = useRef(randomBbcCenter(zones.current));
  const raf = useRef(null);
  const lastT = useRef(null);
  const t0 = useRef(performance.now());
  const bruit = useRef(null);

  /* bruit de fond permanent tant que le mini-jeu est ouvert */
  useEffect(() => {
    bruit.current = startBruit();
    return () => { try { bruit.current?.src.stop(); } catch {} };
  }, []);

  /* boucle d'animation : maintien dans la zone BBC (mobile) */
  useEffect(() => {
    if (won) return;
    lastT.current = performance.now();
    const tick = (t) => {
      const dt = t - (lastT.current || t);
      lastT.current = t;
      const elapsed = t - t0.current;
      const bbc = bbcAt(bbcCenter.current, elapsed);
      const statZ = zones.current.find((z) => freq >= z.start && freq <= z.end);
      const dansBBC = freq >= bbc.start && freq <= bbc.end;
      setInZone((v) => {
        const nv = dansBBC ? Math.min(HOLD_MS, v + dt) : Math.max(0, v - dt * 0.7);
        if (nv >= HOLD_MS && !won) setWon(true);
        return nv;
      });
      /* volume du bruit blanc : max entre zones, faible dans les zones */
      if (bruit.current) {
        const vol = dansBBC ? 0.02 : (statZ ? 0.035 : 0.07);
        try { bruit.current.g.gain.setTargetAtTime(vol, AC.currentTime, 0.15); } catch {}
      }
      force((x) => x + 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [freq, won]);

  useEffect(() => { if (won) onWin?.(); }, [won]); // eslint-disable-line

  /* Zone BBC courante (recalculée à chaque render) */
  const bbcNow = bbcAt(bbcCenter.current, performance.now() - t0.current);
  const dansBBC = freq >= bbcNow.start && freq <= bbcNow.end;
  const staticZone = zones.current.find((z) => freq >= z.start && freq <= z.end);
  const currentLabel = dansBBC ? "« Ici Londres. Les Français parlent aux Français. »" :
                       staticZone?.label || "…grrrzzzz… (brouillage)";
  const currentColor = dansBBC ? "#efe6d2" :
                       staticZone?.type === "propagande" ? "#c8b090" :
                       staticZone?.type === "musique" ? "#c8b090" : "#8a8878";

  const tourner = (delta) => {
    if (won) return;
    setFreq((v) => Math.max(0, Math.min(100, v + delta)));
    playClick();
  };

  /* aiguille sous forme d'angle : freq 0..100 → -60°..+60° */
  const angle = -60 + (freq / 100) * 120;

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#17110a", border: "2px solid #c8963e66", borderRadius: 18, padding: 20, maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848" }}>📻 SALON DUPONT · PARIS · 21H15, 5 JUIN 1944</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 21 }}>Chercher Londres dans le brouillage</h2>

        {!won ? (
          <>
            <p style={{ textAlign: "center", fontSize: 13, color: "#d8c9a8", margin: "0 0 12px" }}>
              Tourne le bouton de fréquence avec les flèches. Reste dans la zone BBC (verte) pendant 3 secondes pour capter le message.
            </p>

            {/* le CADRAN de la TSF */}
            <svg viewBox="0 0 400 180" style={{ width: "100%", height: "auto", background: "#2a1608", borderRadius: 8, border: "2px solid #8a5a20", marginBottom: 10 }}>
              {/* fond du cadran */}
              <rect x="20" y="20" width="360" height="80" rx="4" fill="#0a0604" />
              {/* Pas de zones colorées : le joueur doit trouver la BBC à l'oreille (au texte) */}
              {/* graduations neutres */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v, i) => (
                <g key={i}>
                  <path d={`M${20 + (v / 100) * 360} 22 v${i % 5 === 0 ? 12 : 6}`} stroke="#8a5a20" strokeWidth={i % 5 === 0 ? 1.4 : 0.8} />
                  {i % 5 === 0 && <text x={20 + (v / 100) * 360} y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#c8963e">{v}</text>}
                </g>
              ))}
              {/* AIGUILLE — épingle rouge */}
              <g transform={`translate(${20 + (freq / 100) * 360}, 60)`}>
                <path d="M0 -38 L-3 22 L3 22 Z" fill="#e83820" stroke="#800" strokeWidth="0.8" />
                <circle cx="0" cy="22" r="3" fill="#c8963e" />
              </g>

              {/* haut-parleur / grille en bas */}
              <g transform="translate(200,140)">
                {[-90, -60, -30, 0, 30, 60, 90].map((x, i) => (
                  <line key={i} x1={x} y1="-20" x2={x} y2="20" stroke="#5a3818" strokeWidth="1" />
                ))}
                {[-20, -10, 0, 10, 20].map((y, i) => (
                  <line key={i} x1="-90" y1={y} x2="90" y2={y} stroke="#5a3818" strokeWidth="0.8" />
                ))}
              </g>
            </svg>

            {/* Ce qu'on entend actuellement */}
            <div style={{ background: "#0e1420", border: `1px solid ${currentColor}44`, borderRadius: 8, padding: "10px 14px", minHeight: 44, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontFamily: "ui-monospace,monospace", color: "#7a6a4a", letterSpacing: 1 }}>ON ENTEND :</div>
              <div style={{ fontSize: 14, color: currentColor, fontStyle: "italic", fontFamily: "Georgia,serif" }}>{currentLabel}</div>
            </div>

            {/* Boutons ◀ / ▶ pour tourner le bouton */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button onClick={() => tourner(-1)}
                style={{ flex: 1, background: "#2a1e10", color: "#ffd166", border: "1px solid #5a4028", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>◀</button>
              <button onClick={() => tourner(1)}
                style={{ flex: 1, background: "#2a1e10", color: "#ffd166", border: "1px solid #5a4028", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>▶</button>
            </div>

            {/* barre de maintien */}
            <div style={{ background: "#1a140a", border: "1px solid #5a4028", borderRadius: 6, height: 14, overflow: "hidden" }}>
              <div style={{ width: `${(inZone / HOLD_MS) * 100}%`, height: "100%", background: "#7fe0a8", transition: "width 0.08s linear" }} />
            </div>
            <div style={{ fontSize: 11, textAlign: "center", color: "#a89878", marginTop: 4 }}>
              maintien dans BBC : {Math.max(0, Math.ceil((HOLD_MS - inZone) / 1000))} s
            </div>
          </>
        ) : (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#e8eef5", margin: "0 0 8px", fontStyle: "italic", textAlign: "center" }}>
                « … Les sanglots longs des violons de l'automne bercent mon cœur d'une langueur monotone. »
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#c8d4e2", margin: 0 }}>
                Marthe blêmit — puis sourit. Ce vers de Verlaine, c'est le SIGNAL. Le Débarquement aura lieu dans les 48 heures. Cette nuit, partout en France, les réseaux de résistance sabotent voies ferrées, ponts et lignes téléphoniques. Le 6 juin à l'aube, 156 000 soldats alliés touchent la Normandie. Une phrase de poésie, glissée dans la radio ennemie, vient de lancer la libération de l'Europe.
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 13, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Signal reçu — la libération commence !
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
