/* ============================================================
   ÉCRAN TITRE — maquette C « LA PELLICULE » (?titre=c)
   ------------------------------------------------------------
   Le jeu se montre lui-même : deux pellicules défilent en
   perspective dans le faisceau d'un projecteur, avec de vraies
   vignettes des tableaux du Jeu 1 (deux par époque, de la grotte
   au datacenter). Le projecteur, c'est MARTINE : le faisceau sort
   du hublot de son œil (elle est la mémoire du voyage).
   Les vignettes sont fabriquées dans le navigateur, une à une après
   l'affichage (même technique que la finale du monde 2 :
   renderToStaticMarkup → image SVG figée), et apparaissent en fondu.
   Mouvement réduit : les pellicules ne défilent pas.
   ============================================================ */
import { useEffect, useState } from "react";
import { Avatar } from "../engine/Martine.jsx";
import useEcran from "../engine/useEcran.js";
import { CHAPTERS } from "../chapters/index.js";
import { urlDuTableau } from "../engine/vignette.js";
import { CSS_TITRE, TitreLettres, Accroche, MenuTitre } from "./commun.jsx";

const REDUIT = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
/* deux tableaux par époque : une pellicule chacun */
const CHOIX = [
  ["interieur", "campement"], ["plaine", "muraille"], ["uruk", "pyramide"], ["forum", "port"], ["gutenberg", "chateau"],
  ["imprimerie", "province"], ["telegraphe", "cinema"], ["bbc", "eniac"], ["salon69", "kiosque"], ["chambre", "datacenter"],
];
const IMAGES = [0, 1].map((r) => CHOIX.map((paire, i) => {
  const ch = CHAPTERS[i];
  const sc = ch?.scenes.find((s) => s.id === paire[r]) || ch?.scenes[r] || ch?.scenes[0];
  return { cle: `${i}-${paire[r]}`, Composant: sc?.Component, date: ch?.date, epoque: ch?.epoque };
}));

/* fabrique les vignettes une par une, sans figer la page */
function useVignettes() {
  const [urls, setUrls] = useState({});
  useEffect(() => {
    let fini = false;
    const file = [...IMAGES[0], ...IMAGES[1]];
    let k = 0;
    const suivante = () => {
      if (fini || k >= file.length) return;
      const it = file[k++];
      try { const u = it.Composant ? urlDuTableau(it.Composant) : null; if (u) setUrls((o) => ({ ...o, [it.cle]: u })); } catch { /* tableau ignoré */ }
      setTimeout(suivante, 40);
    };
    const t = setTimeout(suivante, 250);
    return () => { fini = true; clearTimeout(t); };
  }, []);
  return urls;
}

function Pellicule({ images, urls, w, sens, duree, style }) {
  const h = Math.round(w * 0.56), trou = Math.max(6, Math.round(w * 0.045)), bord = trou * 2.4;
  const cadre = (it, j) => (
    <div key={`${it.cle}-${j}`} style={{ flex: "0 0 auto", width: w, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ width: w, height: h, borderRadius: 4, overflow: "hidden", background: "#120e0a", boxShadow: "inset 0 0 0 1px rgba(255,220,160,0.15)" }}>
        {urls[it.cle] && <img src={urls[it.cle]} alt="" draggable={false} style={{ width: "100%", height: "100%", display: "block", animation: "ttpIn .9s ease-out both", filter: "sepia(0.18) saturate(1.05)" }} />}
      </div>
    </div>
  );
  const bande = (cote) => (
    <div style={{ height: bord, display: "flex", alignItems: "center", gap: trou * 1.5, padding: `0 ${trou}px`, overflow: "hidden" }}>
      {Array.from({ length: Math.ceil((images.length * 2 * (w + 18)) / (trou * 2.5)) }).map((_, k) => (
        <span key={k} style={{ flex: "0 0 auto", width: trou, height: trou * 1.3, borderRadius: 2, background: "#f6ead0", opacity: 0.85 }} />
      ))}
    </div>
  );
  const piste = [...images, ...images];
  return (
    <div style={{ position: "absolute", left: "-30%", right: "-30%", ...style }}>
      <div style={{ display: "inline-flex", flexDirection: "column", background: "linear-gradient(180deg, #1a140e, #0c0906)", boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        willChange: "transform", animation: REDUIT ? "none" : `${sens < 0 ? "ttpGauche" : "ttpDroite"} ${duree}s linear infinite` }}>
        {bande("haut")}
        <div style={{ display: "flex", gap: 18, padding: `0 ${trou}px` }}>{piste.map(cadre)}</div>
        <div style={{ display: "flex", gap: 18, padding: `2px ${trou}px 0`, fontFamily: "ui-monospace, monospace", fontSize: Math.max(9, w * 0.04), letterSpacing: 2, color: "#e8b860", opacity: 0.8 }}>
          {piste.map((it, j) => <span key={j} style={{ flex: "0 0 auto", width: w }}>{(it.date || "").toUpperCase()} · {(it.epoque || "").toUpperCase()}</span>)}
        </div>
        {bande("bas")}
      </div>
    </div>
  );
}

