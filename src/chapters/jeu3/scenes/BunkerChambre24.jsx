import { useState } from "react";
import PnjRoom from "../PnjRoom.jsx";
import ChambreVoisinDecor from "../ChambreVoisinDecor.jsx";
import { PNJ_ROOMS } from "../pnj.js";
import PacManEgg from "../PacManEgg.jsx";

/* ============================================================
   N-24 · Lior — chambre d'un insomniaque scotché à la radio.
   Extras : matelas au sol supplémentaire, câbles au mur, poste
   radio à lampes, cendrier plein, tapisserie décollée.
   Easter egg : une petite console vintage sur l'étagère, qui
   lance une partie de Pac-Man qui tourne toute seule.
   ============================================================ */
export default function BunkerChambre24({ onGo, j3 }) {
  const [pacman, setPacman] = useState(false);
  const extras = (
    <>
      {/* Tapisserie décollée dans un coin du mur */}
      <path d="M960 40 L960 200 L920 180 L940 90 Z" fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" opacity="0.65" />
      {/* Câbles au mur en désordre */}
      <path d="M240 60 Q280 100 320 80 Q360 120 400 90 Q440 130 480 100" stroke="#c8a848" strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M240 60 Q280 100 320 80 Q360 120 400 90 Q440 130 480 100" stroke="#8a1010" strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Poste radio à lampes sur le bureau */}
      <g transform="translate(660,320)">
        <rect x="-40" y="0" width="80" height="34" fill="#5a3818" stroke="#1a0e08" strokeWidth="1.5" />
        <rect x="-36" y="4" width="72" height="18" fill="#1a1408" stroke="#3a2818" strokeWidth="0.6" />
        <circle cx="0" cy="13" r="4" fill="#8a1010">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <text x="-20" y="14" fontFamily="ui-monospace,monospace" fontSize="5" fill="#c8a848">87.4</text>
        <text x="14" y="14" fontFamily="ui-monospace,monospace" fontSize="5" fill="#c8a848">FM</text>
        {/* Molettes */}
        <circle cx="-24" cy="28" r="4" fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" />
        <circle cx="0" cy="28" r="4" fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" />
        <circle cx="24" cy="28" r="4" fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" />
        {/* Antenne */}
        <line x1="30" y1="0" x2="60" y2="-30" stroke="#5a6270" strokeWidth="1.2" />
        <circle cx="60" cy="-30" r="2" fill="#c8a848" />
      </g>
      {/* Matelas au sol devant le lit (couvertures roulées) */}
      <g transform="translate(120,430)">
        <rect x="0" y="0" width="180" height="30" rx="6" fill="#28303a" stroke="#0a0806" strokeWidth="1" />
        <rect x="10" y="6" width="160" height="8" rx="3" fill="#5a4028" opacity="0.8" />
      </g>
      {/* Cendrier avec mégots */}
      <g transform="translate(620,352)">
        <ellipse cx="0" cy="0" rx="14" ry="4" fill="#3a2818" stroke="#0a0806" strokeWidth="0.6" />
        <line x1="-4" y1="-2" x2="2" y2="-8" stroke="#e8dfc8" strokeWidth="1" />
        <line x1="0" y1="-2" x2="5" y2="-6" stroke="#e8dfc8" strokeWidth="1" />
      </g>
      {/* 🎮 EASTER EGG : console vintage sur l'étagère au-dessus du bureau */}
      <g transform="translate(760,228)"
         onClick={(e) => { e.stopPropagation(); setPacman(true); }}
         style={{ cursor: "pointer" }}>
        {/* Base de la console (noir) */}
        <rect x="-24" y="0" width="48" height="22" fill="#141008" stroke="#0a0806" strokeWidth="1" rx="2" />
        {/* Écran */}
        <rect x="-18" y="3" width="36" height="12" fill="#000" stroke="#c8a848" strokeWidth="0.6" />
        {/* Minuscule pac-man clignotant à l'écran */}
        <circle cx="-8" cy="9" r="2.2" fill="#ffd700">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="9" r="1.2" fill="#ffe8a0" />
        <circle cx="4" cy="9" r="1.2" fill="#ffe8a0" />
        <circle cx="8" cy="9" r="1.2" fill="#ffe8a0" />
        {/* Fantôme rouge minuscule */}
        <path d="M12 11 Q12 7 15 7 Q18 7 18 11 L18 13 L17 12 L16 13 L15 12 L14 13 L13 12 L12 13 Z" fill="#e83820" />
        {/* Croix directionnelle + boutons */}
        <circle cx="-14" cy="18" r="1.5" fill="#5a6270" />
        <circle cx="14" cy="18" r="1.5" fill="#e83820" />
        <text x="0" y="30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fill="#c8a848">PAC·80</text>
        {/* Halo subtil pour signaler qu'on peut cliquer */}
        <circle r="22" fill="none" stroke="#ffd700" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </g>
    </>
  );
  const bg = <ChambreVoisinDecor num="N-24" accent="#3a80c8" litColor="#28303a" bureauColor="#5a4028" extras={extras} />;
  return (
    <>
      <PnjRoom titre="🛏 CHAMBRE N-24 · NIVEAU 0 · LIOR" bg={bg} pnjList={PNJ_ROOMS.chambreN24} j3={j3} onGo={onGo} />
      {pacman && <PacManEgg onClose={() => setPacman(false)} />}
    </>
  );
}
