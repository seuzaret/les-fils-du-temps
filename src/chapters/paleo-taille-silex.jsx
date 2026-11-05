import { useEffect, useRef, useState } from 'react';

/* ============================================================
   MINI-JEU : « Tailler un silex » (atelier, Paléolithique)
   ------------------------------------------------------------
   Un silex brut de silex sur le rocher. Le percuteur en bois de cerf
   oscille au-dessus. Il faut cliquer AU MOMENT où le percuteur
   est PILE au bon angle (repère vert) — trop tôt/tard, l'éclat
   part de travers. 5 bonnes frappes en 10 essais → silex taillé.
   ============================================================ */

const GOAL = 5;
const MAX_TRIES = 10;
const CYCLE_MS = 1400; // temps pour un aller-retour du percuteur

/* Petit son de frappe pierre-contre-pierre */
let AC = null;
function playHit(good) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t = AC.currentTime;
    if (good) {
      // clic sec et net
      const buf = AC.createBuffer(1, AC.sampleRate * 0.12, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 500);
      const src = AC.createBufferSource(); src.buffer = buf;
      const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 3;
      const g = AC.createGain(); g.gain.value = 0.22;
      src.connect(bp); bp.connect(g); g.connect(AC.destination);
      src.start(t); src.stop(t + 0.15);
    } else {
      // clac mou grave = raté
      const buf = AC.createBuffer(1, AC.sampleRate * 0.18, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 900);
      const src = AC.createBufferSource(); src.buffer = buf;
      const bp = AC.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 500;
      const g = AC.createGain(); g.gain.value = 0.18;
      src.connect(bp); bp.connect(g); g.connect(AC.destination);
      src.start(t); src.stop(t + 0.2);
    }
  } catch {}
}

