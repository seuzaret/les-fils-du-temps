/* ============================================================
   MOTEUR — Sons en synthèse Web Audio
   ============================================================
   Aucun fichier audio : le navigateur SYNTHÉTISE les sons
   (oscillateurs + enveloppes de volume). Avantages : zéro
   téléchargement, zéro question de licence, poids nul.

   API : playSfx('pickup'|'craft'|'success'|'message'|'fail'|'jump'|'warp'|'dissolve')
   - pickup   : petit blip doux (on ramasse un élément)
   - craft    : deux notes montantes (objet fabriqué)
   - success  : arpège joyeux (événement réussi, ex. la chasse)
   - message  : arpège cristallin + scintillement (message transmis)
   - fail     : "bzzt" grave (combinaison ratée)
   - jump     : glissando ascendant (saut temporel)
   - dissolve : glissando descendant doux (message PERDU en route)

   Règle des navigateurs : le son ne peut démarrer qu'après une
   première interaction de l'utilisateur. Comme playSfx n'est
   appelé que depuis des clics/gestes, la règle est respectée :
   le contexte audio est créé (ou réveillé) au premier son.

   Le bouton 🔇 appelle setMuted() ; l'état est mémorisé dans
   localStorage et survit au rechargement de la page.
   ============================================================ */

let ctx = null;
let muted = typeof localStorage !== "undefined" && localStorage.getItem("martine.muted") === "1";

function ensureCtx() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null; // Web Audio indisponible : le jeu continue sans son
  }
}

/* ------------------------------------------------------------
   DÉBLOCAGE DE L'AUDIO — indispensable pour Firefox et Safari,
   qui interdisent TOUT son tant que l'utilisateur n'a pas fait un
   geste. On crée/réveille donc le contexte au TOUT PREMIER geste
   (pointer, touche, toucher), à la source (capture), une fois pour
   toutes. Sans ça, le premier son — voire tous — reste muet.
   ------------------------------------------------------------ */
if (typeof window !== "undefined") {
  const debloque = () => {
    const c = ensureCtx();
    if (!c) return;
    /* astuce « buffer silencieux » : jouer un tout petit son muet dans le
       geste réveille les contextes récalcitrants (iOS Safari, certains
       Firefox) mieux qu'un simple resume(). */
    try {
      const b = c.createBuffer(1, 1, 22050);
      const s = c.createBufferSource();
      s.buffer = b;
      s.connect(c.destination);
      s.start(0);
    } catch { /* pas grave */ }
    /* dès que le contexte tourne vraiment, on retire les écouteurs */
    if (c.state === "running") {
      ["pointerdown", "touchstart", "keydown", "click"].forEach((ev) =>
        window.removeEventListener(ev, debloque, true));
    }
  };
  ["pointerdown", "touchstart", "keydown", "click"].forEach((ev) =>
    window.addEventListener(ev, debloque, true));
}

/** Joue une note : fréquence f (→ f1 si glissando), départ décalé
    de t secondes, durée d, forme d'onde type, volume v. */
function tone(c, { f, f1, t = 0, d = 0.15, type = "sine", v = 0.2 }) {
  const o = c.createOscillator();
  const g = c.createGain();
  const now = c.currentTime + t;
  o.type = type;
  o.frequency.setValueAtTime(f, now);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + d);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(v, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + d);
  o.connect(g);
  g.connect(c.destination);
  o.start(now);
  o.stop(now + d + 0.05);
}

/** Une note TENUE : attaque, palier, extinction (tone() s'éteint tout de suite). */
function tenue(c, { f, t = 0, a = 0.04, h = 0.6, r = 0.8, type = "sine", v = 0.1, vib = 0 }) {
  const o = c.createOscillator();
  const g = c.createGain();
  const now = c.currentTime + t;
  o.type = type;
  o.frequency.setValueAtTime(f, now);
  if (vib) { /* léger vibrato : la note « chatoie » */
    const l = c.createOscillator(), lg = c.createGain();
    l.frequency.value = 5.5; lg.gain.value = vib;
    l.connect(lg); lg.connect(o.frequency); l.start(now); l.stop(now + a + h + r + 0.05);
  }
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(v, now + a);
  g.gain.setValueAtTime(v, now + a + h);
  g.gain.exponentialRampToValueAtTime(0.0001, now + a + h + r);
  o.connect(g);
  g.connect(c.destination);
  o.start(now);
  o.stop(now + a + h + r + 0.05);
}

