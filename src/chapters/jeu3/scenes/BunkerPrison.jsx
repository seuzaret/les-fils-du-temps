/* ============================================================
   JEU 3 — SCÈNE : « Cellules disciplinaires » (C-01) — Phase 3
   ------------------------------------------------------------
   Petite salle sans fenêtre : trois cellules alignées. Celle du
   milieu est occupée par Jorge, les deux autres sont vides. Les
   barreaux filtrent la lumière verte des néons du couloir.
   Clic sur Jorge → BigDialogue qui varie selon le nombre de
   signalements posés pendant les 3 passes de tri.
   ============================================================ */
import { useState } from "react";
import PnjSprite from "../PnjSprite.jsx";
import BigDialogue from "../BigDialogue.jsx";

const JORGE_STYLE = {
  color: "#5a4028", pants: "#28303a", hair: "#8a8070", skin: "#c8a888",
  facing: "front", accessory: null, activity: "crossed",
  bald: true, beard: "#8a8070",
};

/* Infos par destination pour les révélations progressives de Jorge. */
const DEST_INFO = {
  gutenberg: { nom: "Johannes Gutenberg", lieu: "Mayence", annee: 1450,
    question: "la presse à caractères mobiles en métal" },
  chappe:    { nom: "Claude Chappe", lieu: "Paris–Lille", annee: 1794,
    question: "le télégraphe optique à bras articulés" },
  marconi:   { nom: "Guglielmo Marconi", lieu: "Cornouailles", annee: 1901,
    question: "le premier signal radio transatlantique" },
};

