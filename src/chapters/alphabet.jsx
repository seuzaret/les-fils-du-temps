import { useState, useEffect, useMemo } from "react";

/* ============================================================
   MINI-JEU : « Écris MARTINE dans le premier alphabet »
   ------------------------------------------------------------
   Il y a ~3 500 ans, chaque lettre de l'alphabet phénicien était
   le DESSIN d'une chose (un bœuf, l'eau, une main…). Ici, on
   présente 15 signes phéniciens (mélangés à chaque partie) et
   l'élève doit épeler MARTINE en cliquant les bons signes DANS
   L'ORDRE. Origines historiques : article « Alphabet phénicien ».

   Tout est dessiné en SVG : libre de droit, hors-ligne.
   ============================================================ */

const OR = "#e8dcc0"; // trait des pictogrammes (craie/os sur l'argile)
const g = (extra = {}) => ({ fill: "none", stroke: OR, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round", ...extra });

/* ─── 7 pictogrammes des lettres de MARTINE ─── */
const Mem = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M8 20 q6 -8 12 0 t12 0 t12 0 t12 0" />
    <path d="M8 34 q6 -8 12 0 t12 0 t12 0 t12 0" />
    <path d="M8 48 q6 -8 12 0 t12 0 t12 0 t12 0" />
  </g></svg>
);
const Aleph = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M22 20 L32 44 L42 20" />
    <path d="M22 20 Q12 8 6 14" />
    <path d="M42 20 Q52 8 58 14" />
    <circle cx="32" cy="30" r="1.6" fill={OR} stroke="none" />
  </g></svg>
);
const Resh = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M40 14 Q20 12 20 30 Q20 40 30 42 L30 52" />
    <path d="M20 30 L12 34 L20 37" />
  </g></svg>
);
const Taw = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g({ strokeWidth: 4.5 })}>
    <path d="M16 16 L48 48 M48 16 L16 48" />
  </g></svg>
);
const Yod = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M14 50 L30 30" />
    <path d="M30 30 Q34 18 40 16 M30 30 Q40 20 46 22 M30 30 Q42 26 48 30 M30 30 Q40 32 44 38" />
  </g></svg>
);
const Nun = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M20 54 q-10 -10 4 -18 q14 -8 4 -18 q-8 -8 2 -12" />
    <path d="M28 6 q6 -2 8 3" />
    <circle cx="34" cy="7" r="1.4" fill={OR} stroke="none" />
  </g></svg>
);
const He = () => ( /* la fenêtre / la personne priant : trois traits */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M22 12 L22 52" />
    <path d="M22 20 L44 14" />
    <path d="M22 32 L44 26" />
    <path d="M22 44 L44 38" />
  </g></svg>
);

/* ─── 8 pictogrammes-distracteurs ─── */
const Bet = () => ( /* la maison / la tente : toit triangulaire + murs */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M12 28 L32 12 L52 28" />
    <path d="M16 28 L16 52 L48 52 L48 28" />
    <rect x="28" y="36" width="10" height="16" />
  </g></svg>
);
const Dalet = () => ( /* la porte / rabat de tente : triangle */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M14 52 L32 10 L50 52 Z" />
  </g></svg>
);
const Ayin = () => ( /* l'œil : cercle + pupille */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <ellipse cx="32" cy="32" rx="22" ry="12" />
    <circle cx="32" cy="32" r="5" fill={OR} stroke="none" />
  </g></svg>
);
const Kaph = () => ( /* la paume : cinq doigts sortant d'une main */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M18 48 L18 30 Q18 24 24 24 L40 24 Q46 24 46 30 L46 48" />
    <path d="M22 24 L22 10 M30 24 L30 8 M38 24 L38 10 M46 30 Q52 30 52 24 L52 18" />
  </g></svg>
);
const Lamed = () => ( /* l'aiguillon : bâton recourbé */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M32 8 L32 44 Q32 54 22 54" />
  </g></svg>
);
const Pe = () => ( /* la bouche : lèvres */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M10 32 Q32 20 54 32 Q32 46 10 32 Z" />
    <path d="M14 32 L50 32" />
  </g></svg>
);
const Shin = () => ( /* les dents : W */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g({ strokeWidth: 4.5 })}>
    <path d="M10 20 L18 46 L28 20 L36 46 L44 20 L52 46" />
  </g></svg>
);
const Zayin = () => ( /* l'arme : lame courte, garde, poignée */
  <svg viewBox="0 0 64 64" width="100%" height="100%"><g {...g()}>
    <path d="M32 8 L32 42" />
    <path d="M22 42 L42 42" />
    <path d="M28 48 L36 48" />
    <path d="M30 52 L34 52" />
  </g></svg>
);

