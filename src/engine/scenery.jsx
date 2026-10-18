/* ============================================================
   MOTEUR — KIT DE PAYSAGES (décors peints des tableaux)
   ------------------------------------------------------------
   Briques réutilisables pour donner de la profondeur aux décors,
   toutes déterministes (même rendu à chaque affichage) :
     rng(seed)            — pseudo-aléatoire reproductible
     ridgePath(...)       — ligne de crête naturelle (déplacement du
                            point milieu), fermée vers le bas
     Ridge                — chaîne de montagnes/collines, avec neige
                            optionnelle (au-dessus d'une altitude) et
                            versant éclairé
     Haze                 — voile de brume entre deux plans
     Clouds               — bancs de nuages doux, peuvent dériver
     Conifer / Leafy / Birch / TreeLine — arbres seuls ou lisière
     Rock                 — rocher à facettes (face éclairée + ombre)
     Grass / Speckle      — touffes d'herbe, grain du sol
     Reflect              — reflet flou et assombri d'un groupe dans l'eau
   La lumière vient de `light` : -1 = de la gauche, 1 = de la droite.
   ============================================================ */
import { shade } from "./chars.jsx";

export const rng = (seed) => {
  let s = Math.abs(Math.floor(seed * 9973)) % 2147483647 || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

/* crête : points de (x0) à (x1) autour de y, hauteur max amp */
export function ridgePoints(seed, { x0 = -40, x1 = 1040, y = 300, amp = 80, rough = 0.55, depth = 7 } = {}) {
  const r = rng(seed);
  let pts = [[x0, y - r() * amp * 0.5], [x1, y - r() * amp * 0.5]];
  let disp = amp * 1.8;
  for (let d = 0; d < depth; d++) {
    const next = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const my = (ay + by) / 2 + (r() - 0.5) * disp;
      next.push([(ax + bx) / 2 + (r() - 0.5) * (bx - ax) * 0.2, my], pts[i + 1]);
    }
    pts = next;
    disp *= rough;
  }
  // normalise : le point le plus haut touche y − amp, le plus bas y
  const ys = pts.map((p) => p[1]);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  return pts.map(([px, py]) => [px, y - amp + ((py - lo) / (hi - lo || 1)) * amp]);
}

export function ridgePath(seed, opts = {}) {
  const { bottom = 700 } = opts;
  const pts = ridgePoints(seed, opts);
  return `M${pts[0][0]} ${bottom} ` + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + ` L${pts[pts.length - 1][0]} ${bottom} Z`;
}

/* Chaîne de montagnes : aplat + liseré éclairé (côté lumière) + neige */
export function Ridge({ id, seed, x0 = -40, x1 = 1040, y, amp, rough = 0.55, depth = 7, fill, light = -1, lit, snow, snowLine, bottom = 700, opacity = 1 }) {
  const opts = { x0, x1, y, amp, rough, depth, bottom };
  const pts = ridgePoints(seed, opts);
  const d = ridgePath(seed, opts);
  const sx = -light * amp * 0.16, sy = amp * 0.14;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`${id}-clip`}><path d={d} /></clipPath>
      </defs>
      <path d={d} fill={lit || fill} />
      <g clipPath={`url(#${id}-clip)`}>
        {snow && (
          <g>
            <rect x={x0} y={y - amp * 1.6} width={x1 - x0} height={snowLine - (y - amp * 1.6)} fill={snow} />
            <path d={pts.map(([x], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${(snowLine + ((i * 37) % 13) - 5).toFixed(1)}`).join(" ") + ` L${x1} ${bottom} L${x0} ${bottom} Z`}
              fill={lit || fill} />
          </g>
        )}
        <path d={d} fill={fill} transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)})`} />
        {snow && <rect x={x0} y={y - amp * 1.6} width={x1 - x0} height={Math.max(0, snowLine - (y - amp * 1.6) - sy)} fill={shade(snow, -0.12)} transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)})`} clipPath={`url(#${id}-clip)`} opacity="0" />}
      </g>
    </g>
  );
}

/* voile de brume horizontal (plus dense en bas) */
export function Haze({ id, y0, y1, color = "#ffffff", opacity = 0.35, x0 = -40, x1 = 1040 }) {
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="100%" stopColor={color} stopOpacity={opacity} />
        </linearGradient>
      </defs>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={`url(#${id})`} />
    </g>
  );
}

