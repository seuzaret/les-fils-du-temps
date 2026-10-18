/* ============================================================
   MOTEUR AUDIO — petits effets WebAudio pour le vaisseau temporel
   ------------------------------------------------------------
   - fluxCharge()  : oscillateur qui monte pendant l'émission SOS
   - materialize() : shimmer synth quand le vaisseau apparait
   - countdownBeep(n) : bip aigu (3,2) puis grave doré (1/GO)
   Tous silencieux si WebAudio est indisponible.
   ============================================================ */

let AC = null;
function ctx() {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    return AC;
  } catch { return null; }
}

/* Oscillateur montant piloté par un objet handle qu'on peut stopper.
   Utilisation :
     const h = playFluxCharge(3200);   // durée totale en ms
     h.stop();                          // pour couper avant la fin
*/
export function playFluxCharge(durationMs = 3500) {
  const a = ctx(); if (!a) return { stop() {} };
  const t0 = a.currentTime;
  const dur = durationMs / 1000;
  /* Deux oscillateurs légèrement désaccordés + un LFO qui vibre */
  const o1 = a.createOscillator(); o1.type = "sine";
  const o2 = a.createOscillator(); o2.type = "triangle";
  const g  = a.createGain();
  o1.frequency.setValueAtTime(120, t0);
  o1.frequency.exponentialRampToValueAtTime(720, t0 + dur);
  o2.frequency.setValueAtTime(122, t0);
  o2.frequency.exponentialRampToValueAtTime(726, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.08, t0 + 0.2);
  g.gain.linearRampToValueAtTime(0.12, t0 + dur - 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o1.connect(g); o2.connect(g); g.connect(a.destination);
  o1.start(t0); o2.start(t0);
  o1.stop(t0 + dur + 0.05); o2.stop(t0 + dur + 0.05);
  /* petit "ding" final quand la charge atteint 100 % */
  const dingT = t0 + dur - 0.02;
  const d = a.createOscillator(); d.type = "sine"; d.frequency.value = 1400;
  const dg = a.createGain();
  dg.gain.setValueAtTime(0.0001, dingT);
  dg.gain.exponentialRampToValueAtTime(0.22, dingT + 0.02);
  dg.gain.exponentialRampToValueAtTime(0.0001, dingT + 0.45);
  d.connect(dg); dg.connect(a.destination);
  d.start(dingT); d.stop(dingT + 0.5);
  return {
    stop() {
      try {
        const t = a.currentTime;
        o1.stop(t + 0.05); o2.stop(t + 0.05);
        g.gain.cancelScheduledValues(t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      } catch {}
    },
  };
}

/* Shimmer/whoosh quand le vaisseau se matérialise. */
export function playMaterialize() {
  const a = ctx(); if (!a) return;
  const t0 = a.currentTime;
  /* Sweep descendant (le halo grandit puis se stabilise) */
  const sweep = a.createOscillator(); sweep.type = "sawtooth";
  const sweepG = a.createGain();
  const filter = a.createBiquadFilter(); filter.type = "lowpass";
  filter.frequency.setValueAtTime(200, t0);
  filter.frequency.exponentialRampToValueAtTime(3200, t0 + 0.9);
  filter.frequency.exponentialRampToValueAtTime(600, t0 + 1.8);
  sweep.frequency.setValueAtTime(60, t0);
  sweep.frequency.exponentialRampToValueAtTime(180, t0 + 0.9);
  sweep.frequency.exponentialRampToValueAtTime(90, t0 + 1.8);
  sweepG.gain.setValueAtTime(0.0001, t0);
  sweepG.gain.exponentialRampToValueAtTime(0.14, t0 + 0.5);
  sweepG.gain.exponentialRampToValueAtTime(0.0001, t0 + 2);
  sweep.connect(filter); filter.connect(sweepG); sweepG.connect(a.destination);
  sweep.start(t0); sweep.stop(t0 + 2.05);

  /* Nappe scintillante : quelques harmoniques cristallines */
  [880, 1320, 1760, 2200].forEach((f, i) => {
    const o = a.createOscillator(); o.type = "sine"; o.frequency.value = f;
    const g = a.createGain();
    const start = t0 + 0.6 + i * 0.12;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.05, start + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    o.connect(g); g.connect(a.destination);
    o.start(start); o.stop(start + 1);
  });
}

/* Ping court d'un nouveau message dans le téléphone (deux notes descendantes). */
export function playPhonePing() {
  const a = ctx(); if (!a) return;
  const t0 = a.currentTime;
  [1320, 990].forEach((f, i) => {
    const start = t0 + i * 0.12;
    const o = a.createOscillator(); o.type = "sine"; o.frequency.value = f;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.14, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    o.connect(g); g.connect(a.destination);
    o.start(start); o.stop(start + 0.32);
  });
}

/* Bip du décompte : n=3 ou 2 → bip aigu ; n=1 → bip plus grave et long (GO). */
export function playCountdown(n) {
  const a = ctx(); if (!a) return;
  const t0 = a.currentTime;
  const isGo = n <= 1;
  const freq = isGo ? 440 : 880;
  const dur = isGo ? 0.5 : 0.16;
  const o = a.createOscillator(); o.type = isGo ? "triangle" : "sine";
  o.frequency.value = freq;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(isGo ? 0.22 : 0.16, t0 + 0.015);
  g.gain.setValueAtTime(isGo ? 0.22 : 0.16, t0 + dur - 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
  /* Un petit doublage à l'octave pour le GO, plus dramatique. */
  if (isGo) {
    const o2 = a.createOscillator(); o2.type = "sine"; o2.frequency.value = 220;
    const g2 = a.createGain();
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.exponentialRampToValueAtTime(0.14, t0 + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o2.connect(g2); g2.connect(a.destination);
    o2.start(t0); o2.stop(t0 + dur + 0.02);
  }
}

/* Tintement de deux verres : trois partiels métalliques très brefs. */
export function playClink() {
  const a = ctx(); if (!a) return;
  const t0 = a.currentTime;
  [[2637, 0.12, 0.9], [3951, 0.07, 0.6], [1760, 0.1, 0.5]].forEach(([f, v, d]) => {
    const o = a.createOscillator(); o.type = "sine"; o.frequency.value = f;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d * 0.6);
    o.connect(g); g.connect(a.destination);
    o.start(t0); o.stop(t0 + d * 0.6 + 0.05);
  });
}

/* Bourdonnement grave qui s'étouffe : l'endormissement (sinus filtré, descend d'une octave). */
export function playSleepHum(durationMs = 3200) {
  const a = ctx(); if (!a) return;
  const t0 = a.currentTime, dur = durationMs / 1000;
  const o = a.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(110, t0);
  o.frequency.exponentialRampToValueAtTime(55, t0 + dur);
  const f = a.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 300;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(f); f.connect(g); g.connect(a.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
