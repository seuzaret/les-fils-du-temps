/* ============================================================
   LE MONDE 2 — la musique : du vent et une petite boîte à musique
   ------------------------------------------------------------
   Synthétisée en Web Audio, comme les autres sons du jeu (aucun
   fichier, aucune licence). Volume très bas : c'est un fond.
   - le vent : un bruit brun filtré, dont le filtre et le volume
     ondulent lentement (les rafales), et un sifflement très léger ;
   - la boîte à musique : un air par époque (AIRS), joué dans l'aigu
     (son de lame : une note pure et une harmonique brève), avec un
     écho. À chaque tour elle ralentit et descend un peu, comme un
     ressort qui se détend, puis se tait quelques secondes et repart.
     Changer d'époque change d'air à la fin de la mesure en cours ;
   - grincer() : quand MARTINE parle, le ressort cliquette, la boîte
     grince et peine (plus grave et plus lente) pendant trois secondes.
   Les airs sont composés pour le jeu (aucun air existant n'est repris).
   Respecte le réglage muet du jeu (engine/audio.js, « martine.muted »).
   Doit être lancée depuis un clic (règle des navigateurs).
   ============================================================ */
import { isMuted } from "../engine/audio.js";

const VOLUME = 0.16;  // volume général (≈ −10 dB par rapport à la première version)

