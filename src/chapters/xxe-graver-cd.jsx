import { useState, useEffect } from "react";

/* ============================================================
   MINI-JEU : « Graver un CD-Rom » (Bureau, 1990) — knapsack
   ------------------------------------------------------------
   Céline veut sauvegarder toutes les MUSIQUES et toutes les
   PHOTOS de la famille sur un CD-R de 650 Mo. Mais il y a des
   fichiers pieges (ISO, gros backup) qui feraient tout deborder.
   Le joueur doit selectionner la bonne combinaison :
     - TOUTES les musiques
     - TOUTES les photos
     - sans depasser 650 Mo
   Leçon EMI : la CAPACITE des supports change tout — un CD tient
   dans 650 Mo mille fois plus qu'une disquette, mais pas TOUT.
   Choisir ce qu'on sauvegarde, c'est deja archiver — et perdre
   ce qu'on n'a pas choisi.
   ============================================================ */

const CAPA_MO = 650;

/* Familles : "music", "photo", "doc", "autre". Le joueur doit
   selectionner TOUS les music + TOUS les photo pour gagner. */
const FILES = [
  /* Musiques de la famille */
  { id: "musique",       cat: "music", nom: "Musique_bureau.wav",     size: 24,   icon: "🎵" },
  { id: "top50",         cat: "music", nom: "Enregistrement_top50.wav", size: 48, icon: "🎶" },
  { id: "radio_ete89",   cat: "music", nom: "Radio_ete_89.wav",        size: 32,  icon: "📻" },
  { id: "repondeur",     cat: "music", nom: "Messages_repondeur.wav",  size: 18,  icon: "☎️" },

  /* Photos de la famille */
  { id: "photo_noel",    cat: "photo", nom: "Photo_Noel_89.bmp",       size: 4,    icon: "🖼️" },
  { id: "photos_ete",    cat: "photo", nom: "Photos_ete_89.zip",       size: 68,   icon: "📸" },
  { id: "photos_famille",cat: "photo", nom: "Photos_famille.zip",      size: 42,   icon: "📸" },
  { id: "photos_vac",    cat: "photo", nom: "Vacances_Bretagne.zip",   size: 96,   icon: "🏖️" },
  { id: "photos_bebe",   cat: "photo", nom: "Bebe_Emma.zip",           size: 56,   icon: "👶" },
  { id: "photos_mariage",cat: "photo", nom: "Mariage_Marc_88.zip",     size: 84,   icon: "💍" },

  /* Documents de travail (optionnels — n'apportent rien a la mission) */
  { id: "rapport",       cat: "doc",   nom: "Rapport_final.doc",       size: 0.24, icon: "📝" },
  { id: "compta",        cat: "doc",   nom: "Comptabilite.xls",        size: 1.8,  icon: "📊" },
  { id: "clients",       cat: "doc",   nom: "Base_clients.mdb",        size: 118,  icon: "💼" },

  /* Pieges : gros fichiers qui feraient deborder le CD */
  { id: "jeu",           cat: "autre", nom: "DOOM.exe",                size: 12,   icon: "🎮" },
  { id: "backup",        cat: "autre", nom: "Backup_projet_v3.zip",    size: 380,  icon: "💾" },
  { id: "iso",           cat: "autre", nom: "Windows95_beta.iso",      size: 620,  icon: "💿" },
];

const REQUIRED_CATS = ["music", "photo"];
const REQUIRED_IDS = FILES.filter((f) => REQUIRED_CATS.includes(f.cat)).map((f) => f.id);

