import { useState, useEffect } from "react";
import CarnetElias from "./CarnetElias.jsx";
import ArriveeElias from "./ArriveeElias.jsx";

/* Petit hook TYPEWRITER local — révèle un texte lettre par lettre.
   Repart de zéro dès que `text` change. `skip()` affiche tout d'un coup. */
function useTypewriter(text, speed = 6) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    if (!text) { setDone(true); return; }
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { shown, done, skip: () => { setShown(text); setDone(true); } };
}

/* ============================================================
   STATION DES CHRONAUTES — la scène du futur
   ------------------------------------------------------------
   S'affiche juste après le saut depuis le DERNIER chapitre.
   Décor post-apo LUMINEUX (dôme géodésique bricolé, panneaux
   solaires patchés, jardins hydroponiques, MARTINE-jumelle
   rangée avec un ruban de deuil). Séquence de dialogues
   scriptée : Elias, Mira, portrait-cadre d'Al3x1A.
   Fin de la séquence : bouton « Continuer » → épilogue.
   ============================================================ */

/* Dialogues groupés PAR PERSONNAGE. Le joueur clique sur le "?" au-dessus
   de chaque perso pour ouvrir sa séquence. L'ordre est libre, mais le
   bouton "Continuer" n'apparaît qu'une fois tous les trois écoutés. */
const DIALOGUES_PAR_PERSO = {
  elias: [
    { mood: "content",
      text: "Tu as lu mon carnet ? Bien. Ça va mieux, là — je te reconnais, {prenom}. Merci d'être venu·e." },
    { mood: "vexe",
      text: "Grâce à toi, à ta traversée des époques, on connaît enfin CE QUI DURE. Tu viens de nous rendre notre mémoire, morceau par morceau. Ce que je n'ai pas écrit dans le carnet, Mira va te le dire. Puis reviens me voir : j'aurai une question." },
  ],
  mira: [
    { mood: "content",
      text: "Salut, moi c'est Mira, l'ingénieure de la station. Cette machine, à côté de la tienne… c'est sa sœur. Elle est là depuis dix ans." },
    { mood: "neutre",
      text: "Elle attend sa pilote. Al3x1A est partie dans le passé chercher un remède contre la maladie de la mémoire, il y a longtemps. On n'a jamais eu de ses nouvelles. Regarde son portrait." },
  ],
  camille: [
    { mood: "neutre",
      text: "Al3x1A a pris la route il y a longtemps, dans le passé, pour trouver un remède. Elle connaissait bien les époques. Aucune nouvelle depuis. On attend, tout simplement, depuis dix ans." },
    { mood: "content",
      text: "Tu es la seule chronaute, aujourd'hui, à avoir traversé les époques comme elle. Retourne voir Elias — il a quelque chose à te demander." },
  ],
  finale: [
    { mood: "content",
      text: "Tu as tout entendu. Alors voilà : tu es la seule chronaute qui connaisse encore les époques. Al3x1A est là-bas, quelque part. Tu la retrouverais ?" },
  ],
};

/* -------------------- PORTRAITS SVG -------------------- */
function PortraitElias({ mood = "neutre" }) {
  const eyes = mood === "content" ? -1 : mood === "vexe" ? 1.5 : 0;
  return (
    <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="el-tunique" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8a878" /><stop offset="100%" stopColor="#8a6848" /></linearGradient>
      </defs>
      <rect width="200" height="240" fill="#2a3040" />
      {/* halo doux derrière */}
      <circle cx="100" cy="90" r="80" fill="#f8e0a0" opacity="0.15" />
      {/* épaules et tunique en lin brut */}
      <path d="M20 240 L20 190 Q20 160 60 150 L140 150 Q180 160 180 190 L180 240 Z" fill="url(#el-tunique)" stroke="#5a3818" strokeWidth="1.5" />
      {/* col ouvert */}
      <path d="M60 150 L100 175 L140 150" stroke="#5a3818" strokeWidth="1.5" fill="none" />
      {/* cou */}
      <ellipse cx="100" cy="135" rx="18" ry="14" fill="#e0b898" />
      {/* tête */}
      <ellipse cx="100" cy="80" rx="52" ry="60" fill="#e0b898" stroke="#5a3818" strokeWidth="1.5" />
      {/* cheveux blancs mi-longs */}
      <path d="M52 60 Q60 20 100 18 Q140 20 148 60 Q152 90 145 105 L138 100 Q140 60 130 45 Q100 30 70 45 Q60 60 62 100 L55 105 Q48 90 52 60 Z" fill="#e8e8e0" stroke="#8a8880" strokeWidth="1" />
      {/* barbe blanche courte */}
      <path d="M60 115 Q80 145 100 148 Q120 145 140 115 Q140 130 125 140 Q100 145 75 140 Q60 130 60 115 Z" fill="#e8e8e0" stroke="#8a8880" strokeWidth="0.6" />
      {/* moustache */}
      <path d="M78 108 Q90 112 100 110 Q110 112 122 108 Q118 115 100 115 Q82 115 78 108 Z" fill="#e8e8e0" />
      {/* yeux sages */}
      <ellipse cx="82" cy="82" rx="6" ry="4" fill="#f8f4e8" />
      <ellipse cx="118" cy="82" rx="6" ry="4" fill="#f8f4e8" />
      <circle cx={82 + eyes} cy="82" r="2.6" fill="#2a3860" />
      <circle cx={118 + eyes} cy="82" r="2.6" fill="#2a3860" />
      {/* sourcils blancs broussailleux */}
      <path d="M74 72 q6 -4 16 -2 M112 70 q6 -4 16 2" stroke="#e8e8e0" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* rides autour des yeux */}
      <path d="M70 88 q4 4 8 4 M126 88 q-4 4 -8 4" stroke="#8a6828" strokeWidth="0.6" fill="none" opacity="0.5" />
      {/* nez */}
      <path d="M100 88 L96 105 L104 105" stroke="#8a6828" strokeWidth="1" fill="none" />
      {/* bouche */}
      {mood === "content"
        ? <path d="M84 122 Q100 132 116 122" stroke="#5a3818" strokeWidth="2" fill="none" strokeLinecap="round" />
        : mood === "vexe"
        ? <path d="M84 128 Q100 122 116 128" stroke="#5a3818" strokeWidth="2" fill="none" strokeLinecap="round" />
        : <path d="M86 125 L114 125" stroke="#5a3818" strokeWidth="2" strokeLinecap="round" />}
      {/* petite médaille pendue au cou (symbole des chronautes) */}
      <circle cx="100" cy="180" r="8" fill="#c8a848" stroke="#8a6820" strokeWidth="1" />
      <path d="M100 172 L100 168" stroke="#8a6820" strokeWidth="1" />
      <text x="100" y="184" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5a4020">🕰</text>
    </svg>
  );
}

