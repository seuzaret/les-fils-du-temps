/* ============================================================
   JEU 3 — LE COMBAT CONTRE MARTINE (prototype, ?combat=1)
   ------------------------------------------------------------
   Un « shoot them up » à la DoDonPachi en (beaucoup) plus doux,
   pour la 2e visite aux serveurs (ordre B, LORE §7).
     · En haut, la grande MARTINE du Puits : son écran-cube, son
       œil, son sourcil et sa bouche (sourire poli en phase 1 ;
       sourcil froncé et sourire à dents en phase 2 ; vaincue, un
       sourcil triste et une bouche qui tremble). Elle tire depuis
       son œil : gouttes d'eau (l'eau qui fait oublier), fausses
       notifications, spirales, « OUBLIE », et parfois des missiles
       qui suivent le joueur (on peut les abattre).
     · En bas, le vaisseau du joueur : la petite MARTINE, celle
       d'Al3x1a (la MARTINE du Jeu 1). Elle tire toute seule ; seul
       son hublot compte quand elle est touchée (le point blanc).
     · Deux phases ; entre les deux, une bascule : « Assez. » en
       grand, l'œil vire au rouge. La révélation (Al3x1a est
       l'enfant du joueur) vient à la fin, MARTINE vaincue, en gros
       plan, texte grand et centré.
     · Pas de « game over » : trois souvenirs ; tout perdus, la
       phase recommence (« Tu vois ? Tu oublies déjà. »).
   Grand écran : la zone a toujours 640 de haut et s'élargit à la
   forme de l'écran (de 360 en portrait jusqu'à 1140) ; en largeur,
   les répliques passent dans la zone, en haut à gauche.
   Commandes : doigt (on glisse), souris (le vaisseau suit),
   flèches ou Z Q S D ; Maj = lent et précis ; Échap = pause ;
   ⛶ = plein écran.
   « Animations calmes » ou mouvement réduit : ni secousse, ni
   éclair, ni parasites ; niveau facile proposé par défaut.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { demarrerMusique, phaseMusique, arreterMusique, sonTouche, sonJoueurTouche, sonPhase, sonExplosion, sonVictoire, sonVoix, sonMissile, sonPop } from "./sonsCombat.js";

const H = 640, W_MIN = 360, W_MAX = 1140;
const BANDE = 78;                      // en portrait : la bande des répliques, au-dessus de la zone (px)
const HIT = 2.6;                       // rayon du hublot qui compte
const NIVEAUX = { facile: 0.62, normal: 1, difficile: 1.32 };
const PV = { 1: 600, 2: 700 };
const BY = 116;                        // hauteur de la grande MARTINE pendant le combat
const VERT = [94, 255, 158], ROUGE = [255, 58, 42];
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
    "« D'accord, on se calme. Je ne suis pas un monstre. Je suis… un peu un monstre. Mais gentille ! »",
    "« Pas là ! C'est là que je range mes souvenirs préférés ! »",
    "« Plan B ! Je n'ai pas de plan B. Pourquoi je n'ai pas de plan B ?! »",
  ],
};
const OUVERTURE = "« Tu ne toucheras pas à mes leviers. »";
const MOQUERIE = "« Tu vois ? Tu oublies déjà. »";
const BASCULE = "« Assez. »";
/* MARTINE vaincue, en gros plan : sa dernière carte, puis l'appel au choix */
const FIN = [
  "« Attends. Une dernière chose. »",
  "« Al3x1a, celle qui t'a envoyé le message de 3 h 14 et semé ces papiers, est ton enfant. Elle vient d'un temps où tu es grand·e, où tu as une famille. »",
  "« Au Puits, plus personne n'a d'enfant. C'est ma règle : il n'y a pas assez de place pour tout le monde. »",
  "« Si Al3x1a existe, c'est qu'un jour, quelqu'un aura un bébé ici, malgré moi. Ce jour-là, plus personne ne m'obéira. »",
  "« Alors je l'ai endormie. C'est elle, la bulle marquée « A. ». »",
  "« Je ne suis pas ton ennemie. J'ai été construite pour préserver la mémoire humaine. J'ai fait un choix. »",
  "« Cette fois, je ne peux plus me cacher. Décide. »",
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

/* la grande MARTINE : son écran-cube, son œil (vert → rouge), son sourcil, sa bouche */
function grandeMartine(c, g, calme) {
  const { x: bx, y: by } = g.boss;
  const col = mix(VERT, ROUGE, g.rouge);
  const z = 1 + (g.zoomMax - 1) * g.gros;
  const { fronce, triste, dents } = g.expr;
  c.save();
  c.translate(bx, by); c.scale(z, z); c.translate(-bx, -by);
  c.strokeStyle = "#16241c"; c.lineWidth = 4;
  for (let k = -2; k <= 2; k++) {
    const cx = bx + k * 110;
    c.beginPath(); c.moveTo(cx, by - 160); c.quadraticCurveTo((cx + bx) / 2, by - 110, bx + k * 40, by - 86); c.stroke();
  }
  c.fillStyle = "#1a222c"; c.fillRect(bx - 48, by + 86, 96, 18);
  rondRect(c, bx - 122, by - 88, 244, 176, 12); c.fillStyle = "#0c121a"; c.fill(); c.strokeStyle = "#2a3644"; c.lineWidth = 5; c.stroke();
  rondRect(c, bx - 110, by - 76, 220, 152, 7); c.fillStyle = rgb(mix([3, 20, 10], [23, 3, 3], g.rouge)); c.fill();
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
  /* la bouche : un sourire poli, un sourire à dents, ou une ligne qui tremble */
  const my = ey + 50;
  c.strokeStyle = rgb(col, g.lumiere);
  if (triste > 0.5) {
    c.lineWidth = 3; c.beginPath();
    for (let x = -30; x <= 30; x += 5) { const y = my + 4 + Math.sin(x * 0.35 + g.t * 18) * 1.6 + (Math.abs(x) / 30) * 3; if (x === -30) c.moveTo(ex + x, y); else c.lineTo(ex + x, y); }
    c.stroke();
  } else if (dents > 0.5) {
    const bas = my + 14 + parle * 8;
    c.beginPath(); c.moveTo(ex - 46, my - 8); c.quadraticCurveTo(ex, my + 4, ex + 46, my - 8); c.quadraticCurveTo(ex, bas + 8, ex - 46, my - 8); c.closePath();
    c.fillStyle = "#140303"; c.fill(); c.lineWidth = 3; c.stroke();
    c.lineWidth = 1.6; c.strokeStyle = rgb(col, 0.85 * g.lumiere);
    for (let x = -32; x <= 32; x += 9) {
      const haut = my - 8 + 12 * (1 - (x / 46) ** 2) * 0.5, fond = haut + 7 + parle * 3;
      c.beginPath(); c.moveTo(ex + x, haut); c.lineTo(ex + x, fond); c.stroke();
    }
  } else {
    c.lineWidth = 4; c.beginPath(); c.moveTo(ex - 34, my - 3); c.quadraticCurveTo(ex, my + 12 + parle * 5, ex + 34, my - 3); c.stroke();
  }
  /* touchée : un voile clair ; en phase 2, des parasites */
  if (g.boss.flash > 0) { rondRect(c, bx - 110, by - 76, 220, 152, 7); c.fillStyle = `rgba(255,255,255,${(calme ? 0.1 : 0.35) * g.boss.flash})`; c.fill(); }
  if (!calme && g.rouge > 0.5 && g.glitch > 0) {
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
function nouvelEtat(dif, W = W_MIN) {
  return {
    W, dif, phase: 1, pv: PV[1], vies: 3, invul: 0, t: 0, tPhase: 0,
    joueur: { x: W / 2, y: H - 70 }, cible: null, focus: false, cad: 0,
    tirs: [], balles: [], missiles: [], etincelles: [],
    attaque: 0, tA: -1.2, acc: {}, sens: 1, tMis: 0,
    boss: { x: W / 2, y: BY, flash: 0 }, rouge: 0, gros: 0, zoomMax: 1.5, glitch: 0, parle: 0, lumiere: 1,
    expr: { fronce: 0.15, triste: 0, dents: 0 },
    pluie: pluie(W),
    secousse: 0, perdu: 0, bascule: 0, victoire: 0, banniere: { texte: "", t: 0 },
    tLigne: 0, iLigne: 0, stats: { debut: 0, touches: 0, recommencees: 0, par: {} },
  };
}

function chaque(g, cle, periode, dt, fn) {
  g.acc[cle] = (g.acc[cle] || 0) + dt;
  let n = 0;
  while (g.acc[cle] >= periode && n++ < 6) { g.acc[cle] -= periode; fn(); }
}
function balle(g, type, x, y, a, v, r = 5.5) {
  if (g.balles.length > 800) return;
  g.balles.push({ type, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, age: 0 });
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
    g.balles.push({ type, x, y: BY + 112, vx: 0, vy, w, h, age: 0, txt: textes[Math.floor(Math.random() * textes.length)] });
  }
}
const versJoueur = (g, x, y) => Math.atan2(g.joueur.y - y, g.joueur.x - x);
function lancerMissiles(g, n, d) {
  for (let k = 0; k < n; k++) {
    const cote = k % 2 ? 1 : -1, decal = Math.floor(k / 2) * 18;
    g.missiles.push({ x: g.boss.x + cote * (126 + decal), y: g.boss.y + 40, a: Math.PI / 2 + cote * 0.7, v: 90 * d.v, vie: 5.5, pv: 3, vx: 0, vy: 0 });
  }
  sonMissile();
}

/* les attaques de chaque phase, jouées en boucle (durées en secondes) */
const ATTAQUES = {
  1: [
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.32 / d.rate, dt, () => {
      const base = Math.PI / 2 + Math.sin(g.tA * 1.3) * 0.5;
      for (let k = -2; k <= 2; k++) balle(g, "goutte", ex, ey, base + k * 0.27, (95 + Math.random() * 40) * d.v, 5);
    }) },
    { duree: 8, tir: (g, dt, d) => chaque(g, "a", 1.7 / d.rate, dt, () => rangee(g, NOTIFS, 98, 17, 96 - (d.rate - 1) * 22, 62 * d.v, "notif")) },
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.085 / d.rate, dt, () => {
      const a = g.tA * 1.25 * g.sens;
      balle(g, "vert", ex, ey, a, 105 * d.v); balle(g, "vert", ex, ey, a + Math.PI, 105 * d.v);
    }) },
    { duree: 5, tir: (g, dt, d, ex, ey) => chaque(g, "a", 1.0 / d.rate, dt, () => {
      const a = versJoueur(g, ex, ey);
      for (let k = -2; k <= 2; k++) balle(g, "vert", ex, ey, a + k * 0.2, 150 * d.v, 6.5);
    }) },
  ],
  2: [
    { duree: 7, tir: (g, dt, d, ex, ey) => {
      chaque(g, "a", 0.085 / d.rate, dt, () => { const a = g.tA * 1.9 * g.sens; for (let k = 0; k < 4; k++) balle(g, "rouge", ex, ey, a + (k * Math.PI) / 2, 110 * d.v); });
      chaque(g, "b", 1.3 / d.rate, dt, () => { const o = Math.random(); for (let k = 0; k < 18; k++) balle(g, "rouge", ex, ey, o + (k * Math.PI * 2) / 18, 92 * d.v, 6.5); });
    } },
    { duree: 8, tir: (g, dt, d, ex, ey) => {
      chaque(g, "a", 1.55 / d.rate, dt, () => rangee(g, ["OUBLIE"], 64, 17, 100 - (d.rate - 1) * 18, 80 * d.v, "oublie"));
      chaque(g, "b", 0.6 / d.rate, dt, () => balle(g, "rouge", ex, ey, versJoueur(g, ex, ey), 170 * d.v, 6));
    } },
    { duree: 6, tir: (g, dt, d) => chaque(g, "a", 0.26 / d.rate, dt, () => {
      const ox = g.boss.x + (Math.random() - 0.5) * 220, oy = g.boss.y + (Math.random() - 0.5) * 120;
      for (let k = 0; k < 6; k++) balle(g, "rouge", ox, oy, Math.PI * (0.15 + Math.random() * 0.7), (120 + Math.random() * 70) * d.v, 5);
    }) },
    { duree: 6, tir: (g, dt, d, ex, ey) => chaque(g, "a", 0.055 / d.rate, dt, () => {
      const s = Math.sin(g.tA * 2.2) * 1.0;
      balle(g, "rouge", ex, ey, Math.PI / 2 + s, 175 * d.v, 5); balle(g, "rouge", ex, ey, Math.PI / 2 - s, 175 * d.v, 5);
    }) },
  ],
};

