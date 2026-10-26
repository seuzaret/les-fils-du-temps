/* ============================================================
   ÉCRAN TITRE — maquette A « LE FIL » (?titre=a)
   ------------------------------------------------------------
   Le titre du jeu, dessiné : un fil d'or traverse la nuit, avec
   dix perles, une par époque (le support de communication de
   chacune, au trait). MARTINE le parcourt de −18 000 à aujourd'hui :
   son écran de bord affiche la date de l'époque qu'elle traverse,
   le fil s'allume derrière elle, chaque perle s'éclaire à son
   passage, une traînée de tachyons la suit. Derrière, un grand
   cadran d'horloge tourne à l'envers, très pâle.
   Animation pilotée en JS (requestAnimationFrame, attributs posés
   directement sur le SVG : React ne re-rend qu'au changement
   d'époque). Mouvement réduit : tout est allumé, MARTINE immobile.
   ============================================================ */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "../engine/Martine.jsx";
import useEcran from "../engine/useEcran.js";
import { rng } from "../engine/scenery.jsx";
import { EPOQUES_TITRE, IconeEpoque } from "./icones.jsx";
import { CSS_TITRE, CINZEL, TitreLettres, Accroche, MenuTitre } from "./commun.jsx";

const DUREE = 26;          // s : un aller de MARTINE, de −18 000 à aujourd'hui
const PAUSE = 3;           // s : le fil reste allumé, puis tout recommence
const REDUIT = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const ROMAINS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

/* le tracé du fil selon la forme de l'écran (viewBox W × H) */
function geometrie(portrait, bas) {
  if (portrait) return { W: 900, H: 1600, cy: 760, r: 380,
    /* deux rangées en S, entre x = 120 et 780 (l'écran recadre les côtés) */
    d: "M 120 700 C 260 630, 420 760, 600 690 C 700 652, 790 680, 790 760 C 790 840, 700 880, 600 890 C 420 905, 300 840, 120 930", perle: 36 };
  if (bas) return { W: 1600, H: 900, cy: 640, r: 420,
    d: "M -60 790 C 200 700, 420 850, 760 760 S 1180 700, 1660 790", perle: 30 };
  return { W: 1600, H: 900, cy: 440, r: 400,
    d: "M -60 470 C 240 370, 430 560, 800 455 S 1330 360, 1660 470", perle: 30 };
}

