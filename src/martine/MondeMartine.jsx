import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "../engine/Martine.jsx";
import Scene from "../engine/Scene.jsx";
import { Figure, handPos } from "../engine/chars.jsx";
import MediadexPanel from "../chapters/jeu3/MediadexPanel.jsx";
import Retablissement from "./Retablissement.jsx";
import { preparerVignettes } from "./vignettes.js";
import { assetUrl } from "../engine/assetUrl.js";
import { loadSave } from "../engine/save.js";
import { playClink, playMaterialize } from "../engine/sfx.js";
import { isMuted, setMuted } from "../engine/audio.js";
import { rng } from "../engine/scenery.jsx";
import { EPOQUES, SUPPORTS, PERSOS, FUTURS, etatDeDepart, MARTINE_REPARE, MARTINE_EPOQUE } from "./epoquesMonde2.js";
import { demarrerMusique, arreterMusique, changerAir, grincer } from "./musiqueMonde2.js";

/* ============================================================
   LE MONDE 2 — prototype
   ------------------------------------------------------------
   Page à part (martine/index.html). Après la confrontation du
   Jeu 3, MARTINE garde le joueur chez elle, dans un monde à la
   Stranger Things. On s'y promène comme au Jeu 2 : une frise des
   dix époques, et dans chacune les tableaux de son chapitre du
   Jeu 1 (flèches ‹ › et points, moteur Scene), en noir et blanc.
   MARTINE a tout mélangé : chaque personnage tient le support d'un
   autre, et un objet du futur est caché dans chaque tableau. On
   prend (tout va dans le sac), on rend à chacun le sien, on jette
   les objets du futur dans la poubelle temporelle (règle 3 du
   Jeu 1). Un tableau reprend ses couleurs tâche après tâche ; une
   époque rangée devient dorée sur la frise. Dix époques : le monde
   se fissure (fin du prototype). Données : epoquesMonde2.js et
   inventeursXIXe.js.
   ============================================================ */

const noop = () => {};
const RED = "#ff3b45";
const GOLD = "#ffd166";
/* la racine du site principal (posée par main.jsx ou par l'amorce de …/martine/) */
const RACINE = () => globalThis.__ASSET_ROOT || "../";

function readPrenom() {
  for (const slot of ["jeu3", "jeu2", "jeu1"]) {
    try { const s = loadSave(slot); if (s?.prenom) return s.prenom; } catch { /* rien */ }
  }
  return "";
}

const CSS = `
@keyframes mmSpore { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: .75; } 85% { opacity: .55; } 100% { transform: translate(var(--sx), -105vh); opacity: 0; } }
@keyframes mmFlash { 0%, 84%, 100% { opacity: 0; } 86% { opacity: .5; } 88% { opacity: .08; } 90% { opacity: .42; } 93% { opacity: 0; } }
@keyframes mmSway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(1.6deg); } }
@keyframes mmGlitch { 0%, 92%, 100% { transform: translate(0,0); filter: none; } 93% { transform: translate(-3px,1px); filter: hue-rotate(90deg); } 95% { transform: translate(3px,-2px); } 97% { transform: translate(-1px,2px); filter: hue-rotate(-60deg); } }
@keyframes mmIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes mmLight { from { opacity: 0; } to { opacity: 1; } }
@keyframes m2Letter { 0% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1.7); } 60% { opacity: 1; } 100% { opacity: 1; transform: none; } }
@keyframes m2Bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes m2Neon { 0%, 100% { opacity: 1; } 47% { opacity: 1; } 48% { opacity: .55; } 49% { opacity: 1; } 76% { opacity: .8; } 77% { opacity: 1; } }
@keyframes m2Float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes m2Jitter { 0%, 88%, 100% { transform: translate(0,0); } 90% { transform: translate(-2px,1px); } 93% { transform: translate(2px,-1px); } 96% { transform: translate(-1px,-1px); } }
@keyframes m2Shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
@keyframes m2Pop { from { transform: scale(.4); opacity: 0; } to { transform: none; opacity: 1; } }
/* frise sur petit écran : seule la date de l'époque où l'on est */
@media (max-width: 640px) { .m2-date:not(.m2-ici) { display: none; } }
`;

