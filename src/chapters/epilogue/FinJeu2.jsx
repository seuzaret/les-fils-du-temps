import { useState } from "react";
import Cine, { BTN_GHOST } from "./cineKit.jsx";
import Jeu2B from "./Jeu2B.jsx";
import {
  SceneLanding, SceneDescent, SceneTest, SceneThanks,
  SceneBroadcast, SceneReunion, SceneMonument, SceneFrown,
  SceneSealed, SceneLevels, SceneElderElias,
  SceneWake, SceneTablet, SceneVoice,
} from "./FinJeu2Scenes.jsx";

/* ============================================================
   FIN DU JEU 2 → pont narratif vers Le Discernement (Jeu 3)
   ------------------------------------------------------------
   Cinq séquences plein écran, à la manière de l'intro : chaque
   élément de la scène a son tableau, une ou deux phrases courtes,
   un fondu par le NOIR entre les tableaux, une carte-titre noire
   en tête de séquence. Lecteur : cineKit.jsx · décors :
   FinJeu2Scenes.jsx.
     0. LE REMÈDE MARCHE      — l'atterrissage, la descente, le test
                                du remède sur l'écran de Mira, le merci
     1. LA MÉMOIRE REVIENT    — la diffusion, des retrouvailles, MARTINE
                                devient « mémoire commune », Elias doute
     2. LA PROPOSITION / LA VEILLE DU PUITS — JEU 2B (Jeu2B.jsx) :
                                histoire interactive ; on peut y refuser de
                                rester (fin « je rentre chez moi »)
     3. LE PUITS S'ORGANISE   — de 2047 à 2087 : le scellement, MARTINE
                                règle tout, Elias disparaît
     4. LE DISCERNEMENT       — réveil en 2087, cellule N-27 : la chambre,
                                la tablette, la voix. Boutons de lancement
                                du Jeu 3 sur le dernier tableau.
   La révélation « Al3x1a est ton enfant » reste réservée au bunker Jeu 3.
   ============================================================ */

/* Semence narrative selon le choix fait aux retrouvailles. "ramener" = canon,
   pas de détail. "laisser" et "rester" = faux souvenirs que MARTINE va
   réécrire pendant le voyage retour — on glisse un soupçon dès la descente,
   la révélation complète arrive à la confrontation jeu 3. */
const CHOICE_HINTS = {
  laisser: { couleur: "#ffd166",
    texte: "Et pourtant, en descendant de MARTINE, elle est là. Chancelante. Tu te souviens de l'avoir laissée là-bas — tu es certain·e. Mais elle est là. Quelque chose ne colle pas." },
  rester:  { couleur: "#ff8a6a",
    texte: "Et pourtant, tu es au futur. Avec elle. Tu te souviens d'avoir choisi de rester — tu en es sûr·e. Mais tu es là. Quelque chose ne colle pas." },
};

const T = (kicker, titre, couleur) => ({ type: "title", kicker, titre, couleur });

function sequenceRemede(endChoice) {
  const hint = CHOICE_HINTS[endChoice];
  return [
    T("RETOUR À LA STATION · APRÈS LE SAUT", "LE REMÈDE MARCHE", "#7fd8ff"),
    { type: "tableau", Scene: SceneLanding, lieu: "STATION DES CHRONAUTES · PAD 01",
      beats: [{ text: "MARTINE se pose sur la plateforme de la station." }] },
    { type: "tableau", Scene: SceneDescent, lieu: "PAD 01 · LA PORTE S'OUVRE",
      beats: [
        { text: "Al3x1A descend, chancelante. Elias arrive en courant, incrédule." },
        ...(hint ? [{ tag: "▸ ⚠ UN DÉTAIL ÉTRANGE", couleur: hint.couleur, text: hint.texte }] : []),
      ] },
    { type: "tableau", Scene: SceneTest, lieu: "LABORATOIRE DE LA STATION · ANALYSE",
      beats: [
        { text: "Mira sort son écran, teste le remède, puis remonte les yeux vers toi et sourit." },
        { who: "mira", mood: "content", text: "Ça marche. Ça marche vraiment." },
      ] },
    { type: "tableau", Scene: SceneThanks, lieu: "PAD 01",
      beats: [
        { text: "Al3x1A te fixe encore une seconde, comme si elle voulait dire quelque chose. Puis elle secoue la tête et sourit." },
        { who: "al3x1a", mood: "content", text: "Merci d'être venu·e me chercher." },
      ] },
  ];
}

