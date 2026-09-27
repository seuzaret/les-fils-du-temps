import { useState, useEffect, useMemo } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Ton fil pour toi »
   ------------------------------------------------------------
   L'élève défile 8 courtes vidéos. Il peut ❤️ AIMER ou 👎 PASSER.
   Chaque vidéo porte un THÈME caché (sport, drama, humour,
   sciences, mode). Le compteur par thème monte.
   À la fin, on montre à l'élève :
   - le thème qui a gagné,
   - un "prochain fil" 100 % dans ce thème,
   - et le "fil d'un autre élève" — radicalement différent.
   Objectif pédagogique : *ce n'est pas toi qui choisis, c'est un
   modèle qui apprend*.
   ============================================================ */

const CARTES = [
  { id: 1, theme: "sport",    emoji: "⚽", titre: "Le but improbable qui a fait exploser Twitter" },
  { id: 2, theme: "humour",   emoji: "🐈", titre: "Ce chat pense qu'il est un chien (fou rire garanti)" },
  { id: 3, theme: "sciences", emoji: "🦖", titre: "Ils trouvent un dinosaure sous une école" },
  { id: 4, theme: "drama",    emoji: "😱", titre: "ELLE LUI DIT ÇA EN PLEIN COURS !!" },
  { id: 5, theme: "mode",     emoji: "👟", titre: "Les 5 sneakers à avoir cette rentrée" },
  { id: 6, theme: "sport",    emoji: "🏀", titre: "Le dunk de l'année, vu 12 millions de fois" },
  { id: 7, theme: "sciences", emoji: "🚀", titre: "Ce que la NASA a filmé sur Mars la semaine dernière" },
  { id: 8, theme: "humour",   emoji: "🤡", titre: "Il rate son gâteau d'anniversaire, mais alors LÀ…" },
  { id: 9, theme: "drama",    emoji: "💔", titre: "Ils étaient meilleurs amis. Puis IL a fait ÇA." },
  { id: 10, theme: "mode",    emoji: "💅", titre: "Cette manucure va tout changer (avis avant/après)" },
];

const THEMES = {
  sport:    { label: "sport",         couleur: "#4ae0ff" },
  humour:   { label: "humour",        couleur: "#ffd166" },
  sciences: { label: "sciences",      couleur: "#7fe0a8" },
  drama:    { label: "drama / clash", couleur: "#ff5a7a" },
  mode:     { label: "mode / beauté", couleur: "#c88af0" },
};

/* les 8 cartes tirées pour ce joueur */
function pickCartes() {
  const arr = [...CARTES].sort(() => Math.random() - 0.5).slice(0, 8);
  return arr;
}

/* génère un "faux fil suivant" 100% dans un thème */
function fauxFil(theme) {
  const pool = CARTES.filter(c => c.theme === theme);
  const base = pool.length ? pool : CARTES;
  return Array.from({ length: 6 }, (_, i) => base[i % base.length]);
}