/* Les recettes sonores (fréquences en Hz — do5 = 523, mi5 = 659…) */
const SFX = {
  /* nouvelle carte du médiadex : un « whoosh » qui monte, puis un accord
     brillant qui chatoie (mi majeur, la note du haut à 1 319 Hz) */
  carte: (c) => {
    tone(c, { f: 330, f1: 1319, d: 0.2, type: "sine", v: 0.1 });
    tenue(c, { f: 659, t: 0.16, h: 0.7, r: 0.9, type: "triangle", v: 0.07 });
    tenue(c, { f: 988, t: 0.19, h: 0.7, r: 0.9, type: "sine", v: 0.06 });
    tenue(c, { f: 1319, t: 0.22, h: 0.75, r: 0.85, type: "sine", v: 0.08, vib: 6 });
    tenue(c, { f: 1326, t: 0.22, h: 0.75, r: 0.85, type: "sine", v: 0.03 }); // battement : le scintillement
    tone(c, { f: 2637, t: 0.3, d: 0.6, type: "sine", v: 0.025 });
  },
  /* bip de TEST : deux notes claires et un peu fortes — sert à vérifier
     d'un clic sur 🔊 que le son sort bien. */
  test: (c) => {
    tone(c, { f: 660, d: 0.14, type: "triangle", v: 0.28 });
    tone(c, { f: 990, t: 0.12, d: 0.2, type: "triangle", v: 0.28 });
  },
  pickup: (c) => tone(c, { f: 520, f1: 700, d: 0.1, type: "sine", v: 0.18 }),
  craft: (c) => {
    tone(c, { f: 523, d: 0.12, type: "triangle", v: 0.2 });
    tone(c, { f: 659, t: 0.09, d: 0.16, type: "triangle", v: 0.2 });
  },
  success: (c) => [523, 659, 784].forEach((f, i) =>
    tone(c, { f, t: i * 0.09, d: 0.15, type: "triangle", v: 0.2 })),
  message: (c) => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(c, { f, t: i * 0.11, d: 0.3, type: "sine", v: 0.16 }));
    tone(c, { f: 2093, t: 0.44, d: 0.5, type: "sine", v: 0.06 }); // scintillement final
  },
  fail: (c) => {
    tone(c, { f: 140, f1: 80, d: 0.28, type: "sawtooth", v: 0.16 });
    tone(c, { f: 146, f1: 78, d: 0.28, type: "square", v: 0.07 }); // légère dissonance = "bzzt"
  },
  jump: (c) => {
    tone(c, { f: 180, f1: 1200, d: 0.7, type: "sine", v: 0.2 });
    tone(c, { f: 90, f1: 600, d: 0.7, type: "triangle", v: 0.1 });
  },
  /* SAUT TEMPOREL du jeu 2 : bien plus long et plus « brut » que jump.
     Approche du VWORP TARDIS : plusieurs oscillateurs légèrement désaccordés
     qui montent/descendent en vagues, une note grave qui tient la basse,
     un souffle aigu qui l'accompagne. Durée ~2,5 s pour couvrir l'anim
     visuelle. */
  warp: (c) => {
    /* Basse grave, sinueuse : monte puis redescend, comme une machine qui
       force son passage. Deux oscillateurs sawtooth légèrement désaccordés
       donnent le « grain » métallique du TARDIS. */
    tone(c, { f: 55, f1: 90, t: 0.00, d: 1.2, type: "sawtooth", v: 0.14 });
    tone(c, { f: 57, f1: 92, t: 0.00, d: 1.2, type: "sawtooth", v: 0.10 });
    tone(c, { f: 90, f1: 45, t: 1.20, d: 1.3, type: "sawtooth", v: 0.13 });
    tone(c, { f: 92, f1: 46, t: 1.20, d: 1.3, type: "sawtooth", v: 0.10 });
    /* Souffle médium en triangle : donne la sensation « d'air brassé » */
    tone(c, { f: 280, f1: 520, t: 0.05, d: 1.1, type: "triangle", v: 0.06 });
    tone(c, { f: 520, f1: 260, t: 1.25, d: 1.15, type: "triangle", v: 0.06 });
    /* Ping cristallin à l'atterrissage (moment où le décor apparaît). */
    tone(c, { f: 880, f1: 1760, t: 2.20, d: 0.35, type: "sine", v: 0.11 });
    tone(c, { f: 1320, t: 2.30, d: 0.5, type: "sine", v: 0.06 });
  },
  /* message perdu : glissando DESCENDANT et doux, mélancolique
     (l'inverse du "jump" ascendant) — le message s'évapore, sans
     dureté : ce n'est pas un échec, c'est une disparition. */
  dissolve: (c) => {
    tone(c, { f: 660, f1: 165, d: 0.6, type: "sine", v: 0.13 });
    tone(c, { f: 330, f1: 90, t: 0.05, d: 0.72, type: "triangle", v: 0.07 });
  },
  /* la flûte en os : une petite mélodie pentatonique, soufflée.
     Jouée quand la flûte est créée (voir `sfx` dans les MESSAGES). */
  flute: (c) => {
    [[587, 0.0], [784, 0.26], [659, 0.52], [880, 0.78], [784, 1.08]].forEach(([f, t]) => {
      tone(c, { f, t, d: 0.34, type: "sine", v: 0.15 });
      tone(c, { f: f * 2, t, d: 0.3, type: "triangle", v: 0.03 }); // souffle léger à l'octave
    });
  },
};

