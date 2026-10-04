import { useState, useEffect } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Fais la Une » (v5)
   ------------------------------------------------------------
   0 : Robert le kiosquier, tout affolé, demande de l'aide pour
       sa fille Julie qui débute comme stagiaire dans un journal.
   1 : Julie au téléphone, portrait à la couleur du journal,
       explique en 2 phrases le public visé.
   2 : dépêche AFP + petite explication.
   3 : choix du titre (4 angles).
   4 : choix du ton du chapô (3 registres).
   5 : impression animée + verdict.
   ============================================================ */

const JOURNAUX = [
  {
    id: "reporter",
    nom: "Le Petit Reporter",
    couleur: "#e0a848",
    cible: "des collégiens et lycéens",
    juliePhrase: "Ici on écrit pour des jeunes de ton âge. Il faut que le titre donne envie, sans faire scolaire.",
    prefer: { titre: ["accroche"], ton: ["emotion"] },
  },
  {
    id: "grand",
    nom: "Le Grand Quotidien",
    couleur: "#4a6a90",
    cible: "des adultes pressés",
    juliePhrase: "Nos lecteurs veulent l'info, vite et bien. Pas de grands mots, pas de cris.",
    prefer: { titre: ["pose", "calme"], ton: ["factuel"] },
  },
  {
    id: "star",
    nom: "Star Magazine",
    couleur: "#c04a70",
    cible: "des fans de scoops et de vedettes",
    juliePhrase: "Ici il faut du choc, de l'émotion, du croustillant. Nos lecteurs veulent frissonner.",
    prefer: { titre: ["sensation"], ton: ["inquiet", "emotion"] },
  },
];

