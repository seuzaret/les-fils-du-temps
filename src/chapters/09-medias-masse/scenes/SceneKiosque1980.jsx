import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Bust, Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 9 — Tableau : KIOSQUE À JOURNAUX (années 80)
   ------------------------------------------------------------
   Un trottoir parisien un matin brumeux. Kiosque en fer forgé
   vert bouteille, plein de titres empilés sur le présentoir.
   Le kioskier (Robert) attend le client. Deux passants : une
   lycéenne feuilletant un mag ado, un cadre pressé qui achète
   Le Monde. Le clic sur le kioskier ouvre le mini-jeu « Fais
   la Une » — introduit la notion de ligne éditoriale.
   ============================================================ */

export default function SceneKiosque1980({ collect, action, reveal, made = [], inv = [], mode }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="kq-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c6cfd8" />
          <stop offset="55%" stopColor="#d8dbde" />
          <stop offset="100%" stopColor="#e6e2d8" />
        </linearGradient>
        <linearGradient id="kq-street" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a7268" />
          <stop offset="100%" stopColor="#3c3830" />
        </linearGradient>
        <linearGradient id="kq-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a89a80" />
          <stop offset="100%" stopColor="#6a5a44" />
        </linearGradient>
        <linearGradient id="kq-kiosk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a5e40" />
          <stop offset="100%" stopColor="#1e3624" />
        </linearGradient>
        <linearGradient id="kq-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a6e50" />
          <stop offset="100%" stopColor="#243a2a" />
        </linearGradient>
        <linearGradient id="kq-facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e0c8" />
          <stop offset="100%" stopColor="#a89478" />
        </linearGradient>
        <filter id="kq-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        <linearGradient id="kq-zinc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a7c80" /><stop offset="100%" stopColor="#4a4c52" /></linearGradient>
      </defs>

      {/* CIEL matinal légèrement brumeux */}
      <rect width="1000" height="560" fill="url(#kq-sky)" />

      {/* IMMEUBLES en fond, silhouettes haussmanniennes */}
      <PLayer depth={1}>
        {/* trois immeubles haussmanniens mitoyens : toits de zinc à lucarnes,
            balcons filants, boutiques au rez-de-chaussée */}
        {[[-20, 330, "#e8dcc0", 0], [310, 380, "#e0d2b4", 1], [690, 330, "#ebe0c6", 2]].map(([x0, w, c, k]) => (
          <g key={k}>
            <rect x={x0} y="96" width={w} height="260" fill={c} />
            <rect x={x0} y="96" width={w} height="260" fill="#a89478" opacity="0.18" />
            <path d={`M${x0 - 4} 98 L${x0 + w + 4} 98 L${x0 + w - 14} 58 L${x0 + 14} 58 Z`} fill="url(#kq-zinc)" />
            {Array.from({ length: Math.floor(w / 70) }).map((_, i) => (
              <g key={i} transform={`translate(${x0 + 40 + i * 70},62)`}>
                <path d="M-10 32 L-10 10 Q0 0 10 10 L10 32 Z" fill="#8a8c90" stroke="#3a3c42" strokeWidth="1" />
                <rect x="-6" y="12" width="12" height="16" fill="#4a4e58" />
              </g>
            ))}
            {[x0 + 30, x0 + w - 50].map((cx) => <g key={cx}><rect x={cx} y="40" width="20" height="20" fill="#a8603a" /><rect x={cx - 2} y="38" width="24" height="4" fill="#6a3a20" />{[3, 9, 15].map((d) => <rect key={d} x={cx + d} y="34" width="3" height="5" fill="#8a4a2a" />)}</g>)}
            {[0, 1, 2, 3].map((row) => Array.from({ length: Math.floor(w / 66) }).map((_, col) => {
              const wx = x0 + 22 + col * 66, wy = 108 + row * 46;
              return (
                <g key={`${row}-${col}`}>
                  <rect x={wx} y={wy} width="34" height="34" fill="#4a4a50" opacity="0.75" />
                  <path d={`M${wx + 17} ${wy} v34 M${wx} ${wy + 14} h34`} stroke="#e8dcc0" strokeWidth="1.4" opacity="0.8" />
                  <rect x={wx + 2} y={wy + 2} width="8" height="10" fill="#c8d4dc" opacity="0.35" />
                  <path d={`M${wx - 3} ${wy + 34} h40`} stroke="#8a7458" strokeWidth="2" />
                </g>
              );
            }))}
            {/* balcons filants en fer forgé (2e et 4e étages) */}
            {[150, 242].map((y) => (
              <g key={y}>
                <rect x={x0 + 8} y={y - 3} width={w - 16} height="3" fill="#2a2a2e" />
                <path d={`M${x0 + 8} ${y - 12} H${x0 + w - 8}`} stroke="#2a2a2e" strokeWidth="1.6" />
                {Array.from({ length: Math.floor((w - 16) / 8) }).map((_, j) => <path key={j} d={`M${x0 + 12 + j * 8} ${y - 12} v9`} stroke="#2a2a2e" strokeWidth="0.9" />)}
              </g>
            ))}
            {[104, 196, 288].map((y) => <rect key={y} x={x0} y={y - 6} width={w} height="4" fill="#8a7458" opacity="0.6" />)}
          </g>
        ))}
        {/* boutiques du rez-de-chaussée : café à store rouge, boulangerie, pharmacie */}
        <g>
          <rect x="-20" y="292" width="1040" height="64" fill="#3a3028" opacity="0.85" />
          <g transform="translate(40,292)">
            <rect x="0" y="12" width="230" height="52" fill="#5a2a20" />
            <path d="M-6 0 L236 0 L246 22 L-16 22 Z" fill="#b8302a" />
            {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M${-12 + i * 23.5} 22 q11.75 8 23.5 0`} fill={i % 2 ? "#b8302a" : "#e8e0d0"} />)}
            <text x="115" y="15" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="#f0e8d0" letterSpacing="3">CAFÉ · BAR</text>
            {[24, 84, 144].map((x) => <rect key={x} x={x} y="30" width="48" height="30" fill="#e8c88a" opacity="0.4" />)}
          </g>
          <g transform="translate(760,292)">
            <rect x="0" y="6" width="200" height="58" fill="#2a3a5a" />
            <text x="100" y="22" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="#e8d8a8" letterSpacing="2">BOULANGERIE</text>
            <rect x="14" y="30" width="80" height="30" fill="#e8c88a" opacity="0.45" />
            <rect x="106" y="30" width="80" height="30" fill="#e8c88a" opacity="0.45" />
            {[24, 44, 64].map((x) => <ellipse key={x} cx={x} cy="52" rx="9" ry="3" fill="#c88a40" />)}
          </g>
          <g transform="translate(300,300)"><rect x="-10" y="-10" width="20" height="20" fill="#2a8a3a" /><path d="M-3 -7 h6 v4 h4 v6 h-4 v4 h-6 v-4 h-4 v-6 h4 Z" fill="#9aff8a" /></g>
        </g>
        {/* brume du matin dans le lointain */}
        <rect x="-20" y="80" width="1040" height="280" fill="#e6e2d8" opacity="0.18" />
      </PLayer>

      {/* TROTTOIR — pavé + bordure */}
      <PLayer depth={2.5}>
        <rect y="360" width="1000" height="200" fill="url(#kq-street)" />
        <rect y="360" width="1000" height="6" fill="#2a2620" />
        {/* grandes dalles de trottoir en perspective, bordure de granit */}
        {Array.from({ length: 16 }).map((_, i) => {
          const x = -300 + i * 110;
          return <line key={`p-${i}`} x1={(500 + (x - 500) * 0.6).toFixed(0)} y1="360" x2={x} y2="540" stroke="#2a2620" strokeWidth="1.4" opacity="0.45" />;
        })}
        {[374, 394, 422, 458, 502].map((y) => <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#2a2620" strokeWidth="1" opacity="0.35" />)}
        <rect y="540" width="1000" height="8" fill="#9a948a" />
        <rect y="548" width="1000" height="12" fill="#3a3630" />
        <path d="M0 544 h1000" stroke="#c8c2b8" strokeWidth="1" opacity="0.6" />
        <ellipse cx="520" cy="430" rx="230" ry="14" fill="#1a1810" opacity="0.3" />
        {/* petite feuille morte ici et là */}
        <path d="M240 468 q4 -6 10 -4 q6 4 2 10 q-6 4 -12 -6 Z" fill="#a06a3a" opacity="0.7" />
        <path d="M780 502 q4 -6 10 -4 q6 4 2 10 q-6 4 -12 -6 Z" fill="#8a5a2a" opacity="0.6" />
      </PLayer>

      {/* LE KIOSQUE — au centre, imposant */}
      <PLayer depth={2}>
        {/* base en fer forgé */}
        <rect x="330" y="240" width="380" height="180" fill="url(#kq-kiosk)" stroke="#141c14" strokeWidth="2" rx="2" />
        {/* motifs de fer forgé (fines volutes) */}
        {[350, 400, 450, 500, 550, 600, 650, 690].map((x) => (
          <line key={`bar-${x}`} x1={x} y1="260" x2={x} y2="410" stroke="#0e1a10" strokeWidth="1" opacity="0.5" />
        ))}
        {/* toit pentu en zinc */}
        <path d="M316 242 C330 196 450 176 520 166 C590 176 710 196 724 242 Z" fill="url(#kq-roof)" stroke="#141c14" strokeWidth="2" />
        {[360, 420, 480, 560, 620, 680].map((x) => <path key={x} d={`M${x} ${242 - Math.max(0, 70 - Math.abs(x - 520) * 0.35) * 0.9} Q${x + (520 - x) * 0.1} 210 ${x} 242`} stroke="#1a2a1c" strokeWidth="1.2" fill="none" opacity="0.6" />)}
        {/* lambrequin festonné sous le dôme */}
        {Array.from({ length: 19 }).map((_, i) => <path key={i} d={`M${326 + i * 20.4} 240 q10.2 12 20.4 0`} fill="#2a4a30" stroke="#141c14" strokeWidth="1" />)}
        <path d="M330 240 L710 240" stroke="#141c14" strokeWidth="2" />
        {/* bandeau « KIOSQUE » */}
        <rect x="360" y="210" width="320" height="26" fill="#c9a54a" stroke="#7a5a2a" strokeWidth="1.5" rx="2" />
        <text x="520" y="228" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fontWeight="700" fill="#3a2210">PRESSE · TABAC · LOTO</text>
        {/* pointe du toit */}
        <path d="M516 168 L524 168 L522 150 L518 150 Z" fill="#2a4a30" stroke="#141c14" strokeWidth="1" />
        <circle cx="520" cy="146" r="5" fill="#c9a54a" />
        <path d="M520 141 v-8" stroke="#c9a54a" strokeWidth="2" />

        {/* PRÉSENTOIR de journaux (façade avant) */}
        <rect x="352" y="260" width="336" height="140" fill="#1a2a1e" stroke="#0e1a10" strokeWidth="1.5" rx="2" />

        {/* Journaux/magazines empilés en 3 rangs, 4 par rang */}
        {[0, 1, 2].map((row) => (
          [0, 1, 2, 3].map((col) => {
            const x = 362 + col * 82;
            const y = 268 + row * 44;
            const covers = [
              { bg: "#d8d0c0", title: "LE MONDE",   accent: "#1a2030" },
              { bg: "#e8c8a8", title: "LIBÉ",       accent: "#c04040" },
              { bg: "#c8dae8", title: "PARIS-M.",   accent: "#3070a0" },
              { bg: "#f0c8d0", title: "STAR",       accent: "#c04a70" },
              { bg: "#fae8a8", title: "OKAPI",      accent: "#c07a30" },
              { bg: "#e0d8c0", title: "PIF",        accent: "#a04a30" },
              { bg: "#c8e0c8", title: "AUTO+",      accent: "#3a704a" },
              { bg: "#e0c8e8", title: "TÉLÉ 7",     accent: "#7a3a80" },
              { bg: "#f0e0c0", title: "CUISINE",    accent: "#a05a2a" },
              { bg: "#d0e0f0", title: "GÉO",        accent: "#3a5a90" },
              { bg: "#f0d8c8", title: "MODES",      accent: "#a04a5a" },
              { bg: "#c8c8d8", title: "L'ÉQUIPE",   accent: "#3a3a5a" },
            ];
            const c = covers[row * 4 + col];
            return (
              <g key={`c-${row}-${col}`}>
                <rect x={x} y={y} width="72" height="38" fill={c.bg} stroke="#5a4a30" strokeWidth="0.8" />
                <rect x={x} y={y} width="72" height="8" fill={c.accent} />
                <text x={x + 36} y={y + 22} textAnchor="middle" fontFamily="Georgia, serif" fontSize="7.5" fontWeight="800" fill={c.accent}>{c.title}</text>
                <line x1={x + 6} y1={y + 28} x2={x + 66} y2={y + 28} stroke={c.accent} strokeWidth="0.5" opacity="0.5" />
                <line x1={x + 6} y1={y + 32} x2={x + 60} y2={y + 32} stroke={c.accent} strokeWidth="0.5" opacity="0.5" />
              </g>
            );
          })
        ))}

        {/* Comptoir + Robert le kioskier passe la tête par la fenêtre latérale gauche
           (dimensionné plus petit pour ne pas éclipser le kiosque) */}
        <g transform="translate(276,306) scale(0.7)">
          {/* petite ouverture de service, côté gauche du kiosque */}
          <rect x="70" y="-20" width="16" height="60" fill="#1a2a1e" stroke="#0e1a10" strokeWidth="1" />
          {/* tête et buste de Robert, béret noir, moustache blanche, foulard rouge */}
          <clipPath id="k80-robert"><rect x="0" y="-60" width="90" height="134" /></clipPath>
          <g clipPath="url(#k80-robert)">
            <Bust x={40} y={10} s={2} skin="#d8b090" hair="#c8c4c0" look="short" mustache beardColor="#f0eae0" hat="beret" hatColor="#1a1a20" wrinkles mood="content" cloth="#6a6a70" collar="round">
              <path d="M-12 18 Q0 16 12 18 Q10 26 0 26 Q-10 26 -12 18 Z" fill="#c04030" />
            </Bust>
          </g>
        </g>
      </PLayer>

      {/* PASSANTS — une lycéenne à droite feuilletant un mag ado, un cadre à gauche */}
      <PLayer depth={2.5}>
        {/* Cadre pressé, gauche */}
        <g transform="translate(160,360)">
          {/* pressé : manteau beige, mallette, le journal replié sous le bras */}
          <Figure x={0} y={88} s={1.1} skin="#e8bfa0" hair="#3a2418" look="short" mood="vexe"
            garment="coat" coat="#c9a878" coat2="#7a5a3a" pants="#4a3620" shoes="#1a1410" arms={[{ a1: 14, a2: -20 }, { a1: 12, a2: 6 }]}>
            <rect x="16" y="-44" width="22" height="16" rx="2" fill="#3a2418" stroke="#1a1410" strokeWidth="1" />
            <path d="M21 -44 v-3 h12 v3" stroke="#1a1410" strokeWidth="1.6" fill="none" />
            <g transform="rotate(-8 -24 -70)">
              <rect x="-34" y="-84" width="20" height="26" fill="#e8e0c8" stroke="#8a7458" strokeWidth="0.8" />
              <path d="M-31 -78 h14 M-31 -74 h14 M-31 -70 h10" stroke="#3a2418" strokeWidth="0.6" />
            </g>
          </Figure>
        </g>

        {/* Lycéenne, droite, en train de feuilleter */}
        <g transform="translate(830,370)">
          {/* pull rose fluo bien 80s, jean, baskets ; elle feuillette un magazine */}
          <Figure x={0} y={86} s={1.04} skin="#f0d0a8" hair="#3a2418" look="ponytail" mood="content"
            garment="tee" coat="#e878a0" pants="#3a5074" shoes="#e8e8e0" belt={false} arms={[{ a1: 20, a2: -40 }, { a1: 20, a2: -40 }]}>
            <path d="M-14 -82 L0 -72 L14 -82 L14 -70 L0 -60 L-14 -70 Z" fill="#f8b0c8" opacity="0.7" />
            <ellipse cx="-10" cy="-120" rx="3.4" ry="2.4" fill="#c04a70" />
            <g transform="translate(0,-48)">
              <rect x="-18" y="-14" width="36" height="27" fill="#f0c8d0" stroke="#8a5a70" strokeWidth="0.8" />
              <rect x="-18" y="-14" width="36" height="6" fill="#c04a70" />
              <text x="0" y="2" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6" fontWeight="800" fill="#c04a70">STAR</text>
            </g>
            <circle cx="-14.4" cy="-50" r="4.4" fill="#f0d0a8" stroke="#a88060" strokeWidth="0.6" />
            <circle cx="14.4" cy="-50" r="4.4" fill="#f0d0a8" stroke="#a88060" strokeWidth="0.6" />
          </Figure>
        </g>

        {/* petit chien attaché à la grille du kiosque, à droite —
           la queue qui remue tranquillement (bascule d'un côté à l'autre) */}
        <g transform="translate(720,392)">
          <ellipse cx="0" cy="14" rx="18" ry="8" fill="#5a4030" />
          <circle cx="14" cy="6" r="7" fill="#5a4030" />
          <ellipse cx="-14" cy="10" rx="6" ry="4" fill="#5a4030" />
          {/* queue animée : rotation périodique autour du point d'attache */}
          <g style={{ transformOrigin: "-14px 10px", transformBox: "fill-box" }}>
            <path d="M-18 6 Q-18 -2 -12 -2" stroke="#5a4030" strokeWidth="4" fill="none" strokeLinecap="round">
              <animateTransform attributeName="transform" attributeType="XML" type="rotate"
                values="0; -25; 12; -18; 0" keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur="1.4s" repeatCount="indefinite" />
            </path>
          </g>
          {/* laisse */}
          <path d="M14 6 Q10 -20 -10 -30" stroke="#3a2418" strokeWidth="1.5" fill="none" />
          <circle cx="14" cy="6" r="1.5" fill="#c9a54a" />
          {/* museau + œil */}
          <circle cx="18" cy="8" r="1.5" fill="#1a1410" />
          <circle cx="14" cy="4" r="1" fill="#1a1410" />
        </g>
      </PLayer>

      {/* ═══ Mobylette Solex qui traverse le trottoir de temps en temps ═══
         L'icône même des années 80 dans les rues françaises. Elle
         passe de DROITE À GAUCHE toutes les 14 s, plus près du bord
         bas du trottoir, avec un petit panache de fumée bleutée au
         pot d'échappement, qui traîne derrière (donc à droite du
         véhicule, puisqu'il roule vers la gauche). */}
      <PLayer depth={2.5}>
        <g>
          <animateTransform attributeName="transform" attributeType="XML" type="translate"
            values="1140,0; -140,0" dur="14s" begin="2s" repeatCount="indefinite" />
          {/* fumée du pot d'échappement — trainée à DROITE du véhicule */}
          <g opacity="0.55">
            <ellipse cx="98" cy="502" rx="10" ry="4" fill="#c8c0b8">
              <animate attributeName="opacity" values="0.7; 0" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="rx" values="4; 20" dur="1.4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="114" cy="497" rx="8" ry="3.5" fill="#b8b0a8">
              <animate attributeName="opacity" values="0.6; 0" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
              <animate attributeName="rx" values="3; 16" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
            </ellipse>
          </g>
          {/* la mobylette, mirrored (scale -1) pour qu'elle regarde à gauche,
             et abaissée à y=492 pour rouler plus bas sur le trottoir */}
          <g transform="translate(60,492) scale(-1,1)">
            {/* roues avec rayons */}
            <circle cx="-18" cy="16" r="13" fill="none" stroke="#1a1a1a" strokeWidth="3" />
            <circle cx="-18" cy="16" r="13" fill="#2a2a2a" opacity="0.35" />
            <line x1="-18" y1="4" x2="-18" y2="28" stroke="#c8c8c8" strokeWidth="1" />
            <line x1="-30" y1="16" x2="-6" y2="16" stroke="#c8c8c8" strokeWidth="1" />
            <line x1="-26" y1="8" x2="-10" y2="24" stroke="#c8c8c8" strokeWidth="0.8" />
            <line x1="-26" y1="24" x2="-10" y2="8" stroke="#c8c8c8" strokeWidth="0.8" />
            <circle cx="30" cy="16" r="13" fill="none" stroke="#1a1a1a" strokeWidth="3" />
            <circle cx="30" cy="16" r="13" fill="#2a2a2a" opacity="0.35" />
            <line x1="30" y1="4" x2="30" y2="28" stroke="#c8c8c8" strokeWidth="1" />
            <line x1="18" y1="16" x2="42" y2="16" stroke="#c8c8c8" strokeWidth="1" />
            {/* cadre noir Solex */}
            <path d="M-18 16 L-6 -2 L18 -2 L30 16" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* moteur sur la roue avant, très iconique */}
            <rect x="-32" y="-2" width="16" height="12" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1" rx="1" />
            <circle cx="-24" cy="4" r="4" fill="none" stroke="#c8c8c8" strokeWidth="0.6" />
            {/* réservoir triangulaire */}
            <path d="M-6 -2 L18 -2 L14 -12 L-2 -12 Z" fill="#5a1a1a" stroke="#1a1a1a" strokeWidth="1" />
            {/* selle */}
            <path d="M14 -2 Q20 -6 30 -4 L30 0 L14 0 Z" fill="#1a1a1a" />
            {/* guidon */}
            <path d="M-6 -2 L-14 -18 L-10 -22 M-14 -18 L-18 -20" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* petit phare rond */}
            <circle cx="-16" cy="-14" r="3" fill="#f0e4a8" stroke="#1a1a1a" strokeWidth="1" />
            {/* pédales */}
            <line x1="6" y1="10" x2="14" y2="18" stroke="#1a1a1a" strokeWidth="2" />
            <rect x="12" y="17" width="6" height="3" fill="#c8c8c8" />
            {/* CONDUCTEUR — homme au blouson bleu, casque bol */}
            <g transform="translate(12,-14)">
              <Figure x={0} y={26} s={0.41} pose="sit" facing="right" skin="#e8bfa0" hair="#3a2418" look="short" hat="hardhat" hatColor="#c9a878"
                garment="jacket" coat="#3a5a90" pants="#4a3620" shoes="#1a1410" arms={[{ a1: -60, a2: -80 }, { a1: 70, a2: 90 }]} />
            </g>
          </g>
        </g>
      </PLayer>

      {/* Lampadaire en fer forgé à gauche */}
      <PLayer depth={3}>
        <rect x="80" y="240" width="6" height="160" fill="#1a1a20" />
        <path d="M60 240 Q66 232 76 236 M110 240 Q104 232 94 236" stroke="#1a1a20" strokeWidth="4" fill="none" />
        <circle cx="83" cy="232" r="10" fill="#f0e0a0" stroke="#5a4a20" strokeWidth="1.5" />
        <ellipse cx="83" cy="232" rx="20" ry="10" fill="#fff8c8" opacity="0.35" />
        <rect x="70" y="400" width="26" height="14" fill="#1a1a20" rx="2" />
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#161410" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      {/* Le kioskier — ouvre le mini-jeu « Fais la Une » (tant qu'il n'est pas fait) */}
      {!made.includes("msg_ligneEditoriale") && mode !== "jeu2" && (
        <Hotspot cx={312} cy={330} r={28} label="parler à Robert, le kioskier" reveal={reveal} onClick={() => action("robert")} />
      )}
      {/* Bouton mini-jeu direct sur le présentoir (accessible aussi via Robert) */}
      {!made.includes("msg_ligneEditoriale") && mode !== "jeu2" && (
        <Hotspot cx={520} cy={330} r={80} label="faire la Une du kiosque" reveal={reveal} onClick={() => action("faire_la_une")} />
      )}
      {/* Passants — juste du dialogue anodin */}
      <Hotspot cx={160} cy={340} r={30} label="le cadre pressé" reveal={reveal} onClick={() => action("cadre_presse")} />
      <Hotspot cx={830} cy={370} r={30} label="la lycéenne" reveal={reveal} onClick={() => action("lyceenne")} />
    </svg>
  );
}