export function TailleSilexGame({ onClose, onWin, onFail }) {
  const [phase, setPhase] = useState('play'); // play → won | fail
  const failedNotifiedRef = useRef(false);
  const wonNotifiedRef = useRef(false);
  const [good, setGood] = useState(0);
  const [tries, setTries] = useState(0);
  const [feedback, setFeedback] = useState(null); // {ok, key}
  const [angle, setAngle] = useState(0);       // -1..+1, sinus
  const t0 = useRef(performance.now());
  const raf = useRef(null);

  useEffect(() => {
    if (phase !== 'play') return;
    const tick = (t) => {
      const el = t - t0.current;
      setAngle(Math.sin((el / CYCLE_MS) * Math.PI * 2));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'won' && !wonNotifiedRef.current) {
      wonNotifiedRef.current = true;
      onWin?.();
    }
  }, [phase, onWin]);

  const strike = () => {
    if (phase !== 'play' || tries >= MAX_TRIES) return;
    /* on considère « bien angle » quand |angle| < 0.18 (percuteur pile en haut,
       cycle passant par 0 vers le bas) */
    const isGood = Math.abs(angle) < 0.2;
    setTries((n) => n + 1);
    setFeedback({ ok: isGood, key: Date.now() });
    playHit(isGood);
    if (isGood) {
      setGood((g) => {
        const nn = g + 1;
        if (nn >= GOAL) setTimeout(() => setPhase('won'), 700);
        return nn;
      });
    }
    setTimeout(() => setFeedback((f) => (f && f.key ? null : f)), 400);
  };

  const failed = tries >= MAX_TRIES && good < GOAL && phase === 'play';
  /* raté = silex CASSÉ : on prévient le parent une seule fois pour qu'il
     retire le silex brut du sac (pas de « recommencer », c'est perdu). */
  useEffect(() => {
    if (failed && !failedNotifiedRef.current) {
      failedNotifiedRef.current = true;
      onFail?.();
    }
  }, [failed, onFail]);

  /* la position visuelle du percuteur en degrés */
  const percAngle = -35 * angle;
  const zoneOk = Math.abs(angle) < 0.2;

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,4,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 70, backdropFilter: 'blur(3px)' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: '#1a140a', border: '2px solid #8a5828', borderRadius: 16, padding: 20, maxWidth: 520, width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 12px 48px rgba(0,0,0,0.7)', color: '#efe6d2', fontFamily: 'Palatino, Georgia, serif' }}>
        <div style={{ textAlign: 'center', fontFamily: 'ui-monospace,monospace', fontSize: 12, letterSpacing: 2, color: '#e0a848' }}>🪨 ATELIER DE SILEX · −18 000</div>
        <h2 style={{ textAlign: 'center', margin: '6px 0 4px', color: '#ffd166', fontSize: 21 }}>Tailler un silex</h2>

        {phase === 'play' && (
          <>
            <p style={{ textAlign: 'center', fontSize: 14.5, color: '#d8c9a8', margin: '0 0 12px' }}>
              Frappe le silex QUAND le percuteur est PILE au-dessus (le repère devient vert). {GOAL} bonnes frappes en {MAX_TRIES} essais.
            </p>

            {/* aire de taille */}
            <svg viewBox="0 0 400 260" style={{ width: '100%', height: 'auto', background: '#0a0806', borderRadius: 8, border: '1px solid #3a2818', marginBottom: 10 }}>
              {/* rocher */}
              <ellipse cx="200" cy="220" rx="140" ry="18" fill="#3a2a18" opacity="0.5" />
              <path d="M80 210 Q120 190 200 188 Q280 190 320 210 L320 226 Q280 232 200 232 Q120 230 80 226 Z" fill="#5a5048" stroke="#1a0e08" strokeWidth="2" />
              {/* silex brut au centre */}
              <ellipse cx="200" cy="200" rx="30" ry="16" fill="#3a3028" stroke="#0a0806" strokeWidth="2" />
              <path d="M180 194 Q200 186 220 196" stroke="#7a6a58" strokeWidth="1.2" fill="none" opacity="0.7" />
              {/* repère au-dessus du silex brut */}
              <circle cx="200" cy="200" r="18" fill="none" stroke={zoneOk ? '#5eff9e' : '#c8a848'} strokeWidth="2" strokeDasharray="4 3" opacity="0.9" />

              {/* PERCUTEUR (bois de cerf) — pivote autour du haut */}
              <g style={{ transformOrigin: '200px 30px', transform: `rotate(${percAngle}deg)` }}>
                {/* manche */}
                <rect x="196" y="20" width="8" height="140" rx="3" fill="#8a6a4a" stroke="#3a2818" strokeWidth="1.2" />
                {/* tête en bois de cerf */}
                <ellipse cx="200" cy="16" rx="16" ry="12" fill="#a88848" stroke="#3a2818" strokeWidth="1.5" />
                <path d="M186 12 l-6 -6 M214 12 l6 -6 M200 4 l0 -8" stroke="#a88848" strokeWidth="3" strokeLinecap="round" />
                {/* main qui tient */}
                <ellipse cx="200" cy="60" rx="14" ry="8" fill="#c8946a" stroke="#5a3818" strokeWidth="1" />
              </g>

              {/* feedback flottant */}
              {feedback && (
                <text x="200" y="150" textAnchor="middle" fontSize="24" fontWeight="800"
                  fill={feedback.ok ? '#5eff9e' : '#e8934a'}
                  style={{ animation: 'silexFB 0.4s ease-out forwards' }}>
                  {feedback.ok ? '✓ CLIC !' : '✗ CLAC…'}
                </text>
              )}
            </svg>

            {/* score + tries */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'ui-monospace,monospace', fontSize: 13.5, marginBottom: 10 }}>
              <span style={{ color: '#7fe0a8' }}>✓ {good} / {GOAL}</span>
              <span style={{ color: tries >= MAX_TRIES - 2 ? '#ff5030' : '#c8b090' }}>essais : {tries} / {MAX_TRIES}</span>
            </div>

            <button onPointerDown={strike}
              style={{ width: '100%', background: '#e0a848', color: '#1a1206', border: 'none', borderRadius: 10, padding: '16px', fontWeight: 800, cursor: 'pointer', fontSize: 17, fontFamily: 'ui-monospace,monospace', letterSpacing: 2 }}>
              🔨 FRAPPER
            </button>

            {failed && (
              <div style={{ marginTop: 10, textAlign: 'center', background: '#2a0e10', border: '1px solid #ff5030', borderRadius: 8, padding: '10px 14px', color: '#ffb0a0', fontSize: 15, lineHeight: 1.5 }}>
                <b>Craac !</b> Le silex a cassé en miettes. Ce sont des choses qui arrivent — les tailleurs préhistoriques ratent aussi (les archéologues retrouvent bien plus d'éclats ratés que d'outils réussis !).
                <div style={{ marginTop: 6, opacity: 0.85 }}>Va ramasser un autre silex brut et réessaie.</div>
                <button onClick={onClose}
                  style={{ display: 'block', margin: '10px auto 0', background: '#8a3a20', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 800, cursor: 'pointer', fontFamily: 'ui-monospace,monospace' }}>
                  FERMER
                </button>
              </div>
            )}
          </>
        )}

        {phase === 'won' && (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: '#0e2010', border: '2px solid #7fe0a8', borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 34 }}>🔪</div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: '#7fe0a8', margin: '6px 0' }}>Silex taillé net !</div>
            </div>
            <div style={{ background: '#0e1420', border: '1px solid #2a3648', borderRadius: 12, padding: '14px 16px', marginTop: 10 }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: '#e8eef5', margin: 0 }}>
                « Bien vu ! Ough vient de te transmettre un savoir-faire vieux de plus de 2 millions d'années — la TAILLE DE PIERRE. Chaque coup de percuteur détache un éclat au bord tranchant comme un rasoir. Sans écriture, cette technique se transmet DE LA MAIN À LA MAIN, du maître à l'élève, par observation et répétition. C'est déjà une forme de communication : un message que le geste imprime dans les doigts. » — MARTINE
              </p>
            </div>
            <button onClick={onClose}
              style={{ marginTop: 10, width: '100%', background: '#e0a848', color: '#1a1206', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 800, cursor: 'pointer', fontSize: 16, fontFamily: 'ui-monospace,monospace', letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}

        <style>{`@keyframes silexFB { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }`}</style>
      </div>
    </div>
  );
}
