/* ============================================================
   ÉCRAN TITRE — maquette B « LE SABLIER » (?titre=b)
   ------------------------------------------------------------
   Le signe des Fils du Temps, en grand : un sablier de laiton et de
   verre, traversé d'un fil d'or. Dans le bulbe du haut, les cinq
   époques anciennes (main négative → manuscrit) ; dans celui du
   bas, les cinq modernes (télégraphe → smartphone). Le sable coule :
   en haut les époques s'éteignent une à une, en bas elles
   s'allument à mesure que le tas monte ; quand le haut est vide, le
   sablier se retourne et tout recommence. MARTINE est posée sur le
   sablier, son écran affiche la date de l'époque qui passe.
   Animation en JS (requestAnimationFrame, attributs posés sur le
   SVG). Mouvement réduit : sablier à mi-course, immobile.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "../engine/Martine.jsx";
import useEcran from "../engine/useEcran.js";
import { rng } from "../engine/scenery.jsx";
import { EPOQUES_TITRE, IconeEpoque } from "./icones.jsx";
import { CSS_TITRE, TitreLettres, Accroche, MenuTitre } from "./commun.jsx";

const COULE = 40;     // s : le sable met 40 s à passer
const TOURNE = 1.6;   // s : le sablier se retourne
const REDUIT = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* le verre : deux bulbes et un col étroit, centré sur le col (0, 0) */
const VERRE = "M -150 -276 C -150 -150, -96 -92, -40 -52 C -14 -34, -9 -14, -9 0 C -9 14, -14 34, -40 52 C -96 92, -150 150, -150 276 "
  + "L 150 276 C 150 150, 96 92, 40 52 C 14 34, 9 14, 9 0 C 9 -14, 14 -34, 40 -52 C 96 -92, 150 -150, 150 -276 Z";
/* positions des icônes dans les bulbes (haut : passé, bas : présent) */
const ICONES_HAUT = [[-86, -214], [0, -222], [86, -214], [-44, -148], [44, -148]];
const ICONES_BAS = [[0, 106], [-48, 166], [48, 166], [-92, 226], [92, 226]];

function Sablier({ tas, sable, filet, grains, haut, bas }) {
  return (
    <g>
      <defs>
        <clipPath id="tts-verre"><path d={VERRE} /></clipPath>
        <linearGradient id="tts-laiton" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2cf7a" /><stop offset="0.45" stopColor="#c8963e" /><stop offset="1" stopColor="#6a4618" />
        </linearGradient>
        <linearGradient id="tts-pilier" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a4618" /><stop offset="0.4" stopColor="#f2cf7a" /><stop offset="1" stopColor="#7a5220" />
        </linearGradient>
        <linearGradient id="tts-sable" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d68c" /><stop offset="1" stopColor="#c88e42" />
        </linearGradient>
        <radialGradient id="tts-vitre" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#dff2ff" stopOpacity="0.16" /><stop offset="1" stopColor="#9ec8e8" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {/* ombre au sol */}
      <ellipse cx="0" cy="318" rx="230" ry="22" fill="#000" opacity="0.45" />
      {/* piliers torsadés */}
      {[-172, 172].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="-276" width="18" height="552" rx="6" fill="url(#tts-pilier)" />
          {Array.from({ length: 20 }).map((_, k) => (
            <path key={k} d={`M ${x - 9} ${-262 + k * 27} L ${x + 9} ${-250 + k * 27}`} stroke="#5a3a10" strokeWidth="1.6" opacity="0.45" />
          ))}
        </g>
      ))}
      {/* le verre et ce qu'il contient */}
      <path d={VERRE} fill="url(#tts-vitre)" />
      <g clipPath="url(#tts-verre)">
        {/* le sable du haut (sa surface se creuse au centre) */}
        <path ref={sable} fill="url(#tts-sable)" opacity="0.92" />
        {/* le filet qui tombe, et les grains */}
        <line ref={filet} x1="0" y1="0" x2="0" y2="0" stroke="#f6d68c" strokeWidth="2.6" strokeLinecap="round" />
        {Array.from({ length: 10 }).map((_, k) => <circle key={k} ref={(el) => { grains.current[k] = el; }} r="1.5" fill="#fff0c0" />)}
        {/* le tas du bas */}
        <path ref={tas} fill="url(#tts-sable)" />
        {/* les époques, gravées dans le verre (devant le sable) */}
        {haut.map(([x, y], i) => (
          <g key={`h${i}`} data-ico={`h${i}`} transform={`translate(${x},${y}) scale(1.5)`} style={{ color: "#ffe39a", transition: "opacity .8s" }}>
            <IconeEpoque id={EPOQUES_TITRE[i].id} />
          </g>
        ))}
        {bas.map(([x, y], i) => (
          <g key={`b${i}`} data-ico={`b${i}`} transform={`translate(${x},${y}) scale(1.5)`} style={{ color: "#ffe39a", transition: "opacity .8s" }}>
            <IconeEpoque id={EPOQUES_TITRE[i + 5].id} />
          </g>
        ))}
      </g>
      <path d={VERRE} fill="none" stroke="#e8f4ff" strokeOpacity="0.55" strokeWidth="2.4" />
      {/* reflets */}
      <path d="M -122 -236 C -118 -150, -84 -100, -50 -70" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
      <path d="M -120 236 C -116 170, -92 128, -62 104" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
      {/* plateaux de laiton */}
      {[-1, 1].map((sgn) => (
        <g key={sgn}>
          <rect x="-196" y={sgn < 0 ? -306 : 276} width="392" height="30" rx="8" fill="url(#tts-laiton)" stroke="#4a3010" strokeWidth="1.5" />
          <rect x="-180" y={sgn < 0 ? -296 : 286} width="360" height="5" rx="2" fill="#fff3c4" opacity="0.35" />
          {[-150, 0, 150].map((x) => <circle key={x} cx={x} cy={sgn < 0 ? -291 : 291} r="4.5" fill="#6a4618" stroke="#f2cf7a" strokeWidth="1" />)}
        </g>
      ))}
    </g>
  );
}

