import { useEffect, useMemo, useRef, useState } from "react";
import { playCountdown } from "./sfx.js";

/* ============================================================
   PROTOTYPE v5 : Boussole temporelle
   ------------------------------------------------------------
   - Deplacement le long des lignes de la grille iso, case par case
   - 4 fleches = les 4 axes de la grille (NE / SE / SW / NW ecran)
   - Boucle refs-DOM directs (fluide)
   ============================================================ */

const VW = 1600;
const VH = 900;
/* Plateau 2.4x plus grand qu'avant (5760 au lieu de 2400). La cellule
   fait toujours 240 unites monde, donc le rythme case-a-case ne change
   pas ; il y a juste plus de cases a parcourir. */
const WORLD = 5760;
const LOCK_RADIUS = 100;   // un peu plus large : on s'arrete sur une case
const LOCK_MS = 900;
const GRID_N = 48;         // 48 subdivisions
const STEP = (WORLD * 2) / GRID_N;       // 240 unites monde par case
const CELL_MS = 260;                     // temps pour traverser une case
const ZOOM = 0.82;                       // camera legerement reculee
const TACHYON_RANDOM = 0.15;             // chance d'un mouvement aleatoire

/* Palier de difficulté — mappé sur la frise des chapitres.
   1 : préhisto -> antiquité     (découverte, 2 tachyons lents, pas de decoys)
   2 : moyen-âge -> moderne      (3 tachyons, decoys actifs)
   3 : XIXᵉ -> XXᵉ guerres        (4 tachyons rapides, cible plus loin)
   4 : médias masse -> XXIᵉ       (5 tachyons, le siège se resserre)         */
const LEVELS = {
  1: { whirls: 14, tachyons: 2, tachyonMs: 720, distMin: 0.40, distMax: 0.55, decoys: false, label: "FLUX LÉGER" },
  2: { whirls: 22, tachyons: 3, tachyonMs: 520, distMin: 0.55, distMax: 0.75, decoys: true,  label: "FLUX AGITÉ" },
  3: { whirls: 30, tachyons: 4, tachyonMs: 420, distMin: 0.70, distMax: 0.90, decoys: true,  label: "FLUX INSTABLE" },
  4: { whirls: 36, tachyons: 5, tachyonMs: 360, distMin: 0.85, distMax: 1.00, decoys: true,  label: "TEMPÊTE TEMPORELLE" },
};
export function paliereFromChapter(chapterIndex) {
  if (chapterIndex <= 1) return 1;
  if (chapterIndex <= 4) return 2;
  if (chapterIndex <= 6) return 3;
  return 4;
}

/* Trace du dernier échec — survit entre deux montages de la boussole
   (le composant est démonté/remonté à chaque voyage par TimeVessel).
   On enregistre les positions ECRAN (dans le groupe camera), pour
   pouvoir rejouer le fantôme sans refaire les projections. */
let lastGhostPath = [];

/* Angle iso plus doux : moins ecrase verticalement.
   sx = (x - y) * ISO_X ; sy = (x + y) * ISO_Y */
const ISO_X = 0.95;
const ISO_Y = 0.35;
const iso = (x, y) => ({ sx: (x - y) * ISO_X, sy: (x + y) * ISO_Y });

const rand = (min, max) => min + Math.random() * (max - min);

/* Epoques du jeu, ordonnees du passe (Ouest) vers le futur (Est).
   Les couleurs sont tenues (chaudes -> froides -> menthe) pour lire
   d'un coup d'oeil la region du plateau. */
const ERAS = [
  { key: "prehistoire", name: "Préhistoire",   color: "#c07040" },
  { key: "antiquite",   name: "Antiquité",     color: "#d0a24a" },
  { key: "moyen-age",   name: "Moyen Âge",     color: "#8b6bd0" },
  { key: "renaissance", name: "Renaissance",   color: "#c85fa0" },
  { key: "moderne",     name: "Époque moderne",color: "#5a9be0" },
  { key: "xixe",        name: "XIXᵉ siècle",   color: "#4ac0b0" },
  { key: "xxe-guerres", name: "Grandes Guerres",color:"#7a8a6a" },
  { key: "xxe-medias",  name: "Médias de masse",color:"#e0a058" },
  { key: "xxie",        name: "XXIᵉ siècle",   color: "#7fffb0" },
];
const eraIndexForX = (x) => {
  const t = (x + WORLD) / (WORLD * 2);        // 0 -> 1
  return Math.max(0, Math.min(ERAS.length - 1, Math.floor(t * ERAS.length)));
};

/* Reperes de dates dissemines sur le plateau. Le x rappelle l'epoque
   (bande), le y est arbitraire pour ne pas empiler les etiquettes.
   `tick` : petit trait vertical si vrai. */
const DATE_MARKERS = [
  { x: -WORLD * 0.95, y: -WORLD * 0.55, text: "-30 000", tick: true  },
  { x: -WORLD * 0.80, y:  WORLD * 0.25, text: "-8 000",  tick: false },
  { x: -WORLD * 0.60, y: -WORLD * 0.15, text: "-800",    tick: true  },
  { x: -WORLD * 0.50, y:  WORLD * 0.55, text: "100",     tick: false },
  { x: -WORLD * 0.32, y: -WORLD * 0.42, text: "800",     tick: true  },
  { x: -WORLD * 0.20, y:  WORLD * 0.10, text: "1200",    tick: false },
  { x: -WORLD * 0.05, y: -WORLD * 0.65, text: "1500",    tick: true  },
  { x:  WORLD * 0.08, y:  WORLD * 0.35, text: "1600",    tick: false },
  { x:  WORLD * 0.18, y: -WORLD * 0.05, text: "1789",    tick: true  },
  { x:  WORLD * 0.30, y:  WORLD * 0.60, text: "1830",    tick: false },
  { x:  WORLD * 0.42, y: -WORLD * 0.30, text: "1889",    tick: true  },
  { x:  WORLD * 0.55, y:  WORLD * 0.05, text: "1918",    tick: false },
  { x:  WORLD * 0.65, y: -WORLD * 0.55, text: "1944",    tick: true  },
  { x:  WORLD * 0.78, y:  WORLD * 0.30, text: "1969",    tick: true  },
  { x:  WORLD * 0.86, y: -WORLD * 0.10, text: "1985",    tick: false },
  { x:  WORLD * 0.94, y:  WORLD * 0.50, text: "2024",    tick: true  },
];

