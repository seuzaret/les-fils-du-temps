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
      </defs>

      {/* CIEL matinal légèrement brumeux */}
      <rect width="1000" height="560" fill="url(#kq-sky)" />

      {/* IMMEUBLES en fond, silhouettes haussmanniennes */}
      <PLayer depth={5}>
        <rect x="0" y="90" width="1000" height="260" fill="url(#kq-facade)" opacity="0.9" />
        {/* fenêtres régulières */}
        {[0, 1, 2, 3, 4].map((row) => (
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
            <rect key={`w-${row}-${col}`} x={20 + col * 100} y={110 + row * 45} width="42" height="28" fill="#5a4c3a" opacity="0.55" />
          ))
        ))}
        {/* corniches */}
        {[130, 220, 310].map((y, i) => (
          <rect key={i} x="0" y={y} width="1000" height="4" fill="#8a7458" opacity="0.6" />
        ))}
        {/* toitures en zinc */}
        <path d="M0 90 L1000 90 L1000 70 L0 76 Z" fill="#5a5648" opacity="0.85" />
      </PLayer>

      {/* TROTTOIR — pavé + bordure */}
      <PLayer depth={2}>
        <rect y="360" width="1000" height="200" fill="url(#kq-street)" />
        <rect y="360" width="1000" height="6" fill="#2a2620" />
        {/* joints entre pavés (motif régulier) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <line key={`p-${i}`} x1={i * 80} y1="360" x2={i * 80 - 40} y2="560" stroke="#2a2620" strokeWidth="1.5" opacity="0.5" />
        ))}
        {[380, 420, 460, 500, 540].map((y, i) => (
          <line key={`ph-${i}`} x1="0" y1={y} x2="1000" y2={y} stroke="#2a2620" strokeWidth="1" opacity="0.35" />
        ))}
        {/* petite feuille morte ici et là */}
        <path d="M240 468 q4 -6 10 -4 q6 4 2 10 q-6 4 -12 -6 Z" fill="#a06a3a" opacity="0.7" />
        <path d="M780 502 q4 -6 10 -4 q6 4 2 10 q-6 4 -12 -6 Z" fill="#8a5a2a" opacity="0.6" />
      </PLayer>

      {/* LE KIOSQUE — au centre, imposant */}
      <PLayer depth={3}>
        {/* base en fer forgé */}
        <rect x="330" y="240" width="380" height="180" fill="url(#kq-kiosk)" stroke="#141c14" strokeWidth="2" rx="2" />
        {/* motifs de fer forgé (fines volutes) */}
        {[350, 400, 450, 500, 550, 600, 650, 690].map((x) => (
          <line key={`bar-${x}`} x1={x} y1="260" x2={x} y2="410" stroke="#0e1a10" strokeWidth="1" opacity="0.5" />
        ))}
        {/* toit pentu en zinc */}
        <path d="M320 240 L520 168 L720 240 Z" fill="url(#kq-roof)" stroke="#141c14" strokeWidth="2" />
        <path d="M330 240 L710 240" stroke="#141c14" strokeWidth="2" />
        {/* bandeau « KIOSQUE » */}
        <rect x="360" y="210" width="320" height="26" fill="#c9a54a" stroke="#7a5a2a" strokeWidth="1.5" rx="2" />
        <text x="520" y="228" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fontWeight="700" fill="#3a2210">PRESSE · TABAC · LOTO</text>
        {/* pointe du toit */}
        <path d="M518 168 L522 168 L522 156 L518 156 Z" fill="#5a4a30" />
        <circle cx="520" cy="152" r="4" fill="#c9a54a" />

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
      <PLayer depth={2}>
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
      <PLayer depth={2}>
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
      <PLayer depth={1}>
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
