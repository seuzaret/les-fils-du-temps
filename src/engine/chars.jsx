/* ============================================================
   MOTEUR — PERSONNAGES (tête commune, silhouettes, bustes, portraits)
   ------------------------------------------------------------
   Une seule tête pour tout le jeu. Le visage est une ellipse
   (RX 13, RY 15) ; cheveux, barbe et couvre-chefs sont construits
   sur CETTE ellipse : rien ne dépasse du contour par accident, la
   barbe affleure la mâchoire, les cheveux affleurent le crâne.

   Couches (coordonnées locales : centre du visage = 0,0) :
     HeadBack  — derrière le corps : cheveux longs, tresses, chignon,
                 capuche, voile, pans du némès…
     HeadFront — oreilles, visage, barbe, traits, mèches de devant,
                 accessoires (lunettes, boucles…), couvre-chef.

   Composants :
     Figure    — personnage en pied, origine aux pieds (≈ 125 de haut
                 debout). Poses : stand | sit | kneel | ground.
                 garment : jacket | tunic | coat | robe | dress | fur | toga |
                 kilt (torse nu + pagne) | tee (col rond) ; shortSleeves,
                 bareArms, apron, cape, back (vue de dos), arms, behind,
                 children (coordonnées de la figure, voir handPos).
     Arm       — un bras seul (gestes animés : envelopper dans un <g>
                 avec animateTransform autour de l'épaule ±19.5, -84).
     Bust      — épaules + tête, origine au centre du visage.
     Portrait  — gros plan 300×340 pour les dialogues.

   Options de tête (communes aux trois) :
     look      short | long | mid | braids | bun | sidebun | ponytail |
               curls | afro | slick | ring (couronne de chauve) | bald |
               rolls | bob
     beard     true/"full" | "short" | "goatee" | "long" | "royal" |
               "postiche" | "stubble" | "chops"   mustache : true | "handlebar"
     hat       headband | crown | nemes | leather | helm (nasal) |
               tricorne | visor | wwhelm (casque 39-45) | cap | toque |
               beret | brim | tophat | kepi | pillbox | hardhat | laurel |
               coif | keffieh | turban | flatcap | hood
     facing    front | left | right (trois-quarts : les traits tournent)
     mood      neutre | content | vexe | colere | surpris
     glasses, earrings, paint (traits d'ocre), scar, freckles, kohl, lips
   ============================================================ */

export const RX = 13, RY = 15;

/* Apparence canonique d'Al3x1a (tunique grise à part) : cheveux bruns mi-longs + chignon de côté, frange, fine cicatrice. */
export const AL3X1A_LOOK = { skin: "#d6ad8a", hair: "#4a3020", look: "sidebun", scar: true };

export const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) & 255) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11; };
export const shade = (hex, k = -0.18) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};
const F = (facing) => (facing === "left" ? -1 : facing === "right" ? 1 : 0);

/* ═══════════════════════ COUCHE ARRIÈRE ═══════════════════════ */
export function HeadBack({ look = "short", hair = "#3a2818", skin = "#e0a878", hood = false, hoodColor = "#6a5a8a", back = false, hat = null, hatColor, hatColor2, facing = "front" }) {
  const f = F(facing);
  const hc = hatColor || "#e8e4d8";
  return (
    <g>
      {(hood || hat === "hood") && <path d="M-17 4 Q-21.5 -25 0 -26.5 Q21.5 -25 17 4 L23 28 Q0 33 -23 28 Z" fill={hoodColor} stroke={shade(hoodColor, -0.25)} strokeWidth="0.7" />}
      {(hat === "coif" || hat === "keffieh") && <path d="M-17 -6 Q-20 18 -17 36 L17 36 Q20 18 17 -6 Q0 -22 -17 -6 Z" fill={hc} stroke={shade(hc, -0.2)} strokeWidth="0.6" />}
      {look === "long" && <path d="M-14.4 -7 Q-18.5 14 -14.5 40 Q0 44 14.5 40 Q18.5 14 14.4 -7 Z" fill={hair} />}
      {(look === "mid" || look === "sidebun") && <path d="M-14.4 -7 Q-17.5 8 -15 22 Q0 26 15 22 Q17.5 8 14.4 -7 Z" fill={hair} />}
      {look === "sidebun" && <circle cx={f > 0 ? -14.5 : 14.5} cy="-7" r="6.4" fill={hair} stroke={shade(hair, -0.15)} strokeWidth="0.5" />}
      {look === "ponytail" && <path d={`M${f > 0 ? -8 : 8} -12 Q${f > 0 ? -22 : 22} -6 ${f > 0 ? -17 : 17} 24 Q${f > 0 ? -13 : 13} 8 ${f > 0 ? -6 : 6} -4 Z`} fill={hair} />}
      {look === "braids" && (
        <g stroke={hair} strokeWidth="5.4" fill="none" strokeLinecap="round">
          <path d="M-12.6 1 Q-17.5 20 -13.5 42" /><path d="M12.6 1 Q17.5 20 13.5 42" />
          <path d="M-13.5 38 l0 0 M13.5 38 l0 0" stroke="#e86028" strokeWidth="6" />
        </g>
      )}
      {look === "bun" && <circle cx="0" cy="-19" r="7.5" fill={hair} stroke={shade(hair, -0.15)} strokeWidth="0.5" />}
      {look === "rolls" && <path d="M-14.4 -4 Q-17 8 -14 14 Q0 18 14 14 Q17 8 14.4 -4 Z" fill={hair} stroke={shade(hair, -0.15)} strokeWidth="0.5" />}
      {look === "bob" && <path d="M-14.8 -6 Q-17.2 4 -15.6 11 Q-12 13.4 -10.4 11 L10.4 11 Q12 13.4 15.6 11 Q17.2 4 14.8 -6 Z" fill={hair} stroke={shade(hair, -0.15)} strokeWidth="0.5" />}
      {look === "afro" && <ellipse cx="0" cy="-4" rx="20" ry="20" fill={hair} stroke={shade(hair, -0.15)} strokeWidth="0.6" />}
      {look === "curls" && (
        <g fill={hair} stroke={shade(hair, -0.12)} strokeWidth="0.6">
          {[200, 222, 244, 266, 288, 310, 332].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={(Math.cos(r) * 14.4).toFixed(1)} cy={(Math.sin(r) * 16.4).toFixed(1)} r="6.6" />;
          })}
          <circle cx="-13.6" cy="3" r="5" /><circle cx="13.6" cy="3" r="5" />
        </g>
      )}
      {back && (
        <g>
          <ellipse cx={-RX - 1} cy="2" rx="2.6" ry="4" fill={skin} stroke={shade(skin, -0.25)} strokeWidth="0.5" />
          <ellipse cx={RX + 1} cy="2" rx="2.6" ry="4" fill={skin} stroke={shade(skin, -0.25)} strokeWidth="0.5" />
          {look === "bald" || look === "ring" ? (
            <g>
              <ellipse cx="0" cy="0" rx={RX + 0.4} ry={RY + 0.4} fill={skin} stroke={shade(skin, -0.25)} strokeWidth="0.7" />
              {look === "ring" && <path d={`M${-RX - 0.6} -2 A${RX + 0.6} ${RY + 0.6} 0 0 0 ${RX + 0.6} -2 Q0 4 ${-RX - 0.6} -2 Z`} fill={hair} stroke={shade(hair, -0.15)} strokeWidth="0.5" />}
            </g>
          ) : (
            <g>
              <ellipse cx="0" cy="0" rx={RX + 0.8} ry={RY + 0.8} fill={hair} stroke={shade(hair, -0.2)} strokeWidth="0.8" />
              <path d="M-7 -10 Q-8.5 0 -6 10 M0 -12.5 L0 11 M7 -10 Q8.5 0 6 10" stroke={shade(hair, -0.2)} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
            </g>
          )}
        </g>
      )}
      {hat === "nemes" && (
        <g>
          <path d="M-14 -4 L-21 30 L-12 32 L-10 2 Z M14 -4 L21 30 L12 32 L10 2 Z" fill={hatColor || "#e8c040"} stroke="#5a4010" strokeWidth="0.6" />
        </g>
      )}
    </g>
  );
}

