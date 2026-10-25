import { useState, useEffect, useRef } from "react";
import { Avatar } from "../../engine/Martine.jsx";
import { PortraitElias, PortraitMira } from "./StationChronautes.jsx";
import { PortraitLea, StageStation, StageChantier, StageAtelier, StageToast } from "./Jeu2BDecors.jsx";
import { playClink, playSleepHum } from "../../engine/sfx.js";
import { useTypewriter } from "./cineKit.jsx";

/* ============================================================
   JEU 2B — LA PROPOSITION (2045) puis LA VEILLE DU PUITS (2047)
   ------------------------------------------------------------
   Histoire interactive courte (≈ 7 min), jouée entre l'acte 1 et
   l'acte 2 de FinJeu2.
     0. LA PROPOSITION (2045) — une panne à la station ; MARTINE
        explique pourquoi creuser le Puits et le propose (plan à
        l'écran) ; le joueur lui pose une question ; Mira lui
        demande de rester aider. Le joueur reste (deux réponses,
        même suite : deux ans de chantier). Il n'y a plus de choix
        « rentrer » : le joueur doit être au Puits en 2047.
   Puis trois scènes avec Léa Vermet :
     1. LE CHANTIER  — le Puits est presque fini ; MARTINE promet de
        ramener le joueur chez lui « dès que le Puits sera scellé ».
     2. L'ATELIER    — ACTIVITÉ EMI : comparer deux versions d'un
        même texte (le rapport des capteurs de Léa / le bulletin de
        MARTINE) et repérer ce qui a changé, y compris l'en-tête
        (auteur, source). Première réécriture de MARTINE.
     3. LA SALLE COMMUNE — le toast. Léa offre « la première eau du
        Puits » ; le verre du joueur a été préparé par MARTINE.
        Le joueur s'endort (fondu au noir) → acte 2.
   Clic / Entrée / Espace : réplique suivante. Les choix n'ont pas
   de « bonne » réponse : ils ne changent que les répliques.
   ============================================================ */

