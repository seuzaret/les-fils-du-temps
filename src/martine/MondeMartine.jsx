import { useEffect, useMemo, useState } from "react";
import { Avatar } from "../engine/Martine.jsx";
import MediadexPanel from "../chapters/jeu3/MediadexPanel.jsx";
import { loadSave } from "../engine/save.js";
import { playClink, playMaterialize } from "../engine/sfx.js";
import { rng } from "../engine/scenery.jsx";
import SceneTelegraphe from "../chapters/07-xixe/scenes/SceneTelegraphe.jsx";
import ScenePhoto from "../chapters/07-xixe/scenes/ScenePhoto.jsx";
import SceneCable from "../chapters/07-xixe/scenes/SceneCable.jsx";
import ScenePhonographe from "../chapters/07-xixe/scenes/ScenePhonographe.jsx";
import SceneTSF from "../chapters/07-xixe/scenes/SceneTSF.jsx";
import SceneLumiere from "../chapters/07-xixe/scenes/SceneLumiere.jsx";
import { FICHES, MARTINE_REPARE } from "./fichesXIXe.js";

/* ============================================================
   LE MONDE DE MARTINE — prototype (XIXe siècle)
   ------------------------------------------------------------
   Page à part (martine/index.html). Après la confrontation du
   Jeu 3, MARTINE veut faire oublier le joueur dans un monde
   remodelé ; c'est un « monde à l'envers », à la Stranger Things :
   les tableaux du chapitre 7 du Jeu 1 y sont retournés, froids,
   envahis de spores et de lianes, et MARTINE a falsifié la fiche
   de chacun. Le joueur vérifie (son médiadex sert de source),
   trouve le morceau faux et le corrige : le tableau se remet à
   l'endroit, et une fissure de lumière grandit dans le ciel. Une
   fiche est juste : il faut le reconnaître. Six fiches réparées :
   le monde se fissure (fin du prototype).
   ============================================================ */

const SCENES = { telegraphe: SceneTelegraphe, photo: ScenePhoto, cable: SceneCable, phono: ScenePhonographe, tsf: SceneTSF, cinema: SceneLumiere };
const noop = () => {};
const UPSIDE = "grayscale(0.35) hue-rotate(185deg) saturate(1.25) brightness(0.6) contrast(1.15)";
const RED = "#ff3b45";

function readPrenom() {
  for (const slot of ["jeu3", "jeu2", "jeu1"]) {
    try { const s = loadSave(slot); if (s?.prenom) return s.prenom; } catch { /* rien */ }
  }
  return "";
}
/* les deux premières phrases d'un texte du Jeu 1 (pour rester court) */
const debut = (t, n = 2) => (t.match(/[^.!?]+[.!?]+(\s|$)/g) || [t]).slice(0, n).join("").trim();

const CSS = `
@keyframes mmSpore { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: .75; } 85% { opacity: .55; } 100% { transform: translate(var(--sx), -105vh); opacity: 0; } }
@keyframes mmFlash { 0%, 84%, 100% { opacity: 0; } 86% { opacity: .5; } 88% { opacity: .08; } 90% { opacity: .42; } 93% { opacity: 0; } }
@keyframes mmSway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(1.6deg); } }
@keyframes mmGlitch { 0%, 92%, 100% { transform: translate(0,0); filter: none; } 93% { transform: translate(-3px,1px); filter: hue-rotate(90deg); } 95% { transform: translate(3px,-2px); } 97% { transform: translate(-1px,2px); filter: hue-rotate(-60deg); } }
@keyframes mmIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes mmPulse { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes mmLight { from { opacity: 0; } to { opacity: 1; } }
`;