/** Joue un effet sonore (silencieux si le son est coupé ou indisponible).
    On ne déclenche le son QUE lorsque le contexte tourne vraiment : sur
    Firefox/Safari, `resume()` est asynchrone — jouer avant qu'il ait fini
    programme la note « dans le passé » et on n'entend rien. D'où le
    `resume().then(...)`. */
export function playSfx(name) {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  const jouer = () => { try { SFX[name]?.(c); } catch { /* rien */ } };
  if (c.state === "running") jouer();
  else c.resume().then(jouer).catch(() => { /* audio bloqué : tant pis */ });
}

/** Le vibreur du téléphone (intro) : « bzzzz » 1,1 s, silence 0,9 s, en
    boucle jusqu'à l'appel de la fonction renvoyée. Un moteur grave (150 Hz)
    et le grésillement du téléphone posé sur le bois (modulation rapide). */
export function demarrerVibreur() {
  const c = ensureCtx();
  if (!c) return () => {};
  const sortie = c.createGain(); sortie.gain.value = 0;
  const filtre = c.createBiquadFilter(); filtre.type = "lowpass"; filtre.frequency.value = 900; filtre.Q.value = 3;
  const grille = c.createGain(); grille.gain.value = 0.6;
  const moteurs = [[148, "sawtooth", 1], [151.5, "square", 0.35]].map(([f, type, v]) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    o.connect(g); g.connect(filtre);
    return o;
  });
  const lfo = c.createOscillator(), lfoG = c.createGain();
  lfo.frequency.value = 37; lfoG.gain.value = 0.4;
  lfo.connect(lfoG); lfoG.connect(grille.gain);
  filtre.connect(grille); grille.connect(sortie); sortie.connect(c.destination);
  const oscs = [...moteurs, lfo];
  const t0 = c.currentTime + 0.05;
  oscs.forEach((o) => o.start(t0));
  let prochain = t0, fini = false;
  const V = 0.2;
  const programmer = () => {
    while (prochain < c.currentTime + 3) {
      const s = prochain, v = muted ? 0 : V;
      sortie.gain.setValueAtTime(0, s);
      sortie.gain.linearRampToValueAtTime(v, s + 0.03);
      sortie.gain.setValueAtTime(v, s + 1.07);
      sortie.gain.linearRampToValueAtTime(0, s + 1.1);
      prochain += 2;
    }
  };
  programmer();
  const id = setInterval(programmer, 500);
  return () => {
    if (fini) return;
    fini = true; clearInterval(id);
    const t = c.currentTime;
    try {
      sortie.gain.cancelScheduledValues(t);
      sortie.gain.setValueAtTime(sortie.gain.value, t);
      sortie.gain.linearRampToValueAtTime(0, t + 0.05);
      oscs.forEach((o) => o.stop(t + 0.1));
    } catch { /* déjà arrêté */ }
  };
}

