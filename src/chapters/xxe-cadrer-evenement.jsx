import { useState, useEffect } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Cadre l'événement » — JT du 9 nov. 1989
   ------------------------------------------------------------
   Une seule GRANDE image de la scène de Berlin. Le joueur
   déplace un « cadre TV » sur cette image et choisit ce qu'il
   veut mettre en Une du JT : la foule qui danse, un morceau de
   béton dans une main, un garde-frontière hébété, ou un couple
   qui s'embrasse. Le cadre glisse et zoome vers la zone choisie
   avec une petite transition. À la validation, l'image est
   projetée en gros dans une TV cathodique et MARTINE nomme ce
   que ce cadrage « fabrique » comme lecture.
   ============================================================ */

/* Coordonnées des zones cliquables sur la GRANDE image (viewBox
   0 0 800 460). Chaque zone donne un cadre { x, y, w, h } pour
   la TV finale et une « lecture » de ce cadrage. */
const ZONES = [
  {
    id: "foule",
    label: "La foule qui danse",
    tag: "LA FÊTE",
    color: "#e0a848",
    frame: { x: 260, y: 60, w: 280, h: 160 },
    description: "Image joyeuse, mouvement, musique — l'ambiance d'un soir qui bascule.",
  },
  {
    id: "beton",
    label: "Un morceau de béton",
    tag: "LA RELIQUE",
    color: "#a8a49c",
    frame: { x: 40, y: 260, w: 240, h: 160 },
    description: "Un bout du mur dans une main — un symbole très fort, le passé qui s'effrite.",
  },
  {
    id: "garde",
    label: "Le garde-frontière hébété",
    tag: "LA BASCULE POLITIQUE",
    color: "#5a7aa0",
    frame: { x: 520, y: 180, w: 220, h: 200 },
    description: "Celui qui interdisait laisse faire : un régime entier vient de céder.",
  },
  {
    id: "couple",
    label: "Le couple qui s'embrasse",
    tag: "L'HUMAIN",
    color: "#c04a70",
    frame: { x: 300, y: 260, w: 240, h: 170 },
    description: "L'émotion : des familles séparées se retrouvent. L'image qui touche directement.",
  },
];

/* 4 chaînes fictives. Chacune a un public, une ligne et un cadrage
   « parfait » + un cadrage « acceptable ». Le reste est hors sujet
   pour sa ligne — l'élève doit se mettre à la place du rédacteur en
   chef et choisir ce que SA rédaction mettrait en Une. */
const CHAINES = [
  {
    id: "tf-serieuse",
    nom: "Télé Info 1",
    couleur: "#5a7aa0",
    emoji: "📺",
    public: "les familles adultes qui veulent comprendre ce qui se passe",
    ligne: "Ouvrir sur ce qui est POLITIQUEMENT le plus important.",
    best: "garde",
    ok: "beton",
    verdict: {
      best:   "Pile l'image que Télé Info 1 attendait : la bascule politique vue en un seul plan.",
      ok:     "C'est acceptable — le morceau de béton dit aussi la fin d'un régime, mais c'est plus abstrait.",
      wrong:  "Télé Info 1 n'ouvrirait pas là-dessus — c'est joli, mais pas assez politique pour un journal du soir.",
    },
  },
  {
    id: "mag-cœur",
    nom: "Magazine Famille",
    couleur: "#c04a70",
    emoji: "💞",
    public: "des lectrices et lecteurs qui veulent des histoires humaines",
    ligne: "Montrer les PERSONNES, les émotions, les retrouvailles.",
    best: "couple",
    ok: "foule",
    verdict: {
      best:   "Pile le cadrage Magazine Famille : les visages, les larmes, le mur devient un détail.",
      ok:     "Ça passe — la fête, c'est humain aussi. Mais le couple aurait fait une meilleure couv'.",
      wrong:  "Magazine Famille n'ouvrirait pas sur ça — trop politique, pas assez de visages.",
    },
  },
  {
    id: "canal-jeune",
    nom: "Canal Jeune",
    couleur: "#e0a848",
    emoji: "🎉",
    public: "des ados qui veulent de l'énergie et de la musique",
    ligne: "Ouvrir sur le MOUVEMENT, la joie, la jeunesse qui danse.",
    best: "foule",
    ok: "couple",
    verdict: {
      best:   "Pile ce que Canal Jeune cherchait : la foule, l'énergie, le moment où Berlin fait la fête.",
      ok:     "C'est pas mal — un couple qui s'embrasse, c'est jeune aussi. Mais la foule, c'est plus Canal Jeune.",
      wrong:  "Canal Jeune n'ouvrirait pas sur ça — trop sérieux pour nos ados devant le JT.",
    },
  },
  {
    id: "doc-memoire",
    nom: "Mémoires d'Histoire",
    couleur: "#a8a49c",
    emoji: "📜",
    public: "un public qui aime les documentaires et les archives",
    ligne: "Choisir le SYMBOLE qui parlera encore dans 50 ans.",
    best: "beton",
    ok: "garde",
    verdict: {
      best:   "Pile le choix de Mémoires d'Histoire : un bout de mur dans une main — c'est l'image qui reste dans les livres.",
      ok:     "C'est bien — le garde-frontière, ça marque aussi un tournant. Mais le béton, c'est l'image qui traverse les décennies.",
      wrong:  "Mémoires d'Histoire n'ouvrirait pas là-dessus — trop fugitif, pas assez de recul.",
    },
  },
];

