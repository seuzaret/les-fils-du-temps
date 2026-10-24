import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "../engine/Martine.jsx";
import Scene from "../engine/Scene.jsx";
import { Figure, handPos } from "../engine/chars.jsx";
import MediadexPanel from "../chapters/jeu3/MediadexPanel.jsx";
import { assetUrl } from "../engine/assetUrl.js";
import { loadSave } from "../engine/save.js";
import { playClink, playMaterialize } from "../engine/sfx.js";
import { rng } from "../engine/scenery.jsx";
import chapter from "../chapters/07-xixe/data.js";
import { INVENTIONS, INVENTEURS, TIENT_AU_DEPART, MARTINE_REPARE } from "./inventeursXIXe.js";

/* ============================================================
   LE MONDE 2 — prototype (XIXe siècle)
   ------------------------------------------------------------
   Page à part (martine/index.html). Après la confrontation du
   Jeu 3, MARTINE garde le joueur chez elle, dans un monde à la
   Stranger Things. On s'y promène comme au Jeu 2 (flèches ‹ › et
   points, moteur Scene) dans les sept tableaux du chapitre 7 du
   Jeu 1, en noir et blanc. Dans chacun, un inventeur tient
   l'invention d'un autre : on la prend (elle va dans le sac), on
   la rend au bon inventeur, et le tableau reprend ses couleurs.
   Sept inventions rendues : le monde se fissure (fin du prototype).
   ============================================================ */

const noop = () => {};
const RED = "#ff3b45";
const GOLD = "#ffd166";
/* le tableau tant qu'il n'est pas réparé : noir et blanc, contrasté */
const NB = "grayscale(1) contrast(1.18) brightness(0.74)";
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
/* l'objet tenu : une carte avec la photo de l'invention (médiadex) ;
   cadre rouge qui grésille si ce n'est pas la bonne, doré sinon */
