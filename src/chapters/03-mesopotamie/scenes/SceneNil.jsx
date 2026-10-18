import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 3 — Tableau 2 : les bords du Nil (Égypte)
   Peinture fine — lumière chaude, le fleuve, une felouque, une
   palmeraie, un pylône couvert de hiéroglyphes. La QUÊTE : le
   pharaon Snéfrou veut son NOM pour l'éternité → fabriquer papyrus
   (couteau + tiges), calame (couteau + roseau), encre (bol au feu
   → suie + sève d'acacia), puis écrire son cartouche (mini-jeu).
   ============================================================ */

export default function SceneNil({ collect, action, reveal, made = [], queteQui }) {
  const ecrit = made.includes("msg_hieroglyphes");
  const seve = made.includes("seve");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="nl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f6a94" /><stop offset="45%" stopColor="#8fb0c4" /><stop offset="76%" stopColor="#e2c084" /><stop offset="100%" stopColor="#f4dca0" />
        </linearGradient>
        <radialGradient id="nl-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff4d0" /><stop offset="50%" stopColor="#ffe09a" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffe09a" stopOpacity="0" /></radialGradient>
        <linearGradient id="nl-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a9c4c0" /><stop offset="45%" stopColor="#6a98a0" /><stop offset="100%" stopColor="#41707a" /></linearGradient>
        <linearGradient id="nl-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8b878" /><stop offset="100%" stopColor="#9a7642" /></linearGradient>
        <linearGradient id="nl-temple" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8b47e" /><stop offset="100%" stopColor="#a67c46" /></linearGradient>
        <linearGradient id="nl-nemes" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8c04a" /><stop offset="100%" stopColor="#c89a2a" /></linearGradient>
        <filter id="nl-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="nl-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ═══ ciel d'Égypte ═══ */}
      <rect width="1000" height="560" fill="url(#nl-sky)" />
      <circle cx="240" cy="150" r="150" fill="url(#nl-sun)" />
      <circle cx="240" cy="150" r="42" fill="#fff4d0" opacity="0.95" />
      {/* (2 oiseaux statiques du decor retires — remplaces par le vol
          anime plus bas et le crocodile sur le Nil) */}

      {/* ═══ couche lointaine : rive d'en face + pylône à hiéroglyphes ═══ */}
      <PLayer depth={1}>
        <path d="M0 300 Q250 290 500 298 Q750 306 1000 296 L1000 372 L0 372 Z" fill="#c69a5e" />
        <g transform="translate(800,300)">
          <path d="M-90 0 L-78 -110 L-40 -118 L-40 0 Z" fill="url(#nl-temple)" />
          <path d="M90 0 L78 -110 L40 -118 L40 0 Z" fill="url(#nl-temple)" />
          <rect x="-40" y="-96" width="80" height="96" fill="#8a6238" />
          {[-84, -66, -48, -30].map((y, i) => (
            <text key={i} x="-64" y={y} fontSize="10" fill="#5c3f22" opacity="0.55" fontFamily="ui-monospace,monospace">𓂀𓁶𓆓</text>
          ))}
          <path d="M-40 -18 L40 -18 L34 0 L-34 0 Z" fill="#241608" />
        </g>
        {[[130, 300, 1], [190, 296, 0.8], [940, 298, 0.9]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <path d="M0 0 L-3 -64 L3 -64 Z" fill="#6e4c2e" />
            <path d="M0 -64 q-32 -6 -50 14 M0 -64 q32 -6 50 14 M0 -64 q-22 -24 -36 -32 M0 -64 q22 -24 36 -32 M0 -64 q0 -28 0 -42" stroke="#4a6a30" strokeWidth="4" fill="none" />
          </g>
        ))}
      </PLayer>

      {/* ═══ couche intermédiaire : le Nil + la felouque ═══ */}
      <PLayer depth={2}>
        <rect y="322" width="1000" height="102" fill="url(#nl-water)" />
        <path d="M200 328 L280 328 L300 418 L180 418 Z" fill="#ffe09a" opacity="0.25" />
        {[338, 360, 384, 406].map((y, i) => (
          <path key={i} d={`M0 ${y} q120 ${i % 2 ? 4 : -4} 240 0 t240 0 t240 0 t240 0`} stroke="#cfe0da" strokeWidth="1.5" fill="none" opacity="0.4" />
        ))}
        <g transform="translate(520,350)">
          <path d="M-46 30 Q0 44 46 30 L38 40 Q0 50 -38 40 Z" fill="#6e4c2e" />
          <path d="M0 30 L0 -54" stroke="#5a3f24" strokeWidth="3" />
          <path d="M0 -54 L44 26 L0 26 Z" fill="#f0e6d0" />
          <path d="M0 -54 L44 26" stroke="#c9b890" strokeWidth="1.5" />
          <path d="M0 -30 L-30 26 L0 26 Z" fill="#e6dcc6" opacity="0.9" />
        </g>

        {/* CROCODILE qui flotte lentement sur le Nil — juste les yeux et
            le haut du dos qui affleurent, sillage discret derriere lui. */}
        <g opacity="0.85">
          <animateTransform attributeName="transform" type="translate"
            values="1050,0; -80,4; 1050,0" dur="40s" repeatCount="indefinite" />
          {/* sillage en V */}
          <path d="M40 396 q-20 -2 -30 -6 M40 396 q-20 -2 -30 6" stroke="#cfe0da" strokeWidth="1" fill="none" opacity="0.55" />
          {/* corps qui affleure */}
          <ellipse cx="0" cy="395" rx="30" ry="3" fill="#4a5a2a" />
          <ellipse cx="0" cy="394" rx="30" ry="2" fill="#5a6a30" />
          {/* dos ecailleux (petits triangles) */}
          <path d="M-22 393 l2 -3 l2 3 M-14 392 l2 -3 l2 3 M-6 392 l2 -3 l2 3 M2 392 l2 -3 l2 3 M10 393 l2 -3 l2 3" stroke="#3a4a20" strokeWidth="0.6" fill="#3a4a20" />
          {/* museau qui depasse */}
          <ellipse cx="24" cy="394" rx="6" ry="1.5" fill="#4a5a2a" />
          {/* yeux vigilants au ras de l'eau */}
          <circle cx="20" cy="392.5" r="0.9" fill="#0a0604" />
          <circle cx="18" cy="392.5" r="0.9" fill="#0a0604" />
          <circle cx="20" cy="392.2" r="0.35" fill="#ffd166" opacity="0.7" />
          <circle cx="18" cy="392.2" r="0.35" fill="#ffd166" opacity="0.7" />
        </g>
      </PLayer>

      {/* ═══ premier plan : berge, acacia, atelier, Snéfrou ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 418 Q250 402 520 424 Q760 442 1000 416 L1000 560 Z" fill="url(#nl-sand)" />
        <path d="M0 560 L0 418 Q250 402 520 424 Q760 442 1000 416 L1000 560 Z" fill="#3c2c18" opacity="0.28" filter="url(#nl-grain)" />
        <ellipse cx="500" cy="502" rx="440" ry="52" fill="#8a6c40" opacity="0.3" />

        {/* L'ACACIA du désert (support) : canopée plate, tronc, entaille à sève */}
        <g transform="translate(70,432)">
          <path d="M0 8 L-4 -40 M0 8 L4 -40" stroke="#6a4a2c" strokeWidth="7" strokeLinecap="round" />
          <path d="M0 -40 l-14 -6 M0 -40 l14 -6 M-6 -30 l-16 -3 M6 -30 l16 -3" stroke="#6a4a2c" strokeWidth="3" />
          <path d="M-46 -46 Q-30 -66 0 -62 Q30 -66 46 -46 Q30 -40 0 -42 Q-30 -40 -46 -46 Z" fill="#5c7a34" />
          <path d="M-46 -46 Q0 -56 46 -46" stroke="#4a6a2a" strokeWidth="2" fill="none" opacity="0.5" />
          {/* l'entaille + gouttes de sève ambrée (visibles une fois récoltée) */}
          <path d="M-3 -18 l6 4" stroke="#3a2412" strokeWidth="2" />
          {seve && <g style={{ animation: "fadein 1s ease-out" }}><circle cx="2" cy="-10" r="2.6" fill="#e0a83a" /><circle cx="3" cy="-2" r="2" fill="#e0a83a" opacity="0.8" /></g>}
        </g>

        {/* massif de PAPYRUS (tiges à ombelles), poussant DANS le Nil */}
        <g transform="translate(150,392)">
          {[[-26, 0, 1], [-10, 6, 1.1], [8, -2, 0.95], [24, 8, 1.05], [0, 10, 0.9]].map(([dx, dy, s], i) => (
            <g key={i} transform={`translate(${dx},${dy}) scale(${s})`}>
              <path d={`M0 40 q${i % 2 ? 4 : -4} -40 0 -78`} stroke="#5c7a30" strokeWidth="4" fill="none" style={{ animation: `sway ${3 + i * 0.5}s ease-in-out infinite`, transformOrigin: "0px 40px", transformBox: "view-box" }} />
              <g style={{ animation: `sway ${3 + i * 0.5}s ease-in-out infinite`, transformOrigin: "0px 40px", transformBox: "view-box" }}>
                {[0, 40, 80, 120, 160].map((a) => <path key={a} d={`M0 -78 l${Math.cos(a * Math.PI / 180) * 16} ${-Math.sin(a * Math.PI / 180) * 16 - 4}`} stroke="#6a8a3a" strokeWidth="1.6" />)}
              </g>
            </g>
          ))}
        </g>

        {/* touffe de ROSEAUX à MASSETTES (quenouilles) — bien identifiables :
            grande tige + épi brun en forme de saucisse + pointe. Poussent
            DANS le Nil, à l'écart du papyrus. */}
        <g transform="translate(345,398)">
          {/* reflet dans l'eau */}
          <ellipse cx="0" cy="10" rx="22" ry="5" fill="#3a5a5a" opacity="0.3" />
          {/* feuilles fines rubanées à la base */}
          <path d="M-18 8 q-8 -24 -4 -46 M18 8 q8 -24 4 -46 M-8 8 q-4 -20 -1 -40" stroke="#6a8a3a" strokeWidth="2.4" fill="none" opacity="0.85" />
          {[-16, -5, 6, 16].map((x, i) => (
            <g key={i} style={{ animation: `sway ${3 + i * 0.4}s ease-in-out infinite`, transformOrigin: `${345 + x}px 408px`, transformBox: "view-box" }}>
              <path d={`M${x} 10 L${x} ${-50 + (i % 2) * 6}`} stroke="#6a8a3a" strokeWidth="3.4" strokeLinecap="round" />
              {/* la massette brune (l'épi) */}
              <rect x={x - 4} y={-48 + (i % 2) * 6} width="8" height="18" rx="4" fill="#8a5a2e" />
              <rect x={x - 4} y={-48 + (i % 2) * 6} width="8" height="18" rx="4" fill="#5a3418" opacity="0.35" />
              {/* la petite pointe verte au-dessus */}
              <path d={`M${x} ${-48 + (i % 2) * 6} l0 -12`} stroke="#7a9a3e" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* la PIERRE À PRESSER (support) : dalle plate + lamelles croisées dessus */}
        <g transform="translate(250,472)">
          <ellipse cx="0" cy="14" rx="34" ry="8" fill="#241608" opacity="0.35" />
          <path d="M-30 10 Q-34 -2 -14 -6 L18 -6 Q34 -4 32 8 Q30 14 12 14 L-16 14 Q-30 14 -30 10 Z" fill="#9a938a" />
          <path d="M-30 10 Q-34 -2 -14 -6 L18 -6 Q34 -4 32 8 Q30 14 12 14 L-16 14 Q-30 14 -30 10 Z" fill="#3a342c" opacity="0.2" filter="url(#nl-grain)" />
          <ellipse cx="2" cy="-4" rx="20" ry="6" fill="#b0a89c" />
          <g stroke="#9aaa4a" strokeWidth="2" opacity="0.7">
            <path d="M-12 -4 h26 M-12 -1 h26 M-6 -7 v12 M2 -7 v12 M10 -7 v12" />
          </g>
        </g>

        {/* L'ATELIER : une natte avec le COUTEAU et le BOL */}
        <g transform="translate(460,514)">
          <ellipse cx="0" cy="8" rx="76" ry="14" fill="#c2a066" />
          <ellipse cx="0" cy="8" rx="76" ry="14" fill="#6e5228" opacity="0.28" filter="url(#nl-grain)" />
          {/* le couteau */}
          <g transform="translate(-30,2) rotate(-8)">
            <rect x="-16" y="-3" width="16" height="6" rx="2" fill="#6e4c2e" />
            <path d="M0 -4 L20 -1 L20 3 L0 4 Z" fill="#c8c0b4" stroke="#8a8478" strokeWidth="0.8" />
          </g>
          {/* le bol de terre */}
          <g transform="translate(36,2)">
            <path d="M-14 -3 Q-15 9 0 10 Q15 9 14 -3 Z" fill="#a87c50" />
            <ellipse cx="0" cy="-3" rx="14" ry="4.5" fill="#7a5636" />
            <ellipse cx="0" cy="-3" rx="9" ry="2.6" fill="#5a4030" />
          </g>
        </g>

        {/* LE FEU (support) : petit foyer pour noircir le bol */}
        <g transform="translate(575,502)">
          <ellipse cx="0" cy="10" rx="34" ry="9" fill="url(#nl-sun)" opacity="0.5" style={{ animation: "glow 2.6s ease-in-out infinite" }} />
          {[-16, -6, 6, 16].map((x, i) => <ellipse key={i} cx={x} cy="8" rx="7" ry="4" fill="#4a3a2a" />)}
          <g style={{ transformOrigin: "0px 6px", transformBox: "view-box", animation: "flick 2.8s ease-in-out infinite" }}>
            <path d="M0 8 Q-12 -6 -3 -22 Q0 -10 4 -18 Q12 -2 6 8 Z" fill="#ff8a3c" />
            <path d="M0 6 Q-6 -4 -1 -14 Q1 -6 3 -12 Q8 -2 3 6 Z" fill="#ffd36a" />
          </g>
        </g>

        {/* LE PHARAON SNÉFROU (droite) : némès rayé, pagne blanc, sceptre */}
        <g transform="translate(730,472)">
          <ellipse cx="0" cy="30" rx="24" ry="7" fill="#241608" opacity="0.45" />
          <Figure x={0} y={30} s={0.57} skin="#c48c52" hair="#1a1008" look="bald" beard="postiche" kohl hat="nemes" hatColor="#e8c040" hatColor2="#2a50a0"
            garment="kilt" coat="#eee6d2" trim="#c89a2a" pants="#c48c52" shoes="#8a6a3a"
            arms={[{ a1: 12, a2: -10 }, { a1: 75, a2: 60 }]}
            behind={<g>
              {/* le sceptre, tenu de la main gauche */}
              <path d="M-18 -104 L-23 -1" stroke="#6e4c2e" strokeWidth="5" strokeLinecap="round" />
              <path d="M-18 -106 q-8 -3 -8 -13 q8 3 8 13 M-18 -106 q8 -3 8 -13 q-8 3 -8 13" fill="#c89a2a" />
            </g>}>
            {/* large collier ousekh */}
            <path d="M-12 -87 Q0 -76 12 -87" stroke="#c89a2a" strokeWidth="5" fill="none" />
            <path d="M-11 -82 Q0 -72 11 -82" stroke="#2f6a9a" strokeWidth="2.6" fill="none" opacity="0.85" />
          </Figure>
        </g>
        {queteQui === "snefrou" && (
          <g transform="translate(712,378)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}

        {/* herbes de berge */}
        <g opacity="0.9">
          <path d="M-4 560 q10 -28 4 -44 M18 560 q3 -22 14 -36 M960 560 q-6 -22 2 -36 M984 560 q4 -18 12 -28" stroke="#3a4a1c" strokeWidth="4" fill="none" />
        </g>

        {/* RÉSULTAT (msg_hieroglyphes) : le papyrus couvert de hiéroglyphes,
            le cartouche de Snéfrou bien visible */}
        {ecrit && (
          <g transform="translate(650,510)" style={{ animation: "fadein 1s ease-out" }}>
            <ellipse cx="0" cy="24" rx="44" ry="8" fill="#20140a" opacity="0.4" />
            <path d="M-40 -22 Q-46 -1 -40 20 L40 20 Q46 -1 40 -22 Z" fill="#e6d09a" />
            <path d="M-40 -22 Q-46 -1 -40 20" stroke="#c8a860" strokeWidth="4" fill="none" />
            <path d="M40 -22 Q46 -1 40 20" stroke="#c8a860" strokeWidth="4" fill="none" />
            {/* le cartouche royal (cadre ovale + nom) */}
            <g transform="translate(-22,-1)">
              <rect x="-11" y="-16" width="22" height="34" rx="11" fill="none" stroke="#3a2a14" strokeWidth="2" />
              <path d="M-6 18 h12" stroke="#3a2a14" strokeWidth="2.4" />
              <g stroke="#3a2a14" strokeWidth="1.3" fill="none" strokeLinecap="round">
                <path d="M-5 -12 q5 -3 10 0" /><path d="M-5 -6 q5 -3 10 0 M-5 -4 q5 -3 10 0" /><circle cx="0" cy="2" r="2.2" /><path d="M-4 10 q4 -3 8 0" />
              </g>
            </g>
            {/* colonnes de hiéroglyphes à droite */}
            <g stroke="#3a2a14" strokeWidth="1.4" fill="none" strokeLinecap="round">
              <path d="M6 -12 q4 -3 8 0 q-4 3 -8 0" /><path d="M22 -13 v6 l-3 3" /><path d="M8 0 h7 v-5" /><circle cx="24" cy="0" r="3" />
              <path d="M6 12 q4 -4 8 0 q-4 4 -8 0" /><path d="M22 10 v-8 l3 -2" />
            </g>
          </g>
        )}
      </PLayer>

      {/* voile de grain global */}
      <rect width="1000" height="560" fill="#2a1c10" opacity="0.07" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={730} cy={444} r={40} label="le pharaon Snéfrou" reveal={reveal} onClick={(p) => action("snefrou", p)} />
      {/* objets & supports (le cartouche se lance en posant le calame encré sur la feuille) */}
      <Hotspot cx={150} cy={372} r={50} label="tiges de papyrus" item="papyrus_tiges" reveal={reveal} onClick={() => collect("papyrus_tiges")} />
      <Hotspot cx={345} cy={372} r={34} label="roseaux du Nil (à massettes)" item="roseau_nil" reveal={reveal} onClick={() => collect("roseau_nil")} />
      <Hotspot cx={250} cy={464} r={34} label="pierre à presser" item="pierre" reveal={reveal} onClick={() => collect("pierre")} />
      <Hotspot cx={70} cy={410} r={46} label="l'acacia (sa sève)" item="acacia" reveal={reveal} onClick={() => collect("acacia")} />
      <Hotspot cx={430} cy={514} r={28} label="couteau" item="couteau" reveal={reveal} onClick={() => collect("couteau")} />
      <Hotspot cx={496} cy={516} r={26} label="bol de terre" item="bol" reveal={reveal} onClick={() => collect("bol")} />
      <Hotspot cx={575} cy={500} r={38} label="le feu" item="feu" reveal={reveal} onClick={() => collect("feu")} />
        {/* (oiseaux du Nil retires : la vie du tableau tient au crocodile,
          a la felouque, aux libellules et a la luciole au feu) */}
      {/* LUCIOLE qui danse autour du feu — point jaune-vert qui pulse */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="535,487; 555,462; 595,467; 615,492; 595,507; 555,502; 535,487"
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