/* bancs de nuages doux */
export function Clouds({ id, seed = 1, items, color = "#ffffff", shadow, opacity = 0.8, drift = 0 }) {
  const r = rng(seed);
  return (
    <g opacity={opacity}>
      <defs><filter id={`${id}-f`} x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="3.5" /></filter></defs>
      {items.map(([x, y, w], i) => {
        const puffs = Array.from({ length: 5 }, (_, k) => ({ dx: (k - 2) * w * 0.2 + (r() - 0.5) * w * 0.1, dy: -Math.sin((k / 4) * Math.PI) * w * 0.12 * (0.6 + r() * 0.5), rx: w * (0.16 + r() * 0.1) }));
        return (
          <g key={i} filter={`url(#${id}-f)`}>
            {drift ? <animateTransform attributeName="transform" type="translate" values={`0 0; ${drift * (1 + (i % 3) * 0.3)} 0; 0 0`} dur={`${60 + i * 17}s`} repeatCount="indefinite" /> : null}
            {shadow && <ellipse cx={x} cy={y + w * 0.04} rx={w * 0.55} ry={w * 0.06} fill={shadow} />}
            {puffs.map((p, k) => <ellipse key={k} cx={x + p.dx} cy={y + p.dy} rx={p.rx} ry={p.rx * 0.6} fill={color} />)}
            <ellipse cx={x} cy={y} rx={w * 0.55} ry={w * 0.07} fill={color} />
          </g>
        );
      })}
    </g>
  );
}

/* ─── arbres ─── origine au pied du tronc */
export function Conifer({ x, y, h = 60, color = "#1d2f22", light = -1, lit, snow }) {
  const w = h * 0.36;
  const tiers = 4;
  const L = lit || shade(color, 0.08);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-h * 0.025} y={-h * 0.14} width={h * 0.05} height={h * 0.15} fill={shade(color, -0.12)} />
      {Array.from({ length: tiers }).map((_, i) => {
        const t = i / tiers;
        const top = -h + t * h * 0.62;
        const bw = w * (0.45 + t * 0.6);
        const by = top + h * 0.34;
        return (
          <g key={i}>
            <path d={`M0 ${top.toFixed(1)} L${bw.toFixed(1)} ${by.toFixed(1)} Q0 ${(by - h * 0.05).toFixed(1)} ${(-bw).toFixed(1)} ${by.toFixed(1)} Z`} fill={color} />
            <path d={`M0 ${top.toFixed(1)} L${(light * bw).toFixed(1)} ${by.toFixed(1)} Q${(light * bw * 0.5).toFixed(1)} ${(by - h * 0.03).toFixed(1)} 0 ${(by - h * 0.05).toFixed(1)} Z`} fill={L} opacity="0.55" />
            {snow && <path d={`M0 ${top.toFixed(1)} L${(bw * 0.4).toFixed(1)} ${(top + h * 0.13).toFixed(1)} Q0 ${(top + h * 0.1).toFixed(1)} ${(-bw * 0.4).toFixed(1)} ${(top + h * 0.13).toFixed(1)} Z`} fill={snow} />}
          </g>
        );
      })}
    </g>
  );
}

