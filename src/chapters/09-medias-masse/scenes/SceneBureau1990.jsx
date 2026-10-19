import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Speckle } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 9 — Tableau : Bureau, 1990. Céline, 25 ans, cadre
   en informatique, dans un open-space naissant. Un PC beige
   avec écran cathodique 14", clavier, souris à boule, une
   imprimante matricielle, une pile de CD-Rom vierges à graver.
   Windows 3.0 tourne à l'écran (arrière-plan cyan/gris).
   ============================================================ */

export default function SceneBureau1990({ collect, action, reveal, made = [], flags = [] }) {
  const cdCharge = !!flags.cd_charge;
  const grave = made.includes("msg_cd");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="b90-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8dccc" />
          <stop offset="45%"  stopColor="#d0c4b0" />
          <stop offset="100%" stopColor="#8a8478" />
        </linearGradient>
        <linearGradient id="b90-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4a5060" />
          <stop offset="55%"  stopColor="#2c3240" />
          <stop offset="100%" stopColor="#12161e" />
        </linearGradient>
        <linearGradient id="b90-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d8c098" />
          <stop offset="55%"  stopColor="#a88a5c" />
          <stop offset="100%" stopColor="#6a5030" />
        </linearGradient>
        <linearGradient id="b90-pc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#efdfc0" />
          <stop offset="45%"  stopColor="#d8c090" />
          <stop offset="100%" stopColor="#a89878" />
        </linearGradient>
        {/* grain fin pour le mur et le sol */}
        <filter id="b90-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        {/* marbrures de la moquette */}
        <filter id="b90-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        {/* halo doux pour la lueur d'écran */}
        <filter id="b90-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {/* lueur bleutée du moniteur reflétée sur Céline */}
        <radialGradient id="b90-screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7fd8ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ═══ MUR beige + moquette gris-bleu (open-space années 90) ═══ */}
      <PLayer depth={1}>
        <rect width="1000" height="560" fill="url(#b90-wall)" />
        {/* patine du mur : grain fin + halo doré près de la fenêtre */}
        <rect width="1000" height="440" fill="#5a4028" opacity="0.14" filter="url(#b90-grain)" />
        <ellipse cx="390" cy="140" rx="240" ry="120" fill="#f0dcb0" opacity="0.25" filter="url(#b90-blur)" />
        {/* frise horizontale */}
        <rect x="0" y="220" width="1000" height="2" fill="#8a7060" />
        <rect x="0" y="222" width="1000" height="6" fill="#6a5040" />
        {/* petit reflet doré sous la frise (lumière rasante du matin par la fenêtre) */}
        <rect x="0" y="228" width="1000" height="1" fill="#f0d8b0" opacity="0.35" />

        {/* FENETRE : vue open-space sur les tours de La Defense (ou tout
            quartier d'affaires 90s), ciel matin bleute + skyline dentelee. */}
        <g transform="translate(390,50)">
          {/* dormant */}
          <rect x="-90" y="0" width="180" height="160" fill="#3a2818" />
          {/* vitre */}
          <rect x="-84" y="6" width="168" height="148" fill="#a8c8e0" />
          {/* ciel dégradé matin */}
          <rect x="-84" y="6"   width="168" height="80" fill="#b8dcf0" />
          <rect x="-84" y="86"  width="168" height="68" fill="#e6d8b0" />
          {/* soleil pale */}
          <circle cx="60" cy="42" r="12" fill="#fff2c8" opacity="0.9" />
          {/* skyline : tours de bureaux */}
          <path d="M-84 154 L-84 100 L-64 100 L-64 88 L-44 88 L-44 108 L-24 108 L-24 76 L-4 76 L-4 108 L16 108 L16 96 L36 96 L36 118 L56 118 L56 108 L76 108 L76 128 L84 128 L84 154 Z" fill="#4a5a70" opacity="0.85" />
          <path d="M-84 154 L-84 130 L-40 130 L-40 118 L-10 118 L-10 132 L20 132 L20 122 L60 122 L60 138 L84 138 L84 154 Z" fill="#2a3648" opacity="0.9" />
          {/* fenetres eclairees des tours */}
          {[[-58,110],[-48,115],[-32,90],[-14,94],[-8,102],[4,84],[24,100],[40,108],[62,120],[70,130]].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="2" height="2" fill="#ffe08a" opacity="0.9" />
          ))}
          {/* petite pancarte "6ᵉ étage" */}
          <rect x="-80" y="10" width="24" height="8" fill="#f0e6d0" stroke="#3a2818" strokeWidth="0.4" />
          <text x="-68" y="17" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#3a2818">6e</text>
          {/* croisillon central */}
          <path d="M-84 80 h168 M0 6 v148" stroke="#3a2818" strokeWidth="3" />
        </g>

        {/* AFFICHE JURASSIC PARK au mur entre la fenetre et le tableau blanc */}
        <g transform="translate(600,60)">
          <rect x="0" y="0" width="88" height="120" fill="#0a0806" stroke="#c8b090" strokeWidth="2" />
          {/* fond degrade rouge/orangé (jungle en feu) */}
          <rect x="4" y="4" width="80" height="112" fill="#2a1408" />
          {/* silhouette du dino T-Rex qui rugit */}
          <path d="M20 92 L20 60 L28 56 L34 46 L46 40 L58 44 L64 52 L60 60 L64 66 L68 78 L60 84 L52 82 L44 88 L36 84 L28 92 Z" fill="#1a0e04" />
          {/* dents */}
          <path d="M52 46 l1 3 l1.4 -3 M55 46 l1 3 l1.4 -3 M58 46 l1 3 l1.4 -3" stroke="#f8f0d8" strokeWidth="0.6" fill="none" />
          {/* oeil rouge */}
          <circle cx="52" cy="50" r="1.2" fill="#c02830" />
          {/* soleil rouge derrière le dino (silhouette iconique) */}
          <circle cx="60" cy="30" r="14" fill="#c02830" opacity="0.85" />
          {/* logo JURASSIC PARK stylise en jaune */}
          <text x="44" y="106" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="9" fontWeight="900" fill="#e0a848" letterSpacing="0.6">JURASSIC</text>
          <text x="44" y="114" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="9" fontWeight="900" fill="#e0a848" letterSpacing="0.6">PARK</text>
          {/* punaises */}
          <circle cx="6"  cy="6"   r="1.4" fill="#c8c8c8" />
          <circle cx="82" cy="6"   r="1.4" fill="#c8c8c8" />
        </g>

        {/* palmier en pot du bureau chic 90s (+ SUPPORT en bois) */}
        <g transform="translate(150,340)">
          {/* stand/pied cache-pot en bois clair */}
          <rect x="-24" y="90" width="48" height="10" fill="#8a5828" stroke="#3a1e10" strokeWidth="1" />
          <rect x="-20" y="100" width="6" height="60" fill="#5a3818" />
          <rect x="14" y="100" width="6" height="60" fill="#5a3818" />
          <rect x="-24" y="150" width="48" height="10" fill="#8a5828" stroke="#3a1e10" strokeWidth="1" />
          {/* le pot */}
          <path d="M-14 60 L-18 90 L18 90 L14 60 Z" fill="#3a2418" />
          <path d="M0 60 Q-20 20 -40 30 M0 60 Q20 20 40 30 M0 60 Q-30 0 -50 -10 M0 60 Q30 0 50 -10 M0 60 Q-10 -20 -20 -40 M0 60 Q10 -20 20 -40 M0 60 Q0 -40 -6 -70" stroke="#4a7a30" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M-40 30 q-6 -6 -4 -14" fill="#5a9040" opacity="0.8" />
          <path d="M40 30 q6 -6 4 -14" fill="#5a9040" opacity="0.8" />
        </g>
        {/* tableau blanc au mur avec quelques notes */}
        <g transform="translate(720,80)">
          <rect x="0" y="0" width="180" height="100" fill="#f8f8f0" stroke="#3a3a3a" strokeWidth="2" />
          <path d="M20 22 h60 M20 36 h80 M20 50 h40 M20 66 h100 M20 80 h50" stroke="#4a6aa0" strokeWidth="1.4" />
          <path d="M136 24 L162 24 L162 46 L136 46 Z" fill="none" stroke="#e83820" strokeWidth="1.4" />
          <path d="M140 34 L148 42 L160 28" stroke="#e83820" strokeWidth="1.4" fill="none" />
          {/* petit sticker POKEBALL colle dans le coin du tableau */}
          <g transform="translate(168,90)">
            <circle r="10" fill="#f0f0e8" stroke="#0a0806" strokeWidth="1.6" />
            <path d="M-10 0 a10 10 0 0 1 20 0 Z" fill="#e83820" stroke="#0a0806" strokeWidth="1.6" />
            <path d="M-10 0 h20" stroke="#0a0806" strokeWidth="1.6" />
            <circle r="3" fill="#f8f8f0" stroke="#0a0806" strokeWidth="1.4" />
            <circle r="1.4" fill="#c8c8c8" />
          </g>
        </g>
        {/* faux plafond à dalles, pavés lumineux */}
        <rect x="-40" y="-10" width="1080" height="44" fill="#d8d4cc" />
        {Array.from({ length: 13 }).map((_, i) => <path key={i} d={`M${-100 + i * 100} -10 L${(500 + (-100 + i * 100 - 500) * 0.9).toFixed(0)} 34`} stroke="#a8a49c" strokeWidth="1.2" />)}
        <path d="M-40 14 H1040 M-40 34 H1040" stroke="#a8a49c" strokeWidth="1.2" />
        {[150, 500, 850].map((x) => <g key={x}><rect x={x - 46} y="16" width="92" height="16" fill="#f4f8f8" /><ellipse cx={x} cy="44" rx="110" ry="18" fill="#fff" opacity="0.2" filter="url(#b90-blur)" /></g>)}
        {/* la FONTAINE À EAU */}
        <g transform="translate(56,440)">
          <ellipse cx="0" cy="0" rx="26" ry="5" fill="#0a0e14" opacity="0.4" />
          <rect x="-20" y="-96" width="40" height="96" rx="4" fill="#e8e4dc" stroke="#9a968c" strokeWidth="1.4" />
          <rect x="-12" y="-70" width="24" height="16" fill="#3a3c42" />
          <rect x="-6" y="-64" width="4" height="6" fill="#3a80c8" /><rect x="2" y="-64" width="4" height="6" fill="#c83a2a" />
          <path d="M-18 -96 Q-18 -150 0 -150 Q18 -150 18 -96 Z" fill="#8ac8e8" opacity="0.7" stroke="#5a98b8" strokeWidth="1" />
          <path d="M-10 -140 q-4 20 0 40" stroke="#fff" strokeWidth="3" opacity="0.4" fill="none" />
          <rect x="-24" y="-40" width="10" height="14" fill="#f0ece4" stroke="#b8b4ac" strokeWidth="0.6" />
        </g>
        {/* les CLOISONS de l'open space, et un collègue au téléphone */}
        <g transform="translate(920,440)">
          <rect x="-90" y="-150" width="200" height="150" fill="#6a7a8a" />
          <rect x="-90" y="-154" width="200" height="6" rx="2" fill="#4a5664" />
          <Speckle seed={991} x0={-88} x1={108} y0={-146} y1={-4} n={70} colors={["#5a6a7a", "#7a8a9a"]} r={[0.6, 1.4]} opacity={0.6} perspective={false} />
          <path d="M10 -150 v150" stroke="#4a5664" strokeWidth="3" />
          <rect x="-70" y="-176" width="50" height="26" rx="3" fill="#d8c8a0" />
          <rect x="-64" y="-172" width="38" height="18" fill="#1a3048" />
          <path d="M30 -150 q20 -14 40 0 Z" fill="#3a5a8a" />
          <rect x="45" y="-160" width="10" height="10" fill="#d8a884" />
          <circle cx="50" cy="-170" r="12" fill="#d8a884" />
          <path d="M38 -170 q0 -14 12 -14 q12 0 12 12 q-4 -6 -12 -6 q-6 0 -12 8 Z" fill="#5a3a24" />
          <circle cx="61" cy="-169" r="2.4" fill="#c8946a" />
          <path d="M60 -180 q10 2 8 18" stroke="#d8ccb0" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        {/* calendrier 1990 */}
        <g transform="translate(222,140)">
          <rect x="-26" y="-34" width="52" height="68" fill="#f4f0e8" stroke="#8a8478" strokeWidth="1" />
          <rect x="-26" y="-34" width="52" height="18" fill="#c83a2a" />
          <text x="0" y="-21" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="700" fill="#fff">1990</text>
          {Array.from({ length: 20 }).map((_, k) => <rect key={k} x={-22 + (k % 5) * 9} y={-10 + Math.floor(k / 5) * 9} width="6" height="6" fill={k === 13 ? "#c83a2a" : "#a8a49c"} opacity="0.7" />)}
        </g>
      </PLayer>

      {/* ═══ BUREAU + PC ═══ */}
      <PLayer depth={2.5}>
        <rect y="440" width="1000" height="120" fill="url(#b90-floor)" />
        {/* moquette gris-bleu : mottling + grain */}
        <rect y="440" width="1000" height="120" fill="#0a1420" opacity="0.35" filter="url(#b90-mottle)" />
        <rect y="440" width="1000" height="120" fill="#1a2028" opacity="0.35" filter="url(#b90-grain)" />
        {/* dalles de moquette, posées en damier de sens contrariés */}
        {Array.from({ length: 4 }).map((_, r) => {
          const y0 = 440 + r * r * 4 + r * 18, y1 = 440 + (r + 1) * (r + 1) * 4 + (r + 1) * 18;
          return Array.from({ length: 18 }).map((_, c) => {
            const xa = -400 + c * 100, k0 = 0.6 + (y0 - 440) / 280, k1 = 0.6 + (y1 - 440) / 280;
            const X = (x, k) => (500 + (x - 500) * k).toFixed(1);
            return (r + c) % 2 ? <path key={`${r}-${c}`} d={`M${X(xa, k0)} ${y0} L${X(xa + 100, k0)} ${y0} L${X(xa + 100, k1)} ${y1} L${X(xa, k1)} ${y1} Z`} fill="#3a4252" opacity="0.4" /> : null;
          });
        })}
        {/* plinthe */}
        <rect y="438" width="1000" height="4" fill="#5a4838" />
        {/* halo bleuté sous l'écran (lueur cathodique sur la moquette) */}
        <ellipse cx="560" cy="450" rx="200" ry="16" fill="#7fd8ff" opacity="0.14" filter="url(#b90-blur)" />

        {/* BUREAU */}
        <g>
          <rect x="200" y="380" width="700" height="20" fill="url(#b90-desk)" stroke="#3a2818" strokeWidth="2" />
          <rect x="215" y="400" width="20" height="80" fill="#5a4028" />
          <rect x="865" y="400" width="20" height="80" fill="#5a4028" />
          {/* caissons tiroirs */}
          <rect x="220" y="400" width="120" height="80" fill="url(#b90-desk)" stroke="#3a2818" strokeWidth="1.4" />
          <rect x="230" y="410" width="100" height="24" fill="#8a6840" stroke="#5a3818" strokeWidth="1" />
          <rect x="230" y="440" width="100" height="24" fill="#8a6840" stroke="#5a3818" strokeWidth="1" />
          <circle cx="280" cy="422" r="2.5" fill="#3a2818" />
          <circle cx="280" cy="452" r="2.5" fill="#3a2818" />
        </g>

        {/* ÉCRAN cathodique 14" beige */}
        <g transform="translate(560,320)">
          <rect x="-90" y="-40" width="180" height="130" fill="url(#b90-pc)" stroke="#3a2818" strokeWidth="2" rx="6" />
          <rect x="-78" y="-30" width="156" height="100" rx="6" fill="#0a2038" />
          {/* image écran : Windows 3.0 */}
          <rect x="-78" y="-30" width="156" height="12" fill="#0a3878" />
          <text x="-72" y="-22" fontSize="8" fontFamily="ui-monospace,monospace" fill="#fff">Program Manager</text>
          <rect x="72" y="-28" width="4" height="4" fill="#c8c8c8" />
          {grave ? (
            <g>
              <text x="0" y="18" textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill="#5eff9e">GRAVURE OK</text>
              <rect x="-40" y="24" width="80" height="6" fill="#0a1020" stroke="#5eff9e" strokeWidth="0.6" />
              <rect x="-40" y="24" width="80" height="6" fill="#5eff9e" opacity="0.9" />
              <text x="0" y="46" textAnchor="middle" fontSize="7" fontFamily="ui-monospace,monospace" fill="#c8d4e2">C:\\CD_MASTER\\OK</text>
            </g>
          ) : (
            <g>
              {/* Icônes Program Manager */}
              {[[-50, 0], [-10, 0], [30, 0], [-50, 30], [-10, 30], [30, 30]].map(([x, y], i) => (
                <g key={i}>
                  <rect x={x - 8} y={y - 8} width="16" height="12" fill="#c8c8c8" stroke="#3a3a3a" strokeWidth="0.6" />
                  <text x={x} y={y + 14} textAnchor="middle" fontSize="4" fill="#c8c8c8" fontFamily="ui-monospace,monospace">FILE</text>
                </g>
              ))}
            </g>
          )}
          {/* base cathodique */}
          <path d="M-40 90 L-30 100 L30 100 L40 90 Z" fill="url(#b90-pc)" stroke="#3a2818" strokeWidth="1.4" />
        </g>

        {/* UNITÉ CENTRALE (PC beige) sous l'écran */}
        <g transform="translate(750,340)">
          <rect x="-80" y="-20" width="160" height="60" fill="url(#b90-pc)" stroke="#3a2818" strokeWidth="2" />
          {/* fentes lecteur disquette + CD */}
          <rect x="-60" y="-10" width="60" height="6" fill="#0a0806" stroke="#5a5a5a" strokeWidth="0.6" />
          <rect x="-60" y="4" width="60" height="12" rx="1" fill="#0a0806" stroke="#5a5a5a" strokeWidth="0.6" />
          <rect x="-56" y="8" width="52" height="4" fill="#3a3a3a" />
          {/* CD gravé qui pointe */}
          {grave && (
            <ellipse cx="-30" cy="10" rx="12" ry="3" fill="url(#b90-pc)" stroke="#8a5a20" strokeWidth="0.6" />
          )}
          {/* bouton power */}
          <circle cx="60" cy="0" r="4" fill="#3a3a3a" />
          <circle cx="60" cy="0" r="1.6" fill="#5eff9e" />
          {/* label */}
          <text x="-40" y="34" fontSize="6" fontFamily="ui-monospace,monospace" fill="#5a4028" fontWeight="700">PENTIUM 90</text>
        </g>

        {/* post-it collés au bord de l'écran */}
        <g transform="translate(560,320)">
          <rect x="86" y="-36" width="16" height="16" fill="#f8e870" transform="rotate(8 94 -28)" />
          <rect x="86" y="-14" width="16" height="16" fill="#f8a8c8" transform="rotate(-6 94 -6)" />
        </g>
        {/* téléphone à touches beige et mug de café */}
        <g transform="translate(234,378) scale(0.85)">
          <path d="M-26 0 L26 0 L22 -18 L-22 -18 Z" fill="#d8ccb0" stroke="#8a7e64" strokeWidth="1" />
          <path d="M-28 -18 Q0 -30 28 -18 L24 -24 Q0 -34 -24 -24 Z" fill="#c8bca0" stroke="#8a7e64" strokeWidth="1" />
          {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={-9 + (k % 3) * 7} y={-15 + Math.floor(k / 3) * 4.5} width="5" height="3" rx="0.8" fill="#f0ead8" stroke="#8a7e64" strokeWidth="0.4" />)}
          <path d="M26 -6 q16 4 12 20 q-4 10 6 16" stroke="#8a7e64" strokeWidth="1.4" fill="none" />
        </g>
        <g transform="translate(860,378)">
          <path d="M-9 0 h18 l-1 -18 h-16 Z" fill="#2a5aa0" />
          <path d="M9 -14 q7 0 6 6 q-1 5 -7 4" stroke="#2a5aa0" strokeWidth="2.4" fill="none" />
          <path d="M-3 -22 q-3 -6 2 -10 M3 -22 q-3 -6 2 -10" stroke="#e8e4dc" strokeWidth="1.2" fill="none" opacity="0.5" style={{ animation: "drift 3s ease-in-out infinite" }} />
        </g>
        {/* CLAVIER + SOURIS À BOULE devant l'écran */}
        <g transform="translate(560,398)">
          <rect x="-60" y="-8" width="120" height="16" rx="2" fill="#e0d0b0" stroke="#5a4028" strokeWidth="1" />
          {[...Array(12)].map((_, c) => [...Array(3)].map((_, r) => (
            <rect key={`k-${c}-${r}`} x={-56 + c * 10} y={-6 + r * 5} width="8" height="3" rx="0.3" fill="#c8b090" />
          )))}
        </g>
        <g transform="translate(700,400)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#e0d0b0" stroke="#5a4028" strokeWidth="1" />
          <path d="M0 -8 L0 4" stroke="#5a4028" strokeWidth="0.6" />
          <path d="M-16 0 q-6 -4 -14 0" stroke="#3a3a3a" strokeWidth="1.4" fill="none" />
        </g>

        {/* GAME BOY posee sur le bureau, plus petite et bien en face de
            Celine — ecran vert allume avec un sprite qui saute. */}
        <g transform="translate(505,395) rotate(-10) scale(0.65)">
          {/* coque grise */}
          <rect x="-18" y="-32" width="36" height="64" rx="4" fill="#c8c8c8" stroke="#3a3a3a" strokeWidth="1" />
          {/* petit bandeau plus fonce en haut */}
          <rect x="-18" y="-32" width="36" height="6" rx="2" fill="#8a8a8a" />
          {/* ecran cerne noir */}
          <rect x="-14" y="-22" width="28" height="20" rx="1" fill="#2a2a2a" />
          {/* ecran LCD vert */}
          <rect x="-12" y="-20" width="24" height="16" fill="#9ec830" />
          {/* petit sprite qui saute (pixels) */}
          <g fill="#0a2a08">
            <rect x="-4" y="-12" width="8" height="6">
              <animate attributeName="y" values="-10;-16;-10" dur="0.9s" repeatCount="indefinite" />
            </rect>
            <rect x="-2" y="-14" width="4" height="2">
              <animate attributeName="y" values="-12;-18;-12" dur="0.9s" repeatCount="indefinite" />
            </rect>
          </g>
          <text x="0" y="-24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="2.6" fill="#3a3a3a">DOT MATRIX WITH STEREO SOUND</text>
          {/* croix directionnelle */}
          <g transform="translate(-9,7)">
            <path d="M-5 -2 h4 v-2 h2 v2 h4 v4 h-4 v2 h-2 v-2 h-4 z" fill="#3a3a3a" />
          </g>
          {/* boutons A B en rouge */}
          <circle cx="7"  cy="8"  r="2.5" fill="#c02830" />
          <circle cx="12" cy="4"  r="2.5" fill="#c02830" />
          {/* start / select */}
          <path d="M-4 20 h4 M4 20 h4" stroke="#5a5a5a" strokeWidth="1.4" />
          {/* haut-parleur */}
          <path d="M6 24 l8 6 M4 26 l8 6 M2 28 l8 6" stroke="#8a8a8a" strokeWidth="0.6" />
          {/* logo NINTENDO */}
          <text x="0" y="-1" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="2.4" fontWeight="800" fill="#3a2a80">NINTENDO GAME BOY</text>
        </g>

        {/* PILE DE CD-Rom vierges — bien visible sur le bureau, entre l'imprimante
            et l'écran. Boîtier ouvert avec un CD qui reflète les arcs-en-ciel. */}
        {!grave && (
          <g transform="translate(430,364)">
            {/* boîtier plastique noir ouvert (le CD en bas) */}
            <rect x="-38" y="4" width="76" height="10" fill="#1a1a1a" stroke="#0a0806" strokeWidth="0.8" />
            {/* le CD debout dans son boîtier + pile de 4 CD à côté */}
            {[0, -4, -8, -12].map((y, i) => (
              <g key={i}>
                <ellipse cx="0" cy={y} rx="36" ry="10" fill="#f0e8d0" stroke="#8a6840" strokeWidth="1" />
                <ellipse cx="0" cy={y} rx="8" ry="3" fill="#5a4028" />
              </g>
            ))}
            {/* reflets arc-en-ciel sur le CD du dessus */}
            <ellipse cx="0" cy="-12" rx="32" ry="9" fill="none" stroke="#c8a8e0" strokeWidth="0.8" opacity="0.7" />
            <ellipse cx="0" cy="-12" rx="26" ry="7.5" fill="none" stroke="#8ac8e0" strokeWidth="0.8" opacity="0.7" />
            <ellipse cx="0" cy="-12" rx="20" ry="6" fill="none" stroke="#e0a848" strokeWidth="0.8" opacity="0.7" />
            {/* étiquette « CD-R » */}
            <text x="16" y="-11" textAnchor="middle" fontSize="6" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#c8963e">CD-R</text>
          </g>
        )}

        {/* IMPRIMANTE MATRICIELLE à gauche */}
        <g transform="translate(310,340)">
          <rect x="-40" y="0" width="80" height="30" fill="url(#b90-pc)" stroke="#3a2818" strokeWidth="1.4" />
          <rect x="-38" y="6" width="76" height="16" fill="#8a7860" />
          {/* papier qui sort par le haut */}
          <path d="M-30 0 L-30 -20 L30 -20 L30 0 Z" fill="#f8f0d8" stroke="#5a4028" strokeWidth="0.6" />
          <path d="M-24 -14 h48 M-24 -10 h44" stroke="#3a2818" strokeWidth="0.6" />
          {/* trous d'entrainement */}
          {[-26, -20, -14, -8, -2, 4, 10, 16, 22].map((x, i) => (
            <circle key={i} cx={x} cy="-18" r="0.6" fill="#8a5828" />
          ))}
        </g>
      </PLayer>

      {/* ═══ AVANT-PLAN : CÉLINE assise devant le bureau ═══ */}
      <PLayer depth={3}>
        {/* Halo cathodique bleuté sur le visage de Céline — l'écran l'éclaire */}
        <ellipse cx="560" cy="410" rx="80" ry="60" fill="url(#b90-screenGlow)" style={{ pointerEvents: "none" }} />
        <g transform="translate(560,470)">
          {/* fauteuil de bureau à roulettes */}
          <path d="M-40 -10 L40 -10 L34 40 L-34 40 Z" fill="#1a1a1a" />
          {/* t-shirt jaune au smiley (fan de Nirvana), carré blond vénitien */}
          <Figure x={0} y={35} s={1.08} pose="sit" skin="#ecc8a8" hair="#c89060" look="bob" earrings="#f4f0e4" lips="#7a1a2a" mood="content"
            garment="tee" coat="#f8d838" shortSleeves pants="#3a4a6a" shoes="#e8e8e0" belt={false} arms={[{ a1: 30, a2: -40 }, { a1: 30, a2: -40 }]}>
            <g transform="translate(0,-52) scale(0.85)">
              <circle r="10" fill="#f8d838" stroke="#1a1408" strokeWidth="1.4" />
              <path d="M-4 -3 l3 3 l-3 3 M-1 -3 l-3 3 l3 3" stroke="#1a1408" strokeWidth="0.8" fill="none" />
              <path d="M4 -3 l-3 3 l3 3 M1 -3 l3 3 l-3 3" stroke="#1a1408" strokeWidth="0.8" fill="none" />
              <path d="M-5 3 Q-2 6 2 5 Q4 4 5 3 L4 6 L2 5 L1 7" stroke="#1a1408" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
          </Figure>
        </g>

        {/* « ? » de quête au-dessus de Céline */}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={560} cy={430} r={54} label="Céline" reveal={reveal} onClick={() => action("celine")} />
      {!cdCharge && !grave && (
        <Hotspot cx={430} cy={358} r={40} label="pile de CD-Rom vierges (CD-R)" item="cd_vierge" reveal={reveal} onClick={() => collect("cd_vierge")} />
      )}
      {/* PC = support (fente CD-Rom) — devient bouton d'ouverture du mini-jeu une fois le CD dedans */}
      {!cdCharge && (
        <Hotspot cx={750} cy={340} r={80} label="PC beige — glisse-y le CD-Rom vierge" item="pc_beige" reveal={reveal} onClick={() => action("celine")} />
      )}
      {cdCharge && !grave && (
        <Hotspot cx={750} cy={340} r={80} label="PC beige — lance l'assistant de gravure" reveal={reveal} onClick={() => action("graver_cd")} />
      )}
      {grave && (
        <Hotspot cx={750} cy={340} r={80} label="PC beige (gravure terminée)" reveal={reveal} onClick={() => action("celine")} />
      )}
    </svg>
  );
}