/* ═══════════════════════ COUCHE AVANT ═══════════════════════ */
function Beard({ kind, hair, dx }) {
  const st = shade(hair, -0.12);
  if (kind === "stubble") return <path d={`M-12.65 3 A${RX} ${RY} 0 0 0 12.65 3 Q10.6 5.6 6.4 6 Q0 3 -6.4 6 Q-10.6 5.6 -12.65 3 Z`} fill={hair} opacity="0.28" />;
  if (kind === "goatee") return <path d={`M${dx - 5} 8.6 Q${dx} 7 ${dx + 5} 8.6 Q${dx + 4.4} 15 ${dx} 16.6 Q${dx - 4.4} 15 ${dx - 5} 8.6 Z`} fill={hair} stroke={st} strokeWidth="0.35" />;
  if (kind === "chops") return <g fill={hair} stroke={st} strokeWidth="0.35"><path d="M-12.95 -1.5 A13 15 0 0 0 -9.6 10.1 Q-7.4 6 -8 2 Q-10 0.2 -12.95 -1.5 Z" /><path d="M12.95 -1.5 A13 15 0 0 1 9.6 10.1 Q7.4 6 8 2 Q10 0.2 12.95 -1.5 Z" /></g>;
  if (kind === "postiche") return <g><rect x={dx - 2.6} y="12" width="5.2" height="13" rx="2" fill="#2a2418" /><path d={`M${dx - 2.6} 15 h5.2 M${dx - 2.6} 18 h5.2 M${dx - 2.6} 21 h5.2`} stroke="#c8a848" strokeWidth="0.6" /></g>;
  const short = kind === "short";
  const top = short ? 6.5 : 3;
  const xTop = short ? 11.4 : 12.65;
  const base = <path d={`M${-xTop} ${top} A${RX} ${RY} 0 0 0 ${xTop} ${top} Q10.6 ${top + 2.6} 6.4 ${top + 3} Q0 ${top} -6.4 ${top + 3} Q-10.6 ${top + 2.6} ${-xTop} ${top} Z`} fill={hair} stroke={st} strokeWidth="0.35" />;
  if (kind === "long" || kind === "royal") {
    return (
      <g>
        <path d={`M-12.65 3 A${RX} ${RY} 0 0 0 12.65 3 Q12 14 6 26 Q${dx} 32 -6 26 Q-12 14 -12.65 3 Z`} fill={hair} stroke={st} strokeWidth="0.35" />
        <path d={`M-12.65 3 Q-10.6 5.6 -6.4 6 Q0 3 6.4 6 Q10.6 5.6 12.65 3`} fill="none" />
        {kind === "royal" && [10, 15, 20, 25].map((yy, i) => {
          const n = Math.max(2, Math.floor((22 - i * 3.4) / 4));
          return <path key={i} d={`M${-n * 2 + dx} ${yy}` + " q2 2.4 4 0".repeat(n)} stroke={shade(hair, 0.18)} strokeWidth="0.6" fill="none" />;
        })}
      </g>
    );
  }
  return base;
}

