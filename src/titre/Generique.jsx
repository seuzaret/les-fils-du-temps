/* ============================================================
   LE GÉNÉRIQUE DE FIN — après « FIN DU JEU 3 » (les trois fins)
   ------------------------------------------------------------
   Le décor de la pellicule (maquette C de l'écran titre) : les vrais
   tableaux du Jeu 1 défilent dans le faisceau qui sort de l'œil de
   MARTINE. Le texte monte lentement au centre ; à la fin, le
   projecteur s'éteint et il reste « Merci d'avoir joué ».
   Musique : le thème de l'écran titre (le jeu finit comme il a
   commencé) ; il continue sur l'écran titre au retour.
   Mouvement réduit (réglage « calme » ou système) : le texte vient
   par pages, avec un bouton « Suivant ».
   Ouvrir directement : ?generique (triche : 🎬 dans le panneau 🐛).
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "../engine/Martine.jsx";
import useEcran from "../engine/useEcran.js";
import { isMuted, setMuted, surChangementSon } from "../engine/audio.js";
import { demarrerTheme, arreterTheme, themeEnCours } from "./musiqueTitre.js";
import { IMAGES, useVignettes, Pellicule } from "./TitrePellicule.jsx";
import { CINZEL, CORMORANT } from "./commun.jsx";

const MONO = "ui-monospace, monospace";
const OR = "#e8c878";

/* App ne coupe pas le thème hors de l'écran titre tant que le générique est ouvert */
let ouvert = false;
export const generiqueOuvert = () => ouvert;

const calme = () => {
  try { return document.documentElement.classList.contains("a11y-calme") || matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
};

/* ─── la mise en page des crédits ─── */
const Rubrique = ({ children }) => (
  <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: 4, color: OR, opacity: 0.85, textTransform: "uppercase", margin: "0 0 10px" }}>{children}</div>
);
const Nom = ({ children, petit }) => (
  <div style={{ fontFamily: CORMORANT, fontWeight: 500, fontSize: petit ? 19 : 25, lineHeight: 1.3, color: "#f4ead6" }}>{children}</div>
);
/* le pseudonyme : en chasse fixe, zéro barré (avec Cormorant, « 0 » ressemble à « o ») */
const Pseudo = () => (
  <div style={{ fontFamily: MONO, fontVariantNumeric: "slashed-zero", fontSize: 21, letterSpacing: 1, lineHeight: 1.5, color: "#f4ead6" }}>pr0fd0c65</div>
);
const Note = ({ children, style }) => (
  <p style={{ fontFamily: CORMORANT, fontStyle: "italic", fontSize: 17, lineHeight: 1.45, color: "#c9bfae", margin: "8px 0 0", ...style }}>{children}</p>
);
const Ligne = ({ titre, annee, qui }) => (
  <div style={{ fontFamily: CORMORANT, fontSize: 19, lineHeight: 1.4, color: "#f4ead6", margin: "0 0 6px" }}>
    {titre}{qui ? <span style={{ color: "#c9bfae" }}>, {qui}</span> : null}{annee ? <span style={{ color: "#a89c88" }}> ({annee})</span> : null}
  </div>
);

/* 11 photos sous licence Creative Commons BY ou BY-SA (inventions-meta.json) */
const AUTEURS_CC = ["Tomatenpflanze", "NewPapillon", "Zde", "Peter van der Sluijs", "Dosseman", "Ultimate", "Colin", "Wolfgang Sauber", "Joe Haupt", "Marieth", "un graveur inconnu"];

