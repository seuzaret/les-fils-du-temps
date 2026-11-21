import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PnjSprite from "./PnjSprite.jsx";
import { findMissionTemoinForPnj } from "./missions.js";
import { teaserFor } from "./teasers.js";

/* ============================================================
   JEU 3 — Pièce peuplée de PNJ (helper Cluedo)
   ------------------------------------------------------------
   Rend un décor SVG en fond, y superpose les PNJ (cliquables),
   et affiche sous le SVG un panneau de dialogue avec la
   réplique du PNJ actuellement sélectionné. Un bouton
   « Retour au couloir » en bas.
   Props :
     titre    — libellé du bandeau
     bg       — JSX du décor à insérer dans le SVG (viewBox 0 0 800 400)
     pnjList  — [{id, nom, role, pose, color, hair, replique,
                 repliqueApres, ou}] (voir pnj.js)
     j3       — l'état partagé (heardPnj, hear(), flags)
     onGo     — callback navigation
   ============================================================ */
export default function PnjRoom({ titre, bg, pnjList, j3, onGo }) {
  const [selected, setSelected] = useState(null);
  const [smalltalk, setSmalltalk] = useState(null); // id du témoin dont on lit l'amorce
  const [ouPour, setOuPour] = useState(null); // id du PNJ qui a répondu à « On est où, ici ? »
  const current = selected ? pnjList.find((p) => p.id === selected) : null;
  const chatPnj = smalltalk ? pnjList.find((p) => p.id === smalltalk) : null;
  const activeMission = j3?.activeMission;
  /* La réplique change avec l'histoire : confiance en MARTINE avant
     l'arrestation de Jorge, doutes à voix haute après (pnj.js). */
  const apres = !!j3.flags?.jorge_arrete;
  const repliqueDe = (p) => (apres && p.repliqueApres) || p.replique;
  /* Avant le billet de Vez, le joueur vient de se réveiller et ne sait
     pas où il est : chaque PNJ peut lui répondre. */
  const perdu = !j3.flags?.puits_billet;
  /* BULLE (retour du créateur, 2026-11-20 : « quand le texte des
     dialogues apparaît en bas, l'image se réduit et c'est bizarre ») :
     la réplique s'affiche dans une bulle posée sur la scène, au-dessus
     de la tête du PNJ, et la scène ne bouge plus. Si la scène est trop
     petite pour une bulle (téléphone en portrait), le panneau reste
     sous la scène : la place est libre en dessous, rien ne rétrécit. */
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const bulleRef = useRef(null);
  const panneauRef = useRef(null);
  const [cadre, setCadre] = useState(null); // dessin dans rootRef : origine (x, y) et échelle k
  /* Hauteur mesurée de la bulle, une par largeur (normale, élargie), pour
     CE contenu et CETTE taille d'écran ; et la bulle élargie ou non. */
  const [hauteurs, setHauteurs] = useState({ cle: "", normal: 0, large: 0 });
  const [large, setLarge] = useState("");
  useLayoutEffect(() => {
    const svg = svgRef.current, root = rootRef.current;
    if (!svg || !root) return undefined;
    const mesure = () => {
      const r = svg.getBoundingClientRect(), R = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const k = Math.min(r.width / 1000, r.height / 520);
      const c = {
        k,
        x: r.left - R.left + root.scrollLeft + (r.width - 1000 * k) / 2,
        y: r.top - R.top + root.scrollTop + (r.height - 520 * k) / 2,
        paysage: R.width > R.height,
      };
      setCadre((v) => (v && Math.abs(v.k - c.k) < 1e-4 && Math.abs(v.x - c.x) < 0.5 && Math.abs(v.y - c.y) < 0.5 && v.paysage === c.paysage ? v : c));
    };
    mesure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(mesure) : null;
    ro?.observe(svg); ro?.observe(root);
    window.addEventListener("resize", mesure);
    return () => { ro?.disconnect(); window.removeEventListener("resize", mesure); };
  }, []);
  /* Bulle partout, sauf sur un écran en portrait où la scène est petite :
     là, le panneau sous la scène tombe dans la place libre. */
  const enBulle = !!cadre && (cadre.k * 520 >= 200 || (cadre.paysage && cadre.k * 520 >= 120));
  const cleBulle = `${selected}|${ouPour}|${cadre ? cadre.k.toFixed(4) : ""}`;
  const estLarge = large === cleBulle;
  const hs = hauteurs.cle === cleBulle ? hauteurs : { cle: cleBulle, normal: 0, large: 0 };
  const hBulle = estLarge ? hs.large : hs.normal;
  /* Panneau sous la scène (portrait) : s'il tombe sous le bord, on le
     fait défiler jusqu'à lui. */
  useEffect(() => {
    if (enBulle || !selected || !panneauRef.current) return;
    const calme = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-calme");
    panneauRef.current.scrollIntoView({ block: "nearest", behavior: calme ? "auto" : "smooth" });
  }, [selected, ouPour, enBulle]);

  /* Ce que dit le PNJ, dans la bulle comme dans le panneau. La réponse
     à « On est où, ici ? » prend la place de la réplique (déjà lue) ;
     recliquer le PNJ la réaffiche. */
  const tx = cadre && cadre.k * 520 >= 380 ? 16.5 : 15.5;
  const contenu = (p) => (
    <>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12.5, letterSpacing: 2, color: "#7fd8ff" }}>
        {p.nom.toUpperCase()} · {p.role}
      </div>
      {ouPour === p.id ? (
        <>
          <p style={{ margin: "4px 0 0", fontSize: 15, color: "#8fa3bd", fontStyle: "italic" }}>Toi : « On est où, ici ? »</p>
          <p style={{ margin: "3px 0 0", fontSize: tx, lineHeight: 1.5, color: "#e8eef5" }}>{p.ou}</p>
        </>
      ) : (
        <p style={{ margin: "4px 0 0", fontSize: tx, lineHeight: 1.5, color: "#e8eef5" }}>{repliqueDe(p)}</p>
      )}
      {perdu && p.ou && ouPour !== p.id && (
        <button onClick={() => setOuPour(p.id)}
          style={{ marginTop: 8, background: "#0e2a3a", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 8, padding: "6px 12px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "ui-monospace,monospace" }}>
          ❓ On est où, ici ?
        </button>
      )}
    </>
  );

  /* Position de la bulle, dans cet ordre :
     1. au-dessus de la tête, centrée, la pointe vers le PNJ ;
     2. si elle est trop haute pour tenir au-dessus : à côté du PNJ,
        du côté où il y a le plus de place, la pointe vers sa tête ;
     3. si la place manque aussi sur les côtés : élargie (moins haute),
        au-dessus, quitte à recouvrir le haut de la scène. */
  const placer = (p, h, lg, forcer) => {
    const { k, x, y } = cadre;
    const W = 1000 * k;
    const assis = p.poseKind === "sit";
    const hx = x + p.pose.x * k;
    const hy = y + (p.pose.y - (assis ? 118 : 128)) * k;      // haut de la tête
    const hc = y + (p.pose.y - (assis ? 88 : 98)) * k;        // milieu de la tête
    const wN = Math.round(Math.min(500, Math.max(260, W * 0.55)));
    const w = lg ? Math.round(Math.min(W - 16, 640, Math.max(wN, W * 0.85))) : wN;
    const dessus = hy - 12 - h;
    const centre = Math.min(Math.max(x + 8, hx - w / 2), x + W - w - 8);
    if (dessus >= y + 6) return { mode: "dessus", w, left: centre, top: dessus, pointe: hx - centre };
    if (!lg) {
      const gauche = hx - x, droite = x + W - hx;
      const cote = gauche >= droite ? "gauche" : "droite";
      if (Math.max(gauche, droite) >= w + 30) {
        const left = cote === "gauche" ? Math.max(x + 6, hx - 24 - w) : Math.min(x + W - w - 6, hx + 24);
        return { mode: cote, w, left, top: y + 6, pointe: hc - (y + 6) };
      }
    }
    if (lg || forcer) return { mode: "recouvre", w, left: centre, top: y + 6, pointe: 0 };
    return null; // à élargir
  };
  const place = enBulle && current ? placer(current, hBulle, estLarge, true) : null;
  /* Mesure de la bulle après chaque rendu : sa hauteur décide de sa
     place. Garde-fou : quelques ajustements au plus pour une même
     bulle (sinon React s'arrête sur « trop de mises à jour »). */
  const ajustes = useRef({ cle: "", n: 0 });
  useLayoutEffect(() => {
    if (!enBulle || !bulleRef.current || !current) return;
    if (ajustes.current.cle !== cleBulle) ajustes.current = { cle: cleBulle, n: 0 };
    if (ajustes.current.n >= 6) return;
    const h = bulleRef.current.offsetHeight;
    const champ = estLarge ? "large" : "normal";
    if (hs[champ] !== h) { ajustes.current.n += 1; setHauteurs({ ...hs, [champ]: h }); return; }
    if (!estLarge && !placer(current, h, false, false)) { ajustes.current.n += 1; setLarge(cleBulle); }
  });

  let bulle = null;
  if (place) {
    const { mode, w, left, top, pointe } = place;
    const bord = "1.5px solid #3a80c8";
    const pointeStyle = mode === "dessus"
      ? { left: Math.min(Math.max(14, pointe - 8), w - 30), bottom: -9, borderRight: bord, borderBottom: bord }
      : mode === "gauche"
        ? { right: -9, top: Math.min(Math.max(14, pointe - 8), Math.max(14, hBulle - 30)), borderRight: bord, borderTop: bord }
        : mode === "droite"
          ? { left: -9, top: Math.min(Math.max(14, pointe - 8), Math.max(14, hBulle - 30)), borderLeft: bord, borderBottom: bord }
          : null;
    /* Calque de la taille de la pièce, qui rogne la bulle : elle ne
       peut jamais faire apparaître la barre de défilement (ce qui
       changeait la largeur de la scène, donc la place de la bulle :
       une boucle sans fin sur téléphone en paysage). */
    bulle = (
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
        <div ref={bulleRef} data-bulle data-place={mode} onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", left, top, width: w, boxSizing: "border-box", pointerEvents: "auto", background: "#141020", border: bord, borderRadius: 12, padding: "9px 13px 11px", boxShadow: "0 6px 18px rgba(0,0,0,0.55)", cursor: "default" }}>
          {contenu(current)}
          {pointeStyle && (
            <div style={{ position: "absolute", width: 16, height: 16, background: "#141020", transform: "rotate(45deg)", ...pointeStyle }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} onClick={() => setSelected(null)}
      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 1600, height: "100%", padding: 4, boxSizing: "border-box", overflowY: "auto" }}>
      {titre && (
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, color: "#8fa3bd" }}>
          {titre}
        </div>
      )}
      <svg ref={svgRef} viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%", cursor: selected ? "pointer" : "default" }}
        onClick={(e) => { e.stopPropagation(); setSelected(null); }}>
        {bg}
        {pnjList.map((p) => {
          /* Si ce PNJ est un témoin de l'enquête active, cliquer l'ouvre
             en mode interrogatoire (modal top-level) au lieu de la
             réplique d'ambiance. Un halo doré signale cette qualité. */
          const temoin = findMissionTemoinForPnj(activeMission, p.id);
          const heardAsPnj = !!j3.heardPnj[p.id];
          const asked = temoin ? (j3.enqAnswered?.[temoin.id]?.size || 0) : 0;
          /* Loupe visible seulement sur les témoins de l'enquête active,
             une fois le briefing de Vez lu (amorce avant l'interrogatoire
             officiel). Sinon aucune loupe, pour ne rien spoiler. */
          const activeBriefed = !!activeMission && !!j3.flags?.[`briefing_${activeMission.id}_done`];
          const showLoupe = activeBriefed && !!temoin;
          /* L'interrogatoire officiel ne s'ouvre qu'après briefing — sinon
             on retombe sur la réplique d'ambiance. Évite que la cantine
             déballe l'enquête Viande (ou autre) avant que Vez ait donné
             la mission. */
          const canInterview = !!temoin && activeBriefed;
          return (
            <PnjSprite key={p.id}
              x={p.pose.x} y={p.pose.y}
              color={p.color} hair={p.hair} pants={p.pants} skin={p.skin}
              look={p.look} hat={p.hat} hatColor={p.hatColor} hatColor2={p.hatColor2} mustache={p.mustache} glasses={p.glasses} earrings={p.earrings}
              mood={p.mood} bald={p.bald} beard={p.beard} beardKind={p.beardKind}
              facing={p.facing || "front"}
              pose={p.poseKind || "stand"} accessory={p.accessory || null}
              activity={p.activity || null}
              nom={p.nom} role={p.role}
              heard={canInterview ? asked > 0 : heardAsPnj}
              active={canInterview && asked === 0}
              onSmalltalk={showLoupe ? () => setSmalltalk(p.id) : null}
              onClick={() => {
                if (canInterview) {
                  j3.openInterview(temoin.id);
                  j3.hear(p.id);
                } else {
                  setSelected(p.id);
                  setOuPour(null);
                  j3.hear(p.id);
                }
              }} />
          );
        })}
      </svg>
      {bulle}
      {enBulle ? (
        /* Une seule ligne, de hauteur fixe : la scène ne bouge pas. */
        <div style={{ maxWidth: 820, width: "100%", textAlign: "center", fontSize: 14.5, color: "#7a879e", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flexShrink: 0 }}>
          {current ? "Clique ailleurs pour fermer la bulle." : "Clique sur un habitant pour l'écouter."}
        </div>
      ) : (
        <div style={{ maxWidth: 820, width: "100%", minHeight: 90 }}>
          {current ? (
            <div ref={panneauRef} data-bulle onClick={(e) => e.stopPropagation()}
              style={{ background: "#141020", border: "1px solid #3a80c8", borderRadius: 10, padding: "12px 16px", cursor: "default" }}>
              {contenu(current)}
              <div style={{ marginTop: 6, fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#5a7a90", fontStyle: "italic", textAlign: "right" }}>
                Clique ailleurs pour fermer ▸
              </div>
            </div>
          ) : (
            <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 14.5, color: "#7a879e", fontStyle: "italic" }}>
                Clique sur un habitant pour l'écouter.
              </p>
            </div>
          )}
        </div>
      )}

      {chatPnj && (
        <SmalltalkModal
          pnj={chatPnj}
          temoin={findMissionTemoinForPnj(activeMission, chatPnj.id)}
          onInterview={(temoinId) => {
            setSmalltalk(null);
            j3.openInterview(temoinId);
            j3.hear(chatPnj.id);
          }}
          onClose={() => setSmalltalk(null)} />
      )}
    </div>
  );
}

