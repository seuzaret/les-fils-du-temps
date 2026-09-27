import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";

/* ============================================================
   CHAPITRE 10 (XXIe) — Tableau : L'ÉCRAN DU SOIR
   ------------------------------------------------------------
   Vue à la 1re personne : on voit ce que l'ado voit — ses deux
   mains tenant son smartphone, et derrière, la chambre floutée
   (posters, lampe LED, coin de couette). Toute l'action est
   dans l'écran : deux "cartes" cliquables.

   - Carte du haut  : notif « Pour toi »          → fil algo
   - Carte du bas   : notif « Info reçue — vérif ? » → vrai/faux/IA
   ============================================================ */

export default function SceneCanapeSoir({ collect, action, reveal, made = [], inv = [], mode }) {
  const bulleFaite = made.includes("msg_algorithme");
  const factFaite  = made.includes("msg_deepfake");
  const reseauxFait = made.includes("msg_reseaux");
  /* Le grand téléphone est « connecté » quand l'élève a ramassé le smartphone
     ET la box Wi-Fi, ou après que la recette msg_reseaux ait été validée
     (sinon l'écran retomberait sur PAS DE CONNEXION). */
  const connecte = reseauxFait || (inv.includes("wifi") && inv.includes("smartphone"));

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* filtre blur pour la chambre en arrière-plan */}
        <filter id="es-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id="es-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141830" />
          <stop offset="100%" stopColor="#080a18" />
        </linearGradient>
        <linearGradient id="es-phone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="100%" stopColor="#0a0a12" />
        </linearGradient>
        <linearGradient id="es-hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d0a8" />
          <stop offset="100%" stopColor="#c89878" />
        </linearGradient>
        <radialGradient id="es-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ═══ ARRIÈRE-PLAN : CHAMBRE FLOUTÉE ═══ */}
      <g filter="url(#es-blur)" opacity="0.85">
        <rect width="1000" height="560" fill="url(#es-wall)" />
        {/* couette qui descend en bas de l'image */}
        <path d="M0 460 Q300 430 500 460 Q700 490 1000 450 L1000 560 L0 560 Z" fill="#1a2440" />
        <path d="M0 480 Q250 460 500 480 Q750 500 1000 470" stroke="#26324a" strokeWidth="6" fill="none" opacity="0.6" />
        {/* poster K-POP flou à gauche */}
        <rect x="60" y="80" width="150" height="200" fill="#3a1a4a" opacity="0.7" />
        <ellipse cx="135" cy="150" rx="40" ry="50" fill="#e0a0c8" opacity="0.6" />
        <rect x="80" y="240" width="110" height="20" fill="#f0e0a0" opacity="0.5" />
        {/* poster jeu vidéo flou à droite */}
        <rect x="780" y="60" width="160" height="220" fill="#1a3a2a" opacity="0.7" />
        <rect x="800" y="90" width="120" height="30" fill="#5eff9e" opacity="0.4" />
        <circle cx="860" cy="180" r="45" fill="#7fe0a8" opacity="0.35" />
        {/* lampe LED RGB — halo violet */}
        <ellipse cx="480" cy="180" rx="220" ry="140" fill="#a840f0" opacity="0.18" />
        <ellipse cx="600" cy="220" rx="180" ry="120" fill="#4ae0ff" opacity="0.18" />
        {/* petite étagère avec des figurines floues */}
        <rect x="280" y="320" width="440" height="10" fill="#26324a" />
        {[300, 360, 420, 490, 560, 630, 690].map((x, i) => (
          <rect key={i} x={x} y={296} width={20 + (i % 3) * 8} height={24 + (i % 4) * 6} fill={["#5eff9e", "#ff5a7a", "#ffd166", "#7fd8ff"][i % 4]} opacity="0.55" />
        ))}
      </g>


      {/* BOX WI-FI — posée sur une petite tablette à gauche, avec afficheur 13:37 */}
      <PLayer depth={2}>
        <g transform="translate(240,470)">
          {/* petite tablette qui accueille la box */}
          <rect x="-56" y="42" width="120" height="8" fill="#1a1a24" />
          <rect x="-48" y="50" width="6" height="30" fill="#1a1a24" />
          <rect x="42" y="50" width="6" height="30" fill="#1a1a24" />
          {/* corps de la box, noir laqué */}
          <rect x="-46" y="-4" width="94" height="48" fill="#0e0e14" stroke="#2a2a34" strokeWidth="1" rx="3" />
          <rect x="-46" y="-4" width="94" height="6" fill="#1a1a24" />
          {/* afficheur LED "13:37" en rouge */}
          <rect x="-30" y="8" width="42" height="18" fill="#080404" stroke="#2a1010" strokeWidth="0.8" rx="1.5" />
          <text x="-9" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="800" fill="#ff3020" letterSpacing="1.5">
            13:37
            <animate attributeName="opacity" values="1;0.85;1" dur="2.4s" repeatCount="indefinite" />
          </text>
          {/* LED Wi-Fi verte qui pulse */}
          <circle cx="30" cy="16" r="2.4" fill="#5eff9e">
            <animate attributeName="opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <text x="30" y="32" textAnchor="middle" fontSize="5" fontFamily="ui-monospace,monospace" fill="#5eff9e" opacity="0.9">Wi-Fi</text>
          {/* antennes discrètes en haut */}
          <path d="M-30 -4 L-32 -18" stroke="#3a3a44" strokeWidth="1.4" />
          <path d="M-20 -4 L-16 -20" stroke="#3a3a44" strokeWidth="1.4" />
          <path d="M32 -4 L36 -20" stroke="#3a3a44" strokeWidth="1.4" />
          {/* ondes qui rayonnent */}
          <g stroke="#7fd8ff" fill="none" strokeWidth="1" opacity="0.7">
            {[14, 22, 30].map((r, i) => (
              <path key={i} d={`M0 -12 m-${r} 0 a${r} ${r} 0 0 1 ${r * 2} 0`}>
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </path>
            ))}
          </g>
          {/* étiquette de face avec logo */}
          <rect x="-42" y="-2" width="14" height="8" fill="#1a1a24" rx="1" />
          <text x="-35" y="4" textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fill="#7fd8ff">BOX</text>

        </g>
      </PLayer>

      {/* ═══ PREMIER PLAN : LES DEUX MAINS QUI TIENNENT LE TÉLÉPHONE ═══ */}
      <PLayer depth={1}>
        {/* main GAUCHE — tenue depuis le bas, seuls pouce + tranche visibles */}
        <g transform="translate(300,560)">
          {/* paume qui remonte depuis le hors-champ */}
          <path d="M-40 0 L-40 -140 Q-38 -180 -6 -184 L52 -184 Q66 -180 66 -160 L58 -30 L58 0 Z" fill="url(#es-hand)" />
          {/* pouce qui vient par-dessus l'appareil */}
          <path d="M52 -184 Q90 -190 108 -172 Q118 -156 108 -140 L88 -132 Q72 -140 62 -156 Z" fill="url(#es-hand)" />
          {/* ongle du pouce */}
          <ellipse cx="102" cy="-160" rx="4" ry="6" fill="#f4dcc0" transform="rotate(-20 102 -160)" />
          {/* pli du pouce */}
          <path d="M62 -156 Q76 -150 88 -152" stroke="#c89878" strokeWidth="0.8" fill="none" opacity="0.7" />
          {/* petite ombre du bras qui remonte */}
          <path d="M-40 -140 L-40 0 L-80 0 L-70 -60 Z" fill="#3a2818" opacity="0.4" />
        </g>

        {/* main DROITE — pouce actif qui vient scroller/taper */}
        <g transform="translate(700,560)">
          <path d="M40 0 L40 -140 Q38 -180 6 -184 L-52 -184 Q-66 -180 -66 -160 L-58 -30 L-58 0 Z" fill="url(#es-hand)" />
          {/* pouce prêt à taper */}
          <path d="M-52 -184 Q-90 -190 -108 -172 Q-118 -156 -108 -140 L-88 -132 Q-72 -140 -62 -156 Z" fill="url(#es-hand)" />
          <ellipse cx="-102" cy="-160" rx="4" ry="6" fill="#f4dcc0" transform="rotate(20 -102 -160)" />
          <path d="M-62 -156 Q-76 -150 -88 -152" stroke="#c89878" strokeWidth="0.8" fill="none" opacity="0.7" />
          <path d="M40 -140 L40 0 L80 0 L70 -60 Z" fill="#3a2818" opacity="0.4" />
        </g>

        {/* SMARTPHONE au centre — grand, occupe la moitié de l'image */}
        <g transform="translate(500,300)">
          {/* ombre portée */}
          <rect x="-152" y="-238" width="304" height="512" fill="#000" opacity="0.5" rx="34" />
          {/* coque */}
          <rect x="-148" y="-240" width="296" height="516" fill="url(#es-phone)" stroke="#3a3a4a" strokeWidth="1.5" rx="32" />
          {/* écran */}
          <rect x="-136" y="-228" width="272" height="492" fill="#0e1420" rx="22" />
          {/* barre d'état — change selon la connexion Wi-Fi */}
          <g>
            <text x="-118" y="-206" fontSize="12" fontFamily="ui-monospace,monospace" fill="#c8d4e2" fontWeight="700">22:14</text>
            <text x="100" y="-206" fontSize="11" fontFamily="ui-monospace,monospace" fill={connecte ? "#5eff9e" : "#ff8a6a"} textAnchor="end" fontWeight="700">
              {connecte ? "📶 Wi-Fi · 32%" : "📵 HORS LIGNE"}
            </text>
            {/* notch */}
            <rect x="-30" y="-224" width="60" height="16" fill="#0a0a12" rx="8" />
          </g>

          {/* ═══ ÉCRAN « PAS DE CONNEXION » : tant qu'on n'a pas ramassé la box Wi-Fi ═══ */}
          {!connecte && (
            <g>
              <rect x="-120" y="-140" width="240" height="300" fill="#101827" stroke="#3a4a68" strokeWidth="1.5" rx="12" />
              <text x="0" y="-40" textAnchor="middle" fontSize="60">📵</text>
              <text x="0" y="10" textAnchor="middle" fontSize="16" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#ff8a6a" letterSpacing="1">PAS DE CONNEXION</text>
              <text x="0" y="40" textAnchor="middle" fontSize="11" fill="#c8d4e2" fontFamily="ui-monospace,monospace">Aucun réseau détecté.</text>
              <text x="0" y="60" textAnchor="middle" fontSize="11" fill="#c8d4e2" fontFamily="ui-monospace,monospace">Trouve une box Wi-Fi</text>
              <text x="0" y="76" textAnchor="middle" fontSize="11" fill="#c8d4e2" fontFamily="ui-monospace,monospace">pour te connecter.</text>
              <g transform="translate(0,120)">
                <circle r="6" fill="none" stroke="#ff8a6a" strokeWidth="2">
                  <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <text y="4" textAnchor="middle" fontSize="12" fill="#ff8a6a">↻</text>
              </g>
              <text x="0" y="156" textAnchor="middle" fontSize="10" fontFamily="ui-monospace,monospace" fill="#8fa3bd" fontStyle="italic">recherche…</text>
            </g>
          )}

          {/* ═══ CARTE HAUTE — Fil « Pour toi » — visible SEULEMENT quand connecté ═══ */}
          {connecte && !bulleFaite && (
            <g transform="translate(0,-100)">
              <rect x="-124" y="-84" width="248" height="176" fill="#1a2438" stroke="#3a4a68" strokeWidth="1.5" rx="14" />
              {/* icone app */}
              <g transform="translate(-100,-58)">
                <rect x="-14" y="-14" width="28" height="28" fill="#ff4a6a" rx="6" />
                <text x="0" y="6" textAnchor="middle" fontSize="16">▶</text>
              </g>
              <text x="-74" y="-58" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#ff4a6a">POUR TOI</text>
              <text x="-74" y="-42" fontSize="10" fontFamily="ui-monospace,monospace" fill="#8fa3bd">à l'instant</text>
              {/* aperçu de la vidéo */}
              <rect x="-116" y="-30" width="232" height="80" fill="#0a1220" rx="6" />
              <text x="0" y="20" textAnchor="middle" fontSize="42">⚽</text>
              {/* like qui pulse */}
              <text x="94" y="42" textAnchor="middle" fontSize="14" fill="#ff4a6a">
                ❤ 2,4M
                <animate attributeName="opacity" values="1;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </text>
              {/* titre */}
              <text x="0" y="70" textAnchor="middle" fontSize="12" fill="#e8eef5" fontWeight="700">Le but improbable de la semaine</text>
              <text x="0" y="86" textAnchor="middle" fontSize="10" fill="#7fd8ff" fontFamily="ui-monospace,monospace">▸ Défiler ton fil</text>
            </g>
          )}
          {connecte && bulleFaite && (
            <g transform="translate(0,-100)">
              <rect x="-124" y="-84" width="248" height="176" fill="#0e1a2a" stroke="#5eff9e55" strokeWidth="1.5" rx="14" />
              <text x="0" y="0" textAnchor="middle" fontSize="42">✓</text>
              <text x="0" y="30" textAnchor="middle" fontSize="12" fill="#5eff9e" fontFamily="ui-monospace,monospace">FIL EXPLORÉ</text>
            </g>
          )}

          {/* ═══ CARTE BASSE — visible SEULEMENT quand connecté ═══ */}
          {connecte && !factFaite && (
            <g transform="translate(0,140)">
              <rect x="-124" y="-84" width="248" height="176" fill="#1a2438" stroke="#3a4a68" strokeWidth="1.5" rx="14" />
              {/* icone message */}
              <g transform="translate(-100,-58)">
                <rect x="-14" y="-14" width="28" height="28" fill="#7fd8ff" rx="6" />
                <text x="0" y="6" textAnchor="middle" fontSize="14">✉</text>
              </g>
              <text x="-74" y="-58" fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="800" fill="#7fd8ff">GROUPE DE CLASSE</text>
              <text x="-74" y="-42" fontSize="10" fontFamily="ui-monospace,monospace" fill="#8fa3bd">Lila · 22:11</text>
              {/* aperçu image floutée avec ? */}
              <rect x="-116" y="-30" width="232" height="60" fill="#3a2a4a" rx="6" />
              <g transform="translate(0,0)">
                <ellipse cx="0" cy="-4" rx="14" ry="18" fill="#e8c8a0" opacity="0.7" />
                <path d="M-14 -18 Q0 -26 14 -18 L14 -6 L-14 -6 Z" fill="#3a2418" opacity="0.7" />
                <text x="24" y="4" fontSize="24" fontWeight="900" fill="#ff5a7a">
                  ?
                  <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
                </text>
              </g>
              <text x="0" y="52" textAnchor="middle" fontSize="11" fill="#e8eef5" fontWeight="700">« Regardez, c'est vrai ce truc ?? »</text>
              <text x="0" y="70" textAnchor="middle" fontSize="10" fill="#7fd8ff" fontFamily="ui-monospace,monospace">▸ Vérifier l'image</text>
            </g>
          )}
          {connecte && factFaite && (
            <g transform="translate(0,140)">
              <rect x="-124" y="-84" width="248" height="176" fill="#0e1a2a" stroke="#5eff9e55" strokeWidth="1.5" rx="14" />
              <text x="0" y="0" textAnchor="middle" fontSize="42">✓</text>
              <text x="0" y="30" textAnchor="middle" fontSize="12" fill="#5eff9e" fontFamily="ui-monospace,monospace">IMAGE VÉRIFIÉE</text>
            </g>
          )}

          {/* barre du bas iOS-like */}
          <rect x="-40" y="252" width="80" height="4" fill="#c8d4e2" rx="2" opacity="0.6" />
        </g>
      </PLayer>

      {/* MARTINE (design standard, coin bas droit) */}
      <g transform="translate(940,530) rotate(-6)">
        <ellipse cx="0" cy="12" rx="26" ry="6" fill="#0a0603" opacity="0.6" />
        <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
        <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
        <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
        <text x="-1" y="9" textAnchor="middle" fontSize="4.6" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>2026</text>
        <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
        <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      </g>

      {/* ═══ hotspots — les mini-jeux ne s'ouvrent qu'une fois le téléphone connecté au Wi-Fi ═══ */}
      {connecte && !bulleFaite && (
        <Hotspot cx={500} cy={200} r={100} label="Ton fil « Pour toi »" reveal={reveal} onClick={() => action("fil_algo")} />
      )}
      {connecte && !factFaite && (
        <Hotspot cx={500} cy={440} r={100} label="Image reçue — vérifier ?" reveal={reveal} onClick={() => action("verifier_images")} />
      )}
      {/* BOX WI-FI (posée à gauche, avec afficheur 13:37) — support fixe */}
      {!reseauxFait && (
        <Hotspot cx={240} cy={490} r={54} label="box Wi-Fi (13:37)" item="wifi" reveal={reveal} onClick={() => collect("wifi")} />
      )}
      <Hotspot cx={940} cy={525} r={30} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />
    </svg>
  );
}