function sections(prenom) {
  return [
    { k: "titre", el: (<>
      <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: "clamp(30px, 7vw, 54px)", letterSpacing: "0.08em", lineHeight: 1.05, color: OR, textShadow: "0 2px 18px rgba(232,200,120,0.35)" }}>LES FILS<br />DU TEMPS</div>
      <Note>Un jeu d'éducation aux médias et à l'information</Note>
    </>) },
    { k: "chronaute", el: (<><Rubrique>Chronaute</Rubrique><Nom>{prenom || "toi"}</Nom></>) },
    { k: "equipe", el: (<>
      <Rubrique>Conception</Rubrique>
      <Pseudo /><Nom>Claude</Nom><Nom>MARTINE <span style={{ fontSize: 16, fontStyle: "italic", color: "#a89c88" }}>(elle a insisté)</span></Nom>
      <div style={{ height: 22 }} />
      <Rubrique>Histoire et tests</Rubrique><Pseudo />
      <div style={{ height: 22 }} />
      <Rubrique>Programmation, dessins et musique</Rubrique><Nom>Claude</Nom><Note>Claude Code, d'Anthropic, avec <span style={{ fontFamily: MONO, fontStyle: "normal", fontSize: 15, fontVariantNumeric: "slashed-zero" }}>pr0fd0c65</span></Note>
    </>) },
    { k: "avec", el: (<>
      <Rubrique>Avec</Rubrique>
      {[["MARTINE", "la machine"], ["Al3x1a", "la fille en bleu"], ["Jorge", "l'archiviste"], ["Léa Vermet", "l'inventrice"], ["Mira", "l'ingénieure"], ["Elias", "le chef des chronautes"]].map(([n, r]) => (
        <Nom key={n} petit>{n} <span style={{ fontStyle: "italic", color: "#a89c88" }}>{r}</span></Nom>
      ))}
      <Nom petit><span style={{ fontStyle: "italic", color: "#a89c88" }}>et les dormants du Puits</span></Nom>
    </>) },
    { k: "sources", el: (
      <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: "clamp(19px, 4.4vw, 27px)", letterSpacing: "0.05em", lineHeight: 1.35, color: OR }}>Ce jeu parle de sources.<br />Voici les siennes.</div>
    ) },
    { k: "images", el: (<>
      <Rubrique>Les images d'archive</Rubrique>
      <Nom petit>44 photos de Wikimedia Commons</Nom>
      <Note>29 dans le domaine public ou sous CC0 ;<br />11 sous licence Creative Commons, de {AUTEURS_CC.slice(0, -1).join(", ")} et {AUTEURS_CC[AUTEURS_CC.length - 1]} ;<br />4 pour le jeu « Vrai, faux ou IA ? ».</Note>
      <Note>L'auteur et la licence de chaque photo du médiadex sont écrits sur sa carte.</Note>
      <div style={{ height: 18 }} />
      <Note>Tout le reste (tableaux, personnages, musique, bruitages) a été dessiné et composé pour le jeu, dans le navigateur.</Note>
    </>) },
    { k: "oeuvres", el: (<>
      <Rubrique>Les œuvres citées</Rubrique>
      <Ligne titre={<i>Daisy Bell</i>} qui="Harry Dacre" annee="1892" />
      <Note>chantée par un ordinateur IBM aux laboratoires Bell en 1961, puis par HAL 9000 dans <i>2001, l'odyssée de l'espace</i> (Stanley Kubrick, 1968)</Note>
      <div style={{ height: 12 }} />
      <Ligne titre="La classification décimale" qui="Melvil Dewey" annee="1876" />
      <Ligne titre={<i>La Machine à explorer le temps</i>} qui="H. G. Wells" annee="1895" />
      <Ligne titre={<i>Fahrenheit 451</i>} qui="Ray Bradbury" annee="1953" />
      <Ligne titre="Les tachyons" qui="Gerald Feinberg, Physical Review" annee="1967" />
    </>) },
    { k: "clins", el: (<>
      <Rubrique>Clins d'œil</Rubrique>
      <Note><i>1984</i> (George Orwell, 1949) · <i>Silo</i> (Hugh Howey, 2011) · <i>Portal</i> (Valve, 2007) · <i>Doctor Who</i> (BBC, 1963) · <i>Retour vers le futur</i> (1985) · <i>Terminator</i> (1984) · <i>L'Effet papillon</i> (2004) · <i>Stranger Things</i> (2016)</Note>
    </>) },
    { k: "outils", el: (<>
      <Rubrique>Polices</Rubrique>
      <Nom petit>Cinzel <span style={{ color: "#a89c88" }}>(Natanael Gama)</span></Nom>
      <Nom petit>Cormorant Garamond <span style={{ color: "#a89c88" }}>(Christian Thalmann)</span></Nom>
      <Note>sous licence SIL Open Font License</Note>
      <div style={{ height: 22 }} />
      <Rubrique>Fabriqué avec</Rubrique>
      <Nom petit>React et Vite</Nom><Note>hébergé par GitHub Pages</Note>
      <div style={{ height: 22 }} />
      <Rubrique>Licence</Rubrique>
      <Nom petit>Creative Commons BY-NC-SA 4.0</Nom>
      <Note>Tu peux copier, modifier et partager ce jeu, sans le vendre, en citant ses auteurs et sous la même licence. Les photos et les polices gardent la leur.</Note>
    </>) },
  ];
}