function Ciel({ W, H, cy, r }) {
  const etoiles = useMemo(() => {
    const a = rng(17);
    return Array.from({ length: 150 }, () => ({ x: a() * W, y: a() * H * 0.95, r: 0.6 + a() * 1.5, o: 0.25 + a() * 0.6, t: a() < 0.22, d: 2 + a() * 4 }));
  }, [W, H]);
  return (
    <g>
      <rect width={W} height={H} fill="url(#ttf-ciel)" />
      <ellipse cx={W / 2} cy={cy} rx={W * 0.62} ry={H * 0.22} fill="url(#ttf-aube)" />
      {etoiles.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y} r={e.r} fill="#fff6dc" opacity={e.o}>
          {e.t && <animate attributeName="opacity" values={`${e.o};0.05;${e.o}`} dur={`${e.d}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      {/* le grand cadran, qui tourne à l'envers (on remonte le temps) */}
      <g transform={`translate(${W / 2},${cy})`} opacity="0.11">
        <g style={{ animation: REDUIT ? "none" : "ttfCadran 240s linear infinite", transformBox: "view-box", transformOrigin: "0 0" }}>
          <circle r={r} fill="none" stroke="#ffd98a" strokeWidth="2" />
          <circle r={r - 16} fill="none" stroke="#ffd98a" strokeWidth="0.8" />
          {Array.from({ length: 60 }).map((_, k) => (
            <line key={k} x1="0" y1={-r + 2} x2="0" y2={-r + (k % 5 ? 10 : 22)} stroke="#ffd98a" strokeWidth={k % 5 ? 1 : 2.4} transform={`rotate(${k * 6})`} />
          ))}
          {ROMAINS.map((n, k) => (
            <text key={n} x="0" y={-r + 56} textAnchor="middle" fontFamily={CINZEL} fontSize="34" fill="#ffd98a" transform={`rotate(${k * 30})`}>{n}</text>
          ))}
        </g>
        <g style={{ animation: REDUIT ? "none" : "ttfAiguille 60s linear infinite", transformBox: "view-box", transformOrigin: "0 0" }}>
          <path d={`M -5 0 L 0 ${-r * 0.62} L 5 0 Z`} fill="#ffd98a" />
        </g>
        <g style={{ animation: REDUIT ? "none" : "ttfAiguille 12s linear infinite", transformBox: "view-box", transformOrigin: "0 0" }}>
          <path d={`M -3 0 L 0 ${-r * 0.86} L 3 0 Z`} fill="#ffd98a" />
        </g>
        <circle r="9" fill="#ffd98a" />
      </g>
    </g>
  );
}

export default function TitreFil({ m }) {
  const { portrait, bas } = useEcran();
  const paysageBas = bas && !portrait;
  const g = geometrie(portrait, paysageBas);
  const chemin = useRef(null);
  const allume = useRef(null);
  const martine = useRef(null);
  const trainee = useRef([]);
  const [geo, setGeo] = useState(null);       // { L, perles: [{x, y, f}] }
  const [ici, setIci] = useState(REDUIT ? EPOQUES_TITRE.length - 1 : 0);

  /* positions des perles le long du fil (mesurées sur le tracé) */
  useLayoutEffect(() => {
    const p = chemin.current;
    if (!p) return;
    const L = p.getTotalLength();
    const n = EPOQUES_TITRE.length;
    const perles = EPOQUES_TITRE.map((_, i) => {
      const f = 0.075 + (0.82 * i) / (n - 1);
      const pt = p.getPointAtLength(f * L);
      return { x: pt.x, y: pt.y, f };
    });
    setGeo({ L, perles });
  }, [g.d]);

  /* MARTINE parcourt le fil */
  useEffect(() => {
    if (!geo) return undefined;
    const p = chemin.current;
    const { L, perles } = geo;
    if (REDUIT) {
      const pt = p.getPointAtLength(L * 0.5);
      martine.current?.setAttribute("transform", `translate(${pt.x},${pt.y - 62})`);
      martine.current?.setAttribute("opacity", "1");
      allume.current?.setAttribute("stroke-dasharray", `${L} ${L}`);
      return undefined;
    }
    let raf, dernier = -1;
    const t0 = performance.now();
    const tour = DUREE + PAUSE;
    const pas = (t) => {
      const s = Math.max(0, (t - t0) / 1000) % tour;
      const f = Math.min(1, s / DUREE);
      const fondu = s < 1 ? s : s > tour - 1.2 ? (tour - s) / 1.2 : 1;
      const pt = p.getPointAtLength(f * L);
      if (martine.current) {
        martine.current.setAttribute("transform", `translate(${pt.x.toFixed(1)},${(pt.y - 62 + Math.sin(t / 420) * 4).toFixed(1)})`);
        martine.current.setAttribute("opacity", fondu.toFixed(2));
      }
      trainee.current.forEach((el, k) => {
        if (!el) return;
        const q = p.getPointAtLength(Math.max(0, f * L - 16 - k * 15));
        el.setAttribute("cx", q.x.toFixed(1));
        el.setAttribute("cy", (q.y - 30 + Math.sin(t / 300 + k) * 5).toFixed(1));
        el.setAttribute("opacity", (fondu * (0.75 - k * 0.07) * (f > 0.01 ? 1 : 0)).toFixed(2));
      });
      allume.current?.setAttribute("stroke-dasharray", `${(f * L).toFixed(1)} ${L}`);
      allume.current?.setAttribute("opacity", fondu.toFixed(2));
      let k = -1;
      perles.forEach((pe, i) => { if (f >= pe.f - 0.004) k = i; });
      if (s > tour - 1.2) k = -1;
      if (k !== dernier) { dernier = k; setIci(k); }
      raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [geo]);

  const date = ici >= 0 ? EPOQUES_TITRE[ici].date : EPOQUES_TITRE[0].date;
  const titre = portrait ? "min(14vw, 62px)" : paysageBas ? "38px" : "clamp(44px, 5.4vw, 84px)";

  return (
    <div style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", background: "#070b1c" }}>
      <style>{CSS_TITRE + `
        @keyframes ttfCadran { to { transform: rotate(-360deg); } }
        @keyframes ttfAiguille { to { transform: rotate(-360deg); } }
        @keyframes ttfOnde { from { transform: scale(0.35); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }`}</style>
      <svg viewBox={`0 0 ${g.W} ${g.H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id="ttf-ciel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#050818" />
            <stop offset="0.5" stopColor="#0f1636" />
            <stop offset="1" stopColor="#1c1230" />
          </linearGradient>
          <radialGradient id="ttf-aube" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e8934a" stopOpacity="0.26" />
            <stop offset="0.6" stopColor="#a0406a" stopOpacity="0.08" />
            <stop offset="1" stopColor="#a0406a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ttf-or" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c8703a" />
            <stop offset="0.5" stopColor="#ffd166" />
            <stop offset="1" stopColor="#ffe9a8" />
          </linearGradient>
          <radialGradient id="ttf-perle" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#2a2440" />
            <stop offset="1" stopColor="#0c0e1e" />
          </radialGradient>
          <filter id="ttf-flou" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>
        <Ciel W={g.W} H={g.H} cy={g.cy} r={g.r} />

        {/* le fil : halo, fil éteint, puis la partie déjà parcourue, allumée */}
        <path d={g.d} fill="none" stroke="#ffd166" strokeOpacity="0.16" strokeWidth="16" filter="url(#ttf-flou)" />
        <path ref={chemin} d={g.d} fill="none" stroke="url(#ttf-or)" strokeOpacity="0.45" strokeWidth="2" />
        <path ref={allume} d={g.d} fill="none" stroke="#ffe7a0" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="0 99999"
          style={{ filter: "drop-shadow(0 0 6px rgba(255,209,102,0.9))" }} />

        {/* les dix époques */}
        {geo && geo.perles.map((pe, i) => {
          const on = i <= ici;
          const ep = EPOQUES_TITRE[i];
          /* la date : sous la perle en portrait (MARTINE passe au-dessus), au-dessus
             en paysage bas (le bas de l'écran est proche), en alternance sinon */
          const sous = portrait ? 1 : paysageBas ? -1 : (i % 2 ? -1 : 1);
          return (
            <g key={ep.id} transform={`translate(${pe.x.toFixed(1)},${pe.y.toFixed(1)})`}>
              {on && i === ici && !REDUIT && (
                <circle key={`onde${ici}`} r={g.perle + 44} fill="none" stroke="#ffd166" strokeWidth="2" opacity="0"
                  style={{ animation: "ttfOnde 1.4s ease-out forwards", transformBox: "fill-box", transformOrigin: "center" }} />
              )}
              <circle r={g.perle + 8} fill="#ffd166" opacity={on ? 0.16 : 0} style={{ transition: "opacity .6s" }} />
              <circle r={g.perle} fill="url(#ttf-perle)" stroke={on ? "#ffd166" : "#6a6070"} strokeWidth={on ? 2.4 : 1.4} style={{ transition: "stroke .6s" }} />
              <g transform={`scale(${(g.perle / 20).toFixed(2)})`} style={{ color: on ? "#ffe39a" : "#7a7088", transition: "color .6s" }}>
                <IconeEpoque id={ep.id} />
              </g>
              <text y={sous * (g.perle + 26) + (sous > 0 ? 6 : 0)} textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize={portrait ? 24 : 17}
                letterSpacing="1.5" fill={on ? "#ffe39a" : "#8a8098"} style={{ transition: "fill .6s" }}>{ep.date}</text>
            </g>
          );
        })}

        {/* MARTINE et sa traînée de tachyons */}
        {Array.from({ length: 8 }).map((_, k) => (
          <circle key={k} ref={(el) => { trainee.current[k] = el; }} r={5 - k * 0.45} fill="#7fd8ff" opacity="0"
            style={{ filter: "drop-shadow(0 0 4px #7fd8ff)" }} />
        ))}
        <g ref={martine} opacity="0">
          <circle r="46" fill="#7fd8ff" opacity="0.08" />
          <g transform={`translate(-${portrait ? 54 : 46},-${portrait ? 54 : 46}) `}>
            <Avatar size={portrait ? 108 : 92} mood="content" date={date} />
          </g>
        </g>
      </svg>

      {/* le titre, l'accroche et le menu */}
      <div style={{ position: "relative", zIndex: 2, minHeight: "100dvh", boxSizing: "border-box", display: "flex",
        flexDirection: paysageBas ? "row" : "column", alignItems: paysageBas ? "flex-start" : "center", justifyContent: "space-between",
        gap: 12, padding: portrait ? "7vh 16px 20px" : paysageBas ? "14px 20px" : "5vh 24px 4vh" }}>
        <div style={{ width: "100%", maxWidth: paysageBas ? "55%" : 980, animation: "ttIn 1.1s ease-out both" }}>
          <TitreLettres taille={titre} align={paysageBas ? "left" : "center"} />
          <Accroche align={paysageBas ? "left" : "center"} petit={paysageBas} />
        </div>
        <MenuTitre m={m} largeur={paysageBas ? 330 : portrait ? 380 : 440} compact={portrait || paysageBas} />
      </div>
    </div>
  );
}
