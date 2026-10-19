/* ============================================================
   JEU 3 — SCÈNE : « Voyage via Chronographe K-01 » (Phase 5)
   ------------------------------------------------------------
   Lue depuis la Salle K après choix d'une destination. Flash court
   puis le décor du lieu et de la date : un tableau du Jeu 1 quand il
   montre le bon endroit (atelier de Gutenberg, tour de Chappe, ENIAC),
   sinon un décor dédié (voyageKDecors.jsx : Signal Hill 1901, atelier
   de Daguerre 1839, Boston 1876, Menlo Park 1877, Grand Café 1895).
   Les hotspots du décor Jeu 1 ne sont pas interactifs ici (props
   stubbés, mode « jeu2 » : ni « ? » de quête ni anachronismes) —
   c'est une visite d'observation. Les zones des PNJs : x = pieds,
   y ≈ hauteur de la poitrine.
   « Rapporter ▸ » pose voyageK_<id>_done et renvoie à la Salle K.
   ============================================================ */
import { useEffect, useState, useMemo } from "react";
import SceneGutenberg from "../../05-moyen-age/scenes/SceneGutenberg.jsx";
import SceneChappe from "../../06-moderne/scenes/SceneChappe.jsx";
import SceneEniac from "../../08-xxe/scenes/SceneEniac.jsx";
import { VKBell, VKDaguerre, VKEdison, VKFallback, VKLumiere, VKSignalHill } from "../voyageKDecors.jsx";

const noop = () => {};

/* Chaque destination : scène Jeu 1 réutilisée en mode observation, et
   une liste de PNJs cliquables (zones invisibles sur la scène). Le PNJ
   avec right:true livre la vraie histoire (verite) — les autres donnent
   une ligne « bateau » en guise de déviation. */
