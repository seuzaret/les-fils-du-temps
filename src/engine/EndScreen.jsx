import Frise, { trendSentence } from "./Frise.jsx";
import { computeBadge } from "./badge.js";

const TITRE_FONT = "'Cinzel', 'Trajan Pro', 'Copperplate Gothic Bold', 'Perpetua Titling MT', 'Constantia', 'Palatino Linotype', Georgia, serif";

/* ============================================================
   MOTEUR — Écran de FIN d'un chapitre (ou du voyage entier).
   ------------------------------------------------------------
   Contient :
   - le titre + texte de fin du chapitre
   - le score X/N de messages découverts
   - le BADGE (uniquement au bout du voyage)
   - la Frise cumulée + leçon calculée par trendSentence
   - le teaser du Jeu 2 (uniquement au bout du voyage)
   - le récap des messages du chapitre (uniquement en fin
     intermédiaire — le bilan global suffit à la fin)
   - le bouton REJOUER LE CHAPITRE
   Aucun état propre : tout via props.
   ============================================================ */
export default function EndScreen({
  chapter, isLastChapter, msgs, ALL_MSGS, fluxTotal, bonusChapters,
  collection, chapters, onRestart, onStartJeu2,
}) {
  const totalTarget = chapters.reduce((s, c) => s + (c.required || 3) * 5, 0);
  const badge = computeBadge(fluxTotal, totalTarget);
  const scorePct = Math.round((fluxTotal / totalTarget) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 20%, #1a2f4a 0%, #080d16 70%)", padding: 20, fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 58, marginTop: 18 }}>🌀</div>
        <h1 style={{ fontFamily: "ui-monospace,monospace", color: "#5eff9e", letterSpacing: 3, fontSize: 26 }}>{chapter.finTitre}</h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: "#c8d4e2" }}>
          {chapter.finTexte.replace("{pct}", Math.round((msgs.length / ALL_MSGS.length) * 100))}
        </p>
        <p style={{ fontFamily: "ui-monospace,monospace", color: "#5eff9e", fontSize: 18, marginTop: 14 }}>
          ◆ {msgs.length} / {ALL_MSGS.length} messages découverts
        </p>

        {/* BADGE DE FIN — au bout du voyage seulement */}
        {isLastChapter && (
          <div style={{ background: "#0e1420", border: `2px solid ${badge.color}`, borderRadius: 16, padding: "16px 20px", marginTop: 16, boxShadow: `0 0 24px ${badge.color}55` }}>
            <div style={{ fontSize: 42, lineHeight: 1 }}>{badge.emoji}</div>
            <div style={{ fontFamily: "ui-monospace,monospace", color: badge.color, fontSize: 20, fontWeight: 800, letterSpacing: 1.5, marginTop: 6 }}>{badge.name.toUpperCase()}</div>
            <div style={{ fontFamily: "ui-monospace,monospace", color: badge.color, fontSize: 13, opacity: 0.85, marginTop: 2 }}>⚡ {fluxTotal} flux · {scorePct}% du voyage</div>
            <p style={{ fontSize: 13.5, color: "#c8d4e2", lineHeight: 1.6, margin: "8px 0 0", fontStyle: "italic" }}>{badge.desc}</p>
            {bonusChapters.length > 0 && (
              <p style={{ fontSize: 12, color: "#ffd166", marginTop: 8, fontFamily: "ui-monospace,monospace" }}>
                ✨ Cartes bonus débloquées ({bonusChapters.length}) : {bonusChapters.map((i) => chapters[i]?.epoque).join(" · ")}
              </p>
            )}
          </div>
        )}

        {/* la frise du voyage + la leçon calculée */}
        <div style={{ textAlign: "left", background: "#0e1420", border: "1px solid #2a3648", borderRadius: 12, padding: "10px 14px" }}>
          <Frise collection={collection} />
          {trendSentence(collection) && (
            <p style={{ fontSize: 13.5, fontStyle: "italic", color: "#ffd166", lineHeight: 1.6, margin: "4px 0 2px" }}>
              📈 « {trendSentence(collection)} » — MARTINE
            </p>
          )}
        </div>

        {/* Teaser JEU 2 — au bout du voyage seulement */}
        {isLastChapter && (
          <div style={{ border: "2px dashed #7fd8ff", borderRadius: 12, padding: "18px 20px", marginTop: 16, background: "radial-gradient(ellipse at 50% 50%, rgba(127,216,255,0.08), transparent)", textAlign: "center" }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>🌀</div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#7fd8ff", marginBottom: 6 }}>MISSION EN ATTENTE</div>
            <div style={{ fontFamily: TITRE_FONT, fontSize: 26, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", background: "linear-gradient(100deg, #7fd8ff 0%, #ffd166 60%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", lineHeight: 1.15 }}>
              Retrouver Al3x1a
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#c8d4e2", margin: "10px auto 14px", maxWidth: 460, fontStyle: "italic" }}>
              La pionnière est bloquée quelque part dans les époques que tu viens de traverser. Grâce au TEMPOSCOPE que MARTINE t'a remis, tu peux voyager librement et recouper les indices pour la retrouver.
            </p>
            <button onClick={onStartJeu2}
              style={{ background: "#7fd8ff", color: "#06110b", border: "none", borderRadius: 12, padding: "12px 26px", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 22px rgba(127,216,255,0.55)" }}>
              ▶ PARTIR MAINTENANT
            </button>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#7a879e", marginTop: 8 }}>ou reviens plus tard depuis le menu titre</div>
          </div>
        )}

        {/* Récap des messages — en fin de chapitre intermédiaire seulement */}
        {!isLastChapter && (
          <div style={{ textAlign: "left", marginTop: 18 }}>
            {ALL_MSGS.map((id) =>
              msgs.includes(id) ? (
                <div key={id} style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
                  <strong>{chapter.messages[id].emoji} {chapter.messages[id].title}</strong>
                  <p style={{ fontSize: 13, color: "#b8c4d4", margin: "4px 0 0", lineHeight: 1.5 }}>{chapter.messages[id].fact}</p>
                </div>
              ) : (
                <div key={id} style={{ background: "#0d1320", border: "1px dashed #2a3648", borderRadius: 12, padding: "10px 14px", marginBottom: 8, color: "#7a879e" }}>
                  ❓ Message non découvert — rejoue pour le trouver !
                </div>
              )
            )}
          </div>
        )}

        <button onClick={onRestart}
          style={{ margin: "18px 0 40px", background: "transparent", color: "#5eff9e", border: "2px solid #5eff9e", borderRadius: 12, padding: "12px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
          ↺ REJOUER LE CHAPITRE
        </button>
      </div>
    </div>
  );
}
