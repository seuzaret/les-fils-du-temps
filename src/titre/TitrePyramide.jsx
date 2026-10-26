/* ============================================================
   ÉCRAN TITRE — « LA PYRAMIDE », l'image d'origine affinée
   ------------------------------------------------------------
   Même image et même équilibre que l'écran titre de départ : le
   désert, le ciel bleu, le soleil à droite, la grande pyramide
   surmontée d'une pyramide de verre qui fait sablier (même sommet,
   même largeur, symétrique), et le titre d'origine — lettres d'or qui
   flottent dans le vent, décalé à gauche sur les traits du sablier.
   Redessiné :
     · lumière cohérente : le soleil est à droite, la face droite est
       éclairée, la face gauche à l'ombre, l'ombre portée part à gauche ;
     · la pyramide : assises de pierre, joints des blocs, sable amassé
       au pied, pyramidion doré qui scintille ;
     · le sablier : la pyramide en est le bas ; au-dessus, le verre, le
       sable qui y reste, le col cerclé d'or et le filet qui tombe sur
       le pyramidion ; le verre du bas enveloppe la pyramide ;
     · la vie, lente : nuages, ibis, rayons du soleil, sable dans le vent.
   Une composition par forme d'écran (paysage, portrait, paysage bas).
   Mouvement réduit : tout est immobile.
   ============================================================ */
import { useMemo } from "react";
import useEcran from "../engine/useEcran.js";
import { rng } from "../engine/scenery.jsx";
import { CSS_TITRE, CINZEL, MenuTitre } from "./commun.jsx";

const REDUIT = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const SABLE = 55;                                      // hauteur du sable resté en haut du sablier

/* ───────── les compositions ─────────
   Paysage : celle de l'écran d'origine (viewBox 800 × 450 doublé) —
   sommet à 39 % de la largeur et 41 % de la hauteur, verre aussi haut
   que la pyramide. col : écart entre le col du sablier et le sommet. */
function compo(portrait, bas) {
  if (portrait) return {
    W: 900, H: 1600, hor: 930, soleil: [745, 480, 40], col: 26,
    pyr: { A: [450, 690], L: [110, 1000], F: [450, 1080], R: [790, 1000] },
  };
  if (bas) return {
    W: 1600, H: 900, hor: 600, soleil: [880, 205, 38], col: 22,
    pyr: { A: [470, 450], L: [170, 700], F: [470, 768], R: [770, 700] },
  };
  return {
    W: 1600, H: 900, hor: 570, soleil: [1340, 210, 50], col: 24,
    pyr: { A: [620, 372], L: [240, 704], F: [620, 790], R: [1000, 704] },
  };
}

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pts = (...p) => p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ");

