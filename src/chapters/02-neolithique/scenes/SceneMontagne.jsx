import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Haze, Ridge, Rock, Speckle, TreeLine } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 2 · Tableau 5 — La mine de cuivre, en montagne  (PEINTURE FINE)
   Hauteurs froides et enneigées, un filon de malachite verte, une
   enclume de pierre, un feu où rôtit un gigot (→ os + suie), Ötzi
   emmitouflé qui creuse, sa hache de cuivre, son bol d'argile.
   ============================================================ */

export default function SceneMontagne({ collect, action, reveal, made = [], queteQui }) {
  const soigne = made.includes("msg_tatouage");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3e5e86" /><stop offset="55%" stopColor="#8fa8bc" /><stop offset="100%" stopColor="#d6dccc" /></linearGradient>
        <linearGradient id="mo-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a7484" /><stop offset="100%" stopColor="#8a94a0" /></linearGradient>
        <linearGradient id="mo-rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#948b82" /><stop offset="55%" stopColor="#5e564e" /><stop offset="100%" stopColor="#38322a" /></linearGradient>
        <linearGradient id="mo-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f6f8fa" /><stop offset="100%" stopColor="#cdd6dc" /></linearGradient>
        <linearGradient id="mo-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a6e5c" /><stop offset="100%" stopColor="#40382c" /></linearGradient>
        <radialGradient id="mo-fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffc068" stopOpacity="0.75" /><stop offset="100%" stopColor="#ff9540" stopOpacity="0" /></radialGradient>
        <filter id="mo-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="mo-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="mo-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel froid d'altitude ═══ */}
      <rect width="1000" height="560" fill="url(#mo-sky)" />
      {/* brume qui traîne */}
      {[[250, 220, 1.2], [700, 250, 1], [500, 300, 1.4]].map(([x, y, s], i) => (
        <ellipse key={i} cx={x} cy={y} rx={90 * s} ry="20" fill="#e6ecf0" opacity="0.28" filter="url(#mo-blur)" style={{ animation: `drift ${6 + i}s ease-in-out infinite` }} />
      ))}

      {/* ═══ sommets lointains, enneigés, puis contreforts ═══ */}
      <PLayer depth={1}>
        <Ridge id="mo-r0" seed={121} y={260} amp={170} rough={0.62} fill="#7a8498" lit="#b8c0d0" light={-1} snow="#f6f9fb" snowLine={176} />
        <Haze id="mo-h0" y0={180} y1={290} color="#dce4ea" opacity={0.5} />
        <Ridge id="mo-r1" seed={127} y={330} amp={110} rough={0.58} fill="#565c64" lit="#8a8e94" light={-1} snow="#eef2f4" snowLine={252} />
        <rect x="-40" y="330" width="1080" height="80" fill="#4a5450" />
        <TreeLine seed={131} x0={240} x1={1020} y={344} n={46} h={[14, 26]} kinds={["conifer"]} colors={["#2e3a34", "#34403a"]} light={-1} jitter={10} snow="#e8eef0" />
        <TreeLine seed={133} x0={240} x1={1020} y={384} n={34} h={[22, 38]} kinds={["conifer"]} colors={["#26322c", "#2c3832"]} light={-1} jitter={12} snow="#e8eef0" />
        <Haze id="mo-h1" y0={300} y1={390} color="#d6dccc" opacity={0.4} />
        {/* alpage pierreux qui descend vers le camp */}
        <Ridge id="mo-r2" seed={137} y={448} amp={70} rough={0.5} fill="#6e7058" lit="#8c8c6a" light={-1} />
        <Speckle seed={73} x0={240} x1={1000} y0={392} y1={446} n={160} colors={["#4a4c3a", "#a8a48a", "#5a5a48"]} opacity={0.45} />
        {[[420, 404], [560, 420], [700, 398], [830, 414], [940, 400]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={30 + (i % 2) * 14} ry="5" fill="#eef2f4" opacity="0.75" />)}
      </PLayer>

      {/* ═══ la paroi de la montagne + l'entrée de mine ═══ */}
      <PLayer depth={2}>
        <path d="M-40 560 L-40 186 L40 176 L84 188 L122 180 L168 206 L196 236 L222 252 L236 290 L262 318 L256 352 L276 392 L262 430 L284 470 L272 520 L280 560 Z" fill="url(#mo-rock)" />
        <path d="M-40 560 L-40 186 L40 176 L84 188 L122 180 L168 206 L196 236 L222 252 L236 290 L262 318 L256 352 L276 392 L262 430 L284 470 L272 520 L280 560 Z" fill="#241c14" opacity="0.28" filter="url(#mo-mottle)" />
        {/* strates de la roche */}
        <path d="M20 260 Q120 250 200 300 M10 360 Q110 350 210 400 M14 460 Q90 456 180 500" stroke="#3a342c" strokeWidth="2" fill="none" opacity="0.4" />
        {/* neige accrochée aux corniches */}
        <path d="M-40 186 L40 176 L84 188 L122 180 L168 206 L196 236 L222 252 L170 238 L120 226 L70 230 L20 222 L-40 226 Z" fill="url(#mo-snow)" opacity="0.8" />
        <path d="M168 206 L196 236 L222 252 L236 290 L262 318 L256 352 L276 392" stroke="#c8c0b4" strokeWidth="3" fill="none" opacity="0.4" strokeLinejoin="round" />
        {/* l'entrée de mine, sombre, étayée */}
        <path d="M58 432 Q54 340 122 320 Q188 336 182 432 Z" fill="#160f0a" />
        <path d="M62 432 Q60 350 122 332" stroke="#a89e90" strokeWidth="2" fill="none" opacity="0.3" />
        <rect x="56" y="352" width="8" height="82" fill="#4a3320" /><rect x="180" y="352" width="8" height="82" fill="#4a3320" />
        <path d="M54 352 L190 352 L182 340 L62 340 Z" fill="#3a2818" />
        {/* pioche appuyée à l'entrée */}
        <g transform="translate(200,410) rotate(16)"><path d="M0 0 L4 60" stroke="#5a3f24" strokeWidth="4" strokeLinecap="round" /><path d="M-16 -4 Q0 -12 16 -4" stroke="#8a8278" strokeWidth="5" fill="none" strokeLinecap="round" /></g>
      </PLayer>

      {/* ═══ le sol pierreux + les éléments ═══ */}
      <PLayer depth={3}>
        <rect y="440" width="1000" height="120" fill="url(#mo-ground)" />
        <rect y="440" width="1000" height="120" fill="#241c12" opacity="0.34" filter="url(#mo-mottle)" />
        <ellipse cx="560" cy="504" rx="430" ry="48" fill="#1c160e" opacity="0.3" />
        <Speckle seed={71} x0={260} x1={1000} y0={446} y1={560} n={260} colors={["#2e281e", "#a09684", "#5a5046", "#c8c0b4"]} opacity={0.5} />
        <Rock x={960} y={470} w={110} h={46} color="#6e665c" light={-1} seed={19} />
        <Rock x={880} y={452} w={60} h={24} color="#7a7268" light={-1} seed={21} />
        {/* plaques de neige au sol */}
        {[[360, 520], [640, 532], [900, 512]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="46" ry="10" fill="#e8eef2" opacity="0.4" filter="url(#mo-blur)" />)}
        {/* cailloux épars */}
        {[[300, 470], [440, 528], [700, 512]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="10" ry="5" fill="#5a5248" opacity="0.5" />)}

        {/* LE FILON DE CUIVRE (malachite verte dans la roche) */}
        <g transform="translate(230,470)">
          <path d="M-32 22 L-22 -20 L32 -26 L36 20 Z" fill="#5e5a52" />
          <path d="M-32 22 L-22 -20 L32 -26 L36 20 Z" fill="#2e2a22" opacity="0.3" filter="url(#mo-grain)" />
          {[[-10, -6], [6, 2], [-2, 10], [16, -10], [22, 6], [10, -14]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7.5" ry="5.5" fill="#3a8a5a" opacity="0.9" />)}
          <path d="M-8 -4 q6 -4 12 0 M-4 6 q5 -3 10 -1 M8 -10 q5 -2 9 2" stroke="#6ed89a" strokeWidth="2" fill="none" opacity="0.85" />
          <path d="M-20 -18 L30 -24" stroke="#8a867c" strokeWidth="1.4" opacity="0.5" />
        </g>

        {/* L'ENCLUME (pierre à marteler) */}
        <g transform="translate(384,506)">
          <ellipse cx="0" cy="12" rx="32" ry="9" fill="#1c160e" opacity="0.5" />
          <path d="M-27 8 Q-31 -9 -12 -13 L17 -13 Q31 -11 29 6 Q27 13 12 13 L-15 13 Q-27 13 -27 8 Z" fill="#948b80" />
          <path d="M-27 8 Q-31 -9 -12 -13 L17 -13 Q31 -11 29 6 Q27 13 12 13 L-15 13 Q-27 13 -27 8 Z" fill="#3a342c" opacity="0.25" filter="url(#mo-grain)" />
          <ellipse cx="4" cy="-8" rx="11" ry="6" fill="#b0a89c" />
          {/* traces de martelage + éclats de cuivre */}
          <path d="M-6 -8 l3 3 M2 -9 l3 3 M10 -7 l3 3" stroke="#5a544a" strokeWidth="1.4" />
          <circle cx="-2" cy="-9" r="1.6" fill="#c87838" /><circle cx="8" cy="-10" r="1.4" fill="#e09050" />
        </g>

        {/* LE FEU + le gigot qui rôtit */}
        <g transform="translate(760,486)">
          <ellipse cx="0" cy="32" rx="76" ry="22" fill="url(#mo-fire)" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
          {/* pierres du foyer */}
          {[-34, -12, 12, 34].map((x, i) => <ellipse key={i} cx={x} cy="30" rx="10" ry="6" fill="#4a443a" />)}
          <path d="M-46 30 l-4 -32 M-50 -2 l8 6 M-50 -2 l0 -8 M46 30 l4 -32 M50 -2 l-8 6 M50 -2 l0 -8" stroke="#4a3018" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M-54 -4 L54 -4" stroke="#8a8c92" strokeWidth="2.6" />
          {/* le gigot */}
          <path d="M-22 -4 Q-26 -16 -8 -18 Q16 -20 22 -6 Q26 4 14 8 Q-8 12 -22 -4 Z" fill="#9a4630" />
          <path d="M-22 -4 Q-26 -16 -8 -18 Q16 -20 22 -6 Q26 4 14 8 Q-8 12 -22 -4 Z" fill="#5a241a" opacity="0.35" filter="url(#mo-grain)" />
          <path d="M-8 -14 q10 -2 18 4" stroke="#c87050" strokeWidth="1.8" fill="none" opacity="0.6" />
          <path d="M-14 -2 q12 6 26 0" stroke="#6a2c1c" strokeWidth="1.4" fill="none" opacity="0.6" />
          {/* l'os qui sort du gigot */}
          <path d="M16 -6 L52 -10" stroke="#e8e0cc" strokeWidth="6" strokeLinecap="round" />
          <circle cx="54" cy="-10" r="4.5" fill="#efe6d2" /><circle cx="52" cy="-6" r="3.5" fill="#efe6d2" />
          {/* graisse qui goutte / étincelles */}
          <circle cx="0" cy="18" r="1.6" fill="#ffd36a" style={{ animation: "glow 1.4s ease-in-out infinite" }} />
          {/* flammes */}
          <g style={{ transformOrigin: "0px 26px", transformBox: "view-box", animation: "flick 0.9s ease-in-out infinite" }}>
            <path d="M0 28 Q-17 8 -4 -18 Q0 -4 5 -14 Q17 6 8 26 Z" fill="#ff7f24" />
            <path d="M0 26 Q-8 10 -2 -8 Q1 0 3 -6 Q10 6 3 24 Z" fill="#ffd36a" />
            <path d="M0 22 Q-3 12 0 0 Q3 12 0 22 Z" fill="#fff2c4" />
          </g>
          {/* fumée qui monte */}
          <ellipse cx="4" cy="-44" rx="12" ry="20" fill="#d8dee2" opacity="0.24" filter="url(#mo-blur)" style={{ animation: "drift 4s ease-in-out infinite" }} />
        </g>

        {/* ÖTZI, accroupi, emmitouflé, sa hache de cuivre */}
        <g transform="translate(540,486)">
          <ellipse cx="0" cy="24" rx="22" ry="6" fill="#1c160e" opacity="0.5" />
          <Figure x={0} y={24} s={0.53} pose="ground" skin="#bf9068" hair="#3a2a1a" mood="vexe" hood hoodColor="#6a5238" wrinkles
            garment="fur" coat="#7a5e40" pants="#5a4630" arms={[{ a1: 14, a2: -12 }, { a1: 20, a2: -10 }]} />
          {/* haleine dans le froid */}
          <ellipse cx="12" cy="-13" rx="9" ry="4" fill="#f0f4f8" opacity="0.5" style={{ animation: "drift 3.5s ease-in-out infinite" }} />
          {/* mollet découvert, jambière retroussée (là se posent les tatouages) */}
          <ellipse cx="-12.5" cy="17" rx="6" ry="3.4" fill="#bf9068" stroke="#8a6040" strokeWidth="0.6" />
          {soigne && (
            <g stroke="#20202a" strokeWidth="1.1" strokeLinecap="round" style={{ animation: "fadein 1s ease-out" }}>
              <path d="M-16 15.4 v3.2 M-14 15 v3.6 M-12 15 v3.6" />
              <path d="M-9.6 15.4 l2.4 2.6 M-7.2 15.4 l-2.4 2.6" />
            </g>
          )}
          {/* la hache de cuivre posée à côté */}
          <g transform="translate(20,20) rotate(20)">
            <path d="M-14 0 L10 -3" stroke="#6e4c2e" strokeWidth="4" strokeLinecap="round" />
            <path d="M8 -8 L18 -4 L14 4 L6 0 Z" fill="#c87838" /><path d="M9 -6 L16 -3" stroke="#e8a060" strokeWidth="1.2" />
          </g>
        </g>
        {queteQui === "otzi" && (
          <g transform="translate(522,388)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}

        {/* le bol d'argile d'Ötzi, posé au sol à côté de lui */}
        <g transform="translate(588,514)">
          <ellipse cx="0" cy="9" rx="16" ry="4" fill="#1c160e" opacity="0.4" />
          <path d="M-12 -4 Q-13 9 0 10 Q13 9 12 -4 Z" fill="#8a6a4a" />
          <ellipse cx="0" cy="-4" rx="11" ry="4" fill="#5a4636" />
          <path d="M-9 -4 q9 4 18 0" stroke="#6e5238" strokeWidth="1.2" fill="none" opacity="0.6" />
          <ellipse cx="-3" cy="-5" rx="3" ry="1.4" fill="#a88a68" opacity="0.4" />
        </g>
      </PLayer>

      {/* voile de froid global */}
      <rect width="1000" height="560" fill="#12181c" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables — Ötzi + objets/supports */}
      <Hotspot cx={540} cy={464} r={40} label="Ötzi, le mineur" reveal={reveal} onClick={(p) => action("otzi", p)} />
      <Hotspot cx={230} cy={468} r={44} label="filon de cuivre" item="minerai" reveal={reveal} onClick={() => collect("minerai")} />
      <Hotspot cx={384} cy={498} r={38} label="pierre à marteler" item="pierre_marteler" reveal={reveal} onClick={() => collect("pierre_marteler")} />
      <Hotspot cx={760} cy={484} r={50} label="le feu" item="feu" reveal={reveal} onClick={() => collect("feu")} />
      <Hotspot cx={588} cy={510} r={24} label="bol d'argile" item="bol" reveal={reveal} onClick={() => collect("bol")} />
      <Hotspot cx={814} cy={478} r={24} label="os (le gigot)" item="os" reveal={reveal} onClick={() => collect("os")} />
      {/* OURS qu'on apercoit tres brievement dans la grotte de la mine :
          sort la tete du BAS de l'entree, jette un oeil, disparait.
          On assombrit un peu la zone autour pour renforcer l'effet
          "ombre de la grotte". */}
      <g>
        {/* alternance visible/invisible : sortie plus tot (a 15% du cycle
            au lieu de 60%) pour ne pas la rater. */}
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.12;0.14;0.28;0.3;1" dur="20s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,0; 0,0; 3,0; 0,0; 0,0" keyTimes="0;0.12;0.14;0.22;0.3;1" dur="20s" repeatCount="indefinite" />
        {/* ombre plus sombre qui remplit le bas de l'entree quand l'ours
            est la (grotte noircie autour de lui) */}
        <path d="M58 432 Q54 380 122 380 Q188 380 182 432 Z" fill="#000" opacity="0.55" />
        <g transform="translate(122,410)">
          {/* tete d'ours qui depasse au bas de l'entree */}
          <ellipse cx="0" cy="0" rx="18" ry="14" fill="#2a1408" stroke="#0a0402" strokeWidth="0.8" />
          {/* oreilles rondes */}
          <circle cx="-13" cy="-11" r="5" fill="#2a1408" stroke="#0a0402" strokeWidth="0.6" />
          <circle cx="13" cy="-11" r="5" fill="#2a1408" stroke="#0a0402" strokeWidth="0.6" />
          <circle cx="-13" cy="-11" r="2.5" fill="#4a2418" />
          <circle cx="13" cy="-11" r="2.5" fill="#4a2418" />
          {/* yeux qui luisent legerement dans la penombre */}
          <circle cx="-6" cy="-2" r="1.5" fill="#0a0402" />
          <circle cx="6" cy="-2" r="1.5" fill="#0a0402" />
          <circle cx="-5.5" cy="-2.5" r="0.7" fill="#ffd166" opacity="0.8" />
          <circle cx="6.5" cy="-2.5" r="0.7" fill="#ffd166" opacity="0.8" />
          {/* museau */}
          <ellipse cx="0" cy="6" rx="7" ry="5" fill="#4a2418" />
          <ellipse cx="0" cy="4" rx="3" ry="2" fill="#0a0402" />
          <path d="M-3 9 q3 2 6 0" stroke="#0a0402" strokeWidth="0.7" fill="none" />
        </g>
      </g>
      {/* LUCIOLE qui danse autour du feu — point jaune-vert qui pulse */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="720,471; 740,446; 780,451; 800,476; 780,491; 740,486; 720,471"
          dur="12s" repeatCount="indefinite" />
        <circle r="4" fill="#eeff88" opacity="0.35">
          <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle r="1.4" fill="#fffca8">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>
</svg>
  );
}