const DEPECHES = [
  {
    id: "game",
    date: "TOKYO, 10h00",
    fait: "Nintendo a présenté aujourd'hui une nouvelle console qui tient dans la main : la Game Boy. Elle sera vendue à partir de l'été prochain.",
    titres: [
      { angle: "calme",     t: "Nintendo lance une console qui tient dans la main" },
      { angle: "accroche",  t: "La Game Boy débarque : jouer partout, tout le temps" },
      { angle: "sensation", t: "LA CONSOLE QUI TIENT DANS TA POCHE ARRIVE !!" },
      { angle: "pose",      t: "Une console de poche annoncée par Nintendo" },
    ],
    chapo: {
      factuel: "Nintendo a présenté aujourd'hui une console portable, la Game Boy. Elle sera en vente à partir de l'été.",
      emotion: "« Je vais pouvoir jouer dans le bus ! » se réjouit Théo, 12 ans. La nouvelle Nintendo tient dans une main.",
      inquiet: "Encore un écran de plus dans la vie des enfants. Beaucoup de parents s'inquiètent déjà.",
    },
  },
  {
    id: "star",
    date: "LONDRES, 15h30",
    fait: "La chanteuse Madonna a annoncé une tournée mondiale cet été. Elle passera par Paris début juillet.",
    titres: [
      { angle: "calme",     t: "Madonna en concert à Paris cet été" },
      { angle: "accroche",  t: "Madonna choisit Paris pour sa nouvelle tournée" },
      { angle: "sensation", t: "MADONNA À PARIS : LA FOLIE VA COMMENCER !!" },
      { angle: "pose",      t: "Une date parisienne pour la tournée Madonna" },
    ],
    chapo: {
      factuel: "La chanteuse Madonna a annoncé aujourd'hui une tournée. Elle sera à Paris en juillet.",
      emotion: "Léa, 13 ans, a mis un an d'économies dans une place. « Je l'attends depuis toujours. »",
      inquiet: "La ruée sur les places pourrait tourner au chaos. La police se prépare déjà.",
    },
  },
  {
    id: "foot",
    date: "PARIS, 22h45",
    fait: "Le PSG a remporté la Coupe de France ce soir aux tirs au but face à Marseille. C'est son premier titre.",
    titres: [
      { angle: "calme",     t: "Le PSG remporte la Coupe de France aux tirs au but" },
      { angle: "accroche",  t: "Coupe de France : Paris arrache la victoire au bout du suspense" },
      { angle: "sensation", t: "MIRACLE : LE PSG SOULÈVE LA COUPE !!" },
      { angle: "pose",      t: "PSG-OM : Paris s'impose dans un match serré" },
    ],
    chapo: {
      factuel: "Le PSG a battu Marseille aux tirs au but ce soir et remporte sa première Coupe de France.",
      emotion: "Dans les tribunes, les supporters pleurent de joie. Karim, 14 ans, y était : « J'oublierai jamais. »",
      inquiet: "Après le match, des incidents ont éclaté autour du stade. La soirée reste tendue.",
    },
  },
  {
    id: "chien",
    date: "NANTES, 8h15",
    fait: "Milou, un chien perdu à Marseille il y a trois semaines, a été retrouvé hier soir à Nantes. Il avait parcouru près de 900 km.",
    titres: [
      { angle: "calme",     t: "Un chien perdu retrouvé à 900 km de chez lui" },
      { angle: "accroche",  t: "L'incroyable voyage du chien qui a traversé la France" },
      { angle: "sensation", t: "MIRACLE : LE CHIEN RETROUVE SA FAMILLE APRÈS 900 KM !!" },
      { angle: "pose",      t: "Un chien parcourt 900 km avant de retrouver ses maîtres" },
    ],
    chapo: {
      factuel: "Milou, un labrador perdu à Marseille il y a trois semaines, a été retrouvé hier à Nantes. Il est en bonne santé.",
      emotion: "« On avait perdu espoir », raconte sa maîtresse en pleurant. Milou a fait 900 km pour la retrouver.",
      inquiet: "Comment un chien peut-il survivre à un tel voyage ? Les vétérinaires n'en reviennent pas.",
    },
  },
  {
    id: "dino",
    date: "DIJON, 11h00",
    fait: "Des paléontologues ont découvert dans le Doubs un squelette de dinosaure presque complet, vieux de 150 millions d'années.",
    titres: [
      { angle: "calme",     t: "Un dinosaure presque complet découvert dans le Doubs" },
      { angle: "accroche",  t: "Il dormait sous nos pieds : le dinosaure du Doubs !" },
      { angle: "sensation", t: "UN MONSTRE DES TEMPS ANCIENS TROUVÉ EN FRANCE !!" },
      { angle: "pose",      t: "Le Doubs livre un squelette de dinosaure exceptionnel" },
    ],
    chapo: {
      factuel: "Des paléontologues ont trouvé un squelette de dinosaure vieux de 150 millions d'années dans le Doubs.",
      emotion: "Camille, 8 ans, a repéré la première dent en promenade. « Papa, c'est un T-Rex ! »",
      inquiet: "On ne s'attendait pas à trouver ça sous nos pieds. Et si d'autres dormaient encore, en attendant d'être découverts ?",
    },
  },
];

const TONS = [
  { angle: "factuel", label: "Direct — juste les faits" },
  { angle: "emotion", label: "Sensible — raconté par les gens" },
  { angle: "inquiet", label: "Inquiet — avec du mystère" },
];

const ANGLE_LABEL = { calme: "calme", accroche: "qui accroche", sensation: "qui frappe fort", pose: "posé" };
const ANGLE_COLOR = { calme: "#3a5a7a", accroche: "#7a5a2a", sensation: "#a03028", pose: "#3a5a3a" };

