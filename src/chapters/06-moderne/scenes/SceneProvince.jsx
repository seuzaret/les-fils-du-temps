import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 6 — Tableau 1 : en province, le vol de la montgolfière
   Peinture fine — place d'un bourg, matin clair : une MONTGOLFIÈRE
   décorée s'élève au-dessus de la foule ébahie. Au premier plan,
   JULES le journaliste écrit fébrilement ; à droite, un relais de
   poste prêt à emporter son article vers Paris.
   À trouver : la plume & l'encrier. Supports : la montgolfière
   (on écrit à son sujet) et le relais de chevaux (on y confie le pli).
   ============================================================ */

export default function SceneProvince({ collect, action, reveal, made = [], queteQui }) {
  const envoye = made.includes("msg_poste");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fb4d8" /><stop offset="55%" stopColor="#c2d6e2" /><stop offset="100%" stopColor="#ece2c4" /></linearGradient>
        <linearGradient id="pv-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a89066" /><stop offset="100%" stopColor="#5e4c34" /></linearGradient>
        <linearGradient id="pv-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8c49a" /><stop offset="100%" stopColor="#a88c60" /></linearGradient>
        <linearGradient id="pv-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5236" /><stop offset="100%" stopColor="#5e3620" /></linearGradient>
        <linearGradient id="pv-balloon" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a5a9a" /><stop offset="100%" stopColor="#1c3a68" /></linearGradient>
        <filter id="pv-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="pv-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ ciel ═══ */}
      <rect width="1000" height="560" fill="url(#pv-sky)" />
      <circle cx="140" cy="96" r="30" fill="#fff4d0" opacity="0.85" />
      {[[260, 96, 120], [820, 76, 140]].map(([x, y, w], i) => <ellipse key={i} cx={x} cy={y} rx={w} ry={12} fill="#f2f2e8" opacity="0.5" />)}

      {/* ═══ LA MONTGOLFIÈRE qui s'élève et redescend doucement (SMIL) ═══ */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="560,168; 560,138; 560,168" dur="9s" repeatCount="indefinite" />
        <g>
          {/* enveloppe décorée façon Montgolfier */}
          <path d="M0 -104 C64 -104 84 -52 78 -14 C74 12 48 34 0 40 C-48 34 -74 12 -78 -14 C-84 -52 -64 -104 0 -104 Z" fill="url(#pv-balloon)" />
          {/* fuseaux + guirlandes dorées */}
          <path d="M0 -104 V40 M-40 -96 Q-58 -30 -30 38 M40 -96 Q58 -30 30 38" stroke="#c8a84a" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M-78 -14 Q0 6 78 -14 M-70 -46 Q0 -30 70 -46" stroke="#c8a84a" strokeWidth="2.4" fill="none" opacity="0.8" />
          {[-52, -18, 18, 52].map((x, i) => <path key={i} d={`M${x} -80 q6 -8 12 0`} stroke="#e0c060" strokeWidth="2" fill="none" opacity="0.6" />)}
          {/* soleil brodé au centre (emblème royal) */}
          <circle cx="0" cy="-40" r="12" fill="#e0c060" opacity="0.85" />
          {[...Array(8)].map((_, i) => <path key={i} d="M0 -56 v-6" stroke="#e0c060" strokeWidth="2" transform={`rotate(${i * 45} 0 -40)`} />)}
          {/* cordages + nacelle */}
          <path d="M-58 20 L-14 56 M58 20 L14 56 M-30 34 L-6 56 M30 34 L6 56" stroke="#7a6a4a" strokeWidth="1.4" />
          <path d="M-16 56 L16 56 L12 74 L-12 74 Z" fill="#7a5230" />
          <path d="M-16 56 L16 56 L12 74 L-12 74 Z" fill="none" stroke="#4a3218" strokeWidth="1.4" />
          {/* la flamme du brûleur */}
          <g style={{ animation: "glow 1.2s ease-in-out infinite" }}>
            <path d="M0 54 q-6 -12 0 -20 q6 8 0 20 Z" fill="#ffb347" />
            <path d="M0 52 q-3 -7 0 -12 q3 5 0 12 Z" fill="#fff2c4" />
          </g>
        </g>
      </g>

      {/* ═══ couche lointaine : le bourg ═══ */}
      <PLayer depth={1}>
        <path d="M0 320 Q250 300 500 314 Q750 328 1000 306 L1000 380 L0 380 Z" fill="#8a9a66" />
        {[[120, 316, "#a83a2a"], [210, 320, "#3a6a8a"], [300, 314, "#8a6a3a"], [860, 316, "#a83a2a"], [930, 320, "#3a6a8a"]].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-26" y="-58" width="52" height="58" fill="url(#pv-wall)" />
            <path d="M-32 -58 L0 -84 L32 -58 Z" fill={c} />
            <rect x="-8" y="-30" width="16" height="30" fill="#3a2c1c" />
          </g>
        ))}
        {/* le clocher du bourg */}
        <g transform="translate(430,314)">
          <rect x="-20" y="-92" width="40" height="92" fill="url(#pv-wall)" />
          <path d="M-24 -92 L0 -128 L24 -92 Z" fill="#6a6052" />
          <rect x="-8" y="-70" width="16" height="24" rx="8" fill="#3a2c1c" />
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : la foule des badauds qui regarde en l'air ═══ */}
      <PLayer depth={2}>
        {[[340, 388, "#7a3a4a"], [386, 392, "#3a5a7a"], [430, 386, "#6a5a2a"], [476, 392, "#5a3a6a"], [636, 388, "#7a4a2a"], [684, 392, "#3a5a4a"], [730, 386, "#8a3a3a"]].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {/* tête levée vers le ciel, un bras qui pointe le ballon */}
            <Figure x={0} y={48} s={0.6} skin="#cc9c6c" hair={["#3a2c1c", "#5a3a20", "#1e140c", "#7a5a3a"][i % 4]}
              look={["ponytail", "bun", "short", "long", "curls", "ponytail", "bob"][i]} hat={i === 2 || i === 5 ? "tricorne" : null}
              mood="surpris" garment={i % 2 ? "dress" : "coat"} coat={c} pants="#3a2c1c"
              arms={[{ a1: 10, a2: 6 }, { a1: 160, a2: 168 }]} />
          </g>
        ))}
      </PLayer>

      {/* ═══ premier plan : place, Jules, la plume, le relais ═══ */}
      <PLayer depth={3}>
        <rect y="430" width="1000" height="130" fill="url(#pv-ground)" />
        <rect y="432" width="1000" height="128" fill="#2c2012" opacity="0.3" filter="url(#pv-mottle)" />
        <path d="M0 486 h1000 M260 430 v130 M540 430 v130 M800 430 v130" stroke="#4a3a24" strokeWidth="1.4" opacity="0.4" />
        <ellipse cx="500" cy="500" rx="460" ry="42" fill="#6e5836" opacity="0.25" />

        {/* JULES le journaliste, penché sur son carnet, la plume à la main */}
        <g transform="translate(200,472)">
          <ellipse cx="0" cy="46" rx="26" ry="7" fill="#160f08" opacity="0.4" />
          {/* habit bleu, jabot clair, catogan ; il écrit sur son carnet */}
          <Figure x={0} y={46} s={0.64} skin="#dcae82" hair="#4a3020" look="ponytail" mood="content"
            garment="coat" coat="#2c4658" pants="#1c3040" shoes="#1a1410"
            arms={[{ a1: 20, a2: -40 }, { a1: 40, a2: 10 }]}>
            <path d="M0 -88 Q-6 -70 0 -48 Q6 -70 0 -88 Z" fill="#e6dfc8" />
            <g transform="translate(40,-42) rotate(-8)">
              <rect x="-22" y="-12" width="44" height="28" rx="2.4" fill="#efe9d6" stroke="#8a7a5a" strokeWidth="0.6" />
              <path d="M-14 -4 h28 M-14 4 h22" stroke="#8a7a5a" strokeWidth="1.5" opacity="0.7" />
              {/* la plume qui court */}
              <path d="M-4 -6 q16 -18 10 -34" stroke="#f4efe2" strokeWidth="3.6" fill="none" />
            </g>
          </Figure>
        </g>

        {/* LA TABLE de Jules avec son encrier et sa plume dessus */}
        <g transform="translate(120,504)">
          {/* ombre au sol */}
          <ellipse cx="0" cy="34" rx="46" ry="6" fill="#1a1006" opacity="0.4" />
          {/* plateau de la table */}
          <path d="M-40 8 L40 8 L44 -6 L-44 -6 Z" fill="#8a5a2e" stroke="#3a1810" strokeWidth="0.8" />
          <path d="M-44 -6 L44 -6" stroke="#5a3818" strokeWidth="1.2" />
          {/* 4 pieds de la table */}
          <rect x="-40" y="8" width="3" height="26" fill="#5a3818" />
          <rect x="-20" y="8" width="3" height="26" fill="#5a3818" />
          <rect x="17" y="8" width="3" height="26" fill="#5a3818" />
          <rect x="37" y="8" width="3" height="26" fill="#5a3818" />
          {/* traverse basse pour rigidité */}
          <rect x="-40" y="28" width="80" height="2" fill="#5a3818" opacity="0.7" />
          {/* encrier */}
          <path d="M-12 -8 Q-13 -16 -4 -18 L4 -18 Q13 -16 12 -8 Z" fill="#2a2620" />
          <ellipse cx="0" cy="-18" rx="8" ry="3" fill="#0c0a08" />
          {/* la plume plantée dedans */}
          <g transform="translate(2,-18) rotate(20)">
            <path d="M0 0 Q6 -26 2 -46 Q-3 -26 0 0 Z" fill="#f4efe2" stroke="#c9be9a" strokeWidth="1" />
            <path d="M1 -4 V-40" stroke="#c9be9a" strokeWidth="1" />
          </g>
          {/* une petite feuille froissee sur la table */}
          <path d="M18 -6 l12 -1 l-2 -6 l-10 1 z" fill="#f0e6c8" stroke="#7a5636" strokeWidth="0.3" />
        </g>

        {/* CABANE en bois a gauche : petit abri du guetteur / relais */}
        <g transform="translate(60,430)">
          {/* ombre au sol */}
          <ellipse cx="0" cy="94" rx="60" ry="8" fill="#1a1006" opacity="0.5" />
          {/* mur de planches verticales */}
          <rect x="-46" y="0" width="92" height="90" fill="#6a4626" stroke="#2a1408" strokeWidth="0.8" />
          <path d="M-38 0 v90 M-30 0 v90 M-22 0 v90 M-14 0 v90 M-6 0 v90 M2 0 v90 M10 0 v90 M18 0 v90 M26 0 v90 M34 0 v90" stroke="#3a2010" strokeWidth="0.5" opacity="0.55" />
          {/* toit pentu en tuiles */}
          <path d="M-58 0 L0 -38 L58 0 Z" fill="#8a3018" stroke="#3a0808" strokeWidth="0.8" />
          <path d="M-58 0 L58 0" stroke="#3a0808" strokeWidth="1.2" />
          {/* joint tuiles */}
          {[-12, -4, 4, 12].map((dy, i) => (
            <path key={i} d={`M${-56 + i * 8} ${-4 + i * -4} L${58 - i * 8} ${-4 + i * -4}`} stroke="#5a1808" strokeWidth="0.4" opacity="0.5" />
          ))}
          {/* petite lucarne dans le toit */}
          <rect x="-6" y="-16" width="12" height="10" fill="#2a1408" />
          {/* porte en planches */}
          <rect x="-12" y="46" width="24" height="44" fill="#3a2010" stroke="#1a0e04" strokeWidth="0.6" />
          <path d="M-10 50 v40 M-6 50 v40 M-2 50 v40 M2 50 v40 M6 50 v40 M10 50 v40" stroke="#1a0e04" strokeWidth="0.4" />
          <circle cx="8" cy="68" r="1" fill="#c8a848" />
          {/* petite fenetre a droite */}
          <rect x="18" y="18" width="18" height="20" fill="#3a2818" />
          <path d="M27 18 v20 M18 28 h18" stroke="#5a3818" strokeWidth="1" />
          {/* rideau leger derriere la fenetre */}
          <path d="M20 20 q3 6 0 16 M32 20 q-3 6 0 16" stroke="#e0c090" strokeWidth="1.4" fill="none" opacity="0.7" />
          {/* cheminee qui fume */}
          <rect x="-30" y="-30" width="8" height="24" fill="#3a2010" />
          <rect x="-32" y="-32" width="12" height="4" fill="#5a3818" />
          <path d="M-26 -34 q-6 -12 4 -22 q-8 4 -2 -12" stroke="#c8c0b0" strokeWidth="4" fill="none" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
          </path>
          {/* baril devant la porte */}
          <g transform="translate(24,80)">
            <ellipse cx="0" cy="10" rx="9" ry="2" fill="#0a0604" opacity="0.4" />
            <path d="M-7 6 Q-9 -6 0 -8 Q9 -6 7 6 Z" fill="#7a4a24" stroke="#2a1408" strokeWidth="0.6" />
            <path d="M-8 -2 h16 M-8 2 h16" stroke="#2a1408" strokeWidth="0.6" opacity="0.7" />
          </g>
        </g>

        {/* LE RELAIS DE POSTE (à droite) : un cheval sellé + le postillon,
            prêts à emporter l'article vers Paris */}
        <g transform="translate(770,460)">
          <ellipse cx="0" cy="48" rx="46" ry="9" fill="#241608" opacity="0.4" />
          {/* le cheval */}
          <path d="M-34 8 Q-40 -16 -10 -18 L28 -14 Q44 -12 42 4 Q40 18 24 18 L-20 16 Q-34 16 -34 8 Z" fill="#5a3f2a" />
          <path d="M30 -10 Q50 -16 54 -38 L64 -38" stroke="#5a3f2a" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M60 -42 q11 -2 13 9 l-7 7 q-11 0 -11 -9 Z" fill="#5a3f2a" />
          <path d="M56 -48 q-2 -9 5 -11" stroke="#5a3f2a" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M38 -20 q-4 9 -11 11 M45 -26 q-3 9 -9 13" stroke="#241608" strokeWidth="3" fill="none" />
          <path d="M-24 14 L-26 48 M-6 16 L-6 48 M16 16 L18 48 M32 12 L36 46" stroke="#3a2618" strokeWidth="6" strokeLinecap="round" />
          {/* selle + sacoche de courrier */}
          <path d="M-14 -14 q14 -8 30 0 l-2 8 q-14 -6 -26 0 Z" fill="#3a2414" />
          <rect x="-20" y="-6" width="14" height="14" rx="2" fill="#6e4c2e" /><circle cx="-13" cy="1" r="2.4" fill="#a83828" />
          {/* le postillon debout, tenant la bride */}
          <Figure x={-52} y={28} s={0.47} facing="right" skin="#cc9c6c" hair="#3a2818" look="ponytail" hat="tricorne" hatColor="#2c2c3a" mood="content"
            garment="coat" coat="#3a4a8a" trim="#c8a84a" pants="#e8e0c8" shoes="#1a1410"
            arms={[{ a1: 10, a2: 6 }, { a1: 70, a2: 60 }]} />
        </g>

        {/* épave de MARTINE, échouée dans un coin de la place */}
        <g transform="translate(930,512) rotate(8)">
          <ellipse cx="0" cy="12" rx="24" ry="6" fill="#0a0603" opacity="0.6" />
          <path d="M0 -18 Q16 -16 18 -4 Q20 8 10 10 L-10 10 Q-20 8 -18 -4 Q-16 -16 0 -18 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-12" y="2" width="22" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="8" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>1783</text>
          <circle cx="12" cy="-25" r="2.2" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
        </g>

        {/* RÉSULTAT (msg_poste) : le courrier part au galop, l'article en sacoche */}
        {envoye && (
          <g transform="translate(500,452)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="20" cy="20" rx="30" ry="6" fill="#c8b088" opacity="0.35" style={{ animation: "drift 3s ease-in-out infinite" }} />
            <path d="M-18 8 Q-22 -8 -6 -10 L18 -10 Q26 -8 24 0 Q20 8 -18 8 Z" fill="#4a3222" />
            <path d="M18 -10 Q28 -14 32 -26 L38 -24 Q34 -10 22 -8 Z" fill="#4a3222" />
            <path d="M-14 6 l-8 14 M-2 7 l-2 16 M16 6 l8 14 M24 2 l10 10" stroke="#4a3222" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M-2 -12 Q0 -24 8 -24 Q14 -22 12 -12 Z" fill="#3a4a8a" />
            <circle cx="6" cy="-26" r="4" fill="#cc9c6c" />
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#231a10" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      {/* le « ? » de Jules */}
      {queteQui === "jules" && (
        <>
          <g transform="translate(182,398)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={200} cy={452} r={30} label="parler à Jules" reveal={reveal} onClick={() => action("jules")} />
        </>
      )}

      {/* la montgolfière (support : on écrit à son sujet) */}
      <Hotspot cx={560} cy={150} r={78} label="la montgolfière" item="montgolfiere" reveal={reveal} onClick={() => collect("montgolfiere")} />
      {/* la plume & l'encrier */}
      <Hotspot cx={120} cy={500} r={30} label="plume & encrier" item="plume" reveal={reveal} onClick={() => collect("plume")} />
      {/* le relais de chevaux (support : on y confie le pli) */}
      <Hotspot cx={772} cy={452} r={60} label="relais de chevaux" item="chevaux" reveal={reveal} onClick={() => collect("chevaux")} />
      {/* l'épave de MARTINE */}
      <Hotspot cx={930} cy={506} r={28} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
          {/* AMBIANCE : petit vol d'oiseaux qui traverse le ciel */}
      <g opacity="0.75">
        <animateTransform attributeName="transform" type="translate"
          values="-40,0; 1050,-20" dur="28s" repeatCount="indefinite" />
        <path d="M0 130 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M28 142 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M54 128 q6 -8 12 0 q6 -8 12 0" stroke="#1a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
</svg>
  );
}
