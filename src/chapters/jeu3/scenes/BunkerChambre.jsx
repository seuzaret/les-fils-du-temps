import { useState } from "react";
import MediadexPanel from "../MediadexPanel.jsx";

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
  const mission = j3.missions.carnet;
  const unlocked = !!j3.flags[mission?.prerequisite];
  const done = !!j3.flags[mission?.flag];
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState({}); // { q1: true, q2: false, ... }
  const [checked, setChecked] = useState(false);
  const [mediadexOpen, setMediadexOpen] = useState(false);
  const [mediadexJustFound, setMediadexJustFound] = useState(false);
  const mediadexRetrouve = !!j3.flags.mediadex_retrouve;
  const openMediadex = () => {
    if (!mediadexRetrouve) {
      j3.setFlag("mediadex_retrouve");
      setMediadexJustFound(true);
    }
    setMediadexOpen(true);
  };
  const allAnswered = mission ? mission.questions.every((q) => typeof answers[q.id] === "boolean") : false;
  const allCorrect = mission ? mission.questions.every((q) => answers[q.id] === q.vrai) : false;

  const submit = () => {
    setChecked(true);
    if (allCorrect) j3.setFlag(mission.flag);
  };
  const retry = () => { setChecked(false); setAnswers({}); };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="bc-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2f38" />
            <stop offset="100%" stopColor="#141820" />
          </linearGradient>
          <linearGradient id="bc-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1e26" />
            <stop offset="100%" stopColor="#050810" />
          </linearGradient>
          <radialGradient id="bc-light" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#f0f4ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f0f4ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Murs + plafond + sol en perspective */}
        <rect width="1000" height="520" fill="url(#bc-wall)" />
        <rect x="0" y="0" width="1000" height="70" fill="#1a1e26" />
        <rect x="340" y="24" width="320" height="14" rx="3" fill="#e8eef5" opacity="0.85" />
        <ellipse cx="500" cy="42" rx="260" ry="200" fill="url(#bc-light)" />
        <rect x="0" y="400" width="1000" height="120" fill="url(#bc-floor)" />
        <path d="M0 400 L1000 400" stroke="#3a4048" strokeWidth="1" />
        {[80, 200, 380, 620, 800, 920].map((x) => (
          <path key={x} d={`M${x} 400 L${x + (x - 500) * 0.13} 520`} stroke="#0a0e14" strokeWidth="1" opacity="0.6" />
        ))}
        <path d="M0 460 L1000 460" stroke="#0a0e14" strokeWidth="0.6" opacity="0.5" />

        {/* ARMOIRE HAUTE à gauche */}
        <g transform="translate(80,180)">
          <rect x="0" y="0" width="120" height="220" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
          <line x1="60" y1="10" x2="60" y2="210" stroke="#0a0e14" strokeWidth="1" />
          <circle cx="52" cy="120" r="3" fill="#c8a848" />
          <circle cx="68" cy="120" r="3" fill="#c8a848" />
          <rect x="30" y="18" width="60" height="14" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.5" />
          <text x="60" y="28" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700" fill="#3a2010">N-27</text>
          <line x1="10" y1="14" x2="10" y2="206" stroke="#5a6270" strokeWidth="0.5" opacity="0.7" />
        </g>

        {/* ÉTAGÈRE MURALE (2 planches) — porte le carnet noir de la mission */}
        <g transform="translate(240,220)">
          <rect x="0" y="0" width="140" height="4" fill="#3a4048" />
          <rect x="0" y="60" width="140" height="4" fill="#3a4048" />
          {/* Livres alignés sur planche haute */}
          {[[6, "#5a3818", 30], [18, "#8a3820", 28], [30, "#5a2818", 32], [44, "#8a5030", 26], [58, "#3a2818", 30]].map(([x, c, h], i) => (
            <rect key={i} x={x} y={-h} width="10" height={h} fill={c} stroke="#0a0806" strokeWidth="0.3" />
          ))}
          {/* Gobelet + petit cadre */}
          <rect x="80" y="-20" width="14" height="20" rx="1" fill="#c8b090" stroke="#3a2818" strokeWidth="0.5" />
          <rect x="102" y="-24" width="20" height="24" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.6" />
          <rect x="105" y="-21" width="14" height="18" fill="#5a6270" opacity="0.7" />
          {/* Planche basse : quelques livres + le CARNET NOIR (cliquable si mission débloquée) */}
          {[[10, "#5a4028", 26], [22, "#8a5030", 24], [34, "#3a2818", 28]].map(([x, c, h], i) => (
            <rect key={`b${i}`} x={x} y={64 + 64 - h} width="10" height={h} fill={c} stroke="#0a0806" strokeWidth="0.3" />
          ))}
          {unlocked && !done && !open && (
            <g transform="translate(60,80)" onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
              <circle cx="18" cy="24" r="32" fill="none" stroke="#e0a848" strokeWidth="2" strokeDasharray="4 4">
                <animate attributeName="r" values="26;34;26" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <rect x="0" y="0" width="36" height="48" fill="#0a0806" stroke="#8a5030" strokeWidth="1.4" />
              <path d="M4 6 L32 6 M4 12 L26 12 M4 18 L28 18 M4 24 L30 24" stroke="#e8dfc8" strokeWidth="0.6" opacity="0.6" />
              <text x="18" y="-6" textAnchor="middle" fontFamily="Palatino, Georgia, serif" fontSize="10" fill="#e0a848" fontStyle="italic">carnet noir</text>
            </g>
          )}
          {done && (
            <g transform="translate(60,80)">
              <rect x="0" y="0" width="36" height="48" fill="#0a0806" stroke="#5eff9e" strokeWidth="1.2" />
              <path d="M4 6 L32 6 M4 12 L26 12 M4 18 L28 18 M4 24 L30 24" stroke="#e8dfc8" strokeWidth="0.6" opacity="0.6" />
            </g>
          )}
        </g>

        {/* POSTER MURAL (Réseau M) — à la place de l'ancien panneau */}
        <g transform="translate(430,90)">
          <rect x="0" y="0" width="220" height="130" fill="#0e1a30" stroke="#5eff9e" strokeWidth="2" />
          <text x="110" y="22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fontWeight="800" fill="#5eff9e" letterSpacing="2">◈ RÉSEAU M</text>
          <text x="110" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2">Bienvenue, HABITANT N-27.</text>
          <text x="110" y="62" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8d4e2">Niveau 4 · Secteur H</text>
          <text x="110" y="88" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7a879e">Rappel : la surface est</text>
          <text x="110" y="100" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7a879e">encore inhabitable.</text>
          <text x="110" y="122" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e" letterSpacing="1">— MARTINE, Réseau M —</text>
        </g>

        {/* RADIATEUR mural sous le poster */}
        <g transform="translate(430,230)">
          <rect x="0" y="0" width="220" height="20" fill="#5a6270" stroke="#0a0e14" strokeWidth="1" />
          {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="20" stroke="#0a0e14" strokeWidth="0.6" />
          ))}
          <circle cx="216" cy="10" r="4" fill="#c8a848" stroke="#3a2010" strokeWidth="0.5" />
        </g>

        {/* LIT au premier plan */}
        <g transform="translate(220,340)">
          <rect x="0" y="0" width="360" height="80" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
          <rect x="0" y="0" width="360" height="6" fill="#5a6270" />
          <path d="M4 8 Q90 -6 180 12 Q270 26 356 8 L356 44 Q270 52 180 44 Q90 38 4 44 Z" fill="#5a6270" />
          <rect x="8" y="6" width="80" height="26" rx="4" fill="#e8eef5" stroke="#8a9098" strokeWidth="0.6" />
          <rect x="4" y="80" width="10" height="34" fill="#1a1e26" />
          <rect x="346" y="80" width="10" height="34" fill="#1a1e26" />
        </g>

        {/* BUREAU + CHAISE + LAMPE à droite */}
        <g transform="translate(640,360)">
          <rect x="0" y="0" width="140" height="8" fill="#5a4028" stroke="#1a0e08" strokeWidth="1" />
          <rect x="4" y="8" width="10" height="52" fill="#3a2818" />
          <rect x="126" y="8" width="10" height="52" fill="#3a2818" />
          <rect x="20" y="12" width="100" height="16" fill="#3a2818" stroke="#0a0806" strokeWidth="0.5" />
          <circle cx="70" cy="20" r="1.6" fill="#c8a848" />
          {/* Chaise */}
          <rect x="50" y="70" width="40" height="6" fill="#3a4048" />
          <rect x="52" y="76" width="4" height="26" fill="#3a4048" />
          <rect x="84" y="76" width="4" height="26" fill="#3a4048" />
          <rect x="50" y="40" width="40" height="4" fill="#3a4048" />
          <rect x="50" y="44" width="4" height="26" fill="#3a4048" />
          {/* Lampe articulée */}
          <circle cx="30" cy="0" r="3" fill="#3a4048" />
          <line x1="30" y1="0" x2="46" y2="-24" stroke="#5a6270" strokeWidth="1.6" />
          <line x1="46" y1="-24" x2="58" y2="-14" stroke="#5a6270" strokeWidth="1.6" />
          <path d="M52 -20 L64 -8 L54 -4 Z" fill="#c8a848" stroke="#3a2010" strokeWidth="0.5" />
          <circle cx="58" cy="-8" r="4" fill="#ffd870" opacity="0.6" />
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
          <line x1="112" y1="-6" x2="128" y2="-14" stroke="#3a2010" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* GRANDE PORTE à droite extrême — cliquable pour sortir au couloir */}
        <g transform="translate(840,180)"
          onClick={() => onGo(j3.hubRoom || "hub")}
          style={{ cursor: "pointer" }}>
          <rect x="0" y="0" width="140" height="240" fill="#5a4028" stroke="#0a0806" strokeWidth="3" />
          <rect x="4" y="4" width="132" height="232" fill="#4a3020" />
          <rect x="14" y="14" width="112" height="80" fill="none" stroke="#3a2010" strokeWidth="1" />
          <rect x="14" y="106" width="112" height="120" fill="none" stroke="#3a2010" strokeWidth="1" />
          <circle cx="118" cy="118" r="5" fill="#c8a848" stroke="#3a2010" strokeWidth="0.6" />
          <rect x="26" y="34" width="88" height="30" fill="#e8eef5" stroke="#3a2818" strokeWidth="1.5" />
          <text x="70" y="46" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fontWeight="800" fill="#0a0806" letterSpacing="1">N-27</text>
          <text x="70" y="58" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#5a4028">HABITANT · N4</text>
          <circle cx="70" cy="86" r="3" fill="#5eff9e">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Petit tapis au pied du lit */}
        <ellipse cx="400" cy="440" rx="120" ry="14" fill="#5a3818" opacity="0.55" />
      </svg>

      {/* Panneau bas selon l'état de la mission carnet */}
      <div style={{ maxWidth: 800, width: "100%" }}>
        {done ? (
          <div style={{ background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#5eff9e" }}>
              ✓ CARNET VÉRIFIÉ
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#e8eef5" }}>{mission.succes}</p>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {mission.questions.map((q) => (
                <div key={q.id} style={{ fontSize: 12, color: "#c8d4e2", lineHeight: 1.5 }}>
                  <strong style={{ color: q.vrai ? "#5eff9e" : "#e0a848" }}>{q.vrai ? "VRAI" : "FAUX"}</strong>
                  {" — "}{q.explication}
                </div>
              ))}
            </div>
          </div>
        ) : open ? (
          <div style={{ background: "#141020", border: "1px solid #e0a848", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848" }}>
              📓 {mission.titre.toUpperCase()}
            </div>
            <p style={{ margin: "4px 0 10px", fontSize: 13, lineHeight: 1.5, color: "#c8d4e2" }}>{mission.briefing}</p>
            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mission.questions.map((q, i) => {
                const val = answers[q.id];
                const wrongAfterCheck = checked && val !== q.vrai;
                return (
                  <div key={q.id} style={{ background: "#0a0e14", border: `1px solid ${wrongAfterCheck ? "#e0a848" : "#2a3648"}`, borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ fontSize: 13, color: "#e8eef5", lineHeight: 1.4 }}>
                      <strong style={{ color: "#e0a848", fontFamily: "ui-monospace,monospace", fontSize: 11 }}>{i + 1}.</strong>{" "}{q.prompt}
                    </div>
                    <div style={{ fontSize: 11, color: "#7a879e", fontStyle: "italic", marginTop: 3 }}>💡 {q.indice}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      {[true, false].map((b) => (
                        <button key={String(b)} onClick={() => setAnswers((a) => ({ ...a, [q.id]: b }))}
                          disabled={checked}
                          style={{
                            background: val === b ? (b ? "#0e3a1a" : "#3a1a0e") : "#141b26",
                            color: val === b ? (b ? "#5eff9e" : "#e0a848") : "#8fa3bd",
                            border: `1px solid ${val === b ? (b ? "#5eff9e" : "#e0a848") : "#3a4048"}`,
                            borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 700,
                            cursor: checked ? "default" : "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1,
                          }}>
                          {b ? "VRAI" : "FAUX"}
                        </button>
                      ))}
                      {checked && val !== q.vrai && (
                        <span style={{ fontSize: 11, color: "#e0a848", alignSelf: "center", fontStyle: "italic" }}>
                          → à revérifier
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Bouton valider ou réessayer */}
            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
              {!checked ? (
                <button onClick={submit} disabled={!allAnswered}
                  style={{ background: allAnswered ? "#e0a848" : "#3a3020", color: "#0a0806", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 800, cursor: allAnswered ? "pointer" : "default", fontFamily: "ui-monospace,monospace", letterSpacing: 2 }}>
                  ✓ VALIDER MES RÉPONSES
                </button>
              ) : allCorrect ? null : (
                <>
                  <span style={{ fontSize: 12, color: "#e0a848", fontStyle: "italic" }}>{mission.echec}</span>
                  <button onClick={retry}
                    style={{ background: "#141b26", color: "#e0a848", border: "1px solid #5a4028", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                    ↺ Réessayer
                  </button>
                </>
              )}
            </div>
          </div>
        ) : unlocked ? (
          <div style={{ background: "#141020", border: "1px dashed #e0a848", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c8b090", fontStyle: "italic" }}>
              Un vieux carnet noir a été laissé sur ton étagère. Clique dessus pour l'ouvrir.
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
