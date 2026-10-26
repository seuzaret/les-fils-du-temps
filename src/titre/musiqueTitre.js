/* ============================================================
   ÉCRAN TITRE — « Le thème du fil » (musique légère, synthétisée)
   ------------------------------------------------------------
   Aucun fichier : Web Audio, comme les autres sons du jeu. C'est
   le contraire de la boîte à musique inquiétante du monde 2 (la
   mineur) : ré majeur, valse lente (3/4, 80 à la noire), lumineuse.
     · le MOTIF « le fil » : ré mi fa# la, une phrase qui monte
       (A), puis une réponse qui hésite vers si mineur (B), puis le
       motif repris au célesta, une octave au-dessus (A') ;
     · une harpe égrène les accords, une flûte chante la mélodie,
       une nappe très douce tient l'harmonie ;
     · en ouverture, une horloge (tic-tac) qui s'efface : le temps ;
     · une réverbération (réponse impulsionnelle générée) donne
       l'espace.
   Forme : intro 2 mesures · A 8 · B 8 · A' 8 · fin 2 = 28 mesures,
   environ 63 s, puis 5 s de silence et elle recommence.
   Démarre au premier geste (règle des navigateurs), fondu de 3 s,
   s'arrête en fondu quand on quitte l'écran titre ; respecte le
   bouton muet du jeu (martine.muted) ; se tait onglet caché.
   evenements() / programmer() servent aussi au rendu hors ligne
   (OfflineAudioContext) pour l'écouter en fichier.
   ============================================================ */
import { isMuted } from "../engine/audio.js";

const NOIRE = 60 / 80;            // s
const MESURE = 3 * NOIRE;
export const VOLUME = 0.2;
const SILENCE = 5;                // s entre deux tours