export const DEST = {
  gutenberg: {
    annee: "~1450", lieu: "Mayence (Saint-Empire romain germanique)",
    titre: "L'atelier de Johannes Gutenberg",
    Scene: SceneGutenberg,
    /* Le tableau du chapitre 5 : Gutenberg (pieds en 486,508) et son
       compagnon pressier à la presse (pieds en 790,516). */
    pnjs: [
      {
        id: "gutenberg", x: 486, y: 449, right: true,
        question: "Est-ce que vous confirmez que vous avez bien inventé la presse à caractères mobiles en métal, ici à Mayence, autour de 1450 ?",
        lignes: [
          "— Oui. Je suis Johannes Gutenberg. Mayence, 1450.",
          "— Je ne grave plus chaque lettre dans un bloc de bois. Je COULE chaque caractère séparément dans un alliage de plomb, étain et antimoine. Je peux les RÉUTILISER, mot après mot.",
          "— Avec cette presse à vis et une encre grasse, j'imprime une Bible — 42 lignes par colonne. On la nommera plus tard la B42.",
        ],
      },
      {
        id: "pressier", x: 790, y: 454,
        lignes: ["— Moi, je tire le barreau de la presse, du matin au soir. Les lettres, c'est le maître qui les fond. Va lui demander, il est là, devant le foyer."],
      },
    ],
  },
  chappe: {
    annee: "1794", lieu: "Ligne Paris–Lille",
    titre: "La tour de Claude Chappe",
    Scene: SceneChappe,
    /* Pieds des personnages dans SceneChappe : opérateur (360,498),
       Volta (600,510), espion tapi derrière son buisson (878,518). */
    pnjs: [
      {
        id: "chappe", x: 360, y: 435, right: true,
        question: "Est-ce que vous confirmez que vous avez tendu le premier télégraphe entre Paris et Lille, en 1794, et que c'est un télégraphe OPTIQUE ?",
        lignes: [
          "— Oui. Je suis Claude Chappe. La ligne va de Paris à Lille ; elle fonctionne depuis cet été.",
          "— Ce n'est pas un télégraphe électrique — l'électricité ne porte pas encore de messages. C'est de la télégraphie OPTIQUE : des bras articulés en haut de chaque tour, chaque posture est une lettre, lue à la longue-vue par la tour d'à côté.",
          "— Tout à l'heure, en moins d'une heure, le gouvernement a appris la reprise de Condé-sur-l'Escaut aux Autrichiens. Avant moi, il fallait deux jours à cheval.",
        ],
      },
      {
        id: "volta", x: 600, y: 445,
        lignes: ["— Je m'appelle Volta. Je bricole une pile dans mon coin — rien à voir avec les bras articulés d'en haut. Si tu veux comprendre la ligne, va parler à l'opérateur sur sa tour."],
      },
      {
        id: "espion", x: 878, y: 455,
        lignes: ["— Chut… ne me regarde pas. Je ne suis que de passage. On raconte que ces tours parlent sans ouvrir la bouche. J'aimerais savoir comment, mais personne ne me répondra."],
      },
    ],
  },
  marconi: {
    annee: "12 décembre 1901", lieu: "Signal Hill (Terre-Neuve) ← Poldhu (Cornouailles)",
    titre: "Marconi à l'écoute, à Signal Hill",
    Scene: VKSignalHill,
    /* Marconi assis au récepteur (pieds 400,482), George Kemp près de
       la fenêtre (pieds 830,500). */
    pnjs: [
      {
        id: "marconi", x: 400, y: 412, right: true,
        question: "Est-ce que vous confirmez que le premier signal radio a traversé l'Atlantique en décembre 1901, envoyé depuis Poldhu, en Cornouailles ?",
        lignes: [
          "— Oui. Je suis Guglielmo Marconi. 12 décembre 1901, Signal Hill, à Terre-Neuve.",
          "— À 3 500 kilomètres d'ici, de l'autre côté de l'océan, mon équipe de Poldhu, en Cornouailles, émet la lettre S en Morse — trois points — encore et encore.",
          "— Ici, le vent a emporté notre ballon ; l'antenne pend sous un cerf-volant. Vers midi et demi, dans l'écouteur : trois petits clics. Le signal a traversé l'Atlantique sans aucun fil.",
        ],
      },
      {
        id: "kemp", x: 830, y: 420,
        lignes: ["— George Kemp, son assistant. Moi, je surveille le cerf-volant : avec ce vent, il tire sur le fil comme un cheval fou. C'est M. Marconi qui écoute — c'est à lui qu'il faut demander."],
      },
    ],
  },
  /* ───── Destinations bonus (voyages libres via la cabine) ────────
     Pas liées à l'arc Jorge : le joueur peut y voyager en tapant
     l'année correspondante dans la cabine K-01. Elles aident à
     réviser les grandes dates du médiadex. */
  daguerre: {
    annee: "1839", lieu: "Paris",
    titre: "L'atelier de Louis Daguerre",
    Scene: VKDaguerre,
    pnjs: [{
      id: "daguerre", x: 420, y: 420, right: true,
      question: "Est-ce que vous confirmez que c'est Louis Daguerre qui a mis au point le premier procédé photographique utilisable, le daguerréotype, en 1839 ?",
      lignes: [
        "— Oui. Je suis Louis Daguerre. Paris, 1839. Je travaille sur ces plaques depuis des années.",
        "— Une plaque de cuivre argentée passe aux vapeurs d'iode, puis à la lumière, dans la chambre noire, et enfin aux vapeurs de mercure. On la fixe ensuite dans de l'eau salée.",
        "— L'image apparaît — nette, fine, unique : on ne peut pas la copier. En janvier, François Arago a présenté le procédé à l'Académie des sciences.",
      ],
    }, {
      id: "isidore", x: 880, y: 422,
      lignes: ["— Isidore Niépce, son associé. Mon père, Nicéphore, a fixé la première image vers 1827… il lui fallait des jours de pose. Mais ce procédé-ci, c'est M. Daguerre qui l'a mis au point : parle-lui."],
    }],
  },
  bell: {
    annee: "1876", lieu: "Boston (États-Unis)",
    titre: "Le laboratoire d'Alexander Graham Bell",
    Scene: VKBell,
    pnjs: [{
      id: "bell", x: 420, y: 418, right: true,
      question: "Est-ce que vous confirmez que c'est Alexander Graham Bell qui a breveté le premier téléphone en 1876 ?",
      lignes: [
        "— Oui. Je suis Alexander Graham Bell. Boston, 10 mars 1876. Je viens de dire dans l'appareil : « Mr. Watson, come here, I want to see you. »",
        "— La voix fait vibrer une membrane, la vibration fait varier un courant électrique, et au bout du fil le courant refait vibrer une membrane : on parle à distance.",
        "— Mon brevet m'a été accordé il y a trois jours. Elisha Gray avait déposé un dossier le même jour que moi : il y aura des procès, mais c'est mon brevet qui sera retenu.",
      ],
    }, {
      id: "watson", x: 750, y: 335,
      lignes: ["— Thomas Watson, son assistant. J'étais dans l'autre pièce, l'oreille collée au récepteur… et j'ai entendu sa voix, mot pour mot ! L'idée, c'est la sienne : demande-lui."],
    }],
  },
  edison: {
    annee: "1877", lieu: "Menlo Park (New Jersey)",
    titre: "Le laboratoire de Thomas Edison",
    Scene: VKEdison,
    pnjs: [{
      id: "edison", x: 440, y: 418, right: true,
      question: "Est-ce que vous confirmez que c'est Thomas Edison qui a inventé le phonographe en 1877 ?",
      lignes: [
        "— Oui. Je suis Thomas Edison. Décembre 1877, Menlo Park, New Jersey. J'ai crié dans l'embouchure : ma voix fait vibrer une pointe qui creuse un sillon dans une feuille d'étain enroulée sur le cylindre.",
        "— On repasse la pointe dans le même sillon… et la voix ressort : « Mary had a little lamb… »",
        "— Pour la première fois, on peut CONSERVER un son et le réécouter. Avant, une voix s'éteignait pour toujours.",
      ],
    }, {
      id: "kruesi", x: 830, y: 420,
      lignes: ["— John Kruesi, mécanicien. J'ai construit la machine d'après son croquis, en quelques jours. Je ne croyais pas qu'elle parlerait ! Pour le reste, demande à M. Edison."],
    }],
  },
  lumiere: {
    annee: "1895", lieu: "Paris, boulevard des Capucines",
    titre: "La première projection des frères Lumière",
    Scene: VKLumiere,
    /* Le 28 décembre 1895, Louis et Auguste ne sont pas à Paris : c'est
       leur père, Antoine, qui reçoit le public au Grand Café. */
    pnjs: [{
      id: "lumiere", x: 150, y: 420, right: true,
      question: "Est-ce que vous confirmez que ce sont les frères Lumière qui ont inventé le cinématographe, projeté pour la première fois en 1895 ?",
      lignes: [
        "— Oui. Je suis Antoine Lumière, leur père. Mes fils Louis et Auguste ont mis au point l'appareil à Lyon ; ce soir, 28 décembre 1895, c'est moi qui reçois le public, au salon indien du Grand Café.",
        "— Dix petits films d'une minute, devant un public qui a payé sa place : « La Sortie de l'usine Lumière à Lyon », « Le Jardinier », « Le Repas de bébé »…",
        "— L'appareil s'appelle le CINÉMATOGRAPHE : il filme ET il projette. Un certain Georges Méliès voulait me l'acheter ce soir ; j'ai refusé — à mon avis, c'est une invention sans avenir…",
      ],
    }, {
      id: "spectatrice", x: 790, y: 438,
      lignes: ["— Vous avez vu ? Les ouvrières sortent de l'usine comme pour de vrai ! Je n'y comprends rien — demandez donc au monsieur à la barbe blanche, à l'entrée : c'est le père des inventeurs."],
    }],
  },
  eniac: {
    annee: "1946", lieu: "Philadelphie (Pennsylvanie)",
    titre: "L'ENIAC, premier ordinateur électronique",
    Scene: SceneEniac,
    pnjs: [{
      id: "eniac", x: 830, y: 370, right: true,
      question: "Est-ce que vous confirmez que l'ENIAC, présenté au public en 1946, est le premier ordinateur électronique programmable à usage général ?",
      lignes: [
        "— Oui. 1946, université de Pennsylvanie, Philadelphie. Je suis Kay McNulty, une des six programmeuses.",
        "— 17 000 tubes à vide, 30 tonnes, 150 kilowatts. On branche et débranche des câbles pour « programmer », on glisse des cartes perforées pour les données.",
        "— Il calcule 5 000 additions par seconde. Un humain en fait 2 par minute. On a tout changé. Et ce sont des femmes qui ont écrit les premiers programmes.",
      ],
    }],
  },
};

