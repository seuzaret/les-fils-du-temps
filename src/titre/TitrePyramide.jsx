/* ============================================================
   ÉCRAN TITRE — « LA PYRAMIDE », l'image d'origine affinée (?titre=p)
   ------------------------------------------------------------
   Même idée que l'écran titre de départ (le désert, le ciel bleu, le
   soleil, une grande pyramide surmontée d'une pyramide de verre qui
   fait sablier), redessinée :
     · lumière cohérente : le soleil est à droite, la face droite est
       éclairée, la face gauche à l'ombre, l'ombre portée part à gauche ;
     · la pyramide : assises de pierre, joints des blocs, sable amassé
       au pied, pyramidion doré qui scintille ;
     · la profondeur : deux pyramides lointaines dans la brume, le Nil,
       ses palmiers et une felouque à l'horizon, des dunes étagées ;
     · la vie, lente : nuages qui passent, ibis qui planent, rayons du
       soleil, quelques grains de sable dans le vent ;
     · le sablier : la pyramide est le bas du sablier ; au-dessus, un
       verre posé sur la pointe, le sable qui y reste, le col cerclé d'or
       et le filet qui tombe sur le pyramidion (?sablier=0 pour l'enlever) ;
     · le titre centré (Cinzel, reflet lent, sans ondulation),
       l'accroche, le menu lisible, la musique du titre.
   Une composition par forme d'écran (paysage, portrait, paysage bas).
   Mouvement réduit : tout est immobile.
   ============================================================ */
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import useEcran from "../engine/useEcran.js";
import { rng } from "../engine/scenery.jsx";
import { CSS_TITRE, TitreLettres, Accroche, MenuTitre } from "./commun.jsx";

const REDUIT = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const SABLE = 55;                                      // hauteur du sable resté en haut du sablier
const SABLIER = (() => { try { return new URLSearchParams(window.location.search).get("sablier") !== "0"; } catch { return true; } })();

/* ───────── les compositions ───────── */
function compo(portrait, bas) {
  /* col : hauteur du col du sablier au-dessus du pyramidion ; verre : bord haut du verre (hors cadre) */
  if (portrait) return {
    W: 900, H: 1600, hor: 940, soleil: [720, 660, 44], col: 30, verre: -130,
    pyr: { A: [455, 592], L: [100, 968], F: [440, 1062], R: [800, 973] },
    loin: [{ A: [772, 874], L: [726, 940], F: [770, 950], R: [814, 941] }],
    nil: { x0: 600, x1: 940, y: 940 },
  };
  if (bas) return {
    W: 1600, H: 900, hor: 600, soleil: [880, 230, 40], col: 24, verre: -20,
    pyr: { A: [450, 335], L: [140, 655], F: [440, 742], R: [740, 660] },
    loin: [{ A: [890, 480], L: [810, 604], F: [886, 622], R: [962, 606] }, { A: [1000, 520], L: [958, 604], F: [998, 614], R: [1040, 606] }],
    nil: { x0: -20, x1: 130, y: 600 },
  };
  return {
    W: 1600, H: 900, hor: 565, soleil: [1250, 205, 46], col: 28, verre: -100,
    pyr: { A: [610, 290], L: [270, 620], F: [600, 712], R: [940, 617] },
    loin: [{ A: [1095, 438], L: [1000, 570], F: [1090, 590], R: [1182, 572] }, { A: [1230, 478], L: [1178, 570], F: [1228, 582], R: [1280, 572] }],
    nil: { x0: -20, x1: 300, y: 566 },
  };
}

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pts = (...p) => p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ");

