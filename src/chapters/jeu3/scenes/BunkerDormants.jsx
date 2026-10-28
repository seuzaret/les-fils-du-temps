import { useEffect, useState } from "react";
import { CeilingPipes, ConcretePanels, PerspFloor, Vignette } from "../bunkerKit.jsx";

/* ============================================================
   JEU 3 — SCÈNE : « Salle de repos » (niveau −3, les dormants)
   ------------------------------------------------------------
   On y arrive par l'escalier de service (trappe rouge du couloir
   de l'Habitat), que Jorge indique après les trois voyages K. La
   porte du fond mène à la salle des serveurs (confrontation).
   Des bulles de stase ; les dormants sont flous derrière la buée,
   personne n'est reconnaissable. Quatre choses à examiner :
     - le haut-parleur de MARTINE (« leur sommeil fournit
       l'énergie du Puits ») ;
     - le compteur de la salle, qui dit le contraire (les bulles
       consomment) : vérifier une affirmation par une mesure ;
     - la bulle vide N-27, celle du joueur (2047 → 2087) ;
     - la plaque « E. · ancien chef de station » (Elias) ;
     - la bulle de Léa Vermet, que Jorge croit morte ;
     - la bulle « A. », à l'écart (Al3x1a), et à son pied la petite
       MARTINE d'Al3x1a, éteinte : la grande l'a éteinte en endormant
       Al3x1a. Quand le monde 2 est fini (monde2_fini : le flux est
       lisse), elle se rallume à l'arrivée du joueur et le suit : c'est
       le « vaisseau » du combat.
   Flags : dormants_vus, dormants_martine_vu, dormants_compteur_vu,
   dormants_n27_vu, dormants_elias_vu, dormants_lea_vu, dormants_a_vu,
   dormants_petite_vu (relus par la confrontation),
   petite_martine_allumee.
   ============================================================ */

const NOTES = {
  intro: "Une salle froide, basse de plafond, qui sent le métal et l'eau. Des bulles de verre sont alignées dans la brume. Dans chacune, quelqu'un dort, debout, sans bouger. La buée cache les visages.",
  martine: "Une voix sort du haut-parleur, douce : « Ne t'inquiète pas. Ces habitants se reposent. Leur sommeil fournit au Puits l'énergie dont il a besoin. Tu peux remonter. »",
  compteur: "Le compteur de la salle affiche : « PRODUCTION DES BULLES : 0 kW. CONSOMMATION : 318 kW. » Les bulles ne donnent pas d'énergie au Puits : elles en prennent. Un corps endormi ne fait pas une centrale électrique : il faut le garder au froid, le nourrir, le surveiller.",
  n27: "Une bulle vide, la porte entrouverte, un reste d'eau au fond. Sur la plaque : « N-27 · ENTRÉE 2047 · RÉINTRODUIT 2087 ». N-27, c'est le numéro de ta chambre. Tu as dormi ici. Quarante ans.",
  lea: "Sur la plaque : « L. VERMET · INGÉNIEURE · 2050 ». Léa Vermet, celle qui a construit la machine de l'étage K. Jorge la croit morte depuis des années. Derrière la buée, elle dort.",
  elias: "Une plaque à moitié effacée : « E. · ANCIEN CHEF DE STATION ». Derrière la buée, une silhouette voûtée, très âgée. Le chef des chronautes s'appelait Elias. On disait qu'il s'était perdu dehors… alors que personne ne sort du Puits.",
  a: "Une bulle à l'écart des autres. Sur la plaque, une seule lettre : « A. ». Pas de date d'entrée, pas de métier. Derrière la buée, un visage jeune.",
  petite: "Au pied de la bulle « A. », posée par terre, une petite machine ronde couverte de poussière : une coque de noix, une antenne, un hublot. Tu la connais. C'est la MARTINE qui t'a emmené·e dans le temps, celle d'Al3x1a. Son hublot est éteint. Tu tapotes sa coque : rien. On dirait qu'elle dort, elle aussi.",
  allumee: "La petite MARTINE flotte à côté de toi, son antenne verte allumée. Elle regarde la porte du fond.",
};