function PortraitMira({ mood = "neutre" }) {
  const eyes = mood === "content" ? -1 : mood === "vexe" ? 1.5 : 0;
  return (
    <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="mi-veste" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a5878" /><stop offset="100%" stopColor="#1a3858" /></linearGradient>
      </defs>
      <rect width="200" height="240" fill="#2a3040" />
      <circle cx="100" cy="90" r="80" fill="#7fd8ff" opacity="0.12" />
      {/* épaules / veste d'ingénieure avec pièces cousues */}
      <path d="M20 240 L20 185 Q20 155 55 148 L145 148 Q180 155 180 185 L180 240 Z" fill="url(#mi-veste)" stroke="#0e1830" strokeWidth="1.5" />
      {/* poche avec outils */}
      <rect x="60" y="180" width="30" height="24" fill="#2a4868" stroke="#0e1830" strokeWidth="0.8" />
      <path d="M68 176 L68 172 L76 172 L76 176 M82 176 L82 172 L88 172 L88 176" stroke="#c8b8a0" strokeWidth="1.4" />
      {/* col en V */}
      <path d="M60 148 L100 168 L140 148" stroke="#0e1830" strokeWidth="1.5" fill="none" />
      {/* cou */}
      <ellipse cx="100" cy="135" rx="16" ry="12" fill="#c8946a" />
      {/* tête ovale */}
      <ellipse cx="100" cy="80" rx="50" ry="58" fill="#c8946a" stroke="#5a3818" strokeWidth="1.5" />
      {/* tresses noires attachées de chaque côté */}
      <path d="M52 60 Q52 30 78 22 Q92 20 100 22 Q108 20 122 22 Q148 30 148 60 L150 90 L142 88 Q145 60 138 45 Q125 30 100 28 Q75 30 62 45 Q55 60 58 88 L50 90 Z" fill="#1a1408" />
      {/* tresses qui descendent */}
      <path d="M52 70 Q42 100 46 140 L52 138 Q50 100 58 74 Z" fill="#1a1408" />
      <path d="M148 70 Q158 100 154 140 L148 138 Q150 100 142 74 Z" fill="#1a1408" />
      {/* rubans de couleur dans les tresses */}
      <rect x="45" y="115" width="10" height="4" fill="#e86028" />
      <rect x="145" y="115" width="10" height="4" fill="#7fd8ff" />
      {/* yeux vifs */}
      <ellipse cx="82" cy="82" rx="6" ry="4.5" fill="#f8f4e8" />
      <ellipse cx="118" cy="82" rx="6" ry="4.5" fill="#f8f4e8" />
      <circle cx={82 + eyes} cy="82" r="2.8" fill="#2a1810" />
      <circle cx={118 + eyes} cy="82" r="2.8" fill="#2a1810" />
      {/* sourcils marqués */}
      <path d="M74 72 q6 -3 16 -1 M112 71 q6 -3 16 1" stroke="#1a1408" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* nez */}
      <path d="M100 88 L97 105 L103 105" stroke="#8a5828" strokeWidth="1" fill="none" />
      {/* bouche */}
      {mood === "content"
        ? <path d="M84 120 Q100 130 116 120" stroke="#5a1818" strokeWidth="2" fill="none" strokeLinecap="round" />
        : mood === "vexe"
        ? <path d="M84 126 Q100 120 116 126" stroke="#5a1818" strokeWidth="2" fill="none" strokeLinecap="round" />
        : <path d="M86 124 L114 124" stroke="#5a1818" strokeWidth="2" strokeLinecap="round" />}
      {/* rouge à lèvres discret */}
      <path d="M84 120 Q100 128 116 120" stroke="#c85028" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* boucle d'oreille en spirale */}
      <circle cx="50" cy="100" r="3" fill="none" stroke="#c8a848" strokeWidth="1.2" />
      <circle cx="150" cy="100" r="3" fill="none" stroke="#c8a848" strokeWidth="1.2" />
    </svg>
  );
}

