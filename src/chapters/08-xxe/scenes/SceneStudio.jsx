import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 8 — Tableau-ÉNIGME : « Parler à un pays occupé ? »
   ------------------------------------------------------------
   Studio de radio, 1940. Lumière grave, lampe ON AIR ÉTEINTE.
   Le speaker (cliquable) pose son problème : les journaux sont
   censurés, les frontières fermées… comment parler quand même ?
   → ondes + micro → la lampe ON AIR s'allume en rouge et les
     ondes jaillissent de l'antenne, par la fenêtre.
   Piège : la bande magnétique + le gros aimant = tout effacé.
   Ce décor réagit à l'état du jeu via la prop `made`.
   ============================================================ */

export default function SceneStudio({ collect, action, reveal, made = [] }) {
  const radio = made.includes("msg_radio");          // l'émission part enfin
  const tapeGone = made.includes("msg_cassette") || made.includes("msg_bande"); // la bande a servi

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4e4a52" /><stop offset="100%" stopColor="#2a282e" /></linearGradient>
        <linearGradient id="st-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a2440" /><stop offset="100%" stopColor="#3a4a60" /></linearGradient>
        <linearGradient id="st-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5636" /><stop offset="100%" stopColor="#432c18" /></linearGradient>
        <linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5e5450" /><stop offset="100%" stopColor="#2c2622" /></linearGradient>
        <radialGradient id="st-lamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffcf78" stopOpacity="0.4" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <radialGradient id="st-red" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff5a4a" stopOpacity="0.65" /><stop offset="100%" stopColor="#ff5a4a" stopOpacity="0" /></radialGradient>
        <filter id="st-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="st-winclip"><rect x="-88" y="-62" width="176" height="124" /></clipPath>
      </defs>

      {/* ═══ mur du studio (panneaux acoustiques) ═══ */}
      <rect width="1000" height="560" fill="url(#st-wall)" />
      {[...Array(6)].map((_, r) => [...Array(12)].map((_, c) => (
        <rect key={`${r}-${c}`} x={20 + c * 82} y={30 + r * 70} width="62" height="50" rx="3" fill="#3a3840" opacity="0.5" />
      )))}
      <rect width="1000" height="560" fill="#16141a" opacity="0.24" filter="url(#st-grain)" />

      {/* ═══ couche lointaine : la fenêtre sur l'antenne + l'horloge ═══ */}
      <PLayer depth={1}>
        <g transform="translate(700,170)">
          <rect x="-90" y="-64" width="180" height="128" fill="url(#st-win)" />
          <g clipPath="url(#st-winclip)">
            {/* nuit de guerre, toits noirs */}
            <path d="M-88 40 L-50 16 L-14 40 L20 14 L56 40 L88 20 L88 62 L-88 62 Z" fill="#12141c" />
            {[[-60, 20], [10, 44], [64, 8]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.4" fill="#cfd8e0" opacity="0.7" style={{ animation: `twinkle ${2 + i}s infinite` }} />
            ))}
            {/* le pylône de l'émetteur */}
            <g transform="translate(30,-4)">
              <path d="M-3 46 L-9 -40 L9 -40 L3 46 Z" fill="#2a2c34" />
              {[...Array(6)].map((_, i) => <path key={i} d={`M${-8 + i * 0.8} ${-34 + i * 13} h${16 - i * 1.6}`} stroke="#3a3c46" strokeWidth="1.6" />)}
            </g>
            {/* LES ONDES : faibles tant qu'on n'émet pas, puissantes après.
                ⚠️ l'animation va sur le <g>, l'opacité sur le <path> : sinon
                l'animation CSS écrase l'attribut opacity et faibles/fortes se
                ressemblent. */}
            <g transform="translate(30,-46)" fill="none" stroke="#7fd8ff">
              {(radio ? [16, 28, 42, 58, 76] : [14, 24, 34]).map((r, i) => (
                <g key={i} style={{ animation: `pulse ${1.6 + i * 0.35}s infinite` }}>
                  <path d={`M${r * 0.6} -${r * 0.5} A${r} ${r} 0 0 1 ${r * 0.6} ${r * 0.5}`} strokeWidth={radio ? 2.4 : 1.6} opacity={(radio ? 0.95 : 0.3) - i * 0.13} />
                  <path d={`M-${r * 0.6} -${r * 0.5} A${r} ${r} 0 0 0 -${r * 0.6} ${r * 0.5}`} strokeWidth={radio ? 2.4 : 1.6} opacity={(radio ? 0.95 : 0.3) - i * 0.13} />
                </g>
              ))}
            </g>
          </g>
          <rect x="-90" y="-64" width="180" height="128" fill="none" stroke="#1c1a20" strokeWidth="8" />
          <path d="M0 -64 v128 M-90 0 h180" stroke="#1c1a20" strokeWidth="4" />
        </g>

        {/* seconde FENETRE : vue sur LONDRES (Big Ben) — le studio est
            allie, on emet vers l'occupation. */}
        <g transform="translate(920,180)">
          <rect x="-80" y="-70" width="160" height="140" fill="url(#st-win)" />
          <g clipPath="url(#st-win2clip)">
            {/* silhouette de la Tamise + toits sombres */}
            <path d="M-80 40 L-40 20 L-10 32 L26 12 L60 30 L80 22 L80 70 L-80 70 Z" fill="#0e1218" />
            {/* Big Ben tour + horloge */}
            <g transform="translate(-30,-2)">
              <rect x="-9" y="-40" width="18" height="70" fill="#2a2c34" />
              <path d="M-11 -40 h22 v6 h-22 z" fill="#3a3c46" />
              <rect x="-7" y="-52" width="14" height="14" fill="#2a2c34" />
              <circle cx="0" cy="-45" r="4.5" fill="#efe6d2" stroke="#2a2c34" strokeWidth="0.6" />
              <path d="M0 -45 v-3 M0 -45 l2.5 1" stroke="#1a1408" strokeWidth="0.6" />
              <path d="M-7 -60 L0 -70 L7 -60 Z" fill="#2a2c34" />
              <path d="M0 -70 v-6" stroke="#2a2c34" strokeWidth="1" />
            </g>
            {/* petites lucarnes eclairees */}
            {[[26,20],[46,26],[62,18],[-56,26]].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="3" height="4" fill="#ffe08a" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.85;0.4" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
              </rect>
            ))}
            {/* projecteur DCA qui balaie doucement le ciel */}
            <path d="M50 60 L-10 -60 L18 -66 L58 60 Z" fill="#ffe08a" opacity="0.15">
              <animateTransform attributeName="transform" type="rotate"
                values="-10 50 60; 12 50 60; -10 50 60" dur="14s" repeatCount="indefinite" />
            </path>
          </g>
          {/* clip de la fenetre Londres */}
          <defs><clipPath id="st-win2clip"><rect x="-80" y="-70" width="160" height="140" /></clipPath></defs>
          {/* cadre + croisillons */}
          <rect x="-80" y="-70" width="160" height="140" fill="none" stroke="#1c1a20" strokeWidth="7" />
          <path d="M0 -70 v140 M-80 0 h160" stroke="#1c1a20" strokeWidth="3.5" />
          {/* etiquette LONDON */}
          <rect x="-30" y="72" width="60" height="12" rx="2" fill="#2a2c34" stroke="#4a5460" strokeWidth="0.6" />
          <text x="0" y="81" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7.5" letterSpacing="2" fill="#7fd8ff">LONDON</text>
        </g>

        {/* horloge de studio */}
        <g transform="translate(180,140)">
          <circle cx="0" cy="0" r="34" fill="#e8e4da" stroke="#2a282e" strokeWidth="6" />
          <path d="M0 0 L0 -20 M0 0 L13 7" stroke="#2a2228" strokeWidth="3" />
          {[0, 90, 180, 270].map((a, i) => <path key={i} d="M0 -28 v6" stroke="#5a5560" strokeWidth="2.5" transform={`rotate(${a})`} />)}
        </g>

        {/* LA LAMPE « ON AIR » : éteinte, puis rouge quand on émet */}
        <g transform="translate(430,120)">
          {radio && <ellipse cx="0" cy="0" rx="120" ry="70" fill="url(#st-red)" style={{ animation: "glow 1.6s ease-in-out infinite" }} />}
          <rect x="-58" y="-20" width="116" height="40" rx="6" fill={radio ? "#7a1c14" : "#2e2a30"} stroke="#1a181e" strokeWidth="4" />
          <text x="0" y="7" textAnchor="middle" fontSize="19" letterSpacing="3"
            fill={radio ? "#ffe0d0" : "#4a4650"} fontFamily="ui-monospace,monospace" fontWeight="bold"
            style={radio ? { animation: "glow 1.6s ease-in-out infinite" } : undefined}>ON AIR</text>
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : LE SPEAKER + le « ? » ═══ */}
      <PLayer depth={2}>
        {!radio && (
          <g transform="translate(300,246)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -26 26 -26 q26 0 26 22 q0 18 -22 24 l0 8" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="26" cy="40" r="3" fill="#ffd166" />
          </g>
        )}
        {/* le speaker, assis, ses feuilles à la main — corps ELARGI dans
            un costume bleu franc qui reste bien visible au-dessus (et
            derriere) le pupitre. */}
        <g transform="translate(340,372)">
          {/* assis, costume bleu marine, ses feuilles à la main */}
          <Figure x={0} y={91} s={1.15} pose="sit" skin="#d8a884" hair="#3a3028" look="short" mustache mood="content"
            garment="jacket" coat="#2a4870" coat2="#e8e4da" pants="#1a2a44" shoes="#0a0a10" arms={[{ a1: 20, a2: -30 }, { a1: 50, a2: 60 }]}>
            <path d="M-2 -70 L2 -70 L3 -50 L0 -46 L-3 -50 Z" fill="#7a2418" />
            <g transform="translate(56,-40) rotate(-12)">
              <rect x="-11" y="-14" width="22" height="28" fill="#e8e4da" stroke="#9a96a0" strokeWidth="0.5" />
              <path d="M-7 -8 h14 M-7 -3 h14 M-7 2 h10" stroke="#9a96a0" strokeWidth="1.2" />
            </g>
          </Figure>
        </g>
      </PLayer>

      {/* ═══ premier plan : la table, le micro, la bande, l'aimant, l'épave ═══ */}
      <PLayer depth={3}>
        <rect y="420" width="1000" height="140" fill="url(#st-floor)" />
        <rect y="422" width="1000" height="138" fill="#161218" opacity="0.34" filter="url(#st-grain)" />
        <ellipse cx="480" cy="484" rx="440" ry="46" fill="#141018" opacity="0.3" />
        <ellipse cx="420" cy="450" rx="200" ry="90" fill="url(#st-lamp)" style={{ animation: "glow 3s ease-in-out infinite" }} />

        {/* la table du studio : plateau + facade opaque qui cache le
            bas du presentateur */}
        <g transform="translate(400,492)">
          {/* plateau */}
          <rect x="-190" y="0" width="380" height="14" rx="3" fill="url(#st-desk)" />
          {/* facade avant du pupitre (grande, cache les jambes du speaker) */}
          <rect x="-190" y="14" width="380" height="54" fill="url(#st-desk)" stroke="#1a1006" strokeWidth="1.5" />
          <rect x="-190" y="14" width="380" height="54" fill="#1a1006" opacity="0.25" filter="url(#st-grain)" />
          {/* deux moulures horizontales */}
          <path d="M-186 26 h372 M-186 56 h372" stroke="#1a1006" strokeWidth="1" opacity="0.5" />
          {/* pieds */}
          <rect x="-178" y="68" width="14" height="20" fill="#33210f" /><rect x="164" y="68" width="14" height="20" fill="#33210f" />
        </g>

        {/* LE MICRO sur pied (mobilier du studio : il reste dessiné) */}
        <g transform="translate(430,464)">
          <rect x="-3" y="0" width="6" height="28" fill="#3a3c46" />
          <ellipse cx="0" cy="30" rx="18" ry="4" fill="#2a2c34" />
          {/* la tête du micro, style 1940 */}
          <rect x="-15" y="-30" width="30" height="30" rx="14" fill="#5a5c66" stroke="#2a2c34" strokeWidth="2.5" />
          <path d="M-11 -25 h22 M-11 -19 h22 M-11 -13 h22 M-11 -7 h22" stroke="#2a2c34" strokeWidth="1.6" />
          <rect x="-6" y="-34" width="12" height="5" rx="2" fill="#3a3c46" />
        </g>

        {/* LE MAGNÉTOPHONE à bobines + LA BANDE MAGNÉTIQUE */}
        {!tapeGone && (
          <g transform="translate(640,478)">
            <rect x="-52" y="-16" width="104" height="30" rx="4" fill="#4a4650" />
            <rect x="-52" y="-16" width="104" height="30" rx="4" fill="#16141a" opacity="0.3" filter="url(#st-grain)" />
            {/* les deux bobines */}
            {[-26, 26].map((x, i) => (
              <g key={i} transform={`translate(${x},-30)`}>
                <circle cx="0" cy="0" r="21" fill="#2e2c34" stroke="#5a5c66" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="14" fill="#6a4a2a" />
                <circle cx="0" cy="0" r="4" fill="#8a8c96" />
              </g>
            ))}
            {/* le ruban tendu entre les bobines */}
            <path d="M-26 -30 q26 14 52 0" stroke="#3a2a1a" strokeWidth="3" fill="none" />
            <rect x="-10" y="-8" width="20" height="8" rx="1" fill="#2a2c34" />
          </g>
        )}

        {/* LE HAUT-PARLEUR et son GROS AIMANT (danger pour la bande) */}
        <g transform="translate(180,470)">
          <rect x="-44" y="-40" width="88" height="86" rx="5" fill="#4a3a2a" />
          <rect x="-44" y="-40" width="88" height="86" rx="5" fill="#1a1208" opacity="0.3" filter="url(#st-grain)" />
          <circle cx="0" cy="-8" r="28" fill="#2a2018" />
          <circle cx="0" cy="-8" r="20" fill="#3a2c20" />
          <circle cx="0" cy="-8" r="7" fill="#5a4636" />
          {/* l'aimant, en fer à cheval, posé contre le caisson */}
          {!made.includes("msg_bande") && (
            <g transform="translate(0,30)">
              <path d="M-13 8 L-13 -6 A13 13 0 0 1 13 -6 L13 8 L6 8 L6 -6 A6 6 0 0 0 -6 -6 L-6 8 Z" fill="#a83828" />
              <rect x="-13" y="6" width="7" height="7" fill="#b8bcc0" /><rect x="6" y="6" width="7" height="7" fill="#b8bcc0" />
            </g>
          )}
        </g>

        {/* épave de MARTINE (x ≤ 860 : au-delà, le décor est rogné) */}
        <g transform="translate(850,508) rotate(-6)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#0a0603" opacity="0.6" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>1969</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      <rect width="1000" height="560" fill="#0e0c12" opacity="0.07" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={348} cy={380} r={54} label="le speaker" reveal={reveal} onClick={() => action("speaker")} />
      {!radio && (
        <>
          <Hotspot cx={430} cy={444} r={34} label="micro" item="micro" reveal={reveal} onClick={() => collect("micro")} />
          <Hotspot cx={730} cy={126} r={54} label="ondes" item="ondes" reveal={reveal} onClick={() => collect("ondes")} />
        </>
      )}
      {!tapeGone && (
        <Hotspot cx={640} cy={456} r={46} label="bande magnétique" item="bande_magnetique" reveal={reveal} onClick={() => collect("bande_magnetique")} />
      )}
      {!made.includes("msg_bande") && (
        <Hotspot cx={180} cy={500} r={30} label="gros aimant" item="aimant" reveal={reveal} onClick={() => collect("aimant")} />
      )}
      <Hotspot cx={850} cy={504} r={34} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
    </svg>
  );
}