export default function TitrePellicule({ m }) {
  const { portrait, bas } = useEcran();
  const paysageBas = bas && !portrait;
  const urls = useVignettes();
  const w = portrait ? 170 : paysageBas ? 150 : 250;
  const titre = portrait ? "min(13vw, 58px)" : paysageBas ? "36px" : "clamp(44px, 5.4vw, 84px)";

  return (
    <div style={{ position: "relative", minHeight: "100dvh", overflow: "hidden", background: "#06070c" }}>
      <style>{CSS_TITRE + `
        @keyframes ttpGauche { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ttpDroite { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes ttpIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ttpScintille { 0%, 100% { opacity: 0.9; } 47% { opacity: 0.82; } 50% { opacity: 1; } 53% { opacity: 0.86; } }`}</style>

      {/* les pellicules, en perspective */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, perspective: 1100, perspectiveOrigin: "50% 30%", overflow: "hidden" }}>
        <Pellicule images={IMAGES[0]} urls={urls} w={w} sens={-1} duree={70}
          style={{ top: portrait ? "33%" : paysageBas ? "24%" : "31%", transform: `rotateX(${portrait ? 8 : 14}deg) rotateY(-14deg) rotateZ(-5deg)`, opacity: 0.95 }} />
        <Pellicule images={IMAGES[1]} urls={urls} w={Math.round(w * 0.82)} sens={1} duree={90}
          style={{ top: portrait ? "52%" : paysageBas ? "60%" : "62%", transform: `rotateX(${portrait ? 10 : 18}deg) rotateY(12deg) rotateZ(4deg)`, opacity: 0.42 }} />
      </div>

      {/* le faisceau qui sort de l'œil de MARTINE, la poussière, le vignettage */}
      <svg aria-hidden="true" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="ttp-faisceau" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2c8" stopOpacity="0.32" /><stop offset="1" stopColor="#fff2c8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ttp-vignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <path d="M 488 60 L 512 60 L 1000 1000 L 0 1000 Z" fill="url(#ttp-faisceau)" />
        <rect width="1000" height="1000" fill="url(#ttp-vignette)" />
      </svg>
      <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: portrait ? "1.2%" : "0.5%", transform: "translateX(-50%)", zIndex: 1, filter: "drop-shadow(0 0 18px rgba(127,216,255,0.35))" }}>
        <Avatar size={portrait ? 62 : 70} mood="neutre" />
      </div>

      <div style={{ position: "relative", zIndex: 2, minHeight: "100dvh", boxSizing: "border-box", display: "flex", flexDirection: paysageBas ? "row" : "column",
        alignItems: "center", justifyContent: "space-between", gap: 12, padding: portrait ? "11vh 16px 18px" : paysageBas ? "56px 20px 12px" : "11vh 24px 4vh" }}>
        <div style={{ width: "100%", boxSizing: "border-box", maxWidth: paysageBas ? "52%" : 980, padding: portrait ? "8px 0 12px" : "10px 16px 14px", borderRadius: 24,
          background: "radial-gradient(ellipse at center, rgba(6,7,12,0.78) 0%, rgba(6,7,12,0.45) 60%, rgba(6,7,12,0) 100%)" }}>
          <TitreLettres taille={titre} />
          <Accroche petit={portrait || paysageBas} />
        </div>
        <MenuTitre m={m} largeur={paysageBas ? 330 : portrait ? 380 : 440} compact={portrait || paysageBas} />
      </div>
    </div>
  );
}