/* Trois scènes « hors-dossier » tirées au hasard pour toute année qui
   ne mène pas à une destination connue. Chacune a son petit décor et
   deux silhouettes muettes. Aucun flag posé au retour. */
const FALLBACKS = [
  {
    annee: null, lieu: "Ruelle indéfinie", titre: "Hors des dossiers",
    kind: "ruelle",
    pnjs: [
      { id: "passant1", x: 350, y: 340,
        lignes: ["— Je vais à mes affaires. Ton nom ne me dit rien, ta question non plus. Essaie quelqu'un d'autre."] },
      { id: "passant2", x: 650, y: 360,
        lignes: ["— Rien de ce que tu cherches ici. Tu dois t'être trompé d'année — reprends la cabine et choisis mieux."] },
    ],
  },
  {
    annee: null, lieu: "Forêt la nuit", titre: "Hors des dossiers",
    kind: "foret",
    pnjs: [
      { id: "chasseur", x: 300, y: 380,
        lignes: ["— Tu viens d'où, toi ? Il fait nuit, les loups rôdent. Rentre chez toi — ou alors tu as pris une mauvaise voie."] },
      { id: "veilleur", x: 680, y: 370,
        lignes: ["— Pas de ça ici. Les étrangers passent, les étrangers s'en vont. Choisis une autre année dans ta machine."] },
    ],
  },
  {
    annee: null, lieu: "Désert au crépuscule", titre: "Hors des dossiers",
    kind: "desert",
    pnjs: [
      { id: "voyageur", x: 320, y: 390,
        lignes: ["— Le soleil tombe, le sable aussi. Tu cherches quelque chose, mais pas ici. Rebrousse chemin."] },
      { id: "nomade", x: 660, y: 400,
        lignes: ["— Mon peuple ne connaît pas ton inventeur. Reprends ta route — ou plutôt ta date — et va ailleurs."] },
    ],
  },
];

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
          ? <Scene collect={noop} action={noop} reveal={false} made={[]} queteQui={null} mode="jeu2" />
          : <VKFallback kind={info.kind} />}
      </div>

      {/* Zones cliquables des PNJs, alignées sur le viewBox 1000×560.
          Pas de marqueur visible — c'est au joueur de repérer les
          personnages dans le tableau et de cliquer dessus. Le SVG ne
          porte PAS pointer-events:none (sinon ni le root ni les
          enfants ne reçoivent les clics quels que soient les
          overrides) ; seules les rects transparents captent les
          événements, le reste passe au décor en-dessous. */}
      {!activePnj && (
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {info.pnjs.map((p) => (
            <PnjHit key={p.id} p={p} onClick={() => setActivePnj(p.id)} />
          ))}
        </svg>
      )}

      {/* Bandeau topic en haut à gauche — on affiche uniquement le lieu :
          c'est au joueur, en interrogeant les témoins, de confirmer la
          date du dossier. */}
      <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(10,8,6,0.85)", border: "1px solid #c8a848", borderRadius: 6, padding: "6px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8a848", pointerEvents: "none" }}>
        ⟡ {info.lieu.toUpperCase()}
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
        <PnjDialogue node={activeNode}
          lineIdx={lineIdx}
          totalLines={totalLines}
          atLast={atLast}
          onNext={() => setLineIdx((i) => i + 1)}
          onClose={closeDialogue}
          onReport={() => { if (activeNode.right) info.rightSeen = true; setPhase("return"); }} />
      )}
    </div>
  );
}

