/* ============================================================
   JEU 3 — sons du combat contre MARTINE (Web Audio, synthétisés)
   ------------------------------------------------------------
   Une boucle de combat (basse, arpèges, batterie) en la mineur, un
   style par niveau, de plus en plus nerveux (voir STYLES). Des
   bruitages courts (MARTINE touchée, le joueur touché, changement
   de niveau, missiles, victoire, la voix de MARTINE). Aucun
   fichier. Respecte le bouton muet du jeu.
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
/* un style par niveau : la verte (150, la – fa – do – sol), la bleue (158, la – sol – fa – mi,
   la cadence andalouse), la rouge (168, la – si♭ – fa – mi) */
const STYLES = {
  1: { tempo: 150, accords: [[45, [0, 3, 7]], [41, [0, 4, 7]], [48, [0, 4, 7]], [43, [0, 4, 7]]], arp: "triangle", vArp: 0.035 },
  2: { tempo: 158, accords: [[45, [0, 3, 7]], [43, [0, 4, 7]], [41, [0, 4, 7]], [40, [0, 4, 7]]], arp: "square", vArp: 0.02 },
  3: { tempo: 168, accords: [[45, [0, 3, 7]], [46, [0, 4, 7]], [41, [0, 4, 7]], [40, [0, 4, 7]]], arp: "square", vArp: 0.018 },
};
let seq = null;

function pas(niveau, i, t) {
  const st = STYLES[niveau];
  const [racine, acc] = st.accords[Math.floor(i / 16) % 4];
  const k = i % 16;
  /* basse en croches : fondamentale, octave sur le contretemps */
  if (k % 2 === 0) note("sawtooth", hz(racine + (k % 4 === 2 ? 12 : 0)), t, 0.16, 0.07, { filtre: niveau === 1 ? 520 : 680 });
  /* arpège en doubles croches, qui monte et redescend */
  const motif = [0, 1, 2, 3, 2, 1, 2, 3];
  const n = racine + 24 + (motif[k % 8] === 3 ? 12 : acc[motif[k % 8]]);
  note(st.arp, hz(n), t, 0.09, st.vArp, { filtre: niveau === 1 ? 4000 : 2600 });
  if (niveau === 3 && k % 4 === 0) note("square", hz(racine + 36 + acc[(k / 4) % 3]), t, 0.12, 0.012, { filtre: 3000 });
  if (niveau === 2 && k % 8 === 4) note("triangle", hz(racine + 31), t, 0.3, 0.02, { filtre: 3000 });
  /* batterie */
  const kick = niveau === 1 ? k === 0 || k === 8 || k === 10 : k % 4 === 0 || (niveau === 3 && k === 14);
  if (kick) note("sine", 150, t, 0.16, 0.22, { f2: 42 });
  if (k === 4 || k === 12) { souffle(t, 0.14, 0.07, "bandpass", 1800); note("triangle", 190, t, 0.08, 0.04); }
  if (niveau === 1 ? k % 4 === 2 : niveau === 2 ? k % 2 === 1 : true) souffle(t, 0.035, niveau === 3 ? 0.022 : 0.03, "highpass", 7500);
}

export function demarrerMusique(phase = 1) {
  if (!audio()) return;
  arreterMusique();
  const etat = { phase, i: 0, t: ctx.currentTime + 0.08 };
  const tic = () => {
    if (isMuted()) { arreterMusique(); return; }
    const d = 60 / STYLES[etat.phase].tempo / 4;
    while (etat.t < ctx.currentTime + 0.15) { pas(etat.phase, etat.i, etat.t); etat.t += d; etat.i++; }
  };
  seq = { etat, id: setInterval(tic, 25) };
  tic();
}
/* le niveau suivant commence au début de la mesure suivante */
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
/* un missile part : un souffle qui monte et un petit cri de machine */
export function sonMissile() {
  if (!audio()) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource(), b = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = bruit; b.type = "bandpass"; b.Q.value = 4;
  b.frequency.setValueAtTime(500, t); b.frequency.exponentialRampToValueAtTime(2600, t + 0.45);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  src.connect(b).connect(g).connect(maitre); src.start(t); src.stop(t + 0.55);
  note("square", 1200, t, 0.12, 0.02, { f2: 1700, filtre: 3000 });
}
/* un missile abattu */
export function sonPop() {
  if (!audio()) return;
  const t = ctx.currentTime;
  souffle(t, 0.22, 0.12, "lowpass", 1600);
  note("triangle", 660, t, 0.12, 0.05, { f2: 220 });
}