function Hat({ hat, c, c2, f }) {
  const s = shade(c, -0.25);
  switch (hat) {
    case "headband":
      return <g><path d="M-13.4 -7.6 Q0 -12.2 13.4 -7.6 L13.6 -3.8 Q0 -8.6 -13.6 -3.8 Z" fill={c} stroke={s} strokeWidth="0.4" /><path d="M13 -6.4 l7.5 3.4 l-2.6 3.8 Z" fill={c} stroke={s} strokeWidth="0.4" /></g>;
    case "crown":
      return (
        <g>
          <path d="M-11.5 -10 L-11 -20 L-6 -14 L-2.8 -22 L0 -14.5 L2.8 -22 L6 -14 L11 -20 L11.5 -10 Q0 -12.6 -11.5 -10 Z" fill={c || "#e8b830"} stroke="#7a5a10" strokeWidth="0.5" />
          <path d="M-11.6 -10 Q0 -12.8 11.6 -10 L11.8 -6.8 Q0 -9.8 -11.8 -6.8 Z" fill={shade(c || "#e8b830", -0.1)} stroke="#7a5a10" strokeWidth="0.5" />
          <circle cx="0" cy="-8.8" r="1.4" fill="#c02020" /><circle cx="-6" cy="-8.4" r="1" fill="#2060c0" /><circle cx="6" cy="-8.4" r="1" fill="#2060c0" />
        </g>
      );
    case "pillbox":
      return <g><path d="M-9 -11.6 L-9.4 -19.4 Q0 -21.6 9.4 -19.4 L9 -11.6 Q0 -9.8 -9 -11.6 Z" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-9.2 -14.4 Q0 -12.8 9.2 -14.4 L9.1 -12.4 Q0 -10.8 -9.1 -12.4 Z" fill={c2 || "#e8c040"} /></g>;
    case "circlet":
      return <g><path d="M-13.2 -8.4 Q0 -13.6 13.2 -8.4 L13.4 -6 Q0 -11.2 -13.4 -6 Z" fill={c || "#e8c050"} stroke="#7a5a10" strokeWidth="0.45" /><circle cx="0" cy="-10.6" r="1.4" fill={c2 || "#c02020"} stroke="#7a5a10" strokeWidth="0.3" /></g>;
    case "nemes": {
      const g = c || "#e8c040", b = c2 || "#2a50a0";
      return (
        <g>
          <path d="M-14.8 0 A14.8 17 0 0 1 14.8 0 L16.4 8 L13 8 Q12.6 -6.6 0 -8.6 Q-12.6 -6.6 -13 8 L-16.4 8 Z" fill={g} stroke="#5a4010" strokeWidth="0.6" />
          <clipPath id="chars-nemes-cap"><path d="M-14.8 0 A14.8 17 0 0 1 14.8 0 L16.4 8 L13 8 Q12.6 -6.6 0 -8.6 Q-12.6 -6.6 -13 8 L-16.4 8 Z" /></clipPath>
          <g clipPath="url(#chars-nemes-cap)" stroke={b} strokeWidth="1.3">
            {[-15, -12.4, -9.8, -7.2, -4.6, -2, 0.6, 3.2, 5.8].map((y) => <line key={y} x1="-17" y1={y} x2="17" y2={y} />)}
          </g>
          <path d="M-13 3 L-17 27 L-11 28 L-11 7 Z M13 3 L17 27 L11 28 L11 7 Z" fill={g} stroke="#5a4010" strokeWidth="0.5" />
          {[9, 14, 19, 24].map((y) => <path key={y} d={`M-16 ${y} L-11 ${y + 0.6} M16 ${y} L11 ${y + 0.6}`} stroke={b} strokeWidth="1.3" />)}
          <path d="M-13 -6.6 Q0 -10.6 13 -6.6 L13 -4.4 Q0 -8.4 -13 -4.4 Z" fill="#c89a20" stroke="#5a4010" strokeWidth="0.4" />
          <path d="M0 -8.6 q-1.6 -3 0 -5.4 q1.6 2.4 0 5.4 Z" fill="#c89a20" stroke="#5a4010" strokeWidth="0.4" />
        </g>
      );
    }
    case "wwhelm":   // casque d'acier à bord évasé (1939-1945)
      return (
        <g>
          <path d="M-15 -1.6 Q-15.6 -20.6 0 -21.4 Q15.6 -20.6 15 -1.6 L18.4 3.4 L11.4 1 Q0 -1.6 -11.4 1 L-18.4 3.4 Z" fill={c || "#4a5040"} stroke={s} strokeWidth="0.7" />
          <path d="M-14.6 -2 Q0 -5.4 14.6 -2" stroke={shade(c || "#4a5040", -0.3)} strokeWidth="1.2" fill="none" />
          <path d="M-8 -16 Q-12 -12 -12 -7" stroke="#fff" strokeWidth="1.2" opacity="0.25" fill="none" />
        </g>
      );
    case "visor":   // visière de celluloïd verte (télégraphiste, typographe)
      return (
        <g>
          <path d="M-13.6 -6.4 Q0 -10.6 13.6 -6.4" stroke={shade(c || "#2a6a3a", -0.2)} strokeWidth="2.2" fill="none" />
          <path d="M-14.6 -6.4 Q0 -11.4 14.6 -6.4 L16.4 -1.8 Q0 -7 -16.4 -1.8 Z" fill={c || "#2a6a3a"} opacity="0.88" stroke={s} strokeWidth="0.5" />
        </g>
      );
    case "tricorne":   // chapeau à trois cornes (XVIIIe s.), galon c2
      return (
        <g>
          <path d="M-11 -10 Q-11 -22 0 -22.6 Q11 -22 11 -10 Z" fill={shade(c || "#2c2620", -0.08)} />
          <path d="M-21.6 -11 Q-14 -25 0 -22 Q14 -25 21.6 -11 Q10 -13.6 0 -5.6 Q-10 -13.6 -21.6 -11 Z" fill={c || "#2c2620"} stroke={s} strokeWidth="0.6" />
          <path d="M-21.6 -11 Q-10 -13.6 0 -5.6 Q10 -13.6 21.6 -11" stroke={c2 || shade(c || "#2c2620", 0.25)} strokeWidth="1.3" fill="none" />
        </g>
      );
    case "helm":   // casque conique d'acier à nasal (Moyen Âge)
      return (
        <g>
          <path d="M-14.4 -3.6 Q-14.6 -14 0 -23 Q14.6 -14 14.4 -3.6 Q0 -8.4 -14.4 -3.6 Z" fill={c || "#9aa2b0"} stroke={s} strokeWidth="0.6" />
          <path d="M-14.4 -3.6 Q0 -8.4 14.4 -3.6" stroke={shade(c || "#9aa2b0", -0.3)} strokeWidth="1.8" fill="none" />
          <path d="M-5 -19 Q-9 -12 -10 -6" stroke="#fff" strokeWidth="1.2" opacity="0.35" fill="none" />
          <rect x="-1.5" y="-7" width="3" height="11" rx="1" fill={c || "#9aa2b0"} stroke={s} strokeWidth="0.5" />
        </g>
      );
    case "leather":
      return (
        <g>
          <path d="M-14.2 -2 A14.2 16.4 0 0 1 14.2 -2 Q0 -7.6 -14.2 -2 Z" fill={c || "#6a4a2a"} stroke={s} strokeWidth="0.5" />
          <path d="M-14.2 -2 Q0 -7.6 14.2 -2" stroke={shade(c || "#6a4a2a", -0.3)} strokeWidth="1.4" fill="none" />
          <path d="M0 -16.4 V-6.4" stroke={s} strokeWidth="0.8" />
          <path d="M-13.6 -2 Q-15.6 6 -12 9.4 L-10.6 2 Z M13.6 -2 Q15.6 6 12 9.4 L10.6 2 Z" fill={c || "#6a4a2a"} stroke={s} strokeWidth="0.4" />
        </g>
      );
    case "cap":
      return <g><path d="M-14.6 -5 A14.6 17.6 0 0 1 14.6 -5 Q0 -11.4 -14.6 -5 Z" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-14.6 -5 Q0 -11.4 14.6 -5 L14.4 -2.6 Q0 -8.8 -14.4 -2.6 Z" fill={shade(c, -0.15)} stroke={s} strokeWidth="0.4" /></g>;
    case "toque":
      return <g><path d="M-14 -7.6 Q-16 -22.6 -6 -24.6 Q0 -26.6 6 -24.6 Q16 -22.6 14 -7.6 Q0 -12 -14 -7.6 Z" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-14 -7.6 Q0 -12 14 -7.6 L14 -4.8 Q0 -9.2 -14 -4.8 Z" fill={c2 || shade(c, -0.2)} stroke={s} strokeWidth="0.4" /></g>;
    case "beret":
      return <g><ellipse cx={2 - f * 1} cy="-13.5" rx="15.5" ry="6.4" fill={c} stroke={s} strokeWidth="0.5" transform="rotate(-6 2 -13.5)" /><path d="M2 -20 l0.6 -2.6" stroke={s} strokeWidth="1.4" strokeLinecap="round" /></g>;
    case "brim":
      return (
        <g>
          <ellipse cx="0" cy="-10.6" rx="24" ry="4.6" fill={c} stroke={s} strokeWidth="0.5" />
          <path d="M-10.6 -11 Q-11 -24.5 0 -25.5 Q11 -24.5 10.6 -11 Q0 -9 -10.6 -11 Z" fill={shade(c, 0.04)} stroke={s} strokeWidth="0.5" />
          <path d="M-10.6 -13.8 Q0 -11.6 10.6 -13.8 L10.6 -11.4 Q0 -9.4 -10.6 -11.4 Z" fill={c2 || shade(c, -0.3)} />
        </g>
      );
    case "tophat":
      return <g><ellipse cx="0" cy="-11.4" rx="16" ry="3.4" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-9.4 -11.8 L-10 -35 Q0 -37 10 -35 L9.4 -11.8 Q0 -10.4 -9.4 -11.8 Z" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-9.6 -16 Q0 -14.6 9.6 -16 L9.5 -13 Q0 -11.6 -9.5 -13 Z" fill={c2 || "#5a1a1a"} /></g>;
    case "kepi":
      return <g><path d="M-10.4 -11.4 L-10.8 -23 Q0 -25.4 10.8 -23 L10.4 -11.4 Q0 -10 -10.4 -11.4 Z" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-10.6 -15 Q0 -13.6 10.6 -15 L10.5 -12.6 Q0 -11.2 -10.5 -12.6 Z" fill={c2 || "#e8c040"} /><path d="M-11.6 -11.4 Q0 -7 11.6 -11.4 Q0 -9.4 -11.6 -11.4 Z" fill={shade(c, -0.35)} /></g>;
    case "hardhat":
      return <g><path d="M-15 -5 A15 14 0 0 1 15 -5 Z" fill={c || "#e8b030"} stroke="#6a4a10" strokeWidth="0.6" /><rect x="-17" y="-6" width="34" height="2.6" rx="1" fill={shade(c || "#e8b030", -0.2)} /><circle cx="0" cy="-10" r="2.6" fill="#fff8d0" stroke="#6a4a10" strokeWidth="0.5" /></g>;
    case "laurel":
      return (
        <g fill={c || "#5a8a3a"} stroke={shade(c || "#5a8a3a", -0.25)} strokeWidth="0.3">
          {[200, 218, 236, 254, 286, 304, 322, 340].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <ellipse key={i} cx={(Math.cos(r) * 13.8).toFixed(1)} cy={(Math.sin(r) * 14.2 + 2).toFixed(1)} rx="3.4" ry="1.5" transform={`rotate(${a + 90} ${(Math.cos(r) * 13.8).toFixed(1)} ${(Math.sin(r) * 14.2 + 2).toFixed(1)})`} />;
          })}
        </g>
      );
    case "coif":
      return <path fillRule="evenodd" d="M-15.2 0 A15.2 18 0 0 1 15.2 0 L15 10 Q14 19 5 20 L-5 20 Q-14 19 -15 10 Z M-11 1.2 A11 13.4 0 0 0 11 1.2 A11 13.4 0 0 0 -11 1.2 Z" fill={c || "#f0ece0"} stroke={shade(c || "#f0ece0", -0.2)} strokeWidth="0.5" />;
    case "keffieh":
      return (
        <g>
          <path d="M-15.4 12 L-15.4 0 A15.4 17.6 0 0 1 15.4 0 L15.4 12 L12.4 12 L12.6 -1 Q0 -9.6 -12.6 -1 L-12.4 12 Z" fill={c || "#e2d6bc"} stroke={shade(c || "#e2d6bc", -0.2)} strokeWidth="0.5" />
          <path d="M-14.4 -8.6 Q0 -14.4 14.4 -8.6 L14.6 -5.8 Q0 -11.6 -14.6 -5.8 Z" fill={c2 || "#2a2018"} />
          <path d="M-14.4 -8.6 Q0 -14.4 14.4 -8.6" stroke={shade(c2 || "#2a2018", 0.25)} strokeWidth="0.4" fill="none" />
        </g>
      );
    case "turban":
      return <g><path d="M-15.4 -4 Q-17 -22 0 -23 Q17 -22 15.4 -4 Q0 -9.4 -15.4 -4 Z" fill={c} stroke={s} strokeWidth="0.5" /><path d="M-14.6 -9 Q0 -20 14.6 -12 M-15 -5.6 Q2 -16 15 -6.4" stroke={shade(c, -0.18)} strokeWidth="1" fill="none" /><circle cx="0" cy="-12" r="1.6" fill={c2 || "#c02020"} /></g>;
    case "flatcap":
      return <path d="M-14.2 -4.6 Q-14.4 -17.6 0 -18.4 Q12.4 -17.6 15 -8.4 L22.6 -6 Q16.4 -3.6 13 -4 Q0 -8.4 -14.2 -4.6 Z" fill={c} stroke={s} strokeWidth="0.5" />;
    default:
      return null;
  }
}

