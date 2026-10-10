/* ============================================================
   JEU 3 — SCÈNE : « Voyage via Chronographe K-01 » (Phase 5)
   ------------------------------------------------------------
   Lue depuis la Salle K après choix d'une destination. Flash court
   puis affichage du décor Jeu 1 associé (SceneImprimerie, SceneChappe,
   SceneTSF) en toile de fond, et un panneau narratif en bas qui
   livre la vérité historique (ce que Jorge voulait restaurer).
   Les hotspots du décor Jeu 1 ne sont pas interactifs ici (props
   stubbés) — c'est une visite d'observation.
   « Rapporter ▸ » pose voyageK_<id>_done et renvoie à la Salle K.
   ============================================================ */
import { useEffect, useState } from "react";
import SceneImprimerie from "../../06-moderne/scenes/SceneImprimerie.jsx";
import SceneChappe from "../../06-moderne/scenes/SceneChappe.jsx";
import SceneTSF from "../../07-xixe/scenes/SceneTSF.jsx";

const noop = () => {};

/* pnj = position approximative (en coord viewBox 1000×560) du personnage
   à repérer dans le décor Jeu 1 pour déclencher le dialogue. */
const DEST = {
  gutenberg: {
    annee: "~1450", lieu: "Mayence (Saint-Empire romain germanique)",
    titre: "L'atelier de Johannes Gutenberg",
    nomPnj: "Johannes Gutenberg",
    Scene: SceneImprimerie,
    pnj: { x: 500, y: 360 },
    verite: [
      "L'atelier sent l'huile de lin et le plomb chaud. Devant toi, Johannes Gutenberg abaisse le levier de sa presse — un geste qu'il répète depuis des mois.",
      "Il ne grave plus chaque lettre dans un bloc de bois : il COULE chaque caractère séparément dans un alliage de plomb, étain et antimoine. Il peut les RÉUTILISER mot après mot. C'est ça, l'invention.",
      "La page qu'il imprime : une Bible en latin — 42 lignes par colonne. On la nommera plus tard « la B42 ».",
      "La fiche falsifiée disait : « ~850, Chine, un moine chinois anonyme ». La vérité : ~1450, Mayence, Johannes Gutenberg — avec la presse à caractères MOBILES EN MÉTAL.",
      "Les Chinois ont bien imprimé avec des caractères mobiles en terre cuite dès le XIᵉ siècle (Bi Sheng), mais c'est la combinaison métal + presse à vis + encre grasse qui change tout, et elle est de Gutenberg.",
    ],
  },
  chappe: {
    annee: "1794", lieu: "Ligne Paris–Lille",
    titre: "La tour de Claude Chappe",
    nomPnj: "Claude Chappe",
    Scene: SceneChappe,
    pnj: { x: 420, y: 340 },
    verite: [
      "Sur une colline, une tour de pierre. Un grand bras articulé pivote en haut — Claude Chappe lit un code dans son cahier et répercute le signal vers la tour suivante, à l'horizon.",
      "15 août 1794, le gouvernement reçoit la nouvelle de la reprise de Condé-sur-l'Escaut aux Autrichiens en moins d'une heure. Avant la ligne, il fallait deux jours à cheval.",
      "C'est de la télégraphie — mais OPTIQUE : chaque posture des bras est une lettre, lue à la longue-vue par la tour d'après. Pas de fil, pas d'électricité. Juste des bras articulés et des opérateurs qui se relaient.",
      "La fiche falsifiée disait : « 1794, Washington–Baltimore, Samuel Morse ». La vérité : 1794, Paris–Lille, Claude Chappe — télégraphe OPTIQUE à bras articulés.",
      "Morse n'arrivera que cinquante ans plus tard, en 1844, avec la variante ÉLECTRIQUE. Les deux ont existé — on les a mélangés dans la fiche.",
    ],
  },
  marconi: {
    annee: "12 décembre 1901", lieu: "Poldhu (Cornouailles) → Signal Hill (Terre-Neuve)",
    titre: "La station de Guglielmo Marconi",
    nomPnj: "Guglielmo Marconi",
    Scene: SceneTSF,
    pnj: { x: 440, y: 370 },
    verite: [
      "Nuit froide sur la côte cornouaillaise. L'antenne de Poldhu crache un signal de forte puissance : trois points — un S Morse — répétés inlassablement.",
      "À 3 400 km de là, à Signal Hill, Terre-Neuve, Marconi tend l'oreille sur son récepteur à cohéreur. Vers midi, il l'entend : trois clics. Il essuie une larme, prend des notes, recommence.",
      "C'est la première preuve qu'on peut parler D'UN CÔTÉ À L'AUTRE DE L'ATLANTIQUE sans aucun fil. L'ionosphère sert de miroir, personne ne le sait encore.",
      "La fiche falsifiée disait : « 1920, Londres, la BBC (émission grand public) ». La vérité : 1901, Cornouailles→Terre-Neuve, Guglielmo Marconi — signal TRANSATLANTIQUE.",
      "La BBC en 1922 (pas 1920), c'est la radio de divertissement grand public — une autre invention, dérivée, pas la première TSF.",
    ],
  },
};

