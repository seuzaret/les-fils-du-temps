import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";
import { Clouds, Glitter, Ridge, Speckle, Volcano } from "../../../engine/scenery.jsx";

/* ============================================================
   CHAPITRE 4 — Tableau adjacent : LE PORT DE POMPÉI
   ------------------------------------------------------------
   Sur les quais de pierre du port, la baie de Naples : amphores
   marquées à la peinture (tituli picti = étiquettes de l'antiquité),
   navire marchand à voile carrée qui charge, débardeur, marchand
   au comptoir avec sa liste sur volumen. Au fond, le VÉSUVE fume
   drôlement — mais personne ne s'inquiète (encore).
   ============================================================ */

export default function ScenePort({ collect, action, reveal, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="po-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#88a0c0" /><stop offset="60%" stopColor="#e8c898" /><stop offset="100%" stopColor="#f0d0a0" /></linearGradient>
        <linearGradient id="po-mer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a80a8" /><stop offset="100%" stopColor="#1a4868" /></linearGradient>
        <linearGradient id="po-quai" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a09080" /><stop offset="100%" stopColor="#5a4838" /></linearGradient>
        <linearGradient id="po-amphore" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e0a878" /><stop offset="100%" stopColor="#8a5828" /></linearGradient>
        <radialGradient id="po-soleil" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff4c8" /><stop offset="70%" stopColor="#f8d878" stopOpacity="0.4" /><stop offset="100%" stopColor="#f8c058" stopOpacity="0" /></radialGradient>
      </defs>

      <PLayer depth={1}>
        <rect width="1000" height="380" fill="url(#po-sky)" />
        {/* soleil */}
        <circle cx="140" cy="140" r="120" fill="url(#po-soleil)" />
        <circle cx="140" cy="140" r="34" fill="#fff4c8" />
        {/* nuages */}
        <Clouds id="po-cl" seed={71} items={[[330, 84, 180], [520, 120, 150]]} color="#fbf0dc" shadow="#d8c0a0" opacity="0.7" drift={14} />
        {/* mouettes */}
        <g opacity="0.6" transform="translate(280,180)">
          <path d="M0 0 q-3 -3 -6 0 M0 0 q3 -3 6 0" stroke="#3a2818" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M18 12 q-3 -3 -6 0 M18 12 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M-22 14 q-3 -3 -6 0 M-22 14 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      <PLayer depth={1.5}>
        {/* LE VÉSUVE — au fond, imposant, fumée ANORMALEMENT dense */}
        <g transform="translate(720,340)">
          {/* le volcan : cône raviné, épaulement de la Somma, pentes boisées */}
          <Volcano id="po-vol" x={-65} y={6} w={400} h={214} color="#5e5466" light={-1} smoke={false} green="#4e5a42" />
          {/* PANACHE de fumée dense qui monte, un peu inquiétant */}
          <g style={{ animation: "float 4s ease-in-out infinite" }}>
            <ellipse cx="-70" cy="-236" rx="40" ry="20" fill="#a09880" opacity="0.85" />
            <ellipse cx="-40" cy="-260" rx="52" ry="26" fill="#8a8078" opacity="0.75" />
            <ellipse cx="-90" cy="-286" rx="46" ry="22" fill="#7a7068" opacity="0.7" />
            <ellipse cx="-30" cy="-306" rx="60" ry="26" fill="#a09880" opacity="0.6" />
            <ellipse cx="-70" cy="-330" rx="70" ry="26" fill="#a09880" opacity="0.5" />
          </g>
          {/* petit rougeoiement suspect à la base du panache */}
          <ellipse cx="-65" cy="-214" rx="14" ry="4" fill="#e86028" opacity="0.55" />
          {/* étincelles fines qui montent du cratère */}
          {[[-70, -220], [-60, -216], [-55, -224]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.8" fill="#f8d848" opacity="0.85" style={{ animation: `float ${1.4 + i * 0.3}s ease-in-out infinite` }} />
          ))}
        </g>
        {/* fines cendres qui commencent à voler dans le ciel */}
        {[[220, 200, 2.4], [420, 180, 3], [660, 210, 2], [340, 240, 2.8], [520, 220, 3.4]].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r="0.9" fill="#5a5060" opacity="0.5" style={{ animation: `float ${d}s ease-in-out infinite` }} />
        ))}
        {/* Collines de la baie de Naples à gauche, avec villas blanches */}
        <Ridge id="po-r0" seed={251} x0={-40} x1={460} y={346} amp={56} rough={0.5} fill="#8a7a98" lit="#b0a0b8" light={-1} />
        {[[40, 322], [96, 314], [170, 326], [250, 330], [330, 336]].map(([x, y], i) => (
          <g key={i}><rect x={x} y={y} width="14" height="9" fill="#ece0cc" /><path d={`M${x - 1} ${y} l8 -4 l8 4 Z`} fill="#b04a30" /></g>
        ))}
      </PLayer>

      <PLayer depth={2}>
        {/* mer */}
        <rect x="-40" y="340" width="1080" height="100" fill="url(#po-mer)" />
        <rect x="-40" y="340" width="1080" height="3" fill="#e8f0f0" opacity="0.4" />
        <Glitter x={140} y0={344} y1={436} w0={14} w1={110} />
        {/* vagues */}
        <path d="M0 360 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0" stroke="#a8d0e8" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M0 385 q60 -3 120 0 q60 3 120 0 q60 -3 120 0 q60 3 120 0 q60 -3 120 0" stroke="#78a8c8" strokeWidth="0.8" fill="none" opacity="0.65" />
        {/* reflets solaires */}
        {[[120, 370], [340, 380], [560, 375], [880, 385]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="16" ry="1.6" fill="#f8f8e8" opacity="0.55" style={{ animation: `float ${2.4 + (i % 3) * 0.3}s ease-in-out infinite` }} />
        ))}
        {/* Reflet SOMBRE du Vésuve sur l'eau */}
        <path d="M520 340 L655 410 L790 340 Z" fill="#2a2a3a" opacity="0.3" />
        <path d="M700 380 Q720 375 740 380" stroke="#5a5060" strokeWidth="0.6" fill="none" opacity="0.5" />
        {/* NAVIRE MARCHAND romain (corbita) à quai — voile carrée */}
        <g transform="translate(720,370)">
          {/* coque large et arrondie */}
          <path d="M-80 0 Q-70 20 60 20 Q80 12 80 0 L-80 0 Z" fill="#5a3818" stroke="#2a1810" strokeWidth="0.8" />
          {/* bordage */}
          <path d="M-80 0 L-90 -14 M80 0 L90 -14" stroke="#3a2010" strokeWidth="1.2" />
          {/* pont */}
          <path d="M-80 0 L80 0" stroke="#3a2010" strokeWidth="1" />
          {/* mât + vergue */}
          <path d="M-10 0 L-10 -70" stroke="#3a2010" strokeWidth="1.5" />
          <path d="M-50 -66 L30 -66" stroke="#3a2010" strokeWidth="1.5" />
          {/* voile carrée */}
          <path d="M-48 -66 L-48 -20 L28 -20 L28 -66 Z" fill="#e8dcc0" stroke="#8a7860" strokeWidth="0.6" />
          <path d="M-48 -50 h76 M-48 -34 h76" stroke="#a09078" strokeWidth="0.5" />
          {/* voile enflée par le vent */}
          <path d="M-48 -66 Q-10 -30 28 -66" fill="none" stroke="#8a7860" strokeWidth="0.4" />
          {/* col de cygne à la poupe */}
          <path d="M-80 0 L-90 -12 L-84 -18 L-78 -12 Q-80 -6 -78 0 Z" fill="#5a3818" stroke="#2a1810" strokeWidth="0.6" />
          {/* amphores empilées sur le pont */}
          <g transform="translate(20,-4)">
            <path d="M-4 0 Q-4 -14 0 -18 M4 0 Q4 -14 0 -18" stroke="#5a3818" strokeWidth="0.6" fill="none" />
            <path d="M-4 -18 L4 -18 L4 -4 L-4 -4 Z" fill="#8a5828" />
          </g>
        </g>
      </PLayer>

      <PLayer depth={2.5}>
        {/* quai en dalles */}
        <rect x="-40" y="440" width="1080" height="130" fill="url(#po-quai)" />
        {/* joints entre dalles, en perspective */}
        {[[440, 458], [458, 482], [482, 516], [516, 570]].map(([y0, y1], r) => (
          <g key={r}>
            <path d={`M-40 ${y1} H1040`} stroke="#2a2010" strokeWidth={0.8 + r * 0.4} opacity="0.5" />
            {Array.from({ length: 10 }).map((_, k) => {
              const x = -80 + k * 130 + (r % 2) * 65, f0 = 1 + (y0 - 440) / 120, f1 = 1 + (y1 - 440) / 120;
              return <path key={k} d={`M${(500 + (x - 500) * f0).toFixed(0)} ${y0} L${(500 + (x - 500) * f1).toFixed(0)} ${y1}`} stroke="#2a2010" strokeWidth="1" opacity="0.45" />;
            })}
          </g>
        ))}
        <Speckle seed={253} x0={0} x1={1000} y0={444} y1={560} n={240} colors={["#5a4838", "#c8b8a0", "#3a2c20"]} opacity={0.45} />
        <rect x="-40" y="440" width="1080" height="10" fill="#7a6a58" />
        {/* bord du quai vers la mer */}
        <path d="M0 440 L1000 440" stroke="#1a1408" strokeWidth="2" />
        {/* anneaux d'amarrage en bronze */}
        <g transform="translate(500,440)">
          <circle r="8" fill="#8a5828" stroke="#3a1810" strokeWidth="0.8" />
          <circle r="4" fill="none" stroke="#3a1810" strokeWidth="1" />
          <path d="M-8 0 q4 20 40 6" stroke="#5a3818" strokeWidth="1.4" fill="none" opacity="0.7" />
        </g>
        <g transform="translate(200,440)">
          <circle r="8" fill="#8a5828" stroke="#3a1810" strokeWidth="0.8" />
          <circle r="4" fill="none" stroke="#3a1810" strokeWidth="1" />
        </g>
        {/* PILE D'AMPHORES marquées (tituli picti) au premier plan */}
        <g transform="translate(220,510)">
          {/* rang du bas */}
          {[-70, -20, 30, 80].map((x, i) => (
            <g key={`b${i}`} transform={`translate(${x},0)`}>
              <ellipse cx="0" cy="30" rx="18" ry="3" fill="#0a0604" opacity="0.55" />
              {/* corps amphore ovoïde */}
              <path d="M-12 0 Q-16 -6 -6 -14 M12 0 Q16 -6 6 -14" stroke="#5a3818" strokeWidth="0.6" fill="none" />
              <path d="M-14 8 Q-14 26 -6 30 L6 30 Q14 26 14 8 Q14 -12 0 -16 Q-14 -12 -14 8 Z" fill="url(#po-amphore)" stroke="#3a1810" strokeWidth="0.7" />
              {/* poignées */}
              <path d="M-14 -4 Q-20 -8 -14 -14 M14 -4 Q20 -8 14 -14" stroke="#5a3818" strokeWidth="2" fill="none" />
              {/* titulus pictus : étiquette peinte en rouge */}
              <text x="0" y="10" textAnchor="middle" fontSize="4" fill="#8a2818" fontFamily="Georgia, serif" fontWeight="700">GARVM</text>
              <text x="0" y="16" textAnchor="middle" fontSize="3" fill="#8a2818" fontFamily="Georgia, serif">CAII·IV</text>
            </g>
          ))}
          {/* rang du haut */}
          {[-45, 5, 55].map((x, i) => (
            <g key={`t${i}`} transform={`translate(${x},-30)`}>
              <path d="M-14 8 Q-14 26 -6 30 L6 30 Q14 26 14 8 Q14 -12 0 -16 Q-14 -12 -14 8 Z" fill="url(#po-amphore)" stroke="#3a1810" strokeWidth="0.7" />
              <path d="M-14 -4 Q-20 -8 -14 -14 M14 -4 Q20 -8 14 -14" stroke="#5a3818" strokeWidth="2" fill="none" />
              <text x="0" y="12" textAnchor="middle" fontSize="4" fill="#8a2818" fontFamily="Georgia, serif" fontWeight="700">VIN</text>
            </g>
          ))}
        </g>
      </PLayer>

      <PLayer depth={3}>
        {/* LE MARCHAND au comptoir, notant sur son volumen */}
        <g transform="translate(560,500)">
          {/* le marchand, debout derrière son comptoir, stylet à la main */}
          <Figure x={0} y={46} s={0.7} skin="#c8946a" hair="#3a2418" look="short" beard="short" mood="vexe"
            garment="toga" coat="#f0e8d0" coat2="#7a2044" pants="#5a3a20" shoes="#3a2418"
            arms={[{ a1: 30, a2: -24 }, { a1: 30, a2: -20 }]} />
          {/* comptoir de pierre */}
          <rect x="-40" y="20" width="80" height="30" fill="url(#po-quai)" stroke="#2a1810" strokeWidth="0.6" />
          <ellipse cx="0" cy="50" rx="44" ry="4" fill="#0a0604" opacity="0.55" />
          {/* volumen ouvert sur le comptoir */}
          <g transform="translate(0,18)">
            <rect x="-30" y="-6" width="60" height="14" fill="#e8d0a0" stroke="#5a3818" strokeWidth="0.5" />
            <path d="M-30 -6 L-36 -8 L-36 8 L-30 8 Z M30 -6 L36 -8 L36 8 L30 8 Z" fill="#c8a878" stroke="#5a3818" strokeWidth="0.5" />
            <path d="M-24 -3 h48 M-24 0 h48 M-24 3 h48 M-24 6 h48" stroke="#5a3818" strokeWidth="0.3" />
          </g>
          {/* le stylet */}
          <path d="M16 12 L22 20" stroke="#3a2418" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        {/* Débardeur qui porte une amphore sur l'épaule */}
        <g transform="translate(400,510)">
          <ellipse cx="0" cy="30" rx="20" ry="4" fill="#0a0604" opacity="0.5" />
          {/* torse nu, pagne, l'amphore calée sur l'épaule gauche */}
          <Figure x={0} y={30} s={0.6} skin="#a06838" hair="#2a1a10" look="short" beard="stubble" mood="colere"
            garment="kilt" coat="#c88a52" pants="#a06838" shoes="#5a3818"
            arms={[{ a1: 150, a2: 170 }, { a1: 12, a2: 8 }]}
            behind={<g>
              {/* amphore couchée sur l'épaule : pied pointu à gauche, col à droite */}
              <path d="M-70 -120 Q-62 -136 -40 -138 Q-16 -138 -6 -128 L2 -126 L2 -116 L-6 -114 Q-16 -104 -40 -104 Q-62 -106 -70 -120 Z" fill="url(#po-amphore)" stroke="#3a1810" strokeWidth="1" />
              <rect x="1" y="-128" width="5" height="14" rx="1.5" fill="#a86a3a" stroke="#3a1810" strokeWidth="0.8" />
              <path d="M-7 -129 q0 -10 -12 -9 M-7 -113 q0 10 -12 9" stroke="#5a3818" strokeWidth="2.4" fill="none" />
              <path d="M-52 -128 q12 -4 30 -2" stroke="#e8b080" strokeWidth="2" fill="none" opacity="0.5" />
            </g>} />
        </g>

        {/* Ephemere : oursin séché + morceau de corde (disparaissent au ramassage) */}
        {!inv.includes("oursin") && (
        <g transform="translate(160,538)">
          <circle r="8" fill="#5a4028" stroke="#2a1810" strokeWidth="0.5" />
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i} x1={Math.cos(rad) * 8} y1={Math.sin(rad) * 8} x2={Math.cos(rad) * 14} y2={Math.sin(rad) * 14} stroke="#3a2010" strokeWidth="0.7" />;
          })}
        </g>
        )}
        {!inv.includes("cordage") && (
        <g transform="translate(860,540) rotate(20)">
          <path d="M-14 0 q-2 6 6 4 q6 -4 12 4 q4 -4 12 -4" stroke="#8a7048" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M-14 0 q-2 6 6 4 q6 -4 12 4 q4 -4 12 -4" stroke="#c8a878" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
        )}
      </PLayer>

      <Hotspot cx={560} cy={480} r={40} label="le marchand qui note ses comptes" reveal={reveal} onClick={() => action("marchand_port")} />
      <Hotspot cx={400} cy={500} r={30} label="le débardeur avec son amphore" reveal={reveal} onClick={() => action("debardeur")} />
      <Hotspot cx={220} cy={510} r={70} label="pile d'amphores étiquetées" reveal={reveal} onClick={() => action("amphores_port")} />
      <Hotspot cx={720} cy={340} r={60} label="navire marchand à quai" reveal={reveal} onClick={() => action("navire_port")} />
      <Hotspot cx={670} cy={200} r={80} label="LE VÉSUVE qui fume drôlement" reveal={reveal} onClick={() => action("vesuve_port")} />
      <Hotspot cx={160} cy={538} r={14} label="oursin séché" item="oursin" reveal={reveal} onClick={() => collect("oursin")} />
      <Hotspot cx={860} cy={540} r={18} label="bout de cordage" item="cordage" reveal={reveal} onClick={() => collect("cordage")} />
      {/* Un seul oiseau blanc (mouette) qui traverse de DROITE a GAUCHE. */}
      <g opacity="0.95">
        <animateTransform attributeName="transform" type="translate"
          values="1080,110; -40,130; 1080,110" dur="28s" repeatCount="indefinite" />
        <path d="M0 0 q7 -9 14 0 q7 -9 14 0" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
</svg>
  );
}