export default function TitreSablier({ m }) {
  const { portrait, bas } = useEcran();
  const paysageBas = bas && !portrait;
  const vb = portrait ? { W: 900, H: 1600, x: 420, y: 770, k: 0.92 } : paysageBas ? { W: 1600, H: 900, x: 330, y: 460, k: 1.06 } : { W: 1600, H: 900, x: 460, y: 455, k: 1.14 };
  const groupe = useRef(null), sable = useRef(null), tas = useRef(null), filet = useRef(null), grains = useRef([]);
  const [ere, setEre] = useState(REDUIT ? 4 : 0);

  const poussiere = useMemo(() => {
    const a = rng(5);
    return Array.from({ length: 46 }, () => ({ x: a() * vb.W, y: a() * vb.H, r: 0.8 + a() * 2.2, d: 9 + a() * 14, o: 0.2 + a() * 0.5, dl: a() * 10 }));
  }, [vb.W, vb.H]);

  useEffect(() => {
    let raf, derniere = -1;
    const t0 = performance.now();
    const tour = COULE + TOURNE;
    const dessiner = (f, t) => {
      /* f : proportion de sable passée (0 → 1) */
      const niveau = -236 + 230 * Math.min(1, f);                 // surface du sable du haut
      const creux = 26 * Math.min(1, f * 3) * (1 - f);
      if (sable.current) {
        if (f >= 0.995) sable.current.setAttribute("d", "");
        else sable.current.setAttribute("d", `M -160 ${niveau} Q 0 ${niveau + creux} 160 ${niveau} L 160 0 L -160 0 Z`);
      }
      const h = 210 * Math.sqrt(Math.min(1, f));                   // hauteur du tas
      tas.current?.setAttribute("d", `M -170 280 L -170 ${280 - h * 0.18} Q -60 ${280 - h * 0.55} 0 ${280 - h} Q 60 ${280 - h * 0.55} 170 ${280 - h * 0.18} L 170 280 Z`);
      const coule = f > 0.003 && f < 0.995;
      filet.current?.setAttribute("y2", coule ? String(280 - h) : "0");
      filet.current?.setAttribute("opacity", coule ? "0.9" : "0");
      grains.current.forEach((g, k) => {
        if (!g) return;
        const y = ((t / 7 + k * 31) % Math.max(10, 280 - h)) || 0;
        g.setAttribute("cx", String(Math.sin(k * 7 + t / 200) * 2.5));
        g.setAttribute("cy", String(y));
        g.setAttribute("opacity", coule ? "0.9" : "0");
      });
      /* les époques : en haut elles s'éteignent, en bas elles s'allument */
      const e = Math.min(9, Math.floor(f * 10));
      const el = groupe.current;
      if (el) {
        for (let i = 0; i < 5; i++) {
          el.querySelector(`[data-ico="h${i}"]`)?.setAttribute("opacity", f * 10 > i + 1 ? "0.12" : "0.75");
          el.querySelector(`[data-ico="b${i}"]`)?.setAttribute("opacity", f * 10 >= i + 5.2 ? "0.95" : "0.12");
        }
      }
      return e;
    };
    if (REDUIT) { dessiner(0.5, 0); return undefined; }
    const pas = (t) => {
      const s = Math.max(0, (t - t0) / 1000) % tour;
      let f = Math.min(1, s / COULE), angle = 0;
      if (s > COULE) {
        /* le sablier se retourne ; à la fin du demi-tour, l'image (plein en
           haut, vide en bas) est la même qu'au départ : on repart de 0 */
        const u = (s - COULE) / TOURNE;
        angle = 180 * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u));
        f = 1;
      }
      groupe.current?.setAttribute("transform", `translate(${vb.x},${vb.y}) scale(${vb.k}) rotate(${angle.toFixed(2)})`);
      const e = dessiner(f, t);
      if (e !== derniere) { derniere = e; setEre(e); }
      raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [vb.x, vb.y, vb.k]);

  const fil = portrait
    ? `M -40 ${vb.y + 80} C 200 ${vb.y + 140}, 300 ${vb.y - 60}, ${vb.x} ${vb.y} S 720 ${vb.y + 70}, 940 ${vb.y - 40}`
    : `M -60 ${vb.y + 120} C 160 ${vb.y + 160}, 280 ${vb.y - 70}, ${vb.x} ${vb.y} S ${vb.x + 260} ${vb.y + 80}, 1660 ${vb.y - 90}`;
  const titre = portrait ? "min(14vw, 62px)" : paysageBas ? "36px" : "clamp(40px, 4.6vw, 76px)";

  return (
    <div style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", background: "#0a0710" }}>
      <style>{CSS_TITRE + `
        @keyframes ttsMonte { from { transform: translateY(0); } to { transform: translateY(-140px); } }
        @keyframes ttsLueur { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.9; } }`}</style>
      <svg viewBox={`0 0 ${vb.W} ${vb.H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
        <defs>
          <radialGradient id="tts-fond" cx={vb.x / vb.W} cy="0.45" r="0.8">
            <stop offset="0" stopColor="#3a2414" /><stop offset="0.45" stopColor="#170e12" /><stop offset="1" stopColor="#07060c" />
          </radialGradient>
          <linearGradient id="tts-rai" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.22" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tts-fil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c8703a" stopOpacity="0" /><stop offset="0.25" stopColor="#ffd166" />
            <stop offset="0.75" stopColor="#ffe9a8" /><stop offset="1" stopColor="#c8703a" stopOpacity="0" />
          </linearGradient>
          <filter id="tts-flou"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect width={vb.W} height={vb.H} fill="url(#tts-fond)" />
        {/* un rai de lumière qui tombe sur le sablier */}
        <path d={`M ${vb.x - 60} 0 L ${vb.x + 60} 0 L ${vb.x + 300} ${vb.H} L ${vb.x - 300} ${vb.H} Z`} fill="url(#tts-rai)" style={{ animation: REDUIT ? "none" : "ttsLueur 7s ease-in-out infinite" }} />
        {/* poussière dorée qui monte dans la lumière */}
        {poussiere.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#ffe3a0" opacity={p.o}
            style={{ animation: REDUIT ? "none" : `ttsMonte ${p.d}s linear ${-p.dl}s infinite alternate` }} />
        ))}
        {/* le fil, derrière */}
        <path d={fil} fill="none" stroke="#ffd166" strokeOpacity="0.2" strokeWidth="14" filter="url(#tts-flou)" />
        <g ref={groupe} transform={`translate(${vb.x},${vb.y}) scale(${vb.k})`}>
          <Sablier tas={tas} sable={sable} filet={filet} grains={grains} haut={ICONES_HAUT} bas={ICONES_BAS} />
        </g>
        {/* le fil, devant : il traverse le col du sablier (le signe des Fils du Temps) */}
        <path d={fil} fill="none" stroke="url(#tts-fil)" strokeWidth="3.2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(255,209,102,0.8))" }} />
        <path d={fil} fill="none" stroke="#fff8dc" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="90 2600"
          style={{ filter: "drop-shadow(0 0 8px #ffd166)" }}>
          {!REDUIT && <animate attributeName="stroke-dashoffset" from="90" to="-2600" dur="7s" repeatCount="indefinite" />}
        </path>
        {/* MARTINE flotte à côté du sablier et regarde le sable couler */}
        <g transform={`translate(${vb.x + (portrait ? 250 : 262) * vb.k},${vb.y - 170 * vb.k}) scale(${vb.k * 0.9})`}>
          <g style={{ animation: REDUIT ? "none" : "drift 3.2s ease-in-out infinite" }}>
            <g transform="translate(-42,-46)"><Avatar size={84} mood="neutre" date={EPOQUES_TITRE[ere].date} /></g>
          </g>
        </g>
      </svg>

      <div style={{ position: "relative", zIndex: 2, minHeight: "100dvh", boxSizing: "border-box", display: "flex",
        flexDirection: portrait ? "column" : "row", alignItems: "center", justifyContent: portrait ? "space-between" : "flex-end",
        padding: portrait ? "6vh 16px 18px" : paysageBas ? "12px 20px" : "4vh 5vw" }}>
        {portrait ? (
          <>
            <div style={{ width: "100%" }}>
              <TitreLettres taille={titre} />
              <Accroche petit />
            </div>
            <MenuTitre m={m} largeur={380} compact />
          </>
        ) : (
          <div style={{ width: paysageBas ? "50%" : "46%", maxWidth: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: paysageBas ? 10 : 22 }}>
            <div style={{ width: "100%" }}>
              <TitreLettres taille={titre} />
              {!paysageBas && <Accroche />}
            </div>
            <MenuTitre m={m} largeur={paysageBas ? 340 : 440} compact={paysageBas} />
          </div>
        )}
      </div>
    </div>
  );
}
