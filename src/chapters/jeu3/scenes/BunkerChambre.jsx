import { useState } from "react";
import MediadexPanel from "../MediadexPanel.jsx";
import TchatinePanel from "../TchatinePanel.jsx";
import ChambreN27Decor from "../ChambreN27Decor.jsx";

/* ============================================================
   JEU 3 — SCÈNE : « Ma chambre » (N-27)
   ------------------------------------------------------------
   Deux objets interactifs :
   - un carnet noir sur l'étagère (mission OSINT, après Kova),
   - un vieux médiadex posé sur le bureau (aide-mémoire des
     dates des époques du Jeu 1, utile pour la mission Archives
     avec Jorge). Première ouverture → pose le flag
     "mediadex_retrouve" + un petit mot de reconnaissance.
   ============================================================ */
export default function BunkerChambre({ onGo, j3 }) {
  const [mediadexOpen, setMediadexOpen] = useState(false);
  const [mediadexJustFound, setMediadexJustFound] = useState(false);
  const mediadexRetrouve = !!j3.flags.mediadex_retrouve;
  /* Tchatine : tablette sur le lit, pulse rose tant que la mission
     n'est pas finie. Accessible dès que Kova est validée. */
  const tchatineMission = j3.missions.tchatine;
  const tchatineUnlocked = !!j3.flags[tchatineMission?.prerequisite];
  const tchatineDone = !!j3.flags[tchatineMission?.flag];
  const [tchatineOpen, setTchatineOpen] = useState(false);
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
        <ChambreN27Decor onDoor={() => onGo(j3.hubRoom || "hub")} shelfTablet={tchatineUnlocked ? null : "off"}
          bedExtras={<>
            {/* TABLETTE posée sur le lit — Tchatine. Pulse rose tant
                que la mission n'est pas faite. */}
            {tchatineUnlocked && (
              <g transform="translate(220,10)"
                onClick={() => setTchatineOpen(true)}
                style={{ cursor: "pointer" }}>
                {!tchatineDone && (
                  <circle cx="22" cy="30" r="34" fill="none" stroke="#f08ad0" strokeWidth="1.6" strokeDasharray="4 4">
                    <animate attributeName="r" values="28;38;28" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* corps tablette */}
                <rect x="0" y="0" width="44" height="60" rx="4" fill="#0a0e14"
                  stroke={tchatineDone ? "#5eff9e" : "#f08ad0"} strokeWidth="1.4" />
                <rect x="3" y="4" width="38" height="52" rx="1" fill="#131922" />
                {/* UI mini Tchatine à l'écran */}
                <text x="22" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4"
                  fontWeight="800" fill="#f08ad0" letterSpacing="0.5">◉ Tchatine</text>
                <rect x="6" y="16" width="32" height="6" fill="#1a1e26" rx="1" />
                <rect x="6" y="24" width="32" height="6" fill="#1a1e26" rx="1" />
                <rect x="6" y="32" width="32" height="6" fill="#1a1e26" rx="1" />
                <rect x="6" y="40" width="32" height="6" fill="#1a1e26" rx="1" />
                {/* petit point de notification */}
                {!tchatineDone && (
                  <circle cx="38" cy="4" r="3" fill="#ff5a4a">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                {!tchatineDone && (
                  <text x="22" y="-6" textAnchor="middle" fontFamily="Palatino, Georgia, serif"
                    fontSize="9" fill="#f08ad0" fontStyle="italic">tablette</text>
                )}
              </g>
            )}
          </>}
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

      {/* Petit message d'ambiance selon l'état de la tablette */}
      <div style={{ maxWidth: 800, width: "100%" }}>
        {tchatineDone ? (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#7a879e", fontStyle: "italic" }}>
              Ta tablette est posée sur le lit, écran noir. Tu as déjà fait le tri dans le fil du soir.
            </p>
          </div>
        ) : tchatineUnlocked ? (
          <div style={{ background: "#1a1020", border: "1px dashed #f08ad0", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#f0b0dc", fontStyle: "italic" }}>
              Ta tablette clignote sur le lit — Tchatine a de nouveaux posts. Clique dessus.
            </p>
          </div>
        ) : (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#7a879e", fontStyle: "italic" }}>
              Rien de familier ici. Un panneau signé « MARTINE, Réseau M » diffuse en boucle qu'il est interdit de sortir.
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
      {tchatineOpen && tchatineMission && (
        <TchatinePanel
          mission={tchatineMission}
          onDone={() => j3.setFlag(tchatineMission.flag)}
          onClose={() => setTchatineOpen(false)} />
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
