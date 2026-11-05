import { useState, useRef } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Le télégraphe Morse » — MESSAGE LIBRE
   ------------------------------------------------------------
   Bureau du télégraphe (~1849). Jessie a trouve un filon d'OR et
   veut prevenir sa famille. Le joueur voit l'ALPHABET Morse complet
   sur le cote et compose lui-meme les lettres au manipulateur (appui
   bref = point, appui long = trait). Un bouton "lettre suivante"
   valide la lettre en cours ; "envoyer" transmet le message.
   Le but : trouver le message LE PLUS COURT (= "OR").
   ============================================================ */

const ALPHABET = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
};

let AC = null;
function beep(long) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = "square"; o.frequency.value = 620;
    o.connect(g); g.connect(AC.destination);
    const t = AC.currentTime, d = long ? 0.26 : 0.09;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
    g.gain.setValueAtTime(0.16, t + d);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.03);
    o.start(t); o.stop(t + d + 0.05);
  } catch { /* audio indisponible */ }
}

const decode = (code) => Object.keys(ALPHABET).find((k) => ALPHABET[k] === code) || null;
const ACCEPTED = ["OR"]; // le message le plus court pour "de l'or"

export function MorseGame({ onClose, onWin }) {
  const [current, setCurrent] = useState("");   // symboles de la lettre en cours
  const [letters, setLetters] = useState([]);   // lettres déjà validées
  const [press, setPress] = useState(false);
  const [flash, setFlash] = useState(null);
  const [won, setWon] = useState(false);
  useWinOnce(won, onWin);
  const downAt = useRef(0);


  const addSym = (sym) => {
    if (won) return;
    beep(sym === "-");
    setCurrent((c) => (c + sym).slice(0, 6));
    setFlash(null);
  };

  const validateLetter = () => {
    if (!current) return;
    const L = decode(current);
    if (!L) {
      setFlash(`« ${current} » ne correspond a aucune lettre — verifie sur le tableau.`);
      setCurrent("");
      return;
    }
    setLetters((ls) => [...ls, L]);
    setCurrent("");
    setFlash(null);
  };

  const backspace = () => {
    if (current) setCurrent((c) => c.slice(0, -1));
    else if (letters.length) setLetters((ls) => ls.slice(0, -1));
    setFlash(null);
  };

  const envoyer = () => {
    const msg = letters.join("") + (current ? (decode(current) || "?") : "");
    if (!msg) { setFlash("Rien a envoyer !"); return; }
    if (ACCEPTED.includes(msg.toUpperCase())) {
      setTimeout(() => setWon(true), 400);
    } else if (msg.length > 2) {
      setFlash(`Ton message « ${msg} » fait ${msg.length} lettres. Chaque bip coute cher au telegraphe — trouve le mot le PLUS COURT possible pour dire que tu as trouve de l'or.`);
    } else {
      setFlash(`« ${msg} » ne dit pas la bonne nouvelle. Cherche le mot le plus court qui veut dire « de l'or ».`);
    }
  };

  const keyDown = () => { if (won) return; setPress(true); downAt.current = Date.now(); };
  const keyUp = () => { if (won || !press) return; setPress(false); addSym(Date.now() - downAt.current >= 250 ? "-" : "."); };

  const composed = letters.join("") + (current ? "•" : "");

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#17110a", border: "2px solid #c8963e66", borderRadius: 18, padding: 24, maxWidth: 860, width: "100%", maxHeight: "94vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", color: "#efe6d2", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 14.5, letterSpacing: 2, color: "#e0a848" }}>📟 TELEGRAPHE DU FAR WEST · POUR NEW YORK</div>
        <h2 style={{ textAlign: "center", margin: "8px 0 6px", color: "#ffd166", fontSize: 26 }}>Prévenir la famille — vite !</h2>
        <p style={{ textAlign: "center", fontSize: 17, color: "#d8c9a8", margin: "0 0 16px", lineHeight: 1.5 }}>
          Chaque bip coûte cher au télégraphe. <strong>Trouve le mot LE PLUS COURT</strong> pour dire à ta famille que tu as trouvé de l'or. Tape-le en Morse (appui bref = point ·, appui long = trait —), valide chaque lettre, puis envoie.
        </p>

        {!won ? (
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
            {/* ALPHABET MORSE affiche a gauche */}
            <div style={{ background: "#0e0a06", border: "1px solid #4a3a1e", borderRadius: 10, padding: "14px 12px", maxHeight: 460, overflowY: "auto" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, letterSpacing: 1, color: "#c8963e", textAlign: "center", marginBottom: 10 }}>ALPHABET MORSE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px", fontFamily: "ui-monospace,monospace", fontSize: 16 }}>
                {Object.entries(ALPHABET).map(([L, code]) => (
                  <div key={L} style={{ display: "flex", justifyContent: "space-between", padding: "2px 6px", color: "#e8d8a8" }}>
                    <span style={{ fontWeight: 700, color: "#ffd166" }}>{L}</span>
                    <span style={{ color: "#c8b088" }}>{code}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* zone de composition + manipulateur */}
            <div>
              {/* le message compose */}
              <div style={{ background: "#241a10", border: "1px solid #6a4a20", borderRadius: 10, padding: "14px 18px", marginBottom: 10, minHeight: 80 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 14.5, color: "#8a7c60", marginBottom: 6 }}>message :</div>
                <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 34, fontWeight: 800, color: "#ffd166", minHeight: 42, letterSpacing: 6 }}>
                  {composed || <span style={{ color: "#5a4a2a", fontSize: 17, fontWeight: 400, letterSpacing: 0 }}>(rien encore)</span>}
                </div>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 18, color: "#c8963e", minHeight: 22, marginTop: 4 }}>
                  {current || <span style={{ color: "#5a4a2a" }}>—</span>}
                  {current && <span style={{ color: "#8a7c60", fontSize: 15.5, marginLeft: 10 }}>{decode(current) ? `(${decode(current)})` : "(?)"}</span>}
                </div>
              </div>

              <p style={{ minHeight: 40, textAlign: "center", color: "#e0a848", fontSize: 16, fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.4 }}>{flash}</p>

              {/* manipulateur */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <svg viewBox="0 0 200 90" style={{ width: 240, height: 108, cursor: "pointer", userSelect: "none" }}
                  onPointerDown={keyDown} onPointerUp={keyUp} onPointerLeave={() => press && keyUp()}>
                  <rect x="20" y="62" width="160" height="16" rx="4" fill="#3a2a1a" />
                  <rect x="30" y="52" width="24" height="12" rx="2" fill="#7a5a2a" />
                  <g transform={`translate(120,${press ? 50 : 44}) rotate(${press ? 4 : 0})`} style={{ transition: "transform .05s" }}>
                    <rect x="-84" y="-5" width="104" height="10" rx="5" fill="#b8b0a0" stroke="#8a8272" strokeWidth="1.5" />
                    <circle cx="18" cy="0" r="12" fill={press ? "#e0a848" : "#c8963e"} stroke="#8a5a1e" strokeWidth="2" />
                    <circle cx="-70" cy="0" r="4" fill="#5a4a3a" />
                  </g>
                  <circle cx="150" cy="62" r="4" fill={press ? "#ffe08a" : "#5a4a3a"} style={{ filter: press ? "drop-shadow(0 0 6px #ffe08a)" : "none" }} />
                </svg>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
                <button onClick={() => addSym(".")} style={btn("#ffd166")}>·<span style={{ fontSize: 13.5, marginLeft: 6, fontFamily: "ui-monospace,monospace" }}>point</span></button>
                <button onClick={() => addSym("-")} style={btn("#ffd166")}>—<span style={{ fontSize: 13.5, marginLeft: 6, fontFamily: "ui-monospace,monospace" }}>trait</span></button>
                <button onClick={backspace} style={btn("#c8963e")}>⌫</button>
                <button onClick={validateLetter} disabled={!current} style={{ ...btn("#7fe0a8"), opacity: current ? 1 : 0.4 }}>lettre suivante</button>
              </div>

              <button onClick={envoyer}
                style={{ width: "100%", background: "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 18, fontFamily: "ui-monospace,monospace", letterSpacing: 3 }}>
                ENVOYER LE MESSAGE
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « — — — · — · — bip ! bip ! — À New York, l'aiguille du récepteur a tremblé exactement dans le même ordre : O… R… <strong>OR</strong>. Deux lettres seulement, et pourtant sa famille comprendra tout : James a trouvé le filon. Le message a traversé le pays en une SECONDE — là où une diligence mettait des semaines. Voilà la magie de l'électricité et d'un CODE partagé. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Message « OR » transmis a New York !
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

const btn = (color) => ({
  minWidth: 78, height: 54, borderRadius: 10, cursor: "pointer",
  border: `2px solid #8a7c60`, background: "#241c12", color,
  fontSize: 24, fontWeight: 800, fontFamily: "'Cinzel',Georgia,serif",
  padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center",
});