export function isMuted() { return muted; }

export function setMuted(m) {
  muted = m;
  try { localStorage.setItem("martine.muted", m ? "1" : "0"); } catch { /* stockage indisponible */ }
  /* les boutons son (titre, Jeu 3, combat) se mettent tous à jour */
  try { window.dispatchEvent(new CustomEvent("martine:son", { detail: m })); } catch { /* rien */ }
}
/** Pour un bouton son : suivre l'état muet partagé (renvoie true si coupé). */
export function surChangementSon(rappel) {
  const f = (e) => rappel(!!e.detail);
  window.addEventListener("martine:son", f);
  return () => window.removeEventListener("martine:son", f);
}

/* ------------------------------------------------------------
   AMBIANCES — boucles discrètes, synthétisées elles aussi.
   Un tableau peut en demander une via `ambience: "…"` dans la
   liste SCENES de son data.js ; App démarre/arrête au changement
   de tableau. Volumes très bas : c'est un fond, pas un premier plan.

   "grotte" : un tambour sourd comme un battement de cœur, et des
   voix graves qui psalmodient — les chants du clan, au loin.
   ------------------------------------------------------------ */

/** Une voix qui psalmodie : attaque lente, deux voix légèrement
    désaccordées + une octave grave, comme un chœur lointain. */
function hum(c, f) {
  [f, f * 1.006, f / 2].forEach((ff, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    const now = c.currentTime;
    o.type = i === 2 ? "triangle" : "sine";
    o.frequency.setValueAtTime(ff, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(i === 2 ? 0.05 : 0.08, now + 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    o.connect(g);
    g.connect(c.destination);
    o.start(now);
    o.stop(now + 1.6);
  });
}

let amb = null; // { timer } : l'ambiance en cours

export function startAmbience(sceneId) {
  if (muted || amb || sceneId !== "grotte") return;
  /* ⚠ RÈGLE D'OR : on ne CRÉE JAMAIS le contexte audio ici (on serait
     hors d'un clic de l'utilisateur, et Firefox bloquerait alors TOUT le
     son du jeu). L'ambiance attend sagement que le premier effet sonore
     — déclenché par un clic — ait créé et débloqué le contexte. */
  const chant = [98, 110, 87.3, 98]; // sol, la, fa, sol — la mélopée
  let mesure = 0;
  const timer = setInterval(() => {
    if (muted || !ctx || ctx.state !== "running") return;
    try {
      /* le tambour : deux battements, comme un cœur (boum… boum) */
      tone(ctx, { f: 92, f1: 50, d: 0.26, type: "sine", v: 0.13 });
      tone(ctx, { f: 88, f1: 48, t: 0.34, d: 0.24, type: "sine", v: 0.09 });
      /* une mesure sur deux, la voix psalmodie */
      if (mesure % 2 === 0) hum(ctx, chant[(mesure / 2) % chant.length]);
      mesure++;
    } catch {
      /* pas d'audio : le jeu continue sans ambiance */
    }
  }, 1500);
  amb = { timer };
}

export function stopAmbience() {
  if (amb) { clearInterval(amb.timer); amb = null; }
}