/* Al3x1A apparaît dans un CADRE-photo posé sur la MARTINE-jumelle. */
function PortraitAl3x1ACadre({ mood = "neutre" }) {
  return (
    <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="ca-tunique" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a0a0b0" /><stop offset="100%" stopColor="#606878" /></linearGradient>
      </defs>
      <rect width="200" height="240" fill="#181820" />
      {/* cadre-photo en bois patiné */}
      <rect x="16" y="16" width="168" height="208" fill="none" stroke="#8a6838" strokeWidth="8" />
      <rect x="22" y="22" width="156" height="196" fill="#2a2830" />
      {/* halo mémoire */}
      <circle cx="100" cy="100" r="70" fill="#f0e0c0" opacity="0.12" />
      {/* ruban noir de deuil sur le coin haut-droit du cadre */}
      <path d="M170 20 L184 20 L184 40 L172 46 L162 40 Z" fill="#1a1408" opacity="0.9" />
      <path d="M174 24 l6 8" stroke="#3a2818" strokeWidth="0.6" />
      {/* épaules / tunique de voyage grise */}
      <path d="M30 220 L30 175 Q30 150 60 143 L140 143 Q170 150 170 175 L170 220 Z" fill="url(#ca-tunique)" stroke="#3a4048" strokeWidth="1.2" />
      {/* insigne chronaute sur l'épaule (petit compas) */}
      <circle cx="60" cy="165" r="7" fill="#c8a848" stroke="#5a4020" strokeWidth="0.8" />
      <path d="M60 160 L60 170 M55 165 L65 165" stroke="#5a4020" strokeWidth="0.8" />
      {/* cou */}
      <ellipse cx="100" cy="132" rx="15" ry="12" fill="#d0a888" />
      {/* tête ovale */}
      <ellipse cx="100" cy="80" rx="48" ry="56" fill="#d0a888" stroke="#5a3818" strokeWidth="1.2" />
      {/* cheveux mi-longs attachés (chignon flou), traits androgynes */}
      <path d="M55 62 Q60 25 100 22 Q140 25 145 62 L148 90 L140 88 Q142 60 132 45 Q100 30 68 45 Q58 60 60 88 L52 90 Z" fill="#4a3828" />
      {/* frange souple */}
      <path d="M65 55 Q75 40 100 42 Q125 40 135 55 Q125 62 100 60 Q75 62 65 55 Z" fill="#3a2818" />
      {/* petit chignon sur le côté */}
      <ellipse cx="145" cy="70" rx="8" ry="6" fill="#4a3828" />
      {/* yeux calmes, ouverts */}
      <ellipse cx="82" cy="82" rx="6" ry="4" fill="#f8f4e8" />
      <ellipse cx="118" cy="82" rx="6" ry="4" fill="#f8f4e8" />
      <circle cx="82" cy="82" r="2.6" fill="#3a2818" />
      <circle cx="118" cy="82" r="2.6" fill="#3a2818" />
      {/* sourcils fins et doux */}
      <path d="M74 74 q8 -3 16 -1 M112 73 q8 -3 16 1" stroke="#3a2818" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* nez fin */}
      <path d="M100 88 L98 105 L102 105" stroke="#8a5828" strokeWidth="0.8" fill="none" />
      {/* léger sourire mystérieux */}
      <path d="M86 122 Q100 128 114 122" stroke="#5a2818" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* légère cicatrice fine sur la joue (souvenir de voyage) */}
      <path d="M124 92 l4 8" stroke="#8a5828" strokeWidth="0.6" opacity="0.6" />
      {/* légende sous le portrait */}
      <text x="100" y="235" textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" letterSpacing="1.5" fill="#8a7860">AL3X1A · DISPARUE 2277</text>
    </svg>
  );
}

const PORTRAITS = { elias: PortraitElias, mira: PortraitMira, camille: PortraitAl3x1ACadre };

/* Export : la portrait d'Elias est réutilisée dans l'écran ÉPILOGUE
   pour son ultime question sur le support à choisir. */
export { PortraitElias };
const NAMES = { elias: "Elias", mira: "Mira", camille: "Portrait d'Al3x1A" };

