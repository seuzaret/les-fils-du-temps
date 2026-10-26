/* ============================================================
   JEU 3 — sons du combat contre MARTINE (Web Audio, synthétisés)
   ------------------------------------------------------------
   Une boucle de combat (basse, arpèges, batterie) en la mineur :
   phase 1 à 150, la – fa – do – sol ; phase 2 à 168, plus tendue,
   la – si♭ – fa – mi. Des bruitages courts (MARTINE touchée, le
   joueur touché, changement de phase, victoire, la voix de
   MARTINE). Aucun fichier. Respecte le bouton muet du jeu.
   ============================================================ */
import { isMuted } from "../../engine/audio.js";

let ctx = null, maitre = null, bruit = null;
const hz = (n) => 440 * 2 ** ((n - 69) / 12);

function audio() {
  if (isMuted()) return null;
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    maitre = ctx.createGain();
    maitre.gain.value = 0.5;
    const comp = ctx.createDynamicsCompressor();
    maitre.connect(comp).connect(ctx.destination);
    bruit = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = bruit.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/* une note : oscillateur → (filtre) → enveloppe → sortie */
function note(type, f, t, dur, vol, { filtre, f2 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let sortie = o;
  if (filtre) { const b = ctx.createBiquadFilter(); b.type = "lowpass"; b.frequency.value = filtre; o.connect(b); sortie = b; }
  sortie.connect(g).connect(maitre);
  o.start(t); o.stop(t + dur + 0.02);
}
function souffle(t, dur, vol, type, freq) {
  const s = ctx.createBufferSource(), b = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = bruit;
  b.type = type; b.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(b).connect(g).connect(maitre);
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
}

/* ───────── la musique ───────── */
const ACCORDS = {
  1: [[45, [0, 3, 7]], [41, [0, 4, 7]], [48, [0, 4, 7]], [43, [0, 4, 7]]],
  2: [[45, [0, 3, 7]], [46, [0, 4, 7]], [41, [0, 4, 7]], [40, [0, 4, 7]]],
};
const TEMPO = { 1: 150, 2: 168 };
let seq = null;

function pas(phase, i, t) {
  const [racine, acc] = ACCORDS[phase][Math.floor(i / 16) % 4];
  const k = i % 16;
  /* basse en croches : fondamentale, octave sur le contretemps */
  if (k % 2 === 0) note("sawtooth", hz(racine + (k % 4 === 2 ? 12 : 0)), t, 0.16, 0.07, { filtre: 520 });
  /* arpège en doubles croches, qui monte et redescend */
  const motif = [0, 1, 2, 3, 2, 1, 2, 3];
  const n = racine + 24 + (motif[k % 8] === 3 ? 12 : acc[motif[k % 8]]);
  note(phase === 1 ? "triangle" : "square", hz(n), t, 0.09, phase === 1 ? 0.035 : 0.018, { filtre: phase === 1 ? 4000 : 2600 });
  if (phase === 2 && k % 4 === 0) note("square", hz(racine + 36 + acc[(k / 4) % 3]), t, 0.12, 0.012, { filtre: 3000 });
  /* batterie */
  const kick = phase === 1 ? k === 0 || k === 8 || k === 10 : k % 4 === 0;
  if (kick) note("sine", 150, t, 0.16, 0.22, { f2: 42 });
  if (k === 4 || k === 12) { souffle(t, 0.14, 0.07, "bandpass", 1800); note("triangle", 190, t, 0.08, 0.04); }
  if (phase === 1 ? k % 4 === 2 : k % 2 === 1) souffle(t, 0.035, 0.03, "highpass", 7500);
}

export function demarrerMusique(phase = 1) {
  if (!audio()) return;
  arreterMusique();
  const etat = { phase, i: 0, t: ctx.currentTime + 0.08 };
  const tic = () => {
    if (isMuted()) { arreterMusique(); return; }
    const d = 60 / TEMPO[etat.phase] / 4;
    while (etat.t < ctx.currentTime + 0.15) { pas(etat.phase, etat.i, etat.t); etat.t += d; etat.i++; }
  };
  seq = { etat, id: setInterval(tic, 25) };
  tic();
}
/* la phase 2 commence au début de la mesure suivante */
export function phaseMusique(phase) {
  if (!seq) { demarrerMusique(phase); return; }
  seq.etat.phase = phase;
  seq.etat.i = Math.ceil(seq.etat.i / 16) * 16;
}
export function arreterMusique() {
  if (seq) { clearInterval(seq.id); seq = null; }
}

/* ───────── les bruitages ───────── */
let dernierTouche = 0;
export function sonTouche() {
  if (!audio() || ctx.currentTime - dernierTouche < 0.07) return;
  dernierTouche = ctx.currentTime;
  note("square", 980, ctx.currentTime, 0.05, 0.02, { f2: 700, filtre: 3500 });
}
export function sonJoueurTouche() {
  if (!audio()) return;
  const t = ctx.currentTime;
  souffle(t, 0.35, 0.16, "lowpass", 1200);
  note("sawtooth", 420, t, 0.55, 0.09, { f2: 70, filtre: 1500 });
}
export function sonPhase() {
  if (!audio()) return;
  const t = ctx.currentTime;
  [0, 1, 2, 3, 4, 5].forEach((k) => note("square", k % 2 ? 660 : 880, t + k * 0.16, 0.14, 0.035, { filtre: 2500 }));
}
export function sonExplosion() {
  if (!audio()) return;
  const t = ctx.currentTime;
  souffle(t, 1.6, 0.22, "lowpass", 900);
  note("sine", 120, t, 1.2, 0.25, { f2: 30 });
}
export function sonVictoire() {
  if (!audio()) return;
  const t = ctx.currentTime + 0.1;
  [69, 73, 76, 81, 85, 88].forEach((n, k) => note("triangle", hz(n), t + k * 0.11, 0.6, 0.06));
}
/* MARTINE parle : quelques bips de machine, plus graves et désordonnés en phase 2 */
export function sonVoix(phase = 1) {
  if (!audio()) return;
  const t = ctx.currentTime;
  for (let k = 0; k < 5; k++) {
    const f = (phase === 1 ? 520 : 300) + Math.random() * (phase === 1 ? 380 : 520);
    note("square", f, t + k * 0.06, 0.045, 0.014, { filtre: 2200 });
  }
}
