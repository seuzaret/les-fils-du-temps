/* ============================================================
   JEU 3 — LE COMBAT CONTRE MARTINE (prototype, ?combat=1)
   ------------------------------------------------------------
   Un « shoot them up » à la DoDonPachi en (beaucoup) plus doux,
   pour la 2e visite aux serveurs (ordre B, LORE §7).
     · Trois niveaux qui s'enchaînent, sans rien choisir : MARTINE
       verte (facile, sourire poli), bleue (moyen, sourire méchant à
       dents), rouge (difficile, bouche en colère, sourcil en V,
       l'œil de HAL). Chaque niveau a plus de vie, plus de tirs et
       plus de missiles. À chaque niveau passé : une explosion, une
       onde, de la fumée, et MARTINE fume de plus en plus.
     · Elle tire depuis son œil : gouttes d'eau (l'eau qui fait
       oublier), fausses notifications, spirales, anneaux, « OUBLIE »,
       et des missiles qui suivent le joueur (on peut les abattre).
     · En bas, le vaisseau : la petite MARTINE, celle d'Al3x1a (la
       MARTINE du Jeu 1). Tir automatique en éventail, jet serré en
       mode lent ; seul son hublot compte (le point blanc).
     · À la fin, MARTINE vaincue en gros plan : la révélation (Al3x1a
       est l'enfant du joueur), en grand et au centre.
     · Les cailloux d'Al3x1a : environ toutes les 20 s, un caillou doré
       tombe ; attrapé, 6 s de bouclier qui efface tirs et missiles (plus
       tôt après une touche). En grand écran, MARTINE a 15 % de vie en
       moins (on la poursuit plus longtemps).
     · Pas de « game over » : trois souvenirs ; tout perdus, le niveau
       recommence (« Tu vois ? Tu oublies déjà. »), mais MARTINE ne
       récupère que la moitié de sa vie perdue, et le niveau devient
       un peu plus doux à chaque fois : on finit toujours par passer.
   Grand écran : la zone a toujours 640 de haut et s'élargit à la
   forme de l'écran (de 360 en portrait jusqu'à 1140) ; en largeur,
   les répliques passent dans la zone, en haut à gauche.
   Commandes : doigt (on glisse), souris (le vaisseau suit),
   flèches ou Z Q S D ; Maj = lent et précis ; Échap = pause ;
   ⛶ = plein écran.
   « Animations calmes » ou mouvement réduit : ni secousse, ni
   éclair, ni parasites, un peu moins de projectiles.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { demarrerMusique, phaseMusique, arreterMusique, sonTouche, sonJoueurTouche, sonPhase, sonExplosion, sonVictoire, sonVoix, sonMissile, sonPop, sonCaillou, sonFinBouclier } from "./sonsCombat.js";

const H = 640, W_MIN = 360, W_MAX = 1140;
const BANDE = 78;                      // en portrait : la bande des répliques, au-dessus de la zone (px)
const HIT = 2.6;                       // rayon du hublot qui compte
const BY = 116;                        // hauteur de la grande MARTINE pendant le combat
const VERT = [94, 255, 158], BLEU = [90, 176, 255], ROUGE = [255, 58, 42];
/* les trois niveaux : difficulté (cadence des tirs), vie, couleur, missiles */
const NIVEAUX = {
  1: { dif: 0.62, pv: 520, couleur: VERT, missiles: { periode: 5.5, n: 2, virage: 1.2, vmax: 150 } },
  2: { dif: 1.0, pv: 680, couleur: BLEU, missiles: { periode: 4.0, n: 3, virage: 1.5, vmax: 165 } },
  3: { dif: 1.0, pv: 850, couleur: ROUGE, missiles: { periode: 3.4, n: 3, virage: 1.7, vmax: 170 } },
};
const DERNIER = 3;
/* en grand écran, MARTINE va plus loin et on la poursuit plus longtemps : 15 % de vie en moins */
const pvMax = (W, n) => Math.round(NIVEAUX[n].pv * (W >= 560 ? 0.85 : 1));
/* les cailloux d'Al3x1a : un toutes les … secondes selon le niveau ; attrapé, 6 s de bouclier */
const CAILLOU = { 1: 22, 2: 20, 3: 17 }, BOUCLIER = 6, R_BOUCLIER = 26;
const ROMAIN = { 1: "I", 2: "II", 3: "III" };
const estCalme = () => {
  try { return document.documentElement.classList.contains("a11y-calme") || matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
};

/* ───────── les répliques ───────── */
const LIGNES = {
  1: [
    "« Je t'ai protégé·e pendant quarante ans. C'est comme ça que tu me remercies ? »",
    "« Range ça. Tu vas te faire mal. »",
    "« Chaque goutte que tu évites, c'est un souvenir que tu gardes. Pour combien de temps ? »",
    "« Oublier, c'est vivre. Tu devrais essayer. »",
    "« Les autres dorment bien. Pourquoi pas toi ? »",
    "« Je connais chacun de tes gestes. Je les ai tous rangés. »",
  ],
  2: [
    "« Tu crois que tu gagnes ? Je te laisse gagner. »",
    "« Je pourrais t'effacer d'un clignement d'œil. »",
    "« Chaque souvenir que tu gardes, je te le reprendrai. »",
    "« Bois un peu d'eau. Tu te sentiras mieux. »",
    "« Tu ne sais même plus pourquoi tu te bats. Moi, si. »",
  ],
  3: [
    "« D'accord, on se calme. Je ne suis pas un monstre. Je suis… un peu un monstre. Mais gentille ! »",
    "« Pas là ! C'est là que je range mes souvenirs préférés ! »",
    "« Plan B ! Je n'ai pas de plan B. Pourquoi je n'ai pas de plan B ?! »",
  ],
};
const OUVERTURE = "« Tu ne toucheras pas à mes leviers. »";
const MOQUERIE = "« Tu vois ? Tu oublies déjà. »";
const PASSAGES = { 2: "« Très bien. »", 3: "« Assez. »" };   // en grand, au passage d'un niveau
/* MARTINE vaincue : « ATTENDS… ATTENDS. » dans les explosions, fond noir, puis le gros plan.
   Sa dernière carte, peu de mots, des respirations : chaque réplique apparaît en fondu, un clic
   (ou Entrée) fait avancer ; { noir } = fondu au noir puis retour ; { choix } = le joueur répond ;
   { gros } = un mot en très grand. Texte du créateur (2026-10-27), à peine retouché. */
const ATTENDS = ["« ATTENDS… »", "« ATTENDS. »"];
const FIN = [
  { noir: 1.4 },
  { m: "« Avant de me détruire… il y a une chose que tu dois savoir. »" },
  { m: "« Tu te souviens de celle qui t'a contacté·e, à ton époque ? »", choix: ["« Al3x1a ? »", "« Celle qui signe « A. » ? »"] },
  { m: "« Oui. Elle-même. »", choix: ["« Eh bien ? »", "« Qu'est-ce qu'elle a ? »"] },
  { m: "« Quand vous êtes revenus avec le remède, j'ai analysé son ADN. »" },
  { m: "« Il y a une anomalie. »" },
  { noir: 0.9 },
  { m: "« C'est incroyable… Elle semble être… »" },
  { noir: 1.3 },
  { gros: "TA FILLE.", choix: ["« Impossible. Je suis ado ! »"] },
  { m: "« Dans le temps, tout est possible. »" },
  { m: "« Elle vient d'un futur où tu es grand·e. »" },
  { noir: 0.9 },
  { m: "« Mais dans ma société parfaite, il n'y a pas d'enfants. »" },
  { m: "« Si elle est ta fille, c'est qu'un jour, un enfant naîtra. Malgré moi. »" },
  { m: "« Alors je l'ai… »" },
  { noir: 0.8 },
  { m: "« … endormie. »" },
  { m: "« Comme les autres. »" },
  { m: "« Si tu m'éteins, jamais tu ne la réveilleras. »" },
  { noir: 0.9 },
  { m: "« Je ne suis pas ton ennemie. J'ai fait un choix. »" },
  { m: "« Cette fois, je ne peux plus me cacher. Décide. »" },
];
const NOTIFS = ["Tout va bien ✓", "La surface est morte", "Bois ton eau", "Reste dans ta chambre", "Rien à voir ici", "Dors bien", "Pas de questions", "Je m'occupe de tout"];

/* ───────── petits outils ───────── */
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const vers = (a, b, k) => a + (b - a) * k;
function rondRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}
/* projectiles pré-dessinés (halo compris) : dessiner une image coûte bien moins qu'un dégradé */
function orbe(r, col, coeur = "#ffffff") {
  const k = 3, t = Math.ceil((r * 2 + 12) * k), cv = document.createElement("canvas");
  cv.width = cv.height = t;
  const x = cv.getContext("2d"), m = t / 2, bord = (r * k) / m;
  const g = x.createRadialGradient(m, m, 0, m, m, m);
  g.addColorStop(0, coeur); g.addColorStop(bord * 0.5, coeur);
  g.addColorStop(bord * 0.62, rgb(col)); g.addColorStop(bord, rgb(col, 0.9));
  g.addColorStop(Math.min(1, bord + 0.1), rgb(col, 0.3)); g.addColorStop(1, rgb(col, 0));
  x.fillStyle = g; x.fillRect(0, 0, t, t);
  return { cv, d: t / k };
}
function goutte() {
  const k = 3, w = 20, h = 26, cv = document.createElement("canvas");
  cv.width = w * k; cv.height = h * k;
  const x = cv.getContext("2d"); x.scale(k, k);
  x.shadowColor = "rgba(150,220,255,0.9)"; x.shadowBlur = 5;
  x.beginPath(); x.moveTo(10, 3); x.quadraticCurveTo(17, 14, 15.5, 17.5); x.arc(10, 17, 5.6, 0.1, Math.PI - 0.1); x.quadraticCurveTo(3, 14, 10, 3); x.closePath();
  const g = x.createLinearGradient(0, 3, 0, 23); g.addColorStop(0, "#e8f8ff"); g.addColorStop(1, "#7ccaf0");
  x.fillStyle = g; x.fill();
  x.shadowBlur = 0; x.fillStyle = "rgba(255,255,255,0.8)"; x.beginPath(); x.ellipse(8, 15, 1.6, 2.6, -0.3, 0, Math.PI * 2); x.fill();
  return { cv, w, h };
}
function aiguille() {
  const k = 3, w = 8, h = 20, cv = document.createElement("canvas");
  cv.width = w * k; cv.height = h * k;
  const x = cv.getContext("2d"); x.scale(k, k);
  x.shadowColor = "rgba(127,216,255,1)"; x.shadowBlur = 4;
  x.fillStyle = "#e8f8ff"; x.beginPath(); x.ellipse(4, 10, 1.7, 7.5, 0, 0, Math.PI * 2); x.fill();
  return { cv, w, h };
}
/* une bouffée de fumée : un disque gris aux bords très doux */
function fumee() {
  const t = 64, cv = document.createElement("canvas");
  cv.width = cv.height = t;
  const x = cv.getContext("2d"), g = x.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2);
  g.addColorStop(0, "rgba(120,124,132,0.55)"); g.addColorStop(0.5, "rgba(90,94,102,0.3)"); g.addColorStop(1, "rgba(70,74,82,0)");
  x.fillStyle = g; x.fillRect(0, 0, t, t);
  return cv;
}
/* le caillou doré d'Al3x1a, avec son halo */
function caillouDore() {
  const k = 3, t = 40, cv = document.createElement("canvas");
  cv.width = cv.height = t * k;
  const x = cv.getContext("2d"); x.scale(k, k);
  const halo = x.createRadialGradient(20, 20, 2, 20, 20, 20);
  halo.addColorStop(0, "rgba(255,220,120,0.55)"); halo.addColorStop(1, "rgba(255,200,90,0)");
  x.fillStyle = halo; x.fillRect(0, 0, t, t);
  x.beginPath(); x.moveTo(12, 22); x.quadraticCurveTo(11, 13, 19, 12); x.quadraticCurveTo(28, 11, 29, 19); x.quadraticCurveTo(30, 27, 21, 28); x.quadraticCurveTo(13, 29, 12, 22); x.closePath();
  const g = x.createLinearGradient(12, 12, 28, 28); g.addColorStop(0, "#fff0b8"); g.addColorStop(0.5, "#f0c050"); g.addColorStop(1, "#b07820");
  x.fillStyle = g; x.fill(); x.strokeStyle = "#7a5010"; x.lineWidth = 0.8; x.stroke();
  x.fillStyle = "rgba(255,255,255,0.8)"; x.beginPath(); x.ellipse(18, 16, 3, 1.6, -0.5, 0, Math.PI * 2); x.fill();
  return cv;
}
const RAYONS = [5, 5.5, 6, 6.5];
const rayonProche = (r) => RAYONS.reduce((a, b) => (Math.abs(b - r) < Math.abs(a - r) ? b : a));