export function Leafy({ x, y, s = 1, color = "#3a5a2a", light = -1, trunk = "#3a2a1c", seed = 1 }) {
  const r = rng(seed);
  const blobs = Array.from({ length: 7 }, () => ({ bx: (r() - 0.5) * 50, by: -50 - r() * 40, rr: 16 + r() * 14 }));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-4 0 Q-2 -26 -6 -46 M4 0 Q3 -24 10 -42 M0 -26 Q-12 -36 -20 -40" stroke={trunk} strokeWidth="6" strokeLinecap="round" fill="none" />
      {blobs.map((b, i) => <circle key={i} cx={b.bx.toFixed(1)} cy={b.by.toFixed(1)} r={b.rr.toFixed(1)} fill={color} />)}
      {blobs.map((b, i) => <circle key={`l${i}`} cx={(b.bx + light * b.rr * 0.32).toFixed(1)} cy={(b.by - b.rr * 0.3).toFixed(1)} r={(b.rr * 0.55).toFixed(1)} fill={shade(color, 0.1)} opacity="0.6" />)}
      {blobs.slice(0, 3).map((b, i) => <circle key={`s${i}`} cx={(b.bx - light * b.rr * 0.3).toFixed(1)} cy={(b.by + b.rr * 0.35).toFixed(1)} r={(b.rr * 0.5).toFixed(1)} fill={shade(color, -0.1)} opacity="0.5" />)}
    </g>
  );
}

