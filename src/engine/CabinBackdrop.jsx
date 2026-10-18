/* ============================================================
   DÉCOR — Intérieur de MARTINE (fond des écrans de dialogue de l'intro)
   ------------------------------------------------------------
   Baie panoramique bombée sur l'espace (nébuleuse, planète à
   anneaux, étoiles qui scintillent), membrures courbes du vaisseau,
   panneaux rivetés, rangée de voyants qui clignotent, lueur verte de
   MARTINE au centre. Les textes et bulles sont posés PAR-DESSUS par
   l'écran appelant : le centre reste calme et sombre.
   w × h : taille du viewBox appelant (800 × 340 ou 800 × 520).
   ============================================================ */

const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

export default function CabinBackdrop({ w = 800, h = 340, uid = "cab", glowY }) {
  const cx = w / 2;
  const winH = Math.min(120, h * 0.3);
  const gy = glowY ?? h * 0.6;
  const r = rnd(h + 11);
  const stars = Array.from({ length: 46 }, () => ({ x: cx - 300 + r() * 600, y: 8 + r() * (winH - 12), rad: r() < 0.15 ? 1.4 : 0.8, o: 0.4 + r() * 0.6 }));
  const lamps = ["#5eff9e", "#ffd166", "#7fd8ff", "#ff6a7a", "#5eff9e", "#a080ff", "#ffd166", "#7fd8ff"];
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1c2c" />
          <stop offset="100%" stopColor="#04070e" />
        </linearGradient>
        <radialGradient id={`${uid}-neb`} cx="35%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#7a3a9a" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#2a3a8a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000814" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-planet`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8ac8ff" />
          <stop offset="60%" stopColor="#2a5a9a" />
          <stop offset="100%" stopColor="#0a1a3a" />
        </radialGradient>
        <clipPath id={`${uid}-win`}>
          <path d={`M${cx - 300} ${winH} Q${cx} ${winH + 26} ${cx + 300} ${winH} L${cx + 270} 6 Q${cx} -10 ${cx - 270} 6 Z`} />
        </clipPath>
        <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      <rect x="-40" y="-20" width={w + 80} height={h + 40} fill={`url(#${uid}-wall)`} />

      {/* baie panoramique */}
      <g clipPath={`url(#${uid}-win)`}>
        <rect x={cx - 310} y="-20" width="620" height={winH + 60} fill="#000814" />
        <ellipse cx={cx - 90} cy={winH * 0.6} rx="220" ry={winH * 0.7} fill={`url(#${uid}-neb)`} filter={`url(#${uid}-blur)`} />
        <ellipse cx={cx + 140} cy={winH * 0.3} rx="120" ry={winH * 0.4} fill="#1a5a7a" opacity="0.25" filter={`url(#${uid}-blur)`} />
        {stars.map((st, i) => (
          <circle key={i} cx={st.x.toFixed(1)} cy={st.y.toFixed(1)} r={st.rad} fill="#fff" opacity={st.o.toFixed(2)}>
            {i % 6 === 0 && <animate attributeName="opacity" values={`${st.o.toFixed(2)};0.15;${st.o.toFixed(2)}`} dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />}
          </circle>
        ))}
        <g transform={`translate(${cx + 190},${winH * 0.55})`}>
          <ellipse cx="0" cy="0" rx="44" ry="9" fill="none" stroke="#c8d8f0" strokeWidth="2" opacity="0.35" transform="rotate(-14)" />
          <circle r="20" fill={`url(#${uid}-planet)`} />
          <path d="M-44 6 A44 9 0 0 0 44 -6" fill="none" stroke="#e0ecff" strokeWidth="2.2" opacity="0.55" transform="rotate(-14)" />
        </g>
        {/* reflets sur la vitre */}
        <path d={`M${cx - 230} ${winH - 4} L${cx - 170} 10 M${cx - 200} ${winH} L${cx - 150} 24`} stroke="#fff" strokeWidth="5" opacity="0.05" />
      </g>
      <path d={`M${cx - 300} ${winH} Q${cx} ${winH + 26} ${cx + 300} ${winH} L${cx + 270} 6 Q${cx} -10 ${cx - 270} 6 Z`} fill="none" stroke="#5a7898" strokeWidth="4" />
      {[-200, -100, 0, 100, 200].map((dx) => <path key={dx} d={`M${cx + dx * 0.92} ${-2} L${cx + dx} ${winH + 18 - Math.abs(dx) / 20}`} stroke="#3a5070" strokeWidth="2.4" opacity="0.8" />)}
      {[-270, -135, 0, 135, 270].map((dx) => <circle key={dx} cx={cx + dx} cy={winH + 14 - Math.abs(dx) / 12} r="3" fill="#7a98b8" />)}

      {/* membrures courbes du vaisseau + panneaux rivetés */}
      {[[-1, 18], [-1, 64], [1, 18], [1, 64]].map(([sd, off], i) => (
        <path key={i} d={sd < 0 ? `M${off} -10 Q${off + 40} ${h * 0.5} ${off - 4} ${h + 10}` : `M${w - off} -10 Q${w - off - 40} ${h * 0.5} ${w - off + 4} ${h + 10}`}
          stroke="#1c2c40" strokeWidth={off < 30 ? 10 : 6} fill="none" />
      ))}
      {[0.3, 0.55, 0.8].map((k) => (
        <g key={k} fill="#3a5070">
          <circle cx={30 + k * 18} cy={h * k} r="2" /><circle cx={w - 30 - k * 18} cy={h * k} r="2" />
        </g>
      ))}
      <g opacity="0.5" stroke="#16263a" strokeWidth="1.4" fill="none">
        <rect x="88" y={h * 0.42} width="70" height={h * 0.3} rx="4" />
        <rect x={w - 158} y={h * 0.42} width="70" height={h * 0.3} rx="4" />
      </g>

      {/* lueur de MARTINE */}
      <circle cx={cx} cy={gy} r={Math.min(240, h * 0.6)} fill={`url(#${uid}-glow)`} />

      {/* voyants de la console (bas de l'écran) */}
      <rect x="-40" y={h - 18} width={w + 80} height="40" fill="#0a121e" />
      <path d={`M-40 ${h - 18} H${w + 40}`} stroke="#2a3a50" strokeWidth="2" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 40 + i * ((w - 80) / 15);
        const c = lamps[i % lamps.length];
        return (
          <circle key={i} cx={x} cy={h - 8} r="2.6" fill={c} opacity="0.75">
            {i % 3 === 0 && <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${1.2 + (i % 4) * 0.5}s`} repeatCount="indefinite" />}
          </circle>
        );
      })}
    </g>
  );
}