function pickChaine() { return CHAINES[Math.floor(Math.random() * CHAINES.length)]; }

/* La GRANDE image de la scène : tous les éléments cohabitent
   dans une seule image, on va « cadrer » dedans. */
function SceneEntiere() {
  return (
    <g>
      {/* fond nuit / avec des projecteurs, un peu de fumée dans l'air */}
      <defs>
        <linearGradient id="be-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1a2a" />
          <stop offset="100%" stopColor="#28241a" />
        </linearGradient>
        <linearGradient id="be-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8880" />
          <stop offset="100%" stopColor="#5a5850" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#be-sky)" />

      {/* halo de projecteurs qui balaient le ciel */}
      <path d="M0 0 L120 200 L60 200 Z" fill="#f0e8a0" opacity="0.08" />
      <path d="M800 0 L680 200 L740 200 Z" fill="#f0e8a0" opacity="0.08" />

      {/* le MUR de Berlin — horizontal, épais, couvert de graffitis */}
      <rect x="0" y="180" width="800" height="140" fill="url(#be-wall)" />
      {/* joints entre blocs */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line key={i} x1={i * 90} y1="180" x2={i * 90} y2="320" stroke="#3a3a34" strokeWidth="1.5" />
      ))}
      {[210, 250, 290].map((y) => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#3a3a34" strokeWidth="1" />
      ))}
      {/* graffitis */}
      <path d="M100 210 Q140 200 180 220 M220 250 Q260 240 300 260" stroke="#c04a30" strokeWidth="2.5" fill="none" />
      <text x="360" y="248" fontFamily="Georgia,serif" fontSize="18" fontWeight="800" fill="#c9a54a" opacity="0.85">FREIHEIT !</text>
      <path d="M580 220 Q610 210 640 230 M620 270 L680 280" stroke="#3a80c8" strokeWidth="2.5" fill="none" />

      {/* Zone 1 — LA FOULE qui danse SUR le mur, au centre-haut */}
      <g>
        {[[300, 170], [330, 165], [360, 172], [390, 165], [420, 170], [450, 168], [480, 172], [510, 165]].map(([x, y], i) => (
          <g key={`crowd-${i}`}>
            <circle cx={x} cy={y - 22} r="8" fill="#f0d0a0" />
            <path d={`M${x - 5} ${y - 14} L${x - 10} ${y + 4} M${x + 5} ${y - 14} L${x + 10} ${y + 4}`} stroke="#f0d0a0" strokeWidth="2" strokeLinecap="round" />
            <path d={`M${x} ${y - 14} L${x - 6} ${y + 14} L${x + 6} ${y + 14} Z`} fill={i % 2 ? "#c04a30" : "#3a80c8"} />
          </g>
        ))}
        {/* mains levées / drapeaux */}
        {[[320, 130], [400, 120], [470, 128]].map(([x, y], i) => (
          <g key={`flag-${i}`}>
            <line x1={x} y1={y + 30} x2={x} y2={y} stroke="#3a2418" strokeWidth="2" />
            <rect x={x} y={y - 4} width="16" height="10" fill={i === 1 ? "#000" : "#c04030"} />
            <rect x={x} y={y - 4} width="16" height="3" fill="#c9a54a" />
          </g>
        ))}
        {/* confettis en l'air */}
        {[[280, 90], [340, 100], [400, 80], [460, 100], [520, 90], [380, 60]].map(([x, y], i) => (
          <rect key={`conf-${i}`} x={x} y={y} width="4" height="3" fill={i % 3 === 0 ? "#e8542e" : i % 3 === 1 ? "#c9a54a" : "#7ab0c8"} />
        ))}
      </g>

      {/* Zone 2 — MAIN qui TIENT UN BÉTON, en bas à gauche */}
      <g transform="translate(160,340)">
        {/* bras + main */}
        <path d="M-70 80 Q-40 -10 20 -20 Q60 -14 60 30 L50 80 Z" fill="#e8bfa0" />
        {/* morceau de béton irrégulier */}
        <path d="M-10 -20 L36 -30 L46 -6 L34 20 L4 24 L-14 6 Z" fill="#a8a49c" stroke="#3a3a30" strokeWidth="1.2" />
        {/* graffiti sur le béton */}
        <path d="M0 -8 L18 -12 M12 6 L34 4 M2 16 L26 12" stroke="#c04a30" strokeWidth="1.6" opacity="0.9" />
        {/* poussière */}
        {[[10, -14], [28, 0], [22, 16], [2, 6]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill="#5a5850" opacity="0.7" />
        ))}
      </g>

      {/* Zone 3 — GARDE-FRONTIÈRE hébété à droite du portique, laisse passer */}
      <g transform="translate(630,260)">
        {/* poste-frontière — poteau + rayures */}
        <rect x="-90" y="-70" width="6" height="160" fill="#3a3628" />
        <rect x="-90" y="-70" width="24" height="10" fill="#c04030" />
        <rect x="-90" y="-58" width="24" height="8" fill="#f0e8d0" />
        <rect x="-90" y="-48" width="24" height="8" fill="#c04030" />
        <path d="M-84 -30 L20 -32" stroke="#5a5040" strokeWidth="6" />

        {/* le garde de face, épaules tombantes */}
        <g>
          <path d="M-18 60 Q-14 -10 0 -14 Q14 -10 18 60 Z" fill="#4a5a4a" />
          <line x1="0" y1="-14" x2="0" y2="50" stroke="#c9a54a" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="1.6" fill="#c9a54a" />
          <circle cx="0" cy="14" r="1.6" fill="#c9a54a" />
          {/* tête */}
          <circle cx="0" cy="-28" r="12" fill="#e8c8a8" />
          {/* casquette de travers */}
          <g transform="rotate(-14 0 -32)">
            <path d="M-12 -34 L12 -34 L10 -40 L-10 -40 Z" fill="#3a4838" />
            <ellipse cx="0" cy="-36" rx="14" ry="2" fill="#28321f" />
            <path d="M-10 -34 L10 -34 L8 -32 L-8 -32 Z" fill="#1a1a1a" />
          </g>
          {/* yeux baissés */}
          <path d="M-5 -28 L-2 -26 M2 -26 L5 -28" stroke="#1a1a1a" strokeWidth="1.2" />
          {/* bras tombant */}
          <path d="M-14 0 L-24 26" stroke="#4a5a4a" strokeWidth="8" strokeLinecap="round" />
          <path d="M14 0 L24 26" stroke="#4a5a4a" strokeWidth="8" strokeLinecap="round" />
        </g>
        {/* silhouettes flou qui passent derrière lui */}
        {[[40, 40], [60, 46], [80, 40]].map(([x, y], i) => (
          <g key={i} opacity="0.5">
            <circle cx={x} cy={y - 12} r="5" fill="#e0c8a8" />
            <path d={`M${x - 5} ${y - 6} Q${x} ${y + 20} ${x + 5} ${y - 6}`} fill="#3a3628" />
          </g>
        ))}
      </g>

      {/* Zone 4 — COUPLE qui s'embrasse, en bas au centre-droit */}
      <g transform="translate(420,360)">
        {/* deux têtes se rejoignent */}
        <g transform="translate(-16,0)">
          <circle cx="0" cy="0" r="26" fill="#e8bfa0" />
          <path d="M-26 -8 Q-32 -26 -20 -30 Q-6 -34 4 -26 Q8 -14 4 -6 Z" fill="#3a2418" />
        </g>
        <g transform="translate(16,0)">
          <circle cx="0" cy="0" r="24" fill="#e0b088" />
          <path d="M20 -10 Q28 -26 12 -30 Q-6 -32 -14 -26 L-14 -12 Q0 -16 20 -10 Z" fill="#5a3a20" />
        </g>
        {/* larmes qui coulent */}
        <path d="M-30 4 Q-32 12 -34 20" stroke="#8ab0d8" strokeWidth="0.8" fill="none" opacity="0.9" />
        <path d="M32 4 Q34 12 36 20" stroke="#8ab0d8" strokeWidth="0.8" fill="none" opacity="0.9" />
      </g>
    </g>
  );
}

