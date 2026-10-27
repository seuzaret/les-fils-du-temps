import { Papier } from "./CaillouPapier.jsx";
import { caillouxTrouves, INDICES_MONDE } from "./cailloux.js";

/* « Son monde porte son nom » : les trois indices de l'adresse (relus
   dans ce panneau et à la 1re visite aux serveurs). */
export function IndicesMonde({ flags, setFlag }) {
  const lus = flags.indices_monde || 0;
  return (
    <div style={{ background: "#141c2a", border: "1px dashed #c8a848", borderRadius: 10, padding: "10px 14px", textAlign: "left" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#c8a848", marginBottom: lus ? 8 : 0 }}>
        OÙ EST SON MONDE ?
      </div>
      {INDICES_MONDE.slice(0, lus).map((t, k) => (
        <p key={k} style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.5, color: "#e8eef5" }}>💡 {t}</p>
      ))}
      {lus < INDICES_MONDE.length ? (
        <button onClick={() => setFlag("indices_monde", lus + 1)} data-indice-monde="1"
          style={{ marginTop: lus ? 2 : 8, background: "transparent", color: "#ffd166", border: "1px solid #c8a848", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700 }}>
          💡 {lus === 0 ? "Un indice" : "Un autre indice"} ({lus + 1}/{INDICES_MONDE.length})
        </button>
      ) : (
        <p style={{ margin: 0, fontSize: 12, color: "#7a879e", fontStyle: "italic" }}>Plus d'indice : tu as tout ce qu'il faut.</p>
      )}
    </div>
  );
}

/* ============================================================
   JEU 3 — « Les cailloux d'A. » (bouton 🪨 de la barre du haut)
   ------------------------------------------------------------
   Les papiers trouvés, du dernier au premier. Sous le dernier :
   les indices progressifs (💡, trois niveaux) pour trouver le
   suivant. Le nombre d'indices lus est gardé dans indices_<id>.
   ============================================================ */
export default function CaillouxPanel({ flags, setFlag, onClose }) {
  const trouves = caillouxTrouves(flags);
  const dernier = trouves[trouves.length - 1];
  const lus = dernier ? flags[`indices_${dernier.id}`] || 0 : 0;
  const fini = !!dernier?.carnet;

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 240, background: "rgba(4,8,14,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "Palatino, Georgia, serif" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "1px solid #c8a848", borderRadius: 14, padding: "18px 18px 20px", maxWidth: 600, width: "100%", maxHeight: "calc(100dvh - 32px)", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#c8a848", fontWeight: 800 }}>🪨 LES CAILLOUX D'A.</div>
          <button onClick={onClose} aria-label="Fermer"
            style={{ background: "transparent", border: "1px solid #3a4a64", color: "#c8d4e2", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 13 }}>✕</button>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#8fa3bd", fontStyle: "italic" }}>
          {fini
            ? "Tu as suivi tous ses cailloux, jusqu'à la page de son carnet."
            : `Quelqu'un qui signe « A. » a semé ces papiers dans le Puits. Chacun mène au suivant. (${trouves.length} trouvé${trouves.length > 1 ? "s" : ""})`}
        </p>

        {[...trouves].reverse().map((c, i) => (
          <div key={c.id} style={{ marginBottom: 18, opacity: i === 0 ? 1 : 0.82 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#7a879e", marginBottom: 8 }}>
              {trouves.length - i}. {c.ou.toUpperCase()}
            </div>
            <Papier caillou={c} />
            {i === 0 && fini && flags.serveurs_visite1 && !flags.monde2_fini && (
              <div style={{ marginTop: 16 }}><IndicesMonde flags={flags} setFlag={setFlag} /></div>
            )}
            {i === 0 && fini && flags.monde2_fini && (
              <p style={{ margin: "14px 0 0", fontSize: 13, color: "#c8a848", fontStyle: "italic", textAlign: "center" }}>Tu as remis son monde en ordre. Il ne reste de MARTINE que ses serveurs.</p>
            )}
            {i === 0 && !fini && (
              <div style={{ marginTop: 16, background: "#141c2a", border: "1px dashed #c8a848", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#c8a848", marginBottom: lus ? 8 : 0 }}>
                  OÙ EST LE SUIVANT ?
                </div>
                {c.indices.slice(0, lus).map((t, k) => (
                  <p key={k} style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.5, color: "#e8eef5" }}>💡 {t}</p>
                ))}
                {lus < c.indices.length ? (
                  <button onClick={() => setFlag(`indices_${c.id}`, lus + 1)}
                    style={{ marginTop: lus ? 2 : 8, background: "transparent", color: "#ffd166", border: "1px solid #c8a848", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700 }}>
                    💡 {lus === 0 ? "Un indice" : "Un autre indice"} ({lus + 1}/{c.indices.length})
                  </button>
                ) : (
                  <p style={{ margin: 0, fontSize: 12, color: "#7a879e", fontStyle: "italic" }}>Plus d'indice : tu as tout ce qu'il faut.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
