import { useState, useEffect, useRef } from 'react';

/* ============================================================
   MINI-JEU : « Débuguer l'ENIAC » (Philadelphie, 1946)
   ------------------------------------------------------------
   L'ENIAC tombe en panne toutes les 2 minutes : tube à vide
   grillé, ou insecte coincé dans un relais. Le joueur doit
   cliquer sur les problèmes qui apparaissent sur les panneaux
   avant que la machine ne surchauffe.
   Objectif : 12 réparations en 45 secondes.
   Leçon : le mot « bug » (insecte en anglais) vient de LÀ —
   Grace Hopper trouve une VRAIE mite coincée dans un relais
   du Harvard Mark II le 9 septembre 1947.
   ============================================================ */

const ROWS = 5;
const COLS = 8;
const TUBES = ROWS * COLS;
const GOAL = 12;         // nb de fixes pour gagner
const DURATION = 45;     // secondes

/* Types d'incidents */
const TYPES = ['bug', 'tube'];

/* Petit son de clic (crack de tube ou écrase-bug) */
let AC = null;
function playFixSound(type) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t = AC.currentTime;
    if (type === 'bug') {
      // crunch bref (bruit blanc court + basse fréquence)
      const buf = AC.createBuffer(1, AC.sampleRate * 0.12, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.7;
      const src = AC.createBufferSource(); src.buffer = buf;
      const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 220; bp.Q.value = 2;
      const g = AC.createGain(); g.gain.value = 0.18;
      src.connect(bp); bp.connect(g); g.connect(AC.destination);
      src.start(t); src.stop(t + 0.14);
    } else {
      // ping cristallin du tube neuf
      const o = AC.createOscillator(); o.type = 'sine'; o.frequency.value = 1200;
      o.frequency.exponentialRampToValueAtTime(2400, t + 0.15);
      const g = AC.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g); g.connect(AC.destination);
      o.start(t); o.stop(t + 0.22);
    }
  } catch { /* pas d'audio */ }
}