/* hauteurs : nom → Hz (la4 = 440) */
const N = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
export function hz(nom) {
  const m = /^([A-G])(#|b)?(\d)$/.exec(nom);
  if (!m) return 0;
  const demi = N[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (Number(m[3]) - 4) * 12;
  return 440 * 2 ** (demi / 12);
}

/* mélodie : [note, durée en noires] ; "-" = silence */
const A = [["D5", 2], ["E5", 1], ["F#5", 2], ["A5", 1], ["B5", 1.5], ["A5", 0.5], ["F#5", 1], ["E5", 3],
           ["D5", 2], ["E5", 1], ["F#5", 2], ["D6", 1], ["C#6", 1.5], ["B5", 0.5], ["A5", 1], ["A5", 3]];
const B = [["B5", 2], ["A5", 1], ["G5", 2], ["F#5", 1], ["E5", 1.5], ["F#5", 0.5], ["G5", 1], ["A5", 3],
           ["B5", 2], ["C#6", 1], ["D6", 2], ["A5", 1], ["G5", 1], ["F#5", 1], ["E5", 1], ["D5", 3]];
/* un accord par mesure (fondamentale, tierce, quinte) */
const ACC = {
  D: ["D3", "A3", "D4", "F#4", "A4"], Bm: ["B2", "F#3", "B3", "D4", "F#4"], A: ["A2", "E3", "A3", "C#4", "E4"],
  G: ["G2", "D3", "G3", "B3", "D4"], Em: ["E3", "B3", "E4", "G4", "B4"], Fs: ["F#2", "C#3", "F#3", "A#3", "C#4"],
};
const GRILLE_A = ["D", "D", "Bm", "A", "D", "Bm", "A", "A"];
const GRILLE_B = ["G", "D", "Em", "A", "G", "Fs", "Em", "D"];

/* La partition complète d'un tour, en événements datés (secondes). */
export function evenements() {
  const ev = [];
  let t = 0;
  const harpe = (grille, debut, doux = 1) => grille.forEach((acc, k) => {
    const n = ACC[acc], t0 = debut + k * MESURE;
    /* arpège en croches : 1 5 8 10 8 5 */
    [0, 1, 2, 3, 2, 1].forEach((j, c) => ev.push({ t: t0 + c * NOIRE / 2, v: "harpe", f: hz(n[Math.min(j, n.length - 1)]), g: (c === 0 ? 0.34 : 0.22) * doux }));
    ev.push({ t: t0, v: "nappe", fs: [hz(n[1]), hz(n[2]), hz(n[3])], d: MESURE * 1.05, g: 0.07 * doux });
  });
  const chant = (melodie, debut, voix, transpo = 1) => {
    let u = debut;
    melodie.forEach(([note, d]) => {
      if (note !== "-") ev.push({ t: u, v: voix, f: hz(note) * transpo, d: d * NOIRE, g: voix === "flute" ? 0.2 : 0.5 });
      u += d * NOIRE;
    });
  };
  /* intro : l'horloge, la harpe seule */
  for (let k = 0; k < 6; k++) ev.push({ t: k * NOIRE, v: "tic", haut: k % 2 === 0, g: 0.11 * (1 - k / 7) });
  harpe(["D", "A"], 0, 0.8);
  t = 2 * MESURE;
  harpe(GRILLE_A, t); chant(A, t, "flute"); t += 8 * MESURE;
  harpe(GRILLE_B, t); chant(B, t, "flute"); t += 8 * MESURE;
  harpe(GRILLE_A, t, 0.72); chant(A, t, "celesta", 2); t += 8 * MESURE;
  /* fin : ré majeur, glissando de harpe qui monte, et l'horloge revient */
  ev.push({ t, v: "nappe", fs: [hz("D4"), hz("F#4"), hz("A4")], d: 2 * MESURE + 2, g: 0.06 });
  ["D4", "F#4", "A4", "D5", "F#5", "A5", "D6"].forEach((n, k) => ev.push({ t: t + k * 0.12, v: "harpe", f: hz(n), g: 0.2 }));
  ev.push({ t: t + 0.05, v: "harpe", f: hz("D3"), g: 0.32 });
  for (let k = 0; k < 4; k++) ev.push({ t: t + MESURE + k * NOIRE, v: "tic", haut: k % 2 === 0, g: 0.05 + k * 0.012 });
  t += 2 * MESURE;
  return { ev: ev.sort((a, b) => a.t - b.t), duree: t };
}
export const DUREE_TOUR = evenements().duree + SILENCE;

/* ───────── les instruments ───────── */
function harpe(ctx, out, t, f, g) {
  const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), e = ctx.createGain(), lp = ctx.createBiquadFilter();
  o1.type = "triangle"; o1.frequency.value = f;
  o2.type = "sine"; o2.frequency.value = f * 2;
  const g2 = ctx.createGain(); g2.gain.value = 0.25;
  lp.type = "lowpass"; lp.frequency.setValueAtTime(Math.min(9000, f * 9), t); lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2.2), t + 1.2);
  e.gain.setValueAtTime(0.0001, t);
  e.gain.exponentialRampToValueAtTime(g, t + 0.006);
  e.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
  o1.connect(lp); o2.connect(g2).connect(lp); lp.connect(e).connect(out);
  o1.start(t); o2.start(t); o1.stop(t + 2.5); o2.stop(t + 2.5);
}
function flute(ctx, out, t, f, d, g, bruit) {
  const o = ctx.createOscillator(), o3 = ctx.createOscillator(), e = ctx.createGain(), vib = ctx.createOscillator(), vg = ctx.createGain();
  o.type = "sine"; o.frequency.value = f;
  o3.type = "triangle"; o3.frequency.value = f; const g3 = ctx.createGain(); g3.gain.value = 0.18;
  vib.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * 0.0035, t + Math.min(0.5, d * 0.6));
  vib.connect(vg); vg.connect(o.frequency); vg.connect(o3.frequency);
  const fin = t + d;
  e.gain.setValueAtTime(0.0001, t);
  e.gain.linearRampToValueAtTime(g, t + 0.09);
  e.gain.setValueAtTime(g * 0.92, Math.max(t + 0.1, fin - 0.12));
  e.gain.linearRampToValueAtTime(0.0001, fin + 0.22);
  o.connect(e); o3.connect(g3).connect(e); e.connect(out);
  /* le souffle : un peu de bruit filtré autour de la note */
  if (bruit) {
    const s = ctx.createBufferSource(); s.buffer = bruit;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f * 2; bp.Q.value = 2.5;
    const sg = ctx.createGain(); sg.gain.setValueAtTime(0.0001, t); sg.gain.linearRampToValueAtTime(g * 0.12, t + 0.06); sg.gain.linearRampToValueAtTime(0.0001, t + 0.35);
    s.connect(bp).connect(sg).connect(out); s.start(t); s.stop(t + 0.4);
  }
  [o, o3, vib].forEach((x) => { x.start(t); x.stop(fin + 0.3); });
}
function celesta(ctx, out, t, f, d, g) {
  const c = ctx.createOscillator(), mo = ctx.createOscillator(), mg = ctx.createGain(), e = ctx.createGain();
  c.type = "sine"; c.frequency.value = f;
  mo.type = "sine"; mo.frequency.value = f * 3.5;
  mg.gain.setValueAtTime(f * 1.4, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.8);
  mo.connect(mg).connect(c.frequency);
  const tenue = Math.max(1.2, d + 0.6);
  e.gain.setValueAtTime(0.0001, t);
  e.gain.exponentialRampToValueAtTime(g, t + 0.004);
  e.gain.exponentialRampToValueAtTime(0.0001, t + tenue);
  c.connect(e).connect(out);
  c.start(t); mo.start(t); c.stop(t + tenue + 0.05); mo.stop(t + tenue + 0.05);
}
function nappe(ctx, out, t, fs, d, g) {
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = 0.4;
  const e = ctx.createGain();
  e.gain.setValueAtTime(0.0001, t);
  e.gain.linearRampToValueAtTime(g, t + 0.9);
  e.gain.setValueAtTime(g, t + Math.max(0.95, d - 0.3));
  e.gain.linearRampToValueAtTime(0.0001, t + d + 0.9);
  lp.connect(e).connect(out);
  fs.forEach((f) => [-5, 5].forEach((cents) => {
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = cents;
    const og = ctx.createGain(); og.gain.value = 0.25;
    o.connect(og).connect(lp); o.start(t); o.stop(t + d + 1);
  }));
}
function tic(ctx, out, t, haut, g, bruit) {
  const s = ctx.createBufferSource(); s.buffer = bruit;
  const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = haut ? 3400 : 2500; bp.Q.value = 6;
  const e = ctx.createGain(); e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  s.connect(bp).connect(e).connect(out); s.start(t); s.stop(t + 0.06);
}
function bruitBlanc(ctx, sec) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
/* réverbération : réponse impulsionnelle stéréo générée (bruit qui décroît) */
function reverb(ctx) {
  const sec = 2.8, n = Math.floor(ctx.sampleRate * sec);
  const b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3.2;
  }
  const cv = ctx.createConvolver(); cv.buffer = b;
  return cv;
}

