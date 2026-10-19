import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 7 — Tableau 2 : le STUDIO du DAGUERRÉOTYPIST (Californie, ~1855)
   ------------------------------------------------------------
   James, enrichi par le filon, se fait tirer le portrait pour l'envoyer
   à sa mère restée en Irlande. Il est assis, raide, la tête bloquée par
   un appui-tête en métal (le « fer à poser ») pour tenir la pose de 15 s.
   Le PHOTOGRAPHE se tient derrière sa chambre noire en bois.
   Cliquer sur la chambre photographique ouvre le mini-jeu.
   ============================================================ */

export default function ScenePhoto({ collect, action, reveal, made = [], flags = {}, queteQui }) {
  const done = made.includes("msg_daguerreotype");
  const plaqueDedans = !!flags.plaque_dedans;   // la plaque est chargée dans la chambre
  const plaqueSensible = !!flags.plaque_sensible; // + sensibilisée à l'iodure
  const plaquePrise = made.includes("plaque");
  const iodurePris = made.includes("iodure");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dg-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a6a48" /><stop offset="100%" stopColor="#5a4028" /></linearGradient>
        <linearGradient id="dg-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a3f28" /><stop offset="100%" stopColor="#2c1e14" /></linearGradient>
        <linearGradient id="dg-drape" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a2a18" /><stop offset="100%" stopColor="#2a180c" /></linearGradient>
        <linearGradient id="dg-cam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a4826" /><stop offset="100%" stopColor="#3a2612" /></linearGradient>
        <radialGradient id="dg-light" cx="50%" cy="0%" r="70%"><stop offset="0%" stopColor="#ffe8b0" stopOpacity="0.7" /><stop offset="100%" stopColor="#ffe8b0" stopOpacity="0" /></radialGradient>
        <filter id="dg-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        <linearGradient id="dg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9ac0dc" /><stop offset="100%" stopColor="#dbe8ee" /></linearGradient>
        <linearGradient id="dg-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a9288" /><stop offset="60%" stopColor="#b8b8a4" /><stop offset="100%" stopColor="#6a6a5a" /></linearGradient>
        <filter id="dg-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ mur du studio + verrière (les photographes du XIXᵉ travaillaient à la lumière naturelle) ═══ */}
      <rect width="1000" height="440" fill="url(#dg-wall)" />
      <rect width="1000" height="440" fill="#3a2418" opacity="0.18" filter="url(#dg-grain)" />
      {/* la VERRIÈRE d'atelier : une pente de petits carreaux sur le ciel,
          des stores de toile bleue pour régler la lumière */}
      <g transform="translate(140,20)">
        <rect x="0" y="0" width="360" height="140" fill="url(#dg-sky)" />
        <ellipse cx="90" cy="40" rx="60" ry="12" fill="#fff" opacity="0.6" filter="url(#dg-blur)" />
        <ellipse cx="260" cy="90" rx="70" ry="14" fill="#fff" opacity="0.5" filter="url(#dg-blur)" />
        {/* stores de toile, à moitié tirés */}
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={k * 120 + 4} y="2" width="112" height={[52, 30, 44][k]} fill="#5a7a9a" opacity="0.55" />
            <rect x={k * 120 + 4} y={[52, 30, 44][k]} width="112" height="5" rx="2" fill="#3a5068" />
            <path d={`M${k * 120 + 60} ${[57, 35, 49][k]} v8`} stroke="#3a2814" strokeWidth="1.4" />
          </g>
        ))}
        {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M${i * 36} 0 v140`} stroke="#3a2814" strokeWidth={i % 3 === 0 ? 3 : 1.4} />)}
        {[35, 70, 105].map((y) => <path key={y} d={`M0 ${y} h360`} stroke="#3a2814" strokeWidth="1.4" />)}
        <rect x="0" y="0" width="360" height="140" fill="none" stroke="#3a2814" strokeWidth="5" />
        <path d="M-6 146 h372" stroke="#5a3f24" strokeWidth="6" />
      </g>
      {/* le jour de la verrière, dirigé vers le modèle */}
      <path d="M300 30 L500 30 L880 400 L560 400 Z" fill="url(#dg-light)" opacity="0.5" />
      {/* la vitrine des portraits d'exposition (« Portraits — 2 $ ») */}
      <g transform="translate(60,230)">
        <rect x="-40" y="-36" width="80" height="96" fill="#3a2410" />
        <rect x="-36" y="-32" width="72" height="88" fill="#2a1a10" />
        {[[-18, -12], [18, -12], [-18, 32], [18, 32]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-13" y="-17" width="26" height="34" fill="#c8a040" />
            <rect x="-10" y="-14" width="20" height="28" fill="#b8c0c4" />
            <circle cx="0" cy="-5" r="4" fill="#6a6460" /><path d="M-7 12 q7 -12 14 0 Z" fill="#6a6460" />
          </g>
        ))}
        <rect x="-36" y="-32" width="72" height="88" fill="#fff" opacity="0.06" />
        <rect x="-30" y="66" width="60" height="14" fill="#efe6d2" />
        <text x="0" y="76" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6.4" fill="#3a2410" style={{ fontWeight: 700 }}>PORTRAITS · 2 $</text>
      </g>
      {/* étagère des produits : mercure, brome, hyposulfite */}
      <g transform="translate(160,262)">
        <rect x="-44" y="0" width="88" height="6" fill="#4a2c14" />
        <path d="M-36 6 l8 12 M36 6 l-8 12" stroke="#4a2c14" strokeWidth="3" />
        {[[-30, "#7a8088"], [-12, "#8a3a1e"], [6, "#d8d0b8"], [24, "#4a5a3a"]].map(([x, c], i) => (
          <g key={i}><rect x={x - 6} y="-22" width="12" height="22" rx="2" fill={c} opacity="0.85" /><rect x={x - 3} y="-27" width="6" height="5" fill="#3a2410" /><rect x={x - 5} y="-14" width="10" height="6" fill="#efe6d2" opacity="0.8" /></g>
        ))}
      </g>

      {/* la TOILE DE FOND PEINTE, sur son rouleau : un parc brumeux, une
          colonne et une draperie — le décor « distingué » des portraits */}
      <rect x="532" y="52" width="396" height="10" rx="5" fill="#5a3f24" />
      <path d="M540 60 L920 60 L920 400 L540 400 Z" fill="url(#dg-back)" />
      <g opacity="0.55">
        <path d="M540 300 Q640 270 740 290 Q840 310 920 280 L920 400 L540 400 Z" fill="#6a7262" />
        {[[580, 290, 30], [660, 270, 40], [860, 280, 34]].map(([x, y, r], i) => (
          <g key={i}><rect x={x - 3} y={y} width="6" height="30" fill="#4a4a3a" /><circle cx={x} cy={y - r * 0.5} r={r} fill="#5a6252" /><circle cx={x - r * 0.4} cy={y - r * 0.2} r={r * 0.7} fill="#6a7262" /></g>
        ))}
        <rect x="610" y="140" width="34" height="200" fill="#c8c4b0" />
        <rect x="602" y="130" width="50" height="14" fill="#d8d4c0" /><rect x="602" y="336" width="50" height="14" fill="#a8a490" />
        <path d="M618 144 v192 M628 144 v192 M638 144 v192" stroke="#8a8670" strokeWidth="1.4" />
      </g>
      <path d="M540 60 L640 60 Q600 160 620 240 Q560 260 540 330 Z" fill="url(#dg-drape)" opacity="0.9" />
      <g stroke="#1a0c04" strokeWidth="1.4" opacity="0.4">
        {[556, 576, 598].map((x, i) => <path key={i} d={`M${x} 60 q-6 100 4 ${200 - i * 30}`} fill="none" />)}
      </g>
      {/* le RÉFLECTEUR : un grand écran blanc pour déboucher les ombres */}
      <g transform="translate(950,250)">
        <path d="M0 150 v-40 M-20 150 l20 -40 l20 40" stroke="#3a2410" strokeWidth="3" fill="none" />
        <rect x="-36" y="-110" width="72" height="200" fill="#efe9dc" />
        <rect x="-36" y="-110" width="72" height="200" fill="none" stroke="#7a5a3a" strokeWidth="3" />
        <rect x="-36" y="-110" width="20" height="200" fill="#c8c0b0" opacity="0.5" />
      </g>

      {/* ═══ le sol ═══ */}
      <PLayer depth={2}>
        <path d="M0 560 L0 400 L1000 400 L1000 560 Z" fill="url(#dg-floor)" />
        <path d="M0 400 h1000" stroke="#1a0c04" strokeWidth="3" />
        {Array.from({ length: 22 }).map((_, i) => {
          const x = -160 + i * 64;
          return <path key={i} d={`M${(500 + (x - 500) * 0.6).toFixed(0)} 400 L${x} 560`} stroke="#1a0c04" strokeWidth="1.2" opacity="0.45" />;
        })}
        {[430, 470, 520].map((y, i) => <path key={y} d={`M${i * 80} ${y} h${220 + i * 30} M${560 - i * 40} ${y} h${200 + i * 20}`} stroke="#1a0c04" strokeWidth="1" opacity="0.35" />)}
        {/* le jour qui tombe sur le plancher, devant le modèle */}
        <path d="M540 404 L860 404 L940 470 L600 470 Z" fill="#ffe8b0" opacity="0.12" filter="url(#dg-blur)" />
        {/* petit tapis sous la chaise de pose */}
        <path d="M630 430 L820 430 L860 488 L590 488 Z" fill="#5a2a1a" />
        <path d="M640 436 L810 436 L846 482 L604 482 Z" fill="none" stroke="#c8a040" strokeWidth="2" opacity="0.6" />
      </PLayer>

      {/* ═══ premier plan : James assis + appui-tête + photographe ═══ */}
      <PLayer depth={3}>
        {/* La CHAISE de pose (haut dossier) */}
        <g transform="translate(720,398)">
          <path d="M-42 0 L42 0 L38 -18 L-38 -18 Z" fill="#3a2410" />
          <rect x="-4" y="0" width="8" height="90" fill="#3a2410" />
          <rect x="-40" y="-160" width="8" height="160" fill="#5a3a1c" />
          <rect x="32" y="-160" width="8" height="160" fill="#5a3a1c" />
          <path d="M-40 -160 L40 -160 L40 -148 L-40 -148 Z" fill="#7a5230" />
          {[-140, -120, -100, -80].map((y, i) => <path key={i} d={`M-32 ${y} h64`} stroke="#5a3a1c" strokeWidth="3" />)}
        </g>

        {/* LE FER À POSER (appui-tête métallique du daguerréotypiste) */}
        <g transform="translate(720,240)">
          <path d="M0 0 v-24" stroke="#a89878" strokeWidth="3" />
          <path d="M-16 -24 h32" stroke="#a89878" strokeWidth="3" />
          <path d="M-16 -24 v-8 M16 -24 v-8" stroke="#a89878" strokeWidth="3" />
          <circle cx="0" cy="80" r="16" fill="#6a4a2c" />
          <path d="M-4 12 L4 12 L4 80 L-4 80 Z" fill="#a89878" />
        </g>

        {/* JAMES O'SULLIVAN — assis raide, endimanché, la tête calée dans le fer */}
        <g transform="translate(720,398)">
          {/* assis raide, endimanché, la tête calée dans le fer */}
          <Figure x={0} y={60} s={2.18} pose="sit" skin="#e4b48a" hair="#a0522d" look="short" mustache="handlebar" freckles mood="vexe"
            garment="jacket" coat="#1c1610" coat2="#7a5220" pants="#1c1610" shoes="#0a0806"
            arms={[{ a1: 10, a2: -20 }, { a1: 10, a2: -20 }]}>
            <path d="M-4 -60 Q0 -55 4 -60" stroke="#e6c25a" strokeWidth="1" fill="none" />
            <circle cx="4" cy="-60" r="1.4" fill="#e6c25a" />
            <path d="M-1 -72 L1 -72 L1 -62 L-1 -62 Z" fill="#0a0a10" />
          </Figure>
        </g>

        {/* LA CHAMBRE PHOTOGRAPHIQUE (grand appareil en bois, sur trépied) */}
        <g transform="translate(280,344)">
          <path d="M0 0 L-24 56 M0 0 L24 56 M0 0 L0 60" stroke="#3a2410" strokeWidth="5" />
          <rect x="-50" y="-70" width="100" height="70" rx="4" fill="url(#dg-cam)" />
          <rect x="-50" y="-70" width="100" height="70" rx="4" fill="none" stroke="#2a1808" strokeWidth="3" />
          {/* la PLAQUE DE CUIVRE, une fois chargée : visible inclinée à 45°
              à l'arrière de la chambre (côté gauche). Vire au JAUNE-OR une
              fois sensibilisée à l'iodure d'argent. */}
          {plaqueDedans && (
            <g transform="translate(-30,-45) rotate(-45)" style={{ animation: "pop 0.4s ease-out" }}>
              <rect x="-16" y="-22" width="32" height="44" fill={plaqueSensible ? "#e8c860" : "#d8d0c8"} stroke="#5a4028" strokeWidth="1.5" />
              <rect x="-14" y="-20" width="28" height="40" fill={plaqueSensible ? "#c8a840" : "#efe6d2"} opacity="0.7" />
              {plaqueSensible && (
                /* petit halo jaunâtre indiquant la sensibilisation */
                <ellipse cx="0" cy="0" rx="26" ry="30" fill="#ffe8a0" opacity="0.28" style={{ animation: "glow 2.4s ease-in-out infinite" }} />
              )}
            </g>
          )}
          {/* soufflet en accordéon */}
          <g fill="#1c1006">
            {[0, 8, 16, 24, 32].map((x, i) => (
              <path key={i} d={`M50 -58 l${x} -4 l0 46 l-${x} -4 Z`} opacity={0.8 - i * 0.1} />
            ))}
            <rect x="50" y="-58" width="40" height="46" fill="#2a1808" />
          </g>
          {/* objectif */}
          <g transform="translate(94,-35)">
            <rect x="0" y="-14" width="18" height="28" fill="#3a2410" />
            <circle cx="10" cy="0" r="12" fill="#0a0806" stroke="#6a4826" strokeWidth="3" />
            <circle cx="10" cy="0" r="6" fill="#161010" />
            <circle cx="12" cy="-3" r="2" fill="#7a6a4a" opacity="0.6" />
            {/* Le CACHE (bouchon d'objectif) reste TOUJOURS en place — le
                joueur doit CLIQUER dessus pour le retirer et laisser entrer
                la lumière. Quand la plaque est sensibilisée, un halo doré
                entoure le cache pour signaler qu'il est prêt à être retiré. */}
            {plaqueSensible && (
              <ellipse cx="10" cy="0" rx="22" ry="22" fill="#ffe8b0" opacity="0.28" style={{ animation: "glow 1.4s ease-in-out infinite" }} />
            )}
            <g>
              <ellipse cx="10" cy="0" rx="14" ry="15" fill="#3a2410" stroke={plaqueSensible ? "#ffd166" : "#5a4028"} strokeWidth={plaqueSensible ? 2 : 1.5} style={plaqueSensible ? { animation: "pulse 1.4s ease-in-out infinite" } : {}} />
              <circle cx="10" cy="0" r="3" fill={plaqueSensible ? "#ffd166" : "#7a5030"} />
              {plaqueSensible && (
                <text x="10" y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#ffd166" style={{ animation: "pulse 1.4s ease-in-out infinite" }}>retirer</text>
              )}
            </g>
          </g>
          {/* le voile noir du photographe */}
          <path d="M-50 -70 Q-70 -50 -78 0 L-38 0 L-30 -70 Z" fill="#0a0806" opacity="0.85" />
        </g>

        {/* La petite TABLE À GAUCHE : le flacon d'IODURE D'ARGENT
            (jaune-ambre, ampoule fermée par un bouchon de liège). Cliquable
            tant qu'on ne l'a pas ramassé. */}
        <g transform="translate(80,406)">
          <rect x="-30" y="0" width="60" height="6" fill="#4a2c14" />
          <rect x="-26" y="6" width="4" height="30" fill="#4a2c14" />
          <rect x="22" y="6" width="4" height="30" fill="#4a2c14" />
          {!iodurePris && (
            <g transform="translate(-4,-24)" style={{ animation: "pop 0.45s ease-out" }}>
              {/* le flacon */}
              <path d="M-10 0 L10 0 L10 20 Q10 26 4 28 L-4 28 Q-10 26 -10 20 Z" fill="#e8c060" opacity="0.9" />
              <path d="M-6 -2 L6 -2 L6 2 L-6 2 Z" fill="#5a3818" />
              <ellipse cx="0" cy="-2" rx="4" ry="1.5" fill="#3a2010" />
              {/* liquide jaune ambré */}
              <path d="M-8 8 L8 8 L8 20 Q8 24 4 26 L-4 26 Q-8 24 -8 20 Z" fill="#d8a020" />
              {/* étiquette */}
              <rect x="-8" y="12" width="16" height="8" fill="#efe6d2" />
              <text x="0" y="18" textAnchor="middle" fontSize="4.5" fill="#3a2010" fontFamily="ui-monospace,monospace">AgI</text>
            </g>
          )}
        </g>

        {/* La petite TABLE À DROITE (près de James) : la PLAQUE DE CUIVRE
            argenté, prête à être chargée. On la voit polie miroir. */}
        <g transform="translate(600,406)">
          <rect x="-30" y="0" width="60" height="6" fill="#4a2c14" />
          <rect x="-26" y="6" width="4" height="30" fill="#4a2c14" />
          <rect x="22" y="6" width="4" height="30" fill="#4a2c14" />
          {!plaquePrise && (
            <g transform="translate(0,-14)" style={{ animation: "pop 0.45s ease-out" }}>
              {/* la plaque debout, un léger reflet miroir */}
              <rect x="-18" y="-20" width="36" height="34" fill="#d8d0c8" stroke="#5a4028" strokeWidth="1.5" />
              <rect x="-16" y="-18" width="32" height="30" fill="#efe6d2" opacity="0.7" />
              <path d="M-14 -14 L10 12" stroke="#fff" strokeWidth="2" opacity="0.6" />
              <path d="M-8 -14 L-14 -6" stroke="#fff" strokeWidth="1.4" opacity="0.5" />
            </g>
          )}
        </g>

        {/* LE PHOTOGRAPHE — la tête sous le voile noir, un bras qui tient le déclencheur */}
        <g transform="translate(200,398)">
          <Figure x={0} y={60} s={1.37} facing="right" skin="#dcb282" hair="#5a3a20" look="slick" beard="chops" mustache
            garment="coat" coat="#3a2814" pants="#2a1c0e" shoes="#140c06" arms={[{ a1: 10, a2: 6 }, { a1: 75, a2: 70 }]}>
            {/* la tête sous le voile noir, qui retombe sur l'arrière de la chambre */}
            <path d="M-19 -86 Q-27 -114 -6 -127 L16 -127 Q34 -122 44 -108 L40 -96 Q28 -104 22 -86 Z" fill="#0a0806" />
          </Figure>
        </g>

        {/* Une pendule murale (la pose fait ~15 secondes) */}
        <g transform="translate(80,140)">
          <circle cx="0" cy="0" r="32" fill="#efe6d2" stroke="#3a2410" strokeWidth="4" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i} x1={Math.sin(rad) * 24} y1={-Math.cos(rad) * 24} x2={Math.sin(rad) * 30} y2={-Math.cos(rad) * 30} stroke="#3a2410" strokeWidth="2" />;
          })}
          <line x1="0" y1="0" x2="0" y2="-18" stroke="#3a2410" strokeWidth="3" />
          <line x1="0" y1="0" x2="12" y2="4" stroke="#3a2410" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#3a2410" />
        </g>

        {/* Une fois terminé : le DAGUERRÉOTYPE fini posé à côté */}
        {done && (
          <g transform="translate(880,420)" style={{ animation: "glow 2s ease-in-out infinite" }}>
            <rect x="-28" y="-36" width="56" height="72" fill="#3a2410" stroke="#7a5230" strokeWidth="3" />
            <rect x="-24" y="-32" width="48" height="64" fill="#c8d0d4" />
            <path d="M-12 -22 Q0 -30 12 -22 L10 8 Q0 14 -10 8 Z" fill="#8a807a" />
            <circle cx="0" cy="-16" r="4" fill="#5a5450" />
            <path d="M-10 -8 L10 -8 L8 6 L-8 6 Z" fill="#5a5450" />
          </g>
        )}

        {/* « ? » du photographe (tant qu'il guide) */}
      </PLayer>

      <rect width="1000" height="560" fill="#141810" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={200} cy={360} r={44} label="le photographe" reveal={reveal} onClick={() => action("photographe")} />
      <Hotspot cx={720} cy={330} r={70} label="James (assis pour la pose)" reveal={reveal} onClick={() => action("james")} />
      {/* ramassables : la plaque à droite, le flacon d'iodure à gauche */}
      {!plaquePrise && (
        <Hotspot cx={600} cy={392} r={30} label="plaque de cuivre argentée" item="plaque" reveal={reveal} onClick={() => collect("plaque")} />
      )}
      {!iodurePris && (
        <Hotspot cx={76} cy={392} r={30} label="flacon d'iodure d'argent" item="iodure" reveal={reveal} onClick={() => collect("iodure")} />
      )}
      {/* La chambre : cible de dépôt (plaque, puis iodure). Une fois prête,
          on ne clique PAS dessus pour tirer — c'est le CACHE de l'objectif
          qui déclenche la pose (voir hotspot ci-dessous). */}
      {!done && (
        <Hotspot cx={280} cy={300} r={70} label={plaqueDedans && !plaqueSensible ? "chambre chargée — verser l'iodure d'argent" : plaqueSensible ? "chambre prête — retire le CACHE de l'objectif ›" : "chambre photographique — y glisser la plaque"} item="chambre" reveal={reveal} onClick={() => action("chambre")} />
      )}
      {/* Le CACHE de l'objectif : plus petit, positionné sur la lentille
          (SVG local x=94 y=-35 relatif à la chambre à 280,344 → 374,309).
          Cliquable quand la plaque est sensibilisée : ouvre le mini-jeu. */}
      {!done && plaqueSensible && (
        <Hotspot cx={374} cy={309} r={18} label="retirer le cache de l'objectif" reveal={reveal} onClick={() => action("cache")} />
      )}
    </svg>
  );
}