/* ───────────── l'atmosphère du monde 2 ───────────── */
function Spores({ n = 46, seed = 7 }) {
  const list = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: n }, () => ({
      left: r() * 100, size: 2 + r() * 4, dur: 9 + r() * 12, delay: -r() * 20, sx: `${(r() - 0.5) * 120}px`, o: 0.4 + r() * 0.5,
    }));
  }, [n, seed]);
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
      {list.map((p, i) => (
        <span key={i} style={{ position: "absolute", left: `${p.left}%`, bottom: -10, width: p.size, height: p.size, borderRadius: "50%",
          background: "#d8e4ee", opacity: p.o, boxShadow: "0 0 6px #9ab8d0", "--sx": p.sx,
          animation: `mmSpore ${p.dur}s linear ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* lianes qui envahissent les bords de l'écran */
function Vines() {
  const vine = (d, w, k) => (
    <g key={k} style={{ animation: `mmSway ${6 + k}s ease-in-out infinite`, transformOrigin: "0 0" }}>
      <path d={d} stroke="#140810" strokeWidth={w} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#3a1420" strokeWidth={w * 0.35} fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  );
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="none" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
      {vine("M-10 40 C60 60 80 140 40 220 C10 280 70 330 30 420", 14, 0)}
      {vine("M-10 140 C40 150 120 120 150 180 C175 230 120 260 160 300", 7, 1)}
      {vine("M1010 70 C930 90 910 170 950 250 C985 320 920 360 960 450", 14, 2)}
      {vine("M1010 200 C960 210 880 190 860 250 C845 300 900 330 870 380", 7, 3)}
      {vine("M-10 600 C40 560 120 580 160 540 C200 500 260 560 300 520", 10, 4)}
      {vine("M1010 600 C960 560 880 585 840 545 C800 505 740 560 700 525", 10, 5)}
    </svg>
  );
}

/* la fissure de lumière qui grandit (0 → 1) */
function Crack({ progress, h = 24 }) {
  const d = "M0 46 L90 40 L130 58 L210 30 L260 52 L330 26 L380 48 L450 22 L500 44 L560 18 L620 42 L680 20 L740 46 L800 24 L860 50 L920 28 L1000 40";
  return (
    <svg aria-hidden viewBox="0 0 1000 70" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: h }}>
      <path d={d} stroke="#3a1a22" strokeWidth="3" fill="none" />
      <path d={d} stroke="#fff4c8" strokeWidth={2 + progress * 6} fill="none" pathLength="1"
        strokeDasharray="1" strokeDashoffset={1 - progress}
        style={{ transition: "stroke-dashoffset 1.4s ease-out, stroke-width 1.4s", filter: "drop-shadow(0 0 6px #ffe8a0) drop-shadow(0 0 14px #ffd070)" }} />
    </svg>
  );
}

/* le titre, en lettres de néon rouge à la Stranger Things ; `anime` :
   les lettres arrivent de loin et se posent (écran titre) */
const LETTRES = [..."LE MONDE 2"];
function TitreMonde2({ taille = 56, anime = false }) {
  const r = rng(11);
  const depart = LETTRES.map(() => ({ dx: `${(r() - 0.5) * 260}px`, dy: `${(r() - 0.5) * 160}px` }));
  const lettre = (c, i) => {
    const grande = i === 0 || i === LETTRES.length - 1;
    return (
      <span key={i} style={{ display: "inline-block", fontSize: grande ? "1.32em" : "1em", whiteSpace: "pre",
        "--dx": depart[i].dx, "--dy": depart[i].dy,
        animation: anime ? `m2Letter 2.6s cubic-bezier(.2,.7,.2,1) ${0.15 * i}s both` : "none" }}>{c}</span>
    );
  };
  const barre = (delai) => (
    <div style={{ height: Math.max(2, taille / 18), background: RED, margin: "0 auto", width: "78%", boxShadow: `0 0 10px ${RED}`,
      transformOrigin: "50% 50%", animation: anime ? `m2Bar 1.4s ease-out ${delai}s both` : "none" }} />
  );
  return (
    <div style={{ display: "inline-block", textAlign: "center", animation: "m2Neon 6s linear infinite" }}>
      {barre(1.9)}
      <h1 style={{ margin: `${taille * 0.04}px 0`, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 900, fontSize: taille, lineHeight: 1,
        letterSpacing: "0.08em", color: "transparent", WebkitTextStroke: `${Math.max(1.2, taille / 34)}px ${RED}`,
        textShadow: `0 0 ${taille / 3}px ${RED}77`, whiteSpace: "nowrap" }}>
        {LETTRES.map(lettre)}
      </h1>
      {barre(2.1)}
    </div>
  );
}

/* MARTINE, en version monde 2 : rouge, qui grésille */
function MartineVoix({ texte, mood = "content", grand = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: "0 0 auto", width: grand ? 150 : 46, height: grand ? 150 : 46, borderRadius: "50%", display: "grid", placeItems: "center",
        background: "radial-gradient(circle,#2a0a12,#0a0408)", border: `2px solid ${RED}`, boxShadow: `0 0 18px ${RED}88`,
        animation: "mmGlitch 4s linear infinite" }}>
        <div style={{ filter: "hue-rotate(-140deg) saturate(1.6) brightness(0.9)" }}>
          <Avatar size={grand ? 120 : 38} mood={mood} talking={!!texte} />
        </div>
      </div>
      {texte && (
        <div key={texte} style={{ background: "#12060bcc", border: `1px solid ${RED}88`, borderRadius: 10, padding: grand ? "12px 18px" : "5px 10px",
          color: "#ffd8dc", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: grand ? 24 : 13.5, lineHeight: 1.4, maxWidth: grand ? 520 : 260,
          animation: "mmIn 400ms ease-out both" }}>
          « {texte} »
        </div>
      )}
    </div>
  );
}

/* ───────────── un tableau du monde 2 ───────────── */
/* l'objet tenu : une carte avec la photo du médiadex (ou un emoji) ;
   cadre rouge qui grésille si ce n'est pas le bon, doré sinon */
function CarteTenue({ id, x, y, juste, onClick }) {
  const s = SUPPORTS[id];
  const W = 66, H = 52;
  const clip = `m2clip-${id.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <g data-carte={id} transform={`translate(${x},${y})`} onClick={onClick} style={{ cursor: "pointer", pointerEvents: onClick ? "auto" : "none" }}>
      <g style={{ animation: juste ? "none" : "m2Float 2.6s ease-in-out infinite, m2Jitter 3.2s linear infinite" }}>
        <title>{s.nom}</title>
        <rect x={-4} y={-4} width={W + 8} height={H + 8} rx="5" fill={juste ? "#2a1e08" : "#1a0408"}
          stroke={juste ? GOLD : RED} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 8px ${juste ? GOLD : RED})` }} />
        {s.image ? (
          <>
            <clipPath id={clip}><rect width={W} height={H} rx="2" /></clipPath>
            <image href={assetUrl(`assets/inventions/${s.image}`)} width={W} height={H} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
          </>
        ) : (
          <>
            <rect width={W} height={H} rx="2" fill="#e8dcc0" />
            <text x={W / 2} y={H / 2 + 2} textAnchor="middle" dominantBaseline="central" fontSize="34">{s.emoji}</text>
          </>
        )}
      </g>
    </g>
  );
}

/* où se tient un personnage dessiné : chez lui s'il est revenu, sinon en visite */
const placeDessinee = (p, chez) => (!p.visite || chez[p.id] ? p.chez : p.visite);
const tableauDe = (p, chez) => (p.visite && !chez[p.id] ? p.visite.scene : p.scene);
/* sa silhouette : pieds (x, y), hauteur, largeur, coin de la carte */
const BRAS_TENDU = { a1: 50, a2: 15 };
const BRAS_DUO = { a1: 40, a2: -10 };
const BAS = { a1: 9, a2: 6 };
function silhouette(p, chez) {
  if (!p.fig) return { x: p.x, y: p.y, h: p.h, w: p.w || 64, carte: p.carte };
  const q = placeDessinee(p, chez);
  let carte;
  if (p.duo) {
    /* tenue à deux mains, devant les vestes : les visages restent visibles */
    const m = handPos({ side: 1, ...BRAS_DUO });
    carte = { x: q.x - 33, y: q.y + q.s * m.y - 30 };
  } else {
    /* handPos donne déjà x < 0 pour le bras de gauche */
    const m = handPos({ side: q.bras, ...BRAS_TENDU });
    const hx = q.x + q.s * m.x, hy = q.y + q.s * m.y;
    carte = { x: q.bras > 0 ? hx - 10 : hx - 56, y: hy - 50 };
  }
  return { x: q.x, y: q.y, h: 132 * q.s, w: (p.duo ? 124 : 68) * q.s, carte, q };
}

/* un personnage dessiné (ou les deux frères) avec le kit du jeu */
function Dessine({ p, q, mood }) {
  if (p.duo) {
    const d = 28 * q.s;
    return (
      <g>
        <Figure x={q.x - d} y={q.y} s={q.s} {...p.fig} mood={mood} arms={[BAS, BRAS_DUO]} />
        <Figure x={q.x + d} y={q.y} s={q.s} {...p.fig} beard="royal" hair="#4a3424" mood={mood} arms={[BRAS_DUO, BAS]} />
      </g>
    );
  }
  const arms = q.bras > 0 ? [BAS, BRAS_TENDU] : [BRAS_TENDU, BAS];
  return <Figure x={q.x} y={q.y} s={q.s} {...p.fig} mood={mood} arms={arms} />;
}

function Plaque({ nom, x, y, juste }) {
  const w = nom.length * 7.4 + 18;
  return (
    <g transform={`translate(${Math.min(1000 - w / 2, Math.max(w / 2, x))},${Math.min(548, y + 16)})`} style={{ pointerEvents: "none" }}>
      <rect x={-w / 2} y={-10} width={w} height={20} rx="4" fill="#0a0408" opacity="0.88" stroke={juste ? GOLD : RED} strokeWidth="1.2" />
      <text x="0" y="4.5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12.5" fontWeight="700" letterSpacing="0.5" fill={juste ? GOLD : "#ffb8be"}>{nom}</text>
    </g>
  );
}

/* les objets du futur du XIXe ont un dessin à eux ; les autres, un emoji */
const DESSINS = {
  portable: (
    <g>
      <path d="M-22 0 L-19 -30 L21 -30 L22 0 Z" fill="#2a2e36" stroke="#0c0e12" strokeWidth="1" />
      <rect x="-16" y="-27" width="33" height="22" fill="#9ec8e8" />
      <path d="M-12 -21 h14 M-12 -16 h20 M-12 -11 h10" stroke="#3a5a7a" strokeWidth="1.6" />
      <path d="M-27 0 L27 0 L31 6 L-31 6 Z" fill="#9aa0a8" stroke="#2a2e36" strokeWidth="1" />
    </g>
  ),
  numerique: (
    <g>
      <rect x="-15" y="-12" width="30" height="20" rx="3" fill="#2a2a30" stroke="#0c0c10" strokeWidth="1" />
      <circle cx="3" cy="-2" r="7.5" fill="#4a4e58" stroke="#c8ccd4" strokeWidth="1.6" />
      <circle cx="3" cy="-2" r="3.4" fill="#1a2a4a" />
      <rect x="-12" y="-10" width="7" height="4" fill="#e8e8f0" />
      <rect x="9" y="-15" width="5" height="3" fill="#c03030" />
    </g>
  ),
  parabole: (
    <g>
      <path d="M0 6 L0 26" stroke="#4a4e58" strokeWidth="3" />
      <ellipse cx="0" cy="0" rx="13" ry="19" transform="rotate(-35)" fill="#e8eaee" stroke="#6a6e78" strokeWidth="1.4" />
      <path d="M-2 2 L14 -12" stroke="#4a4e58" strokeWidth="2" />
      <circle cx="14" cy="-12" r="2.6" fill="#2a2e36" />
    </g>
  ),
  cd: (
    <g>
      <defs>
        <linearGradient id="m2cd" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8eef8" /><stop offset=".35" stopColor="#b8d8ff" /><stop offset=".55" stopColor="#ffd0f0" /><stop offset=".75" stopColor="#d8ffd0" /><stop offset="1" stopColor="#c8ccd4" />
        </linearGradient>
      </defs>
      <circle r="13" fill="url(#m2cd)" stroke="#8a8e98" strokeWidth="1" />
      <circle r="4.6" fill="none" stroke="#8a8e98" strokeWidth="1" />
      <circle r="2.2" fill="#3a2a20" />
    </g>
  ),
  satellite: (
    <g>
      <rect x="-26" y="-5" width="17" height="10" fill="#3a5a8a" stroke="#c8d4e8" strokeWidth="0.8" />
      <rect x="9" y="-5" width="17" height="10" fill="#3a5a8a" stroke="#c8d4e8" strokeWidth="0.8" />
      <path d="M-20 -5 v10 M-14 -5 v10 M15 -5 v10 M21 -5 v10" stroke="#c8d4e8" strokeWidth="0.6" />
      <rect x="-8" y="-7" width="16" height="14" rx="2" fill="#d8dce4" />
      <path d="M0 7 L0 15" stroke="#d8dce4" strokeWidth="1.4" />
      <circle cx="0" cy="16" r="1.8" fill="#ff5050"><animate attributeName="opacity" values="1;0.1;1" dur="1.4s" repeatCount="indefinite" /></circle>
    </g>
  ),
  lunettes3d: (
    <g>
      <path d="M-22 -3 L-30 -8 M22 -3 L30 -8" stroke="#f0f0f0" strokeWidth="1.6" />
      <rect x="-22" y="-7" width="19" height="13" rx="3" fill="#e02838" stroke="#f4f4f4" strokeWidth="2" />
      <rect x="3" y="-7" width="19" height="13" rx="3" fill="#20b8e0" stroke="#f4f4f4" strokeWidth="2" />
      <path d="M-3 -2 Q0 -5 3 -2" stroke="#f4f4f4" strokeWidth="2" fill="none" />
    </g>
  ),
  smartphone: (
    <g transform="rotate(-12)">
      <rect x="-8" y="-15" width="16" height="30" rx="3" fill="#16181e" stroke="#0a0a0e" strokeWidth="1" />
      <rect x="-6.5" y="-12" width="13" height="23" rx="1" fill="#7ab8f0" />
      <path d="M-4 -8 h4 M-4 -4 h8 M-4 0 h6" stroke="#ffffff" strokeWidth="1.4" opacity="0.8" />
    </g>
  ),
};
function ObjetDuFutur({ f }) {
  return (
    <g transform={`translate(${f.x},${f.y})`}>
      {f.dessin ? DESSINS[f.dessin] : <text textAnchor="middle" dominantBaseline="central" fontSize="34">{f.emoji}</text>}
    </g>
  );
}

/* les tâches d'un tableau : ses objets du futur, et ses propriétaires
   (servis = leur support en main, et revenus chez eux s'ils voyagent) */
const servi = (p, { tient, chez }) => tient[p.id] === p.support && (!p.visite || chez[p.id]);
function avancement(ep, sid, etat) {
  const futurs = Object.values(FUTURS).filter((f) => f.epoque === ep.id && f.scene === sid);
  const proprios = Object.values(PERSOS).filter((p) => p.epoque === ep.id && p.scene === sid);
  const total = futurs.length + proprios.length;
  const fait = futurs.filter((f) => etat.futurs[f.id] !== "tableau").length + proprios.filter((p) => servi(p, etat)).length;
  return total ? fait / total : 1;
}
const epoqueFinie = (ep, etat) =>
  ep.persos.every((p) => servi(PERSOS[p.id], etat)) && Object.values(FUTURS).every((f) => f.epoque !== ep.id || etat.futurs[f.id] === "jete");

function Tableau({ ep, sid, Orig, monde }) {
  const { etat, sortant, onCarte, onPerso, onFutur, bulle } = monde;
  const { tient, chez } = etat;
  const presents = Object.values(PERSOS).filter((p) => p.epoque === ep.id && tableauDe(p, chez) === sid);
  const futurs = Object.values(FUTURS).filter((f) => f.epoque === ep.id && f.scene === sid && etat.futurs[f.id] === "tableau");
  const gris = 1 - avancement(ep, sid, etat);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* le décor du Jeu 1, les personnages dessinés et les objets du futur :
          en noir et blanc, puis la couleur revient tâche après tâche */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", transition: "filter 2.2s ease",
        filter: `grayscale(${gris}) contrast(${1 + 0.18 * gris}) brightness(${1 - 0.26 * gris})` }}>
        <Orig collect={noop} action={noop} reveal={false} made={[]} flags={{}} queteQui={null} mode="jeu2" sansMarconi />
        <svg viewBox="0 0 1000 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {futurs.map((f) => <ObjetDuFutur key={f.id} f={f} />)}
          {presents.filter((p) => p.fig).map((p) => {
            const objet = tient[p.id];
            const mood = objet === p.support ? "content" : objet ? "neutre" : "surpris";
            return (
              <g key={p.id} style={{ opacity: sortant === p.id ? 0 : 1, transition: "opacity .6s" }}>
                <Dessine p={p} q={placeDessinee(p, chez)} mood={mood} />
              </g>
            );
          })}
        </svg>
      </div>
      {/* le voile du monde 2 : bleu nuit en haut, rouge sang en bas */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: gris, transition: "opacity 2.2s ease",
        background: "linear-gradient(180deg, rgba(20,40,80,0.28), rgba(10,6,20,0.18) 55%, rgba(120,10,30,0.32))", mixBlendMode: "multiply" }} />
      <svg viewBox="0 0 1000 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {futurs.map((f) => (
          <circle key={f.id} data-futur={f.id} cx={f.x} cy={f.dessin ? f.y - 6 : f.y} r="26" fill="rgba(0,0,0,0.001)" style={{ cursor: "pointer" }} onClick={() => onFutur(f.id)} />
        ))}
        {presents.map((p) => {
          const sil = silhouette(p, chez);
          const objet = tient[p.id];
          const juste = objet === p.support;
          return (
            <g key={p.id} style={{ opacity: sortant === p.id ? 0 : 1, transition: "opacity .6s" }}>
              <rect data-perso={p.id} x={sil.x - sil.w / 2} y={sil.y - sil.h} width={sil.w} height={sil.h + 4} fill="rgba(0,0,0,0.001)"
                style={{ cursor: "pointer" }} onClick={() => onPerso(p.id)}><title>{p.nom}</title></rect>
              <Plaque nom={p.nom} x={sil.x} y={sil.y} juste={juste} />
              {objet && <CarteTenue key={objet} id={objet} x={sil.carte.x} y={sil.carte.y} juste={juste} onClick={juste ? undefined : () => onCarte(p.id)} />}
            </g>
          );
        })}
      </svg>
      {/* ce que dit le personnage */}
      {presents.filter((p) => bulle?.qui === p.id).map((p) => {
        const sil = silhouette(p, chez);
        return (
          <div key={bulle.n} style={{ position: "absolute", left: `${Math.min(84, Math.max(16, sil.x / 10))}%`, top: `${Math.max(2, (sil.y - sil.h - 10) / 5.6)}%`,
            transform: "translate(-50%,-100%)", maxWidth: "46%", width: "max-content", pointerEvents: "none" }}>
            {/* l'animation sur un div intérieur : son `transform` écraserait le centrage */}
            <div style={{ background: "#f8f2e4", color: "#1a1410", borderRadius: 12, padding: "6px 12px",
              fontFamily: "Georgia, serif", fontSize: "clamp(12px, 1.5vw, 16px)", fontWeight: 600, textAlign: "center",
              boxShadow: `0 0 0 2px ${bulle.ok ? GOLD : RED}, 0 6px 18px rgba(0,0,0,0.5)`, animation: "m2Pop .25s ease-out both" }}>
              {bulle.texte}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* les tableaux de chaque époque, passés au moteur Scene comme au Jeu 2 */
const TABLEAUX = Object.fromEntries(EPOQUES.map((ep) => [ep.id, ep.tableaux.map((s) => ({
  id: s.id, name: s.name,
  Component: ({ monde }) => <Tableau ep={ep} sid={s.id} Orig={s.Component} monde={monde} />,
}))]));

/* le plus grand cadre 1000 × 560 qui tient dans la cellule */
function useCadre(ref) {
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const maj = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.width, (r.height * 1000) / 560));
      setBox({ w, h: (w * 560) / 1000 });
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

/* ───────────── la frise des époques ───────────── */
function Frise({ ici, etat, onEpoque }) {
  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, maxWidth: 1080, margin: "0 auto", padding: "0 6px" }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 19, height: 2, background: `linear-gradient(90deg, #3a1420, ${RED}, #3a1420)`, opacity: 0.55 }} />
      {EPOQUES.map((ep) => {
        const fini = epoqueFinie(ep, etat);
        const la = ep.id === ici;
        return (
          <button key={ep.id} onClick={() => onEpoque(ep.id)} title={`${ep.chapitre.epoque} · ${ep.chapitre.date}${fini ? " — remise en ordre ✓" : ""}`}
            style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: "transparent", border: "none",
              padding: "0 2px", cursor: la ? "default" : "pointer", color: "#e8eef5", flex: "0 1 auto", minWidth: 0 }}>
            <span style={{ display: "grid", placeItems: "center", width: la ? 38 : 32, height: la ? 38 : 32, borderRadius: "50%", fontSize: la ? 20 : 16,
              background: fini ? "radial-gradient(circle at 50% 40%, #ffe08a, #b8862a)" : la ? "radial-gradient(circle at 50% 40%, #5a1420, #1a0408)" : "#0c0608",
              border: `2px solid ${fini ? GOLD : la ? RED : "#4a1a24"}`, boxShadow: la ? `0 0 14px ${RED}aa` : fini ? `0 0 10px ${GOLD}88` : "none",
              filter: fini || la ? "none" : "grayscale(1) brightness(0.8)", transition: "all .2s" }}>
              {ep.chapitre.emoji}
            </span>
            <span className={la ? "m2-date m2-ici" : "m2-date"} style={{ fontFamily: "ui-monospace,monospace", fontSize: 8.5, letterSpacing: 0.3, whiteSpace: "nowrap", color: fini ? GOLD : la ? "#ffb8be" : "#7a5a64" }}>
              {ep.chapitre.date}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── le sac et la poubelle temporelle ───────────── */
const objetDuSac = (id) => SUPPORTS[id] || FUTURS[id];
function Sac({ sac, choisi, onChoisir, onPoubelle, secoue }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 12, minHeight: 64,
      background: "linear-gradient(180deg, #1a0a10, #0c0408)", border: "1px solid #4a1a24", boxShadow: `0 0 16px ${RED}22` }}>
      <button onClick={onPoubelle} title="Poubelle temporelle : rien du futur dans le passé"
        style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "4px 8px", borderRadius: 10, cursor: "pointer",
          background: choisi ? "#2a1018" : "#12060a", border: `2px solid ${choisi ? RED : "#4a1a24"}`, color: "#ffb8be",
          boxShadow: choisi ? `0 0 12px ${RED}88` : "none", transition: "all .15s" }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>🗑️</span>
        <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 8.5, letterSpacing: 0.5, fontWeight: 800, whiteSpace: "nowrap" }}>POUBELLE TEMPORELLE</span>
      </button>
      <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#ffb8be", whiteSpace: "nowrap" }}>🎒 SAC</span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, maxHeight: 96, overflowY: "auto", padding: "3px 0" }}>
      {sac.length === 0 && <span style={{ fontSize: 13, color: "#7a5a64", fontStyle: "italic" }}>vide</span>}
      {sac.map((id) => {
        const on = choisi === id;
        const o = objetDuSac(id);
        return (
          <button key={id} data-sac={id} data-on={on ? 1 : 0} onClick={() => onChoisir(on ? null : id)} title={o.nom}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px 3px 3px", borderRadius: 9, cursor: "pointer", flex: "0 0 auto",
              background: on ? "#3a2808" : "#140810", color: on ? GOLD : "#f2e0e4", border: `2px solid ${on ? GOLD : "#5a2a34"}`,
              boxShadow: on ? `0 0 14px ${GOLD}88` : "none", transform: on ? "translateY(-3px)" : "none", transition: "all .15s",
              animation: on && secoue ? "m2Shake .45s ease-in-out" : "m2Pop .3s ease-out both" }}>
            {o.image
              ? <img src={assetUrl(`assets/inventions/${o.image}`)} alt="" style={{ width: 42, height: 32, objectFit: "cover", borderRadius: 4 }} />
              : <span style={{ width: 42, height: 32, display: "grid", placeItems: "center", fontSize: 22, background: "#0a0408", borderRadius: 4 }}>{o.emoji}</span>}
            <span style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{o.nom}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}

/* ───────────── la page ───────────── */
/* ?fin=1 : aller directement à la finale */
function finDirecte() {
  try { return new URLSearchParams(window.location.search).has("fin"); } catch { return false; }
}

/* ?epoque=07-xixe : ouvrir directement une époque (tests, ou pour un cours) */
function epoqueDeLAdresse() {
  try {
    const id = new URLSearchParams(window.location.search).get("epoque");
    return EPOQUES.some((ep) => ep.id === id) ? id : EPOQUES[0].id;
  } catch { return EPOQUES[0].id; }
}

export default function MondeMartine() {
  const prenom = useMemo(readPrenom, []);
  const [phase, setPhase] = useState("accueil"); // accueil → titre → monde → fin
  useEffect(() => {
    if (!isMuted()) playMaterialize();
    if (finDirecte()) preparerVignettes(); // ?fin=1 : les vignettes se préparent pendant l'accueil
    return arreterMusique;
  }, []);
  /* la musique : du vent et une boîte à musique, dès le premier clic ; à la fin,
     la boîte grince une dernière fois et se tait */
  useEffect(() => {
    if (phase !== "fin") return undefined;
    grincer();
    const t = setTimeout(arreterMusique, 1600);
    return () => clearTimeout(t);
  }, [phase]);
  useEffect(() => {
    if (phase !== "titre") return undefined;
    const t = setTimeout(() => setPhase("monde"), 4200);
    return () => clearTimeout(t);
  }, [phase]);

  const page = { minHeight: "100dvh", background: "radial-gradient(ellipse at 50% -10%, #3a0a14 0%, #0c0a18 38%, #05070c 75%)", color: "#e8eef5", fontFamily: "Georgia, serif", position: "relative", overflow: "hidden" };

  if (phase === "accueil") {
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", cursor: "pointer", padding: 16 }} onClick={() => {
        demarrerMusique(epoqueDeLAdresse());
        /* ?fin=1 : directement la finale (pour la tester, ou la montrer en classe) */
        if (finDirecte()) { preparerVignettes(); setPhase("retablissement"); } else setPhase("titre");
      }}>
        <style>{CSS}</style>
        <Spores n={30} />
        <div style={{ animation: "mmIn 900ms ease-out both" }}>
          <MartineVoix grand mood="vexe" texte={prenom ? `Tu n'as rien à faire ici, ${prenom}.` : "Tu n'as rien à faire ici."} />
        </div>
      </div>
    );
  }
  if (phase === "titre") {
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", cursor: "pointer", padding: 16 }} onClick={() => setPhase("monde")}>
        <style>{CSS}</style>
        <div aria-hidden style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${RED}55, transparent 60%)`, animation: "mmFlash 5s linear infinite", pointerEvents: "none" }} />
        <Spores n={36} />
        <TitreMonde2 taille={Math.min(120, Math.max(44, typeof window !== "undefined" ? window.innerWidth / 9 : 80))} anime />
      </div>
    );
  }
  return <Monde page={page} phase={phase} setPhase={setPhase} />;
}

function Monde({ page, phase, setPhase }) {
  const [epoqueId, setEpoqueId] = useState(epoqueDeLAdresse);
  const [tab, setTab] = useState(0);
  const [etat, setEtat] = useState(etatDeDepart);
  const [sortant, setSortant] = useState(null);
  const [bulle, setBulle] = useState(null);
  const [refus, setRefus] = useState(false);
  const [toast, setToast] = useState(null);
  const [voix, setVoix] = useState({ texte: "", mood: "content" });
  const [mediadex, setMediadex] = useState(false);
  const [son, setSon] = useState(() => !isMuted());
  const basculerSon = () => {
    const muet = son;
    setMuted(muet);
    setSon(!muet);
    if (muet) arreterMusique(); else demarrerMusique(epoqueId);
  };
  const cellule = useRef(null);
  const cadre = useCadre(cellule);
  const n = useRef(0);
  const minuteurs = useRef([]);
  const vus = useRef({ tableaux: new Set(), epoques: new Set() });

  const ep = EPOQUES.find((e) => e.id === epoqueId);
  const { tient, sac, choisi } = etat;
  const persosIci = ep.persos.map((p) => PERSOS[p.id]);
  const futursIci = Object.values(FUTURS).filter((f) => f.epoque === ep.id);
  const nbServis = persosIci.filter((p) => servi(p, etat)).length;
  const nbJetes = futursIci.filter((f) => etat.futurs[f.id] === "jete").length;
  const finies = EPOQUES.filter((e) => epoqueFinie(e, etat));
  const toutFini = finies.length === EPOQUES.length;
  /* la fissure : la part de tâches faites dans tout le monde 2 */
  const progres = EPOQUES.reduce((s, e) => s + e.tableaux.reduce((t, sc) => t + avancement(e, sc.id, etat), 0), 0)
    / EPOQUES.reduce((s, e) => s + e.tableaux.length, 0);

  /* bulles, voix, toasts et secousses s'effacent seuls */
  useEffect(() => { if (!bulle) return undefined; const t = setTimeout(() => setBulle(null), 4200); return () => clearTimeout(t); }, [bulle]);
  useEffect(() => { if (!voix.texte) return undefined; const t = setTimeout(() => setVoix((v) => ({ ...v, texte: "" })), 4500); return () => clearTimeout(t); }, [voix]);
  useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(null), 3800); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!refus) return undefined; const t = setTimeout(() => setRefus(false), 500); return () => clearTimeout(t); }, [refus]);
  useEffect(() => () => minuteurs.current.forEach(clearTimeout), []);
  /* tout est rangé : on prépare les vignettes de la finale pendant que MARTINE parle, puis la finale */
  useEffect(() => {
    if (!toutFini || phase !== "monde") return undefined;
    preparerVignettes();
    const t = setTimeout(() => setPhase("retablissement"), 3200);
    return () => clearTimeout(t);
  }, [toutFini, phase, setPhase]);
  useEffect(() => { setBulle(null); }, [tab, epoqueId]);
  /* la boîte à musique change d'air avec l'époque, et grince quand MARTINE parle */
  useEffect(() => { changerAir(epoqueId); }, [epoqueId]);
  useEffect(() => { if (voix.texte) grincer(); }, [voix]);

  /* MARTINE réagit à chaque tableau, puis à chaque époque, remis en ordre */
  const cle = EPOQUES.map((e) => e.tableaux.map((sc) => (avancement(e, sc.id, etat) === 1 ? 1 : 0)).join("")).join("|");
  useEffect(() => {
    let tableauNeuf = false;
    for (const e of EPOQUES) for (const sc of e.tableaux) {
      const k = `${e.id}/${sc.id}`;
      if (avancement(e, sc.id, etat) === 1 && !vus.current.tableaux.has(k)) { vus.current.tableaux.add(k); tableauNeuf = true; }
    }
    const neuve = EPOQUES.find((e) => epoqueFinie(e, etat) && !vus.current.epoques.has(e.id));
    if (neuve) {
      vus.current.epoques.add(neuve.id);
      if (!isMuted()) playClink();
      setVoix({ texte: MARTINE_EPOQUE[(vus.current.epoques.size - 1) % MARTINE_EPOQUE.length], mood: "vexe" });
      setToast({ texte: `✦ ${neuve.chapitre.epoque} : remis en ordre !`, ok: true });
    } else if (tableauNeuf) {
      if (!isMuted()) playClink();
      setVoix({ texte: MARTINE_REPARE[(vus.current.tableaux.size - 1) % MARTINE_REPARE.length], mood: "vexe" });
    }
    /* une époque rangée, mais des objets du futur encore dans le sac */
    if (ep.tableaux.every((sc) => avancement(ep, sc.id, etat) === 1) && sac.some((id) => FUTURS[id]?.epoque === ep.id)) {
      setToast({ texte: "Il reste des objets du futur dans ton sac.", ok: false });
    }
  }, [cle]); // eslint-disable-line react-hooks/exhaustive-deps

  const dire = (qui, texte, ok = false) => { n.current += 1; setBulle({ qui, texte, ok, n: n.current }); };
  const plusTard = (ms, f) => { minuteurs.current.push(setTimeout(f, ms)); };

  /* prendre ce que tient un personnage : ça va dans le sac, et on l'a en main */
  const onCarte = (id) => {
    const objet = tient[id];
    if (!objet) return;
    setEtat((e) => ({ ...e, tient: { ...e.tient, [id]: null }, sac: [...e.sac, objet], choisi: objet }));
  };
  /* ramasser un objet du futur */
  const onFutur = (id) => {
    setEtat((e) => ({ ...e, futurs: { ...e.futurs, [id]: "sac" }, sac: [...e.sac, id], choisi: id }));
  };
  const onPerso = (id) => {
    const p = PERSOS[id];
    const objet = tient[id];
    if (objet === p.support) { dire(id, p.dit, true); return; }
    if (!choisi) {
      if (objet) onCarte(id);
      else dire(id, p.cherche);
      return;
    }
    if (FUTURS[choisi]) { setRefus(true); dire(id, "Qu'est-ce que c'est que ça ?!"); return; }
    if (SUPPORTS[choisi].epoque !== p.epoque) { setRefus(true); dire(id, "Ce n'est pas de mon époque !"); return; }
    if (choisi !== p.support) { setRefus(true); dire(id, "Ce n'est pas à moi !"); return; }
    /* le bon : il le reprend (et rend ce qu'il tenait encore), puis rentre chez lui */
    setEtat((e) => {
      const reste = e.sac.filter((x) => x !== choisi);
      return { ...e, tient: { ...e.tient, [id]: choisi }, sac: objet ? [...reste, objet] : reste, choisi: null };
    });
    dire(id, p.dit, true);
    if (p.visite && !etat.chez[id]) {
      plusTard(2000, () => setSortant(id));
      plusTard(2600, () => { setEtat((e) => ({ ...e, chez: { ...e.chez, [id]: true } })); setSortant(null); });
    }
  };
  const onPoubelle = () => {
    if (!choisi) { setToast({ texte: "La poubelle temporelle : pour les objets du futur.", ok: true }); return; }
    const f = FUTURS[choisi];
    if (f) {
      setEtat((e) => ({ ...e, futurs: { ...e.futurs, [choisi]: "jete" }, sac: e.sac.filter((x) => x !== choisi), choisi: null }));
      setToast({ texte: `${f.emoji} ${f.nom} : ${f.quand} ! Rien du futur dans le passé.`, ok: true });
      return;
    }
    setRefus(true);
    setToast({ texte: `${SUPPORTS[choisi].nom} : ce n'est pas un objet du futur ! Rends-le à son propriétaire.`, ok: false });
  };
  const changerEpoque = (id) => { if (id !== epoqueId) { setEpoqueId(id); setTab(0); } };
  const recommencer = () => {
    minuteurs.current.forEach(clearTimeout); minuteurs.current = [];
    vus.current = { tableaux: new Set(), epoques: new Set() };
    setEtat(etatDeDepart()); setSortant(null); setTab(0); setBulle(null); setToast(null); setVoix({ texte: "", mood: "content" }); setPhase("monde");
    demarrerMusique(epoqueId);
  };

  if (phase === "retablissement") return <Retablissement onFin={() => setPhase("fin")} />;

  if (phase === "fin") {
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", padding: 16 }}>
        <style>{CSS}</style>
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 20%, #fff8e0 0%, #ffd07088 25%, transparent 60%)", animation: "mmLight 2.5s ease-out both", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center", animation: "mmIn 1200ms ease-out 600ms both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><MartineVoix grand texte="Non… Tu te souviens. Tout." mood="vexe" /></div>
          <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, borderRadius: 12, padding: "12px 22px", background: "#0a0806cc",
            fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 4, color: GOLD, fontWeight: 800 }}>
            À SUIVRE · LA CONFRONTATION AVEC MARTINE
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={recommencer} style={btn(GOLD, "#1a0e08")}>↺ Recommencer</button>
            <a href={RACINE()} style={{ ...btn("transparent", "#c8d4e2", "#3a4a64"), textDecoration: "none" }}>Rentrer ▸</a>
          </div>
        </div>
      </div>
    );
  }

  const monde = { etat, sortant, onCarte, onPerso, onFutur, bulle };
  const compteur = { fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 800, color: "#ffe8a0", whiteSpace: "nowrap" };
  const tableaux = TABLEAUX[ep.id];
  return (
    <div style={{ ...page, height: "100dvh", display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${RED}aa, transparent 55%)`, animation: "mmFlash 9s linear infinite", pointerEvents: "none", zIndex: 1 }} />
      <Vines />
      <Spores />

      {/* en-tête : MARTINE · le titre · les compteurs et le médiadex */}
      <div style={{ position: "relative", zIndex: 4, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, padding: "6px 12px 0" }}>
        <div style={{ minWidth: 0 }}><MartineVoix texte={voix.texte} mood={voix.mood} /></div>
        <TitreMonde2 taille={28} />
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span data-compteur="persos" title="Personnages de cette époque qui ont retrouvé leur support" style={compteur}>🧑 {nbServis}/{persosIci.length}</span>
          <span data-compteur="futurs" title="Objets du futur de cette époque jetés" style={compteur}>🗑️ {nbJetes}/{futursIci.length}</span>
          <span title="Époques remises en ordre" style={{ ...compteur, color: GOLD }}>✦ {finies.length}/{EPOQUES.length}</span>
          <button onClick={basculerSon} title={son ? "Couper le son" : "Remettre le son"} style={{ background: "#12060a", color: son ? "#ffb8be" : "#7a5a64", border: `2px solid ${son ? "#5a2a34" : "#3a1a24"}`, borderRadius: 10, padding: "5px 9px", fontSize: 16, cursor: "pointer" }}>{son ? "🔊" : "🔇"}</button>
          <button onClick={() => setMediadex(true)} title="Médiadex" style={{ background: "#2a1808", color: GOLD, border: "2px solid #c8a848", borderRadius: 10, padding: "5px 9px", fontSize: 16, cursor: "pointer" }}>🃏</button>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 4, padding: "0 12px" }}>
        <Crack progress={progres} h={12} />
        <Frise ici={ep.id} etat={etat} onEpoque={changerEpoque} />
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 1, color: "#c8a8b0", margin: "2px 0 5px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {ep.chapitre.epoque.toUpperCase()} · {tableaux[tab].name}
        </div>
      </div>

      {/* le tableau, avec la navigation du Jeu 2 */}
      <div ref={cellule} style={{ position: "relative", zIndex: 4, flex: 1, minHeight: 0, padding: "0 12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: cadre ? cadre.w : "100%", height: cadre ? cadre.h : "100%", position: "relative" }}>
          <Scene key={ep.id} scenes={tableaux} tab={tab} onTab={setTab} sceneProps={{ monde }} linear={false} />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 4, padding: "8px 12px 10px" }}>
        {toast && (
          <div key={toast.texte} style={{ position: "absolute", left: "50%", bottom: "100%", transform: "translateX(-50%)", marginBottom: 2, maxWidth: "92%", width: "max-content", zIndex: 5 }}>
            <div style={{ background: toast.ok ? "#0e1a12" : "#1a0408", color: toast.ok ? "#c8ffd8" : "#ffd8dc", border: `1px solid ${toast.ok ? "#5eff9e" : RED}`,
              borderRadius: 10, padding: "6px 14px", fontFamily: "Georgia, serif", fontSize: 14.5, textAlign: "center", animation: "m2Pop .25s ease-out both" }}>
              {toast.texte}
            </div>
          </div>
        )}
        <Sac sac={sac} choisi={choisi} secoue={refus} onPoubelle={onPoubelle} onChoisir={(id) => setEtat((e) => ({ ...e, choisi: id }))} />
      </div>
      {mediadex && <MediadexPanel onClose={() => setMediadex(false)} />}
    </div>
  );
}

function btn(bg, color, border) {
  return { background: bg, color, border: border ? `1px solid ${border}` : "none", borderRadius: 10, padding: "11px 22px", fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 800, letterSpacing: 1, cursor: "pointer", display: "inline-block" };
}