export function CadrerEvenementGame({ onClose, onWin }) {
  /* On tire la chaîne UNE FOIS au mount — l'élève découvre sa
     mission éditoriale et doit cadrer en conséquence. */
  const [chaine] = useState(() => pickChaine());
  const [step, setStep] = useState(0); // 0 = intro + brief, 1 = choix, 2 = résultat
  const [zone, setZone] = useState(null);
  const [reveal, setReveal] = useState(0);
  const [done, setDone] = useState(false);

  /* Verdict : "best" (parfait, +5), "ok" (acceptable, +2), "wrong" (0, retry). */
  const resultKey = zone ? (zone.id === chaine.best ? "best" : zone.id === chaine.ok ? "ok" : "wrong") : null;
  const points = resultKey === "best" ? 5 : resultKey === "ok" ? 2 : 0;
  const canWin = resultKey === "best" || resultKey === "ok";
  useWinOnce(done && canWin, onWin);

  useEffect(() => {
    if (step !== 2) return;
    setReveal(0);
    const timers = [
      setTimeout(() => setReveal(1), 300),
      setTimeout(() => setReveal(2), 900),
      setTimeout(() => setReveal(3), 1400),
      setTimeout(() => setDone(true), 1700),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const retry = () => { setStep(1); setZone(null); setReveal(0); setDone(false); };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(180deg,#101c30 0%,#0a1324 100%)", color: "#e8eef5", border: "2px solid #a02020", borderRadius: 16, padding: "16px 20px", maxWidth: 920, width: "100%", maxHeight: "94vh", overflowY: "auto", boxShadow: "0 16px 60px rgba(0,0,0,0.75)", fontFamily: "Georgia, serif" }}>
        {/* Bandeau "EN DIRECT" rouge style JT */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", marginBottom: 6 }}>
          <span style={{ background: "#a02020", color: "#fff", padding: "3px 10px", borderRadius: 20, fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 900, letterSpacing: 2, boxShadow: "0 0 12px rgba(160,32,32,0.5)" }}>
            ◉ EN DIRECT
          </span>
          <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#8fa3bd" }}>BERLIN · 9 NOV. 1989</span>
        </div>
        <h2 style={{ textAlign: "center", margin: "0 0 10px", color: "#ffd166", fontSize: 26, fontWeight: 900, letterSpacing: 1 }}>Cadre l'événement</h2>

        {step === 0 && (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.45, textAlign: "center", margin: "0 0 12px", color: "#c8d4e2" }}>
              <strong style={{ color: "#ffd166" }}>Imagine que tu travailles pour le JT.</strong> Le mur de Berlin tombe en direct — mais chaque rédaction va choisir une image différente.
            </p>
            {/* Carte "ta rédaction" avec dégradé coloré — compacte pour tenir sans scroll */}
            <div style={{
              background: `linear-gradient(135deg, ${chaine.couleur}33 0%, ${chaine.couleur}11 100%)`,
              border: `3px solid ${chaine.couleur}`,
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 12,
              boxShadow: `0 0 20px ${chaine.couleur}33, inset 0 1px 0 ${chaine.couleur}66`,
            }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: chaine.couleur, fontWeight: 800, marginBottom: 4 }}>▸ TU TRAVAILLES POUR</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 44, lineHeight: 1 }}>{chaine.emoji}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: 1, textShadow: `0 0 12px ${chaine.couleur}66` }}>
                  {chaine.nom}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14, lineHeight: 1.45, color: "#d8e2ee" }}>
                <div>
                  <strong style={{ color: chaine.couleur, fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, display: "block", marginBottom: 2 }}>PUBLIC</strong>
                  <span>{chaine.public}</span>
                </div>
                <div style={{ paddingLeft: 12, borderLeft: `1px dashed ${chaine.couleur}66` }}>
                  <strong style={{ color: chaine.couleur, fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, display: "block", marginBottom: 2 }}>LIGNE ÉDITORIALE</strong>
                  <em style={{ color: "#ffd166" }}>« {chaine.ligne} »</em>
                </div>
              </div>
            </div>
            <button onClick={() => setStep(1)}
              style={{ width: "100%", background: chaine.couleur, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 900, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: `0 6px 20px ${chaine.couleur}66` }}>
              📹 Voir l'image du cameraman →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            {/* Rappel permanent de la rédaction et de sa ligne — pour garder l'intention à l'esprit */}
            <div style={{
              background: `linear-gradient(90deg, ${chaine.couleur}22 0%, ${chaine.couleur}08 100%)`,
              border: `2px solid ${chaine.couleur}`,
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 14,
              display: "flex",
              gap: 14,
              alignItems: "center",
              boxShadow: `0 0 12px ${chaine.couleur}22`,
            }}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{chaine.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: chaine.couleur, fontWeight: 800 }}>▸ POUR {chaine.nom.toUpperCase()}</div>
                <div style={{ fontSize: 15.5, color: "#e8eef5", lineHeight: 1.4, fontStyle: "italic" }}>« {chaine.ligne} »</div>
              </div>
            </div>
            <p style={{ fontSize: 14.5, color: "#8fa3bd", textAlign: "center", margin: "0 0 12px", fontStyle: "italic" }}>
              Clique sur une zone de l'image pour prévisualiser le cadrage.
            </p>
            {/* GRANDE image avec cadre TV survolable */}
            <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #2a3648" }}>
              <svg viewBox="0 0 800 460" style={{ display: "block", width: "100%", height: "auto", background: "#0a0a10" }}>
                <SceneEntiere />
                {/* Voile sombre partout SAUF sur la zone sélectionnée (effet cadrage) */}
                <defs>
                  <mask id="frame-mask">
                    <rect width="800" height="460" fill="#fff" />
                    {zone && (
                      <rect x={zone.frame.x} y={zone.frame.y} width={zone.frame.w} height={zone.frame.h} fill="#000"
                        style={{ transition: "all .45s cubic-bezier(.4,0,.2,1)" }} />
                    )}
                  </mask>
                </defs>
                {zone && (
                  <rect width="800" height="460" fill="#000" opacity="0.55" mask="url(#frame-mask)" />
                )}
                {/* Rectangle "cadre TV" animé qui suit la zone */}
                {zone && (
                  <rect x={zone.frame.x} y={zone.frame.y} width={zone.frame.w} height={zone.frame.h}
                    fill="none" stroke={zone.color} strokeWidth="4" rx="6"
                    style={{ transition: "all .45s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${zone.color})` }} />
                )}
                {/* petits marqueurs cliquables (invisibles hors survol) */}
                {ZONES.map((z) => (
                  <rect key={z.id} x={z.frame.x} y={z.frame.y} width={z.frame.w} height={z.frame.h}
                    fill="transparent" style={{ cursor: "pointer" }}
                    onMouseEnter={() => setZone(z)} onClick={() => setZone(z)} />
                ))}
              </svg>
            </div>

            {/* Boutons de choix rapide — plus voyants, chacun à la couleur de son cadrage */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 12 }}>
              {ZONES.map((z) => {
                const sel = zone?.id === z.id;
                return (
                  <button key={z.id} onClick={() => setZone(z)}
                    style={{
                      textAlign: "left",
                      background: sel ? `linear-gradient(135deg, ${z.color}44 0%, ${z.color}11 100%)` : "#141b26",
                      border: `2px solid ${sel ? z.color : "#2a3648"}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      cursor: "pointer",
                      color: "#e8eef5",
                      fontFamily: "Georgia, serif",
                      boxShadow: sel ? `0 0 14px ${z.color}66` : "none",
                      transition: "all .2s",
                    }}>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: z.color, fontWeight: 800, marginBottom: 4 }}>▸ {z.tag}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{z.label}</div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setStep(2)} disabled={!zone}
              style={{
                marginTop: 16, width: "100%",
                background: zone ? "linear-gradient(90deg,#c02020,#a02020)" : "#3a3648",
                color: "#fff", border: "none", borderRadius: 12, padding: "18px",
                fontWeight: 900, cursor: zone ? "pointer" : "not-allowed",
                fontSize: 18, fontFamily: "ui-monospace,monospace", letterSpacing: 2,
                boxShadow: zone ? "0 6px 20px rgba(160,32,32,0.5)" : "none",
              }}>
              {zone ? "📺 Ouvrir le JT avec ce cadrage →" : "Choisis d'abord un cadrage…"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* TV cathodique qui affiche la zone cadrée en GROS */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
              <div style={{ background: "linear-gradient(180deg,#5a3a20,#3a2418)", border: "10px solid #5a3a20", borderRadius: 18, padding: 14, boxShadow: "0 10px 32px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.1)" }}>
                <svg viewBox={`${zone.frame.x} ${zone.frame.y} ${zone.frame.w} ${zone.frame.h}`}
                  style={{ display: "block", width: 500, maxWidth: "100%", height: "auto", background: "#000", borderRadius: 12 }}>
                  <g style={{ opacity: reveal >= 1 ? 1 : 0, transition: "opacity .5s" }}>
                    <SceneEntiere />
                  </g>
                  {/* scanlines simulées cathodique */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <line key={i}
                      x1={zone.frame.x} y1={zone.frame.y + i * (zone.frame.h / 12)}
                      x2={zone.frame.x + zone.frame.w} y2={zone.frame.y + i * (zone.frame.h / 12)}
                      stroke="#000" strokeWidth={zone.frame.h / 240} opacity="0.22" />
                  ))}
                  {/* bandeau EN DIRECT rouge en bas */}
                  {reveal >= 2 && (
                    <g>
                      <rect x={zone.frame.x} y={zone.frame.y + zone.frame.h - zone.frame.h * 0.14}
                        width={zone.frame.w} height={zone.frame.h * 0.14} fill="#a02020" />
                      <text x={zone.frame.x + zone.frame.w / 2}
                        y={zone.frame.y + zone.frame.h - zone.frame.h * 0.04}
                        textAnchor="middle" fontFamily="ui-monospace,monospace"
                        fontSize={zone.frame.w * 0.032} fontWeight="800" fill="#fff">
                        ◉ EN DIRECT — BERLIN, 9 NOV. 1989
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {reveal >= 3 && (() => {
              const col = resultKey === "best" ? "#5eff9e" : resultKey === "ok" ? "#ffd166" : "#ff8a6a";
              const titre = resultKey === "best" ? "✓ Parfait pour la rédaction"
                           : resultKey === "ok" ? "≈ Acceptable" : "✗ Hors ligne éditoriale";
              return (
                <div style={{
                  marginTop: 18,
                  background: `linear-gradient(135deg, ${col}22 0%, #101827 60%)`,
                  border: `2px solid ${col}`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  color: "#e8eef5",
                  animation: "fadein .4s",
                  boxShadow: `0 0 20px ${col}33`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 16, letterSpacing: 2, color: col, fontWeight: 900 }}>{titre}</div>
                    {points > 0 && (
                      <div style={{ background: "#ffd166", color: "#1a0e08", padding: "6px 14px", borderRadius: 20, fontFamily: "ui-monospace,monospace", fontSize: 17, fontWeight: 900, letterSpacing: 1, boxShadow: "0 0 14px rgba(255,209,102,0.5)" }}>+{points} ⚡</div>
                    )}
                  </div>
                  <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>
                    « {chaine.verdict[resultKey]} »
                  </p>
                  <div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: chaine.couleur, textAlign: "right" }}>
                    — RÉDACTION {chaine.nom.toUpperCase()}
                  </div>
                  {canWin && (
                    <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: "14px 0 0", padding: "12px 14px", background: "rgba(94,255,158,0.08)", borderLeft: "3px solid #5eff9e", color: "#c8d4e2", fontStyle: "italic", borderRadius: "4px 8px 8px 4px" }}>
                      Cadrer, c'est déjà interpréter. Deux rédactions regardent la même scène et racontent deux histoires différentes. <strong style={{ color: "#5eff9e" }}>— MARTINE</strong>
                    </p>
                  )}
                </div>
              );
            })()}
            {reveal >= 3 && (
              canWin ? (
                <button onClick={onClose}
                  style={{ marginTop: 16, width: "100%", background: "linear-gradient(90deg,#c02020,#a02020)", color: "#fff", border: "none", borderRadius: 12, padding: "18px", fontWeight: 900, cursor: "pointer", fontSize: 18, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 6px 20px rgba(160,32,32,0.5)" }}>
                  Continuer
                </button>
              ) : (
                <button onClick={retry}
                  style={{ marginTop: 16, width: "100%", background: "#1a2536", color: "#fff", border: `2px solid ${chaine.couleur}`, borderRadius: 12, padding: "18px", fontWeight: 900, cursor: "pointer", fontSize: 18, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                  ↻ Essayer un autre cadrage
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
