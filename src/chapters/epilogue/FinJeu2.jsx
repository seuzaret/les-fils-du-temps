import { useState, useEffect } from "react";

/* ============================================================
   FIN DU JEU 2 → pont narratif vers Le Discernement (Jeu 3)
   ============================================================
   4 actes ANIMÉS et séquentiels :
     0. LE REMÈDE MARCHE      — retour à la station, retrouvailles
     1. LA MÉMOIRE REVIENT    — la fête, MARTINE devient « mémoire commune »
     2. LE BUNKER SE CREUSE   — les décennies passent, MARTINE prend le pouvoir,
                                Elias disparaît. À la fin : fondu au NOIR AUTOMATIQUE
     3. LE DISCERNEMENT       — réveil en 2087, cellule N-27
                                (fondu depuis le noir, pas de bouton pour arriver ici)
   La révélation « Al3x1a était ta fille » reste réservée au bunker Jeu 3.
   ============================================================ */

/* Utilitaire pour révéler des éléments en séquence via des timeouts.
   Retourne un état numérique qui s'incrémente aux moments donnés (en ms).
   Ex: useSequence([600, 1400, 2400]) → 0 puis 1 à 600 ms puis 2 à 1400 ms etc. */
function useSequence(steps, active = true) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    setT(0);
    const ids = steps.map((delay, i) => setTimeout(() => setT(i + 1), delay));
    return () => ids.forEach(clearTimeout);
  }, [active, JSON.stringify(steps)]);
  return t;
}

/* ============================================================
   ACTE 0 · LE REMÈDE MARCHE — retour à la station
   ============================================================ */
