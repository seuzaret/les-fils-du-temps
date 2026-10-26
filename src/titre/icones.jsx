/* ============================================================
   ÉCRAN TITRE — une icône par époque, au trait (couleur : stroke
   hérité, currentColor). Centrées sur (0, 0), dans un carré de
   ±14 unités. Un SUPPORT de communication par époque, comme le
   jeu : main négative, mégalithe, tablette d'argile, rouleau,
   manuscrit, télégraphe de Chappe, phonographe, radio, télévision,
   smartphone. (Remplacent les emoji, qui changent d'un appareil
   à l'autre.)
   ============================================================ */
export const EPOQUES_TITRE = [
  { id: "paleo", date: "−18 000", nom: "Paléolithique" },
  { id: "neo", date: "−5000", nom: "Néolithique" },
  { id: "meso", date: "−3300", nom: "Mésopotamie" },
  { id: "antiq", date: "an 79", nom: "Antiquité" },
  { id: "ma", date: "1450", nom: "Moyen Âge" },
  { id: "mod", date: "1794", nom: "Temps modernes" },
  { id: "xix", date: "1877", nom: "XIXe siècle" },
  { id: "xx", date: "1944", nom: "XXe siècle" },
  { id: "fxx", date: "1969", nom: "Fin du XXe" },
  { id: "xxi", date: "aujourd'hui", nom: "XXIe siècle" },
];

const T = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconeEpoque({ id }) {
  switch (id) {
    case "paleo": // main négative, au pochoir
      return (
        <g {...T}>
          <path d="M-7 12 Q-9 3 -9 -1 L-9 -7 Q-8 -9 -6.5 -7 L-6 -1 M-6 -1 L-5 -11 Q-3.5 -13 -2 -11 L-2 -2 M-2 -2 L-1 -13 Q0.8 -14.5 2 -12.5 L2 -2 M2 -2 L3.5 -11 Q5 -12.5 6 -10.5 L5.5 -1 M5.5 -1 L8 -6 Q9.6 -7 10 -5 L7 4 Q5 11 -1 12 Z" />
          {[[-12, -2], [11, 2], [-11, 9], [10, 10], [0, -16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.7" fill="currentColor" stroke="none" />)}
        </g>
      );
    case "neo": // dolmen
      return (
        <g {...T}>
          <path d="M-12 -3 Q0 -9 12 -4 L11 -1 Q0 -5 -11 0 Z" />
          <path d="M-8 0 L-9 12 M-4 -1 L-4 12 M5 -2 L4 12 M8 -2 L9 12" />
          <path d="M-14 12 H14" />
        </g>
      );
    case "meso": // tablette d'argile cunéiforme
      return (
        <g {...T}>
          <rect x="-9" y="-12" width="18" height="24" rx="4" />
          {[-6, -1, 4].map((y) => (
            <g key={y}>{[-5, 0, 5].map((x) => <path key={x} d={`M${x - 1.5} ${y} l1.5 -2.2 l1.5 2.2 M${x} ${y - 2.2} v3.4`} strokeWidth="1.1" />)}</g>
          ))}
        </g>
      );
    case "antiq": // rouleau (volumen)
      return (
        <g {...T}>
          <path d="M-9 -11 H9 V11 H-9 Z" />
          <ellipse cx="-9" cy="0" rx="2.4" ry="11" />
          <ellipse cx="9" cy="0" rx="2.4" ry="11" />
          {[-6, -2, 2, 6].map((y) => <path key={y} d={`M-5 ${y} H5`} strokeWidth="1" />)}
        </g>
      );
    case "ma": // manuscrit ouvert
      return (
        <g {...T}>
          <path d="M0 -8 Q-6 -12 -13 -10 V10 Q-6 8 0 12 Q6 8 13 10 V-10 Q6 -12 0 -8 Z M0 -8 V12" />
          {[-4, 0, 4].map((y) => <path key={y} d={`M-10 ${y} Q-6 ${y - 1} -3 ${y} M3 ${y} Q6 ${y - 1} 10 ${y}`} strokeWidth="1" />)}
        </g>
      );
    case "mod": // télégraphe de Chappe
      return (
        <g {...T}>
          <path d="M0 13 V-4 M-5 13 H5" />
          <path d="M-11 -4 H11" strokeWidth="2.2" />
          <path d="M-11 -4 L-14 -12 M11 -4 L13 4" strokeWidth="2" />
          <path d="M-4 13 L0 4 L4 13" strokeWidth="1.1" />
        </g>
      );
    case "xix": // phonographe et son pavillon
      return (
        <g {...T}>
          <rect x="-12" y="6" width="14" height="6" rx="1" />
          <path d="M-5 6 V2 L2 -2" />
          <path d="M2 -2 L12 -13 Q15 -6 13 1 Z" />
          <ellipse cx="-5" cy="6" rx="5" ry="1.2" />
        </g>
      );
    case "xx": // poste de radio
      return (
        <g {...T}>
          <rect x="-12" y="-6" width="24" height="17" rx="3" />
          <path d="M-4 -6 L6 -14" />
          <circle cx="5" cy="2.5" r="3.2" />
          {[-8, -5.5].map((x) => <path key={x} d={`M${x} -2 V7`} strokeWidth="1" />)}
          <path d="M-2.5 -2 V7" strokeWidth="1" />
        </g>
      );
    case "fxx": // télévision
      return (
        <g {...T}>
          <rect x="-13" y="-6" width="26" height="17" rx="3" />
          <rect x="-10" y="-3" width="16" height="11" rx="2" strokeWidth="1.1" />
          <path d="M-4 -6 L-9 -14 M4 -6 L9 -14" />
          <circle cx="10" cy="0" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="10" cy="4" r="0.9" fill="currentColor" stroke="none" />
        </g>
      );
    case "xxi": // smartphone
      return (
        <g {...T}>
          <rect x="-7" y="-13" width="14" height="26" rx="2.6" />
          <path d="M-2.5 -10 H2.5" strokeWidth="1" />
          <circle cx="0" cy="10" r="1" fill="currentColor" stroke="none" />
          <path d="M-4 -5 h8 M-4 -1 h5 M-4 3 h7" strokeWidth="1" />
        </g>
      );
    default:
      return null;
  }
}