export default function BunkerVoyageK({ onGo, j3 }) {
  const targetId = j3?.flags?.voyageK_target;
  const info = targetId ? DEST[targetId] : null;
  const [phase, setPhase] = useState("flash"); // flash → past → return
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (phase !== "flash") return;
    const t = setTimeout(() => setPhase("past"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "return") return;
    const t = setTimeout(() => {
      j3.setFlag(`voyageK_${targetId}_done`);
      j3.setFlag("voyageK_target", null);
      onGo("salleK");
    }, 1200);
    return () => clearTimeout(t);
  }, [phase, targetId, j3, onGo]);

  if (!info) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: 20 }}>
        <p style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, color: "#c8d4e2" }}>
          Pas de destination sélectionnée. Reviens au pupitre K-01.
        </p>
        <button onClick={() => onGo("salleK")}
          style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          ← Reprendre
        </button>
      </div>
    );
  }

  const Scene = info.Scene;
  const totalLines = info.verite.length;
  const atLast = lineIdx >= totalLines - 1;

  if (phase === "flash") {
    return <FlashOverlay info={info} direction="aller" />;
  }
  if (phase === "return") {
    return <FlashOverlay info={info} direction="retour" />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Décor Jeu 1 PLEIN CADRE — ratio 1000/560, exactement comme en Jeu 1.
          pointerEvents:none pour que les hotspots du décor ne se déclenchent
          pas ; seul le marqueur PNJ au-dessus est cliquable. */}
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
        <Scene collect={noop} action={noop} reveal={noop} made={[]} queteQui={null} mode="jeu3" />
      </div>

      {/* Overlay SVG qui aligne le marqueur PNJ sur le viewBox du décor
          (même préserve-aspect-ratio pour aligner avec slice). */}
      {!dialogueOpen && (
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <g transform={`translate(${info.pnj.x},${info.pnj.y})`}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
            onClick={() => setDialogueOpen(true)}>
            {/* Zone de clic large */}
            <circle r="34" fill="transparent" />
            {/* Halo pulsant */}
            <circle r="22" fill="none" stroke="#ffd870" strokeWidth="2" opacity="0.9">
              <animate attributeName="r" values="18;28;18" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
            </circle>
            {/* Loupe */}
            <circle r="10" fill="#141008" stroke="#ffd870" strokeWidth="2" />
            <circle r="5" cx="-1" cy="-1" fill="none" stroke="#ffd870" strokeWidth="1.6" />
            <line x1="3" y1="3" x2="7" y2="7" stroke="#ffd870" strokeWidth="2" strokeLinecap="round" />
            {/* Étiquette sous le marqueur */}
            <g transform="translate(0,28)">
              <rect x="-50" y="-4" width="100" height="14" fill="rgba(10,8,6,0.85)" stroke="#ffd870" strokeWidth="0.6" rx="2" />
              <text x="0" y="6" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7"
                fontWeight="700" fill="#ffd870" letterSpacing="2">
                QUESTIONNER
              </text>
            </g>
          </g>
        </svg>
      )}

      {/* Bandeau topic en haut à gauche */}
      <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(10,8,6,0.85)", border: "1px solid #c8a848", borderRadius: 6, padding: "6px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8a848", pointerEvents: "none" }}>
        ⟡ {info.annee.toUpperCase()} · {info.lieu.toUpperCase()}
      </div>

      {/* Bouton Interrompre en haut à droite */}
      <button onClick={() => onGo("salleK")}
        style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,8,6,0.85)", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 6, padding: "6px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer", letterSpacing: 1 }}>
        ← Interrompre le voyage
      </button>

      {/* Consigne discrète en bas tant qu'on n'a pas cliqué le PNJ */}
      {!dialogueOpen && (
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
          background: "rgba(10,8,6,0.85)", border: "1px dashed #ffd870", borderRadius: 6,
          padding: "6px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11,
          color: "#ffd870", letterSpacing: 2, fontStyle: "italic", pointerEvents: "none" }}>
          Trouve {info.nomPnj} dans le tableau et clique dessus.
        </div>
      )}

      {/* Panneau narratif en modale par-dessus */}
      {dialogueOpen && (
        <div onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)",
            background: "#141008", border: "2px solid #c8a848", borderRadius: 12,
            padding: "16px 22px", maxWidth: 760, width: "min(760px, calc(100% - 32px))",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>
              📜 {info.titre.toUpperCase()}
            </div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7050" }}>
              {lineIdx + 1} / {totalLines}
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "#e8dfc8", lineHeight: 1.6 }}>
            {info.verite[lineIdx]}
          </p>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => atLast ? setPhase("return") : setLineIdx((i) => i + 1)}
              style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
              {atLast ? "Rapporter ▸" : "Suite ▸"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Flash court entre K et le passé (et retour). */
function FlashOverlay({ info, direction }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#050408", zIndex: 220, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Palatino, Georgia, serif" }}>
      <div style={{ textAlign: "center", color: "#c8a848" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 5, color: "#c8a848" }}>
          {direction === "aller" ? "⟡ CHRONOGRAPHE · DÉPART" : "⟡ CHRONOGRAPHE · RETOUR"}
        </div>
        <div style={{ marginTop: 20, fontSize: 36, fontWeight: 800, letterSpacing: 8, color: "#ffd870", textShadow: "0 0 20px rgba(255,216,112,0.6)" }}>
          {info.annee}
        </div>
        <div style={{ marginTop: 10, fontSize: 14, color: "#8a7050", fontStyle: "italic" }}>
          {info.lieu}
        </div>
        {/* Barre de progression animée via CSS */}
        <div style={{ marginTop: 24, width: 260, height: 4, margin: "24px auto 0", background: "#2a1808", border: "1px solid #c8a848", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, #ffd870, transparent)", animation: "voyK 1.1s linear" }} />
        </div>
        <style>{`@keyframes voyK { from { transform: translateX(-100%); } to { transform: translateX(100%); } }`}</style>
      </div>
    </div>
  );
}
