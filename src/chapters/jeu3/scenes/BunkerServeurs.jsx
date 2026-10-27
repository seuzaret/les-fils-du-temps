import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CONFRONTATION } from "../missions.js";
import { CAILLOU } from "../cailloux.js";
import { ConcretePanels } from "../bunkerKit.jsx";
import { Papier } from "../CaillouPapier.jsx";
import { IndicesMonde } from "../CaillouxPanel.jsx";
import CombatMartine from "../CombatMartine.jsx";
import { sonCoupure, sonRallume } from "../sonsCombat.js";

/* ============================================================
   JEU 3 — SCÈNE : « Salle des serveurs de MARTINE » (finale)
   ------------------------------------------------------------
   En deux temps (LORE §7 ; textes dans missions.js, CONFRONTATION) :
     1re visite (le monde 2 pas fini) — dialogue, puis [⏻ Débrancher
       MARTINE] : les baies s'éteignent, se rallument ; « Je suis
       partout » ; la note d'Al3x1a (si le joueur a la page du carnet)
       et les trois indices de l'adresse. Flag serveurs_visite1. On
       peut redescendre : MARTINE le renvoie (« Encore toi ? »).
     2e visite (monde2_fini) — dialogue, puis [⚔ Affronter MARTINE] :
       le combat (CombatMartine, par-dessus tout l'écran) avec la
       révélation et le choix ; T'ÉTEINDRE s'y joue en gros plan (HAL,
       Daisy Bell). Puis l'écran de fin : « T'éteindre » et « Te
       modifier » enchaînent sur l'épilogue, « Te faire confiance »
       s'arrête.
   ============================================================ */
/* Le décor : normal, « eteint » (on l'a débranchée), « rallume » (elle
   revient), « faible » (2e visite : une baie sur deux est éteinte). */
