import { useState, useEffect } from "react";
import { Avatar } from "../../engine/Martine.jsx";
import { PortraitElias } from "./StationChronautes.jsx";
import { CHAPTERS } from "../index.js";

/* ============================================================
   BRIEFING MISSION — pont entre le jeu 1 et le jeu 2 (Al3x1A)
   ------------------------------------------------------------
   Salle TEMPORELLE : ni station des chronautes ni décor du jeu 1.
   Une nébuleuse profonde, des courants du temps qui coulent, MARTINE
   RÉPARÉE (droite, fière) et Elias qui remet officiellement la
   MISSION à l'élève, avec la TEMPOSCOPE en cadeau — la
   pièce apparaît en cadeau à la 5e réplique, matérialisée devant lui.

   Effet TYPEWRITER sur chaque réplique. Le joueur clique le bouton
   "Suite ▸" pour avancer (ou "Sauter" pendant la frappe pour tout
   afficher). Dernier écran : "ACCEPTER LA MISSION" → onAccept()
   lance directement le jeu 2 (App bascule sans repasser au titre).
   ============================================================ */

function useTypewriter(text, speed = 6) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    if (!text) { setDone(true); return; }
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { shown, done, skip: () => { setShown(text); setDone(true); } };
}

/* Petite frise chronologique DÉMO (miniature, non interactive) —
   l'aperçu de l'outil qu'on remet au joueur. Reprend le style de
   la vraie frise en jeu 2 : dégradé horizontal + pastilles-emoji. */