/* ───────── la pyramide (faces, assises, joints, pyramidion) ───────── */
function Pyramide({ A, L, F, R }) {
  const n = 18;
  const a = rng(3);
  const assises = Array.from({ length: n - 1 }, (_, k) => (k + 1) / n);
  /* joints des blocs : petits traits entre deux assises, en quinconce */
  const joints = [];
  assises.forEach((t, k) => {
    if (t < 0.22) return;
    const t2 = k + 1 < assises.length ? assises[k + 1] : 1;
    const nb = Math.round(3 + t * 9);
    for (let j = 0; j < nb; j++) {
      const u = (j + 0.5 + (k % 2) * 0.5) / (nb + 0.5) + (a() - 0.5) * 0.04;
      [[L, F], [F, R]].forEach(([P, Q], face) => {
        const p1 = mix(mix(A, P, t), mix(A, Q, t), u);
        const p2 = mix(mix(A, P, t2), mix(A, Q, t2), u);
        joints.push({ face, d: `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}` });
      });
    }
  });
  const top = 0.075;                                   // le pyramidion
  const pL = mix(A, L, top), pF = mix(A, F, top), pR = mix(A, R, top);
  return (
    <g>
      <defs>
        <linearGradient id="tpy-lit" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#f8dc96" /><stop offset="1" stopColor="#d9a256" />
        </linearGradient>
        <linearGradient id="tpy-ombre" x1="1" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#b8824c" /><stop offset="1" stopColor="#8a5a32" />
        </linearGradient>
      </defs>
      <polygon points={pts(A, L, F)} fill="url(#tpy-ombre)" />
      <polygon points={pts(A, F, R)} fill="url(#tpy-lit)" />
      {/* un peu de bleu du ciel dans l'ombre */}
      <polygon points={pts(A, L, F)} fill="#5a6aa0" opacity="0.1" />
      {assises.map((t, k) => (
        <g key={k} stroke="#5a3814" strokeWidth="1" opacity={0.1 + t * 0.2}>
          <line x1={mix(A, L, t)[0]} y1={mix(A, L, t)[1]} x2={mix(A, F, t)[0]} y2={mix(A, F, t)[1]} />
          <line x1={mix(A, F, t)[0]} y1={mix(A, F, t)[1]} x2={mix(A, R, t)[0]} y2={mix(A, R, t)[1]} />
        </g>
      ))}
      {joints.map((j, k) => <path key={k} d={j.d} stroke="#5a3814" strokeWidth="0.8" opacity={j.face ? 0.2 : 0.16} />)}
      {/* arêtes : celle qui sépare l'ombre de la lumière accroche le soleil */}
      <line x1={A[0]} y1={A[1]} x2={F[0]} y2={F[1]} stroke="#fff2c8" strokeWidth="1.8" opacity="0.55" />
      <line x1={A[0]} y1={A[1]} x2={L[0]} y2={L[1]} stroke="#4a2c10" strokeWidth="1" opacity="0.3" />
      <line x1={A[0]} y1={A[1]} x2={R[0]} y2={R[1]} stroke="#fff2c8" strokeWidth="1" opacity="0.35" />
      {/* le pyramidion doré */}
      <polygon points={pts(A, pL, pF)} fill="#d89a2a" />
      <polygon points={pts(A, pF, pR)} fill="#ffd65a" />
      <line x1={A[0]} y1={A[1]} x2={pF[0]} y2={pF[1]} stroke="#fff6d0" strokeWidth="1.6" />
    </g>
  );
}

/* Un calque du dessin, même cadrage pour tous. Ce qui bouge (rayons, nuages, ibis,
   filet du sablier, sable dans le vent) est dans deux calques légers qui ont chacun
   leur couche (will-change) : sans cela, le moindre mouvement oblige le navigateur à
   repeindre tout le désert à chaque image (30 images/s au lieu de 60 en 1920 × 1080,
   mesuré sans carte graphique). */
