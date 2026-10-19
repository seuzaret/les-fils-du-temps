import { useState, useEffect } from "react";
import TimeMachine from "../../engine/TimeMachine.jsx";
import { PortraitElias, PortraitAl3x1A, AL3X1A_LOOK } from "./StationChronautes.jsx";
import { Figure } from "./cineChars.jsx";
import ChambreN27Decor from "../jeu3/ChambreN27Decor.jsx";
import { playMaterialize, playPhonePing } from "../../engine/sfx.js";

/* ============================================================
   FIN DU JEU 2 — les décors des tableaux (un tableau = un élément)
   ------------------------------------------------------------
   Tous en viewBox 1000×560, `slice`, plein écran. Le bandeau de
   texte masque le bas (≈ y > 410) : le sujet est dessiné plus haut.
   Chaque scène est remontée à chaque tableau (animations repartent
   de zéro) et reçoit { beat, ctx }.
   ============================================================ */

/* Paysage : le décor remplit l'écran (rogné). Portrait (téléphone) : décor entier, centré. */
const PAR = () => (typeof window !== "undefined" && window.innerHeight > window.innerWidth * 1.1 ? "xMidYMid meet" : "xMidYMid slice");
const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };

const KF = `
@keyframes fjDrop { 0% { transform: translateY(-330px); } 62% { transform: translateY(10px); } 78% { transform: translateY(-4px); } 100% { transform: translateY(0); } }
@keyframes fjFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes fjRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fjRun { 0% { transform: translateX(460px); opacity: 0; } 12% { opacity: 1; } 72% { transform: translateX(-12px); } 88% { transform: translateX(5px); } 100% { transform: translateX(0); } }
@keyframes fjSway { 0%, 100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
@keyframes fjFloat { 0% { transform: translateY(0); opacity: 0; } 18% { opacity: 1; } 100% { transform: translateY(-110px); opacity: 0; } }
@keyframes fjBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes fjFeed { from { transform: translateY(0); } to { transform: translateY(-240px); } }
@keyframes fjPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@keyframes fjMeetL { from { transform: translateX(-170px); } to { transform: translateX(0); } }
@keyframes fjMeetR { from { transform: translateX(170px); } to { transform: translateX(0); } }
@keyframes fjWalk { 0% { transform: translate(0,0) scale(1); opacity: 1; } 78% { opacity: 1; } 100% { transform: translate(150px,-34px) scale(0.55); opacity: 0; } }
@keyframes fjDoorL { from { transform: translateX(-92px); } to { transform: translateX(0); } }
@keyframes fjDoorR { from { transform: translateX(92px); } to { transform: translateX(0); } }
@keyframes fjBolt { from { transform: scale(0.2); } to { transform: scale(1); } }
`;

function Stage({ children, defs }) {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio={PAR()} style={FILL}>
      <style>{KF}</style>
      {defs && <defs>{defs}</defs>}
      {children}
    </svg>
  );
}
const an = (name, ms, delay = 0, ease = "ease-out") => ({ animation: `${name} ${ms}ms ${ease} ${delay}ms both` });
const MONO = "ui-monospace,monospace";

/* ───────────── briques communes ───────────── */
function Stars({ n = 60, h = 260, seed = 7 }) {
  return Array.from({ length: n }).map((_, i) => (
    <circle key={i} cx={(i * 41 + seed * 13) % 1000} cy={14 + ((i * 23 + seed * 7) % h)} r={i % 6 === 0 ? 1.6 : 0.8} fill="#e8eef5" opacity={0.5 + (i % 3) * 0.15}>
      <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
    </circle>
  ));
}

/* Silhouette de la station (de nuit), pour les tableaux d'extérieur. */
function StationSilhouette() {
  return (
    <g>
      <path d="M120 380 L120 270 L200 270 L200 240 L340 240 L340 270 L400 270 L400 210 L500 210 L500 270 L600 270 L600 240 L740 240 L740 270 L820 270 L820 380 Z" fill="#0e1420" stroke="#28303a" strokeWidth="1.5" />
      <g transform="translate(450,210)">
        <path d="M-70 0 A 70 55 0 0 1 70 0 Z" fill="#28303a" stroke="#5a6878" strokeWidth="1" />
        <path d="M-45 -40 L0 -55 L45 -40 M-70 0 L-30 -50 L30 -50 L70 0 M-50 0 L0 -55 L50 0" stroke="#5a6878" strokeWidth="0.5" fill="none" opacity="0.7" />
        <path d="M0 -55 L0 -75" stroke="#3a4058" strokeWidth="1" />
        <circle cx="0" cy="-80" r="3.5" fill="#5eff9e"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" /></circle>
      </g>
      {[[160, 320], [220, 300], [240, 310], [280, 290], [320, 320], [380, 290], [560, 300], [620, 320], [680, 290], [740, 320], [780, 300]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="10" fill="#ffd870" opacity="0.85"><animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" /></rect>
      ))}
      <g transform="translate(780,240)"><path d="M0 0 L0 -30" stroke="#5a6878" strokeWidth="1.2" /><ellipse cx="0" cy="-30" rx="8" ry="3" fill="#3a4048" /></g>
      <g transform="translate(90,340)">
        <path d="M0 0 L40 0 L48 -40 L-8 -40 Z" fill="#1a2038" stroke="#3a4058" strokeWidth="1" />
        {[[-4, -32], [8, -32], [20, -32], [32, -32], [0, -16], [12, -16], [24, -16]].map(([x, y], i) => <rect key={i} x={x} y={y} width="10" height="10" fill="#3a5090" opacity="0.85" />)}
      </g>
    </g>
  );
}

function NightBackdrop({ id = "nb", platformY = 330 }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1428" /><stop offset="60%" stopColor="#1a2f4a" /><stop offset="100%" stopColor="#2a3a58" /></linearGradient>
        <radialGradient id={`${id}-neb`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a840f0" stopOpacity="0.35" /><stop offset="100%" stopColor="#a840f0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1000" height={platformY + 20} fill={`url(#${id}-sky)`} />
      <ellipse cx="800" cy="100" rx="220" ry="80" fill={`url(#${id}-neb)`} />
      <ellipse cx="180" cy="70" rx="180" ry="55" fill="#3a80c8" opacity="0.15" />
      <Stars n={70} h={230} />
      <path d="M0 330 L120 250 L220 290 L360 230 L480 280 L620 240 L780 290 L900 260 L1000 300 L1000 360 L0 360 Z" fill="#0e1420" stroke="#28303a" strokeWidth="1" />
      <g transform="translate(0,-70)"><StationSilhouette /></g>
      <rect y={platformY} width="1000" height={560 - platformY} fill="#141c26" />
      <path d={`M0 ${platformY} L1000 ${platformY}`} stroke="#3a4048" strokeWidth="3" />
      {[100, 220, 340, 460, 580, 700, 820, 940].map((x, i) => (
        <rect key={x} x={x - 10} y={platformY + 16} width="20" height="5" fill="#ffd166" opacity="0.5"><animate attributeName="opacity" values="0.3;0.75;0.3" dur="1.2s" begin={`${i * 0.15}s`} repeatCount="indefinite" /></rect>
      ))}
    </>
  );
}