/* --------- Modale d'amorce d'enquête ---------
   Sur un PNJ témoin de l'enquête active (briefing lu) : une phrase
   d'amorce + le bouton qui lance l'interrogatoire officiel. (L'ancien
   mode « orientation » à trois questions a été retiré le 2026-11-20 :
   « Et toi ? » répétait la réplique ; « On est où, ici ? » est
   maintenant un bouton du panneau, avant le billet.) */
function SmalltalkModal({ pnj, temoin, onInterview, onClose }) {
  if (!temoin) return null;
  const teaser = teaserFor(temoin.id);
  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1218", border: "2px solid #7fd8ff", borderRadius: 12, padding: 18, maxWidth: 620, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, letterSpacing: 2, color: "#7fd8ff" }}>
            🔍 {pnj.nom.toUpperCase()} · {pnj.role}
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#8fa3bd", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#e0a848", letterSpacing: 1, marginBottom: 6 }}>
            « Un indice avant qu'on commence ? »
          </div>
          <div style={{ padding: "10px 14px", background: "#141b26", borderLeft: "2px solid #e0a848", borderRadius: 6 }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55, color: "#e8eef5", fontStyle: "italic" }}>
              « {teaser || "— Pas grand-chose à ajouter avant l'interrogatoire. —"} »
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button onClick={() => onInterview(temoin.id)}
              style={{ background: "#e0a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Interroger officiellement ▸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
