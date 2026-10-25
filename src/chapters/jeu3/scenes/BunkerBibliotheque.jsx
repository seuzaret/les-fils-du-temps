/* ============================================================
   JEU 3 — SCÈNE : « Bibliothèque » (B-01, niveau +1)
   ------------------------------------------------------------
   L'ancienne bibliothèque de papier de la station. Dix meubles,
   un par classe Dewey (000 → 900), l'affiche des rayons et l'index
   des sujets à l'entrée, la porte de la RÉSERVE au fond (fermée
   tant que Jorge n'a pas donné la clé : flag cle_reserve), un
   écran de MARTINE qui déconseille le papier.
   Clic sur un meuble (ou sur les boutons sous le décor) → le rayon,
   ses livres triés par cote, et les places vides des livres retirés.
   Clic sur un livre → on le feuillette : rien, ou un papier
   d'Al3x1a si c'est son tour (cailloux.js).
   Données : bibliotheque.js.
   ============================================================ */
import { useState } from "react";
import { CeilingPipes, PerspFloor, Vignette } from "../bunkerKit.jsx";
import { rng } from "../../../engine/scenery.jsx";
import { CLASSES, INDEX, livresDuRayon, LIVRES_RESERVE, coteDe, DATE_RETRAIT } from "../bibliotheque.js";
import { caillouDuLivre } from "../cailloux.js";
import { CaillouTrouve } from "../CaillouPapier.jsx";

const MONO = "ui-monospace,monospace";
const SERIF = "Palatino, Georgia, serif";
const COULEUR = Object.fromEntries(CLASSES.map((c) => [c.id, c.couleur]));

/* teinte d'un dos de livre : la couleur du rayon, plus ou moins sombre */
function teinte(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = 0.55 + 0.35 * k;
  const c = (v) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
}

/* ───────────────────────── Décor ───────────────────────── */
function Meuble({ x, classe, onClick }) {
  const r = rng(parseInt(classe.id, 10) / 37 + 3);
  const w = 62;
  return (
    <g transform={`translate(${x},96)`} onClick={onClick} style={{ cursor: "pointer" }} data-rayon={classe.id}
      onMouseEnter={(e) => e.currentTarget.querySelector(".bb-hov").setAttribute("opacity", "1")}
      onMouseLeave={(e) => e.currentTarget.querySelector(".bb-hov").setAttribute("opacity", "0")}>
      <rect className="bb-hov" x="-4" y="-4" width={w + 8} height="304" fill="none" stroke="#ffd166" strokeWidth="2" opacity="0" />
      <rect x="0" y="0" width={w} height="296" fill="#2a1a0e" stroke="#0a0604" strokeWidth="2" />
      <rect x="4" y="22" width={w - 8} height="270" fill="#140c06" />
      {/* plaque du rayon */}
      <rect x="4" y="3" width={w - 8} height="17" fill={classe.couleur} />
      <text x={w / 2} y="15.5" textAnchor="middle" fontFamily={MONO} fontSize="12" fontWeight="800" fill="#0a0604">{classe.id}</text>
      {/* cinq planches de livres */}
      {[0, 1, 2, 3, 4].map((p) => {
        const y0 = 74 + p * 54;
        const dos = [];
        let bx = 6;
        while (bx < w - 9) {
          const bw = 4 + Math.floor(r() * 4);
          const bh = 30 + Math.floor(r() * 16);
          if (r() > 0.12) dos.push(<rect key={bx} x={bx} y={y0 - bh} width={bw} height={bh} fill={teinte(classe.couleur, r())} stroke="#0a0604" strokeWidth="0.3" />);
          bx += bw + 0.6;
        }
        return (
          <g key={p}>
            {dos}
            <rect x="4" y={y0} width={w - 8} height="4" fill="#3a2414" />
          </g>
        );
      })}
    </g>
  );
}

