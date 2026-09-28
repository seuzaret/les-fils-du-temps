import { useState } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Vrai, faux ou IA ? »
   ------------------------------------------------------------
   Quatre vraies photos (sourcées sur Wikimedia Commons) — chacune
   est de l'une de ces 4 natures :
     - VRAIE PHOTO (prise par un photojournaliste, source citée)
     - RETOUCHÉE (photo réelle mais couleurs poussées)
     - GÉNÉRÉE PAR IA (jamais photographiée : ça n'existe pas)
     - DEEPFAKE (visage d'une vraie personne collé sur une vidéo)
   L'élève classe chacune. On explique ensuite les indices.
   Les 4 fichiers vivent dans public/assets/emi/ ; les crédits
   Wikimedia sont dans public/assets/emi/_credits.json.
   ============================================================ */

const NATURES = {
  vrai:      { label: "Vraie photo",      couleur: "#5eff9e" },
  retouchee: { label: "Retouchée",        couleur: "#ffd166" },
  ia:        { label: "Générée par IA",   couleur: "#c88af0" },
  deepfake:  { label: "Deepfake",         couleur: "#ff5a7a" },
};

/* Petit composant image + légende source, réutilisé partout. */
function Vignette({ src, alt, style }) {
  return (
    <img src={src} alt={alt}
      style={{ display: "block", width: "100%", height: "auto", background: "#0a1220", ...style }} />
  );
}

/* 4 photos réelles (sources Wikimedia — voir _credits.json) + nature + indice */
const IMAGES = [
  {
    id: "manif",
    src: "assets/emi/manif.jpg",
    legende: "Manifestation à Paris, 8 mars 2025",
    bonne: "vrai",
    indice: "Photo publiée sur Wikimedia Commons avec date (8 mars 2025), lieu (Paris) et nom du photographe. On peut retrouver la source, la recouper avec d'autres photos et d'autres témoignages du même événement.",
  },
  {
    id: "ciel-retouche",
    src: "assets/emi/ciel-retouche.jpg",
    legende: "Avion au-dessus des palmiers, ciel de fin de journée",
    bonne: "retouchee",
    indice: "La scène est vraie (l'avion, les palmiers, la rue), mais les couleurs du ciel ont été poussées en post-traitement (mode HDR ou filtre). Un vrai crépuscule ne prend pas cette teinte violet/rose fluorescente en même temps que les palmiers restent nets et bien exposés.",
  },
  {
    id: "portrait-ia",
    src: "assets/emi/portrait-ia.jpg",
    legende: "Portrait d'un jeune garçon",
    bonne: "ia",
    indice: "Ce visage n'a jamais existé — il a été fabriqué par une IA. Les vrais indices sont subtils : symétrie trop parfaite, texture de peau trop lisse, arrière-plan sans logique, parfois des dents ou des cheveux qui « bavent » entre eux. Sans source ni contexte (qui est cet enfant ? d'où vient la photo ? qui l'a prise ?), on ne peut pas savoir qu'elle est réelle.",
  },
  {
    id: "deepfake",
    src: "assets/emi/deepfake.jpg",
    legende: "Benjamin Franklin lors d'un briefing à la Maison-Blanche",
    bonne: "deepfake",
    indice: "Benjamin Franklin est mort en 1790 : il ne peut pas apparaître dans une conférence de presse contemporaine ! C'est un deepfake — le visage de Franklin a été collé sur le corps d'un intervenant réel. Le premier réflexe pour repérer ces vidéos : est-ce que ça a un sens dans le temps et dans le contexte ? Ensuite : la vidéo vient-elle d'une source officielle et vérifiable ?",
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
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #26324a", aspectRatio: "4/3", background: "#0a1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Vignette src={im.src} alt={im.legende} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                      <div style={{ width: 90, flexShrink: 0, borderRadius: 6, overflow: "hidden", aspectRatio: "4/3", background: "#0a1220" }}>
                        <Vignette src={im.src} alt={im.legende} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
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