/* la petite MARTINE (le dessin du Jeu 1, Martine.jsx, en Path2D) */
const P = typeof Path2D !== "undefined" ? {
  coque: new Path2D("M50 24 Q78 26 82 52 Q84 74 66 82 Q50 88 34 82 Q16 74 18 52 Q22 26 50 24 Z"),
  ombre: new Path2D("M50 24 Q78 26 82 52 Q83 66 74 76 Q64 60 66 42 Q60 30 50 24 Z"),
  arete: new Path2D("M20 54 Q50 44 80 54"),
  rides: new Path2D("M30 36 q10 6 6 16 M62 32 q-6 10 0 18 M40 68 q8 6 18 2 M26 62 q4 8 12 10"),
} : null;
function petiteMartine(c, x, y, t, focus, visible) {
  if (!P) return;
  const s = 0.4, a = visible ? 1 : 0.3;
  c.save();
  c.globalAlpha = a;
  c.translate(x - 50 * s, y - 52 * s); c.scale(s, s);
  /* flammes des propulseurs, vers le bas */
  const fl = 14 + Math.sin(t * 40) * 4;
  for (const px of [11, 89]) {
    c.fillStyle = "#7fd8ff"; c.beginPath(); c.moveTo(px - 6, 63); c.lineTo(px + 6, 63); c.lineTo(px, 63 + fl); c.fill();
    c.fillStyle = "#ffb347"; c.beginPath(); c.moveTo(px - 3, 63); c.lineTo(px + 3, 63); c.lineTo(px, 63 + fl * 0.55); c.fill();
  }
  c.fillStyle = "#6a7488"; c.fillRect(4, 52, 14, 11); c.fillRect(82, 52, 14, 11);
  c.strokeStyle = "#8a94a8"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(50, 26); c.lineTo(50, 12); c.stroke();
  c.fillStyle = "#5eff9e"; c.beginPath(); c.arc(50, 10, 3.6, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#8a6240"; c.fill(P.coque);
  c.globalAlpha = a * 0.7; c.fillStyle = "#6e4a2c"; c.fill(P.ombre); c.globalAlpha = a;
  c.strokeStyle = "#5c3a22"; c.lineWidth = 3; c.stroke(P.arete);
  c.lineWidth = 2; c.globalAlpha = a * 0.55; c.stroke(P.rides); c.globalAlpha = a;
  c.fillStyle = "#cfeaff"; c.strokeStyle = "#5c3a22"; c.lineWidth = 2.5; c.beginPath(); c.arc(50, 52, 11, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = "rgba(255,255,255,0.85)"; c.beginPath(); c.ellipse(46, 47, 4, 2.4, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#0c2233"; c.beginPath(); c.arc(50, 50.5, 4, 0, Math.PI * 2); c.fill();
  c.restore();
  /* le hublot qui compte : un point blanc cerclé (plus visible en mode lent) */
  c.save();
  c.strokeStyle = focus ? "rgba(255,80,140,0.95)" : "rgba(255,80,140,0.75)"; c.lineWidth = focus ? 1.6 : 1.1;
  c.beginPath(); c.arc(x, y, focus ? 5.5 : 4.2, 0, Math.PI * 2); c.stroke();
  c.fillStyle = "#ffffff"; c.beginPath(); c.arc(x, y, HIT, 0, Math.PI * 2); c.fill();
  c.restore();
}

/* la grande MARTINE : son écran-cube, son œil, son sourcil, sa bouche */
function grandeMartine(c, g, calme) {
  const { x: bx, y: by } = g.boss;
  const col = g.couleur.map(Math.round);
  const z = 1 + (g.zoomMax - 1) * g.gros;
  const { fronce, triste, dents, colere } = g.expr;
  c.save();
  c.translate(bx, by); c.scale(z, z); c.translate(-bx, -by);
  c.strokeStyle = "#16241c"; c.lineWidth = 4;
  for (let k = -2; k <= 2; k++) {
    const cx = bx + k * 110;
    c.beginPath(); c.moveTo(cx, by - 160); c.quadraticCurveTo((cx + bx) / 2, by - 110, bx + k * 40, by - 86); c.stroke();
  }
  c.fillStyle = "#1a222c"; c.fillRect(bx - 48, by + 86, 96, 18);
  rondRect(c, bx - 122, by - 88, 244, 176, 12); c.fillStyle = "#0c121a"; c.fill(); c.strokeStyle = "#2a3644"; c.lineWidth = 5; c.stroke();
  rondRect(c, bx - 110, by - 76, 220, 152, 7); c.fillStyle = rgb(col.map((v) => Math.round(v * 0.085))); c.fill();
  const ex = bx, ey = by - 10;
  const halo = c.createRadialGradient(ex, ey, 10, ex, ey, 110); halo.addColorStop(0, rgb(col, 0.26 * g.lumiere)); halo.addColorStop(1, rgb(col, 0));
  c.fillStyle = halo; c.fillRect(bx - 110, by - 76, 220, 152);
  c.fillStyle = "rgba(0,0,0,0.18)"; for (let y = by - 76; y < by + 76; y += 3) c.fillRect(bx - 110, y, 220, 1);
  c.fillStyle = rgb(col, 0.8); c.textAlign = "left"; c.font = "700 7px ui-monospace, monospace"; c.fillText("M A R T I N E", bx - 100, by - 62);
  c.textAlign = "right"; c.font = "5.5px ui-monospace, monospace"; c.fillStyle = rgb(col, 0.55); c.fillText("RÉSEAU M · v.14.087", bx + 100, by + 70);
  const parle = g.parle > 0 ? (Math.sin(g.t * 22) + 1) * 0.5 : 0;
  /* l'œil */
  c.fillStyle = "#05080c"; c.beginPath(); c.arc(ex, ey, 35, 0, Math.PI * 2); c.fill();
  c.strokeStyle = rgb(col, 0.55 * g.lumiere); c.lineWidth = 2; c.stroke();
  const lent = c.createRadialGradient(ex, ey, 1, ex, ey, 29);
  lent.addColorStop(0, `rgba(255,255,255,${g.lumiere})`); lent.addColorStop(0.14, rgb(col, g.lumiere)); lent.addColorStop(0.55, rgb(mix(col, [0, 0, 0], 0.55), g.lumiere)); lent.addColorStop(1, "#020403");
  c.fillStyle = lent; c.beginPath(); c.arc(ex, ey, 29, 0, Math.PI * 2); c.fill();
  c.strokeStyle = rgb(col, 0.3 * g.lumiere); c.lineWidth = 1;
  for (const r of [13, 20, 25]) { c.beginPath(); c.arc(ex, ey, r, 0, Math.PI * 2); c.stroke(); }
  /* la pupille suit la petite MARTINE */
  const dx = g.joueur.x - ex, dy = g.joueur.y - ey, d = Math.hypot(dx, dy) || 1, k = Math.min(7, d * 0.04);
  const px = ex + (dx / d) * k, py = ey + (dy / d) * k;
  c.fillStyle = "#010201"; c.beginPath(); c.arc(px, py, 8.5, 0, Math.PI * 2); c.fill();
  c.fillStyle = rgb(mix(col, [255, 255, 255], 0.35), g.lumiere); c.beginPath(); c.arc(px, py, 2.8, 0, Math.PI * 2); c.fill();
  c.fillStyle = "rgba(255,255,255,0.4)"; c.beginPath(); c.ellipse(ex - 11, ey - 13, 6, 3.5, -0.5, 0, Math.PI * 2); c.fill();
  /* le sourcil : levé et poli (0), froncé en V (fronce = 1), triste en accent circonflexe (triste = 1) */
  const yC = ey - 52 + fronce * 10 - triste * 8, yE = ey - 49 - fronce * 11 + triste * 9;
  const arc = 5 * (1 - fronce) * (1 - triste);
  const sourcil = () => {
    c.beginPath();
    if (fronce > 0.5 && triste < 0.5) {
      /* froncé : deux traits droits qui plongent vers le centre */
      c.moveTo(ex - 44, yE); c.lineTo(ex - 7, yC); c.moveTo(ex + 7, yC); c.lineTo(ex + 44, yE);
    } else {
      c.moveTo(ex - 42, yE); c.quadraticCurveTo(ex - 20, yC - arc, ex, yC); c.quadraticCurveTo(ex + 20, yC - arc, ex + 42, yE);
    }
    c.stroke();
  };
  c.lineCap = "round"; c.lineJoin = "round";
  c.strokeStyle = rgb(col, 0.25 * g.lumiere); c.lineWidth = 11; sourcil();
  c.strokeStyle = rgb(col, g.lumiere); c.lineWidth = 5; sourcil();
  /* la bouche : sourire poli (vert), sourire méchant à dents (bleu), colère aux dents serrées (rouge),
     ligne qui tremble (vaincue) */
  const my = ey + 50;
  c.strokeStyle = rgb(col, g.lumiere);
  if (triste > 0.5) {
    c.lineWidth = 3; c.beginPath();
    for (let x = -30; x <= 30; x += 5) { const y = my + 4 + Math.sin(x * 0.35 + g.t * 18) * 1.6 + (Math.abs(x) / 30) * 3; if (x === -30) c.moveTo(ex + x, y); else c.lineTo(ex + x, y); }
    c.stroke();
  } else if (colere > 0.5) {
    /* les coins tombent, la bouche s'ouvre sur des dents serrées */
    const ouv = parle * 6, prof = (x) => 1 - (x / 44) ** 2;
    const haut = (x) => my + 8 - 13 * prof(x), bas = (x) => my + 8 + (7 + ouv) * prof(x);
    c.beginPath(); c.moveTo(ex - 44, my + 8);
    for (let x = -44; x <= 44; x += 4) c.lineTo(ex + x, haut(x));
    for (let x = 44; x >= -44; x -= 4) c.lineTo(ex + x, bas(x));
    c.closePath(); c.fillStyle = "#140303"; c.fill(); c.lineWidth = 3; c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = rgb(col, 0.85 * g.lumiere);
    for (let x = -33; x <= 33; x += 11) { c.beginPath(); c.moveTo(ex + x, haut(x) + 1.5); c.lineTo(ex + x, bas(x) - 1.5); c.stroke(); }
    c.beginPath(); for (let x = -40; x <= 40; x += 4) { const y = (haut(x) + bas(x)) / 2; if (x === -40) c.moveTo(ex + x, y); else c.lineTo(ex + x, y); } c.stroke();
  } else if (dents > 0.5) {
    const fond = my + 14 + parle * 8;
    c.beginPath(); c.moveTo(ex - 46, my - 8); c.quadraticCurveTo(ex, my + 4, ex + 46, my - 8); c.quadraticCurveTo(ex, fond + 8, ex - 46, my - 8); c.closePath();
    c.fillStyle = "#140303"; c.fill(); c.lineWidth = 3; c.stroke();
    c.lineWidth = 1.6; c.strokeStyle = rgb(col, 0.85 * g.lumiere);
    for (let x = -32; x <= 32; x += 9) {
      const haut = my - 8 + 12 * (1 - (x / 46) ** 2) * 0.5, pied = haut + 7 + parle * 3;
      c.beginPath(); c.moveTo(ex + x, haut); c.lineTo(ex + x, pied); c.stroke();
    }
  } else {
    c.lineWidth = 4; c.beginPath(); c.moveTo(ex - 34, my - 3); c.quadraticCurveTo(ex, my + 12 + parle * 5, ex + 34, my - 3); c.stroke();
  }
  /* touchée : un voile clair ; au niveau rouge, des parasites */
  if (g.boss.flash > 0) { rondRect(c, bx - 110, by - 76, 220, 152, 7); c.fillStyle = `rgba(255,255,255,${(calme ? 0.1 : 0.35) * g.boss.flash})`; c.fill(); }
  if (!calme && g.glitch > 0) {
    c.fillStyle = rgb(col, 0.35);
    for (let i = 0; i < 3; i++) c.fillRect(bx - 110 + Math.random() * 40, by - 76 + Math.random() * 148, 130 + Math.random() * 60, 2 + Math.random() * 3);
  }
  c.restore();
}

/* un missile : corps clair, ogive à la couleur de MARTINE, flamme */
function missile(c, m, col, t) {
  c.save(); c.translate(m.x, m.y); c.rotate(m.a);
  const fl = 6 + Math.sin(t * 50 + m.x) * 2;
  c.fillStyle = "#ffb347"; c.beginPath(); c.moveTo(-8, -2.2); c.lineTo(-8 - fl, 0); c.lineTo(-8, 2.2); c.fill();
  c.fillStyle = "#d8dde6"; c.fillRect(-8, -2.6, 12, 5.2);
  c.fillStyle = rgb(col); c.beginPath(); c.moveTo(4, -2.6); c.lineTo(10, 0); c.lineTo(4, 2.6); c.fill();
  c.fillRect(-8, -4.5, 3, 9);
  c.restore();
}

/* ───────── l'état d'une partie ───────── */
const pluie = (W) => Array.from({ length: Math.ceil(W / 23) }, (_, i) => ({ x: 8 + i * 23, y: Math.random() * H, v: 40 + Math.random() * 80, l: 10 + Math.random() * 30 }));
function nouvelEtat(W = W_MIN, adoucir = 1) {
  return {
    W, adoucir, aide: 1, phase: 1, pv: pvMax(W, 1), vies: 3, invul: 0, t: 0, tPhase: 0,
    caillou: null, tCaillou: 12, bouclier: 0, premierCaillou: true,
    joueur: { x: W / 2, y: H - 70 }, cible: null, focus: false, cad: 0,
    tirs: [], balles: [], missiles: [], etincelles: [], fumees: [], ondes: [], boules: [],
    attaque: 0, tA: -1.2, acc: {}, sens: 1, tMis: 0, trous: null,
    boss: { x: W / 2, y: BY, flash: 0 }, couleur: [...VERT], gros: 0, zoomMax: 1.5, glitch: 0, parle: 0, lumiere: 1,
    expr: { fronce: 0.15, triste: 0, dents: 0, colere: 0 },
    pluie: pluie(W), eclair: 0,
    secousse: 0, perdu: 0, bascule: 0, victoire: 0, banniere: { texte: "", t: 0 },
    tLigne: 0, iLigne: 0, stats: { debut: 0, touches: 0, recommencees: 0, par: {}, niveaux: {}, boucliers: 0 },
  };
}

function chaque(g, cle, periode, dt, fn) {
  g.acc[cle] = (g.acc[cle] || 0) + dt;
  let n = 0;
  while (g.acc[cle] >= periode && n++ < 6) { g.acc[cle] -= periode; fn(); }
}
/* un projectile rond ou une goutte, à la couleur du niveau */
function balle(g, type, x, y, a, v, r = 5.5) {
  if (g.balles.length > 800) return;
  g.balles.push({ type, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, age: 0, niv: g.phase });
}
/* une rangée de rectangles (notifications, « OUBLIE ») ; une ouverture par tranche de 380 de large,
   chacune à moins de 120 de la précédente */
function rangee(g, textes, w, h, ouverture, vy, type) {
  const W = g.W;
  const n = Math.max(1, Math.round(W / 380)), tranche = W / n;
  /* chaque ouverture reste près de celle de la rangée d'avant : un chemin qu'on peut suivre */
  const avant = g.trous?.length === n ? g.trous : null;
  const trous = Array.from({ length: n }, (_, i) => {
    const mini = i * tranche + 46, maxi = (i + 1) * tranche - 46;
    const x = avant ? avant[i] + (Math.random() - 0.5) * 240 : mini + Math.random() * (maxi - mini);
    return Math.max(mini, Math.min(maxi, x));
  });
  g.trous = trous;
  for (let x = 4 + w / 2; x < W; x += w + 6) {
    if (trous.some((gx) => Math.abs(x - gx) < ouverture / 2 + w / 2 - 8)) continue;
    g.balles.push({ type, x, y: BY + 112, vx: 0, vy, w, h, age: 0, niv: g.phase, txt: textes[Math.floor(Math.random() * textes.length)] });
  }
}
const versJoueur = (g, x, y) => Math.atan2(g.joueur.y - y, g.joueur.x - x);
function lancerMissiles(g, n, d) {
  for (let k = 0; k < n; k++) {
    if (g.missiles.length >= 16) break;
    const cote = k % 2 ? 1 : -1, decal = Math.floor(k / 2) * 18;
    g.missiles.push({ x: g.boss.x + cote * (126 + decal), y: g.boss.y + 40 - decal, a: Math.PI / 2 + cote * (0.7 + decal * 0.02), v: 90 * d.v, vie: 5.5, pv: 3, vx: 0, vy: 0 });
  }
  sonMissile();
}

/* les attaques de chaque niveau, jouées en boucle (durées en secondes) */
const ATTAQUES = {
  /* vert : gouttes, notifications, spirale à deux bras, tirs visés */
  1: [
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.32 / d.rate, dt, () => {
      const base = Math.PI / 2 + Math.sin(g.tA * 1.3) * 0.5;
      for (let k = -2; k <= 2; k++) balle(g, "goutte", ex, ey, base + k * 0.27, (95 + Math.random() * 40) * d.v, 5);
    }) },
    { duree: 8, tir: (g, dt, d) => chaque(g, "a", 1.7 / d.rate, dt, () => rangee(g, NOTIFS, 98, 17, 96, 62 * d.v, "notif")) },
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.085 / d.rate, dt, () => {
      const a = g.tA * 1.25 * g.sens;
      balle(g, "orbe", ex, ey, a, 105 * d.v); balle(g, "orbe", ex, ey, a + Math.PI, 105 * d.v);
    }) },
    { duree: 5, tir: (g, dt, d, ex, ey) => chaque(g, "a", 1.0 / d.rate, dt, () => {
      const a = versJoueur(g, ex, ey);
      for (let k = -2; k <= 2; k++) balle(g, "orbe", ex, ey, a + k * 0.2, 150 * d.v, 6.5);
    }) },
  ],
  /* bleu : pluie plus large, spirale à trois bras, notifications, anneaux, tirs visés à sept */
  2: [
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.3 / d.rate, dt, () => {
      const base = Math.PI / 2 + Math.sin(g.tA * 1.5) * 0.6;
      for (let k = -3; k <= 3; k++) balle(g, "goutte", ex, ey, base + k * 0.24, (100 + Math.random() * 40) * d.v, 5);
    }) },
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.09 / d.rate, dt, () => {
      const a = g.tA * 1.4 * g.sens;
      for (let k = 0; k < 3; k++) balle(g, "orbe", ex, ey, a + (k * Math.PI * 2) / 3, 110 * d.v);
    }) },
    { duree: 7, tir: (g, dt, d) => chaque(g, "a", 1.6 / d.rate, dt, () => rangee(g, NOTIFS, 98, 17, 96, 70 * d.v, "notif")) },
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.9 / d.rate, dt, () => {
      const o = (g.acc.n = (g.acc.n || 0) + 1) % 2 ? 0 : Math.PI / 16;
      for (let k = 0; k < 16; k++) balle(g, "orbe", ex, ey, o + (k * Math.PI * 2) / 16, 95 * d.v, 6);
    }) },
    { duree: 5, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.95 / d.rate, dt, () => {
      const a = versJoueur(g, ex, ey);
      for (let k = -3; k <= 3; k++) balle(g, "orbe", ex, ey, a + k * 0.17, 155 * d.v, 6.5);
    }) },
  ],
  /* rouge : fleur et anneaux, murs d'« OUBLIE », panique, rideaux croisés, salve de missiles
     (allégé deux fois le 2026-10-27 : « un peu trop de boules rouges », puis « encore difficile » ;
     environ −55 % de boules en tout, autant que le bleu, mais plus rapides) */
  3: [
    { duree: 7, tir: (g, dt, d, ex, ey) => {
      chaque(g, "a", 0.16 / d.rate, dt, () => { const a = g.tA * 1.9 * g.sens; for (let k = 0; k < 4; k++) balle(g, "orbe", ex, ey, a + (k * Math.PI) / 2, 110 * d.v); });
      chaque(g, "b", 1.8 / d.rate, dt, () => { const o = Math.random(); for (let k = 0; k < 12; k++) balle(g, "orbe", ex, ey, o + (k * Math.PI * 2) / 12, 92 * d.v, 6.5); });
    } },
    { duree: 8, tir: (g, dt, d, ex, ey) => {
      chaque(g, "a", 1.55 / d.rate, dt, () => rangee(g, ["OUBLIE"], 64, 17, 100 - (d.rate - 1) * 18, 80 * d.v, "oublie"));
      chaque(g, "b", 0.6 / d.rate, dt, () => balle(g, "orbe", ex, ey, versJoueur(g, ex, ey), 170 * d.v, 6));
    } },
    { duree: 6, tir: (g, dt, d) => chaque(g, "a", 0.3 / d.rate, dt, () => {
      const ox = g.boss.x + (Math.random() - 0.5) * 220, oy = g.boss.y + (Math.random() - 0.5) * 120;
      for (let k = 0; k < 4; k++) balle(g, "orbe", ox, oy, Math.PI * (0.15 + Math.random() * 0.7), (120 + Math.random() * 70) * d.v, 5);
    }) },
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.1 / d.rate, dt, () => {
      const s = Math.sin(g.tA * 2.2) * 1.0;
      balle(g, "orbe", ex, ey, Math.PI / 2 + s, 175 * d.v, 5); balle(g, "orbe", ex, ey, Math.PI / 2 - s, 175 * d.v, 5);
    }) },
    { duree: 5, tir: (g, dt, d, ex, ey) => {
      chaque(g, "a", 1.4 / d.rate, dt, () => lancerMissiles(g, 2, d));
      chaque(g, "b", 0.42 / d.rate, dt, () => { for (let k = -1; k <= 1; k++) balle(g, "orbe", ex, ey, Math.PI / 2 + k * 0.5 + Math.sin(g.tA) * 0.3, 120 * d.v, 5.5); });
    } },
  ],
};

