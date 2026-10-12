/* ============================================================
   JEU 3 — SCÈNE : « Salle temporelle abandonnée » (K-01) — Phase 4+5
   ------------------------------------------------------------
   Grande salle oubliée au niveau K. Trois états :
     intro   — courte narration au premier passage
     noir    — pièce dans le noir, interrupteur à cliquer
     lit     — scène allumée, puzzle à 4 leviers
     resolu  — tableau blanc coulissé, portail allumé
     cockpit — modal de voyage (clavier d'années)

   Puzzle : 4 leviers à chiffres (0-9). Chaque clic incrémente le
   chiffre. Les 4 doivent former l'année d'une invention tirée au
   hasard du médiadex. Le tableau blanc en donne le nom. Auto-check
   à chaque clic.
   ============================================================ */
import { useState, useEffect, useMemo, useRef } from "react";
import INVENTIONS from "../../../engine/inventions-meta.json";

/* ============================================================
   Petits sons générés en Web Audio — pas de fichiers externes.
   - pumpBeep : court bip ascendant « pfft » quand on amorce une jauge.
   - startupSweep : balayage SF descendant quand le portail prend vie.
   ============================================================ */
function makeAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    return new Ctx();
  } catch { return null; }
}
function pumpBeep(ctx) {
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, t0);
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.18);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.14, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.24);
  } catch {}
}
/* Bruit SOURD et GRAVE d'un mur de béton qui coulisse — rumble très
   bas (~40 Hz) + frottement sourd. Pas d'aigus. ~8 s. */
function wallSlide(ctx) {
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime;
    const DUR = 8;
    /* 1) Rumble très grave (sinus 42 → 32 Hz) */
    const rumble = ctx.createOscillator();
    const rGain = ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.setValueAtTime(42, t0);
    rumble.frequency.linearRampToValueAtTime(32, t0 + DUR);
    rGain.gain.setValueAtTime(0.0001, t0);
    rGain.gain.linearRampToValueAtTime(0.3, t0 + 1);
    rGain.gain.setValueAtTime(0.3, t0 + DUR - 1);
    rGain.gain.linearRampToValueAtTime(0.0001, t0 + DUR);
    rumble.connect(rGain).connect(ctx.destination);
    rumble.start(t0);
    rumble.stop(t0 + DUR + 0.1);
    /* 2) Deuxième oscillateur grave légèrement désaccordé pour épaissir
       (sinus 60 → 48 Hz) */
    const sub = ctx.createOscillator();
    const sGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(60, t0);
    sub.frequency.linearRampToValueAtTime(48, t0 + DUR);
    sGain.gain.setValueAtTime(0.0001, t0);
    sGain.gain.linearRampToValueAtTime(0.18, t0 + 1);
    sGain.gain.setValueAtTime(0.18, t0 + DUR - 1);
    sGain.gain.linearRampToValueAtTime(0.0001, t0 + DUR);
    sub.connect(sGain).connect(ctx.destination);
    sub.start(t0);
    sub.stop(t0 + DUR + 0.1);
    /* 3) Frottement SOURD : bruit filtré passe-bas très bas (120 → 80 Hz) */
    const bufSize = Math.floor(ctx.sampleRate * DUR);
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const nFilt = ctx.createBiquadFilter();
    nFilt.type = "lowpass";
    nFilt.frequency.setValueAtTime(120, t0);
    nFilt.frequency.linearRampToValueAtTime(80, t0 + DUR);
    nFilt.Q.setValueAtTime(1.4, t0);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.0001, t0);
    nGain.gain.linearRampToValueAtTime(0.14, t0 + 1);
    nGain.gain.setValueAtTime(0.14, t0 + DUR - 1);
    nGain.gain.linearRampToValueAtTime(0.0001, t0 + DUR);
    noise.connect(nFilt).connect(nGain).connect(ctx.destination);
    noise.start(t0);
    noise.stop(t0 + DUR);
  } catch {}
}
function startupSweep(ctx) {
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime;
    /* Onde porteuse qui descend */
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1200, t0);
    osc.frequency.exponentialRampToValueAtTime(90, t0 + 1.6);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6);
    /* Filtre passe-bas qui glisse */
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(2000, t0);
    filt.frequency.exponentialRampToValueAtTime(120, t0 + 1.5);
    osc.connect(filt).connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 1.7);
    /* Puff de bruit blanc par-dessus pour densifier */
    const bufferSize = Math.floor(ctx.sampleRate * 0.4);
    const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.08, t0);
    nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
    noise.connect(nGain).connect(ctx.destination);
    noise.start(t0);
  } catch {}
}

/* Charge l'invention indice depuis flags.k_puzzle_invention
   (tiré au hasard en début de Jeu 3 parmi les 3 dossiers falsifiés
   gutenberg / chappe / marconi). Fallback : Gutenberg. */
function loadPuzzleInvention(flags) {
  const id = flags?.k_puzzle_invention || "presse-gutenberg";
  const inv = INVENTIONS.find((x) => x.id === id) || INVENTIONS.find((x) => x.id === "presse-gutenberg");
  const s = String(inv.date).replace(/[\s  .]/g, "");
  const year = parseInt(s.match(/(\d{4})/)[1], 10);
  /* Certains titres portent une parenthèse qui mentionne une AUTRE
     date (celle du tableau peint, de la vue d'époque…) qu'il ne faut
     pas laisser apparaître sur le tableau du puzzle — sinon l'élève
     compose cette année-là au lieu de l'année de l'invention. On
     garde donc seulement la racine du titre. */
  const title = String(inv.title).replace(/\s*\([^)]*\)\s*$/, "").trim();
  return { ...inv, title, year, digits: String(year).split("").map((d) => parseInt(d, 10)) };
}

