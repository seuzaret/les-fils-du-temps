import { useState, useEffect, useRef } from "react";
import { Avatar } from "../../engine/Martine.jsx";
import { PortraitElias, PortraitMira, PortraitAl3x1A } from "./StationChronautes.jsx";
import { PortraitLea } from "./Jeu2BDecors.jsx";

/* ============================================================
   CINÉMATIQUES — lecteur de tableaux plein écran
   ------------------------------------------------------------
   Même esprit que l'intro et le Jeu 2B : un tableau = UN élément
   de la scène, une ou deux phrases courtes, et un fondu par le NOIR
   entre chaque tableau (lisibilité). Clic / Entrée / Espace pour
   avancer ; un premier clic complète le texte en cours.

   `steps` : liste de
     { type: "title", kicker, titre, sub?, couleur }       carte-titre sur fond noir
     { type: "tableau", Scene, lieu?, beats: [ … ] }       décor + répliques
   `beat` : { who?: "narr"|"mira"|"elias"|"al3x1a"|"martine"|"lea",
              mood?, text, tag?, couleur? }
   La scène reçoit { beat, ctx } et se remonte à chaque tableau.
   `endActions` : boutons affichés à la fin du dernier tableau
   (sinon `onDone` est appelé après le dernier tableau).
   ============================================================ */

/* Machine à écrire. `shown` et `done` sont déduits du texte COURANT :
   au changement de réplique, l'ancien texte n'est jamais pris pour fini.
   skip() déplace la position partagée avec l'intervalle (sinon il réécrirait le texte partiel). */