function FrisePreview() {
  return (
    <div style={{ position: "relative", padding: "10px 14px 6px", background: "linear-gradient(180deg, rgba(14,28,42,0.85), rgba(14,28,42,0.35))", borderRadius: 12, border: "1px solid #3a80c8", boxShadow: "0 0 20px rgba(127,216,255,0.35)", animation: "friseAppear 0.9s ease-out" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 9, letterSpacing: 2, color: "#7fd8ff", textAlign: "center", marginBottom: 6 }}>🔭 TON TEMPOSCOPE</div>
      <div style={{ position: "absolute", left: 26, right: 26, top: "58%", height: 2, background: "linear-gradient(90deg, #26324a 0%, #7fd8ff 50%, #26324a 100%)", opacity: 0.6, borderRadius: 2 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4, position: "relative" }}>
        {CHAPTERS.map((c) => (
          <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, fontSize: 15, borderRadius: "50%", background: "linear-gradient(180deg, #1a2a3e, #0a1420)", border: "1.5px solid #7fd8ff", boxShadow: "0 0 6px rgba(127,216,255,0.35)" }}>{c.emoji || "•"}</span>
            <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 7, color: "#7fd8ff", opacity: 0.75, whiteSpace: "nowrap" }}>{c.date || ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DIALOGUES = [
  { speaker: "elias", text: "MARTINE est réparée. Regarde-la — elle rayonne. Grâce à toi, {prenom}." },
  { speaker: "martine", mood: "content", text: "Mes circuits chantent. Merci, chronaute. Je suis prête à repartir." },
  { speaker: "elias", text: "Écoute. Il y a des années, l'une des nôtres est partie chercher un remède contre l'oubli. Nom de code : Al3x1A. Elle n'est jamais rentrée. Quelqu'un doit aller la retrouver." },
  { speaker: "martine", mood: "content", text: "J'ai bricolé un nouvel outil : le TEMPOSCOPE. Tu voyageras d'une époque à l'autre d'un simple regard. Al3x1A a laissé des notes dans chaque époque, sur son support typique — paroi, tablette, papyrus, télégramme…", showFrise: true },
  { speaker: "elias", text: "Trouve ses notes, recoupe les indices, ramène-la. Prêt·e, {prenom} ?" },
];

export default function BriefingMission({ prenom, onAccept }) {
  const [idx, setIdx] = useState(0);
  const [friseVisible, setFriseVisible] = useState(false);
  const step = DIALOGUES[idx];
  const rawText = step.text.replace("{prenom}", prenom || "chronaute");
  const { shown, done, skip } = useTypewriter(rawText);
  const isLast = idx >= DIALOGUES.length - 1;

  useEffect(() => {
    if (step.showFrise) setFriseVisible(true);
  }, [step]);

  const advance = () => {
    if (!done) skip();
    else if (isLast) onAccept?.();
    else setIdx(idx + 1);
  };

  return (
    <div onClick={advance} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5", padding: "20px 16px", cursor: "pointer" }}>
      {/* Fond nébuleuse : dégradé profond + étoiles + traînées de temps */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, #1a2a5a 0%, #0a1030 40%, #04081a 80%)" }} />
      {/* Étoiles : petits points aléatoires (positions fixes pour ne pas re-rendre) */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <radialGradient id="brief-star" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#7fd8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[
          [12, 15, 1.4, 3.2], [88, 8, 1, 2.8], [45, 25, 1.6, 3.8], [72, 40, 1.2, 3.1], [22, 55, 1.1, 2.5],
          [58, 12, 1.3, 3.6], [8, 35, 1, 2.4], [95, 55, 1.4, 3.3], [30, 78, 1.2, 2.9], [66, 88, 1.5, 3.5],
          [82, 72, 1, 2.6], [15, 88, 1.2, 3.0], [50, 60, 1.4, 3.4], [42, 92, 1.1, 2.7], [78, 22, 1.3, 3.1],
        ].map(([xp, yp, r, dur], i) => (
          <circle key={i} cx={`${xp}%`} cy={`${yp}%`} r={r} fill="url(#brief-star)"
            style={{ animation: `starTwinkle ${dur}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
        ))}
        {/* Courants du temps : longues courbes bleutées qui coulent en fond */}
        {[
          { d: "M -50 200 Q 300 100 700 250 T 1600 180", op: 0.18, dur: "22s" },
          { d: "M -50 400 Q 400 300 800 450 T 1600 380", op: 0.14, dur: "28s" },
          { d: "M -50 550 Q 250 480 600 600 T 1600 520", op: 0.12, dur: "35s" },
        ].map((c, i) => (
          <path key={i} d={c.d} stroke="#7fd8ff" strokeWidth="1.4" fill="none" opacity={c.op}
            style={{ animation: `streamDrift ${c.dur} linear infinite` }} strokeDasharray="140 60" />
        ))}
      </svg>

      {/* Contenu au premier plan */}
      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", zIndex: 2 }}>
        {/* Titre de la salle */}
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 4, color: "#7fd8ff", opacity: 0.75 }}>SALLE TEMPORELLE · 2287</div>
          <h1 style={{ fontFamily: "ui-monospace,monospace", fontSize: 26, fontWeight: 700, color: "#ffd166", letterSpacing: 2, margin: "4px 0 0", textShadow: "0 0 14px rgba(255,209,102,0.5)" }}>LA MISSION</h1>
        </div>

        {/* Les deux personnages : Elias à gauche, MARTINE à droite */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", marginTop: 24, gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 120, textAlign: "center", opacity: step.speaker === "elias" ? 1 : 0.55, transition: "opacity 0.35s" }}>
            <div style={{ width: 110, height: 130, margin: "0 auto", borderRadius: 12, overflow: "hidden", border: `2px solid ${step.speaker === "elias" ? "#e0a848" : "#3a4058"}`, boxShadow: step.speaker === "elias" ? "0 0 18px rgba(224,168,72,0.4)" : "none", transition: "all 0.35s", background: "#1a1a28" }}>
              <PortraitElias />
            </div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: step.speaker === "elias" ? "#e0a848" : "#8a97ad", marginTop: 6 }}>ELIAS</div>
          </div>
          <div style={{ width: 120, textAlign: "center", opacity: step.speaker === "martine" ? 1 : 0.55, transition: "opacity 0.35s" }}>
            <div style={{ width: 110, height: 130, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, border: `2px solid ${step.speaker === "martine" ? "#5eff9e" : "#3a4058"}`, boxShadow: step.speaker === "martine" ? "0 0 18px rgba(94,255,158,0.4)" : "none", transition: "all 0.35s", background: "#0a1420" }}>
              <div style={{ transform: "scale(1.35)" }}>
                <Avatar mood={step.mood || (step.speaker === "martine" ? "content" : "neutre")} size={70} date="2287" talking={step.speaker === "martine" && !done} />
              </div>
            </div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: step.speaker === "martine" ? "#5eff9e" : "#8a97ad", marginTop: 6 }}>MARTINE</div>
          </div>
        </div>

        {/* La bulle de dialogue avec effet TYPEWRITER */}
        <div style={{ background: "rgba(20,30,50,0.85)", border: `2px solid ${step.speaker === "martine" ? "#5eff9e" : "#e0a848"}`, borderRadius: 14, padding: "16px 20px", marginTop: 18, minHeight: 96, boxShadow: `0 0 24px ${step.speaker === "martine" ? "rgba(94,255,158,0.22)" : "rgba(224,168,72,0.22)"}` }}
          title={done ? "Cliquer pour continuer" : "Cliquer pour tout afficher"}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: step.speaker === "martine" ? "#5eff9e" : "#e0a848", marginBottom: 8 }}>
            {step.speaker === "martine" ? "MARTINE ▸" : "ELIAS ▸"}
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#e8eef5", margin: 0 }}>
            « {shown}{!done && <span style={{ opacity: 0.7 }}>▮</span>} »
          </p>
        </div>

        {/* La frise chronologique matérialisée devant l'élève quand MARTINE
            la révèle (step.showFrise) et pour toutes les répliques suivantes. */}
        {friseVisible && (
          <div style={{ marginTop: 16 }}>
            <FrisePreview />
          </div>
        )}

        {/* Boutons : Suite / Accepter */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          {!isLast ? (
            <button onClick={(e) => { e.stopPropagation(); if (done) setIdx(idx + 1); }}
              disabled={!done}
              style={{ background: done ? "#141b26" : "#0e1420", color: done ? "#7fd8ff" : "#3a4058", border: `1px solid ${done ? "#3a80c8" : "#26324a"}`, borderRadius: 10, padding: "10px 26px", fontWeight: 700, cursor: done ? "pointer" : "default", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 2, transition: "all 0.2s" }}>
              Suite ▸
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); if (done) onAccept?.(); }}
              disabled={!done}
              style={{ background: done ? "#5eff9e" : "#2a3020", color: done ? "#06110b" : "#3a4058", border: "none", borderRadius: 12, padding: "14px 32px", fontWeight: 900, cursor: done ? "pointer" : "default", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: done ? "0 0 22px rgba(94,255,158,0.5)" : "none", animation: done ? "pulseAccept 2s ease-in-out infinite" : "none" }}>
              ▶ ACCEPTER LA MISSION
            </button>
          )}
        </div>

        {/* Indicateur de progression */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {DIALOGUES.map((_, i) => (
            <div key={i} style={{ width: i === idx ? 20 : 8, height: 6, borderRadius: 3, background: i <= idx ? "#7fd8ff" : "#26324a", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes streamDrift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -600; }
        }
        @keyframes friseAppear {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); box-shadow: 0 0 40px rgba(127,216,255,0.9); }
          60% { transform: translateY(-4px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 0 20px rgba(127,216,255,0.35); }
        }
        @keyframes pulseAccept {
          0%, 100% { box-shadow: 0 0 22px rgba(94,255,158,0.5); }
          50% { box-shadow: 0 0 32px rgba(94,255,158,0.85); }
        }
      `}</style>
    </div>
  );
}
