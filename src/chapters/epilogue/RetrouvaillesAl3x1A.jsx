import { useState } from "react";
/* ============================================================
   RETROUVAILLES AVEC AL3X1A
   ------------------------------------------------------------
   Modale plein écran qui joue la scène de retrouvailles quand
   le joueur trouve Al3x1A dans son décor de cachette. Un
   bandeau SVG grand format (viewBox 1000×420) situe la scène
   dans l'époque : MARTINE d'Al3x1A cassée derrière elle, le
   remède qui brille sur une table, ambiance colorée selon le
   chapitre. Séquence scriptée courte, click-anywhere pour
   avancer, bouton final "REPARTIR AU FUTUR".
   ============================================================ */

/* Ambiance visuelle par époque. La clé est un mot-clé cherché
   dans chapitreNom (case-insensitive) ; premier match gagne. */
const AMBIANCES = [
  { key: "préhist", cielHaut: "#f4a94b", cielBas: "#7d3a1f", sol: "#3b2312", rocaille: "#5a3a20", accent: "#f4c874", label: "GROTTE DU SUD" },
  { key: "antiq",   cielHaut: "#f2c069", cielBas: "#c7702f", sol: "#c8a25a", rocaille: "#8a5a2a", accent: "#ffe6a6", label: "OASIS OUBLIÉE" },
  { key: "médiév",  cielHaut: "#2c3450", cielBas: "#0e1428", sol: "#141a24", rocaille: "#3a2e1e", accent: "#e8c46c", label: "CELLIER DU DONJON" },
  { key: "moyen",   cielHaut: "#2c3450", cielBas: "#0e1428", sol: "#141a24", rocaille: "#3a2e1e", accent: "#e8c46c", label: "CELLIER DU DONJON" },
  { key: "renaiss", cielHaut: "#f3e1ba", cielBas: "#a97a45", sol: "#4b361f", rocaille: "#6c4a28", accent: "#f7d78a", label: "ATELIER D'IMPRIMEUR" },
  { key: "xixe",    cielHaut: "#5a5a70", cielBas: "#20242e", sol: "#241d16", rocaille: "#3a2f22", accent: "#c8a848", label: "ARRIÈRE-BOUTIQUE" },
  { key: "xxe",     cielHaut: "#4a5a6c", cielBas: "#1a1f28", sol: "#20242c", rocaille: "#2c3540", accent: "#7fd8ff", label: "SOUS-SOL DE STUDIO" },
  { key: "xxie",    cielHaut: "#0a1428", cielBas: "#020614", sol: "#0a0f18", rocaille: "#1a2130", accent: "#5eff9e", label: "PARKING SOUTERRAIN" },
];

function findAmb(name = "") {
  const n = name.toLowerCase();
  return AMBIANCES.find(a => n.includes(a.key)) || AMBIANCES[3];
}

/* Décor SVG grand format 1000×420 :
   ciel dégradé, silhouettes de rocaille/mobilier, MARTINE
   cassée à gauche, Al3x1A au centre, table + remède à droite. */