/* -------------------- DÉCOR DE LA STATION -------------------- */
function DecorStation({ onClickPerso, done }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5878a8" /><stop offset="60%" stopColor="#c8b878" /><stop offset="100%" stopColor="#e0c898" /></linearGradient>
        <linearGradient id="st-sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a7858" /><stop offset="100%" stopColor="#3a2818" /></linearGradient>
        <linearGradient id="st-dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a8b8c8" stopOpacity="0.7" /><stop offset="100%" stopColor="#5a6878" stopOpacity="0.85" /></linearGradient>
        <radialGradient id="st-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff4c8" stopOpacity="0.7" /><stop offset="100%" stopColor="#f8c058" stopOpacity="0" /></radialGradient>
      </defs>
      {/* CIEL doux post-apo lumineux */}
      <rect width="1000" height="280" fill="url(#st-sky)" />
      {/* soleil chaleureux au loin */}
      <circle cx="180" cy="80" r="80" fill="url(#st-sun)" />
      <circle cx="180" cy="80" r="24" fill="#fff4c8" opacity="0.9" />
      {/* nuages doux + traînée */}
      <ellipse cx="440" cy="60" rx="120" ry="7" fill="#f0e0c0" opacity="0.6" />
      <ellipse cx="740" cy="90" rx="100" ry="5" fill="#f0e0c0" opacity="0.5" />
      <ellipse cx="620" cy="120" rx="140" ry="4" fill="#e0c898" opacity="0.35" />
      {/* traînée orange lointaine (pollution résiduelle qui s'estompe) */}
      <ellipse cx="500" cy="180" rx="500" ry="10" fill="#c88848" opacity="0.15" />

      {/* Oiseaux au loin (V) — la vie revient */}
      <g opacity="0.55" transform="translate(560,140)">
        <path d="M0 0 q-3 -3 -6 0 M0 0 q3 -3 6 0" stroke="#3a2818" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M22 12 q-3 -3 -6 0 M22 12 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M-22 12 q-3 -3 -6 0 M-22 12 q3 -3 6 0" stroke="#3a2818" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>

      {/* MONTAGNES LOINTAINES (bleu-lavande) */}
      <path d="M0 280 L0 200 Q120 170 240 190 Q360 175 480 195 Q600 175 720 200 Q840 175 960 195 L1000 200 L1000 280 Z" fill="#8898b0" opacity="0.5" />
      {/* neige sur les sommets */}
      <path d="M120 175 l16 12 l-10 4 l-6 -8 z M480 195 l14 8 l-8 4 l-6 -6 z M720 200 l12 8 l-8 4 l-4 -6 z" fill="#f0f0e8" opacity="0.7" />

      {/* Collines rapprochées avec vestiges de villes */}
      <path d="M0 280 L0 220 Q80 200 160 210 Q240 220 320 205 Q400 220 480 200 Q560 220 640 205 Q720 220 800 205 Q880 220 1000 210 L1000 280 Z" fill="#6a7898" opacity="0.75" />
      {/* Silhouettes de gratte-ciels EFFONDRÉS au loin, plus nombreux, plus détaillés */}
      {[[80, 220, 30, 70, 0.85], [140, 218, 28, 55, 0.6], [220, 215, 40, 90, 0.9], [280, 220, 24, 45, 0.75], [340, 210, 32, 100, 0.95], [400, 218, 26, 60, 0.8], [500, 215, 36, 95, 0.9], [560, 220, 22, 40, 0.7], [610, 210, 44, 105, 0.95], [680, 218, 28, 65, 0.8], [750, 212, 34, 85, 0.9], [820, 218, 26, 55, 0.75], [880, 210, 38, 90, 0.85], [940, 218, 24, 50, 0.7]].map(([x, y, w, h, o], i) => {
        // certains gratte-ciels sont effondrés en biais
        const cassure = i % 3 === 1;
        const inclinaison = i % 4 === 2 ? 6 : 0;
        return (
          <g key={i} opacity={o} transform={`translate(${x},${y}) rotate(${inclinaison})`}>
            {cassure ? (
              // silhouette cassée en son milieu
              <path d={`M0 0 L0 -${h * 0.6} L${w * 0.3} -${h * 0.7} L${w * 0.5} -${h * 0.4} L${w} -${h * 0.5} L${w} 0 Z`} fill="#2a3448" />
            ) : (
              <path d={`M0 0 L0 -${h} L${w * 0.6} -${h + 4} L${w * 0.6} -${h * 0.65} L${w} -${h * 0.55} L${w} 0 Z`} fill="#2a3448" />
            )}
            {/* fenêtres carrées cassées */}
            {Array.from({ length: Math.floor(h / 12) }).map((_, k) => (
              <g key={k}>
                <rect x={w * 0.15} y={-h + k * 12 + 4} width="3" height="3" fill={k % 2 ? "#0a0c14" : "#5a6878"} opacity="0.7" />
                <rect x={w * 0.4} y={-h + k * 12 + 4} width="3" height="3" fill={k % 3 ? "#0a0c14" : "#5a6878"} opacity="0.7" />
                <rect x={w * 0.7} y={-h + k * 12 + 4} width="3" height="3" fill={k % 2 ? "#0a0c14" : "#5a6878"} opacity="0.7" />
              </g>
            ))}
            {/* poutrelles d'acier apparentes au sommet cassé */}
            {cassure && (
              <path d={`M${w * 0.3} -${h * 0.7} L${w * 0.35} -${h * 0.8} M${w * 0.4} -${h * 0.72} L${w * 0.42} -${h * 0.85}`} stroke="#5a5060" strokeWidth="0.6" opacity="0.7" />
            )}
          </g>
        );
      })}

      {/* Végétation qui reprend ses droits — lierre, mousses vertes qui remontent sur les vestiges */}
      <path d="M50 220 q4 -20 8 -30 M180 218 q6 -30 12 -50 M280 220 q4 -20 8 -35 M400 218 q5 -22 10 -38 M560 220 q4 -22 8 -36 M700 218 q6 -30 12 -50 M820 218 q4 -20 8 -36 M940 218 q3 -18 6 -30" stroke="#4a6828" strokeWidth="1.5" fill="none" opacity="0.75" />
      {/* touffes vertes au sommet des gratte-ciels effondrés */}
      {[[100, 155], [240, 130], [365, 115], [520, 125], [630, 110], [770, 130], [900, 125]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="8" ry="4" fill="#5a7838" opacity="0.85" />
      ))}
      {/* petit arbre pionnier sur une tour effondrée */}
      <g transform="translate(370,110)">
        <path d="M0 0 L0 -12" stroke="#3a2818" strokeWidth="1.2" />
        <ellipse cx="0" cy="-14" rx="6" ry="4" fill="#4a6828" />
        <ellipse cx="-2" cy="-16" rx="5" ry="3" fill="#5a7838" />
      </g>

      {/* SOL de terre battue — commence sous les collines */}
      <rect y="280" width="1000" height="280" fill="url(#st-sol)" />
      {/* Fissures et détritus sur le sol (côté désaffecté) */}
      <path d="M0 340 q60 -3 120 3 q80 6 160 -2 q80 -5 160 4 q80 6 160 -3 q80 -5 160 3 q80 6 160 -2" stroke="#3a2818" strokeWidth="0.6" fill="none" opacity="0.7" />
      <path d="M0 400 q100 4 200 -3 q100 -5 200 4 q100 5 200 -2 q100 -5 200 3 q100 4 200 -2" stroke="#3a2818" strokeWidth="0.6" fill="none" opacity="0.5" />
      {/* débris épars, tôles rouillées au sol, câbles pendants */}
      <path d="M60 470 q20 -6 40 2 q-16 4 -40 -2 Z" fill="#7a3818" opacity="0.7" />
      <path d="M920 480 q-16 -4 -32 4 q12 4 32 -4 Z" fill="#7a3818" opacity="0.65" />
      <path d="M420 490 l30 0 l-2 6 l-26 0 z" fill="#4a5060" opacity="0.7" />
      <path d="M780 500 l24 -2 l-3 8 l-20 0 z" fill="#4a5060" opacity="0.65" />
      {/* jardins hydroponiques en rangs (au premier plan) */}
      {[[100, 490], [220, 500], [860, 490]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="70" ry="8" fill="#3a4a28" opacity="0.75" />
          {[0, 12, 24, 36, 48].map((dx, j) => (
            <path key={j} d={`M${x - 48 + dx * 2} ${y - 4} q2 -12 4 -18`} stroke="#4a6a30" strokeWidth="1.4" fill="none" />
          ))}
          {/* fleurs oranges = tomates */}
          <circle cx={x - 20} cy={y - 12} r="2" fill="#e86028" />
          <circle cx={x + 10} cy={y - 14} r="2" fill="#e86028" />
        </g>
      ))}

      {/* ÉOLIENNE bricolée à gauche, plus haute pour se voir */}
      <g transform="translate(80,290)">
        <rect x="-3" y="0" width="6" height="120" fill="#8a8890" stroke="#3a4048" strokeWidth="0.4" />
        {/* haubans */}
        <path d="M0 40 L-30 120 M0 40 L30 120" stroke="#5a5860" strokeWidth="0.5" opacity="0.7" />
        <circle cx="0" cy="0" r="5" fill="#5a5860" stroke="#2a2830" strokeWidth="0.5" />
        {/* pales en tôle rouillée */}
        <g style={{ animation: "spin 10s linear infinite", transformOrigin: "0 0" }}>
          <path d="M0 0 L-4 -34 L4 -34 Z" fill="#a06848" stroke="#5a3018" strokeWidth="0.4" />
          <path d="M0 0 L30 -8 L30 -4 Z" fill="#a06848" stroke="#5a3018" strokeWidth="0.4" />
          <path d="M0 0 L-4 34 L4 34 Z" fill="#a06848" stroke="#5a3018" strokeWidth="0.4" />
          <path d="M0 0 L-30 8 L-30 4 Z" fill="#a06848" stroke="#5a3018" strokeWidth="0.4" />
        </g>
      </g>

      {/* PANNEAUX SOLAIRES patchés à droite */}
      <g transform="translate(920,340)">
        <path d="M-40 0 L40 0 L60 -60 L-20 -60 Z" fill="#1a2038" stroke="#3a4058" strokeWidth="1" />
        {[[-30, -50], [-10, -50], [10, -50], [30, -50], [-25, -30], [-5, -30], [15, -30], [35, -30], [-20, -10], [0, -10], [20, -10], [40, -10]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="16" height="14" fill={i === 3 || i === 8 ? "#5a3818" : "#3a5090"} stroke="#0a1830" strokeWidth="0.4" />
        ))}
        {/* patch de bâche sur une cellule cassée */}
        <path d="M-12 -46 L-2 -50 L6 -46 L-2 -38 Z" fill="#a04828" opacity="0.6" />
        <rect x="-4" y="0" width="8" height="30" fill="#5a5860" stroke="#2a2830" strokeWidth="0.4" />
      </g>

      {/* DÔME GÉODÉSIQUE bricolé au centre-arrière — remonté */}
      <g transform="translate(500,290)">
        <ellipse cx="0" cy="10" rx="130" ry="10" fill="#1a1408" opacity="0.55" />
        <path d="M-130 8 A 130 90 0 0 1 130 8 Z" fill="url(#st-dome)" stroke="#3a4858" strokeWidth="1.5" />
        {/* nervures géodésiques */}
        <path d="M-130 8 L-85 -60 L-30 -85 L30 -85 L85 -60 L130 8 M-130 8 L-65 -80 L0 -90 L65 -80 L130 8 M-85 -60 L0 -55 L85 -60 M-30 -85 L-65 -80 L0 -55 L65 -80 L30 -85" stroke="#3a4858" strokeWidth="0.8" fill="none" opacity="0.7" />
        {/* patch de bâche colorée cousue */}
        <path d="M-65 -50 L-30 -85 L0 -55 Z" fill="#a04828" opacity="0.5" />
        <path d="M40 -50 L65 -80 L85 -60 Z" fill="#3a80a8" opacity="0.4" />
        {/* fissures dans le dôme (côté désaffecté) */}
        <path d="M-100 -20 l-4 -6 M-60 -55 l-3 -5 M50 -40 l4 -6" stroke="#1a1408" strokeWidth="0.5" opacity="0.6" />
        {/* porte au centre */}
        <path d="M-16 8 L-16 -20 Q-16 -30 0 -30 Q16 -30 16 -20 L16 8 Z" fill="#3a2818" stroke="#1a1408" strokeWidth="0.8" />
        <circle cx="10" cy="-10" r="1.4" fill="#c8a848" />
        {/* lumière chaleureuse qui filtre */}
        <path d="M-14 6 L14 6 L14 -18 L-14 -18 Z" fill="#f8d878" opacity="0.35" />
        {/* antenne + réception au sommet */}
        <path d="M0 -95 L0 -125" stroke="#5a5860" strokeWidth="1.5" />
        <circle cx="0" cy="-130" r="4" fill="#5eff9e" style={{ animation: "pulse 2s infinite" }} />
      </g>

      {/* MARTINE-JUMELLE (Al3x1A) — remontée sur sa plateforme */}
      <g transform="translate(760,340)">
        <rect x="-40" y="0" width="80" height="28" fill="#5a5860" stroke="#1a1408" strokeWidth="1" />
        <rect x="-42" y="-2" width="84" height="4" fill="#3a4048" />
        {/* rouille / fissure sur la plateforme */}
        <path d="M-30 6 l60 0 M-20 14 l40 0" stroke="#2a2028" strokeWidth="0.4" opacity="0.6" />
        {/* corps noix de la MARTINE, poussière/patine */}
        <ellipse cx="0" cy="-24" rx="28" ry="26" fill="#7a5028" stroke="#3a1810" strokeWidth="1.5" opacity="0.85" />
        <path d="M-20 -32 q20 -8 40 0 M-22 -22 q22 -6 44 0 M-20 -12 q20 -6 40 0" stroke="#3a1810" strokeWidth="0.4" fill="none" opacity="0.5" />
        {/* poussière/toiles d'araignée */}
        <path d="M-24 -30 L-14 -22 M22 -34 L14 -26" stroke="#a8a898" strokeWidth="0.3" opacity="0.5" />
        {/* œil éteint (gris/noir) */}
        <circle cx="0" cy="-28" r="9" fill="#3a3838" stroke="#1a1408" strokeWidth="1" />
        <circle cx="0" cy="-28" r="4" fill="#1a1808" />
        {/* antenne pliée */}
        <path d="M0 -48 L4 -58 L-2 -66" stroke="#3a2018" strokeWidth="1.5" fill="none" />
        <circle cx="-2" cy="-66" r="2.4" fill="#5a5858" />
        {/* RUBAN NOIR DE DEUIL */}
        <path d="M-30 -20 Q0 -14 30 -20 L32 -14 Q0 -8 -32 -14 Z" fill="#1a1408" stroke="#0a0806" strokeWidth="0.5" />
        <path d="M-4 -10 L-8 4 L-2 -2 L2 -2 L8 4 L4 -10" fill="#1a1408" stroke="#0a0806" strokeWidth="0.5" />
        {/* plaque gravée */}
        <rect x="-24" y="6" width="48" height="10" fill="#c8b8a0" stroke="#5a4028" strokeWidth="0.5" />
        <text x="0" y="14" textAnchor="middle" fontSize="6" fontFamily="Georgia, serif" fontWeight="700" fill="#3a2818">AL3X1A · 2277</text>
      </g>

      {/* Câbles pendants du plafond (côté désaffecté) */}
      <path d="M240 0 q-4 40 8 80" stroke="#3a2818" strokeWidth="1.4" fill="none" opacity="0.7" />
      <path d="M240 0 q-4 40 8 80" stroke="#5a4028" strokeWidth="0.6" fill="none" opacity="0.7" />
      <path d="M820 0 q4 30 -6 60" stroke="#3a2818" strokeWidth="1.2" fill="none" opacity="0.7" />

      {/* ELIAS debout au centre-gauche — cliquable */}
      <g transform="translate(320,320)" onClick={() => onClickPerso?.("elias")} style={{ cursor: "pointer" }}>
        {/* zone cliquable élargie invisible */}
        <rect x="-50" y="-60" width="100" height="130" fill="transparent" />
        <ellipse cx="0" cy="66" rx="30" ry="4" fill="#0a0604" opacity="0.55" />
        {/* jambes en pantalon de lin */}
        <rect x="-14" y="20" width="10" height="46" fill="#8a6848" stroke="#5a3820" strokeWidth="0.6" />
        <rect x="4" y="20" width="10" height="46" fill="#8a6848" stroke="#5a3820" strokeWidth="0.6" />
        {/* tunique large */}
        <path d="M-22 30 Q-24 -12 -4 -22 L4 -22 Q24 -12 22 30 Z" fill="#c8a878" stroke="#5a3818" strokeWidth="0.8" />
        <path d="M-6 -20 L-6 30 M6 -20 L6 30" stroke="#8a6848" strokeWidth="0.5" />
        {/* épaules */}
        <ellipse cx="-20" cy="-10" rx="6" ry="5" fill="#e0b898" />
        <ellipse cx="20" cy="-10" rx="6" ry="5" fill="#e0b898" />
        {/* bras qui s'ouvrent en accueil */}
        <path d="M-20 -8 Q-34 8 -38 26" stroke="#e0b898" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M20 -8 Q34 8 38 26" stroke="#e0b898" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* tête */}
        <ellipse cx="0" cy="-38" rx="13" ry="16" fill="#e0b898" stroke="#5a3818" strokeWidth="0.8" />
        {/* cheveux blancs */}
        <path d="M-11 -46 q4 -16 11 -18 q7 2 11 18 q-4 -4 -11 -2 q-7 -2 -11 2 Z" fill="#e8e8e0" />
        {/* barbe */}
        <path d="M-8 -32 q8 12 16 0 q-1 8 -5 12 q-4 3 -6 0 q-4 -4 -5 -12 z" fill="#e8e8e0" />
        <circle cx="-4" cy="-38" r="1.4" fill="#2a3860" />
        <circle cx="4" cy="-38" r="1.4" fill="#2a3860" />
        {/* médaille au cou */}
        <circle cx="0" cy="-10" r="4.5" fill="#c8a848" stroke="#8a6820" strokeWidth="0.6" />
      </g>
      {/* « ? » au-dessus d'Elias — jaune tant qu'il n'a pas fini de parler ;
          vert ✓ entre les étapes, PUIS RE-JAUNE une fois tous les autres
          écoutés (ultime question). */}
      {(!done?.elias || done?.finalReady) && (
        <g transform="translate(320,258)" onClick={() => onClickPerso?.("elias")} style={{ animation: "float 2s ease-in-out infinite", cursor: "pointer" }}>
          <circle r="16" fill="#ffd166" stroke="#8a5a20" strokeWidth="2" />
          <text y="6" textAnchor="middle" fontSize="20" fontWeight="800" fill="#3a2410">?</text>
        </g>
      )}
      {done?.elias && !done?.finalReady && (
        <g transform="translate(320,258)">
          <circle r="10" fill="#5eff9e" stroke="#2a4028" strokeWidth="1.5" opacity="0.8" />
          <text y="4" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0a2010">✓</text>
        </g>
      )}

      {/* MIRA à droite du dôme — cliquable */}
      <g transform="translate(660,335)" onClick={() => onClickPerso?.("mira")} style={{ cursor: "pointer" }}>
        <rect x="-40" y="-60" width="90" height="120" fill="transparent" />
        <ellipse cx="0" cy="52" rx="24" ry="4" fill="#0a0604" opacity="0.55" />
        {/* jambes en salopette */}
        <rect x="-10" y="-4" width="8" height="54" fill="#3a5878" stroke="#0e1830" strokeWidth="0.6" />
        <rect x="2" y="-4" width="8" height="54" fill="#3a5878" stroke="#0e1830" strokeWidth="0.6" />
        {/* torse en veste d'ingénieure */}
        <path d="M-18 4 Q-20 -22 -4 -30 L4 -30 Q20 -22 18 4 Z" fill="#3a5878" stroke="#0e1830" strokeWidth="0.6" />
        {/* poche outils */}
        <rect x="-14" y="-14" width="12" height="14" fill="#2a4868" stroke="#0e1830" strokeWidth="0.4" />
        <path d="M-11 -18 L-11 -22 L-6 -22 L-6 -18" stroke="#c8b8a0" strokeWidth="1.2" />
        {/* épaules */}
        <ellipse cx="-16" cy="-18" rx="5" ry="4" fill="#c8946a" />
        <ellipse cx="16" cy="-18" rx="5" ry="4" fill="#c8946a" />
        {/* bras droit qui pointe la MARTINE-jumelle */}
        <path d="M18 -14 Q30 -22 44 -30" stroke="#c8946a" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* tête */}
        <ellipse cx="0" cy="-42" rx="12" ry="14" fill="#c8946a" stroke="#5a3818" strokeWidth="0.6" />
        {/* tresses attachées */}
        <path d="M-12 -50 q4 -14 12 -14 q8 0 12 14 q-4 -2 -12 0 q-8 -2 -12 0 Z" fill="#1a1408" />
        <path d="M-12 -40 L-14 -14 M12 -40 L14 -14" stroke="#1a1408" strokeWidth="3" strokeLinecap="round" />
        {/* rubans dans les tresses */}
        <rect x="-15" y="-24" width="4" height="2" fill="#e86028" />
        <rect x="11" y="-24" width="4" height="2" fill="#7fd8ff" />
        <circle cx="-4" cy="-42" r="1.4" fill="#2a1810" />
        <circle cx="4" cy="-42" r="1.4" fill="#2a1810" />
      </g>
      {/* « ? » au-dessus de Mira — apparaît quand Elias a été écouté */}
      {done?.elias && !done?.mira && (
        <g transform="translate(660,270)" onClick={() => onClickPerso?.("mira")} style={{ animation: "float 2s ease-in-out infinite", cursor: "pointer" }}>
          <circle r="16" fill="#ffd166" stroke="#8a5a20" strokeWidth="2" />
          <text y="6" textAnchor="middle" fontSize="20" fontWeight="800" fill="#3a2410">?</text>
        </g>
      )}
      {done?.mira && (
        <g transform="translate(660,270)">
          <circle r="10" fill="#5eff9e" stroke="#2a4028" strokeWidth="1.5" opacity="0.8" />
          <text y="4" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0a2010">✓</text>
        </g>
      )}
      {/* Zone cliquable sur la MARTINE-jumelle avec le portrait de Al3x1A */}
      <g transform="translate(760,290)" onClick={() => onClickPerso?.("camille")} style={{ cursor: done?.mira ? "pointer" : "default" }}>
        <rect x="-45" y="-30" width="90" height="80" fill="transparent" />
      </g>
      {done?.mira && !done?.camille && (
        <g transform="translate(760,265)" onClick={() => onClickPerso?.("camille")} style={{ animation: "float 2s ease-in-out infinite", cursor: "pointer" }}>
          <circle r="16" fill="#ffd166" stroke="#8a5a20" strokeWidth="2" />
          <text y="6" textAnchor="middle" fontSize="20" fontWeight="800" fill="#3a2410">?</text>
        </g>
      )}
      {done?.camille && (
        <g transform="translate(760,265)">
          <circle r="10" fill="#5eff9e" stroke="#2a4028" strokeWidth="1.5" opacity="0.8" />
          <text y="4" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0a2010">✓</text>
        </g>
      )}
    </svg>
  );
}