export default function BunkerSalleK({ onGo, j3 }) {
  const alreadyActive = !!j3?.flags?.salle_k_reactivee;
  const alreadyOnline = !!j3?.flags?.salle_k_portal_online;
  const alreadyVue = !!j3?.flags?.salle_k_vue;
  const [intro, setIntro] = useState(!alreadyVue);
  const [introIdx, setIntroIdx] = useState(0);
  const [lit, setLit] = useState(alreadyActive);
  /* tableauOuvert : puzzle résolu, le tableau blanc a coulissé.
     portalOnline : les 4 cadrans ont été chargés par le joueur. */
  const [tableauOuvert, setTableauOuvert] = useState(alreadyActive);
  const [cadrans, setCadrans] = useState(alreadyOnline ? [true, true, true, true] : [false, false, false, false]);
  const portalOnline = cadrans.every(Boolean);
  const [cockpit, setCockpit] = useState(false);

  /* Invention indice (posée en début de Jeu 3, stable pour la partie). */
  const target = useMemo(() => loadPuzzleInvention(j3?.flags), [j3?.flags?.k_puzzle_invention]);
  /* État des 4 chiffres (gauche à droite). Chaque clic sur un levier
     incrémente, 9 → 0 (wrap). Auto-check à chaque changement. */
  const [digits, setDigits] = useState(alreadyActive ? [...target.digits] : [0, 0, 0, 0]);

  useEffect(() => {
    if (tableauOuvert) return;
    if (digits.every((d, i) => d === target.digits[i])) {
      const t = setTimeout(() => {
        j3.setFlag("salle_k_reactivee");
        setTableauOuvert(true);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [digits, target, tableauOuvert, j3]);

  /* Quand les 4 cadrans sont chargés, pose le flag et accepte le
     clic sur le portail. */
  useEffect(() => {
    if (portalOnline && !j3?.flags?.salle_k_portal_online) {
      j3.setFlag("salle_k_portal_online");
    }
  }, [portalOnline, j3]);

  const bumpDigit = (idx) => {
    if (tableauOuvert) return;
    setDigits((d) => d.map((v, i) => (i === idx ? (v + 1) % 10 : v)));
  };

  /* Contexte audio paresseux : créé au 1er clic utilisateur (requis par
     les navigateurs qui bloquent AudioContext tant qu'il n'y a pas eu
     d'interaction). */
  const audioRef = useRef(null);
  const ensureAudio = () => {
    if (!audioRef.current) audioRef.current = makeAudio();
    if (audioRef.current && audioRef.current.state === "suspended") {
      audioRef.current.resume().catch(() => {});
    }
    return audioRef.current;
  };

  const chargeCadran = (idx) => {
    if (!tableauOuvert || portalOnline) return;
    if (cadrans[idx]) return;
    pumpBeep(ensureAudio());
    setCadrans((c) => c.map((v, i) => (i === idx ? true : v)));
  };

  /* Déclenche le son de démarrage SF au moment où le portail s'allume. */
  const prevPortalOnline = useRef(portalOnline);
  useEffect(() => {
    if (!prevPortalOnline.current && portalOnline) {
      startupSweep(ensureAudio());
    }
    prevPortalOnline.current = portalOnline;
  }, [portalOnline]);

  /* Bruit de mur qui coulisse quand le tableau s'ouvre. */
  const prevTableauOuvert = useRef(tableauOuvert);
  useEffect(() => {
    if (!prevTableauOuvert.current && tableauOuvert) {
      wallSlide(ensureAudio());
    }
    prevTableauOuvert.current = tableauOuvert;
  }, [tableauOuvert]);

  /* --- Intro narrative --- */
  if (intro) {
    const lignes = [
      "L'ascenseur s'ouvre sur un couloir qui n'a pas vu de pas depuis quarante ans.",
      "L'air est lourd, chargé de poussière. Au bout, une double porte entrouverte sur une pièce noire.",
      "Jorge avait raison. Il y a quelque chose ici — tu le sens avant de le voir.",
    ];
    const last = introIdx >= lignes.length - 1;
    return (
      <div onClick={() => (last ? (j3.setFlag("salle_k_vue"), setIntro(false)) : setIntroIdx((i) => i + 1))}
        style={{ position: "fixed", inset: 0, background: "rgba(2,4,8,0.96)", zIndex: 320, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer", fontFamily: "Palatino, Georgia, serif" }}>
        <div style={{ maxWidth: 680, color: "#e8dfc8", textAlign: "center" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 4, color: "#c8a848", marginBottom: 18 }}>
            ⟡ ÉTAGE K — SALLE OUBLIÉE
          </div>
          <p style={{ fontSize: 20, lineHeight: 1.6, margin: 0 }}>{lignes[introIdx]}</p>
          <div style={{ marginTop: 24, fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8a7050", fontStyle: "italic" }}>
            {last ? "Clique pour entrer ▸" : `${introIdx + 1} / ${lignes.length} · clique ▸`}
          </div>
        </div>
      </div>
    );
  }

  const flags = j3?.flags || {};
  const voyagesDone = ["gutenberg", "chappe", "marconi"].filter((id) => flags[`voyageK_${id}_done`]).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520"
        style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <SalleKDecor lit={lit}
          tableauOuvert={tableauOuvert}
          portalOnline={portalOnline}
          onSwitch={() => setLit(true)}
          digits={digits}
          onBump={bumpDigit}
          target={target}
          cadrans={cadrans}
          onChargeCadran={chargeCadran}
          onPortalClick={() => portalOnline && setCockpit(true)} />
      </svg>

      {/* Panneau bas d'état */}
      <div style={{ maxWidth: 1200, width: "100%" }}>
        {!lit ? (
          <div style={{ background: "#0a0806", border: "1px dashed #5a4028", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#8a7050", fontStyle: "italic", lineHeight: 1.55 }}>
              Il fait nuit noire. Tu devines à peine les contours de la pièce. Quelque chose luit faiblement, près de la porte sur la droite.
            </p>
          </div>
        ) : !tableauOuvert ? (
          <div style={{ background: "#2a1808", border: "1px dashed #c8a848", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>
              ⟡ SALLE K — HORS SERVICE
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#c8b090", lineHeight: 1.55, fontStyle: "italic" }}>
              Quatre leviers à chiffres sont dissimulés dans la pièce. Chaque clic sur un levier fait avancer son chiffre. Ensemble, ils forment une année — celle d'une invention notée sur le tableau blanc. Fouille, cherche, essaie.
            </p>
          </div>
        ) : !portalOnline ? (
          <div style={{ background: "#141c26", border: "1px dashed #7fd8ff", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#7fd8ff", fontWeight: 800 }}>
              ⚙ PUPITRE DÉVOILÉ — CHARGER LES CADRANS
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#c8e4ff", lineHeight: 1.55, fontStyle: "italic" }}>
              Le tableau blanc a glissé et dévoilé un pupitre à quatre cadrans. Clique chaque cadran pour l'amorcer. Les quatre chargés, le portail prendra vie.
            </p>
            <div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#7fd8ff", letterSpacing: 2 }}>
              cadrans · {cadrans.filter(Boolean).length} / {cadrans.length} chargés
            </div>
          </div>
        ) : (
          <div style={{ background: "#0e2818", border: "1px solid #7fd8ff", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#7fd8ff", fontWeight: 800 }}>
              {voyagesDone} / 3 VOYAGES
            </div>
            {voyagesDone === 3 && (
              <div style={{ marginTop: 10 }}>
                <button onClick={() => onGo("epilogueJeu3")}
                  style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 2 }}>
                  ⟡ Remonter rapporter ▸
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => onGo("elevator")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Reprendre l'ascenseur
      </button>

      {cockpit && (
        <CockpitVoyage j3={j3} onGo={onGo} onClose={() => setCockpit(false)} />
      )}
    </div>
  );
}

/* ============================================================
   DÉCOR SVG
   ============================================================ */
function SalleKDecor({ lit, tableauOuvert, portalOnline, onSwitch, digits, onBump, target, cadrans, onChargeCadran, onPortalClick }) {
  return (
    <>
      <defs>
        <linearGradient id="sk-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#2a2420" : "#0a0806"} />
          <stop offset="100%" stopColor={lit ? "#141008" : "#020202"} />
        </linearGradient>
        <linearGradient id="sk-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#2a1e10" : "#060402"} />
          <stop offset="100%" stopColor={lit ? "#0e0804" : "#010101"} />
        </linearGradient>
        <linearGradient id="sk-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#d8a848" : "#2a2010"} />
          <stop offset="100%" stopColor={lit ? "#8a5820" : "#1a0e08"} />
        </linearGradient>
        <linearGradient id="sk-copper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? "#a86838" : "#1a1008"} />
          <stop offset="100%" stopColor={lit ? "#5a3818" : "#0a0804"} />
        </linearGradient>
        <radialGradient id="sk-bulb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c8" stopOpacity={lit ? 1 : 0} />
          <stop offset="40%" stopColor="#ffd870" stopOpacity={lit ? 0.6 : 0} />
          <stop offset="100%" stopColor="#ffd870" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sk-dust" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#c8b090" stopOpacity={lit ? 0.35 : 0} />
          <stop offset="100%" stopColor="#c8b090" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sk-portalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity={portalOnline ? 0.75 : 0.08} />
          <stop offset="50%" stopColor="#a840f0" stopOpacity={portalOnline ? 0.3 : 0} />
          <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sk-portalCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8f8ff" stopOpacity={portalOnline ? 0.9 : 0.05} />
          <stop offset="60%" stopColor="#7fd8ff" stopOpacity={portalOnline ? 0.6 : 0.02} />
          <stop offset="100%" stopColor="#0a1428" stopOpacity={portalOnline ? 0.9 : 1} />
        </radialGradient>
        <pattern id="sk-brick" x="0" y="0" width="80" height="36" patternUnits="userSpaceOnUse">
          <rect width="80" height="36" fill={lit ? "#2a1e14" : "#060404"} />
          <path d="M0 18 L80 18 M40 0 L40 18 M0 36 L80 36 M20 18 L20 36 M60 18 L60 36"
            stroke={lit ? "#1a1008" : "#030202"} strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Mur et sol */}
      <rect width="1000" height="520" fill="url(#sk-wall)" />
      <rect width="1000" height="340" fill="url(#sk-brick)" opacity="0.5" />
      <rect y="380" width="1000" height="140" fill="url(#sk-floor)" />
      <rect y="376" width="1000" height="8" fill={lit ? "#1a1008" : "#030202"} />

      {/* Plafond, poutres, tuyaux */}
      <rect y="0" width="1000" height="36" fill={lit ? "#1a0e08" : "#020202"} />
      {[180, 500, 820].map((x, i) => (
        <rect key={i} x={x - 50} y="18" width="100" height="6" fill={lit ? "#3a2010" : "#060402"} />
      ))}
      <g>
        <rect x="0" y="42" width="1000" height="18" fill="url(#sk-copper)" />
        <rect x="0" y="42" width="1000" height="3" fill={lit ? "#e8a868" : "#0a0804"} opacity="0.5" />
        <rect x="0" y="57" width="1000" height="3" fill={lit ? "#2a1808" : "#010101"} opacity="0.9" />
        {[120, 320, 520, 720, 920].map((x, i) => (
          <g key={i} transform={`translate(${x},50)`}>
            <rect x="-6" y="-10" width="12" height="22" fill={lit ? "#3a2010" : "#030302"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
            <circle r="2" fill={lit ? "#c8a848" : "#1a1008"} />
          </g>
        ))}
        <rect x="920" y="60" width="18" height="200" fill="url(#sk-copper)" />
        <circle cx="929" cy="60" r="12" fill={lit ? "#8a5020" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1" />
        <circle cx="929" cy="60" r="4" fill={lit ? "#c8a848" : "#1a1008"} />
      </g>
      <rect x="620" y="356" width="340" height="12" fill="url(#sk-brass)" />
      <rect x="620" y="356" width="340" height="2" fill={lit ? "#f0d890" : "#0a0804"} opacity="0.5" />

      {/* Ampoule */}
      <g>
        <line x1="500" y1="24" x2="500" y2="110" stroke={lit ? "#5a3818" : "#0a0804"} strokeWidth="1.2" />
        <circle cx="500" cy="110" r="36" fill="url(#sk-bulb)" />
        <circle cx="500" cy="110" r="12" fill={lit ? "#ffd870" : "#141008"} stroke={lit ? "#8a5020" : "#1a0e08"} strokeWidth="1.2">
          {lit && <animate attributeName="opacity" values="0.85;1;0.9" dur="4s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Toiles d'araignée */}
      <Cobweb cx="18" cy="42" r={60} lit={lit} />
      <Cobweb cx="982" cy="42" r={70} lit={lit} />
      <Cobweb cx="18" cy="520" r={48} lit={lit} />

      {/* ═══ PORTAIL TEMPOREL — gauche ═══ */}
      <PortailArche lit={lit} portalOnline={portalOnline} onClick={onPortalClick} />

      {/* Câbles qui serpentent du portail au bureau */}
      <path d="M220 360 Q320 380 420 370 Q500 365 540 358" stroke={lit ? "#2a1808" : "#030202"} strokeWidth="4" fill="none" />
      <path d="M220 370 Q340 388 450 378 Q520 374 560 368" stroke={lit ? "#1a0e08" : "#020101"} strokeWidth="3" fill="none" />

      {/* ═══ BUREAU DE RECHERCHE — centre-fond ═══ */}
      <BureauRecherche lit={lit} />

      {/* ═══ TABLEAU BLANC — mur du fond ═══ */}
      <TableauBlanc lit={lit} tableauOuvert={tableauOuvert}
        portalOnline={portalOnline} target={target}
        cadrans={cadrans} onChargeCadran={onChargeCadran} />

      {/* ═══ MACHINES DÉCORATIVES ═══ */}
      {/* Oscilloscope */}
      <g transform="translate(680,320)">
        <rect x="-30" y="0" width="60" height="42" fill={lit ? "#3a4048" : "#060606"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1" rx="2" />
        <circle r="16" cx="-6" cy="20" fill={lit ? "#0a1a0a" : "#020202"} stroke={lit ? "#5eff9e" : "#1a1008"} strokeWidth="1.2" />
        {lit && (
          <path d="M-20 20 Q-14 10 -8 20 Q-2 30 4 20 Q10 10 16 20"
            stroke="#5eff9e" strokeWidth="0.9" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.3s" repeatCount="indefinite" />
          </path>
        )}
      </g>
      {/* Bobine Tesla */}
      <g transform="translate(880,330)">
        <rect x="-14" y="20" width="28" height="12" fill={lit ? "#3a2010" : "#060402"} />
        <rect x="-8" y="-10" width="16" height="34" fill={lit ? "#8a5020" : "#0a0804"} />
        <circle cy="-18" r="12" fill={lit ? "#5a6270" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        {lit && (
          <path d="M0 -30 L-6 -40 L4 -36 L-8 -48" stroke="#7fd8ff" strokeWidth="0.9" fill="none" opacity="0.7">
            <animate attributeName="opacity" values="0;0.9;0" dur="1.7s" repeatCount="indefinite" />
          </path>
        )}
      </g>
      {/* Générateur rouillé */}
      <g transform="translate(300,370)">
        <rect x="-40" y="0" width="80" height="24" fill={lit ? "#5a3818" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1" />
        <rect x="-30" y="-14" width="60" height="14" fill={lit ? "#3a2010" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <circle cx="-20" cy="7" r="4" fill={lit ? "#8a5020" : "#0a0804"} />
        <circle cx="20" cy="7" r="4" fill={lit ? "#8a5020" : "#0a0804"} />
      </g>
      {/* Caisses */}
      <g transform="translate(240,370)">
        <rect x="-20" y="0" width="40" height="20" fill={lit ? "#5a3818" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <rect x="-14" y="-18" width="36" height="18" fill={lit ? "#5a3818" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <text x="0" y="14" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill={lit ? "#8a5020" : "#1a1008"}>
          LAB-K
        </text>
      </g>

      {/* ═══ 4 LEVIERS DU PUZZLE ═══
          Placement : alignés sur quatre lieux distincts et clairs.
          Chaque levier possède son propre « rang » (milliers →
          unités) et affiche un compteur 0-9 juste en dessous. */}
      <ChiffreLever x={340} y={356} rank={0} digit={digits[0]} lit={lit} resolu={tableauOuvert} onClick={() => onBump(0)} hint="générateur" />
      <ChiffreLever x={580} y={350} rank={1} digit={digits[1]} lit={lit} resolu={tableauOuvert} onClick={() => onBump(1)} hint="pupitre bureau" />
      <ChiffreLever x={700} y={300} rank={2} digit={digits[2]} lit={lit} resolu={tableauOuvert} onClick={() => onBump(2)} hint="oscilloscope" />
      <ChiffreLever x={880} y={310} rank={3} digit={digits[3]} lit={lit} resolu={tableauOuvert} onClick={() => onBump(3)} hint="bobine Tesla" />

      {/* ═══ PORTE ANCIENNE — droite ═══ */}
      <g transform="translate(930,180)">
        <path d="M-40 180 L-40 -20 Q-40 -40 0 -40 Q40 -40 40 -20 L40 180 Z"
          fill={lit ? "#5a3818" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="2" />
        {[-30, -14, 2, 18].map((x, i) => (
          <line key={i} x1={x} y1="-20" x2={x} y2="180" stroke={lit ? "#3a2010" : "#060402"} strokeWidth="1" />
        ))}
        {[-10, 60, 150].map((y, i) => (
          <rect key={i} x="-40" y={y} width="80" height="12" fill={lit ? "#3a4048" : "#060606"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        ))}
        <circle cx="-20" cy="90" r="8" fill="none" stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="2.5" />
        <rect x="-30" y="30" width="60" height="12" fill={lit ? "#141008" : "#010101"} stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="0.8" />
        <text x="0" y="40" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7"
          fill={lit ? "#c8a848" : "#2a2010"} letterSpacing="3">
          K-01
        </text>
      </g>

      {/* ═══ INTERRUPTEUR — phase noir : juste une pulsation sourde,
          pas une lampe éblouissante. ═══ */}
      {!lit && (
        <g transform="translate(866,290)"
          onClick={(e) => { e.stopPropagation(); onSwitch(); }}
          style={{ cursor: "pointer" }}>
          <rect x="-14" y="-18" width="28" height="36" fill="#0a0804" stroke="#3a2814" strokeWidth="1" rx="2" />
          <circle r="7" fill="#0a0804" stroke="#5a4028" strokeWidth="1">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="#8a6830">
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Poussière en suspension */}
      {lit && [[200, 180], [400, 220], [600, 200], [800, 160]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="30" ry="8" fill="url(#sk-dust)" opacity="0.3" />
          <circle cx={x} cy={y} r="1" fill="#e8dfc8" opacity="0.5">
            <animate attributeName="cy" values={`${y};${y - 10};${y}`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Plaque K-01 */}
      {lit && (
        <g transform="translate(500,74)">
          <rect x="-60" y="0" width="120" height="16" fill="#141008" stroke="#c8a848" strokeWidth="1" />
          <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700"
            fill="#c8a848" letterSpacing="3">
            K-01 · PROTOTYPE
          </text>
        </g>
      )}
    </>
  );
}

/* ============================================================
   PORTAIL — arche de pierre, inactif ou allumé néon
   ============================================================ */
function PortailArche({ lit, portalOnline, onClick }) {
  return (
    <g transform="translate(140,260)">
      {/* Halo externe double */}
      <circle r="160" fill="url(#sk-portalGlow)" />
      {portalOnline && (
        <circle r="130" fill="none" stroke="#7fd8ff" strokeWidth="1.2" opacity="0.3">
          <animate attributeName="r" values="120;140;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Arche pierre */}
      <path d="M-90 110 L-90 -20 Q-90 -100 0 -100 Q90 -100 90 -20 L90 110 L68 110 L68 -20 Q68 -78 0 -78 Q-68 -78 -68 -20 L-68 110 Z"
        fill={lit ? "#3a2818" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = -Math.PI / 2 + (i - 5.5) * (Math.PI / 12);
        const x = Math.cos(a) * 78;
        const y = Math.sin(a) * 78;
        return <circle key={i} cx={x} cy={y} r="4" fill="none" stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />;
      })}
      {/* Zone cliquable + plasma */}
      <g style={{ cursor: portalOnline ? "pointer" : "default" }}
        onClick={portalOnline ? (e) => { e.stopPropagation(); onClick?.(); } : undefined}>
        <ellipse rx="56" ry="76" fill={portalOnline ? "url(#sk-portalCore)" : (lit ? "#0a1420" : "#020408")}
          stroke={portalOnline ? "#7fd8ff" : (lit ? "#1a2838" : "#000")} strokeWidth="1.5" />
        {portalOnline && (
          <>
            {/* Spirales de plasma */}
            <g>
              <path d="M-40 -40 Q0 -10 40 -40 Q0 10 -40 -40 Z" fill="#7fd8ff" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="7s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
              </path>
              <path d="M-30 30 Q0 0 30 30 Q0 60 -30 30 Z" fill="#a840f0" opacity="0.35">
                <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="9s" repeatCount="indefinite" />
              </path>
            </g>
            {/* Scanlines */}
            <g clipPath="url(#sk-portalClip)">
              {[-70, -50, -30, -10, 10, 30, 50, 70].map((y, i) => (
                <line key={i} x1="-56" y1={y} x2="56" y2={y} stroke="#e8f8ff" strokeWidth="0.4" opacity="0.3">
                  <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
                </line>
              ))}
            </g>
            <clipPath id="sk-portalClip"><ellipse rx="56" ry="76" /></clipPath>
            {/* Point blanc central */}
            <circle r="6" fill="#ffffff" opacity="0.9">
              <animate attributeName="r" values="4;8;4" dur="1.4s" repeatCount="indefinite" />
            </circle>
            {/* Appel : « ENTRER » clignote */}
            <text y="100" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800"
              fill="#7fd8ff" letterSpacing="4">
              ⟡ ENTRER ⟡
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />
            </text>
          </>
        )}
      </g>
      {/* Reflet oblique quand inactif */}
      {!portalOnline && <path d="M-30 -60 L-10 -70 L30 50 L10 60 Z" fill="#e8eef5" opacity={lit ? 0.08 : 0} />}
      {/* Runes autour */}
      {lit && [[-70, -40, "⚛"], [70, -40, "✦"], [-70, 70, "⟡"], [70, 70, "☌"]].map(([x, y, s], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="14"
          fill={portalOnline ? "#7fd8ff" : "#5a4028"}
          opacity={portalOnline ? 0.9 : 0.6}>
          {portalOnline && <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />}
          {s}
        </text>
      ))}
    </g>
  );
}

/* ============================================================
   TABLEAU BLANC — formule + nom de l'invention à deviner
   Coulisse à gauche une fois résolu pour dévoiler le pupitre
   ============================================================ */
function TableauBlanc({ lit, tableauOuvert, portalOnline, target, cadrans, onChargeCadran }) {
  /* Animation JS pilotée par rAF : les CSS-transition sur un <g> SVG
     ne sont pas fiables selon les navigateurs. On fait coulisser le
     tableau en interpolant un vrai attribut transform. */
  const TARGET_X = 240;
  const DUR = 8000;
  const [slideX, setSlideX] = useState(tableauOuvert ? TARGET_X : 0);
  useEffect(() => {
    const goal = tableauOuvert ? TARGET_X : 0;
    let raf;
    const start = performance.now();
    const from = slideX;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DUR);
      /* easeInOutCubic : lent au départ, lent à l'arrivée */
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setSlideX(from + (goal - from) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    if (from !== goal) raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableauOuvert]);

  return (
    <g transform="translate(500,180)">
      <rect x="-170" y="-80" width="340" height="130" fill={lit ? "#141008" : "#030202"} stroke={lit ? "#c8a848" : "#1a1008"} strokeWidth="2" />
      {/* Pupitre dévoilé — rendu AVANT le tableau pour qu'au cours de
          l'animation le tableau glisse PAR-DESSUS la console. */}
      {tableauOuvert && (
        <g>
          <rect x="-160" y="-70" width="240" height="110" fill="#0a1428" stroke="#7fd8ff" strokeWidth="1.5" />
          <text x="-40" y="-54" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#7fd8ff" letterSpacing="3">
            PUPITRE K-01
          </text>
          <line x1="-150" y1="-46" x2="70" y2="-46" stroke="#7fd8ff" strokeWidth="0.4" opacity="0.5" />
          {JAUGES.map((j, i) => (
            <Jauge key={j.id} x={-100 + i * 55} label={j.label}
              on={!!cadrans?.[i]}
              clickable={!cadrans?.[i] && !portalOnline}
              onClick={() => onChargeCadran?.(i)} />
          ))}
        </g>
      )}
      <g transform={`translate(${slideX},0)`}>
        <rect x="-166" y="-76" width="332" height="122" fill={lit ? "#e8dfc8" : "#0a0804"} stroke={lit ? "#5a4028" : "#1a1008"} strokeWidth="0.6" />
        <rect x="-170" y="-82" width="340" height="4" fill={lit ? "#3a2010" : "#060402"} />
        <rect x="-170" y="48" width="340" height="4" fill={lit ? "#3a2010" : "#060402"} />
        {lit && target && (
          <>
            {/* Équations griffonnées, le nom de l'invention glissé au
                milieu sur la même ligne de style — comme une note qui
                prolonge une formule. */}
            <text x="-156" y="-58" fontFamily="Georgia, serif" fontSize="9" fill="#1a0e08" fontStyle="italic">
              E = mc²         ·         Δt' = Δt / √(1 − v²/c²)
            </text>
            <text x="-156" y="-46" fontFamily="Georgia, serif" fontSize="9" fill="#1a0e08" fontStyle="italic">
              Rμν − ½ R gμν + Λ gμν = (8πG/c⁴) Tμν
            </text>
            <text x="-156" y="-34" fontFamily="Georgia, serif" fontSize="9" fill="#1a0e08" fontStyle="italic">
              {target.title}
            </text>
            <text x="-156" y="-22" fontFamily="Georgia, serif" fontSize="9" fill="#1a0e08" fontStyle="italic">
              ∂ψ/∂t = (iℏ/2m) ∇²ψ − (i/ℏ) V ψ
            </text>
            <text x="-156" y="-10" fontFamily="Georgia, serif" fontSize="9" fill="#1a0e08" fontStyle="italic">
              dτ = dt √(1 − 2GM/rc²)      ·      ds² = c²dt² − dx²
            </text>
          </>
        )}
      </g>
    </g>
  );
}

/* Labels des 4 jauges (ordre lu de gauche à droite). */
const JAUGES = [
  { id: "energie", label: "ÉNERGIE" },
  { id: "masse",   label: "MASSE Mᶜ" },
  { id: "flux",    label: "FLUX τ" },
  { id: "champ",   label: "CHAMP Ψ" },
];

/* Une jauge verticale avec son petit cadran au-dessus. Cliquable → se
   remplit par animation d'opacité CSS et le cadran s'allume. */
function Jauge({ x, label, on, clickable, onClick }) {
  return (
    <g transform={`translate(${x},0)`}
      style={{ cursor: clickable ? "pointer" : "default" }}
      onClick={clickable ? (e) => { e.stopPropagation(); onClick?.(); } : undefined}>
      {/* Zone de clic plus large */}
      <rect x="-22" y="-40" width="44" height="80" fill="transparent" />
      {/* Petit cadran au sommet */}
      <circle cx="0" cy="-30" r="7" fill="#0a1a28" stroke={on ? "#7fd8ff" : "#3a5a78"} strokeWidth="1" />
      <line x1="0" y1="-30"
        x2={on ? 4 : 2} y2={on ? -34 : -32}
        stroke={on ? "#7fd8ff" : "#5a6678"} strokeWidth="1"
        style={{ transition: "all 0.6s ease-out" }} />
      {on && (
        <circle cx="0" cy="-30" r="2" fill="#7fd8ff">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Corps de la jauge */}
      <rect x="-12" y="-20" width="24" height="46" fill="#141c26" stroke={on ? "#7fd8ff" : "#3a5a78"} strokeWidth="1" />
      {/* Remplissage animé : hauteur = 42 quand on */}
      <rect x="-10" y={on ? -18 : 22} width="20" height={on ? 42 : 2}
        fill="url(#sk-portalCore)" opacity="0.9"
        style={{ transition: "y 0.6s cubic-bezier(.2,.6,.3,1), height 0.6s cubic-bezier(.2,.6,.3,1)" }} />
      {/* Graduations */}
      {[-10, 0, 10, 20].map((y) => (
        <line key={y} x1="-14" y1={y} x2="-12" y2={y} stroke={on ? "#7fd8ff" : "#3a5a78"} strokeWidth="0.5" />
      ))}
      {/* État sous la jauge */}
      {on && (
        <text y="36" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e" letterSpacing="1">
          ✓
        </text>
      )}
      {/* Label (très petit sous la jauge) */}
      <text y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6"
        fill={on ? "#7fd8ff" : "#5a6678"} letterSpacing="1" fontWeight="700">
        {label}
      </text>
    </g>
  );
}

/* ============================================================
   BUREAU abandonné
   ============================================================ */
function BureauRecherche({ lit }) {
  return (
    <g transform="translate(500,310)">
      <g transform="translate(0,-60)">
        <rect x="-18" y="0" width="36" height="48" fill={lit ? "#2a1808" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
        <rect x="-20" y="-20" width="40" height="22" fill={lit ? "#3a2010" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
      </g>
      <rect x="-120" y="0" width="240" height="20" fill={lit ? "#5a3818" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1.2" />
      <rect x="-120" y="0" width="240" height="4" fill={lit ? "#8a5820" : "#0a0804"} opacity="0.5" />
      <rect x="-112" y="20" width="12" height="60" fill={lit ? "#3a2010" : "#060402"} />
      <rect x="100" y="20" width="12" height="60" fill={lit ? "#3a2010" : "#060402"} />
      <rect x="-112" y="22" width="60" height="36" fill={lit ? "#3a2010" : "#060402"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" />
      <circle cx="-82" cy="40" r="2.5" fill={lit ? "#c8a848" : "#1a1008"} />
      {/* Lampe cassée */}
      <g transform="translate(-80,-10)">
        <circle r="3" fill={lit ? "#5a3818" : "#060402"} />
        <line x1="0" y1="0" x2="-8" y2="-20" stroke={lit ? "#5a3818" : "#060402"} strokeWidth="1.5" />
        <path d="M-16 -24 L0 -24 L-4 -34 L-12 -34 Z" fill={lit ? "#8a5020" : "#0a0804"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.6" transform="rotate(-20 -8 -29)" />
      </g>
      {/* CRT */}
      <g transform="translate(10,-70)">
        <rect x="-56" y="0" width="112" height="68" fill={lit ? "#8a8070" : "#0a0a08"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="1.4" rx="4" />
        <rect x="-48" y="6" width="96" height="52" fill={lit ? "#0a1808" : "#010101"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.8" />
        {lit && (
          <>
            <text x="0" y="24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e" letterSpacing="1">BOOT K-01</text>
            <text x="0" y="36" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5a6678">[err 0x7F] no signal</text>
            <text x="0" y="48" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5a6678">year input : ----</text>
            <rect x="-44" y="52" width="2" height="4" fill="#5eff9e">
              <animate attributeName="opacity" values="0;1;0" dur="1.1s" repeatCount="indefinite" />
            </rect>
          </>
        )}
      </g>
      <rect x="-50" y="4" width="100" height="12" fill={lit ? "#5a5a5a" : "#060606"} stroke={lit ? "#1a0e08" : "#000"} strokeWidth="0.5" rx="2" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={-48 + i * 7} y={6} width="6" height="4" fill={lit ? "#3a3a3a" : "#030303"} />
      ))}
      {/* Papier froissé — un vieux post-it illisible pour habiller le
          bureau sans guider le joueur. */}
      <g transform="translate(60,8) rotate(14)">
        <rect x="-18" y="-10" width="36" height="20" fill={lit ? "#e8dfc8" : "#1a1810"} stroke={lit ? "#8a7050" : "#1a1810"} strokeWidth="0.5" />
        <line x1="-14" y1="-5" x2="14" y2="-5" stroke={lit ? "#5a4028" : "#0a0804"} strokeWidth="0.3" opacity="0.7" />
        <line x1="-14" y1="0" x2="10" y2="0" stroke={lit ? "#5a4028" : "#0a0804"} strokeWidth="0.3" opacity="0.5" />
        <line x1="-14" y1="5" x2="12" y2="5" stroke={lit ? "#5a4028" : "#0a0804"} strokeWidth="0.3" opacity="0.5" />
      </g>
      <Cobweb cx={-120} cy={-80} r={56} lit={lit} />
    </g>
  );
}

/* ============================================================
   Levier à chiffre : un socle + une manette + un petit afficheur
   LED 7-segments en dessous.
   ============================================================ */
function ChiffreLever({ x, y, rank, digit, lit, resolu, onClick, hint }) {
  const [hover, setHover] = useState(false);
  if (!lit) return null;
  const rankLabel = ["M", "C", "D", "U"][rank] || "?";
  return (
    <g transform={`translate(${x},${y})`}
      style={{ cursor: resolu ? "default" : "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={resolu ? undefined : (e) => { e.stopPropagation(); onClick?.(); }}>
      {/* Zone de hit */}
      <circle r="26" fill="transparent" />
      {/* Socle métallique */}
      <rect x="-14" y="-4" width="28" height="16" fill="#28303a" stroke="#0a0e14" strokeWidth="0.8" rx="2" />
      <rect x="-10" y="-2" width="20" height="4" fill="#5a6270" opacity="0.8" />
      {/* Manette */}
      <g style={{ transition: "transform 0.25s", transform: `rotate(${-25 + digit * 5}deg)`, transformOrigin: "0 2px" }}>
        <rect x="-1.6" y="-20" width="3.2" height="22" fill="#5a4028" stroke="#0a0806" strokeWidth="0.5" rx="1" />
        <circle cx="0" cy="-22" r="4" fill="#c8a848" stroke="#0a0806" strokeWidth="0.5">
          {hover && !resolu && <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />}
        </circle>
      </g>
      {/* Afficheur LED 7-seg sous le socle */}
      <g transform="translate(0,22)">
        <rect x="-10" y="-8" width="20" height="16" fill="#141008" stroke="#c8a848" strokeWidth="0.6" rx="1" />
        <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="900"
          fill={resolu ? "#5eff9e" : "#ffd870"}
          style={{ filter: `drop-shadow(0 0 2px ${resolu ? "#5eff9e" : "#ffd870"})` }}>
          {digit}
        </text>
        {/* Pastille rang */}
        <text x="12" y="4" textAnchor="start" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5a4028" letterSpacing="1">
          {rankLabel}
        </text>
      </g>
      {/* Halo discret au survol */}
      {!resolu && hover && (
        <circle r="18" fill="none" stroke="#ffd870" strokeWidth="0.8" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Tooltip hint */}
      {hover && !resolu && (
        <g transform="translate(0,-38)">
          <rect x="-40" y="-10" width="80" height="14" fill="#141008" stroke="#c8a848" strokeWidth="0.5" rx="2" />
          <text x="0" y="0" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#c8b090">
            levier · {hint}
          </text>
        </g>
      )}
    </g>
  );
}

/* ============================================================
   Toile d'araignée (quart de cercle)
   ============================================================ */
function Cobweb({ cx, cy, r = 50, lit }) {
  const col = lit ? "#8a8070" : "#1a1a1a";
  const op = lit ? 0.4 : 0.15;
  return (
    <g transform={`translate(${cx},${cy})`} opacity={op}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 4) * (Math.PI / 2);
        return (
          <line key={i} x1="0" y1="0" x2={Math.cos(a) * r} y2={Math.sin(a) * r}
            stroke={col} strokeWidth="0.4" />
        );
      })}
      {[0.3, 0.5, 0.7, 0.9].map((t, j) => (
        <path key={j}
          d={`M ${r * t} 0 Q ${Math.cos(Math.PI / 4) * r * t * 1.05} ${Math.sin(Math.PI / 4) * r * t * 1.05} 0 ${r * t}`}
          stroke={col} strokeWidth="0.3" fill="none" />
      ))}
    </g>
  );
}

/* ============================================================
   COCKPIT — modal avec clavier d'années
   ============================================================ */
const DESTINATIONS = {
  1450: { id: "gutenberg", titre: "L'imprimerie de Gutenberg", lieu: "Mayence" },
  1794: { id: "chappe",    titre: "Le télégraphe de Chappe",    lieu: "Paris–Lille" },
  1901: { id: "marconi",   titre: "Le signal transatlantique de Marconi", lieu: "Cornouailles → Terre-Neuve" },
};

function CockpitVoyage({ j3, onGo, onClose }) {
  const [year, setYear] = useState("");
  const [err, setErr] = useState(null);
  const [confirming, setConfirming] = useState(null); // { year, dest }

  const flags = j3?.flags || {};

  const press = (c) => {
    if (confirming) return;
    setErr(null);
    if (c === "⌫") {
      setYear((y) => y.slice(0, -1));
    } else if (c === "C") {
      setYear("");
    } else if (year.length < 4) {
      setYear((y) => y + c);
    }
  };

  const voyager = () => {
    if (year.length !== 4) {
      setErr("Entre une année à 4 chiffres (ex. 1794).");
      return;
    }
    const y = parseInt(year, 10);
    const known = DESTINATIONS[y];
    /* Dossier déjà vérifié ? on refuse pour les 3 cibles connues. Pour une
       année hors-dossier, le voyage est toujours possible — mais rien n'est
       posé au retour. */
    if (known && flags[`voyageK_${known.id}_done`]) {
      setErr("Tu es déjà allé·e vérifier ce dossier. Choisis une autre année.");
      return;
    }
    const dest = known
      ? { ...known, target: known.id }
      : { id: "fallback", titre: "Époque hors-dossier", lieu: "Lieu indéfini", target: y };
    setConfirming({ year, dest });
  };

  const lancer = () => {
    /* target peut être un id de destination connue (string) ou une année
       brute (number) pour un voyage hors-dossier. */
    j3.setFlag("voyageK_target", confirming.dest.target);
    onGo("voyageK");
  };

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(2,4,10,0.9)", zIndex: 420, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Palatino, Georgia, serif" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0a1428", border: "2px solid #7fd8ff", borderRadius: 14, padding: 24, maxWidth: 540, width: "100%", boxShadow: "0 0 60px rgba(127,216,255,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 4, color: "#7fd8ff", fontWeight: 800 }}>
            ⟡ CABINE K-01 · CLAVIER TEMPOREL
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", color: "#5a6678", border: "1px solid #28303a", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontFamily: "ui-monospace,monospace" }}>
            ✕ Sortir
          </button>
        </div>

        {/* Afficheur année */}
        <div style={{ background: "#050810", border: "1px solid #3a4858", borderRadius: 8, padding: "20px 24px", textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 3, color: "#5a6678", marginBottom: 8 }}>
            ANNÉE DE DESTINATION
          </div>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 56, fontWeight: 900, letterSpacing: 10, color: "#7fd8ff",
            textShadow: "0 0 12px rgba(127,216,255,0.6)", minHeight: 60 }}>
            {year.padEnd(4, "·").split("").map((c, i) => (
              <span key={i} style={{ opacity: c === "·" ? 0.25 : 1 }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Erreur ou confirmation */}
        {err && !confirming && (
          <div style={{ background: "#2a0808", border: "1px solid #e83820", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#e83820", fontWeight: 700 }}>
              ⚠ {err}
            </div>
          </div>
        )}
        {confirming && (
          <div style={{ background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#5eff9e", fontWeight: 700 }}>
              ✓ DESTINATION TROUVÉE
            </div>
            <p style={{ margin: "6px 0 10px", fontSize: 13, color: "#c8ffdd", lineHeight: 1.5 }}>
              <strong>{confirming.dest.titre}</strong>, {confirming.dest.lieu} ({confirming.year}).
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirming(null)}
                style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "ui-monospace,monospace", fontSize: 11 }}>
                Annuler
              </button>
              <button onClick={lancer}
                style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>
                ⟡ Voyager ▸
              </button>
            </div>
          </div>
        )}

        {/* Clavier numérique */}
        {!confirming && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
              {KEYS.map((c) => (
                <button key={c} onClick={() => press(c)}
                  style={{ background: c === "C" ? "#2a1808" : c === "⌫" ? "#1a2838" : "#141c26",
                    color: c === "C" ? "#e0a848" : "#c8d4e2",
                    border: `1px solid ${c === "C" ? "#8a5820" : "#3a4858"}`,
                    borderRadius: 8, padding: "14px 0", fontSize: 20, fontWeight: 800,
                    fontFamily: "ui-monospace,monospace", cursor: "pointer",
                    boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.4)" }}>
                  {c}
                </button>
              ))}
            </div>

            <button onClick={voyager}
              style={{ width: "100%", background: year.length === 4 ? "#7fd8ff" : "#28303a",
                color: year.length === 4 ? "#06110b" : "#5a6678",
                border: "none", borderRadius: 8, padding: "14px 0",
                fontSize: 15, fontWeight: 800, letterSpacing: 3,
                fontFamily: "ui-monospace,monospace",
                cursor: year.length === 4 ? "pointer" : "not-allowed" }}>
              ⟡ VALIDER L'ANNÉE
            </button>
          </>
        )}

        <p style={{ margin: "12px 0 0", fontSize: 11, color: "#5a6678", fontStyle: "italic", textAlign: "center", lineHeight: 1.4 }}>
          Trois dossiers de Jorge mènent à des témoins précis (1450, 1794, 1901).<br />
          Toute autre année t'y conduit aussi — mais le témoin que tu cherches n'y sera pas forcément.
        </p>
      </div>
    </div>
  );
}
