import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Dunes, Haze, Palm, Speckle } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 3 — Tableau adjacent : LE CHANTIER DE LA PYRAMIDE
   ------------------------------------------------------------
   Meidoum (ou Rhomboïdale) : la pyramide de Snéfrou s'élève.
   Rampe de terre battue, ouvriers qui halent un bloc sur un
   traîneau, contremaître avec son rouleau de papyrus (les
   comptes des rations !), palmiers, gréement de bois.
   Cadrage désertique doré, ciel pur.
   ============================================================ */

export default function ScenePyramide({ collect, action, reveal, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="py-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7ea8cc" /><stop offset="60%" stopColor="#e8c898" /><stop offset="100%" stopColor="#f0d0a0" /></linearGradient>
        <linearGradient id="py-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8c078" /><stop offset="60%" stopColor="#c89858" /><stop offset="100%" stopColor="#8a6838" /></linearGradient>
        <linearGradient id="py-pyr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8b078" /><stop offset="100%" stopColor="#8a6a3a" /></linearGradient>
        <radialGradient id="py-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff4c8" /><stop offset="60%" stopColor="#f8d878" stopOpacity="0.4" /><stop offset="100%" stopColor="#f8c058" stopOpacity="0" /></radialGradient>
      </defs>

      <PLayer depth={1}>
        <rect width="1000" height="380" fill="url(#py-sky)" />
        {/* halo solaire ardent */}
        <circle cx="200" cy="120" r="120" fill="url(#py-sun)" />
        {/* rayons brûlants */}
        <g opacity="0.28" transform="translate(200,120)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i} x1={Math.cos(rad) * 40} y1={Math.sin(rad) * 40} x2={Math.cos(rad) * 74} y2={Math.sin(rad) * 74} stroke="#fff4c8" strokeWidth="1.2" strokeLinecap="round" />;
          })}
        </g>
        <circle cx="200" cy="120" r="34" fill="#fff8d8" />
        <circle cx="200" cy="120" r="22" fill="#fff4b0" />
        {/* traînées de nuages hauts */}
        <Clouds id="py-cl" seed={51} items={[[600, 66, 220], [840, 92, 160]]} color="#fbf4e4" opacity="0.6" drift={14} />
        {/* vol de vautours au loin */}
        <g opacity="0.5" transform="translate(500,200)">
          <path d="M0 0 q-4 -4 -8 0 M0 0 q4 -4 8 0" stroke="#3a2818" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M30 12 q-4 -4 -8 0 M30 12 q4 -4 8 0" stroke="#3a2818" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      <PLayer depth={1.5}>
        {/* au loin : deux pyramides plus anciennes, puis les dunes */}
        <g opacity="0.55">
          <path d="M80 318 L150 250 L220 318 Z" fill="#d8b888" /><path d="M150 250 L220 318 L180 318 Z" fill="#b8946a" />
          <path d="M230 320 L280 272 L330 320 Z" fill="#d8b888" /><path d="M280 272 L330 320 L300 320 Z" fill="#b8946a" />
        </g>
        <Haze id="py-h0" y0={250} y1={330} color="#f4dcb0" opacity={0.5} />
        <Dunes id="py-d0" seed={231} y={322} amp={26} n={5} fill="#e0b070" shadow="#c08a50" light={-1} />
        <Dunes id="py-d1" seed={233} y={350} amp={22} n={4} fill="#d8a460" shadow="#b8824a" light={-1} />
      </PLayer>

      <PLayer depth={2}>
        {/* LA PYRAMIDE — en construction, sommet inachevé */}
        <g transform="translate(700,380)">
          {/* base large */}
          <path d="M-220 0 L220 0 L60 -260 L-60 -260 Z" fill="url(#py-pyr)" stroke="#5a3820" strokeWidth="1.2" />
          {/* pierres en gros appareil (rangées horizontales) */}
          {Array.from({ length: 12 }).map((_, r) => {
            const y = -r * 22;
            const w = 220 - (r * 220) / 13;
            return <path key={r} d={`M${-w} ${y} L${w} ${y}`} stroke="#5a3820" strokeWidth="0.6" opacity="0.7" />;
          })}
          {/* joints verticaux (échantillon) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const y = -i * 22 - 10;
            return <path key={i} d={`M-160 ${y} l0 -12 M-80 ${y} l0 -12 M0 ${y} l0 -12 M80 ${y} l0 -12 M160 ${y} l0 -12`} stroke="#5a3820" strokeWidth="0.4" opacity="0.55" />;
          })}
          {/* face ombrée (côté droit) */}
          <path d="M0 -260 L60 -260 L220 0 L100 0 Z" fill="#0a0604" opacity="0.25" />
          {/* sommet inachevé (blocs empilés) */}
          <rect x="-32" y="-268" width="64" height="10" fill="#a0783a" stroke="#3a2410" strokeWidth="0.6" />
          <rect x="-24" y="-280" width="46" height="12" fill="#8a6830" stroke="#3a2410" strokeWidth="0.6" />
          <rect x="-14" y="-292" width="28" height="12" fill="#a0783a" stroke="#3a2410" strokeWidth="0.6" />
          {/* échafaudage au sommet + 2 mini-silhouettes d'ouvriers */}
          <path d="M-24 -298 L24 -298" stroke="#3a2010" strokeWidth="1" />
          <path d="M-20 -298 L-20 -292 M20 -298 L20 -292" stroke="#3a2010" strokeWidth="0.8" />
          <circle cx="-10" cy="-302" r="2" fill="#c8946a" />
          <circle cx="8" cy="-302" r="2" fill="#c8946a" />
          {/* poussière de chantier qui s'élève */}
          <ellipse cx="-100" cy="-100" rx="30" ry="12" fill="#e8c890" opacity="0.35" />
          {/* rampe de terre battue qui monte le long du côté gauche */}
          <path d="M-220 0 L-260 20 L-60 -260 L-60 -246 Z" fill="#a06838" stroke="#3a1810" strokeWidth="1" />
          {/* traîneau à mi-rampe */}
          <g transform="translate(-160,-124)">
            <rect x="-14" y="-6" width="28" height="10" fill="#5a3818" stroke="#2a1810" strokeWidth="0.6" />
            <path d="M-14 4 L-18 8 M14 4 L18 8" stroke="#5a3818" strokeWidth="1.4" />
            {/* petits ouvriers qui tirent */}
            <circle cx="-24" cy="-6" r="2" fill="#c8946a" />
            <circle cx="-28" cy="-4" r="2" fill="#c8946a" />
            <circle cx="18" cy="-6" r="2" fill="#c8946a" />
          </g>
        </g>
      </PLayer>

      <PLayer depth={2.5}>
        {/* sol : sable clair du premier plan */}
        <path d="M-40 384 Q200 374 460 382 Q720 390 1040 378 L1040 560 L-40 560 Z" fill="url(#py-sand)" />
        <Speckle seed={235} x0={0} x1={1000} y0={384} y1={560} n={360} colors={["#a07038", "#fff0c8", "#c89858", "#8a6838"]} opacity={0.45} />
        {/* ombre portée de la pyramide sur le sable */}
        <path d="M920 384 L1040 384 L1040 420 L980 420 Z" fill="#8a6838" opacity="0.3" />
        {/* vent : rides de sable fines */}
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${(i * 113) % 1000 - 20} ${400 + (i * 37) % 140} q14 -4 28 0 q14 4 28 0`} stroke="#fff0c8" strokeWidth="1.2" fill="none" opacity="0.4" />)}
        {/* ondulations du sable */}
        <path d="M0 440 q100 -8 200 0 q100 8 200 0 q100 -8 200 0 q100 8 200 0 q100 -8 200 0" stroke="#a07038" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M0 480 q100 -6 200 0 q100 6 200 0 q100 -6 200 0 q100 6 200 0 q100 -6 200 0" stroke="#a07038" strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* traces d'empreintes de pieds nus dans le sable */}
        {[[80, 470, 20], [140, 480, -15], [400, 476, 10], [460, 484, -20], [700, 478, 25]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
            <ellipse cx="0" cy="0" rx="7" ry="4" fill="#8a6838" opacity="0.5" />
            <ellipse cx="0" cy="-6" rx="3" ry="2" fill="#8a6838" opacity="0.45" />
          </g>
        ))}
        {/* haze de chaleur qui vibre au-dessus du sable */}
        <path d="M0 456 q80 -1 160 0 q80 1 160 0 q80 -1 160 0 q80 1 160 0" stroke="#f8e8b8" strokeWidth="0.4" fill="none" opacity="0.5" style={{ animation: "float 3s ease-in-out infinite" }} />
        {/* palmiers (une petite oasis au bord du chantier) */}
        <Palm x={120} y={402} h={130} lean={10} seed={7} />
        <Palm x={160} y={410} h={84} lean={-12} seed={8} dates={false} />
        <Palm x={950} y={412} h={110} lean={-8} seed={9} />
        {/* petit tas de blocs de calcaire prêts */}
        <g transform="translate(240,480)">
          <ellipse cx="0" cy="24" rx="48" ry="6" fill="#0a0604" opacity="0.55" />
          <rect x="-40" y="0" width="30" height="24" fill="#e0c088" stroke="#5a3820" strokeWidth="0.8" />
          <rect x="-8" y="-4" width="30" height="28" fill="#d0b078" stroke="#5a3820" strokeWidth="0.8" />
          <rect x="24" y="4" width="24" height="20" fill="#e0c088" stroke="#5a3820" strokeWidth="0.8" />
          <rect x="-24" y="-24" width="28" height="20" fill="#d0b078" stroke="#5a3820" strokeWidth="0.8" />
        </g>

        {/* COBRA qui apparait derriere les blocs cote droit — capuchon
            dresse, tete qui oscille de gauche a droite, langue qui darde
            de temps en temps. Motif ocre-noir typique du naja egyptien. */}
        <g transform="translate(290,478)">
          {/* corps enroule qui depasse derriere le bloc */}
          <path d="M-2 20 q4 -6 0 -12 q-4 -6 4 -10" stroke="#d8a848" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* tete dressee — pivote de gauche a droite */}
          <g style={{ transformOrigin: "0px 0px" }}>
            <animateTransform attributeName="transform" type="rotate"
              values="-18; 18; -18" dur="4.5s" repeatCount="indefinite" />
            {/* capuchon evase */}
            <path d="M-8 4 Q-9 -8 0 -14 Q9 -8 8 4 Z" fill="#c88028" stroke="#5a2810" strokeWidth="0.6" />
            {/* motifs noirs (yeux du cobra sur le capuchon) */}
            <circle cx="-3" cy="-2" r="1" fill="#1a0e04" />
            <circle cx="3" cy="-2" r="1" fill="#1a0e04" />
            {/* tete */}
            <ellipse cx="0" cy="-10" rx="4" ry="3" fill="#d8a848" stroke="#5a2810" strokeWidth="0.5" />
            <circle cx="-1.5" cy="-11" r="0.5" fill="#0a0604" />
            <circle cx="1.5" cy="-11" r="0.5" fill="#0a0604" />
            {/* langue fourchue qui darde de temps en temps */}
            <g>
              <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.75;0.8;0.85;1" dur="4.5s" repeatCount="indefinite" />
              <path d="M0 -12 l0 -4 M-1 -14 l1 -2 l1 2" stroke="#8a1810" strokeWidth="0.6" fill="none" />
            </g>
          </g>
        </g>
      </PLayer>

      <PLayer depth={3}>
        {/* CONTREMAÎTRE égyptien (à droite du chantier) avec son rouleau */}
        <g transform="translate(500,480)">
          <ellipse cx="0" cy="42" rx="20" ry="4" fill="#0a0604" opacity="0.55" />
          <Figure x={0} y={42} s={0.7} skin="#a06838" hair="#1a1408" look="short" kohl hat="nemes" hatColor="#3a80a8" hatColor2="#f0c848"
            garment="kilt" coat="#f0e8d0" trim="#8a6838" pants="#a06838" shoes="#6a4a2a"
            arms={[{ a1: 10, a2: 6 }, { a1: 50, a2: 80 }]}>
            <path d="M-12 -87 Q0 -76 12 -87" stroke="#f0c848" strokeWidth="5" fill="none" />
            <path d="M-11 -82 Q0 -72 11 -82" stroke="#3a80a8" strokeWidth="2" fill="none" />
            {/* rouleau de papyrus */}
            <g transform="translate(50,-72) rotate(14)">
              <rect x="-1" y="-15" width="26" height="17" fill="#e8d0a0" stroke="#5a3818" strokeWidth="0.8" />
              <path d="M2 -11 h20 M2 -8 h20 M2 -5 h20 M2 -2 h20" stroke="#8a5828" strokeWidth="0.6" />
              <rect x="-3" y="-17" width="4" height="21" rx="2" fill="#d8bc88" stroke="#5a3818" strokeWidth="0.6" />
            </g>
          </Figure>
        </g>
        {/* Ouvrier au sol qui pousse un bloc (au premier plan gauche) */}
        <g transform="translate(340,510)">
          <ellipse cx="4" cy="14" rx="20" ry="4" fill="#0a0604" opacity="0.5" />
          {/* penché, les deux mains contre le bloc */}
          <g transform="rotate(18 0 14)">
            <Figure x={0} y={14} s={0.32} stride={10} facing="right" skin="#a06838" hair="#1a1008" look="short" mood="colere"
              garment="kilt" coat="#e8dcc0" pants="#a06838" shoes="#6a4a2a" arms={[{ a1: -70, a2: -80 }, { a1: 85, a2: 85 }]} />
          </g>
          <rect x="28" y="-14" width="22" height="20" fill="#e0c088" stroke="#5a3820" strokeWidth="0.8" />
          <path d="M30 -8 l18 0 M30 -2 l18 0" stroke="#8a6838" strokeWidth="0.4" />
        </g>

        {/* Ephemere : éclat de calcaire + petit scarabée (disparaissent au ramassage) */}
        {!inv.includes("eclat_calcaire") && (
        <g transform="translate(700,540) rotate(20)">
          <path d="M-6 0 L4 -4 L8 3 L-2 6 Z" fill="#e8d0a0" stroke="#5a3820" strokeWidth="0.5" />
          <path d="M-3 -1 L4 -2" stroke="#f8e8c8" strokeWidth="0.4" />
        </g>
        )}
        {!inv.includes("scarabee") && (
        <g transform="translate(820,538)">
          <ellipse cx="0" cy="0" rx="7" ry="5" fill="#3a5820" stroke="#1a2810" strokeWidth="0.5" />
          <ellipse cx="0" cy="-1" rx="6" ry="4" fill="#4a6828" opacity="0.7" />
          <path d="M0 -5 l0 10 M-4 -3 l8 6 M-4 3 l8 -6" stroke="#1a2810" strokeWidth="0.4" fill="none" opacity="0.7" />
          <path d="M-6 -1 l-3 -2 M-6 1 l-3 0 M-6 3 l-3 2 M6 -1 l3 -2 M6 1 l3 0 M6 3 l3 2" stroke="#1a2810" strokeWidth="0.5" />
          <path d="M-2 -5 l-2 -2 M2 -5 l2 -2" stroke="#1a2810" strokeWidth="0.4" />
        </g>
        )}
      </PLayer>

      <Hotspot cx={500} cy={454} r={40} label="le contremaître du chantier" reveal={reveal} onClick={() => action("contremaitre")} />
      <Hotspot cx={340} cy={500} r={30} label="ouvrier qui pousse un bloc" reveal={reveal} onClick={() => action("ouvrier")} />
      <Hotspot cx={700} cy={200} r={80} label="la pyramide de Snéfrou" reveal={reveal} onClick={() => action("pyramide")} />
      <Hotspot cx={240} cy={480} r={40} label="tas de blocs de calcaire" reveal={reveal} onClick={() => action("blocs")} />
      <Hotspot cx={700} cy={540} r={14} label="éclat de calcaire" item="eclat_calcaire" reveal={reveal} onClick={() => collect("eclat_calcaire")} />
      <Hotspot cx={820} cy={538} r={14} label="scarabée" item="scarabee" reveal={reveal} onClick={() => collect("scarabee")} />
      {/* CARAVANE DE CHAMEAUX en ombre au loin, sur l'horizon du desert.
          Ils marchent DE DROITE A GAUCHE, donc dessines la tete a GAUCHE
          (les paths ont ete redessines pour eviter l'effet 'coupe en 2').
          Silhouette dromadaire classique : longues pattes, cou long, bosse
          unique en dos rond. */}
      <g opacity="0.75">
        <animateTransform attributeName="transform" type="translate"
          values="1080,0; -260,0" dur="140s" repeatCount="indefinite" />
        <g fill="#1a1408">
          {[0, 44, 84, 124].map((dx, i) => (
            <g key={i} transform={`translate(${dx},370) scale(${0.8 + (i % 2) * 0.08})`}>
              {/* corps entier en une seule silhouette compacte :
                  croupe a droite, bosse au centre, cou monte vers la
                  gauche, tete en haut a gauche, museau qui pointe vers
                  la gauche */}
              <path d="M14 -2
                       Q16 -8 12 -10
                       Q10 -14 4 -10
                       Q0 -14 -6 -10
                       Q-10 -8 -14 -6
                       Q-18 -8 -20 -14
                       Q-21 -18 -18 -18
                       Q-15 -18 -14 -12
                       Q-14 -10 -12 -10
                       L14 -3 Z" />
              {/* les 4 pattes longues et fines qui descendent bien
                  jusqu'au sol */}
              <rect x="-10" y="-3" width="1.6" height="14" />
              <rect x="-5" y="-3" width="1.6" height="14" />
              <rect x="6" y="-2" width="1.6" height="14" />
              <rect x="11" y="-2" width="1.6" height="14" />
              {/* queue */}
              <path d="M14 -2 q3 3 4 6" stroke="#1a1408" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* petit chamelier (silhouette) sur le premier chameau
                  visible (celui qui ouvre la marche vers la gauche) */}
              {i === 3 && <ellipse cx="-3" cy="-16" rx="2" ry="4" />}
            </g>
          ))}
        </g>
      </g>
</svg>
  );
}