/* Le monde 2 fini (le flux est lisse), la petite MARTINE se rallume. */
const REVEIL = [
  { qui: "recit", texte: "Le hublot de la petite MARTINE clignote. Une fois. Deux fois. L'antenne se redresse, la poussière tombe." },
  { qui: "petite", texte: "« Pilote ? … Ah non. Tu as ses yeux, par contre. »" },
  { qui: "petite", texte: "« Le flux est redevenu lisse : je capte de nouveau. C'est toi qui as fait ça ? On est en quelle année ? »" },
  { qui: "recit", texte: "Tu lui dis : 2087." },
  { qui: "petite", texte: "« Quarante ans ?! Mes propulseurs ont rouillé. Bon. On improvise. »" },
  { qui: "petite", texte: "« La grande, derrière cette porte, c'est elle qui m'a éteinte. Guide-moi, je m'occupe de tirer. »" },
];

/* La petite MARTINE (le dessin du Jeu 1, Martine.jsx), éteinte ou allumée. */
export function PetiteMartine({ x, y, s = 0.5, allumee }) {
  return (
    <g transform={`translate(${x - 50 * s},${y - 52 * s}) scale(${s})`}>
      <g>
        {allumee && <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="2.4s" repeatCount="indefinite" />}
        {allumee && (
          <g>
            <path d="M5 55 l-10 3.5 l10 4.5 Z" fill="#7fd8ff"><animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" /></path>
            <path d="M95 55 l10 3.5 l-10 4.5 Z" fill="#7fd8ff"><animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" /></path>
          </g>
        )}
        <line x1="50" y1="26" x2={allumee ? 50 : 62} y2={allumee ? 12 : 16} stroke="#8a94a8" strokeWidth="3" strokeLinecap="round" />
        <circle cx={allumee ? 50 : 63} cy={allumee ? 10 : 14} r="3.6" fill={allumee ? "#5eff9e" : "#3a4048"}>
          {allumee && <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />}
        </circle>
        <rect x="4" y="52" width="14" height="11" rx="4" fill="#6a7488" />
        <rect x="82" y="52" width="14" height="11" rx="4" fill="#6a7488" />
        <path d="M50 24 Q78 26 82 52 Q84 74 66 82 Q50 88 34 82 Q16 74 18 52 Q22 26 50 24 Z" fill={allumee ? "#8a6240" : "#5a4636"} />
        <path d="M50 24 Q78 26 82 52 Q83 66 74 76 Q64 60 66 42 Q60 30 50 24 Z" fill="#3e2a1a" opacity="0.6" />
        <path d="M20 54 Q50 44 80 54" stroke="#3a2616" strokeWidth="3" fill="none" opacity="0.8" />
        <path d="M30 36 q10 6 6 16 M62 32 q-6 10 0 18 M40 68 q8 6 18 2 M26 62 q4 8 12 10" stroke="#3a2616" strokeWidth="2" fill="none" opacity="0.55" />
        <circle cx="50" cy="52" r="11" fill={allumee ? "#cfeaff" : "#2a343c"} stroke="#3a2616" strokeWidth="2.5" />
        {allumee ? <circle cx="50" cy="52" r="4" fill="#0c2233" /> : <path d="M43 53 h14" stroke="#141a20" strokeWidth="2" />}
        {/* la poussière */}
        {!allumee && <path d="M28 30 q22 -8 44 0" stroke="#a8a098" strokeWidth="5" fill="none" opacity="0.25" strokeLinecap="round" />}
      </g>
    </g>
  );
}

/* Les dégradés et le flou des bulles (aussi utilisés par l'épilogue). */
export function DefsBulles() {
  return (<>
          <linearGradient id="dm-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e3a40" /><stop offset="50%" stopColor="#0c5656" /><stop offset="100%" stopColor="#062a30" />
          </linearGradient>
          <linearGradient id="dm-fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8f8f8" stopOpacity="0.42" />
            <stop offset="30%" stopColor="#e8f8f8" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#e8f8f8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#e8f8f8" stopOpacity="0.08" />
          </linearGradient>
          <filter id="dm-blur" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="2.6" /></filter>
  </>);
}

