/* ============================================================
   JEU 3 — ÉPILOGUE
   ------------------------------------------------------------
   Quatre actes animés, enchaînés par bouton :
     1. LE RAPPORT   — tu remets au Juge Vez les 3 dossiers.
     2. L'OUVERTURE  — la grande porte scellée craque et s'ouvre.
     3. L'AIR LIBRE  — surface, soleil, horizon.
     4. L'HÉRITAGE   — carte-postale finale : la fiche de la pièce
                       que tu as laissée à Jorge, sortie de sa
                       cellule, qui classe à ton tour.
   Dernière action : "Retour au menu" → onExit().
   ============================================================ */
import { useState, useEffect } from "react";
import { Bust, Figure } from "../../../engine/chars.jsx";
import { Caution, ConcretePanels, PerspFloor, Vignette } from "../bunkerKit.jsx";
import { Clouds, Grass, Haze, Hill, Ridge, Speckle, TreeLine } from "../../../engine/scenery.jsx";

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

export default function EpilogueJeu3({ onDone, prenom = "Chronaute" }) {
  const [acte, setActe] = useState(0);
  const actes = [
    { Comp: Acte1Rapport,   title: "I. LE RAPPORT",  cta: "Continuer ▸" },
    { Comp: Acte2Ouverture, title: "II. L'OUVERTURE", cta: "Continuer ▸" },
    { Comp: Acte3AirLibre,  title: "III. L'AIR LIBRE", cta: "Continuer ▸" },
    { Comp: Acte4Heritage,  title: "IV. L'HÉRITAGE", cta: "Terminer ▸" },
  ];
  const A = actes[acte];
  const Comp = A.Comp;
  const atLast = acte === actes.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050810", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 4, color: "#c8a848", marginBottom: 10 }}>
        🌑 LE PUITS · ÉPILOGUE · {A.title}
      </div>
      <div style={{ width: "100%", maxWidth: 1000 }}>
        <Comp prenom={prenom} />
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050" }}>
          {acte + 1} / {actes.length}
        </div>
        <button onClick={() => (atLast ? onDone?.() : setActe(acte + 1))}
          style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2 }}>
          {A.cta}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ACTE I · LE RAPPORT — bureau de Vez, remise des dossiers
   ============================================================ */