/* ═══════════════════════ ACTE 0 · LE REMÈDE MARCHE ═══════════════════════ */

export function SceneLanding() {
  useEffect(() => { playMaterialize(); }, []);
  return (
    <Stage>
      <NightBackdrop id="ld" />
      <defs>
        <radialGradient id="ld-portal" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.9" /><stop offset="60%" stopColor="#7fd8ff" stopOpacity="0.35" /><stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="500" cy="362" rx="210" ry="27" fill="none" stroke="#ffd166" strokeWidth="1.5" opacity="0.5" strokeDasharray="8 6" />
      {/* portail qui se resserre */}
      <ellipse cx="500" cy="352" rx="300" ry="62" fill="url(#ld-portal)">
        <animate attributeName="rx" values="380;190;230" dur="2.4s" fill="freeze" />
        <animate attributeName="opacity" values="0.4;0.9;0.5" dur="2.4s" fill="freeze" />
      </ellipse>
      <circle cx="500" cy="300" r="110" fill="none" stroke="#7fd8ff" strokeWidth="2" opacity="0.7">
        <animate attributeName="r" values="150;60;90" dur="2.4s" fill="freeze" />
        <animate attributeName="opacity" values="0.9;0.3;0" dur="2.4s" fill="freeze" />
      </circle>
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={470 + (i % 5) * 15} cy="360" r="1.5" fill="#c8e8ff">
          <animate attributeName="cy" values="370;190" dur={`${2 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.85;0" dur={`${2 + (i % 3) * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* MARTINE se pose */}
      <g style={an("fjDrop", 1700, 500, "cubic-bezier(.3,.7,.4,1)")}>
        <g transform="translate(500,228) scale(0.88)"><TimeMachine landed={true} /></g>
      </g>
      {/* anneau de poussière au toucher */}
      <ellipse cx="500" cy="362" rx="30" ry="6" fill="none" stroke="#c8e8ff" strokeWidth="2" opacity="0">
        <animate attributeName="rx" values="30;260" dur="1.2s" begin="1.9s" fill="freeze" />
        <animate attributeName="ry" values="6;34" dur="1.2s" begin="1.9s" fill="freeze" />
        <animate attributeName="opacity" values="0.8;0" dur="1.2s" begin="1.9s" fill="freeze" />
      </ellipse>
    </Stage>
  );
}

export function SceneDescent({ ctx }) {
  return (
    <Stage defs={<radialGradient id="ds-warm" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffd166" stopOpacity="0.7" /><stop offset="100%" stopColor="#ffd166" stopOpacity="0" /></radialGradient>}>
      <NightBackdrop id="ds" platformY={318} />
      {/* faisceau de la porte du vaisseau */}
      <path d="M330 262 L430 262 L640 410 L330 410 Z" fill="#ffe2a0" opacity="0.13" />
      <g transform="translate(250,186) scale(1.0)"><TimeMachine landed={true} /></g>
      {/* Al3x1a, chancelante, dans son halo */}
      <ellipse cx="478" cy="285" rx="120" ry="150" fill="url(#ds-warm)" opacity="0.8" />
      <g transform="translate(478,396)">
        <g style={{ ...an("fjFade", 700, 500), transformBox: "fill-box", transformOrigin: "50% 100%" }}>
          <g style={{ animation: "fjSway 2.8s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "50% 100%" }}>
            <Figure x={0} y={0} s={1.75} {...AL3X1A_LOOK} coat="#6a7280" coat2="#7a828e" pants="#3a3a44" garment="coat" mood="vexe"
              arms={[{ a1: 42, a2: 34 }, { a1: 10, a2: 6 }]}>
              <circle cx="-9" cy="-72" r="3.4" fill="#c8a848" stroke="#5a4020" strokeWidth="0.7" />
              <path d="M-9 -74.5 V-69.5 M-11.5 -72 H-6.5" stroke="#5a4020" strokeWidth="0.7" />
            </Figure>
          </g>
        </g>
      </g>
      {/* Elias arrive en courant */}
      <g style={an("fjRun", 1500, 1000)}>
        <Figure x={742} y={402} s={1.8} skin="#c8a888" hair="#e8e8e0" coat="#5a4028" garment="coat" beard mood="surpris" stride={7} arms={[{ a1: 58, a2: 70 }, { a1: 62, a2: 48 }]} />
        <text x="742" y="146" textAnchor="middle" fontFamily="Georgia,serif" fontSize="40" fontWeight="800" fill="#ffd166" style={an("fjFade", 400, 2300)}>!</text>
      </g>
    </Stage>
  );
}

/* Coupe un texte en lignes de `n` caractères maximum. */
function wrap(text, n) {
  const out = []; let cur = "";
  (text || "").split(" ").forEach((w) => { if ((cur + " " + w).trim().length > n) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
  if (cur) out.push(cur);
  return out;
}

export function SceneTest({ ctx }) {
  const remede = ctx?.remede;
  const lines = wrap(remede?.desc || "Le remède de la maladie de l'oubli.", 34).slice(0, 4);
  return (
    <Stage defs={<linearGradient id="tt-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1420" /><stop offset="100%" stopColor="#141c2c" /></linearGradient>}>
      <rect width="1000" height="560" fill="url(#tt-wall)" />
      <g stroke="#1c2a3c" strokeWidth="1" opacity="0.8">
        {[100, 220, 340, 660, 780, 900].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="420" />)}
      </g>
      {/* grand écran d'analyse */}
      <g transform="translate(500,52)">
        <rect x="-330" y="-4" width="660" height="338" rx="10" fill="#05080e" stroke="#5eff9e" strokeWidth="3" />
        <rect x="-318" y="8" width="636" height="314" rx="5" fill="#0a1a24" />
        <text x="-300" y="36" fontFamily={MONO} fontSize="13" fontWeight="800" fill="#5eff9e" letterSpacing="3">ANALYSE · REMÈDE</text>
        <text x="300" y="36" textAnchor="end" fontFamily={MONO} fontSize="11" fill="#7fd8ff" letterSpacing="2">SUJET : AL3X1A</text>
        <line x1="-300" y1="48" x2="300" y2="48" stroke="#5eff9e" strokeWidth="0.8" opacity="0.5" />
        {/* le remède */}
        <rect x="-300" y="64" width="270" height="170" rx="8" fill="#0e2a30" stroke="#2a6a5a" strokeWidth="1.5" />
        <text x="-165" y="124" textAnchor="middle" fontSize="54">{remede?.emoji || "🧪"}</text>
        <text x="-165" y="156" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="700" fill="#e8eef5">{remede?.name || "Remède"}</text>
        {lines.map((l, i) => <text key={i} x="-165" y={178 + i * 14} textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="#a8c0d0" fontStyle="italic">{l}</text>)}
        {/* jauge de mémoire */}
        <text x="10" y="82" fontFamily={MONO} fontSize="11" fill="#c8d4e2" letterSpacing="2">MÉMOIRE</text>
        <rect x="10" y="92" width="290" height="22" rx="4" fill="#0a0e14" stroke="#3a4a58" />
        <g style={{ ...an("fjBar", 3600, 600, "ease-in-out"), transformBox: "fill-box", transformOrigin: "0% 50%" }}>
          <rect x="12" y="94" width="286" height="18" rx="3" fill="#5eff9e" />
        </g>
        {/* tracé qui se stabilise */}
        <rect x="10" y="130" width="290" height="104" rx="6" fill="#06101a" stroke="#1c3a4a" />
        <path d="M14 182 L40 150 L66 214 L92 140 L118 220 L144 160 L170 200 L196 176 L222 188 L248 182 L300 182" stroke="#ff8a5a" strokeWidth="2" fill="none" strokeLinejoin="round">
          <animate attributeName="opacity" values="1;1;0" dur="3.6s" begin="0.4s" fill="freeze" />
        </path>
        <path d="M14 182 Q 40 160 66 182 T 118 182 T 170 182 T 222 182 T 300 182" stroke="#5eff9e" strokeWidth="2.4" fill="none" opacity="0">
          <animate attributeName="opacity" values="0;0;1" dur="4s" begin="0.4s" fill="freeze" />
        </path>
        {/* verdict */}
        <g opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.6s" begin="4.2s" fill="freeze" />
          <rect x="-300" y="252" width="600" height="52" rx="8" fill="#0e3a28" stroke="#5eff9e" strokeWidth="2" />
          <text x="0" y="287" textAnchor="middle" fontFamily={MONO} fontSize="22" fontWeight="800" fill="#5eff9e" letterSpacing="4">✓ MÉMOIRE RESTAURÉE</text>
        </g>
      </g>
      {/* silhouettes éclairées par l'écran : Al3x1a (à gauche), Mira et sa tablette (à droite) */}
      <g transform="translate(110,430)">
        <path d="M-90 130 Q-90 20 -20 4 Q40 -4 90 30 L90 130 Z" fill="#0a1218" stroke="#5eff9e" strokeWidth="1.5" opacity="0.95" />
        <circle cx="-4" cy="-44" r="46" fill="#0a1218" stroke="#5eff9e" strokeWidth="1.5" />
        <path d="M-48 -52 Q-4 -100 40 -52" fill="#4a3020" opacity="0.9" /><circle cx="44" cy="-62" r="14" fill="#4a3020" opacity="0.9" />
      </g>
      <g transform="translate(900,440)">
        <path d="M-90 130 Q-90 22 -20 6 Q40 -2 90 30 L90 130 Z" fill="#0a1218" stroke="#7fd8ff" strokeWidth="1.5" opacity="0.95" />
        <circle cx="0" cy="-42" r="44" fill="#0a1218" stroke="#7fd8ff" strokeWidth="1.5" />
        <path d="M-40 -64 Q-52 -20 -46 20 M40 -64 Q52 -20 46 20" stroke="#1a1408" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8" />
        <g transform="translate(-86,0) rotate(-8)">
          <rect x="-26" y="-34" width="52" height="68" rx="5" fill="#0a1a24" stroke="#5eff9e" strokeWidth="2" />
          <circle cx="0" cy="-8" r="5" fill="#5eff9e"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite" /></circle>
        </g>
      </g>
    </Stage>
  );
}

export function SceneThanks() {
  return (
    <Stage defs={
      <>
        <linearGradient id="th-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10182c" /><stop offset="55%" stopColor="#2a2a48" /><stop offset="100%" stopColor="#4a3a50" /></linearGradient>
        <radialGradient id="th-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffd166" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffd166" stopOpacity="0" /></radialGradient>
      </>}>
      <rect width="1000" height="560" fill="url(#th-bg)" />
      {/* lumières floues de la plateforme */}
      {[[120, 300, 40], [260, 340, 26], [820, 310, 44], [900, 350, 24], [700, 330, 20], [180, 250, 18]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={["#ffd870", "#7fd8ff", "#ffb070"][i % 3]} opacity="0.22">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur={`${3 + i % 3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <ellipse cx="500" cy="215" rx="260" ry="250" fill="url(#th-halo)" />
      <g style={an("fjFade", 1200, 200)}>
        <rect x="348" y="54" width="304" height="358" rx="16" fill="#181820" stroke="#ffd166" strokeWidth="3" opacity="0.95" />
        <svg x="354" y="60" width="292" height="346" viewBox="0 0 200 240"><PortraitAl3x1A mood="content" /></svg>
      </g>
      {[[300, 120], [700, 150], [330, 330], [680, 320], [250, 220], [760, 240]].map(([x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="16" fill="#ffd870" opacity="0" style={an("fjFloat", 3200 + i * 300, 800 + i * 450, "ease-in-out")}>✦</text>
      ))}
    </Stage>
  );
}

/* ═══════════════════════ ACTE 1 · LA MÉMOIRE REVIENT ═══════════════════════ */

export function SceneBroadcast() {
  const houses = [[560, 330, 60], [640, 338, 46], [720, 326, 70], [810, 336, 52], [890, 328, 64], [470, 340, 44]];
  const names = [["Inès", 580, 300], ["Marc", 690, 296], ["Sami", 790, 300], ["Noor", 880, 296], ["Léo", 510, 304]];
  const roles = [["boulangère", 620, 284], ["pilote", 740, 280], ["maître d'école", 850, 282]];
  return (
    <Stage defs={
      <>
        <linearGradient id="bc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0b1530" /><stop offset="45%" stopColor="#3a2a5a" /><stop offset="82%" stopColor="#c8605a" /><stop offset="100%" stopColor="#f2b070" /></linearGradient>
      </>}>
      <rect width="1000" height="560" fill="url(#bc-sky)" />
      <Stars n={40} h={150} seed={3} />
      <circle cx="800" cy="340" r="70" fill="#ffd9a0" opacity="0.5" />
      <path d="M0 360 Q250 300 520 350 T1000 340 L1000 560 L0 560 Z" fill="#1a1230" />
      <path d="M0 400 Q300 360 600 392 T1000 380 L1000 560 L0 560 Z" fill="#120c22" />
      {/* village : les fenêtres s'allument une à une */}
      {houses.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={40} fill="#0c0818" />
          <path d={`M${x - 4} ${y} L${x + w / 2} ${y - 18} L${x + w + 4} ${y} Z`} fill="#0a0612" />
          <rect x={x + w / 2 - 5} y={y + 12} width="10" height="12" fill="#2a2a40">
            <animate attributeName="fill" values="#2a2a40;#ffd870" dur="0.8s" begin={`${1.4 + i * 0.5}s`} fill="freeze" />
          </rect>
        </g>
      ))}
      {/* les prénoms, puis les métiers, remontent des toits */}
      {names.map(([t, x, y], i) => (
        <text key={t} x={x} y={y} textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="18" fill="#ffe8b0" style={an("fjFloat", 3400, 2000 + i * 500, "ease-in-out")}>{t}</text>
      ))}
      {roles.map(([t, x, y], i) => (
        <text key={t} x={x} y={y} textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="15" fill="#c8f0ff" style={an("fjFloat", 3400, 4600 + i * 600, "ease-in-out")}>{t}</text>
      ))}
      <text x="930" y="270" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="17" fill="#ffb8c0" style={an("fjFloat", 3400, 6600, "ease-in-out")}>« mon fils ! »</text>
      {/* la station et son antenne qui diffusent */}
      <g transform="translate(250,390)">
        <path d="M-130 0 L-130 -40 L-60 -40 L-60 -64 L60 -64 L60 -40 L130 -40 L130 0 Z" fill="#0a0814" stroke="#2a2840" strokeWidth="1.5" />
        <path d="M-50 -64 A 50 40 0 0 1 50 -64 Z" fill="#1a2038" stroke="#4a5878" strokeWidth="1" />
        {[-100, -70, 70, 100].map((x) => <rect key={x} x={x} y={-26} width="8" height="9" fill="#ffd870" opacity="0.8" />)}
        <path d="M0 -104 L0 -300" stroke="#4a5878" strokeWidth="3" />
        <path d="M-12 -230 L12 -230 M-9 -180 L9 -180" stroke="#4a5878" strokeWidth="2" />
        <circle cx="0" cy="-306" r="6" fill="#5eff9e"><animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" /></circle>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="0" cy="-306" r="10" fill="none" stroke="#5eff9e" strokeWidth="2.4">
            <animate attributeName="r" values="10;760" dur="4.2s" begin={`${i * 1.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="4.2s" begin={`${i * 1.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
    </Stage>
  );
}

/* Grande salle sous la coupole, commune aux tableaux 1b/1c/1d. */
function DomeHall({ id, dim = 0 }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-dome`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#080c18" /><stop offset="100%" stopColor="#1a2438" /></linearGradient>
        <radialGradient id={`${id}-warm`} cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor="#5eff9e" stopOpacity="0.28" /><stop offset="100%" stopColor="#5eff9e" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1000" height="560" fill="#0a1420" />
      <path d="M0 250 Q500 -30 1000 250 L1000 0 L0 0 Z" fill={`url(#${id}-dome)`} />
      <g stroke="#3a4858" strokeWidth="1.2" fill="none" opacity="0.8">
        <path d="M0 250 Q500 -30 1000 250" /><path d="M110 230 Q500 50 890 230" /><path d="M260 210 Q500 110 740 210" />
        <path d="M500 10 L500 210 M300 40 L240 250 M700 40 L760 250 M130 100 L80 250 M870 100 L920 250" />
      </g>
      <ellipse cx="500" cy="210" rx="540" ry="250" fill={`url(#${id}-warm)`} />
      {[[100, 100], [290, 140], [500, 168], [710, 140], [900, 100]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 64} ${y - 22} Q${x} ${y + 22} ${x + 64} ${y - 22}`} stroke="#4a5060" strokeWidth="0.9" fill="none" />
          {[-44, -22, 0, 22, 44].map((dx, j) => (
            <circle key={j} cx={x + dx} cy={y + (Math.abs(dx) < 32 ? 13 : 4)} r="2.4" fill={["#ff8a3a", "#5eff9e", "#7fd8ff", "#ffd166", "#ff5a7a"][(i + j) % 5]}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.6 + (j % 3) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
      <rect y="372" width="1000" height="188" fill="#1a2038" />
      <path d="M0 372 L1000 372" stroke="#28303a" strokeWidth="2" />
      {[0, 120, 240, 360, 480, 600, 720, 840, 960].map((x) => <line key={x} x1={x} y1="372" x2={x} y2="560" stroke="#141c26" strokeWidth="0.6" opacity="0.6" />)}
      {[[300, 392], [520, 402], [740, 392]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="140" ry="7" fill="#7fd8ff" opacity="0.1" />)}
      {dim > 0 && <rect width="1000" height="560" fill="#02040a" opacity={dim} />}
    </>
  );
}

const CROWD = [[90, "#e0a878", "#3a80c8"], [170, "#c8a888", "#8a3820"], [250, "#e0d0b0", "#5eff9e"], [330, "#e0a878", "#a04ce8"], [670, "#c8a848", "#e0a848"], [750, "#e0a878", "#3a80c8"], [830, "#c8a888", "#5a3818"], [910, "#e0d0b0", "#5eff9e"]];

export function SceneReunion() {
  return (
    <Stage>
      <DomeHall id="ru" />
      {/* foule au fond */}
      {CROWD.map(([x, skin, coat], i) => (
        <g key={i} style={{ animation: "fjSway 3.4s ease-in-out infinite", animationDelay: `${i * 0.3}s`, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
          <Figure x={x} y={392} s={0.58} skin={skin} coat={coat} garment={i % 3 === 0 ? "coat" : "jacket"} look={["short", "long", "bun", "curls"][i % 4]} hair={["#3a2818", "#5a3818", "#8a5828", "#a89078"][i % 4]} mood="content" arms={[{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }]} />
        </g>
      ))}
      {/* la femme et son mari s'avancent l'un vers l'autre */}
      <g style={an("fjMeetL", 2400, 600, "ease-in-out")}>
        <Figure x={350} y={404} s={1.8} skin="#d8a880" hair="#3a2818" coat="#c88060" garment="coat" look="long" mood="surpris" arms={[{ a1: 12, a2: 8 }, { a1: 78, a2: 92 }]} />
      </g>
      <g style={an("fjMeetR", 2400, 600, "ease-in-out")}>
        <Figure x={650} y={404} s={1.8} skin="#c8a080" hair="#a8a0a0" coat="#3a80c8" garment="jacket" mood="surpris" arms={[{ a1: 78, a2: 92 }, { a1: 12, a2: 8 }]} />
      </g>
      {/* ils se reconnaissent */}
      <g style={an("fjFade", 500, 1000)}>
        <rect x="262" y="120" width="124" height="42" rx="12" fill="#101827" stroke="#ffd870" strokeWidth="1.6" />
        <path d="M340 162 L350 178 L360 162" fill="#101827" stroke="#ffd870" strokeWidth="1.6" />
        <text x="324" y="148" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="20" fill="#ffe8b0">« Marc ? »</text>
      </g>
      <g style={an("fjFade", 500, 1900)}>
        <rect x="610" y="120" width="124" height="42" rx="12" fill="#101827" stroke="#ffd870" strokeWidth="1.6" />
        <path d="M640 162 L650 178 L660 162" fill="#101827" stroke="#ffd870" strokeWidth="1.6" />
        <text x="672" y="148" textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="20" fill="#ffe8b0">« Inès ! »</text>
      </g>
      {[[440, 230], [500, 200], [560, 236], [470, 170], [540, 160]].map(([x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="22" fill="#ff8aa0" opacity="0" style={an("fjFloat", 2600, 3200 + i * 350, "ease-in-out")}>♥</text>
      ))}
    </Stage>
  );
}

function useCounter(start, step, ms = 140) {
  const [n, setN] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + 1 + Math.floor(Math.random() * step)), ms);
    return () => clearInterval(id);
  }, []);
  return n;
}

export function SceneMonument() {
  const n = useCounter(124512, 9);
  const cards = [[80, 380], [920, 390], [200, 410], [800, 410], [330, 420], [680, 420], [120, 320], [880, 330]];
  return (
    <Stage defs={<radialGradient id="mo-mem" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.55" /><stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" /></radialGradient>}>
      <DomeHall id="mo" />
      <circle cx="500" cy="210" r="300" fill="url(#mo-mem)" opacity="0.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.6s" repeatCount="indefinite" /></circle>
      {/* le grand écran MARTINE */}
      <g transform="translate(500,60)">
        <rect x="-30" y="290" width="60" height="22" fill="#28303a" stroke="#5a6270" /><rect x="-60" y="308" width="120" height="8" fill="#141c26" />
        <rect x="-230" y="0" width="460" height="296" rx="8" fill="#05080e" stroke="#7fd8ff" strokeWidth="4" />
        <rect x="-218" y="12" width="436" height="272" fill="#0a1a2a" />
        <text x="0" y="104" textAnchor="middle" fontFamily={MONO} fontSize="44" fontWeight="800" fill="#7fd8ff" letterSpacing="9" style={an("fjFade", 900, 400)}>MÉMOIRE</text>
        <text x="0" y="164" textAnchor="middle" fontFamily={MONO} fontSize="44" fontWeight="800" fill="#7fd8ff" letterSpacing="9" style={an("fjFade", 900, 800)}>COMMUNE</text>
        <line x1="-150" y1="190" x2="150" y2="190" stroke="#7fd8ff" strokeWidth="0.8" opacity="0.6" />
        <text x="0" y="224" textAnchor="middle" fontFamily={MONO} fontSize="16" fill="#5eff9e" letterSpacing="4" style={an("fjFade", 900, 1300)}>archivée par MARTINE</text>
        <text x="0" y="252" textAnchor="middle" fontFamily={MONO} fontSize="14" fill="#c8d4e2" letterSpacing="2" opacity="0.85" style={an("fjFade", 900, 1600)}>{n.toLocaleString("fr-FR")} témoignages · en direct</text>
      </g>
      {/* les témoignages volent vers l'écran */}
      {cards.map(([x, y], i) => (
        <g key={i} opacity="0">
          <animateTransform attributeName="transform" type="translate" values={`${x} ${y}; 500 220`} dur="3.2s" begin={`${1.2 + i * 0.45}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.75;1" dur="3.2s" begin={`${1.2 + i * 0.45}s`} repeatCount="indefinite" />
          <rect x="-22" y="-14" width="44" height="28" rx="3" fill="#f0e8d0" stroke="#8a7a50" />
          <path d="M-15 -6 H15 M-15 0 H15 M-15 6 H6" stroke="#5a4a28" strokeWidth="1.4" />
        </g>
      ))}
    </Stage>
  );
}

export function SceneFrown() {
  return (
    <Stage defs={<radialGradient id="fr-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7fd8ff" stopOpacity="0.5" /><stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" /></radialGradient>}>
      <DomeHall id="fr" dim={0.55} />
      {/* derrière lui : l'écran bleu et la foule qui acclame, floue */}
      <g opacity="0.55">
        <circle cx="760" cy="220" r="200" fill="url(#fr-glow)" />
        <rect x="640" y="130" width="240" height="150" rx="6" fill="#0a1a2a" stroke="#7fd8ff" strokeWidth="3" />
        <text x="760" y="198" textAnchor="middle" fontFamily={MONO} fontSize="17" fontWeight="800" fill="#7fd8ff" letterSpacing="4">MÉMOIRE</text>
        <text x="760" y="226" textAnchor="middle" fontFamily={MONO} fontSize="17" fontWeight="800" fill="#7fd8ff" letterSpacing="4">COMMUNE</text>
        {[[660, "#e0a878", "#3a80c8"], [720, "#c8a888", "#8a3820"], [800, "#e0d0b0", "#5eff9e"], [860, "#e0a878", "#a04ce8"]].map(([x, skin, coat], i) => (
          <Figure key={i} x={x} y={398} s={0.74} skin={skin} coat={coat} look={["short", "bun", "curls", "long"][i % 4]} hair={["#3a2818", "#5a3818", "#8a5828", "#2a1a10"][i % 4]} mood="content" arms={[{ a1: 150, a2: 168 }, { a1: 150, a2: 168 }]} />
        ))}
      </g>
      {/* Elias, au premier plan, sourcils froncés */}
      <g style={an("fjFade", 900, 300)}>
        <rect x="110" y="56" width="310" height="362" rx="16" fill="#12182a" stroke="#ffd166" strokeWidth="3" />
        <svg x="116" y="62" width="298" height="350" viewBox="0 0 200 240"><PortraitElias mood="vexe" /></svg>
      </g>
      <text x="470" y="110" fontFamily="Georgia,serif" fontStyle="italic" fontSize="46" fill="#8fa3bd" opacity="0.8" style={an("fjFade", 900, 1500)}>…</text>
    </Stage>
  );
}

/* ═══════════════════════ ACTE 3 · LE PUITS S'ORGANISE ═══════════════════════ */

export function SceneSealed() {
  return (
    <Stage defs={
      <>
        <linearGradient id="se-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0e1a" /><stop offset="55%" stopColor="#1a1030" /><stop offset="100%" stopColor="#4a2418" /></linearGradient>
        <radialGradient id="se-light" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffd88a" stopOpacity="0.95" /><stop offset="100%" stopColor="#ffd88a" stopOpacity="0" /></radialGradient>
        <clipPath id="se-door"><circle cx="500" cy="235" r="128" /></clipPath>
      </>}>
      <rect width="1000" height="560" fill="url(#se-sky)" />
      <circle cx="840" cy="86" r="30" fill="#c85030" opacity="0.5" /><circle cx="840" cy="86" r="52" fill="#c85030" opacity="0.15" />
      <Stars n={30} h={110} seed={5} />
      {/* ruines de la surface, au loin */}
      <g opacity="0.7">
        <path d="M60 210 L60 150 L130 150 L130 124 L230 124 Q222 138 214 150 L190 150 L190 210 Z" fill="#141420" />
        <path d="M720 210 L720 170 L790 170 L790 146 L880 146 L880 210 Z" fill="#141420" />
        <path d="M250 210 L300 210 L300 176 L350 176 L350 210 Z" fill="#141420" />
        <path d="M128 124 L126 96 L130 98" stroke="#5a3820" strokeWidth="2" fill="none" />
      </g>
      <path d="M0 208 L1000 208 L1000 560 L0 560 Z" fill="#2a1c14" />
      <path d="M0 208 L1000 208" stroke="#5a3a24" strokeWidth="3" />
      {/* la grande porte blindée, creusée dans la roche */}
      <rect x="330" y="86" width="340" height="300" rx="10" fill="#1a1410" stroke="#3a2a1c" strokeWidth="4" />
      <circle cx="500" cy="235" r="148" fill="#10151e" stroke="#6a7486" strokeWidth="10" />
      {/* lumière du dedans qui se réduit à rien */}
      <circle cx="500" cy="235" r="128" fill="url(#se-light)" />
      <g clipPath="url(#se-door)">
        <g style={an("fjDoorL", 2600, 400, "ease-in-out")}>
          <rect x="372" y="106" width="130" height="260" fill="#4a5262" stroke="#10151e" strokeWidth="3" />
          <path d="M386 130 H488 M386 190 H488 M386 250 H488 M386 310 H488" stroke="#6a7486" strokeWidth="3" />
        </g>
        <g style={an("fjDoorR", 2600, 400, "ease-in-out")}>
          <rect x="498" y="106" width="130" height="260" fill="#4a5262" stroke="#10151e" strokeWidth="3" />
          <path d="M512 130 H614 M512 190 H614 M512 250 H614 M512 310 H614" stroke="#6a7486" strokeWidth="3" />
        </g>
      </g>
      {/* verrous */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 + 22.5) * Math.PI / 180;
        const x = 500 + Math.cos(a) * 148, y = 235 + Math.sin(a) * 148;
        return (
          <g key={i} style={{ ...an("fjBolt", 500, 3200 + i * 120), transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={x} cy={y} r="10" fill="#c8a848" stroke="#5a4020" strokeWidth="2" />
          </g>
        );
      })}
      {/* plaque */}
      <g style={an("fjFade", 900, 4200)}>
        <rect x="406" y="338" width="188" height="50" fill="#0a0806" stroke="#f2c14e" strokeWidth="2" />
        <text x="500" y="362" textAnchor="middle" fontFamily={MONO} fontSize="19" fontWeight="800" fill="#f2c14e" letterSpacing="6">SORTIE C-3</text>
        <text x="500" y="380" textAnchor="middle" fontFamily={MONO} fontSize="11" fill="#c8d4e2" letterSpacing="4">SCELLÉE · 2047</text>
      </g>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={120 + i * 90} cy={300 + (i % 3) * 30} r="1.8" fill="#8a6a50" opacity="0">
          <animate attributeName="cx" values={`${120 + i * 90};${60 + i * 90}`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.5;0" dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </Stage>
  );
}

export function SceneLevels() {
  const [annee, setAnnee] = useState(2047);
  useEffect(() => {
    const t0 = Date.now(); const dur = 11000;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / dur);
      setAnnee(Math.round(2047 + 40 * p));
      if (p >= 1) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);
  const levels = [
    { y: 100, x0: 150, label: "+2 · SERRE" },
    { y: 160, x0: 270, label: "+1 · MÉNAGES" },
    { y: 220, x0: 390, label: "0 · ATELIERS" },
    { y: 280, x0: 510, label: "−1 · ADMIN" },
    { y: 340, x0: 630, label: "−2 · SERVEURS" },
  ];
  return (
    <Stage defs={
      <>
        <linearGradient id="lv-earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a2818" /><stop offset="100%" stopColor="#0e0806" /></linearGradient>
        <linearGradient id="lv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0e1a" /><stop offset="100%" stopColor="#3a2418" /></linearGradient>
      </>}>
      <rect width="1000" height="560" fill="#0a0806" />
      <rect width="1000" height="70" fill="url(#lv-sky)" />
      <circle cx="860" cy="30" r="22" fill="#c85030" opacity="0.5" />
      <rect y="70" width="1000" height="490" fill="url(#lv-earth)" />
      <path d="M0 70 L1000 70" stroke="#5a3a24" strokeWidth="3" />
      {/* niveaux qui s'ajoutent un à un */}
      {levels.map((l, i) => (
        <g key={i} style={an("fjFade", 700, 700 + i * 1500)}>
          <path d={i === 0 ? `M${l.x0} 70 V${l.y}` : `M${levels[i - 1].x0} ${l.y - 30} V${l.y} H${l.x0}`} stroke="#8a94a8" strokeWidth="2.4" fill="none" opacity="0.7" />
          <rect x={l.x0} y={l.y} width={1000 - l.x0} height="60" fill="#28303a" stroke="#5a6270" strokeWidth="1.2" opacity="0.92" />
          <text x={l.x0 + 12} y={l.y + 20} fontFamily={MONO} fontSize="13" fontWeight="800" fill="#c8a848" letterSpacing="2">{l.label}</text>
          {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={l.x0 + 40 + k * 70} y={l.y + 28} width="14" height="24" fill="#141c26" stroke="#5a6270" strokeWidth="0.6" />)}
          {[l.x0 + 120, l.x0 + 250].filter((x) => x < 940).map((x, k) => (
            <g key={k} transform={`translate(${x},${l.y + 50})`}><circle cy="-14" r="5" fill="#c8a888" /><path d="M-6 -8 L6 -8 L7 6 L-7 6 Z" fill={k ? "#3a4058" : "#5a4028"} /></g>
          ))}
        </g>
      ))}
      {/* MARTINE, de plus en plus grande */}
      <g transform="translate(78,236)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="0.7;1.45" dur="11s" fill="freeze" />
          <rect x="-56" y="-56" width="112" height="112" fill="#0a0806" stroke="#7fd8ff" strokeWidth="3" />
          <rect x="-48" y="-48" width="96" height="96" fill="#141c26" />
          <ellipse cx="0" cy="-6" rx="32" ry="13" fill="#0a0806" />
          <circle cx="0" cy="-6" r="10" fill="#7fd8ff"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" /></circle>
          <circle cx="0" cy="-6" r="4" fill="#0a0806" />
          <rect x="-40" y="22" width="80" height="4" fill="#0a0e14" /><rect x="-40" y="22" width="56" height="4" fill="#7fd8ff" opacity="0.8"><animate attributeName="width" values="20;80;40;80" dur="6s" repeatCount="indefinite" /></rect>
          <text x="0" y="44" textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="800" fill="#7fd8ff" letterSpacing="4">MARTINE</text>
        </g>
      </g>
      {/* compteur d'années */}
      <g transform="translate(24,6)">
        <rect width="190" height="58" fill="#0a0806" stroke="#c8a848" strokeWidth="1.5" opacity="0.9" />
        <text x="14" y="34" fontFamily={MONO} fontSize="30" fontWeight="800" fill="#c8a848" letterSpacing="6">{annee}</text>
        <text x="14" y="50" fontFamily={MONO} fontSize="9" fill="#8fa3bd" letterSpacing="4" opacity="0.85">année · CHRONO</text>
      </g>
    </Stage>
  );
}

export function SceneElderElias() {
  return (
    <Stage defs={
      <>
        <linearGradient id="ee-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0c1018" /><stop offset="100%" stopColor="#1a1e28" /></linearGradient>
        <radialGradient id="ee-out" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffe8b0" stopOpacity="1" /><stop offset="100%" stopColor="#ffe8b0" stopOpacity="0" /></radialGradient>
      </>}>
      <rect width="1000" height="560" fill="url(#ee-wall)" />
      {/* couloir en perspective */}
      <path d="M0 0 L380 130 L380 330 L0 470 Z" fill="#10141c" stroke="#28303a" />
      <path d="M1000 0 L620 130 L620 330 L1000 470 Z" fill="#10141c" stroke="#28303a" />
      <path d="M0 0 L1000 0 L620 130 L380 130 Z" fill="#0a0d14" stroke="#28303a" />
      <path d="M0 470 L380 330 L620 330 L1000 470 L1000 560 L0 560 Z" fill="#181c24" stroke="#28303a" />
      {[0.2, 0.45, 0.7].map((k, i) => <path key={i} d={`M${380 - 380 * (1 - k)} ${130 - 130 * (1 - k)} V${330 + 140 * (1 - k)}`} stroke="#1c2230" strokeWidth="2" />)}
      {/* néon qui clignote */}
      <rect x="430" y="64" width="140" height="8" fill="#c8d4e2" opacity="0.8"><animate attributeName="opacity" values="0.9;0.3;0.95;0.5;0.9" dur="2.6s" repeatCount="indefinite" /></rect>
      {/* la porte du fond, vers la surface */}
      <rect x="440" y="170" width="120" height="160" fill="#05060a" stroke="#6a7486" strokeWidth="4" />
      <circle cx="500" cy="250" r="180" fill="url(#ee-out)" opacity="0.5" style={an("fjFade", 3000, 3500)} />
      <rect x="448" y="178" width="104" height="144" fill="#ffe8b0" opacity="0" style={an("fjFade", 3000, 3500)} />
      {/* l'œil de MARTINE sur le mur de gauche */}
      <g transform="translate(150,170)">
        <ellipse cx="0" cy="0" rx="52" ry="22" fill="#0a0e14" stroke="#7fd8ff" strokeWidth="2" />
        <circle cx="0" cy="0" r="12" fill="#7fd8ff"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" /></circle>
        <circle cx="0" cy="0" r="5" fill="#0a0e14" />
      </g>
      {/* Elias, très vieux, de dos, s'éloigne avec sa canne */}
      <g style={{ ...an("fjWalk", 9000, 1800, "ease-in") }}>
        <g transform="translate(470,420)">
          <Figure x={0} y={0} s={1.8} hair="#e8e8e0" coat="#3a2818" pants="#2a2018" garment="coat" back cane arms={[{ a1: 5, a2: 3 }, { a1: 6, a2: 4 }]} />
        </g>
      </g>
    </Stage>
  );
}

/* ═══════════════════════ ACTE 4 · LE DISCERNEMENT ═══════════════════════ */

/* La chambre N-27 : le MÊME décor que dans le Jeu 3 (ChambreN27Decor),
   pour qu'on reconnaisse la pièce en lançant le Discernement. */
function CellRoom({ beat = 0 }) {
  return (
    <>
      <rect width="1000" height="560" fill="#050810" />
      <rect y="500" width="1000" height="60" fill="#050810" />
      <g transform="translate(0,20)">
        <ChambreN27Decor shelfTablet="on"
          bedExtras={
            /* toi, assis·e sur le lit, encore groggy */
            <Figure x={130} y={78} s={0.86} pose="sit" skin="#e0a878" hair="#3a2818" look="short" mood="vexe"
              garment="tee" coat="#3a80c8" pants="#2a3448" shoes="#1a1e26" arms={[{ a1: 14, a2: -30 }, { a1: 14, a2: -30 }]} />
          } />
        {/* l'annonce de MARTINE au mur, soulignée au 2e temps */}
        {beat === 1 && (
          <rect x="422" y="82" width="236" height="146" rx="6" fill="none" stroke="#7fd8ff" strokeWidth="3" opacity="0.8">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.6s" repeatCount="indefinite" />
          </rect>
        )}
      </g>
    </>
  );
}

export function SceneWake({ beat }) {
  return (
    <Stage defs={
      <mask id="wk-mask">
        <rect width="1000" height="560" fill="#fff" />
        <ellipse cx="500" cy="270" rx="10" ry="2" fill="#000">
          <animate attributeName="rx" values="10;180;120;760" keyTimes="0;0.3;0.42;1" dur="3.2s" fill="freeze" />
          <animate attributeName="ry" values="2;26;8;520" keyTimes="0;0.3;0.42;1" dur="3.2s" fill="freeze" />
        </ellipse>
      </mask>}>
      <CellRoom beat={beat} />
      {/* les yeux qui s'ouvrent */}
      <rect width="1000" height="560" fill="#000" mask="url(#wk-mask)" />
    </Stage>
  );
}

export function SceneTablet() {
  useEffect(() => { const t = setTimeout(playPhonePing, 700); return () => clearTimeout(t); }, []);
  const posts = [
    ["LA SURFACE EST MORTE", "depuis 40 ans, partagé 12 000 fois", false],
    ["VIDÉO · L'AIR EST TOXIQUE", "« selon des experts anonymes »", true],
    ["AUCUN OISEAU DEPUIS 40 ANS", "source : un ami d'un ami", true],
    ["BULLETIN OFFICIEL N-27", "Restez chez vous.", false],
    ["ILS NOUS CACHENT LA VÉRITÉ !!!", "partagez avant la suppression", true],
    ["LA SURFACE EST MORTE", "depuis 40 ans, partagé 12 000 fois", false],
  ];
  return (
    <Stage defs={
      <>
        <radialGradient id="tb-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f08ad0" stopOpacity="0.45" /><stop offset="100%" stopColor="#f08ad0" stopOpacity="0" /></radialGradient>
        <clipPath id="tb-scr"><rect x="378" y="82" width="244" height="296" rx="4" /></clipPath>
      </>}>
      <rect width="1000" height="560" fill="#0a0e14" />
      <rect y="360" width="1000" height="200" fill="#1a1208" />
      <rect y="356" width="1000" height="8" fill="#3a2818" />
      <ellipse cx="500" cy="230" rx="380" ry="260" fill="url(#tb-glow)"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" /></ellipse>
      {/* tasse et livres, flous, de chaque côté */}
      <g opacity="0.5"><rect x="120" y="296" width="50" height="62" fill="#5a6270" /><path d="M170 310 q22 0 22 20 q0 18 -22 18" stroke="#5a6270" strokeWidth="6" fill="none" /><rect x="800" y="270" width="26" height="88" fill="#8a3820" /><rect x="826" y="270" width="26" height="88" fill="#3a5878" /><rect x="852" y="280" width="26" height="78" fill="#5a4028" /></g>
      {/* la tablette */}
      <rect x="360" y="60" width="280" height="340" rx="20" fill="#05060a" stroke="#f08ad0" strokeWidth="5" />
      <rect x="378" y="82" width="244" height="296" rx="4" fill="#0e1218" />
      <g clipPath="url(#tb-scr)">
        <g style={{ animation: "fjFeed 6s linear infinite" }}>
          {posts.map(([titre, sous, faux], i) => (
            <g key={i} transform={`translate(386,${92 + i * 80})`}>
              <rect width="228" height="68" rx="6" fill="#161c26" stroke={faux ? "#e8742a" : "#2a3648"} strokeWidth={faux ? 1.8 : 1} />
              <circle cx="20" cy="20" r="9" fill={faux ? "#e8742a" : "#3a5878"} />
              <text x="38" y="24" fontFamily="Georgia,serif" fontSize="11.5" fontWeight="700" fill="#e8eef5">{titre.length > 26 ? titre.slice(0, 25) + "…" : titre}</text>
              <text x="14" y="50" fontFamily="Georgia,serif" fontSize="10" fontStyle="italic" fill="#8fa3bd">{sous}</text>
              {faux && <text x="214" y="58" textAnchor="end" fontSize="13" fill="#e8742a">⚠ à vérifier ?</text>}
            </g>
          ))}
        </g>
      </g>
      <circle cx="500" cy="388" r="5" fill="#2a3040" />
    </Stage>
  );
}

export function SceneVoice() {
  return (
    <Stage defs={<radialGradient id="vo-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffd890" stopOpacity="0.4" /><stop offset="100%" stopColor="#ffd890" stopOpacity="0" /></radialGradient>}>
      <rect width="1000" height="560" fill="#080a10" />
      <rect y="350" width="1000" height="210" fill="#161008" /><rect y="346" width="1000" height="8" fill="#3a2818" />
      <ellipse cx="500" cy="250" rx="340" ry="200" fill="url(#vo-glow)" />
      {/* ondes qui sortent de la radio */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d="M640 230 q40 -34 0 -68" stroke="#ffd890" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0">
          <animateTransform attributeName="transform" type="translate" values="0 0; 150 0" dur="3.2s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="3.2s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* la vieille radio */}
      <g transform="translate(500,236)">
        <rect x="-170" y="-110" width="340" height="226" rx="24" fill="#6a4a2a" stroke="#2a1a0a" strokeWidth="4" />
        <rect x="-150" y="-92" width="200" height="190" rx="12" fill="#2a1a0a" />
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1="-140" y1={-76 + i * 20} x2="40" y2={-76 + i * 20} stroke="#0a0602" strokeWidth="5" />)}
        <rect x="68" y="-84" width="86" height="38" rx="5" fill="#e8d8a8" stroke="#2a1a0a" strokeWidth="2" />
        <line x1="76" y1="-50" x2="146" y2="-50" stroke="#2a1a0a" strokeWidth="1" />
        {[84, 100, 116, 132].map((x) => <line key={x} x1={x} y1="-50" x2={x} y2="-56" stroke="#2a1a0a" />)}
        <line x1="86" y1="-84" x2="86" y2="-46" stroke="#c83020" strokeWidth="2.4">
          <animate attributeName="x1" values="86;112;98;136;92;122" dur="5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="86;112;98;136;92;122" dur="5s" repeatCount="indefinite" />
        </line>
        <circle cx="90" cy="38" r="22" fill="#2a1a0a" stroke="#c8a848" strokeWidth="2" /><line x1="90" y1="38" x2="90" y2="20" stroke="#c8a848" strokeWidth="3" />
        <circle cx="140" cy="38" r="16" fill="#2a1a0a" stroke="#c8a848" strokeWidth="2" /><line x1="140" y1="38" x2="152" y2="30" stroke="#c8a848" strokeWidth="3" />
        <path d="M-170 -110 L-210 -200" stroke="#8a94a8" strokeWidth="4" />
      </g>
      {/* fragments de voix qui se perdent dans le grésillement */}
      {[["…Al…", 330, 210], ["…m'entends ?…", 650, 190], ["…tu…", 230, 270], ["…là…", 760, 250]].map(([t, x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Georgia,serif" fontStyle="italic" fontSize="22" fill="#ffe8b0" opacity="0" style={an("fjFloat", 4200, 900 + i * 1100, "ease-in-out")}>{t}</text>
      ))}
      <g opacity="0.5">{Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={40 + i * 70} y="60" width="30" height="2" fill="#c8d4e2">
          <animate attributeName="opacity" values="0;0.8;0" dur={`${0.4 + (i % 4) * 0.3}s`} begin={`${i * 0.17}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`${40 + (i * 29) % 120};${50 + (i * 53) % 120}`} dur="1.1s" repeatCount="indefinite" />
        </rect>))}</g>
    </Stage>
  );
}
