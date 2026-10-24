import { useEffect, useMemo, useRef, useState } from "react";
import { EPOQUES } from "./epoquesMonde2.js";
import { preparerVignettes, vignettesPretes, abonnerVignettes } from "./vignettes.js";
import { FINALE, retablir, arreterMusique } from "./musiqueMonde2.js";
import { rng } from "../engine/scenery.jsx";

/* ============================================================
   LE MONDE 2 — la finale : « Le temps est rétabli… »
   ------------------------------------------------------------
   Quand tout est remis en ordre, les 46 tableaux du Jeu 1, en
   vignettes, tournent sur un disque incliné (effet de profondeur),
   de plus en plus vite, avec des accrocs du temps ; le disque
   explose en lumière ; les vignettes se recollent une à une, dans
   l'ordre, sur une pellicule qui défile sous le faisceau d'un
   projecteur ; la pellicule recule et devient la frise du temps ;
   une lumière la balaie, un éclat blanc, et « Le temps est
   rétabli… ». Bande-son : musiqueMonde2.js (jouerFinale), sur le
   même minutage (FINALE).
   ============================================================ */

const TOUS = EPOQUES.flatMap((ep, e) => ep.tableaux.map((s) => ({ ep, e, s })));
const N = TOUS.length;
const OR = "#ffd166";
const INCLINAISON = 63; // degrés : le disque vu de biais
const REDUIT = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const CSS = `
@keyframes rtRayons { to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes rtHorloge { to { transform: translate(-50%,-50%) rotate(-360deg); } }
@keyframes rtAspire { from { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; } 15% { opacity: 1; } to { transform: translate(0,0) scale(.2); opacity: 0; } }
@keyframes rtFlash { 0% { opacity: 1; } 100% { opacity: 0; } }
@keyframes rtClignote { 0%, 100% { opacity: .55; } 40% { opacity: .42; } 70% { opacity: .62; } }
@keyframes rtBalaye { from { transform: translateX(-30%); } to { transform: translateX(130%); } }
@keyframes rtLettre { from { opacity: 0; filter: blur(8px); transform: translateY(8px); } to { opacity: 1; filter: blur(0); transform: none; } }
@keyframes rtFil { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rtApparait { from { opacity: 0; } to { opacity: 1; } }
`;

/* une vignette : copie du tableau dessiné une fois (vignettes.js) */
function Vignette({ i, pret }) {
  const ref = useRef(null);
  useEffect(() => {
    const src = vignettesPretes()[i];
    if (!pret || !src || !ref.current) return;
    try { ref.current.getContext("2d").drawImage(src, 0, 0, ref.current.width, ref.current.height); } catch { /* rien */ }
  }, [i, pret]);
  return <canvas ref={ref} width={300} height={168} style={{ display: "block", width: "100%", height: "100%", background: "#140c06" }} />;
}

function useNbPretes() {
  const [n, setN] = useState(() => vignettesPretes().filter(Boolean).length);
  useEffect(() => abonnerVignettes(() => setN(vignettesPretes().filter(Boolean).length)), []);
  return n;
}

