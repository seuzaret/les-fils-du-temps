import { useMemo, useState } from "react";

/* ============================================================
   JEU 3 — Panel Tchatine (fil réseau social à décrypter)
   ------------------------------------------------------------
   Grand téléphone centré. Un encart latéral porte le bouton
   WebToile et les 4 intentions. Les actions s'appliquent au
   post en cours de lecture (surligné quand on le touche).
   ============================================================ */

export default function TchatinePanel({ mission, onDone, onClose }) {
  const [choices, setChoices] = useState({}); // postId → etiquetteId
  const [checked, setChecked] = useState(false);
  const [webtoile, setWebtoile] = useState(null); // post ouvert dans la modale
  const [focused, setFocused] = useState(mission.posts[0]?.id || null);

  const posts = mission.posts;
  const etiquettes = mission.etiquettes;
  const allClassified = posts.every((p) => choices[p.id]);
  const score = useMemo(() => posts.filter((p) => choices[p.id] === p.intention).length, [posts, choices]);
  const perfect = score === posts.length;
  const focusedPost = posts.find((p) => p.id === focused);

  const classify = (etiId) => {
    if (!focused || checked) return;
    setChoices((c) => ({ ...c, [focused]: etiId }));
  };

  const submit = () => {
    setChecked(true);
    if (perfect) onDone?.();
  };
  const retry = () => { setChecked(false); setChoices({}); };

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={shell} onClick={(e) => e.stopPropagation()}>
        {/* Téléphone central, grand */}
        <div style={phoneFrame}>
          <div style={phoneNotch} />
          <div style={phoneStatus}>
            <span>23:14</span>
            <span style={{ color: "#f08ad0", fontWeight: 800 }}>◉ Tchatine</span>
            <span>▮▮▮▯</span>
          </div>
          <div style={phoneScroll}>
            {posts.map((p, i) => {
              const picked = choices[p.id];
              const eti = etiquettes.find((e) => e.id === picked);
              const correctAfterCheck = checked && picked === p.intention;
              const wrongAfterCheck = checked && picked !== p.intention;
              const isFocused = focused === p.id;
              return (
                <article key={p.id}
                  onClick={() => !checked && setFocused(p.id)}
                  style={{
                    background: "#131922", borderRadius: 14, padding: 14, marginBottom: 14,
                    border: correctAfterCheck ? "2px solid #5eff9e"
                      : wrongAfterCheck ? "2px solid #ff8a60"
                      : isFocused ? "2px solid #f08ad0"
                      : "1px solid #2a3240",
                    cursor: checked ? "default" : "pointer",
                    transition: "border-color 0.2s",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={avatarCircle}>{p.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eef5", display: "flex", alignItems: "center", gap: 4 }}>
                        {p.auteur}
                        {p.verifiedBadge && <span style={{ color: "#7fd8ff", fontSize: 13 }}>✓</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#5a6678" }}>{p.temps}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#5a6678" }}>#{i + 1}</div>
                  </div>
                  <p style={{ margin: "10px 0 8px", fontSize: 14, lineHeight: 1.5, color: "#dbe4ef" }}>{p.texte}</p>
                  <PostMedia media={p.media} />
                  <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "#7a879e", marginTop: 8, fontFamily: "ui-monospace,monospace" }}>
                    <span>♥ {p.stats.likes}</span>
                    <span>↻ {p.stats.partages}</span>
                    <span>💬 {p.stats.commentaires}</span>
                  </div>
                  {picked && (
                    <div style={{
                      marginTop: 10, display: "inline-block",
                      background: eti.couleur, color: "#0a0806", borderRadius: 999,
                      padding: "3px 12px", fontSize: 11, fontWeight: 800, letterSpacing: 1,
                      fontFamily: "ui-monospace,monospace",
                    }}>
                      {eti.label.toUpperCase()}
                    </div>
                  )}
                  {checked && (
                    <div style={{
                      marginTop: 8, padding: "6px 10px", borderRadius: 6,
                      background: correctAfterCheck ? "#0e2818" : "#2a1810",
                      fontSize: 12, color: correctAfterCheck ? "#5eff9e" : "#ffb080", lineHeight: 1.45,
                    }}>
                      {correctAfterCheck ? "✓ " : "✗ Bonne étiquette : "}
                      {!correctAfterCheck && <strong>{etiquettes.find((e) => e.id === p.intention).label}. </strong>}
                      {p.indice}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div style={phoneHome} />
        </div>

        {/* Encart latéral : WebToile + 4 intentions + valider */}
        <aside style={side}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#8fa3bd", marginBottom: 10 }}>
            POST SÉLECTIONNÉ {focused && <span style={{ color: "#f08ad0" }}>#{posts.findIndex((p) => p.id === focused) + 1}</span>}
          </div>

          <button onClick={() => focusedPost && setWebtoile(focusedPost)}
            disabled={!focusedPost || checked}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 10,
              background: focusedPost && !checked ? "#0a1a28" : "#1a1e26",
              color: focusedPost && !checked ? "#7fd8ff" : "#5a6678",
              border: `1.5px solid ${focusedPost && !checked ? "#3a80c8" : "#2a3240"}`,
              fontSize: 14, fontWeight: 800, letterSpacing: 1,
              cursor: focusedPost && !checked ? "pointer" : "default",
              fontFamily: "ui-monospace,monospace",
            }}>
            🔎 Vérifier sur WebToile
          </button>

          <div style={{ fontSize: 10, color: "#5a6678", textTransform: "uppercase", letterSpacing: 2, marginTop: 18, marginBottom: 8 }}>
            Classer ce post
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {etiquettes.map((e) => {
              const chosen = focusedPost && choices[focusedPost.id] === e.id;
              return (
                <button key={e.id}
                  onClick={() => classify(e.id)}
                  disabled={!focusedPost || checked}
                  style={{
                    background: chosen ? e.couleur : "#0a0e14",
                    color: chosen ? "#0a0806" : e.couleur,
                    border: `1.5px solid ${e.couleur}`,
                    borderRadius: 10, padding: "10px 12px",
                    fontSize: 13, fontWeight: 800, letterSpacing: 1,
                    cursor: focusedPost && !checked ? "pointer" : "default",
                    fontFamily: "ui-monospace,monospace", textAlign: "left",
                    opacity: focusedPost && !checked ? 1 : 0.5,
                  }}>
                  {e.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 18 }}>
            {!checked ? (
              <button onClick={submit} disabled={!allClassified}
                style={{
                  width: "100%", background: allClassified ? "#f08ad0" : "#3a2a35",
                  color: "#0a0806", border: "none", borderRadius: 10, padding: "11px 20px",
                  fontSize: 13, fontWeight: 800, letterSpacing: 2, fontFamily: "ui-monospace,monospace",
                  cursor: allClassified ? "pointer" : "default",
                }}>
                ✓ VALIDER {allClassified ? "" : `(${Object.keys(choices).length}/${posts.length})`}
              </button>
            ) : perfect ? (
              <div style={{ background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ color: "#5eff9e", fontSize: 11, letterSpacing: 2, fontFamily: "ui-monospace,monospace" }}>✓ 4 / 4</div>
                <p style={{ margin: "6px 0 10px", fontSize: 12.5, color: "#dbe4ef", lineHeight: 1.5 }}>{mission.succes}</p>
                <button onClick={onClose} style={btnDone}>Fermer</button>
              </div>
            ) : (
              <div style={{ background: "#2a1810", border: "1px solid #e0a848", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ color: "#e0a848", fontSize: 11, letterSpacing: 2, fontFamily: "ui-monospace,monospace" }}>⟲ {score} / {posts.length}</div>
                <p style={{ margin: "6px 0 10px", fontSize: 12.5, color: "#dbe4ef", lineHeight: 1.5 }}>{score >= posts.length - 1 ? mission.partiel : mission.echec}</p>
                <button onClick={retry} style={btnRetry}>↺ Réessayer</button>
              </div>
            )}
          </div>

          <button onClick={onClose} style={btnQuit}>← Reposer la tablette</button>
        </aside>
      </div>

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

/* Visuel du media attaché au post : image, graphique animé pour la
   propagande, ou mini-vidéo animée (cœurs qui montent). */
function PostMedia({ media }) {
  if (!media) return null;
  if (media.kind === "graph") {
    return (
      <svg viewBox="0 0 260 110" style={{ width: "100%", height: 110, display: "block", borderRadius: 8, background: "#0a0e14", border: "1px solid #2a3240" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const h = 24 + i * 12;
          return (
            <g key={i}>
              <rect x={22 + i * 44} y={92 - h} width="30" height={h} fill="#5eff9e" opacity="0.7">
                <animate attributeName="height" values={`${h - 6};${h};${h - 6}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${92 - h + 6};${92 - h};${92 - h + 6}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </rect>
              <text x={37 + i * 44} y="104" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#5a6678">M{i + 1}</text>
            </g>
          );
        })}
        <text x="248" y="22" textAnchor="end" fontFamily="ui-monospace,monospace" fontSize="14" fontWeight="800" fill="#5eff9e">97 %</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 260 130" style={{ width: "100%", height: 130, display: "block", borderRadius: 8, background: "#1a1218", border: "1px solid #2a3240" }}>
      <defs>
        <linearGradient id="tv-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1830" />
          <stop offset="100%" stopColor="#0a0806" />
        </linearGradient>
      </defs>
      <rect width="260" height="130" fill="url(#tv-bg)" />
      <circle cx="130" cy="65" r="26" fill="#f08ad0" opacity="0.3">
        <animate attributeName="r" values="26;32;26" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text x="130" y="72" textAnchor="middle" fontSize="30">▶</text>
      {[0, 1, 2].map((i) => (
        <text key={i} x={40 + i * 80} y="118" fontSize="16" fill="#f08ad0">
          ♥
          <animate attributeName="y" values="118;14;118" dur={`${3 + i * 0.6}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur={`${3 + i * 0.6}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </text>
      ))}
      <rect x="2" y="2" width="46" height="14" fill="#ff5a4a" rx="2" />
      <text x="25" y="13" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fontWeight="800" fill="#fff">● LIVE</text>
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
  position: "fixed", inset: 0, background: "rgba(6,8,14,0.94)", zIndex: 400,
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  padding: "20px 20px", overflowY: "auto",
};
const shell = {
  display: "flex", gap: 24, maxWidth: 1100, width: "100%",
  alignItems: "flex-start", justifyContent: "center",
};
const phoneFrame = {
  width: 440, flexShrink: 0,
  background: "#0a0e14", borderRadius: 38, border: "5px solid #2a2f38",
  boxShadow: "0 10px 50px rgba(0,0,0,0.7), inset 0 0 40px rgba(240,138,208,0.08)",
  padding: "34px 14px 18px", position: "relative",
};
const phoneNotch = {
  position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
  width: 130, height: 20, background: "#2a2f38", borderRadius: 12,
};
const phoneStatus = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd",
  padding: "0 10px", marginBottom: 10,
};
const phoneScroll = {
  maxHeight: "68vh", overflowY: "auto", padding: "0 4px",
};
const phoneHome = {
  width: 120, height: 5, background: "#2a2f38", borderRadius: 4, margin: "12px auto 0",
};
const avatarCircle = {
  width: 38, height: 38, background: "#2a3240", borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
};
const side = {
  width: 300, flexShrink: 0, background: "#131922", borderRadius: 14,
  border: "1px solid #2a3240", padding: 18, position: "sticky", top: 10,
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
const webtoileCard = {
  background: "#0d141c", border: "1px solid #7fd8ff", borderRadius: 12,
  padding: 16, width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto",
};
const searchBar = {
  background: "#0a0e14", border: "1px solid #2a3240", borderRadius: 999,
  padding: "6px 14px", fontSize: 12, color: "#8fa3bd", fontFamily: "ui-monospace,monospace",
};