export default function BunkerPrison({ onGo, j3 }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const flags = j3?.flags || {};
  const signalements = [
    !!flags.archives_signalement_gutenberg,
    !!flags.archives_signalement_chappe,
    !!flags.archives_signalement_marconi,
  ];
  const nbSignale = signalements.filter(Boolean).length;
  const visited = !!flags.jorge_cellule_vue;
  /* Ordre des destinations tiré au Jeu3 init. On compte combien ont
     été vérifiées pour savoir laquelle révéler maintenant. */
  const order = flags.k_voyage_order || ["gutenberg", "chappe", "marconi"];
  const doneCount = order.filter((id) => flags[`voyageK_${id}_done`]).length;
  const nextId = doneCount < 3 ? order[doneCount] : null;
  const nextDest = nextId ? DEST_INFO[nextId] : null;
  const prevId = doneCount > 0 ? order[doneCount - 1] : null;
  const prevDest = prevId ? DEST_INFO[prevId] : null;

  /* Dialogue progressif selon l'avancée des voyages (doneCount 0..3) :
     - 0 : première rencontre, Jorge explique le bouton caché et donne
           la PREMIÈRE destination.
     - 1-2 : il confirme ce qu'on a entendu puis donne la suivante.
     - 3 : tout est vérifié, il invite à rapporter à Vez. */
  const aMediadex = !!flags.mediadex_retrouve;
  const lignes = (() => {
    if (doneCount === 0) {
      const intro = !visited ? [
        "Jorge te regarde à travers les barreaux. Il hoche la tête lentement.",
      ] : [
        "Jorge se redresse en te voyant revenir.",
      ];
      /* Si le joueur n'a PAS encore le médiadex, Jorge l'envoie
         d'abord dans sa chambre le chercher — il en aura besoin pour
         retrouver les dates. */
      if (!aMediadex) {
        return [
          ...intro,
          "« Tu es venu·e me voir. Bien. »",
          "« Avant d'aller plus loin, retourne dans ta chambre. Il y a sur ton bureau un petit livre à couverture d'or : le médiadex. Prends-le. Sans lui, tu ne retrouveras aucune date. »",
          "« Reviens me voir une fois que tu l'as. »",
        ];
      }
      return [
        ...intro,
        nbSignale > 0
          ? `« Tu as repéré ${nbSignale} de mes signalements dans les archives, et tu as le médiadex en main. On peut parler. »`
          : "« Tu as le médiadex en main. On peut parler. »",
        "« Il faut descendre à l'étage K. L'ascenseur a un petit bouton caché, à droite du frein d'urgence — sans inscription, discret. »",
        "« Il faut l'enfoncer CINQ fois d'affilée pour qu'il s'active. Pas une de plus, pas une de moins. C'était ma sécurité. »",
        "« Là-bas, tu trouveras la machine. Léa Vermet l'a construite avant 2047 — elle a été la première à comprendre ce que MARTINE commençait à réécrire. Je l'ai entretenue, en secret, depuis sa mort. »",
        "« Elle emmène dans le passé — mais passivement : tu peux voir, écouter, questionner. Rien de plus. »",
        `« D'abord, va voir ${nextDest.nom}, à ${nextDest.lieu}. Demande-lui s'il a bien inventé ${nextDest.question}. La date exacte, cherche-la dans ton médiadex. »`,
        "« Reviens me voir après. »",
      ];
    }
    if (doneCount === 1) {
      return [
        "Jorge se lève, les yeux brillants.",
        `« Tu l'as vu·e. ${prevDest.nom}. Confirmé par la personne elle-même. »`,
        "« C'est ça qu'ils effacent, dans les Archives : les noms, les dates, les lieux. Ils réécrivent par petites touches, jusqu'à ce que personne ne se souvienne plus. »",
        `« Maintenant, deuxième voyage. Va voir ${nextDest.nom}, à ${nextDest.lieu}. Demande-lui s'il a bien inventé ${nextDest.question}. La date, encore une fois, dans ton médiadex. »`,
        "« Reviens ensuite. »",
      ];
    }
    if (doneCount === 2) {
      return [
        "Jorge pose son front contre les barreaux, soulagé.",
        `« Deux sur trois. ${prevDest.nom} aussi, tu l'as entendu·e. »`,
        "« Il n'en reste qu'un. Celui-là, c'est le plus récent — et c'est le plus facile à faire disparaître parce qu'il est encore dans les mémoires vivantes. »",
        `« Va voir ${nextDest.nom}, à ${nextDest.lieu}. Demande-lui s'il a bien inventé ${nextDest.question}. Médiadex pour la date. »`,
        "« Puis reviens. On aura fini. »",
      ];
    }
    /* doneCount >= 3 */
    return [
      "Jorge te regarde longuement, sans parler d'abord.",
      "« Trois sur trois. Les trois noms, les trois dates, les trois lieux. Tu as entendu de leur bouche. »",
      "« Alors tu sais ce que je faisais, maintenant. Je signalais, dans le silence des archives, ce qu'ils réécrivaient. Pour qu'un œil comme le tien le voie. »",
      "« Remonte au bureau du Juge Vez. Dépose-lui le dossier. Qu'elle fasse rouvrir les sources. »",
      "« Et merci. »",
    ];
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="pr-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141820" />
            <stop offset="100%" stopColor="#050810" />
          </linearGradient>
          <linearGradient id="pr-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e1218" />
            <stop offset="100%" stopColor="#020408" />
          </linearGradient>
          <radialGradient id="pr-cellLight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#8aff9e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8aff9e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1000" height="520" fill="url(#pr-wall)" />
        <rect y="380" width="1000" height="140" fill="url(#pr-floor)" />

        {/* Plafond : rails et néons verts clignotants */}
        <rect y="0" width="1000" height="40" fill="#0a0e14" />
        {[150, 500, 850].map((x, i) => (
          <g key={i}>
            <rect x={x - 40} y="20" width="80" height="4" fill="#8aff9e" opacity="0.7">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </rect>
            <circle cx={x} cy="60" r="80" fill="url(#pr-cellLight)" />
          </g>
        ))}

        {/* Plaque murale */}
        <g transform="translate(500,54)">
          <rect x="-50" y="0" width="100" height="16" fill="#e8dfc8" stroke="#3a2010" strokeWidth="1" />
          <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="700" fill="#0a0806" letterSpacing="2">
            C-01 · DISCIPLINE
          </text>
        </g>

        {/* Trois cellules alignées : vide / Jorge / vide */}
        {[0, 1, 2].map((k) => {
          const x = 140 + k * 280;
          const occupied = k === 1;
          return (
            <g key={k} transform={`translate(${x},100)`}>
              {/* Fond de cellule */}
              <rect x="0" y="0" width="220" height="280" fill="#0a0e14" stroke="#1a2028" strokeWidth="2" />
              {/* Pierre apparente au mur du fond */}
              {[0, 1, 2, 3, 4].map((r) => (
                [0, 1, 2].map((c) => (
                  <rect key={`${r}${c}`}
                    x={20 + c * 60} y={20 + r * 44}
                    width="56" height="40"
                    fill="#1a1e26" stroke="#0a0e14" strokeWidth="0.5" opacity="0.7" />
                ))
              ))}
              {/* Lit étroit au fond gauche */}
              <rect x="12" y="220" width="80" height="36" fill="#3a2010" stroke="#0a0806" strokeWidth="0.8" />
              <rect x="12" y="214" width="80" height="8" fill="#5a3818" stroke="#0a0806" strokeWidth="0.5" />
              <rect x="18" y="196" width="22" height="24" fill="#c8b090" stroke="#5a4028" strokeWidth="0.4" />
              {/* Numéro de cellule au-dessus */}
              <rect x="80" y="-14" width="60" height="12" fill="#28303a" stroke="#0a0e14" strokeWidth="0.6" />
              <text x="110" y="-4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700" fill="#8aff9e">
                C-{String(k + 1).padStart(2, "0")}
              </text>
              {/* Barreaux verticaux */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((b) => (
                <line key={b} x1={10 + b * 25} y1="0" x2={10 + b * 25} y2="280"
                  stroke="#5a6270" strokeWidth="3" />
              ))}
              {/* Barre horizontale au niveau de la serrure */}
              <line x1="0" y1="130" x2="220" y2="130" stroke="#5a6270" strokeWidth="2" />
              {/* Serrure si occupée */}
              {occupied && (
                <g transform="translate(110,130)">
                  <rect x="-10" y="-6" width="20" height="12" fill="#c8a848" stroke="#0a0806" strokeWidth="0.6" />
                  <circle r="2.5" fill="#1a0e08" />
                </g>
              )}
              {/* Habitant de la cellule */}
              {occupied && (
                <PnjSprite x={120} y={260}
                  color={JORGE_STYLE.color} pants={JORGE_STYLE.pants}
                  hair={JORGE_STYLE.hair} skin={JORGE_STYLE.skin}
                  bald beard={JORGE_STYLE.beard}
                  facing="front" activity="crossed"
                  nom="Jorge" role="Détenu"
                  active={doneCount < 3}
                  onClick={() => setDialogOpen(true)} />
              )}
            </g>
          );
        })}

        {/* Lampe de surveillance au mur */}
        <g transform="translate(500,400)">
          <circle r="6" fill="#e83820">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8a7050" letterSpacing="2">
            SURVEILLANCE ACTIVE
          </text>
        </g>

        <text x="500" y="498" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#5a6678" letterSpacing="3">
          CELLULES — SILENCE EXIGÉ
        </text>
      </svg>

      <div style={{ maxWidth: 1200, width: "100%" }}>
        <div style={{ background: "#0a0e14", border: "1px dashed #5a6270", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c8d4e2", lineHeight: 1.55, fontStyle: "italic" }}>
            Trois cellules. Celle du milieu est occupée par Jorge, les deux autres vides. L'air sent la poussière et le métal froid.
            {doneCount < 3 && " Approche-toi des barreaux pour lui parler."}
            {doneCount >= 3 && " Jorge te regarde comme on regarde quelqu'un qui a fini son travail."}
          </p>
          {doneCount > 0 && doneCount < 3 && (
            <div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8aff9e", letterSpacing: 2 }}>
              voyages confirmés · {doneCount} / 3
            </div>
          )}
        </div>
      </div>

      <button onClick={() => onGo(j3.hubRoom || "hubBas")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Retour au couloir
      </button>

      {dialogOpen && (
        <BigDialogue
          topic={`CELLULE C-02 · JORGE · ${doneCount < 3 ? `VOYAGE ${doneCount + 1} / 3` : "MISSION ACHEVÉE"}`}
          speakerNom="Jorge" speakerRole="Archiviste détenu"
          speakerStyle={JORGE_STYLE}
          accent="#8aff9e"
          lignes={lignes}
          actionLabel="Sortir ▸"
          onDone={() => {
            j3.setFlag("jorge_cellule_vue");
            /* Jorge livre la plaque K dans tous les cas — la fin de
               l'arc n'est jamais bloquée. Seul le ton de son discours
               change selon ce qui a été repéré. */
            j3.setFlag("elevator_k_unlocked");
            setDialogOpen(false);
          }} />
      )}
    </div>
  );
}
