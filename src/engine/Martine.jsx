import { useState, useEffect } from "react";

/* ============================================================
   MOTEUR — Console de dialogue de MARTINE + avatar expressif
   ============================================================
   L'avatar reprend le dessin original de l'auteur (im21.jpg) :
   MARTINE est une NOIX spatiale — coque striée, antenne,
   propulseurs latéraux, énergie tachyonique bleutée.

   Humeurs (prop `mood`) :
   - "neutre"  : œil rond qui cligne, propulseurs au ralenti
   - "content" : œil ravi ^, volutes tachyoniques
   - "vexe"    : elle est TRÈS susceptible — œil mi-clos qui
     regarde ailleurs, antenne qui retombe, propulseurs coupés,
     inclinaison boudeuse
   Pendant la frappe du texte, l'antenne clignote plus vite.
   ============================================================ */

function useTypewriter(text, speed = 4) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    if (!text) { setDone(true); return; }
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return [shown, done, () => { setShown(text); setDone(true); }];
}

/** Le portrait de MARTINE-la-noix. Réutilisable (console, écran titre…).
    `date` : l'époque affichée sur son écran de bord (machine à
    remonter le temps oblige) — ex. "−18 000". */
export function Avatar({ mood = "neutre", talking = false, size = 66, date }) {
  const vexe = mood === "vexe";
  const content = mood === "content";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flex: "0 0 auto" }} aria-hidden="true">
      <g style={{ transition: "transform .35s", transformOrigin: "50% 60%", transformBox: "view-box", transform: vexe ? "rotate(-8deg)" : "none" }}>
        {/* volutes d'énergie tachyonique (quand elle est contente) */}
        {content && (
          <g stroke="#7fd8ff" strokeWidth="2" fill="none" opacity="0.9">
            <path d="M12 38 q-8 -6 -4 -14" style={{ animation: "drift 1.6s infinite" }} />
            <path d="M88 42 q9 -5 5 -14" style={{ animation: "drift 2s infinite" }} />
            <path d="M20 72 q-9 3 -12 10" style={{ animation: "drift 1.8s infinite" }} />
          </g>
        )}
        {/* antenne (retombe quand elle boude) */}
        <g style={{ transition: "transform .35s", transformOrigin: "50px 26px", transformBox: "view-box", transform: vexe ? "rotate(38deg)" : "none" }}>
          <line x1="50" y1="26" x2="50" y2="12" stroke="#8a94a8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="10" r="3.6" fill={vexe ? "#e8934a" : "#5eff9e"} style={{ animation: `pulse ${talking ? 0.45 : 2.2}s infinite` }} />
        </g>
        {/* propulseurs latéraux (coupés quand elle est vexée) */}
        <rect x="4" y="52" width="14" height="11" rx="4" fill="#6a7488" />
        <rect x="82" y="52" width="14" height="11" rx="4" fill="#6a7488" />
        {!vexe && (
          <g style={{ animation: "flick .5s infinite", transformOrigin: "50% 58%", transformBox: "view-box" }}>
            <path d="M5 55 l-10 3.5 l10 4.5 Z" fill="#7fd8ff" />
            <path d="M95 55 l10 3.5 l-10 4.5 Z" fill="#7fd8ff" />
            <path d="M5 57 l-5.5 1.8 l5.5 2.4 Z" fill="#ffb347" />
            <path d="M95 57 l5.5 1.8 l-5.5 2.4 Z" fill="#ffb347" />
          </g>
        )}
        {/* coque de noix */}
        <path d="M50 24 Q78 26 82 52 Q84 74 66 82 Q50 88 34 82 Q16 74 18 52 Q22 26 50 24 Z" fill="#8a6240" />
        <path d="M50 24 Q78 26 82 52 Q83 66 74 76 Q64 60 66 42 Q60 30 50 24 Z" fill="#6e4a2c" opacity="0.7" />
        {/* arête équatoriale + rides de la coque */}
        <path d="M20 54 Q50 44 80 54" stroke="#5c3a22" strokeWidth="3" fill="none" opacity="0.8" />
        <path d="M30 36 q10 6 6 16 M62 32 q-6 10 0 18 M40 68 q8 6 18 2 M26 62 q4 8 12 10" stroke="#5c3a22" strokeWidth="2" fill="none" opacity="0.55" />
        {/* écran de bord : la date courante du voyage temporel */}
        {date && (
          <g>
            <rect x="30" y="66" width="40" height="13" rx="3" fill="#0c1410" stroke="#5c3a22" strokeWidth="1.5" />
            <text x="50" y="75.5" textAnchor="middle" fontSize="8.5" fill={vexe ? "#e8934a" : "#5eff9e"} fontFamily="ui-monospace,monospace" style={{ letterSpacing: 0.5 }}>{date}</text>
          </g>
        )}
        {/* hublot-œil */}
        <circle cx="50" cy="52" r="11" fill="#cfeaff" stroke="#5c3a22" strokeWidth="2.5" />
        <ellipse cx="46" cy="47" rx="4" ry="2.4" fill="#fff" opacity="0.85" />
        {content ? (
          /* œil ravi */
          <path d="M43 55 Q50 46 57 55" stroke="#0c2233" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        ) : vexe ? (
          /* œil mi-clos qui regarde ailleurs */
          <g>
            <circle cx="53.5" cy="54.5" r="3.6" fill="#0c2233" />
            <path d="M41 47 Q50 44.5 59 49" stroke="#4a6a84" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          /* œil rond + clignement périodique */
          <g>
            <circle cx="50" cy="52" r="4" fill="#0c2233" />
            <ellipse cx="50" cy="50" rx="9.5" ry="7.5" fill="#a8c4dc" style={{ animation: "blink 4.5s infinite", opacity: 0 }} />
          </g>
        )}
      </g>
    </svg>
  );
}

