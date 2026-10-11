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
import { useEffect, useState, useMemo } from "react";
import SceneImprimerie from "../../06-moderne/scenes/SceneImprimerie.jsx";
import SceneChappe from "../../06-moderne/scenes/SceneChappe.jsx";
import SceneTSF from "../../07-xixe/scenes/SceneTSF.jsx";

const noop = () => {};

/* Chaque destination : scène Jeu 1 réutilisée en mode observation, et
   une liste de PNJs cliquables (zones invisibles sur la scène). Le PNJ
   avec right:true livre la vraie histoire (verite) — les autres donnent
   une ligne « bateau » en guise de déviation. */
const DEST = {
  gutenberg: {
    annee: "~1450", lieu: "Mayence (Saint-Empire romain germanique)",
    titre: "L'atelier de Johannes Gutenberg",
    Scene: SceneImprimerie,
    pnjs: [
      {
        id: "apprenti", x: 230, y: 420,
        lignes: ["— Je lave l'encre des presses, moi. Si tu cherches à comprendre ce que fabrique le maître, va le voir, il est près du levier."],
      },
      {
        id: "gutenberg", x: 500, y: 370, right: true,
        lignes: [
          "— Approche, chronaute. Je m'appelle Johannes Gutenberg. L'année : 1450. Nous sommes à Mayence.",
          "— Regarde : je ne grave plus chaque lettre dans un bloc de bois. Je COULE chaque caractère séparément dans un alliage de plomb, d'étain et d'antimoine. Je peux les RÉUTILISER, mot après mot.",
          "— Avec cette presse à vis et cette encre grasse, j'imprime une Bible — 42 lignes par colonne. On la nommera plus tard la B42. Le début d'une révolution.",
        ],
      },
      {
        id: "visiteur", x: 780, y: 360,
        lignes: ["— Je passe pour commander une Bible. On dit qu'il peut en faire plusieurs à la fois ? J'avoue, j'ai du mal à y croire."],
      },
    ],
  },
  chappe: {
    annee: "1794", lieu: "Ligne Paris–Lille",
    titre: "La tour de Claude Chappe",
    Scene: SceneChappe,
    pnjs: [
      {
        id: "soldat", x: 200, y: 410,
        lignes: ["— Je garde la base, moi. Les hommes du Comité ont dit : rien ne doit entrer. Pour le reste, demande à l'ingénieur, là-haut."],
      },
      {
        id: "chappe", x: 420, y: 340, right: true,
        lignes: [
          "— Chronaute. Je suis Claude Chappe. Nous sommes le 15 août 1794. Ma ligne va de Paris à Lille.",
          "— Ce n'est pas un télégraphe électrique — l'électricité ne porte pas encore de messages. C'est de la télégraphie OPTIQUE : des bras articulés en haut de chaque tour, chaque posture est une lettre, lue à la longue-vue par la tour suivante.",
          "— Tout à l'heure, en moins d'une heure, le gouvernement a appris la reprise de Condé-sur-l'Escaut aux Autrichiens. Avant moi, il fallait deux jours à cheval.",
        ],
      },
      {
        id: "espion", x: 760, y: 380,
        lignes: ["— Je ne suis que de passage. On raconte que ces tours parlent sans ouvrir la bouche. J'aimerais comprendre comment — mais on ne me dira rien."],
      },
    ],
  },
  marconi: {
    annee: "12 décembre 1901", lieu: "Poldhu (Cornouailles) → Signal Hill (Terre-Neuve)",
    titre: "La station de Guglielmo Marconi",
    Scene: SceneTSF,
    pnjs: [
      {
        id: "journaliste", x: 180, y: 370,
        lignes: ["— Je viens pour le Times. On m'a promis une preuve. Je ne sais rien de plus pour l'instant — tout est entre les mains de l'Italien."],
      },
      {
        id: "marconi", x: 440, y: 370, right: true,
        lignes: [
          "— Chronaute, approche. Je suis Guglielmo Marconi. Nous sommes dans la nuit du 12 décembre 1901, à Poldhu, en Cornouailles.",
          "— À 3 400 kilomètres de là, à Signal Hill, Terre-Neuve, un de mes récepteurs écoute. L'antenne crache un S en Morse — trois points — répété sans relâche.",
          "— Vers midi, je l'ai entendu : trois clics, à travers l'Atlantique, sans aucun fil. L'ionosphère sert de miroir — personne ne le sait encore. C'est la première preuve.",
        ],
      },
      {
        id: "assistant", x: 720, y: 400,
        lignes: ["— Je surveille les piles. Si tu veux savoir ce que fait l'antenne, va voir Marconi — c'est son appareil, c'est son idée."],
      },
    ],
  },
};