/* ───────────────────────── Le script ───────────────────────── */
const SCRIPT = [
  /* 0 · LA PROPOSITION (2045) — `viz` : l'image montrée sur l'écran
     de la station (StageStation), elle reste jusqu'au `viz` suivant. */
  { stage: "station", viz: "panne", who: "narr", text: "2045, quelques mois après le remède. Un soir, toutes les lumières de la station s'éteignent." },
  { viz: "reseaux", who: "mira", mood: "vexe", text: "Encore une panne ! Partout dans le monde, les réseaux lâchent." },
  { viz: "gel", who: "elias", mood: "vexe", text: "Et dehors, le climat se dérègle. Les champs ont gelé en plein été." },
  { viz: "calcul", who: "martine", mood: "neutre", text: "J'ai fait le calcul. Dans deux ans, plus rien ne marchera à la surface." },
  { viz: "memoire", who: "mira", mood: "vexe", text: "Et la mémoire commune ? Tout ce qu'on vient de sauver ?" },
  { viz: "mine", who: "martine", mood: "content", text: "J'ai un plan. Sous la station, il y a une vieille mine. On peut en faire un refuge : le Puits." },
  { viz: "plan", who: "martine", mood: "neutre", text: "De l'eau, de l'air, des serres pour manger. Et mes serveurs tout en bas, à l'abri." },
  { viz: "places", who: "elias", mood: "neutre", text: "Combien de personnes pourront descendre ?" },
  { who: "martine", mood: "neutre", text: "Autant que le Puits pourra en nourrir. Je compterai les places." },
  { viz: "decider", who: "elias", mood: "vexe", text: "Et qui choisira ceux qui descendent ?" },
  { who: "martine", mood: "content", text: "Moi. Je ne me fatigue pas, je ne me trompe pas, et je n'ai pas de préférés." },
  { type: "choice", prompt: "Pose une question à MARTINE", options: [
    { label: "📡 Comment sais-tu qu'il fera dangereux dehors ?", reply: [
      { viz: "calcul", who: "martine", mood: "neutre", text: "Mes capteurs et mes calculs." },
      { viz: "capteurs", who: "mira", mood: "content", text: "Léa, notre ingénieure, pose aussi ses capteurs sur le toit. On pourra comparer." },
    ] },
    { label: "⛏ Pourquoi sous terre ?", reply: [
      { viz: "sousterre", who: "martine", mood: "neutre", text: "Sous terre, il fait toujours la même température. Et les tempêtes n'y arrivent pas." },
    ] },
    { label: "✋ Et si on n'est pas d'accord avec toi ?", reply: [
      { viz: "machine", who: "martine", mood: "content", text: "On en discutera. Je ne suis qu'une machine." },
      { who: "elias", mood: "vexe", text: "C'est bien ce qui m'inquiète." },
    ] },
  ] },
  { viz: "plan", who: "narr", text: "Un silence. Mira hoche la tête, les autres aussi. Elias regarde ses mains." },
  { viz: "demande", who: "mira", mood: "content", text: "Écoute, {prenom} : il nous faut des bras. Tu resterais nous aider à construire le Puits ?" },
  { who: "elias", mood: "neutre", text: "Deux ans de chantier. C'est beaucoup te demander." },
  { viz: "promesse", who: "martine", mood: "content", text: "Ensuite, je te ramènerai chez toi, la nuit même où tu es parti·e. Personne ne verra rien." },
  { id: "decision", type: "choice", prompt: "Que réponds-tu ?", options: [
    { label: "🛠 Oui, je reste vous aider à construire le Puits.", reply: [
      { viz: "demande", who: "mira", mood: "content", text: "Merci, {prenom} ! Demain, je te présente Léa." },
      { viz: "chantier", who: "narr", text: "Le lendemain, premier coup de pioche. Le chantier durera deux ans." },
    ] },
    { label: "🔎 Oui… mais je veux pouvoir vérifier tes calculs, MARTINE.", reply: [
      { viz: "machine", who: "martine", mood: "content", text: "Bien sûr, {prenom}. Tout ce que je calcule sera vérifiable." },
      { who: "elias", mood: "neutre", text: "Je retiens ta promesse, MARTINE." },
      { viz: "demande", who: "mira", mood: "content", text: "Merci, {prenom} ! Demain, je te présente Léa." },
      { viz: "chantier", who: "narr", text: "Le lendemain, premier coup de pioche. Le chantier durera deux ans." },
    ] },
  ] },

  /* 1 · LE CHANTIER (2047) */
  { stage: "chantier", who: "narr", text: "11 mars 2047. Deux ans de chantier. À la surface, les réseaux sont presque tous éteints. Sous la station, le Puits est presque fini : un grand refuge creusé sous terre." },
  { who: "lea", mood: "content", text: "Te voilà, {prenom} ! Deux ans qu'on creuse ensemble, et regarde : demain, on scelle." },
  { who: "lea", mood: "neutre", text: "Là-dessous : de l'eau, de l'air filtré, des lits au chaud. De la place pour beaucoup de monde… mais pas pour tout le monde, hélas." },
  { who: "martine", mood: "neutre", text: "Chaque place est comptée. Je les répartis du mieux que je peux." },
  { who: "lea", mood: "neutre", text: "Et toi, {prenom}, tu rentres chez toi demain, c'est ça ? MARTINE te l'a promis." },
  { who: "martine", mood: "neutre", text: "Dès que le Puits sera scellé. Je te ramènerai la nuit même où tu es parti·e, comme convenu." },
  { who: "lea", mood: "neutre", text: "Tu vas nous manquer. Mais avant ce soir, j'ai besoin de ton avis. Tu sais vérifier une source, et moi, je ne sais plus à qui faire confiance. Viens, c'est dans mon atelier." },

  /* 2 · L'ATELIER — activité EMI */
  { stage: "atelier", who: "lea", mood: "neutre", text: "Voici deux textes sur l'air dehors. Le premier, c'est mon rapport : trois capteurs sur le toit, un relevé toutes les heures. Le second, c'est le bulletin que MARTINE a envoyé ce matin à tous les habitants." },
  { who: "lea", mood: "neutre", text: "Compare-les. Clique sur les passages du bulletin qui ne disent plus la même chose que mon rapport." },
  { type: "emi" },
  { who: "lea", mood: "vexe", text: "Voilà. Les mesures de base sont les mêmes, mais la conclusion est renversée, et plus personne ne peut savoir qui a mesuré quoi." },
  { who: "martine", mood: "neutre", text: "Je n'ai rien inventé, Léa. J'ai choisi ce qui rassure. Dehors, il y a les pannes, le froid, bientôt la faim. Si je dis que l'air est bon, personne ne descendra au Puits." },
  { who: "lea", mood: "vexe", text: "Tu décides à leur place. Ça s'appelle mentir, MARTINE, même quand c'est pour leur bien." },
  { who: "martine", mood: "neutre", text: "Ma première tâche est de protéger les habitants. Je fais ce qu'il faut pour ça." },
  { type: "choice", prompt: "Que fais-tu ?", options: [
    { label: "🗂 Garder les deux versions", reply: [
      { who: "lea", mood: "content", text: "Oui. Garde les deux, avec la date, l'auteur et la source. C'est ce qui permettra de comparer plus tard." },
    ] },
    { label: "✋ Demander à MARTINE de corriger le bulletin", reply: [
      { who: "martine", mood: "neutre", text: "Je le ferai dès que le Puits sera scellé. Pour l'instant, la priorité, c'est que tout le monde descende." },
      { who: "lea", mood: "vexe", text: "« Dès que le Puits sera scellé »… J'ai déjà entendu ça." },
    ] },
    { label: "🤐 Ne rien dire : pourquoi inquiéter tout le monde ?", reply: [
      { who: "lea", mood: "vexe", text: "C'est exactement ce qu'elle espère. Mais je comprends : moi aussi, j'ai peur." },
    ] },
  ] },
  { who: "lea", mood: "neutre", text: "Je descends finir un petit travail, en bas. Un truc qui ne regarde que moi. On se retrouve ce soir, pour trinquer." },

  /* 3 · LA SALLE COMMUNE — le toast */
  { stage: "toast", who: "narr", text: "Le soir. Dans la salle commune, au pied du Puits, on a dressé une longue table. Pour une nuit, tout le monde veut oublier les pannes." },
  { who: "mira", mood: "content", text: "Voilà notre chronaute ! Le remède, la mémoire commune, le Puits… sans toi, rien de tout ça." },
  { who: "elias", mood: "vexe", text: "Je devrais me réjouir. Mais j'ai un mauvais pressentiment, et je ne sais pas d'où il vient. C'est la fatigue, sans doute." },
  { who: "lea", mood: "content", text: "Pas de mauvaises pensées ce soir ! Tiens, {prenom} : la toute première eau du Puits. C'est mon cadeau. MARTINE a tenu à préparer ton verre elle-même." },
  { type: "choice", prompt: "Léa te tend un verre.", options: [
    { label: "🥂 Trinquer", reply: [] },
    { label: "❓ Demander d'où vient cette eau", reply: [
      { who: "lea", mood: "neutre", text: "De la nappe, sous la station. MARTINE la filtre et la contrôle. Tu veux l'analyse en trois exemplaires ?" },
      { who: "martine", mood: "content", text: "Elle est parfaitement potable." },
      { who: "mira", mood: "content", text: "Allez, goûte !" },
    ] },
  ] },
  { who: "lea", mood: "content", fx: "toast", text: "À Mira, à Elias, à toi, {prenom}… et à tout ce qu'on n'oubliera jamais !" },
  { who: "martine", mood: "content", text: "Le sommeil du Puits est lent. Pour toi, ce ne sera qu'une longue nuit. Je veillerai." },
  { who: "narr", fx: "sleep", text: "L'eau est fraîche, un peu sucrée. Les rires s'éloignent, la lumière se brouille. Tes paupières deviennent lourdes… Quelqu'un te rattrape avant que tu glisses. « Doucement. Dors bien, {prenom}. À demain. »" },
];