function Decor({ amb, remede, mood }) {
  return (
    <svg viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="ret-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={amb.cielHaut} />
          <stop offset="100%" stopColor={amb.cielBas} />
        </linearGradient>
        <radialGradient id="ret-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={amb.accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor={amb.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ret-sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={amb.sol} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Fond ciel/paroi */}
      <rect x="0" y="0" width="1000" height="420" fill="url(#ret-ciel)" />

      {/* Rocailles au fond, silhouettes brumeuses */}
      <path d="M -20 260 L 120 200 L 210 240 L 330 190 L 460 235 L 580 195 L 720 240 L 860 205 L 1020 245 L 1020 420 L -20 420 Z"
        fill={amb.rocaille} opacity="0.55" />
      <path d="M -20 300 L 90 260 L 240 285 L 390 255 L 560 290 L 700 260 L 880 295 L 1020 275 L 1020 420 L -20 420 Z"
        fill={amb.rocaille} opacity="0.85" />

      {/* Sol */}
      <rect x="0" y="330" width="1000" height="90" fill="url(#ret-sol)" />

      {/* Particules / lucioles selon époque */}
      {[
        [140, 90, 0.5], [260, 140, 0.9], [420, 70, 0.4], [560, 120, 0.6],
        [680, 90, 0.8], [820, 150, 0.5], [900, 80, 0.7], [340, 160, 0.6],
      ].map(([x, y, d], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={amb.accent} opacity="0.75">
          <animate attributeName="opacity" values="0.15;0.9;0.15" dur={`${2 + d * 3}s`} repeatCount="indefinite" begin={`${d}s`} />
        </circle>
      ))}

      {/* MARTINE d'Al3x1A cassée à gauche — vraie noix spatiale (viewBox 100×100 mise à l'échelle) */}
      <g transform="translate(90,180) scale(1.6)">
        {/* halo cassé, très pâle */}
        <circle cx="50" cy="55" r="55" fill="url(#ret-halo)" opacity="0.25" />
        {/* antenne retombée + boule éteinte */}
        <line x1="50" y1="26" x2="60" y2="14" stroke="#5a5a64" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="12" r="3.6" fill="#5a5a64" />
        {/* propulseurs latéraux, éteints */}
        <rect x="4" y="52" width="14" height="11" rx="4" fill="#3a4048" />
        <rect x="82" y="52" width="14" height="11" rx="4" fill="#3a4048" />
        {/* coque de noix — teintée grisée pour dire l'usure/le HS */}
        <path d="M50 24 Q78 26 82 52 Q84 74 66 82 Q50 88 34 82 Q16 74 18 52 Q22 26 50 24 Z" fill="#6a5040" />
        <path d="M50 24 Q78 26 82 52 Q83 66 74 76 Q64 60 66 42 Q60 30 50 24 Z" fill="#4e3a24" opacity="0.7" />
        {/* arête équatoriale + rides */}
        <path d="M20 54 Q50 44 80 54" stroke="#3a2418" strokeWidth="3" fill="none" opacity="0.8" />
        <path d="M30 36 q10 6 6 16 M62 32 q-6 10 0 18 M40 68 q8 6 18 2 M26 62 q4 8 12 10" stroke="#3a2418" strokeWidth="2" fill="none" opacity="0.55" />
        {/* grosse fissure diagonale */}
        <path d="M 30 28 L 70 82" stroke="#1a1008" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 30 28 L 70 82" stroke="#ff5a3a" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 42 40 L 38 46 M 56 60 L 62 58 M 48 50 L 44 56" stroke="#1a1008" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        {/* écran de bord éteint */}
        <rect x="30" y="66" width="40" height="13" rx="3" fill="#0c1410" stroke="#3a2418" strokeWidth="1.5" />
        <text x="50" y="75.5" textAnchor="middle" fontSize="8.5" fill="#3a4048" fontFamily="ui-monospace,monospace" letterSpacing="0.5">HS · 2277</text>
        {/* hublot-œil éteint */}
        <circle cx="50" cy="52" r="11" fill="#3a4048" stroke="#3a2418" strokeWidth="2.5" />
        <path d="M43 50 L57 54 M43 54 L57 50" stroke="#5a5a64" strokeWidth="2" strokeLinecap="round" />
        {/* fumerolle qui s'échappe par la fissure */}
        <path d="M 42 30 q -6 -14 4 -22 q 10 -6 4 -18" stroke="#8a8a94" strokeWidth="1.5" fill="none" opacity="0.55">
          <animate attributeName="opacity" values="0.15;0.55;0.15" dur="3.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Table + fiole du remède à droite */}
      <g transform="translate(820,300)">
        {/* pieds table */}
        <rect x="-70" y="-6" width="140" height="8" fill={amb.rocaille} stroke="#1a1408" strokeWidth="1" />
        <rect x="-64" y="2" width="6" height="42" fill={amb.rocaille} />
        <rect x="58" y="2" width="6" height="42" fill={amb.rocaille} />
        {/* halo remède */}
        <circle cx="0" cy="-40" r="55" fill="url(#ret-halo)" opacity="0.9">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* fiole */}
        <path d="M -12 -70 L -12 -50 L -22 -20 L -22 -8 Q -22 0 -14 0 L 14 0 Q 22 0 22 -8 L 22 -20 L 12 -50 L 12 -70 Z"
          fill="rgba(200,240,255,0.35)" stroke="#e8f4ff" strokeWidth="1.5" />
        <path d="M -18 -25 L 18 -25" stroke="#e8f4ff" strokeWidth="1" opacity="0.6" />
        {/* liquide ambré */}
        <path d="M -20 -18 L -20 -8 Q -20 -2 -14 -2 L 14 -2 Q 20 -2 20 -8 L 20 -18 Z"
          fill={amb.accent} opacity="0.85" />
        {/* bouchon */}
        <rect x="-8" y="-76" width="16" height="8" fill="#5a3818" stroke="#2a1808" strokeWidth="0.8" rx="1" />
        {/* étiquette */}
        <rect x="-16" y="-46" width="32" height="12" rx="1.5" fill="#f4e8c8" stroke="#8a6a2a" strokeWidth="0.6" />
        <text x="0" y="-38" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill="#5a2818">REMÈDE</text>
        {/* emoji du remède flottant au-dessus */}
        {remede?.emoji && (
          <text x="0" y="-88" textAnchor="middle" fontSize="22">
            {remede.emoji}
            <animate attributeName="y" values="-88;-95;-88" dur="3s" repeatCount="indefinite" />
          </text>
        )}
      </g>

      {/* AL3X1A au centre, silhouette debout */}
      <g transform="translate(500,175)">
        {/* halo d'accueil doux */}
        <ellipse cx="0" cy="60" rx="90" ry="130" fill={amb.accent} opacity="0.08" />
        {/* tunique */}
        <path d="M -50 200 L -50 90 Q -50 55 -20 48 L 20 48 Q 50 55 50 90 L 50 200 Z"
          fill="#6a7280" stroke="#2a2e38" strokeWidth="1.5" />
        {/* insigne */}
        <circle cx="-30" cy="105" r="7" fill="#c8a848" stroke="#5a4020" strokeWidth="0.8" />
        <path d="M -30 100 L -30 110 M -35 105 L -25 105" stroke="#5a4020" strokeWidth="0.8" />
        {/* accroc */}
        <path d="M -40 150 l 6 12" stroke="#2a2e38" strokeWidth="1.2" />
        <path d="M 32 175 l -5 8" stroke="#2a2e38" strokeWidth="1.2" />
        {/* cou */}
        <ellipse cx="0" cy="42" rx="14" ry="10" fill="#d0a888" />
        {/* tête */}
        <ellipse cx="0" cy="0" rx="40" ry="48" fill="#d0a888" stroke="#5a3818" strokeWidth="1.3" />
        {/* cheveux */}
        <path d="M -42 -18 Q -38 -50 0 -52 Q 38 -50 42 -18 L 44 12 L 36 10 Q 38 -12 30 -25 Q 0 -38 -30 -25 Q -38 -12 -36 10 L -44 12 Z" fill="#4a3828" />
        {/* yeux */}
        <ellipse cx="-15" cy="4" rx="5" ry="3.5" fill="#f8f4e8" />
        <ellipse cx="15" cy="4" rx="5" ry="3.5" fill="#f8f4e8" />
        <circle cx={-15 + (mood === "content" ? -0.8 : 0)} cy="4" r="2.2" fill="#3a2818" />
        <circle cx={15 + (mood === "content" ? -0.8 : 0)} cy="4" r="2.2" fill="#3a2818" />
        {/* sourcils */}
        <path d="M -22 -4 q 6 -3 12 -1 M 10 -5 q 6 -2 12 1" stroke="#3a2818" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* nez */}
        <path d="M 0 10 L -2 22 L 2 22" stroke="#8a5828" strokeWidth="0.7" fill="none" />
        {/* bouche */}
        {mood === "content" ? (
          <path d="M -14 34 Q 0 46 14 34" stroke="#5a2818" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M -12 38 Q 0 34 12 38" stroke="#5a2818" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        {/* larme */}
        {mood === "content" && <circle cx="-18" cy="14" r="1.4" fill="#7fd8ff" opacity="0.9"><animate attributeName="cy" values="14;22;14" dur="4s" repeatCount="indefinite" /></circle>}
      </g>

      {/* Bandeau lieu, en haut */}
      <g>
        <rect x="20" y="16" width="220" height="22" rx="4" fill="rgba(4,8,16,0.55)" stroke={amb.accent} strokeWidth="0.8" />
        <text x="30" y="31" fontFamily="ui-monospace,monospace" fontSize="11" fill={amb.accent} letterSpacing="2">🌀 {amb.label}</text>
      </g>
    </svg>
  );
}

