import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { PompeiDefs, PompeiFond } from "./fond.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 4 · Tableau 1 — Devant la villa de Caius
   À DROITE : l'entrée de la villa, vue en perspective (portique
   à colonnes qui recule, fronton, la belle dalle à graver). À
   GAUCHE : une rue de Pompéi bordée de bâtiments romains, la
   foule, et le Vésuve au fond. Caius accueille ; Argos attend.
   ============================================================ */

export default function SceneEntree({ collect, action, reveal, made = [], queteQui, mode }) {
  const grave = made.includes("msg_inscription");
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <PompeiDefs />
        <linearGradient id="e4-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8b48a" /><stop offset="100%" stopColor="#8a7452" /></linearGradient>
        <linearGradient id="e4-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#efe6d2" /><stop offset="55%" stopColor="#d8c8a8" /><stop offset="100%" stopColor="#b0a080" /></linearGradient>
        <linearGradient id="e4-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c69a5a" /><stop offset="100%" stopColor="#a8804a" /></linearGradient>
        <linearGradient id="e4-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a83a2c" /><stop offset="100%" stopColor="#7e2a20" /></linearGradient>
      </defs>

      <PompeiFond />

      {/* ═══ couche intermédiaire : la RUE romaine (gauche) + la VILLA (droite) ═══ */}
      <PLayer depth={2}>
        {/* — la rue de Pompéi : plusieurs bâtiments romains — */}
        {[[40, 190, 150, 220, "#c8462e"], [180, 210, 120, 200, "#a8462e"], [300, 175, 140, 235, "#b8502e"], [430, 205, 110, 205, "#a8462e"]].map(([x, y, w, h, roof], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="#e4dcc8" />
            <rect x={x} y={y} width={w} height={h} fill="#8a7a58" opacity="0.14" filter="url(#pf-grain)" />
            {/* soubassement peint (rouge pompéien) et bandeau d'étage */}
            <rect x={x} y={y + h - 54} width={w} height="10" fill="#9a3a2a" opacity="0.8" />
            <rect x={x} y={y + 58} width={w} height="5" fill="#c8b898" />
            {/* ombre portée par le bâtiment voisin, enduit écaillé */}
            <rect x={x + w - 18} y={y} width="18" height={h} fill="#5a4a30" opacity="0.18" />
            <path d={`M${x + 12} ${y + h - 70} q8 -4 16 2 q6 6 14 0`} stroke="#b8a888" strokeWidth="2" fill="none" opacity="0.6" />
            {/* toit de tuiles, avec rangées et débord */}
            <path d={`M${x - 8} ${y} L${x + w / 2} ${y - 22} L${x + w + 8} ${y} Z`} fill={roof} />
            {[0.3, 0.6].map((k) => <path key={k} d={`M${x - 8 + (w / 2 + 8) * k} ${y - 22 * k} L${x + w + 8 - (w / 2 + 8) * k} ${y - 22 * k}`} stroke="#7a2a18" strokeWidth="1" opacity="0.6" />)}
            <rect x={x - 8} y={y - 2} width={w + 16} height="4" fill="#7a2a18" opacity="0.7" />
            {/* étage : fenêtres */}
            {[...Array(Math.floor(w / 44))].map((_, k) => (
              <g key={k}>
                <rect x={x + 14 + k * 44} y={y + 24} width="20" height="26" fill="#5a4230" />
                <rect x={x + 14 + k * 44} y={y + 70} width="20" height="26" fill="#6a5238" />
              </g>
            ))}
            {/* auvent de boutique au rez-de-chaussée */}
            <rect x={x + 6} y={y + h - 44} width={w - 12} height="6" fill="#8a5a34" />
            <path d={`M${x + 6} ${y + h - 44} l-6 14 M${x + w - 6} ${y + h - 44} l6 14`} stroke="#8a5a34" strokeWidth="3" />
            <rect x={x + 20} y={y + h - 34} width="26" height="34" fill="#3a2818" />
          </g>
        ))}
        {/* un petit temple à colonnes dans la rue */}
        <g transform="translate(520,412)">
          <path d="M-40 -46 L0 -66 L40 -46 Z" fill="#c8462e" />
          <rect x="-38" y="-46" width="76" height="8" fill="#e4dcc8" />
          {[-32, -18, -4, 10, 24].map((x, i) => <rect key={i} x={x} y="-38" width="7" height="38" fill="#d8cdb4" />)}
        </g>

        {/* — LA VILLA DE CAIUS, en perspective (droite) — */}
        {/* le mur / la façade de la villa (bloc de droite) */}
        <path d="M872 150 L1000 138 L1000 452 L872 452 Z" fill="url(#e4-wall)" />
        <path d="M872 150 L1000 138 L1000 452 L872 452 Z" fill="#5a3f22" opacity="0.18" filter="url(#pf-grain)" />
        {/* le fronton (pediment) triangulaire de la villa */}
        <path d="M840 172 L928 116 L1000 138 L1000 172 Z" fill="#d8cdb4" />
        <path d="M840 172 L928 116 L1000 172 Z" fill="#c8462e" />
        <path d="M840 172 L1000 172" stroke="#b0a080" strokeWidth="4" />
        {/* l'entrée : une porte à double battant dans le mur, en retrait */}
        <rect x="908" y="238" width="74" height="214" fill="#2c1c12" />
        <path d="M945 238 v214 M908 238 h74" stroke="#160f08" strokeWidth="3" />
        {[268, 316, 364].map((y, i) => <path key={i} d={`M912 ${y} h30 M948 ${y} h30`} stroke="#160f08" strokeWidth="2" opacity="0.6" />)}
        <circle cx="939" cy="352" r="3" fill="#c8a860" /><circle cx="951" cy="352" r="3" fill="#c8a860" />

        {/* le PORTIQUE : 4 colonnes qui reculent (perspective) + architrave en pente */}
        <path d="M596 236 L872 168 L872 196 L596 262 Z" fill="#e0d4b8" />
        <path d="M596 262 L872 196 L872 208 L596 274 Z" fill="#c4b48c" />
        {[[620, 20], [700, 24], [782, 28], [858, 33]].map(([x, w], i) => {
          const yTop = 262 - (x - 620) / 238 * 62;   // le chapiteau
          const yBase = 452 - (x - 620) / 238 * 22;  // le pied, sur le podium
          return (
            <g key={i}>
              <rect x={x - w / 2} y={yTop} width={w} height={yBase - yTop} fill="url(#e4-col)" />
              {[...Array(4)].map((_, k) => <path key={k} d={`M${x - w / 2 + 4 + k * (w - 8) / 3} ${yTop + 6} v${yBase - yTop - 12}`} stroke="#a89870" strokeWidth="1" opacity="0.4" />)}
              <rect x={x - w / 2 - 4} y={yTop - 8} width={w + 8} height="10" fill="#e8dcc0" />
              <rect x={x - w / 2 - 3} y={yBase - 6} width={w + 6} height="8" fill="#c0b088" />
            </g>
          );
        })}
        {/* Un seul oiseau BLANC qui traverse le ciel du Vesuve
            de DROITE a GAUCHE — plus lisible qu'un vol de pigeons. */}
        <g opacity="0.95">
          <animateTransform attributeName="transform" type="translate"
            values="1080,140; -40,180; 1080,140" dur="26s" repeatCount="indefinite" />
          <path d="M0 0 q7 -9 14 0 q7 -9 14 0" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </PLayer>

      {/* ═══ premier plan : le parvis, le podium, la dalle, les gens ═══ */}
      <PLayer depth={3}>
        <rect y="410" width="1000" height="150" fill="url(#e4-floor)" />
        <rect y="412" width="1000" height="148" fill="#3c2c18" opacity="0.26" filter="url(#pf-mottle)" />
        {/* la rue pavée de gros blocs polygonaux de basalte, trottoirs surélevés, pierres de passage */}
        <path d="M-40 420 L560 420 L560 428 L-40 428 Z" fill="#c8b894" />
        <path d="M-40 428 L560 428 Q600 470 560 520 Q540 545 548 560 L-40 560 Z" fill="#5a5450" opacity="0.42" />
        {Array.from({ length: 34 }).map((_, i) => {
          const r = Math.floor(i / 7), c = i % 7, y = 440 + r * 26, x = -30 + c * 80 + (r % 2) * 40;
          return <path key={i} d={`M${x} ${y} l34 -6 l30 8 l4 18 l-34 6 l-30 -8 Z`} fill="none" stroke="#2a2420" strokeWidth="1.4" opacity="0.5" />;
        })}
        {[150, 200, 250].map((x) => <rect key={x} x={x - 16} y="470" width="32" height="20" rx="6" fill="#a89c88" stroke="#4a4038" strokeWidth="1" />)}
        <path d="M60 560 Q100 500 140 430 M110 560 Q150 500 190 430" stroke="#2a2420" strokeWidth="3" fill="none" opacity="0.3" />
        <g opacity="0.3" stroke="#6e5836" strokeWidth="1"><path d="M0 456 h1000 M0 504 h1000" />{[...Array(18)].map((_, i) => <path key={i} d={`M${i * 58} 418 v142`} />)}</g>
        <ellipse cx="480" cy="484" rx="470" ry="52" fill="#7a6240" opacity="0.26" />

        {/* les MARCHES du podium de la villa (droite) */}
        <path d="M700 452 L1000 452 L1000 470 L680 470 Z" fill="#d8cdb4" />
        <path d="M680 470 L1000 470 L1000 490 L660 490 Z" fill="#c4b48c" />
        <path d="M660 490 L1000 490 L1000 512 L638 512 Z" fill="#b0a080" />

        {/* LA DALLE À GRAVER, au pied de l'entrée (support) */}
        <g transform="translate(786,486)">
          <ellipse cx="0" cy="34" rx="58" ry="11" fill="#241608" opacity="0.35" />
          <rect x="-52" y="-24" width="104" height="58" rx="4" fill="#e4dcc8" />
          <rect x="-52" y="-24" width="104" height="58" rx="4" fill="#8a7a58" opacity="0.2" filter="url(#pf-grain)" />
          <rect x="-52" y="-24" width="104" height="8" fill="#efe6d2" />
          {grave ? (
            <g style={{ animation: "fadein 1s ease-out" }} fill="#4a3826">
              <text x="0" y="-7" textAnchor="middle" fontSize="9" fontFamily="'Cinzel','Trajan Pro',Georgia,serif" letterSpacing="0.3">CAIVS · POMPEIS</text>
              <text x="0" y="6" textAnchor="middle" fontSize="8" fontFamily="'Cinzel','Trajan Pro',Georgia,serif" letterSpacing="0.3">GLORIA · ROMAE</text>
              <path d="M-42 16 h84" stroke="#6a5236" strokeWidth="1" opacity="0.6" />
            </g>
          ) : (
            <g stroke="#b0a888" strokeWidth="1.2" opacity="0.5"><path d="M-40 -8 h80 M-40 2 h80 M-40 12 h60" /></g>
          )}
        </g>

        {/* LA FOULE sur la rue (support) */}
        <g transform="translate(300,494)">
          {[[-40, 0, "#8a5a3a"], [-18, 6, "#9a6a4a"], [4, -2, "#7a4a34"], [26, 8, "#a86a4a"], [46, 2, "#8a5a3a"], [12, 14, "#6a4a34"], [-30, 12, "#9a6a4a"]].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <Figure x={0} y={24} s={0.54} facing="right" skin={["#c89868", "#b07a50", "#d8a878", "#a06a44"][i % 4]} coat={c}
                look={["short", "bun", "curls", "long", "short", "mid", "braids"][i]} hair={["#3a2418", "#1e140c", "#4a3020", "#2a1a10"][i % 4]}
                beard={i === 2 ? "short" : false} garment={i % 3 === 1 ? "dress" : "tunic"} pants="#6a4a34" shoes="#3a2418" mood={i % 2 ? "surpris" : null} />
            </g>
          ))}
        </g>

        {/* CAIUS le marchand, en toge, devant sa villa */}
        <g transform="translate(640,484)">
          <ellipse cx="0" cy="28" rx="24" ry="7" fill="#241608" opacity="0.4" />
          <Figure x={0} y={28} s={0.825} skin="#cfa070" hair="#3a2818" look="short" mood="content" hat="laurel"
            garment="toga" coat="#efe7d2" coat2="#8a2a4a" pants="#cfa070" shoes="#5a3a20"
            arms={[{ a1: 10, a2: 4 }, { a1: 60, a2: 40 }]} />
        </g>
        {queteQui === "caius" && (
          <g transform="translate(622,352)" style={{ animation: "glow 2.4s ease-in-out infinite" }}>
            <path d="M0 0 q0 -20 20 -20 q20 0 20 17 q0 14 -17 18 l0 6" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="20" cy="31" r="2.6" fill="#ffd166" />
          </g>
        )}

        {/* ARGOS l'esclave, près de la foule */}
        <g transform="translate(430,492)">
          <ellipse cx="0" cy="24" rx="20" ry="6" fill="#241608" opacity="0.4" />
          {/* tourné vers la foule, une main en porte-voix */}
          <Figure x={0} y={24} s={0.698} facing="left" skin="#b0855c" hair="#3a2a1c" look="short" mood="surpris"
            garment="tunic" coat="#b89a6a" pants="#b0855c" shoes="#4a3424"
            arms={[{ a1: 100, a2: -110 }, { a1: 10, a2: 6 }]} />
        </g>
        {/* les ONDES de la voix d'Argos vers la foule (façon wifi) : elles
            n'apparaissent qu'au moment où l'annonce est lancée, puis s'estompent */}
        {made.includes("invites") && (
          <g transform="translate(374,470) rotate(-100)" style={{ animation: "ondes 2.4s ease-out forwards" }}>
            <circle cx="0" cy="0" r="2.2" fill="#ffd166" />
            <path d="M-7 -7 a10 10 0 0 1 14 0" fill="none" stroke="#ffd166" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
            <path d="M-13 -13 a18 18 0 0 1 26 0" fill="none" stroke="#ffd166" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
            <path d="M-19 -19 a27 27 0 0 1 38 0" fill="none" stroke="#ffd166" strokeWidth="2.4" strokeLinecap="round" opacity="0.32" />
          </g>
        )}

        {/* épave de MARTINE dans un coin */}
        <g transform="translate(70,506) rotate(-8)">
          <ellipse cx="0" cy="12" rx="26" ry="6" fill="#140b06" opacity="0.5" />
          <path d="M0 -20 Q18 -18 20 -4 Q22 8 11 11 L-11 11 Q-22 8 -20 -4 Q-18 -18 0 -20 Z" fill="#8a6240" />
          <circle cx="-1" cy="-4" r="5.5" fill="#cfeaff" stroke="#5c3a22" strokeWidth="1.4" />
          <rect x="-13" y="3" width="24" height="7" rx="2" fill="#0c1410" stroke="#5c3a22" strokeWidth="1" />
          <text x="-1" y="9" textAnchor="middle" fontSize="5.5" fill="#5eff9e" fontFamily="ui-monospace,monospace" style={{ animation: "pulse 2.2s infinite" }}>an 79</text>
          <circle cx="13" cy="-27" r="2.3" fill="#5eff9e" style={{ animation: "pulse 1.5s infinite" }} />
          <path d="M8 -20 q6 -8 13 -6" stroke="#8a94a8" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        </g>

        {/* ANACHRONISME : Ray-Ban Aviator sur une dalle de la place */}
        {!made.includes("lunettes_soleil") && mode !== "jeu2" && (
          <g transform="translate(180,510) rotate(-6)">
            <ellipse cx={-14} cy={0} rx={13} ry={9} fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1.5" />
            <ellipse cx={14} cy={0} rx={13} ry={9} fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1.5" />
            <path d="M-3 -2 h6" stroke="#c8c8c8" strokeWidth="2.5" />
            <path d="M-27 -3 l-10 -5 M27 -3 l10 -5" stroke="#c8c8c8" strokeWidth="2.2" />
            <path d="M-18 -5 q4 -2 8 -1 M10 -5 q4 -1 8 1" stroke="#7fb0e0" strokeWidth="1.5" opacity="0.7" />
          </g>
        )}
      </PLayer>

      <rect width="1000" height="560" fill="#231a10" opacity="0.06" style={{ pointerEvents: "none" }} />

      {/* zones cliquables */}
      <Hotspot cx={640} cy={428} r={48} label="Caius, le marchand" reveal={reveal} onClick={(p) => action("caius", p)} />
      <Hotspot cx={430} cy={445} r={43} label="Argos — prends ta voix" item="voix" reveal={reveal} onClick={() => collect("voix")} />
      <Hotspot cx={300} cy={465} r={77} label="la foule" item="foule" reveal={reveal} onClick={() => collect("foule")} />
      <Hotspot cx={786} cy={484} r={54} label="la dalle à graver" item="pierre" reveal={reveal} onClick={() => collect("pierre")} />
      <Hotspot cx={70} cy={502} r={32} label="MARTINE" reveal={reveal} onClick={() => action("wreck")} />

      {mode !== "jeu2" && (
        <Hotspot cx={180} cy={510} r={26} label="… quelque chose ne va pas ici" item="lunettes_soleil" reveal={reveal} onClick={() => collect("lunettes_soleil")} />
      )}
    </svg>
  );
}