export default function Martine({ lines, idx, onNext, mood = "neutre", date }) {
  const text = lines[idx] || "";
  const [shown, done, skip] = useTypewriter(text);
  const [collapsed, setCollapsed] = useState(false);
  const hasNext = idx < lines.length - 1;

  /* Auto-déplié à chaque nouvelle ligne (idx change). */
  const prevIdx = useRefLike(idx);
  if (prevIdx.value !== idx) { prevIdx.value = idx; if (collapsed) setCollapsed(false); }

  /* Console REPLIÉE : une ligne fine avec l'avatar et un teaser du texte,
     un chevron pour redéployer. Prend ~28 px de hauteur au lieu de ~90. */
  if (collapsed) {
    return (
      <div onClick={() => setCollapsed(false)}
        style={{ background: "#0c1410", border: "2px solid #24382c", borderRadius: 12, padding: "3px 12px 3px 6px", cursor: "pointer", position: "relative", display: "flex", gap: 8, alignItems: "center", minHeight: 30 }}>
        <div style={{ width: 26, height: 26, flex: "0 0 auto", overflow: "hidden", borderRadius: "50%", background: "#0a1119" }}>
          <div style={{ width: 60, transform: "translate(-16px, -14px)" }}>
            <Avatar mood={mood} talking={false} date={date} />
          </div>
        </div>
        <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#5eff9e", opacity: 0.7, letterSpacing: 1.5 }}>▸ MARTINE</span>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "ui-monospace,monospace", fontSize: 13.5, color: "#a8d8b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text.slice(0, 90)}{text.length > 90 ? "…" : ""}</span>
        <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 13.5, color: "#5eff9e" }}>▾</span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => (done ? hasNext && onNext() : skip())}
        style={{ background: "#0c1410", border: "2px solid #24382c", borderRadius: 14, boxShadow: "inset 0 0 40px rgba(80,255,160,0.05)", padding: "4px 30px 4px 4px", cursor: "pointer", minHeight: 62, position: "relative", display: "flex", gap: 8, alignItems: "center" }}>
        <Avatar mood={mood} talking={!done} date={date} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5eff9e", boxShadow: "0 0 8px #5eff9e", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 10.5, letterSpacing: 2, color: "#5eff9e", opacity: 0.7 }}>M.A.R.T.I.N.E.</span>
          </div>
          <p style={{ fontFamily: "ui-monospace,monospace", fontSize: 15, lineHeight: 1.4, color: "#c8ffdd", margin: 0, textShadow: "0 0 6px rgba(94,255,158,0.3)" }}>
            {shown}<span style={{ opacity: done ? 0 : 1 }}>▮</span>
          </p>
        </div>
        {done && hasNext && (
          <span style={{ position: "absolute", bottom: 4, right: 32, fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#5eff9e", animation: "pulse 1.2s infinite" }}>▶ suite</span>
        )}
      </div>
      {/* Bouton ESCAMOTER en haut à droite, ne consomme pas le clic sur la console. */}
      <button onClick={(e) => { e.stopPropagation(); setCollapsed(true); }}
        title="Réduire pour libérer la scène"
        style={{ position: "absolute", top: 4, right: 6, background: "transparent", border: "none", color: "#5eff9e", opacity: 0.6, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", padding: "2px 6px", lineHeight: 1 }}>
        ▴
      </button>
    </div>
  );
}

/* petit hack pour comparer la valeur précédente d'une prop sans useEffect */
function useRefLike(initial) {
  const [ref] = useState(() => ({ value: initial }));
  return ref;
}
