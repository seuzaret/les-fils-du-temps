import { useState } from "react";
import ChambreN27Decor from "../ChambreN27Decor.jsx";

/* ============================================================
   JEU 3 — SCÈNE : « Le Réveil » — chambre N-27
   ------------------------------------------------------------
   Séquence narrative alternée écran noir / chambre, pour laisser
   la désorientation s'installer. Un clic n'importe où avance.
   Chambre : le décor partagé ChambreN27Decor (même pièce que la
   chambre jouable). Dernier texte → bouton pour sortir.

   Deux versions :
     STEPS        — Jeu 3 lancé depuis le menu : tout le réveil.
     STEPS_SUITE  — Jeu 3 lancé juste après la fin du Jeu 2, qui a
                    déjà montré le réveil en N-27, l'annonce de
                    MARTINE au mur, le carton et la veste :
                    on enchaîne sans le répéter (flag from_finjeu2,
                    posé par App.jsx).
   ============================================================ */
const STEPS = [
  { mode: "black", text: "Une lumière blanche, froide." },
  { mode: "black", text: "Un plafond bas en béton." },
  { mode: "room",  text: null, dim: 0.55 },
  { mode: "black", text: "Tu ne connais pas cette pièce…" },
  { mode: "black", text: "Où es-tu ? Comment es-tu arrivé·e ici ? Rien ne te revient." },
  { mode: "room",  text: null, dim: 0.3 },
  { mode: "black", text: "Juste un flash : MARTINE qui parle, un vertige, le noir." },
  { mode: "black", text: "Est-ce que tu as rêvé tout ça ?", big: true },
  { mode: "room",  text: "Ton téléphone sur le bureau est noir, muet. Tu essaies de l'allumer. Rien." },
  { mode: "room",  text: "Sur le mur, un écran : « RÉSEAU M · Bienvenue, HABITANT N-27 ». Tu ne connais pas ce logo." },
  { mode: "room",  text: "Au pied du lit, un carton à ton numéro : « N-27 · EFFETS ». Une vieille veste en dépasse. Tu ne te souviens pas de l'avoir portée." },
  { mode: "room",  text: "Sur la porte : « N-27 · Habitant · Niveau 0 ». Il faut sortir voir." },
];
const STEPS_SUITE = [
  { mode: "black", text: "Tu as dû te rendormir." },
  { mode: "black", text: "Quand tu rouvres les yeux : la même lumière blanche, le même plafond de béton." },
  { mode: "room",  text: null, dim: 0.4 },
  { mode: "black", text: "Ce n'était pas un rêve. Tu es bien dans le Puits.", big: true },
  { mode: "black", text: "Il te revient des bribes : MARTINE qui parle, un vertige, le noir. Et après ? Plus rien." },
  { mode: "room",  text: "Ton téléphone sur le bureau est noir, muet. Tu essaies de l'allumer. Rien." },
  { mode: "room",  text: "Sur la porte : « N-27 · Habitant · Niveau 0 ». Il faut sortir voir." },
];

export default function BunkerAwake({ onGo, j3 }) {
  const steps = j3?.flags?.from_finjeu2 ? STEPS_SUITE : STEPS;
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const advance = () => { if (!isLast) setStep(step + 1); };

  if (current.mode === "black") {
    return (
      <div onClick={advance}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: "100%", height: "100%",
          background: "#000", cursor: "pointer", padding: 24, boxSizing: "border-box",
        }}>
        <p style={{
          color: "#e8eef5", textAlign: "center", margin: 0,
          fontFamily: "Georgia, serif",
          fontSize: current.big ? 32 : 18,
          lineHeight: 1.5,
          letterSpacing: current.big ? 1 : 0,
          maxWidth: 760,
          opacity: 0.95,
        }}>
          {current.text}
        </p>
      </div>
    );
  }

  /* mode "room" */
  return (
    <div onClick={advance}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", height: "100%", padding: 8, boxSizing: "border-box", cursor: isLast ? "default" : "pointer" }}>
      <RoomSvg dim={current.dim || 0} />

      <div style={{ maxWidth: 780, textAlign: "center", minHeight: 72 }}>
        {current.text ? (
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#c8d4e2", margin: 0, fontStyle: "italic" }}>
            « {current.text} »
          </p>
        ) : null}
        {isLast && (
          <div style={{ marginTop: 14 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => onGo("hub")} autoFocus
              style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 10, padding: "12px 26px", fontWeight: 800, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 2, boxShadow: "0 0 18px rgba(94,255,158,0.35)" }}>
              ▶ SORTIR DANS LE COULOIR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------- La chambre N-27 : le même décor que la chambre jouable --------- */
function RoomSvg({ dim }) {
  return (
    <svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", flex: 1, minHeight: 0 }}>
      <ChambreN27Decor dim={dim} veste="off"
        deskExtras={
          /* ton téléphone, noir, muet, posé sur le bureau */
          <g transform="translate(96,-6)">
            <rect x="0" y="0" width="26" height="5" rx="1.5" fill="#0a0e14" stroke="#3a4048" strokeWidth="0.6" />
            <rect x="2" y="1" width="22" height="2.4" fill="#1a1e26" />
          </g>
        } />
    </svg>
  );
}
