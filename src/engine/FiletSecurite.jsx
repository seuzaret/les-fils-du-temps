/* ============================================================
   FILET DE SÉCURITÉ — pas de page blanche en classe
   ------------------------------------------------------------
   Une erreur pendant l'affichage démonte toute l'application :
   l'élève se retrouve devant une page vide. Deux filets :
     · <Filet> autour de tout le jeu (main.jsx) et du monde 2 :
       une carte « MARTINE a eu un raté », la partie est sauvegardée
       (localStorage), un bouton recharge la page ;
     · <FiletSalle> autour d'une salle du Jeu 3 (ou d'un écran) :
       la barre et le plan restent, on peut aller ailleurs ; il se
       réarme quand on change de salle (prop `cle`).
   Le message technique est affiché en petit, pour l'enseignant.
   ============================================================ */
import { Component } from "react";

const MONO = "ui-monospace, monospace";

function Carte({ titre, texte, detail, bouton, onClick, plein }) {
  return (
    <div role="alert" style={{ minHeight: plein ? "100vh" : "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      background: plein ? "#050810" : "transparent", color: "#e8eef5", fontFamily: "Palatino, Georgia, serif" }}>
      <div style={{ maxWidth: 460, textAlign: "center", padding: "20px 22px", background: "#0e1420", border: "1px solid #5a3020", borderRadius: 14 }}>
        <div style={{ fontSize: 34 }}>⚠️</div>
        <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 1.5, color: "#e0a848", margin: "6px 0 8px" }}>{titre}</div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: "#c8b8a0", margin: 0 }}>{texte}</p>
        <button onClick={onClick} autoFocus
          style={{ marginTop: 14, background: "#e0a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontFamily: MONO, fontWeight: 700, letterSpacing: 1, cursor: "pointer" }}>
          {bouton}
        </button>
        {detail && <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 10, color: "#6a7488", wordBreak: "break-word" }}>{detail}</div>}
      </div>
    </div>
  );
}

const resume = (err) => String(err?.message || err || "").slice(0, 160);

/** Autour de tout le jeu : en cas d'erreur, recharger la page (la sauvegarde reste). */
export class Filet extends Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { try { console.error("[filet] le jeu a planté :", err, info?.componentStack); } catch { /* rien */ } }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <Carte plein titre="MARTINE A EU UN RATÉ"
        texte="Quelque chose s'est mal passé. Ta partie est sauvegardée : recharge le jeu, puis choisis « Reprendre »."
        detail={resume(this.state.err)} bouton="Recharger le jeu ↻"
        /* sans les paramètres de l'adresse (?reprendre=jeu3…) : on repart de
           l'écran titre, sinon une reprise qui plante replanterait aussitôt */
        onClick={() => { try { window.location.href = window.location.pathname; } catch { /* rien */ } }} />
    );
  }
}

/** Autour d'une salle : le reste de l'écran continue ; se réarme quand `cle` change. */
export class FiletSalle extends Component {
  constructor(props) { super(props); this.state = { err: null, cle: props.cle }; }
  static getDerivedStateFromError(err) { return { err }; }
  static getDerivedStateFromProps(props, state) { return props.cle !== state.cle ? { err: null, cle: props.cle } : null; }
  componentDidCatch(err, info) { try { console.error("[filet] une salle a planté :", err, info?.componentStack); } catch { /* rien */ } }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <Carte titre="SALLE TEMPORAIREMENT INSTABLE"
        texte={this.props.texte || "MARTINE a des interférences ici. Va dans une autre salle (plan ou bouton de retour) : ta partie est sauvegardée."}
        detail={resume(this.state.err)} bouton="Réessayer"
        onClick={() => this.setState({ err: null })} />
    );
  }
}