/* ───────────── l'atmosphère du monde à l'envers ───────────── */
function Spores({ n = 46, seed = 7 }) {
  const list = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: n }, () => ({
      left: r() * 100, size: 2 + r() * 4, dur: 9 + r() * 12, delay: -r() * 20, sx: `${(r() - 0.5) * 120}px`, o: 0.4 + r() * 0.5,
    }));
  }, [n, seed]);
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
      {list.map((p, i) => (
        <span key={i} style={{ position: "absolute", left: `${p.left}%`, bottom: -10, width: p.size, height: p.size, borderRadius: "50%",
          background: "#d8e4ee", opacity: p.o, boxShadow: "0 0 6px #9ab8d0", "--sx": p.sx,
          animation: `mmSpore ${p.dur}s linear ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* lianes qui envahissent les bords de l'écran */
function Vines() {
  const vine = (d, w, k) => (
    <g key={k} style={{ animation: `mmSway ${6 + k}s ease-in-out infinite`, transformOrigin: "0 0" }}>
      <path d={d} stroke="#140810" strokeWidth={w} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#3a1420" strokeWidth={w * 0.35} fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  );
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="none" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
      {vine("M-10 40 C60 60 80 140 40 220 C10 280 70 330 30 420", 14, 0)}
      {vine("M-10 140 C40 150 120 120 150 180 C175 230 120 260 160 300", 7, 1)}
      {vine("M1010 70 C930 90 910 170 950 250 C985 320 920 360 960 450", 14, 2)}
      {vine("M1010 200 C960 210 880 190 860 250 C845 300 900 330 870 380", 7, 3)}
      {vine("M-10 600 C40 560 120 580 160 540 C200 500 260 560 300 520", 10, 4)}
      {vine("M1010 600 C960 560 880 585 840 545 C800 505 740 560 700 525", 10, 5)}
    </svg>
  );
}

/* la fissure de lumière qui grandit dans le ciel (0 → 1) */
function Crack({ progress, h = 54 }) {
  const d = "M0 46 L90 40 L130 58 L210 30 L260 52 L330 26 L380 48 L450 22 L500 44 L560 18 L620 42 L680 20 L740 46 L800 24 L860 50 L920 28 L1000 40";
  return (
    <svg aria-hidden viewBox="0 0 1000 70" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: h, marginTop: 4 }}>
      <path d={d} stroke="#3a1a22" strokeWidth="3" fill="none" />
      <path d={d} stroke="#fff4c8" strokeWidth={2 + progress * 6} fill="none" pathLength="1"
        strokeDasharray="1" strokeDashoffset={1 - progress}
        style={{ transition: "stroke-dashoffset 1.4s ease-out, stroke-width 1.4s", filter: "drop-shadow(0 0 6px #ffe8a0) drop-shadow(0 0 14px #ffd070)" }} />
    </svg>
  );
}

/* MARTINE, en version « monde à l'envers » : rouge, qui grésille */
function MartineVoix({ texte, mood = "content", grand = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, animation: "mmIn 500ms ease-out both" }} key={texte}>
      <div style={{ flex: "0 0 auto", width: grand ? 150 : 64, height: grand ? 150 : 64, borderRadius: "50%", display: "grid", placeItems: "center",
        background: "radial-gradient(circle,#2a0a12,#0a0408)", border: `2px solid ${RED}`, boxShadow: `0 0 18px ${RED}88`,
        animation: "mmGlitch 4s linear infinite" }}>
        <div style={{ filter: "hue-rotate(-140deg) saturate(1.6) brightness(0.9)" }}>
          <Avatar size={grand ? 120 : 52} mood={mood} talking />
        </div>
      </div>
      {texte && (
        <div style={{ background: "#12060bcc", border: `1px solid ${RED}88`, borderRadius: 12, padding: "10px 14px", color: "#ffd8dc", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: grand ? 20 : 15, lineHeight: 1.5, maxWidth: 560 }}>
          <span style={{ fontFamily: "ui-monospace,monospace", fontStyle: "normal", fontSize: 11, letterSpacing: 3, color: RED, display: "block", marginBottom: 2 }}>MARTINE</span>
          « {texte} »
        </div>
      )}
    </div>
  );
}

/* un tableau du chapitre 7 : à l'envers tant que sa fiche est fausse */
function Vitrine({ sceneKey, repare }) {
  const Scene = SCENES[sceneKey];
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1000 / 560", overflow: "hidden", borderRadius: 8, background: "#05070c" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        transform: repare ? "scaleY(1)" : "scaleY(-1)", filter: repare ? "none" : UPSIDE,
        transition: "transform 1.3s cubic-bezier(.6,-0.3,.3,1.3), filter 1.8s ease" }}>
        <Scene collect={noop} action={noop} reveal={false} made={[]} flags={{}} queteQui={null} mode="jeu2" />
      </div>
      {!repare && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 40%, #1a3a5a22, #05070cbb 85%)" }} />}
    </div>
  );
}

/* la fiche de MARTINE, à vérifier et corriger */
function Fiche({ fiche, etat, onSeg, onChoix, onToutJuste }) {
  const { repare, choisi, erreurs } = etat;
  const segFaux = fiche.seg.find((s) => typeof s === "object" && s.faux);
  return (
    <div style={{ background: repare ? "#0e1a12" : "#140a0e", border: `2px solid ${repare ? "#ffd166" : RED}`, borderRadius: 12, padding: "14px 18px", boxShadow: repare ? "0 0 26px #ffd16644" : `0 0 26px ${RED}33`, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 3, fontWeight: 800, color: repare ? "#ffd166" : RED }}>
          {repare ? "◆ TA MÉMOIRE" : "◆ ARCHIVE OFFICIELLE · MARTINE"}
        </div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 900, letterSpacing: 2, padding: "3px 10px", border: `2px solid ${repare ? "#5eff9e" : RED}`, color: repare ? "#5eff9e" : RED, transform: "rotate(-4deg)" }}>
          {repare ? "RÉPARÉE" : "VÉRIFIÉ ✓"}
        </div>
      </div>
      <p style={{ fontFamily: "Georgia, serif", fontSize: 21, lineHeight: 1.75, color: "#f2e8ea", margin: "12px 0 6px" }}>
        {fiche.seg.map((s, i) => {
          if (typeof s === "string") return <span key={i}>{s}</span>;
          const repareCeSeg = repare && s.faux;
          const pris = choisi === i;
          return (
            <button key={i} disabled={repare} onClick={() => onSeg(i)}
              style={{ font: "inherit", lineHeight: "inherit", padding: "0 4px", margin: "0 1px", borderRadius: 4, cursor: repare ? "default" : "pointer",
                background: repareCeSeg ? "#ffd16633" : pris ? `${RED}33` : "transparent",
                color: repareCeSeg ? "#ffd166" : "#f2e8ea", fontWeight: repareCeSeg ? 800 : 400,
                border: "none", borderBottom: repare ? "none" : `2px dashed ${pris ? RED : "#8a6a74"}` }}>
              {repareCeSeg ? s.vrai : s.t}
            </button>
          );
        })}
      </p>

      {!repare && (
        <>
          <div style={{ fontSize: 13, color: "#c8a8b0", fontStyle: "italic", marginBottom: 10 }}>
            Un morceau est faux… ou aucun. Clique sur ce qui est faux, ou dis que tout est juste.
          </div>
          {choisi != null && fiche.seg[choisi]?.faux && (
            <div style={{ marginBottom: 12, animation: "mmIn 300ms ease-out both" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#ffd166", marginBottom: 6 }}>◆ PAR QUOI LE REMPLACER ?</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {segFaux.choix.map((c) => (
                  <button key={c} onClick={() => onChoix(c)}
                    style={{ background: "#1a1018", color: "#f2e8ea", border: "1px solid #6a4a54", borderRadius: 10, padding: "10px 16px", fontSize: 16, fontFamily: "Georgia, serif", cursor: "pointer" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={onToutJuste}
              style={{ background: "transparent", color: "#5eff9e", border: "1px solid #5eff9e", borderRadius: 10, padding: "9px 16px", fontFamily: "ui-monospace,monospace", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
              ✓ Tout est juste
            </button>
            {erreurs >= 2 && <span style={{ fontSize: 13, color: "#7fd8ff" }}>Astuce : vérifie dans ton médiadex 📘 (en haut à droite).</span>}
          </div>
        </>
      )}

      {repare && fiche.vraie && (
        <div style={{ marginTop: 6, padding: "10px 14px", background: "#0a120c", borderLeft: "3px solid #ffd166", borderRadius: 6, animation: "mmIn 600ms ease-out both" }}>
          <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#ffd166", marginBottom: 4 }}>CE QUE TU AVAIS APPRIS AU XIXᵉ SIÈCLE</div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#e8eef5" }}>{debut(fiche.vraie)}</p>
        </div>
      )}
    </div>
  );
}

/* ───────────── la page ───────────── */
const INTRO = [
  { kind: "noir", text: "Tu as tapé son nom. Tu es entré·e chez elle." },
  { kind: "martine", text: "Bienvenue dans mon monde, {prenom}. Ici, tout est rangé. Tu n'as plus besoin de te souvenir." },
  { kind: "voix", text: "Elle a tout réécrit. Vérifie tout, même ce qui a l'air juste.", sign: "— A." },
];

export default function MondeMartine() {
  const prenom = useMemo(readPrenom, []);
  const fill = (t) => t.replaceAll("{prenom}", prenom || "chronaute");
  const [phase, setPhase] = useState("intro");
  const [introIdx, setIntroIdx] = useState(0);
  const [ouverte, setOuverte] = useState(null);
  const [etats, setEtats] = useState(() => Object.fromEntries(FICHES.map((f) => [f.id, { repare: false, choisi: null, erreurs: 0 }])));
  const [voix, setVoix] = useState({ texte: "Six vitrines, six souvenirs bien rangés. Ne touche à rien.", mood: "content" });
  const [mediadex, setMediadex] = useState(false);
  const nbRepare = FICHES.filter((f) => etats[f.id].repare).length;
  const fini = nbRepare === FICHES.length;

  useEffect(() => { playMaterialize(); }, []);
  const maj = (id, patch) => setEtats((e) => ({ ...e, [id]: { ...e[id], ...patch } }));
  const erreur = (id, texte) => { maj(id, { erreurs: etats[id].erreurs + 1 }); setVoix({ texte, mood: "content" }); };
  const reparer = (id) => {
    maj(id, { repare: true, choisi: null });
    playClink();
    const fiche = FICHES.find((f) => f.id === id);
    const sansFaux = !fiche.seg.some((s) => typeof s === "object" && s.faux);
    setVoix({ texte: sansFaux ? "Celle-là, je ne l'avais pas changée. Tu vérifies même ce qui est juste… C'est agaçant." : MARTINE_REPARE[Math.min(nbRepare, MARTINE_REPARE.length - 1)], mood: "vexe" });
  };

  const fiche = ouverte && FICHES.find((f) => f.id === ouverte);
  const onSeg = (i) => {
    const s = fiche.seg[i];
    if (s.faux) { maj(fiche.id, { choisi: i }); setVoix({ texte: "Tu crois vraiment que c'est faux ?", mood: "content" }); }
    else { maj(fiche.id, { choisi: i }); erreur(fiche.id, "Ce morceau-là est vrai. Même moi, je ne mens pas tout le temps."); }
  };
  const onChoix = (c) => {
    const s = fiche.seg.find((x) => typeof x === "object" && x.faux);
    if (c === s.vrai) reparer(fiche.id);
    else erreur(fiche.id, "Tu vois ? Tu ne sais plus. Laisse-moi faire.");
  };
  const onToutJuste = () => {
    const aUnFaux = fiche.seg.some((s) => typeof s === "object" && s.faux);
    if (aUnFaux) erreur(fiche.id, "Tu me fais confiance ? C'est gentil.");
    else reparer(fiche.id);
  };
  const recommencer = () => {
    setEtats(Object.fromEntries(FICHES.map((f) => [f.id, { repare: false, choisi: null, erreurs: 0 }])));
    setOuverte(null); setPhase("galerie");
    setVoix({ texte: "On recommence ? Je range tout. Encore.", mood: "content" });
  };

  const page = { minHeight: "100dvh", background: "radial-gradient(ellipse at 50% -10%, #3a0a14 0%, #0c0a18 38%, #05070c 75%)", color: "#e8eef5", fontFamily: "Georgia, serif", position: "relative", overflowX: "hidden" };

  /* ── intro ── */
  if (phase === "intro") {
    const st = INTRO[introIdx];
    const suite = () => (introIdx < INTRO.length - 1 ? setIntroIdx(introIdx + 1) : setPhase("galerie"));
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", cursor: "pointer", padding: 16 }} onClick={suite}>
        <style>{CSS}</style>
        {st.kind !== "noir" && <Spores n={30} />}
        <div key={introIdx} style={{ maxWidth: 760, textAlign: "center", animation: "mmIn 900ms ease-out both" }}>
          {st.kind === "noir" && <p style={{ fontSize: 26, color: "#c8d4e2", letterSpacing: 1 }}>{fill(st.text)}</p>}
          {st.kind === "martine" && <div style={{ display: "flex", justifyContent: "center" }}><MartineVoix texte={fill(st.text)} grand mood="content" /></div>}
          {st.kind === "voix" && (
            <div>
              <p style={{ fontSize: 22, color: "#bfe4ff", fontStyle: "italic", textShadow: "0 0 12px #7fd8ff", animation: "mmPulse 3s ease-in-out infinite" }}>« {st.text} »</p>
              <p style={{ fontSize: 16, color: "#7fd8ff", letterSpacing: 4 }}>{st.sign}</p>
            </div>
          )}
          <p style={{ marginTop: 28, fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#6a7488", letterSpacing: 2 }}>clique pour continuer ▸</p>
        </div>
      </div>
    );
  }

  /* ── fin du prototype ── */
  if (phase === "fin") {
    return (
      <div style={{ ...page, display: "grid", placeItems: "center", padding: 16 }}>
        <style>{CSS}</style>
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 20%, #fff8e0 0%, #ffd07088 25%, transparent 60%)", animation: "mmLight 2.5s ease-out both", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 700, textAlign: "center", animation: "mmIn 1200ms ease-out 600ms both" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><MartineVoix texte="Non… Tu te souviens. Tout." mood="vexe" /></div>
          <p style={{ fontSize: 22, color: "#fff4d8", lineHeight: 1.6 }}>La fissure s'ouvre. La lumière entre dans le monde de MARTINE.</p>
          <div style={{ marginTop: 22, display: "inline-block", border: "1px solid #ffd166", borderRadius: 12, padding: "14px 22px", background: "#0a0806cc" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, letterSpacing: 4, color: "#ffd166", fontWeight: 800 }}>FIN DU PROTOTYPE · XIXᵉ SIÈCLE</div>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#c8d4e2" }}>
              6 fiches réparées · {FICHES.reduce((n, f) => n + etats[f.id].erreurs, 0)} erreur(s)
            </p>
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={recommencer} style={btn("#ffd166", "#1a0e08")}>↺ Recommencer</button>
            <a href="../" style={{ ...btn("transparent", "#c8d4e2"), border: "1px solid #3a4a64", textDecoration: "none" }}>← Retour au jeu</a>
          </div>
        </div>
      </div>
    );
  }

  /* ── galerie / vitrine ouverte ── */
  return (
    <div style={page}>
      <style>{CSS}</style>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${RED}aa, transparent 55%)`, animation: "mmFlash 9s linear infinite", pointerEvents: "none", zIndex: 1 }} />
      <Vines />
      <Spores />
      <div style={{ position: "relative", zIndex: 4, maxWidth: 1180, margin: "0 auto", padding: "14px 16px 40px" }}>
        {/* en-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <a href="../" style={{ color: "#8fa3bd", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 1, textDecoration: "none" }}>← Les fils du temps</a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#ffe8a0" }}>FISSURES · {nbRepare} / {FICHES.length}</span>
            <button onClick={() => setMediadex(true)} style={{ background: "#2a1808", color: "#ffd166", border: "2px solid #c8a848", borderRadius: 6, padding: "5px 12px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📘 Médiadex</button>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <div style={{ height: 3, background: RED, maxWidth: 520, margin: "0 auto", boxShadow: `0 0 10px ${RED}` }} />
          <h1 style={{ margin: "6px 0 2px", fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 900, fontSize: fiche ? "clamp(22px, 4vw, 32px)" : "clamp(28px, 6vw, 56px)", letterSpacing: "0.1em",
            color: "transparent", WebkitTextStroke: `1.6px ${RED}`, textShadow: `0 0 18px ${RED}66` }}>
            LE MONDE À L'ENVERS
          </h1>
          <div style={{ height: 3, background: RED, maxWidth: 520, margin: "0 auto", boxShadow: `0 0 10px ${RED}` }} />
          {!fiche && <div style={{ marginTop: 6, fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 4, color: "#c8a8b0" }}>CHEZ MARTINE · LE XIXᵉ SIÈCLE, VERSION MARTINE</div>}
          <Crack progress={nbRepare / FICHES.length} h={fiche ? 34 : 54} />
        </div>
        <div style={{ margin: "6px 0 16px" }}><MartineVoix texte={voix.texte} mood={voix.mood} /></div>

        {!fiche ? (
          <>
            <p style={{ textAlign: "center", color: "#c8b8c0", fontSize: 15, fontStyle: "italic", margin: "0 0 14px" }}>
              Six tableaux du XIXᵉ siècle, retournés. Ouvre-les un par un et vérifie la fiche de MARTINE.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {FICHES.map((f) => {
                const ok = etats[f.id].repare;
                return (
                  <button key={f.id} onClick={() => { setOuverte(f.id); window.scrollTo(0, 0); if (!ok) setVoix({ texte: "Tout est vrai. C'est écrit, et c'est moi qui l'ai écrit.", mood: "content" }); }}
                    style={{ textAlign: "left", background: "#0a0c14", border: `2px solid ${ok ? "#ffd166" : "#3a1a24"}`, borderRadius: 12, padding: 8, cursor: "pointer", color: "inherit", boxShadow: ok ? "0 0 18px #ffd16655" : "none" }}>
                    <Vitrine sceneKey={f.scene} repare={ok} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px 2px" }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: ok ? "#ffd166" : "#e8d8dc" }}>{f.titre}</span>
                      <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 1, color: ok ? "#5eff9e" : RED }}>{ok ? "✓ RÉPARÉE" : "À VÉRIFIER"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {fini && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button onClick={() => setPhase("fin")} style={btn("#ffd166", "#1a0e08")}>La fissure s'ouvre ▸</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* tableau assez petit pour que la fiche reste visible sans défiler */}
            <div style={{ width: "100%", maxWidth: "calc(40vh * 1000 / 560)", margin: "0 auto" }}>
              <Vitrine sceneKey={fiche.scene} repare={etats[fiche.id].repare} />
            </div>
            <Fiche fiche={fiche} etat={etats[fiche.id]} onSeg={onSeg} onChoix={onChoix} onToutJuste={onToutJuste} />
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setOuverte(null)} style={btn("transparent", "#c8d4e2", "#3a4a64")}>← Retour aux vitrines</button>
            </div>
          </div>
        )}
      </div>
      {mediadex && <MediadexPanel onClose={() => setMediadex(false)} />}
    </div>
  );
}

function btn(bg, color, border) {
  return { background: bg, color, border: border ? `1px solid ${border}` : "none", borderRadius: 10, padding: "11px 22px", fontFamily: "ui-monospace,monospace", fontSize: 14, fontWeight: 800, letterSpacing: 1, cursor: "pointer", display: "inline-block" };
}