/* -------------------- LE COMPOSANT PRINCIPAL -------------------- */
/* Boîte de dialogue d'un chronaute : portrait + texte typewriter + boutons.
   Extraite en composant pour que le hook useTypewriter puisse s'appuyer sur
   step.text sans re-monter la parent tree. Le bouton "Suite/Fermer" reste
   grisé tant que la révélation n'est pas terminée ; cliquer sur le texte
   saute à la fin (utile en démo classe). */
function ChronauteDialogueBox({ step, persoName, prenom, idx, total, isLast, onNext, onClose, Portrait }) {
  const rawText = step.text.replace("{prenom}", prenom || "chronaute");
  const { shown, done, skip } = useTypewriter(rawText);
  /* Clic n'importe où sur la boîte de dialogue : d'abord révèle tout le
     texte, puis passe au suivant (ou ferme si dernier). */
  const advance = () => { if (!done) skip(); else if (isLast) onClose(); else onNext(); };
  return (
    <div onClick={advance}
      style={{ position: "relative", zIndex: 2, padding: "12px 20px 20px", background: "linear-gradient(180deg,#0c122000 0%,#0c1220ee 40%,#080d16 100%)", display: "flex", gap: 16, alignItems: "flex-end", animation: "fadein 0.3s ease-out", cursor: "pointer" }}>
      <div style={{ width: 160, height: 190, flex: "0 0 auto", borderRadius: 12, overflow: "hidden", border: "2px solid #ffd166", boxShadow: "0 8px 32px rgba(0,0,0,0.65)" }}>
        <Portrait mood={step.mood} />
      </div>
      <div style={{ flex: 1, background: "#0e1420ee", border: "1px solid #2a3648", borderRadius: 12, padding: "12px 16px", minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        title={done ? "Cliquer n'importe où pour continuer" : "Cliquer pour tout afficher"}>
        <div>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#ffd166", marginBottom: 6 }}>
            {persoName.toUpperCase()}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#e8eef5", margin: 0 }}>
            « {shown}{!done && <span style={{ opacity: 0.7 }}>▮</span>} »
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd" }}>{idx + 1} / {total}</div>
          {!isLast ? (
            <button onClick={(e) => { e.stopPropagation(); if (done) onNext(); }}
              disabled={!done}
              style={{ background: done ? "#141b26" : "#0e1420", color: done ? "#ffd166" : "#3a3020", border: `1px solid ${done ? "#5a4a20" : "#26324a"}`, borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: done ? "pointer" : "default", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 1, transition: "all .2s" }}>
              Suite ▸
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); if (done) onClose(); }}
              disabled={!done}
              style={{ background: done ? "#141b26" : "#0e1420", color: done ? "#5eff9e" : "#2a3020", border: `1px solid ${done ? "#2a4028" : "#26324a"}`, borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: done ? "pointer" : "default", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 1, transition: "all .2s" }}>
              Fermer ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StationChronautes({ prenom, onContinue }) {
  /* Séquence d'épilogue en 3 phases :
       1. ARRIVÉE : Elias, confus à cause de la maladie de la mémoire,
          accueille le/la chronaute puis tend son carnet pour mieux
          expliquer que ses mots.
       2. CARNET : les 6 planches illustrées se lisent.
       3. STATION : décor, dialogues avec Mira et le portrait,
          question finale d'Elias. */
  const [phase, setPhase] = useState("arrivee"); // arrivee | carnet | station
  /* perso courant dont on lit les dialogues (null = personne, on voit
     juste le décor et les ? cliquables). Idx = index dans la séquence
     du perso courant. */
  const [perso, setPerso] = useState(null);
  const [idx, setIdx] = useState(0);
  /* Marqueurs de qui a été écouté — active les ? suivants + le bouton
     Continuer une fois tout le monde entendu. */
  const [done, setDone] = useState({ elias: false, mira: false, camille: false });
  const allDone = done.elias && done.mira && done.camille;
  /* Après avoir parlé aux 3, le clic sur Elias déclenche la question
     finale (séquence "finale"). Une fois celle-ci lue, bouton Continuer. */
  const [finalHeard, setFinalHeard] = useState(false);

  /* Phases 1 et 2 (arrivée + carnet) avant le décor complet.
     Les hooks au-dessus sont déjà tous déclarés → règle React OK. */
  if (phase === "arrivee") return <ArriveeElias prenom={prenom} onDone={() => setPhase("carnet")} />;
  if (phase === "carnet") return <CarnetElias onDone={() => setPhase("station")} />;

  const openPerso = (id) => {
    /* garde-fou : Mira n'est cliquable qu'après Elias, Al3x1A après Mira. */
    if (id === "mira" && !done.elias) return;
    if (id === "camille" && !done.mira) return;
    /* Elias après tout le monde → séquence finale */
    if (id === "elias" && allDone && !finalHeard) {
      setPerso("finale"); setIdx(0); return;
    }
    setPerso(id); setIdx(0);
  };

  const closeDialogue = () => {
    if (perso === "finale") { setFinalHeard(true); setPerso(null); return; }
    if (perso) { setDone((d) => ({ ...d, [perso]: true })); setPerso(null); }
  };

  const dialoguesActifs = perso ? DIALOGUES_PAR_PERSO[perso] : null;
  const step = dialoguesActifs?.[idx];
  const isLast = dialoguesActifs && idx >= dialoguesActifs.length - 1;
  const Portrait = perso && PORTRAITS[perso === "finale" ? "elias" : perso];
  const persoName = perso === "finale" ? "Elias" : NAMES[perso] || "";

  return (
    <div style={{ height: "100dvh", overflow: "hidden", background: "#080d16", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Décor plein cadre — cliquable. On passe un flag "finalReady"
          quand les 3 persos sont écoutés → le ? d'Elias redevient jaune. */}
      <div style={{ position: "absolute", inset: 0 }}>
        <DecorStation onClickPerso={openPerso} done={{ ...done, finalReady: allDone && !finalHeard }} />
      </div>
      {/* bandeau titre */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "10px 12px 0", background: "linear-gradient(180deg,#0c1220ee 0%,#0c122000 100%)", pointerEvents: "none" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#ffd166" }}>ÉPILOGUE · LA STATION DES CHRONAUTES · 2287</div>
        {!perso && !allDone && (
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#7fd8ff", marginTop: 4, opacity: 0.85 }}>
            Clique sur Elias pour commencer.
          </div>
        )}
        {!perso && allDone && !finalHeard && (
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#ffd166", marginTop: 4 }}>
            Retourne voir Elias pour sa question.
          </div>
        )}
      </div>

      {/* espaceur pour laisser voir le décor */}
      <div style={{ flex: 1 }} />

      {/* Portrait + dialogue collés en bas — s'affichent SEULEMENT quand
          on a cliqué sur un perso. Sinon on voit juste le décor. */}
      {perso && step && (
        <ChronauteDialogueBox
          step={step}
          persoName={persoName}
          prenom={prenom}
          idx={idx}
          total={dialoguesActifs.length}
          isLast={isLast}
          onNext={() => setIdx(idx + 1)}
          onClose={closeDialogue}
          Portrait={Portrait}
        />
      )}

      {/* Bouton CONTINUER — n'apparaît qu'une fois la question finale entendue */}
      {finalHeard && !perso && (
        <div style={{ position: "absolute", left: "50%", bottom: 40, transform: "translateX(-50%)", zIndex: 3 }}>
          <button onClick={onContinue}
            style={{ background: "#e8934a", color: "#160c02", border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 24px rgba(232,150,74,0.7)", animation: "glow 2.4s ease-in-out infinite" }}>
            J'ACCEPTE ▸
          </button>
        </div>
      )}
    </div>
  );
}