const DIALOGUES = [
  { mood: "neutre",
    text: "Toi… ? Ton visage me dit quelque chose. Mais tu es trop jeune. Non, laisse tomber. Dix ans seule ici, c'est long." },
  { mood: "content",
    text: "Elias t'a envoyé·e. Ma MARTINE est cassée, je pensais mourir sans que personne ne le sache. Tu m'as retrouvé·e, {prenom}." },
  { mood: "neutre",
    text: "J'ai le remède. Il est à toi — ramène-le à Elias, à Mira, à tous ceux qui oublient." },
  { mood: "neutre",
    text: "Mais écoute. J'hésite. Dix ans ici, c'est une vie. J'ai des gens que j'aime. Qu'est-ce qu'on fait, {prenom} ?" },
];

/* Les 3 fins possibles. Narrativement, seule "ramener" est le vrai canon :
   les deux autres sont des choix qui seront RÉÉCRITS par MARTINE pendant
   le voyage retour (révélé à la confrontation du jeu 3). Mais au moment du
   choix, le joueur ignore le lien de parenté avec Al3x1A — l'ambiguïté est
   psychologiquement légitime. */
const CHOICES = [
  {
    id: "ramener",
    label: "Rentrons ensemble — tu as ta place au futur.",
    emoji: "🚀",
    color: "#5eff9e",
    reply: "Tu as raison. Ils ont besoin de la personne qui a trouvé le remède, pas juste du remède. On rentre.",
    confirm: "Al3x1A monte avec toi dans ta MARTINE. Direction 2287.",
  },
  {
    id: "laisser",
    label: "Reste si c'est ta vie. Je ramène le remède seul·e.",
    emoji: "📜",
    color: "#ffd166",
    reply: "Merci. Dis à Elias que la mémoire du monde ne tient pas qu'à moi. Prends soin du remède, et des gens.",
    confirm: "Al3x1A reste. Tu repars avec le remède, et sa dernière lettre.",
  },
  {
    id: "rester",
    label: "Je reste avec toi. Que quelqu'un d'autre livre le remède.",
    emoji: "🔥",
    color: "#ff8a6a",
    reply: "Tu es sûr·e ? Les tiens vont te chercher. Mais si c'est ton choix, je ne refuse pas la compagnie.",
    confirm: "Tu confies le remède à MARTINE, qui repart seule. Toi, tu restes. Pour toujours ?",
  },
];