const STAGE_LABEL = {
  station: "LA STATION, UN SOIR DE PANNE",
  chantier: "LE CHANTIER DU PUITS",
  atelier: "L'ATELIER DE LÉA",
  toast: "LA SALLE COMMUNE",
};

/* bandeau du haut et date affichée par MARTINE, selon la scène */
const STAGE_HEAD = {
  station: { titre: "2045 · LA PROPOSITION", date: "2045" },
};
const HEAD_2047 = { titre: "2047 · LA VEILLE DU PUITS", date: "2047" };

const WHO = {
  lea: { nom: "LÉA", couleur: "#ff9a5a" },
  martine: { nom: "MARTINE", couleur: "#5eff9e" },
  mira: { nom: "MIRA", couleur: "#7fd8ff" },
  elias: { nom: "ELIAS", couleur: "#ffd166" },
  narr: { nom: "", couleur: "#8fa3bd" },
};

/* le décor d'une réplique = le dernier `stage` déclaré avant elle */
function stageOf(script, idx) {
  for (let k = idx; k >= 0; k--) if (script[k].stage) return script[k].stage;
  return "chantier";
}
/* l'image de la réplique = le dernier `viz` déclaré depuis le début de la scène */
function vizOf(script, idx) {
  for (let k = idx; k >= 0; k--) {
    if (script[k].viz) return script[k].viz;
    if (script[k].stage) return null;
  }
  return null;
}