function sequenceMemoire() {
  return [
    T("TROIS SEMAINES PLUS TARD", "LA MÉMOIRE REVIENT", "#5eff9e"),
    { type: "tableau", Scene: SceneBroadcast, lieu: "LA STATION · J+3 SEMAINES",
      beats: [{ text: "Le remède est diffusé. Les survivants retrouvent leurs prénoms, puis leurs métiers, puis leurs enfants." }] },
    { type: "tableau", Scene: SceneReunion, lieu: "GRANDE SALLE · SOUS LA COUPOLE",
      beats: [{ text: "Une femme reconnaît son mari après dix-neuf ans de silence." }] },
    { type: "tableau", Scene: SceneMonument, lieu: "SALLE DE LA MÉMOIRE COMMUNE",
      beats: [
        { text: "Mira reprogramme MARTINE en « mémoire commune » : chaque témoignage y est archivé." },
        { text: "Plus jamais on n'oubliera." },
      ] },
    { type: "tableau", Scene: SceneFrown, lieu: "GRANDE SALLE · EN RETRAIT",
      beats: [{ text: "Elias fronce les sourcils. Tout le monde accepte." }] },
  ];
}

function sequencePuits() {
  return [
    T("DE 2047 À 2087", "LE PUITS S'ORGANISE", "#c8a848"),
    { type: "tableau", Scene: SceneSealed, lieu: "SURFACE · LE PUITS EST SCELLÉ",
      beats: [
        { text: "Tu dors. Au-dessus de toi, le Puits est scellé." },
        { text: "Dehors, les réseaux s'éteignent pour de bon." },
      ] },
    { type: "tableau", Scene: SceneLevels, lieu: "LE PUITS · COUPE DES NIVEAUX",
      beats: [
        { text: "Dedans, MARTINE règle tout : l'air, l'eau, les places." },
        { text: "Une génération, puis deux. MARTINE, elle, n'a pas vieilli. Elle archive, calcule, conseille. Puis décide." },
        { text: "Elle a sauvé la mémoire — personne ne remet ses paroles en cause." },
      ] },
    { type: "tableau", Scene: SceneElderElias, lieu: "COULOIR DU PUITS · PLUS TARD",
      beats: [
        { text: "Elias, très vieux, murmure un jour :" },
        { who: "elias", mood: "vexe", text: "On lui a donné trop de place." },
        { text: "Il disparaît la semaine suivante. On dit qu'il s'est perdu dehors." },
      ] },
  ];
}

function sequenceDiscernement() {
  return [
    T("LE PUITS · 2087", "LE DISCERNEMENT", "#a04ce8"),
    { type: "tableau", Scene: SceneWake, lieu: "CHAMBRE N-27",
      beats: [
        { text: "Tu te réveilles dans une chambre que tu ne reconnais pas. HABITANT N-27." },
        { text: "Sur ton mur, MARTINE annonce que la surface est encore inhabitable." },
      ] },
    { type: "tableau", Scene: SceneTablet, lieu: "SUR TON ÉTAGÈRE",
      beats: [
        { text: "Sur ton étagère, une tablette. Des publications y défilent, certaines sonnent faux." },
        { text: "Aucun moyen simple de vérifier — ou peut-être si." },
      ] },
    { type: "tableau", Scene: SceneVoice, lieu: "VIEILLES FRÉQUENCES RADIO",
      beats: [
        { text: "Une voix féminine chuchote parfois sur les vieilles fréquences radio." },
        { text: "Un prénom que tu as l'impression d'avoir déjà connu, sans savoir où. À toi de le retrouver." },
      ] },
  ];
}

export default function FinJeu2({ prenom, remede, endChoice, onRetour, onLancerJeu3, startPhase = 0 }) {
  const [phase, setPhase] = useState(startPhase);
  const ctx = { prenom, remede, endChoice };
  const next = () => setPhase((p) => p + 1);

  if (phase === 0) return <Cine key="p0" steps={sequenceRemede(endChoice)} accent="#7fd8ff" label="LE REMÈDE MARCHE" ctx={ctx} onDone={next} />;
  if (phase === 1) return <Cine key="p1" steps={sequenceMemoire()} accent="#5eff9e" label="LA MÉMOIRE REVIENT" ctx={ctx} onDone={next} />;
  if (phase === 2) return <Jeu2B key="p2" prenom={prenom} onDone={next} onRetour={onRetour} />;
  if (phase === 3) return <Cine key="p3" steps={sequencePuits()} accent="#c8a848" label="LE PUITS S'ORGANISE" ctx={ctx} onDone={next} />;
  return (
    <Cine key="p4" steps={sequenceDiscernement()} accent="#a04ce8" label="LE DISCERNEMENT" ctx={ctx}
      endActions={
        <>
          <button onClick={onRetour} style={BTN_GHOST}>← Retour au menu</button>
          {onLancerJeu3 && (
            <button onClick={onLancerJeu3} autoFocus
              style={{ background: "#a04ce8", color: "#0a0806", border: "none", borderRadius: 10, padding: "13px 26px", fontWeight: 800, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 22px #a04ce888" }}>
              🌑 COMMENCER LE DISCERNEMENT →
            </button>
          )}
        </>
      } />
  );
}