function Acte1Rapport({ prenom }) {
  const t = useSequence([400, 1200, 2200, 3200]);
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep1-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1408" />
          <stop offset="100%" stopColor="#050408" />
        </linearGradient>
        <linearGradient id="ep1-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3818" />
          <stop offset="100%" stopColor="#2a1808" />
        </linearGradient>
      </defs>
      <rect width="1000" height="460" fill="url(#ep1-wall)" />
      <ConcretePanels x0={0} x1={1000} y0={0} y1={310} w={125} seed={61} stain="#2a1a08" joint="#050403" bolt="#3a2a18" opacity={0.8} />
      {/* le bureau de Vez : rayonnages de registres, classeur, horloge */}
      {[90, 860].map((x, k) => (
        <g key={`ry${k}`} transform={`translate(${x},70)`} opacity="0.85">
          <rect x="-60" y="0" width="120" height="220" fill="#1a1208" stroke="#0a0604" strokeWidth="2" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x="-56" y={50 + r * 52} width="112" height="4" fill="#3a2810" />
              {Array.from({ length: 9 }).map((_, j) => <rect key={j} x={-54 + j * 12} y={50 + r * 52 - (34 + ((j + r + k) % 3) * 4)} width="10" height={34 + ((j + r + k) % 3) * 4} fill={["#5a2a18", "#3a3a28", "#6a4a20", "#2a3040"][(j + r) % 4]} />)}
            </g>
          ))}
        </g>
      ))}
      <g transform="translate(500,40)">
        <circle r="18" fill="#e8dfc8" stroke="#5a3818" strokeWidth="3" />
        <path d="M0 0 v-11 M0 0 l8 3" stroke="#1a0e08" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {/* cône de la lampe, de l'abat-jour jusqu'au bureau */}
      <path d="M370 210 L390 210 L520 312 L240 312 Z" fill="#ffd870" opacity="0.07" />
      {/* Lampe de bureau avec cône de lumière chaude */}
      <ellipse cx="500" cy="300" rx="280" ry="140" fill="#c8a848" opacity="0.1" />
      <ellipse cx="500" cy="300" rx="180" ry="100" fill="#ffd870" opacity="0.08" />
      <g transform="translate(380,120)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="#5a4028" strokeWidth="2" />
        <path d="M-20 60 L20 60 L10 90 L-10 90 Z" fill="#8a5030" stroke="#1a0e08" strokeWidth="1" />
        <ellipse cx="0" cy="92" rx="12" ry="3" fill="#ffd870" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* le Juge Vez, à droite, dans son fauteuil à haut dossier */}
      <path d="M704 312 L704 176 Q760 150 816 176 L816 312 Z" fill="#2a1808" stroke="#0a0604" strokeWidth="2" />
      <Bust x={760} y={242} s={1.32} skin="#c8a888" hair="#c8b090" look="slick" beard="goatee" beardColor="#a89070" cloth="#3a2818" collar="high" mood="neutre" />
      {/* toi, à gauche, face à lui */}
      <Bust x={220} y={246} s={1.26} skin="#c8a888" hair="#5a3818" look="short" cloth="#28303a" collar="round" mood="neutre" />
      {/* Bureau en bois massif */}
      <rect x="100" y="310" width="800" height="20" fill="url(#ep1-wood)" stroke="#1a0e08" strokeWidth="2" />
      <rect x="140" y="330" width="40" height="90" fill="#2a1808" stroke="#1a0e08" strokeWidth="1" />
      <rect x="820" y="330" width="40" height="90" fill="#2a1808" stroke="#1a0e08" strokeWidth="1" />
      {/* Trois dossiers posés sur le bureau */}
      {["gutenberg", "chappe", "marconi"].map((id, i) => {
        const x = 380 + i * 100;
        const appear = t > i;
        return (
          <g key={id} transform={`translate(${x},300)`} opacity={appear ? 1 : 0}
            style={{ transition: "opacity 0.4s" }}>
            <rect x="-30" y="-6" width="60" height="12" fill="#8a5030" stroke="#1a0e08" strokeWidth="0.8" />
            <rect x="-28" y="-18" width="56" height="14" fill="#c8a848" stroke="#5a3818" strokeWidth="0.6" />
            <text x="0" y="-8" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="800" fill="#1a0e08">
              {id.toUpperCase()}
            </text>
            {/* Petit tampon rouge VÉRIFIÉ */}
            <g transform="rotate(-14)">
              <rect x="-18" y="-14" width="36" height="10" fill="none" stroke="#c81010" strokeWidth="1.2" />
              <text x="0" y="-6" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fontWeight="900" fill="#c81010">VÉRIFIÉ</text>
            </g>
          </g>
        );
      })}
      {/* Bulle de dialogue qui apparaît tardivement */}
      {t > 3 && (
        <g transform="translate(500,80)">
          <rect x="-280" y="0" width="560" height="40" rx="10" fill="#141008" stroke="#c8a848" strokeWidth="1.2" />
          <text x="0" y="18" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#e8dfc8">
            Vez te regarde longuement : « Tu as fait ton travail, {prenom}.
          </text>
          <text x="0" y="34" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12" fill="#e8dfc8">
            Il reste à faire le mien — rouvrir le Puits à ce qu'il a oublié. »
          </text>
        </g>
      )}
      <Vignette id="ep1-vig" w={1000} h={460} strength={0.55} />
    </svg>
  );
}

/* ============================================================
   ACTE II · L'OUVERTURE — la grande porte scellée se descelle
   ============================================================ */