export function TemporalCompass({ onClose, onLock, onCaught, nextLabel, level = 1 }) {
  const cfg = LEVELS[level] || LEVELS[1];
  const NUM_WHIRLS = cfg.whirls;
  const TACHYON_COUNT = cfg.tachyons;
  const TACHYON_CELL_MS = cfg.tachyonMs;
  const posRef = useRef({ x: 0, y: 0 });
  const heldRef = useRef({ up: false, down: false, left: false, right: false });
  const cameraRef = useRef(null);
  const playerRef = useRef(null);
  const needleRef = useRef(null);
  const targetGroupRef = useRef(null);
  const minimapPlayerRef = useRef(null);
  const lockBarRef = useRef(null);
  const lockGroupRef = useRef(null);
  const ringsRef = useRef([]);
  const warpRef = useRef((x, y) => [x, y]);
  const tachyonRefs = useRef([]);           // <g> des 4 tachyons rouges
  const trailGroupRef = useRef(null);       // <g> ou on append les segments rouges
  const playerTrailGroupRef = useRef(null); // <g> ou on append la trainee verte du joueur
  const tachyonMiniRefs = useRef([]);       // points rouges sur la mini-carte
  const surfFlashRef = useRef(null);        // texte "SURF" qui s'affiche sur un vortex
  /* Snapshot (figé au montage) de la trace du dernier échec. On la fige
     à la frame initiale pour éviter que le ghost disparaisse à mi-partie
     si on écrit lastGhostPath depuis le step en cours. */
  const ghostSnapshotRef = useRef(lastGhostPath.slice());
  const [done, setDone] = useState(false);
  const [caught, setCaught] = useState(false);
  const [decoys, setDecoys] = useState([]); // faux noeuds temporels ephemeres
  /* phase : brief -> countdown -> play (puis done/caught) */
  const [phase, setPhase] = useState("brief");
  const [countdown, setCountdown] = useState(3);
  const phaseRef = useRef("brief");
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  /* Decompte 3 -> 2 -> 1 -> play (une seule fois par phase countdown).
     Chaque chiffre déclenche son bip ; le 1 sonne comme un GO plus dramatique. */
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(3);
    playCountdown(3);
    const t2 = setTimeout(() => { setCountdown(2); playCountdown(2); }, 1000);
    const t1 = setTimeout(() => { setCountdown(1); playCountdown(1); }, 2000);
    const tGo = setTimeout(() => setPhase("play"), 3000);
    return () => { clearTimeout(t2); clearTimeout(t1); clearTimeout(tGo); };
  }, [phase]);

  const { target, whirls } = useMemo(() => {
    const snap = (v) => Math.round(v / STEP) * STEP;
    const angle = Math.random() * Math.PI * 2;
    /* Distance de la cible selon le palier — courbe de difficulté. */
    const dist = rand(WORLD * cfg.distMin, WORLD * cfg.distMax);
    let tx = snap(Math.cos(angle) * dist), ty = snap(Math.sin(angle) * dist);
    if (tx === 0 && ty === 0) tx = STEP * 6;
    const era = ERAS[eraIndexForX(tx)];
    return {
      target: { x: tx, y: ty, era, label: nextLabel || era.name },
      whirls: Array.from({ length: NUM_WHIRLS }, () => ({
        x: rand(-WORLD + 300, WORLD - 300),
        y: rand(-WORLD + 300, WORLD - 300),
        r: rand(90, 160),
        dir: Math.random() < 0.5 ? 1 : -1,
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextLabel, level]);

  /* GRILLE VIVANTE : certaines lignes sont "chargées" (bonus de vitesse)
     et d'autres "mortes" (malus). Tiré au sort une fois par voyage.
     Les indices suivent la convention de la grille (0..GRID_N). */
  const liveGrid = useMemo(() => {
    const pick = (n) => {
      const s = new Set();
      while (s.size < n) s.add(Math.floor(Math.random() * (GRID_N + 1)));
      return s;
    };
    return {
      hotV: pick(3), coldV: pick(3),
      hotH: pick(3), coldH: pick(3),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextLabel, level]);

  /* Faux noeuds : apparaissent au hasard, vivent ~5s puis disparaissent.
     Purement decoratifs (aucune interaction gameplay). Désactivés au
     palier 1 pour laisser le joueur apprendre les contrôles. */
  useEffect(() => {
    if (!cfg.decoys) return;
    let nextId = 0;
    const CELL_MAX = Math.floor(WORLD / STEP);
    const spawn = () => {
      const dx = (Math.floor(rand(-CELL_MAX, CELL_MAX + 1))) * STEP;
      const dy = (Math.floor(rand(-CELL_MAX, CELL_MAX + 1))) * STEP;
      /* Evite de coincider avec la vraie cible. */
      if (Math.hypot(dx - target.x, dy - target.y) < STEP * 2) return;
      const life = 4500 + Math.random() * 2500;
      const era = ERAS[eraIndexForX(dx)];
      const d = { id: nextId++, x: dx, y: dy, era, life };
      setDecoys((arr) => (arr.length >= 3 ? arr : [...arr, d]));
      setTimeout(() => setDecoys((arr) => arr.filter((x) => x.id !== d.id)), life);
    };
    const iv = setInterval(spawn, 2600);
    return () => clearInterval(iv);
  }, [target]);

  /* clavier */
  useEffect(() => {
    const map = (k) => {
      if (["ArrowUp", "z", "w"].includes(k)) return "up";
      if (["ArrowDown", "s"].includes(k)) return "down";
      if (["ArrowLeft", "q", "a"].includes(k)) return "left";
      if (["ArrowRight", "d"].includes(k)) return "right";
      return null;
    };
    const down = (e) => {
      if (e.key === "Escape") { onClose?.(); return; }
      if (e.key === " " || e.code === "Space") { heldRef.current.brake = true; e.preventDefault?.(); return; }
      const k = map(e.key); if (k) heldRef.current[k] = true;
    };
    const up = (e) => {
      if (e.key === " " || e.code === "Space") { heldRef.current.brake = false; return; }
      const k = map(e.key); if (k) heldRef.current[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [onClose]);

  /* boucle : deplacement le long des lignes de la grille.
     La position ecran interpole entre 2 noeuds (from -> to). Quand on
     arrive, on regarde les fleches maintenues pour partir sur la case
     suivante. Une case = STEP unites monde. */
  useEffect(() => {
    let raf, last = performance.now();
    let lock = 0, isDone = false, isCaught = false;
    /* Etat de deplacement */
    let fromX = 0, fromY = 0, toX = 0, toY = 0, prog = 1;
    /* Multiplicateur de vitesse de l'arête courante — rafraîchi à
       chaque nouvelle case selon la grille vivante + le surf. */
    let edgeMul = 1;
    /* Flash visuel du surf — ms restants d'affichage de la mention "SURF". */
    let surfFlash = 0;
    /* Buffer du parcours du joueur en coords écran (iso+warp), pour
       enregistrer le fantôme si on se fait attraper. */
    const ghostBuf = [];
    /* Emission de la trainee : une goutte toutes les TRAIL_EMIT_MS
       depuis la position courante du joueur. */
    let lastEmitAt = 0;
    const TRAIL_EMIT_MS = 45;
    /* Inertie : quand on relache la touche, le joueur continue encore
       MOMENTUM_STEPS cases dans la meme direction avant de s'arreter.
       Barre espace = frein immediat (momentum remis a 0). */
    let lastDir = null;
    let momentum = 0;
    const MOMENTUM_STEPS = 4;
    const BRAKE_FACTOR = 0.35;   // ralentit la case en cours quand on freine
    const CELL_MAX = Math.floor(WORLD / STEP);

    /* --- 4 tachyons rouges, un a chaque angle du plateau --- */
    const CORNERS = [
      [-CELL_MAX, -CELL_MAX],
      [ CELL_MAX, -CELL_MAX],
      [-CELL_MAX,  CELL_MAX],
      [ CELL_MAX,  CELL_MAX],
    ];
    const tachyons = CORNERS.map(([cx, cy]) => ({
      fromX: cx * STEP, fromY: cy * STEP,
      toX:   cx * STEP, toY:   cy * STEP,
      curX:  cx * STEP, curY:  cy * STEP,
      prog:  1,
    }));
    const trail = new Set();          // cle "cxA,cyA|cxB,cyB" (ordre canonique)
    const edgeKey = (ax, ay, bx, by) => {
      if (ax < bx || (ax === bx && ay < by)) return `${ax},${ay}|${bx},${by}`;
      return `${bx},${by}|${ax},${ay}`;
    };
    const addTrailSegment = (ax, ay, bx, by) => {
      const k = edgeKey(ax, ay, bx, by);
      if (trail.has(k)) return;
      trail.add(k);
      if (!trailGroupRef.current) return;
      /* Trace le segment warpé */
      const SUB = 8;
      const pts = [];
      for (let i = 0; i <= SUB; i++) {
        const u = i / SUB;
        const wxA = ax * STEP + (bx - ax) * STEP * u;
        const wyA = ay * STEP + (by - ay) * STEP * u;
        const [wx, wy] = warpRef.current(wxA, wyA);
        const pr = iso(wx, wy);
        pts.push(`${pr.sx.toFixed(1)},${pr.sy.toFixed(1)}`);
      }
      const el = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      el.setAttribute("points", pts.join(" "));
      el.setAttribute("fill", "none");
      el.setAttribute("stroke", "#ff2a4a");
      el.setAttribute("stroke-width", "2.4");
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("opacity", "0.9");
      trailGroupRef.current.appendChild(el);
    };
    /* Trainee verte du joueur : petites gouttes emises depuis le
       cercle du joueur. Le fondu est piloté par la boucle RAF
       (setAttribute r et opacity chaque frame) plutot que par CSS
       transitions ou SMIL, dont l'activation sur elements SVG
       ajoutes dynamiquement est fragile selon les navigateurs. */
    const TRAIL_LIFE = 700;
    const activeTrail = [];
    const emitPlayerTrail = (sx, sy, born) => {
      if (!playerTrailGroupRef.current) return;
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("cx", sx.toFixed(1));
      el.setAttribute("cy", sy.toFixed(1));
      el.setAttribute("r", "7");
      el.setAttribute("fill", "#7fffb0");
      el.setAttribute("opacity", "0.95");
      playerTrailGroupRef.current.appendChild(el);
      activeTrail.push({ el, born });
    };
    const updatePlayerTrail = (t) => {
      for (let i = activeTrail.length - 1; i >= 0; i--) {
        const age = t - activeTrail[i].born;
        if (age >= TRAIL_LIFE) {
          activeTrail[i].el.remove();
          activeTrail.splice(i, 1);
        } else {
          const a = 1 - age / TRAIL_LIFE;
          activeTrail[i].el.setAttribute("opacity", (0.95 * a).toFixed(3));
          activeTrail[i].el.setAttribute("r", (7 * a + 1.5 * (1 - a)).toFixed(2));
        }
      }
    };

    const tachyonChooseDir = (curCx, curCy) => {
      const pCx = Math.round(posRef.current.x / STEP);
      const pCy = Math.round(posRef.current.y / STEP);
      const dx = pCx - curCx, dy = pCy - curCy;
      const candidates = [];
      if (Math.random() < TACHYON_RANDOM || (dx === 0 && dy === 0)) {
        candidates.push({ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 });
      } else {
        /* privilegie l'axe le plus long */
        if (Math.abs(dx) >= Math.abs(dy)) {
          if (dx !== 0) candidates.push({ dx: Math.sign(dx), dy: 0 });
          if (dy !== 0) candidates.push({ dx: 0, dy: Math.sign(dy) });
        } else {
          if (dy !== 0) candidates.push({ dx: 0, dy: Math.sign(dy) });
          if (dx !== 0) candidates.push({ dx: Math.sign(dx), dy: 0 });
        }
      }
      /* Toutes les directions sont valides : le wrap circulaire du
         plateau empeche de sortir. Il suffit de retourner la 1ere. */
      return candidates[0] || { dx: 1, dy: 0 };
    };
    /* Correspondance fleche ECRAN -> direction monde (une ligne de la grille).
       Convention : les 4 fleches forment une croix tournee de 45 deg qui
       suit les 4 axes visibles de la grille iso. */
    const dirFor = (h) => {
      if (h.up)    return { dx:  0, dy: -1 };
      if (h.right) return { dx: +1, dy:  0 };
      if (h.down)  return { dx:  0, dy: +1 };
      if (h.left)  return { dx: -1, dy:  0 };
      return null;
    };
    const step = (t) => {
      const dt = Math.min(50, t - last); last = t;
      const p = posRef.current, held = heldRef.current;
      const isPlaying = phaseRef.current === "play";

      /* Progression sur la case en cours.
         Si le frein est tenu, la traversee se ralentit (BRAKE_FACTOR).
         `edgeMul` applique le bonus/malus de l'arête (grille vivante + surf). */
      if (isPlaying && prog < 1) {
        const factor = held.brake ? BRAKE_FACTOR : 1;
        prog = Math.min(1, prog + (dt * factor * edgeMul) / CELL_MS);
        p.x = fromX + (toX - fromX) * prog;
        p.y = fromY + (toY - fromY) * prog;
      }
      if (surfFlash > 0) surfFlash = Math.max(0, surfFlash - dt);
      /* Arrive : demarrer la case suivante.
         Les tourbillons peuvent detourner (voire imposer) la direction. */
      if (isPlaying && prog >= 1) {
        const cx = Math.round(p.x / STEP), cy = Math.round(p.y / STEP);

        /* Cherche le tourbillon dont le nœud actuel est le plus enfonce. */
        let strongest = null, strongestDepth = 0;
        for (const w of whirls) {
          const dx = p.x - w.x, dy = p.y - w.y;
          const d = Math.hypot(dx, dy);
          if (d < w.r) {
            const depth = 1 - d / w.r;   // 0 (bord) -> 1 (centre)
            if (depth > strongestDepth) { strongestDepth = depth; strongest = w; }
          }
        }

        /* Frein tenu : arrivee au noeud = arret complet (pas de nouvelle case). */
        if (held.brake) {
          momentum = 0;
          lastDir = null;
        }
        let d = dirFor(held);
        /* Inertie : si aucune touche, on continue avec la derniere
           direction pendant MOMENTUM_STEPS cases. */
        if (d) {
          lastDir = d;
          momentum = MOMENTUM_STEPS;
        } else if (momentum > 0 && lastDir) {
          d = lastDir;
          momentum--;
        }
        if (strongest) {
          /* Direction tangentielle (dans le sens du tourbillon) au nœud actuel. */
          const rx = p.x - strongest.x, ry = p.y - strongest.y;
          const tx = -ry * strongest.dir, ty = rx * strongest.dir;
          /* Snap sur l'axe le plus proche. */
          const tDir = Math.abs(tx) > Math.abs(ty)
            ? { dx: Math.sign(tx), dy: 0 }
            : { dx: 0, dy: Math.sign(ty) };
          if (!d) {
            /* Aucune touche : le tourbillon nous emporte des qu'il mord (>=0.2). */
            if (strongestDepth > 0.2) d = tDir;
          } else {
            /* Touche tenue : proba de detournement proportionnelle a la profondeur. */
            if (Math.random() < strongestDepth * 0.85) d = tDir;
          }
        }

        if (d) {
          /* Temps circulaire : quand on sort d'un bord, on rentre par
             l'autre. Teleport instantane (style Pac-Man). */
          let ncx = cx + d.dx, ncy = cy + d.dy;
          let wrapped = false;
          if (ncx > CELL_MAX)  { ncx = -CELL_MAX; wrapped = true; }
          if (ncx < -CELL_MAX) { ncx =  CELL_MAX; wrapped = true; }
          if (ncy > CELL_MAX)  { ncy = -CELL_MAX; wrapped = true; }
          if (ncy < -CELL_MAX) { ncy =  CELL_MAX; wrapped = true; }
          if (ncx !== cx || ncy !== cy) {
            /* Traverser une arete rouge = attrape (les wraps ne comptent pas
               car il n'y a pas d'arete continue "traversee"). */
            if (!wrapped && trail.has(edgeKey(cx, cy, ncx, ncy)) && !isCaught) {
              isCaught = true; setCaught(true);
              lastGhostPath = ghostBuf.slice();
              setTimeout(() => (onCaught || onClose)?.(), 1500);
            }
            if (wrapped) {
              /* Saut instantane : on arrive deja sur la case cible. */
              fromX = ncx * STEP; fromY = ncy * STEP;
              toX = ncx * STEP;   toY = ncy * STEP;
              p.x = fromX; p.y = fromY;
              prog = 1;
              edgeMul = 1;
            } else {
              fromX = cx * STEP; fromY = cy * STEP;
              toX = ncx * STEP; toY = ncy * STEP;
              p.x = fromX; p.y = fromY;
              prog = 0;
              /* --- SURF : si on part dans le sens de la rotation du vortex
                 le plus proche, bonus de vitesse proportionnel à la profondeur. --- */
              let surfBoost = 1;
              if (strongest) {
                const rx = fromX - strongest.x, ry = fromY - strongest.y;
                const tx = -ry * strongest.dir, ty = rx * strongest.dir;
                const tDir = Math.abs(tx) > Math.abs(ty)
                  ? { dx: Math.sign(tx) || 1, dy: 0 }
                  : { dx: 0, dy: Math.sign(ty) || 1 };
                if (d.dx === tDir.dx && d.dy === tDir.dy) {
                  surfBoost = 1 + strongestDepth * 0.8;
                  surfFlash = 450;
                }
              }
              /* --- GRILLE VIVANTE : ligne traversée = bonus/malus. --- */
              let liveMul = 1;
              if (d.dy === 0) {
                /* Déplacement horizontal → on roule SUR la ligne horizontale cy. */
                const j = cy + CELL_MAX;
                if (liveGrid.hotH.has(j)) liveMul = 1.5;
                else if (liveGrid.coldH.has(j)) liveMul = 0.65;
              } else {
                const i = cx + CELL_MAX;
                if (liveGrid.hotV.has(i)) liveMul = 1.5;
                else if (liveGrid.coldV.has(i)) liveMul = 0.65;
              }
              edgeMul = surfBoost * liveMul;
            }
          }
        }
      }

      /* --- Tachyons rouges : chacun avance sur la grille, laisse un trait --- */
      if (isPlaying && !isCaught) {
        for (let ti = 0; ti < tachyons.length; ti++) {
          const T = tachyons[ti];
          if (T.prog < 1) {
            T.prog = Math.min(1, T.prog + dt / TACHYON_CELL_MS);
            T.curX = T.fromX + (T.toX - T.fromX) * T.prog;
            T.curY = T.fromY + (T.toY - T.fromY) * T.prog;
          }
          if (T.prog >= 1) {
            const ccx = Math.round(T.curX / STEP), ccy = Math.round(T.curY / STEP);
            const d = tachyonChooseDir(ccx, ccy);
            if (d) {
              let nx = ccx + d.dx, ny = ccy + d.dy;
              let wrapped = false;
              if (nx > CELL_MAX)  { nx = -CELL_MAX; wrapped = true; }
              if (nx < -CELL_MAX) { nx =  CELL_MAX; wrapped = true; }
              if (ny > CELL_MAX)  { ny = -CELL_MAX; wrapped = true; }
              if (ny < -CELL_MAX) { ny =  CELL_MAX; wrapped = true; }
              if (!wrapped) addTrailSegment(ccx, ccy, nx, ny);
              T.fromX = wrapped ? nx * STEP : ccx * STEP;
              T.fromY = wrapped ? ny * STEP : ccy * STEP;
              T.toX = nx * STEP;    T.toY = ny * STEP;
              T.curX = T.fromX;     T.curY = T.fromY;
              T.prog = wrapped ? 1 : 0;
            }
          }
          /* Render tachyon (warped iso). */
          const el = tachyonRefs.current[ti];
          if (el) {
            const [wxT, wyT] = warpRef.current(T.curX, T.curY);
            const ptT = iso(wxT, wyT);
            el.setAttribute("transform", `translate(${ptT.sx} ${ptT.sy})`);
          }
          const mel = tachyonMiniRefs.current[ti];
          if (mel) {
            mel.setAttribute("cx", (T.curX / WORLD) * 60);
            mel.setAttribute("cy", (T.curY / WORLD) * 60);
          }
          /* Collision directe joueur / tachyon */
          if (Math.hypot(p.x - T.curX, p.y - T.curY) < STEP * 0.5) {
            isCaught = true; setCaught(true);
            lastGhostPath = ghostBuf.slice();
            setTimeout(() => (onCaught || onClose)?.(), 1500);
            break;
          }
        }
      }

      /* projection iso pour camera + joueur, avec la meme deformation
         que la grille pour rester "sur les lignes". */
      const [wx, wy] = warpRef.current(p.x, p.y);
      const psx = (wx - wy) * ISO_X;
      const psy = (wx + wy) * ISO_Y;
      if (cameraRef.current) cameraRef.current.setAttribute("transform", `translate(${VW / 2} ${VH / 2}) scale(${ZOOM}) translate(${-psx} ${-psy})`);
      if (playerRef.current) playerRef.current.setAttribute("transform", `translate(${psx} ${psy})`);
      if (surfFlashRef.current) {
        const opa = surfFlash > 0 ? Math.min(1, surfFlash / 450) : 0;
        surfFlashRef.current.setAttribute("opacity", String(opa));
        surfFlashRef.current.setAttribute("transform", `translate(${psx} ${psy - 42})`);
      }

      /* Trainee : emet une petite goutte a la position ecran (iso+warp)
         du joueur toutes les TRAIL_EMIT_MS pendant qu'il bouge, et
         fait fondre toutes les gouttes actives cette frame. */
      if (!isCaught && prog < 1 && t - lastEmitAt >= TRAIL_EMIT_MS) {
        emitPlayerTrail(psx, psy, t);
        /* On consigne la position dans le buffer du fantôme. On plafonne
           à 400 points pour éviter de garder un chemin démesuré. */
        if (ghostBuf.length < 400) ghostBuf.push([psx, psy]);
        lastEmitAt = t;
      }
      updatePlayerTrail(t);
      if (minimapPlayerRef.current) {
        minimapPlayerRef.current.setAttribute("cx", (p.x / WORLD) * 60);
        minimapPlayerRef.current.setAttribute("cy", (p.y / WORLD) * 60);
      }

      /* boussole : angle en coordonnees ECRAN (iso) pour que la fleche
         pointe visuellement vers le noeud tel qu'affiche a l'ecran. */
      const dxT = target.x - p.x, dyT = target.y - p.y;
      const distT = Math.hypot(dxT, dyT);
      const dsxT = (dxT - dyT) * ISO_X;
      const dsyT = (dxT + dyT) * ISO_Y;
      const angT = Math.atan2(dsyT, dsxT);
      if (needleRef.current) needleRef.current.setAttribute("transform", `rotate(${(angT * 180) / Math.PI})`);
      const prox = Math.max(0, Math.min(1, 1 - distT / (WORLD * 1.05)));
      const lit = Math.round(prox * 5);
      const col = lit >= 4 ? "#ff4a3a" : lit >= 3 ? "#ffa050" : lit >= 2 ? "#ffd166" : "#a8c8ff";
      ringsRef.current.forEach((r, i) => {
        if (!r) return;
        const active = i < lit;
        r.setAttribute("stroke", active ? col : "#233855");
        r.setAttribute("stroke-width", active ? 3 : 1.2);
        r.setAttribute("opacity", active ? 0.95 : 0.45);
      });
      if (targetGroupRef.current) targetGroupRef.current.setAttribute("opacity", Math.max(0, 1 - distT / 900));

      /* verrouillage */
      if (isPlaying && distT < LOCK_RADIUS) {
        lock = Math.min(1, lock + dt / LOCK_MS);
        if (lockBarRef.current) lockBarRef.current.setAttribute("width", 312 * lock);
        if (lockGroupRef.current) lockGroupRef.current.setAttribute("opacity", "1");
        if (lock >= 1 && !isDone) {
          isDone = true;
          setDone(true);
          /* Voyage réussi : on efface le fantôme de l'échec précédent. */
          lastGhostPath = [];
          /* Laisse le temps a l'effet de flash lumineux (1.5s), puis on
             saute a l'epoque du noeud et on ferme la boussole. */
          setTimeout(() => { onLock?.(); onClose?.(); }, 1500);
        }
      } else {
        lock = 0;
        if (lockBarRef.current) lockBarRef.current.setAttribute("width", 0);
        if (lockGroupRef.current) lockGroupRef.current.setAttribute("opacity", "0");
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [whirls, target, onClose, onLock]);

  /* Deformation "gravitationnelle" : chaque tourbillon attire les points
     alentours vers son centre, avec un rayon d'influence 2.2*w.r et une
     force plafonnee pour eviter les singularites. */
  const warp = useMemo(() => (x, y) => {
    let dx = 0, dy = 0;
    for (const w of whirls) {
      const rx = x - w.x, ry = y - w.y;
      const d2 = rx * rx + ry * ry;
      const d = Math.sqrt(d2) || 1;
      const R = w.r * 2.4;
      if (d > R) continue;
      /* Chute progressive au bord + saturation au coeur. */
      const t = 1 - d / R;                       // 0 (bord) -> 1 (centre)
      const pull = Math.min(0.75, t * t * 1.6) * w.r * 0.55;
      dx -= (rx / d) * pull;
      dy -= (ry / d) * pull;
    }
    return [x + dx, y + dy];
  }, [whirls]);
  warpRef.current = warp;

  /* Monde statique memoise : grille (deformee) + tourbillons + noeud. */
  const worldStatic = useMemo(() => {
    const c1 = iso(-WORLD, -WORLD), c2 = iso(WORLD, -WORLD), c3 = iso(WORLD, WORLD), c4 = iso(-WORLD, WORLD);
    const diamond = `M${c1.sx} ${c1.sy} L${c2.sx} ${c2.sy} L${c3.sx} ${c3.sy} L${c4.sx} ${c4.sy} Z`;

    /* Trace une polyligne monde -> iso avec deformation, en la coupant
       chaque fois que l'epoque change (couleur d'epoque par tronçon).
       N = GRID_N pour que les lignes visibles correspondent EXACTEMENT
       aux cases sur lesquelles se deplace le joueur. */
    const N = GRID_N;
    const SUB = 4;            // sous-echantillons par cellule (lignes plus lisses = joueur pile dessus)
    const projectSample = (wx, wy) => {
      const [xw, yw] = warp(wx, wy);
      return iso(xw, yw);
    };
    const buildColoredLine = (ax, ay, bx, by, keyBase) => {
      const out = [];
      const steps = N * SUB;
      let curEra = eraIndexForX(ax);
      let curPts = [];
      const flush = (i) => {
        if (curPts.length >= 2) {
          out.push(
            <polyline key={`${keyBase}_${i}`} points={curPts.join(" ")}
              fill="none" stroke={ERAS[curEra].color} strokeWidth="1.3" opacity="0.55" />
          );
        }
        curPts = [];
      };
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const wx = ax + (bx - ax) * u;
        const wy = ay + (by - ay) * u;
        const e = eraIndexForX(wx);
        const p = projectSample(wx, wy);
        if (e !== curEra && curPts.length > 0) {
          curPts.push(`${p.sx.toFixed(1)},${p.sy.toFixed(1)}`); // finit le troncon
          flush(i);
          curEra = e;
        }
        curPts.push(`${p.sx.toFixed(1)},${p.sy.toFixed(1)}`);
      }
      flush("end");
      return out;
    };
    const grid = [];
    for (let i = 0; i <= N; i++) {
      const t = -WORLD + (i * WORLD * 2) / N;
      grid.push(...buildColoredLine(t, -WORLD, t, WORLD, `v${i}`));
      grid.push(...buildColoredLine(-WORLD, t, WORLD, t, `h${i}`));
    }

    /* --- ATLAS TEMPOREL EN FOND ---
       Grandes icones / dates / noms / lieux epars sur le plateau,
       positionnes selon leur epoque (x monde ~ bande d'epoque). Chaque
       item pulse en opacite pour un effet evanescent, comme si on
       "traversait le temps". Rendu au meme warp+iso que le reste. */
    const BG_ATLAS = [
      // ==== Prehistoire ====
      { x: -0.96, y: -0.66, glyph: "🖐", size: 150, kind: "icon" },
      { x: -0.82, y:  0.10, glyph: "🔥", size: 96,  kind: "icon" },
      { x: -0.72, y:  0.62, glyph: "🐾", size: 82,  kind: "icon" },
      { x: -0.90, y:  0.72, text: "Lascaux",     size: 32, kind: "place" },
      { x: -0.78, y: -0.14, text: "-30 000",     size: 34, kind: "date" },
      { x: -0.66, y: -0.78, text: "Homo sapiens", size: 26, kind: "name" },
      { x: -0.70, y:  0.30, text: "Néolithique", size: 24, kind: "name" },

      // ==== Antiquite ====
      { x: -0.62, y: -0.42, glyph: "🏛", size: 140, kind: "icon" },
      { x: -0.54, y:  0.44, glyph: "⚱", size: 92,  kind: "icon" },
      { x: -0.48, y: -0.10, glyph: "📐", size: 78,  kind: "icon" },
      { x: -0.60, y: -0.72, text: "Cléopâtre",   size: 32, kind: "name" },
      { x: -0.50, y:  0.72, text: "Alexandrie",  size: 30, kind: "place" },
      { x: -0.44, y: -0.55, text: "-30",          size: 34, kind: "date" },
      { x: -0.42, y:  0.20, text: "Rome",         size: 28, kind: "place" },
      { x: -0.55, y:  0.02, text: "Aristote",    size: 24, kind: "name" },

      // ==== Moyen Age ====
      { x: -0.36, y: -0.28, glyph: "⚔", size: 96,  kind: "icon" },
      { x: -0.28, y:  0.50, glyph: "🏰", size: 140, kind: "icon" },
      { x: -0.22, y: -0.66, glyph: "⛪", size: 90,  kind: "icon" },
      { x: -0.40, y:  0.18, text: "Charlemagne", size: 32, kind: "name" },
      { x: -0.24, y: -0.10, text: "Bagdad",      size: 30, kind: "place" },
      { x: -0.34, y: -0.48, text: "800",          size: 34, kind: "date" },
      { x: -0.20, y:  0.72, text: "Constantinople", size: 24, kind: "place" },
      { x: -0.30, y:  0.05, text: "1096 Croisade", size: 22, kind: "date" },

      // ==== Renaissance ====
      { x: -0.16, y: -0.44, glyph: "📜", size: 100, kind: "icon" },
      { x: -0.08, y:  0.32, glyph: "🎨", size: 140, kind: "icon" },
      { x:  0.00, y: -0.72, glyph: "⚙", size: 82,  kind: "icon" },
      { x: -0.14, y:  0.72, text: "Gutenberg",   size: 32, kind: "name" },
      { x: -0.02, y: -0.28, text: "Florence",    size: 30, kind: "place" },
      { x:  0.05, y:  0.05, text: "1450",         size: 34, kind: "date" },
      { x: -0.05, y: -0.55, text: "Léonard",     size: 26, kind: "name" },
      { x:  0.02, y:  0.55, text: "1492 Amériques", size: 22, kind: "date" },

      // ==== Moderne ====
      { x:  0.08, y: -0.30, glyph: "🔭", size: 96,  kind: "icon" },
      { x:  0.18, y:  0.28, glyph: "⚗",  size: 88,  kind: "icon" },
      { x:  0.24, y: -0.68, glyph: "🎼", size: 82,  kind: "icon" },
      { x:  0.14, y:  0.62, text: "Newton",      size: 32, kind: "name" },
      { x:  0.24, y: -0.48, text: "1789",         size: 34, kind: "date" },
      { x:  0.10, y:  0.02, text: "Paris",        size: 28, kind: "place" },
      { x:  0.20, y:  0.72, text: "Mozart",      size: 26, kind: "name" },

      // ==== XIXe ====
      { x:  0.30, y: -0.10, glyph: "🚂", size: 140, kind: "icon" },
      { x:  0.40, y:  0.42, glyph: "💡", size: 100, kind: "icon" },
      { x:  0.34, y: -0.62, glyph: "📷", size: 84,  kind: "icon" },
      { x:  0.30, y:  0.18, text: "Édison",      size: 32, kind: "name" },
      { x:  0.44, y: -0.02, text: "Londres",     size: 30, kind: "place" },
      { x:  0.36, y:  0.72, text: "1889",         size: 34, kind: "date" },
      { x:  0.44, y: -0.30, text: "Marie Curie", size: 26, kind: "name" },

      // ==== XXe guerres ====
      { x:  0.50, y: -0.55, glyph: "📻", size: 96,  kind: "icon" },
      { x:  0.60, y:  0.28, glyph: "✈",  size: 140, kind: "icon" },
      { x:  0.56, y: -0.10, text: "Einstein",    size: 32, kind: "name" },
      { x:  0.58, y: -0.30, text: "1944",         size: 34, kind: "date" },
      { x:  0.48, y:  0.62, text: "Verdun",      size: 30, kind: "place" },
      { x:  0.62, y:  0.72, text: "Turing",      size: 26, kind: "name" },

      // ==== Medias masse ====
      { x:  0.68, y: -0.28, glyph: "📺", size: 140, kind: "icon" },
      { x:  0.76, y:  0.42, glyph: "🕹", size: 96,  kind: "icon" },
      { x:  0.72, y: -0.72, glyph: "🎬", size: 82,  kind: "icon" },
      { x:  0.70, y:  0.02, text: "Kennedy",     size: 32, kind: "name" },
      { x:  0.78, y: -0.44, text: "1969",         size: 34, kind: "date" },
      { x:  0.66, y:  0.72, text: "Woodstock",   size: 26, kind: "place" },
      { x:  0.80, y:  0.18, text: "Neil Armstrong", size: 22, kind: "name" },

      // ==== XXIe ====
      { x:  0.86, y:  0.10, glyph: "📱", size: 110, kind: "icon" },
      { x:  0.94, y: -0.42, glyph: "🛰", size: 140, kind: "icon" },
      { x:  0.90, y:  0.60, glyph: "💻", size: 86,  kind: "icon" },
      { x:  0.86, y: -0.70, text: "Silicon Valley", size: 24, kind: "place" },
      { x:  0.82, y: -0.15, text: "2024",         size: 34, kind: "date" },
      { x:  0.94, y:  0.32, text: "Berners-Lee", size: 24, kind: "name" },
      { x:  0.80, y:  0.30, text: "Internet",    size: 26, kind: "place" },
    ];

    /* Points d'intersection de la grille (deformes par la warp). Rendent
       les noeuds visuellement solidaires des lignes apparentes. */
    const gridDots = [];
    for (let i = 0; i <= N; i++) {
      for (let j = 0; j <= N; j++) {
        const wx0 = -WORLD + (i * WORLD * 2) / N;
        const wy0 = -WORLD + (j * WORLD * 2) / N;
        const [wx, wy] = warp(wx0, wy0);
        const p = iso(wx, wy);
        gridDots.push(
          <circle key={`dot${i}_${j}`} cx={p.sx.toFixed(1)} cy={p.sy.toFixed(1)} r="1.4"
            fill={ERAS[eraIndexForX(wx0)].color} opacity="0.55" />
        );
      }
    }

    /* ---------- GRILLE VIVANTE : overlays sur quelques lignes du maillage ----------
       Trace les 6 lignes "chaudes" (dorées, pulsantes) et 6 lignes "froides"
       (bleu-gris, ternes), en suivant la même warp que le reste. */
    const buildOverlayLine = (ax, ay, bx, by, keyBase) => {
      const steps = N * SUB;
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const wx = ax + (bx - ax) * u;
        const wy = ay + (by - ay) * u;
        const p = projectSample(wx, wy);
        pts.push(`${p.sx.toFixed(1)},${p.sy.toFixed(1)}`);
      }
      return pts.join(" ");
    };
    const liveLines = [];
    liveGrid.hotV.forEach((i) => {
      const t = -WORLD + (i * WORLD * 2) / N;
      const pts = buildOverlayLine(t, -WORLD, t, WORLD, `hv${i}`);
      liveLines.push(
        <polyline key={`hv${i}`} points={pts} fill="none" stroke="#ffd166" strokeWidth="4" opacity="0.55" strokeLinecap="round">
          <animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.6s" repeatCount="indefinite" />
        </polyline>
      );
    });
    liveGrid.hotH.forEach((j) => {
      const t = -WORLD + (j * WORLD * 2) / N;
      const pts = buildOverlayLine(-WORLD, t, WORLD, t, `hh${j}`);
      liveLines.push(
        <polyline key={`hh${j}`} points={pts} fill="none" stroke="#ffd166" strokeWidth="4" opacity="0.55" strokeLinecap="round">
          <animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.6s" repeatCount="indefinite" />
        </polyline>
      );
    });
    liveGrid.coldV.forEach((i) => {
      const t = -WORLD + (i * WORLD * 2) / N;
      const pts = buildOverlayLine(t, -WORLD, t, WORLD, `cv${i}`);
      liveLines.push(
        <polyline key={`cv${i}`} points={pts} fill="none" stroke="#2a3a52" strokeWidth="3" opacity="0.5" strokeDasharray="4 8" />
      );
    });
    liveGrid.coldH.forEach((j) => {
      const t = -WORLD + (j * WORLD * 2) / N;
      const pts = buildOverlayLine(-WORLD, t, WORLD, t, `ch${j}`);
      liveLines.push(
        <polyline key={`ch${j}`} points={pts} fill="none" stroke="#2a3a52" strokeWidth="3" opacity="0.5" strokeDasharray="4 8" />
      );
    });

    return (
      <>
        <path d={diamond} fill="#1a2a48" opacity="0.55" />

        {/* Atlas temporel de fond : icones + dates + noms + lieux
            evanescents, sous la grille. */}
        <g>
          {BG_ATLAS.map((item, i) => {
            const wx0 = item.x * WORLD, wy0 = item.y * WORLD;
            const [wx, wy] = warp(wx0, wy0);
            const p = iso(wx, wy);
            const dur = 7 + (i % 6) * 1.3;         // 7 - 13.5s
            const begin = -((i * 0.73) % dur);      // decalage negatif = demarre deja avance
            const peak = item.kind === "icon" ? 0.28 : 0.32;
            const isText = item.kind !== "icon";
            const fill = isText
              ? (item.kind === "date" ? ERAS[eraIndexForX(wx0)].color : "#a8c8ff")
              : "#a8c8ff";
            return (
              <g key={`bg${i}`} transform={`translate(${p.sx.toFixed(1)} ${p.sy.toFixed(1)})`} opacity="0">
                <animate attributeName="opacity"
                  values={`0;${peak};${peak};0`} keyTimes="0;0.25;0.75;1"
                  dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                {item.kind === "icon" ? (
                  <text textAnchor="middle" dominantBaseline="middle"
                    fontSize={item.size} fill="#e8eef5"
                    style={{ filter: "grayscale(0.35)" }}>
                    {item.glyph}
                  </text>
                ) : (
                  <text textAnchor="middle" dominantBaseline="middle"
                    fontSize={item.size} fontWeight={item.kind === "date" ? 700 : 500}
                    letterSpacing={item.kind === "date" ? "3" : "1.5"}
                    fill={fill} fontFamily={item.kind === "date" ? "ui-monospace,monospace" : "Palatino, Georgia, serif"}
                    style={{ paintOrder: "stroke", stroke: "#0a1224", strokeWidth: 3.5, strokeLinejoin: "round" }}>
                    {item.text}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        <g fill="none">{grid}</g>
        <g>{gridDots}</g>
        {/* Grille vivante : lignes chaudes dorées + lignes mortes bleu-gris. */}
        <g fill="none">{liveLines}</g>
        <path d={diamond} fill="none" stroke="#7fb0e0" strokeWidth="3" strokeDasharray="12 8" opacity="0.9" />

        {/* Reperes de dates : petits, flottants, coleur de l'epoque. */}
        {DATE_MARKERS.map((m, i) => {
          const [wx, wy] = warp(m.x, m.y);
          const p = iso(wx, wy);
          const col = ERAS[eraIndexForX(m.x)].color;
          const dur = 3.6 + (i % 5) * 0.4;
          const amp = 3 + (i % 3);
          return (
            <g key={`d${i}`} transform={`translate(${p.sx} ${p.sy})`} opacity="0.9">
              <animateTransform attributeName="transform" type="translate"
                values={`${p.sx} ${p.sy}; ${p.sx} ${p.sy - amp}; ${p.sx} ${p.sy}`}
                dur={`${dur}s`} repeatCount="indefinite" />
              {m.tick && <line x1="0" y1="-7" x2="0" y2="0" stroke={col} strokeWidth="1" opacity="0.75" />}
              <text x="3" y={m.tick ? -2 : 2} fontSize="9" fontWeight="600"
                fill={col} letterSpacing="0.5"
                style={{ paintOrder: "stroke", stroke: "#0a1224", strokeWidth: 2.4, strokeLinejoin: "round" }}>
                {m.text}
              </text>
            </g>
          );
        })}

        {whirls.map((w, i) => {
          const c = iso(w.x, w.y);
          return (
            <g key={i} transform={`translate(${c.sx} ${c.sy})`}>
              <g>
                <animateTransform attributeName="transform" type="rotate" values={`0; ${360 * w.dir}`} dur={`${5 + (i % 4)}s`} repeatCount="indefinite" />
                {[0.35, 0.6, 0.85, 1].map((k, j) => (
                  <ellipse key={j} rx={w.r * k * ISO_X} ry={w.r * k * ISO_Y * 2.2} fill="none" stroke="#c8a8f0" strokeWidth="2" opacity={0.7 - j * 0.13} />
                ))}
              </g>
              <circle r="5" fill="#e8d8ff" />
            </g>
          );
        })}

        {(() => {
          const [tx, ty] = warp(target.x, target.y);
          const c = iso(tx, ty);
          const col = target.era.color;
          return (
            <g ref={targetGroupRef} transform={`translate(${c.sx} ${c.sy})`}>
              {/* Halo lumineux ethere : gradient radial pulsant */}
              <defs>
                <radialGradient id="compassTargetHalo" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0"    stopColor={col} stopOpacity="0.55" />
                  <stop offset="0.45" stopColor={col} stopOpacity="0.20" />
                  <stop offset="1"    stopColor={col} stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse rx={260 * ISO_X} ry={260 * ISO_Y * 2.2} fill="url(#compassTargetHalo)">
                <animate attributeName="rx" values={`${240 * ISO_X};${300 * ISO_X};${240 * ISO_X}`}
                  dur="4.4s" repeatCount="indefinite" />
                <animate attributeName="ry" values={`${240 * ISO_Y * 2.2};${300 * ISO_Y * 2.2};${240 * ISO_Y * 2.2}`}
                  dur="4.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;1;0.7"
                  dur="4.4s" repeatCount="indefinite" />
              </ellipse>
              {/* Second halo plus petit, plus rapide, decale */}
              <ellipse rx={160 * ISO_X} ry={160 * ISO_Y * 2.2} fill="url(#compassTargetHalo)" opacity="0.6">
                <animate attributeName="rx" values={`${150 * ISO_X};${200 * ISO_X};${150 * ISO_X}`}
                  dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="ry" values={`${150 * ISO_Y * 2.2};${200 * ISO_Y * 2.2};${150 * ISO_Y * 2.2}`}
                  dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.55;0.9;0.55"
                  dur="2.6s" repeatCount="indefinite" />
              </ellipse>

              {[60, 42, 26].map((r, i) => (
                <ellipse key={i} rx={r * ISO_X} ry={r * ISO_Y * 2.2} fill="none" stroke={col} strokeWidth="2.4">
                  <animate attributeName="opacity" values="0.2;0.95;0.2" dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
                </ellipse>
              ))}
              <circle r="10" fill="#ffffff" stroke={col} strokeWidth="2.2" />
              {/* Etiquette du tableau suivant, avec halo pour la lisibilite. */}
              <g transform="translate(28 -14)">
                <rect x="-4" y="-16" width={target.label.length * 8.6 + 40} height="26"
                  rx="13" fill="#0e1a30" stroke={col} strokeWidth="1.4" opacity="0.92" />
                <circle cx="10" cy="-3" r="5" fill={col} />
                <text x="24" y="1" fontSize="13" fontWeight="700" fill="#f5faff" letterSpacing="1">
                  {target.label}
                </text>
              </g>
            </g>
          );
        })()}
      </>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whirls, target, warp, liveGrid]);

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "linear-gradient(180deg,#2a3a58 0%,#14203a 65%,#0a1224 100%)", overflow: "hidden" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: "absolute", inset: 0, color: "#e8eef5", fontFamily: "ui-monospace,monospace" }}>
        <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
          <g ref={cameraRef} transform={`translate(${VW / 2} ${VH / 2}) scale(${ZOOM})`}>
            {worldStatic}

            {/* 👻 FANTÔME du voyage précédent (si on s'est fait attraper juste avant).
                Pâle, en coords écran (iso+warp) déjà projetées. */}
            {ghostSnapshotRef.current.length > 1 && (
              <g opacity="0.55">
                <polyline
                  points={ghostSnapshotRef.current.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
                  fill="none" stroke="#7fffb0" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 6" />
                {/* Croix rouge à l'endroit où on s'est fait avoir */}
                {(() => {
                  const [gx, gy] = ghostSnapshotRef.current[ghostSnapshotRef.current.length - 1];
                  return (
                    <g transform={`translate(${gx} ${gy})`}>
                      <line x1="-6" y1="-6" x2="6" y2="6" stroke="#ff5266" strokeWidth="2.4" />
                      <line x1="-6" y1="6" x2="6" y2="-6" stroke="#ff5266" strokeWidth="2.4" />
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Trainee rouge du tachyon (les segments sont ajoutes en direct) */}
            <g ref={trailGroupRef} />

            {/* Trainee verte du joueur (segments fondants), rendue au-dessus
                pour rester visible malgre la trainee rouge et la grille. */}
            <g ref={playerTrailGroupRef} />

            {/* 🏄 Texte "SURF" qui apparaît quand le joueur chevauche un vortex. */}
            <g ref={surfFlashRef} opacity="0" style={{ pointerEvents: "none" }}>
              <text textAnchor="middle" fontSize="18" fontWeight="800" fill="#ffd700"
                letterSpacing="3" style={{ paintOrder: "stroke", stroke: "#0a1224", strokeWidth: 3, strokeLinejoin: "round" }}>
                ↻ SURF
              </text>
            </g>

            {/* Faux noeuds temporels : apparaissent et disparaissent */}
            {decoys.map((d) => {
              const [wx, wy] = warpRef.current(d.x, d.y);
              const p = iso(wx, wy);
              return (
                <g key={d.id} transform={`translate(${p.sx} ${p.sy})`}>
                  <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.15;0.75;1"
                    dur={`${d.life}ms`} repeatCount="1" fill="freeze" />
                  {[38, 24].map((r, i) => (
                    <ellipse key={i} rx={r * ISO_X} ry={r * ISO_Y * 2.2} fill="none"
                      stroke={d.era.color} strokeWidth="1.6" opacity="0.5" />
                  ))}
                  <circle r="6" fill={d.era.color} opacity="0.7" />
                </g>
              );
            })}
            {/* Les 4 tachyons rouges (un par angle) */}
            {Array.from({ length: TACHYON_COUNT }).map((_, i) => (
              <g key={`t${i}`} ref={(el) => (tachyonRefs.current[i] = el)}>
                <ellipse rx="16" ry="8" fill="none" stroke="#ff2a4a" strokeWidth="1.6" opacity="0.7">
                  <animate attributeName="rx" values="10;22;10" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
                  <animate attributeName="ry" values="5;11;5" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
                  <animate attributeName="opacity" values="0.75;0.45;0.75" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
                </ellipse>
                <circle r="10" fill="#ff2a4a" stroke="#480010" strokeWidth="2" />
                <circle r="4" fill="#ffd0d8" />
              </g>
            ))}
            <g ref={playerRef}>
              <ellipse cy="8" rx="16" ry="5" fill="#000" opacity="0.5" />
              <circle r="11" fill="#7fffb0" stroke="#0e2a1a" strokeWidth="2" />
              <ellipse rx="20" ry="10" fill="none" stroke="#7fffb0" strokeWidth="1.6" opacity="0.6">
                <animate attributeName="rx" values="14;26;14" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="ry" values="7;13;7" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
              </ellipse>
            </g>
          </g>

          {/* HUD boussole : 5 arcs concentriques orientes vers la cible */}
          <g transform={`translate(${VW - 140} 140)`}>
            <circle r="96" fill="#0e1a30" stroke="#7fb0e0" strokeWidth="1.6" opacity="0.9" />
            <g ref={needleRef}>
              {/* Arcs de +/-40 deg centres sur la direction de la cible.
                  chord = 2 * r * sin(40 deg) ; on trace un arc SVG. */}
              {[0, 1, 2, 3, 4].map((k) => {
                const r = 16 + (k + 1) * 12;
                const a = (40 * Math.PI) / 180;
                const x1 = r * Math.cos(-a), y1 = r * Math.sin(-a);
                const x2 = r * Math.cos( a), y2 = r * Math.sin( a);
                return (
                  <path key={k} ref={(el) => (ringsRef.current[k] = el)}
                    d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
                    fill="none" stroke="#233855" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
                );
              })}
              {/* fleche + rivet au centre */}
              <path d="M0 0 L76 0 L68 -5 M76 0 L68 5" stroke="#ffe08a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle r="5" fill="#ffe08a" />
            </g>
            <text y="122" textAnchor="middle" fontSize="12" letterSpacing="2" fill="#a8c8ff">PROXIMITE</text>
            <text y="-114" textAnchor="middle" fontSize="11" letterSpacing="2" fill="#a8c8ff">BOUSSOLE TEMPORELLE</text>
          </g>

          {/* barre de verrouillage */}
          <g ref={lockGroupRef} transform={`translate(${VW / 2} 50)`} opacity="0">
            <rect x="-160" y="-12" width="320" height="24" rx="4" fill="#0e1a30" stroke="#7fffb0" strokeWidth="1.4" />
            <rect ref={lockBarRef} x="-156" y="-9" width="0" height="18" rx="3" fill="#7fffb0" />
            <text y="-20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#7fffb0" letterSpacing="3">VERROUILLAGE…</text>
          </g>
          {done && (
            <>
              {/* Flash lumineux : gradient radial plein ecran a la couleur
                  de l'epoque, monte de 0 a 1, effet flou/ethere avant l'atterrissage. */}
              <defs>
                <radialGradient id="warpFlash" cx="0.5" cy="0.5" r="0.65">
                  <stop offset="0"    stopColor="#ffffff"       stopOpacity="1" />
                  <stop offset="0.35" stopColor={target.era.color} stopOpacity="0.95" />
                  <stop offset="1"    stopColor={target.era.color} stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width={VW} height={VH} fill="url(#warpFlash)">
                <animate attributeName="opacity" values="0;1;1" keyTimes="0;0.6;1"
                  dur="1.5s" repeatCount="1" fill="freeze" />
              </rect>
              {/* Nom du tableau atteint qui apparait au coeur du flash. */}
              <g transform={`translate(${VW / 2} ${VH / 2 - 40})`} opacity="0">
                <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.3;0.6;1"
                  dur="1.5s" repeatCount="1" fill="freeze" />
                <text textAnchor="middle" fontSize="22" letterSpacing="4" fill="#0a1224" opacity="0.7">DESTINATION</text>
                <text y="52" textAnchor="middle" fontSize="42" fontWeight="800" fill="#0a1224" letterSpacing="4">
                  {target.label}
                </text>
                <text y="92" textAnchor="middle" fontSize="16" letterSpacing="3" fill="#0a1224" opacity="0.7">
                  {target.era.name}
                </text>
              </g>
            </>
          )}
          {caught && (
            <>
              <rect x="0" y="0" width={VW} height={VH} fill="#3a0010" opacity="0.55" />
              <g transform={`translate(${VW / 2} ${VH / 2})`}>
                <text textAnchor="middle" fontSize="42" fontWeight="800" fill="#ff5266" letterSpacing="6">⚠ TACHYONS ROUGES ⚠</text>
                <text y="42" textAnchor="middle" fontSize="18" fill="#ffd0d8" letterSpacing="3">La ligne temporelle est coupée</text>
              </g>
            </>
          )}

          <text x="24" y={VH - 24} fontSize="12" fill="#a8c8ff" letterSpacing="2">
            ↑ ↓ ← →  ou  W A S D   ·   ESPACE = frein   ·   ESC pour quitter
          </text>


          {/* mini-map */}
          <g transform={`translate(${VW - 170} ${VH - 170})`}>
            <rect x="0" y="0" width="150" height="150" fill="#0e1a30" stroke="#7fb0e0" strokeWidth="1.4" opacity="0.9" />
            <text x="75" y="14" textAnchor="middle" fontSize="9" fill="#a8c8ff" letterSpacing="2">CARTE</text>
            <g transform="translate(75 80)">
              {whirls.map((w, i) => (
                <circle key={i} cx={(w.x / WORLD) * 60} cy={(w.y / WORLD) * 60} r={(w.r / WORLD) * 60 + 1} fill="none" stroke="#c8a8f0" strokeWidth="0.6" opacity="0.6" />
              ))}
              <circle cx={(target.x / WORLD) * 60} cy={(target.y / WORLD) * 60} r="3" fill="#ffe08a" />
              {Array.from({ length: TACHYON_COUNT }).map((_, i) => (
                <circle key={`tm${i}`} ref={(el) => (tachyonMiniRefs.current[i] = el)} cx="0" cy="0" r="2.4" fill="#ff2a4a" />
              ))}
              <circle ref={minimapPlayerRef} cx="0" cy="0" r="2.4" fill="#7fffb0" />
              <rect x="-62" y="-62" width="124" height="124" fill="none" stroke="#7fb0e0" strokeWidth="0.6" strokeDasharray="3 3" />
            </g>
          </g>
        </svg>

        {/* --- BRIEF DE MARTINE : mission + explication + bouton GO --- */}
        {phase === "brief" && (
          <div onClick={(e) => e.stopPropagation()} style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(4, 8, 18, 0.72)", zIndex: 20,
          }}>
            <div style={{
              maxWidth: 620, background: "#0e1a30",
              border: "2px solid #5eff9e", borderRadius: 16,
              padding: "26px 28px 22px", boxShadow: "0 0 40px rgba(94,255,158,0.35)",
              fontFamily: "Palatino, Georgia, serif", color: "#e8eef5", textAlign: "center",
            }}>
              <div style={{
                fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3,
                color: "#5eff9e", marginBottom: 6,
              }}>▶ MARTINE — CANAL PRIORITAIRE</div>
              <h2 style={{
                margin: "6px 0 6px", fontSize: 26, letterSpacing: 2, color: "#ffd166",
                textTransform: "uppercase",
              }}>Mission prioritaire</h2>
              <div style={{
                margin: "0 0 14px", fontFamily: "ui-monospace,monospace", fontSize: 11,
                letterSpacing: 3, color: "#ff8a94",
              }}>⚠ {cfg.label}</div>
              <p style={{ fontSize: 16.5, lineHeight: 1.55, margin: "0 0 14px" }}>
                Nous sommes dans le <strong>flux du temps</strong>. Grâce à la
                boussole temporelle, trouve un <strong>nœud dans le temps</strong>
                {" "}et voyage jusqu'à son époque.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.5, margin: "0 0 10px", color: "#c8d4e2" }}>
                <strong style={{ color: "#7fffb0" }}>Flèches</strong> pour avancer,
                {" "}<strong style={{ color: "#7fffb0" }}>Espace</strong> pour freiner.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 10px", color: "#c8d4e2" }}>
                Les <strong style={{ color: "#ffd166" }}>lignes dorées</strong> accélèrent,
                les <strong style={{ color: "#5a6a80" }}>lignes mortes</strong> freinent.
                {" "}Chevaucher un <strong style={{ color: "#c8a8f0" }}>tourbillon</strong>
                {" "}dans son sens → <strong style={{ color: "#ffd700" }}>SURF</strong>.
              </p>
              <p style={{
                fontSize: 14, lineHeight: 1.5, margin: "0 0 20px",
                color: "#ff8a94", fontWeight: 700,
              }}>
                ⚠ Attention aux <span style={{ color: "#ff2a4a" }}>tachyons rouges</span>,
                protecteurs du temps.
              </p>
              <button onClick={() => setPhase("countdown")}
                autoFocus
                style={{
                  background: "#5eff9e", color: "#06110b", border: "none",
                  borderRadius: 12, padding: "14px 44px", fontSize: 18, fontWeight: 800,
                  cursor: "pointer", fontFamily: "ui-monospace,monospace",
                  letterSpacing: 3, boxShadow: "0 0 20px rgba(94,255,158,0.5)",
                }}>▶ GO</button>
            </div>
          </div>
        )}

        {/* --- DECOMPTE 3 - 2 - 1 --- */}
        {phase === "countdown" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(4, 8, 18, 0.45)", zIndex: 20, pointerEvents: "none",
          }}>
            <div key={countdown} style={{
              fontFamily: "ui-monospace,monospace", fontSize: "clamp(180px, 30vw, 320px)",
              fontWeight: 800, color: "#ffd166", letterSpacing: 8,
              textShadow: "0 0 40px rgba(255,209,102,0.7), 0 0 80px rgba(232,150,74,0.5)",
              animation: "compassCountdown 1s ease-out forwards",
            }}>{countdown}</div>
            <style>{`
              @keyframes compassCountdown {
                0% { transform: scale(0.5); opacity: 0; }
                20% { transform: scale(1.2); opacity: 1; }
                80% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.35); opacity: 0; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