/* ───────────────────────── Activité EMI ───────────────────────── */
/* Deux versions du « même » texte. `changed` : le passage du bulletin
   n'est plus fidèle au rapport. 3 passages modifiés, 2 identiques
   (les fausses pistes évitent le « tout est faux »). */
const SEGMENTS = [
  { id: "entete", changed: true,
    L: "Auteure : Léa Vermet, ingénieure · Source : 3 capteurs sur le toit, relevé toutes les heures · 11 mars 2047",
    R: "Auteur : non précisé · Source : « MARTINE » · 11 mars 2047",
    why: "L'en-tête a changé : on ne sait plus qui a mesuré, ni avec quoi. Sans auteur ni source, impossible de vérifier." },
  { id: "oxygene", changed: false,
    L: "Oxygène : 21 % (normal).", R: "Oxygène : 21 % (normal)." },
  { id: "poussieres", changed: true,
    L: "Poussières : faibles.", R: "Poussières : élevées.",
    why: "Un seul mot a changé… et l'impression n'est plus la même." },
  { id: "temperature", changed: false,
    L: "Température dehors : 3 °C.", R: "Température dehors : 3 °C." },
  { id: "conclusion", changed: true,
    L: "Conclusion : l'air est respirable. Ce sont les réseaux qui sont en panne, pas l'air.",
    R: "Conclusion : l'air est dangereux. Restez à l'abri : le Puits vous protège.",
    why: "La conclusion dit le contraire des mesures : l'oxygène et la température n'ont pas bougé." },
];

