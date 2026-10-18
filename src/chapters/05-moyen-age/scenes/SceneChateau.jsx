import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 5 — Tableau 1 : la salle du trône de Charles Bannister
   Peinture fine — un grand hall médiéval : le seigneur trône sur
   une estrade, deux gardes en armes l'encadrent, des armures et
   des tableaux décorent les murs. Derrière lui, un grand PAN DE
   MUR tendu d'une TOILE VIDE, prête à recevoir le récit de ses
   exploits (façon broderie de Bayeux). Devant le trône, un paysan
   supplie qu'on soigne son fils ; le prêtre renvoie au monastère.
   À trouver : la toile de lin (au mur) et le fil de laine coloré.
   ============================================================ */

export default function SceneChateau({ collect, action, reveal, made = [], flags = {}, queteQui }) {
  const brode = made.includes("msg_broderie");
  /* mode LIVRAISON (2e visite) : on a payé le traité et on doit le remettre.
     Le prêtre et le paysan deviennent des cibles où déposer le livre. */
  const livraison = flags.paye && !made.includes("remis");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cs-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a7c66" /><stop offset="100%" stopColor="#5a4e3c" /></linearGradient>
        <linearGradient id="cs-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7a5636" /><stop offset="100%" stopColor="#4a3320" /></linearGradient>
        <linearGradient id="cs-throne" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e6c25a" /><stop offset="100%" stopColor="#a8801f" /></linearGradient>
        <linearGradient id="cs-drape" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9a2530" /><stop offset="100%" stopColor="#611420" /></linearGradient>
        <linearGradient id="cs-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8d8e0" /><stop offset="100%" stopColor="#e8dcb0" /></linearGradient>
        <filter id="cs-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ mur de pierre du grand hall ═══ */}
      <rect width="1000" height="560" fill="url(#cs-wall)" />
      <rect width="1000" height="560" fill="#2a2015" opacity="0.28" filter="url(#cs-grain)" />
      {/* joints de pierre */}
      <g stroke="#3a3022" strokeWidth="1.4" opacity="0.4">
        <path d="M0 90 h1000 M0 170 h1000 M0 250 h1000" />
        <path d="M80 10 v80 M240 10 v80 M400 10 v80 M560 10 v80 M720 10 v80 M880 10 v80" />
        <path d="M160 90 v80 M320 90 v80 M480 90 v80 M640 90 v80 M800 90 v80" />
      </g>

      {/* ═══ couche lointaine : fenêtres, bannières, tableaux, tapisserie ═══ */}
      <PLayer depth={1}>
        {/* deux hautes fenêtres en ogive laissant entrer le jour */}
        {[130, 870].map((x, i) => (
          <g key={i} transform={`translate(${x},40)`}>
            <path d="M-30 200 L-30 30 Q0 -14 30 30 L30 200 Z" fill="url(#cs-win)" />
            <path d="M-30 200 L-30 30 Q0 -14 30 30 L30 200 Z" fill="none" stroke="#3a3022" strokeWidth="7" />
            <path d="M0 200 V6 M-30 96 H30 M-30 150 H30" stroke="#3a3022" strokeWidth="3" />
          </g>
        ))}

        {/* bannières rouges à lion d'or, de part et d'autre de la tapisserie */}
        {[300, 700].map((x, i) => (
          <g key={i} transform={`translate(${x},44)`}>
            <path d="M-22 0 L22 0 L22 150 L0 132 L-22 150 Z" fill="url(#cs-drape)" />
            <path d="M-22 0 L22 0 L22 150 L0 132 L-22 150 Z" fill="none" stroke="#e6c25a" strokeWidth="2" />
            <path d="M0 40 q10 -10 10 8 q0 14 -10 18 q-10 -4 -10 -18 q0 -18 10 -8" fill="#e6c25a" />
            <circle cx="0" cy="62" r="3" fill="#611420" />
          </g>
        ))}

        {/* deux tableaux (portraits d'ancêtres) accrochés au mur */}
        {[[120, 300], [880, 300]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-40" y="-52" width="80" height="104" rx="2" fill="#3a2c1c" />
            <rect x="-33" y="-45" width="66" height="90" fill="#6a6250" />
            {/* silhouette de portrait */}
            <circle cx="0" cy="-14" r="16" fill="#8a7a60" />
            <path d="M-24 45 Q-26 6 0 -2 Q26 6 24 45 Z" fill="#4a3f5a" />
            <rect x="-40" y="-52" width="80" height="104" rx="2" fill="none" stroke="#e6c25a" strokeWidth="2" opacity="0.6" />
          </g>
        ))}

        {/* ═══ LE GRAND PAN DE MUR : la tapisserie ═══ */}
        <g transform="translate(500,150)">
          {/* cadre de bois */}
          <rect x="-160" y="-96" width="320" height="196" rx="3" fill="#5a3f24" />
          <rect x="-160" y="-96" width="320" height="196" rx="3" fill="none" stroke="#3a2814" strokeWidth="3" />
          {!brode ? (
            /* TOILE VIDE, écrue, à peine tramée — elle attend le récit */
            <>
              <rect x="-150" y="-86" width="300" height="176" fill="#e6dcc4" />
              <rect x="-150" y="-86" width="300" height="176" fill="#8a7a56" opacity="0.12" filter="url(#cs-grain)" />
              <g stroke="#c9b892" strokeWidth="1" opacity="0.5">
                {[-60, -20, 20, 60].map((y, i) => <path key={i} d={`M-150 ${y} h300`} />)}
              </g>
              <text x="0" y="6" textAnchor="middle" fontSize="15" fill="#9a8a66" fontFamily="Palatino, Georgia, serif" fontStyle="italic">(toile vide — à broder)</text>
            </>
          ) : (
            /* LA BRODERIE DES EXPLOITS (résultat msg_broderie) : bande façon
               Bayeux — cavaliers, soldats, bateaux, bordures narratives. */
            <g style={{ animation: "fadein 1.1s ease-out" }}>
              <rect x="-150" y="-86" width="300" height="176" fill="#efe6cc" />
              {/* deux bordures décoratives haut/bas */}
              {[-78, 82].map((y, i) => (
                <g key={i}>
                  <path d={`M-150 ${y} h300`} stroke="#a8302a" strokeWidth="1.6" />
                  {[...Array(15)].map((_, k) => <path key={k} d={`M${-146 + k * 20} ${y - 5} l5 10 l5 -10`} stroke="#2a6a9a" strokeWidth="1.2" fill="none" />)}
                </g>
              ))}
              {/* rangée du haut : cavaliers */}
              {[-120, -72, -24, 24, 72, 120].map((x, i) => (
                <g key={i} transform={`translate(${x},-40)`}>
                  <path d="M-12 6 q4 -6 12 -6 q4 -4 8 0 l-2 6 Z" fill={["#a8302a", "#c89030", "#2a6a9a"][i % 3]} />
                  <path d="M-10 6 l-3 8 M8 6 l3 8 M-6 6 l0 8 M2 6 l0 8" stroke="#5a4a2e" strokeWidth="1.4" />
                  <circle cx="6" cy="-4" r="3.4" fill="#c8a882" />
                  <path d="M8 -8 l8 -4" stroke="#7a6a4a" strokeWidth="1.4" />
                </g>
              ))}
              {/* légende latine brodée */}
              <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#7a3020" fontFamily="Palatino, Georgia, serif" letterSpacing="2">HIC KAROLVS DVX · FORTIS IN BELLO</text>
              {/* rangée du bas : fantassins + navire */}
              {[-120, -84, -48, -12].map((x, i) => (
                <g key={i} transform={`translate(${x},52)`}>
                  <path d="M-6 0 q6 -12 12 0 l-2 10 h-8 Z" fill={["#2a6a9a", "#a8302a"][i % 2]} />
                  <path d="M6 -6 l8 -6" stroke="#8a8c92" strokeWidth="1.6" />
                  <circle cx="0" cy="-8" r="3" fill="#c8a882" />
                </g>
              ))}
              <g transform="translate(90,52)">
                <path d="M-30 4 Q0 18 30 4 L24 -6 L-24 -6 Z" fill="#8a5a2e" />
                <path d="M0 -6 v-24 M0 -26 l22 8 l-22 6" fill="#a8302a" stroke="#5a3f24" strokeWidth="1.4" />
              </g>
            </g>
          )}
        </g>
      </PLayer>

      {/* ═══ couche intermédiaire : estrade, trône, armures, gardes ═══ */}
      <PLayer depth={2}>
        {/* tapis rouge central */}
        <path d="M430 560 L570 560 L520 300 L480 300 Z" fill="url(#cs-drape)" opacity="0.9" />
        <path d="M430 560 L570 560 L520 300 L480 300 Z" fill="none" stroke="#e6c25a" strokeWidth="2" opacity="0.5" />

        {/* estrade à deux marches */}
        <path d="M360 402 h280 v22 h-280 Z" fill="#6a4c2e" />
        <path d="M330 424 h340 v26 h-340 Z" fill="#5a3f24" />

        {/* LE TRÔNE + Charles Bannister assis */}
        <g transform="translate(500,300)">
          {/* dossier haut, doré, drapé de rouge */}
          <rect x="-46" y="0" width="92" height="110" rx="6" fill="url(#cs-throne)" />
          <rect x="-38" y="8" width="76" height="94" fill="url(#cs-drape)" />
          <path d="M-46 0 q46 -30 92 0" fill="url(#cs-throne)" />
          {[-46, 46].map((x, i) => <circle key={i} cx={x} cy="4" r="8" fill="#e6c25a" stroke="#a8801f" strokeWidth="1.4" />)}
          {/* accoudoirs */}
          <rect x="-58" y="70" width="16" height="40" rx="3" fill="url(#cs-throne)" />
          <rect x="42" y="70" width="16" height="40" rx="3" fill="url(#cs-throne)" />

          {/* CHARLES assis : robe pourpre bordée d'hermine, cercle d'or, sceptre court */}
          <Figure x={0} y={108} s={1} pose="sit" skin="#cf9f70" hair="#5a3a20" look="short" beard="short" hat="circlet"
            garment="robe" coat="#7a2a44" trim="#e6c25a" pants="#5a1a30" shoes="#3a1420"
            arms={[{ a1: 15, a2: -30 }, { a1: 15, a2: -30 }]}>
            <path d="M-20 -64 Q0 -52 20 -64" stroke="#e6c25a" strokeWidth="3" fill="none" />
            <path d="M-28 -8 Q0 0 28 -8 L28 -2 Q0 6 -28 -2 Z" fill="#efe9dc" />
            {[-20, -8, 4, 16].map((x) => <path key={x} d={`M${x} -5 v3`} stroke="#1a1414" strokeWidth="1.6" />)}
            <path d="M15 -30 v-30" stroke="#a8801f" strokeWidth="3" /><circle cx="15" cy="-62" r="4" fill="#e6c25a" />
            <circle cx="15.4" cy="-29.6" r="4.4" fill="#cf9f70" stroke="#8a6040" strokeWidth="0.6" />
          </Figure>
        </g>

        {/* deux ARMURES décoratives sur socle, contre les murs */}
        {[110, 890].map((x, i) => (
          <g key={i} transform={`translate(${x},430)`}>
            <ellipse cx="0" cy="60" rx="26" ry="7" fill="#0a0603" opacity="0.5" />
            <rect x="-18" y="42" width="36" height="10" fill="#3a3f48" />
            {/* jambières + torse + heaume */}
            <path d="M-14 42 l4 -34 h20 l4 34 Z" fill="#aeb6c2" />
            <path d="M-16 8 Q-20 -18 0 -22 Q20 -18 16 8 Z" fill="#c2cad6" />
            <path d="M-16 8 Q0 16 16 8" stroke="#8a94a2" strokeWidth="2" fill="none" />
            <circle cx="0" cy="-30" r="11" fill="#c2cad6" />
            <path d="M-11 -30 h22 M0 -41 v22" stroke="#7a8290" strokeWidth="2" />
            <path d="M-3 -34 h6 v10 h-6 Z" fill="#3a3f48" />
            {/* lance appuyée */}
            <path d="M22 -46 v96" stroke="#6a4c2e" strokeWidth="3" />
            <path d="M22 -46 l-5 12 l5 -2 l5 2 Z" fill="#c2cad6" />
          </g>
        ))}

        {/* deux GARDES en armes, encadrant l'estrade */}
        {[[398, 452, 1], [602, 452, -1]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <ellipse cx="0" cy="42" rx="20" ry="6" fill="#0a0603" opacity="0.5" />
            {/* casque à nasal, tunique aux couleurs, lance (côté extérieur), écu (côté intérieur) */}
            <Figure x={0} y={42} s={0.53} skin="#c8a882" hair="#4a3020" look="short" beard={i ? "short" : "stubble"} hat="helm"
              garment="tunic" coat="#3a5a7a" trim="#2a4460" pants="#5a5a60" shoes="#2a2a30"
              arms={s > 0 ? [{ a1: 14, a2: 30 }, { a1: 30, a2: 30 }] : [{ a1: 30, a2: 30 }, { a1: 14, a2: 30 }]}
              behind={<g>
                <path d={`M${38 * s} -150 v150`} stroke="#6a4c2e" strokeWidth="6" />
                <path d={`M${38 * s} -150 l${-9 * s} 22 l${9 * s} -4 l${9 * s} 4 Z`} fill="#c2cad6" />
              </g>}>
              <path d="M-15 -84 L15 -84 L12 -40 L-12 -40 Z" fill="#aeb6c2" opacity="0.8" />
              <g transform={`translate(${-24 * s},-50)`}>
                <path d="M-18 -24 L18 -24 L18 10 Q0 34 -18 10 Z" fill="#9a2530" stroke="#5a1018" strokeWidth="1" />
                <path d="M0 -24 v56 M-18 -6 h36" stroke="#e6c25a" strokeWidth="3" />
              </g>
            </Figure>
          </g>
        ))}
      </PLayer>

      {/* ═══ premier plan : sol, paysan suppliant, prêtre, laine, épave ═══ */}
      <PLayer depth={3}>
        <rect y="450" width="1000" height="110" fill="url(#cs-floor)" />
        <rect y="452" width="1000" height="108" fill="#2a1c10" opacity="0.32" filter="url(#cs-grain)" />
        <path d="M0 500 h1000 M240 450 v110 M500 450 v110 M760 450 v110" stroke="#2a1c10" strokeWidth="1.6" opacity="0.4" />

        {/* LE PAYSAN agenouillé, mains jointes, suppliant (devant, à gauche) */}
        <g transform="translate(348,500)">
          <ellipse cx="0" cy="30" rx="30" ry="8" fill="#0a0603" opacity="0.5" />
          {/* à genoux, penché vers le trône, mains jointes */}
          <g transform="rotate(10 0 30)">
            <Figure x={0} y={30} s={0.64} pose="kneel" facing="right" skin="#c8a882" hair="#5a4632" look="mid" beard="stubble" mood="vexe"
              garment="tunic" coat="#8a6a44" pants="#7a5a38" shoes="#3a2a18"
              arms={[{ a1: -10, a2: -145 }, { a1: -10, a2: -145 }]}>
              <path d="M-14 -40 l7 3 M10 -34 l-5 5" stroke="#5a4026" strokeWidth="2" />
            </Figure>
          </g>
        </g>

        {/* LE PRÊTRE debout, en aube sombre, tenant un livre (à droite) */}
        <g transform="translate(676,494)">
          <ellipse cx="0" cy="38" rx="22" ry="7" fill="#0a0603" opacity="0.5" />
          {/* aube sombre, étole pourpre, petit livre à deux mains */}
          <Figure x={0} y={38} s={0.6} skin="#c8a882" hair="#5a5060" look="ring" mood="vexe"
            garment="robe" coat="#2c2a34" pants="#2c2a34" shoes="#1a1820" belt={false}
            arms={[{ a1: 20, a2: -40 }, { a1: 20, a2: -40 }]}>
            <path d="M-9 -88 L-6 -10 M9 -88 L6 -10" stroke="#7a2a44" strokeWidth="5" />
            <rect x="-17" y="-60" width="34" height="24" rx="2" fill="#5a2a2e" stroke="#3a1a1e" strokeWidth="0.8" />
            <path d="M0 -60 v24" stroke="#3a1a1e" strokeWidth="2" />
            <circle cx="-14.4" cy="-50" r="4.4" fill="#c8a882" stroke="#8a6a50" strokeWidth="0.6" />
            <circle cx="14.4" cy="-50" r="4.4" fill="#c8a882" stroke="#8a6a50" strokeWidth="0.6" />
          </Figure>
        </g>

        {/* PANIER DE FIL DE LAINE coloré (à gauche, au sol) */}
        <g transform="translate(168,512)">
          <path d="M-26 -6 Q-28 14 0 16 Q28 14 26 -6 Z" fill="#8a6a42" />
          <path d="M-22 -6 q22 7 44 0" stroke="#6e5232" strokeWidth="1.6" fill="none" opacity="0.6" />
          {[["#c8382e", -14, -4], ["#2a6a9a", 2, -8], ["#e0b040", 15, -2], ["#3a8a4a", -2, 3], ["#9a2530", 12, 5]].map(([c, x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r="8" fill={c} /><path d={`M${x - 6} ${y} q6 -4 12 0`} stroke="#fff" strokeWidth="0.8" opacity="0.3" fill="none" /></g>
          ))}
        </g>

        {/* épave de MARTINE, échouée dans un coin de la cour (à droite) */}
        <g transform="translate(918,516) rotate(8)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#0a0603" opacity="0.6" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>1450</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      {/* voile global chaud */}
      <rect width="1000" height="560" fill="#1a1206" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      {/* le « ? » du seigneur (tant qu'il est le personnage de la quête) */}
      {queteQui === "charles" && (
        <>
          <g transform="translate(482,236)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
          <Hotspot cx={500} cy={330} r={52} label="parler au seigneur Bannister" reveal={reveal} onClick={() => action("charles")} />
        </>
      )}

      {/* le paysan et le prêtre : le contexte de la quête de Galien.
          Un « ? » doré apparaît sur celui dont c'est le tour dans la quête. */}
      {queteQui === "paysan" && (
        <g transform="translate(334,430)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
          <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
          <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
        </g>
      )}
      <Hotspot cx={352} cy={484} r={34} label={livraison ? "donner le traité au paysan" : "le paysan suppliant"} {...(livraison ? { item: "paysan" } : {})} reveal={reveal} onClick={() => action("paysan")} />
      {queteQui === "pretre" && (
        <g transform="translate(658,424)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
          <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
          <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
        </g>
      )}
      <Hotspot cx={676} cy={476} r={32} label={livraison ? "remettre le traité au prêtre" : "le prêtre"} {...(livraison ? { item: "pretre" } : {})} reveal={reveal} onClick={() => action("pretre")} />

      {/* la toile de lin (au mur) — seulement tant que la broderie n'est pas faite */}
      {!brode && (
        <Hotspot cx={500} cy={150} r={92} label="la toile de lin (à broder)" item="toile_lin" reveal={reveal} onClick={() => collect("toile_lin")} />
      )}
      {/* le fil de laine coloré (seulement tant que la broderie n'est pas faite) */}
      {!brode && (
        <Hotspot cx={168} cy={508} r={40} label="fil de laine coloré" item="fil_laine" reveal={reveal} onClick={() => collect("fil_laine")} />
      )}
      {/* l'épave de MARTINE */}
      <Hotspot cx={918} cy={510} r={32} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
      {/* CHAT du chateau, assis a cote des pelotes de laine, bouge
          doucement la queue et cligne des yeux. Bien de sa personne. */}
      <g transform="translate(220,510)">
        {/* corps assis */}
        <ellipse cx="0" cy="0" rx="10" ry="7" fill="#5a3820" stroke="#2a1408" strokeWidth="0.6" />
        {/* tete */}
        <circle cx="9" cy="-4" r="5.5" fill="#5a3820" stroke="#2a1408" strokeWidth="0.5" />
        {/* oreilles pointues */}
        <path d="M5 -8 l1 -5 l3 3 Z" fill="#5a3820" stroke="#2a1408" strokeWidth="0.4" />
        <path d="M13 -8 l-1 -5 l-3 3 Z" fill="#5a3820" stroke="#2a1408" strokeWidth="0.4" />
        <path d="M6 -7 l1 -3 l1.5 2 Z" fill="#c88060" opacity="0.7" />
        <path d="M12 -7 l-1 -3 l-1.5 2 Z" fill="#c88060" opacity="0.7" />
        {/* yeux qui clignent */}
        <ellipse cx="7" cy="-4" rx="1" ry="1.5" fill="#c8e070">
          <animate attributeName="ry" values="1.5;0.2;1.5;1.5;1.5" keyTimes="0;0.02;0.04;0.9;1" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="11" cy="-4" rx="1" ry="1.5" fill="#c8e070">
          <animate attributeName="ry" values="1.5;0.2;1.5;1.5;1.5" keyTimes="0;0.02;0.04;0.9;1" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="7" cy="-4" rx="0.35" ry="1.2" fill="#0a0604" />
        <ellipse cx="11" cy="-4" rx="0.35" ry="1.2" fill="#0a0604" />
        {/* nez rose + moustaches */}
        <path d="M10 -1 l-1 1 l2 0 Z" fill="#e0a0a0" />
        <path d="M4 -1 l-4 -0.5 M4 0 l-4 0 M14 -1 l4 -0.5 M14 0 l4 0" stroke="#e8dcc0" strokeWidth="0.4" strokeLinecap="round" />
        {/* pattes avant */}
        <ellipse cx="6" cy="6" rx="2.4" ry="1.4" fill="#5a3820" />
        <ellipse cx="12" cy="6" rx="2.4" ry="1.4" fill="#5a3820" />
        {/* queue qui bouge doucement */}
        <g style={{ transformOrigin: "-10px 0px" }}>
          <animateTransform attributeName="transform" type="rotate"
            values="-8; 12; -8" dur="3.5s" repeatCount="indefinite" />
          <path d="M-9 0 q-14 -4 -20 -12 q4 -2 12 2 q6 4 8 10 z" fill="#5a3820" stroke="#2a1408" strokeWidth="0.5" />
        </g>
      </g>
</svg>
  );
}
