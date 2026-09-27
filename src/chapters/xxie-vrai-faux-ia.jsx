import { useState } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Vrai, faux ou IA ? »
   ------------------------------------------------------------
   Quatre "images" (dessinées en SVG stylisé) — chacune est de
   l'une de ces 4 natures :
     - VRAIE PHOTO (prise par un journaliste, source citée)
     - RETOUCHÉE (vraie image mais modifiée : couleurs, cadrage)
     - GÉNÉRÉE PAR IA (jamais photographiée : ça n'existe pas)
     - DEEPFAKE (vrai visage collé sur un autre corps)
   L'élève classe chacune. On explique ensuite les indices.
   ============================================================ */

const NATURES = {
  vrai:      { label: "Vraie photo",      couleur: "#5eff9e" },
  retouchee: { label: "Retouchée",        couleur: "#ffd166" },
  ia:        { label: "Générée par IA",   couleur: "#c88af0" },
  deepfake:  { label: "Deepfake",         couleur: "#ff5a7a" },
};

/* 4 vignettes SVG stylisées + leur bonne nature + indices */
const IMAGES = [
  {
    id: "manif",
    legende: "Manifestation, boulevard de Paris",
    bonne: "vrai",
    indice: "Photo publiée par l'AFP avec date, lieu et nom du photographe. On peut retrouver la source.",
    Svg: () => (
      <svg viewBox="0 0 200 140" style={{ width: "100%", height: "auto", display: "block" }}>
        <rect width="200" height="140" fill="#4a5a70" />
        <rect y="90" width="200" height="50" fill="#3a2818" />
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={10 + (i * 7) % 190} cy={70 + ((i * 13) % 30)} r="3" fill="#c8a878" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`s-${i}`} x={20 + i * 15} y={50 + (i % 3) * 3} width="1.5" height="24" fill="#1a1a1a" />
        ))}
        <rect x="70" y="24" width="60" height="18" fill="#f0e0a0" />
        <text x="100" y="37" textAnchor="middle" fontSize="8" fontFamily="ui-monospace,monospace" fill="#1a1a1a" fontWeight="800">LIBERTÉ</text>
        <rect x="6" y="120" width="90" height="14" fill="rgba(0,0,0,0.55)" />
        <text x="10" y="130" fontSize="7" fontFamily="ui-monospace,monospace" fill="#fff">AFP · 12 mars · Paris</text>
      </svg>
    ),
  },
  {
    id: "ciel-rouge",
    legende: "Ciel de fin d'après-midi",
    bonne: "retouchee",
    indice: "La photo est vraie, mais les couleurs ont été poussées. Le ciel n'est PAS aussi rouge : le filtre exagère.",
    Svg: () => (
      <svg viewBox="0 0 200 140" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="rf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff2010" />
            <stop offset="60%" stopColor="#ff8020" />
            <stop offset="100%" stopColor="#ffe090" />
          </linearGradient>
        </defs>
        <rect width="200" height="140" fill="url(#rf-sky)" />
        <path d="M0 100 L40 78 L80 92 L120 70 L160 88 L200 76 L200 140 L0 140 Z" fill="#1a1408" />
        <circle cx="150" cy="50" r="16" fill="#fff8c8" />
        {/* petit halo trop parfait */}
        <circle cx="150" cy="50" r="22" fill="none" stroke="#ffe090" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "portrait-ia",
    legende: "Portrait d'un jeune homme",
    bonne: "ia",
    indice: "Les oreilles sont bizarrement asymétriques, le fond flou n'a aucune logique, et il a 7 doigts sur la main. Ce visage n'a jamais existé — c'est une IA qui l'a inventé.",
    Svg: () => (
      <svg viewBox="0 0 200 140" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <radialGradient id="rf-bg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c8b8e0" />
            <stop offset="100%" stopColor="#6a5090" />
          </radialGradient>
        </defs>
        <rect width="200" height="140" fill="url(#rf-bg)" />
        {/* épaules */}
        <path d="M40 140 Q100 100 160 140 Z" fill="#3a2818" />
        {/* tête */}
        <ellipse cx="100" cy="70" rx="34" ry="40" fill="#f0d4b0" />
        {/* cheveux */}
        <path d="M66 56 Q70 30 100 26 Q130 32 134 56 Q130 42 100 40 Q70 42 66 56 Z" fill="#3a2410" />
        {/* oreilles asymétriques : indice IA */}
        <ellipse cx="66" cy="76" rx="6" ry="10" fill="#e0b090" />
        <ellipse cx="134" cy="70" rx="10" ry="6" fill="#e0b090" />
        {/* yeux */}
        <ellipse cx="88" cy="70" rx="4" ry="2.4" fill="#fff" />
        <ellipse cx="112" cy="70" rx="4" ry="2.4" fill="#fff" />
        <circle cx="88" cy="70" r="1.6" fill="#2a1408" />
        <circle cx="112" cy="70" r="1.6" fill="#2a1408" />
        {/* bouche */}
        <path d="M88 90 Q100 96 112 90" stroke="#a04030" strokeWidth="1.6" fill="none" />
        {/* main trop de doigts, en bas */}
        <g transform="translate(140,124)">
          <ellipse cx="0" cy="0" rx="10" ry="6" fill="#f0d4b0" />
          <rect x="-8" y="-14" width="2.5" height="14" fill="#f0d4b0" />
          <rect x="-4" y="-16" width="2.5" height="16" fill="#f0d4b0" />
          <rect x="0" y="-16" width="2.5" height="16" fill="#f0d4b0" />
          <rect x="4" y="-14" width="2.5" height="14" fill="#f0d4b0" />
          <rect x="8" y="-12" width="2.5" height="12" fill="#f0d4b0" />
          <rect x="12" y="-10" width="2.5" height="10" fill="#f0d4b0" />
          <rect x="16" y="-8" width="2.5" height="8" fill="#f0d4b0" />
        </g>
      </svg>
    ),
  },
  {
    id: "deepfake-star",
    legende: "Vidéo d'un politicien qui dit une phrase choc",
    bonne: "deepfake",
    indice: "Le visage bouge mais le cou ne suit pas bien. La voix est bizarrement plate. La vidéo ne vient d'aucune chaîne officielle. Un visage réel a été COLLÉ sur un autre corps.",
    Svg: () => (
      <svg viewBox="0 0 200 140" style={{ width: "100%", height: "auto", display: "block" }}>
        <rect width="200" height="140" fill="#1a1420" />
        {/* épaules costume */}
        <path d="M30 140 Q100 100 170 140 Z" fill="#2a2a3a" />
        {/* cravate */}
        <path d="M96 108 L104 108 L108 140 L92 140 Z" fill="#a04030" />
        {/* col chemise */}
        <path d="M84 100 L100 112 L116 100 L116 116 L84 116 Z" fill="#f0e8d8" />
        {/* tête */}
        <ellipse cx="100" cy="66" rx="30" ry="36" fill="#e8c4a0" />
        {/* ligne de découpe subtile autour du menton (indice deepfake) */}
        <path d="M76 84 Q100 106 124 84" stroke="#a08078" strokeWidth="0.6" fill="none" opacity="0.7" strokeDasharray="1 1" />
        {/* cheveux */}
        <path d="M70 54 Q74 28 100 24 Q126 30 130 54 L130 44 Q120 34 100 34 Q80 34 70 44 Z" fill="#3a2818" />
        {/* yeux */}
        <ellipse cx="88" cy="66" rx="3" ry="2" fill="#fff" />
        <ellipse cx="112" cy="66" rx="3" ry="2" fill="#fff" />
        <circle cx="88" cy="66" r="1.4" fill="#1a1408" />
        <circle cx="112" cy="66" r="1.4" fill="#1a1408" />
        {/* bouche entrouverte */}
        <ellipse cx="100" cy="86" rx="6" ry="2" fill="#7a3020" />
        {/* logo faux */}
        <rect x="6" y="8" width="40" height="14" fill="#a02020" />
        <text x="26" y="18" textAnchor="middle" fontSize="7" fontFamily="ui-monospace,monospace" fill="#fff" fontWeight="800">TRUTH-NEWS</text>
        {/* pixels compressés visibles en bas */}
        <g opacity="0.35">
          {Array.from({ length: 60 }).map((_, i) => (
            <rect key={i} x={(i * 3) % 200} y={132 + ((i * 7) % 6)} width="3" height="3" fill="#000" />
          ))}
        </g>
      </svg>
    ),
  },
];

