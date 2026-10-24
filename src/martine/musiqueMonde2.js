/* ============================================================
   LE MONDE 2 — la musique : du vent et une petite boîte à musique
   ------------------------------------------------------------
   Synthétisée en Web Audio, comme les autres sons du jeu (aucun
   fichier, aucune licence). Volume bas : c'est un fond.
   - le vent : un bruit brun filtré, dont le filtre et le volume
     ondulent lentement (les rafales), et un sifflement très léger ;
   - la boîte à musique : un air en la mineur, à trois temps, joué
     dans l'aigu (son de lame : une note pure et une harmonique brève),
     avec un écho. À chaque tour elle ralentit et descend un peu, comme
     un ressort qui se détend, puis se tait quelques secondes et repart.
   Respecte le réglage muet du jeu (engine/audio.js, « martine.muted »).
   Doit être lancée depuis un clic (règle des navigateurs).
   ============================================================ */
import { isMuted } from "../engine/audio.js";

/* l'air : [note de la mélodie, note grave] par croche, null = silence */
const A3 = 220, E4 = 329.63, F4 = 349.23, A4 = 440;
const GS5 = 830.61, A5 = 880, B5 = 987.77, C6 = 1046.5, D6 = 1174.66, E6 = 1318.51;
export const AIR = [
  [E6, A4], [null, null], [C6, null],
  [A5, A4], [B5, null], [C6, null],
  [B5, E4], [null, null], [GS5, null],
  [A5, A4], [null, null], [null, null],
  [E6, A4], [null, null], [D6, null],
  [C6, F4], [B5, null], [A5, null],
  [GS5, E4], [null, null], [B5, null],
  [A5, A3], [null, null], [null, null],
];
const CROCHE = 0.52;  // secondes
const VOLUME = 0.5;   // volume général (le vent et la boîte sont déjà bas)

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
function onde(ctx, param, centre, profondeur, freq, phase = 0) {
  param.value = centre;
  const o = ctx.createOscillator();
  o.frequency.value = freq;
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

/* ───────────── lecture ───────────── */
let m = null; // { ctx, general, vent, minuteur }

function auPremierPlan() {
  if (!m) return;
  if (document.hidden) m.ctx.suspend?.(); else m.ctx.resume?.();
}

/** Lance la musique (depuis un clic). Sans effet si le jeu est muet. */
export function demarrerMusique() {
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

  let prochain = ctx.currentTime + 3, pas = 0, tour = 0;
  const minuteur = setInterval(() => {
    while (prochain < ctx.currentTime + 0.4) {
      const [haut, bas] = AIR[pas];
      const ressort = 1 - 0.011 * tour;                       // la boîte descend un peu à chaque tour
      const ral = pas >= AIR.length - 6 ? 1 + (pas - (AIR.length - 7)) * 0.12 : 1; // ralenti final
      if (haut) jouerNote(ctx, bus, prochain, haut * ressort, 0.15 * (0.85 + Math.random() * 0.3));
      if (bas) jouerNote(ctx, bus, prochain, bas * ressort, 0.08);
      prochain += CROCHE * ral * (1 + tour * 0.05);
      pas += 1;
      if (pas >= AIR.length) { pas = 0; tour = (tour + 1) % 4; prochain += 5 + Math.random() * 5; }
    }
  }, 120);
  m = { ctx, general, vent, minuteur };
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