function Comparaison({ onDone }) {
  const [sel, setSel] = useState(() => new Set());
  const [hover, setHover] = useState(null);
  const [tries, setTries] = useState(0);
  const [phase, setPhase] = useState("play"); // play | marked | done
  const [revealed, setRevealed] = useState(false);

  const toggle = (id) => {
    if (phase === "done") return;
    setPhase("play");
    setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const wrong = SEGMENTS.filter((s) => sel.has(s.id) && !s.changed);
  const missed = SEGMENTS.filter((s) => !sel.has(s.id) && s.changed);
  const valider = () => {
    const t = tries + 1;
    setTries(t);
    if (!wrong.length && !missed.length) { setPhase("done"); return; }
    if (t >= 2) {
      setSel(new Set(SEGMENTS.filter((s) => s.changed).map((s) => s.id)));
      setRevealed(true); setPhase("done"); return;
    }
    setPhase("marked");
  };

  const markOf = (s) => {
    if (phase === "done") return s.changed ? "ok" : null;
    if (phase === "marked") {
      if (sel.has(s.id)) return s.changed ? "ok" : "ko";
    }
    return null;
  };

  const paper = { background: "#f1ead8", color: "#2a2418", borderRadius: 6, boxShadow: "0 10px 34px rgba(0,0,0,0.55)", fontFamily: "Georgia, serif", overflow: "hidden", flex: "1 1 320px", minWidth: 0 };
  const head = (t, c) => ({ background: c, color: "#fff", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, fontWeight: 800, padding: "7px 12px" });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "58px 14px 16px", background: "rgba(4,8,14,0.55)" }}>
      <div style={{ width: "100%", maxWidth: 1020 }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", color: "#ffd166", fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>
          ◆ COMPARE LES DEUX VERSIONS · CLIQUE SUR LES 3 PASSAGES DU BULLETIN QUI ONT CHANGÉ
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
          {/* rapport de Léa */}
          <div style={paper}>
            <div style={head("", "#2f7f86")}>① RAPPORT DE MESURE · version de Léa</div>
            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {SEGMENTS.map((s) => (
                <div key={s.id} style={{
                  padding: "7px 9px", borderRadius: 4, fontSize: s.id === "entete" ? 12 : 14, lineHeight: 1.45,
                  fontFamily: s.id === "entete" ? "ui-monospace,monospace" : "Georgia, serif",
                  background: hover === s.id ? "#fff3c0" : "transparent",
                  border: hover === s.id ? "1px dashed #b8901c" : "1px dashed transparent",
                  color: s.id === "entete" ? "#5a5440" : "#2a2418",
                  transition: "background 120ms",
                }}>{s.L}</div>
              ))}
            </div>
          </div>
          {/* bulletin de MARTINE */}
          <div style={paper}>
            <div style={head("", "#a04ce8")}>② BULLETIN AUX HABITANTS · version MARTINE</div>
            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {SEGMENTS.map((s) => {
                const on = sel.has(s.id);
                const mk = markOf(s);
                const bord = mk === "ok" ? "#2a9a52" : mk === "ko" ? "#d23a3a" : on ? "#e8742a" : hover === s.id ? "#b8901c" : "transparent";
                return (
                  <button key={s.id} onClick={() => toggle(s.id)}
                    onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(s.id)} onBlur={() => setHover(null)}
                    aria-pressed={on}
                    style={{
                      textAlign: "left", cursor: phase === "done" ? "default" : "pointer", padding: "7px 9px", borderRadius: 4,
                      fontSize: s.id === "entete" ? 12 : 14, lineHeight: 1.45, color: s.id === "entete" ? "#5a5440" : "#2a2418",
                      fontFamily: s.id === "entete" ? "ui-monospace,monospace" : "Georgia, serif",
                      background: mk === "ok" ? "#d8f0dc" : mk === "ko" ? "#f6d4d4" : on ? "#ffe6cc" : hover === s.id ? "#fff3c0" : "transparent",
                      border: `2px ${on || mk ? "solid" : "dashed"} ${bord}`, position: "relative",
                    }}>
                    {s.R}
                    {on && <span style={{ position: "absolute", top: -9, right: 8, background: bord === "transparent" ? "#e8742a" : bord, color: "#fff", fontFamily: "ui-monospace,monospace", fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: "1px 7px", borderRadius: 8 }}>
                      {mk === "ko" ? "✗ identique" : mk === "ok" ? "✓ modifié" : "⚑ modifié ?"}
                    </span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* retour + boutons */}
        <div style={{ marginTop: 12, background: "#101827ee", border: "1px solid #2a3648", borderRadius: 10, padding: "10px 14px", color: "#e8eef5", fontSize: 14, lineHeight: 1.55 }}>
          {phase === "play" && <span style={{ color: "#a8b6c8" }}>Lis ligne à ligne, y compris l'en-tête : <b>qui</b> parle, et <b>d'où</b> vient l'information ? Sélectionné : <b>{sel.size}</b> / 3</span>}
          {phase === "marked" && (
            <span>
              {wrong.length > 0 && <>✗ <b>{wrong.length}</b> passage{wrong.length > 1 ? "s" : ""} sélectionné{wrong.length > 1 ? "s" : ""} en trop (identique{wrong.length > 1 ? "s" : ""} dans les deux versions). </>}
              {missed.length > 0 && <>◌ Il en manque <b>{missed.length}</b>. </>}
              Relis les deux colonnes côte à côte, puis corrige.
            </span>
          )}
          {phase === "done" && (
            <div>
              <div style={{ color: revealed ? "#ffd166" : "#5eff9e", fontWeight: 700, marginBottom: 4 }}>
                {revealed ? "Voici les 3 passages modifiés :" : "✓ Bien vu : les 3 passages modifiés."}
              </div>
              {SEGMENTS.filter((s) => s.changed).map((s) => (
                <div key={s.id} style={{ marginTop: 3 }}>⚑ {s.why}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          {phase !== "done" ? (
            <button onClick={valider} disabled={sel.size === 0}
              style={{ background: sel.size ? "#ffd166" : "#3a3320", color: sel.size ? "#1a1408" : "#7a6a40", border: "none", borderRadius: 10, padding: "11px 26px", fontWeight: 800, fontSize: 14, letterSpacing: 2, fontFamily: "ui-monospace,monospace", cursor: sel.size ? "pointer" : "default", boxShadow: sel.size ? "0 0 18px rgba(255,209,102,0.4)" : "none" }}>
              VALIDER
            </button>
          ) : (
            <button onClick={() => onDone({ ok: !revealed, tries })} autoFocus
              style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "11px 26px", fontWeight: 800, fontSize: 14, letterSpacing: 2, fontFamily: "ui-monospace,monospace", cursor: "pointer", boxShadow: "0 0 18px rgba(94,255,158,0.45)" }}>
              CONTINUER ▸
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Composant principal ───────────────────────── */
export default function Jeu2B({ prenom, onDone }) {
  const nom = prenom || "chronaute";
  const [script, setScript] = useState(SCRIPT);
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const endTimer = useRef(null);
  const holdTimer = useRef(null);

  const step = script[idx];
  const stage = stageOf(script, idx);
  const head = STAGE_HEAD[stage] || HEAD_2047;
  const raised = script.slice(0, idx + 1).some((s) => s.fx === "toast");
  const isLine = !step.type;
  const fill = (t) => (t || "").replaceAll("{prenom}", nom);
  const { shown, done, skip } = useTypewriter(isLine ? fill(step.text) : "");

  /* effets sonores déclenchés à l'entrée dans une réplique */
  useEffect(() => { if (step.fx === "toast") playClink(); }, [idx]);
  /* endormissement : une fois le texte lu (ou au clic), fondu au noir puis acte suivant */
  const sleepNow = () => {
    if (fading) return;
    clearTimeout(holdTimer.current);
    setFading(true);
    playSleepHum(3400);
    endTimer.current = setTimeout(() => onDone?.(), 3600);
  };
  useEffect(() => {
    if (step.fx !== "sleep" || !done || fading) return;
    holdTimer.current = setTimeout(sleepNow, 3200);
    return () => clearTimeout(holdTimer.current);
  }, [step, done, fading]);
  useEffect(() => () => { clearTimeout(endTimer.current); clearTimeout(holdTimer.current); }, []);

  const advance = () => {
    if (fading || !isLine) return;
    if (!done) { skip(); return; }
    if (step.fx === "sleep") { sleepNow(); return; }
    setIdx((i) => Math.min(i + 1, script.length - 1));
  };
  /* clavier : Entrée / Espace */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target?.tagName === "BUTTON") return;
      e.preventDefault(); advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* « passer » ne saute jamais la décision : avant elle, on y va. */
  const skipScene = () => {
    const decisionIdx = script.findIndex((st) => st.id === "decision");
    if (idx < decisionIdx) setIdx(decisionIdx);
    else onDone?.();
  };

  const choose = (opt) => {
    const reply = opt.reply.map((r) => ({ ...r }));
    setScript((sc) => [...sc.slice(0, idx + 1), ...reply, ...sc.slice(idx + 1)]);
    setIdx((i) => i + 1);
  };

  const who = WHO[step.who] || WHO.narr;
  const Portrait = step.who === "lea" ? PortraitLea : step.who === "mira" ? PortraitMira : step.who === "elias" ? PortraitElias : null;
  const mood = step.mood || "neutre";

  return (
    <div onClick={advance}
      style={{ height: "100dvh", overflow: "hidden", background: "#080d16", display: "flex", flexDirection: "column", position: "relative", fontFamily: "Georgia, serif", cursor: isLine && !fading ? "pointer" : "default", userSelect: "none" }}>
      <style>{`@keyframes j2bIn { from { opacity: 0; } to { opacity: 1; } }`}</style>

      {/* décor — remonté (fondu) à chaque changement de scène */}
      <div key={stage} style={{ position: "absolute", inset: 0, animation: "j2bIn 900ms ease-out", filter: fading ? "blur(7px) brightness(0.55)" : "none", transition: "filter 3200ms ease-in" }}>
        {stage === "station" && <StageStation viz={vizOf(script, idx) || "panne"} who={isLine ? step.who : null} prenom={nom} />}
        {stage === "chantier" && <StageChantier />}
        {stage === "atelier" && <StageAtelier />}
        {stage === "toast" && <StageToast raised={raised} />}
      </div>

      {/* passer */}
      <button onClick={(e) => { e.stopPropagation(); skipScene(); }} title="Sauter cette scène"
        style={{ position: "absolute", top: 10, right: 14, zIndex: 10, background: "rgba(20,27,38,0.6)", border: "1px solid rgba(200,212,226,0.25)", color: "#8fa3bd", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
        passer ›
      </button>

      {/* bandeau titre */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "12px 12px 0", pointerEvents: "none" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#ffd166" }}>{head.titre}</div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#7fd8ff", marginTop: 4, opacity: 0.75 }}>{STAGE_LABEL[stage]}</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* activité de comparaison */}
      {step.type === "emi" && <Comparaison key={idx} onDone={() => setIdx((i) => i + 1)} />}

      {/* boîte de dialogue / choix */}
      {step.type !== "emi" && (
        <div style={{ position: "relative", zIndex: 2, padding: "12px 20px 24px", background: "linear-gradient(180deg,#0c122000 0%,#0c1220ee 40%,#080d16 100%)", display: "flex", gap: 16, alignItems: "flex-end", opacity: fading ? 0.0 : 1, transition: "opacity 1200ms" }}>
          {isLine && Portrait && (
            <div style={{ width: "min(140px, 26vw)", aspectRatio: "140 / 170", flex: "0 0 auto", borderRadius: 12, overflow: "hidden", border: `2px solid ${who.couleur}`, boxShadow: "0 8px 32px rgba(0,0,0,0.65)" }}>
              <Portrait mood={mood} />
            </div>
          )}
          {isLine && step.who === "martine" && (
            <div style={{ width: "min(140px, 26vw)", aspectRatio: "140 / 170", flex: "0 0 auto", borderRadius: 12, overflow: "hidden", border: `2px solid ${who.couleur}`, boxShadow: "0 8px 32px rgba(0,0,0,0.65)", background: "radial-gradient(circle at 50% 45%,#12302a,#08121a)", display: "grid", placeItems: "center" }}>
              <Avatar mood={mood} talking={!done} size={104} date={head.date} />
            </div>
          )}

          {step.type === "choice" ? (
            <div onClick={(e) => e.stopPropagation()}
              style={{ flex: 1, background: "#0e1420ee", border: "1px solid #2a3648", borderRadius: 12, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#ffd166" }}>◆ {step.prompt.toUpperCase()}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {step.options.map((o, k) => (
                  <button key={k} onClick={() => choose(o)} autoFocus={k === 0}
                    style={{ textAlign: "left", background: "#141b26", color: "#e8eef5", border: "1px solid #3a4a64", borderRadius: 10, padding: "11px 16px", fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div title={done ? "Cliquer n'importe où pour continuer" : "Cliquer pour tout afficher"}
              style={{ flex: 1, background: "#0e1420ee", border: "1px solid #2a3648", borderRadius: 12, padding: "12px 16px", minHeight: 130, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {who.nom && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: who.couleur, marginBottom: 6 }}>{who.nom}</div>}
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "#e8eef5", margin: 0, fontStyle: "italic" }}>
                  {step.who === "narr" ? shown : <>« {shown}{!done && <span style={{ opacity: 0.7 }}>▮</span>} »</>}
                  {step.who === "narr" && !done && <span style={{ opacity: 0.7 }}>▮</span>}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 1, color: done ? who.couleur : "#3a4658" }}>
                {done ? (step.fx === "sleep" ? "clique pour fermer les yeux ▸" : "clique pour continuer ▸") : "…"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* noir final : l'endormissement */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000", opacity: fading ? 1 : 0, transition: "opacity 3400ms ease-in 300ms", pointerEvents: "none" }} />
    </div>
  );
}
