import { useState, useEffect, useMemo, useRef } from "react";

/* ============================================================
   MINI-JEU : « Monter le film » (Nickelodeon, NY, mai 1912)
   ------------------------------------------------------------
   Les 6 photogrammes de « Saved from the Titanic » ont été
   mélangés dans le laboratoire du projectionniste. À toi de
   les remettre dans le bon ordre sur la bande — puis le film
   se projette à l'écran. Leçon : le CINÉMA, c'est une SUITE
   d'images fixes ordonnées ; le montage donne le sens du récit.
   ============================================================ */

/* Les 6 photogrammes de l'histoire, dans l'ordre historique.
   Chaque case dessine une petite scène en SVG (viewBox 100x70). */
const FRAMES = [
  { id: "depart", legend: "Le paquebot lève l'ancre", short: "Le départ",
    draw: (
      <>
        <rect width="100" height="42" fill="#2a3648" />
        <rect y="42" width="100" height="28" fill="#1a2438" />
        <circle cx="80" cy="14" r="6" fill="#e8d8b0" opacity="0.6" />
        {/* le paquebot */}
        <path d="M18 46 Q50 50 82 46 L76 54 Q50 58 24 54 Z" fill="#0a0604" />
        <rect x="26" y="38" width="48" height="8" fill="#2a1608" />
        {[30, 40, 50, 60].map((x, i) => <rect key={i} x={x} y="30" width="4" height="10" fill="#3a1c0a" />)}
        {/* fumée */}
        <circle cx="34" cy="26" r="3" fill="#8a8a8a" opacity="0.6" />
        <circle cx="38" cy="22" r="4" fill="#8a8a8a" opacity="0.4" />
      </>
    ) },
  { id: "nuit", legend: "Nuit calme sur l'Atlantique", short: "En mer",
    draw: (
      <>
        <rect width="100" height="42" fill="#0a1428" />
        <rect y="42" width="100" height="28" fill="#050a18" />
        {/* étoiles */}
        {[[20, 10], [40, 6], [60, 14], [78, 8], [88, 20], [12, 22]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.8" fill="#e8d8b0" />
        ))}
        <circle cx="18" cy="16" r="5" fill="#e8d8b0" opacity="0.85" />
        {/* petit paquebot au loin */}
        <path d="M60 48 Q70 50 80 48 L78 52 Q70 54 62 52 Z" fill="#0a0604" />
        <rect x="64" y="44" width="12" height="4" fill="#2a1608" />
        {/* fenêtres éclairées */}
        <circle cx="66" cy="46" r="0.6" fill="#ffd166" />
        <circle cx="70" cy="46" r="0.6" fill="#ffd166" />
        <circle cx="74" cy="46" r="0.6" fill="#ffd166" />
      </>
    ) },
  { id: "iceberg", legend: "Un iceberg surgit droit devant", short: "L'iceberg",
    draw: (
      <>
        <rect width="100" height="42" fill="#0a1428" />
        <rect y="42" width="100" height="28" fill="#050a18" />
        {/* iceberg au premier plan */}
        <path d="M28 60 L40 30 L52 42 L60 25 L72 60 Z" fill="#c8e0f0" />
        <path d="M28 60 L40 30 L52 42 L60 25 L72 60 Z" fill="url(#ig)" opacity="0.5" />
        <defs>
          <linearGradient id="ig" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#3a5878" /></linearGradient>
        </defs>
        {/* petit paquebot au fond */}
        <path d="M8 50 Q14 51 20 50 L19 53 Q14 54 9 53 Z" fill="#0a0604" />
        <rect x="10" y="47" width="8" height="3" fill="#2a1608" />
      </>
    ) },
  { id: "collision", legend: "Le choc contre la glace", short: "Le choc",
    draw: (
      <>
        <rect width="100" height="42" fill="#0a1428" />
        <rect y="42" width="100" height="28" fill="#050a18" />
        {/* iceberg à gauche */}
        <path d="M4 60 L14 32 L26 60 Z" fill="#c8e0f0" />
        {/* paquebot touche */}
        <path d="M22 46 Q54 50 86 46 L80 54 Q54 58 28 54 Z" fill="#0a0604" />
        <rect x="30" y="38" width="48" height="8" fill="#2a1608" />
        {[34, 44, 54, 64].map((x, i) => <rect key={i} x={x} y="30" width="3" height="10" fill="#3a1c0a" />)}
        {/* étincelles / éclats blancs */}
        {[[24, 40], [22, 46], [26, 44], [20, 42], [28, 38]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l3 -2 M${x} ${y} l-3 -1 M${x} ${y} l1 3`} stroke="#ffd166" strokeWidth="0.8" />
        ))}
      </>
    ) },
  { id: "sos", legend: "L'opérateur envoie le SOS", short: "Le SOS",
    draw: (
      <>
        <rect width="100" height="70" fill="#1a1006" />
        {/* cabine TSF */}
        <rect x="10" y="20" width="80" height="46" fill="#2a1608" stroke="#5a4028" />
        {/* opérateur */}
        <circle cx="34" cy="34" r="6" fill="#e8c8a0" />
        <rect x="28" y="40" width="12" height="14" fill="#5a4028" />
        {/* table + manip Morse */}
        <rect x="48" y="42" width="32" height="4" fill="#5a4028" />
        <rect x="54" y="38" width="14" height="4" rx="1" fill="#c8963e" />
        {/* ondes qui partent */}
        {[10, 16, 22].map((r, i) => (
          <path key={i} d={`M62 20 a${r} ${r * 0.5} 0 0 0 ${r * 2} 0`} fill="none" stroke="#ffd166" strokeWidth="1" opacity={0.9 - i * 0.25} />
        ))}
      </>
    ) },
  { id: "canots", legend: "Les canots à la mer", short: "Les canots",
    draw: (
      <>
        <rect width="100" height="42" fill="#0a1428" />
        <rect y="42" width="100" height="28" fill="#050a18" />
        {/* paquebot très incliné à droite */}
        <g transform="translate(60,42) rotate(20)">
          <path d="M-30 0 Q0 5 30 0 L26 8 Q0 12 -26 8 Z" fill="#0a0604" />
          <rect x="-20" y="-8" width="40" height="8" fill="#2a1608" />
        </g>
        {/* 2 canots + rames */}
        <g transform="translate(20,54)">
          <path d="M-8 0 Q0 3 8 0 L6 4 Q0 5 -6 4 Z" fill="#6a4a20" />
          <circle cx="-2" cy="-2" r="1.5" fill="#e8c8a0" />
          <circle cx="2" cy="-2" r="1.5" fill="#e8c8a0" />
          <path d="M-6 -1 l-3 -3 M6 -1 l3 -3" stroke="#3a2c1c" strokeWidth="0.8" />
        </g>
        <g transform="translate(38,60)">
          <path d="M-7 0 Q0 3 7 0 L5 3 Q0 4 -5 3 Z" fill="#6a4a20" />
          <circle cx="0" cy="-2" r="1.5" fill="#e8c8a0" />
        </g>
      </>
    ) },
];

/* Fisher-Yates : mélange stable dans un useMemo. */
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Un photogramme dessiné : cadre + perforations façon pellicule 35mm. */
function Photogramme({ frame, size = 100, highlight = false, wrong = false }) {
  const h = Math.round(size * 0.7);
  return (
    <svg viewBox="0 0 100 90" style={{ width: size, height: Math.round(size * 0.9), display: "block" }}>
      {/* bande grise autour */}
      <rect width="100" height="90" fill="#1a1408" />
      {/* perforations haut/bas */}
      {[8, 24, 40, 56, 72, 88].map((x, i) => (
        <g key={i}><rect x={x - 3} y="2" width="6" height="6" rx="1" fill="#0a0604" /><rect x={x - 3} y="82" width="6" height="6" rx="1" fill="#0a0604" /></g>
      ))}
      {/* image */}
      <svg x="0" y="10" width="100" height="70" viewBox="0 0 100 70">{frame.draw}</svg>
      {/* halo */}
      {(highlight || wrong) && (
        <rect x="1" y="1" width="98" height="88"
          fill="none" stroke={wrong ? "#e8934a" : "#ffd166"} strokeWidth="3"
          style={wrong ? { animation: "shake 0.35s" } : {}} />
      )}
    </svg>
  );
}

export function CineGame({ onClose, onWin }) {
  const [phase, setPhase] = useState("assemble"); // assemble → project → done
  const shuffled = useMemo(() => shuffle(FRAMES), []);
  /* slots : chaque case contient un id de frame ou null. */
  const [slots, setSlots] = useState(() => Array(FRAMES.length).fill(null));
  const [pool, setPool] = useState(() => shuffled.map((f) => f.id));
  const [selected, setSelected] = useState(null); // {from:"pool"|"slot", id, index?}
  const [wrongSlots, setWrongSlots] = useState([]);
  const [message, setMessage] = useState("Assemble les 6 photogrammes dans le bon ordre chronologique.");

  /* Phase projection : défilement image par image, ~500ms par image. */
  const [projFrame, setProjFrame] = useState(0);
  const projRef = useRef(null);
  useEffect(() => {
    if (phase !== "project") return;
    setProjFrame(0);
    const id = setInterval(() => setProjFrame((f) => {
      if (f + 1 >= FRAMES.length) { clearInterval(id); setTimeout(() => setPhase("done"), 700); return f; }
      return f + 1;
    }), 700);
    projRef.current = id;
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => { if (phase === "done") onWin?.(); }, [phase]); // eslint-disable-line

  /* Ramasser un photogramme (depuis la pile OU une case). */
  const pick = (from, id, index) => {
    if (selected?.from === from && selected.id === id && selected.index === index) {
      setSelected(null); return;
    }
    setSelected({ from, id, index });
    setWrongSlots([]);
  };

  /* Déposer dans une case : place, ou permute si occupée. */
  const dropInSlot = (slotIndex) => {
    if (!selected) { pick("slot", slots[slotIndex], slotIndex); return; }
    const next = [...slots];
    const nextPool = [...pool];
    const occupant = next[slotIndex];
    next[slotIndex] = selected.id;
    if (selected.from === "pool") {
      const i = nextPool.indexOf(selected.id);
      if (i >= 0) nextPool.splice(i, 1);
      if (occupant) nextPool.push(occupant);
    } else if (selected.from === "slot") {
      next[selected.index] = occupant; // permutation
    }
    setSlots(next); setPool(nextPool); setSelected(null); setWrongSlots([]);
  };

  /* Renvoyer un photogramme à la pile (clic sur la pile après sélection d'une case). */
  const dropInPool = () => {
    if (!selected || selected.from !== "slot") return;
    const next = [...slots]; next[selected.index] = null;
    setSlots(next); setPool([...pool, selected.id]); setSelected(null);
  };

  const canValidate = slots.every(Boolean);
  const validate = () => {
    const wrongs = slots.map((id, i) => (id !== FRAMES[i].id ? i : -1)).filter((x) => x >= 0);
    if (wrongs.length === 0) { setMessage("Ordre correct ! Le film peut être projeté."); setTimeout(() => setPhase("project"), 500); }
    else { setWrongSlots(wrongs); setMessage(`Non — ${wrongs.length} photogramme(s) mal placé(s). Un événement doit précéder ses conséquences…`); }
  };

  const reset = () => { setSlots(Array(FRAMES.length).fill(null)); setPool(shuffled.map((f) => f.id)); setSelected(null); setWrongSlots([]); setMessage("Recommence — cherche la CHRONOLOGIE."); };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#17110a", border: "2px solid #c8963e66", borderRadius: 18, padding: 20, maxWidth: 780, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e0a848" }}>🎞️ NICKELODEON · 14ᵉ RUE, NY, MAI 1912</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 21 }}>« Saved from the Titanic » — remonte le film</h2>

        {phase === "assemble" && (
          <>
            <p style={{ textAlign: "center", fontSize: 14, color: "#d8c9a8", margin: "0 0 10px" }}>
              Clique un photogramme, puis clique la case où le placer. Clique à nouveau pour permuter.
            </p>

            {/* La BANDE FILM en haut : 6 slots numérotés */}
            <div style={{ background: "#0a0604", border: "2px solid #5a4028", borderRadius: 8, padding: 8, marginBottom: 12, overflowX: "auto" }}>
              <div style={{ display: "flex", gap: 4, justifyContent: "space-between", minWidth: 640 }}>
                {slots.map((id, i) => {
                  const frame = id ? FRAMES.find((f) => f.id === id) : null;
                  const isSelected = selected?.from === "slot" && selected.index === i;
                  const isWrong = wrongSlots.includes(i);
                  return (
                    <button key={i} onClick={() => dropInSlot(i)}
                      style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", position: "relative" }}>
                      <div style={{ position: "absolute", top: -6, left: 4, fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#c8963e", zIndex: 2 }}>{i + 1}</div>
                      {frame ? (
                        <Photogramme frame={frame} size={100} highlight={isSelected} wrong={isWrong} />
                      ) : (
                        <div style={{ width: 100, height: 90, border: "2px dashed #5a4028", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#5a4028", fontFamily: "ui-monospace,monospace", fontSize: 24 }}>?</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: 14, color: wrongSlots.length ? "#e8934a" : "#e0a848", fontStyle: "italic", minHeight: 20, margin: "0 0 8px" }}>{message}</p>

            {/* La PILE en bas : photogrammes en vrac */}
            <div onClick={dropInPool}
              style={{ background: "#1a1006", border: "1px dashed #5a4028", borderRadius: 8, padding: 10, minHeight: 110, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", cursor: selected?.from === "slot" ? "pointer" : "default" }}>
              {pool.length === 0 ? (
                <div style={{ color: "#5a4028", fontStyle: "italic", fontSize: 13.5, alignSelf: "center" }}>— pile vide —</div>
              ) : pool.map((id) => {
                const frame = FRAMES.find((f) => f.id === id);
                const isSelected = selected?.from === "pool" && selected.id === id;
                return (
                  <button key={id} onClick={(e) => { e.stopPropagation(); pick("pool", id); }}
                    style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Photogramme frame={frame} size={88} highlight={isSelected} />
                    <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: isSelected ? "#ffd166" : "#c8963e", letterSpacing: 0.5 }}>{frame.short}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={reset}
                style={{ flex: "0 0 auto", background: "#2a1608", color: "#e0a848", border: "1px solid #5a4028", borderRadius: 10, padding: "12px 16px", fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
                RECOMMENCER
              </button>
              <button onClick={validate} disabled={!canValidate}
                style={{ flex: 1, background: canValidate ? "#e0a848" : "#3a2c1c", color: canValidate ? "#1a1206" : "#7a6a4a", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: canValidate ? "pointer" : "not-allowed", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                PROJETER LE FILM
              </button>
            </div>
          </>
        )}

        {phase === "project" && (
          <>
            <p style={{ textAlign: "center", fontSize: 14.5, color: "#d8c9a8", margin: "0 0 10px" }}>
              La lanterne s'allume, la bobine tourne… l'histoire prend vie image après image.
            </p>
            <div style={{ background: "#0a0604", border: "3px solid #a8801f", borderRadius: 8, padding: 12, textAlign: "center" }}>
              <svg viewBox="0 0 100 70" style={{ width: "100%", maxWidth: 380, height: "auto", background: "#000", filter: "sepia(0.3) contrast(1.1)", animation: "flicker 0.14s steps(2) infinite" }}>
                {FRAMES[projFrame].draw}
              </svg>
              <div style={{ marginTop: 10, background: "#0a0806", padding: "6px 12px", borderRadius: 4, fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 14.5, color: "#e8d8b0" }}>
                {FRAMES[projFrame].legend}
              </div>
              <div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#7a6a4a" }}>
                image {projFrame + 1} / {FRAMES.length}
              </div>
            </div>
          </>
        )}

        {phase === "done" && (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Le 28 décembre 1895, les frères Lumière projettent 10 courts films au Salon Indien du Grand Café, à Paris — 33 spectateurs, 1 franc la place. Le CINÉMA vient de naître : une SUITE de photos à 16 images/seconde, notre œil ne voit pas les coupures. En 1912, quelques semaines après le naufrage du Titanic, le film « Saved from the Titanic » sort avec Dorothy Gibson, VRAIE rescapée — Sean pleure : le cinéma peut RECONSTITUER un événement… mais le MONTAGE (l'ordre des plans) donne le sens du récit. Un même événement, plusieurs récits — c'est ainsi qu'un média façonne notre mémoire. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Sean a vu le film — direction New York, il faut appeler la famille…
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