/* « A5 » → fréquence (la 4 = 440 Hz) */
const DEMI = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
function freq(nom) {
  const m = /^([A-G])([#b]?)(\d)$/.exec(nom);
  const demi = DEMI[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (Number(m[3]) - 4) * 12;
  return 440 * 2 ** (demi / 12);
}
/* « E6/A4 - C6 | … » → [[mélodie, basse], …] par croche ; « - » = silence,
   « /A4 » = basse seule ; les barres de mesure ne servent qu'à la lecture */
function lire(partition) {
  return partition.split(/\s+/).filter((x) => x && x !== "|").map((tok) => {
    if (tok === "-") return [null, null];
    const [h, b] = tok.split("/");
    return [h ? freq(h) : null, b ? freq(b) : null];
  });
}

/* un air par époque : mode, mesure et tempo changent, le timbre reste */
const air = (croche, mesure, partition) => ({ croche, mesure, pas: lire(partition) });
export const AIRS = {
  /* pentatonique de la, très lent, beaucoup de silences */
  "01-paleolithique": air(0.7, 3, "A5/A3 - - | C6 - - | D6 - E6 | - - - | G5/E3 - - | A5 - G5 | E5 - - | - - -"),
  /* pentatonique de ré, la même note grave qui revient */
  "02-neolithique": air(0.6, 3, "D6/D4 - A5 | F5 - G5 | A5/D4 - C6 | A5 - - | G5/D4 - F5 | D5 - F5 | G5/A3 - A5 | D5/D4 - -"),
  /* mode « hijaz » sur la (seconde augmentée si bémol – do dièse) */
  "03-mesopotamie": air(0.56, 3, "A5/A3 - Bb5 | C#6 - Bb5 | A5/D4 - G5 | F5 E5 - | D5/D4 - E5 | F5 - E5 | Bb5/A3 C#6 Bb5 | A5/A3 - -"),
  /* ré dorien, à quatre temps */
  "04-antiquite": air(0.46, 4, "A5/D4 - F5 - | G5 - A5 - | B5/G3 - A5 G5 | F5 - E5 - | D5/D4 - F5 - | A5 - C6 - | B5/G3 A5 G5 E5 | D5/D4 - - -"),
  /* mi phrygien, lent, comme un chant d'église */
  "05-moyen-age": air(0.55, 4, "E5/E4 - G5 - | A5 - B5 - | C6/A3 - B5 A5 | B5 - - - | G5/E4 - A5 - | B5 - A5 G5 | F5/D4 - G5 - | E5/E4 - - -"),
  /* sol mineur harmonique, un menuet */
  "06-moderne": air(0.45, 3, "G5/G3 Bb5 D6 | Eb6 - D6 | C6/C4 Bb5 A5 | Bb5 - G5 | F#5/D4 - A5 | C6 Bb5 A5 | A5/D4 F#5 A5 | G5/G3 - -"),
  /* la mineur, une valse (l'air du premier prototype) */
  "07-xixe": air(0.52, 3, "E6/A4 - C6 | A5/A4 B5 C6 | B5/E4 - G#5 | A5/A4 - - | E6/A4 - D6 | C6/F4 B5 A5 | G#5/E4 - B5 | A5/A3 - -"),
  /* mi mineur, valse lente qui descend par demi-tons */
  "08-xxe": air(0.6, 3, "B5/E4 - G5 | E5 - - | C6/C4 - B5 | A#5 - A5 | G5/E4 - F#5 | E5 - D#5 | E5/B3 - - | - - -"),
  /* do mineur, une berceuse en arpèges */
  "09-medias-masse": air(0.34, 4, "G5/C4 C6 Eb6 C6 | G5 C6 Eb6 C6 | Ab5/Ab3 C6 F6 C6 | Ab5 C6 Eb6 C6 | G5/G3 B5 D6 B5 | G5 B5 D6 F6 | Eb6/C4 D6 C6 B5 | C6/C4 - - -"),
  /* gamme par tons, très aiguë, comme du verre */
  "09-xxie": air(0.55, 3, "C6/C4 - D6 | E6 - F#6 | G#6 - - | E6 - - | D6/Bb3 - C6 | Bb5 - D6 | C6 - - | - - -"),
};
export const AIR_PAR_DEFAUT = "01-paleolithique";

/* bruit en boucle, sans clic au raccord : la fin rejoint le début */
function bruit(ctx, secondes, brun) {
  const n = Math.floor(ctx.sampleRate * secondes), N = Math.floor(ctx.sampleRate * 0.25);
  const brut = new Float32Array(n + N);
  let dernier = 0;
  for (let i = 0; i < n + N; i++) {
    const w = Math.random() * 2 - 1;
    if (brun) { dernier = (dernier + 0.02 * w) / 1.02; brut[i] = dernier * 3.5; } else brut[i] = w;
  }
  const b = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = i < N ? brut[i] * (i / N) + brut[n + i] * (1 - i / N) : brut[i];
  return b;
}

/* une oscillation lente branchée sur un paramètre (centre ± profondeur) */
function onde(ctx, param, centre, profondeur, f, phase = 0) {
  param.value = centre;
  const o = ctx.createOscillator();
  o.frequency.value = f;
  const g = ctx.createGain();
  g.gain.value = profondeur;
  o.connect(g); g.connect(param);
  o.start(ctx.currentTime + phase);
  return o;
}

/** Le vent, branché sur `sortie`. Renvoie les sources (pour les arrêter). */
export function construireVent(ctx, sortie) {
  const sources = [];
  /* le souffle : bruit brun, passe-bas qui s'ouvre et se ferme, volume en rafales */
  const souffle = ctx.createBufferSource();
  souffle.buffer = bruit(ctx, 6, true);
  souffle.loop = true;
  const pb = ctx.createBiquadFilter();
  pb.type = "lowpass"; pb.Q.value = 0.8;
  const rafale = ctx.createGain();
  souffle.connect(pb); pb.connect(rafale); rafale.connect(sortie);
  sources.push(souffle, onde(ctx, pb.frequency, 420, 260, 0.055), onde(ctx, rafale.gain, 0.17, 0.09, 0.085, 1.3));
  /* le sifflement : bruit blanc dans un filtre étroit qui glisse */
  const sif = ctx.createBufferSource();
  sif.buffer = bruit(ctx, 5, false);
  sif.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass"; bp.Q.value = 14;
  const gs = ctx.createGain();
  sif.connect(bp); bp.connect(gs); gs.connect(sortie);
  sources.push(sif, onde(ctx, bp.frequency, 880, 260, 0.04), onde(ctx, gs.gain, 0.02, 0.017, 0.067, 2.1));
  /* les ondes lentes sont déjà lancées par onde() ; on lance les deux bruits */
  souffle.start();
  sif.start();
  return sources;
}

/** La boîte à musique : son bus, avec un écho sombre. */
export function construireBoite(ctx, sortie) {
  const bus = ctx.createGain();
  bus.gain.value = 0.55;
  const echo = ctx.createDelay(1);
  echo.delayTime.value = 0.39;
  const retour = ctx.createGain();
  retour.gain.value = 0.36;
  const sombre = ctx.createBiquadFilter();
  sombre.type = "lowpass"; sombre.frequency.value = 2200;
  bus.connect(sortie);
  bus.connect(echo); echo.connect(sombre); sombre.connect(retour); retour.connect(echo);
  sombre.connect(sortie);
  return bus;
}

/** Une lame de boîte à musique : note pure qui s'éteint, et une harmonique brève. */
export function jouerNote(ctx, bus, t, f, v) {
  [[f, v, 1.9], [f * 3.01, v * 0.22, 0.22], [f * 5.4, v * 0.08, 0.08]].forEach(([ff, vv, d]) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = ff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vv, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(bus);
    o.start(t); o.stop(t + d + 0.05);
  });
}

/** Le grincement de la boîte : le ressort qu'on force (cliquetis qui
    ralentissent) et le mécanisme qui frotte (dent de scie grave, filtrée,
    qui tremble et descend). Branché sur `sortie`, à partir de t. */
export function jouerGrincement(ctx, sortie, t) {
  const clic = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
  const d = clic.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  let tc = t;
  for (let i = 0; i < 9; i++) {
    const s = ctx.createBufferSource();
    s.buffer = clic;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 2300 + Math.random() * 900; bp.Q.value = 5;
    const g = ctx.createGain();
    g.gain.value = 1.3 * (1 - i / 12);
    s.connect(bp); bp.connect(g); g.connect(sortie);
    s.start(tc);
    tc += 0.06 + i * 0.022;
  }
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(210, t);
  o.frequency.linearRampToValueAtTime(150, t + 1.1);
  o.frequency.linearRampToValueAtTime(172, t + 1.5);
  const trem = ctx.createOscillator();
  trem.frequency.value = 23;
  const profondeur = ctx.createGain();
  profondeur.gain.value = 28;
  trem.connect(profondeur); profondeur.connect(o.frequency);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass"; bp.frequency.value = 1100; bp.Q.value = 3;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.26, t + 0.15);
  g.gain.linearRampToValueAtTime(0.18, t + 1);
  g.gain.linearRampToValueAtTime(0, t + 1.6);
  o.connect(bp); bp.connect(g); g.connect(sortie);
  o.start(t); trem.start(t);
  o.stop(t + 1.7); trem.stop(t + 1.7);
}

/* ───────────── lecture ───────────── */
let m = null; // { ctx, general, vent, minuteur, peine }
let airVoulu = AIR_PAR_DEFAUT;

function auPremierPlan() {
  if (!m) return;
  if (document.hidden) m.ctx.suspend?.(); else m.ctx.resume?.();
}

/** Change d'air (l'époque) : la boîte finit sa mesure, puis enchaîne. */
export function changerAir(epoque) {
  if (AIRS[epoque]) airVoulu = epoque;
}

/** Quand MARTINE parle : la boîte grince et peine trois secondes. */
export function grincer() {
  if (!m || isMuted()) return;
  const t = m.ctx.currentTime + 0.02;
  try { jouerGrincement(m.ctx, m.general, t); } catch { /* rien */ }
  m.peine = t + 3;
}

/** Lance la musique (depuis un clic). Sans effet si le jeu est muet. */
export function demarrerMusique(epoque) {
  if (epoque) changerAir(epoque);
  if (isMuted() || m) return;
  let ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  } catch { return; }
  const general = ctx.createGain();
  general.gain.setValueAtTime(0, ctx.currentTime);
  general.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 5);
  general.connect(ctx.destination);
  const vent = construireVent(ctx, general);
  const bus = construireBoite(ctx, general);

  let courant = airVoulu, prochain = ctx.currentTime + 3, pas = 0, tour = 0;
  const minuteur = setInterval(() => {
    while (prochain < ctx.currentTime + 0.4) {
      /* nouvelle époque : on enchaîne au début d'une mesure */
      if (courant !== airVoulu && pas % AIRS[courant].mesure === 0) {
        courant = airVoulu; pas = 0; tour = 0; prochain += AIRS[courant].croche;
      }
      const a = AIRS[courant];
      const [haut, bas] = a.pas[pas];
      const peine = m && prochain < m.peine;                  // MARTINE parle : la boîte peine
      const ressort = (1 - 0.011 * tour) * (peine ? 0.94 : 1); // descend un peu à chaque tour
      const derniere = a.pas.length - 2 * a.mesure;            // ralenti sur les deux dernières mesures
      const ral = pas >= derniere ? 1 + (pas - derniere + 1) * 0.08 : 1;
      const tremble = peine ? 1 + (Math.random() - 0.5) * 0.03 : 1;
      if (haut) jouerNote(ctx, bus, prochain, haut * ressort * tremble, 0.15 * (0.85 + Math.random() * 0.3));
      if (bas) jouerNote(ctx, bus, prochain, bas * ressort, 0.08);
      prochain += a.croche * ral * (1 + tour * 0.05) * (peine ? 1.35 : 1);
      pas += 1;
      if (pas >= a.pas.length) { pas = 0; tour = (tour + 1) % 4; prochain += 5 + Math.random() * 5; }
    }
  }, 120);
  m = { ctx, general, vent, minuteur, peine: 0 };
  document.addEventListener("visibilitychange", auPremierPlan);
  ctx.resume?.();
}

/** Arrête la musique en fondu. */
export function arreterMusique() {
  if (!m) return;
  const { ctx, general, vent, minuteur } = m;
  m = null;
  document.removeEventListener("visibilitychange", auPremierPlan);
  clearInterval(minuteur);
  try {
    general.gain.cancelScheduledValues(ctx.currentTime);
    general.gain.setValueAtTime(general.gain.value, ctx.currentTime);
    general.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
  } catch { /* rien */ }
  setTimeout(() => { vent.forEach((s) => { try { s.stop(); } catch { /* déjà arrêté */ } }); ctx.close?.(); }, 1400);
}