/* Le catalogue des 15 signes phéniciens présentés. Aleph doit
   pivoter (le bœuf « à l'envers » = A). */
const LETTERS = [
  { l: "M", nom: "mem",   sens: "l'eau",         Picto: Mem },
  { l: "A", nom: "aleph", sens: "le bœuf",       Picto: Aleph, rotate: 180 },
  { l: "R", nom: "resh",  sens: "la tête",       Picto: Resh },
  { l: "T", nom: "taw",   sens: "la marque",     Picto: Taw },
  { l: "I", nom: "yod",   sens: "la main",       Picto: Yod },
  { l: "N", nom: "nun",   sens: "le serpent",    Picto: Nun },
  { l: "E", nom: "he",    sens: "la fenêtre",    Picto: He },
  { l: "B", nom: "bet",   sens: "la maison",     Picto: Bet },
  { l: "D", nom: "dalet", sens: "la porte",      Picto: Dalet },
  { l: "O", nom: "ayin",  sens: "l'œil",         Picto: Ayin },
  { l: "K", nom: "kaph",  sens: "la paume",      Picto: Kaph },
  { l: "L", nom: "lamed", sens: "l'aiguillon",   Picto: Lamed },
  { l: "P", nom: "pe",    sens: "la bouche",     Picto: Pe },
  { l: "S", nom: "shin",  sens: "les dents",     Picto: Shin },
  { l: "Z", nom: "zayin", sens: "l'arme",        Picto: Zayin },
];

const TARGET = "MARTINE";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Une case du panneau alphabétique : pictogramme + nom + sens.
   Devient une « lettre gravée » (or) une fois utilisée dans le mot. */
function Tuile({ L, used, wrong, onPick }) {
  const border = used ? "#5eff9e" : wrong ? "#e8934a" : "#3a2c1c";
  const bg = used ? "#14251c" : wrong ? "#2a1a10" : "#1a130c";
  return (
    <button onClick={onPick} disabled={used}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10,
        padding: "8px 6px 6px", cursor: used ? "default" : "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 72,
        transition: "background .3s, border-color .3s" }}>
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <div style={{ position: "absolute", inset: 0, opacity: used ? 0 : 1,
          transform: used ? `rotate(${L.rotate || 0}deg) scale(.5)` : "none",
          transition: "opacity .5s, transform .5s" }}>
          <L.Picto />
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: used ? 1 : 0, transform: used ? "none" : "scale(.5)",
          transition: "opacity .5s, transform .5s",
          fontFamily: "'Cinzel', 'Trajan Pro', 'Constantia', Georgia, serif",
          fontWeight: 700, fontSize: 38, color: "#ffd166" }}>
          {L.l}
        </div>
      </div>
      <div style={{ fontSize: 11.5, fontFamily: "ui-monospace,monospace",
        color: used ? "#8fb8a0" : "#c9a877", textAlign: "center", lineHeight: 1.2 }}>
        {L.nom}<br /><span style={{ color: "#8a97ad" }}>{L.sens}</span>
      </div>
    </button>
  );
}