/* Scène fallback pour toute année en-dehors des trois dossiers de Jorge.
   Décor minimal + 2 silhouettes bateau, aucune verité posée. */
const FALLBACK = {
  annee: null,
  lieu: "Époque inconnue",
  titre: "Hors des dossiers",
  pnjs: [
    {
      id: "passant1", x: 350, y: 340,
      lignes: ["— Je vais à mes affaires. Ton nom ne me dit rien, ta question non plus. Essaie quelqu'un d'autre."],
    },
    {
      id: "passant2", x: 650, y: 360,
      lignes: ["— Rien de ce que tu cherches ici. Tu dois t'être trompé d'année — reprends la cabine et choisis mieux."],
    },
  ],
};

export default function BunkerVoyageK({ onGo, j3 }) {
  const target = j3?.flags?.voyageK_target;
  /* target peut être un id de destination connue (gutenberg, chappe,
     marconi) ou juste une année entière (pour les voyages hors-dossier). */
  const info = useMemo(() => resolveDest(target), [target]);
  const [phase, setPhase] = useState("flash"); // flash → past → return
  const [activePnj, setActivePnj] = useState(null); // id du PNJ cliqué
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (phase !== "flash") return;
    const t = setTimeout(() => setPhase("past"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "return") return;
    const t = setTimeout(() => {
      /* On ne pose le flag voyageK_<id>_done que si le joueur a
         questionné le BON PNJ (right:true) — sinon le voyage est
         consommé mais le dossier n'est pas marqué vérifié. */
      if (info?.destId && info?.rightSeen) {
        j3.setFlag(`voyageK_${info.destId}_done`);
      }
      j3.setFlag("voyageK_target", null);
      onGo("salleK");
    }, 1200);
    return () => clearTimeout(t);
  }, [phase, info, j3, onGo]);

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
  const activeNode = activePnj ? info.pnjs.find((p) => p.id === activePnj) : null;
  const totalLines = activeNode?.lignes.length || 0;
  const atLast = lineIdx >= totalLines - 1;

  if (phase === "flash") {
    return <FlashOverlay info={info} direction="aller" />;
  }
  if (phase === "return") {
    return <FlashOverlay info={info} direction="retour" />;
  }

  const closeDialogue = () => {
    if (activeNode?.right) info.rightSeen = true; // mémoise pour le retour
    setActivePnj(null);
    setLineIdx(0);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Décor Jeu 1 (ou fallback) PLEIN CADRE, hotspots neutralisés. */}
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
        {Scene
          ? <Scene collect={noop} action={noop} reveal={noop} made={[]} queteQui={null} mode="jeu3" />
          : <FallbackDecor />}
      </div>

      {/* Zones cliquables des PNJs, alignées sur le viewBox 1000×560.
          Pas de marqueur visible — c'est au joueur de repérer les
          personnages dans le tableau et de cliquer dessus. */}
      {!activePnj && (
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {info.pnjs.map((p) => (
            <g key={p.id} transform={`translate(${p.x},${p.y})`}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onClick={() => setActivePnj(p.id)}>
              {/* Zone de clic large et invisible (72×140, calée sur un
                  sprite PNJ typique de Jeu 1). */}
              <rect x="-36" y="-110" width="72" height="140" fill="transparent" />
            </g>
          ))}
        </svg>
      )}

      {/* Bandeau topic en haut à gauche */}
      <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(10,8,6,0.85)", border: "1px solid #c8a848", borderRadius: 6, padding: "6px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8a848", pointerEvents: "none" }}>
        ⟡ {(info.annee || "? ? ? ?").toString().toUpperCase()} · {info.lieu.toUpperCase()}
      </div>

      {/* Bouton Interrompre en haut à droite */}
      <button onClick={() => setPhase("return")}
        style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,8,6,0.85)", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 6, padding: "6px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer", letterSpacing: 1 }}>
        ← Rentrer
      </button>

      {/* Consigne discrète en bas tant qu'aucun PNJ cliqué */}
      {!activePnj && (
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
          background: "rgba(10,8,6,0.85)", border: "1px dashed #c8a848", borderRadius: 6,
          padding: "6px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11,
          color: "#c8b090", letterSpacing: 2, fontStyle: "italic", pointerEvents: "none" }}>
          Les gens du passé sont là, autour de toi. Clique sur un visage pour l'interroger.
        </div>
      )}

      {/* Modale de dialogue avec le PNJ cliqué */}
      {activeNode && (
        <div onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)",
            background: "#141008",
            border: `2px solid ${activeNode.right ? "#5eff9e" : "#8a7050"}`,
            borderRadius: 12, padding: "16px 22px",
            maxWidth: 760, width: "min(760px, calc(100% - 32px))",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3,
              color: activeNode.right ? "#5eff9e" : "#8a7050", fontWeight: 800 }}>
              {activeNode.right ? "📜 TÉMOIGNAGE DE PREMIÈRE MAIN" : "— habitant·e du passé"}
            </div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7050" }}>
              {lineIdx + 1} / {totalLines}
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "#e8dfc8", lineHeight: 1.6 }}>
            {activeNode.lignes[lineIdx]}
          </p>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button onClick={closeDialogue}
              style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 8, padding: "8px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
              ← Fermer
            </button>
            {atLast ? (
              activeNode.right ? (
                <button onClick={() => { if (activeNode.right) info.rightSeen = true; setPhase("return"); }}
                  style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                  Rapporter ▸
                </button>
              ) : (
                <button onClick={closeDialogue}
                  style={{ background: "#8a7050", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                  Fermer ▸
                </button>
              )
            ) : (
              <button onClick={() => setLineIdx((i) => i + 1)}
                style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                Suite ▸
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Résout la cible du voyage : id connu → DEST, année brute → fallback. */
function resolveDest(target) {
  if (!target) return null;
  if (DEST[target]) {
    const d = { ...DEST[target], destId: target };
    d.rightSeen = false;
    return d;
  }
  /* Année brute : cible numérique. Fallback générique. */
  const annee = String(target);
  return { ...FALLBACK, annee, Scene: null, destId: null, rightSeen: false };
}

/* Petit décor abstrait pour les époques non documentées. */
function FallbackDecor() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="fb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1428" />
          <stop offset="100%" stopColor="#28202a" />
        </linearGradient>
        <linearGradient id="fb-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2420" />
          <stop offset="100%" stopColor="#0a0608" />
        </linearGradient>
      </defs>
      <rect width="1000" height="400" fill="url(#fb-sky)" />
      <rect y="400" width="1000" height="160" fill="url(#fb-ground)" />
      {/* Horizon flou avec silhouettes de bâtiments indéfinis */}
      {[100, 220, 380, 520, 680, 820].map((x, i) => (
        <rect key={i} x={x} y={340 - (i % 3) * 20} width="60" height="80" fill="#1a1418" opacity="0.8" />
      ))}
      {/* Lune pâle */}
      <circle cx="800" cy="140" r="40" fill="#8a7a80" opacity="0.6" />
      {/* Deux silhouettes de passants (positions correspondant aux PNJ) */}
      {[[350, 390], [650, 410]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <ellipse cx="0" cy="40" rx="18" ry="4" fill="#000" opacity="0.4" />
          <path d="M-14 20 Q-18 0 -4 -6 L4 -6 Q18 0 14 20 Z" fill="#28202a" stroke="#0a0608" strokeWidth="0.6" />
          <rect x="-6" y="20" width="12" height="40" fill="#1a1418" />
          <circle cx="0" cy="-14" r="10" fill="#5a4848" stroke="#1a0e08" strokeWidth="0.5" />
        </g>
      ))}
      <text x="500" y="520" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="12"
        fill="#5a5a70" fontStyle="italic" letterSpacing="2">
        une ruelle, quelque part, à une époque indéfinie
      </text>
    </svg>
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