function Decor({ ouverte, onRayon, onAffiche, onReserve }) {
  const poussiere = rng(91);
  return (
    <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
      <defs>
        <linearGradient id="bb-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2218" />
          <stop offset="100%" stopColor="#0e0a06" />
        </linearGradient>
        <linearGradient id="bb-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#24180c" />
          <stop offset="100%" stopColor="#060402" />
        </linearGradient>
        <radialGradient id="bb-lamp" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#ffd890" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffd890" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bb-table" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd890" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd890" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="520" fill="url(#bb-wall)" />
      <rect y="0" width="1000" height="52" fill="#120c06" />
      <CeilingPipes y={26} seed={57} tint="#5a4a34" />
      <rect y="400" width="1000" height="120" fill="url(#bb-floor)" />
      <PerspFloor y0={400} y1={520} step={84} rows={4} opacity={0.35} />
      <path d="M0 400 L1000 400" stroke="#3a2818" strokeWidth="1.5" />
      {/* lampes suspendues */}
      {[290, 710].map((x) => (
        <g key={x}>
          <line x1={x} y1="40" x2={x} y2="62" stroke="#3a2818" strokeWidth="1.5" />
          <path d={`M${x - 18} 74 L${x + 18} 74 L${x + 10} 62 L${x - 10} 62 Z`} fill="#5a4028" />
          <ellipse cx={x} cy="76" rx="8" ry="3" fill="#ffe0a0" />
          <ellipse cx={x} cy="220" rx="260" ry="200" fill="url(#bb-lamp)" />
        </g>
      ))}

      {/* l'écran de MARTINE */}
      <g transform="translate(330,56)">
        <rect x="0" y="0" width="340" height="30" rx="3" fill="#06120c" stroke="#5eff9e" strokeWidth="1.2" />
        <text x="170" y="12.5" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#5eff9e" letterSpacing="1">◈ RÉSEAU M · Les livres de papier contiennent des erreurs.</text>
        <text x="170" y="24" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#5eff9e" letterSpacing="1">Consultez plutôt mes archives. — MARTINE</text>
        <rect x="0" y="0" width="340" height="30" rx="3" fill="#5eff9e" opacity="0.05">
          <animate attributeName="opacity" values="0.02;0.08;0.02" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* l'affiche des rayons, près de l'entrée */}
      <g transform="translate(22,118)" onClick={onAffiche} style={{ cursor: "pointer" }} data-affiche="1">
        <rect x="-3" y="-3" width="118" height="214" fill="#3a2818" />
        <rect x="0" y="0" width="112" height="208" fill="#efe6cf" />
        <text x="56" y="16" textAnchor="middle" fontFamily={SERIF} fontSize="10" fontWeight="700" fill="#2a1a0a">LES RAYONS</text>
        <text x="56" y="27" textAnchor="middle" fontFamily={SERIF} fontSize="6.5" fill="#5a4028" fontStyle="italic">classification de Dewey</text>
        {CLASSES.map((c, i) => (
          <g key={c.id} transform={`translate(8,${36 + i * 16.6})`}>
            <rect x="0" y="0" width="22" height="12" fill={c.couleur} />
            <text x="11" y="9" textAnchor="middle" fontFamily={MONO} fontSize="7" fontWeight="800" fill="#0a0604">{c.id}</text>
            <text x="27" y="9" fontFamily={SERIF} fontSize="6.4" fill="#2a1a0a">{c.nom.length > 19 ? c.nom.slice(0, 18) + "…" : c.nom}</text>
          </g>
        ))}
        <circle cx="56" cy="-1" r="2.4" fill="#c83a2a" />
      </g>

      {/* les dix meubles */}
      {CLASSES.map((c, i) => (
        <Meuble key={c.id} x={150 + i * 68} classe={c} onClick={() => onRayon(c.id)} />
      ))}

      {/* la porte de la réserve */}
      <g transform="translate(848,150)" onClick={onReserve} style={{ cursor: "pointer" }} data-reserve="1">
        <rect x="-4" y="-4" width="138" height="254" fill="#2a2a2e" stroke="#0a0a0c" strokeWidth="2" />
        <rect x="0" y="0" width="130" height="250" fill={ouverte ? "#1a1408" : "#3a3c42"} stroke="#0a0a0c" strokeWidth="2" />
        {ouverte && <rect x="0" y="0" width="130" height="250" fill="#ffd890" opacity="0.12" />}
        {ouverte
          ? <path d="M0 0 L46 14 L46 238 L0 250 Z" fill="#4a4c52" stroke="#0a0a0c" strokeWidth="1.5" />
          : [40, 120, 200].map((y) => <line key={y} x1="10" y1={y} x2="120" y2={y} stroke="#2a2c30" strokeWidth="3" />)}
        <rect x="25" y="26" width="80" height="22" fill="#e8dfc8" stroke="#3a2818" strokeWidth="1" />
        <text x="65" y="41" textAnchor="middle" fontFamily={MONO} fontSize="11" fontWeight="800" fill="#0a0806" letterSpacing="2">RÉSERVE</text>
        {!ouverte && (
          <g transform="translate(104,128)">
            <path d="M-7 0 V-8 Q0 -16 7 -8 V0" fill="none" stroke="#c8a848" strokeWidth="2.4" />
            <rect x="-10" y="0" width="20" height="16" rx="2" fill="#c8a848" stroke="#5a4020" strokeWidth="1" />
            <circle cx="0" cy="7" r="2.2" fill="#3a2810" />
          </g>
        )}
        <text x="65" y="270" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#8a7a5a" letterSpacing="1">{ouverte ? "OUVERTE" : "ACCÈS : L'ARCHIVISTE"}</text>
      </g>

      {/* la table de lecture */}
      <ellipse cx="500" cy="436" rx="210" ry="40" fill="url(#bb-table)" />
      <g transform="translate(330,428)">
        <rect x="0" y="0" width="340" height="12" fill="#5a3a1c" stroke="#1a0e06" strokeWidth="1.5" />
        <rect x="12" y="12" width="10" height="70" fill="#3a2410" />
        <rect x="318" y="12" width="10" height="70" fill="#3a2410" />
        {/* livre ouvert */}
        <path d="M120 0 Q150 -14 170 -4 Q190 -14 220 0 Z" fill="#efe6cf" stroke="#8a7a5a" strokeWidth="0.8" />
        <line x1="170" y1="-4" x2="170" y2="0" stroke="#8a7a5a" />
        {/* lampe de lecture */}
        <rect x="262" y="-4" width="26" height="4" fill="#3a3020" />
        <line x1="275" y1="-4" x2="268" y2="-34" stroke="#3a3020" strokeWidth="2" />
        <path d="M256 -34 L282 -34 L276 -44 L262 -44 Z" fill="#2a5a3a" />
        <ellipse cx="269" cy="-33" rx="9" ry="2.4" fill="#ffe8a8" />
        {/* une pile de livres */}
        <rect x="40" y="-10" width="46" height="10" fill="#8a3820" /><rect x="44" y="-18" width="40" height="8" fill="#3a5878" /><rect x="42" y="-25" width="42" height="7" fill="#5a6a3a" />
      </g>

      {/* poussière dans la lumière */}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = 200 + poussiere() * 600, y = 100 + poussiere() * 280, d = 5 + poussiere() * 6;
        return (
          <circle key={i} cx={x} cy={y} r={0.8 + poussiere() * 1.1} fill="#ffe8b0" opacity="0">
            <animate attributeName="opacity" values="0;0.6;0" dur={`${d}s`} begin={`${(i * 0.7) % 5}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${y};${y + 26}`} dur={`${d}s`} begin={`${(i * 0.7) % 5}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
      <text x="500" y="508" textAnchor="middle" fontFamily={MONO} fontSize="9" fill="#6a5a48" letterSpacing="3">B-01 · BIBLIOTHÈQUE DE LA STATION · FONDS PAPIER</text>
      <Vignette id="bb-vig" strength={0.5} />
    </svg>
  );
}

/* ───────────────────────── Panneaux ───────────────────────── */
const fond = { position: "fixed", inset: 0, zIndex: 220, background: "rgba(4,8,14,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: SERIF };
const carte = (bord) => ({ background: "#0e1420", border: `1px solid ${bord}`, borderRadius: 14, padding: "16px 16px 18px", maxWidth: 720, width: "100%", maxHeight: "calc(100dvh - 32px)", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.6)" });
const fermer = { background: "transparent", border: "1px solid #3a4a64", color: "#c8d4e2", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 13 };

function Entete({ titre, couleur, onClose }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
      <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: couleur, fontWeight: 800 }}>{titre}</div>
      <button onClick={onClose} style={fermer} aria-label="Fermer">✕</button>
    </div>
  );
}

/* un dos de livre, avec l'étiquette de la cote en bas */
function Dos({ livre, classe, onClick, vide }) {
  const c = COULEUR[classe] || "#8a8f99";
  if (vide) {
    return (
      <button onClick={onClick} data-cote={coteDe(livre)} data-vide="1" title="Place vide"
        style={{ width: 62, height: 176, flex: "0 0 auto", border: "2px dashed #5a4a34", borderRadius: 4, background: "#0a0806", color: "#c8a848", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
        <span style={{ fontSize: 9, fontFamily: MONO, lineHeight: 1.3, color: "#8a7a5a", writingMode: "vertical-rl", transform: "rotate(180deg)", flex: 1 }}>place vide</span>
        <span style={{ background: "#efe6cf", color: "#a02a1a", fontFamily: MONO, fontSize: 8, fontWeight: 800, padding: "2px 3px", borderRadius: 2, lineHeight: 1.3 }}>RETIRÉ</span>
      </button>
    );
  }
  return (
    <button onClick={onClick} data-cote={coteDe(livre)} title={livre.titre}
      style={{ width: 62, height: 176, flex: "0 0 auto", border: "1px solid #0a0604", borderRadius: "3px 3px 2px 2px", background: `linear-gradient(90deg, ${teinte(c, 0.3)} 0%, ${teinte(c, 0.9)} 45%, ${teinte(c, 0.5)} 100%)`, color: "#f4ecd8", cursor: "pointer", padding: "8px 4px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
      <span style={{ flex: 1, writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: SERIF, fontSize: 12, lineHeight: 1.1, overflow: "hidden", textShadow: "0 1px 1px rgba(0,0,0,0.6)" }}>{livre.titre}</span>
      <span style={{ background: "#f4f0e4", color: "#1a1206", fontFamily: MONO, fontSize: 11, fontWeight: 800, padding: "2px 3px", borderRadius: 2, lineHeight: 1.25, minWidth: 48, textAlign: "center" }}>
        {livre.indice}<br />{livre.lettres}
      </span>
    </button>
  );
}

function Rayon({ classeId, reserve, onLivre, onVide, onClose }) {
  const classe = CLASSES.find((c) => c.id === classeId);
  const livres = reserve ? LIVRES_RESERVE : livresDuRayon(classeId);
  return (
    <div onClick={onClose} style={fond}>
      <div onClick={(e) => e.stopPropagation()} style={carte(reserve ? "#c83a2a" : classe.couleur)}>
        <Entete titre={reserve ? "🔓 LA RÉSERVE" : `RAYON ${classe.id} · ${classe.nom.toUpperCase()}`} couleur={reserve ? "#ff8a7a" : classe.couleur} onClose={onClose} />
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#8fa3bd", fontStyle: "italic" }}>
          {reserve
            ? `Une petite pièce sans fenêtre, une étagère en métal. Les livres que MARTINE a fait retirer des rayons le ${DATE_RETRAIT}, le jour où le Puits a été scellé. Jorge ne les a jamais détruits.`
            : `${classe.exemples[0].toUpperCase()}${classe.exemples.slice(1)}. Les livres sont rangés par cote, de gauche à droite.`}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 10px 0", background: "linear-gradient(180deg, #1a1008 0%, #120a04 100%)", borderRadius: 8, borderBottom: "8px solid #3a2414" }}>
          {livres.map((l) => (
            <Dos key={coteDe(l)} livre={l} classe={reserve ? `${l.indice[0]}00` : classeId}
              vide={!reserve && l.reserve}
              onClick={() => (!reserve && l.reserve ? onVide(l) : onLivre(l, reserve))} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Livre({ livre, reserve, flags, onCaillou, onClose }) {
  const [feuillete, setFeuillete] = useState(false);
  const caillou = caillouDuLivre(coteDe(livre), flags);
  const classe = `${livre.indice[0]}00`;
  const c = COULEUR[classe];
  const indiceSerres = livre.serres && flags.caillou_contes && !flags.caillou_serres;
  return (
    <div onClick={onClose} style={{ ...fond, zIndex: 260 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...carte(c), maxWidth: 520 }}>
        <Entete titre={`📖 ${coteDe(livre)}`} couleur={c} onClose={onClose} />
        <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
          <div style={{ flex: "0 0 92px", minHeight: 128, background: `linear-gradient(135deg, ${teinte(c, 0.95)}, ${teinte(c, 0.35)})`, borderRadius: "2px 6px 6px 2px", boxShadow: "inset 6px 0 0 rgba(0,0,0,0.25)", position: "relative" }}>
            <span style={{ position: "absolute", left: 8, right: 8, bottom: 8, background: "#f4f0e4", color: "#1a1206", fontFamily: MONO, fontSize: 11, fontWeight: 800, textAlign: "center", borderRadius: 2, lineHeight: 1.25, padding: "2px 0" }}>{livre.indice}<br />{livre.lettres}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: "#f4ecd8", lineHeight: 1.25 }}>{livre.titre}</div>
            <div style={{ fontSize: 14, color: "#c8d4e2", margin: "4px 0 8px", fontStyle: "italic" }}>{livre.auteur}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#e8eef5" }}>{livre.resume}</p>
            {reserve && (
              <div style={{ display: "inline-block", marginTop: 10, transform: "rotate(-4deg)", border: "3px solid #c83a2a", color: "#e85a4a", fontFamily: MONO, fontWeight: 800, fontSize: 11, letterSpacing: 1, padding: "3px 8px", borderRadius: 4 }}>
                RETIRÉ · {DATE_RETRAIT.toUpperCase()} · M.
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 14, borderTop: "1px dashed #3a4a64", paddingTop: 12 }}>
          {!feuillete ? (
            <button onClick={() => setFeuillete(true)} autoFocus
              style={{ background: "#c8a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 800, fontSize: 13, fontFamily: MONO, cursor: "pointer" }}>
              📖 Feuilleter
            </button>
          ) : caillou ? (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: "#ffd166", fontStyle: "italic" }}>Entre deux pages, quelque chose dépasse : un papier plié.</p>
              <button onClick={() => onCaillou(caillou)} autoFocus
                style={{ background: "#ffd166", color: "#1a1206", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 800, fontSize: 13, fontFamily: MONO, cursor: "pointer" }}>
                📄 Déplier le papier
              </button>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 14, color: "#8fa3bd", fontStyle: "italic" }}>
              {livre.aide || (indiceSerres
                ? "Rien entre les pages. Mais la photo de la couverture te dit quelque chose : des tours de plantes sous des lampes roses, comme dans les serres du niveau −2."
                : "Tu feuillettes. Rien entre les pages.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Affiche({ onClose }) {
  const [q, setQ] = useState("");
  const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const sujets = INDEX.filter(([s]) => norm(s).includes(norm(q.trim())));
  return (
    <div onClick={onClose} style={fond}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...carte("#c8a848"), background: "#efe6cf", color: "#2a1a0a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, fontWeight: 800 }}>📜 LES RAYONS DE LA BIBLIOTHÈQUE</div>
          <button onClick={onClose} style={{ ...fermer, color: "#2a1a0a", border: "1px solid #8a7a5a" }} aria-label="Fermer">✕</button>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontStyle: "italic", color: "#5a4028" }}>
          Classification de Melvil Dewey (1876). La <b>cote</b> collée sur le dos d'un livre est son adresse : le premier chiffre donne le rayon, les suivants précisent le sujet, les trois lettres viennent du nom de l'auteur.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 6, marginBottom: 14 }}>
          {CLASSES.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#f7f1e0", borderRadius: 6, padding: "6px 8px" }}>
              <span style={{ flex: "0 0 auto", background: c.couleur, color: "#0a0604", fontFamily: MONO, fontWeight: 800, fontSize: 12, padding: "2px 6px", borderRadius: 3 }}>{c.id}</span>
              <span style={{ fontSize: 13, lineHeight: 1.35 }}><b>{c.nom}</b><br /><span style={{ color: "#5a4028" }}>{c.exemples}</span></span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, fontWeight: 800, margin: "4px 0 6px" }}>INDEX DES SUJETS</div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un sujet…" aria-label="Chercher un sujet"
          style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: "1px solid #8a7a5a", background: "#fffaf0", fontSize: 14, fontFamily: SERIF, marginBottom: 8 }} />
        <div style={{ columns: "220px 3", columnGap: 18, fontSize: 13.5, lineHeight: 1.6 }}>
          {sujets.map(([s, cote]) => (
            <div key={s} style={{ breakInside: "avoid", display: "flex", gap: 6 }}>
              <span>{s}</span><span style={{ flex: 1, borderBottom: "1px dotted #8a7a5a", transform: "translateY(-5px)" }} /><b style={{ fontFamily: MONO }}>{cote}</b>
            </div>
          ))}
          {sujets.length === 0 && <div style={{ fontStyle: "italic", color: "#5a4028" }}>Aucun sujet de l'index ne correspond. Essaie un autre mot.</div>}
        </div>
      </div>
    </div>
  );
}

function Message({ texte, onClose }) {
  return (
    <div onClick={onClose} style={{ ...fond, zIndex: 260 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...carte("#c8a848"), maxWidth: 460, textAlign: "center" }}>
        <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.55, color: "#e8eef5" }}>{texte}</p>
        <button onClick={onClose} autoFocus style={{ background: "#c8a848", color: "#1a1206", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 800, fontSize: 13, fontFamily: MONO, cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}

/* ───────────────────────── Scène ───────────────────────── */
export default function BunkerBibliotheque({ onGo, j3 }) {
  const flags = j3.flags;
  const ouverte = !!flags.cle_reserve;
  const [rayon, setRayon] = useState(null);       // id de classe, ou "reserve"
  const [livre, setLivre] = useState(null);       // { livre, reserve }
  const [affiche, setAffiche] = useState(false);
  const [message, setMessage] = useState(null);
  const [caillou, setCaillou] = useState(null);

  const ouvrirReserve = () => {
    if (ouverte) setRayon("reserve");
    else setMessage("La porte de la réserve est fermée à clé. Une plaque : « Accès réservé à l'archiviste ».");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 1600 }}>
      <Decor ouverte={ouverte} onRayon={setRayon} onAffiche={() => setAffiche(true)} onReserve={ouvrirReserve} />

      <div style={{ maxWidth: 900, width: "100%" }}>
        <div style={{ background: "#0a0e14", border: "1px dashed #5a4a34", borderRadius: 10, padding: "10px 14px", textAlign: "center", marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c8d4e2", lineHeight: 1.5, fontStyle: "italic" }}>
            Des livres de papier, couverts de poussière. Personne ne vient plus ici, sauf Lior, la nuit. Chaque meuble est un rayon ; l'affiche de l'entrée dit ce qu'il contient.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {CLASSES.map((c) => (
            <button key={c.id} onClick={() => setRayon(c.id)}
              style={{ background: "#141008", color: "#f4ecd8", border: `1px solid ${c.couleur}`, borderLeft: `6px solid ${c.couleur}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontFamily: MONO }}>
              {c.id} <span style={{ fontFamily: SERIF, opacity: 0.85 }}>{c.nom}</span>
            </button>
          ))}
          <button onClick={() => setAffiche(true)}
            style={{ background: "#efe6cf", color: "#2a1a0a", border: "1px solid #8a7a5a", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: MONO, fontWeight: 700 }}>
            📜 L'affiche et l'index
          </button>
          <button onClick={ouvrirReserve}
            style={{ background: ouverte ? "#2a1008" : "#1a1c22", color: ouverte ? "#ffb0a0" : "#8fa3bd", border: `1px solid ${ouverte ? "#c83a2a" : "#3a4a64"}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: MONO, fontWeight: 700 }}>
            {ouverte ? "🔓 La réserve" : "🔒 La réserve"}
          </button>
        </div>
      </div>

      <button onClick={() => onGo(j3.hubRoom || "hubHaut")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: MONO, letterSpacing: 1 }}>
        ← Retour au couloir
      </button>

      {rayon && (
        <Rayon classeId={rayon === "reserve" ? null : rayon} reserve={rayon === "reserve"}
          onLivre={(l, reserve) => setLivre({ livre: l, reserve })}
          onVide={(l) => setMessage(`Une fiche glissée à la place du livre : « ${coteDe(l)} · ${l.titre} · retiré des rayons le ${DATE_RETRAIT} · voir la réserve ».`)}
          onClose={() => setRayon(null)} />
      )}
      {livre && (
        <Livre key={coteDe(livre.livre)} livre={livre.livre} reserve={livre.reserve} flags={flags}
          onCaillou={(c) => { setLivre(null); setRayon(null); setCaillou(c); }}
          onClose={() => setLivre(null)} />
      )}
      {affiche && <Affiche onClose={() => setAffiche(false)} />}
      {message && <Message texte={message} onClose={() => setMessage(null)} />}
      {caillou && <CaillouTrouve caillou={caillou} onGarder={() => { j3.setFlag(caillou.flag); setCaillou(null); }} />}
    </div>
  );
}