export function Birch({ x, y, h = 90, color = "#5a7a32", light = -1, seed = 3 }) {
  const r = rng(seed);
  const lean = (r() - 0.5) * 10;
  const leaves = Array.from({ length: 9 }, () => ({ bx: lean * 0.8 + (r() - 0.5) * h * 0.42, by: -h * 0.72 - r() * h * 0.42, rr: h * (0.07 + r() * 0.06) }));
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={`M-2.4 0 Q${lean * 0.3} ${-h * 0.5} ${lean} ${-h} L${lean + 2} ${-h} Q${lean * 0.3 + 2.6} ${-h * 0.5} 2.4 0 Z`} fill="#ece6d8" />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${(lean * (i / 7) - 2).toFixed(1)} ${(-h * (0.12 + i * 0.13)).toFixed(1)} h${(2.5 + (i % 2) * 1.6).toFixed(1)}`} stroke="#2a2420" strokeWidth="1.3" strokeLinecap="round" />)}
      {leaves.map((b, i) => <ellipse key={i} cx={b.bx.toFixed(1)} cy={b.by.toFixed(1)} rx={b.rr.toFixed(1)} ry={(b.rr * 0.8).toFixed(1)} fill={i % 3 ? color : shade(color, -0.1)} opacity="0.92" />)}
      {leaves.slice(0, 5).map((b, i) => <ellipse key={`l${i}`} cx={(b.bx + light * b.rr * 0.3).toFixed(1)} cy={(b.by - b.rr * 0.3).toFixed(1)} rx={(b.rr * 0.45).toFixed(1)} ry={(b.rr * 0.35).toFixed(1)} fill={shade(color, 0.18)} opacity="0.7" />)}
    </g>
  );
}

/* lisière : arbres répartis irrégulièrement entre x0 et x1, pieds sur y (± jitter) */
export function TreeLine({ seed = 1, x0 = -20, x1 = 1020, y, jitter = 6, n = 30, h = [40, 70], kinds = ["conifer"], color = "#1d2f22", light = -1, snow, colors }) {
  const r = rng(seed);
  const trees = Array.from({ length: n }, (_, i) => {
    const x = x0 + ((i + r() * 0.8) / n) * (x1 - x0);
    return { x, y: y + (r() - 0.5) * jitter * 2, hh: h[0] + r() * (h[1] - h[0]), k: kinds[Math.floor(r() * kinds.length)], c: colors ? colors[Math.floor(r() * colors.length)] : color, sd: Math.floor(r() * 1000) };
  }).sort((a, b) => a.y - b.y);
  return (
    <g>
      {trees.map((t, i) => t.k === "conifer"
        ? <Conifer key={i} x={t.x} y={t.y} h={t.hh} color={t.c} light={light} snow={snow} />
        : t.k === "birch"
          ? <Birch key={i} x={t.x} y={t.y} h={t.hh} color={t.c} light={light} seed={t.sd} />
          : <Leafy key={i} x={t.x} y={t.y} s={t.hh / 100} color={t.c} light={light} seed={t.sd} trunk={shade(t.c, -0.18)} />)}
    </g>
  );
}

/* rocher à facettes */
export function Rock({ x, y, w = 60, h = 34, color = "#7a6e62", light = -1, seed = 1, moss }) {
  const r = rng(seed);
  const top = -h, j = () => (r() - 0.5) * w * 0.12;
  const pts = [[-w / 2, 0], [-w * 0.46 + j(), -h * 0.5 + j()], [-w * 0.22 + j(), top + j() * 0.5], [w * 0.12 + j(), top * 0.96 + j() * 0.5], [w * 0.44 + j(), -h * 0.46 + j()], [w / 2, 0]];
  const d = "M" + pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(" L") + " Q0 6 " + `${(-w / 2).toFixed(1)} 0 Z`;
  const ridge = light < 0 ? [pts[1], pts[2], pts[3]] : [pts[3], pts[4], pts[5]];
  const litD = `M${ridge[0][0].toFixed(1)} ${ridge[0][1].toFixed(1)} L${ridge[1][0].toFixed(1)} ${ridge[1][1].toFixed(1)} L${ridge[2][0].toFixed(1)} ${ridge[2][1].toFixed(1)} L${(ridge[1][0] * 0.4).toFixed(1)} ${(-h * 0.3).toFixed(1)} Z`;
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={-light * w * 0.12} cy="3" rx={w * 0.6} ry={h * 0.12} fill="#000" opacity="0.32" />
      <path d={d} fill={color} stroke={shade(color, -0.35)} strokeWidth="1" strokeLinejoin="round" />
      <path d={litD} fill={shade(color, 0.16)} opacity="0.85" />
      <path d={`M${(-light * w * 0.42).toFixed(1)} -2 Q${(-light * w * 0.2).toFixed(1)} ${(-h * 0.5).toFixed(1)} ${(-light * w * 0.05).toFixed(1)} ${(top * 0.8).toFixed(1)} L${(-light * w * 0.48).toFixed(1)} ${(-h * 0.4).toFixed(1)} Z`} fill={shade(color, -0.18)} opacity="0.6" />
      <path d={`M${(-w * 0.2).toFixed(1)} ${(-h * 0.35).toFixed(1)} l${(w * 0.12).toFixed(1)} ${(h * 0.12).toFixed(1)} M${(w * 0.1).toFixed(1)} ${(-h * 0.6).toFixed(1)} l${(w * 0.05).toFixed(1)} ${(h * 0.3).toFixed(1)}`} stroke={shade(color, -0.3)} strokeWidth="1" opacity="0.6" />
      {moss && <path d={`M${(-w * 0.45).toFixed(1)} -3 q${(w * 0.15).toFixed(1)} -8 ${(w * 0.3).toFixed(1)} -2 q${(w * 0.2).toFixed(1)} 4 ${(w * 0.45).toFixed(1)} -4 L${(w * 0.4).toFixed(1)} 0 L${(-w * 0.45).toFixed(1)} 0 Z`} fill={moss} opacity="0.85" />}
    </g>
  );
}

export function Grass({ x, y, s = 1, color = "#5d6b2e", seed = 1, n = 6, flower }) {
  const r = rng(seed);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none">
      {Array.from({ length: n }).map((_, i) => {
        const dx = (i - n / 2) * 2.4, hh = 10 + r() * 14, bend = (r() - 0.5) * 12;
        return <path key={i} d={`M${dx.toFixed(1)} 0 Q${(dx + bend * 0.3).toFixed(1)} ${(-hh * 0.6).toFixed(1)} ${(dx + bend).toFixed(1)} ${(-hh).toFixed(1)}`} stroke={i % 3 ? color : shade(color, 0.15)} />;
      })}
      {flower && <circle cx={(r() - 0.5) * 6} cy={-14 - r() * 6} r="2" fill={flower} stroke="none" />}
    </g>
  );
}

/* grain d'un sol : petits points de couleurs variées dans un rectangle */
export function Speckle({ seed = 1, x0 = 0, x1 = 1000, y0, y1, n = 160, colors = ["#000"], r: rr = [0.6, 1.8], opacity = 0.4, perspective = true }) {
  const r = rng(seed);
  return (
    <g opacity={opacity}>
      {Array.from({ length: n }).map((_, i) => {
        const t = r();
        const y = y0 + t * (y1 - y0);
        const k = perspective ? 0.45 + t * 0.9 : 1;
        return <ellipse key={i} cx={(x0 + r() * (x1 - x0)).toFixed(1)} cy={y.toFixed(1)} rx={((rr[0] + r() * (rr[1] - rr[0])) * k * 1.5).toFixed(2)} ry={((rr[0] + r() * (rr[1] - rr[0])) * k * 0.8).toFixed(2)} fill={colors[i % colors.length]} />;
      })}
    </g>
  );
}

/* reflet dans l'eau : symétrie autour de axisY, flou, assombri */
export function Reflect({ id, axisY, children, opacity = 0.45, blur = 2.5, tint = "#0a1a2a" }) {
  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`${id}-f`} x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation={`${blur * 0.4} ${blur}`} />
        </filter>
      </defs>
      <g filter={`url(#${id}-f)`} transform={`translate(0,${2 * axisY}) scale(1,-1)`}>
        {children}
      </g>
      <rect x="-40" y={axisY} width="1080" height="200" fill={tint} opacity="0.25" />
    </g>
  );
}