export default function Generique({ prenom = "", onDone }) {
  const { portrait, bas } = useEcran();
  const paysageBas = bas && !portrait;
  const urls = useVignettes();
  const pages = calme();
  const liste = sections(prenom);
  const [fini, setFini] = useState(false);
  const [page, setPage] = useState(0);
  const [coupe, setCoupe] = useState(isMuted());
  const colonne = useRef(null);
  const cadre = useRef(null);

  /* le thème du titre ; App le laisse jouer tant que le générique est ouvert */
  useEffect(() => {
    ouvert = true;
    if (!isMuted() && !themeEnCours()) demarrerTheme();
    const off = surChangementSon((m) => { setCoupe(m); if (m) arreterTheme(); else demarrerTheme(); });
    return () => { ouvert = false; off(); };
  }, []);

  /* le défilement, image par image (les animations CSS sont coupées en mode calme) */
  useEffect(() => {
    if (pages) return;
    const el = colonne.current, boite = cadre.current;
    if (!el || !boite) return;
    let y = boite.clientHeight, prec = performance.now(), id;
    const vitesse = boite.clientHeight < 560 ? 34 : 42; // px/s
    const pas = (t) => {
      const dt = Math.min(0.1, (t - prec) / 1000); prec = t;
      if (!document.hidden) y -= vitesse * dt;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      if (y < -el.offsetHeight) { setFini(true); return; }
      id = requestAnimationFrame(pas);
    };
    el.style.transform = `translate3d(0, ${y}px, 0)`;
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [pages]);

  const w = portrait ? 150 : paysageBas ? 130 : 220;
  const largeur = portrait ? "calc(100% - 32px)" : "min(620px, calc(100% - 48px))";
  const bouton = (fond, texte) => ({ background: fond, color: texte, border: `1px solid ${OR}`, borderRadius: 999, padding: "8px 16px", fontFamily: MONO, fontSize: 12.5, fontWeight: 700, letterSpacing: 1, cursor: "pointer" });
  const basculerSon = () => setMuted(!isMuted());

  return createPortal(
    <div ref={cadre} role="dialog" aria-label="Générique de fin"
      onPointerDown={() => { if (!isMuted() && !themeEnCours()) demarrerTheme(); }}
      style={{ position: "fixed", inset: 0, zIndex: 400, overflow: "hidden", background: "#06070c", color: "#f4ead6", textAlign: "center",
        fontVariantNumeric: "lining-nums" /* chiffres alignés : le zéro elzévirien de Cormorant se lit « o » */ }}>
      <style>{`
        @keyframes ttpGauche { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ttpDroite { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes ttpIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes genIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      {/* les pellicules, en perspective, un peu en retrait pour laisser lire */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, perspective: 1100, perspectiveOrigin: "50% 30%", overflow: "hidden", opacity: fini ? 0.25 : 0.55, transition: "opacity 3s ease" }}>
        <Pellicule images={IMAGES[0]} urls={urls} w={w} sens={-1} duree={80}
          style={{ top: portrait ? "22%" : "18%", transform: `rotateX(${portrait ? 8 : 14}deg) rotateY(-14deg) rotateZ(-5deg)` }} />
        <Pellicule images={IMAGES[1]} urls={urls} w={Math.round(w * 0.82)} sens={1} duree={100}
          style={{ top: portrait ? "64%" : "62%", transform: `rotateX(${portrait ? 10 : 18}deg) rotateY(12deg) rotateZ(4deg)`, opacity: 0.7 }} />
      </div>

      {/* le faisceau qui sort de l'œil de MARTINE : il s'éteint à la fin */}
      <svg aria-hidden="true" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="gen-faisceau" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2c8" stopOpacity="0.3" /><stop offset="1" stopColor="#fff2c8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="gen-vignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.88" />
          </radialGradient>
          <linearGradient id="gen-bande" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#06070c" stopOpacity="0" /><stop offset="0.3" stopColor="#06070c" stopOpacity="0.72" />
            <stop offset="0.7" stopColor="#06070c" stopOpacity="0.72" /><stop offset="1" stopColor="#06070c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 488 60 L 512 60 L 1000 1000 L 0 1000 Z" fill="url(#gen-faisceau)" style={{ opacity: fini ? 0 : 1, transition: "opacity 3s ease" }} />
        <rect x={portrait ? 0 : 200} width={portrait ? 1000 : 600} height="1000" fill="url(#gen-bande)" />
        <rect width="1000" height="1000" fill="url(#gen-vignette)" />
      </svg>
      <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: portrait ? "1.2%" : "0.5%", transform: "translateX(-50%)", zIndex: 2,
        filter: fini ? "none" : "drop-shadow(0 0 18px rgba(127,216,255,0.35))", transition: "filter 3s" }}>
        <Avatar size={portrait ? 54 : 62} mood={fini ? "content" : "neutre"} />
      </div>

      {/* le texte : défilement, ou pages en mode calme */}
      {!fini && !pages && (
        /* le texte apparaît en bas et s'efface avant d'atteindre MARTINE */
        <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden",
          WebkitMaskImage: `linear-gradient(to bottom, transparent ${portrait ? 70 : 80}px, #000 ${portrait ? 150 : 170}px, #000 calc(100% - 90px), transparent calc(100% - 40px))`,
          maskImage: `linear-gradient(to bottom, transparent ${portrait ? 70 : 80}px, #000 ${portrait ? 150 : 170}px, #000 calc(100% - 90px), transparent calc(100% - 40px))` }}>
          <div ref={colonne} style={{ position: "absolute", left: 0, right: 0, top: 0, margin: "0 auto", width: largeur, willChange: "transform" }}>
            {liste.map((s) => <div key={s.k} style={{ padding: portrait ? "0 0 64px" : "0 0 84px" }}>{s.el}</div>)}
          </div>
        </div>
      )}
      {!fini && pages && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "90px 16px 80px", zIndex: 1 }}>
          <div key={page} style={{ width: largeur, animation: "genIn .8s ease-out both" }}>{liste[page].el}</div>
        </div>
      )}

      {/* la fin : le projecteur est éteint */}
      {fini && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 16px", zIndex: 3, animation: "genIn 2s ease-out .6s both" }}>
          <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: "clamp(22px, 5vw, 34px)", letterSpacing: "0.05em", color: OR }}>Merci d'avoir joué{prenom ? `, ${prenom}` : ""}.</div>
          <Note>Ce qu'une archive garde dépend de celui qui la regarde.</Note>
          <button autoFocus onClick={onDone} style={{ ...bouton(OR, "#1a1206"), marginTop: 18 }}>Retour au titre ▸</button>
        </div>
      )}

      {/* commandes */}
      <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", gap: 8, zIndex: 4 }}>
        <button onClick={basculerSon} title={coupe ? "Remettre le son" : "Couper le son"} aria-label={coupe ? "Remettre le son" : "Couper le son"}
          style={{ ...bouton("rgba(6,7,12,0.7)", OR), padding: "8px 12px" }}>{coupe ? "🔇" : "🔊"}</button>
        {!fini && pages && page < liste.length - 1 && <button onClick={() => setPage(page + 1)} style={bouton("rgba(6,7,12,0.7)", OR)}>Suivant ▸</button>}
        {!fini && pages && page === liste.length - 1 && <button onClick={() => setFini(true)} style={bouton("rgba(6,7,12,0.7)", OR)}>Fin ▸</button>}
        {!fini && <button onClick={onDone} style={bouton("rgba(6,7,12,0.7)", "#c9bfae")}>Passer ▸</button>}
      </div>
    </div>,
    document.body
  );
}