export function AlphabetGame({ onClose, onWin }) {
  /* Mélange stable sur toute la durée du mini-jeu. */
  const tiles = useMemo(() => shuffle(LETTERS), []);
  /* Indices des tuiles utilisées, dans l'ordre d'écriture. */
  const [used, setUsed] = useState([]);
  /* Tuile pointée à tort (par index de tuiles), pour un flash orange. */
  const [wrong, setWrong] = useState(null);
  const [flash, setFlash] = useState(null);
  const done = used.length === TARGET.length;

  useEffect(() => { if (done) onWin?.(); }, [done]);

  useEffect(() => {
    if (wrong === null) return;
    const t = setTimeout(() => setWrong(null), 700);
    return () => clearTimeout(t);
  }, [wrong]);

  const pick = (i) => {
    if (done) return;
    const L = tiles[i];
    const next = TARGET[used.length];
    if (L.l === next) {
      setUsed((u) => [...u, i]);
      setFlash(null);
    } else {
      setWrong(i);
      setFlash(`Non — la lettre suivante à écrire est « ${next} ».`);
    }
  };

  const effacer = () => { setUsed([]); setFlash(null); setWrong(null); };

  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 70, backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#0e1420", border: "2px solid #e8934a66", borderRadius: 18, padding: 20, maxWidth: 720, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.6)", fontFamily: "Palatino, Georgia, serif", color: "#e8eef5" }}>
        <div style={{ textAlign: "center", fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#e8934a" }}>✍ L'INVENTION DE L'ALPHABET</div>
        <h2 style={{ textAlign: "center", margin: "6px 0 4px", color: "#ffd166", fontSize: 21 }}>Écris MARTINE dans le premier alphabet</h2>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "#c8d4e2", textAlign: "center", margin: "0 0 14px" }}>
          Il y a 3 500 ans, chaque lettre était le DESSIN d'une chose. Voici 15 signes phéniciens (mélangés).
          Clique-les <strong style={{ color: "#ffd166" }}>dans le bon ordre</strong> pour épeler M · A · R · T · I · N · E.
        </p>

        {/* Progression — le CARTOUCHE : les 7 emplacements de MARTINE.
           Une fois une lettre trouvée, on y voit le PICTO PHÉNICIEN
           correspondant (le mot MARTINE s'écrit ici comme sur une
           tablette antique). La tuile, elle, montre la lettre latine. */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
          {TARGET.split("").map((ch, idx) => {
            const filled = idx < used.length;
            const active = idx === used.length && !done;
            const info = filled ? LETTERS.find((x) => x.l === ch) : null;
            return (
              <div key={idx} style={{
                width: 46, height: 56, borderRadius: 8,
                border: `2px solid ${filled ? "#5eff9e" : active ? "#ffd166" : "#2a3648"}`,
                background: filled ? "rgba(94,255,158,0.10)" : active ? "rgba(255,209,102,0.08)" : "#101827",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 4, transition: "all .3s" }}>
                {info ? (
                  <div style={{ width: "100%", height: "100%",
                    transform: info.rotate ? `rotate(${info.rotate}deg)` : "none" }}>
                    <info.Picto />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {tiles.map((L, i) => (
            <Tuile key={i} L={L}
              used={used.includes(i)}
              wrong={wrong === i}
              onPick={() => pick(i)} />
          ))}
        </div>

        {!done ? (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <p style={{ flex: 1, minHeight: 18, color: flash ? "#e8934a" : "#8fa3bd", fontSize: 14, fontStyle: "italic", margin: 0 }}>
              {flash || `Prochaine lettre à écrire : « ${TARGET[used.length]} »`}
            </p>
            {used.length > 0 && (
              <button onClick={effacer}
                style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 10, padding: "8px 14px", fontWeight: 700, cursor: "pointer", fontSize: 13.5, fontFamily: "ui-monospace,monospace" }}>
                ✕ Recommencer
              </button>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div style={{ background: "#101827", border: "1px solid #2a3648", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
                « Tu viens d'écrire mon nom dans l'alphabet des Phéniciens ! Regarde : chacune de nos lettres n'est, au départ, que le dessin d'une chose. Un bœuf, l'eau, une main… Ce code est si SIMPLE qu'on l'apprend en quelques jours. Maintenant que tu le TIENS, confie-le aux navires marchands : c'est le commerce qui le portera de port en port, tout autour de la mer. » — MARTINE
              </p>
            </div>
            <p style={{ textAlign: "center", margin: "12px 0 0", color: "#7fe0a8", fontSize: 14.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              ✨ Tu as appris l'ALPHABET — mets-le sur les navires pour le diffuser !
            </p>
            <button onClick={onClose}
              style={{ marginTop: 10, width: "100%", background: "#e8934a", color: "#1a0e02", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, cursor: "pointer", fontSize: 16, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
