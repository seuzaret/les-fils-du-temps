import { useEffect, useState, useRef } from 'react';
import { playMaterialize } from './sfx.js';
import TimeMachine from './TimeMachine.jsx';
import { Avatar } from './Martine.jsx';
import SceneFrame from './SceneFrame.jsx';

/* ============================================================
   INTRO — 6 tableaux INTERACTIFS.
   ============================================================
   1. NUIT PAISIBLE : chambre, radio-réveil, téléphone qui vibre
      après ~3s. Clic tel → suivant.
   2. LE SMS D'AL3X1A : message plein écran expliquant la mission
      et annonçant l'arrivée de MARTINE. Clic → suivant.
   3. DEHORS : MARTINE se matérialise devant chez le joueur.
      Halo + son, puis bouton EMBARQUER apparaît.
   4. COCKPIT : MARTINE avatar t'accueille, bouton GO pour partir.
   5. FLASH : transition temporelle (auto-avance).
   6. ARRIVÉE PRÉHISTOIRE : MARTINE posée proprement, le joueur
      descend, MARTINE explique la quête. Clic sur clan → chapitre 1.
   ============================================================ */

/* Bulle façon BD, hauteur auto + effet machine à écrire. */
function Bubble({ x, y, w = 260, text, from = 'left', color = 'default' }) {
  const lines = Array.isArray(text) ? text : [text];
  const LINE = 18;
  const PAD_TOP = 16;
  const PAD_BOT = 14;
  const h = PAD_TOP + PAD_BOT + lines.length * LINE;
  const top = -h / 2;
  const firstBaseline = top + PAD_TOP + 13;
  const bottom = top + h;
  const fill = color === 'alert' ? '#fff0c8' : '#fff9e8';
  const stroke = color === 'alert' ? '#e0a848' : '#5a4028';
  const textFill = color === 'alert' ? '#3a2010' : '#1a1408';

  const fullText = lines.join('\n');
  const [nShown, setNShown] = useState(0);
  useEffect(() => {
    setNShown(0);
    if (!fullText) return;
    const step = 8;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setNShown(i);
      if (i >= fullText.length) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [fullText]);
  const shownFull = fullText.slice(0, nShown);
  const shownLines = shownFull.split('\n');
  const done = nShown >= fullText.length;

  return (
    <g transform={`translate(${x},${y})`} onClick={() => setNShown(fullText.length)} style={{ cursor: done ? 'default' : 'pointer' }}>
      <rect x={-w/2} y={top} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth="2" />
      <path d={from === 'left'
        ? `M${-w/4} ${bottom} L${-w/4 - 8} ${bottom + 16} L${-w/4 + 12} ${bottom + 2} Z`
        : `M${w/4} ${bottom} L${w/4 + 8} ${bottom + 16} L${w/4 - 12} ${bottom + 2} Z`}
        fill={fill} stroke={stroke} strokeWidth="2" />
      <text x={0} y={firstBaseline} textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="13" fill={textFill}>
        {lines.map((line, i) => {
          const shown = shownLines[i] ?? '';
          const isLast = i === shownLines.length - 1 && !done;
          return (
            <tspan key={i} x={0} dy={i === 0 ? 0 : LINE}>
              {shown}{isLast ? '▮' : ''}
            </tspan>
          );
        })}
      </text>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRANSITION — écran noir plein cadre, une ligne, clic pour avancer
   ═══════════════════════════════════════════════════════════════ */
function Blackout({ text, big = false, onNext }) {
  return (
    <div onClick={onNext}
      style={{
        animation: 'fadeIn 0.6s ease-out',
        width: '100%', height: '100%', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, boxSizing: 'border-box', cursor: 'pointer',
      }}>
      <p style={{
        color: '#e8eef5', textAlign: 'center', margin: 0,
        fontFamily: 'Georgia, serif',
        fontSize: big ? 32 : 20,
        lineHeight: 1.5,
        letterSpacing: big ? 1 : 0,
        maxWidth: 760,
        opacity: 0.95,
      }}>
        {text}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
export default function IntroStory({ onDone }) {
  const [i, setI] = useState(0);
  const next = () => setI((v) => v + 1);
  const SLIDES = [
    <Blackout         key="b0" text="Une nuit paisible de ta vie." onNext={next} />,
    <SlideNight       key="s1a" silent onNext={next} />,
    <Blackout         key="b1" text="Tout à coup un bruit te réveille." onNext={next} />,
    <SlideNight       key="s1b" onNext={next} />,
    <SlideMessage     key="s2" onNext={next} />,
    <Blackout         key="b2" text="Tu sors de chez toi." onNext={next} />,
    <SlideOutside     key="s3" onNext={next} />,
    <Blackout         key="b3" text="Tu rentres prudemment dans le vaisseau…" onNext={next} />,
    <SlideCockpit     key="s4" onNext={next} />,
    <SlideRules       key="s4b" onNext={next} />,
    <SlideMartineReparee key="s4c" onNext={next} />,
    <SlideFlash       key="s5" onNext={next} />,
    <SlideArrival     key="s6" onDone={onDone} />,
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050810', zIndex: 100, display: 'flex', flexDirection: 'column', color: '#efe6d2', fontFamily: 'Palatino, Georgia, serif', overflow: 'hidden' }}>
      <button onClick={onDone}
        title="Sauter l'intro"
        style={{ position: 'absolute', top: 10, right: 14, zIndex: 10, background: 'rgba(20,27,38,0.6)', border: '1px solid rgba(200,212,226,0.25)', color: '#8fa3bd', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'ui-monospace,monospace', letterSpacing: 1, backdropFilter: 'blur(4px)' }}>
        passer ›
      </button>
      <SceneFrame style={{ padding: 12 }}>
        {SLIDES[i]}
      </SceneFrame>
      <style>{`
        @keyframes drift { 0%, 100% { opacity: 0.85; transform: translate(0, 0); } 50% { opacity: 0.4; transform: translate(2px, -3px); } }
        @keyframes flick { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes martineHover {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%      { transform: translate(0, -6px) rotate(0.8deg); }
          50%      { transform: translate(0, 2px) rotate(-0.4deg); }
          75%      { transform: translate(0, -4px) rotate(0.3deg); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S1 — NUIT PAISIBLE (chambre, tel qui vibre après 3s)
   ═══════════════════════════════════════════════════════════════ */
function SlideNight({ onNext, silent = false }) {
  const [vibrating, setVibrating] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    if (silent) return; // chambre d'ouverture : muette, cliquable n'importe où
    try {
      const a = new Audio('assets/sounds/phone-vibrate.wav');
      a.loop = true; a.volume = 0.35; a.preload = 'auto';
      a.load();
      audioRef.current = a;
    } catch { /* pas d'audio */ }
    const t = setTimeout(() => {
      setVibrating(true);
      const a = audioRef.current;
      if (!a) return;
      const tryPlay = (n = 0) => {
        const p = a.play();
        if (p && p.catch) p.catch((err) => {
          if (n < 3) setTimeout(() => tryPlay(n + 1), 200);
          else console.warn('[intro] audio blocked:', err?.message);
        });
      };
      tryPlay();
    }, 3000);
    return () => { clearTimeout(t); try { audioRef.current?.pause(); } catch { /* déjà arrêté */ } };
  }, [silent]);

  return (
    <div
      onClick={silent ? onNext : undefined}
      style={{ animation: 'fadeIn 1s ease-out', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', cursor: silent ? 'pointer' : 'default' }}>
      <svg viewBox="0 0 1200 680" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="s1-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1f30" />
            <stop offset="100%" stopColor="#0a0e18" />
          </linearGradient>
          <linearGradient id="s1-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2818" />
            <stop offset="100%" stopColor="#0e0806" />
          </linearGradient>
          <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a2a" />
            <stop offset="100%" stopColor="#2a3050" />
          </linearGradient>
          <radialGradient id="s1-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8ecd0" stopOpacity="1" />
            <stop offset="100%" stopColor="#f0e4c8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s1-moonlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0e4c8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f0e4c8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s1-phone-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7fb0e0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7fb0e0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s1-nightlight" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffb060" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffb060" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s1-laptop" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#3a80c8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3a80c8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* MUR + SOL */}
        <rect width="1200" height="680" fill="url(#s1-wall)" />
        {/* Papier peint subtil : rayures verticales */}
        {[100, 200, 300, 400, 900, 1000, 1100].map((x, i) => (
          <line key={i} x1={x} y1="0" x2={x} y2="520" stroke="#28303a" strokeWidth="0.8" opacity="0.35" />
        ))}
        <rect y="520" width="1200" height="160" fill="url(#s1-floor)" />
        <path d="M0 520 L1200 520" stroke="#0a0806" strokeWidth="1.5" />
        {/* Plinthe */}
        <rect y="514" width="1200" height="8" fill="#141820" />
        {/* Lattes du plancher en perspective */}
        {[100, 300, 500, 800, 1000].map((x, i) => (
          <path key={i} d={`M${x} 520 L${x + (x - 600) * 0.15} 680`} stroke="#0a0604" strokeWidth="0.8" opacity="0.55" />
        ))}
        {/* Tapis rond au sol */}
        <ellipse cx="600" cy="620" rx="220" ry="42" fill="#5a2820" stroke="#3a1810" strokeWidth="1.5" opacity="0.85" />
        <ellipse cx="600" cy="614" rx="220" ry="42" fill="#8a3820" opacity="0.6" />
        <ellipse cx="600" cy="614" rx="190" ry="34" fill="none" stroke="#c8a848" strokeWidth="1" opacity="0.5" />

        {/* GRANDE FENÊTRE à droite avec lune, ciel étoilé, silhouette de ville */}
        <g>
          <rect x="820" y="80" width="300" height="360" fill="url(#s1-sky)" stroke="#3a2818" strokeWidth="6" />
          {/* Croisillons */}
          <line x1="970" y1="80" x2="970" y2="440" stroke="#3a2818" strokeWidth="4" />
          <line x1="820" y1="260" x2="1120" y2="260" stroke="#3a2818" strokeWidth="4" />
          {/* Étoiles */}
          {[[860, 120], [920, 140], [1010, 100], [1080, 160], [960, 200], [890, 210], [1050, 230], [900, 300], [1020, 340], [860, 380], [1090, 400]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#e8eef5" opacity={0.55 + (i % 4) * 0.12} />
          ))}
          {/* Lune */}
          <circle cx="1050" cy="150" r="34" fill="url(#s1-moon)" />
          <circle cx="1050" cy="150" r="28" fill="#f8ecd0" />
          <circle cx="1060" cy="145" r="4" fill="#c8bda0" opacity="0.65" />
          <circle cx="1042" cy="160" r="3" fill="#c8bda0" opacity="0.55" />
          {/* Silhouette de ville au fond de la fenêtre */}
          <path d="M820 400 L820 380 L850 380 L850 360 L890 360 L890 400 L920 400 L920 370 L960 370 L960 400 L1000 400 L1000 350 L1030 350 L1030 400 L1060 400 L1060 380 L1090 380 L1090 400 L1120 400 L1120 400 Z" fill="#0a0e18" />
          {/* 2-3 fenêtres allumées lointaines */}
          <rect x="900" y="380" width="3" height="4" fill="#ffd870" opacity="0.85" />
          <rect x="1010" y="365" width="3" height="4" fill="#e0a848" opacity="0.75" />
        </g>
        {/* Rideaux */}
        <path d="M810 70 L810 460 Q820 100 830 90 Q835 250 830 460 Z" fill="#5a3820" stroke="#1a0e08" strokeWidth="1.2" opacity="0.9" />
        <path d="M1130 70 L1130 460 Q1120 100 1110 90 Q1105 250 1110 460 Z" fill="#5a3820" stroke="#1a0e08" strokeWidth="1.2" opacity="0.9" />
        <path d="M810 70 L1130 70 L1130 90 L810 90 Z" fill="#3a2010" />
        {/* Traînée de lune dans la chambre */}
        <ellipse cx="820" cy="530" rx="180" ry="60" fill="url(#s1-moonlight)" transform="rotate(-18 820 530)" />

        {/* ÉTAGÈRE MURALE en haut à gauche avec livres, plante, cadre, globe */}
        <g transform="translate(80,80)">
          {/* Planche */}
          <rect x="0" y="0" width="380" height="10" fill="#5a3818" stroke="#1a0e08" strokeWidth="1.5" />
          {/* Livres colorés inclinés */}
          {[["#8a3820", 60, 0], ["#3a80c8", 54, 0], ["#c8a848", 50, 0], ["#5eff9e", 58, 0], ["#8a5030", 62, -8], ["#a04ce8", 54, 0]].map(([c, h, r], i) => (
            <g key={i} transform={`translate(${16 + i * 22},${-h})`}>
              <rect x="0" y="0" width="16" height={h} fill={c} stroke="#0a0806" strokeWidth="0.5" transform={r ? `rotate(${r} 8 ${h})` : ''} />
              <line x1="0" y1={8} x2="16" y2="8" stroke="#0a0806" strokeWidth="0.4" opacity="0.5" transform={r ? `rotate(${r} 8 ${h})` : ''} />
            </g>
          ))}
          {/* Cadre photo */}
          <g transform="translate(180,-40)">
            <rect x="0" y="0" width="46" height="36" fill="#c8a848" stroke="#3a2010" strokeWidth="1.2" />
            <rect x="3" y="3" width="40" height="30" fill="#8a3820" />
            {/* deux silhouettes floues (photo de famille) */}
            <circle cx="15" cy="20" r="6" fill="#e0a878" />
            <circle cx="30" cy="22" r="5" fill="#e0a878" />
          </g>
          {/* Plante en pot */}
          <g transform="translate(250,-52)">
            <rect x="0" y="30" width="26" height="22" fill="#5a3018" stroke="#1a0e08" strokeWidth="0.8" />
            <path d="M4 30 Q10 -10 14 20 M12 30 Q16 -14 22 8 M0 30 Q-6 -6 8 24" stroke="#3a6828" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          {/* Petit globe/planète décoratif */}
          <g transform="translate(310,-30)">
            <circle r="18" fill="#3a80c8" stroke="#1a2028" strokeWidth="1" />
            <path d="M-14 -4 Q-4 -8 8 -2 M-10 4 Q4 2 14 6 M-12 -10 Q0 -14 12 -8" stroke="#5eff9e" strokeWidth="1.4" fill="none" opacity="0.75" />
            <path d="M-18 -6 L-8 -4 M-6 8 L6 10" stroke="#1a2028" strokeWidth="0.6" opacity="0.5" />
          </g>
          {/* Guirlande de LED (string lights) qui pend depuis l'étagère */}
          <path d="M-40 10 Q80 60 200 30 Q320 60 420 20" stroke="#5a4028" strokeWidth="0.8" fill="none" />
          {["#ffd870", "#7fb0e0", "#c88060", "#5eff9e", "#e0a848", "#a04ce8", "#ffd870", "#7fb0e0"].map((c, i) => (
            <circle key={i} cx={-30 + i * 60} cy={20 + (i % 2 === 0 ? 14 : 22)} r="3.5" fill={c} opacity="0.9">
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.6 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* POSTER MURAL "SPACE" au-dessus du lit */}
        <g transform="translate(120,180)">
          <rect x="0" y="0" width="140" height="180" fill="#0a0e28" stroke="#c8a848" strokeWidth="3" />
          <rect x="6" y="6" width="128" height="168" fill="#0a0620" />
          {/* Fusée stylisée */}
          <path d="M70 30 L82 100 L58 100 Z" fill="#e8dfc8" stroke="#3a2010" strokeWidth="1" />
          <rect x="60" y="100" width="20" height="20" fill="#8a1010" />
          <circle cx="70" cy="60" r="6" fill="#3a80c8" />
          <path d="M58 120 L46 140 L58 130 Z M82 120 L94 140 L82 130 Z" fill="#e83820" />
          {/* Étoiles autour */}
          {[[20, 40], [110, 40], [30, 90], [110, 90], [30, 150], [110, 160]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.4 : 1} fill="#ffd870" opacity="0.9" />
          ))}
          {/* Texte poster */}
          <text x="70" y="164" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="900" fill="#c8a848" letterSpacing="3">ESPACE</text>
        </g>

        {/* POSTER MURAL 2 : musique/silhouette */}
        <g transform="translate(280,220)">
          <rect x="0" y="0" width="110" height="140" fill="#3a1030" stroke="#c88060" strokeWidth="3" />
          <rect x="6" y="6" width="98" height="128" fill="#2a0820" />
          <circle cx="55" cy="55" r="20" fill="#c88060" opacity="0.7" />
          <path d="M45 90 Q55 100 65 90 L60 130 L50 130 Z" fill="#c88060" opacity="0.7" />
          <text x="55" y="122" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fontWeight="800" fill="#e8dfc8" fontStyle="italic">CONCERT</text>
        </g>

        {/* LIT à gauche-centre, plus grand */}
        <g>
          {/* Tête de lit en bois */}
          <rect x="90" y="380" width="30" height="140" fill="#5a3818" stroke="#1a0e08" strokeWidth="2" />
          <rect x="94" y="384" width="22" height="132" fill="#8a5030" opacity="0.6" />
          {/* Base du lit */}
          <rect x="90" y="500" width="480" height="30" fill="#5a3818" stroke="#1a0e08" strokeWidth="2" />
          {/* Matelas + couette */}
          <rect x="120" y="430" width="450" height="70" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
          {/* Motif de la couette (rayures ou losanges) */}
          <path d="M120 445 L570 445 M120 460 L570 460 M120 475 L570 475 M120 490 L570 490" stroke="#c88060" strokeWidth="1.5" opacity="0.55" />
          <path d="M180 430 L180 500 M250 430 L250 500 M320 430 L320 500 M390 430 L390 500 M460 430 L460 500 M530 430 L530 500" stroke="#a04ce8" strokeWidth="0.8" opacity="0.4" />
          {/* Oreillers */}
          <rect x="135" y="400" width="120" height="40" rx="8" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.2" />
          <rect x="140" y="404" width="110" height="32" rx="6" fill="#f4ecd0" />
          <rect x="270" y="410" width="90" height="34" rx="6" fill="#c8a888" stroke="#3a2818" strokeWidth="1" />
          {/* Une petite bosse qui suggère quelqu'un qui dort sous la couette */}
          <path d="M300 440 Q380 425 460 440 L460 500 L300 500 Z" fill="#c8a888" opacity="0.7" />
          {/* Pieds du lit */}
          <rect x="94" y="530" width="14" height="26" fill="#1a0e08" />
          <rect x="556" y="530" width="14" height="26" fill="#1a0e08" />
        </g>

        {/* TABLE DE NUIT à droite du lit avec réveil, phone, veilleuse */}
        <g>
          {/* Table de nuit */}
          <rect x="600" y="440" width="180" height="120" fill="#5a3818" stroke="#1a0e08" strokeWidth="2" />
          <rect x="606" y="446" width="168" height="108" fill="#8a5030" opacity="0.55" />
          {/* Tiroir */}
          <rect x="616" y="510" width="148" height="30" fill="#3a2010" stroke="#1a0e08" strokeWidth="1" />
          <circle cx="690" cy="525" r="3" fill="#c8a848" />
          {/* Pieds */}
          <rect x="606" y="558" width="14" height="30" fill="#1a0e08" />
          <rect x="760" y="558" width="14" height="30" fill="#1a0e08" />
          {/* Halo veilleuse chaude sur toute la table */}
          <ellipse cx="690" cy="450" rx="200" ry="60" fill="url(#s1-nightlight)" />
          {/* Réveil digital à gauche de la table */}
          <g transform="translate(636,410)">
            <rect x="-32" y="0" width="64" height="30" rx="4" fill="#1a1408" stroke="#3a2818" strokeWidth="1.2" />
            <rect x="-28" y="4" width="56" height="20" fill="#0a0806" />
            <text x="0" y="19" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="16" fontWeight="900" fill="#ff3020" style={{ letterSpacing: 3, filter: 'drop-shadow(0 0 4px #ff3020)' }}>03:14</text>
            <circle cx="24" cy="14" r="1.2" fill="#ff3020" />
          </g>
          {/* Petite lampe veilleuse à droite */}
          <g transform="translate(740,406)">
            <rect x="-4" y="6" width="8" height="20" fill="#5a4028" />
            <path d="M-16 6 L16 6 L12 -12 L-12 -12 Z" fill="#c88060" stroke="#3a2010" strokeWidth="1" />
            <circle cx="0" cy="20" r="14" fill="#ffb060" opacity="0.28">
              <animate attributeName="opacity" values="0.2;0.35;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* TÉLÉPHONE sur la table de nuit — position centrée sur la table.
            NOTE : l'animation de vibration est appliquée sur un <g> ENFANT
            sans transform initial, avec un shake local en unités SVG (via
            animateTransform SMIL). Ne PAS mettre un keyframe CSS translate()
            en px sur un g qui a déjà un translate() SVG : les unités px CSS
            et SVG ne s'alignent pas si le SVG est redimensionné et l'élément
            « saute » visuellement. */}
        <g transform="translate(696,470)">
          {vibrating && <circle cx="0" cy="0" r="60" fill="url(#s1-phone-halo)" style={{ animation: 'phoneGlow 0.9s ease-in-out infinite' }} />}
          <g onClick={vibrating ? onNext : undefined} style={{ cursor: vibrating ? 'pointer' : 'default' }}>
            {vibrating && (
              <animateTransform attributeName="transform" type="translate"
                values="0 0; -1 0.5; 0 0; 1 -0.5; 0 0" dur="0.12s" repeatCount="indefinite" />
            )}
            <rect x="-20" y="-30" width="40" height="60" rx="6" fill="#1a1a1a" stroke="#5a5a5a" strokeWidth="1.4" />
            <rect x="-17" y="-27" width="34" height="52" rx="3" fill={vibrating ? '#3a80c8' : '#0a0a0a'} />
            {vibrating && (<>
              <circle cx="0" cy="-10" r="6" fill="#e83820" />
              <text x="0" y="-6.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">1</text>
              {[20, 32, 44].map((r, i) => (
                <circle key={i} r={r} fill="none" stroke="#7fb0e0" strokeWidth="1.6" opacity={0.85 - i * 0.25} style={{ animation: 'phoneGlow 0.9s ease-in-out infinite' }} />
              ))}
            </>)}
          </g>
        </g>

        {/* BUREAU au fond gauche */}
        <g transform="translate(410,300)">
          {/* Plateau bureau */}
          <rect x="0" y="130" width="240" height="16" fill="#5a3818" stroke="#1a0e08" strokeWidth="1.5" />
          {/* Pieds */}
          <rect x="10" y="146" width="12" height="80" fill="#3a2010" />
          <rect x="218" y="146" width="12" height="80" fill="#3a2010" />
          {/* Ordinateur portable ouvert avec léger halo bleu */}
          <g transform="translate(70,90)">
            <ellipse cx="55" cy="80" rx="80" ry="24" fill="url(#s1-laptop)" />
            <path d="M0 40 L110 40 L100 0 L10 0 Z" fill="#28303a" stroke="#0a0e14" strokeWidth="1.2" />
            <path d="M10 4 L100 4 L92 36 L18 36 Z" fill="#141c26" />
            {/* Écran avec quelques lignes de texte */}
            <rect x="20" y="8" width="70" height="24" fill="#0a0806" />
            <line x1="26" y1="14" x2="82" y2="14" stroke="#5eff9e" strokeWidth="0.5" opacity="0.75" />
            <line x1="26" y1="18" x2="70" y2="18" stroke="#5eff9e" strokeWidth="0.5" opacity="0.65" />
            <line x1="26" y1="22" x2="76" y2="22" stroke="#5eff9e" strokeWidth="0.5" opacity="0.55" />
            {/* Base clavier */}
            <path d="M-6 40 L116 40 L110 48 L0 48 Z" fill="#3a4048" stroke="#0a0e14" strokeWidth="1.2" />
          </g>
          {/* Cahier ouvert + stylo */}
          <g transform="translate(0,110)">
            <rect x="0" y="0" width="60" height="20" fill="#e8dfc8" stroke="#5a4028" strokeWidth="0.8" />
            <line x1="30" y1="0" x2="30" y2="20" stroke="#5a4028" strokeWidth="0.5" />
            <line x1="4" y1="8" x2="26" y2="8" stroke="#5a4028" strokeWidth="0.3" />
            <line x1="4" y1="14" x2="22" y2="14" stroke="#5a4028" strokeWidth="0.3" />
            <rect x="32" y="-4" width="30" height="3" fill="#8a1010" transform="rotate(-8 32 -4)" />
          </g>
          {/* Pot à crayons */}
          <g transform="translate(200,100)">
            <rect x="0" y="0" width="20" height="30" fill="#5eff9e" stroke="#1a1a10" strokeWidth="0.8" opacity="0.85" />
            <line x1="6" y1="0" x2="6" y2="-12" stroke="#c8a848" strokeWidth="1.2" />
            <line x1="10" y1="0" x2="10" y2="-16" stroke="#8a3820" strokeWidth="1.2" />
            <line x1="14" y1="0" x2="14" y2="-10" stroke="#3a80c8" strokeWidth="1.2" />
          </g>
          {/* Casque audio suspendu au coin du bureau */}
          <g transform="translate(220,130)">
            <path d="M0 0 Q10 -20 20 0" fill="none" stroke="#1a1a10" strokeWidth="3" />
            <rect x="-4" y="0" width="8" height="14" rx="2" fill="#3a2010" />
            <rect x="16" y="0" width="8" height="14" rx="2" fill="#3a2010" />
          </g>
        </g>

        {/* CHAISE avec pull posé */}
        <g transform="translate(370,470)">
          <rect x="0" y="0" width="30" height="4" fill="#5a3818" />
          <rect x="0" y="0" width="4" height="60" fill="#5a3818" />
          <rect x="0" y="0" width="30" height="30" fill="#3a80c8" opacity="0.85" />
          <path d="M0 8 L28 8 L26 22 L2 22 Z" fill="#3a80c8" />
          <rect x="0" y="30" width="4" height="30" fill="#5a3818" />
          <rect x="26" y="30" width="4" height="30" fill="#5a3818" />
        </g>

        {/* SAC À DOS au sol devant le bureau */}
        <g transform="translate(500,540)">
          <path d="M0 0 Q30 -8 60 0 L58 60 Q30 68 2 60 Z" fill="#8a3820" stroke="#3a1010" strokeWidth="1.5" />
          <rect x="10" y="10" width="40" height="24" fill="#5a2010" opacity="0.7" />
          <circle cx="30" cy="34" r="4" fill="#c8a848" />
          <path d="M8 0 Q10 -20 30 -18 Q50 -20 52 0" stroke="#3a1010" strokeWidth="3" fill="none" />
        </g>

        {/* PORTE à droite (partiellement visible) avec filet de lumière dessous */}
        <g>
          <rect x="1150" y="220" width="50" height="300" fill="#3a2010" stroke="#0a0806" strokeWidth="2" />
          <circle cx="1156" cy="380" r="3" fill="#c8a848" />
          {/* Filet de lumière chaud sous la porte */}
          <rect x="1150" y="518" width="50" height="4" fill="#ffd870" opacity="0.65">
            <animate attributeName="opacity" values="0.5;0.75;0.5" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* PANTOUFLES au sol */}
        <g transform="translate(180,600)">
          <ellipse cx="0" cy="0" rx="24" ry="8" fill="#8a5030" stroke="#3a2010" strokeWidth="0.8" />
          <ellipse cx="0" cy="-3" rx="24" ry="8" fill="#c88060" />
          <ellipse cx="60" cy="0" rx="24" ry="8" fill="#8a5030" stroke="#3a2010" strokeWidth="0.8" />
          <ellipse cx="60" cy="-3" rx="24" ry="8" fill="#c88060" />
        </g>

        {/* PLANTE en pot au sol à gauche */}
        <g transform="translate(40,540)">
          <rect x="-24" y="20" width="48" height="60" fill="#5a3018" stroke="#1a0e08" strokeWidth="1.2" />
          <path d="M-20 20 Q-14 -20 -4 8 M0 20 Q6 -30 16 -4 M14 20 Q20 -14 28 4 M-14 20 Q-30 -4 -16 -14 M8 20 Q22 -22 24 6" stroke="#3a6828" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        <style>{`
          /* phoneShake CSS retiré : le shake est maintenant fait par un animateTransform SMIL local sur le sous-groupe du téléphone (voir plus haut). */
          @keyframes phoneGlow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        `}</style>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S2 — LE SMS D'AL3X1A (téléphone plein cadre)
   ═══════════════════════════════════════════════════════════════ */
function SlideMessage({ onNext }) {
  return (
    <div onClick={onNext} title="Cliquer n'importe où pour continuer"
      style={{ animation: 'fadeIn 0.8s ease-out', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <svg viewBox="0 0 800 500" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs><radialGradient id="s2-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3a80c8" stopOpacity="0.4" /><stop offset="100%" stopColor="#3a80c8" stopOpacity="0" /></radialGradient></defs>
        <rect width="800" height="500" fill="#050810" />
        <circle cx="400" cy="250" r="300" fill="url(#s2-halo)" />
        <g transform="translate(400,250) rotate(-4)" onClick={onNext} style={{ cursor: 'pointer' }}>
          <rect x="-130" y="-220" width="260" height="440" rx="30" fill="#1a1a1a" stroke="#5a5a5a" strokeWidth="3" />
          <rect x="-118" y="-208" width="236" height="416" rx="20" fill="#efeae4" />
          {/* Barre statut */}
          <rect x="-118" y="-208" width="236" height="24" fill="#000" />
          <text x="-100" y="-192" fontFamily="ui-monospace,monospace" fontSize="10" fill="#fff">03:14</text>
          <text x="100" y="-192" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="10" fill="#fff">▮▮▮▮ 39%</text>
          {/* En-tête WhatsApp vert teal */}
          <rect x="-118" y="-184" width="236" height="46" fill="#075e54" />
          <circle cx="-92" cy="-160" r="15" fill="#fff" stroke="#c8e6cf" strokeWidth="1" />
          <text x="-92" y="-155" textAnchor="middle" fontSize="14" fontWeight="800" fill="#075e54">A</text>
          <text x="-70" y="-165" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#fff">Al3x1a</text>
          <text x="-70" y="-149" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8e6cf">● en ligne</text>
          {/* Bulle blanche du message (largeur 216, centrée dans le tel) */}
          <g transform="translate(-108,-124)">
            <rect x="0" y="0" width="216" height="264" rx="8" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5" />
            <text x="108" y="22" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">« Je m'appelle Al3x1a.</text>
            <text x="108" y="38" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">Je viens du futur.</text>
            <text x="108" y="62" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">Ici, une maladie</text>
            <text x="108" y="78" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">efface la mémoire</text>
            <text x="108" y="94" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">de tout le monde.</text>
            <text x="108" y="118" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">Mon père est parti</text>
            <text x="108" y="134" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">dans le temps</text>
            <text x="108" y="150" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">chercher un remède.</text>
            <text x="108" y="166" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">Il n'est jamais rentré.</text>
            <text x="108" y="190" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">MARTINE va se poser</text>
            <text x="108" y="206" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="10.5" fill="#111b21" fontStyle="italic">devant chez toi.</text>
            <text x="108" y="232" textAnchor="middle" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#111b21">Sors. »</text>
            <text x="200" y="252" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8696a0">03:14</text>
          </g>
          <text x="0" y="176" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#8696a0">touche pour ouvrir</text>
          <rect x="-40" y="204" width="80" height="3" rx="1.5" fill="#5a6a80" />
        </g>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S3 — DEHORS : MARTINE SE MATÉRIALISE devant chez le joueur
   ═══════════════════════════════════════════════════════════════ */
function SlideOutside({ onNext }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    playMaterialize();
    const t = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div onClick={ready ? onNext : undefined} title={ready ? "Cliquer n'importe où pour continuer" : ""}
      style={{ animation: 'fadeIn 0.8s ease-out', position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', cursor: ready ? 'pointer' : 'default' }}>
      <svg viewBox="0 0 1200 680" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="s3-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0e28" />
            <stop offset="100%" stopColor="#2a2848" />
          </linearGradient>
          <radialGradient id="s3-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0e4c8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f0e4c8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s3-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b0ffdc" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#5eff9e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s3-lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe8a0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffe8a0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s3-window" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc060" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffc060" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* CIEL nocturne */}
        <rect width="1200" height="500" fill="url(#s3-sky)" />
        {/* Étoiles nombreuses */}
        {[[80, 60], [180, 100], [280, 40], [420, 80], [560, 50], [640, 110], [720, 70], [340, 130], [500, 120],
          [820, 60], [880, 130], [960, 90], [1020, 60], [1080, 120], [1140, 80], [80, 180], [220, 220], [380, 200],
          [640, 220], [780, 200], [980, 200], [1120, 220]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.6 : 1} fill="#fff" opacity={0.55 + (i % 4) * 0.1} />
        ))}
        {/* Lune plus imposante */}
        <circle cx="200" cy="130" r="130" fill="url(#s3-moon)" />
        <circle cx="200" cy="130" r="52" fill="#f0e4c8" opacity="0.95" />
        <circle cx="212" cy="122" r="10" fill="#c8bda0" opacity="0.5" />
        <circle cx="188" cy="140" r="6" fill="#c8bda0" opacity="0.5" />
        {/* Nuage discret sur la lune */}
        <path d="M120 150 Q160 140 200 148 Q240 138 280 148 Q320 158 280 168 Q220 172 160 170 Q100 168 120 150" fill="#0a0e28" opacity="0.35" />

        {/* Silhouettes de collines au fond */}
        <path d="M0 460 Q200 400 400 440 Q600 380 800 430 Q1000 400 1200 440 L1200 500 L0 500 Z" fill="#0a0e18" opacity="0.8" />

        {/* QUARTIER : maisons de banlieue en enfilade */}
        <g fill="#0a0e18">
          {/* Maison à gauche : la maison du joueur (fenêtre allumée = sa chambre) */}
          <path d="M60 490 L60 380 L200 300 L340 380 L340 490 Z" />
          <rect x="60" y="380" width="280" height="110" fill="#141820" />
          {/* Fenêtre allumée (chambre du joueur) */}
          <rect x="180" y="400" width="50" height="46" fill="#141018" stroke="#3a2818" strokeWidth="1.5" />
          <rect x="184" y="404" width="42" height="38" fill="#ffc060" opacity="0.85">
            <animate attributeName="opacity" values="0.7;0.9;0.7" dur="4s" repeatCount="indefinite" />
          </rect>
          <line x1="205" y1="400" x2="205" y2="446" stroke="#3a2818" strokeWidth="1.2" />
          <line x1="184" y1="423" x2="226" y2="423" stroke="#3a2818" strokeWidth="1.2" />
          {/* Halo warm de la fenêtre */}
          <circle cx="205" cy="423" r="60" fill="url(#s3-window)" />
          {/* Porte */}
          <rect x="100" y="430" width="34" height="60" fill="#3a2010" stroke="#5a3818" strokeWidth="1.2" />
          <circle cx="127" cy="462" r="1.6" fill="#c8a848" />
          {/* Cheminée avec fumée */}
          <rect x="260" y="320" width="20" height="40" fill="#3a2010" />
          <path d="M270 320 Q265 300 275 285 Q270 265 280 250" stroke="#8a9098" strokeWidth="4" fill="none" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
          </path>
        </g>
        {/* Autres maisons en enfilade au loin, sombres */}
        <g fill="#0a0e18" opacity="0.9">
          <path d="M380 490 L380 420 L440 380 L500 420 L500 490 Z" />
          <path d="M540 490 L540 400 L620 350 L700 400 L700 490 Z" />
          <path d="M740 490 L740 430 L800 390 L860 430 L860 490 Z" />
          <path d="M900 490 L900 410 L980 360 L1060 410 L1060 490 Z" />
          <path d="M1100 490 L1100 430 L1160 400 L1200 430 L1200 490 Z" />
          {/* fenêtres allumées éparses */}
          <rect x="446" y="440" width="8" height="10" fill="#c8a848" opacity="0.7" />
          <rect x="620" y="420" width="8" height="10" fill="#e0a848" opacity="0.6" />
          <rect x="980" y="420" width="8" height="10" fill="#c8a848" opacity="0.55" />
        </g>

        {/* Arbre à gauche */}
        <g transform="translate(30,420)">
          <rect x="-4" y="20" width="10" height="60" fill="#3a2010" />
          <circle r="30" fill="#1a3020" stroke="#0a1810" strokeWidth="0.8" />
          <circle cx="-10" cy="-14" r="18" fill="#1a3020" opacity="0.9" />
          <circle cx="16" cy="-10" r="18" fill="#1a3020" opacity="0.9" />
        </g>
        {/* Arbre à droite */}
        <g transform="translate(1100,440)">
          <rect x="-4" y="20" width="10" height="60" fill="#3a2010" />
          <circle r="32" fill="#1a3020" stroke="#0a1810" strokeWidth="0.8" />
          <circle cx="-14" cy="-12" r="18" fill="#1a3020" opacity="0.9" />
          <circle cx="18" cy="-8" r="16" fill="#1a3020" opacity="0.9" />
        </g>

        {/* RUE / SOL */}
        <rect y="500" width="1200" height="180" fill="#141018" />
        <path d="M0 520 L1200 520" stroke="#2a2028" strokeWidth="1.5" />
        {/* Bordure trottoir */}
        <rect y="500" width="1200" height="8" fill="#2a2830" />
        {/* Marquage bandes centrales */}
        {[80, 240, 400, 560, 720, 880, 1040].map((x, i) => (
          <rect key={i} x={x} y="600" width="60" height="6" fill="#c8a848" opacity="0.55" />
        ))}
        {/* Ligne de bord de route */}
        <rect y="558" width="1200" height="2" fill="#5a5040" opacity="0.4" />

        {/* Lampadaire à gauche avec halo */}
        <g>
          <circle cx="440" cy="360" r="60" fill="url(#s3-lamp)" />
          <rect x="436" y="180" width="6" height="330" fill="#3a3a3a" />
          <path d="M440 200 L500 200 L498 214 L440 214 Z" fill="#3a3a3a" />
          <circle cx="498" cy="210" r="10" fill="#ffe8a0" opacity="0.95" />
        </g>
        {/* Deuxième lampadaire à droite */}
        <g>
          <circle cx="960" cy="380" r="55" fill="url(#s3-lamp)" />
          <rect x="956" y="200" width="6" height="310" fill="#3a3a3a" />
          <path d="M960 220 L900 220 L902 234 L960 234 Z" fill="#3a3a3a" />
          <circle cx="902" cy="230" r="10" fill="#ffe8a0" opacity="0.95" />
        </g>

        {/* Boîte aux lettres au premier plan */}
        <g transform="translate(150,540)">
          <rect x="-3" y="0" width="6" height="60" fill="#3a3a3a" />
          <rect x="-20" y="-20" width="40" height="30" rx="6" fill="#8a1010" stroke="#3a0000" strokeWidth="1.2" />
          <rect x="-16" y="-16" width="10" height="6" fill="#0a0806" />
          <path d="M-20 -6 L-4 -14 L-4 -6 Z" fill="#c8a848" />
        </g>

        {/* Halo qui grandit puis se stabilise (position adaptée au centre du sol) */}
        <circle cx="600" cy="580" r="0" fill="url(#s3-halo)">
          <animate attributeName="r" values="20;340;280" keyTimes="0;0.65;1" dur="2s" fill="freeze" />
          <animate attributeName="opacity" values="0;1;0.75" keyTimes="0;0.55;1" dur="2s" fill="freeze" />
        </circle>
        {/* MARTINE se matérialise progressivement, puis flotte légèrement
            comme une soucoupe en vol stationnaire. */}
        <g transform="translate(600,560) scale(1.05)" opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.2s" fill="freeze" />
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; 0 -8; 0 2; 0 -6; 0 0" dur="4s" begin="1.2s"
              repeatCount="indefinite" additive="sum" />
            <animateTransform attributeName="transform" type="rotate"
              values="0; 0.6; -0.4; 0.3; 0" dur="5s" begin="1.2s"
              repeatCount="indefinite" additive="sum" />
            <TimeMachine landed={true} />
          </g>
        </g>
      </svg>
      {ready && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }}
          autoFocus
          style={{ position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)',
            background: '#5eff9e', color: '#06110b', border: 'none',
            borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'ui-monospace,monospace', letterSpacing: 3,
            boxShadow: '0 0 22px rgba(94,255,158,0.5)',
            animation: 'fadeIn 0.4s ease-out' }}>
          ▶ ENTRE DANS LE VAISSEAU
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S4 — COCKPIT : MARTINE t'accueille + bouton GO
   ═══════════════════════════════════════════════════════════════ */
function SlideCockpit({ onNext }) {
  return (
    <div onClick={onNext} title="Cliquer n'importe où pour continuer"
      style={{ animation: 'fadeIn 0.8s ease-out', position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <svg viewBox="0 0 1200 680" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="s4-cabin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a2a" />
            <stop offset="100%" stopColor="#050810" />
          </linearGradient>
          <linearGradient id="s4-console" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28303a" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <radialGradient id="s4-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s4-hublot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0620" />
            <stop offset="100%" stopColor="#000410" />
          </radialGradient>
          <radialGradient id="s4-panel-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Fond cabine */}
        <rect width="1200" height="680" fill="url(#s4-cabin)" />
        {/* Nervures métalliques (côtes de la coque) */}
        {[80, 200, 1000, 1120].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 40 Q${x + (x < 600 ? -20 : 20)} 340 ${x} 640`} stroke="#3a4048" strokeWidth="3" fill="none" opacity="0.6" />
            <rect x={x - 4} y="60" width="8" height="6" fill="#5a6270" opacity="0.6" />
            <rect x={x - 4} y="320" width="8" height="6" fill="#5a6270" opacity="0.6" />
            <rect x={x - 4} y="580" width="8" height="6" fill="#5a6270" opacity="0.6" />
          </g>
        ))}
        {/* GRAND HUBLOT ovale au-dessus, ciel étoilé */}
        <ellipse cx="600" cy="140" rx="400" ry="90" fill="url(#s4-hublot)" stroke="#5a7898" strokeWidth="5" />
        <ellipse cx="600" cy="140" rx="390" ry="82" fill="none" stroke="#3a5878" strokeWidth="1.5" />
        {/* Rivets autour du hublot */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <circle key={i} cx={600 + 405 * Math.cos((a * Math.PI) / 180)} cy={140 + 92 * Math.sin((a * Math.PI) / 180)} r="4" fill="#5a6270" stroke="#0a0e14" strokeWidth="0.6" />
        ))}
        {/* Étoiles dans le hublot */}
        {[[380, 120], [460, 150], [540, 100], [620, 155], [700, 110], [780, 145], [820, 120], [500, 170], [660, 175]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 2 ? 1.4 : 1} fill="#fff" opacity="0.8" />
        ))}
        {/* Petite planète bleue au fond */}
        <circle cx="820" cy="140" r="12" fill="#3a80c8" opacity="0.85" />
        <path d="M810 138 Q820 132 830 140" stroke="#5eff9e" strokeWidth="0.8" fill="none" opacity="0.7" />
        {/* Comète */}
        <path d="M400 100 L450 120" stroke="#e8eef5" strokeWidth="0.8" opacity="0.7" />
        <circle cx="450" cy="120" r="1.4" fill="#fff" />

        {/* CONSOLE de bord en U autour du bas */}
        <path d="M0 480 Q0 440 40 440 L1160 440 Q1200 440 1200 480 L1200 680 L0 680 Z" fill="url(#s4-console)" stroke="#0a0e14" strokeWidth="4" />
        {/* Panneau avant central */}
        <rect x="380" y="440" width="440" height="140" fill="#141c26" stroke="#3a4048" strokeWidth="2" rx="6" />
        {/* Écran principal du panneau : mini-carte du temps */}
        <g transform="translate(600,470)">
          <rect x="-160" y="-14" width="320" height="90" fill="#0a0806" stroke="#5eff9e" strokeWidth="2" />
          <text x="-150" y="0" fontFamily="ui-monospace,monospace" fontSize="8" fill="#5eff9e" letterSpacing="3">TEMPOSCOPE</text>
          {/* Ligne de temps horizontale avec 5 points */}
          <line x1="-140" y1="30" x2="140" y2="30" stroke="#5eff9e" strokeWidth="1.5" opacity="0.65" />
          {[-120, -60, 0, 60, 120].map((x, i) => (
            <g key={i} transform={`translate(${x},30)`}>
              <circle r="4" fill={i === 0 ? "#ffd166" : "#141c26"} stroke="#5eff9e" strokeWidth="1" />
              <text x="0" y="16" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e">{["−18k", "−12k", "−6k", "0", "+2k"][i]}</text>
            </g>
          ))}
          <text x="0" y="66" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8d4e2" letterSpacing="2">DESTINATION : PALÉOLITHIQUE</text>
        </g>
        {/* Rangée de boutons colorés à gauche du panneau */}
        <g transform="translate(430,510)">
          {[["#5eff9e", "MOT."], ["#7fd8ff", "NAV."], ["#ffd166", "COMM."]].map(([c, lab], i) => (
            <g key={i} transform={`translate(0,${i * 22})`}>
              <rect x="0" y="0" width="46" height="18" fill="#28303a" stroke={c} strokeWidth="1" rx="3" />
              <text x="23" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill={c} letterSpacing="1">{lab}</text>
            </g>
          ))}
        </g>
        <g transform="translate(724,510)">
          {[["#ff6a7a", "URG."], ["#c88060", "HAB."], ["#a04ce8", "AUX."]].map(([c, lab], i) => (
            <g key={i} transform={`translate(0,${i * 22})`}>
              <rect x="0" y="0" width="46" height="18" fill="#28303a" stroke={c} strokeWidth="1" rx="3" />
              <text x="23" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill={c} letterSpacing="1">{lab}</text>
            </g>
          ))}
        </g>

        {/* Panneau LATÉRAL GAUCHE avec cadrans */}
        <g>
          <rect x="40" y="440" width="300" height="180" fill="#141c26" stroke="#3a4048" strokeWidth="2" rx="6" />
          <ellipse cx="190" cy="530" rx="180" ry="110" fill="url(#s4-panel-glow)" />
          {/* 3 cadrans ronds */}
          {[[100, 500], [190, 500], [280, 500]].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx},${cy})`}>
              <circle r="30" fill="#0a0806" stroke="#5a6270" strokeWidth="1.5" />
              <circle r="26" fill="#141c26" stroke="#3a4048" strokeWidth="0.6" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a, k) => (
                <line key={k} x1={22 * Math.cos((a * Math.PI) / 180)} y1={22 * Math.sin((a * Math.PI) / 180)}
                  x2={26 * Math.cos((a * Math.PI) / 180)} y2={26 * Math.sin((a * Math.PI) / 180)}
                  stroke="#5a6270" strokeWidth="0.6" />
              ))}
              <line x1="0" y1="0" x2={20 * Math.cos((-70 + i * 40) * Math.PI / 180)} y2={20 * Math.sin((-70 + i * 40) * Math.PI / 180)} stroke={["#5eff9e", "#ffd166", "#ff6a7a"][i]} strokeWidth="2" strokeLinecap="round" />
              <circle r="2" fill="#5a6270" />
              <text x="0" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8d4e2" letterSpacing="1">{["TEMPS", "VITESSE", "PUISS."][i]}</text>
            </g>
          ))}
          {/* Rangée LEDs statut en bas */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i} transform={`translate(${60 + i * 36},580)`}>
              <circle r="6" fill="#0a0806" stroke="#3a4048" strokeWidth="0.6" />
              <circle r="3" fill={["#5eff9e", "#ffd166", "#7fd8ff", "#5eff9e", "#c88060", "#5eff9e", "#a04ce8"][i]}>
                <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>

        {/* Panneau LATÉRAL DROIT avec grand levier + boutons */}
        <g>
          <rect x="860" y="440" width="300" height="180" fill="#141c26" stroke="#3a4048" strokeWidth="2" rx="6" />
          {/* Grand levier */}
          <g transform="translate(940,540)">
            <rect x="-30" y="30" width="60" height="14" fill="#28303a" stroke="#0a0e14" strokeWidth="1" rx="3" />
            <rect x="-4" y="-40" width="8" height="70" fill="#5a6270" stroke="#0a0e14" strokeWidth="0.8" />
            <circle cx="0" cy="-46" r="14" fill="#c8a848" stroke="#3a2010" strokeWidth="1.5" />
            <text x="0" y="60" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8d4e2" letterSpacing="2">SAUT</text>
          </g>
          {/* Grille de boutons */}
          <g transform="translate(1030,470)">
            {[0, 1, 2, 3].map((r) => (
              [0, 1, 2, 3].map((c) => (
                <rect key={`${r}${c}`} x={c * 26} y={r * 26} width="20" height="20" rx="3" fill={["#28303a", "#3a4048"][c % 2]} stroke={["#5eff9e", "#7fd8ff", "#ffd166", "#ff6a7a"][r]} strokeWidth="0.6" />
              ))
            ))}
          </g>
        </g>

        {/* MARTINE au centre — halo bleu */}
        <ellipse cx="600" cy="310" rx="220" ry="120" fill="url(#s4-glow)" />
      </svg>

      {/* MARTINE avatar centré (au-dessus du SVG), avec un léger vol
          stationnaire pendant son "bienvenue à bord". */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, 0)', pointerEvents: 'none' }}>
        <div style={{ animation: 'martineHover 4s ease-in-out infinite' }}>
          <Avatar mood="content" size={130} talking />
        </div>
      </div>
      {/* Bulle texte + bouton GO */}
      <div style={{ position: 'absolute', left: '50%', bottom: 20, transform: 'translateX(-50%)', width: 'min(88%, 620px)',
        background: '#0e1a30', border: '2px solid #5eff9e', borderRadius: 14,
        padding: '14px 20px', color: '#e8eef5',
        boxShadow: '0 0 30px rgba(94,255,158,0.35)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>
          « Bienvenue à bord. Je suis <strong style={{ color: '#5eff9e' }}>MARTINE</strong> —
          Machine À Remonter le Temps Intelligente Néanmoins Excellente.
          Al3x1a m'envoie te chercher. Avant de partir, écoute bien : je vais te dire les <strong style={{ color: '#5eff9e' }}>4 règles</strong> que doit connaître un chronaute. »
        </p>
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} autoFocus
          style={{ marginTop: 12, background: 'linear-gradient(180deg,#ff8a3a,#c0501a)',
            color: '#fff', border: '3px solid #ffd166',
            borderRadius: 999, width: 88, height: 88,
            fontSize: 22, fontWeight: 900, cursor: 'pointer',
            fontFamily: 'ui-monospace,monospace', letterSpacing: 3,
            boxShadow: '0 0 32px rgba(255,140,60,0.7), inset 0 -6px 12px rgba(0,0,0,0.35), inset 0 6px 12px rgba(255,255,255,0.3)' }}>
          GO
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S4b — LES RÈGLES DES CHRONAUTES : MARTINE récite les 4 règles
   avant le premier saut. Chaque règle apparaît l'une après l'autre.
   Vocabulaire de 6e, formulations très simples.
   ═══════════════════════════════════════════════════════════════ */
function SlideRules({ onNext }) {
  /* Étapes : -1 = check-in MARTINE avec 3 choix de réponse,
     0..3 = les 4 règles empilées une par une. */
  const [n, setN] = useState(-1);
  /* mood: null (question posée), "content" / "dubitatif" / "enerve" (choix fait) */
  const [mood, setMood] = useState(null);
  const REPONSES = {
    content:   { emoji: "😊", label: "Vas-y, je t'écoute !",              reponse: "« Parfait ! Voilà les règles. » MARTINE t'adresse un clin d'œil.", martineMood: "content" },
    dubitatif: { emoji: "🤔", label: "Attends, j'ai peur de faire une bêtise…", reponse: "« C'est bien de te méfier. C'est justement pour ça qu'il y a des règles. Elles te protègent. »", martineMood: "neutre" },
    enerve:    { emoji: "😤", label: "Bon, allez, on n'a pas toute la journée !", reponse: "« Ha ! Un(e) impatient(e). Tant mieux : les gens pressés sautent souvent les règles. Écoute d'autant mieux. »", martineMood: "vexe" },
  };
  const REGLES = [
    { num: "1", titre: "Ne croise jamais un autre toi-même", desc: "Si tu rencontres une version de toi dans le passé ou le futur, le temps se déchire. Ne fais jamais ça.", couleur: "#ff6a7a" },
    { num: "2", titre: "Ne raconte pas le futur aux gens", desc: "Si tu dis à quelqu'un ce qui va lui arriver, il change ses choix — et l'histoire entière change avec.", couleur: "#ffd166" },
    { num: "3", titre: "Ne laisse rien du futur dans le passé", desc: "Ni objet, ni idée, ni technologie. Ramasse tout ce que tu poses. Sinon, les gens de l'époque changent leur monde à cause de toi.", couleur: "#5eff9e" },
    { num: "4", titre: "Rentre à ton époque avant qu'il soit trop tard", desc: "Si tu restes trop longtemps dans une autre époque, tu risques de ne plus jamais pouvoir revenir chez toi.", couleur: "#7fd8ff" },
  ];
  const isCheckin = n === -1;
  const isLast = n === REGLES.length - 1;
  const seen = isCheckin ? [] : REGLES.slice(0, n + 1);

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minHeight: 0 }}>
      {/* --- ÉTAPE CHECK-IN : MARTINE demande si tout est clair --- */}
      {isCheckin && (
        <>
          <svg viewBox="0 0 800 340" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="s4b-cabin2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a1a2a" />
                <stop offset="100%" stopColor="#050810" />
              </linearGradient>
              <radialGradient id="s4b-glow2" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="340" fill="url(#s4b-cabin2)" />
            <ellipse cx="400" cy="60" rx="260" ry="34" fill="#000814" stroke="#5a7898" strokeWidth="3" />
            {[[300, 50], [360, 66], [400, 46], [460, 68], [520, 54]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 2 ? 1.4 : 1} fill="#fff" opacity="0.75" />
            ))}
            <circle cx="400" cy="200" r="180" fill="url(#s4b-glow2)" />
            {/* Bulle centrée : question de MARTINE (ou sa réponse) */}
            <g transform="translate(400,200)">
              <rect x="-260" y="-70" width="520" height="140" fill="#0e1a30" stroke="#5eff9e" strokeWidth="2.5" rx="12" />
              <text x="0" y="-45" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5eff9e" letterSpacing="3.5">MARTINE</text>
              {!mood ? (
                <>
                  <text x="0" y="-20" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#e8eef5" fontStyle="italic">« On va voyager dans le temps.</text>
                  <text x="0" y="-2" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#e8eef5" fontStyle="italic">Ce n'est pas comme prendre le bus.</text>
                  <text x="0" y="20" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fill="#e8eef5" fontStyle="italic">Il y a des règles précises.</text>
                  <text x="0" y="46" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fill="#5eff9e" fontWeight="700">Prêt·e ? »</text>
                </>
              ) : (
                <foreignObject x="-240" y="-25" width="480" height="80">
                  <div xmlns="http://www.w3.org/1999/xhtml"
                    style={{ font: "italic 13px Georgia,serif", color: "#e8eef5", lineHeight: 1.4, textAlign: "center", padding: "0 10px" }}>
                    {REPONSES[mood].reponse}
                  </div>
                </foreignObject>
              )}
            </g>
          </svg>

          {/* Zone des choix ou du bouton continuer */}
          {!mood ? (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 720, marginTop: 4 }}>
              {Object.entries(REPONSES).map(([key, r]) => (
                <button key={key} onClick={() => setMood(key)}
                  style={{ background: '#141b26', color: '#e8eef5', border: '2px solid #3a4048',
                    borderRadius: 12, padding: '12px 18px', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'ui-monospace,monospace',
                    display: 'flex', alignItems: 'center', gap: 8, minWidth: 200,
                    transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5eff9e'; e.currentTarget.style.background = '#0e1a30'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3a4048'; e.currentTarget.style.background = '#141b26'; }}>
                  <span style={{ fontSize: 22 }}>{r.emoji}</span>
                  <span style={{ textAlign: 'left', flex: 1 }}>« {r.label} »</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
              <div><Avatar mood={REPONSES[mood].martineMood} size={64} talking /></div>
              <button onClick={() => setN(0)} autoFocus
                style={{ background: '#5eff9e', color: '#06110b', border: 'none', borderRadius: 10,
                  padding: '12px 26px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'ui-monospace,monospace', letterSpacing: 2,
                  boxShadow: '0 0 22px rgba(94,255,158,0.55)' }}>
                LES 4 RÈGLES →
              </button>
            </div>
          )}
        </>
      )}

      {/* --- ÉTAPES 0..3 : LES RÈGLES --- */}
      {!isCheckin && (
        <div onClick={() => (isLast ? onNext() : setN(n + 1))} title="Cliquer n'importe où pour continuer"
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minHeight: 0, cursor: 'pointer' }}>
          <svg viewBox="0 0 800 520" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="s4b-cabin3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a1a2a" />
                <stop offset="100%" stopColor="#050810" />
              </linearGradient>
              <radialGradient id="s4b-glow3" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="520" fill="url(#s4b-cabin3)" />
            <ellipse cx="400" cy="40" rx="260" ry="24" fill="#000814" stroke="#5a7898" strokeWidth="3" />
            {[[300, 34], [360, 46], [400, 30], [460, 48], [520, 36]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 2 ? 1.4 : 1} fill="#fff" opacity="0.75" />
            ))}
            <circle cx="400" cy="290" r="230" fill="url(#s4b-glow3)" />
            {/* Bandeau titre */}
            <g transform="translate(400,90)">
              <rect x="-260" y="-22" width="520" height="44" fill="#0a1428" stroke="#5eff9e" strokeWidth="2.5" rx="8" />
              <text x="0" y="8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="18" fontWeight="800" fill="#5eff9e" letterSpacing="6">
                LES 4 RÈGLES DES CHRONAUTES
              </text>
            </g>
            {/* Règles empilées, y à partir de 140, hauteur 82 par ligne */}
            {seen.map((r, i) => (
              <g key={i} transform={`translate(70,${140 + i * 88})`} style={{ animation: i === n ? 'fadeIn 0.5s ease-out' : 'none' }}>
                <circle cx="30" cy="30" r="26" fill={r.couleur} stroke="#0a0806" strokeWidth="2" />
                <text x="30" y="40" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="28" fontWeight="900" fill="#0a0806">{r.num}</text>
                <rect x="72" y="4" width="600" height="52" fill="#141c26" stroke={`${r.couleur}88`} strokeWidth="1.5" rx="6" />
                <text x="88" y="24" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="800" fill={r.couleur} letterSpacing="1">
                  {r.titre.toUpperCase()}
                </text>
                <text x="88" y="44" fontFamily="Georgia,serif" fontSize="12" fill="#c8d4e2">
                  {r.desc}
                </text>
              </g>
            ))}
          </svg>
          {/* Zone commentaire + bouton — POSITIONNÉE SOUS le SVG (plus de chevauchement) */}
          <div style={{ width: 'min(92%, 660px)', display: 'flex', gap: 12, alignItems: 'center',
            background: '#0e1a30', border: '2px solid #5eff9e', borderRadius: 14,
            padding: '10px 16px', color: '#e8eef5',
            boxShadow: '0 0 20px rgba(94,255,158,0.25)' }}>
            <div style={{ flexShrink: 0 }}><Avatar mood="neutre" size={54} talking /></div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45, flex: 1, textAlign: 'left' }}>
              {!isLast
                ? "« Retiens bien ça. Chaque règle protège le fil du temps. »"
                : "« Voilà. Quatre règles. Simples, mais très importantes. Encore une petite chose avant qu'on parte. »"}
            </p>
            <button onClick={(e) => { e.stopPropagation(); if (isLast) onNext(); else setN(n + 1); }} autoFocus
              style={{ flexShrink: 0, background: isLast ? '#5eff9e' : '#141b26',
                color: isLast ? '#06110b' : '#5eff9e',
                border: '2px solid #5eff9e',
                borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'ui-monospace,monospace', letterSpacing: 2,
                boxShadow: isLast ? '0 0 22px rgba(94,255,158,0.55)' : 'none' }}>
              {isLast ? "Suite →" : `Suite (${n + 2}/${REGLES.length})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S4c — MARTINE se présente : elle a été réparée par Al3x1a, sa
   mémoire est lacunaire, et elle traduit toutes les langues.
   Trois lignes courtes qui apparaissent l'une après l'autre.
   ═══════════════════════════════════════════════════════════════ */