function verdict(journal, titreAngle, tonAngle) {
  const okTitre = journal.prefer.titre.includes(titreAngle);
  const okTon   = journal.prefer.ton.includes(tonAngle);
  if (okTitre && okTon) {
    return { note: "✓ Parfait pour ce journal", color: "#5eff9e",
      text: `Julie souffle : « Merci, c'est pile ce qu'il fallait pour ${journal.nom}. » Ses lecteurs — ${journal.cible} — vont s'y retrouver.` };
  }
  if (okTitre || okTon) {
    return { note: "≈ Pas mal, mais un peu à côté", color: "#ffd166",
      text: `Julie hésite : « Y'a un des deux choix qui ne colle pas trop… Les lecteurs de ${journal.nom} vont trouver ça bizarre. »` };
  }
  return { note: "✗ Décalé", color: "#ff8a6a",
    text: `Julie fait la grimace : « Ta Une pourrait marcher — mais pas dans ${journal.nom}. Nos lecteurs attendent autre chose. »` };
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ─── Portrait SVG du kiosquier (Robert), un peu affolé ─── */
function PortraitRobert() {
  return (
    <svg viewBox="0 0 120 130" style={{ display: "block", width: 110, height: 120 }}>
      {/* col chemise + tablier bleu de kiosquier */}
      <path d="M20 130 L20 110 Q60 100 100 110 L100 130 Z" fill="#3a5a90" />
      <rect x="30" y="106" width="60" height="4" fill="#8a5a2a" />
      {/* cou */}
      <rect x="52" y="86" width="16" height="14" fill="#e0b898" />
      {/* tête */}
      <ellipse cx="60" cy="66" rx="30" ry="34" fill="#e8c4a0" />
      {/* cheveux gris + calvitie */}
      <path d="M32 56 Q30 36 60 32 Q90 36 88 56 L88 46 Q84 40 60 40 Q36 40 32 46 Z" fill="#a8a098" />
      <path d="M34 54 Q50 50 60 54 Q70 50 86 54" stroke="#8a8078" strokeWidth="0.8" fill="none" />
      {/* moustache grisonnante */}
      <path d="M46 78 Q60 82 74 78 L74 82 Q60 86 46 82 Z" fill="#8a8078" />
      {/* yeux + sourcils froncés (affolé) */}
      <path d="M42 62 L54 60" stroke="#3a2a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M66 60 L78 62" stroke="#3a2a1a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="68" r="2" fill="#1a1a1a" />
      <circle cx="72" cy="68" r="2" fill="#1a1a1a" />
      {/* petite goutte de sueur qui perle */}
      <path d="M92 50 Q95 56 92 60 Q89 56 92 50 Z" fill="#7fd8ff" opacity="0.85">
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 4; 0 0" dur="2s" repeatCount="indefinite" />
      </path>
      {/* bouche entrouverte inquiète */}
      <ellipse cx="60" cy="88" rx="5" ry="3" fill="#7a3020" />
      {/* nez */}
      <path d="M60 68 L58 78 L62 78 Z" fill="#d8a888" />
    </svg>
  );
}

/* ─── Portrait SVG de Julie au téléphone, teinte selon journal ─── */
function PortraitJulie({ couleur }) {
  return (
    <svg viewBox="0 0 120 130" style={{ display: "block", width: 110, height: 120 }}>
      {/* col d'un tailleur à la couleur du journal */}
      <path d="M20 130 L20 108 Q60 96 100 108 L100 130 Z" fill={couleur} />
      <path d="M40 108 L60 118 L80 108 L80 130 L40 130 Z" fill="#fff" />
      {/* cou */}
      <rect x="52" y="86" width="16" height="14" fill="#f0d0a8" />
      {/* tête */}
      <ellipse cx="60" cy="64" rx="28" ry="32" fill="#f4d4b0" />
      {/* cheveux mi-longs bruns bouclés (années 80) */}
      <path d="M32 60 Q28 30 60 26 Q92 30 88 60 L88 46 Q80 34 60 34 Q40 34 32 46 Z" fill="#5a3a20" />
      <path d="M28 60 Q22 76 30 90 M30 66 Q26 80 32 92" stroke="#5a3a20" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M92 60 Q98 76 90 90 M90 66 Q94 80 88 92" stroke="#5a3a20" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* frange légère */}
      <path d="M40 44 Q60 40 80 44 Q76 50 60 48 Q44 50 40 44 Z" fill="#4a3018" />
      {/* yeux */}
      <ellipse cx="48" cy="64" rx="3" ry="2.2" fill="#fff" />
      <ellipse cx="72" cy="64" rx="3" ry="2.2" fill="#fff" />
      <circle cx="48" cy="64" r="1.5" fill="#2a1a08" />
      <circle cx="72" cy="64" r="1.5" fill="#2a1a08" />
      {/* sourcils */}
      <path d="M42 58 L54 57" stroke="#3a2408" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M66 57 L78 58" stroke="#3a2408" strokeWidth="1.6" strokeLinecap="round" />
      {/* nez */}
      <path d="M60 66 L58 76 L62 76 Z" fill="#e0b898" />
      {/* bouche souriante nerveuse */}
      <path d="M52 82 Q60 86 68 82" stroke="#a04030" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* petites boucles d'oreille jaunes 80s */}
      <circle cx="30" cy="72" r="2.5" fill="#e0a848" />
      <circle cx="90" cy="72" r="2.5" fill="#e0a848" />
      {/* combiné téléphonique tenu contre l'oreille droite (côté gauche image) */}
      <g transform="translate(24,72) rotate(-20)">
        <rect x="-4" y="-6" width="8" height="26" fill="#2a2a2a" rx="2" />
        <rect x="-6" y="-8" width="12" height="6" fill="#3a3a3a" rx="1" />
        <rect x="-6" y="16" width="12" height="6" fill="#3a3a3a" rx="1" />
      </g>
      {/* cordon spiralé qui pend */}
      <path d="M26 92 Q22 100 26 108 Q30 116 26 124" stroke="#2a2a2a" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function FaireLaUneGame({ onClose, onWin }) {
  const [journal] = useState(() => pick(JOURNAUX));
  const [dep] = useState(() => pick(DEPECHES));
  const [step, setStep] = useState(0); // 0=Robert, 1=Julie, 2=dépêche, 3=titre, 4=ton, 5=impression
  const [titre, setTitre] = useState(null);
  const [ton, setTon] = useState(null);
  const [pressStep, setPressStep] = useState(0);
  const [done, setDone] = useState(false);
  /* Verdict calculé une fois arrivé à l'étape impression. */
  const V = (step === 5 && titre && ton) ? verdict(journal, titre.angle, ton.angle) : null;
  /* Victoire = Parfait OU presque. Un verdict "✗ Décalé" permet
     seulement de ré-essayer, sans accorder la récompense (+5 flux). */
  const isWin = V && (V.color === "#5eff9e" || V.color === "#ffd166");
  useWinOnce(done && isWin, onWin);

  useEffect(() => {
    if (step !== 5) return;
    setPressStep(0);
    const timers = [
      setTimeout(() => setPressStep(1), 260),
      setTimeout(() => setPressStep(2), 720),
      setTimeout(() => setPressStep(3), 1180),
      setTimeout(() => setPressStep(4), 1700),
      setTimeout(() => setDone(true), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  /* Reset pour "Essayer encore" après un verdict raté. */
  const retry = () => {
    setStep(3); setTitre(null); setTon(null);
    setPressStep(0); setDone(false);
  };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg,#faf3e2 0%,#eee1c0 100%)",
          color: "#1c1a10",
          border: "3px solid #8a6a3a",
          borderRadius: 16,
          padding: 26,
          maxWidth: 820,
          width: "100%",
          maxHeight: "94vh",
          overflowY: "auto",
          boxShadow: "0 16px 60px rgba(0,0,0,0.65)",
          fontFamily: "Georgia, serif",
        }}>
        {/* Bandeau style "ÉDITION SPÉCIALE" */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <span style={{ background: "#8a5a2a", color: "#fff", padding: "4px 14px", borderRadius: 20, fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 900, letterSpacing: 2, boxShadow: "0 0 12px rgba(138,90,42,0.4)" }}>
            🗞️ KIOSQUE DE ROBERT
          </span>
          <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#8a5a2a" }}>MATIN · 1980</span>
        </div>
        <h2 style={{ textAlign: "center", margin: "0 0 16px", color: "#3a2214", fontSize: 32, fontWeight: 900, letterSpacing: 1 }}>Fais la Une</h2>

        {/* ═════ 0 : Robert affolé demande de l'aide ═════ */}
        {step === 0 && (
          <>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "linear-gradient(135deg,#fff 0%,#f8e8c8 100%)", border: "3px solid #8a5a2a", borderRadius: 14, padding: 18, boxShadow: "0 4px 16px rgba(138,90,42,0.25)" }}>
              <PortraitRobert />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 2, color: "#8a5a2a", fontWeight: 800, marginBottom: 8 }}>▸ ROBERT · LE KIOSQUIER</div>
                <p style={{ fontSize: 17.5, lineHeight: 1.55, color: "#1c1a10", margin: 0, fontStyle: "italic" }}>
                  « Ouf, tu tombes bien ! Ma fille Julie débute comme stagiaire dans un journal. Elle m'appelle en panique : elle doit boucler sa toute première Une avant midi. Tu veux bien lui donner un coup de main ? »
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={onClose}
                style={{ flex: 1, background: "#c9b48c", color: "#3a2214", border: "2px solid #a89468", borderRadius: 12, padding: "16px", fontWeight: 800, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                Non, désolé
              </button>
              <button onClick={() => setStep(1)}
                style={{ flex: 2, background: "linear-gradient(90deg,#a06030,#8a5a2a)", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontWeight: 900, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 6px 20px rgba(138,90,42,0.45)" }}>
                Oui, j'aide Julie →
              </button>
            </div>
          </>
        )}

        {/* ═════ 1 : Julie au téléphone ═════ */}
        {step === 1 && (
          <>
            <div style={{
              display: "flex", gap: 18, alignItems: "flex-start",
              background: `linear-gradient(135deg, ${journal.couleur}22 0%, #fff 70%)`,
              border: `3px solid ${journal.couleur}`,
              borderRadius: 14, padding: 18,
              boxShadow: `0 4px 20px ${journal.couleur}33`,
            }}>
              <PortraitJulie couleur={journal.couleur} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 2, color: journal.couleur, fontWeight: 800, marginBottom: 4 }}>▸ JULIE · STAGIAIRE À</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: journal.couleur, marginBottom: 10, letterSpacing: 1 }}>{journal.nom.toUpperCase()}</div>
                <p style={{ fontSize: 17, lineHeight: 1.55, color: "#1c1a10", margin: 0, fontStyle: "italic" }}>
                  « Merci ! Bon, on écrit pour <strong>{journal.cible}</strong>. {journal.juliePhrase} Je te lis la dépêche AFP, tu me choisis un titre et un ton, OK ? »
                </p>
              </div>
            </div>
            <button onClick={() => setStep(2)}
              style={{ marginTop: 16, width: "100%", background: "linear-gradient(90deg,#a06030,#8a5a2a)", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontWeight: 900, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 6px 20px rgba(138,90,42,0.45)" }}>
              1/3 · Voir la dépêche AFP →
            </button>
          </>
        )}

        {/* ═════ 2 : dépêche AFP ═════ */}
        {step === 2 && (
          <>
            <div style={{ background: "#fffbe8", border: "1px dashed #a08040", borderRadius: 8, padding: "12px 14px", marginBottom: 12, fontSize: 15, lineHeight: 1.5, color: "#3a2e1e" }}>
              <strong style={{ color: "#8a5a2a" }}>Une dépêche AFP, c'est quoi ?</strong><br />
              L'<strong>Agence France-Presse</strong> envoie la même info, courte et neutre, à tous les journaux. Ensuite, chaque journal en fait ce qu'il veut : titre, ton, place dans le journal.
            </div>
            <div style={{ background: "#fff", border: "1px dashed #8a6a3a", borderRadius: 8, padding: "14px 16px", fontFamily: "ui-monospace, monospace" }}>
              <div style={{ fontSize: 12, letterSpacing: 2, color: "#8a5a2a", marginBottom: 8, borderBottom: "1px solid #c9b48c", paddingBottom: 6 }}>DÉPÊCHE AFP · {dep.date}</div>
              <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0, color: "#1c1a10" }}>{dep.fait}</p>
            </div>
            <button onClick={() => setStep(3)}
              style={{ marginTop: 14, width: "100%", background: "#8a5a2a", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              2/3 · Choisir un titre →
            </button>
          </>
        )}

        {/* ═════ 3 : choix du titre ═════ */}
        {step === 3 && (
          <>
            <div style={{ background: `${journal.couleur}11`, border: `2px solid ${journal.couleur}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: journal.couleur, fontWeight: 800, marginBottom: 2 }}>▸ POUR</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: journal.couleur, letterSpacing: 1 }}>{journal.nom.toUpperCase()}</div>
              <div style={{ fontSize: 14, color: "#3a2e1e", fontStyle: "italic", marginTop: 2 }}>{journal.cible}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {dep.titres.map((t) => {
                const sel = titre?.t === t.t;
                return (
                  <button key={t.t} onClick={() => setTitre(t)}
                    style={{
                      textAlign: "left",
                      background: sel ? `linear-gradient(90deg, ${ANGLE_COLOR[t.angle]}22, #fffbe8)` : "#fff",
                      border: `2px solid ${sel ? ANGLE_COLOR[t.angle] : "#c9b48c"}`,
                      borderRadius: 12, padding: "14px 18px", cursor: "pointer",
                      fontFamily: "Georgia, serif",
                      boxShadow: sel ? `0 4px 14px ${ANGLE_COLOR[t.angle]}33` : "0 1px 4px rgba(0,0,0,0.06)",
                      transition: "all .2s",
                    }}>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: ANGLE_COLOR[t.angle], fontWeight: 800, marginBottom: 6 }}>TITRE {ANGLE_LABEL[t.angle].toUpperCase()}</div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#1c1a10", lineHeight: 1.3, fontFamily: "Georgia, serif" }}>{t.t}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(4)} disabled={!titre}
              style={{ marginTop: 16, width: "100%", background: titre ? "linear-gradient(90deg,#a06030,#8a5a2a)" : "#c9b48c", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontWeight: 900, cursor: titre ? "pointer" : "not-allowed", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: titre ? "0 6px 20px rgba(138,90,42,0.45)" : "none" }}>
              3/3 · Choisir le ton →
            </button>
          </>
        )}

        {/* ═════ 4 : choix du ton ═════ */}
        {step === 4 && (
          <>
            <p style={{ fontSize: 16, lineHeight: 1.5, textAlign: "center", margin: "0 0 14px", color: "#3a2e1e" }}>
              Le texte sous le titre, tu l'écris <strong>comment</strong> ?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TONS.map((T) => {
                const sel = ton?.angle === T.angle;
                return (
                  <button key={T.angle} onClick={() => setTon(T)}
                    style={{
                      textAlign: "left",
                      background: sel ? "linear-gradient(90deg,#fff6d8,#fffbe8)" : "#fff",
                      border: `2px solid ${sel ? "#8a5a2a" : "#c9b48c"}`,
                      borderRadius: 12, padding: "14px 18px", cursor: "pointer",
                      fontFamily: "Georgia, serif",
                      boxShadow: sel ? "0 4px 14px rgba(138,90,42,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
                      transition: "all .2s",
                    }}>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 16, letterSpacing: 1, color: "#8a5a2a", fontWeight: 800 }}>{T.label}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(5)} disabled={!ton}
              style={{ marginTop: 16, width: "100%", background: ton ? "linear-gradient(90deg,#a06030,#8a5a2a)" : "#c9b48c", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontWeight: 900, cursor: ton ? "pointer" : "not-allowed", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: ton ? "0 6px 20px rgba(138,90,42,0.45)" : "none" }}>
              🔥 Imprimer la Une !
            </button>
          </>
        )}

        {/* ═════ 5 : impression animée + verdict ═════ */}
        {step === 5 && V && (
            <>
              <div style={{ background: "#fff", border: `2px solid ${journal.couleur}`, borderRadius: 8, padding: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", position: "relative", overflow: "hidden", minHeight: 220 }}>
                {pressStep < 4 && (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(60,40,20,0.12) 50%, transparent 100%)", animation: "inkPass 1.6s ease-out 1", pointerEvents: "none" }} />
                )}
                <div style={{ opacity: pressStep >= 1 ? 1 : 0, transition: "opacity .4s", fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 900, textAlign: "center", borderBottom: `3px double ${journal.couleur}`, paddingBottom: 6, marginBottom: 12, color: journal.couleur, letterSpacing: 2 }}>
                  {journal.nom.toUpperCase()}
                </div>
                <div style={{ opacity: pressStep >= 2 ? 1 : 0, transform: pressStep >= 2 ? "translateY(0)" : "translateY(6px)", transition: "opacity .4s, transform .4s", fontSize: 24, fontWeight: 900, lineHeight: 1.2, color: "#1c1a10", marginBottom: 10 }}>
                  {titre.t}
                </div>
                <div style={{ opacity: pressStep >= 3 ? 1 : 0, transition: "opacity .5s", fontSize: 16, lineHeight: 1.55, color: "#2a2418" }}>
                  {dep.chapo[ton.angle]}
                </div>
                {pressStep >= 3 && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #c9b48c", paddingTop: 10, fontSize: 12.5, color: "#7a6248", fontStyle: "italic" }}>
                    Suite en pages intérieures — voir aussi : brèves, sports, télé.
                  </div>
                )}
              </div>

              {pressStep >= 4 && (
                <div style={{ marginTop: 14, background: "#101827", border: `1px solid ${V.color}44`, borderRadius: 10, padding: "14px 16px", color: "#e8eef5", animation: "fadein .4s" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 1.5, color: V.color, fontWeight: 800 }}>{V.note}</div>
                    {isWin && (
                      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 900, color: "#ffd166", letterSpacing: 1 }}>+5 ⚡</div>
                    )}
                  </div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0 }}>{V.text}</p>
                  {isWin && (
                    <p style={{ fontSize: 14, lineHeight: 1.55, margin: "10px 0 0", color: "#c8d4e2", fontStyle: "italic" }}>
                      « Même dépêche, mais chaque journal fabrique SA Une pour SON public. Ça, c'est une ligne éditoriale. » — MARTINE
                    </p>
                  )}
                </div>
              )}
              {pressStep >= 4 && (
                isWin ? (
                  <button onClick={onClose}
                    style={{ marginTop: 12, width: "100%", background: "#8a5a2a", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                    Continuer
                  </button>
                ) : (
                  <button onClick={retry}
                    style={{ marginTop: 12, width: "100%", background: "#c9b48c", color: "#3a2214", border: "2px solid #8a5a2a", borderRadius: 10, padding: "14px", fontWeight: 800, cursor: "pointer", fontSize: 17, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                    ↻ Essayer encore
                  </button>
                )
              )}
            </>
        )}

        <style>{`
          @keyframes inkPass { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        `}</style>
      </div>
    </div>
  );
}
