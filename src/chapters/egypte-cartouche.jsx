import { useState } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « Le cartouche de Snéfrou »
   ------------------------------------------------------------
   En Égypte, on entoure le NOM d'un roi d'un cadre ovale — le
   cartouche — pour le protéger et le rendre éternel. Chaque
   hiéroglyphe note un son. Le joueur écrit S · N · F · R · OU en
   choisissant les bons signes DANS L'ORDRE (avec des pièges),
   et grave ainsi « Snéfrou » pour les millénaires.

   Tout est dessiné ici : libre de droit et hors-ligne.
   ============================================================ */

/* le nom, son par son (hiéroglyphes uni-consonantiques réels) */
const NOM = [
  { son: "S", type: "etoffe", sens: "l'étoffe pliée" },
  { son: "N", type: "eau", sens: "l'eau" },
  { son: "F", type: "vipere", sens: "la vipère" },
  { son: "R", type: "bouche", sens: "la bouche" },
  { son: "OU", type: "caille", sens: "le poussin" },
];
/* pièges — de VRAIES lettres (mais qui ne sont pas dans « Snéfrou »),
   pour que le choix ne soit pas trop simple */
const PIEGES = [
  { son: "B", type: "jambe", sens: "la jambe" },
  { son: "T", type: "pain", sens: "le pain" },
  { son: "M", type: "chouette", sens: "la chouette" },
  { son: "D", type: "main", sens: "la main" },
];

function Glyphe({ type, stroke = "#e8dcc0", sw = 3 }) {
  const g = { fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "etoffe": // S — étoffe pliée : boucle + pli
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M24 8 c-9 0 -9 12 0 12 c9 0 9 -12 0 -12" /><path d="M24 20 L24 42" /><path d="M18 30 h12" /></g></svg>);
    case "eau": // N — l'eau : ondes
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M6 20 q6 -8 12 0 t12 0 t12 0" /><path d="M6 30 q6 -8 12 0 t12 0 t12 0" /></g></svg>);
    case "vipere": // F — la vipère à cornes
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M6 34 q8 -8 16 -2 q8 6 16 -2" /><path d="M38 30 l5 -3 M38 30 l4 4" /><circle cx="37" cy="31" r="1.2" fill={stroke} stroke="none" /></g></svg>);
    case "bouche": // R — la bouche
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M8 24 Q24 14 40 24 Q24 30 8 24 Z" /></g></svg>);
    case "caille": // OU/W — le poussin de caille
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M12 40 Q10 22 24 20 Q38 18 38 28 Q38 34 30 34 L18 34" /><circle cx="24" cy="18" r="4" /><path d="M24 14 l1 -4" /><path d="M18 40 v-4 M26 40 v-4" /></g></svg>);
    case "soleil": // piège — le soleil
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <circle cx="24" cy="24" r="12" /><circle cx="24" cy="24" r="2.2" fill={stroke} stroke="none" /></g></svg>);
    case "jambe": // piège — la jambe
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M18 8 L18 32 L38 38" /><path d="M18 32 L10 40" /></g></svg>);
    case "pain": // piège — le pain (t)
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M8 32 Q8 16 24 16 Q40 16 40 32 Z" /></g></svg>);
    case "chouette": // piège — la chouette (m)
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M18 12 l-3 -5 M30 12 l3 -5" /><circle cx="24" cy="17" r="9" /><circle cx="20.5" cy="16" r="1.6" fill={stroke} stroke="none" /><circle cx="27.5" cy="16" r="1.6" fill={stroke} stroke="none" /><path d="M24 18 l-2 3 l4 0 Z" fill={stroke} stroke="none" /><path d="M15 24 Q24 44 33 24" /><path d="M20 42 v-3 M28 42 v-3" /></g></svg>);
    case "main": // piège — la main (d)
      return (<svg viewBox="0 0 48 48" width="100%" height="100%"><g {...g}>
        <path d="M10 44 L18 26" /><path d="M18 26 q-3 -8 -1 -15 M18 26 q2 -9 7 -12 M20 26 q6 -6 12 -6 M21 29 q6 -2 12 2" /></g></svg>);
    default: return null;
  }
}

const RATE = [
  "Ce signe-là n'est pas dans le nom du roi. Écoute le son suivant.",
  "Non : dans un cartouche, chaque signe compte, et dans l'ORDRE.",
  "Snéfrou fronce le sourcil : ce hiéroglyphe n'est pas le sien.",
];