/* ───────── une pyramide (faces, assises, joints, base) ───────── */
function Pyramide({ A, L, F, R, id, loin = false, graine = 1 }) {
  const n = loin ? 7 : 18;
  const a = rng(graine);
  const assises = Array.from({ length: n - 1 }, (_, k) => (k + 1) / n);
  /* joints des blocs : petits traits entre deux assises, en quinconce */
  const joints = [];
  if (!loin) {
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
  }
  const top = 0.075;                                   // le pyramidion
  const pA = A, pL = mix(A, L, top), pF = mix(A, F, top), pR = mix(A, R, top);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-lit`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={loin ? "#ead2a6" : "#f8dc96"} /><stop offset="1" stopColor={loin ? "#d6b88c" : "#d9a256"} />
        </linearGradient>
        <linearGradient id={`${id}-ombre`} x1="1" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={loin ? "#bca486" : "#b8824c"} /><stop offset="1" stopColor={loin ? "#a89070" : "#8a5a32"} />
        </linearGradient>
      </defs>
      <polygon points={pts(A, L, F)} fill={`url(#${id}-ombre)`} />
      <polygon points={pts(A, F, R)} fill={`url(#${id}-lit)`} />
      {/* un peu de bleu du ciel dans l'ombre */}
      <polygon points={pts(A, L, F)} fill="#5a6aa0" opacity={loin ? 0.08 : 0.1} />
      {assises.map((t, k) => (
        <g key={k} stroke="#5a3814" strokeWidth={loin ? 0.8 : 1} opacity={(loin ? 0.12 : 0.1) + t * (loin ? 0.1 : 0.2)}>
          <line x1={mix(A, L, t)[0]} y1={mix(A, L, t)[1]} x2={mix(A, F, t)[0]} y2={mix(A, F, t)[1]} />
          <line x1={mix(A, F, t)[0]} y1={mix(A, F, t)[1]} x2={mix(A, R, t)[0]} y2={mix(A, R, t)[1]} />
        </g>
      ))}
      {joints.map((j, k) => <path key={k} d={j.d} stroke="#5a3814" strokeWidth="0.8" opacity={j.face ? 0.2 : 0.16} />)}
      {/* arêtes : celle qui sépare l'ombre de la lumière accroche le soleil */}
      <line x1={A[0]} y1={A[1]} x2={F[0]} y2={F[1]} stroke="#fff2c8" strokeWidth={loin ? 1 : 1.8} opacity="0.55" />
      <line x1={A[0]} y1={A[1]} x2={L[0]} y2={L[1]} stroke="#4a2c10" strokeWidth="1" opacity="0.3" />
      <line x1={A[0]} y1={A[1]} x2={R[0]} y2={R[1]} stroke="#fff2c8" strokeWidth="1" opacity="0.35" />
      {!loin && (
        <g>
          {/* le pyramidion doré */}
          <polygon points={pts(pA, pL, pF)} fill="#d89a2a" />
          <polygon points={pts(pA, pF, pR)} fill="#ffd65a" />
          <line x1={pA[0]} y1={pA[1]} x2={pF[0]} y2={pF[1]} stroke="#fff6d0" strokeWidth="1.6" />
          <circle cx={pA[0] + 4} cy={pA[1] + 14} r="3" fill="#fffbe8">
            {!REDUIT && <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.8;0.86;0.92;1" dur="6s" repeatCount="indefinite" />}
          </circle>
        </g>
      )}
    </g>
  );
}

/* palmier en silhouette */
function Palmier({ x, y, h, s = 1 }) {
  const t = [x + h * 0.12 * s, y - h];
  return (
    <g>
      <path d={`M${x} ${y} Q${x + h * 0.05 * s} ${y - h * 0.5} ${t[0]} ${t[1]}`} stroke="#3a5a2a" strokeWidth={h * 0.06} fill="none" strokeLinecap="round" />
      {[-150, -110, -60, -20, 25, 70, 120, 160].map((ang, k) => {
        const r = h * (0.42 + (k % 3) * 0.05), rad = (ang * Math.PI) / 180;
        const e = [t[0] + Math.cos(rad) * r, t[1] + Math.sin(rad) * r * 0.55 + r * 0.25];
        return <path key={k} d={`M${t[0]} ${t[1]} Q${(t[0] + e[0]) / 2} ${Math.min(t[1], e[1]) - r * 0.22} ${e[0]} ${e[1]}`} stroke={k % 2 ? "#4e7a32" : "#3f6a2a"} strokeWidth={h * 0.045} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
}

function Desert({ c }) {
  const { W, H, hor, soleil: [sx, sy, sr], pyr, loin, nil } = c;
  const a = useMemo(() => rng(31), []);
  const grains = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ y: hor + 20 + ((i * 53) % (H - hor - 40)), d: 7 + (i % 5) * 1.6, r: 1 + (i % 3) * 0.7, dl: (i * 0.7) % 7 })), [H, hor]);
  const palmiers = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ x: nil.x0 + 20 + i * ((nil.x1 - nil.x0 - 40) / 8) + (a() - 0.5) * 16, h: 46 + a() * 34, s: a() < 0.5 ? -1 : 1 })), [nil.x0, nil.x1]);
  /* l'ombre portée de la grande pyramide : courte (le soleil est haut), vers la gauche */
  const ombre = [[pyr.L[0] - (pyr.F[0] - pyr.L[0]) * 0.32, pyr.L[1] + (pyr.F[1] - pyr.L[1]) * 0.55], pyr.L, mix(pyr.L, pyr.F, 0.7), [pyr.L[0] + (pyr.F[0] - pyr.L[0]) * 0.35, pyr.F[1] + 6]];
  /* le sablier : une pyramide de verre posée sur la pointe, au-dessus du pyramidion.
     Son col N est un peu au-dessus du sommet ; son bord haut (vL vF vR vB) est vu
     d'en haut comme la base de la pyramide (le coin avant plus bas que les côtés).
     Au fond du verre, le sable qui reste ; du col au pyramidion, le filet qui tombe. */
  const { A, L, F, R } = pyr;
  const N = [A[0], A[1] - c.col];
  const d = F[1] - (L[1] + R[1]) / 2;
  const vL = [L[0] + 30, c.verre], vR = [R[0] - 30, c.verre], vF = [F[0], c.verre + d], vB = [L[0] + R[0] - F[0], c.verre - d];
  const reste = SABLE / (N[1] - c.verre);
  const [sL, sF, sR, sB] = [vL, vF, vR, vB].map((v) => mix(N, v, reste));
  /* le verre du bas enveloppe la pyramide : on n'en voit que les deux flancs */
  const bL = [L[0] - 18, L[1] + 2], bR = [R[0] + 18, R[1] + 2];
  return (
    <g>
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
        <linearGradient id="tpy-eau" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec4e0" /><stop offset="1" stopColor="#3f86b0" />
        </linearGradient>
        {/* le verre : plus net près du col, plus léger en montant (le titre reste lisible) */}
        <linearGradient id="tpy-verre" gradientUnits="userSpaceOnUse" x1="0" y1={c.verre} x2="0" y2={N[1]}>
          <stop offset="0" stopColor="#eaf6ff" stopOpacity="0.05" /><stop offset="0.7" stopColor="#eaf6ff" stopOpacity="0.14" /><stop offset="1" stopColor="#eaf6ff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="tpy-arete" gradientUnits="userSpaceOnUse" x1="0" y1={c.verre} x2="0" y2={N[1]}>
          <stop offset="0" stopColor="#fff0c0" stopOpacity="0.22" /><stop offset="0.6" stopColor="#fff0c0" stopOpacity="0.5" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0.95" />
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

      {/* le ciel, le soleil et ses rayons */}
      <rect width={W} height={H} fill="url(#tpy-ciel)" />
      <g transform={`translate(${sx},${sy})`} opacity="0.07">
        <g style={{ animation: REDUIT ? "none" : "tpyRayons 140s linear infinite", transformBox: "view-box", transformOrigin: "0 0" }}>
          {Array.from({ length: 14 }).map((_, k) => <path key={k} d={`M -12 0 L 12 0 L 0 ${-sr * (k % 2 ? 4.5 : 6.5)} Z`} fill="#fff4cc" transform={`rotate(${k * (360 / 14)})`} />)}
        </g>
      </g>
      <circle cx={sx} cy={sy} r={sr * 5.2} fill="url(#tpy-soleil)" />
      <circle cx={sx} cy={sy} r={sr} fill="#fff6dc" />

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
      {[[0.3, 0.3, 1], [0.34, 0.27, 0.8], [0.27, 0.34, 0.7], [0.37, 0.33, 0.6]].map(([fx, fy, k], i) => (
        <g key={i} style={{ animation: REDUIT ? "none" : `tpyIbis 90s linear ${-38 - i * 1.5}s infinite` }}>
          <g transform={`translate(${W * fx},${H * fy}) scale(${k * (W > H ? 1 : 1.3)})`}>
            <path d="M -14 0 Q -7 -6 0 0 Q 7 -6 14 0" stroke="#2a3048" strokeWidth="2.2" fill="none" strokeLinecap="round">
              {!REDUIT && <animate attributeName="d" values="M -14 0 Q -7 -6 0 0 Q 7 -6 14 0;M -14 -3 Q -7 2 0 0 Q 7 2 14 -3;M -14 0 Q -7 -6 0 0 Q 7 -6 14 0" dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" />}
            </path>
          </g>
        </g>
      ))}

      {/* l'horizon : sable lointain, brume, le Nil et ses palmiers */}
      <path d={`M 0 ${hor} Q ${W * 0.3} ${hor - 8} ${W * 0.55} ${hor + 2} T ${W} ${hor - 4} L ${W} ${H} L 0 ${H} Z`} fill="url(#tpy-sable)" />
      <path d={`M 0 ${hor + 6} Q ${W * 0.2} ${hor - 14} ${W * 0.42} ${hor + 4} Q ${W * 0.7} ${hor + 22} ${W} ${hor} L ${W} ${hor + 40} L 0 ${hor + 40} Z`} fill="#c9a2a0" opacity="0.32" />
      <rect x="0" y={hor - 60} width={W} height="70" fill="url(#tpy-brume)" />
      <g>
        <path d={`M ${nil.x0} ${nil.y + 4} Q ${(nil.x0 + nil.x1) / 2} ${nil.y - 2} ${nil.x1} ${nil.y + 6} L ${nil.x1} ${nil.y + 14} Q ${(nil.x0 + nil.x1) / 2} ${nil.y + 10} ${nil.x0} ${nil.y + 16} Z`} fill="url(#tpy-eau)" />
        <path d={`M ${nil.x0 + 20} ${nil.y + 9} L ${nil.x1 - 30} ${nil.y + 9}`} stroke="#e8f8ff" strokeWidth="1.2" opacity="0.6" strokeDasharray="10 14" />
        {palmiers.map((p, i) => <Palmier key={i} x={p.x} y={nil.y + 4} h={p.h} s={p.s} />)}
        {/* une felouque sur le fleuve */}
        <g transform={`translate(${nil.x0 + (nil.x1 - nil.x0) * 0.55},${nil.y + 8})`}>
          <path d="M -16 0 L 16 0 L 11 5 L -11 5 Z" fill="#5a3a20" />
          <path d="M 0 0 L 0 -34 L 18 -2 Z" fill="#fbf3e2" />
          <path d="M 0 -34 L -10 -6" stroke="#5a3a20" strokeWidth="1" />
        </g>
      </g>
      {/* les pyramides lointaines, dans la brume */}
      {loin.map((p, i) => <Pyramide key={i} {...p} id={`tpy-l${i}`} loin graine={7 + i} />)}
      <rect x="0" y={hor - 140} width={W} height="150" fill="url(#tpy-brume)" opacity="0.5" />

      {/* dunes moyennes */}
      <path d={`M 0 ${hor + 70} Q ${W * 0.22} ${hor + 40} ${W * 0.46} ${hor + 64} Q ${W * 0.72} ${hor + 88} ${W} ${hor + 52} L ${W} ${H} L 0 ${H} Z`} fill="url(#tpy-sable2)" opacity="0.85" />

      {/* la grande pyramide, son ombre et le sable amassé à son pied */}
      <polygon points={pts(...ombre)} fill="#7a4a22" opacity="0.2" filter="url(#tpy-doux)" />
      <Pyramide {...pyr} id="tpy-p" graine={3} />
      {(() => {
        /* le sable amassé au pied : une bande qui épouse la base (de L à F à R) */
        const { L, F, R } = pyr, k = 14;
        const haut = `M ${L[0] - 30} ${L[1] + 4} Q ${(L[0] + F[0]) / 2} ${(L[1] + F[1]) / 2 - k} ${F[0]} ${F[1] - k * 0.8} Q ${(F[0] + R[0]) / 2} ${(F[1] + R[1]) / 2 - k} ${R[0] + 30} ${R[1] + 4}`;
        const bas = `Q ${(F[0] + R[0]) / 2} ${(F[1] + R[1]) / 2 + 14} ${F[0]} ${F[1] + 12} Q ${(L[0] + F[0]) / 2} ${(L[1] + F[1]) / 2 + 14} ${L[0] - 30} ${L[1] + 4} Z`;
        return <path d={`${haut} ${bas}`} fill="#eec27a" opacity="0.95" />;
      })()}
      {SABLIER && (
        <g>
          {/* le verre du haut : la silhouette entière (on voit les faces arrière à travers),
              puis les deux faces avant, la droite plus claire (le soleil est à droite) */}
          <polygon points={pts(N, vL, vB, vR)} fill="url(#tpy-verre)" />
          <polygon points={pts(N, vL, vF)} fill="#9cc4e8" opacity="0.08" />
          <polygon points={pts(N, vF, vR)} fill="url(#tpy-verre)" />
          {/* le sable qui reste au fond du verre du haut, et son petit entonnoir */}
          <polygon points={pts(N, sL, sF)} fill="#c98e48" />
          <polygon points={pts(N, sF, sR)} fill="#eebd72" />
          {/* la surface du sable se creuse vers le col */}
          <path d={`M ${sL[0]} ${sL[1]} Q ${N[0]} ${sF[1] + 5} ${sR[0]} ${sR[1]} Q ${N[0]} ${sB[1] + 6} ${sL[0]} ${sL[1]} Z`} fill="url(#tpy-creux)" />
          {/* le verre près du col, bombé, qui accroche la lumière */}
          <polygon points={pts(N, mix(N, vL, 0.3), mix(N, vF, 0.3), mix(N, vR, 0.3))} fill="#f4fbff" opacity="0.1" />
          {/* les arêtes : flancs et bord avant en or pâle, arêtes arrière à peine */}
          <g fill="none" strokeLinecap="round">
            <path d={`M ${vL[0]} ${vL[1]} L ${vB[0]} ${vB[1]} L ${vR[0]} ${vR[1]}`} stroke="#fff0c0" strokeWidth="1" opacity="0.14" />
            <line x1={N[0]} y1={N[1]} x2={vB[0]} y2={vB[1]} stroke="#fff0c0" strokeWidth="1" opacity="0.14" />
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
          {/* le col, cerclé d'or, et le filet de sable qui tombe sur le pyramidion */}
          <line x1={N[0]} y1={N[1]} x2={A[0]} y2={A[1] - 1} stroke="#ffe39a" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
            {!REDUIT && <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.6s" repeatCount="indefinite" />}
          </line>
          {Array.from({ length: 4 }).map((_, k) => (
            <circle key={k} cx={N[0]} cy={N[1]} r="1.4" fill="#fff8dc" opacity={REDUIT ? 0 : 1}>
              {!REDUIT && <animate attributeName="cy" values={`${N[1]};${A[1] - 1}`} dur="0.9s" begin={`${k * 0.22}s`} repeatCount="indefinite" />}
            </circle>
          ))}
          <ellipse cx={N[0]} cy={N[1]} rx="9" ry="2.8" fill="#e0a83e" stroke="#fff2c8" strokeWidth="0.8" />
        </g>
      )}

      {/* la dune du premier plan, ses rides et ses cailloux */}
      <path d={`M 0 ${H - (H - hor) * 0.36} Q ${W * 0.25} ${H - (H - hor) * 0.46} ${W * 0.5} ${H - (H - hor) * 0.38} Q ${W * 0.75} ${H - (H - hor) * 0.3} ${W} ${H - (H - hor) * 0.42} L ${W} ${H} L 0 ${H} Z`} fill="url(#tpy-sable)" />
      {Array.from({ length: 8 }).map((_, k) => {
        const y = H - (H - hor) * (0.3 - k * 0.032), x = (k * 0.17 % 1) * W;
        return <path key={k} d={`M ${x} ${y} q ${W * 0.06} -5 ${W * 0.12} 0`} stroke="#8a5822" strokeWidth="1.2" fill="none" opacity="0.3" strokeLinecap="round" />;
      })}
      {/* grains de sable dans le vent */}
      {grains.map((g, i) => (
        <circle key={i} cx={W + 20} cy={g.y} r={g.r} fill="#fbe2a8" opacity="0.7"
          style={{ animation: REDUIT ? "none" : `tpyVent ${g.d}s linear ${-g.dl}s infinite` }} />
      ))}
      <rect width={W} height={H} fill="url(#tpy-voile)" />
    </g>
  );
}

/* Le sable du sablier doit passer sous le titre et l'accroche, quelle que soit la taille
   de l'écran : on mesure les lignes de texte qui le surplombent et on descend la pyramide
   (et le col) d'autant. Mesuré au premier affichage, au chargement des polices et au
   redimensionnement. */
function useDescente(texte, c) {
  const [dy, setDy] = useState(0);
  useLayoutEffect(() => {
    if (!SABLIER) return undefined;
    let vivant = true;
    const calc = () => {
      const el = texte.current;
      if (!vivant || !el) return;
      const s = Math.max(innerWidth / c.W, innerHeight / c.H), ox = (innerWidth - c.W * s) / 2, oy = (innerHeight - c.H * s) / 2;
      const { A, L, R } = c.pyr, N = A[1] - c.col, haut = N - SABLE;
      const demi = ((R[0] - L[0]) / 2) * (SABLE / (N - c.verre)) + 14;
      /* seulement les lignes de texte (les boîtes des blocs prennent toute la largeur) */
      const parcours = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), r = document.createRange();
      let besoin = 0;
      for (let t = parcours.nextNode(); t; t = parcours.nextNode()) {
        r.selectNodeContents(t);
        for (const b of r.getClientRects()) {
          const x0 = (b.left - ox) / s, x1 = (b.right - ox) / s;
          if (b.width && x1 > A[0] - demi && x0 < A[0] + demi) besoin = Math.max(besoin, (b.bottom - oy) / s + 12 - haut);
        }
      }
      setDy(Math.min(160, Math.max(0, Math.round(besoin))));
    };
    calc();
    document.fonts?.ready.then(calc);
    window.addEventListener("resize", calc);
    return () => { vivant = false; window.removeEventListener("resize", calc); };
  }, [texte, c]);
  return dy;
}