function Decor({ lumiere = "normal" }) {
  const faible = lumiere === "faible";
  return (
    <svg viewBox="0 0 800 380" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
      <defs>
        <linearGradient id="sv-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1420" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <radialGradient id="sv-mart" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="380" fill="url(#sv-wall)" />
      <ConcretePanels x0={0} x1={800} y0={30} y1={330} w={100} seed={77} joint="#03060a" bolt="#1a2430" stain="#0a1a14" opacity={0.7} />
      {/* plafond : chemins de câbles */}
      <rect width="800" height="30" fill="#04070c" />
      {[10, 20].map((y) => <rect key={y} x="0" y={y} width="800" height="5" fill="#1a2430" />)}
      {/* au fond, d'autres rangées de baies qui se perdent dans le noir */}
      {[300, 330, 440, 470].map((x, i) => (
        <g key={`far${i}`} opacity="0.6">
          <rect x={x} y="110" width="26" height="170" fill="#0c121a" stroke="#05080c" strokeWidth="1" />
          {Array.from({ length: 10 }).map((_, k) => <circle key={k} cx={x + 7 + (k % 2) * 12} cy={122 + Math.floor(k / 2) * 30} r="1.4" fill={k % 3 ? "#5eff9e" : "#ffb04a"} opacity="0.7" />)}
        </g>
      ))}
      {/* les câbles de TOUTES les baies convergent vers MARTINE */}
      {[110, 230, 570, 690, 40, 760].map((x, i) => (
        <path key={`cv${i}`} d={`M${x} 34 Q${(x + 400) / 2} ${70 + (i % 3) * 14} 400 108`} stroke={["#1a2a1e", "#22302a", "#14241a"][i % 3]} strokeWidth={5 - (i % 2) * 2} fill="none" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={`pk${i}`} r="2.2" fill="#5eff9e" opacity="0.8">
          <animateMotion dur={`${2.4 + i * 0.5}s`} repeatCount="indefinite" path={`M${[110, 230, 570, 690, 40][i]} 34 Q${([110, 230, 570, 690, 40][i] + 400) / 2} ${70 + (i % 3) * 14} 400 108`} />
        </circle>
      ))}
      <rect y="330" width="800" height="50" fill="#050810" />
      {/* caillebotis du sol, reflets verts, brume froide */}
      {Array.from({ length: 18 }).map((_, i) => { const x = -200 + i * 70; return <path key={`gr${i}`} d={`M${(400 + (x - 400) * 0.6).toFixed(0)} 330 L${x} 380`} stroke="#14202a" strokeWidth="1" />; })}
      {[342, 358].map((y) => <path key={y} d={`M0 ${y} H800`} stroke="#14202a" strokeWidth="1" />)}
      <ellipse cx="400" cy="350" rx="200" ry="14" fill="#5eff9e" opacity="0.1" />
      {[0, 1].map((i) => (
        <ellipse key={`fg${i}`} cx={300 + i * 200} cy="336" rx="220" ry="14" fill="#a8d8e8" opacity="0.06">
          <animate attributeName="cx" values={`${300 + i * 200};${340 + i * 160};${300 + i * 200}`} dur={`${14 + i * 4}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* Baies de serveurs en perspective */}
      {[
        { x: 60, w: 100, h: 240 },
        { x: 180, w: 100, h: 240 },
        { x: 540, w: 100, h: 240 },
        { x: 660, w: 100, h: 240 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x},60)`}>
          <rect x="0" y="0" width={b.w} height={b.h} fill="#141c26" stroke="#0a0e14" strokeWidth="2" />
          {/* Diodes vertes qui clignotent */}
          {Array.from({ length: 12 }).map((_, k) => (faible && (k + i) % 2 ? <circle key={k} cx={16 + (k % 4) * 24} cy={20 + Math.floor(k / 4) * 24} r="3" fill="#1a2a20" /> :
            <circle key={k} cx={16 + (k % 4) * 24} cy={20 + Math.floor(k / 4) * 24} r="3" fill="#5eff9e" opacity="0.7">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.2 + (k % 5) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {faible && i % 2 === 1 && <rect x="0" y="0" width={b.w} height={b.h} fill="#000" opacity="0.55" />}
          {/* Panneaux étroits */}
          {[120, 160, 200].map((y) => (
            <rect key={y} x="4" y={y} width={b.w - 8} height="4" fill="#3a4048" />
          ))}
          {/* rails, unités de serveurs et voyants ambre */}
          <rect x="2" y="2" width="4" height={b.h - 4} fill="#2a3440" /><rect x={b.w - 6} y="2" width="4" height={b.h - 4} fill="#2a3440" />
          {Array.from({ length: 9 }).map((_, k) => (
            <g key={`u${k}`}>
              <rect x="8" y={84 + k * 17} width={b.w - 16} height="13" rx="1.5" fill="#0e151e" stroke="#26303c" strokeWidth="0.8" />
              <circle cx={b.w - 16} cy={90 + k * 17} r="1.6" fill={(k + i) % 4 ? "#5eff9e" : "#ffb04a"}>
                <animate attributeName="opacity" values="1;0.2;1" dur={`${0.6 + ((k * 7 + i) % 5) * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <path d={`M14 ${90 + k * 17} h${b.w - 44}`} stroke="#1a2430" strokeWidth="3" />
            </g>
          ))}
        </g>
      ))}
      {/* Terminal MARTINE au fond, centre */}
      <g transform="translate(400,150)">
        <circle r="120" fill="url(#sv-mart)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* Socle */}
        <rect x="-50" y="60" width="100" height="14" fill="#3a4048" stroke="#0a0e14" strokeWidth="2" />
        <rect x="-40" y="74" width="80" height="80" fill="#141c26" stroke="#0a0e14" strokeWidth="2" />
        {/* Cube MARTINE */}
        <rect x="-40" y="-40" width="80" height="80" fill="#0a1a10" stroke="#5eff9e" strokeWidth="2.5" />
        <rect x="-32" y="-32" width="64" height="64" fill="#0a2818" />
        <text x="0" y="-14" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#5eff9e" letterSpacing="2">MARTINE</text>
        <text x="0" y="0" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e">RÉSEAU M</text>
        <text x="0" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e">v.14.087</text>
        {/* Œil au centre */}
        <circle cx="0" cy="26" r="6" fill="#0a0806" stroke="#5eff9e" strokeWidth="1" />
        <circle cx="0" cy="26" r="2.5" fill="#5eff9e">
          <animate attributeName="r" values="2;3;2" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Câbles au sol */}
      <path d="M0 330 Q400 320 800 330" stroke="#3a4048" strokeWidth="4" fill="none" />
      <path d="M0 340 Q400 335 800 340" stroke="#5eff9e" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* débranchée : le noir ; puis elle se rallume, en clignotant */}
      <rect width="800" height="380" fill="#000" style={{ pointerEvents: "none", transition: "opacity 0.9s ease",
        opacity: lumiere === "eteint" ? 0.94 : 0, animation: lumiere === "rallume" ? "svRallume 1.4s linear both" : "none" }} />
      <style>{"@keyframes svRallume { 0% { opacity: .94; } 30% { opacity: .9; } 38% { opacity: .4; } 46% { opacity: .85; } 60% { opacity: .2; } 70% { opacity: .6; } 100% { opacity: 0; } }"}</style>
    </svg>
  );
}

export default function BunkerServeurs({ prenom, j3, onGo }) {
  const flags = j3?.flags || {};
  const fill = (s) => (s || "").replace(/\{prenom\}/g, prenom || "chronaute");
  /* quelle visite ? (figée à l'arrivée) */
  const [visite] = useState(() => (flags.monde2_fini ? 2 : flags.serveurs_visite1 ? "encore" : 1));
  const [lignes, setLignes] = useState(() => (visite === 2 ? CONFRONTATION.visite2(flags) : visite === 1 ? CONFRONTATION.visite1(flags) : CONFRONTATION.encore));
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("dialogue");   // dialogue | debrancher | note | pret | combat | fin
  const [lumiere, setLumiere] = useState(visite === 2 ? "faible" : "normal");
  const [noteOuverte, setNoteOuverte] = useState(false);
  const [chosen, setChosen] = useState(null);
  useEffect(() => {
    /* 2e visite : la petite MARTINE est forcément là (elle s'est rallumée dans la salle de repos) */
    if (visite === 2 && !flags.petite_martine_allumee) j3?.setFlag?.("petite_martine_allumee");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suite = () => {
    if (step < lignes.length - 1) { setStep(step + 1); return; }
    if (lignes === CONFRONTATION.partout || visite === "encore") setPhase("note");
    else if (visite === 1) setPhase("debrancher");
    else setPhase("pret");
  };
  /* on la débranche : le noir, puis elle se rallume */
  const debrancher = () => {
    setLumiere("eteint"); sonCoupure();
    setPhase("coupure");
    setTimeout(() => {
      setLumiere("rallume"); sonRallume();
      j3?.setFlag?.("serveurs_visite1");
      setTimeout(() => { setLumiere("normal"); setLignes(CONFRONTATION.partout); setStep(0); setPhase("dialogue"); }, 1500);
    }, 2600);
  };
  const choisir = (id) => {
    setChosen(CONFRONTATION.fins.find((f) => f.id === id));
    j3?.setFlag?.(CONFRONTATION.flag);
    j3?.setFlag?.("fin_jeu3", id);
    setPhase("fin");
  };

  /* ─── PHASE END : écran de fin selon le choix ─── */
  if (phase === "fin" && chosen) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 4, color: chosen.couleur }}>
          ◈ FIN — {chosen.label}
        </div>
        <div style={{ maxWidth: 700, textAlign: "center" }}>
          {chosen.texte.map((line, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.6, color: "#e8eef5", margin: "0 0 12px" }}>
              {line}
            </p>
          ))}
          <div style={{ marginTop: 20, padding: "10px 14px", background: "#0e1a30", border: `1px solid ${chosen.couleur}`, borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c8d4e2", fontStyle: "italic", lineHeight: 1.5 }}>
              {chosen.moral}
            </p>
          </div>
        </div>
        {chosen.id !== "soumettre" ? (<>
          <p style={{ fontSize: 11.5, color: "#7a879e", fontStyle: "italic", textAlign: "center", maxWidth: 600, margin: 0 }}>
            Ce n'était pas la « bonne » réponse. Il n'y en a pas. C'est la question qui compte : qui décide de ce qu'on a le droit de savoir ?
          </p>
          <button onClick={() => onGo?.("epilogueJeu3")} autoFocus
            style={{ background: chosen.couleur, color: "#06110b", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2, marginTop: 8 }}>
            Continuer ▸
          </button>
        </>) : (<>
        <p style={{ fontSize: 12, color: "#5a6678", fontFamily: "ui-monospace,monospace", letterSpacing: 2, marginTop: 8 }}>
          — FIN DU JEU 3 —
        </p>
        <p style={{ fontSize: 11.5, color: "#7a879e", fontStyle: "italic", textAlign: "center", maxWidth: 600, margin: 0 }}>
          Ce n'était pas la « bonne » réponse. Il n'y en a pas. C'est la question qui compte : qui décide de ce qu'on a le droit de savoir ?
        </p>
        <p style={{ fontSize: 11, color: "#5a6678", textAlign: "center", marginTop: 12 }}>
          (Utilise le bouton « Menu » en haut à droite pour revenir au titre. Tu peux rejouer et essayer une autre fin.)
        </p>
        </>)}
      </div>
    );
  }

  const bouton = (fond, texte, bord) => ({ background: fond, color: texte, border: bord ? `1px solid ${bord}` : "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 2 });
  const remonter = (
    <button onClick={() => onGo?.("dormants")} style={bouton("#141b26", "#7fd8ff", "#3a80c8")}>← Remonter</button>
  );

  /* ─── le combat, par-dessus tout l'écran ─── */
  if (phase === "combat") {
    return (<>
      <Decor lumiere="faible" />
      {createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
          <CombatMartine integre prenom={prenom} souvenir={j3?.endChoice} onChoix={choisir} onQuitter={() => setPhase("pret")} />
        </div>,
        document.body)}
    </>);
  }

  const ligne = lignes[step];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {/* la note ouverte prend la place du décor */}
      {!(phase === "note" && noteOuverte) && <Decor lumiere={lumiere} />}

      {phase === "dialogue" && ligne && (<>
        <div style={{ maxWidth: 800, width: "100%", background: "#0a1a10", border: "1px solid #5eff9e", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: ligne.qui === "petite" ? "#ffd166" : "#5eff9e" }}>
            {ligne.qui === "martine" ? "◈ MARTINE" : ligne.qui === "petite" ? "◈ LA PETITE MARTINE" : "◈ NIVEAU −3 · SALLE DES SERVEURS"}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "#e8eef5", fontStyle: ligne.qui === "recit" ? "italic" : "normal" }}>
            {fill(ligne.texte)}
          </p>
        </div>
        <button onClick={suite} autoFocus style={{ ...bouton("#5eff9e", "#06110b"), boxShadow: "0 0 18px rgba(94,255,158,0.4)" }}>Suite ▸</button>
      </>)}

      {phase === "debrancher" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c8d4e2", fontStyle: "italic", textAlign: "center", maxWidth: 600 }}>
            Sur le socle, sous l'écran de MARTINE, une rangée de leviers rouges.
          </p>
          <button onClick={debrancher} autoFocus data-debrancher="1"
            style={{ ...bouton("#ff5030", "#1a0604"), fontSize: 15, padding: "12px 28px", boxShadow: "0 0 22px rgba(255,80,48,0.5)" }}>⏻ Débrancher MARTINE</button>
        </div>
      )}

      {phase === "note" && (
        <div style={{ maxWidth: 800, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {flags.caillou_carnet ? (<>
            {noteOuverte ? (<>
              <Papier caillou={CAILLOU.carnet} anime />
              {CONFRONTATION.apresNote.map((t, i) => (
                <p key={i} style={{ margin: 0, fontSize: 15, color: "#ffe2a0", fontStyle: "italic", textAlign: "center" }}>{t}</p>
              ))}
              <div style={{ width: "100%", maxWidth: 560 }}><IndicesMonde flags={flags} setFlag={j3.setFlag} /></div>
            </>) : (
              <p style={{ margin: 0, fontSize: 14, color: "#c8d4e2", fontStyle: "italic", textAlign: "center" }}>
                Dans ta poche, la page du carnet d'Al3x1a. « Si un jour tu essaies de l'éteindre et qu'elle te répond qu'elle est partout… »
              </p>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {!noteOuverte && <button onClick={() => setNoteOuverte(true)} autoFocus data-note="1" style={bouton("#c8a848", "#1a1206")}>📄 Relire la note d'Al3x1a</button>}
              {remonter}
            </div>
          </>) : (<>
            {CONFRONTATION.sansNote(flags).map((t, i) => (
              <p key={i} style={{ margin: 0, fontSize: 14.5, color: i ? "#ffe2a0" : "#c8d4e2", fontStyle: "italic", textAlign: "center", maxWidth: 640 }}>{t}</p>
            ))}
            {remonter}
          </>)}
        </div>
      )}

      {phase === "pret" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setPhase("combat")} autoFocus data-combat="1"
            style={{ ...bouton("#ff5030", "#1a0604"), fontSize: 15, padding: "12px 28px", boxShadow: "0 0 22px rgba(255,80,48,0.5)" }}>⚔ Affronter MARTINE</button>
          {remonter}
        </div>
      )}
    </div>
  );
}