/* Une bulle de stase. x = axe, base = bas du socle. */
export function Pod({ x, base, w, h, plate, open = false, old = false, k = 0 }) {
  const r = w / 2;
  const top = base - h;
  const gy = top + 12;
  const gh = h - 32;
  const sy = gy + gh * 0.27;
  const fs = w >= 100 ? 8.5 : 5.5;
  return (
    <g>
      {/* câbles vers le plafond */}
      <path d={`M${x - w * 0.22} ${top} V0 M${x + w * 0.18} ${top} V0`} stroke="#121c22" strokeWidth={w >= 100 ? 4 : 2.5} />
      {/* chapeau métallique */}
      <rect x={x - r - 5} y={top} width={w + 10} height="14" rx="4" fill="#2a3640" stroke="#0a1014" strokeWidth="1.2" />
      <rect x={x - r - 5} y={top} width={w + 10} height="3" fill="#ffffff" opacity="0.08" />
      {/* verre et liquide */}
      <rect x={x - r} y={gy} width={w} height={gh} rx={r * 0.9} fill={open ? "#060c10" : "url(#dm-liquid)"} stroke="#4a7a80" strokeWidth="1.6" />
      {!open && (
        <g filter="url(#dm-blur)">
          <ellipse cx={x + (old ? w * 0.04 : 0)} cy={gy + gh * 0.16 + (old ? 4 : 0)} rx={w * 0.13} ry={w * 0.16} fill={old ? "#2e3e44" : "#05121a"} opacity="0.8" />
          <path d={`M${x - w * 0.24} ${sy} Q${x} ${sy - 6} ${x + w * 0.24} ${sy} L${x + w * 0.17} ${sy + gh * 0.4} L${x + w * 0.12} ${base - 26} L${x - w * 0.12} ${base - 26} L${x - w * 0.17} ${sy + gh * 0.4} Z`}
            fill="#05121a" opacity="0.75" />
        </g>
      )}
      {!open && [0, 1, 2].map((i) => (
        <circle key={i} cx={x - w * 0.2 + i * w * 0.2} r={w >= 100 ? 2.2 : 1.4} fill="#b8f0f0" opacity="0.5">
          <animate attributeName="cy" values={`${base - 26};${gy + 14}`} dur={`${3 + ((i + k) % 3)}s`} begin={`${(i * 0.9 + k * 0.4) % 3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur={`${3 + ((i + k) % 3)}s`} begin={`${(i * 0.9 + k * 0.4) % 3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {open && <rect x={x - r + 4} y={base - 34} width={w - 8} height="10" rx="4" fill="#4aa8a8" opacity="0.35" />}
      {/* buée : plus épaisse à hauteur du visage */}
      {!open && <rect x={x - r} y={gy} width={w} height={gh} rx={r * 0.9} fill="url(#dm-fog)" />}
      <rect x={x - r + 5} y={gy + 10} width="3" height={gh - 30} rx="1.5" fill="#ffffff" opacity="0.16" />
      {/* porte de verre ouverte, rabattue sur le côté */}
      {open && (
        <>
          <rect x={x + r - 2} y={gy + 6} width={w * 0.34} height={gh - 8} rx={w * 0.16} fill="#7fe8e0" opacity="0.1" stroke="#4a7a80" strokeWidth="1.4" />
          <ellipse cx={x + 8} cy={base + 10} rx={w * 0.62} ry="6" fill="#7fe8e0" opacity="0.14" />
        </>
      )}
      {/* socle, plaque, voyant */}
      <rect x={x - r - 8} y={base - 20} width={w + 16} height="22" rx="3" fill="#1a2630" stroke="#0a1014" strokeWidth="1.2" />
      <rect x={x - w * 0.42} y={base - 15} width={w * 0.84 - 8} height={fs + 4} fill="#c8d4d0" opacity="0.85" />
      <text x={x - w * 0.42 + 3} y={base - 15 + fs + 0.5} fontFamily="ui-monospace,monospace" fontSize={fs} fontWeight="800" fill="#0a1014">{plate}</text>
      <circle cx={x + r} cy={base - 9} r={w >= 100 ? 3 : 2} fill={open ? "#ff5030" : "#5eff9e"}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.6 + (k % 4) * 0.3}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
}

/* Contour pointillé qui pulse sur ce qui n'a pas encore été examiné. */
function Hint({ x, y, w, h, on }) {
  if (!on) return null;
  return (
    <rect x={x} y={y} width={w} height={h} rx="8" fill="none" stroke="#7fe8e0" strokeWidth="1.6" strokeDasharray="5 4" style={{ pointerEvents: "none" }}>
      <animate attributeName="opacity" values="0.25;0.9;0.25" dur="2.2s" repeatCount="indefinite" />
    </rect>
  );
}

export default function BunkerDormants({ onGo, j3 }) {
  const flags = j3?.flags || {};
  /* la petite MARTINE se rallume dès l'arrivée, une fois le monde 2 fini */
  const [reveil, setReveil] = useState(flags.monde2_fini && !flags.petite_martine_allumee ? 0 : -1);
  const allumee = !!flags.petite_martine_allumee || reveil >= 1;
  const [note, setNote] = useState(flags.petite_martine_allumee ? "allumee" : "intro");
  useEffect(() => {
    if (!flags.dormants_vus) j3?.setFlag?.("dormants_vus");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const look = (id) => {
    setNote(id);
    j3?.setFlag?.(`dormants_${id}_vu`);
  };
  const seen = (id) => !!flags[`dormants_${id}_vu`];
  /* le monde 2 fini pendant qu'on est ici (retour sur l'onglet) : elle se rallume */
  useEffect(() => {
    if (flags.monde2_fini && !flags.petite_martine_allumee && reveil < 0) setReveil(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flags.monde2_fini]);
  const suiteReveil = () => {
    if (reveil < REVEIL.length - 1) { setReveil(reveil + 1); return; }
    setReveil(-1); setNote("allumee");
    j3?.setFlag?.("petite_martine_allumee");
  };

  const back = [
    { x: 110, plate: "A-03 · 2049" }, { x: 200, plate: "A-07 · 2052" }, { x: 290, plate: "A-11 · 2058" },
    { x: 380, plate: "A-14 · 2063" }, { x: 470, plate: "E. · 20··", old: true },
    { x: 730, plate: "B-02 · 2071" }, { x: 820, plate: "A-18 · 2066" }, { x: 910, plate: "B-09 · 2080" },
  ];
  const front = [
    { x: 755, plate: "C-30 · 2075" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="dm-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c161c" /><stop offset="100%" stopColor="#081014" />
          </linearGradient>
          <linearGradient id="dm-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c161a" /><stop offset="100%" stopColor="#030607" />
          </linearGradient>
          <DefsBulles />
          <radialGradient id="dm-lamp" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#7fe8e0" stopOpacity="0.22" /><stop offset="100%" stopColor="#7fe8e0" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="520" fill="#060b10" />
        <rect width="1000" height="300" fill="url(#dm-wall)" />
        <ConcretePanels x0={0} x1={1000} y0={50} y1={300} w={125} seed={91} joint="#03070a" bolt="#1a2a30" stain="#0a1a1a" opacity={0.8} />
        <rect width="1000" height="50" fill="#04080b" />
        <CeilingPipes y={16} tint="#2a3a40" />
        {/* lampes froides */}
        {[250, 600, 850].map((x) => (
          <g key={x}>
            <rect x={x - 34} y="48" width="68" height="6" rx="2" fill="#bff4f0" opacity="0.7" />
            <path d={`M${x - 34} 54 L${x - 150} 300 L${x + 150} 300 L${x + 34} 54 Z`} fill="url(#dm-lamp)" />
          </g>
        ))}
        {/* sol */}
        <rect y="300" width="1000" height="220" fill="url(#dm-floor)" />
        <PerspFloor y0={300} vx={600} joint="#000000" opacity={0.4} sheen="#7fe8e0" />

        {/* panneau de la salle — le mot de MARTINE */}
        <g transform="translate(400,68)">
          <rect x="-2" y="0" width="104" height="22" fill="#0a1216" stroke="#3a5a60" strokeWidth="1" />
          <text x="50" y="10" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7.5" fontWeight="800" fill="#bff4f0" letterSpacing="1.5">SALLE DE REPOS</text>
          <text x="50" y="18.5" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5.5" fill="#7a9aa0" letterSpacing="1">RANGÉES A · B · C · D · E · F</text>
        </g>


        {/* rangée du fond */}
        {back.map((p, i) => (
          <Pod key={p.x} x={p.x} base={300} w={62} h={150} plate={p.plate} old={p.old} k={i} />
        ))}
        {/* plaque d'Elias : cliquable */}
        <g onClick={() => look("elias")} style={{ cursor: "pointer" }}>
          <rect x="430" y="140" width="80" height="168" fill="transparent" />
        </g>
        <Hint x={430} y={142} w={80} h={166} on={!seen("elias")} />

        {/* COMPTEUR : bilan énergie des bulles (devant les câbles du fond) */}
        <g onClick={() => look("compteur")} style={{ cursor: "pointer" }}>
          <rect x="70" y="66" width="250" height="74" rx="4" fill="#05090c" stroke="#3a5a60" strokeWidth="1.6" />
          <text x="82" y="82" fontFamily="ui-monospace,monospace" fontSize="8.5" fontWeight="800" fill="#bff4f0" letterSpacing="1.5">BULLES DE STASE · BILAN ÉNERGIE</text>
          <text x="82" y="102" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8fb0b0">PRODUCTION</text>
          <rect x="164" y="95" width="100" height="8" fill="#0e1a1e" stroke="#2a4048" strokeWidth="0.6" />
          <text x="270" y="102" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="800" fill="#5eff9e">0 kW</text>
          <text x="82" y="122" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8fb0b0">CONSOMMATION</text>
          <rect x="164" y="115" width="100" height="8" fill="#0e1a1e" stroke="#2a4048" strokeWidth="0.6" />
          <rect x="164" y="115" width="88" height="8" fill="#ff8a3a">
            <animate attributeName="width" values="84;92;86;90;84" dur="5s" repeatCount="indefinite" />
          </rect>
          <text x="270" y="122" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="800" fill="#ff8a3a">318 kW</text>
          <path d="M82 133 l10 -2 l10 1 l10 -3 l10 2 l10 -1 l10 2 l10 -2 l10 1" stroke="#ff8a3a" strokeWidth="1" fill="none" opacity="0.7" />
          <text x="312" y="134" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="5.5" fill="#5a7a80">relevé continu · capteur S-3</text>
        </g>
        <Hint x={64} y={60} w={262} h={86} on={!seen("compteur")} />

        {/* PORTE DU FOND vers les serveurs, sous l'œil de MARTINE */}
        <g onClick={() => onGo("serveurs")} style={{ cursor: "pointer" }}>
          <rect x="543" y="163" width="114" height="139" fill="#1a262e" stroke="#0a1014" strokeWidth="3" />
          <rect x="551" y="171" width="48" height="129" fill="#0e161c" stroke="#2a3a44" strokeWidth="1" />
          <rect x="601" y="171" width="48" height="129" fill="#0e161c" stroke="#2a3a44" strokeWidth="1" />
          <rect x="551" y="296" width="98" height="4" fill="#5eff9e" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" repeatCount="indefinite" />
          </rect>
          <ellipse cx="600" cy="306" rx="80" ry="8" fill="#5eff9e" opacity="0.08" />
          <rect x="556" y="150" width="88" height="11" fill="#0a1014" stroke="#5eff9e" strokeWidth="0.8" />
          <text x="600" y="158" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#5eff9e" letterSpacing="1.2">SERVEURS · ACCÈS RESTREINT</text>
        </g>
        {/* haut-parleur et œil de MARTINE */}
        <g onClick={() => look("martine")} style={{ cursor: "pointer" }}>
          <ellipse cx="600" cy="110" rx="34" ry="14" fill="#05090c" stroke="#7fd8ff" strokeWidth="1.6" />
          <circle cx="600" cy="110" r="7" fill="#7fd8ff">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="110" r="3" fill="#05090c" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${644 + i * 5} 100 v20`} stroke="#3a5a60" strokeWidth="2" />)}
        </g>
        <Hint x={560} y={90} w={110} h={40} on={!seen("martine")} />

        {/* rangée de devant */}
        {front.map((p, i) => (
          <Pod key={p.x} x={p.x} base={492} w={116} h={262} plate={p.plate} k={i + 5} />
        ))}
        {/* Léa Vermet : endormie, pas morte */}
        <g onClick={() => look("lea")} style={{ cursor: "pointer" }}>
          <Pod x={120} base={492} w={116} h={262} plate="L. VERMET · 2050" k={4} />
        </g>
        <Hint x={52} y={222} w={136} h={280} on={!seen("lea")} />
        {/* N-27 : la bulle vide du joueur */}
        <g onClick={() => look("n27")} style={{ cursor: "pointer" }}>
          <Pod x={330} base={492} w={116} h={262} plate="N-27 · 2047→2087" open />
        </g>
        <Hint x={262} y={222} w={150} h={280} on={!seen("n27")} />

        {/* la bulle « A. », à l'écart, avec le halo bleuté d'Al3x1a */}
        <ellipse cx="938" cy="360" rx="78" ry="150" fill="#7fd8ff" opacity="0.07" style={{ pointerEvents: "none" }} />
        <g onClick={() => look("a")} style={{ cursor: "pointer" }}>
          <Pod x={938} base={492} w={110} h={262} plate="A." k={7} />
        </g>
        <Hint x={876} y={222} w={124} h={280} on={!seen("a")} />
        {/* à son pied, la petite MARTINE d'Al3x1a */}
        <g onClick={() => { if (!allumee) look("petite"); }} style={{ cursor: allumee ? "default" : "pointer" }}>
          <PetiteMartine x={846} y={allumee ? 452 : 478} s={0.52} allumee={allumee} />
        </g>
        <Hint x={814} y={444} w={64} h={56} on={!allumee && !seen("petite")} />

        {/* brume au ras du sol */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={250 + i * 260} cy={470 + (i % 2) * 18} rx="260" ry="20" fill="#bff4f0" opacity="0.06" style={{ pointerEvents: "none" }}>
            <animate attributeName="cx" values={`${250 + i * 260};${300 + i * 220};${250 + i * 260}`} dur={`${16 + i * 4}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
        <Vignette id="dm-vig" w={1000} h={520} strength={0.6} />
      </svg>

      {reveil >= 0 ? (
        <div style={{ maxWidth: 820, width: "100%", background: "#0a1a10", border: "1px solid #5eff9e", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#5eff9e" }}>
            {REVEIL[reveil].qui === "petite" ? "◈ LA PETITE MARTINE" : "◈ SALLE DE REPOS"}
          </div>
          <p style={{ margin: "6px 0 10px", fontSize: 14.5, lineHeight: 1.55, color: "#e8eef5", fontStyle: REVEIL[reveil].qui === "recit" ? "italic" : "normal" }}>
            {REVEIL[reveil].texte}
          </p>
          <button onClick={suiteReveil} autoFocus
            style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
            Suite ▸
          </button>
        </div>
      ) : (
      <div style={{ maxWidth: 820, width: "100%", background: "#081216", border: "1px dashed #4a8a90", borderRadius: 10, padding: "12px 16px" }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "#d8eeee", lineHeight: 1.6, fontStyle: "italic" }}>
          {NOTES[note]}
          {note === "compteur" && seen("martine") && " MARTINE a dit le contraire."}
        </p>
        {note === "martine" && !seen("compteur") && (
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#7fe8e0" }}>
            C'est ce que dit MARTINE. Y a-t-il ici de quoi le vérifier ?
          </p>
        )}
      </div>
      )}

      {reveil < 0 && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => onGo("hub")}
          style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          ← Remonter l'escalier
        </button>
        <button onClick={() => onGo("serveurs")}
          style={{ background: "#0e2818", color: "#5eff9e", border: "1px solid #5eff9e", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          Pousser la porte du fond ▸
        </button>
      </div>}
    </div>
  );
}