/* Modale de dialogue : d'abord la question du joueur (encart loupe),
   puis les répliques du PNJ. Pour un PNJ sans question définie (les
   « bateau »), on saute directement aux lignes. */
function PnjDialogue({ node, lineIdx, totalLines, atLast, onNext, onClose, onReport }) {
  const [askedPhase, setAskedPhase] = useState(!!node.question);
  const color = node.right ? "#5eff9e" : "#8a7050";
  return (
    <div onClick={(e) => e.stopPropagation()}
      style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)",
        background: "#141008",
        border: `2px solid ${color}`,
        borderRadius: 12, padding: "16px 22px",
        maxWidth: 760, width: "min(760px, calc(100% - 32px))",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
      {askedPhase ? (
        <>
          {/* Question du joueur, type « loupe/interrogation » */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a2838",
              border: "1.5px solid #c8a848", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🔎
            </div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>
              VOUS DEMANDEZ
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "#e8dfc8", lineHeight: 1.6, fontStyle: "italic" }}>
            « {node.question} »
          </p>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button onClick={onClose}
              style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 8, padding: "8px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
              ← Fermer
            </button>
            <button onClick={() => setAskedPhase(false)}
              style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
              Écouter la réponse ▸
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color, fontWeight: 800 }}>
              {node.right ? "📜 TÉMOIGNAGE DE PREMIÈRE MAIN" : "— habitant·e du passé"}
            </div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8a7050" }}>
              {lineIdx + 1} / {totalLines}
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "#e8dfc8", lineHeight: 1.6 }}>
            {node.lignes[lineIdx]}
          </p>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button onClick={onClose}
              style={{ background: "transparent", color: "#8a7050", border: "1px solid #3a2818", borderRadius: 8, padding: "8px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
              ← Fermer
            </button>
            {atLast ? (
              node.right ? (
                <button onClick={onReport}
                  style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                  Rapporter ▸
                </button>
              ) : (
                <button onClick={onClose}
                  style={{ background: "#8a7050", color: "#06110b", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                  Fermer ▸
                </button>
              )
            ) : (
              <button onClick={onNext}
                style={{ background: "#c8a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
                Suite ▸
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* Zone cliquable d'un PNJ : hit-test explicite via pointerEvents="all".
   Les Hotspots Jeu 1 (cx, cy) sont posés sur le CORPS du personnage, pas
   sur ses pieds — la hitbox va donc de −40 au-dessus à +60 en-dessous
   pour couvrir à la fois la tête et le torse autour du centre. */
function PnjHit({ p, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <g transform={`translate(${p.x},${p.y})`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <rect x="-40" y="-40" width="80" height="100" fill="black" fillOpacity="0" pointerEvents="all" />
      {hover && (
        <>
          <rect x="-40" y="-40" width="80" height="100" fill="none"
            stroke="#ffd870" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" pointerEvents="none" />
          <circle cx="0" cy="-54" r="12" fill="rgba(10,8,6,0.85)" stroke="#ffd870" strokeWidth="1.2" pointerEvents="none" />
          {/* Mini loupe */}
          <circle cx="-2" cy="-56" r="5" fill="none" stroke="#ffd870" strokeWidth="1.4" pointerEvents="none" />
          <line x1="2" y1="-52" x2="5" y2="-49" stroke="#ffd870" strokeWidth="2" strokeLinecap="round" pointerEvents="none" />
        </>
      )}
    </g>
  );
}

/* Résout la cible du voyage : id connu → DEST, année brute → fallback
   tiré au hasard parmi les 3 décors sombres. */
function resolveDest(target) {
  if (!target) return null;
  if (DEST[target]) {
    const d = { ...DEST[target], destId: target };
    d.rightSeen = false;
    return d;
  }
  const annee = String(target);
  const picked = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  return { ...picked, annee, Scene: null, destId: null, rightSeen: false };
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