export function CartoucheGame({ onClose, onWin }) {
  const [places, setPlaces] = useState([]);   // index de NOM déjà écrits, dans l'ordre
  const [flash, setFlash] = useState(null);
  const [won, setWon] = useState(false);
  useWinOnce(won, onWin);
  /* la palette est MÉLANGÉE une fois au démarrage (bons signes + pièges) */
  const [palette] = useState(() => {
    const a = [...NOM, ...PIEGES];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  });


  const taper = (p) => {
    if (won) return;
    const attendu = NOM[places.length];
    if (p.type === attendu?.type) {
      const next = [...places, places.length];
      setPlaces(next); setFlash(null);
      if (next.length === NOM.length) setWon(true);
    } else {
      setFlash(RATE[Math.floor(Math.random() * RATE.length)]);
    }
  };
  const effacer = () => { setPlaces([]); setFlash(null); };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "2px solid #e8934a66", borderRadius: 18, padding: 20, maxWidth: 660, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e8934a" }}>𓋹 L'ÉCRITURE DES PHARAONS</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 2px", color: "#ffd166", fontSize: 21 }}>Le cartouche de Snéfrou</h2>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: "#c8d4e2", textAlign: "center", margin: "0 0 12px" }}>
          On protège le NOM d'un roi dans un cadre ovale : le cartouche. Chaque signe = un son.
          Écris <strong style={{ color: "#ffd166" }}>S · N · F · R · OU</strong> dans l'ordre pour graver son nom.
        </p>

        {!won ? (
          <>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {/* LE CARTOUCHE : cadre ovale + les sons à écrire, de haut en bas */}
              <div style={{ flex: "0 0 auto", background: "linear-gradient(160deg,#cda878,#a9814f)", border: "4px solid #6a4a28", borderRadius: 40, padding: "14px 18px", position: "relative", minWidth: 96 }}>
                <div style={{ position: "absolute", left: "50%", bottom: -12, transform: "translateX(-50%)", width: 30, height: 8, background: "#6a4a28", borderRadius: 4 }} />
                {NOM.map((n, i) => {
                  const done = i < places.length;
                  const active = i === places.length;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "3px 0" }}>
                      <div style={{ width: 46, height: 46, opacity: done ? 1 : 0.22, filter: active ? "drop-shadow(0 0 6px #ffd166)" : "none" }}>
                        <Glyphe type={n.type} stroke={done ? "#2c1c0e" : "#5c4326"} sw={3.4} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LA PALETTE de hiéroglyphes */}
              <div style={{ flex: "1 1 250px" }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 1, color: "#8fa3bd", marginBottom: 6 }}>LES SIGNES — touche dans l'ordre</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
                  {palette.map((p, i) => (
                    <button key={i} onClick={() => taper(p)}
                      style={{ background: "#1a130c", border: "1px solid #3a2c1c", borderRadius: 10, padding: "5px 3px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      {/* la lettre est portée par le hiéroglyphe à toucher (toutes
                          de la même couleur : au joueur de reconnaître S·N·F·R·OU) */}
                      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 16, fontWeight: 800, lineHeight: 1, color: "#e6d29a" }}>{p.son}</div>
                      <div style={{ width: 36, height: 36 }}><Glyphe type={p.type} /></div>
                      <div style={{ fontSize: 8.5, fontFamily: "ui-monospace,monospace", color: "#8a97ad", textAlign: "center", lineHeight: 1.1 }}>{p.sens}</div>
                    </button>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 10, fontFamily: "ui-monospace,monospace", fontSize: 15.5, color: "#c9a877" }}>
                  {"◆".repeat(places.length)}{"◇".repeat(NOM.length - places.length)} <span style={{ color: "#ffd166" }}>{places.length}/{NOM.length}</span>
                </div>
              </div>
            </div>

            <p style={{ minHeight: 18, textAlign: "center", color: "#e8934a", fontSize: 14, fontStyle: "italic", margin: "8px 0 0" }}>{flash}</p>

            <button onClick={effacer}
              style={{ marginTop: 4, width: "100%", background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer", fontSize: 14.5, fontFamily: "ui-monospace,monospace" }}>
              ✕ Effacer et recommencer
            </button>
          </>
        ) : (
          <div style={{ marginTop: 6 }}>
            <div style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Tu viens d'écrire SNÉFROU pour l'éternité ! En Égypte, on trace ces signes sur le PAPYRUS —
                léger, on le roule, on l'emporte au bout du royaume. Mais attention : sans le climat très sec du
                désert, presque rien n'aurait survécu. Le papyrus voyage loin… mais il est bien plus fragile que
                l'argile cuite d'Ur. On ne gagne jamais sur tous les tableaux ! » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ◆ « Hiéroglyphes » transmis au futur !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