export default function CombatMartine({ onQuitter }) {
  const calme = useMemo(estCalme, []);
  const [ecran, setEcran] = useState("debut");        // debut | jeu | pause | fin
  const [replique, setReplique] = useState("");
  const [grand, setGrand] = useState(null);            // { texte, couleur } : un mot en grand, au centre (au passage d'un niveau)
  const [ligneFin, setLigneFin] = useState(0);
  const [reponse, setReponse] = useState(null);         // la réponse du joueur, affichée un instant
  const [voile, setVoile] = useState(false);            // le fondu au noir
  const [bilan, setBilan] = useState(null);
  const [zone, setZone] = useState({ e: 1, W: W_MIN, large: false });
  const [tourner, setTourner] = useState(false);       // téléphone tenu en largeur : on demande de le tourner
  const [pleinEcran, setPleinEcran] = useState(false);
  const cadre = useRef(null), toile = useRef(null), g = useRef(nouvelEtat());
  const ecranRef = useRef(ecran); ecranRef.current = ecran;
  const ligneFinRef = useRef(ligneFin); ligneFinRef.current = ligneFin;
  const reponseRef = useRef(reponse); reponseRef.current = reponse;
  const debutLigne = useRef(0);                         // pour laisser respirer : pas de clic dans la première demi-seconde
  /* changer d'écran tout de suite pour la boucle (sans attendre le rendu) */
  const allerA = (e) => { ecranRef.current = e; setEcran(e); };
  const touches = useRef(new Set()), doigt = useRef(null);
  const sprites = useMemo(() => {
    if (typeof document === "undefined") return null;
    const orbes = {};
    [[1, VERT, "#ffffff"], [2, BLEU, "#ffffff"], [3, ROUGE, "#ffe8e0"]].forEach(([n, col, coeur]) => {
      orbes[n] = Object.fromEntries(RAYONS.map((r) => [r, orbe(r, col, coeur)]));
    });
    return { orbes, goutte: goutte(), aiguille: aiguille(), fumee: fumee(), caillou: caillouDore() };
  }, []);
  const dire = (texte, phase) => { setReplique(texte); g.current.parle = 1.4; sonVoix(phase === 1 ? 1 : 2); };
  const direRef = useRef(dire); direRef.current = dire;

  /* la zone : 640 de haut, élargie à la forme de l'écran */
  useEffect(() => {
    const maj = () => {
      const el = cadre.current; if (!el) return;
      const cw = el.clientWidth, ch = el.clientHeight;
      const portrait = cw / ch < 0.9;
      const e = Math.max(0.4, Math.min(cw / W_MIN, (ch - (portrait ? BANDE : 0)) / H));
      const W = Math.round(Math.max(W_MIN, Math.min(W_MAX, cw / e)));
      setZone({ e, W, large: !portrait });
      let tactile = false;
      try { tactile = matchMedia("(pointer: coarse)").matches; } catch { /* rien */ }
      setTourner(tactile && cw > ch && ch < 560);
    };
    maj();
    const ro = new ResizeObserver(maj); if (cadre.current) ro.observe(cadre.current);
    const fs = () => setPleinEcran(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fs);
    return () => { ro.disconnect(); document.removeEventListener("fullscreenchange", fs); };
  }, []);
  useEffect(() => {
    const cv = toile.current; if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(zone.W * zone.e * dpr); cv.height = Math.round(H * zone.e * dpr);
    const st = g.current;
    if (st.W !== zone.W) {
      st.joueur.x *= zone.W / st.W; st.boss.x *= zone.W / st.W; st.W = zone.W; st.pluie = pluie(zone.W);
      st.balles = st.balles.filter((b) => b.x < zone.W + 40);
    }
    st.zoomMax = zone.W >= 560 ? 2.05 : 1.34;
  }, [zone]);

  /* clavier */
  useEffect(() => {
    const bas = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        if (ecranRef.current === "jeu") allerA("pause"); else if (ecranRef.current === "pause") allerA("jeu");
        return;
      }
      /* Entrée ou Espace font avancer la fin, ou appuient sur le bouton choisi */
      if (ecranRef.current === "fin" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        if (e.target?.tagName === "BUTTON") e.target.click(); else suiteFinRef.current();
        return;
      }
      touches.current.add(e.code);
      if (e.key === "Shift") g.current.focus = true;
    };
    const haut = (e) => { touches.current.delete(e.code); if (e.key === "Shift") g.current.focus = false; };
    const cache = () => { if (document.hidden && ecranRef.current === "jeu") allerA("pause"); };
    window.addEventListener("keydown", bas); window.addEventListener("keyup", haut);
    document.addEventListener("visibilitychange", cache);
    return () => { window.removeEventListener("keydown", bas); window.removeEventListener("keyup", haut); document.removeEventListener("visibilitychange", cache); };
  }, []);
  useEffect(() => () => arreterMusique(), []);
  useEffect(() => { if (tourner && ecranRef.current === "jeu") allerA("pause"); }, [tourner]);
  /* &test=1 : accès à l'état pour les vérifications automatiques */
  useEffect(() => {
    try { if (new URLSearchParams(window.location.search).has("test")) window.__combat = { etat: () => g.current }; } catch { /* rien */ }
  }, []);

  /* souris : le vaisseau suit ; doigt : on le fait glisser */
  const versZone = (e) => { const r = toile.current.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * g.current.W, y: ((e.clientY - r.top) / r.height) * H }; };
  const onDown = (e) => {
    if (e.pointerType === "mouse") { g.current.cible = versZone(e); return; }
    doigt.current = versZone(e);
    try { toile.current.setPointerCapture(e.pointerId); } catch { /* le doigt glisse quand même */ }
  };
  const onMove = (e) => {
    const p = versZone(e);
    if (e.pointerType === "mouse") { g.current.cible = p; return; }
    if (!doigt.current) return;
    const j = g.current.joueur;
    j.x += (p.x - doigt.current.x) * 1.15; j.y += (p.y - doigt.current.y) * 1.15;
    doigt.current = p;
  };
  const onUp = () => { doigt.current = null; };

  /* la boucle : on dessine toujours, la partie n'avance qu'en jeu */
  useEffect(() => {
    let raf, avant = performance.now();
    const boucle = (now) => {
      const dt = Math.min(1 / 30, (now - avant) / 1000); avant = now;
      const st = g.current, e = ecranRef.current;
      st.t += dt;
      if (e === "jeu") avancer(st, dt);
      else animer(st, dt, e);
      dessiner(st);
      raf = requestAnimationFrame(boucle);
    };
    raf = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, sprites]);

  /* l'expression du visage et la couleur, qui glissent doucement vers leur but */
  function expression(st, dt, but) {
    const k = Math.min(1, dt * 6);
    st.expr.fronce = vers(st.expr.fronce, but.fronce || 0, k);
    st.expr.triste = vers(st.expr.triste, but.triste || 0, k);
    st.expr.dents = vers(st.expr.dents, but.dents || 0, k);
    st.expr.colere = vers(st.expr.colere, but.colere || 0, k);
  }
  const visageDuNiveau = (n, flash) => (n === 1 ? { fronce: Math.min(1, 0.15 + flash * 1.6) } : n === 2 ? { fronce: 0.6, dents: 1 } : { fronce: 1, colere: 1 });
  function teinter(st, dt, n, vitesse = 1.2) {
    const k = Math.min(1, dt * vitesse);
    st.couleur = st.couleur.map((v, i) => vers(v, NIVEAUX[n].couleur[i], k));
  }
  function fond(st, dt) {
    st.pluie.forEach((p) => { p.y += p.v * dt * (calme ? 0.3 : 1); if (p.y > H + 40) p.y = -40; });
  }
  /* MARTINE abîmée fume : un peu au niveau bleu, beaucoup au rouge, encore plus vaincue */
  function fumer(st, dt, taux) {
    if (Math.random() < dt * taux) {
      const z = 1 + (st.zoomMax - 1) * st.gros;
      const cote = Math.random() < 0.5 ? -1 : 1;
      bouffee(st, st.boss.x + cote * (60 + Math.random() * 60) * z, st.boss.y - (60 + Math.random() * 30) * z, 8 + Math.random() * 8, 0.6);
      if (Math.random() < 0.3) eclats(st, st.boss.x + cote * 110 * z, st.boss.y - 70 * z, 3, "#ffb347");
    }
  }
  function bouffee(st, x, y, r, opacite = 1) {
    if (st.fumees.length > 120) return;
    st.fumees.push({ x, y, r, vr: 14 + Math.random() * 18, vx: (Math.random() - 0.5) * 16, vy: -12 - Math.random() * 18, vie: 1, duree: 1.6 + Math.random() * 1.4, opacite });
  }
  /* l'explosion du passage de niveau : éclats de feu, ondes, fumée, éclair */
  function exploser(st, x, y, force = 1, { son = true, eclair = true } = {}) {
    if (son) sonExplosion();
    for (let i = 0; i < 70 * force; i++) {
      const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 260 * force;
      st.etincelles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: 0.6 + Math.random() * 0.7, couleur: ["#fff4d0", "#ffd166", "#ff9a3a", "#ff5a2a"][i % 4] });
    }
    st.ondes.push({ x, y, r: 10, v: 420, vie: 1 }, { x, y, r: 4, v: 260, vie: 1 });
    /* la boule de feu : un gros cœur et quelques petites autour */
    st.boules.push({ x, y, r: 14 * force, vr: 380 * force, vie: 1 });
    for (let i = 0; i < 3; i++) st.boules.push({ x: x + (Math.random() - 0.5) * 120 * force, y: y + (Math.random() - 0.5) * 80 * force, r: 6, vr: 120 * force, vie: 0.8 });
    for (let i = 0; i < 16 * force; i++) bouffee(st, x + (Math.random() - 0.5) * 160, y + (Math.random() - 0.5) * 100, 16 + Math.random() * 20);
    if (!calme) { if (eclair) st.eclair = 0.35; st.secousse = Math.max(st.secousse, 0.7 * force); }
  }

  /* hors jeu : MARTINE continue de bouger ; en fin de combat, le gros plan */
  function animer(st, dt, e) {
    st.parle = Math.max(0, st.parle - dt);
    if (e === "pause") return;
    const fin = e === "fin";
    st.gros = vers(st.gros, fin ? 1 : 0, Math.min(1, dt * 2.5));
    st.boss.x = vers(st.boss.x, st.W / 2, Math.min(1, dt * 2));
    st.boss.y = vers(BY, H * 0.37, st.gros) + Math.sin(st.t * 0.9) * 4;
    st.boss.flash = Math.max(0, st.boss.flash - dt * 4);
    st.glitch = Math.max(0, st.glitch - dt);
    st.eclair = Math.max(0, st.eclair - dt * 2);
    st.secousse = Math.max(0, st.secousse - dt);
    if (fin) {
      expression(st, dt, { triste: 1 });
      /* à la dernière réplique, l'œil faiblit */
      const but = ligneFinRef.current >= FIN.length - 1 ? 0.55 : 0.85;
      if (st.sauterGros) { st.gros = 1; st.boss.x = st.W / 2; st.sauterGros = false; }
      st.lumiere = vers(st.lumiere, but, Math.min(1, dt * 1.5)) * (calme ? 1 : 0.97 + 0.03 * Math.sin(st.t * 23) * Math.sin(st.t * 7));
      fumer(st, dt, 5);
    } else {
      expression(st, dt, visageDuNiveau(st.phase, 0));
      teinter(st, dt, st.phase);
    }
    majParticules(st, dt);
    fond(st, dt);
  }

  function avancer(st, dt) {
    const W = st.W, niv = NIVEAUX[st.phase];
    /* aide : chaque fois qu'on recommence un niveau, il devient un peu plus doux (jusqu'à −35 %) */
    const d = { rate: niv.dif * st.adoucir * st.aide, v: 0.7 + 0.3 * niv.dif };
    /* le joueur */
    const k = touches.current, j = st.joueur;
    const mx = (k.has("ArrowRight") || k.has("KeyD") ? 1 : 0) - (k.has("ArrowLeft") || k.has("KeyA") || k.has("KeyQ") ? 1 : 0);
    const my = (k.has("ArrowDown") || k.has("KeyS") ? 1 : 0) - (k.has("ArrowUp") || k.has("KeyW") || k.has("KeyZ") ? 1 : 0);
    const vit = st.focus ? 100 : 240;
    if (mx || my) {
      st.cible = null;
      const n = Math.hypot(mx, my); j.x += (mx / n) * vit * dt; j.y += (my / n) * vit * dt;
    } else if (st.cible) {
      const dx = st.cible.x - j.x, dy = st.cible.y - j.y, dd = Math.hypot(dx, dy), pas = Math.min(dd, (st.focus ? 260 : 680) * dt);
      if (dd > 0.5) { j.x += (dx / dd) * pas; j.y += (dy / dd) * pas; }
    }
    j.x = Math.max(14, Math.min(W - 14, j.x)); j.y = Math.max(262, Math.min(H - 18, j.y));
    st.invul = Math.max(0, st.invul - dt);

    /* MARTINE bouge, parle, change de visage, fume */
    st.tPhase += dt;
    const ampl = (st.phase === 1 ? 60 : st.phase === 2 ? 70 : 80) + (W - W_MIN) * (0.1 + st.phase * 0.02);
    st.boss.x = W / 2 + Math.sin(st.tPhase * (0.45 + st.phase * 0.1)) * ampl;
    st.gros = vers(st.gros, st.bascule > 0 ? 0.45 : 0, Math.min(1, dt * 3));
    st.boss.y = BY + st.gros * 80 + Math.sin(st.tPhase * 0.9) * 6;
    st.boss.flash = Math.max(0, st.boss.flash - dt * 6);
    st.parle = Math.max(0, st.parle - dt);
    st.glitch = Math.max(0, st.glitch - dt);
    if (st.phase === DERNIER && Math.random() < dt * 1.2) st.glitch = 0.12;
    st.secousse = Math.max(0, st.secousse - dt);
    st.eclair = Math.max(0, st.eclair - dt * 2);
    if (st.banniere.t > 0) st.banniere.t -= dt;
    fond(st, dt);
    fumer(st, dt, st.phase === 1 ? 0 : st.phase === 2 ? 1.6 : 4);

    /* le passage d'un niveau : explosion, un mot en grand, le visage et la couleur changent */
    if (st.bascule > 0) {
      st.bascule -= dt;
      const suivant = st.phase + 1;
      teinter(st, dt, st.bascule < 2.2 ? suivant : st.phase, 1.6);
      expression(st, dt, visageDuNiveau(st.bascule < 2.0 ? suivant : st.phase, 0));
      if (st.bascule < 2.4 && st.bascule + dt >= 2.4) { setGrand({ texte: PASSAGES[suivant], couleur: rgb(NIVEAUX[suivant].couleur) }); sonVoix(2); st.parle = 1.2; }
      majParticules(st, dt);
      if (st.bascule <= 0) {
        st.stats.niveaux[st.phase] = Math.round(st.tPhase);
        Object.assign(st, { phase: suivant, pv: pvMax(st.W, suivant), vies: 3, invul: 1.5, attaque: 0, tA: -0.8, acc: {}, tPhase: 0, tLigne: 4, iLigne: 0, tMis: 0, trous: null, aide: 1, tCaillou: 8 });
        st.banniere = { texte: `NIVEAU ${suivant}`, t: 1.6 };
        setGrand(null); sonPhase(); phaseMusique(suivant);
      }
      return;
    }
    expression(st, dt, visageDuNiveau(st.phase, st.boss.flash));
    teinter(st, dt, st.phase);

    /* tous les souvenirs perdus : on attend, puis le niveau recommence */
    if (st.perdu > 0) {
      st.perdu -= dt;
      majParticules(st, dt);
      if (st.perdu <= 0) {
        /* MARTINE ne récupère que la moitié de ce qu'elle a perdu, et le niveau s'adoucit un peu */
        Object.assign(st, { pv: Math.round(st.pv + (pvMax(st.W, st.phase) - st.pv) * 0.5), vies: 3, invul: 1.5, attaque: 0, tA: -1.5, acc: {}, balles: [], missiles: [], tirs: [], tMis: 0, trous: null, aide: Math.max(0.65, st.aide * 0.88), tCaillou: Math.min(st.tCaillou, 5) });
        st.banniere = { texte: "Elle se répare… à moitié.", t: 2 };
        st.stats.recommencees++;
      }
      return;
    }
    /* MARTINE vaincue */
    if (st.victoire > 0) {
      st.victoire -= dt;
      /* des explosions en chaîne, sans éclair (pas de clignotement) */
      if (Math.random() < dt * 5) exploser(st, st.boss.x + (Math.random() - 0.5) * 220, st.boss.y + (Math.random() - 0.5) * 150, 0.45, { son: Math.random() < 0.3, eclair: false });
      /* elle crie, dans les explosions */
      [[3.4, 0], [1.9, 1]].forEach(([q, i]) => { if (st.victoire < q && st.victoire + dt >= q) { setGrand({ texte: ATTENDS[i], couleur: "#ff8a78" }); sonVoix(2); st.parle = 1.2; } });
      fumer(st, dt, 8);
      majParticules(st, dt);
      if (st.victoire <= 0) {
        const s = st.stats;
        s.niveaux[DERNIER] = Math.round(st.tPhase);
        setBilan({ temps: Math.round((performance.now() - s.debut) / 1000), touches: s.touches, recommencees: s.recommencees, boucliers: s.boucliers, niveaux: { ...s.niveaux } });
        setReplique(""); setGrand(null); setReponse(null); setVoile(false); setLigneFin(0); allerA("fin");
      }
      return;
    }

    /* les répliques, de temps en temps */
    st.tLigne += dt;
    if (st.tLigne > 8) { st.tLigne = 0; const l = LIGNES[st.phase]; direRef.current(l[st.iLigne++ % l.length], st.phase); }

    /* tir automatique : en éventail ; en mode lent (Maj), un jet serré, comme dans DoDonPachi */
    st.cad -= dt;
    if (st.cad <= 0) {
      st.cad = 0.085;
      if (st.focus) st.tirs.push({ x: j.x - 3, y: j.y - 16, vx: 0 }, { x: j.x, y: j.y - 18, vx: 0 }, { x: j.x + 3, y: j.y - 16, vx: 0 });
      else st.tirs.push({ x: j.x - 6, y: j.y - 16, vx: -95 }, { x: j.x, y: j.y - 18, vx: 0 }, { x: j.x + 6, y: j.y - 16, vx: 95 });
    }
    const { x: bx, y: by } = st.boss;
    st.tirs = st.tirs.filter((t) => {
      t.y -= 620 * dt; t.x += (t.vx || 0) * dt;
      /* un missile sur le chemin ? */
      for (const m of st.missiles) {
        if (m.pv > 0 && Math.abs(t.x - m.x) < 9 && Math.abs(t.y - m.y) < 9) {
          m.pv--;
          if (m.pv <= 0) { eclats(st, m.x, m.y, 12, "#ffd166"); bouffee(st, m.x, m.y, 8, 0.8); sonPop(); }
          return false;
        }
      }
      if (Math.abs(t.x - bx) < 122 && t.y < by + 88 && t.y > by - 88) {
        st.pv--; st.boss.flash = 0.35; sonTouche();
        if (Math.random() < 0.35) eclats(st, t.x, t.y, 2, "#ffd166");
        return false;
      }
      return t.y > -20;
    });

    /* les attaques */
    const liste = ATTAQUES[st.phase], att = liste[st.attaque % liste.length];
    st.tA += dt;
    if (st.tA > att.duree) { st.attaque++; st.tA = -0.7; st.acc = {}; st.sens = -st.sens; st.trous = null; }
    else if (st.tA >= 0) att.tir(st, dt, d, bx, by - 10);
    /* et régulièrement, des missiles */
    st.tMis += dt;
    const mis = niv.missiles;
    if (st.tPhase > 4 && st.tMis > mis.periode / (st.adoucir * st.aide)) { st.tMis = 0; lancerMissiles(st, mis.n, d); }

    /* les cailloux d'Al3x1a : de temps en temps, un caillou doré tombe ; attrapé, il protège */
    st.tCaillou -= dt;
    if (!st.caillou && st.tCaillou <= 0 && st.tPhase > 3) {
      st.caillou = { x: 50 + Math.random() * (W - 100), y: -14, t: 0 };
      st.tCaillou = CAILLOU[st.phase];
    }
    if (st.caillou) {
      const ca = st.caillou;
      ca.t += dt; ca.y += 80 * dt; ca.x += Math.sin(ca.t * 2) * 22 * dt;
      if (Math.hypot(ca.x - j.x, ca.y - j.y) < 22) {
        st.caillou = null; st.premierCaillou = false; st.bouclier = BOUCLIER; st.stats.boucliers++;
        eclats(st, j.x, j.y, 14, "#ffd166"); sonCaillou();
      } else if (ca.y > H + 20) st.caillou = null;
    }
    if (st.bouclier > 0) { st.bouclier -= dt; if (st.bouclier <= 0) sonFinBouclier(); }
    const bulle = st.bouclier > 0;

    /* les projectiles de MARTINE */
    const touche = st.invul <= 0 && !bulle;
    let toucheJoueur = false;   // ou le type de ce qui a touché
    st.balles = st.balles.filter((b) => {
      b.x += b.vx * dt; b.y += b.vy * dt; b.age += dt;
      /* le bouclier efface ce qui le touche */
      if (bulle && (b.w ? Math.abs(b.x - j.x) < b.w / 2 + R_BOUCLIER - 6 && Math.abs(b.y - j.y) < b.h / 2 + R_BOUCLIER - 6 : Math.hypot(b.x - j.x, b.y - j.y) < R_BOUCLIER + (b.r || 5))) {
        eclats(st, b.x, b.y, 2, "#ffe8a0"); return false;
      }
      if (touche && !toucheJoueur) {
        if (b.w) {
          if (b.age > 0.3 && Math.abs(b.x - j.x) < b.w / 2 - 2 + HIT && Math.abs(b.y - j.y) < b.h / 2 - 2 + HIT) toucheJoueur = b.type;
        } else if (Math.hypot(b.x - j.x, b.y - j.y) < b.r * 0.72 + HIT) toucheJoueur = b.type;
      }
      return b.x > -40 && b.x < W + 40 && b.y > -40 && b.y < H + 40;
    });
    const virage = mis.virage * dt;
    st.missiles = st.missiles.filter((m) => {
      if (m.pv <= 0) return false;
      const ecart = ((versJoueur(st, m.x, m.y) - m.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      m.a += Math.max(-virage, Math.min(virage, ecart));
      m.v = Math.min(m.v + 30 * dt, mis.vmax * d.v);
      m.vx = Math.cos(m.a) * m.v; m.vy = Math.sin(m.a) * m.v;
      m.x += m.vx * dt; m.y += m.vy * dt; m.vie -= dt;
      if (Math.random() < dt * 10) bouffee(st, m.x - Math.cos(m.a) * 10, m.y - Math.sin(m.a) * 10, 3, 0.35);
      if (bulle && Math.hypot(m.x - j.x, m.y - j.y) < R_BOUCLIER + 8) { eclats(st, m.x, m.y, 10, "#ffd166"); sonPop(); return false; }
      if (touche && !toucheJoueur && Math.hypot(m.x - j.x, m.y - j.y) < 5 + HIT) { toucheJoueur = "missile"; return false; }
      if (m.vie <= 0) { eclats(st, m.x, m.y, 6, "#c8d4e2"); return false; }
      return true;
    });
    if (toucheJoueur) {
      st.vies--; st.invul = 2.2; st.stats.touches++; sonJoueurTouche();
      /* touché : le prochain caillou arrive plus vite */
      if (!st.caillou) st.tCaillou = Math.min(st.tCaillou, 6);
      st.stats.par[toucheJoueur] = (st.stats.par[toucheJoueur] || 0) + 1;
      if (!calme) st.secousse = 0.35;
      /* un peu de répit : ce qui est tout près disparaît */
      st.balles = st.balles.filter((b) => { const loin = Math.hypot(b.x - j.x, b.y - j.y) > 110; if (!loin) eclats(st, b.x, b.y, 1, "#ffffff"); return loin; });
      if (st.vies <= 0) {
        st.perdu = 2.6;
        st.balles.forEach((b) => eclats(st, b.x, b.y, 1, "#ffffff")); st.balles = []; st.missiles = []; st.caillou = null; st.bouclier = 0;
        direRef.current(MOQUERIE, st.phase);
      }
    }
    majParticules(st, dt);

    /* fin de niveau */
    if (st.pv <= 0) {
      st.balles.forEach((b) => eclats(st, b.x, b.y, 1, "#ffd166"));
      st.missiles.forEach((m) => eclats(st, m.x, m.y, 6, "#ffd166"));
      st.balles = []; st.missiles = []; st.tirs = []; st.pv = 0; st.caillou = null; st.bouclier = 0;
      exploser(st, st.boss.x, st.boss.y - 10, st.phase === DERNIER ? 1.4 : 1);
      if (st.phase < DERNIER) {
        st.bascule = 3.0;
        setReplique("");
      } else {
        st.victoire = 4.2; st.banniere.t = 0; arreterMusique();
      }
    }
  }

  function eclats(st, x, y, n, couleur) {
    if (st.etincelles.length > 600) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 110;
      st.etincelles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: 0.5 + Math.random() * 0.4, couleur });
    }
  }
  function majParticules(st, dt) {
    st.etincelles = st.etincelles.filter((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.vie -= dt; return p.vie > 0; });
    st.fumees = st.fumees.filter((f) => { f.x += f.vx * dt; f.y += f.vy * dt; f.r += f.vr * dt; f.vie -= dt / f.duree; return f.vie > 0; });
    st.ondes = st.ondes.filter((o) => { o.r += o.v * dt; o.vie -= dt * 1.4; return o.vie > 0; });
    st.boules = st.boules.filter((b) => { b.r += b.vr * dt; b.vr *= 0.92; b.vie -= dt * 1.4; return b.vie > 0; });
  }

  function dessiner(st) {
    const cv = toile.current; if (!cv || !sprites) return;
    const W = st.W, c = cv.getContext("2d"), k = cv.height / H;
    c.setTransform(k, 0, 0, k, 0, 0);
    if (st.secousse > 0) c.translate((Math.random() - 0.5) * 8 * st.secousse, (Math.random() - 0.5) * 8 * st.secousse);
    /* le fond : la salle des serveurs, des lignes de données qui tombent */
    const fd = c.createLinearGradient(0, 0, 0, H); fd.addColorStop(0, "#04070c"); fd.addColorStop(1, "#08111c");
    c.fillStyle = fd; c.fillRect(-10, -10, W + 20, H + 20);
    const col = st.couleur.map(Math.round);
    c.fillStyle = rgb(col, 0.09);
    st.pluie.forEach((p) => c.fillRect(p.x, p.y, 1.5, p.l));
    c.strokeStyle = "rgba(40,60,80,0.35)"; c.lineWidth = 1;
    for (let x = 0; x <= W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }

    grandeMartine(c, st, calme);

    /* la fumée, derrière les projectiles */
    st.fumees.forEach((f) => { c.globalAlpha = Math.min(1, f.vie * 1.5) * f.opacite; c.drawImage(sprites.fumee, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2); });
    c.globalAlpha = 1;
    /* tirs du joueur */
    st.tirs.forEach((t) => c.drawImage(sprites.aiguille.cv, t.x - 4, t.y - 10, 8, 20));
    /* projectiles de MARTINE */
    c.textAlign = "center"; c.textBaseline = "middle";
    st.balles.forEach((b) => {
      if (b.w) {
        c.globalAlpha = Math.min(1, b.age / 0.3);
        const oublie = b.type === "oublie", bord = NIVEAUX[b.niv].couleur;
        rondRect(c, b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 3);
        c.fillStyle = oublie ? "rgba(34,4,4,0.94)" : rgb(bord.map((v) => Math.round(v * 0.08)), 0.94); c.fill();
        c.strokeStyle = oublie ? "#ff3a2a" : rgb(bord); c.lineWidth = 1.3; c.stroke();
        c.fillStyle = oublie ? "#ffd8d0" : "#eef8ff";
        c.font = oublie ? "800 10px ui-monospace, monospace" : "700 7px ui-monospace, monospace";
        c.fillText(b.txt, b.x, b.y + 0.5);
        c.globalAlpha = 1;
      } else if (b.type === "goutte") {
        const s = sprites.goutte; c.drawImage(s.cv, b.x - 10, b.y - 17, s.w, s.h);
      } else {
        const s = sprites.orbes[b.niv][rayonProche(b.r)];
        c.drawImage(s.cv, b.x - s.d / 2, b.y - s.d / 2, s.d, s.d);
      }
    });
    c.textBaseline = "alphabetic";
    st.missiles.forEach((m) => missile(c, m, col, st.t));
    /* boules de feu, ondes de choc et étincelles */
    st.boules.forEach((b) => {
      const f = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      f.addColorStop(0, `rgba(255,250,225,${b.vie})`); f.addColorStop(0.35, `rgba(255,190,80,${b.vie * 0.85})`);
      f.addColorStop(0.7, `rgba(255,90,30,${b.vie * 0.45})`); f.addColorStop(1, "rgba(120,30,10,0)");
      c.fillStyle = f; c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.fill();
    });
    st.ondes.forEach((o) => { c.globalAlpha = Math.max(0, o.vie) * 0.8; c.strokeStyle = "#ffe8b0"; c.lineWidth = 3 * o.vie + 1; c.beginPath(); c.arc(o.x, o.y, o.r, 0, Math.PI * 2); c.stroke(); });
    st.etincelles.forEach((p) => { c.globalAlpha = Math.min(1, p.vie * 2); c.fillStyle = p.couleur; c.fillRect(p.x - 1, p.y - 1, 2, 2); });
    c.globalAlpha = 1;
    /* le caillou doré qui tombe (et, la première fois, « attrape-moi ! ») */
    if (st.caillou) {
      const ca = st.caillou, s2 = sprites.caillou, pulse = calme ? 1 : 1 + Math.sin(st.t * 6) * 0.08;
      c.drawImage(s2, ca.x - 20 * pulse, ca.y - 20 * pulse, 40 * pulse, 40 * pulse);
      if (st.premierCaillou) {
        c.textAlign = "center"; c.font = "700 9px ui-monospace, monospace"; c.fillStyle = "rgba(255,226,150,0.95)";
        c.fillText("attrape-moi !", ca.x, ca.y - 22);
      }
    }
    /* la petite MARTINE */
    if (ecranRef.current !== "fin") petiteMartine(c, st.joueur.x, st.joueur.y, st.t, st.focus, st.invul <= 0 || st.bouclier > 0 || Math.floor(st.t * 10) % 2 === 0);
    /* le bouclier : une bulle dorée qui tourne ; elle clignote la dernière seconde (pas en mode calme) */
    if (st.bouclier > 0 && ecranRef.current !== "fin") {
      const j = st.joueur, fin = st.bouclier < 1 && !calme ? 0.45 + 0.55 * (Math.sin(st.t * 28) > 0 ? 1 : 0) : 1;
      const bu = c.createRadialGradient(j.x, j.y, 4, j.x, j.y, R_BOUCLIER);
      bu.addColorStop(0, "rgba(255,226,140,0)"); bu.addColorStop(0.75, `rgba(255,214,110,${0.12 * fin})`); bu.addColorStop(1, `rgba(255,214,110,${0.35 * fin})`);
      c.fillStyle = bu; c.beginPath(); c.arc(j.x, j.y, R_BOUCLIER, 0, Math.PI * 2); c.fill();
      c.save(); c.strokeStyle = `rgba(255,226,150,${0.9 * fin})`; c.lineWidth = 2; c.setLineDash([9, 6]); c.lineDashOffset = -st.t * 40;
      c.beginPath(); c.arc(j.x, j.y, R_BOUCLIER, 0, Math.PI * 2); c.stroke(); c.restore();
    }

    /* l'éclair de l'explosion (jamais en mode calme) */
    c.setTransform(k, 0, 0, k, 0, 0);
    if (st.eclair > 0) { c.fillStyle = `rgba(255,240,210,${st.eclair * 0.6})`; c.fillRect(0, 0, W, H); }
    /* jauge de MARTINE, niveau, souvenirs (pas pendant la scène de fin) */
    if (ecranRef.current === "fin") return;
    c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(14, 8, W - 28, 5);
    c.fillStyle = rgb(col); c.fillRect(14, 8, (W - 28) * Math.max(0, Math.min(1, st.pv / pvMax(W, st.phase))), 5);
    c.font = "700 7px ui-monospace, monospace"; c.textAlign = "right"; c.fillStyle = rgb(col, 0.8);
    c.fillText(`MARTINE · NIVEAU ${ROMAIN[st.phase]}`, W - 14, 23);
    c.fillStyle = "rgba(200,212,226,0.75)"; c.fillText("SOUVENIRS", W - 14 - 3 * 14, H - 9);
    for (let i = 0; i < 3; i++) {
      c.beginPath(); c.arc(W - 14 - i * 13, H - 12, 4.5, 0, Math.PI * 2);
      if (i < st.vies) { c.fillStyle = "#ffd166"; c.fill(); } else { c.strokeStyle = "rgba(255,209,102,0.5)"; c.lineWidth = 1; c.stroke(); }
    }
    if (st.banniere.t > 0) {
      c.globalAlpha = Math.min(1, st.banniere.t * 1.5); c.textAlign = "center"; c.font = "800 18px ui-monospace, monospace";
      c.fillStyle = rgb(col); c.fillText(st.banniere.texte, W / 2, H * 0.55); c.globalAlpha = 1;
    }
  }

  /* ───────── les écrans ───────── */
  const commencer = () => {
    g.current = nouvelEtat(zone.W, calme ? 0.85 : 1);
    g.current.zoomMax = zone.W >= 560 ? 2.05 : 1.34;
    g.current.stats.debut = performance.now();
    g.current.banniere = { texte: "NIVEAU 1", t: 1.6 };
    setReplique(""); setGrand(null); setBilan(null); allerA("jeu");
    demarrerMusique(1);
    setTimeout(() => direRef.current(OUVERTURE, 1), 900);
  };
  const recommencer = () => {
    arreterMusique(); g.current = nouvelEtat(zone.W); setReplique(""); setGrand(null); setReponse(null); setLigneFin(0); allerA("debut");
  };
  const avancerFin = () => setLigneFin(Math.min(FIN.length, ligneFinRef.current + 1));
  /* un clic : la réplique suivante (pas pendant un noir, ni quand il faut répondre) */
  const suiteFin = () => {
    const b = FIN[ligneFinRef.current];
    if (!b || b.noir || reponseRef.current || performance.now() - debutLigne.current < (b.choix ? 900 : 450)) return;
    if (b.choix) { if (b.choix.length === 1) repondre(b.choix[0]); return; }
    avancerFin();
  };
  const suiteFinRef = useRef(suiteFin); suiteFinRef.current = suiteFin;
  /* le joueur répond : sa réplique reste un instant, puis MARTINE reprend */
  const repondre = (texte) => {
    if (reponseRef.current) return;
    setReponse(texte); reponseRef.current = texte;
    setTimeout(() => { setReponse(null); avancerFin(); }, 1300);
  };
  /* chaque temps de la fin : la voix pour une réplique ; pour un noir, on attend, puis on revient */
  useEffect(() => {
    if (ecran !== "fin") return;
    const b = FIN[ligneFin];
    debutLigne.current = performance.now();
    if (!b) { setVoile(false); return; }
    if (b.noir) {
      /* le voile s'installe à l'image suivante, pour que le fondu se voie */
      const r = requestAnimationFrame(() => setVoile(true));
      const t1 = setTimeout(() => { if (ligneFin === 0) g.current.sauterGros = true; }, 800);
      const t2 = setTimeout(avancerFin, 700 + b.noir * 1000);
      return () => { cancelAnimationFrame(r); clearTimeout(t1); clearTimeout(t2); };
    }
    setVoile(false);
    sonVoix(2); g.current.parle = b.gros ? 2 : 1.4;
  }, [ecran, ligneFin]);
  const quitter = () => { arreterMusique(); if (onQuitter) onQuitter(); else window.location.href = window.location.pathname; };
  const basculerPleinEcran = () => {
    try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch { /* refusé */ }
  };

  const { e: echelle, W: Wz, large } = zone;
  const largeur = Wz * echelle, hauteur = H * echelle;
  const bouton = (fond, texte) => ({ background: fond, color: texte, border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "ui-monospace, monospace", fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: "pointer" });
  const carte = { position: "absolute", left: "50%", transform: "translateX(-50%)", width: Math.min(largeur - 24, 520), boxSizing: "border-box", background: "rgba(4,8,14,0.92)", border: "1px solid rgba(94,255,158,0.35)", borderRadius: 12, padding: "14px 16px", color: "#e8eef5", fontFamily: "Palatino, Georgia, serif" };
  const couleurReplique = rgb(g.current.couleur.map(Math.round));
  const taillePolice = Math.round(Math.max(17, Math.min(28, 21 * echelle)));
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const boutonsCoin = (
    <div style={{ display: "flex", gap: 6, flex: "0 0 auto" }}>
      <button onClick={basculerPleinEcran} title={pleinEcran ? "Quitter le plein écran" : "Plein écran"} style={{ ...bouton("rgba(255,255,255,0.08)", "#c8d4e2"), padding: "6px 10px" }}>⛶</button>
      {ecran === "jeu" && <button onClick={() => allerA("pause")} title="Pause (Échap)" style={{ ...bouton("rgba(255,255,255,0.08)", "#c8d4e2"), padding: "6px 10px" }}>⏸</button>}
    </div>
  );

  return (
    <div ref={cadre} style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 30%, #0a1420 0%, #020408 70%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: large ? "center" : "flex-start", overflow: "hidden", userSelect: "none", WebkitUserSelect: "none" }}>
      {tourner && (
        <div style={{ position: "fixed", inset: 0, zIndex: 5, background: "#03050a", color: "#e8eef5", display: "grid", placeItems: "center", textAlign: "center", padding: 24, fontFamily: "Palatino, Georgia, serif" }}>
          <div>
            <div style={{ fontSize: 44, marginBottom: 10 }}>↻</div>
            <p style={{ margin: 0, fontSize: 17 }}>Tourne ton téléphone :<br />le combat se joue en hauteur.</p>
          </div>
        </div>
      )}
      {/* en portrait : la bande des répliques au-dessus de la zone */}
      {!large && (
        <div style={{ width: largeur, height: BANDE, boxSizing: "border-box", padding: "8px 10px", display: "flex", alignItems: "center", gap: 10 }}>
          <div aria-live="polite" style={{ flex: 1, fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontSize: Math.max(12, Math.min(15, largeur / 26)), lineHeight: 1.3, color: couleurReplique, textShadow: "0 0 10px rgba(0,0,0,0.9)" }}>
            {ecran === "fin" ? "" : replique}
          </div>
          {boutonsCoin}
        </div>
      )}
      <div style={{ position: "relative", width: largeur, height: hauteur, flex: "0 0 auto" }}>
        <canvas ref={toile} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          style={{ width: largeur, height: hauteur, display: "block", touchAction: "none", cursor: ecran === "jeu" ? "none" : "default" }} />

        {/* en largeur : les répliques dans la zone, en haut à gauche ; les boutons en haut à droite */}
        {large && (<>
          <div aria-live="polite" style={{ position: "absolute", left: 14 * echelle, top: 22 * echelle, width: Math.max(160, (Wz / 2 - 150) * echelle), fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontSize: Math.max(13, Math.min(20, 15 * echelle)), lineHeight: 1.35, color: couleurReplique, textShadow: "0 0 10px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)", pointerEvents: "none" }}>
            {ecran === "fin" ? "" : replique}
          </div>
          <div style={{ position: "absolute", right: 14 * echelle, top: 30 * echelle, zIndex: 2 }}>{boutonsCoin}</div>
        </>)}

        {/* le passage d'un niveau : un mot, en grand, au centre */}
        {grand && (
          <div key={grand.texte} style={{ position: "absolute", left: 0, right: 0, top: "42%", textAlign: "center", fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontSize: Math.round(46 * echelle), color: grand.couleur, textShadow: "0 0 24px currentColor, 0 0 4px #000", pointerEvents: "none", animation: "cmGrand 0.5s ease-out both" }}>
            {grand.texte}
          </div>
        )}
        <style>{"@keyframes cmGrand { from { opacity: 0; transform: scale(1.3); } to { opacity: 1; transform: none; } } @keyframes cmFondu { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }"}</style>

        {ecran === "debut" && (
          <div style={{ ...carte, top: "34%", maxHeight: "62%", overflowY: "auto" }}>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 3, color: "#5eff9e" }}>◈ NIVEAU −3 · SERVEURS</div>
            <p style={{ margin: "8px 0", fontSize: 15 }}>MARTINE ne se laissera pas débrancher.</p>
            <ul style={{ margin: "0 0 10px", paddingLeft: 18, fontSize: 13, lineHeight: 1.5, color: "#c8d4e2" }}>
              <li>Déplace la petite MARTINE : glisse le doigt, bouge la souris, ou les flèches (Z Q S D).</li>
              <li>Elle tire toute seule. Maintiens <b>Maj</b> pour aller lentement. Ses tirs abattent les missiles.</li>
              <li>Seul son hublot compte : le point blanc.</li>
              <li>Attrape les <span style={{ color: "#ffd166" }}>cailloux dorés</span> d'Al3x1a : ils te protègent quelques secondes.</li>
              <li>Trois niveaux : MARTINE <span style={{ color: rgb(VERT) }}>verte</span>, puis <span style={{ color: rgb(BLEU) }}>bleue</span>, puis <span style={{ color: rgb(ROUGE) }}>rouge</span>.</li>
            </ul>
            <button onClick={commencer} autoFocus style={bouton("#5eff9e", "#06110b")}>▶ Commencer</button>
            <div style={{ marginTop: 10, fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#5a6678" }}>Prototype du combat · ?combat=1</div>
          </div>
        )}

        {ecran === "pause" && (
          <div style={{ ...carte, top: "40%", textAlign: "center" }}>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, letterSpacing: 3, marginBottom: 12 }}>PAUSE</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => allerA("jeu")} autoFocus style={bouton("#5eff9e", "#06110b")}>▶ Continuer</button>
              <button onClick={recommencer} style={bouton("rgba(255,255,255,0.08)", "#c8d4e2")}>↺ Recommencer</button>
            </div>
          </div>
        )}

        {/* MARTINE vaincue, en gros plan : la révélation, réplique par réplique, avec des fondus */}
        {ecran === "fin" && (ligneFin < FIN.length ? (
          <div onClick={suiteFin} style={{ position: "absolute", inset: 0, cursor: FIN[ligneFin].noir || FIN[ligneFin].choix ? "default" : "pointer" }}>
            {/* le voile noir des fondus */}
            <div style={{ position: "absolute", inset: 0, background: "#000", opacity: voile ? 1 : 0, transition: "opacity 0.7s ease", pointerEvents: "none" }} />
            {!FIN[ligneFin].noir && (
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "5%", width: Math.min(largeur - 32, 900), textAlign: "center" }}>
                {FIN[ligneFin].m && (
                  <p key={ligneFin} style={{ margin: "0 0 14px", fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontSize: taillePolice, lineHeight: 1.4, color: "#ffe8e4",
                    textShadow: "0 0 18px rgba(255,58,42,0.45), 0 2px 6px rgba(0,0,0,0.95)", animation: "cmFondu 0.9s ease-out both" }}>
                    {FIN[ligneFin].m}
                  </p>
                )}
                {FIN[ligneFin].gros && (
                  <p key={ligneFin} style={{ margin: "0 0 18px", fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: Math.round(taillePolice * 2.3), letterSpacing: 4, color: "#ff8a78",
                    textShadow: "0 0 28px rgba(255,58,42,0.8), 0 2px 8px rgba(0,0,0,0.95)", animation: "cmFondu 1.4s ease-out both" }}>
                    {FIN[ligneFin].gros}
                  </p>
                )}
                {reponse ? (
                  <p style={{ margin: "0 0 6px", fontFamily: "Palatino, Georgia, serif", fontSize: Math.round(taillePolice * 0.9), color: "#ffe2a0", textShadow: "0 2px 6px rgba(0,0,0,0.95)", animation: "cmFondu 0.4s ease-out both" }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 3, color: "#c8a868", marginRight: 10 }}>TOI</span>{reponse}
                  </p>
                ) : FIN[ligneFin].choix ? (
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", animation: "cmFondu 0.6s ease-out 0.7s both" }}>
                    {FIN[ligneFin].choix.map((c, k) => (
                      <button key={c} autoFocus={k === 0} onClick={(e) => { e.stopPropagation(); repondre(c); }} style={{ ...bouton("rgba(255,226,160,0.12)", "#ffe2a0"), border: "1px solid rgba(255,226,160,0.4)", fontFamily: "Palatino, Georgia, serif", fontWeight: 400, fontSize: Math.max(14, Math.round(taillePolice * 0.75)), letterSpacing: 0 }}>{c}</button>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "rgba(255,232,228,0.45)", animation: "cmFondu 0.6s ease-out 1.2s both" }}>▸ clic ou Entrée</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...carte, bottom: 18, borderColor: "rgba(255,58,42,0.5)" }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, lineHeight: 1.5, color: "#c8d4e2" }}>
              Fin du prototype : ici viendront T'ÉTEINDRE, TE MODIFIER et TE FAIRE CONFIANCE.
            </p>
            {bilan && (
              <p style={{ margin: "0 0 10px", fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: "#8fa3bd", lineHeight: 1.6 }}>
                {mmss(bilan.temps)} en tout · niveau I {mmss(bilan.niveaux[1] || 0)} · II {mmss(bilan.niveaux[2] || 0)} · III {mmss(bilan.niveaux[3] || 0)}<br />
                souvenirs perdus : {bilan.touches} · niveaux recommencés : {bilan.recommencees} · boucliers : {bilan.boucliers}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={recommencer} autoFocus style={bouton("#5eff9e", "#06110b")}>↺ Rejouer</button>
              <button onClick={quitter} style={bouton("rgba(255,255,255,0.08)", "#c8d4e2")}>Retour au jeu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