export default function TitrePyramide({ m }) {
  const { portrait, bas } = useEcran();
  const paysageBas = bas && !portrait;
  const base = useMemo(() => compo(portrait, paysageBas), [portrait, paysageBas]);
  const texte = useRef(null);
  const dy = useDescente(texte, base);
  const c = useMemo(() => {
    if (!dy) return base;
    const descend = (p) => [p[0], p[1] + dy];
    const { A, L, F, R } = base.pyr;
    return { ...base, pyr: { A: descend(A), L: descend(L), F: descend(F), R: descend(R) } };
  }, [base, dy]);
  const titre = portrait ? "min(14vw, 62px)" : paysageBas ? "36px" : "clamp(44px, 5.4vw, 84px)";
  return (
    <div style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", background: "#2c66a8" }}>
      <style>{CSS_TITRE + `
        @keyframes tpyRayons { to { transform: rotate(360deg); } }
        @keyframes tpyNuage { from { transform: translateX(${c.W * 0.25}px); } to { transform: translateX(-${c.W * 0.3}px); } }
        @keyframes tpyIbis { from { transform: translate(${c.W * 0.75}px, 10px); } to { transform: translate(-${c.W * 0.45}px, -30px); } }
        @keyframes tpyVent { from { transform: translateX(0); opacity: 0; } 10% { opacity: 0.8; } 85% { opacity: 0.8; } to { transform: translateX(-${c.W + 60}px); opacity: 0; } }`}</style>
      <svg viewBox={`0 0 ${c.W} ${c.H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
        <Desert c={c} />
      </svg>
      <div style={{ position: "relative", zIndex: 2, minHeight: "100dvh", boxSizing: "border-box", display: "flex",
        flexDirection: paysageBas ? "row" : "column", alignItems: paysageBas ? "flex-start" : "center", justifyContent: "space-between",
        gap: 12, padding: portrait ? "6vh 16px 18px" : paysageBas ? "14px 20px" : "4.5vh 24px 4vh" }}>
        <div ref={texte} style={{ width: "100%", maxWidth: paysageBas ? "55%" : 980, animation: "ttIn 1.1s ease-out both" }}>
          <TitreLettres taille={titre} align={paysageBas ? "left" : "center"} />
          <Accroche align={paysageBas ? "left" : "center"} petit={paysageBas || portrait} />
        </div>
        <MenuTitre m={m} largeur={paysageBas ? 330 : portrait ? 380 : 440} compact={portrait || paysageBas} />
      </div>
    </div>
  );
}
