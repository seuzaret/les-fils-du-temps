import { useState } from "react";
import { useWinOnce } from "../engine/useWinOnce.js";

/* ============================================================
   MINI-JEU : « La note du copiste » (le prix fou d'un livre)
   ------------------------------------------------------------
   Le frère Jorge présente la FACTURE d'une copie manuscrite : le
   détail des frais en livres tournois, avec un ordre de grandeur
   en euros d'aujourd'hui. Puis on PAIE : on compose la somme exacte
   avec des pièces. La leçon : avant l'imprimerie, un seul livre
   valait une fortune — le savoir était réservé aux riches.

   Le contenu (postes, montants) vient du data.js (chapter.facture),
   modifiable par l'enseignant.
   ============================================================ */

export function FactureGame({ facture, onClose, onWin }) {
  const total = facture.lignes.reduce((s, l) => s + l.lt, 0);
  const [purse, setPurse] = useState([]);            // pièces posées
  const [flash, setFlash] = useState(null);
  const [won, setWon] = useState(false);
  useWinOnce(won, onWin);
  const somme = purse.reduce((s, v) => s + v, 0);


  const eur = (lt) => (lt * facture.euroParLt).toLocaleString("fr-FR");

  const poser = (v) => { if (!won) { setPurse((p) => [...p, v]); setFlash(null); } };
  const vider = () => { setPurse([]); setFlash(null); };
  const payer = () => {
    if (somme === total) { setWon(true); return; }
    setFlash(somme > total
      ? `Trop ! Tu as posé ${somme} lt, mais la note est de ${total} lt. Retire des pièces.`
      : `Il manque ${total - somme} livres tournois. Continue d'ajouter des pièces.`);
  };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "2px solid #e8934a66", borderRadius: 18, padding: 20, maxWidth: 620, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e8934a" }}>💰 LE PRIX DU SAVOIR</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 10px", color: "#ffd166", fontSize: 20 }}>{facture.titre}</h2>

        {/* LA NOTE, façon parchemin */}
        <div style={{ background: "linear-gradient(160deg,#efe2c2,#dcc99e)", color: "#3a2c18", borderRadius: 10, padding: "12px 16px", border: "2px solid #b09a6e", fontFamily: "Palatino, Georgia, serif" }}>
          {facture.lignes.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "3px 0", borderBottom: "1px dotted #b09a6e88", fontSize: 15 }}>
              <span>{l.poste}</span>
              <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>{l.lt} lt <span style={{ color: "#7a5a30", fontWeight: 400 }}>(~{eur(l.lt)} €)</span></span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 16, fontWeight: 800 }}>
            <span>TOTAL</span>
            <span>{total} livres tournois <span style={{ color: "#7a5a30", fontWeight: 500 }}>(~{eur(total)} €)</span></span>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "#c8d4e2", fontStyle: "italic", margin: "10px 0 0" }}>{facture.note}</p>

        {!won ? (
          <>
            <p style={{ fontSize: 15, color: "#e8eef5", textAlign: "center", margin: "12px 0 6px" }}>
              À toi de payer : compose <strong style={{ color: "#ffd166" }}>{total} livres tournois</strong> avec les pièces.
            </p>
            {/* les pièces d'or */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {facture.coins.map((v, i) => (
                <button key={i} onClick={() => poser(v)}
                  style={{ width: 64, height: 64, borderRadius: "50%", cursor: "pointer", border: "3px solid #a8842a", background: "radial-gradient(circle at 40% 35%, #ffe08a, #d8a838 70%, #b0842a)", color: "#5a3f10", fontWeight: 800, fontFamily: "ui-monospace,monospace", fontSize: 16, boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }}>
                  {v}<br /><span style={{ fontSize: 11 }}>lt</span>
                </button>
              ))}
            </div>
            {/* la bourse */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 12 }}>
              <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, color: "#8fa3bd" }}>👛 Bourse :</span>
              <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 18, fontWeight: 800, color: somme === total ? "#5eff9e" : somme > total ? "#e8934a" : "#ffd166" }}>{somme} / {total} lt</span>
            </div>
            <p style={{ minHeight: 18, textAlign: "center", color: "#e8934a", fontSize: 14, fontStyle: "italic", margin: "6px 0 0" }}>{flash}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={vider}
                style={{ flex: "0 0 auto", background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "11px 18px", fontWeight: 700, cursor: "pointer", fontSize: 14.5, fontFamily: "ui-monospace,monospace" }}>
                ✕ Vider la bourse
              </button>
              <button onClick={payer}
                style={{ flex: 1, background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                ✓ Payer la note
              </button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 12 }}>
            <div style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Payé ! Tu empoches la copie du traité de Galien — le remède est dedans. Mais tu as vu le prix : une FORTUNE, une année de travail d'un moine, de l'or pour les lettres. Voilà pourquoi, au Moyen Âge, le savoir est un luxe : réservé aux seigneurs, aux évêques, aux riches. Maintenant, rapporte vite ce livre au château et remets-le au PRÊTRE — car un livre ne soigne personne tant que quelqu'un ne sait pas le LIRE. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✓ Le traité de Galien est payé et emporté !
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
