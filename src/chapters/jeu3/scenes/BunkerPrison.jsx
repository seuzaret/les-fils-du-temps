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

  /* Dialogue selon le nombre de signalements. Dans tous les cas, Jorge
     livre la plaque K à la fin du dialogue (voir onDone ci-dessous).
     Le ton varie : résignation à 0/3, partage à 1-2/3, confiance à 3/3. */
  const lignes = (() => {
    if (nbSignale === 0) {
      return [
        "Jorge te regarde à travers les barreaux. Il hoche la tête, lentement.",
        "« Tu es venu·e me voir. C'est déjà quelque chose — beaucoup se seraient contentés de ranger. »",
        "« Je t'avais glissé trois signaux dans les lots que tu as triés. Trois dates qui ne collaient pas. Tu ne les as pas vues. Tant pis — on apprend à ranger, on désapprend à regarder. »",
        "« Il est trop tard pour reprendre ces fiches, elles sont déjà au bureau du Juge. Mais ce que je faisais, tu peux encore aller le voir toi-même. »",
        "Il te glisse à travers les barreaux une petite plaque métallique gravée d'un K.",
        "« L'ascenseur a une touche cachée. Elle s'appelle K. Vas-y. Ouvre l'œil, cette fois. »",
      ];
    }
    if (nbSignale < 3) {
      const noms = [
        signalements[0] ? "Gutenberg" : null,
        signalements[1] ? "Chappe" : null,
        signalements[2] ? "Marconi" : null,
      ].filter(Boolean).join(", ");
      const manquants = [
        !signalements[0] ? "Gutenberg" : null,
        !signalements[1] ? "Chappe" : null,
        !signalements[2] ? "Marconi" : null,
      ].filter(Boolean).join(", ");
      return [
        "Jorge se lève à ton approche, s'accroche aux barreaux.",
        `« Tu en as vu ${nbSignale} sur 3 : ${noms}. Déjà beaucoup. »`,
        `« Il te reste ${3 - nbSignale} fiche${3 - nbSignale > 1 ? "s" : ""} à repérer : ${manquants}. Tu peux encore y retourner. »`,
        "« Ou tu continues maintenant. À toi de voir. Dans tous les cas, je te confie ceci. »",
        "Il te glisse à travers les barreaux une petite plaque métallique gravée d'un K.",
        "« L'ascenseur a une touche cachée. Elle s'appelle K. Vas-y quand tu seras prêt·e. »",
      ];
    }
    return [
      "Jorge te regarde — pour la première fois sans bougonnerie.",
      "« Trois sur trois. Gutenberg, Chappe, Marconi. Tu les as toutes vues. »",
      "« Alors tu sais déjà la moitié de l'histoire. Je ne mélangeais pas les dates par distraction. J'essayais de garder la trace de ce qu'ils effaçaient — en signalant les fiches pour qu'un œil comme le tien les voie. »",
      "« Ils ont réécrit les sources. Qui a inventé l'imprimerie. Qui a tendu le premier télégraphe. Qui a parlé le premier à travers l'océan. Il reste assez d'original quelque part pour reconstituer. »",
      "Il te glisse à travers les barreaux une petite plaque métallique gravée d'un K.",
      "« L'ascenseur a une touche cachée. Elle s'appelle K. Elle ouvre une salle que personne n'a vue depuis quarante ans. »",
      "« Vas-y. Et finis ce que je n'ai pas pu finir. »",
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
                  active={!visited}
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
            {!visited && " Approche-toi des barreaux pour lui parler."}
          </p>
        </div>
      </div>

      <button onClick={() => onGo(j3.hubRoom || "hubBas")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Retour au couloir
      </button>

      {dialogOpen && (
        <BigDialogue
          topic={`CELLULE C-02 · JORGE · ${nbSignale} / 3 SIGNALEMENT${nbSignale > 1 ? "S" : ""}`}
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
