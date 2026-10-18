import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 9 — Tableau-ÉNIGME : « Où sont VRAIMENT tes souvenirs ? »
   ------------------------------------------------------------
   Le datacenter : deux allées de serveurs qui fuient vers le fond,
   des LED partout, le froid de la clim. La technicienne (cliquable)
   est minuscule dans l'immensité — c'est le but : montrer l'échelle.
   → serveurs + abonnement → le flux s'allume : le streaming part
     vers le monde entier.
   → photos d'enfance + service fermé → une baie s'ÉTEINT. (perdu)
   Ce décor réagit à l'état du jeu via la prop `made`.
   ============================================================ */

export default function SceneDatacenter({ collect, action, reveal, made = [], mode = "jeu1" }) {
  const stream = made.includes("msg_streaming"); // le flux tourne
  const compte = made.includes("msg_compte");    // le service a fermé

  /* Les baies, en perspective : plus on va vers le centre, plus c'est petit.
     ⚠️ tout doit rester dans x ≈ [120, 860] : au-delà, le décor est rogné
     selon la taille de la fenêtre. `morte` = la baie qui s'éteint quand le
     service ferme — elle DOIT être bien visible. */
  const BAIES = [
    { x: 140, s: 1 }, { x: 244, s: 0.86 }, { x: 330, s: 0.74 }, { x: 398, s: 0.64 },
    { x: 856, s: 1 }, { x: 752, s: 0.86, morte: true }, { x: 666, s: 0.74 }, { x: 598, s: 0.64 },
  ];

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#161c28" />
          <stop offset="55%"  stopColor="#0f141e" />
          <stop offset="100%" stopColor="#080c14" />
        </linearGradient>
        <linearGradient id="dc-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a3040" />
          <stop offset="55%"  stopColor="#1a2030" />
          <stop offset="100%" stopColor="#0a1018" />
        </linearGradient>
        <linearGradient id="dc-baie" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#39404e" />
          <stop offset="50%"  stopColor="#272d38" />
          <stop offset="100%" stopColor="#1a1f28" />
        </linearGradient>
        <radialGradient id="dc-far" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7fd8ff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#5eff9e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
        <filter id="dc-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
        {/* brume atmosphérique près du fond de l'allée */}
        <filter id="dc-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        {/* grosses taches de moquette technique */}
        <filter id="dc-mottle" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* ═══ le hangar ═══ */}
      <rect width="1000" height="560" fill="url(#dc-bg)" />
      {/* grain général du hangar (ambiance salle blanche) */}
      <rect width="1000" height="560" fill="#0a1018" opacity="0.35" filter="url(#dc-grain)" />
      {/* brume froide de la clim qui traîne à mi-hauteur */}
      <ellipse cx="500" cy="260" rx="360" ry="24" fill="#7fd8ff" opacity="0.06" filter="url(#dc-blur)" />
      <ellipse cx="500" cy="360" rx="380" ry="14" fill="#7fd8ff" opacity="0.05" filter="url(#dc-blur)" />
      {/* la lueur froide du fond de l'allée */}
      <ellipse cx="500" cy="290" rx="200" ry="150" fill="url(#dc-far)" style={{ animation: "glow 5s ease-in-out infinite" }} />

      {/* ═══ couche lointaine : le fond de l'allée + la clim ═══ */}
      <PLayer depth={1}>
        {/* le couloir qui fuit à l'infini */}
        <rect x="420" y="200" width="160" height="200" fill="#0e131c" />
        <path d="M420 200 h160 M420 400 h160" stroke="#2a3244" strokeWidth="2" />
        {/* des baies minuscules, tout au fond */}
        {[[440, 0.3], [470, 0.24], [512, 0.24], [544, 0.3]].map(([x, s], i) => (
          <g key={i} transform={`translate(${x},300) scale(${s})`}>
            <rect x="-30" y="-150" width="60" height="300" fill="#1c2230" />
            {[...Array(8)].map((_, r) => (
              <circle key={r} cx="0" cy={-120 + r * 34} r="7" fill="#5eff9e" opacity="0.5" style={{ animation: `pulse ${1 + (r % 4) * 0.5}s infinite` }} />
            ))}
          </g>
        ))}
        {/* gaines de climatisation au plafond */}
        <rect y="40" width="1000" height="26" fill="#232a38" />
        {[120, 340, 560, 780].map((x, i) => (
          <g key={i} transform={`translate(${x},66)`}>
            <path d="M-18 0 L-14 24 L14 24 L18 0 Z" fill="#2c3444" />
            <path d="M-12 24 h24" stroke="#3a4456" strokeWidth="3" />
          </g>
        ))}
      </PLayer>

      {/* ═══ couche intermédiaire : LES BAIES + le flux ═══ */}
      <PLayer depth={2}>
        {BAIES.map((b, i) => {
          /* la baie marquée `morte` s'éteint quand le service ferme */
          const morte = compte && b.morte;
          return (
            <g key={i} transform={`translate(${b.x},300) scale(${b.s})`}>
              <rect x="-46" y="-160" width="92" height="320" rx="4" fill="url(#dc-baie)" />
              <rect x="-46" y="-160" width="92" height="320" rx="4" fill="#080b12" opacity="0.3" filter="url(#dc-grain)" />
              <rect x="-38" y="-152" width="76" height="304" rx="3" fill="#12161e" />
              {/* les lames de serveurs, avec leurs LED */}
              {[...Array(11)].map((_, r) => (
                <g key={r} transform={`translate(0,${-140 + r * 28})`}>
                  <rect x="-34" y="-10" width="68" height="20" rx="2" fill="#1e2530" />
                  <path d="M-30 6 h60" stroke="#2a3240" strokeWidth="2" />
                  {[-26, -18, -10].map((dx, k) => (
                    <g key={k} style={morte ? undefined : { animation: `pulse ${0.7 + ((r + k) % 5) * 0.4}s infinite` }}>
                      <circle cx={dx} cy="-3" r="2.6" fill={morte ? "#2a3040" : (k === 0 ? "#5eff9e" : k === 1 ? "#7fd8ff" : "#ffd166")} />
                    </g>
                  ))}
                  <rect x="6" y="-5" width="24" height="4" rx="1" fill={morte ? "#232a36" : "#2f3a48"} />
                </g>
              ))}
              {/* l'écriteau « service fermé » sur la 1re baie de droite */}
              {morte && (
                <g transform="translate(0,-70)">
                  <rect x="-40" y="-22" width="80" height="44" rx="3" fill="#3a1418" stroke="#7a2418" strokeWidth="3" />
                  <text x="0" y="-4" textAnchor="middle" fontSize="11" fill="#ff8a7a" fontFamily="ui-monospace,monospace">COMPTE</text>
                  <text x="0" y="12" textAnchor="middle" fontSize="11" fill="#ff8a7a" fontFamily="ui-monospace,monospace">SUPPRIMÉ</text>
                </g>
              )}
            </g>
          );
        })}

        {/* APPARAÎT : le FLUX du streaming, qui monte des baies et part au loin */}
        {stream && (
          <g style={{ animation: "pulse 0.9s ease-out 2" }}>
            <ellipse cx="500" cy="300" rx="300" ry="150" fill="url(#dc-glow)" />
            <path d="M360 300 Q440 250 500 292 Q560 250 640 300" stroke="#5eff9e" strokeWidth="2.5" fill="none" opacity="0.85" />
            {[0, 1, 2].map((i) => (
              <circle key={i} r="4.5" fill={i === 1 ? "#7fd8ff" : "#5eff9e"}>
                <animateMotion dur={`${1.8 + i * 0.7}s`} repeatCount="indefinite" path="M360 300 Q440 250 500 292 Q560 250 640 300" />
              </circle>
            ))}
            {/* ce qui sort du hangar : de la musique, des images, des films */}
            {["🎵", "🖼️", "🎞️"].map((e, i) => (
              <g key={i} transform={`translate(${430 + i * 70},240)`}>
                <g style={{ animation: `drift ${2.2 + i * 0.5}s ease-in-out infinite` }}>
                  <text x="0" y="0" fontSize="17" textAnchor="middle">{e}</text>
                </g>
              </g>
            ))}
          </g>
        )}
      </PLayer>

      {/* ═══ premier plan : l'allée, la technicienne, les pièces ═══ */}
      <PLayer depth={3}>
        <path d="M0 560 L0 460 L1000 460 L1000 560 Z" fill="url(#dc-floor)" />
        {/* texture de dalles techniques */}
        <path d="M0 560 L0 460 L1000 460 L1000 560 Z" fill="#0a1018" opacity="0.3" filter="url(#dc-mottle)" />
        {/* le sol technique, en perspective vers le fond */}
        <path d="M420 400 L120 560 M580 400 L880 560 M420 400 L580 400" stroke="#2a3244" strokeWidth="2" opacity="0.7" fill="none" />
        {[440, 480, 530].map((y, i) => <path key={i} d={`M${330 - i * 90} ${y} H${670 + i * 90}`} stroke="#2a3244" strokeWidth="1.6" opacity="0.5" />)}
        {/* petits reflets de LED sur le sol (vert/bleu) devant chaque baie */}
        <ellipse cx="140" cy="466" rx="46" ry="4" fill="#5eff9e" opacity="0.12" filter="url(#dc-blur)" />
        <ellipse cx="856" cy="466" rx="46" ry="4" fill="#7fd8ff" opacity="0.12" filter="url(#dc-blur)" />
        <ellipse cx="244" cy="470" rx="34" ry="3" fill="#5eff9e" opacity="0.10" filter="url(#dc-blur)" />
        <ellipse cx="752" cy="470" rx="34" ry="3" fill={compte ? "#8a1010" : "#7fd8ff"} opacity="0.10" filter="url(#dc-blur)" />
        {/* fils/câbles qui courent au plafond au-dessus des baies */}
        <path d="M60 96 L940 96" stroke="#3a4456" strokeWidth="1.2" opacity="0.7" />
        <path d="M60 108 L940 108" stroke="#5a3a20" strokeWidth="1" opacity="0.55" />
        <path d="M60 116 L940 116" stroke="#3a3a5a" strokeWidth="1" opacity="0.55" />
        {/* petites lampes de secours rouges au plafond */}
        {[180, 500, 820].map((x, i) => (
          <g key={i}>
            <rect x={x - 4} y="94" width="8" height="4" fill="#3a1a1a" />
            <circle cx={x} cy="94" r="1.6" fill="#ff5030">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* « ? » tant que le flux n'est pas trouvé — cache en jeu 2 */}
        {!stream && mode !== "jeu2" && (
          <g transform="translate(432,344)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -24 24 -24 q24 0 24 20 q0 17 -20 22 l0 8" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="24" cy="37" r="3" fill="#ffd166" />
          </g>
        )}

        {/* LA TECHNICIENNE, minuscule au milieu de l'allée (l'échelle !) */}
        <g transform="translate(500,432)">
          {/* les deux bras écartés : « regarde autour de toi » */}
          <Figure x={0} y={34} s={0.56} skin="#d8a884" hair="#3a2c24" look="ponytail" mood="content"
            garment="jacket" coat="#2a6a5a" pants="#1a3a34" shoes="#141418" arms={[{ a1: 110, a2: 130 }, { a1: 110, a2: 130 }]}>
            <rect x="-12" y="-80" width="12" height="9" rx="1.4" fill="#c9e8ff" />
          </Figure>
        </g>

        {/* PIÈCE : le terminal d'ABONNEMENT, au mur à gauche */}
        {!stream && (
          <g transform="translate(190,470)">
            <rect x="-34" y="-30" width="68" height="52" rx="4" fill="#2a3244" />
            <rect x="-28" y="-24" width="56" height="24" rx="2" fill="#0e1622" />
            <text x="0" y="-8" textAnchor="middle" fontSize="8" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2s infinite" }}>9,99 €/mois</text>
            {/* la carte bancaire glissée dedans */}
            <rect x="-18" y="4" width="36" height="14" rx="2" fill="#c9a24a" />
            <rect x="-14" y="8" width="9" height="6" rx="1" fill="#8a6a2a" />
            <path d="M0 10 h14 M0 14 h10" stroke="#8a6a2a" strokeWidth="1.2" />
          </g>
        )}

        {/* PIÈCE : l'écriteau « SERVICE FERMÉ », posé dans l'allée */}
        {!compte && (
          <g transform="translate(810,472)">
            {/* un chevalet */}
            <path d="M-20 40 L-8 4 M20 40 L8 4" stroke="#3a4456" strokeWidth="5" strokeLinecap="round" />
            <rect x="-42" y="-34" width="84" height="44" rx="3" fill="#e8e4da" stroke="#7a2418" strokeWidth="3" />
            <text x="0" y="-18" textAnchor="middle" fontSize="9.5" fill="#7a2418" fontFamily="ui-monospace,monospace" fontWeight="bold">SERVICE</text>
            <text x="0" y="-6" textAnchor="middle" fontSize="9.5" fill="#7a2418" fontFamily="ui-monospace,monospace" fontWeight="bold">FERMÉ</text>
            <text x="0" y="6" textAnchor="middle" fontSize="5.5" fill="#8a6a5a" fontFamily="ui-monospace,monospace">le 31 décembre</text>
          </g>
        )}
      </PLayer>

      {/* le froid du hangar */}
      <rect width="1000" height="560" fill="#0a1420" opacity="0.1" style={{ pointerEvents: "none" }} />

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={500} cy={412} r={44} label="la technicienne" reveal={reveal} onClick={() => action("technicien")} />
      {!stream && (
        <>
          <Hotspot cx={190} cy={454} r={44} label="abonnement" item="abonnement" reveal={reveal} onClick={() => collect("abonnement")} />
          <Hotspot cx={300} cy={280} r={70} label="serveurs" item="serveurs" reveal={reveal} onClick={() => collect("serveurs")} />
        </>
      )}
      {!compte && (
        <Hotspot cx={810} cy={452} r={44} label="service fermé" item="service_ferme" reveal={reveal} onClick={() => collect("service_ferme")} />
      )}
    </svg>
  );
}
