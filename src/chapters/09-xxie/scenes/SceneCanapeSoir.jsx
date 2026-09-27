import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";

/* ============================================================
   CHAPITRE 10 (XXIe) — Tableau : LE CANAPÉ DU SOIR
   ------------------------------------------------------------
   Salon d'aujourd'hui, tard le soir. Un·e ado est vautré·e sur
   un canapé, smartphone en main (halo bleu qui éclaire son
   visage). Face à lui/elle, une grande TV connectée diffuse un
   flux info avec un bandeau qui défile. Sur la table basse, une
   tablette pose une image "à vérifier".
   ------------------------------------------------------------
   Deux mini-jeux :
   - CLIC sur le smartphone  → « Ton fil pour toi » (fil algo)
   - CLIC sur la tablette    → « Vrai, faux ou IA ? »
   ============================================================ */

export default function SceneCanapeSoir({ action, reveal, made = [], mode }) {
  const bulleFaite = made.includes("msg_algorithme");
  const factFaite  = made.includes("msg_deepfake");

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1224" />
          <stop offset="100%" stopColor="#050818" />
        </linearGradient>
        <linearGradient id="cs-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1218" />
          <stop offset="100%" stopColor="#080408" />
        </linearGradient>
        <linearGradient id="cs-couch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3f58" />
          <stop offset="100%" stopColor="#1a1c30" />
        </linearGradient>
        <radialGradient id="cs-tv-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#c0e0ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c0e0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cs-phone-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ═══ mur + sol ═══ */}
      <rect width="1000" height="420" fill="url(#cs-wall)" />
      <rect y="420" width="1000" height="140" fill="url(#cs-floor)" />

      {/* halo bleuté de la TV qui baigne toute la pièce */}
      <ellipse cx="700" cy="260" rx="480" ry="280" fill="url(#cs-tv-glow)" />

      {/* ═══ ARRIÈRE-PLAN : TV MURALE + MEUBLE ═══ */}
      <PLayer depth={3}>
        {/* meuble bas noir laqué */}
        <rect x="480" y="308" width="480" height="60" fill="#0a0a12" stroke="#1a1a26" strokeWidth="1.5" rx="3" />
        <rect x="484" y="312" width="472" height="4" fill="#1a1a26" />
        <circle cx="530" cy="352" r="3" fill="#4ae0ff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="544" y="356" fontSize="6" fontFamily="ui-monospace,monospace" fill="#4ae0ff" opacity="0.7">BOX · WI-FI</text>

        {/* Grand écran TV connectée, fin, cadre noir */}
        <g transform="translate(720,180)">
          <rect x="-180" y="-90" width="360" height="200" fill="#050510" stroke="#141428" strokeWidth="2" rx="6" />
          <rect x="-172" y="-82" width="344" height="184" fill="#111a2a" />
          {/* image "JT du soir" */}
          <rect x="-172" y="-82" width="344" height="140" fill="#2a3a52" />
          {/* studio flou */}
          {[[-140, 20], [-80, 10], [-20, 20], [40, 12], [100, 18], [140, 8]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="16" ry="6" fill="#4a5a72" opacity="0.55" />
          ))}
          {/* silhouette de la présentatrice */}
          <g transform="translate(-20,-8)">
            <ellipse cx="0" cy="0" rx="28" ry="40" fill="#141830" />
            <circle cx="0" cy="-22" r="14" fill="#e0b898" />
            <path d="M-13 -32 Q0 -40 13 -32 L13 -18 L-13 -18 Z" fill="#3a2418" />
            <path d="M-12 -8 Q0 -6 12 -8 L14 4 L-14 4 Z" fill="#8a3040" />
          </g>
          {/* bandeau BREAKING NEWS */}
          <rect x="-172" y="58" width="344" height="26" fill="#c02020" />
          <rect x="-172" y="58" width="80" height="26" fill="#f0e0a0" />
          <text x="-132" y="76" textAnchor="middle" fontSize="10" fontFamily="ui-monospace,monospace" fontWeight="900" fill="#7a1010">EN DIRECT</text>
          <g>
            <text x="-84" y="76" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#fff">
              ▸ POLÉMIQUE : UNE VIDÉO CIRCULE — LES AUTORITÉS APPELLENT À VÉRIFIER LA SOURCE…
              <animate attributeName="x" values="344;-500" dur="14s" repeatCount="indefinite" />
            </text>
          </g>
          {/* bandeau titre bas */}
          <rect x="-172" y="84" width="344" height="18" fill="#0a0a12" />
          <text x="0" y="97" textAnchor="middle" fontSize="9" fontFamily="ui-monospace,monospace" fill="#c8d4e2">
            JT 20H · SUJET : FAKE NEWS ET DEEPFAKES
          </text>
        </g>
      </PLayer>

      {/* ═══ MI-PLAN : CANAPÉ + TABLE BASSE ═══ */}
      <PLayer depth={2}>
        {/* tapis */}
        <ellipse cx="500" cy="500" rx="380" ry="34" fill="#1a1830" opacity="0.9" />
        <ellipse cx="500" cy="500" rx="360" ry="28" fill="none" stroke="#4a3a5a" strokeWidth="1" opacity="0.6" />

        {/* table basse en verre noir */}
        <g transform="translate(430,470)">
          <ellipse cx="0" cy="14" rx="120" ry="8" fill="#0a0a12" opacity="0.7" />
          <rect x="-110" y="-6" width="220" height="14" fill="#141428" stroke="#26324a" strokeWidth="1" rx="2" />
          <rect x="-108" y="-4" width="216" height="4" fill="#4a5074" opacity="0.4" />
          {/* pieds fins */}
          <rect x="-100" y="8" width="4" height="30" fill="#0a0a12" />
          <rect x="96" y="8" width="4" height="30" fill="#0a0a12" />

          {/* TABLETTE posée à plat, écran orienté vers le joueur — vraie/fausse/IA */}
          {!factFaite && (
            <g transform="translate(-58,-4)">
              <rect x="-40" y="-30" width="80" height="52" fill="#1a1a24" stroke="#3a3a4a" strokeWidth="1.2" rx="4" />
              <rect x="-36" y="-26" width="72" height="44" fill="#f0e6d8" />
              {/* image dans la tablette : silhouette suspecte */}
              <rect x="-36" y="-26" width="72" height="32" fill="#5a5a70" />
              <ellipse cx="0" cy="-6" rx="10" ry="12" fill="#e8c8a0" />
              <path d="M-10 -14 Q0 -20 10 -14 L10 -4 L-10 -4 Z" fill="#3a2418" />
              {/* petit ? qui pulse */}
              <text x="26" y="-14" fontSize="14" fontWeight="900" fill="#ff5a7a">
                ?
                <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
              </text>
              <rect x="-36" y="6" width="72" height="12" fill="#101827" />
              <text x="0" y="15" textAnchor="middle" fontSize="5" fontFamily="ui-monospace,monospace" fill="#7fd8ff">VÉRIFIER LA SOURCE</text>
            </g>
          )}

          {/* mug + télécommande */}
          <ellipse cx="60" cy="0" rx="14" ry="4" fill="#3a2418" />
          <rect x="46" y="-14" width="28" height="16" fill="#4a2818" stroke="#2a1408" strokeWidth="0.6" rx="1" />
          <rect x="72" y="-10" width="6" height="6" fill="#4a2818" stroke="#2a1408" strokeWidth="0.6" rx="1" />
          <rect x="20" y="-4" width="24" height="6" fill="#0a0a12" rx="1" />
          <circle cx="24" cy="-1" r="1" fill="#c02020" />
        </g>

        {/* le canapé, plan large, capitonné, gris-bleu, deux places */}
        <g transform="translate(140,510)">
          {/* base */}
          <rect x="0" y="-24" width="380" height="46" fill="#141420" />
          {/* assises */}
          <path d="M6 -60 Q10 -80 40 -82 L340 -82 Q370 -80 374 -60 L374 -24 L6 -24 Z" fill="url(#cs-couch)" />
          {/* coutures */}
          <line x1="190" y1="-80" x2="190" y2="-24" stroke="#0a0a14" strokeWidth="1" />
          {/* dossier */}
          <path d="M-10 -164 Q10 -180 60 -180 L320 -180 Q370 -180 390 -164 L380 -60 L0 -60 Z" fill="url(#cs-couch)" />
          {/* capitons losanges sur le dossier */}
          {[[60, -150], [130, -150], [200, -150], [270, -150], [340, -150],
            [90, -110], [160, -110], [230, -110], [300, -110]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 8} L${x + 8} ${y} L${x} ${y + 8} L${x - 8} ${y} Z`} fill="none" stroke="#0a0a14" strokeWidth="0.6" opacity="0.7" />
          ))}
          {/* accoudoirs */}
          <path d="M-10 -164 L-30 -160 L-30 -24 L0 -24 L0 -60 Z" fill="url(#cs-couch)" />
          <path d="M390 -164 L410 -160 L410 -24 L380 -24 L380 -60 Z" fill="url(#cs-couch)" />
          {/* liseré doux */}
          <path d="M-10 -164 Q10 -180 60 -180 L320 -180 Q370 -180 390 -164" stroke="#0a0a14" strokeWidth="1" fill="none" />

          {/* coussin */}
          <ellipse cx="330" cy="-64" rx="30" ry="14" fill="#5a3040" opacity="0.85" />
        </g>
      </PLayer>

      {/* ═══ PREMIER PLAN : L'ADO VAUTRÉ, SMARTPHONE EN MAIN ═══ */}
      <PLayer depth={1}>
        <g transform="translate(300,470)">
          {/* jambes croisées sur le canapé, jean */}
          <path d="M-40 30 Q-20 -8 40 -14 L120 8 L114 34 L-30 44 Z" fill="#3a4a72" />
          <path d="M-40 30 L120 8" stroke="#26324a" strokeWidth="1" fill="none" opacity="0.5" />
          {/* chaussettes qui dépassent */}
          <rect x="112" y="4" width="14" height="8" fill="#e8ecf4" />
          <rect x="118" y="-4" width="10" height="10" fill="#e8ecf4" />

          {/* torse allongé, sweat orange */}
          <path d="M-40 30 Q-56 -20 -70 -60 Q-72 -74 -58 -76 L-30 -68 Q-14 -30 -10 -6 Q-2 8 20 6 L20 30 Z" fill="#e05028" />
          {/* capuche mollement retombée */}
          <path d="M-62 -78 Q-70 -60 -62 -50 L-52 -54 Q-52 -70 -60 -78 Z" fill="#a03818" />

          {/* tête reposant sur l'accoudoir */}
          <g transform="translate(-58,-92)">
            <ellipse cx="0" cy="0" rx="18" ry="20" fill="#f0d0a8" />
            {/* cheveux en bataille, sombres */}
            <path d="M-18 -6 Q-16 -22 0 -24 Q16 -22 18 -6 L14 -12 Q0 -18 -14 -12 Z" fill="#2a1a10" />
            <path d="M12 -14 Q18 -6 14 4" stroke="#2a1a10" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* yeux fixes sur l'écran (fatigués) */}
            <ellipse cx="-6" cy="2" rx="2.5" ry="1.4" fill="#fff" />
            <ellipse cx="6" cy="2" rx="2.5" ry="1.4" fill="#fff" />
            <circle cx="-5" cy="2" r="1.4" fill="#1a1408" />
            <circle cx="7" cy="2" r="1.4" fill="#1a1408" />
            {/* cernes légères, halo bleu du tel dessous */}
            <ellipse cx="-6" cy="6" rx="3" ry="0.8" fill="#7fa8d0" opacity="0.4" />
            <ellipse cx="6" cy="6" rx="3" ry="0.8" fill="#7fa8d0" opacity="0.4" />
            {/* bouche entrouverte */}
            <ellipse cx="0" cy="12" rx="3" ry="1.4" fill="#7a3020" />
          </g>

          {/* bras droit qui remonte avec le smartphone au-dessus du visage */}
          <path d="M-30 -30 Q-46 -46 -40 -72 L-30 -78 Q-22 -60 -12 -46 Z" fill="#e05028" />
          <ellipse cx="-32" cy="-74" rx="5" ry="4" fill="#f0d0a8" />

          {/* SMARTPHONE tenu dans la main, écran allumé vers le visage — halo bleu ambiant */}
          {!bulleFaite && (
            <g transform="translate(-32,-88)">
              <ellipse cx="0" cy="0" rx="38" ry="30" fill="url(#cs-phone-glow)" opacity="0.9">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <rect x="-14" y="-24" width="28" height="46" fill="#1a1a24" stroke="#3a3a4a" strokeWidth="1" rx="4" />
              <rect x="-12" y="-22" width="24" height="40" fill="#0a1a2a" />
              {/* écran : petite carte de vidéo avec un ❤️ qui pulse */}
              <rect x="-10" y="-20" width="20" height="26" fill="#1a2438" rx="1" />
              <text x="0" y="-6" textAnchor="middle" fontSize="10">⚽</text>
              <rect x="-9" y="8" width="18" height="8" fill="#0a1220" />
              <text x="0" y="14" textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fill="#fff">POUR TOI</text>
              <text x="8" y="20" fontSize="6" fill="#ff4a6a">
                ❤
                <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
              </text>
            </g>
          )}
        </g>

        {/* MARTINE discrète, dans un coin, minuscule */}
        <g transform="translate(920,522)">
          <rect x="-14" y="-16" width="28" height="24" fill="#c9a54a" stroke="#3a2418" strokeWidth="1" rx="2" />
          <circle cx="-5" cy="-6" r="3" fill="#7fd8ff" />
          <circle cx="5" cy="-6" r="3" fill="#7fd8ff" />
          <rect x="-8" y="2" width="16" height="3" fill="#3a2418" />
        </g>
      </PLayer>

      {/* léger voile bleuté général */}
      <rect width="1000" height="560" fill="#2a3a58" opacity="0.05" style={{ pointerEvents: "none" }} />

      {/* ═══ hotspots ═══ */}
      {!bulleFaite && (
        <Hotspot cx={268} cy={382} r={40} label="smartphone — ton fil" reveal={reveal} onClick={() => action("fil_algo")} />
      )}
      {!factFaite && (
        <Hotspot cx={372} cy={470} r={44} label="tablette — vérifier l'image" reveal={reveal} onClick={() => action("verifier_images")} />
      )}
      <Hotspot cx={920} cy={522} r={22} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
    </svg>
  );
}