export function EniacDebugGame({ onClose, onWin }) {
  const [issues, setIssues] = useState([]); // [{id, tubeIdx, type}]
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [phase, setPhase] = useState('play'); // play → won → (retry)
  const nextId = useRef(0);

  /* boucle : spawn d'incidents + timer */
  useEffect(() => {
    if (phase !== 'play') return;
    // spawn initial : 3 incidents pour amorcer
    const init = () => {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push({ id: nextId.current++, tubeIdx: Math.floor(Math.random() * TUBES), type: TYPES[Math.floor(Math.random() * 2)] });
      }
      setIssues(arr);
    };
    init();
    // spawn régulier toutes ~1.2s tant qu'il reste peu d'incidents à l'écran
    const spawnTimer = setInterval(() => {
      setIssues((cur) => {
        if (cur.length >= 6) return cur; // cap
        const type = TYPES[Math.floor(Math.random() * 2)];
        return [...cur, { id: nextId.current++, tubeIdx: Math.floor(Math.random() * TUBES), type }];
      });
    }, 1200);
    // timer chrono
    const chrono = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(chrono); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { clearInterval(spawnTimer); clearInterval(chrono); };
  }, [phase]);

  /* victoire */
  useEffect(() => {
    if (score >= GOAL && phase === 'play') {
      setPhase('won');
      setTimeout(() => onWin?.(), 900);
    }
  }, [score, phase, onWin]);

  const clickIssue = (id, type) => {
    setIssues((cur) => cur.filter((x) => x.id !== id));
    setScore((s) => s + 1);
    playFixSound(type);
  };

  const restart = () => {
    setScore(0); setTimeLeft(DURATION); setIssues([]); setPhase('play');
  };

  const timeOut = timeLeft === 0 && phase === 'play';

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,14,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 70, backdropFilter: 'blur(3px)' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: '#17110a', border: '2px solid #c8963e66', borderRadius: 18, padding: 20, maxWidth: 640, width: '100%', maxHeight: '94vh', overflowY: 'auto', boxShadow: '0 12px 48px rgba(0,0,0,0.6)', color: '#efe6d2', fontFamily: 'Palatino, Georgia, serif' }}>
        <div style={{ textAlign: 'center', fontFamily: 'ui-monospace,monospace', fontSize: 12, letterSpacing: 2, color: '#e0a848' }}>🐛 ENIAC · PHILADELPHIE · 1946</div>
        <h2 style={{ textAlign: 'center', margin: '6px 0 4px', color: '#ffd166', fontSize: 21 }}>Débugue la machine !</h2>

        {phase === 'play' && (
          <>
            <p style={{ textAlign: 'center', fontSize: 14.5, color: '#d8c9a8', margin: '0 0 12px' }}>
              Clique vite sur les <strong>🐛 insectes</strong> et les <strong>tubes grillés</strong> ! Objectif : <b>{GOAL} réparations</b> avant la fin du chrono.
            </p>

            {/* barre chrono + score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontFamily: 'ui-monospace,monospace', fontSize: 13.5 }}>
              <span style={{ color: '#7fe0a8' }}>✓ {score} / {GOAL}</span>
              <span style={{ color: timeLeft < 10 ? '#ff5030' : '#c8b090' }}>⏱ {timeLeft}s</span>
            </div>
            <div style={{ background: '#1a140a', border: '1px solid #5a4028', borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${(timeLeft / DURATION) * 100}%`, height: '100%', background: timeLeft < 10 ? '#ff5030' : '#7fe0a8', transition: 'width 1s linear' }} />
            </div>

            {/* GRILLE ENIAC : rangées de tubes */}
            <div style={{ background: '#0a0806', border: '2px solid #3a2818', borderRadius: 8, padding: 8, position: 'relative', minHeight: 260 }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4 }}>
                {Array.from({ length: TUBES }).map((_, idx) => {
                  const issue = issues.find((x) => x.tubeIdx === idx);
                  return (
                    <div key={idx} style={{ position: 'relative', aspectRatio: '1 / 1.4', background: '#1a1408', border: '1px solid #3a2818', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* tube à vide qui brille (fond ambre) */}
                      {(!issue || issue.type === 'bug') && (
                        <div style={{ width: '70%', height: '85%', background: 'radial-gradient(ellipse at 50% 40%, #ffcf78 0%, #ff8028 70%, #6a2810 100%)', borderRadius: '30% 30% 20% 20%', boxShadow: 'inset 0 -4px 4px rgba(0,0,0,0.4), 0 0 6px rgba(255,180,80,0.3)' }} />
                      )}
                      {/* tube grillé (noir) */}
                      {issue?.type === 'tube' && (
                        <button onClick={(e) => { e.stopPropagation(); clickIssue(issue.id, 'tube'); }}
                          style={{ position: 'absolute', inset: 2, background: '#1a0a06', border: '2px solid #ff5030', borderRadius: 3, cursor: 'pointer', animation: 'pulse 0.6s ease-in-out infinite', color: '#ff5030', fontSize: 11.5, fontWeight: 800 }}>
                          ✗
                        </button>
                      )}
                      {/* insecte 🐛 rampant */}
                      {issue?.type === 'bug' && (
                        <button onClick={(e) => { e.stopPropagation(); clickIssue(issue.id, 'bug'); }}
                          style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20, animation: 'bugCrawl 1.2s ease-in-out infinite alternate' }}>
                          🐛
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#7a6a4a', marginTop: 6, fontStyle: 'italic' }}>
              ({issues.length} incident{issues.length > 1 ? 's' : ''} en cours sur l'ENIAC)
            </div>

            {timeOut && (
              <div style={{ marginTop: 12, textAlign: 'center', background: '#2a0e10', border: '1px solid #ff5030', borderRadius: 8, padding: '10px 14px', color: '#ffb0a0' }}>
                ⏱ Temps écoulé — la machine surchauffe ! Recommence.
                <button onClick={restart} style={{ display: 'block', margin: '8px auto 0', background: '#ff5030', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 800, cursor: 'pointer', fontFamily: 'ui-monospace,monospace', letterSpacing: 1 }}>
                  RECOMMENCER
                </button>
              </div>
            )}
          </>
        )}

        {phase === 'won' && (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: '#0e2010', border: '2px solid #7fe0a8', borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: '#7fe0a8', marginBottom: 6 }}>
                ENIAC RÉPARÉ · {score} incidents corrigés
              </div>
            </div>
            <div style={{ background: '#0e1420', border: '1px solid #2a3648', borderRadius: 12, padding: '14px 16px', marginTop: 10 }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: '#e8eef5', margin: 0 }}>
                « Bien vu ! L'ENIAC casse un tube à vide toutes les 2 minutes en moyenne, sur 18 000 — c'est plein temps. Et savais-tu que le mot <b>« bug »</b> (insecte en anglais) désigne les pannes informatiques… parce que c'était LITTÉRALEMENT un insecte à l'origine ? Le 9 septembre 1947, Grace Hopper trouve une VRAIE mite coincée dans un relais du Harvard Mark II. Elle la scotche dans le carnet de bord avec la mention « First actual case of bug being found ». Depuis, tout plantage informatique s'appelle un bug. » — MARTINE
              </p>
            </div>
            <button onClick={onClose}
              style={{ marginTop: 10, width: '100%', background: '#e0a848', color: '#1a1206', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 800, cursor: 'pointer', fontSize: 16, fontFamily: 'ui-monospace,monospace', letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bugCrawl { 0% { transform: translate(-2px, 0) rotate(-8deg); } 100% { transform: translate(2px, 2px) rotate(8deg); } }
      `}</style>
    </div>
  );
}
