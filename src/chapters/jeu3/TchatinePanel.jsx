import { useMemo, useState } from "react";

/* ============================================================
   JEU 3 — Panel Tchatine (fil réseau social à décrypter)
   ------------------------------------------------------------
   Mobile centré, 4 publications, 4 étiquettes à poser. À chaque
   post : un bouton 🔎 WebToile qui ouvre une modale de résultats
   pré-écrits. Après classement complet → bouton Valider → bilan
   et pose du flag si 4/4.
   ============================================================ */

export default function TchatinePanel({ mission, onDone, onClose }) {
  const [choices, setChoices] = useState({}); // postId → etiquetteId
  const [checked, setChecked] = useState(false);
  const [webtoile, setWebtoile] = useState(null); // post ouvert dans la modale
  const [etiOpen, setEtiOpen] = useState(null); // post dont le picker est ouvert

  const posts = mission.posts;
  const etiquettes = mission.etiquettes;
  const allClassified = posts.every((p) => choices[p.id]);
  const score = useMemo(() => posts.filter((p) => choices[p.id] === p.intention).length, [posts, choices]);
  const perfect = score === posts.length;

  const submit = () => {
    setChecked(true);
    if (perfect) onDone?.();
  };
  const retry = () => { setChecked(false); setChoices({}); };

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={{ display: "flex", gap: 20, maxWidth: 1200, width: "100%", alignItems: "flex-start" }} onClick={(e) => e.stopPropagation()}>
        {/* Téléphone */}
        <div style={phoneFrame}>
          <div style={phoneNotch} />
          <div style={phoneStatus}>
            <span>23:14</span>
            <span>Niv.-27</span>
            <span>▮▮▮▯</span>
          </div>
          <div style={phoneHeader}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#f08ad0", letterSpacing: 1 }}>◉ Tchatine</span>
            <span style={{ fontSize: 10, color: "#5a6678" }}>fil du soir</span>
          </div>
          <div style={phoneScroll}>
            {posts.map((p, i) => {
              const picked = choices[p.id];
              const eti = etiquettes.find((e) => e.id === picked);
              const correctAfterCheck = checked && picked === p.intention;
              const wrongAfterCheck = checked && picked !== p.intention;
              return (
                <article key={p.id} style={{
                  background: "#131922", borderRadius: 12, padding: 10, marginBottom: 10,
                  border: correctAfterCheck ? "2px solid #5eff9e" : wrongAfterCheck ? "2px solid #ff8a60" : "1px solid #2a3240",
                }}>
                  {/* en-tête auteur */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={avatarCircle}>{p.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e8eef5", display: "flex", alignItems: "center", gap: 4 }}>
                        {p.auteur}
                        {p.verifiedBadge && <span style={{ color: "#7fd8ff", fontSize: 11 }}>✓</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "#5a6678" }}>{p.temps}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#5a6678" }}>#{i + 1}</div>
                  </div>
                  {/* texte */}
                  <p style={{ margin: "8px 0 6px", fontSize: 12.5, lineHeight: 1.45, color: "#dbe4ef" }}>{p.texte}</p>
                  {/* media */}
                  <PostMedia media={p.media} />
                  {/* stats */}
                  <div style={{ display: "flex", gap: 12, fontSize: 10.5, color: "#7a879e", marginTop: 6, fontFamily: "ui-monospace,monospace" }}>
                    <span>♥ {p.stats.likes}</span>
                    <span>↻ {p.stats.partages}</span>
                    <span>💬 {p.stats.commentaires}</span>
                  </div>
                  {/* actions : WebToile + choix d'étiquette */}
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <button onClick={() => setWebtoile(p)} style={btnWebtoile} disabled={checked}>🔎 Vérifier sur WebToile</button>
                    {picked ? (
                      <button onClick={() => !checked && setEtiOpen(p.id)}
                        disabled={checked}
                        style={{
                          background: eti.couleur, color: "#0a0806", border: "none", borderRadius: 999,
                          padding: "4px 12px", fontSize: 11, fontWeight: 800, letterSpacing: 1,
                          cursor: checked ? "default" : "pointer", fontFamily: "ui-monospace,monospace",
                        }}>
                        {eti.label.toUpperCase()} {!checked && "✎"}
                      </button>
                    ) : (
                      <button onClick={() => setEtiOpen(p.id)} style={btnChoose} disabled={checked}>
                        ↳ classer l'intention
                      </button>
                    )}
                  </div>
                  {/* feedback après validation */}
                  {checked && (
                    <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: correctAfterCheck ? "#0e2818" : "#2a1810", fontSize: 11.5, color: correctAfterCheck ? "#5eff9e" : "#ffb080", lineHeight: 1.45 }}>
                      {correctAfterCheck ? "✓ " : "✗ Bonne étiquette : "}
                      {!correctAfterCheck && <strong>{etiquettes.find((e) => e.id === p.intention).label}. </strong>}
                      {p.indice}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {/* barre bas téléphone */}
          <div style={phoneHome} />
        </div>

        {/* Panneau latéral : briefing + étiquettes + valider */}
        <aside style={side}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#f08ad0" }}>
            📱 {mission.titre.toUpperCase()}
          </div>
          <p style={{ margin: "8px 0 12px", fontSize: 13, lineHeight: 1.55, color: "#c8d4e2" }}>{mission.briefing}</p>

          <div style={{ fontSize: 11, color: "#8fa3bd", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Les 4 intentions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {etiquettes.map((e) => (
              <div key={e.id} style={{ background: "#0a0e14", border: `1px solid ${e.couleur}`, borderRadius: 8, padding: "6px 10px" }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: e.couleur, letterSpacing: 1, fontFamily: "ui-monospace,monospace" }}>{e.label.toUpperCase()}</div>
                <div style={{ fontSize: 11.5, color: "#c8d4e2", lineHeight: 1.4, marginTop: 2 }}>{e.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            {!checked ? (
              <button onClick={submit} disabled={!allClassified}
                style={{
                  width: "100%", background: allClassified ? "#f08ad0" : "#3a2a35", color: "#0a0806",
                  border: "none", borderRadius: 8, padding: "10px 20px",
                  fontSize: 13, fontWeight: 800, letterSpacing: 2, fontFamily: "ui-monospace,monospace",
                  cursor: allClassified ? "pointer" : "default",
                }}>
                ✓ VALIDER MES CHOIX
              </button>
            ) : perfect ? (
              <div style={{ background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ color: "#5eff9e", fontSize: 11, letterSpacing: 2, fontFamily: "ui-monospace,monospace" }}>✓ 4 / 4 — INTENTIONS NOMMÉES</div>
                <p style={{ margin: "6px 0 10px", fontSize: 12.5, color: "#dbe4ef", lineHeight: 1.5 }}>{mission.succes}</p>
                <button onClick={onClose} style={btnDone}>Fermer</button>
              </div>
            ) : (
              <div style={{ background: "#2a1810", border: "1px solid #e0a848", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ color: "#e0a848", fontSize: 11, letterSpacing: 2, fontFamily: "ui-monospace,monospace" }}>⟲ {score} / {posts.length} — à reprendre</div>
                <p style={{ margin: "6px 0 10px", fontSize: 12.5, color: "#dbe4ef", lineHeight: 1.5 }}>{score >= posts.length - 1 ? mission.partiel : mission.echec}</p>
                <button onClick={retry} style={btnRetry}>↺ Réessayer</button>
              </div>
            )}
          </div>

          <button onClick={onClose} style={btnQuit}>← Reposer la tablette</button>
        </aside>
      </div>

      {/* Modale picker d'étiquette */}
      {etiOpen && (
        <div style={pickerBackdrop} onClick={() => setEtiOpen(null)}>
          <div style={pickerCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#f08ad0", marginBottom: 8 }}>
              CLASSER CE POST
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {etiquettes.map((e) => (
                <button key={e.id}
                  onClick={() => { setChoices((c) => ({ ...c, [etiOpen]: e.id })); setEtiOpen(null); }}
                  style={{
                    background: "#0a0e14", color: e.couleur, border: `1px solid ${e.couleur}`,
                    borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 800,
                    letterSpacing: 1, fontFamily: "ui-monospace,monospace", textAlign: "left", cursor: "pointer",
                  }}>
                  {e.label}
                </button>
              ))}
            </div>
            <button onClick={() => setEtiOpen(null)} style={{ ...btnQuit, marginTop: 10 }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Modale WebToile */}
      {webtoile && (
        <div style={pickerBackdrop} onClick={() => setWebtoile(null)}>
          <div style={webtoileCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>🕸️</span>
              <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, color: "#7fd8ff", letterSpacing: 2 }}>WebToile</span>
              <span style={{ fontSize: 10, color: "#5a6678" }}>— moteur de recherche du bunker</span>
            </div>
            <div style={searchBar}>🔎 <span style={{ color: "#e8eef5" }}>{webtoile.webtoile.query}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {webtoile.webtoile.resultats.map((r, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${drapeauColor(r.drapeau)}`, padding: "4px 10px" }}>
                  <div style={{ fontSize: 10.5, color: "#7a879e", fontFamily: "ui-monospace,monospace" }}>{r.source}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#7fd8ff", marginTop: 1 }}>{r.titre}</div>
                  <div style={{ fontSize: 12, color: "#dbe4ef", lineHeight: 1.45, marginTop: 2 }}>{r.extrait}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setWebtoile(null)} style={{ ...btnQuit, marginTop: 14 }}>Fermer WebToile</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Visuel du media attaché au post : image statique, graphique
   animé pour la "propagande", ou mini-vidéo animée (cœurs/stars). */
function PostMedia({ media }) {
  if (!media) return null;
  if (media.kind === "graph") {
    return (
      <svg viewBox="0 0 220 90" style={{ width: "100%", height: 90, display: "block", borderRadius: 6, background: "#0a0e14", border: "1px solid #2a3240" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const h = 20 + i * 10;
          return (
            <g key={i}>
              <rect x={16 + i * 38} y={80 - h} width="24" height={h} fill="#5eff9e" opacity="0.7">
                <animate attributeName="height" values={`${h - 6};${h};${h - 6}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${80 - h + 6};${80 - h};${80 - h + 6}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </rect>
              <text x={28 + i * 38} y="88" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5a6678">M{i + 1}</text>
            </g>
          );
        })}
        <text x="200" y="20" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="12" fontWeight="800" fill="#5eff9e">97 %</text>
      </svg>
    );
  }
  /* image "vidéo" avec petits éléments animés */
  return (
    <svg viewBox="0 0 220 110" style={{ width: "100%", height: 110, display: "block", borderRadius: 6, background: "#1a1218", border: "1px solid #2a3240" }}>
      <defs>
        <linearGradient id="tv-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1830" />
          <stop offset="100%" stopColor="#0a0806" />
        </linearGradient>
      </defs>
      <rect width="220" height="110" fill="url(#tv-bg)" />
      <circle cx="110" cy="55" r="22" fill="#f08ad0" opacity="0.3">
        <animate attributeName="r" values="22;26;22" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="60" textAnchor="middle" fontSize="26">▶</text>
      {/* cœurs/étoiles qui montent (effet "live") */}
      {[0, 1, 2].map((i) => (
        <text key={i} x={30 + i * 70} y="98" fontSize="14" fill="#f08ad0">
          ♥
          <animate attributeName="y" values="98;10;98" dur={`${3 + i * 0.6}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur={`${3 + i * 0.6}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </text>
      ))}
      <text x="110" y="100" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8a97a8" opacity="0.7">{media.label}</text>
      <rect x="2" y="2" width="40" height="12" fill="#ff5a4a" rx="2" />
      <text x="22" y="11" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="800" fill="#fff">● LIVE</text>
    </svg>
  );
}

function drapeauColor(d) {
  if (d === "ok") return "#5eff9e";
  if (d === "attention") return "#e0a848";
  if (d === "danger") return "#ff5a4a";
  return "#5a6678";
}

/* ========== styles ========== */
const backdrop = {
  position: "fixed", inset: 0, background: "rgba(6,8,14,0.92)", zIndex: 400,
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  padding: "28px 20px", overflowY: "auto",
};
const phoneFrame = {
  width: 340, background: "#0a0e14", borderRadius: 32, border: "4px solid #2a2f38",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(240,138,208,0.08)",
  padding: "28px 12px 14px", position: "relative", flexShrink: 0,
};
const phoneNotch = {
  position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
  width: 100, height: 16, background: "#2a2f38", borderRadius: 10,
};
const phoneStatus = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8fa3bd",
  padding: "0 6px", marginBottom: 8,
};
const phoneHeader = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "4px 10px 8px", borderBottom: "1px solid #2a3240", marginBottom: 8,
};
const phoneScroll = {
  maxHeight: 480, overflowY: "auto", padding: "0 2px",
};
const phoneHome = {
  width: 100, height: 4, background: "#2a2f38", borderRadius: 4, margin: "10px auto 0",
};
const avatarCircle = {
  width: 32, height: 32, background: "#2a3240", borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
};
const btnWebtoile = {
  background: "#0a1a28", color: "#7fd8ff", border: "1px solid #3a6080",
  borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700,
  letterSpacing: 1, cursor: "pointer", fontFamily: "ui-monospace,monospace",
};
const btnChoose = {
  background: "transparent", color: "#f08ad0", border: "1px dashed #f08ad0",
  borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700,
  letterSpacing: 1, cursor: "pointer", fontFamily: "ui-monospace,monospace",
};
const side = {
  flex: 1, maxWidth: 440, background: "#131922", borderRadius: 12,
  border: "1px solid #2a3240", padding: 16, position: "sticky", top: 0,
};
const btnDone = {
  background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8,
  padding: "8px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer",
  fontFamily: "ui-monospace,monospace", letterSpacing: 2,
};
const btnRetry = {
  background: "#141b26", color: "#e0a848", border: "1px solid #5a4028",
  borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700,
  cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1,
};
const btnQuit = {
  width: "100%", marginTop: 10, background: "transparent", color: "#7a879e",
  border: "1px solid #3a4048", borderRadius: 8, padding: "7px 14px",
  fontSize: 11, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1,
};
const pickerBackdrop = {
  position: "fixed", inset: 0, background: "rgba(6,8,14,0.88)", zIndex: 500,
  display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
};
const pickerCard = {
  background: "#131922", border: "1px solid #f08ad0", borderRadius: 12,
  padding: 16, width: "100%", maxWidth: 360,
};
const webtoileCard = {
  background: "#0d141c", border: "1px solid #7fd8ff", borderRadius: 12,
  padding: 16, width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto",
};
const searchBar = {
  background: "#0a0e14", border: "1px solid #2a3240", borderRadius: 999,
  padding: "6px 14px", fontSize: 12, color: "#8fa3bd", fontFamily: "ui-monospace,monospace",
};