export function FilAlgoGame({ onClose, onWin }) {
  const cartes = useMemo(() => pickCartes(), []);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ sport: 0, humour: 0, sciences: 0, drama: 0, mode: 0 });
  const [done, setDone] = useState(false);
  useWinOnce(done, onWin);

  function agir(carte, action) {
    if (action === "like") {
      setScores(s => ({ ...s, [carte.theme]: s[carte.theme] + 2 }));
    } else {
      // regarder brièvement compte quand même un peu (durée de visionnage)
      setScores(s => ({ ...s, [carte.theme]: s[carte.theme] + 0.3 }));
    }
    if (idx + 1 >= cartes.length) setDone(true);
    else setIdx(idx + 1);
  }

  const finished = idx >= cartes.length - 1 && done;
  const carte = cartes[Math.min(idx, cartes.length - 1)];

  const winner = useMemo(() => {
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  }, [scores]);
  const autreTheme = useMemo(() => {
    if (!winner) return "sciences";
    const others = Object.keys(THEMES).filter(t => t !== winner[0]);
    return others[Math.floor(Math.random() * others.length)];
  }, [winner]);

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.86)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", color: "#e8eef5", border: "2px solid #2a3a58", borderRadius: 16, padding: 20, maxWidth: 460, width: "100%", maxHeight: "94vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.7)", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#7fd8ff" }}>📱 TON FIL — 22:14</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 12px", color: "#fff", fontSize: 22 }}>« Pour toi »</h2>

        {!done && (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 10 }}>
              {cartes.map((_, i) => (
                <div key={i} style={{ width: 22, height: 4, borderRadius: 2, background: i <= idx ? "#7fd8ff" : "#2a3a58" }} />
              ))}
            </div>

            <div style={{ background: "linear-gradient(180deg,#1a2438 0%, #0a1220 100%)", border: "1px solid #2a3a58", borderRadius: 14, padding: 20, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
              <div style={{ fontSize: 72, marginBottom: 10 }}>{carte.emoji}</div>
              <div style={{ fontSize: 16, textAlign: "center", lineHeight: 1.4, color: "#fff", fontWeight: 600, maxWidth: 340 }}>{carte.titre}</div>
              <div style={{ position: "absolute", bottom: 8, right: 12, fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#5a7a90" }}>vidéo {idx + 1}/{cartes.length}</div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => agir(carte, "pass")}
                style={{ flex: 1, background: "#26324a", color: "#c8d4e2", border: "1px solid #3a4a68", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                👎 Passer
              </button>
              <button onClick={() => agir(carte, "like")}
                style={{ flex: 1, background: "linear-gradient(180deg,#ff4a6a,#a03052)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                ❤️ J'aime
              </button>
            </div>
            <p style={{ fontSize: 11.5, lineHeight: 1.5, color: "#8fa3bd", margin: "12px 0 0", textAlign: "center", fontStyle: "italic" }}>
              Tu défiles comme d'habitude. Un algorithme observe.
            </p>
          </>
        )}

        {done && (() => {
          const [tag] = winner;
          const T = THEMES[tag];
          const fil = fauxFil(tag);
          const autreFil = fauxFil(autreTheme);
          const A = THEMES[autreTheme];
          return (
            <>
              <div style={{ background: "#101a2a", border: `1px solid ${T.couleur}55`, borderRadius: 12, padding: 14, marginTop: 6 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: T.couleur, marginBottom: 6 }}>▸ L'ALGORITHME A DÉCIDÉ</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>
                  D'après ce que tu as regardé et aimé, l'app pense que tu es surtout intéressé·e par : <strong style={{ color: T.couleur }}>{T.label}</strong>.
                </p>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#7fd8ff", marginBottom: 6 }}>▸ TON PROCHAIN FIL</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                  {fil.map((c, i) => (
                    <div key={i} style={{ background: "#1a2438", border: `1px solid ${T.couleur}44`, borderRadius: 8, padding: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 26 }}>{c.emoji}</div>
                      <div style={{ fontSize: 9, color: "#c8d4e2", marginTop: 4, lineHeight: 1.2, minHeight: 22 }}>{c.titre.slice(0, 34)}…</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: A.couleur, marginBottom: 6 }}>▸ LE FIL D'UN·E AUTRE ÉLÈVE ({A.label})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, opacity: 0.85 }}>
                  {autreFil.map((c, i) => (
                    <div key={i} style={{ background: "#1a2438", border: `1px solid ${A.couleur}44`, borderRadius: 8, padding: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 26 }}>{c.emoji}</div>
                      <div style={{ fontSize: 9, color: "#c8d4e2", marginTop: 4, lineHeight: 1.2, minHeight: 22 }}>{c.titre.slice(0, 34)}…</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14, background: "#101827", border: "1px solid #5eff9e44", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 1.5, color: "#5eff9e", fontWeight: 800, marginBottom: 6 }}>◉ CE QU'IL FAUT COMPRENDRE</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>
                  En 8 clics, l'algo a fait un profil de toi. Il te montrera surtout ce qui te fait rester. Deux élèves de la même classe peuvent voir <strong>deux mondes différents</strong> sur la même appli. C'est ce qu'on appelle une <strong>bulle</strong>.
                </p>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, margin: "8px 0 0", color: "#c8d4e2", fontStyle: "italic" }}>
                  « Ce n'est pas toi qui choisis ton fil. C'est un modèle qui apprend, et qui te retient. » — MARTINE
                </p>
              </div>

              <button onClick={onClose}
                style={{ marginTop: 12, width: "100%", background: "#5eff9e", color: "#0a1220", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                Continuer
              </button>
            </>
          );
        })()}
      </div>
    </div>
  );
}