export default function RetrouvaillesAl3x1A({ prenom, remede, chapitreNom, onDone, onChoice }) {
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState(null);
  const step = DIALOGUES[idx];
  const atChoiceStep = idx >= DIALOGUES.length - 1;
  const amb = findAmb(chapitreNom || "");
  const pickChoice = (c) => { setChoice(c); onChoice?.(c.id); };
  const advance = () => {
    if (choice) { onDone?.(); return; }
    if (atChoiceStep) return;
    setIdx(idx + 1);
  };

  return (
    <div onClick={advance}
      style={{ position: "fixed", inset: 0, background: "rgba(4,8,16,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, zIndex: 95, cursor: "pointer" }}
      title="Cliquer pour continuer">
      <div style={{ maxWidth: 900, width: "100%", background: "#0e1420", border: `3px solid ${amb.accent}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 12px 48px rgba(0,0,0,0.75), 0 0 40px ${amb.accent}44`, animation: "fadein 0.35s ease-out" }}>
        {/* Bandeau visuel grand format */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "1000 / 420", background: "#020614" }}>
          <Decor amb={amb} remede={remede} mood={step.mood} />
        </div>

        {/* Dialogue en dessous */}
        <div style={{ padding: "16px 20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: amb.accent }}>AL3X1A ▸</div>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd" }}>
              {choice ? "fin" : `${idx + 1} / ${DIALOGUES.length}`}
            </div>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#e8eef5", margin: 0, fontFamily: "Palatino, Georgia, serif" }}>
            « {(choice ? choice.reply : step.text).replace("{prenom}", prenom || "chronaute")} »
          </p>

          {atChoiceStep && remede && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#0a1820", border: `1px dashed ${amb.accent}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 30 }}>{remede.emoji}</div>
              <div>
                <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: amb.accent }}>REMÈDE RÉCUPÉRÉ</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eef5" }}>{remede.name}</div>
                <div style={{ fontSize: 12, color: "#c8d4e2", opacity: 0.85, marginTop: 2 }}>{remede.desc}</div>
              </div>
            </div>
          )}

          {choice && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: `${choice.color}11`, border: `2px solid ${choice.color}`, borderRadius: 10, color: "#e8eef5" }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: choice.color, fontWeight: 800, marginBottom: 4 }}>▸ FIN · {choice.id.toUpperCase()}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.55, fontStyle: "italic" }}>{choice.confirm}</div>
            </div>
          )}

          {!atChoiceStep && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={(e) => { e.stopPropagation(); setIdx(idx + 1); }}
                style={{ background: "#141b26", color: amb.accent, border: `1px solid ${amb.accent}`, borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                Suite ▸
              </button>
            </div>
          )}
          {atChoiceStep && !choice && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#c8d4e2", marginBottom: 8, textAlign: "center", opacity: 0.75 }}>▸ TON CHOIX</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                {CHOICES.map((c) => (
                  <button key={c.id} onClick={(e) => { e.stopPropagation(); pickChoice(c); }}
                    style={{
                      textAlign: "left",
                      background: `linear-gradient(90deg, ${c.color}22, #141b26)`,
                      border: `2px solid ${c.color}`,
                      color: "#e8eef5",
                      borderRadius: 12, padding: "12px 16px",
                      fontFamily: "Palatino, Georgia, serif",
                      fontSize: 15, lineHeight: 1.35,
                      cursor: "pointer",
                      transition: "all .18s",
                      boxShadow: `0 0 10px ${c.color}22`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px ${c.color}66`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 10px ${c.color}22`; e.currentTarget.style.transform = "none"; }}>
                    <span style={{ fontSize: 22, marginRight: 8 }}>{c.emoji}</span>
                    <strong style={{ color: c.color }}>{c.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}
          {choice && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={(e) => { e.stopPropagation(); onDone?.(); }}
                style={{ background: choice.color, color: "#160c02", border: "none", borderRadius: 10, padding: "12px 26px", fontWeight: 900, cursor: "pointer", fontSize: 15, fontFamily: "ui-monospace,monospace", letterSpacing: 1, boxShadow: `0 0 18px ${choice.color}88`, animation: "glow 2.4s ease-in-out infinite" }}>
                🌀 REPARTIR AU FUTUR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