export default function CombatMartine({ onQuitter }) {
  const calme = useMemo(estCalme, []);
  const [ecran, setEcran] = useState("debut");        // debut | jeu | pause | fin
  const [niveau, setNiveau] = useState(calme ? "facile" : "normal");
  const [replique, setReplique] = useState("");
  const [grand, setGrand] = useState("");              // un mot en grand, au centre (la bascule)
  const [ligneFin, setLigneFin] = useState(0);
  const [bilan, setBilan] = useState(null);
  const [zone, setZone] = useState({ e: 1, W: W_MIN, large: false });
  const [tourner, setTourner] = useState(false);       // téléphone tenu en largeur : on demande de le tourner
  const [pleinEcran, setPleinEcran] = useState(false);
  const cadre = useRef(null), toile = useRef(null), g = useRef(nouvelEtat(1));
  const ecranRef = useRef(ecran); ecranRef.current = ecran;
  const ligneFinRef = useRef(ligneFin); ligneFinRef.current = ligneFin;
  /* changer d'écran tout de suite pour la boucle (sans attendre le rendu) */
  const allerA = (e) => { ecranRef.current = e; setEcran(e); };
  const touches = useRef(new Set()), doigt = useRef(null);
  const sprites = useMemo(() => (typeof document === "undefined" ? null : {
    vert: orbe(5.5, VERT), vert65: orbe(6.5, VERT), rouge: orbe(5.5, ROUGE, "#ffe8e0"), rouge65: orbe(6.5, ROUGE, "#ffe8e0"),
    rouge5: orbe(5, ROUGE, "#ffe8e0"), rouge6: orbe(6, ROUGE, "#ffe8e0"), goutte: goutte(), aiguille: aiguille(),
  }), []);
  const dire = (texte, phase) => { setReplique(texte); g.current.parle = 1.4; sonVoix(phase); };
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
      /* Entrée ou Espace font avancer la fin (sauf sur un bouton, qui le fait déjà) */
      if (ecranRef.current === "fin" && (e.key === "Enter" || e.key === " ")) { if (e.target?.tagName !== "BUTTON") suiteFinRef.current(); return; }
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

  /* l'expression du visage, qui glisse doucement vers son but */
  function expression(st, dt, but) {
    const k = Math.min(1, dt * 6);
    st.expr.fronce = vers(st.expr.fronce, but.fronce, k);
    st.expr.triste = vers(st.expr.triste, but.triste || 0, k);
    st.expr.dents = vers(st.expr.dents, but.dents || 0, k);
  }
  function fond(st, dt) {
    st.pluie.forEach((p) => { p.y += p.v * dt * (calme ? 0.3 : 1); if (p.y > H + 40) p.y = -40; });
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
    if (fin) {
      expression(st, dt, { fronce: 0, triste: 1 });
      /* à la dernière réplique, l'œil faiblit */
      const but = ligneFinRef.current >= FIN.length - 1 ? 0.55 : 0.85;
      st.lumiere = vers(st.lumiere, but, Math.min(1, dt * 1.5)) * (calme ? 1 : 0.97 + 0.03 * Math.sin(st.t * 23) * Math.sin(st.t * 7));
    } else expression(st, dt, { fronce: st.phase === 2 ? 1 : 0.15, dents: st.phase === 2 ? 1 : 0 });
    majEtincelles(st, dt);
    fond(st, dt);
  }

  function avancer(st, dt) {
    const W = st.W, d = { rate: st.dif, v: 0.7 + 0.3 * st.dif };
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

    /* MARTINE bouge, parle, change de visage */
    st.tPhase += dt;
    const ampl = st.phase === 1 ? 60 + (W - W_MIN) * 0.12 : 80 + (W - W_MIN) * 0.16;
    st.boss.x = W / 2 + Math.sin(st.tPhase * (st.phase === 1 ? 0.5 : 0.75)) * ampl;
    st.boss.y = BY + st.gros * 80 + Math.sin(st.tPhase * 0.9) * 6;
    st.gros = vers(st.gros, st.bascule > 0 ? 0.45 : 0, Math.min(1, dt * 3));
    st.boss.flash = Math.max(0, st.boss.flash - dt * 6);
    st.parle = Math.max(0, st.parle - dt);
    st.glitch = Math.max(0, st.glitch - dt);
    if (st.phase === 2 && Math.random() < dt * 1.2) st.glitch = 0.12;
    st.secousse = Math.max(0, st.secousse - dt);
    if (st.banniere.t > 0) st.banniere.t -= dt;
    fond(st, dt);
    /* phase 1 : sourcil levé, sourire poli (il se fronce un instant quand elle est touchée) ;
       à la bascule puis en phase 2 : sourcil en V et sourire à dents */
    const fache = st.phase === 2 || (st.bascule > 0 && st.bascule < 2.1);
    expression(st, dt, fache ? { fronce: 1, dents: 1 } : { fronce: Math.min(1, 0.15 + st.boss.flash * 1.6) });

    /* la bascule entre les deux phases : « Assez. », l'œil vire au rouge */
    if (st.bascule > 0) {
      st.bascule -= dt;
      st.rouge = Math.min(1, st.rouge + dt * 0.7);
      majEtincelles(st, dt);
      if (st.bascule <= 0) {
        Object.assign(st, { phase: 2, pv: PV[2], vies: 3, invul: 1.5, attaque: 0, tA: -0.8, acc: {}, tPhase: 0, tLigne: 4, tMis: 0, rouge: 1 });
        st.banniere = { texte: "PHASE 2", t: 1.6 };
        setGrand(""); sonPhase(); phaseMusique(2);
      }
      return;
    }
    /* tous les souvenirs perdus : on attend, puis la phase recommence */
    if (st.perdu > 0) {
      st.perdu -= dt;
      majEtincelles(st, dt);
      if (st.perdu <= 0) {
        Object.assign(st, { pv: PV[st.phase], vies: 3, invul: 1.5, attaque: 0, tA: -1.5, acc: {}, balles: [], missiles: [], tirs: [], tMis: 0 });
        st.banniere = { texte: "Tout recommence…", t: 1.8 };
        st.stats.recommencees++;
      }
      return;
    }
    /* MARTINE vaincue */
    if (st.victoire > 0) {
      st.victoire -= dt;
      if (Math.random() < dt * 12) eclats(st, st.boss.x + (Math.random() - 0.5) * 240, st.boss.y + (Math.random() - 0.5) * 170, 10, "#ffd166");
      if (!calme) st.secousse = 0.2;
      majEtincelles(st, dt);
      if (st.victoire <= 0) {
        const s = st.stats;
        setBilan({ temps: Math.round((performance.now() - s.debut) / 1000), touches: s.touches, recommencees: s.recommencees });
        setReplique(""); setLigneFin(0); allerA("fin"); sonVoix(2); st.parle = 1.4;
      }
      return;
    }

    /* les répliques, de temps en temps */
    st.tLigne += dt;
    if (st.tLigne > 8) { st.tLigne = 0; const l = LIGNES[st.phase]; direRef.current(l[st.iLigne++ % l.length], st.phase); }

    /* tir automatique */
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
          if (m.pv <= 0) { eclats(st, m.x, m.y, 12, "#ffd166"); sonPop(); }
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
    /* et de temps en temps, des missiles */
    st.tMis += dt;
    const periode = (st.phase === 1 ? 7.5 : 4.8) / d.rate;
    if (st.tPhase > 6 && st.tMis > periode) { st.tMis = 0; lancerMissiles(st, st.phase === 1 ? 2 : d.rate < 0.8 ? 2 : 3, d); }

    /* les projectiles de MARTINE */
    const touche = st.invul <= 0;
    let toucheJoueur = false;   // ou le type de ce qui a touché
    st.balles = st.balles.filter((b) => {
      b.x += b.vx * dt; b.y += b.vy * dt; b.age += dt;
      if (touche && !toucheJoueur) {
        if (b.w) {
          if (b.age > 0.3 && Math.abs(b.x - j.x) < b.w / 2 - 2 + HIT && Math.abs(b.y - j.y) < b.h / 2 - 2 + HIT) toucheJoueur = b.type;
        } else if (Math.hypot(b.x - j.x, b.y - j.y) < b.r * 0.72 + HIT) toucheJoueur = b.type;
      }
      return b.x > -40 && b.x < W + 40 && b.y > -40 && b.y < H + 40;
    });
    const virage = (st.phase === 1 ? 1.3 : 1.7) * dt;
    st.missiles = st.missiles.filter((m) => {
      if (m.pv <= 0) return false;
      const ecart = ((versJoueur(st, m.x, m.y) - m.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      m.a += Math.max(-virage, Math.min(virage, ecart));
      m.v = Math.min(m.v + 30 * dt, 165 * d.v);
      m.vx = Math.cos(m.a) * m.v; m.vy = Math.sin(m.a) * m.v;
      m.x += m.vx * dt; m.y += m.vy * dt; m.vie -= dt;
      if (touche && !toucheJoueur && Math.hypot(m.x - j.x, m.y - j.y) < 5 + HIT) { toucheJoueur = "missile"; return false; }
      if (m.vie <= 0) { eclats(st, m.x, m.y, 6, "#c8d4e2"); return false; }
      return true;
    });
    if (toucheJoueur) {
      st.vies--; st.invul = 2.2; st.stats.touches++; sonJoueurTouche();
      st.stats.par[toucheJoueur] = (st.stats.par[toucheJoueur] || 0) + 1;
      if (!calme) st.secousse = 0.35;
      /* un peu de répit : ce qui est tout près disparaît */
      st.balles = st.balles.filter((b) => { const loin = Math.hypot(b.x - j.x, b.y - j.y) > 110; if (!loin) eclats(st, b.x, b.y, 1, "#ffffff"); return loin; });
      if (st.vies <= 0) {
        st.perdu = 2.6;
        st.balles.forEach((b) => eclats(st, b.x, b.y, 1, "#ffffff")); st.balles = []; st.missiles = [];
        direRef.current(MOQUERIE, st.phase);
      }
    }
    majEtincelles(st, dt);

    /* fin de phase */
    if (st.pv <= 0) {
      st.balles.forEach((b) => eclats(st, b.x, b.y, 1, "#ffd166"));
      st.missiles.forEach((m) => eclats(st, m.x, m.y, 6, "#ffd166"));
      st.balles = []; st.missiles = []; st.tirs = []; st.pv = 0;
      sonExplosion();
      if (st.phase === 1) {
        st.bascule = 2.6;
        setReplique(""); setGrand(BASCULE); sonVoix(2); st.parle = 1.2;
      } else {
        st.victoire = 3; arreterMusique();
      }
    }
  }

  function eclats(st, x, y, n, couleur) {
    if (st.etincelles.length > 500) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 110;
      st.etincelles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: 0.5 + Math.random() * 0.4, couleur });
    }
  }
  function majEtincelles(st, dt) {
    st.etincelles = st.etincelles.filter((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.vie -= dt; return p.vie > 0; });
  }

  function dessiner(st) {
    const cv = toile.current; if (!cv || !sprites) return;
    const W = st.W, c = cv.getContext("2d"), k = cv.height / H;
    c.setTransform(k, 0, 0, k, 0, 0);
    if (st.secousse > 0) c.translate((Math.random() - 0.5) * 6 * st.secousse, (Math.random() - 0.5) * 6 * st.secousse);
    /* le fond : la salle des serveurs, des lignes de données qui tombent */
    const fd = c.createLinearGradient(0, 0, 0, H); fd.addColorStop(0, "#04070c"); fd.addColorStop(1, "#08111c");
    c.fillStyle = fd; c.fillRect(-10, -10, W + 20, H + 20);
    const col = mix(VERT, ROUGE, st.rouge);
    c.fillStyle = rgb(col, 0.09);
    st.pluie.forEach((p) => c.fillRect(p.x, p.y, 1.5, p.l));
    c.strokeStyle = "rgba(40,60,80,0.35)"; c.lineWidth = 1;
    for (let x = 0; x <= W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }

    grandeMartine(c, st, calme);

    /* tirs du joueur */
    st.tirs.forEach((t) => c.drawImage(sprites.aiguille.cv, t.x - 4, t.y - 10, 8, 20));
    /* projectiles de MARTINE */
    c.textAlign = "center"; c.textBaseline = "middle";
    st.balles.forEach((b) => {
      if (b.w) {
        c.globalAlpha = Math.min(1, b.age / 0.3);
        const oublie = b.type === "oublie";
        rondRect(c, b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 3);
        c.fillStyle = oublie ? "rgba(34,4,4,0.94)" : "rgba(4,22,12,0.94)"; c.fill();
        c.strokeStyle = oublie ? "#ff3a2a" : "#5eff9e"; c.lineWidth = 1.3; c.stroke();
        c.fillStyle = oublie ? "#ffd8d0" : "#e8fff0";
        c.font = oublie ? "800 10px ui-monospace, monospace" : "700 7px ui-monospace, monospace";
        c.fillText(b.txt, b.x, b.y + 0.5);
        c.globalAlpha = 1;
      } else if (b.type === "goutte") {
        const s = sprites.goutte; c.drawImage(s.cv, b.x - 10, b.y - 17, s.w, s.h);
      } else {
        const s = b.type === "vert" ? (b.r > 6 ? sprites.vert65 : sprites.vert) : (b.r > 6 ? sprites.rouge65 : b.r > 5.5 ? sprites.rouge6 : b.r < 5.5 ? sprites.rouge5 : sprites.rouge);
        c.drawImage(s.cv, b.x - s.d / 2, b.y - s.d / 2, s.d, s.d);
      }
    });
    c.textBaseline = "alphabetic";
    st.missiles.forEach((m) => missile(c, m, col, st.t));
    /* étincelles */
    st.etincelles.forEach((p) => { c.globalAlpha = Math.min(1, p.vie * 2); c.fillStyle = p.couleur; c.fillRect(p.x - 1, p.y - 1, 2, 2); });
    c.globalAlpha = 1;
    /* la petite MARTINE */
    if (ecranRef.current !== "fin") petiteMartine(c, st.joueur.x, st.joueur.y, st.t, st.focus, st.invul <= 0 || Math.floor(st.t * 10) % 2 === 0);

    /* jauge de MARTINE et souvenirs */
    c.setTransform(k, 0, 0, k, 0, 0);
    c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(14, 8, W - 28, 5);
    c.fillStyle = rgb(col); c.fillRect(14, 8, (W - 28) * Math.max(0, st.pv / PV[st.phase]), 5);
    c.font = "700 7px ui-monospace, monospace"; c.textAlign = "right"; c.fillStyle = rgb(col, 0.8);
    c.fillText(`MARTINE · ${st.phase === 1 ? "I" : "II"}`, W - 14, 23);
    c.fillStyle = "rgba(200,212,226,0.75)"; c.fillText("SOUVENIRS", W - 14 - 3 * 14, H - 9);
    for (let i = 0; i < 3; i++) {
      c.beginPath(); c.arc(W - 14 - i * 13, H - 12, 4.5, 0, Math.PI * 2);
      if (i < st.vies) { c.fillStyle = "#ffd166"; c.fill(); } else { c.strokeStyle = "rgba(255,209,102,0.5)"; c.lineWidth = 1; c.stroke(); }
    }
    if (st.banniere.t > 0) {
      c.globalAlpha = Math.min(1, st.banniere.t * 1.5); c.textAlign = "center"; c.font = "800 16px ui-monospace, monospace";
      c.fillStyle = "#ffffff"; c.fillText(st.banniere.texte, W / 2, H * 0.55); c.globalAlpha = 1;
    }
  }

  /* ───────── les écrans ───────── */
  const commencer = () => {
    g.current = nouvelEtat(NIVEAUX[niveau], zone.W);
    g.current.zoomMax = zone.W >= 560 ? 2.05 : 1.34;
    g.current.stats.debut = performance.now();
    g.current.banniere = { texte: "PHASE 1", t: 1.6 };
    setReplique(""); setGrand(""); setBilan(null); allerA("jeu");
    demarrerMusique(1);
    setTimeout(() => direRef.current(OUVERTURE, 1), 900);
  };
  const recommencer = () => {
    arreterMusique(); g.current = nouvelEtat(1, zone.W); setReplique(""); setGrand(""); setLigneFin(0); allerA("debut");
  };
  const suiteFin = () => {
    if (ligneFinRef.current < FIN.length) { setLigneFin(ligneFinRef.current + 1); sonVoix(2); g.current.parle = 1.4; }
  };
  const suiteFinRef = useRef(suiteFin); suiteFinRef.current = suiteFin;
  const quitter = () => { arreterMusique(); if (onQuitter) onQuitter(); else window.location.href = window.location.pathname; };
  const basculerPleinEcran = () => {
    try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch { /* refusé */ }
  };

  const { e: echelle, W: Wz, large } = zone;
  const largeur = Wz * echelle, hauteur = H * echelle;
  const bouton = (fond, texte) => ({ background: fond, color: texte, border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "ui-monospace, monospace", fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: "pointer" });
  const carte = { position: "absolute", left: "50%", transform: "translateX(-50%)", width: Math.min(largeur - 24, 520), boxSizing: "border-box", background: "rgba(4,8,14,0.92)", border: "1px solid rgba(94,255,158,0.35)", borderRadius: 12, padding: "14px 16px", color: "#e8eef5", fontFamily: "Palatino, Georgia, serif" };
  const couleurReplique = rgb(mix(VERT, ROUGE, g.current.rouge));
  const taillePolice = Math.round(Math.max(17, Math.min(28, 21 * echelle)));
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
          <div style={{ position: "absolute", right: 14 * echelle, top: 30 * echelle }}>{boutonsCoin}</div>
        </>)}

        {/* la bascule : un mot, en grand, au centre */}
        {grand && (
          <div style={{ position: "absolute", left: 0, right: 0, top: "40%", textAlign: "center", fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontSize: Math.round(46 * echelle), color: "#ff5a4a", textShadow: "0 0 24px rgba(255,58,42,0.8), 0 0 4px #000", pointerEvents: "none", animation: "cmGrand 0.5s ease-out both" }}>
            {grand}
          </div>
        )}
        <style>{"@keyframes cmGrand { from { opacity: 0; transform: scale(1.3); } to { opacity: 1; transform: none; } }"}</style>

        {ecran === "debut" && (
          <div style={{ ...carte, top: "34%", maxHeight: "62%", overflowY: "auto" }}>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 3, color: "#5eff9e" }}>◈ NIVEAU −3 · SERVEURS</div>
            <p style={{ margin: "8px 0", fontSize: 15 }}>MARTINE ne se laissera pas débrancher.</p>
            <ul style={{ margin: "0 0 10px", paddingLeft: 18, fontSize: 13, lineHeight: 1.5, color: "#c8d4e2" }}>
              <li>Déplace la petite MARTINE : glisse le doigt, bouge la souris, ou les flèches (Z Q S D).</li>
              <li>Elle tire toute seule. Maintiens <b>Maj</b> pour aller lentement. Ses tirs abattent les missiles.</li>
              <li>Seul son hublot compte : le point blanc.</li>
            </ul>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              {Object.keys(NIVEAUX).map((n) => (
                <button key={n} onClick={() => setNiveau(n)} style={{ ...bouton(niveau === n ? "#5eff9e" : "rgba(255,255,255,0.06)", niveau === n ? "#06110b" : "#c8d4e2"), padding: "6px 12px", fontSize: 12 }}>
                  {n[0].toUpperCase() + n.slice(1)}
                </button>
              ))}
            </div>
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

        {/* MARTINE vaincue, en gros plan : la révélation, en grand, au centre */}
        {ecran === "fin" && (ligneFin < FIN.length ? (
          <div onClick={suiteFin} style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "5%", width: Math.min(largeur - 32, 900), textAlign: "center", cursor: "pointer" }}>
            <p key={ligneFin} style={{ margin: "0 0 14px", fontFamily: "Palatino, Georgia, serif", fontStyle: "italic", fontSize: taillePolice, lineHeight: 1.4, color: "#ffe8e4",
              textShadow: "0 0 18px rgba(255,58,42,0.45), 0 2px 6px rgba(0,0,0,0.95)", animation: "cmGrand 0.6s ease-out both" }}>
              {FIN[ligneFin]}
            </p>
            <button onClick={(e) => { e.stopPropagation(); suiteFin(); }} autoFocus style={bouton("rgba(255,232,228,0.14)", "#ffe8e4")}>Suite ▸</button>
          </div>
        ) : (
          <div style={{ ...carte, bottom: 18, borderColor: "rgba(255,58,42,0.5)" }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, lineHeight: 1.5, color: "#c8d4e2" }}>
              Fin du prototype : ici viendront T'ÉTEINDRE, TE MODIFIER et TE FAIRE CONFIANCE.
            </p>
            {bilan && (
              <p style={{ margin: "0 0 10px", fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: "#8fa3bd" }}>
                {niveau} · {Math.floor(bilan.temps / 60)} min {String(bilan.temps % 60).padStart(2, "0")} s · souvenirs perdus : {bilan.touches} · phases recommencées : {bilan.recommencees}
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