export function useTypewriter(text, speed = 18) {
  const [typed, setTyped] = useState("");
  const pos = useRef(0);
  useEffect(() => {
    setTyped(""); pos.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      pos.current += 1;
      setTyped(text.slice(0, pos.current));
      if (pos.current >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  const shown = text.startsWith(typed) ? typed : "";
  return { shown, done: shown === text, skip: () => { pos.current = text.length; setTyped(text); } };
}

const SPEAKERS = {
  narr: { nom: "", couleur: "#8fa3bd" },
  mira: { nom: "MIRA", couleur: "#7fd8ff", Portrait: PortraitMira },
  elias: { nom: "ELIAS", couleur: "#ffd166", Portrait: PortraitElias },
  al3x1a: { nom: "AL3X1A", couleur: "#c8a8ff", Portrait: PortraitAl3x1A },
  lea: { nom: "LÉA", couleur: "#ff9a5a", Portrait: PortraitLea },
  martine: { nom: "MARTINE", couleur: "#5eff9e" },
};

const BTN_GHOST = { background: "#141b26", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 };

export default function Cine({ steps, label, accent = "#7fd8ff", ctx, onDone, endActions }) {
  const [idx, setIdx] = useState(0);
  const [beatIdx, setBeatIdx] = useState(0);
  const [veil, setVeil] = useState(true); // noir : vrai au début, se lève après le montage
  const [ready, setReady] = useState(false); // carte-titre : clic autorisé après un court délai
  const lock = useRef(false);
  const timers = useRef([]);
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const step = steps[idx];
  const isLast = idx === steps.length - 1;
  const beats = step.type === "tableau" ? step.beats : [];
  const beat = beats[Math.min(beatIdx, beats.length - 1)] || {};
  const text = step.type === "tableau" ? (beat.text || "") : "";
  const { shown, done, skip } = useTypewriter(text);
  const lastBeat = beatIdx >= beats.length - 1;
  const showEnd = step.type === "tableau" && isLast && lastBeat && done && endActions;

  /* lever le noir après chaque montage de tableau */
  const lift = () => requestAnimationFrame(() => requestAnimationFrame(() => setVeil(false)));
  useEffect(() => { lift(); }, []);

  const goNext = () => {
    if (lock.current) return;
    lock.current = true;
    setVeil(true);
    later(() => {
      if (isLast) { lock.current = false; onDone?.(); return; }
      setIdx((i) => i + 1); setBeatIdx(0); setReady(false);
      lock.current = false;
      lift();
    }, 480);
  };

  /* carte-titre : lisible, puis passe seule */
  useEffect(() => {
    if (step.type !== "title") return;
    const a = setTimeout(() => setReady(true), 1100);
    const b = setTimeout(goNext, step.duree || 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [idx]);

  const advance = () => {
    if (lock.current || veil) return;
    if (step.type === "title") { if (ready) goNext(); return; }
    if (!done) { skip(); return; }
    if (!lastBeat) { setBeatIdx((b) => b + 1); return; }
    if (isLast && endActions) return;
    goNext();
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target?.tagName === "BUTTON") return;
      e.preventDefault(); advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* passer : saute l'acte (ou, s'il se termine par des boutons, va à leur affichage) */
  const skipAct = (e) => {
    e.stopPropagation();
    if (endActions && !(isLast && lastBeat)) {
      const li = steps.length - 1;
      setVeil(true);
      later(() => { setIdx(li); setBeatIdx((steps[li].beats?.length || 1) - 1); lift(); }, 300);
    } else if (!endActions) onDone?.();
  };

  const who = SPEAKERS[beat.who] || SPEAKERS.narr;
  const couleur = beat.couleur || who.couleur;
  const Portrait = who.Portrait;
  const isNarr = !beat.who || beat.who === "narr";
  const frameStyle = { width: "min(140px, 26vw)", aspectRatio: "140 / 170", flex: "0 0 auto", borderRadius: 12, overflow: "hidden", border: `2px solid ${couleur}`, boxShadow: "0 8px 32px rgba(0,0,0,0.65)" };

  return (
    <div onClick={advance}
      style={{ height: "100dvh", overflow: "hidden", background: "#000", position: "relative", display: "flex", flexDirection: "column", fontFamily: "Georgia, serif", cursor: "pointer", userSelect: "none" }}>
      <style>{`@keyframes cineIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes cineLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>

      {step.type === "title" ? (
        /* ─── carte-titre sur fond noir ─── */
        <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 5, color: step.couleur || accent, animation: "cineIn 900ms ease-out both" }}>{step.kicker}</div>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 800, letterSpacing: 6, color: step.couleur || accent, animation: "cineIn 1100ms ease-out 350ms both", textShadow: `0 0 28px ${(step.couleur || accent)}66` }}>{step.titre}</div>
          <div style={{ width: 160, height: 2, background: step.couleur || accent, transformOrigin: "center", animation: "cineLine 1000ms ease-out 700ms both", opacity: 0.8 }} />
          {step.sub && <div style={{ fontStyle: "italic", fontSize: 15, color: "#8fa3bd", maxWidth: 560, animation: "cineIn 1000ms ease-out 1000ms both" }}>{step.sub}</div>}
        </div>
      ) : (
        <>
          {/* ─── décor du tableau ─── */}
          <div key={idx} style={{ position: "absolute", inset: 0 }}>
            <step.Scene beat={beatIdx} ctx={ctx} />
          </div>
          {/* repère de lieu */}
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "12px 12px 0", pointerEvents: "none" }}>
            {label && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: accent, textShadow: "0 1px 8px #000" }}>{label}</div>}
            {step.lieu && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#cfe6ff", marginTop: 4, opacity: 0.75, textShadow: "0 1px 8px #000" }}>{step.lieu}</div>}
          </div>
          <div style={{ flex: 1 }} />
          {/* ─── bandeau de texte ─── */}
          <div key={`p${idx}`} style={{ position: "relative", zIndex: 2, padding: "12px 20px 24px", background: "linear-gradient(180deg,#0c122000 0%,#0c1220ee 40%,#080d16 100%)", display: "flex", gap: 16, alignItems: "flex-end" }}>
            {!isNarr && (Portrait ? (
              <div style={frameStyle}><Portrait mood={beat.mood || "neutre"} /></div>
            ) : beat.who === "martine" ? (
              <div style={{ ...frameStyle, background: "radial-gradient(circle at 50% 45%,#12302a,#08121a)", display: "grid", placeItems: "center" }}>
                <Avatar mood={beat.mood || "neutre"} talking={!done} size={104} date={ctx?.date} />
              </div>
            ) : null)}
            <div style={{ flex: 1, background: "#0e1420ee", border: `1px solid ${beat.tag ? couleur : "#2a3648"}`, borderRadius: 12, padding: "12px 16px", minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: beat.tag ? `0 0 16px ${couleur}33` : "none" }}>
              <div>
                {beat.tag && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: couleur, fontWeight: 800, marginBottom: 6 }}>{beat.tag}</div>}
                {!isNarr && who.nom && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: couleur, marginBottom: 6 }}>{who.nom}</div>}
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "#e8eef5", margin: 0, fontStyle: "italic" }}>
                  {isNarr ? shown : <>« {shown}{!done && <span style={{ opacity: 0.7 }}>▮</span>} »</>}
                  {isNarr && !done && <span style={{ opacity: 0.7 }}>▮</span>}
                </p>
              </div>
              {showEnd ? (
                <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 12 }}>{endActions}</div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 1, color: done ? couleur : "#3a4658" }}>
                  {done ? "clique pour continuer ▸" : "…"}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* passer */}
      {!(endActions && isLast && lastBeat) && (
        <button onClick={skipAct} title="Sauter cette séquence"
          style={{ position: "absolute", top: 10, right: 14, zIndex: 40, background: "rgba(20,27,38,0.6)", border: "1px solid rgba(200,212,226,0.25)", color: "#8fa3bd", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
          passer ›
        </button>
      )}

      {/* le NOIR entre les tableaux */}
      <div style={{ position: "absolute", inset: 0, zIndex: 30, background: "#000", opacity: veil ? 1 : 0, transition: `opacity ${veil ? 450 : 650}ms ease-in-out`, pointerEvents: "none" }} />
    </div>
  );
}

export { BTN_GHOST };