function Acte0() {
  const t = useSequence([700, 2100, 3400, 4600]);
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="a0-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1428" />
          <stop offset="60%" stopColor="#1a2f4a" />
          <stop offset="100%" stopColor="#2a3a58" />
        </linearGradient>
        <radialGradient id="a0-portal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#7fd8ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a0-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a0-nebula" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a840f0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a840f0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* CIEL ÉTOILÉ + nébuleuses */}
      <rect width="1000" height="440" fill="url(#a0-sky)" />
      <ellipse cx="800" cy="120" rx="220" ry="90" fill="url(#a0-nebula)" />
      <ellipse cx="180" cy="80" rx="180" ry="60" fill="#3a80c8" opacity="0.15" />
      {Array.from({ length: 70 }).map((_, i) => (
        <circle key={i} cx={(i * 41) % 1000} cy={20 + (i * 23) % 300} r={i % 6 === 0 ? 1.6 : 0.8} fill="#e8eef5"
          opacity={0.5 + (i % 3) * 0.15}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* étoile filante */}
      <g opacity="0.8">
        <line x1="820" y1="50" x2="880" y2="80" stroke="#e8eef5" strokeWidth="0.8" />
        <animateTransform attributeName="transform" type="translate" values="0 0; -900 400" dur="8s" begin="1s" repeatCount="indefinite" />
      </g>

      {/* MONTAGNES au loin */}
      <path d="M0 380 L120 300 L220 340 L360 280 L480 330 L620 290 L780 340 L900 310 L1000 350 L1000 440 L0 440 Z"
        fill="#0e1420" stroke="#28303a" strokeWidth="1" />

      {/* SILHOUETTE DE LA STATION en arrière-plan, plus détaillée */}
      <g>
        {/* base du bâtiment */}
        <path d="M120 380 L120 270 L200 270 L200 240 L340 240 L340 270 L400 270 L400 210 L500 210 L500 270 L600 270 L600 240 L740 240 L740 270 L820 270 L820 380 Z"
          fill="#0e1420" stroke="#28303a" strokeWidth="1.5" />
        {/* dôme géodésique central */}
        <g transform="translate(450,210)">
          <path d="M-70 0 A 70 55 0 0 1 70 0 Z" fill="#28303a" stroke="#5a6878" strokeWidth="1" />
          <path d="M-45 -40 L0 -55 L45 -40 M-70 0 L-30 -50 L30 -50 L70 0 M-50 0 L0 -55 L50 0"
            stroke="#5a6878" strokeWidth="0.5" fill="none" opacity="0.7" />
          {/* balise verte au sommet */}
          <path d="M0 -55 L0 -75" stroke="#3a4058" strokeWidth="1" />
          <circle cx="0" cy="-80" r="3.5" fill="#5eff9e">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* fenêtres allumées */}
        {[[160, 320], [220, 300], [240, 310], [280, 290], [320, 320], [380, 290], [560, 300], [620, 320], [680, 290], [740, 320], [780, 300]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="8" height="10" fill="#ffd870" opacity="0.85">
            <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </rect>
        ))}
        {/* antennes/paraboles */}
        <g transform="translate(140,240)">
          <path d="M0 0 L0 -30" stroke="#5a6878" strokeWidth="1.2" />
          <path d="M-6 -30 L6 -30" stroke="#5a6878" strokeWidth="1.2" />
        </g>
        <g transform="translate(780,240)">
          <path d="M0 0 L0 -30" stroke="#5a6878" strokeWidth="1.2" />
          <ellipse cx="0" cy="-30" rx="8" ry="3" fill="#3a4048" />
        </g>
        {/* panneaux solaires latéraux */}
        <g transform="translate(90,340)">
          <path d="M0 0 L40 0 L48 -40 L-8 -40 Z" fill="#1a2038" stroke="#3a4058" strokeWidth="1" />
          {[[-4,-32],[8,-32],[20,-32],[32,-32],[0,-16],[12,-16],[24,-16]].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="10" height="10" fill="#3a5090" opacity="0.85" />
          ))}
        </g>
      </g>

      {/* PLATEFORME d'atterrissage — plus grande, mieux marquée */}
      <rect y="440" width="1000" height="120" fill="#141c26" />
      <path d="M0 440 L1000 440" stroke="#3a4048" strokeWidth="3" />
      {/* stries lumineuses */}
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x, i) => (
        <rect key={x} x={x - 10} y="460" width="20" height="5" fill="#ffd166" opacity="0.55">
          <animate attributeName="opacity" values="0.3;0.75;0.3" dur="1.2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {/* cercle d'atterrissage central au sol */}
      <ellipse cx="500" cy="470" rx="180" ry="24" fill="none" stroke="#ffd166" strokeWidth="1.5" opacity="0.5" strokeDasharray="8 6" />
      <text x="500" y="530" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="4" fill="#ffd166" opacity="0.65">PAD 01 · CENTRALE</text>

      {/* Halo du portail qui se resserre */}
      {t < 3 && (
        <>
          <ellipse cx="500" cy="440" rx="300" ry="80" fill="url(#a0-portal)" opacity={t >= 1 ? 0.9 : 0.5}>
            <animate attributeName="rx" values="360;180;220" dur="2.4s" fill="freeze" />
          </ellipse>
          <circle cx="500" cy="420" r="110" fill="none" stroke="#7fd8ff" strokeWidth="2" opacity="0.8">
            <animate attributeName="r" values="140;60;90" dur="2.4s" fill="freeze" />
            <animate attributeName="opacity" values="0.9;0.4;0.7" dur="2.4s" fill="freeze" />
          </circle>
          {/* particules qui remontent */}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={480 + (i % 4) * 12} cy="470" r="1.4" fill="#c8e8ff" opacity="0.85">
              <animate attributeName="cy" values="480;300" dur={`${2 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.85;0" dur={`${2 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </>
      )}

      {/* MARTINE qui descend depuis le haut, grand format */}
      <g style={{ transform: t >= 1 ? "translate(0px, 0px)" : "translate(0px, -260px)", transition: "transform 1100ms cubic-bezier(.34,1.56,.64,1)" }}>
        <g transform="translate(500,390)">
          {/* ombre au sol */}
          <ellipse cx="0" cy="40" rx="90" ry="14" fill="#0a0603" opacity="0.7" />
          {/* corps noix bombé */}
          <path d="M-80 -30 Q0 -60 80 -30 Q86 12 40 22 L-40 22 Q-86 12 -80 -30 Z" fill="#a06838" stroke="#3a1810" strokeWidth="2.5" />
          <path d="M-64 -30 Q0 -46 64 -30" stroke="#3a1810" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M-72 -14 Q0 -30 72 -14" stroke="#3a1810" strokeWidth="0.6" fill="none" opacity="0.5" />
          {/* œil bleu principal */}
          <circle cx="-1" cy="-10" r="16" fill="#cfeaff" stroke="#5c3a22" strokeWidth="2" />
          <circle cx="-3" cy="-12" r="7" fill="#7fd8ff" />
          <circle cx="-5" cy="-14" r="2.5" fill="#fff" />
          {/* plaque année */}
          <rect x="-36" y="10" width="72" height="14" rx="3" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="0" y="20" textAnchor="middle" fontSize="9" fill="#5eff9e" fontFamily="ui-monospace,monospace" letterSpacing="2">2287</text>
          {/* antenne + LED */}
          <path d="M20 -46 q10 -14 22 -12" stroke="#5a6878" strokeWidth="1.5" fill="none" />
          <circle cx="42" cy="-58" r="4" fill="#5eff9e">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
          {/* petits pieds */}
          <rect x="-30" y="20" width="6" height="12" fill="#3a1810" />
          <rect x="24" y="20" width="6" height="12" fill="#3a1810" />
        </g>
      </g>

      {/* JOUEUR à gauche */}
      <g transform="translate(360,470)" opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <ellipse cx="0" cy="50" rx="18" ry="4" fill="#0a0603" opacity="0.6" />
        <circle cx="0" cy="-4" r="12" fill="#e0a878" stroke="#5a3018" strokeWidth="0.6" />
        <path d="M-8 -8 Q0 -14 8 -8 L8 4 L-8 4 Z" fill="#3a2818" />
        <path d="M-18 10 L18 10 L22 60 L-22 60 Z" fill="#3a80c8" stroke="#141c26" strokeWidth="0.8" />
        {/* jambes */}
        <rect x="-8" y="60" width="6" height="16" fill="#3a2818" />
        <rect x="2" y="60" width="6" height="16" fill="#3a2818" />
      </g>

      {/* AL3X1A au centre, chancelante, halo doré */}
      {t >= 2 && (
        <g transform="translate(500,470)">
          <ellipse cx="0" cy="0" rx="46" ry="52" fill="url(#a0-warm)" opacity="0.9" />
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; 1.5 0; 0 0; -1.5 0; 0 0" dur="2.8s" repeatCount="indefinite" />
            <ellipse cx="0" cy="50" rx="18" ry="4" fill="#0a0603" opacity="0.6" />
            {/* capuche */}
            <path d="M-14 -18 Q0 -30 14 -18 L16 -4 L-16 -4 Z" fill="#c8a848" />
            <circle cx="0" cy="-4" r="12" fill="#d0a888" stroke="#5a3018" strokeWidth="0.6" />
            {/* frange */}
            <path d="M-10 -10 Q0 -14 10 -10" stroke="#5a3818" strokeWidth="1.4" fill="none" />
            {/* tunique */}
            <path d="M-16 8 L16 8 L20 58 L-20 58 Z" fill="#a04ce8" stroke="#141c26" strokeWidth="0.8" />
            {/* petit insigne chronaute */}
            <circle cx="-8" cy="22" r="3" fill="#c8a848" stroke="#5a3818" strokeWidth="0.6" />
            <rect x="-10" y="58" width="6" height="16" fill="#3a2818" />
            <rect x="4" y="58" width="6" height="16" fill="#3a2818" />
          </g>
          <circle r="42" fill="none" stroke="#ffd870" strokeWidth="1" opacity="0.55">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ELIAS qui arrive en courant depuis la droite */}
      {t >= 3 && (
        <g style={{ animation: "eliasRun 1.1s ease-out" }}>
          <g transform="translate(600,470)">
            <ellipse cx="0" cy="50" rx="18" ry="4" fill="#0a0603" opacity="0.6" />
            <circle cx="0" cy="-4" r="12" fill="#c8a888" stroke="#5a3018" strokeWidth="0.6" />
            {/* barbe blanche */}
            <path d="M-8 2 Q0 8 8 2 Q6 8 4 10 L-4 10 Q-6 8 -8 2 Z" fill="#e8e8e0" />
            {/* cheveux blancs */}
            <path d="M-10 -10 Q0 -16 10 -10 L10 -6 L-10 -6 Z" fill="#e8e8e0" />
            <path d="M-18 10 L18 10 L22 60 L-22 60 Z" fill="#5a4028" stroke="#141c26" strokeWidth="0.8" />
            <rect x="-8" y="60" width="6" height="16" fill="#3a2818" />
            <rect x="2" y="60" width="6" height="16" fill="#3a2818" />
            {/* "!" au-dessus */}
            <text x="0" y="-24" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="800" fill="#ffd166">!</text>
          </g>
          <style>{`
            @keyframes eliasRun {
              0% { transform: translateX(360px); opacity: 0; }
              60% { transform: translateX(0); opacity: 1; }
              70% { transform: translateX(-8px); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </g>
      )}

      {/* MIRA à droite avec écran + LED verte */}
      {t >= 4 && (
        <g transform="translate(680,470)" opacity="0" style={{ animation: "fadeIn 700ms ease-out forwards" }}>
          <ellipse cx="0" cy="50" rx="16" ry="4" fill="#0a0603" opacity="0.6" />
          <circle cx="0" cy="-4" r="11" fill="#e0a878" stroke="#5a3018" strokeWidth="0.6" />
          {/* tresses */}
          <path d="M-11 2 L-13 26" stroke="#1a1408" strokeWidth="3" strokeLinecap="round" />
          <path d="M11 2 L13 26" stroke="#1a1408" strokeWidth="3" strokeLinecap="round" />
          <path d="M-16 8 L16 8 L20 58 L-20 58 Z" fill="#5eff9e" stroke="#141c26" strokeWidth="0.8" />
          <rect x="-8" y="58" width="6" height="16" fill="#3a2818" />
          <rect x="2" y="58" width="6" height="16" fill="#3a2818" />
          {/* écran-tablette dans la main */}
          <rect x="10" y="22" width="18" height="24" fill="#141c26" stroke="#5eff9e" strokeWidth="0.8" rx="2" />
          <rect x="12" y="24" width="14" height="18" fill="#0a1a2a" />
          <circle cx="19" cy="30" r="2" fill="#5eff9e">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <text x="20" y="42" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#5eff9e">OK</text>
          {/* pop-up "✓" au-dessus */}
          <text x="0" y="-24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="14" fontWeight="800" fill="#5eff9e">✓</text>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   ACTE 1 · LA MÉMOIRE REVIENT — 3 semaines plus tard
   Grande salle sous le dôme géodésique, écran MARTINE monumental,
   foule d'habitants qui se retrouve, guirlandes, plantes.
   ============================================================ */
function Acte1() {
  const t = useSequence([600, 1600, 3000, 4200]);
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="a1-warm" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a1-mem" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="a1-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f1c" />
          <stop offset="100%" stopColor="#1a2438" />
        </linearGradient>
      </defs>
      <rect width="1000" height="560" fill="#0a1420" />

      {/* COUPOLE géodésique intérieure */}
      <path d="M0 240 Q500 40 1000 240 L1000 0 L0 0 Z" fill="url(#a1-dome)" />
      {/* nervures géodésiques */}
      <g stroke="#3a4858" strokeWidth="1" fill="none" opacity="0.75">
        <path d="M0 240 Q500 40 1000 240" />
        <path d="M100 220 Q500 90 900 220" />
        <path d="M240 200 Q500 130 760 200" />
        <path d="M400 175 Q500 155 600 175" />
        <path d="M500 40 L500 200" />
        <path d="M100 220 L100 240 M200 205 L200 240 M300 190 L300 240 M400 175 L400 240 M500 165 L500 240 M600 175 L600 240 M700 190 L700 240 M800 205 L800 240 M900 220 L900 240" />
      </g>

      {/* halo doux qui vient de l'écran central */}
      <ellipse cx="500" cy="200" rx="520" ry="240" fill="url(#a1-warm)" />

      {/* GUIRLANDES LED qui pendent */}
      {[[100, 90], [280, 130], [500, 160], [720, 130], [900, 90]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 60} ${y - 20} Q${x} ${y + 20} ${x + 60} ${y - 20}`}
            stroke="#4a5060" strokeWidth="0.8" fill="none" />
          {[-40, -20, 0, 20, 40].map((dx, j) => (
            <circle key={j} cx={x + dx} cy={y + (Math.abs(dx) < 30 ? 12 : 4)} r="2" fill={["#ff8a3a", "#5eff9e", "#7fd8ff", "#ffd166", "#ff5a7a"][(i + j) % 5]}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.6 + (j % 3) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}

      {/* horodatage */}
      <text x="30" y="34" fontFamily="ui-monospace,monospace" fontSize="12" fill="#5eff9e" letterSpacing="3" opacity="0.85">J+3 SEMAINES · STATION DES CHRONAUTES</text>

      {/* PLANTES en pot de part et d'autre */}
      {[[80, 380], [920, 380]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d="M-14 0 L14 0 L10 30 L-10 30 Z" fill="#8a5a2a" />
          <path d="M0 0 q-14 -20 -20 -40 M0 0 q0 -30 4 -46 M0 0 q14 -20 22 -40 M0 0 q-8 -24 -6 -36 M0 0 q6 -22 10 -38"
            stroke="#5a7838" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      ))}

      {/* ÉCRAN MARTINE central "MÉMOIRE COMMUNE" — grand et imposant */}
      <g transform="translate(500,220)">
        <g style={{ transform: t >= 1 ? "scale(1)" : "scale(0.4)", transformOrigin: "500px 220px", transition: "transform 1100ms cubic-bezier(.34,1.1,.64,1)" }}>
          {/* piédestal */}
          <rect x="-30" y="80" width="60" height="16" fill="#28303a" stroke="#5a6270" strokeWidth="1" opacity={t >= 1 ? 1 : 0} />
          <rect x="-40" y="94" width="80" height="6" fill="#141c26" opacity={t >= 1 ? 1 : 0} />
          {/* écran principal */}
          <rect x="-140" y="-90" width="280" height="180" fill="#0a0806" stroke="#7fd8ff" strokeWidth="3" opacity={t >= 1 ? 1 : 0} />
          <rect x="-130" y="-80" width="260" height="160" fill="#0a1a2a" opacity={t >= 1 ? 1 : 0} />
          {/* halo bleu qui pulse une fois allumé */}
          {t >= 2 && (
            <circle cx="0" cy="0" r="140" fill="url(#a1-mem)" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.6s" repeatCount="indefinite" />
            </circle>
          )}
          {/* textes qui s'écrivent en séquence */}
          <text x="0" y="-30" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="24" fontWeight="800" fill="#7fd8ff" letterSpacing="5"
            opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 700ms" }}>MÉMOIRE</text>
          <text x="0" y="10" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="24" fontWeight="800" fill="#7fd8ff" letterSpacing="5"
            opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 900ms 200ms" }}>COMMUNE</text>
          <line x1="-80" y1="30" x2="80" y2="30" stroke="#7fd8ff" strokeWidth="0.6" opacity={t >= 3 ? 0.6 : 0} style={{ transition: "opacity 600ms" }} />
          <text x="0" y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="#5eff9e" letterSpacing="3"
            opacity={t >= 3 ? 1 : 0} style={{ transition: "opacity 800ms" }}>archivée par MARTINE</text>
          <text x="0" y="72" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2" letterSpacing="2" opacity={t >= 3 ? 0.7 : 0}
            style={{ transition: "opacity 800ms 200ms" }}>124 512 témoignages · en direct</text>
        </g>
      </g>

      {/* SOL — parquet clair de la salle */}
      <rect y="440" width="1000" height="120" fill="#1a2038" />
      <path d="M0 440 L1000 440" stroke="#28303a" strokeWidth="2" />
      {/* dalles claires */}
      {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((x, i) => (
        <line key={i} x1={x} y1="440" x2={x} y2="560" stroke="#141c26" strokeWidth="0.5" opacity="0.6" />
      ))}
      {/* reflets */}
      {[[300, 460], [500, 470], [700, 460]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="120" ry="6" fill="#7fd8ff" opacity="0.12" />
      ))}

      {/* FOULE d'habitants — plus nombreuse et variée */}
      {[
        [110, "#c8a848", "#3a80c8", -40, "adult"],
        [180, "#e0a878", "#c88060", -30, "adult"],
        [250, "#c8a888", "#8a3820", -20, "adult"],
        [310, "#e0d0b0", "#5eff9e", -10, "child"],
        [400, "#e0a878", "#a04ce8", 0, "adult"],
        [470, "#e0d0b0", "#ffd166", 0, "child"],
        [530, "#c8a848", "#e0a848", 10, "adult"],
        [610, "#e0a878", "#3a80c8", 20, "adult"],
        [680, "#c8a888", "#5a3818", 30, "adult"],
        [750, "#e0d0b0", "#5eff9e", 40, "child"],
        [820, "#c8a848", "#8a3820", 40, "adult"],
      ].map(([x, skin, coat, dx, type], i) => (
        <g key={i} style={{ transform: t >= 3 ? `translateX(${dx * 0.5}px)` : "translateX(0)", transition: `transform ${1200 + i * 60}ms ease-in-out` }}>
          <g transform={`translate(${x},${type === "child" ? 480 : 470})`}>
            <ellipse cx="0" cy={type === "child" ? 40 : 60} rx="16" ry="3" fill="#0a0603" opacity="0.5" />
            <circle cx="0" cy="0" r={type === "child" ? 8 : 12} fill={skin} stroke="#5a3018" strokeWidth="0.4" />
            {/* cheveux/coiffure */}
            <path d={`M-${type === "child" ? 6 : 10} -${type === "child" ? 4 : 8} Q0 -${type === "child" ? 10 : 14} ${type === "child" ? 6 : 10} -${type === "child" ? 4 : 8} L${type === "child" ? 8 : 12} -${type === "child" ? 2 : 6} L-${type === "child" ? 8 : 12} -${type === "child" ? 2 : 6} Z`}
              fill={["#3a2818", "#5a3818", "#8a5828", "#a89078", "#e8e8e0"][i % 5]} />
            {/* corps */}
            <path d={type === "child" ? "M-10 6 L10 6 L12 40 L-12 40 Z" : "M-16 10 L16 10 L20 60 L-20 60 Z"} fill={coat} stroke="#141c26" strokeWidth="0.6" />
            {/* jambes */}
            <rect x="-6" y={type === "child" ? 40 : 60} width="4" height="12" fill="#3a2818" />
            <rect x="2" y={type === "child" ? 40 : 60} width="4" height="12" fill="#3a2818" />
          </g>
        </g>
      ))}

      {/* REGARDS / retrouvailles : traits pointillés dorés lumineux */}
      {t >= 4 && (
        <g opacity="0" style={{ animation: "linkFade 900ms ease-out forwards" }}>
          <path d="M180 468 Q265 420 400 468" stroke="#ffd870" strokeWidth="1.6" fill="none" opacity="0.8" strokeDasharray="6 4" />
          <path d="M470 480 Q550 420 610 468" stroke="#ffd870" strokeWidth="1.6" fill="none" opacity="0.8" strokeDasharray="6 4" />
          <path d="M110 468 Q170 410 310 480" stroke="#ffd870" strokeWidth="1.4" fill="none" opacity="0.6" strokeDasharray="5 4" />
          <path d="M530 468 Q620 420 750 480" stroke="#ffd870" strokeWidth="1.4" fill="none" opacity="0.6" strokeDasharray="5 4" />
          {/* petits cœurs dorés flottants */}
          {[[240, 400], [450, 380], [680, 400]].map(([x, y], i) => (
            <text key={i} x={x} y={y} textAnchor="middle" fontSize="14" fill="#ffd870" opacity="0.75">♥</text>
          ))}
          <style>{`@keyframes linkFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </g>
      )}

      {/* ELIAS en retrait à droite, dans l'ombre, sourcils froncés */}
      <g transform="translate(960,470)" opacity="0.7">
        <ellipse cx="0" cy="60" rx="14" ry="3" fill="#0a0603" opacity="0.5" />
        <circle cx="0" cy="0" r="11" fill="#a89078" />
        <path d="M-9 -6 Q0 -12 9 -6 L9 -4 L-9 -4 Z" fill="#e8e8e0" />
        <path d="M-6 4 Q0 10 6 4 Q4 8 2 10 L-2 10 Q-4 8 -6 4 Z" fill="#e8e8e0" />
        <path d="M-16 10 L16 10 L20 60 L-20 60 Z" fill="#3a2818" stroke="#141c26" strokeWidth="0.8" />
        {t >= 4 && (
          <text x="0" y="-24" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="14" fill="#8fa3bd" opacity="0.8">…</text>
        )}
      </g>
    </svg>
  );
}

/* ============================================================
   ACTE 2 · LE BUNKER SE CREUSE — décennies
   Zoom arrière : coupe sur les niveaux du bunker qui se creusent,
   compteur temporel qui défile, MARTINE qui grossit, Elias qui disparaît.
   Fondu au noir automatique à la fin.
   ============================================================ */
function Acte2({ onFinished }) {
  const t = useSequence([500, 1600, 2600, 3700, 4800, 5700, 6600]);
  const [annee, setAnnee] = useState(2287);
  useEffect(() => {
    /* défilement fluide de l'année pendant l'acte */
    const start = Date.now();
    const dur = 6000;
    const from = 2287;
    const to = 2087; // wrap-around narratif : on finit sur 2087
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur);
      /* passe par 2287 → +15ans → +30 → +50 → +80 → +100 → 2087 */
      const y = Math.round(from + p * (to - from + 200) - (p > 0.5 ? 200 : 0));
      /* plus lisible : on fait juste une interpolation simple entre 2287 et 2087 */
      setAnnee(Math.round(from + (to - from) * p));
      if (p >= 1) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  /* déclenche le fondu au noir + onFinished */
  useEffect(() => {
    if (t >= 7) {
      const id = setTimeout(() => onFinished?.(), 1400);
      return () => clearTimeout(id);
    }
  }, [t, onFinished]);

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="a2-earth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2818" />
          <stop offset="100%" stopColor="#0e0806" />
        </linearGradient>
        <linearGradient id="a2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="60%" stopColor="#1a1030" />
          <stop offset="100%" stopColor="#3a2818" />
        </linearGradient>
        <radialGradient id="a2-pollution" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#8a3820" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8a3820" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* CIEL malade au-dessus */}
      <rect y="0" width="1000" height="160" fill="url(#a2-sky)" />
      <ellipse cx="500" cy="140" rx="800" ry="100" fill="url(#a2-pollution)" />
      {/* soleil rougeâtre voilé */}
      <circle cx="800" cy="80" r="24" fill="#c85030" opacity="0.5" />
      <circle cx="800" cy="80" r="40" fill="#c85030" opacity="0.15" />

      {/* SURFACE — ruines de la station qui reste + ancienne piste */}
      <path d="M0 160 L1000 160 L1000 200 L0 200 Z" fill="#5a3818" opacity="0.6" />
      {/* silhouettes de la station en ruine (barrées) */}
      <g opacity="0.55">
        <path d="M150 200 L150 130 L230 130 L230 100 L340 100 Q330 118 320 130 L280 130 L280 200 Z" fill="#141420" />
        <path d="M280 200 L400 200 L400 170 L490 170 L490 200 Z" fill="#141420" />
        {/* dôme éventré */}
        <path d="M480 170 A 50 40 0 0 1 580 170 Z" fill="#141420" />
        <path d="M500 172 L520 145" stroke="#2a1810" strokeWidth="1.4" />
        {/* antenne cassée */}
        <path d="M320 100 L318 60 L322 62" stroke="#5a3820" strokeWidth="1.4" fill="none" />
      </g>

      {/* SOL / SOUS-SOL */}
      <rect y="200" width="1000" height="360" fill="url(#a2-earth)" />

      {/* NIVEAUX du bunker qui apparaissent progressivement — coupe */}
      <g opacity={t >= 1 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M150 200 L150 260 L1000 260 L1000 200 Z" fill="#28303a" opacity="0.7" />
        <line x1="150" y1="260" x2="1000" y2="260" stroke="#5a6270" strokeWidth="1.2" opacity="0.6" />
        <text x="160" y="234" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700" fill="#c8a848" opacity="0.85">+2 · SERRE</text>
        {/* plantes dans les serres */}
        {[200, 260, 320, 380, 440, 500].map((x, i) => (
          <path key={i} d={`M${x} 258 q0 -12 ${(i % 2) * 2 - 1} -20`} stroke="#5a7838" strokeWidth="1.5" fill="none" opacity="0.7" />
        ))}
      </g>
      <g opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M280 260 L280 330 L1000 330 L1000 260 Z" fill="#28303a" opacity="0.75" />
        <line x1="280" y1="330" x2="1000" y2="330" stroke="#5a6270" strokeWidth="1.2" opacity="0.6" />
        <text x="290" y="298" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700" fill="#c8a848" opacity="0.85">+1 · MÉNAGES</text>
        {/* portes de cellule alignées */}
        {[340, 400, 460, 520, 580, 640, 700, 760, 820, 880, 940].map((x, i) => (
          <rect key={i} x={x} y="298" width="14" height="26" fill="#141c26" stroke="#5a6270" strokeWidth="0.6" opacity="0.85" />
        ))}
      </g>
      <g opacity={t >= 3 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M410 330 L410 400 L1000 400 L1000 330 Z" fill="#28303a" opacity="0.8" />
        <line x1="410" y1="400" x2="1000" y2="400" stroke="#5a6270" strokeWidth="1.2" opacity="0.6" />
        <text x="420" y="368" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700" fill="#c8a848" opacity="0.85">0 · ATELIERS</text>
        {/* machines */}
        {[[460, 380], [540, 380], [620, 380], [700, 380], [780, 380], [860, 380]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-14" y="-12" width="28" height="12" fill="#141c26" stroke="#5a6270" strokeWidth="0.4" />
            <circle cx="-6" cy="-6" r="2" fill="#5eff9e" opacity="0.6" />
          </g>
        ))}
      </g>
      <g opacity={t >= 4 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M540 400 L540 470 L1000 470 L1000 400 Z" fill="#28303a" opacity="0.85" />
        <line x1="540" y1="470" x2="1000" y2="470" stroke="#5a6270" strokeWidth="1.2" opacity="0.6" />
        <text x="550" y="438" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700" fill="#c8a848" opacity="0.85">−1 · ADMIN</text>
      </g>
      <g opacity={t >= 5 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M680 470 L680 560 L1000 560 L1000 470 Z" fill="#28303a" opacity="0.9" />
        <text x="690" y="508" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="700" fill="#c8a848" opacity="0.85">−2 · SERVEURS</text>
        {/* baies de serveurs */}
        {[720, 770, 820, 870, 920, 970].map((x, i) => (
          <rect key={i} x={x - 10} y="490" width="14" height="60" fill="#141c26" stroke="#5a6270" strokeWidth="0.4">
            <animate attributeName="opacity" values="0.85;1;0.85" dur={`${1.4 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>

      {/* ESCALIERS/PUITS entre les niveaux (côté gauche) */}
      <path d="M150 260 L280 260 L280 330 L410 330 L410 400 L540 400 L540 470 L680 470 L680 560"
        stroke="#5a6270" strokeWidth="2" fill="none" opacity="0.6" />

      {/* MARTINE monumentale — grossit avec le temps */}
      <g style={{ transform: t >= 1 ? `translate(200px,320px) scale(${1 + Math.min(0.9, t * 0.14)})` : "translate(200px,320px) scale(0.7)", transformOrigin: "200px 320px", transition: "transform 1400ms cubic-bezier(.25,.8,.3,1)" }}>
        <rect x="-80" y="-80" width="160" height="160" fill="#0a0806" stroke="#7fd8ff" strokeWidth="3" opacity="0.9" />
        <rect x="-68" y="-68" width="136" height="136" fill="#141c26" opacity="0.9" />
        {/* iris central */}
        <ellipse cx="0" cy="0" rx="44" ry="18" fill="#0a0806" />
        <circle cx="0" cy="0" r="14" fill="#7fd8ff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="6" fill="#0a0806" />
        {/* barres de progression décoratives */}
        <rect x="-60" y="40" width="120" height="4" fill="#141c26" />
        <rect x="-60" y="40" width="90" height="4" fill="#7fd8ff" opacity="0.8">
          <animate attributeName="width" values="30;120;60;120" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="-60" y="48" width="120" height="4" fill="#141c26" />
        <rect x="-60" y="48" width="60" height="4" fill="#5eff9e" opacity="0.8">
          <animate attributeName="width" values="20;100;40;100" dur="5s" repeatCount="indefinite" />
        </rect>
        <text x="0" y="70" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="14" fontWeight="800" fill="#7fd8ff" letterSpacing="6">MARTINE</text>
      </g>

      {/* Petites silhouettes d'ouvriers dans les niveaux */}
      {[[220, 248], [260, 248], [340, 320], [380, 320], [460, 320], [500, 390], [600, 390], [700, 390], [600, 460], [700, 460], [780, 460]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={t >= Math.min(5, Math.floor(i / 2) + 1) ? 0.9 : 0}
          style={{ transition: "opacity 800ms" }}>
          <circle r="4" fill="#c8a888" />
          <path d="M-5 2 L5 2 L6 22 L-6 22 Z" fill={i % 3 === 0 ? "#5a4028" : "#3a4058"} />
        </g>
      ))}

      {/* Compteur d'année en gros — coin haut gauche */}
      <g transform="translate(30, 40)">
        <rect x="0" y="0" width="200" height="60" fill="#0a0806" stroke="#c8a848" strokeWidth="1.5" opacity="0.85" />
        <text x="14" y="34" fontFamily="ui-monospace,monospace" fontSize="30" fontWeight="800" fill="#c8a848" letterSpacing="6">{annee}</text>
        <text x="14" y="52" fontFamily="ui-monospace,monospace" fontSize="9" fill="#8fa3bd" letterSpacing="4" opacity="0.85">année · CHRONO</text>
        {/* petit tick qui pulse */}
        <circle cx="188" cy="14" r="3" fill="#c8a848">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ELIAS silhouette qui s'éloigne à la surface puis disparaît (côté droit) */}
      {t >= 6 && (
        <g style={{ animation: "eliasWalk 2800ms ease-in forwards" }}>
          <g transform="translate(880,180)">
            <ellipse cx="0" cy="18" rx="8" ry="2" fill="#0a0603" opacity="0.5" />
            <circle cx="0" cy="0" r="8" fill="#a89078" />
            <path d="M-6 -4 Q0 -10 6 -4 L6 -2 L-6 -2 Z" fill="#e8e8e0" />
            <path d="M-4 2 Q0 6 4 2 Q3 6 2 8 L-2 8 Q-3 6 -4 2 Z" fill="#e8e8e0" />
            <path d="M-10 6 L10 6 L12 32 L-12 32 Z" fill="#3a2818" />
            {/* canne */}
            <path d="M-14 8 L-18 32" stroke="#5a4028" strokeWidth="1.4" />
            <text x="0" y="-14" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="12" fill="#c8d4e2" opacity="0.75">…</text>
          </g>
          <style>{`
            @keyframes eliasWalk {
              0% { transform: translate(0,0); opacity: 1; }
              50% { transform: translate(60px,-30px); opacity: 0.85; }
              100% { transform: translate(120px,-60px); opacity: 0; }
            }
          `}</style>
        </g>
      )}

      {/* Voile de fondu au noir (déclenché à t>=7) */}
      <rect width="1000" height="560" fill="#000" opacity={t >= 7 ? 1 : 0} style={{ transition: "opacity 1400ms ease-in" }} />
    </svg>
  );
}

/* ============================================================
   ACTE 3 · LE DISCERNEMENT — réveil en 2087 dans le bunker
   Fondu depuis le noir, la scène apparaît par paliers.
   ============================================================ */
function Acte3() {
  const t = useSequence([400, 1400, 2400, 3400, 4200]);
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="a3-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#0e1218" />
        </linearGradient>
        <linearGradient id="a3-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1e26" />
          <stop offset="100%" stopColor="#0a0e14" />
        </linearGradient>
      </defs>

      {/* NOIR + fondu vers la scène */}
      <rect width="1000" height="560" fill="#000" />
      <rect width="1000" height="440" fill="url(#a3-wall)" opacity={t >= 1 ? 1 : 0}
        style={{ transition: "opacity 1600ms ease-out" }} />
      <rect y="440" width="1000" height="120" fill="url(#a3-floor)" opacity={t >= 1 ? 1 : 0}
        style={{ transition: "opacity 1600ms ease-out" }} />

      {/* Tuyaux de ventilation au plafond */}
      <g opacity={t >= 1 ? 1 : 0} style={{ transition: "opacity 1200ms 400ms" }}>
        <rect y="20" width="1000" height="14" fill="#141c26" />
        <rect x="0" y="34" width="1000" height="2" fill="#3a4048" />
        {/* rivets */}
        {[80, 200, 320, 440, 560, 680, 800, 920].map((x, i) => (
          <circle key={i} cx={x} cy="27" r="2.5" fill="#5a6270" />
        ))}
        {/* prise d'air */}
        <rect x="700" y="14" width="120" height="20" fill="#0a0806" stroke="#5a6270" strokeWidth="1" />
        {[710, 730, 750, 770, 790, 810].map((x, i) => (
          <line key={i} x1={x} y1="16" x2={x} y2="32" stroke="#5a6270" strokeWidth="1" />
        ))}
      </g>

      {/* NÉON long clignotant au plafond */}
      <g opacity={t >= 1 ? 1 : 0} style={{ transition: "opacity 800ms 400ms" }}>
        <rect x="180" y="46" width="640" height="8" fill="#c8d4e2" opacity="0.85">
          <animate attributeName="opacity" values="0.9;0.4;0.95;0.5;0.9" dur="2.6s" begin="1.4s" repeatCount="indefinite" />
        </rect>
        <ellipse cx="500" cy="90" rx="360" ry="50" fill="#c8d4e2" opacity="0.06" />
      </g>

      {/* Papier peint / béton texture — quelques lignes verticales */}
      <g opacity={t >= 1 ? 0.35 : 0} style={{ transition: "opacity 1200ms" }}>
        {[80, 240, 400, 560, 720, 880].map((x, i) => (
          <line key={i} x1={x} y1="34" x2={x} y2="440" stroke="#0a0e14" strokeWidth="1" />
        ))}
      </g>

      {/* CAPTEURS / voyants muraux */}
      <g opacity={t >= 3 ? 1 : 0} style={{ transition: "opacity 900ms" }}>
        <g transform="translate(100,140)">
          <rect x="-14" y="-14" width="28" height="28" fill="#141c26" stroke="#5a6270" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="5" fill="#c85030">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#8fa3bd" opacity="0.75">CO₂</text>
        </g>
        <g transform="translate(180,140)">
          <rect x="-14" y="-14" width="28" height="28" fill="#141c26" stroke="#5a6270" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="5" fill="#5eff9e">
            <animate attributeName="opacity" values="1;0.5;1" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#8fa3bd" opacity="0.75">AIR</text>
        </g>
      </g>

      {/* AFFICHE réglementaire à gauche du lit */}
      <g transform="translate(80,220)" opacity={t >= 2 ? 0.8 : 0} style={{ transition: "opacity 1000ms 300ms" }}>
        <rect x="-30" y="-40" width="60" height="80" fill="#f0e0c0" stroke="#5a3818" strokeWidth="1" />
        <text x="0" y="-24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="800" fill="#5a3818">RÈGLES</text>
        <line x1="-22" y1="-16" x2="22" y2="-16" stroke="#5a3818" strokeWidth="0.4" />
        {[-6, 4, 14, 24].map((y, i) => (
          <line key={i} x1="-22" y1={y} x2="22" y2={y} stroke="#5a3818" strokeWidth="0.4" opacity="0.6" />
        ))}
      </g>

      {/* LIT métallique + JOUEUR assis */}
      <g transform="translate(140,340)" opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 1000ms" }}>
        {/* structure du lit */}
        <rect x="0" y="60" width="380" height="80" fill="#5a6270" stroke="#0a0806" strokeWidth="2" />
        <rect x="4" y="30" width="372" height="30" fill="#5a3018" stroke="#0a0806" strokeWidth="1" />
        {/* oreiller */}
        <rect x="14" y="20" width="80" height="24" rx="6" fill="#e8eef5" stroke="#3a4048" strokeWidth="0.8" />
        {/* pieds */}
        <rect x="0" y="140" width="10" height="18" fill="#3a4048" />
        <rect x="370" y="140" width="10" height="18" fill="#3a4048" />
        {/* couverture froissée */}
        <path d="M14 44 Q80 40 200 50 Q300 44 380 50 L380 60 L14 60 Z" fill="#3a2818" opacity="0.8" />
        {/* casier sous le lit */}
        <rect x="20" y="158" width="80" height="24" fill="#141c26" stroke="#5a6270" strokeWidth="0.6" />
        <circle cx="60" cy="170" r="2" fill="#5a6270" />
        {/* JOUEUR assis, respire */}
        <g transform="translate(80,-8)">
          <animateTransform attributeName="transform" type="translate"
            values="80 -8; 80 -6; 80 -8" dur="4s" repeatCount="indefinite" />
          <ellipse cx="0" cy="52" rx="16" ry="3" fill="#0a0603" opacity="0.5" />
          <circle cx="0" cy="0" r="12" fill="#e0a878" stroke="#5a3018" strokeWidth="0.6" />
          {/* cheveux hirsutes (au réveil) */}
          <path d="M-10 -6 Q0 -14 10 -6 L10 -2 L-10 -2 Z" fill="#3a2818" />
          <path d="M-4 -10 L-2 -14 M4 -10 L2 -14 M0 -12 L0 -16" stroke="#3a2818" strokeWidth="1" />
          {/* yeux fermés (au réveil) */}
          <line x1="-5" y1="-2" x2="-1" y2="-2" stroke="#3a2818" strokeWidth="1" strokeLinecap="round" />
          <line x1="1" y1="-2" x2="5" y2="-2" stroke="#3a2818" strokeWidth="1" strokeLinecap="round" />
          {/* torse */}
          <path d="M-16 10 L16 10 L20 60 L-20 60 Z" fill="#3a80c8" stroke="#141c26" strokeWidth="0.8" />
        </g>
      </g>

      {/* ÉTAGÈRE à droite avec objets */}
      <g transform="translate(560,300)" opacity={t >= 4 ? 1 : 0} style={{ transition: "opacity 900ms" }}>
        <rect x="0" y="0" width="200" height="4" fill="#3a2818" />
        <rect x="0" y="60" width="200" height="4" fill="#3a2818" />
        {/* piliers */}
        <rect x="0" y="0" width="4" height="64" fill="#3a2818" />
        <rect x="196" y="0" width="4" height="64" fill="#3a2818" />
        {/* CARNET NOIR avec halo doré (attire l'œil !) */}
        <g transform="translate(80,-30)">
          <rect x="0" y="0" width="40" height="34" fill="#0a0806" stroke="#c8a848" strokeWidth="1.6" />
          <path d="M0 8 L40 8" stroke="#3a2818" strokeWidth="0.5" />
          <path d="M8 4 L8 30" stroke="#c8a848" strokeWidth="0.4" opacity="0.6" />
          <circle cx="20" cy="16" r="28" fill="none" stroke="#c8a848" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.85">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0 20 16" to="360 20 16" dur="16s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Tasse en fer */}
        <g transform="translate(20,20)">
          <rect x="0" y="0" width="14" height="18" fill="#5a6270" stroke="#3a4048" strokeWidth="0.6" />
          <ellipse cx="7" cy="0" rx="7" ry="2" fill="#3a4048" />
          <path d="M14 4 q6 0 6 6 q0 4 -6 4" stroke="#5a6270" strokeWidth="1" fill="none" />
        </g>
        {/* Livres */}
        <g transform="translate(140,-20)">
          <rect x="0" y="0" width="6" height="24" fill="#8a3820" />
          <rect x="6" y="0" width="6" height="24" fill="#3a5878" />
          <rect x="12" y="2" width="6" height="22" fill="#5a4028" />
          <rect x="18" y="-2" width="6" height="26" fill="#28303a" />
        </g>
      </g>

      {/* PANNEAU MARTINE à droite — imposant */}
      <g transform="translate(820,200)" opacity={t >= 3 ? 1 : 0} style={{ transition: "opacity 1100ms" }}>
        {/* cadre */}
        <rect x="-100" y="-70" width="200" height="180" fill="#0a0806" stroke="#7fd8ff" strokeWidth="3" />
        <rect x="-90" y="-60" width="180" height="160" fill="#141c26" />
        {/* header */}
        <text x="0" y="-38" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="800" fill="#7fd8ff" letterSpacing="3">BULLETIN N-27</text>
        <line x1="-80" y1="-30" x2="80" y2="-30" stroke="#7fd8ff" strokeWidth="0.6" opacity="0.6" />
        {/* texte du bulletin */}
        <text x="0" y="-8" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" fill="#c8d4e2" fontStyle="italic">« Bienvenue,</text>
        <text x="0" y="10" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" fill="#c8d4e2" fontStyle="italic">HABITANT N-27. »</text>
        <text x="0" y="34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fill="#c8d4e2" fontStyle="italic">La surface est</text>
        <text x="0" y="50" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fill="#c8d4e2" fontStyle="italic">encore inhabitable.</text>
        <text x="0" y="72" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="#c8d4e2" fontStyle="italic" opacity="0.8">Restez chez vous.</text>
        <text x="0" y="94" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#5eff9e" letterSpacing="2">— MARTINE —</text>
        {/* LED d'état */}
        <circle cx="86" cy="-60" r="4" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* petite antenne */}
        <path d="M0 -70 L0 -84" stroke="#5a6270" strokeWidth="1.4" />
        <circle cx="0" cy="-86" r="3" fill="#3a4048" />
      </g>

      {/* PORTE + plaque N-27 à droite */}
      <g transform="translate(960,260)" opacity={t >= 5 ? 1 : 0} style={{ transition: "opacity 800ms" }}>
        <rect x="-20" y="-80" width="40" height="180" fill="#0a0e14" stroke="#3a4048" strokeWidth="2" />
        {/* poignée */}
        <circle cx="10" cy="20" r="3" fill="#c8a848" stroke="#5a3818" strokeWidth="0.6" />
        {/* plaque */}
        <rect x="-16" y="-70" width="32" height="14" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
        <text x="0" y="-59" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="800" fill="#0a0806">N-27</text>
      </g>

      {/* Vignette "il fait froid" — buée d'haleine autour du joueur */}
      {t >= 5 && (
        <g transform="translate(200,320)" opacity="0.4">
          <ellipse cx="30" cy="8" rx="12" ry="4" fill="#c8d4e2">
            <animate attributeName="cx" values="30;70" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   CONTENU NARRATIF DES 4 ACTES
   ============================================================ */
const ACTS = [
  {
    kicker: "RETOUR À LA STATION · APRÈS LE SAUT",
    titre: "LE REMÈDE MARCHE",
    couleur: "#7fd8ff",
    texte: [
      "La MARTINE atterrit sur la plateforme. Al3x1A descend, chancelante. Elias arrive en courant, incrédule.",
      "Mira sort son écran, teste le remède, remonte les yeux vers toi et sourit. « Ça marche. Ça marche vraiment. »",
      "Al3x1A te fixe encore une seconde, comme si elle voulait dire quelque chose. Puis elle secoue la tête et sourit. « Merci d'être venu·e me chercher. »",
    ],
    Anim: Acte0,
    minDelay: 5200,
    montreRemede: true,
  },
  {
    kicker: "TROIS SEMAINES PLUS TARD",
    titre: "LA MÉMOIRE REVIENT",
    couleur: "#5eff9e",
    texte: [
      "Le remède est diffusé. Les survivants retrouvent leurs prénoms, puis leurs métiers, puis leurs enfants. Une femme reconnaît son mari après dix-neuf ans de silence.",
      "Mira reprogramme MARTINE en « mémoire commune » : chaque témoignage y est archivé, plus jamais on n'oubliera. Elias fronce les sourcils. Tout le monde accepte.",
    ],
    Anim: Acte1,
    minDelay: 4600,
  },
  {
    kicker: "QUELQUES DÉCENNIES PLUS TARD",
    titre: "LE BUNKER SE CREUSE",
    couleur: "#c8a848",
    texte: [
      "On creuse un bunker sous la station : plus sûr, disent les bulletins. Une génération, puis deux.",
      "MARTINE, elle, n'a pas vieilli. Elle archive, calcule, conseille. Puis décide. Elle a sauvé la mémoire — personne ne remet ses paroles en cause.",
      "Elias, très vieux, murmure un jour : « On lui a donné trop de place. » Il disparaît la semaine suivante. On dit qu'il s'est perdu dehors.",
    ],
    Anim: Acte2,
    fondsNoirAuto: true,
    /* pas de minDelay — la fin est déclenchée par onFinished de l'Acte2 */
  },
  {
    kicker: "BUNKER · 2087",
    titre: "LE DISCERNEMENT",
    couleur: "#a04ce8",
    texte: [
      "Tu te réveilles dans une chambre que tu ne reconnais pas. HABITANT N-27. Sur ton mur, MARTINE annonce que la surface est encore inhabitable.",
      "Sur ton étagère, un vieux carnet à couverture noire. Trois affirmations sans source, écrites à la main. Aucun moyen simple de vérifier — ou peut-être si.",
      "Une voix féminine chuchote parfois sur les vieilles fréquences radio. Un prénom que tu as l'impression d'avoir déjà connu, sans savoir où. À toi de le retrouver.",
    ],
    Anim: Acte3,
    minDelay: 4600,
    finale: true,
  },
];

/* ============================================================
   COMPOSANT PRINCIPAL
   ============================================================ */
export default function FinJeu2({ prenom, remede, onRetour, onLancerJeu3 }) {
  const [i, setI] = useState(0);
  const acte = ACTS[i];
  const isLast = i === ACTS.length - 1;

  /* Le texte + les boutons s'affichent APRÈS un délai minimum (le temps
     que les animations se mettent en place). On tracke ça par acte via
     un state qui se réinitialise à chaque changement d'acte. */
  const [textePret, setTextePret] = useState(false);
  useEffect(() => {
    setTextePret(false);
    if (acte.fondsNoirAuto) return; // Acte 2 gère lui-même la fin
    const id = setTimeout(() => setTextePret(true), acte.minDelay || 1200);
    return () => clearTimeout(id);
  }, [i, acte]);

  /* Callback appelé par l'Acte 2 quand le fondu au noir est terminé.
     On saute automatiquement à l'acte 3 (le réveil). */
  const goToBunker = () => {
    setI(3);
  };

  return (
    <div style={{ minHeight: "100vh", background: i >= 3
        ? "radial-gradient(ellipse at 50% 30%, #0e1218 0%, #05070c 70%)"
        : "radial-gradient(ellipse at 50% 30%, #14233a 0%, #080d16 70%)",
      padding: 20, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5", transition: "background 1200ms ease-in-out" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>

        {/* Progression 4 pastilles */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
          {ACTS.map((a, k) => (
            <div key={k} style={{
              width: k === i ? 42 : 10, height: 10, borderRadius: 5,
              background: k <= i ? a.couleur : "#2a3648",
              transition: "width 400ms ease, background 400ms ease",
            }} />
          ))}
        </div>

        <div style={{ fontFamily: "ui-monospace,monospace", color: acte.couleur, letterSpacing: 3, fontSize: 11, marginTop: 14, opacity: textePret ? 1 : 0.55, transition: "opacity 700ms" }}>{acte.kicker}</div>
        <h1 style={{ fontFamily: "ui-monospace,monospace", color: acte.couleur, letterSpacing: 3, fontSize: 24, marginTop: 4, marginBottom: 10, opacity: textePret ? 1 : 0.7, transition: "opacity 900ms" }}>{acte.titre}</h1>

        {/* SVG animé de l'acte — remonté par changement de key à chaque acte */}
        <div style={{ background: "#0a1020", border: `1px solid ${acte.couleur}44`, borderRadius: 12, overflow: "hidden", marginTop: 10, boxShadow: `0 0 32px ${acte.couleur}22` }}>
          <acte.Anim key={i} onFinished={acte.fondsNoirAuto ? goToBunker : undefined} />
        </div>

        {/* Corps du récit — apparaît en fondu quand textePret */}
        <div style={{ background: "#101827", border: `1px solid ${acte.couleur}44`, borderRadius: 12, padding: "16px 22px", marginTop: 12, textAlign: "left", opacity: textePret ? 1 : 0, transition: "opacity 900ms ease-out" }}>
          {acte.texte.map((paragraphe, k) => (
            <p key={k} style={{ fontSize: 15, lineHeight: 1.7, color: "#e8eef5", margin: k === 0 ? 0 : "10px 0 0" }}>
              {paragraphe}
            </p>
          ))}
        </div>

        {/* Carte du remède (acte 0 uniquement) */}
        {acte.montreRemede && remede && (
          <div style={{ background: "#0e1420", border: "2px solid #7fd8ff", borderRadius: 12, padding: "12px 20px", marginTop: 12, display: "flex", gap: 14, alignItems: "center", opacity: textePret ? 1 : 0, transition: "opacity 900ms" }}>
            <div style={{ fontSize: 40 }}>{remede.emoji}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#7fd8ff" }}>REMÈDE ADMINISTRÉ</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{remede.name}</div>
              <div style={{ fontSize: 12, color: "#c8d4e2", opacity: 0.85, marginTop: 3 }}>{remede.desc}</div>
            </div>
          </div>
        )}

        {/* Boutons — apparaissent après le texte */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", opacity: textePret ? 1 : 0, transition: "opacity 900ms 300ms" }}>
          {i > 0 && !acte.fondsNoirAuto && (
            <button onClick={() => setI(i - 1)}
              style={{ background: "#141b26", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ← Précédent
            </button>
          )}
          {!isLast && (
            <button onClick={() => setI(i + 1)} autoFocus
              style={{ background: acte.couleur, color: "#06110b", border: "none", borderRadius: 10, padding: "12px 26px", fontWeight: 800, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: `0 0 18px ${acte.couleur}66` }}>
              Suivant →
            </button>
          )}
          {isLast && (
            <>
              <button onClick={onRetour}
                style={{ background: "#141b26", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                ← Retour au menu
              </button>
              {onLancerJeu3 && (
                <button onClick={onLancerJeu3} autoFocus
                  style={{ background: acte.couleur, color: "#0a0806", border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 800, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: `0 0 22px ${acte.couleur}88` }}>
                  🌑 COMMENCER LE DISCERNEMENT →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