const fmtSize = (mo) => {
  if (mo < 1) return `${Math.round(mo * 1000)} Ko`;
  return `${mo.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;
};

/* Fichiers mélangés une fois par partie — le joueur ne peut plus
   mémoriser leur position dans la liste. */
function shuffleFiles() {
  const arr = [...FILES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function GraverCdGame({ onClose, onWin }) {
  const [files] = useState(() => shuffleFiles());
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState("choix");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const total = FILES.filter((f) => selected.includes(f.id))
    .reduce((s, f) => s + f.size, 0);
  const pct = Math.min(100, (total / CAPA_MO) * 100);
  const trop = total > CAPA_MO;
  const vide = total === 0;
  const missingReq = REQUIRED_IDS.filter((id) => !selected.includes(id));
  const nbMusicSel  = selected.filter((id) => FILES.find((f) => f.id === id)?.cat === "music").length;
  const nbPhotoSel  = selected.filter((id) => FILES.find((f) => f.id === id)?.cat === "photo").length;
  const nbMusicTot  = FILES.filter((f) => f.cat === "music").length;
  const nbPhotoTot  = FILES.filter((f) => f.cat === "photo").length;

  const toggle = (id) => {
    if (phase !== "choix") return;
    setErrorMsg("");
    setSelected((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  };

  const graver = () => {
    if (vide) { setErrorMsg("Ton CD est VIDE — coche au moins un fichier."); return; }
    if (trop) { setErrorMsg(`Ton CD est TROP PLEIN (${fmtSize(total)} > ${CAPA_MO} Mo). Retire un fichier trop lourd — regarde du côté des sauvegardes et des .iso.`); return; }
    if (missingReq.length > 0) {
      const cats = [];
      if (nbMusicSel < nbMusicTot) cats.push(`${nbMusicTot - nbMusicSel} musique${nbMusicTot - nbMusicSel > 1 ? "s" : ""}`);
      if (nbPhotoSel < nbPhotoTot) cats.push(`${nbPhotoTot - nbPhotoSel} photo${nbPhotoTot - nbPhotoSel > 1 ? "s" : ""}`);
      setErrorMsg(`Il te manque encore ${cats.join(" et ")} de la famille — objectif : sauvegarder TOUT.`);
      return;
    }
    setPhase("grave");
  };

  useEffect(() => {
    if (phase !== "grave") return;
    const id = setInterval(() => setProgress((p) => {
      if (p >= 100) { clearInterval(id); setTimeout(() => setPhase("done"), 500); return 100; }
      return p + 3.5;
    }), 100);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => { if (phase === "done") onWin?.(); }, [phase]); // eslint-disable-line

  const catLabel = { music: "musique", photo: "photo", doc: "document", autre: "autre" };
  const catColor = { music: "#a83080", photo: "#0a7010", doc: "#5a4028", autre: "#6a6a6a" };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#c8c0b0", border: "3px solid #0a0a0a", boxShadow: "4px 4px 0 #0a0a0a, 8px 8px 24px rgba(0,0,0,0.6)", maxWidth: 780, width: "100%", maxHeight: "94vh", overflowY: "auto", color: "#0a0a0a", fontFamily: "'MS Sans Serif', 'Arial', sans-serif" }}>
        {/* Barre de titre Windows 3.0 */}
        <div style={{ background: "#0a3878", color: "#fff", padding: "4px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 12 }}>
          <span>💿 Assistant de Gravure CD-Rom — Céline (1990)</span>
          <span style={{ background: "#c8c0b0", color: "#0a0a0a", padding: "0 6px", border: "1px solid #0a0a0a", cursor: "pointer" }} onClick={onClose}>×</span>
        </div>
        <div style={{ background: "#c8c0b0", borderBottom: "1px solid #6a6a6a", padding: "2px 8px", fontSize: 11 }}>
          <span style={{ marginRight: 12 }}>Fichier</span>
          <span style={{ marginRight: 12 }}>Édition</span>
          <span style={{ marginRight: 12 }}>Affichage</span>
          <span>?</span>
        </div>

        <div style={{ padding: 12 }}>
          {phase === "choix" && (
            <>
              {/* MISSION */}
              <div style={{ background: "#fff8d8", border: "2px inset #c8a848", padding: "8px 12px", marginBottom: 10, fontSize: 12.5, lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: "#804000", marginBottom: 3 }}>📋 Mission :</div>
                Sauvegarde <b>TOUTES</b> les <span style={{ color: catColor.music, fontWeight: 700 }}>MUSIQUES</span> ({nbMusicSel}/{nbMusicTot}) <b>et TOUTES</b> les <span style={{ color: catColor.photo, fontWeight: 700 }}>PHOTOS</span> ({nbPhotoSel}/{nbPhotoTot}) de la famille sur ce CD-R de <b>{CAPA_MO} Mo</b>. Attention aux gros fichiers de travail — ils feraient déborder le disque !
              </div>

              {/* Les deux fenêtres côte à côte */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {/* MON PC (source) */}
                <div style={{ background: "#fff", border: "2px inset #6a6a6a" }}>
                  <div style={{ background: "#c8c0b0", padding: "3px 8px", borderBottom: "1px solid #6a6a6a", fontSize: 11, fontWeight: 700 }}>
                    🖥️ Mon PC — C:\
                  </div>
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {files.filter((f) => !selected.includes(f.id)).map((f) => (
                      <div key={f.id} onClick={() => toggle(f.id)}
                        style={{ padding: "4px 8px", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center", fontSize: 11.5, borderBottom: "1px dotted #c8c0b0" }}>
                        <span>{f.icon} {f.nom}</span>
                        <span style={{ color: "#6a6a6a" }}>{fmtSize(f.size)}</span>
                      </div>
                    ))}
                    {files.length === selected.length && (
                      <div style={{ padding: 20, textAlign: "center", color: "#6a6a6a", fontSize: 11, fontStyle: "italic" }}>
                        (Dossier vide)
                      </div>
                    )}
                  </div>
                </div>

                {/* CD-R (cible) */}
                <div style={{ background: "#fff", border: "2px inset #6a6a6a" }}>
                  <div style={{ background: "#c8c0b0", padding: "3px 8px", borderBottom: "1px solid #6a6a6a", fontSize: 11, fontWeight: 700 }}>
                    💿 CD-R (D:) — à graver
                  </div>
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {selected.length === 0 ? (
                      <div style={{ padding: 20, textAlign: "center", color: "#6a6a6a", fontSize: 11, fontStyle: "italic" }}>
                        (CD vide — clique un fichier à gauche)
                      </div>
                    ) : selected.map((id) => {
                      const f = FILES.find((x) => x.id === id);
                      return (
                        <div key={id} onClick={() => toggle(id)}
                          style={{ padding: "4px 8px", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center", fontSize: 11.5, borderBottom: "1px dotted #c8c0b0" }}>
                          <span>{f.icon} {f.nom}</span>
                          <span style={{ color: "#6a6a6a" }}>{fmtSize(f.size)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Jauge de capacité */}
              <div style={{ marginTop: 10, background: "#fff", border: "2px inset #6a6a6a", padding: "6px 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                  <span><b>Espace utilisé :</b> {fmtSize(total)}</span>
                  <span style={{ color: trop ? "#c00000" : "#0a0a0a" }}><b>Capacité :</b> {CAPA_MO} Mo</span>
                </div>
                <div style={{ height: 14, background: "#e8e0d0", border: "1px inset #6a6a6a", overflow: "hidden", position: "relative" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: trop ? "#c00000" : pct > 90 ? "#c88030" : "#0a70a0", transition: "width .2s ease" }} />
                  {trop && (
                    <div style={{ position: "absolute", top: 0, right: 4, bottom: 0, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center" }}>DÉPASSEMENT !</div>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div style={{ marginTop: 8, background: "#ffd8d8", border: "2px inset #c84848", padding: "6px 10px", fontSize: 12, color: "#800000" }}>
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Boutons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 12 }}>
                <button onClick={onClose}
                  style={{ background: "#c8c0b0", border: "2px outset #e8e0d0", padding: "5px 20px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  Annuler
                </button>
                <button onClick={graver}
                  style={{ background: vide || trop ? "#a89880" : "#c8c0b0", border: "2px outset #e8e0d0", padding: "5px 24px", fontSize: 12, fontWeight: 700, cursor: vide || trop ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  🔥 Graver
                </button>
              </div>
            </>
          )}

          {phase === "grave" && (
            <div style={{ padding: "40px 20px" }}>
              <div style={{ background: "#fff", border: "2px inset #6a6a6a", padding: 14 }}>
                <div style={{ fontSize: 13, marginBottom: 10 }}>
                  🔥 Gravure en cours de <b>{selected.length}</b> fichier{selected.length > 1 ? "s" : ""} sur CD-R (D:)…
                </div>
                <div style={{ height: 22, background: "#e8e0d0", border: "1px inset #6a6a6a", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: "#0a70a0", transition: "width .1s linear" }} />
                </div>
                <div style={{ fontSize: 11, marginTop: 6, color: "#5a5a5a", fontFamily: "ui-monospace,monospace" }}>
                  {progress < 30 ? "Vérification de la géométrie du disque…" :
                   progress < 60 ? "Écriture des pistes 1 à N…" :
                   progress < 90 ? "Finalisation de la session…" :
                   "Éjection…"}
                </div>
              </div>
            </div>
          )}

          {phase === "done" && (
            <div>
              <div style={{ background: "#fff", border: "2px inset #6a6a6a", padding: 14, marginBottom: 10 }}>
                <div style={{ fontSize: 14, marginBottom: 8, color: "#0a7010", fontWeight: 700 }}>
                  ✓ Gravure terminée avec succès !
                </div>
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  {selected.length} fichier{selected.length > 1 ? "s" : ""} · {fmtSize(total)} / {CAPA_MO} Mo — toutes les musiques et toutes les photos de la famille sont dessus.
                </div>
              </div>
              <div style={{ background: "#0e1420", border: "1px solid #2a3648", padding: "12px 14px", color: "#e8eef5", fontFamily: "Palatino, Georgia, serif", fontSize: 13.5, lineHeight: 1.6 }}>
                « Un CD-Rom, c'est <b>650 Mo</b> — 450 fois une disquette 3½" (1,44 Mo), soit 200 000 pages de texte. Vertigineux pour 1990. Mais tu vois, il a quand même fallu CHOISIR : le Windows95 beta et le gros backup, on les laisse. Toute archive, c'est déjà un tri. On te vendra le CD « inaltérable », 100 ans garantis. La réalité 30 ans plus tard : beaucoup de CD gravés des années 90 sont ILLISIBLES — la couche métallique s'oxyde (la « maladie du disque »). La CAPACITÉ ne garantit rien sur la DURABILITÉ. » — MARTINE
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={onClose}
                  style={{ background: "#c8c0b0", border: "2px outset #e8e0d0", padding: "5px 24px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Continuer
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "#c8c0b0", borderTop: "1px solid #6a6a6a", padding: "3px 8px", fontSize: 10.5, display: "flex", justifyContent: "space-between", color: "#3a3a3a" }}>
          <span>Prêt</span>
          <span>{selected.length} fichier(s) — {fmtSize(total)}</span>
        </div>
      </div>
    </div>
  );
}
