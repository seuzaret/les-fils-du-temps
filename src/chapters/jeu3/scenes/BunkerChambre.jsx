import { useEffect, useState } from "react";
import MediadexPanel from "../MediadexPanel.jsx";
import ChambreN27Decor from "../ChambreN27Decor.jsx";
import { CaillouTrouve } from "../CaillouPapier.jsx";
import { caillouDispo, CAILLOU } from "../cailloux.js";

/* ============================================================
   JEU 3 — SCÈNE : « Ma chambre » (N-27)
   ------------------------------------------------------------
   Deux objets interactifs :
   - la vieille veste de chronaute, dans le carton « N-27 ·
     EFFETS » : dans sa doublure, le premier caillou d'Al3x1a
     (cailloux.js, flag caillou_veste) ;
   - un vieux médiadex posé sur le bureau (aide-mémoire des
     dates des époques du Jeu 1, utile pour la mission Archives
     avec Jorge). Première ouverture → pose le flag
     "mediadex_retrouve" + un petit mot de reconnaissance.
   ============================================================ */
export default function BunkerChambre({ onGo, j3 }) {
  const [mediadexOpen, setMediadexOpen] = useState(false);
  const [mediadexJustFound, setMediadexJustFound] = useState(false);
  const mediadexRetrouve = !!j3.flags.mediadex_retrouve;
  /* La veste : le premier caillou d'Al3x1a, dans la doublure. */
  const caillouVeste = caillouDispo("veste", j3.flags);
  const [vesteOpen, setVesteOpen] = useState(false);
  const [vesteDejaVue, setVesteDejaVue] = useState(false);
  useEffect(() => {
    if (!vesteDejaVue) return;
    const t = setTimeout(() => setVesteDejaVue(false), 4000);
    return () => clearTimeout(t);
  }, [vesteDejaVue]);
  const openMediadex = () => {
    if (!mediadexRetrouve) {
      j3.setFlag("mediadex_retrouve");
      setMediadexJustFound(true);
    }
    setMediadexOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <ChambreN27Decor onDoor={() => onGo(j3.hubRoom || "hub")}
          veste={caillouVeste ? "on" : "off"}
          onVeste={() => (caillouVeste ? setVesteOpen(true) : setVesteDejaVue(true))}
          deskExtras={<>
            {/* Carnet + stylo → remplacés par le MÉDIADEX cliquable, posé
                sur le bureau. Pulse doré léger tant qu'on ne l'a pas
                encore retrouvé, puis statique. */}
            <g transform="translate(90,-10)" onClick={openMediadex} style={{ cursor: "pointer" }}>
              {!mediadexRetrouve && (
                <circle cx="18" cy="4" r="22" fill="none" stroke="#c8a848" strokeWidth="1.5" strokeDasharray="3 3">
                  <animate attributeName="r" values="18;26;18" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              <rect x="0" y="0" width="36" height="8" fill="#5a2820" stroke="#1a0e08" strokeWidth="0.6" />
              <rect x="0" y="0" width="36" height="2" fill="#c8a848" />
              <text x="18" y="6.2" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4" fontWeight="800" fill="#e8dfc8">MÉDIADEX</text>
              {!mediadexRetrouve && (
                <text x="18" y="-6" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="7" fill="#c8a848" fontStyle="italic">médiadex</text>
              )}
            </g>
          </>} />
      </svg>

      {/* Petit message d'ambiance selon l'état de la veste */}
      <div style={{ maxWidth: 800, width: "100%" }}>
        {caillouVeste ? (
          <div style={{ background: "#141008", border: "1px dashed #c8a848", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#e8dfc8", fontStyle: "italic" }}>
              Au pied du lit, le carton « N-27 · EFFETS ». Une vieille veste en dépasse. La tienne ? Clique dessus.
            </p>
          </div>
        ) : (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#7a879e", fontStyle: "italic" }}>
              Rien de familier ici, à part cette vieille veste. Un panneau signé « MARTINE, Réseau M » diffuse en boucle qu'il est interdit de sortir.
            </p>
          </div>
        )}
      </div>

      <button onClick={() => onGo(j3.hubRoom || "hub")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Retour au couloir
      </button>

      {mediadexOpen && (
        <MediadexPanel onClose={() => { setMediadexOpen(false); setMediadexJustFound(false); }} />
      )}
      {vesteOpen && (
        <CaillouTrouve caillou={CAILLOU.veste} onGarder={() => { j3.setFlag(CAILLOU.veste.flag); setVesteOpen(false); }} />
      )}
      {vesteDejaVue && (
        <div onClick={() => setVesteDejaVue(false)}
          style={{ position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", background: "#141008", border: "1px solid #8a7a5a", borderRadius: 10, padding: "10px 16px", maxWidth: 480, zIndex: 300, cursor: "pointer" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#e8dfc8", fontFamily: "Georgia, serif", fontStyle: "italic", textAlign: "center" }}>
            La doublure est décousue : tu as déjà pris le papier. Il est dans tes cailloux 🪨.
          </p>
        </div>
      )}
      {mediadexJustFound && !mediadexOpen && (
        <div style={{
          position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)",
          background: "#141008", border: "1px solid #c8a848", borderRadius: 10,
          padding: "10px 16px", maxWidth: 480, zIndex: 300,
          boxShadow: "0 0 24px rgba(200,168,72,0.3)",
        }}>
          <p style={{ margin: 0, fontSize: 14, color: "#e8dfc8", fontFamily: "Georgia, serif", fontStyle: "italic", textAlign: "center" }}>
            « Mais oui — mon médiadex. Les dates que j'ai notées au Jeu 1 sont là-dedans. Je garde ça sous la main. »
          </p>
        </div>
      )}
    </div>
  );
}