function SlideMartineReparee({ onNext }) {
  const LINES = [
    { txt: "« Une dernière chose. Ce vaisseau que tu vois — c'est moi, MARTINE. Al3x1a m'a réparée avant de t'appeler. Elle a rebranché ce qu'elle a pu, mais il me manque des morceaux de mémoire. »", mood: "neutre" },
    { txt: "« Si je bloque parfois, ou si j'oublie pourquoi je dis quelque chose… pardonne-moi. Ce n'est pas ma faute. »", mood: "vexe" },
    { txt: "« Une bonne nouvelle : peu importe l'époque où on va se poser, je traduis tout automatiquement. Tu entendras chaque personne comme si elle parlait ta langue. »", mood: "content" },
  ];
  const [n, setN] = useState(0);
  const isLast = n === LINES.length - 1;
  const line = LINES[n];
  const advance = () => (isLast ? onNext() : setN(n + 1));

  return (
    <div onClick={advance} title="Cliquer n'importe où pour continuer"
      style={{ animation: 'fadeIn 0.6s ease-out', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minHeight: 0, cursor: 'pointer' }}>
      <svg viewBox="0 0 800 340" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="s4c-cabin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a2a" />
            <stop offset="100%" stopColor="#050810" />
          </linearGradient>
          <radialGradient id="s4c-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="340" fill="url(#s4c-cabin)" />
        <ellipse cx="400" cy="60" rx="260" ry="34" fill="#000814" stroke="#5a7898" strokeWidth="3" />
        {[[300, 50], [360, 66], [400, 46], [460, 68], [520, 54]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 2 ? 1.4 : 1} fill="#fff" opacity="0.75" />
        ))}
        <circle cx="400" cy="200" r="180" fill="url(#s4c-glow)" />
        <g transform="translate(400,200)">
          <rect x="-260" y="-60" width="520" height="120" fill="#0e1a30" stroke="#5eff9e" strokeWidth="2.5" rx="12" />
          <text x="0" y="-36" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5eff9e" letterSpacing="3.5">MARTINE</text>
          <foreignObject x="-240" y="-22" width="480" height="80">
            <div xmlns="http://www.w3.org/1999/xhtml"
              style={{ font: "italic 13px Georgia,serif", color: "#e8eef5", lineHeight: 1.45, textAlign: "center", padding: "0 10px" }}>
              {line.txt}
            </div>
          </foreignObject>
        </g>
      </svg>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
        <div><Avatar mood={line.mood} size={64} talking /></div>
        <button onClick={(e) => { e.stopPropagation(); advance(); }} autoFocus
          style={{ background: isLast ? '#5eff9e' : '#141b26',
            color: isLast ? '#06110b' : '#5eff9e',
            border: '2px solid #5eff9e',
            borderRadius: 10, padding: '12px 26px', fontSize: 14, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'ui-monospace,monospace', letterSpacing: 2,
            boxShadow: isLast ? '0 0 22px rgba(94,255,158,0.55)' : 'none' }}>
          {isLast ? "ON PART →" : `Suite (${n + 2}/${LINES.length})`}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S5 — FLASH + décompte des années (2026 → −18 000)
   ═══════════════════════════════════════════════════════════════ */
function SlideFlash({ onNext }) {
  const START = 2026;
  const END = -18000;
  const DUR = 3800; // ms
  const [year, setYear] = useState(START);
  const rafRef = useRef(null);
  useEffect(() => {
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / DUR);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setYear(Math.round(START + (END - START) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setTimeout(() => onNext(), 400);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onNext]);
  const fmt = (y) => (y < 0 ? `−${Math.abs(y).toLocaleString('fr-FR')}` : y.toLocaleString('fr-FR'));

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <svg viewBox="0 0 1200 680" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="s5-flash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="20%" stopColor="#fff8c0" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#f8b800" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#e88030" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s5-tunnel" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0604" stopOpacity="0" />
            <stop offset="55%" stopColor="#3a1808" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a0604" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="s5-vortex" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#3a80c8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3a80c8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="680" fill="#0a0604" />

        {/* Étoiles éparpillées en fond, qui filent (traînées) */}
        {[[100, 80, 40], [280, 140, 60], [960, 100, 50], [1080, 180, 30],
          [180, 540, 45], [440, 620, 35], [800, 560, 55], [1120, 500, 40],
          [80, 340, 20], [1140, 340, 20]].map(([x, y, l], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x + l} y2={y - l / 4} stroke="#e8eef5" strokeWidth="0.8" opacity="0.55" />
            <circle cx={x + l} cy={y - l / 4} r="1.6" fill="#fff" opacity="0.85" />
          </g>
        ))}

        {/* Rayons dorés qui tournent (plus longs) */}
        <g style={{ transformOrigin: '600px 340px', animation: 'flashSpin 4s linear infinite' }}>
          {[...Array(32)].map((_, i) => {
            const a = (i * 11.25) * Math.PI / 180;
            const x2 = 600 + Math.cos(a) * 720;
            const y2 = 340 + Math.sin(a) * 720;
            return <path key={i} d={`M600 340 L${x2} ${y2}`} stroke="#ffd870" strokeWidth={i % 2 ? 0.8 : 1.8} opacity={i % 2 ? 0.22 : 0.5} />;
          })}
        </g>

        {/* Deuxième couche de rayons qui tourne dans l'autre sens (contre-rotation) */}
        <g style={{ transformOrigin: '600px 340px', animation: 'flashSpinReverse 6s linear infinite' }}>
          {[...Array(16)].map((_, i) => {
            const a = (i * 22.5 + 11.25) * Math.PI / 180;
            const x2 = 600 + Math.cos(a) * 640;
            const y2 = 340 + Math.sin(a) * 640;
            return <path key={i} d={`M600 340 L${x2} ${y2}`} stroke="#7fd8ff" strokeWidth="1.2" opacity="0.3" />;
          })}
        </g>

        {/* Anneaux concentriques cyan qui foncent vers le centre (tunnel) */}
        {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((delay, i) => (
          <circle key={i} cx="600" cy="340" r="80" fill="none" stroke="#7fd8ff" strokeWidth="1.8" opacity="0.7">
            <animate attributeName="r" values="30;480" dur="1.6s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.95;0" dur="1.6s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Anneaux dorés secondaires (offset) */}
        {[0.1, 0.4, 0.7].map((delay, i) => (
          <circle key={i} cx="600" cy="340" r="80" fill="none" stroke="#ffd870" strokeWidth="1.2" opacity="0.5">
            <animate attributeName="r" values="20;520" dur="1.8s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0" dur="1.8s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Vortex bleu-blanc au centre */}
        <circle cx="600" cy="340" r="200" fill="url(#s5-vortex)" style={{ animation: 'flashPulse 1.6s ease-in-out infinite' }} />

        {/* Halo blanc éclatant central */}
        <circle cx="600" cy="340" r="360" fill="url(#s5-flash)" style={{ animation: 'flashPulse 1.2s ease-in-out infinite' }} />

        {/* Particules dorées qui filent vers le centre (aspiration) */}
        {[[120, 200], [1040, 180], [180, 500], [1000, 520], [400, 100], [800, 620], [80, 340], [1120, 340]].map(([sx, sy], i) => (
          <g key={i}>
            <circle cx={sx} cy={sy} r="2.4" fill="#ffd870" opacity="0">
              <animate attributeName="cx" values={`${sx};600`} dur="1.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${sy};340`} dur="1.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0" dur="1.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="3;0.6" dur="1.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Vignettage sombre autour */}
        <circle cx="600" cy="340" r="520" fill="url(#s5-tunnel)" pointerEvents="none" />

        <style>{`
          @keyframes flashSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
          @keyframes flashSpinReverse { from { transform: rotate(360deg); } to { transform: rotate(0); } }
          @keyframes flashPulse { 0%, 100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 0.95; transform: scale(1.06); } }
        `}</style>
      </svg>
      {/* Décompte des années, superposé au flash */}
      <div style={{ position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 14, letterSpacing: 6, color: '#ffd166',
          textShadow: '0 0 14px rgba(0,0,0,0.9)' }}>
          ⏳ SAUT TEMPOREL
        </div>
        <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 58, fontWeight: 900, color: '#fff',
          textShadow: '0 0 22px #ffd870, 0 0 34px #ff8030',
          letterSpacing: 3, marginTop: 10 }}>
          {fmt(year)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S6 — ARRIVÉE PRÉHISTOIRE : MARTINE posée + le joueur descend
   ═══════════════════════════════════════════════════════════════ */
function SlideArrival({ onDone }) {
  const [step, setStep] = useState(0);
  const dialogs = [
    { lines: ['« Nous y sommes.', 'Bienvenue en −18 000, chronaute. »'],
      pos: { x: 700, y: 180 }, color: 'default' },
    { lines: ['« Ma mission — et la tienne :', 'récupérer les messages que', 'les humains laissent au futur. »'],
      pos: { x: 680, y: 195 }, color: 'default' },
    { lines: ['« À chaque époque, aide un peuple', 'à laisser une trace de son savoir.', 'Plus le support est SOLIDE,', 'plus notre passage marque le temps. »'],
      pos: { x: 700, y: 210 }, color: 'alert' },
    { lines: ['« Allez, descends.', 'Approche-toi du feu — le clan t\'attend. »'],
      pos: { x: 710, y: 170 }, color: 'default' },
  ];
  const lastStep = step === dialogs.length - 1;
  const clickMartine = () => { if (!lastStep) setStep(step + 1); };

  return (
    <div style={{ animation: 'fadeIn 1s ease-out', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <svg viewBox="0 0 1200 680" style={{ display: 'block', width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="s6-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a3820" />
            <stop offset="55%" stopColor="#e0a848" />
            <stop offset="100%" stopColor="#c86040" />
          </linearGradient>
          <linearGradient id="s6-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a4028" />
            <stop offset="100%" stopColor="#3a1808" />
          </linearGradient>
          <radialGradient id="s6-fire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd870" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff5030" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s6-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe870" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffe870" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s6-river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#3a80c8" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* CIEL crépuscule */}
        <rect width="1200" height="440" fill="url(#s6-sky)" />
        {/* Halo solaire large */}
        <circle cx="870" cy="320" r="220" fill="url(#s6-sun)" />
        {/* Soleil couchant */}
        <circle cx="870" cy="320" r="70" fill="#ffe870" opacity="0.85" />
        <circle cx="870" cy="320" r="52" fill="#fff4b0" opacity="0.95" />
        <circle cx="870" cy="320" r="28" fill="#fff" opacity="0.7" />
        {/* Nuages plumes chauds */}
        <path d="M100 200 Q220 190 340 210 Q460 200 580 215 Q500 230 380 224 Q260 220 160 218 Q120 216 100 200" fill="#8a3820" opacity="0.45" />
        <path d="M700 180 Q820 170 940 190 Q1060 180 1160 195 Q1080 210 960 202 Q840 200 740 200 Q710 200 700 180" fill="#8a3820" opacity="0.35" />
        {/* Étoiles pâles au-dessus */}
        {[[80, 60], [260, 50], [440, 40], [640, 65], [960, 55], [1120, 45]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 1.2 : 0.8} fill="#f0e4c8" opacity={0.45 + (i % 3) * 0.1} />
        ))}
        {/* Oiseaux au loin */}
        <path d="M480 180 q6 -8 12 0 q6 -8 12 0" stroke="#3a2010" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M560 160 q4 -6 8 0 q4 -6 8 0" stroke="#3a2010" strokeWidth="1.2" fill="none" opacity="0.7" />

        {/* MONTAGNES lointaines et proches */}
        <path d="M0 440 L0 340 L120 290 L240 320 L380 280 L500 310 L680 260 L820 300 L980 270 L1120 310 L1200 300 L1200 440 Z" fill="#5a4058" opacity="0.5" />
        <path d="M0 440 L0 320 L120 220 L240 310 L380 200 L510 300 L620 190 L740 290 L860 230 L980 300 L1100 240 L1200 270 L1200 440 Z" fill="#3a2010" />
        {/* Neige au sommet des pics */}
        <path d="M370 210 L380 200 L392 214 L382 220 Z" fill="#f0e4c8" opacity="0.75" />
        <path d="M612 200 L620 190 L630 204 L622 208 Z" fill="#f0e4c8" opacity="0.75" />
        <path d="M852 240 L860 230 L870 244 L862 248 Z" fill="#f0e4c8" opacity="0.75" />

        {/* FORÊT en arrière-plan */}
        <g fill="#1a2a10">
          {[40, 90, 140, 190, 240, 290, 360, 410, 460, 520, 580, 640, 700, 760, 820, 880, 940, 1000, 1060, 1120, 1170].map((x, i) => {
            const h = 34 + (i % 5) * 10;
            const y = 440;
            return (
              <g key={i} transform={`translate(${x},${y})`}>
                <path d={`M0 0 L-${h/3} 0 L-${h/4} -${h*0.6} L-${h/5} -${h*0.6} L0 -${h} L${h/5} -${h*0.6} L${h/4} -${h*0.6} L${h/3} 0 Z`} />
                <rect x="-1.6" y="-4" width="3.2" height="6" fill="#3a2010" />
              </g>
            );
          })}
        </g>

        {/* MAMMOUTH imposant à gauche */}
        <g transform="translate(220,410)">
          <ellipse cx="0" cy="0" rx="66" ry="36" fill="#1a0e04" />
          <ellipse cx="-58" cy="-4" rx="26" ry="20" fill="#1a0e04" />
          <path d="M-80 6 Q-100 26 -92 42 Q-80 46 -74 32" stroke="#1a0e04" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M-74 -6 Q-88 -14 -84 -22 M-74 -4 Q-84 -12 -70 -20" stroke="#e8dfc8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="-66" cy="-6" r="2" fill="#f0d090" />
          {/* Poils */}
          <path d="M-40 -30 L-30 -20 M-20 -34 L-14 -22 M0 -34 L4 -22 M20 -30 L18 -20 M40 -28 L34 -18" stroke="#0a0602" strokeWidth="1.5" opacity="0.7" />
          {/* Pattes */}
          <rect x="-42" y="28" width="14" height="36" fill="#1a0e04" />
          <rect x="-16" y="30" width="14" height="34" fill="#1a0e04" />
          <rect x="14" y="30" width="14" height="34" fill="#1a0e04" />
          <rect x="36" y="28" width="14" height="36" fill="#1a0e04" />
        </g>

        {/* Petit troupeau de cerfs au fond droit */}
        <g fill="#3a2010" opacity="0.8">
          <g transform="translate(1080,420)">
            <ellipse cx="0" cy="0" rx="14" ry="7" />
            <ellipse cx="-14" cy="-4" rx="5" ry="6" />
            <path d="M-18 -8 L-20 -14 M-14 -8 L-12 -14" stroke="#3a2010" strokeWidth="1" fill="none" />
            <rect x="-8" y="6" width="2" height="8" />
            <rect x="-2" y="6" width="2" height="8" />
            <rect x="4" y="6" width="2" height="8" />
            <rect x="10" y="6" width="2" height="8" />
          </g>
          <g transform="translate(1120,428) scale(0.8)">
            <ellipse cx="0" cy="0" rx="14" ry="7" />
            <ellipse cx="-14" cy="-4" rx="5" ry="6" />
            <rect x="-8" y="6" width="2" height="8" />
            <rect x="8" y="6" width="2" height="8" />
          </g>
        </g>

        {/* SOL */}
        <rect y="440" width="1200" height="240" fill="url(#s6-ground)" />
        {/* Herbe folle */}
        {[[60, 480], [180, 490], [340, 500], [500, 495], [660, 500], [820, 505], [980, 500], [1140, 495]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <path d="M-4 0 L-4 -10 M0 0 L0 -14 M4 0 L4 -8" stroke="#5a4020" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* Pierres éparses */}
        {[[100, 500], [420, 520], [620, 500], [860, 540], [1060, 520]].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="14" ry="4" fill="#5a3020" opacity="0.7" />
        ))}

        {/* RIVIÈRE qui traverse le fond */}
        <path d="M0 500 Q150 490 300 508 Q450 520 600 510 Q750 500 900 512 Q1050 522 1200 510 L1200 540 Q1050 552 900 542 Q750 530 600 540 Q450 550 300 538 Q150 520 0 530 Z" fill="url(#s6-river)" />
        {/* Reflet sur la rivière */}
        <path d="M100 512 L200 510 M400 516 L500 514 M700 516 L800 516 M1000 520 L1100 518" stroke="#e8eef5" strokeWidth="0.8" opacity="0.5" />

        {/* GRANDE PIERRE avec peinture rupestre au premier plan gauche */}
        <g transform="translate(90,560)">
          <path d="M0 40 Q10 -20 50 -40 Q100 -50 140 -20 Q150 30 100 60 Q40 66 0 40 Z" fill="#5a3020" stroke="#2a1010" strokeWidth="2" />
          {/* Dessins rupestres : main + auroch stylisé + ligne de spirales */}
          <path d="M30 20 q6 -12 14 -8 q4 -12 10 -6 q8 -8 12 -2 q6 -6 10 0 q0 12 -6 16 q-12 6 -20 4 q-14 -2 -20 -4" fill="#8a1010" opacity="0.85" />
          <path d="M70 -14 Q84 -22 96 -12 L92 -6 Q100 -8 100 0 Q90 6 80 2 Q70 4 66 -6 Z M96 -18 L106 -22 M98 -14 L110 -12" stroke="#3a0000" strokeWidth="1.5" fill="none" opacity="0.85" />
        </g>

        {/* TENTE / HUTTE près du feu */}
        <g transform="translate(340,560)">
          <path d="M-46 44 L0 -30 L46 44 Z" fill="#5a3020" stroke="#2a1010" strokeWidth="2" />
          <path d="M-46 44 L0 -30 L46 44 Z" fill="none" stroke="#3a1808" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.75" />
          {/* Ouverture */}
          <path d="M-8 44 L0 20 L8 44 Z" fill="#141008" />
          {/* Perches qui dépassent */}
          <line x1="0" y1="-30" x2="-8" y2="-46" stroke="#3a1808" strokeWidth="2" />
          <line x1="0" y1="-30" x2="6" y2="-44" stroke="#3a1808" strokeWidth="2" />
          <line x1="0" y1="-30" x2="0" y2="-50" stroke="#3a1808" strokeWidth="2" />
        </g>

        {/* FEU du clan (plus imposant) */}
        <g transform="translate(180,600)">
          <circle r="72" fill="url(#s6-fire)" style={{ animation: 'firePulse 1.4s ease-in-out infinite' }} />
          {/* Bûches croisées */}
          <path d="M-28 10 L28 6 M-22 16 L28 14 M-20 22 L22 18" stroke="#3a1808" strokeWidth="6" strokeLinecap="round" />
          {/* Flammes */}
          <path d="M-12 -2 Q-10 -22 0 -30 Q6 -18 4 -2 Z" fill="#ffd870" />
          <path d="M-6 0 Q-2 -12 4 -18 Q6 -8 4 0 Z" fill="#ff8030" />
          <path d="M0 -6 Q2 -14 6 -18 Q8 -10 6 -4 Z" fill="#fff4b0" />
          {/* Fumée qui monte */}
          <path d="M0 -30 Q-6 -50 4 -70 Q-4 -90 6 -110" stroke="#8a9098" strokeWidth="5" fill="none" opacity="0.35" strokeLinecap="round">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Le VAISSEAU posé plus grand */}
        <g transform="translate(900,600) scale(0.9)">
          <TimeMachine landed={true} />
        </g>

        {/* MARTINE (avatar) — plus grande, lévite */}
        <g onClick={!lastStep ? clickMartine : undefined}
          style={{ cursor: !lastStep ? 'pointer' : 'default' }}>
          <g transform="translate(720,490)">
            <animateTransform attributeName="transform" type="translate"
              values="720 490; 720 476; 720 490" dur="2.6s" repeatCount="indefinite" additive="replace" />
            <circle r="62" fill="rgba(94,255,158,0.18)">
              <animate attributeName="r" values="56;68;56" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="46" fill="#8a6240" stroke="#5c3a22" strokeWidth="2.5" />
            <path d="M-38 -8 Q0 -18 38 -8" stroke="#5c3a22" strokeWidth="3" fill="none" opacity="0.85" />
            <circle cx="0" cy="6" r="16" fill="#cfeaff" stroke="#5c3a22" strokeWidth="3" />
            <path d="M-10 8 Q0 -4 10 8" stroke="#0c2233" strokeWidth="4.4" fill="none" strokeLinecap="round" />
            <line x1="0" y1="-46" x2="0" y2="-64" stroke="#8a94a8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="0" cy="-66" r="4.5" fill="#5eff9e">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <rect x="-60" y="-6" width="16" height="12" rx="4" fill="#6a7488" />
            <rect x="44" y="-6" width="16" height="12" rx="4" fill="#6a7488" />
            <path d="M-60 0 l-10 4 l10 4 Z" fill="#7fd8ff" style={{ animation: 'flick .5s infinite' }} />
            <path d="M60 0 l10 4 l-10 4 Z" fill="#7fd8ff" style={{ animation: 'flick .5s infinite' }} />
          </g>
        </g>

        {/* Bulle MARTINE */}
        <Bubble x={dialogs[step].pos.x} y={dialogs[step].pos.y} w={400}
          text={dialogs[step].lines}
          color={dialogs[step].color}
          from="right" />

        {/* Au dernier dialogue : personnages du clan cliquables */}
        {lastStep && (
          <g>
            {/* Membre du clan 1 : autour du feu, plus grand */}
            <g transform="translate(300,550)" onClick={onDone} style={{ cursor: 'pointer' }}>
              <circle cx="0" cy="-14" r="66" fill="none" stroke="#5eff9e" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.85" style={{ animation: 'personneCall 1.6s ease-in-out infinite' }} />
              <path d="M-22 28 L-22 -14 Q-22 -26 -14 -26 L14 -26 Q22 -26 22 -14 L22 28 Z" fill="#5a3818" />
              <ellipse cx="0" cy="-38" rx="16" ry="18" fill="#e0a878" />
              <path d="M-14 -42 q0 -10 8 -12 q6 4 10 -4 q4 8 10 4 q8 4 10 12 z" fill="#3a1808" />
              <circle cx="-5" cy="-38" r="1.6" fill="#0a0806" />
              <circle cx="5" cy="-38" r="1.6" fill="#0a0806" />
              <path d="M-4 -32 q4 3 8 0" stroke="#3a1808" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* Lance dans la main */}
              <path d="M22 0 L46 -20" stroke="#3a1808" strokeWidth="3" strokeLinecap="round" />
              <path d="M46 -20 L42 -24 L52 -20 L46 -14 Z" fill="#c8a848" />
              <text x="0" y="-88" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="15" fontWeight="700" fill="#5eff9e" style={{ animation: 'personneCall 1.6s ease-in-out infinite' }}>◉ Rejoins-les</text>
            </g>
            {/* Membre du clan 2 */}
            <g transform="translate(450,520)" onClick={onDone} style={{ cursor: 'pointer' }}>
              <circle cx="0" cy="-24" r="52" fill="none" stroke="#5eff9e" strokeWidth="2" strokeDasharray="4 4" opacity="0.75" style={{ animation: 'personneCall 1.8s ease-in-out infinite' }} />
              <path d="M-18 44 L-18 -18 Q-18 -28 -10 -28 L10 -28 Q18 -28 18 -18 L18 44 Z" fill="#4a3020" />
              <ellipse cx="0" cy="-38" rx="12" ry="14" fill="#d0a068" />
              <path d="M-12 -42 q0 -8 5 -10 q5 2 8 -3 q3 5 8 3 q5 4 8 10 z" fill="#2a1808" />
              <circle cx="-4" cy="-38" r="1.4" fill="#0a0806" />
              <circle cx="4" cy="-38" r="1.4" fill="#0a0806" />
              <path d="M18 -6 L34 -28" stroke="#3a1808" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M34 -28 L30 -32 L40 -28 L34 -22 Z" fill="#c8a848" />
            </g>
            {/* Enfant du clan qui salue */}
            <g transform="translate(550,570)" onClick={onDone} style={{ cursor: 'pointer' }}>
              <circle cx="0" cy="-14" r="40" fill="none" stroke="#5eff9e" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.7" style={{ animation: 'personneCall 2s ease-in-out infinite' }} />
              <path d="M-12 26 L-12 -12 Q-12 -20 -6 -20 L6 -20 Q12 -20 12 -12 L12 26 Z" fill="#8a5030" />
              <ellipse cx="0" cy="-28" rx="9" ry="10" fill="#e0a878" />
              <circle cx="-3" cy="-28" r="1" fill="#0a0806" />
              <circle cx="3" cy="-28" r="1" fill="#0a0806" />
              <path d="M-3 -24 q3 2 6 0" stroke="#3a1808" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              {/* Petit bras levé qui salue */}
              <path d="M-12 -8 L-22 -20" stroke="#e0a878" strokeWidth="3" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" values="0 -12 -8; -18 -12 -8; 0 -12 -8" dur="1.8s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
        )}

        <style>{`
          @keyframes firePulse { 0%, 100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
          @keyframes personneCall { 0%, 100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        `}</style>
      </svg>
    </div>
  );
}