export function VraiFauxIAGame({ onClose, onWin }) {
  const [reponses, setReponses] = useState({});
  const [step, setStep] = useState(0); // 0=jouer, 1=verdict
  const [done, setDone] = useState(false);
  useWinOnce(done, onWin);

  const tousRepondus = IMAGES.every(im => reponses[im.id]);
  const score = IMAGES.filter(im => reponses[im.id] === im.bonne).length;

  function valider() {
    setStep(1);
    setDone(true);
  }

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.86)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", color: "#e8eef5", border: "2px solid #2a3a58", borderRadius: 16, padding: 20, maxWidth: 780, width: "100%", maxHeight: "94vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.7)", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#7fd8ff" }}>🔎 ATELIER — VÉRIFIER LES IMAGES</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#fff", fontSize: 22 }}>Vrai, faux ou IA ?</h2>

        {step === 0 && (
          <>
            <p style={{ textAlign: "center", fontSize: 13, lineHeight: 1.5, color: "#c8d4e2", margin: "6px 0 14px" }}>
              Regarde bien chaque image. Pour chacune, choisis sa nature.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
              {IMAGES.map((im) => (
                <div key={im.id} style={{ background: "#1a2438", border: "1px solid #2a3a58", borderRadius: 12, padding: 10 }}>
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #26324a" }}>
                    <im.Svg />
                  </div>
                  <div style={{ fontSize: 12, color: "#c8d4e2", margin: "8px 0 8px", fontStyle: "italic" }}>{im.legende}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {Object.entries(NATURES).map(([k, N]) => {
                      const sel = reponses[im.id] === k;
                      return (
                        <button key={k} onClick={() => setReponses(r => ({ ...r, [im.id]: k }))}
                          style={{ background: sel ? N.couleur : "#26324a", color: sel ? "#0a1220" : "#c8d4e2", border: `1px solid ${sel ? N.couleur : "#3a4a68"}`, borderRadius: 8, padding: "6px 8px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                          {N.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={valider} disabled={!tousRepondus}
              style={{ marginTop: 14, width: "100%", background: tousRepondus ? "#5eff9e" : "#26324a", color: tousRepondus ? "#0a1220" : "#5a7a90", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: tousRepondus ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              {tousRepondus ? "✓ Voir les réponses" : `Classe les 4 images (${Object.keys(reponses).length}/4)`}
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ textAlign: "center", background: "#101a2a", border: "1px solid #2a3a58", borderRadius: 12, padding: 12, margin: "10px 0 14px" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#7fd8ff" }}>SCORE</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: score >= 3 ? "#5eff9e" : score >= 2 ? "#ffd166" : "#ff8a6a" }}>{score} / 4</div>
              <div style={{ fontSize: 12, color: "#c8d4e2", marginTop: 4 }}>
                {score === 4 && "Œil d'aigle. Tu ne te fais pas avoir facilement."}
                {score === 3 && "Bien joué. Il ne reste qu'un piège."}
                {score === 2 && "Moitié-moitié. Regarde les indices ci-dessous."}
                {score < 2 && "L'exercice est piégeux exprès. C'est normal — regarde les indices."}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10 }}>
              {IMAGES.map(im => {
                const bon = reponses[im.id] === im.bonne;
                const N = NATURES[im.bonne];
                return (
                  <div key={im.id} style={{ background: "#1a2438", border: `2px solid ${bon ? "#5eff9e" : "#ff8a6a"}55`, borderRadius: 10, padding: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 90, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}><im.Svg /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 1.5, color: N.couleur, fontWeight: 800 }}>
                          {bon ? "✓ " : "✗ "}{N.label.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#c8d4e2", lineHeight: 1.45, marginTop: 4 }}>{im.indice}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, background: "#101827", border: "1px solid #5eff9e44", borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ fontSize: 13, lineHeight: 1.55, margin: 0, color: "#c8d4e2", fontStyle: "italic" }}>
                « Une image ne prouve plus rien à elle seule. On vérifie : d'où elle vient, qui l'a prise, si on la retrouve ailleurs. Sinon, on ne partage pas. » — MARTINE
              </p>
            </div>

            <button onClick={onClose}
              style={{ marginTop: 12, width: "100%", background: "#5eff9e", color: "#0a1220", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