function CarteTenue({ id, x, y, juste, onClick }) {
  const inv = INVENTIONS[id];
  const W = 66, H = 52;
  const clip = `m2clip-${id}`;
  return (
    <g transform={`translate(${x},${y})`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <g style={{ animation: juste ? "none" : "m2Float 2.6s ease-in-out infinite, m2Jitter 3.2s linear infinite" }}>
        <title>{inv.nom}</title>
        <rect x={-4} y={-4} width={W + 8} height={H + 8} rx="5" fill={juste ? "#2a1e08" : "#1a0408"}
          stroke={juste ? GOLD : RED} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 8px ${juste ? GOLD : RED})` }} />
        <clipPath id={clip}><rect width={W} height={H} rx="2" /></clipPath>
        <image href={assetUrl(`assets/inventions/${inv.image}`)} width={W} height={H} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
      </g>
    </g>
  );
}

/* où se trouvent les mains de l'inventeur (et donc la carte) */
const BRAS_TENDU = { a1: 50, a2: 15 };
const BRAS_DUO = { a1: 40, a2: -10 };
function placeCarte(inv) {
  if (inv.existant) return { x: inv.main.x - 10, y: inv.main.y - 50 };
  if (inv.duo) {
    /* tenue à deux mains, devant les vestes : les visages restent visibles */
    const h = handPos({ side: 1, ...BRAS_DUO });
    return { x: inv.x - 33, y: inv.y + inv.s * h.y - 30 };
  }
  /* handPos donne déjà x < 0 pour le bras de gauche */
  const h = handPos({ side: inv.bras, ...BRAS_TENDU });
  const hx = inv.x + inv.s * h.x, hy = inv.y + inv.s * h.y;
  return { x: inv.bras > 0 ? hx - 10 : hx - 56, y: hy - 50 };
}

/* l'inventeur (ou les deux frères), dessiné avec le kit du jeu */
function Inventeur({ inv, mood }) {
  if (inv.existant) return null;
  const bas = { a1: 9, a2: 6 };
  if (inv.duo) {
    const d = 30 * inv.s;
    return (
      <g>
        <Figure x={inv.x - d} y={inv.y} s={inv.s} {...inv.fig} mood={mood} arms={[bas, BRAS_DUO]} />
        <Figure x={inv.x + d} y={inv.y} s={inv.s} {...inv.fig} beard="royal" hair="#4a3424" mood={mood} arms={[BRAS_DUO, bas]} />
      </g>
    );
  }
  const arms = inv.bras > 0 ? [bas, BRAS_TENDU] : [BRAS_TENDU, bas];
  return <Figure x={inv.x} y={inv.y} s={inv.s} {...inv.fig} mood={mood} arms={arms} />;
}

function Plaque({ inv, juste }) {
  const w = inv.nom.length * 7.4 + 18;
  return (
    <g transform={`translate(${inv.x},${inv.y + 16})`} style={{ pointerEvents: "none" }}>
      <rect x={-w / 2} y={-10} width={w} height={20} rx="4" fill="#0a0408" opacity="0.88" stroke={juste ? GOLD : RED} strokeWidth="1.2" />
      <text x="0" y="4.5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12.5" fontWeight="700" letterSpacing="0.5" fill={juste ? GOLD : "#ffb8be"}>{inv.nom}</text>
    </g>
  );
}

function Tableau({ sid, Orig, monde }) {
  const { tient, onCarte, onInventeur, bulle } = monde;
  const inv = INVENTEURS.find((i) => i.scene === sid);
  const objet = tient[sid];
  const juste = objet === inv.invention;
  const mood = juste ? "content" : objet ? "neutre" : "surpris";
  const carte = placeCarte(inv);
  const haut = inv.y - inv.s * 132;
  const zone = inv.duo
    ? { x: inv.x - 62 * inv.s, w: 124 * inv.s }
    : { x: inv.x - 34 * inv.s, w: 68 * inv.s };
  const maBulle = bulle?.scene === sid ? bulle : null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* le décor du Jeu 1 et l'inventeur : en noir et blanc tant que ce n'est pas réparé */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: juste ? "none" : NB, transition: "filter 2.2s ease" }}>
        <Orig collect={noop} action={noop} reveal={false} made={[]} flags={{}} queteQui={null} mode="jeu2" />
        <svg viewBox="0 0 1000 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <Inventeur inv={inv} mood={mood} />
        </svg>
      </div>
      {/* le voile du monde 2 : bleu nuit en haut, rouge sang en bas */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: juste ? 0 : 1, transition: "opacity 2.2s ease",
        background: "linear-gradient(180deg, rgba(20,40,80,0.28), rgba(10,6,20,0.18) 55%, rgba(120,10,30,0.32))", mixBlendMode: "multiply" }} />
      <svg viewBox="0 0 1000 560" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* zone cliquable : l'inventeur */}
        <rect x={zone.x} y={haut} width={zone.w} height={inv.y - haut + 4} fill="rgba(0,0,0,0.001)"
          style={{ cursor: "pointer" }}
          onClick={() => onInventeur(sid)}><title>{inv.nom}</title></rect>
        <Plaque inv={inv} juste={juste} />
        {objet && <CarteTenue id={objet} x={carte.x} y={carte.y} juste={juste} onClick={juste ? undefined : () => onCarte(sid)} />}
      </svg>
      {/* ce que dit l'inventeur */}
      {maBulle && (
        <div key={maBulle.n} style={{ position: "absolute", left: `${Math.min(84, Math.max(16, inv.x / 10))}%`, top: `${Math.max(2, (haut - 10) / 5.6)}%`,
          transform: "translate(-50%,-100%)", background: "#f8f2e4", color: "#1a1410", borderRadius: 12, padding: "6px 12px",
          fontFamily: "Georgia, serif", fontSize: "clamp(12px, 1.5vw, 16px)", fontWeight: 600, maxWidth: "46%", textAlign: "center",
          boxShadow: `0 0 0 2px ${maBulle.ok ? GOLD : RED}, 0 6px 18px rgba(0,0,0,0.5)`, animation: "m2Pop .25s ease-out both", pointerEvents: "none" }}>
          {maBulle.texte}
        </div>
      )}
    </div>
  );
}

/* les tableaux du chapitre 7, passés au moteur Scene comme au Jeu 2 */
const TABLEAUX = chapter.scenes.map((s) => ({
  id: s.id, name: s.name,
  Component: ({ monde }) => <Tableau sid={s.id} Orig={s.Component} monde={monde} />,
}));

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

/* ───────────── le sac ───────────── */
function Sac({ sac, choisi, onChoisir, secoue }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 12, minHeight: 64,
      background: "linear-gradient(180deg, #1a0a10, #0c0408)", border: "1px solid #4a1a24", boxShadow: `0 0 16px ${RED}22`, overflowX: "auto" }}>
      <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#ffb8be", whiteSpace: "nowrap" }}>🎒 SAC</span>
      {sac.length === 0 && <span style={{ fontSize: 13, color: "#7a5a64", fontStyle: "italic" }}>vide</span>}
      {sac.map((id) => {
        const on = choisi === id;
        return (
          <button key={id} onClick={() => onChoisir(on ? null : id)} title={INVENTIONS[id].nom}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", borderRadius: 10, cursor: "pointer", flex: "0 0 auto",
              background: on ? "#3a2808" : "#140810", color: on ? GOLD : "#f2e0e4", border: `2px solid ${on ? GOLD : "#5a2a34"}`,
              boxShadow: on ? `0 0 14px ${GOLD}88` : "none", transform: on ? "translateY(-3px)" : "none", transition: "all .15s",
              animation: on && secoue ? "m2Shake .45s ease-in-out" : "m2Pop .3s ease-out both" }}>
            <img src={assetUrl(`assets/inventions/${INVENTIONS[id].image}`)} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 4 }} />
            <span style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{INVENTIONS[id].nom}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── la page ───────────── */
const depart = () => ({ tient: { ...TIENT_AU_DEPART }, sac: [], choisi: null });

export default function MondeMartine() {
  const prenom = useMemo(readPrenom, []);
  const [phase, setPhase] = useState("accueil"); // accueil → titre → monde → fin
  useEffect(() => { playMaterialize(); }, []);
  useEffect(() => {
    if (phase !== "titre") return undefined;
    const t = setTimeout(() => setPhase("monde"), 4200);
    return () => clearTimeout(t);
  }, [phase]);

  const page = { minHeight: "100dvh", background: "radial-gradient(ellipse at 50% -10%, #3a0a14 0%, #0c0a18 38%, #05070c 75%)", color: "#e8eef5", fontFamily: "Georgia, serif", position: "relative", overflow: "hidden" };

  if (phase === "accueil") {
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", cursor: "pointer", padding: 16 }} onClick={() => setPhase("titre")}>
        <style>{CSS}</style>
        <Spores n={30} />
        <div style={{ animation: "mmIn 900ms ease-out both" }}>
          <MartineVoix grand texte={prenom ? `Bienvenue chez moi, ${prenom}.` : "Bienvenue chez moi."} />
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
  const [tab, setTab] = useState(0);
  const [etat, setEtat] = useState(depart);
  const [bulle, setBulle] = useState(null);
  const [refus, setRefus] = useState(null);
  const [voix, setVoix] = useState({ texte: "", mood: "content" });
  const [mediadex, setMediadex] = useState(false);
  const cellule = useRef(null);
  const cadre = useCadre(cellule);
  const n = useRef(0);

  const { tient, sac, choisi } = etat;
  const nbJustes = INVENTEURS.filter((i) => tient[i.scene] === i.invention).length;
  const fini = nbJustes === INVENTEURS.length;

  /* les bulles et la voix de MARTINE s'effacent seules */
  useEffect(() => { if (!bulle) return undefined; const t = setTimeout(() => setBulle(null), 4200); return () => clearTimeout(t); }, [bulle]);
  useEffect(() => { if (!voix.texte) return undefined; const t = setTimeout(() => setVoix((v) => ({ ...v, texte: "" })), 4500); return () => clearTimeout(t); }, [voix]);
  useEffect(() => { if (!refus) return undefined; const t = setTimeout(() => setRefus(null), 500); return () => clearTimeout(t); }, [refus]);
  useEffect(() => { if (!fini || phase !== "monde") return undefined; const t = setTimeout(() => setPhase("fin"), 3200); return () => clearTimeout(t); }, [fini, phase, setPhase]);
  useEffect(() => { setBulle(null); }, [tab]);

  const dire = (scene, texte, ok = false) => { n.current += 1; setBulle({ scene, texte, ok, n: n.current }); };

  /* prendre l'objet que tient l'inventeur : il va dans le sac, et on l'a en main */
  const onCarte = (scene) => {
    const objet = tient[scene];
    if (!objet) return;
    setEtat((e) => ({ tient: { ...e.tient, [scene]: null }, sac: [...e.sac, objet], choisi: objet }));
  };
  const onInventeur = (scene) => {
    const inv = INVENTEURS.find((i) => i.scene === scene);
    const objet = tient[scene];
    if (objet === inv.invention) { dire(scene, inv.dit, true); return; }
    if (!choisi) {
      if (objet) onCarte(scene);
      else dire(scene, "Où est mon invention ?");
      return;
    }
    if (choisi !== inv.invention) { setRefus(scene); dire(scene, "Ce n'est pas à moi !"); return; }
    /* la bonne : il la reprend (et rend ce qu'il tenait encore) */
    setEtat((e) => {
      const reste = e.sac.filter((id) => id !== choisi);
      return { tient: { ...e.tient, [scene]: choisi }, sac: objet ? [...reste, objet] : reste, choisi: null };
    });
    playClink();
    dire(scene, inv.dit, true);
    setVoix({ texte: MARTINE_REPARE[Math.min(nbJustes, MARTINE_REPARE.length - 1)], mood: "vexe" });
  };
  const recommencer = () => { setEtat(depart()); setTab(0); setBulle(null); setVoix({ texte: "", mood: "content" }); setPhase("monde"); };

  if (phase === "fin") {
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", padding: 16 }}>
        <style>{CSS}</style>
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 20%, #fff8e0 0%, #ffd07088 25%, transparent 60%)", animation: "mmLight 2.5s ease-out both", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center", animation: "mmIn 1200ms ease-out 600ms both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><MartineVoix grand texte="Non… Tu te souviens. Tout." mood="vexe" /></div>
          <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, borderRadius: 12, padding: "12px 22px", background: "#0a0806cc",
            fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 4, color: GOLD, fontWeight: 800 }}>
            FIN DU PROTOTYPE · XIXᵉ SIÈCLE
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={recommencer} style={btn(GOLD, "#1a0e08")}>↺ Recommencer</button>
            <a href={RACINE()} style={{ ...btn("transparent", "#c8d4e2", "#3a4a64"), textDecoration: "none" }}>Rentrer ▸</a>
          </div>
        </div>
      </div>
    );
  }

  const monde = { tient, onCarte, onInventeur, bulle };
  return (
    <div style={{ ...page, height: "100dvh", display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${RED}aa, transparent 55%)`, animation: "mmFlash 9s linear infinite", pointerEvents: "none", zIndex: 1 }} />
      <Vines />
      <Spores />

      {/* en-tête : MARTINE · le titre · la fissure et le médiadex */}
      <div style={{ position: "relative", zIndex: 4, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, padding: "8px 12px 2px" }}>
        <div style={{ minWidth: 0 }}><MartineVoix texte={voix.texte} mood={voix.mood} /></div>
        <TitreMonde2 taille={30} />
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
          <span title="Inventions rendues" style={{ fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 800, color: "#ffe8a0" }}>✦ {nbJustes}/{INVENTEURS.length}</span>
          <button onClick={() => setMediadex(true)} title="Médiadex" style={{ background: "#2a1808", color: GOLD, border: "2px solid #c8a848", borderRadius: 10, padding: "6px 10px", fontSize: 16, cursor: "pointer" }}>🃏</button>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 4, padding: "0 12px" }}>
        <Crack progress={nbJustes / INVENTEURS.length} h={14} />
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 1, color: "#c8a8b0", margin: "2px 0 6px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chapter.scenes[tab].name}
        </div>
      </div>

      {/* le tableau, avec la navigation du Jeu 2 */}
      <div ref={cellule} style={{ position: "relative", zIndex: 4, flex: 1, minHeight: 0, padding: "0 12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: cadre ? cadre.w : "100%", height: cadre ? cadre.h : "100%", position: "relative" }}>
          <Scene scenes={TABLEAUX} tab={tab} onTab={setTab} sceneProps={{ monde }} linear={false} />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 4, padding: "8px 12px 10px" }}>
        <Sac sac={sac} choisi={choisi} secoue={!!refus} onChoisir={(id) => setEtat((e) => ({ ...e, choisi: id }))} />
      </div>
      {mediadex && <MediadexPanel onClose={() => setMediadex(false)} />}
    </div>
  );
}

function btn(bg, color, border) {
  return { background: bg, color, border: border ? `1px solid ${border}` : "none", borderRadius: 10, padding: "11px 22px", fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 800, letterSpacing: 1, cursor: "pointer", display: "inline-block" };
}