function Calque({ c, anime = false, children }) {
  return (
    <svg viewBox={`0 0 ${c.W} ${c.H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none", willChange: anime ? "transform" : "auto" }}>
      {children}
    </svg>
  );
}

function Desert({ c }) {
  const { W, H, hor, soleil: [sx, sy, sr], pyr } = c;
  const { A, L, F, R } = pyr;
  /* le sable dans le vent : au ras du sol et un peu dans l'air, comme à l'origine */
  const grains = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    y: hor - 160 + ((i * 53) % (H - hor + 120)), d: 6 + (i % 5) * 1.5, r: 1 + (i % 3) * 0.7, dl: (i * 0.7) % 7,
  })), [H, hor]);
  /* l'ombre portée de la grande pyramide : courte (le soleil est haut), vers la gauche */
  const ombre = [[L[0] - (F[0] - L[0]) * 0.32, L[1] + (F[1] - L[1]) * 0.55], L, mix(L, F, 0.7), [L[0] + (F[0] - L[0]) * 0.35, F[1] + 6]];
  /* le sablier : la pyramide de verre est le reflet de la pyramide, posé sur la pointe,
     son col N un peu au-dessus du sommet. Au fond du verre, le sable qui reste. */
  const N = [A[0], A[1] - c.col];
  const reflet = (P) => [P[0], N[1] - (P[1] - A[1])];
  const B = [F[0], L[1] + R[1] - F[1]];                // coin arrière de la base
  const [vL, vF, vR, vB] = [L, F, R, B].map(reflet);
  const reste = SABLE / (N[1] - vL[1]);
  const [sL, sF, sR, sB] = [vL, vF, vR, vB].map((v) => mix(N, v, reste));
  /* le verre du bas enveloppe la pyramide : on n'en voit que les deux flancs */
  const bL = [L[0] - 18, L[1] + 2], bR = [R[0] + 18, R[1] + 2];
  return (
    <>
    <Calque c={c}>
      <defs>
        <linearGradient id="tpy-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c66a8" /><stop offset={(hor / H) * 0.55} stopColor="#5fa2d8" />
          <stop offset={(hor / H) * 0.85} stopColor="#a9d4ee" /><stop offset={hor / H} stopColor="#f6d9a0" /><stop offset="1" stopColor="#f6d9a0" />
        </linearGradient>
        <radialGradient id="tpy-soleil" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="1" /><stop offset="0.3" stopColor="#ffe08a" stopOpacity="0.7" /><stop offset="1" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tpy-sable" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eec27a" /><stop offset="1" stopColor="#c48a44" />
        </linearGradient>
        <linearGradient id="tpy-sable2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2cc88" /><stop offset="1" stopColor="#b87a3a" />
        </linearGradient>
        {/* le verre : plus net près du col, plus léger en montant (le titre reste lisible) */}
        <linearGradient id="tpy-verre" gradientUnits="userSpaceOnUse" x1="0" y1={vF[1]} x2="0" y2={N[1]}>
          <stop offset="0" stopColor="#eaf6ff" stopOpacity="0.06" /><stop offset="0.7" stopColor="#eaf6ff" stopOpacity="0.15" /><stop offset="1" stopColor="#eaf6ff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="tpy-arete" gradientUnits="userSpaceOnUse" x1="0" y1={vF[1]} x2="0" y2={N[1]}>
          <stop offset="0" stopColor="#fff0c0" stopOpacity="0.3" /><stop offset="0.6" stopColor="#fff0c0" stopOpacity="0.5" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="tpy-creux" gradientUnits="userSpaceOnUse" cx={N[0]} cy={(sL[1] + sR[1]) / 2} r={(sR[0] - sL[0]) / 2}>
          <stop offset="0" stopColor="#c98e48" /><stop offset="0.35" stopColor="#e4b066" /><stop offset="1" stopColor="#fbe2a8" />
        </radialGradient>
        <linearGradient id="tpy-arete-bas" gradientUnits="userSpaceOnUse" x1="0" y1={N[1]} x2="0" y2={L[1]}>
          <stop offset="0" stopColor="#fff0c0" stopOpacity="0.85" /><stop offset="1" stopColor="#fff0c0" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="tpy-brume" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dcaa" stopOpacity="0" /><stop offset="1" stopColor="#f6dcaa" stopOpacity="0.55" />
        </linearGradient>
        <filter id="tpy-doux" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        <linearGradient id="tpy-voile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1a34" stopOpacity="0.45" /><stop offset="0.3" stopColor="#0a1a34" stopOpacity="0" />
          <stop offset="0.82" stopColor="#1a0e04" stopOpacity="0" /><stop offset="1" stopColor="#1a0e04" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* le ciel et le soleil */}
      <rect width={W} height={H} fill="url(#tpy-ciel)" />
      <circle cx={sx} cy={sy} r={sr * 5.2} fill="url(#tpy-soleil)" />
      <circle cx={sx} cy={sy} r={sr} fill="#fff6dc" />
    </Calque>

    <Calque c={c} anime>
      {/* les rayons du soleil, qui tournent lentement */}
      <g transform={`translate(${sx},${sy})`} opacity="0.07">
        <g style={{ animation: REDUIT ? "none" : "tpyRayons 140s linear infinite", transformBox: "view-box", transformOrigin: "0 0" }}>
          {Array.from({ length: 14 }).map((_, k) => <path key={k} d={`M -12 0 L 12 0 L 0 ${-sr * (k % 2 ? 4.5 : 6.5)} Z`} fill="#fff4cc" transform={`rotate(${k * (360 / 14)})`} />)}
        </g>
      </g>

      {/* nuages lents */}
      {[[0.22, 0.12, 1], [0.58, 0.07, 0.8], [0.8, 0.2, 0.65]].map(([fx, fy, k], i) => (
        <g key={i} style={{ animation: REDUIT ? "none" : `tpyNuage ${170 + i * 40}s linear ${-i * 50}s infinite` }}>
          <g transform={`translate(${W * fx},${H * fy}) scale(${k})`} opacity="0.55">
            <ellipse cx="0" cy="0" rx="120" ry="16" fill="#ffffff" opacity="0.7" />
            <ellipse cx="-40" cy="-8" rx="60" ry="14" fill="#ffffff" opacity="0.6" />
            <ellipse cx="50" cy="-5" rx="70" ry="12" fill="#ffffff" opacity="0.55" />
          </g>
        </g>
      ))}
      {/* ibis qui planent */}
      {[[0.3, 0.3, 1], [0.34, 0.27, 0.8], [0.27, 0.34, 0.7]].map(([fx, fy, k], i) => (
        <g key={i} style={{ animation: REDUIT ? "none" : `tpyIbis 90s linear ${-30 - i * 1.5}s infinite` }}>
          <g transform={`translate(${W * fx},${H * fy}) scale(${k * (W > H ? 1 : 1.3)})`}>
            <path d="M -14 0 Q -7 -6 0 0 Q 7 -6 14 0" stroke="#2a3048" strokeWidth="2.2" fill="none" strokeLinecap="round">
              {!REDUIT && <animate attributeName="d" values="M -14 0 Q -7 -6 0 0 Q 7 -6 14 0;M -14 -3 Q -7 2 0 0 Q 7 2 14 -3;M -14 0 Q -7 -6 0 0 Q 7 -6 14 0" dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" />}
            </path>
          </g>
        </g>
      ))}

    </Calque>

    <Calque c={c}>
      {/* l'horizon : sable lointain, puis les dunes de l'écran d'origine — les plus
          lointaines bleutées dans la brume, les moyennes plus chaudes */}
      <path d={`M 0 ${hor} Q ${W * 0.3} ${hor - 8} ${W * 0.55} ${hor + 2} T ${W} ${hor - 4} L ${W} ${H} L 0 ${H} Z`} fill="url(#tpy-sable)" />
      <rect x="0" y={hor - 60} width={W} height="70" fill="url(#tpy-brume)" />
      <path d={`M 0 ${hor + 30} Q ${W * 0.15} ${hor - 20} ${W * 0.3} ${hor + 14} Q ${W * 0.43} ${hor + 40} ${W * 0.58} ${hor} Q ${W * 0.73} ${hor - 34} ${W * 0.88} ${hor + 6} Q ${W * 0.95} ${hor + 24} ${W} ${hor + 14} L ${W} ${hor + 60} L 0 ${hor + 60} Z`}
        fill="#a58aa8" opacity="0.35" />
      <path d={`M 0 ${hor + 70} Q ${W * 0.18} ${hor + 30} ${W * 0.38} ${hor + 60} Q ${W * 0.53} ${hor + 86} ${W * 0.68} ${hor + 50} Q ${W * 0.83} ${hor + 26} ${W} ${hor + 70} L ${W} ${hor + 120} L 0 ${hor + 120} Z`}
        fill="#c99060" opacity="0.5" />

      {/* dunes moyennes */}
      <path d={`M 0 ${hor + 96} Q ${W * 0.22} ${hor + 62} ${W * 0.46} ${hor + 88} Q ${W * 0.72} ${hor + 112} ${W} ${hor + 76} L ${W} ${H} L 0 ${H} Z`} fill="url(#tpy-sable2)" opacity="0.85" />

      {/* la grande pyramide, son ombre et le sable amassé à son pied */}
      <polygon points={pts(...ombre)} fill="#7a4a22" opacity="0.2" filter="url(#tpy-doux)" />
      <Pyramide {...pyr} />
      {(() => {
        /* le sable amassé au pied : une bande qui épouse la base (de L à F à R) */
        const k = 14;
        const dessus = `M ${L[0] - 30} ${L[1] + 4} Q ${(L[0] + F[0]) / 2} ${(L[1] + F[1]) / 2 - k} ${F[0]} ${F[1] - k * 0.8} Q ${(F[0] + R[0]) / 2} ${(F[1] + R[1]) / 2 - k} ${R[0] + 30} ${R[1] + 4}`;
        const dessous = `Q ${(F[0] + R[0]) / 2} ${(F[1] + R[1]) / 2 + 14} ${F[0]} ${F[1] + 12} Q ${(L[0] + F[0]) / 2} ${(L[1] + F[1]) / 2 + 14} ${L[0] - 30} ${L[1] + 4} Z`;
        return <path d={`${dessus} ${dessous}`} fill="#eec27a" opacity="0.95" />;
      })()}

      {/* le verre du haut : les deux faces avant, la droite plus claire (le soleil est à droite) */}
      <polygon points={pts(N, vL, vF)} fill="url(#tpy-verre)" />
      <polygon points={pts(N, vL, vF)} fill="#9cc4e8" opacity="0.07" />
      <polygon points={pts(N, vF, vR)} fill="url(#tpy-verre)" />
      {/* le sable qui reste au fond du verre, et son petit entonnoir */}
      <polygon points={pts(N, sL, sF)} fill="#c98e48" />
      <polygon points={pts(N, sF, sR)} fill="#eebd72" />
      <path d={`M ${sL[0]} ${sL[1]} Q ${N[0]} ${sF[1] + 5} ${sR[0]} ${sR[1]} Q ${N[0]} ${sB[1] + 6} ${sL[0]} ${sL[1]} Z`} fill="url(#tpy-creux)" />
      <g fill="none" strokeLinecap="round">
        <g stroke="url(#tpy-arete)" strokeWidth="2">
          <line x1={N[0]} y1={N[1]} x2={vL[0]} y2={vL[1]} /><line x1={N[0]} y1={N[1]} x2={vR[0]} y2={vR[1]} />
          <path d={`M ${vL[0]} ${vL[1]} L ${vF[0]} ${vF[1]} L ${vR[0]} ${vR[1]}`} />
        </g>
        <line x1={N[0]} y1={N[1]} x2={vF[0]} y2={vF[1]} stroke="url(#tpy-arete)" strokeWidth="1.2" />
        {/* un reflet du soleil sur la face droite */}
        <line x1={mix(N, vR, 0.18)[0] - 4} y1={mix(N, vR, 0.18)[1]} x2={mix(vF, vR, 0.5)[0] - 10} y2={mix(vF, vR, 0.5)[1] + 8}
          stroke="#ffffff" strokeWidth="3" opacity="0.13" />
      </g>
      {/* le verre du bas : ses deux flancs enveloppent la pyramide */}
      <g stroke="url(#tpy-arete-bas)" strokeWidth="1.4" fill="none">
        <line x1={N[0]} y1={N[1]} x2={bL[0]} y2={bL[1]} /><line x1={N[0]} y1={N[1]} x2={bR[0]} y2={bR[1]} />
      </g>
      {/* la dune du premier plan et ses rides */}
      <path d={`M 0 ${H - (H - hor) * 0.36} Q ${W * 0.25} ${H - (H - hor) * 0.46} ${W * 0.5} ${H - (H - hor) * 0.38} Q ${W * 0.75} ${H - (H - hor) * 0.3} ${W} ${H - (H - hor) * 0.42} L ${W} ${H} L 0 ${H} Z`} fill="url(#tpy-sable)" />
      {Array.from({ length: 8 }).map((_, k) => {
        const y = H - (H - hor) * (0.3 - k * 0.032), x = (k * 0.17 % 1) * W;
        return <path key={k} d={`M ${x} ${y} q ${W * 0.06} -5 ${W * 0.12} 0`} stroke="#8a5822" strokeWidth="1.2" fill="none" opacity="0.3" strokeLinecap="round" />;
      })}
      <rect width={W} height={H} fill="url(#tpy-voile)" />
    </Calque>

    <Calque c={c} anime>
      {/* l'éclat du pyramidion */}
      <circle cx={A[0] + 4} cy={A[1] + 14} r="3" fill="#fffbe8" opacity={REDUIT ? 0 : 1}>
        {!REDUIT && <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.8;0.86;0.92;1" dur="6s" repeatCount="indefinite" />}
      </circle>
      {/* le filet de sable qui tombe du col sur le pyramidion, et le col cerclé d'or */}
      <line x1={N[0]} y1={N[1]} x2={A[0]} y2={A[1] - 1} stroke="#ffe39a" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
        {!REDUIT && <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.6s" repeatCount="indefinite" />}
      </line>
      {Array.from({ length: 4 }).map((_, k) => (
        <circle key={k} cx={N[0]} cy={N[1]} r="1.4" fill="#fff8dc" opacity={REDUIT ? 0 : 1}>
          {!REDUIT && <animate attributeName="cy" values={`${N[1]};${A[1] - 1}`} dur="0.9s" begin={`${k * 0.22}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <ellipse cx={N[0]} cy={N[1]} rx="9" ry="2.8" fill="#e0a83e" stroke="#fff2c8" strokeWidth="0.8" />
      {/* sable dans le vent */}
      {grains.map((g, i) => (
        <circle key={i} cx={W + 20} cy={g.y} r={g.r} fill="#fbe2a8" opacity="0.7"
          style={{ animation: REDUIT ? "none" : `tpyVent ${g.d}s linear ${-g.dl}s infinite` }} />
      ))}
    </Calque>
    </>
  );
}

/* Le titre de l'écran d'origine : une lettre = un bloc qui flotte (une vague lente
   parcourt le mot), or et ambre en alternance, une lueur qui respire. Les lettres
   d'un même mot restent ensemble : le titre ne se coupe qu'entre deux mots. */
function TitreFlottant({ taille, align }) {
  let i = 0;
  const lettre = (ch) => {
    const k = i++;
    return (
      <span key={k} className="tpy-lettre" style={{ display: "inline-block", color: k % 2 === 0 ? "#ffd166" : "#e8a24a",
        animationDelay: `${(-k * 0.297).toFixed(3)}s, ${(-k * 0.267).toFixed(3)}s` }}>{ch}</span>
    );
  };
  const mots = "Les fils du temps".split(" ");
  return (
    <h1 style={{ margin: 0, fontFamily: CINZEL, fontWeight: 700, fontSize: taille, lineHeight: 1.08, letterSpacing: "0.09em",
      textTransform: "uppercase", textAlign: align }}>
      {mots.map((m, w) => (
        <span key={w}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>{m.split("").map(lettre)}</span>
          {w < mots.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}

export default function TitrePyramide({ m }) {
  const { portrait, bas } = useEcran();
  const paysageBas = bas && !portrait;
  const c = useMemo(() => compo(portrait, paysageBas), [portrait, paysageBas]);
  const titre = portrait ? "min(13vw, 58px)" : paysageBas ? "34px" : "clamp(38px, 6.2vw, 72px)";
  const lueur = (f) => `0 0 ${(12 + 4.8 * f).toFixed(1)}px rgba(255,209,102,${(0.62 + 0.23 * f).toFixed(2)}), 0 2px 22px rgba(232,150,74,${(0.5 + 0.12 * f).toFixed(2)})`;
  return (
    <div style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", background: "#2c66a8" }}>
      <style>{CSS_TITRE + `
        @keyframes tpyRayons { to { transform: rotate(360deg); } }
        @keyframes tpyNuage { from { transform: translateX(${c.W * 0.25}px); } to { transform: translateX(-${c.W * 0.3}px); } }
        @keyframes tpyIbis { from { transform: translate(${c.W * 0.75}px, 10px); } to { transform: translate(-${c.W * 0.45}px, -30px); } }
        @keyframes tpyVent { from { transform: translateX(0); opacity: 0; } 10% { opacity: 0.8; } 85% { opacity: 0.8; } to { transform: translateX(-${c.W + 60}px); opacity: 0; } }
        @keyframes tpyFlotte { 0%, 100% { transform: translateY(-0.085em); } 50% { transform: translateY(0.085em); } }
        @keyframes tpyLueur { 0%, 100% { text-shadow: ${lueur(0)}; } 50% { text-shadow: ${lueur(1)}; } }
        .tpy-lettre { text-shadow: ${lueur(0.5)}; animation: tpyFlotte 3.4s ease-in-out infinite, tpyLueur 4.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tpy-lettre { animation: none; } }`}</style>
      <Desert c={c} />
      <div style={{ position: "relative", zIndex: 2, minHeight: "100dvh", boxSizing: "border-box", display: "flex",
        flexDirection: paysageBas ? "row" : "column", alignItems: paysageBas ? "flex-start" : "center", justifyContent: "space-between",
        gap: 12, padding: portrait ? "6vh 16px 18px" : paysageBas ? "14px 20px" : "32px 20px 4vh" }}>
        {/* comme à l'origine : décalé à gauche, sur les traits du sablier (centré en portrait) */}
        <div style={{ alignSelf: portrait ? "center" : "flex-start", marginLeft: portrait ? 0 : paysageBas ? "3vw" : "20vw", marginTop: portrait ? 0 : 4,
          maxWidth: paysageBas ? "52%" : "none", animation: "ttIn 1.1s ease-out both" }}>
          <TitreFlottant taille={titre} align={portrait ? "center" : "left"} />
        </div>
        <MenuTitre m={m} largeur={paysageBas ? 330 : portrait ? 380 : 440} compact={portrait || paysageBas} />
      </div>
    </div>
  );
}
