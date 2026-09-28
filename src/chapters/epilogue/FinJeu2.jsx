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
  /* phases : 1 = MARTINE atterrit · 2 = ils sortent · 3 = Elias les rejoint · 4 = Mira teste */
  const t = useSequence([700, 2100, 3400, 4600]);
  return (
    <svg viewBox="0 0 800 320" style={{ display: "block", width: "100%", height: "auto" }}>
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
      </defs>

      {/* CIEL ÉTOILÉ */}
      <rect width="800" height="240" fill="url(#a0-sky)" />
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={(i * 41) % 800} cy={20 + (i * 17) % 140} r={i % 5 === 0 ? 1.4 : 0.8} fill="#e8eef5"
          opacity={0.55 + (i % 3) * 0.15}>
          <animate attributeName="opacity" values={`${0.3};${1};${0.3}`} dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Silhouette de la station en arrière-plan */}
      <path d="M100 180 L100 110 L180 110 L180 90 L300 90 L300 110 L360 110 L360 80 L440 80 L440 110 L520 110 L520 90 L640 90 L640 110 L700 110 L700 180 Z"
        fill="#0e1420" stroke="#28303a" strokeWidth="1.5" />
      {[[200, 130], [260, 120], [400, 110], [480, 130], [580, 120]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="6" height="8" fill="#ffd870" opacity="0.85">
          <animate attributeName="opacity" values="0.6;1;0.6" dur={`${3 + (i % 2)}s`} repeatCount="indefinite" />
        </rect>
      ))}

      {/* Plateforme d'atterrissage */}
      <rect y="240" width="800" height="80" fill="#141c26" />
      <path d="M0 240 L800 240" stroke="#3a4048" strokeWidth="2" />
      {/* stries de piste */}
      {[100, 200, 300, 400, 500, 600, 700].map((x) => (
        <rect key={x} x={x - 8} y="252" width="16" height="4" fill="#ffd166" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.2s" begin={`${(x % 200) / 400}s`} repeatCount="indefinite" />
        </rect>
      ))}

      {/* Halo du portail qui se resserre */}
      {t < 3 && (
        <>
          <ellipse cx="400" cy="240" rx="220" ry="50" fill="url(#a0-portal)" opacity={t >= 1 ? 0.9 : 0.5}>
            <animate attributeName="rx" values="260;140;180" dur="2.4s" fill="freeze" />
          </ellipse>
          <circle cx="400" cy="230" r="70" fill="none" stroke="#7fd8ff" strokeWidth="1.5" opacity="0.75">
            <animate attributeName="r" values="90;40;60" dur="2.4s" fill="freeze" />
            <animate attributeName="opacity" values="0.9;0.4;0.7" dur="2.4s" fill="freeze" />
          </circle>
        </>
      )}

      {/* MARTINE qui descend depuis le haut, se pose à t>=1 */}
      <g style={{ transform: t >= 1 ? "translate(0px, 0px)" : "translate(0px, -160px)", transition: "transform 900ms cubic-bezier(.34,1.56,.64,1)" }}>
        <g transform="translate(400,210)">
          {/* soucoupe/noix */}
          <ellipse cx="0" cy="20" rx="60" ry="10" fill="#0a0603" opacity="0.6" />
          <path d="M-52 -14 Q0 -34 52 -14 Q56 8 26 14 L-26 14 Q-56 8 -52 -14 Z" fill="#a06838" stroke="#3a1810" strokeWidth="2" />
          <path d="M-40 -14 Q0 -22 40 -14" stroke="#3a1810" strokeWidth="0.6" fill="none" opacity="0.5" />
          <circle cx="-1" cy="-6" r="10" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.5" />
          <rect x="-24" y="6" width="48" height="10" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="0" y="14" textAnchor="middle" fontSize="6" fill="#5eff9e" fontFamily="ui-monospace,monospace">2287</text>
          <circle cx="18" cy="-30" r="3" fill="#5eff9e">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      {/* JOUEUR à gauche */}
      <g transform="translate(320,260)" opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <circle cx="0" cy="0" r="9" fill="#e0a878" />
        <path d="M-14 8 L14 8 L18 50 L-18 50 Z" fill="#3a80c8" stroke="#141c26" strokeWidth="0.8" />
      </g>

      {/* AL3X1A au centre, chancelante, halo doré */}
      {t >= 2 && (
        <g transform="translate(400,262)">
          <ellipse cx="0" cy="-1" rx="26" ry="30" fill="url(#a0-warm)" opacity="0.9" />
          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; 1 0; 0 0; -1 0; 0 0" dur="2.8s" repeatCount="indefinite" />
            <path d="M-8 -10 Q0 -18 8 -10 L11 -2 L-11 -2 Z" fill="#c8a848" />
            <circle cx="0" cy="0" r="8" fill="#e0a878" />
            <path d="M-12 6 L12 6 L15 46 L-15 46 Z" fill="#a04ce8" stroke="#141c26" strokeWidth="0.8" />
          </g>
          <circle r="26" fill="none" stroke="#ffd870" strokeWidth="0.8" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ELIAS qui arrive en courant depuis la droite */}
      {t >= 3 && (
        <g style={{ transform: "translate(0px, 0px)", animation: "eliasRun 1.1s ease-out" }}>
          <g transform="translate(460,260)">
            <circle cx="0" cy="0" r="9" fill="#c8a888" />
            <path d="M-14 8 L14 8 L18 50 L-18 50 Z" fill="#5a4028" stroke="#141c26" strokeWidth="0.8" />
            {/* petit "!" au-dessus */}
            <text x="0" y="-14" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fontWeight="800" fill="#ffd166">!</text>
          </g>
          <style>{`
            @keyframes eliasRun {
              0% { transform: translateX(240px); opacity: 0; }
              60% { transform: translateX(0); opacity: 1; }
              70% { transform: translateX(-5px); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </g>
      )}

      {/* MIRA à droite avec écran + LED verte (test du remède) */}
      {t >= 4 && (
        <g transform="translate(520,262)" opacity="0" style={{ animation: "fadeIn 700ms ease-out 0s forwards" }}>
          <circle cx="0" cy="0" r="8" fill="#e0a878" />
          <path d="M-12 6 L12 6 L15 46 L-15 46 Z" fill="#5eff9e" stroke="#141c26" strokeWidth="0.8" />
          <rect x="4" y="18" width="10" height="14" fill="#141c26" stroke="#5eff9e" strokeWidth="0.6" />
          <circle cx="9" cy="20" r="1.4" fill="#5eff9e">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          {/* "OK" flottant */}
          <text x="20" y="10" fontFamily="ui-monospace,monospace" fontSize="8" fill="#5eff9e" letterSpacing="1">✓ OK</text>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   ACTE 1 · LA MÉMOIRE REVIENT — 3 semaines plus tard
   Écran MARTINE-mémoire commune qui grossit, foule qui se rapproche.
   ============================================================ */
function Acte1() {
  const t = useSequence([600, 1600, 3000, 4200]);
  return (
    <svg viewBox="0 0 800 320" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="a1-warm" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a1-mem" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="320" fill="#0a1420" />
      <ellipse cx="400" cy="130" rx="500" ry="240" fill="url(#a1-warm)" />

      {/* horodatage discret */}
      <text x="20" y="24" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5eff9e" letterSpacing="2" opacity="0.75">J+3 SEMAINES</text>

      {/* ÉCRAN MARTINE central "MÉMOIRE COMMUNE" qui grossit progressivement */}
      <g transform="translate(400,110)">
        <g style={{ transform: t >= 1 ? "scale(1)" : "scale(0.4)", transformOrigin: "center", transformBox: "fill-box", transition: "transform 900ms ease-out" }}>
          <rect x="-70" y="-42" width="140" height="84" fill="#0a0806" stroke="#7fd8ff" strokeWidth="2" opacity={t >= 1 ? 1 : 0} />
          <rect x="-64" y="-36" width="128" height="72" fill="#0a1a2a" opacity={t >= 1 ? 1 : 0} />
          <text x="0" y="-16" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#7fd8ff" letterSpacing="3" opacity={t >= 2 ? 1 : 0}
            style={{ transition: "opacity 600ms" }}>MÉMOIRE</text>
          <text x="0" y="-2" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#7fd8ff" letterSpacing="3" opacity={t >= 2 ? 1 : 0}
            style={{ transition: "opacity 800ms 200ms" }}>COMMUNE</text>
          <text x="0" y="20" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e" letterSpacing="2" opacity={t >= 3 ? 1 : 0}
            style={{ transition: "opacity 800ms" }}>— MARTINE —</text>
          {/* halo doux qui pulse une fois allumé */}
          {t >= 2 && (
            <circle r="60" fill="url(#a1-mem)" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.6s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </g>

      {/* Sol */}
      <rect y="240" width="800" height="80" fill="#141c26" />
      <path d="M0 240 L800 240" stroke="#28303a" strokeWidth="2" />

      {/* FOULE d'habitants qui se rapproche petit à petit */}
      {[
        [90, "#c8a848", "#3a80c8", -30],
        [160, "#e0a878", "#c88060", -20],
        [230, "#c8a888", "#8a3820", -10],
        [320, "#e0a878", "#5eff9e", 0],
        [400, "#c8a848", "#a04ce8", 0],
        [470, "#e0a878", "#e0a848", 10],
        [560, "#c8a888", "#3a80c8", 20],
        [630, "#e0a878", "#5a3818", 30],
        [710, "#c8a848", "#8a3820", 40],
      ].map(([x, skin, coat, dx], i) => (
        <g key={i} style={{ transform: t >= 3 ? `translateX(${dx * 0.4}px)` : "translateX(0)", transition: `transform ${1200 + i * 60}ms ease-in-out` }}>
          <g transform={`translate(${x},260)`}>
            <circle cx="0" cy="0" r="8" fill={skin} />
            <path d="M-12 6 L12 6 L15 46 L-15 46 Z" fill={coat} stroke="#141c26" strokeWidth="0.6" />
          </g>
        </g>
      ))}

      {/* Regards / retrouvailles : traits pointillés dorés */}
      {t >= 4 && (
        <g opacity="0" style={{ animation: "linkFade 900ms ease-out forwards" }}>
          <path d="M160 258 Q245 230 320 258" stroke="#ffd870" strokeWidth="1.2" fill="none" opacity="0.7" strokeDasharray="4 3" />
          <path d="M400 258 Q475 230 560 258" stroke="#ffd870" strokeWidth="1.2" fill="none" opacity="0.7" strokeDasharray="4 3" />
          <path d="M90 258 Q135 220 230 258" stroke="#ffd870" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 3" />
          <style>{`@keyframes linkFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </g>
      )}

      {/* ELIAS en retrait à droite, dans l'ombre, sourcils froncés */}
      <g transform="translate(760,260)" opacity="0.65">
        <circle cx="0" cy="0" r="9" fill="#a89078" />
        <path d="M-14 8 L14 8 L18 50 L-18 50 Z" fill="#3a2818" stroke="#141c26" strokeWidth="0.8" />
        {t >= 4 && (
          <text x="0" y="-14" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#8fa3bd" opacity="0.7">…</text>
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
    <svg viewBox="0 0 800 320" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="a2-earth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2818" />
          <stop offset="100%" stopColor="#0e0806" />
        </linearGradient>
        <linearGradient id="a2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1030" />
          <stop offset="100%" stopColor="#3a2818" />
        </linearGradient>
      </defs>

      {/* CIEL au-dessus, terre en-dessous */}
      <rect y="0" width="800" height="100" fill="url(#a2-sky)" />
      <path d="M0 30 L200 22 L400 40 L600 20 L800 40 L800 100 L0 100 Z" fill="#8a3820" opacity="0.55" />
      <rect y="100" width="800" height="220" fill="url(#a2-earth)" />

      {/* NIVEAUX du bunker qui apparaissent progressivement */}
      <g opacity={t >= 1 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M100 100 L100 150 L800 150 L800 100 Z" fill="#28303a" opacity="0.6" />
        <line x1="100" y1="150" x2="800" y2="150" stroke="#5a6270" strokeWidth="1" opacity="0.6" />
        <text x="106" y="132" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8a848" opacity="0.7">+2</text>
      </g>
      <g opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M250 150 L250 190 L800 190 L800 150 Z" fill="#28303a" opacity="0.6" />
        <line x1="250" y1="190" x2="800" y2="190" stroke="#5a6270" strokeWidth="1" opacity="0.6" />
        <text x="256" y="172" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8a848" opacity="0.7">+1</text>
      </g>
      <g opacity={t >= 3 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M400 190 L400 230 L800 230 L800 190 Z" fill="#28303a" opacity="0.7" />
        <line x1="400" y1="230" x2="800" y2="230" stroke="#5a6270" strokeWidth="1" opacity="0.6" />
        <text x="406" y="212" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8a848" opacity="0.7">0</text>
      </g>
      <g opacity={t >= 4 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M550 230 L550 280 L800 280 L800 230 Z" fill="#28303a" opacity="0.75" />
        <text x="556" y="252" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8a848" opacity="0.7">−1</text>
      </g>
      <g opacity={t >= 5 ? 1 : 0} style={{ transition: "opacity 500ms" }}>
        <path d="M650 280 L650 320 L800 320 L800 280 Z" fill="#28303a" opacity="0.85" />
        <text x="656" y="302" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8a848" opacity="0.7">−2</text>
      </g>

      {/* MARTINE qui grossit progressivement */}
      <g transform="translate(600,120)"
        style={{ transform: t >= 1 ? `translate(600px,120px) scale(${1 + Math.min(0.8, t * 0.12)})` : "translate(600px,120px) scale(0.6)", transformOrigin: "center", transition: "transform 1200ms cubic-bezier(.25,.8,.3,1)" }}>
        <rect x="-60" y="-60" width="120" height="120" fill="#0a0806" stroke="#7fd8ff" strokeWidth="2" opacity="0.9" />
        <rect x="-52" y="-52" width="104" height="104" fill="#141c26" opacity="0.9" />
        <ellipse cx="0" cy="0" rx="30" ry="12" fill="#0a0806" />
        <circle cx="0" cy="0" r="9" fill="#7fd8ff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="4" fill="#0a0806" />
        <text x="0" y="52" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#7fd8ff" letterSpacing="4">MARTINE</text>
      </g>

      {/* Silhouettes minuscules d'ouvriers dans les niveaux */}
      {[[150, 138], [180, 138], [220, 178], [260, 178], [340, 178], [420, 218], [480, 218], [560, 258]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={t >= Math.min(5, Math.floor(i / 2) + 1) ? 0.85 : 0}
          style={{ transition: "opacity 800ms" }}>
          <circle r="3" fill="#c8a888" />
          <path d="M-4 2 L4 2 L5 16 L-5 16 Z" fill="#5a4028" />
        </g>
      ))}

      {/* Compteur d'année en gros au centre haut, ticks discrets */}
      <g transform="translate(50, 40)">
        <text fontFamily="ui-monospace,monospace" fontSize="26" fontWeight="800" fill="#c8a848" letterSpacing="4">{annee}</text>
        <text x="0" y="20" fontFamily="ui-monospace,monospace" fontSize="9" fill="#8fa3bd" letterSpacing="2">année</text>
      </g>

      {/* ELIAS silhouette qui s'éloigne à l'extérieur puis disparaît */}
      {t >= 6 && (
        <g style={{ animation: "eliasWalk 2600ms ease-in forwards" }}>
          <g transform="translate(100,88)">
            <circle r="6" fill="#a89078" />
            <path d="M-6 4 L6 4 L8 26 L-8 26 Z" fill="#3a2818" />
            <text x="0" y="-8" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="8" fill="#c8d4e2" opacity="0.7">…</text>
          </g>
          <style>{`
            @keyframes eliasWalk {
              0% { transform: translate(0,0); opacity: 1; }
              60% { transform: translate(-40px,-10px); opacity: 0.9; }
              100% { transform: translate(-90px,-30px); opacity: 0; }
            }
          `}</style>
        </g>
      )}

      {/* VOILE DE FONDU AU NOIR (déclenché à t>=7) */}
      <rect width="800" height="320" fill="#000" opacity={t >= 7 ? 1 : 0} style={{ transition: "opacity 1200ms ease-in" }} />
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
    <svg viewBox="0 0 800 320" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="a3-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f38" />
          <stop offset="100%" stopColor="#0e1218" />
        </linearGradient>
      </defs>

      {/* fond noir puis mur qui apparaît */}
      <rect width="800" height="320" fill="#000" />
      <rect width="800" height="320" fill="url(#a3-wall)" opacity={t >= 1 ? 1 : 0}
        style={{ transition: "opacity 1400ms ease-out" }} />

      {/* néon clignotant au plafond — froid */}
      <rect x="200" y="20" width="400" height="6" fill="#c8d4e2" opacity={t >= 1 ? 0.85 : 0}
        style={{ transition: "opacity 800ms" }}>
        <animate attributeName="opacity" values="0.9;0.5;0.95;0.6;0.9" dur="2.4s" begin="1.4s" repeatCount="indefinite" />
      </rect>
      {t >= 1 && (
        <ellipse cx="400" cy="60" rx="240" ry="34" fill="#c8d4e2" opacity="0.06" />
      )}

      {/* Lit métallique à gauche — apparaît en fondu */}
      <g transform="translate(60,180)" opacity={t >= 2 ? 1 : 0} style={{ transition: "opacity 900ms" }}>
        <rect x="0" y="30" width="280" height="60" fill="#5a6270" stroke="#0a0806" strokeWidth="2" />
        <rect x="4" y="10" width="272" height="22" fill="#5a3018" stroke="#0a0806" strokeWidth="1" />
        <rect x="10" y="4" width="60" height="18" rx="4" fill="#e8eef5" stroke="#3a4048" strokeWidth="0.8" />
        <rect x="0" y="90" width="8" height="14" fill="#3a4048" />
        <rect x="272" y="90" width="8" height="14" fill="#3a4048" />
        {/* JOUEUR assis sur le bord, tête baissée */}
        <g transform="translate(50,-16)">
          <circle cx="0" cy="0" r="9" fill="#e0a878" />
          <path d="M-12 8 L12 8 L15 34 L-15 34 Z" fill="#3a80c8" stroke="#141c26" strokeWidth="0.8" />
          {/* petite respiration */}
          <animateTransform attributeName="transform" type="translate"
            values="50 -16; 50 -15; 50 -16" dur="4s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Panneau mural MARTINE à droite — s'allume progressivement */}
      <g transform="translate(560,90)" opacity={t >= 3 ? 1 : 0} style={{ transition: "opacity 900ms" }}>
        <rect x="-70" y="-40" width="140" height="120" fill="#0a0806" stroke="#7fd8ff" strokeWidth="2" />
        <rect x="-64" y="-34" width="128" height="108" fill="#141c26" />
        <text x="0" y="-14" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7fd8ff" letterSpacing="2">BULLETIN N-27</text>
        <line x1="-58" y1="-6" x2="58" y2="-6" stroke="#7fd8ff" strokeWidth="0.4" opacity="0.6" />
        <text x="0" y="10" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="#c8d4e2" fontStyle="italic">« Bienvenue,</text>
        <text x="0" y="24" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="#c8d4e2" fontStyle="italic">HABITANT N-27. </text>
        <text x="0" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#c8d4e2" fontStyle="italic">La surface est</text>
        <text x="0" y="50" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#c8d4e2" fontStyle="italic">encore inhabitable. »</text>
        <text x="0" y="66" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e">— MARTINE —</text>
        <circle cx="60" cy="-30" r="3" fill="#5eff9e">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Carnet noir sur l'étagère avec halo doré — apparaît en dernier, attire l'œil */}
      <g transform="translate(420,238)" opacity={t >= 4 ? 1 : 0} style={{ transition: "opacity 900ms" }}>
        <rect x="0" y="0" width="100" height="4" fill="#3a2818" />
        <rect x="30" y="-30" width="36" height="30" fill="#0a0806" stroke="#c8a848" strokeWidth="1.4" />
        <path d="M30 -22 L66 -22" stroke="#3a2818" strokeWidth="0.4" />
        <circle cx="48" cy="-16" r="24" fill="none" stroke="#c8a848" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Plaque N-27 sur la porte */}
      <g transform="translate(740,160)" opacity={t >= 5 ? 1 : 0} style={{ transition: "opacity 700ms" }}>
        <rect x="-14" y="-20" width="28" height="10" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
        <text x="0" y="-12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#0a0806">N-27</text>
      </g>
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