/* La chaîne de sortie : sec + réverbération → général. */
export function chaine(ctx, destination) {
  const general = ctx.createGain(); general.gain.value = VOLUME;
  const sec = ctx.createGain(); sec.gain.value = 0.78;
  const rv = reverb(ctx); const humide = ctx.createGain(); humide.gain.value = 0.34;
  const entree = ctx.createGain();
  entree.connect(sec).connect(general);
  entree.connect(rv); rv.connect(humide).connect(general);
  general.connect(destination);
  return { entree, general, bruit: bruitBlanc(ctx, 0.5) };
}

/* Programme les événements de [de, a[ (secondes depuis le début du tour) à t0. */
export function programmer(ctx, ch, ev, t0, de = -1, a = Infinity) {
  for (const e of ev) {
    if (e.t < de || e.t >= a) continue;
    const t = t0 + e.t;
    if (e.v === "harpe") harpe(ctx, ch.entree, t, e.f, e.g);
    else if (e.v === "flute") flute(ctx, ch.entree, t, e.f, e.d, e.g, ch.bruit);
    else if (e.v === "celesta") celesta(ctx, ch.entree, t, e.f, e.d, e.g);
    else if (e.v === "nappe") nappe(ctx, ch.entree, t, e.fs, e.d, e.g);
    else if (e.v === "tic") tic(ctx, ch.entree, t, e.haut, e.g, ch.bruit);
  }
}

/* ───────── lecture en direct ───────── */
let m = null;
const auPremierPlan = () => {
  if (!m) return;
  const t = m.ctx.currentTime;
  m.ch.general.gain.cancelScheduledValues(t);
  m.ch.general.gain.setValueAtTime(m.ch.general.gain.value, t);
  m.ch.general.gain.linearRampToValueAtTime(document.hidden ? 0 : VOLUME, t + 0.6);
};

export const themeEnCours = () => !!m;

/** Lance le thème (à appeler depuis un geste). Sans effet si le jeu est muet. */
export function demarrerTheme() {
  if (isMuted() || m) return;
  let ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  } catch { return; }
  const ch = chaine(ctx, ctx.destination);
  ch.general.gain.setValueAtTime(0, ctx.currentTime);
  ch.general.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 3);
  const { ev } = evenements();
  const origine = ctx.currentTime + 0.15;
  let jusqua = origine;
  /* programmation par petites fenêtres (1,2 s d'avance) : peu de nœuds à la
     fois ; une fenêtre à cheval sur deux tours est coupée en deux */
  const avance = () => {
    const cible = ctx.currentTime + 1.2;
    while (jusqua < cible) {
      const k = Math.floor((jusqua - origine) / DUREE_TOUR + 1e-9);
      const debut = origine + k * DUREE_TOUR;
      const fin = Math.min(cible, debut + DUREE_TOUR);
      programmer(ctx, ch, ev, debut, jusqua - debut, fin - debut);
      jusqua = fin;
    }
  };
  avance();
  const minuteur = setInterval(avance, 250);
  m = { ctx, ch, minuteur };
  document.addEventListener("visibilitychange", auPremierPlan);
  ctx.resume?.();
}

/** Arrête le thème en fondu. */
export function arreterTheme(fondu = 1.6) {
  if (!m) return;
  const { ctx, ch, minuteur } = m;
  m = null;
  document.removeEventListener("visibilitychange", auPremierPlan);
  clearInterval(minuteur);
  try {
    ch.general.gain.cancelScheduledValues(ctx.currentTime);
    ch.general.gain.setValueAtTime(ch.general.gain.value, ctx.currentTime);
    ch.general.gain.linearRampToValueAtTime(0, ctx.currentTime + fondu);
  } catch { /* rien */ }
  setTimeout(() => { try { ctx.close?.(); } catch { /* rien */ } }, fondu * 1000 + 300);
}