function Acte2Ouverture() {
  const t = useSequence([600, 1600, 2800, 4000]);
  const opened = t >= 3;
  const sparks = t >= 2;
  const C = { x: 500, y: 228, r: 150 };
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep2-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <radialGradient id="ep2-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe8a8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ep2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6aa0e8" /><stop offset="70%" stopColor="#c8dcf0" /><stop offset="100%" stopColor="#ffe8b0" />
        </linearGradient>
        <radialGradient id="ep2-ring" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#c8d0d8" /><stop offset="100%" stopColor="#3a4048" />
        </radialGradient>
        <radialGradient id="ep2-disc" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#8a929c" /><stop offset="100%" stopColor="#2a3038" />
        </radialGradient>
        <clipPath id="ep2-hole"><circle cx={C.x} cy={C.y} r={C.r - 4} /></clipPath>
        <filter id="ep2-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <rect width="1000" height="460" fill="url(#ep2-wall)" />
      <ConcretePanels x0={0} x1={1000} y0={0} y1={404} w={125} seed={71} stain="#2a1a10" joint="#04060a" bolt="#2a3240" opacity={0.85} />
      {/* sol du sas */}
      <rect y="404" width="1000" height="56" fill="#0a0c10" />
      <PerspFloor y0={404} y1={460} step={90} rows={2} opacity={0.5} />
      {/* bandes de sécurité de part et d'autre */}
      <Caution x={300} y={50} w={12} h={354} id="ep2-c1" />
      <Caution x={688} y={50} w={12} h={354} id="ep2-c2" />

      {/* cadre d'acier encastré + plaque */}
      <rect x="318" y="46" width="364" height="364" fill="#1c222a" stroke="#05080c" strokeWidth="4" />
      {[[334, 62], [666, 62], [334, 394], [666, 394]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="8" fill="#141a22" stroke="#5a6270" strokeWidth="1.5" /><circle cx={x} cy={y} r="3" fill="#5a6270" /></g>
      ))}
      <rect x="456" y="22" width="88" height="22" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1.5" />
      <text x="500" y="38" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="13" fontWeight="900" fill="#0a0806" letterSpacing="4">C-3</text>

      {/* l'ouverture : noir avant, la surface après */}
      <circle cx={C.x} cy={C.y} r={C.r} fill="#05080c" stroke="#0a0e14" strokeWidth="6" />
      {opened && (
        <g clipPath="url(#ep2-hole)" style={{ animation: "fadein 1.2s ease-out" }}>
          <rect x="340" y="70" width="320" height="320" fill="url(#ep2-sky)" />
          <circle cx="560" cy="200" r="70" fill="#fff4c8" opacity="0.5" filter="url(#ep2-blur)" />
          <circle cx="560" cy="200" r="26" fill="#fff8e0" />
          <path d="M340 290 L400 262 L450 280 L510 250 L570 274 L620 258 L660 270 L660 400 L340 400 Z" fill="#8aa0c0" opacity="0.8" />
          <path d="M340 314 Q420 290 500 304 Q580 318 660 296 L660 400 L340 400 Z" fill="#6a9a4a" />
          <path d="M340 344 Q440 326 520 338 Q600 350 660 334 L660 400 L340 400 Z" fill="#4a7a34" />
          {[380, 430, 470, 600, 630].map((x, i) => <g key={i}><rect x={x - 1.5} y={300 + (i % 2) * 6} width="3" height="12" fill="#3a2a1a" /><circle cx={x} cy={298 + (i % 2) * 6} r="8" fill="#3a6a2a" /></g>)}
          <path d="M392 150 q6 -6 12 0 q6 -6 12 0 M430 130 q5 -5 10 0 q5 -5 10 0" stroke="#2a3040" strokeWidth="1.6" fill="none" />
        </g>
      )}

      {/* LA PORTE RONDE : elle roule sur le côté quand les soudures cèdent */}
      <g style={{ transition: "transform 2s cubic-bezier(0.4,0,0.2,1)", transformBox: "view-box", transformOrigin: `${C.x}px ${C.y}px`,
        transform: opened ? "translateX(322px) rotate(150deg)" : "translateX(0) rotate(0deg)" }}>
        <circle cx={C.x} cy={C.y} r={C.r} fill="url(#ep2-ring)" stroke="#0a0e14" strokeWidth="3" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 22.5 * Math.PI) / 180, x = C.x + Math.cos(a) * (C.r - 10), y = C.y + Math.sin(a) * (C.r - 10);
          return <rect key={i} x={x - 6} y={y - 6} width="12" height="12" fill="#2a3038" stroke="#0a0e14" strokeWidth="1" transform={`rotate(${i * 22.5} ${x} ${y})`} />;
        })}
        <circle cx={C.x} cy={C.y} r={C.r - 26} fill="url(#ep2-disc)" stroke="#141a22" strokeWidth="2" />
        {[100, 76, 52].map((r) => <circle key={r} cx={C.x} cy={C.y} r={r} fill="none" stroke="#1a2028" strokeWidth="2" opacity="0.7" />)}
        {[0, 120, 240].map((a) => <rect key={a} x={C.x - 6} y={C.y - 96} width="12" height="96" rx="4" fill="#5a6270" stroke="#1a2028" strokeWidth="1.5" transform={`rotate(${a} ${C.x} ${C.y})`} />)}
        <circle cx={C.x} cy={C.y} r="22" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
        <circle cx={C.x} cy={C.y} r="8" fill="#8a929c" />
        <text x={C.x} y={C.y + 62} textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#1a2028" letterSpacing="3">C-3</text>
      </g>

      {/* les barres soudées en croix : elles rougissent, crachent des étincelles, puis tombent */}
      <g style={{ transition: "transform 0.9s ease-in, opacity 0.9s", transform: opened ? "translateY(80px)" : "translateY(0)", opacity: opened ? 0 : 1 }}>
        {[[-45], [45]].map(([a], i) => (
          <rect key={i} x={C.x - 196} y={C.y - 9} width="392" height="18" rx="3" fill={sparks ? "#7a3a28" : "#4a3020"} stroke="#1a0e08" strokeWidth="2" transform={`rotate(${a} ${C.x} ${C.y})`} />
        ))}
        <rect x={C.x - 18} y={C.y - 16} width="36" height="32" rx="4" fill="#3a2a1a" stroke="#1a0e08" strokeWidth="2" />
      </g>
      {sparks && !opened && [[C.x - 136, C.y - 136], [C.x + 136, C.y - 136], [C.x - 136, C.y + 136], [C.x + 136, C.y + 136]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle r="16" fill="#ffb048" opacity="0.5" filter="url(#ep2-blur)" />
          {Array.from({ length: 8 }).map((_, k) => (
            <path key={k} d={`M0 0 L${(Math.cos(k * 0.8 + i) * 22).toFixed(1)} ${(Math.sin(k * 0.8 + i) * 22).toFixed(1)}`} stroke="#ffe8a0" strokeWidth="1.6" strokeLinecap="round">
              <animate attributeName="opacity" values="0;1;0" dur={`${0.3 + (k % 3) * 0.12}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
      ))}

      {/* la lumière du dehors qui entre à flots */}
      {opened && (
        <g style={{ pointerEvents: "none", animation: "fadein 1.6s ease-out" }}>
          <circle cx={C.x} cy={C.y} r="230" fill="url(#ep2-light)" />
          {[-38, -16, 8, 30].map((a, i) => (
            <path key={i} d={`M${C.x} ${C.y} L${C.x + Math.sin(((a - 6) * Math.PI) / 180) * 700} ${C.y + Math.cos(((a - 6) * Math.PI) / 180) * 700} L${C.x + Math.sin(((a + 6) * Math.PI) / 180) * 700} ${C.y + Math.cos(((a + 6) * Math.PI) / 180) * 700} Z`} fill="#ffe8a8" opacity="0.07" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={420 + (i * 37) % 180} cy={260 + (i * 23) % 140} r="1.4" fill="#fff4d0" opacity="0.6">
              <animate attributeName="cy" values={`${260 + (i * 23) % 140};${230 + (i * 23) % 140};${260 + (i * 23) % 140}`} dur={`${4 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* YOL, au chalumeau — c'est lui qui avait soudé la porte, il y a quarante ans */}
      <g transform="translate(236,428)">
        <Figure x={0} y={0} s={1.05} facing="right" skin="#b88458" hair="#1a1408" look="short" beard="stubble" mood={opened ? "surpris" : "vexe"}
          garment="jacket" coat="#28303a" pants="#1a2028" shoes="#0a0a0e"
          arms={opened ? [{ a1: 10, a2: 6 }, { a1: 30, a2: 10 }] : [{ a1: 10, a2: 6 }, { a1: 100, a2: 70 }]}>
          <rect x="-22" y="-52" width="44" height="6" fill="#5a4028" />
          {[-14, -4, 8].map((x) => <rect key={x} x={x} y="-50" width="5" height="10" fill="#8a929c" />)}
          {!opened && (
            <g transform="translate(40,-62) rotate(-22)">
              <rect x="0" y="-3" width="34" height="6" rx="2" fill="#3a4048" />
              {sparks && <path d="M34 0 L58 -4 L58 4 Z" fill="#7fd8ff"><animate attributeName="opacity" values="0.6;1;0.6" dur="0.2s" repeatCount="indefinite" /></path>}
            </g>
          )}
        </Figure>
      </g>

      {/* les habitants, de dos, qui retiennent leur souffle */}
      {[[640, 452, "#3a5878", "#3a2818", "bun"], [720, 458, "#6a4a30", "#c8b090", "ring"], [800, 450, "#5a3a4a", "#1a1408", "long"], [880, 456, "#2a4a3a", "#5a3820", "short"]].map(([x, y, c, h, look], i) => (
        <Bust key={i} x={x} y={y - 54} s={1.05} back skin="#c8a888" hair={h} cloth={c} collar="none" look={look} />
      ))}
      {opened && <rect x="600" y="370" width="400" height="90" fill="#ffe8a8" opacity="0.08" />}

      <Vignette id="ep2-vig" w={1000} h={460} strength={opened ? 0.35 : 0.6} />
      {/* Dialogue haut */}
      <rect x="150" y="2" width="700" height="18" fill="#05080c" opacity="0.6" />
      <text x="500" y="15" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="14" fill="#c8a848" fontStyle="italic">
        {opened ? "La soudure a sauté. Il entre un air qu'on n'avait jamais respiré, ici." : "Quarante ans de soudures craquent sous le chalumeau de Yol."}
      </text>
    </svg>
  );
}

/* ============================================================
   ACTE III · L'AIR LIBRE — surface, soleil
   ============================================================ */
function Acte3AirLibre() {
  const t = useSequence([500, 1600, 2800]);
  /* la file des habitants : du seuil (petits, au loin) vers le pré (plus grands) */
  const FILE = [
    { x: 300, y: 356, s: 0.62, coat: "#a8d8f0", hair: "#5a3820", look: "bun", mood: "surpris", arms: [{ a1: 10, a2: 6 }, { a1: 150, a2: 170 }] },
    { x: 390, y: 372, s: 0.72, coat: "#6a4a30", hair: "#c8b090", look: "ring", mood: "content", arms: [{ a1: 10, a2: 6 }, { a1: 10, a2: 6 }] },
    { x: 480, y: 388, s: 0.6, coat: "#e878a0", hair: "#3a2414", look: "ponytail", mood: "content", arms: [{ a1: 140, a2: 160 }, { a1: 140, a2: 160 }] },
    { x: 575, y: 408, s: 0.9, coat: "#5a3a4a", hair: "#1a1408", look: "long", mood: "surpris", arms: [{ a1: 60, a2: -80 }, { a1: 10, a2: 6 }] },
    { x: 680, y: 432, s: 1.02, coat: "#2a4a3a", hair: "#5a3820", look: "short", mood: "content", arms: [{ a1: 10, a2: 6 }, { a1: 100, a2: 80 }] },
  ];
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a90d8" />
          <stop offset="60%" stopColor="#a8c8e8" />
          <stop offset="100%" stopColor="#ffe0a8" />
        </linearGradient>
        <linearGradient id="ep3-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ab04a" />
          <stop offset="100%" stopColor="#3a5a1a" />
        </linearGradient>
        <filter id="ep3-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      <rect width="1000" height="460" fill="url(#ep3-sky)" />
      {/* soleil et rayons */}
      <g opacity="0.18" filter="url(#ep3-blur)">
        {[200, 228, 256, 284, 312].map((a, i) => (
          <path key={i} d={`M800 100 L${800 + Math.cos((a * Math.PI) / 180) * 900} ${100 + Math.sin((a * Math.PI) / 180) * 900} L${800 + Math.cos(((a + 8) * Math.PI) / 180) * 900} ${100 + Math.sin(((a + 8) * Math.PI) / 180) * 900} Z`} fill="#fff4c8" />
        ))}
      </g>
      <circle cx="800" cy="100" r="110" fill="#fff0c0" opacity="0.35" filter="url(#ep3-blur)" />
      <circle cx="800" cy="100" r="40" fill="#fff8e0">
        <animate attributeName="r" values="38;42;38" dur="4s" repeatCount="indefinite" />
      </circle>
      <Clouds id="ep3-cl" seed={3031} items={[[180, 70, 200], [480, 50, 160], [620, 120, 120], [960, 60, 150]]} color="#f4f6f8" shadow="#9ab0c8" opacity={0.85} drift={18} />
      {/* montagnes lointaines, brume, collines boisées */}
      <Ridge id="ep3-r0" seed={3033} y={250} amp={70} rough={0.5} fill="#8aa0c0" lit="#b8c8dc" light={1} snow="#f0f4f8" snowLine={200} />
      <Haze id="ep3-hz" y0={200} y1={270} color="#e8eef5" opacity={0.5} />
      <Hill id="ep3-h1" points={[[-40, 290], [160, 270], [360, 284], [560, 266], [760, 280], [1040, 268]]} fill="#6a9a4a" lit="#9ac868" light={1} rim={5} />
      <TreeLine seed={3035} x0={380} x1={1020} y={282} n={22} h={[18, 34]} kinds={["leafy", "conifer", "leafy"]} colors={["#3a6a2a", "#2e5a24", "#4a7a34"]} light={1} jitter={10} />
      {/* une rivière qui serpente dans la plaine */}
      <path d="M1040 300 Q860 306 820 320 Q760 340 840 360 Q920 380 860 420 Q820 446 900 470 L960 470 Q880 440 920 412 Q980 380 900 352 Q840 332 900 318 Q960 306 1040 308 Z" fill="#8ac8e8" opacity="0.8" />
      {/* le pré au premier plan */}
      <path d="M-40 316 Q300 296 600 318 Q820 334 1040 312 L1040 460 L-40 460 Z" fill="url(#ep3-grass)" />
      <Speckle seed={3037} x0={0} x1={1000} y0={330} y1={456} n={160} colors={["#f0e070", "#ffffff", "#e87aa0", "#a8d8f0"]} r={[1, 2.4]} opacity={0.75} />
      {/* le sentier que les habitants tracent dans l'herbe */}
      <path d="M210 346 Q380 360 520 392 Q640 420 760 460" stroke="#a8945a" strokeWidth="26" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* L'ENTRÉE DU BUNKER, dans le flanc de la colline, porte ronde roulée de côté */}
      <Hill id="ep3-h2" points={[[-40, 210], [60, 196], [180, 214], [280, 262], [340, 320], [420, 380], [480, 470]]} fill="#5a7a3a" lit="#8aaa58" light={1} rim={5} />
      <g transform="translate(150,300)">
        <rect x="-90" y="-80" width="180" height="140" fill="#6a6a6a" stroke="#3a3a3a" strokeWidth="3" />
        <rect x="-90" y="-80" width="180" height="140" fill="#3a2a1a" opacity="0.15" />
        {[-60, -20, 20, 60].map((x) => <path key={x} d={`M${x} -80 v140`} stroke="#4a4a4a" strokeWidth="1.2" opacity="0.6" />)}
        <path d="M-90 -40 h180 M-90 10 h180" stroke="#4a4a4a" strokeWidth="1.2" opacity="0.6" />
        <path d="M-60 -80 q-6 30 4 60 M50 -80 q8 40 -2 80" stroke="#3a5a2a" strokeWidth="5" fill="none" opacity="0.7" />
        <circle cx="0" cy="-6" r="52" fill="#141a20" stroke="#2a3038" strokeWidth="6" />
        <circle cx="0" cy="-6" r="40" fill="#ffd870" opacity="0.18" />
        <rect x="-22" y="-80" width="44" height="14" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1" />
        <text x="0" y="-70" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="900" fill="#0a0806" letterSpacing="2">C-3</text>
        {/* la porte ronde, appuyée contre la paroi */}
        <g transform="translate(118,4)">
          <circle r="50" fill="#9aa2ac" stroke="#3a4048" strokeWidth="3" />
          <circle r="38" fill="#6a727c" />
          {[0, 120, 240].map((a) => <rect key={a} x="-3" y="-34" width="6" height="34" fill="#c8d0d8" transform={`rotate(${a + 20})`} />)}
          <circle r="8" fill="#3a4048" />
        </g>
        {/* YOL, au seuil, bras croisés : « Finalement, c'était pas pour toujours. » */}
        <Figure x={-44} y={56} s={0.6} facing="right" skin="#b88458" hair="#1a1408" look="short" beard="stubble" mood="content"
          garment="jacket" coat="#28303a" pants="#1a2028" shoes="#0a0a0e" arms={[{ a1: 40, a2: -60 }, { a1: 40, a2: -60 }]} />
      </g>

      {/* Oiseaux */}
      {t > 0 && (
        <g>
          {[[300, 140], [340, 130], [380, 140]].map(([cx, cy], i) => (
            <path key={i} d={`M${cx} ${cy} q6 -6 12 0 q6 -6 12 0`} stroke="#1a1408" strokeWidth="1.4" fill="none">
              <animateTransform attributeName="transform" type="translate" from="0 0" to="400 -40" dur="12s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
      )}

      {/* Les premiers habitants qui sortent, en file, le nez au vent */}
      {t > 1 && FILE.map((h, i) => (
        <g key={i} style={{ animation: `fadein 0.8s ease-out ${i * 0.35}s both` }}>
          <Figure x={h.x} y={h.y} s={h.s} facing="right" skin="#c8a888" hair={h.hair} look={h.look} mood={h.mood} stride={8}
            garment="jacket" coat={h.coat} pants="#2a3038" shoes="#1a1a1e" arms={h.arms} />
        </g>
      ))}

      {/* Herbes au vent, au premier plan */}
      {[40, 150, 260, 420, 560, 720, 880, 980].map((x, i) => (
        <path key={i} d={`M${x} 460 q-4 -26 2 -50 q6 26 2 50`} stroke="#2a4a0a" strokeWidth="2" fill="none" opacity="0.85">
          <animate attributeName="d"
            values={`M${x} 460 q-4 -26 2 -50 q6 26 2 50; M${x} 460 q-8 -22 6 -48 q4 26 2 48; M${x} 460 q-4 -26 2 -50 q6 26 2 50`}
            dur={`${2.4 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
      <Grass x={90} y={456} s={1.6} color="#3a5a1a" seed={3039} n={10} flower="#f0e070" />
      <Grass x={930} y={452} s={1.4} color="#3a5a1a" seed={3041} n={9} flower="#e87aa0" />

      {/* Texte */}
      {t > 2 && (
        <g>
          <rect x="100" y="14" width="800" height="56" rx="8" fill="#141008" opacity="0.75" stroke="#c8a848" strokeWidth="1" />
          <text x="500" y="38" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="14" fontStyle="italic" fill="#e8dfc8">
            Les habitants sortent un à un. Certains se taisent, d'autres pleurent.
          </text>
          <text x="500" y="58" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="14" fontStyle="italic" fill="#e8dfc8">
            Yol, le garde de la porte, reste au seuil. « Finalement, c'était pas pour toujours. »
          </text>
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   ACTE IV · L'HÉRITAGE — Jorge sorti, fiche posée pour toi
   ============================================================ */
function Acte4Heritage({ prenom }) {
  const t = useSequence([600, 1800, 3200]);
  return (
    <svg viewBox="0 0 1000 460" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ep4-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1808" />
          <stop offset="100%" stopColor="#0a0806" />
        </linearGradient>
      </defs>
      <rect width="1000" height="460" fill="url(#ep4-wall)" />
      <ConcretePanels x0={0} x1={1000} y0={0} y1={300} w={125} seed={81} stain="#2a1a08" joint="#050403" bolt="#3a2a18" opacity={0.7} />
      {/* les archives : rayonnages de boîtes et de registres, de part et d'autre */}
      {[[20, 0], [176, 1], [664, 2]].map(([x0, k]) => (
        <g key={k} transform={`translate(${x0},40)`}>
          <rect x="0" y="0" width="150" height="262" fill="#1a1208" stroke="#0a0604" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <rect x="4" y={48 + r * 52} width="142" height="4" fill="#3a2810" />
              {Array.from({ length: 6 }).map((_, j) => (
                <g key={j}>
                  <rect x={8 + j * 23} y={48 + r * 52 - 38} width="20" height="38" fill={["#8a6a40", "#6a5030", "#9a7a4a"][(j + r + k) % 3]} stroke="#2a1a08" strokeWidth="0.6" />
                  <rect x={11 + j * 23} y={48 + r * 52 - 30} width="14" height="8" fill="#e8dfc8" opacity="0.75" />
                </g>
              ))}
            </g>
          ))}
        </g>
      ))}
      {/* le fichier à tiroirs, et la porte des archives, grande ouverte sur le jour */}
      <g transform="translate(830,300)">
        <rect x="-10" y="-200" width="160" height="200" fill="#0a0806" />
        <rect x="0" y="-190" width="140" height="190" fill="#ffe8b0" opacity="0.55" />
        <path d="M0 0 L140 0 L240 160 L-60 160 Z" fill="#ffe8b0" opacity="0.1" />
        <rect x="-14" y="-204" width="168" height="10" fill="#3a2810" />
        <path d="M140 -190 L176 -176 L176 14 L140 0 Z" fill="#3a2818" stroke="#1a0e08" strokeWidth="1.5" />
      </g>
      <g transform="translate(92,300)">
        <rect x="-70" y="-110" width="140" height="110" fill="#5a4028" stroke="#1a0e08" strokeWidth="2" />
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
          <g key={`${r}-${c}`}>
            <rect x={-64 + c * 44} y={-104 + r * 26} width="40" height="22" fill="#6a4a30" stroke="#2a1a08" strokeWidth="1" />
            <rect x={-50 + c * 44} y={-96 + r * 26} width="12" height="5" fill="#c8a848" />
          </g>
        )))}
      </g>
      {/* suspension et cône de lumière sur la fiche */}
      <path d="M500 0 v80" stroke="#3a2810" strokeWidth="1.5" />
      <path d="M478 96 Q500 76 522 96 Z" fill="#8a5030" />
      <ellipse cx="500" cy="98" rx="14" ry="3" fill="#ffe8b0" />
      <path d="M484 98 L516 98 L640 300 L360 300 Z" fill="#ffd870" opacity="0.07" />
      <ellipse cx="500" cy="300" rx="300" ry="140" fill="#c8a848" opacity="0.12" />
      {/* sol et bureau */}
      <rect y="300" width="1000" height="160" fill="#0e0a06" />
      <PerspFloor y0={300} y1={460} step={90} rows={3} opacity={0.45} />
      <rect x="150" y="300" width="700" height="22" fill="#5a3818" stroke="#1a0e08" strokeWidth="1.5" />
      <rect x="150" y="300" width="700" height="3" fill="#8a5a30" opacity="0.6" />
      <rect x="170" y="322" width="20" height="100" fill="#3a2410" /><rect x="810" y="322" width="20" height="100" fill="#3a2410" />
      {/* encrier, pile de fiches classées */}
      <g transform="translate(270,298)"><path d="M-10 0 q-1 -14 10 -15 q11 1 10 15 Z" fill="#1a1a2a" /><path d="M2 -14 l14 -18" stroke="#e8e0d0" strokeWidth="1.6" /></g>
      <g transform="translate(720,298)">{[0, 1, 2, 3].map((k) => <rect key={k} x={-30 + k} y={-4 - k * 4} width="60" height="4" fill="#f0e4c8" stroke="#8a7050" strokeWidth="0.5" />)}</g>
      {/* Fiche posée au centre */}
      <g transform="translate(500,290) rotate(-3)">
        <rect x="-100" y="-70" width="200" height="140" fill="#f0e4c8" stroke="#5a4028" strokeWidth="1.5" />
        <circle cx="0" cy="-70" r="4" fill="#141008" opacity="0.6" />
        <text x="0" y="-50" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8a5030" letterSpacing="2">
          À — {prenom.toUpperCase()}
        </text>
        <line x1="-80" y1="-42" x2="80" y2="-42" stroke="#8a5030" strokeDasharray="2 2" />
        <text x="0" y="-24" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08">
          Trois dates. Trois lieux.
        </text>
        <text x="0" y="-8" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08">
          Trois noms rendus à qui ils reviennent.
        </text>
        <text x="0" y="16" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08" fontStyle="italic">
          Les archives recommencent à dire vrai.
        </text>
        <text x="0" y="36" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#1a0e08" fontStyle="italic">
          Garde l'œil ouvert, où que tu ailles.
        </text>
        <text x="0" y="58" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#5a2010" fontWeight="800">
          — Jorge
        </text>
      </g>
      {/* Jorge, sorti de sa cellule, qui s'en va vers la porte ouverte */}
      <g style={{ opacity: t > 1 ? 1 : 0, transition: "opacity 1.2s" }}>
        <Figure x={904} y={302} s={0.95} facing="right" skin="#c8a888" hair="#8a8070" look="ring" beard="full" beardColor="#8a8070" glasses mood="content" stride={8}
          garment="coat" coat="#5a4028" pants="#28303a" shoes="#1a1410" arms={[{ a1: 10, a2: 6 }, { a1: 30, a2: -20 }]}>
          <g transform="translate(26,-56)"><rect x="-10" y="-8" width="22" height="16" fill="#8a6a40" stroke="#2a1a08" strokeWidth="1" /><rect x="-6" y="-4" width="14" height="5" fill="#e8dfc8" /></g>
        </Figure>
      </g>
      <Vignette id="ep4-vig" w={1000} h={460} strength={0.5} />
      {/* Carte "FIN" en bas */}
      {t > 2 && (
        <g>
          <rect x="300" y="400" width="400" height="46" rx="6" fill="#141008" stroke="#c8a848" strokeWidth="1.2" />
          <text x="500" y="420" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" letterSpacing="4" fill="#c8a848" fontWeight="800">
            FIN DU JEU 3 · LE DISCERNEMENT
          </text>
          <text x="500" y="438" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="11" fill="#8a7050" fontStyle="italic">
            Ce qu'une archive garde dépend de celui qui la regarde.
          </text>
        </g>
      )}
    </svg>
  );
}