export default function Retablissement({ onFin }) {
  /* tailles, calculées une fois selon l'écran */
  const g = useMemo(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const u = Math.max(0.42, Math.min(1.25, vw / 1280, vh / 720));
    const R = 400 * u;
    const TW = 118 * u, TH = TW * 0.56;
    const P = 178 * u, TW2 = 168 * u, TH2 = TW2 * 0.56, bande = 22 * u;
    const W = N * P;
    const k = Math.min(1, (vw * 0.92) / W);
    return { vw, vh, u, R, TW, TH, P, TW2, TH2, bande, W, k };
  }, []);
  const disque = useMemo(() => TOUS.map((_, i) => {
    const th = i * ((2 * Math.PI) / 15.3);
    const r = g.R * 0.93 - i * ((g.R * 0.62) / N);
    return { th, r };
  }), [g]);
  const envol = useMemo(() => {
    const r = rng(29);
    return TOUS.map(() => ({ x: (r() - 0.5) * g.vw * 0.8, y: (r() < 0.5 ? -1 : 1) * (g.vh * (0.25 + r() * 0.3)), a: (r() - 0.5) * 140 }));
  }, [g]);
  const poussiere = useMemo(() => {
    const r = rng(41);
    return Array.from({ length: 26 }, () => {
      const a = r() * Math.PI * 2, d = 0.45 + r() * 0.5;
      return { x: `${Math.cos(a) * d * g.vw * 0.6}px`, y: `${Math.sin(a) * d * g.vh * 0.6}px`, dur: 1.6 + r() * 1.8, delai: r() * 3, taille: 2 + r() * 3 };
    });
  }, [g]);

  const pretes = useNbPretes();
  const [etape, setEtape] = useState(REDUIT ? "texte" : "noir"); // noir → disque → film → recul → lumiere → eclat → texte
  const [glitch, setGlitch] = useState(false);
  const [flash, setFlash] = useState(0);
  const [defile, setDefile] = useState(false);
  const discRef = useRef(null);

  /* le minutage (FINALE), le son et la préparation des vignettes */
  useEffect(() => {
    preparerVignettes();
    retablir(N);
    const F = FINALE;
    const temps = [];
    const a = (s, f) => temps.push(setTimeout(f, s * 1000));
    if (!REDUIT) {
      a(F.apparition, () => setEtape("disque"));
      F.glitchs.forEach((x) => { a(x, () => setGlitch(true)); a(x + 0.13, () => setGlitch(false)); });
      a(F.claque, () => setFlash((f) => f + 1));
      a(F.claque + 0.06, () => setEtape("film"));
      a(F.film, () => setDefile(true));
      a(F.recul, () => setEtape("recul"));
      a(F.lumiere, () => setEtape("lumiere"));
      a(F.eclat, () => { setFlash((f) => f + 1); setEtape("eclat"); });
    }
    a(F.texte, () => setEtape("texte"));
    a(F.fin, onFin);
    return () => temps.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* le disque, dessiné dans un seul <canvas> : perspective calculée à la
     main (vignettes debout, les plus proches plus grandes), de plus en
     plus vite. Bien plus léger que 46 éléments en 3D CSS. */
  const glitchRef = useRef(false);
  glitchRef.current = glitch;
  useEffect(() => {
    if (etape !== "disque" || !discRef.current) return undefined;
    const cv = discRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    cv.width = Math.round(g.vw * dpr); cv.height = Math.round(g.vh * dpr);
    const c = cv.getContext("2d");
    const cx = g.vw / 2, cy = g.vh * 0.52;
    const tilt = (INCLINAISON * Math.PI) / 180, cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const D = 1100 * g.u;
    const proj = (px, py) => { const k = D / (D - py * sinT); return { x: cx + px * k, y: cy + py * cosT * k, k }; };
    /* le vinyle (sillons, étiquette dorée), dessiné une fois puis tourné */
    const vin = document.createElement("canvas");
    const V = Math.round(g.R * 2 * dpr); vin.width = V; vin.height = V;
    { const v = vin.getContext("2d"); const r = V / 2;
      v.translate(r, r);
      v.fillStyle = "#0e0c12"; v.beginPath(); v.arc(0, 0, r - 2, 0, Math.PI * 2); v.fill();
      v.strokeStyle = "rgba(60,52,70,0.55)"; v.lineWidth = 1;
      for (let q = r * 0.16; q < r - 4; q += 3 * dpr) { v.beginPath(); v.arc(0, 0, q, 0, Math.PI * 2); v.stroke(); }
      const reflet = v.createLinearGradient(-r, -r, r, r);
      reflet.addColorStop(0.35, "rgba(255,255,255,0)"); reflet.addColorStop(0.5, "rgba(255,230,180,0.10)"); reflet.addColorStop(0.65, "rgba(255,255,255,0)");
      v.fillStyle = reflet; v.beginPath(); v.arc(0, 0, r - 2, 0, Math.PI * 2); v.fill();
      v.strokeStyle = "rgba(255,209,102,0.6)"; v.lineWidth = 2 * dpr; v.beginPath(); v.arc(0, 0, r - 2, 0, Math.PI * 2); v.stroke();
      const lab = v.createRadialGradient(0, 0, 0, 0, 0, r * 0.14);
      lab.addColorStop(0, "#fff3c8"); lab.addColorStop(0.2, OR); lab.addColorStop(1, "#b8862a");
      v.fillStyle = lab; v.beginPath(); v.arc(0, 0, r * 0.14, 0, Math.PI * 2); v.fill();
      v.fillStyle = "#3a2410"; v.beginPath(); v.arc(0, 0, r * 0.012, 0, Math.PI * 2); v.fill(); }
    const debut = performance.now();
    const k = Math.log(1100 / 25) / (FINALE.claque - FINALE.apparition);
    let angle = 0, avant = debut, id;
    const ordre = TOUS.map((_, i) => i);
    const dessiner = (now) => {
      const t = (now - debut) / 1000;
      angle += 25 * Math.exp(k * t) * ((now - avant) / 1000) * (Math.PI / 180);
      avant = now;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, g.vw, g.vh);
      if (glitchRef.current) c.translate(7, 0);
      /* le vinyle : une ellipse (disque vu de biais) qui tourne */
      c.save(); c.translate(cx, cy); c.scale(1, cosT); c.rotate(angle);
      c.drawImage(vin, -g.R, -g.R, g.R * 2, g.R * 2); c.restore();
      /* les vignettes, des plus lointaines aux plus proches */
      const pos = ordre.map((i) => {
        const a = disque[i].th + angle;
        return { i, ...proj(disque[i].r * Math.cos(a), disque[i].r * Math.sin(a)), z: disque[i].r * Math.sin(a) };
      }).sort((p, q) => p.z - q.z);
      const pretesNow = vignettesPretes();
      for (const p of pos) {
        const e = (t - p.i * FINALE.pasApparition) / 0.5;
        if (e <= 0) continue;
        const pop = e >= 1 ? 1 : e < 0.7 ? (e / 0.7) * 1.12 : 1.12 - ((e - 0.7) / 0.3) * 0.12;
        const w = g.TW * p.k * pop, h = g.TH * p.k * pop;
        const x = p.x - w / 2, y = p.y - h;
        c.globalAlpha = Math.min(1, e * 1.5);
        const img = pretesNow[p.i];
        if (img) c.drawImage(img, x, y, w, h); else { c.fillStyle = "#1a1008"; c.fillRect(x, y, w, h); }
        c.strokeStyle = "rgba(255,220,150,0.85)"; c.lineWidth = Math.max(1, 1.6 * p.k * g.u);
        c.strokeRect(x, y, w, h);
      }
      c.globalAlpha = 1;
      id = requestAnimationFrame(dessiner);
    };
    id = requestAnimationFrame(dessiner);
    return () => cancelAnimationFrame(id);
  }, [etape, g, disque]);

  const passer = () => { arreterMusique(); onFin(); };
  const fond = etape === "texte" || etape === "eclat"
    ? "radial-gradient(ellipse at 50% 45%, #3a2a10 0%, #140c06 55%, #05070c 100%)"
    : etape === "film" || etape === "recul" || etape === "lumiere"
      ? "radial-gradient(ellipse at 50% 50%, #1e140a 0%, #0a0704 60%, #030304 100%)"
      : "radial-gradient(ellipse at 50% 60%, #1a0a14 0%, #07060c 60%, #020204 100%)";
  const cx = g.vw / 2;
  const dureeSpin = FINALE.claque - FINALE.apparition;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: fond, transition: "background 1.2s", color: "#e8eef5", fontFamily: "Georgia, serif", zIndex: 50 }}>
      <style>{CSS}</style>

      {/* ── le disque ── */}
      {(etape === "noir" || etape === "disque") && (
        <>
          {/* une horloge géante qui tourne à l'envers, et des rayons */}
          <svg aria-hidden viewBox="-100 -100 200 200" style={{ position: "absolute", left: "50%", top: "50%", width: g.vh * 1.4, height: g.vh * 1.4, opacity: etape === "disque" ? 0.22 : 0, transition: "opacity 2s", animation: "rtHorloge 9s linear infinite" }}>
            {[96, 80, 62].map((r) => <circle key={r} r={r} fill="none" stroke={OR} strokeWidth="0.4" />)}
            {Array.from({ length: 60 }, (_, i) => <line key={i} x1="0" y1={i % 5 ? -92 : -88} x2="0" y2="-96" stroke={OR} strokeWidth={i % 5 ? 0.3 : 0.8} transform={`rotate(${i * 6})`} />)}
            {["XII", "III", "VI", "IX"].map((t, i) => <text key={t} x="0" y="-70" fill={OR} fontSize="7" textAnchor="middle" transform={`rotate(${i * 90})`}>{t}</text>)}
          </svg>
          <div aria-hidden style={{ position: "absolute", left: "50%", top: "52%", width: Math.max(g.vw, g.vh) * 1.3, height: Math.max(g.vw, g.vh) * 1.3, opacity: etape === "disque" ? 0.32 : 0, transition: `opacity ${dureeSpin}s ease-in`,
            background: "repeating-conic-gradient(from 0deg, rgba(255,209,102,0.13) 0deg 4deg, transparent 4deg 18deg)", animation: "rtRayons 6s linear infinite", willChange: "transform" }} />
          {/* la poussière du temps, aspirée vers le centre */}
          {etape === "disque" && poussiere.map((p, i) => (
            <span key={i} aria-hidden style={{ position: "absolute", left: "50%", top: "52%", width: p.taille, height: p.taille, borderRadius: "50%", background: "#ffe8a8",
              "--x": p.x, "--y": p.y, animation: `rtAspire ${p.dur}s ease-in ${p.delai}s infinite` }} />
          ))}
          {/* la lueur au centre, qui grandit avec la vitesse */}
          <div aria-hidden style={{ position: "absolute", left: "50%", top: "52%", width: g.R * 1.6, height: g.R * 1.6, transform: "translate(-50%,-50%)", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,240,200,0.9), rgba(255,180,80,0.25) 40%, transparent 70%)", opacity: etape === "disque" ? 0.85 : 0, transition: `opacity ${dureeSpin}s ease-in` }} />

          <canvas ref={discRef} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: etape === "disque" ? 1 : 0, transition: "opacity .6s" }} />
          {/* les accrocs du temps : bandes rouge et cyan */}
          {glitch && <div aria-hidden style={{ position: "absolute", inset: 0, mixBlendMode: "screen", pointerEvents: "none",
            background: "repeating-linear-gradient(0deg, rgba(255,40,60,0.18) 0 3px, transparent 3px 9px, rgba(40,220,255,0.14) 9px 11px, transparent 11px 17px)" }} />}
        </>
      )}

      {/* ── la pellicule ── */}
      {(etape === "film" || etape === "recul" || etape === "lumiere" || etape === "eclat") && (
        <>
          {/* le faisceau du projecteur */}
          <div aria-hidden style={{ position: "absolute", left: "50%", top: 0, width: g.TW2 * 2.4, height: "50%", transform: "translateX(-50%)",
            opacity: etape === "film" ? 1 : 0, transition: "opacity .8s" }}>
            <div style={{ width: "100%", height: "100%", clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(180deg, rgba(255,245,220,0.9), rgba(255,220,150,0.25))", animation: "rtClignote .09s steps(2) infinite" }} />
          </div>
          <div style={{ position: "absolute", left: 0, top: "50%", height: g.TH2 + g.bande * 2, marginTop: -(g.TH2 / 2 + g.bande), width: g.W,
            transformOrigin: "0 50%", background: "#0b0806", boxShadow: "0 0 30px rgba(0,0,0,0.8)",
            filter: etape === "lumiere" || etape === "eclat" ? "brightness(1.35) saturate(1.2)" : "none",
            transform: etape === "film" ? `translateX(${defile ? cx - g.W : cx}px)` : `translateX(${cx - (g.W * g.k) / 2}px) scale(${g.k})`,
            transition: etape === "film" ? (defile ? `transform ${FINALE.dureeFilm}s linear, filter .6s` : "none") : `transform ${FINALE.dureeRecul}s cubic-bezier(.6,0,.2,1), filter .6s` }}>
            {/* les perforations */}
            {[0, 1].map((k) => (
              <div key={k} style={{ position: "absolute", left: 0, right: 0, [k ? "bottom" : "top"]: 0, height: g.bande,
                background: `repeating-linear-gradient(90deg, transparent 0 ${7 * g.u}px, #d8ccb4 ${7 * g.u}px ${17 * g.u}px, transparent ${17 * g.u}px ${26 * g.u}px)`,
                backgroundSize: `100% 46%`, backgroundRepeat: "repeat-x", backgroundPosition: "0 50%", opacity: 0.75 }} />
            ))}
            {TOUS.map((v, i) => {
              const atterrit = ((i + 0.5) / N) * FINALE.dureeFilm - 0.3;
              const nouvelleEpoque = i > 0 && TOUS[i - 1].e !== v.e;
              return (
                <div key={i} style={{ position: "absolute", left: i * g.P + (g.P - g.TW2) / 2, top: g.bande, width: g.TW2, height: g.TH2,
                  borderLeft: nouvelleEpoque ? `${3 * g.u}px solid ${OR}` : "none",
                  transform: defile ? "none" : `translate(${envol[i].x}px, ${envol[i].y}px) rotate(${envol[i].a}deg) scale(.4)`, opacity: defile ? 1 : 0,
                  transition: `transform .4s cubic-bezier(.2,1.25,.4,1) ${Math.max(0, atterrit)}s, opacity .15s ${Math.max(0, atterrit)}s` }}>
                  <Vignette i={i} pret={pretes > i} />
                </div>
              );
            })}
            {/* la lumière qui balaie la frise */}
            {(etape === "lumiere" || etape === "eclat") && (
              <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", mixBlendMode: "screen" }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", background: "linear-gradient(90deg, transparent, rgba(255,240,200,0.95), transparent)", animation: "rtBalaye .8s ease-in-out both" }} />
              </div>
            )}
          </div>
          {/* les époques, sous la frise */}
          {(etape === "recul" || etape === "lumiere" || etape === "eclat") && (
            <div style={{ position: "absolute", left: 0, right: 0, top: `calc(50% + ${((g.TH2 / 2 + g.bande) * g.k) + 10}px)` }}>
              {EPOQUES.map((ep, e) => {
                const premier = TOUS.findIndex((v) => v.e === e);
                const nb = ep.tableaux.length;
                const x = cx - (g.W * g.k) / 2 + g.k * (premier + nb / 2) * g.P;
                return (
                  <div key={ep.id} style={{ position: "absolute", left: x, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap",
                    animation: `rtApparait .5s ease-out ${FINALE.dureeRecul * 0.6 + e * 0.06}s both` }}>
                    <div style={{ fontSize: Math.max(14, 20 * g.u) }}>{ep.chapitre.emoji}</div>
                    {g.vw > 640 && <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: OR, letterSpacing: 0.5 }}>{ep.chapitre.date}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── le texte ── */}
      {etape === "texte" && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", padding: 16 }}>
          <div>
            <h1 aria-label="Le temps est rétabli…" style={{ margin: 0, fontWeight: 400, fontStyle: "italic", fontSize: "clamp(30px, 6vw, 72px)", color: "#fff1c8",
              textShadow: `0 0 18px ${OR}, 0 0 40px rgba(255,180,80,0.6)` }}>
              {[..."Le temps est rétabli…"].map((c, i) => (
                <span key={i} aria-hidden style={{ display: "inline-block", whiteSpace: "pre", animation: `rtLettre .7s ease-out ${0.2 + i * 0.07}s both` }}>{c}</span>
              ))}
            </h1>
            {/* le fil du temps */}
            <div aria-hidden style={{ height: 2, margin: "22px auto 0", width: "min(560px, 80vw)", background: `linear-gradient(90deg, transparent, ${OR}, #fff4d0, ${OR}, transparent)`,
              boxShadow: `0 0 12px ${OR}`, transformOrigin: "50% 50%", animation: "rtFil 1.6s ease-out 1.6s both" }} />
          </div>
        </div>
      )}

      {/* les éclats blancs (la claque, puis l'éclat final) */}
      {flash > 0 && <div key={flash} aria-hidden style={{ position: "absolute", inset: 0, background: "#fffaf0", pointerEvents: "none", animation: `rtFlash ${flash === 1 ? 0.6 : 1.1}s ease-out both` }} />}

      <button onClick={passer} style={{ position: "absolute", right: 14, bottom: 12, background: "transparent", color: "#8a7a64", border: "1px solid #3a3020", borderRadius: 8,
        padding: "6px 12px", fontFamily: "ui-monospace,monospace", fontSize: 12, cursor: "pointer", animation: "rtApparait .6s ease-out 1.5s both" }}>Passer ▸</button>
    </div>
  );
}
