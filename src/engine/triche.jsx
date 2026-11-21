/* ============================================================
   MOTEUR — Le mode triche sur téléphone
   ------------------------------------------------------------
   Le code est « triche! », avec le point d'exclamation (demande du
   créateur, 2026-11-21 : que les élèves ne le devinent pas ; le
   simple « triche » ne marche plus). Au clavier, on tape triche!
   (App.jsx, monde 2). Sur un téléphone, pas de clavier : on ajoute
   ?triche! à l'adresse. Un petit bouton 🐛 apparaît alors dans un
   coin et ouvre le même panneau. Il reste actif tout l'onglet
   (sessionStorage), même après un changement d'adresse (monde 2,
   « Rentrer au Puits ») ; ?triche!=0 l'enlève. Pour l'enseignant,
   pas pour les élèves.
   ============================================================ */
const CLE = "martine.triche";
/* le mot à taper au clavier, et le paramètre de l'adresse (?triche!) */
export const CODE_TRICHE = "triche!";

export function trichePermise() {
  try {
    const v = new URLSearchParams(window.location.search).get(CODE_TRICHE);
    if (v !== null) { if (v === "0") sessionStorage.removeItem(CLE); else sessionStorage.setItem(CLE, "1"); }
    return sessionStorage.getItem(CLE) === "1";
  } catch {
    return false;
  }
}

/* le petit bouton, en bas à droite (le panneau de triche s'ouvre en bas à gauche) */
export function BoutonTriche({ actif, onClick, style }) {
  return (
    <button onClick={onClick} title="Triche" aria-label="Panneau de triche" data-triche="1"
      style={{ position: "fixed", right: 8, bottom: 8, zIndex: 320, width: 40, height: 40, borderRadius: "50%", fontSize: 18, lineHeight: 1, cursor: "pointer",
        background: actif ? "#3a1a4a" : "rgba(20,14,30,0.7)", color: "#e8d8ff", border: `1px solid ${actif ? "#c8a0ff" : "#4a3a5a"}`, ...style }}>
      🐛
    </button>
  );
}