/* grande frondaison (arbre qui cadre la scène) : masse de bouquets ombrés */
export function Canopy({ cx, cy, rx, ry, color = "#2c4030", light = -1, seed = 1, n = 16, hi }) {
  const r = rng(seed);
  const H = hi || shade(color, 0.14);
  const blobs = Array.from({ length: n }, () => {
    const t = r() * Math.PI * 2, d = Math.sqrt(r());
    return { x: cx + Math.cos(t) * rx * d * 0.8, y: cy + Math.sin(t) * ry * d * 0.75, rr: (rx + ry) * (0.16 + r() * 0.12) };
  }).sort((a, b) => a.y - b.y);
  return (
    <g>
      <ellipse cx={cx} cy={cy + ry * 0.1} rx={rx * 0.92} ry={ry * 0.8} fill={shade(color, -0.12)} />
      {blobs.map((b, i) => <circle key={i} cx={b.x.toFixed(1)} cy={b.y.toFixed(1)} r={b.rr.toFixed(1)} fill={color} />)}
      {blobs.map((b, i) => <circle key={`h${i}`} cx={(b.x + light * b.rr * 0.26).toFixed(1)} cy={(b.y - b.rr * 0.28).toFixed(1)} r={(b.rr * 0.66).toFixed(1)} fill={H} opacity="0.32" />)}
      {blobs.filter((_, i) => i % 3 === 0).map((b, i) => <circle key={`s${i}`} cx={(b.x - light * b.rr * 0.35).toFixed(1)} cy={(b.y + b.rr * 0.4).toFixed(1)} r={(b.rr * 0.5).toFixed(1)} fill={shade(color, -0.16)} opacity="0.55" />)}
      {blobs.filter((_, i) => i % 4 === 1).map((b, i) => (
        <path key={`f${i}`} d={`M${(b.x + light * b.rr * 0.4).toFixed(1)} ${(b.y - b.rr * 0.5).toFixed(1)} q5 -7 12 -7 q-3 7 -12 7 Z`} fill={shade(H, 0.12)} opacity="0.8" />
      ))}
    </g>
  );
}