export function HeadFront({
  skin = "#e0a878", hair = "#3a2818", look = "short", beard = false, mustache = false, mood = "neutre",
  hood = false, hoodColor = "#6a5a8a", back = false, facing = "front",
  hat = null, hatColor, hatColor2, glasses = false, earrings = null, paint = false, scar = false,
  freckles = false, kohl = false, lips = null, blush = true, beardColor, wrinkles = false,
}) {
  if (back) return hat && hat !== "hood" && hat !== "coif" ? <Hat hat={hat} c={hatColor || "#5a4030"} c2={hatColor2} f={0} /> : null;
  const f = F(facing);
  const dx = f * 3.2;
  const line = shade(skin, -0.42);
  const light = lum(hair) > 190;
  const browCol = light ? "#b0a89a" : shade(hair, -0.1);
  const browW = light ? 1.15 : 1.5;
  const brows = mood === "vexe"
    ? ["M-8.4 -4.4 Q-5.2 -6.2 -2.2 -7.4", "M8.4 -4.4 Q5.2 -6.2 2.2 -7.4"]
    : mood === "colere"
    ? ["M-8.4 -7.2 Q-5.2 -6.2 -2.2 -4.4", "M8.4 -7.2 Q5.2 -6.2 2.2 -4.4"]
    : ["M-8.4 -5.6 Q-5.2 -7 -2.2 -5.8", "M8.4 -5.6 Q5.2 -7 2.2 -5.8"];
  const mouthW = f ? 0.82 : 1;
  const mouth = mood === "content" ? `M${-4.4 * mouthW} 7 Q0 11.6 ${4.4 * mouthW} 7`
    : mood === "vexe" ? `M${-3.8 * mouthW} 9.8 Q0 7.2 ${3.8 * mouthW} 9.8`
    : mood === "colere" ? `M${-3.8 * mouthW} 9.4 Q0 8 ${3.8 * mouthW} 9.4`
    : mood === "surpris" ? "M-2.2 8 Q0 12 2.2 8 Q0 7 -2.2 8"
    : `M${-3.6 * mouthW} 8.4 Q0 9.4 ${3.6 * mouthW} 8.4`;
  const eyeR = (side) => (f && side === f * -1 ? 0.72 : 1); // l'œil côté bord du visage, plus étroit
  const eyes = [-1, 1].map((side) => ({ x: side * 5.2 + dx + (f && side === -f ? f * 0.6 : 0), k: eyeR(side) }));
  const showCap = !["bald", "ring"].includes(look) && !hood && !["hood", "coif", "nemes", "keffieh"].includes(hat);
  const capHairline = look === "slick" ? "Q8 -8.6 0 -10.6 Q-8 -8.6" : look === "bob" ? "Q9 -6.2 0 -6.6 Q-9 -6.2" : "Q8 -4.6 2.6 -9.6 Q-5.6 -6.6";
  const beardKind = beard === true ? "full" : beard;
  return (
    <g>
      {/* oreilles + visage */}
      {(f <= 0) && <ellipse cx={RX} cy="1" rx="2" ry="3.2" fill={shade(skin, -0.06)} />}
      {(f >= 0) && <ellipse cx={-RX} cy="1" rx="2" ry="3.2" fill={shade(skin, -0.06)} />}
      <ellipse cx="0" cy="0" rx={RX} ry={RY} fill={skin} stroke={line} strokeWidth="0.7" />
      {blush && <><ellipse cx={-7.4 + dx} cy="4.6" rx="3" ry="1.8" fill="#e06a5a" opacity="0.16" /><ellipse cx={7.4 + dx} cy="4.6" rx="3" ry="1.8" fill="#e06a5a" opacity="0.16" /></>}
      {freckles && [[-8, 3], [-6.4, 4.6], [-9, 5.2], [6.4, 3.4], [8, 4.8], [9.2, 3]].map(([x, y], i) => <circle key={i} cx={x + dx} cy={y} r="0.45" fill={shade(skin, -0.3)} />)}
      {paint === "dots" && [-6, -3, 0, 3, 6].map((x, i) => <circle key={i} cx={x + dx} cy={-10 + Math.abs(x) * 0.25} r="0.7" fill="#b5451f" opacity="0.75" />)}
      {paint && paint !== "dots" && <path d={`M${-11 + dx} 3.2 l4.4 -0.8 M${-10.8 + dx} 5.6 l3.8 -0.6`} stroke="#b5451f" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />}
      {wrinkles && <path d={`M${-5 + dx} -9.6 Q${dx} -10.6 ${5 + dx} -9.6 M${-4 + dx} -8 Q${dx} -8.8 ${4 + dx} -8 M${-9.4 + dx} -0.4 l-1.4 0.8 M${9.4 + dx} -0.4 l1.4 0.8 M${-4 + dx} 6.2 q-1 1.4 -0.6 2.8 M${4 + dx} 6.2 q1 1.4 0.6 2.8`} stroke={shade(skin, -0.28)} strokeWidth="0.45" fill="none" strokeLinecap="round" />}
      {scar && <path d={`M${7.6 + dx} 1.6 l1.6 3.4`} stroke={shade(skin, -0.32)} strokeWidth="0.45" strokeLinecap="round" />}
      {/* barbe : région basse de la MÊME ellipse */}
      {beardKind && <Beard kind={beardKind} hair={beardColor || hair} dx={dx} />}
      {(mustache || (beardKind && !["goatee", "postiche", "stubble", "chops"].includes(beardKind))) && (
        mustache === "handlebar"
          ? <path d={`M${dx} 5.4 Q${dx - 3} 4 ${dx - 6.4} 6.4 Q${dx - 8.4} 7 ${dx - 8} 4.8 M${dx} 5.4 Q${dx + 3} 4 ${dx + 6.4} 6.4 Q${dx + 8.4} 7 ${dx + 8} 4.8`} stroke={beardColor || hair} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          : <path d={`M${dx - 5} 6.2 Q${dx - 2} 4.2 ${dx} 5.2 Q${dx + 2} 4.2 ${dx + 5} 6.2 Q${dx + 2} 6.8 ${dx} 6 Q${dx - 2} 6.8 ${dx - 5} 6.2 Z`} fill={beardColor || hair} stroke={shade(beardColor || hair, -0.2)} strokeWidth="0.4" />
      )}
      {/* traits */}
      <path d={brows[0]} transform={`translate(${dx},0)`} stroke={browCol} strokeWidth={browW} fill="none" strokeLinecap="round" />
      <path d={brows[1]} transform={`translate(${dx},0)`} stroke={browCol} strokeWidth={browW} fill="none" strokeLinecap="round" />
      {eyes.map((e, i) => (
        <g key={i}>
          {kohl && <path d={`M${e.x - 2.6 * e.k} -1.4 Q${e.x} -3.8 ${e.x + 2.6 * e.k} -1.4 l${i ? 1.6 : -1.6} -0.8`} stroke="#1a1008" strokeWidth="0.7" fill="none" />}
          <ellipse cx={e.x} cy="-1.4" rx={1.7 * e.k} ry={mood === "content" ? 1.0 : 1.6} fill="#1a1008" />
          <circle cx={e.x + 0.6} cy="-2" r="0.55" fill="#fff" opacity="0.8" />
        </g>
      ))}
      {f
        ? <path d={`M${dx} -1 L${dx + f * 2.8} 3.6 Q${dx + f * 0.4} 4.8 ${dx - f * 0.8} 4.2`} stroke={line} strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M0.4 -1 Q2.4 3.2 0 4.4" stroke={line} strokeWidth="0.9" fill="none" strokeLinecap="round" />}
      <path d={mouth} transform={`translate(${dx * 0.8},0)`} stroke={beardKind && !["goatee", "stubble"].includes(beardKind) ? "#7a3a28" : "#8a3c2a"} strokeWidth="1.3"
        fill={mood === "content" || mood === "surpris" ? "#7a2a22" : lips ? lips : "none"} strokeLinecap="round" />
      {lips && mood !== "content" && <path d={mouth} transform={`translate(${dx * 0.8},0)`} stroke={lips} strokeWidth="2" fill="none" strokeLinecap="round" />}
      {/* cheveux de devant : un arc de l'ellipse du crâne */}
      {showCap && (
        <path d={`M${-RX - 0.3} -1.8 A${RX + 0.3} ${RY + 0.7} 0 0 1 ${RX + 0.3} -1.8 ${capHairline} ${-RX - 0.3} -1.8 Z`} fill={hair} stroke={shade(hair, -0.1)} strokeWidth="0.35" />
      )}
      {look === "rolls" && showCap && (
        <g fill={hair} stroke={shade(hair, -0.2)} strokeWidth="0.45">
          <ellipse cx="-6.2" cy="-12.6" rx="6.2" ry="4.2" transform="rotate(-14 -6.2 -12.6)" /><ellipse cx="6.2" cy="-12.6" rx="6.2" ry="4.2" transform="rotate(14 6.2 -12.6)" />
          <path d="M-9 -12.6 q3 -1.6 6 0 M3 -12.6 q3 -1.6 6 0" fill="none" stroke={shade(hair, -0.25)} />
        </g>
      )}
      {/* trois-quarts : l'arrière du crâne garde ses cheveux */}
      {showCap && f !== 0 && (() => { const sd = -f; return <path d={`M${sd * 2} -14.9 A${RX} ${RY} 0 0 ${sd > 0 ? 1 : 0} ${sd * 12.7} 3.2 Q${sd * 8} 1 ${sd * 6.4} -5 Q${sd * 5} -11 ${sd * 2} -14.9 Z`} fill={hair} />; })()}
      {look === "ring" && (
        <g fill={hair}>
          <path d={`M${-RX} -5.6 A${RX} ${RY} 0 0 0 -12.4 4.4 Q-10.4 1 -11 -5 Z`} /><path d={`M${RX} -5.6 A${RX} ${RY} 0 0 1 12.4 4.4 Q10.4 1 11 -5 Z`} />
        </g>
      )}
      {look === "bald" || look === "ring" ? <path d="M-6 -12.6 Q0 -14.6 6 -12.6" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.25" strokeLinecap="round" /> : null}
      {/* capuche : bord autour du visage + frange */}
      {(hood || hat === "hood") && (
        <g>
          <path d={`M${-RX - 0.4} -1 A${RX + 0.4} ${RY + 1.2} 0 0 1 ${RX + 0.4} -1 Q9 -6.4 0 -7.4 Q-9 -6.4 ${-RX - 0.4} -1 Z`} fill={hoodColor} stroke={shade(hoodColor, -0.25)} strokeWidth="0.7" />
          <path d="M-9.4 -6.6 Q-3 -9.4 1 -7.6 Q5 -9.2 9.4 -6.4 Q4 -4.4 0 -5.6 Q-5 -4.2 -9.4 -6.6 Z" fill={hair} />
          <path d={`M${-RX - 0.4} -1 Q${-RX - 1.8} 9 -11 16 M${RX + 0.4} -1 Q${RX + 1.8} 9 11 16`} stroke={hoodColor} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </g>
      )}
      {glasses && (
        <g stroke={glasses === true ? "#3a3028" : glasses} strokeWidth="0.8" fill="#dff0ff" fillOpacity="0.18">
          <circle cx={eyes[0].x} cy="-1.4" r="3.4" /><circle cx={eyes[1].x} cy="-1.4" r="3.4" />
          <path d={`M${eyes[0].x + 3.4} -1.8 Q${dx} -3 ${eyes[1].x - 3.4} -1.8`} fill="none" />
        </g>
      )}
      {earrings && f <= 0 && <circle cx={RX + 0.4} cy="4.6" r="1.3" fill={earrings === true ? "#e8c050" : earrings} />}
      {earrings && f >= 0 && <circle cx={-RX - 0.4} cy="4.6" r="1.3" fill={earrings === true ? "#e8c050" : earrings} />}
      {hat && hat !== "hood" && <Hat hat={hat} c={hatColor || "#5a4030"} c2={hatColor2} f={f} />}
    </g>
  );
}

/* tête complète (sans corps entre les deux couches) */
export function Head(props) {
  return <g><HeadBack {...props} /><HeadFront {...props} /></g>;
}

/* ═══════════════════════ SILHOUETTE EN PIED ═══════════════════════ */
/* hemRel : ourlet sous la hanche ; w : demi-largeur à l'ourlet */
const GARMENT = {
  jacket: { hem: 1, w: 20.5 }, tunic: { hem: 15, w: 23.5 }, coat: { hem: 28, w: 25 },
  robe: { hem: 46, w: 27 }, dress: { hem: 34, w: 30 }, fur: { hem: 18, w: 25 }, toga: { hem: 32, w: 25 },
  kilt: { hem: 22, w: 23 },   // torse nu + pagne (coat = couleur du pagne)
  tee: { hem: 2, w: 21 },     // t-shirt / pull : col rond, sans boutonnage
};
const HIP = { stand: -48, sit: -30, kneel: -26, ground: -16 };

export function Arm({ side, a1, a2, coat, skin, sy = -84, bare = false, short = false }) {
  const sx = side * 19.5, L1 = 19, L2 = 18;
  const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const ex = sx + side * Math.sin(r1) * L1, ey = sy + Math.cos(r1) * L1;
  const hx = ex + side * Math.sin(r2) * L2, hy = ey + Math.cos(r2) * L2;
  const d = `M${sx} ${sy} L${ex.toFixed(1)} ${ey.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}`;
  const col = bare || short ? skin : coat;
  // manche courte : bras nu, et seulement le haut du bras couvert
  const sl = `M${sx} ${sy} L${(sx + side * Math.sin(r1) * L1 * 0.6).toFixed(1)} ${(sy + Math.cos(r1) * L1 * 0.6).toFixed(1)}`;
  return (
    <g>
      <path d={d} stroke={shade(col, -0.28)} strokeWidth={bare || short ? 8 : 9.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={col} strokeWidth={bare || short ? 6.6 : 8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {short && !bare && <path d={sl} stroke={shade(coat, -0.28)} strokeWidth="10.4" fill="none" strokeLinecap="round" />}
      {short && !bare && <path d={sl} stroke={coat} strokeWidth="8.8" fill="none" strokeLinecap="round" />}
      <circle cx={hx.toFixed(1)} cy={(hy + 2.4).toFixed(1)} r="4.4" fill={skin} stroke={shade(skin, -0.3)} strokeWidth="0.6" />
    </g>
  );
}

/* Position des mains (pour y accrocher un objet) — mêmes calculs que Arm. */
export function handPos({ side, a1, a2, pose = "stand" }) {
  const dy = HIP[pose] - HIP.stand;
  const sx = side * 19.5, sy = -84 + dy, r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const ex = sx + side * Math.sin(r1) * 19, ey = sy + Math.cos(r1) * 19;
  return { x: ex + side * Math.sin(r2) * 18, y: ey + Math.cos(r2) * 18 + 2.4 };
}

/* arms : [{ a1, a2 }, { a1, a2 }] — angles depuis la verticale (0 = bras le long du corps),
   positifs = vers l'extérieur, 90 = horizontal, 180 = levé. Le 1er bras est à gauche de l'écran. */
export function Figure(props) {
  const {
    x = 0, y = 0, s = 1, pose = "stand",
    skin = "#e0a878", coat = "#3a80c8", coat2, trim, pants = "#3a2818", shoes = "#1a1410", garment = "jacket",
    back = false, cane = false, stride = 0, apron = null, cape = null, bareArms = false, shortSleeves = false, belt = true,
    arms = [{ a1: 9, a2: 6 }, { a1: 9, a2: 6 }], children, behind,
  } = props;
  const g = GARMENT[garment] || GARMENT.jacket;
  const kilt = garment === "kilt";
  const tee = garment === "tee";
  const hip = HIP[pose] ?? HIP.stand;
  const dy = hip - HIP.stand;            // tout le haut du corps descend de dy
  const coatDark = shade(coat, -0.22);
  const top = -92 + dy;
  const hemY = pose === "stand" ? hip + g.hem : Math.min(hip + g.hem, -3);
  const sh = (v) => v + dy;
  const torso = `M-21.5 ${sh(-86)} Q-21.5 ${sh(-91.5)} -13 ${top} L-4.8 ${sh(-91.4)} L0 ${sh(-87.6)} L4.8 ${sh(-91.4)} L13 ${top} Q21.5 ${sh(-91.5)} 21.5 ${sh(-86)} L20 ${hip - 2} L${g.w} ${hemY} Q0 ${hemY + 3.4} ${-g.w} ${hemY} L-20 ${hip - 2} Z`;
  const furHem = garment === "fur" ? `M${-g.w} ${hemY} l4 5 l4 -4 l5 6 l5 -5 l5 6 l5 -5 l5 5 l4 -4 l${2 * g.w - 37} 4 L${g.w} ${hemY} Z` : null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx={pose === "ground" ? 34 : 27} ry="5" fill="#000" opacity="0.4" />
      {behind}
      <g transform={`translate(0,${-106 + dy})`}><HeadBack {...props} /></g>
      {cape && <path d={`M-21 ${sh(-88)} Q-30 ${sh(-40)} -30 ${Math.min(sh(-14), -2)} L30 ${Math.min(sh(-14), -2)} Q30 ${sh(-40)} 21 ${sh(-88)} Z`} fill={cape} stroke={shade(cape, -0.25)} strokeWidth="0.8" />}
      {/* jambes selon la pose */}
      {pose === "stand" && [-1, 1].map((k) => (
        <g key={k} transform={`rotate(${k * stride} 0 -48)`}>
          <rect x={k < 0 ? -10.4 : 1.4} y="-50" width="9" height="46" rx="3.2" fill={pants} stroke={shade(pants, -0.2)} strokeWidth="0.6" />
          <ellipse cx={k * 5.9} cy="-2" rx="6.4" ry="3.3" fill={shoes} />
        </g>
      ))}
      {pose === "sit" && [-1, 1].map((k) => (
        <g key={k}>
          <rect x={k < 0 ? -12 : 1} y={hip - 2} width="11" height="10" rx="4" fill={pants} stroke={shade(pants, -0.2)} strokeWidth="0.6" />
          <rect x={k < 0 ? -10.6 : 1.6} y={hip + 4} width="9" height={-hip - 7} rx="3" fill={shade(pants, -0.06)} stroke={shade(pants, -0.2)} strokeWidth="0.6" />
          <ellipse cx={k * 6.2} cy="-2" rx="6.4" ry="3.3" fill={shoes} />
        </g>
      ))}
      {pose === "kneel" && [-1, 1].map((k) => (
        <g key={k}>
          <rect x={k < 0 ? -11.4 : 1.4} y={hip - 2} width="10" height={-hip - 1} rx="4" fill={pants} stroke={shade(pants, -0.2)} strokeWidth="0.6" />
          <ellipse cx={k * 6.4} cy="-1.6" rx="6" ry="3" fill={shade(pants, -0.15)} />
        </g>
      ))}
      {pose === "ground" && (
        <g>
          <path d={`M-30 -2 Q-32 ${hip} -14 ${hip - 2} L14 ${hip - 2} Q32 ${hip} 30 -2 Q0 4 -30 -2 Z`} fill={pants} stroke={shade(pants, -0.2)} strokeWidth="0.6" />
          <path d="M-12 -6 Q0 -10 12 -6" stroke={shade(pants, -0.25)} strokeWidth="1" fill="none" />
          <ellipse cx="-22" cy="-3" rx="6" ry="3" fill={shoes} /><ellipse cx="22" cy="-3" rx="6" ry="3" fill={shoes} />
        </g>
      )}
      {/* cou */}
      <rect x="-4.6" y={sh(-93)} width="9.2" height="10" rx="2" fill={shade(skin, -0.1)} />
      {/* tronc */}
      <path d={torso} fill={kilt ? skin : coat} stroke={kilt ? shade(skin, -0.3) : coatDark} strokeWidth="0.9" strokeLinejoin="round" />
      {kilt && (
        <g>
          <path d={`M-20.4 ${hip - 5} L20.4 ${hip - 5} L${g.w} ${hemY} Q0 ${hemY + 3.4} ${-g.w} ${hemY} Z`} fill={coat} stroke={coatDark} strokeWidth="0.8" />
          <path d={`M-12 ${hip - 3} L-13.4 ${hemY} M-5 ${hip - 3} L-5.6 ${hemY + 1.6} M5 ${hip - 3} L5.6 ${hemY + 1.6} M12 ${hip - 3} L13.4 ${hemY}`} stroke={coatDark} strokeWidth="0.6" opacity="0.6" />
        </g>
      )}
      {furHem && <path d={furHem} fill={coat} stroke={coatDark} strokeWidth="0.8" />}
      {garment === "fur" && <path d={`M-14 ${sh(-76)} q5 -3 9 0 M4 ${sh(-70)} q5 -3 9 0 M-10 ${sh(-60)} q5 -3 9 0 M6 ${sh(-54)} q5 -3 9 0`} stroke={coatDark} strokeWidth="1.1" fill="none" opacity="0.6" />}
      {garment === "toga" && <path d={`M-21 ${sh(-86)} Q-6 ${sh(-80)} 20 ${hip - 4} L20 ${hip + 8} Q-4 ${sh(-62)} -21 ${sh(-74)} Z`} fill={coat2 || shade(coat, 0.1)} stroke={coatDark} strokeWidth="0.6" />}
      {coat2 && garment === "jacket" && <path d={`M-4.8 ${sh(-91.4)} L0 ${sh(-87.6)} L4.8 ${sh(-91.4)} L7 ${hip - 2} L-7 ${hip - 2} Z`} fill={coat2} stroke={coatDark} strokeWidth="0.6" />}
      {apron && <path d={`M-12 ${sh(-80)} L12 ${sh(-80)} L14 ${hemY - 1} Q0 ${hemY + 1} -14 ${hemY - 1} Z`} fill={apron} stroke={shade(apron, -0.25)} strokeWidth="0.7" />}
      {!kilt && !tee && <path d={`M-4.8 ${sh(-91.4)} L0 ${sh(-87.6)} L4.8 ${sh(-91.4)}`} fill={skin} stroke={shade(skin, -0.3)} strokeWidth="0.6" />}
      {tee && <path d={`M-5.6 ${sh(-91.6)} Q0 ${sh(-86.2)} 5.6 ${sh(-91.6)} Z`} fill={skin} stroke={coatDark} strokeWidth="1.1" />}
      {belt && <path d={`M-20 ${hip - 2} Q0 ${hip + 1} 20 ${hip - 2}`} stroke={trim || coatDark} strokeWidth={trim ? 2.4 : 1.8} fill="none" />}
      {!apron && garment !== "toga" && !kilt && !tee && <path d={`M0 ${sh(-87.6)} L0 ${hip - 4}`} stroke={coatDark} strokeWidth="0.7" opacity="0.55" />}
      {arms.map((a, i) => <Arm key={i} side={i ? 1 : -1} a1={a.a1} a2={a.a2} coat={coat} skin={skin} sy={sh(-84)} bare={bareArms || kilt} short={shortSleeves} />)}
      {cane && <path d={`M30 ${sh(-48)} L35 -1`} stroke="#6a4a2a" strokeWidth="3.6" strokeLinecap="round" />}
      <g transform={`translate(0,${-106 + dy})`}><HeadFront {...props} /></g>
      {children}
    </g>
  );
}

/* ═══════════════════════ BUSTE ═══════════════════════ */
export function Bust(props) {
  const { x = 0, y = 0, s = 1.9, skin = "#e0a878", cloth = "#3a5878", collar = "v", children } = props;
  const dark = shade(cloth, -0.25);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <HeadBack {...props} />
      <path d="M-33 52 Q-33 22 -11 18 L11 18 Q33 22 33 52 Z" fill={cloth} stroke={dark} strokeWidth="0.9" />
      <rect x="-4.8" y="11" width="9.6" height="10" rx="2" fill={shade(skin, -0.1)} />
      {collar === "v" && <><path d="M-10 18 L0 25 L10 18" fill={skin} stroke={shade(skin, -0.3)} strokeWidth="0.7" /><path d="M-10 18 Q0 27 10 18" stroke={dark} strokeWidth="1.2" fill="none" /></>}
      {collar === "round" && <path d="M-9 18 Q0 23 9 18" stroke={dark} strokeWidth="1.4" fill={skin} />}
      {collar === "high" && <path d="M-7 13 L7 13 L9 19 Q0 21 -9 19 Z" fill={shade(cloth, 0.08)} stroke={dark} strokeWidth="0.7" />}
      {children}
      <HeadFront {...props} />
    </g>
  );
}

/* ═══════════════════════ PORTRAIT (dialogues, 300×340) ═══════════════════════
   bg / halo : fond ; cloth/cloth2 : vêtement ; collar : v | round | high | shirt | none
   costume   : éléments dessinés sur le buste (colliers, motifs…) — coordonnées du portrait
   over      : éléments par-dessus la tête (plume, objet tenu…) */
export function Portrait(props) {
  const { bg = "#20262f", halo = "#ffe4a8", cloth = "#5a6a80", cloth2, collar = "v", costume, over, uid = "p" } = props;
  const dark = shade(cloth, -0.25);
  return (
    <svg viewBox="0 0 300 340" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor={halo} stopOpacity="0.45" /><stop offset="60%" stopColor={halo} stopOpacity="0.12" /><stop offset="100%" stopColor={halo} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-cloth`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={shade(cloth, 0.06)} /><stop offset="100%" stopColor={shade(cloth, -0.12)} /></linearGradient>
      </defs>
      <rect width="300" height="340" fill={bg} />
      <circle cx="150" cy="138" r="130" fill={`url(#${uid}-halo)`} />
      <g transform="translate(150,128) scale(4.7)"><HeadBack {...props} /></g>
      {/* buste */}
      <path d="M40 340 Q42 262 96 240 Q122 230 150 230 Q178 230 204 240 Q258 262 260 340 Z" fill={`url(#${uid}-cloth)`} stroke={dark} strokeWidth="2" />
      <path d="M130 186 L170 186 L172 236 Q150 246 128 236 Z" fill={shade(props.skin || "#e0a878", -0.1)} />
      {collar === "v" && <path d="M112 236 L150 274 L188 236 Q170 230 150 230 Q130 230 112 236 Z" fill={cloth2 || shade(props.skin || "#e0a878", -0.08)} stroke={dark} strokeWidth="1.6" />}
      {collar === "round" && <path d="M116 236 Q150 262 184 236" stroke={dark} strokeWidth="3" fill={shade(props.skin || "#e0a878", -0.08)} />}
      {collar === "high" && <path d="M126 210 L174 210 L184 240 Q150 250 116 240 Z" fill={cloth2 || shade(cloth, 0.08)} stroke={dark} strokeWidth="1.6" />}
      {collar === "shirt" && (
        <g>
          <path d="M120 236 L150 276 L180 236 Q166 230 150 230 Q134 230 120 236 Z" fill={cloth2 || "#f0ece0"} stroke={dark} strokeWidth="1.4" />
          <path d="M150 238 L130 228 L136 252 Z M150 238 L170 228 L164 252 Z" fill={cloth2 || "#f0ece0"} stroke={shade(cloth2 || "#f0ece0", -0.3)} strokeWidth="1.2" />
        </g>
      )}
      {costume}
      <g transform="translate(150,128) scale(4.7)"><HeadFront {...props} /></g>
      {over}
    </svg>
  );
}
