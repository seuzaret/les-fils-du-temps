import { useState } from "react";
/* ============================================================
   RETROUVAILLES AVEC AL3X1A
   ------------------------------------------------------------
   Modale plein écran qui joue la scène de retrouvailles quand
   le joueur trouve Al3x1A dans son décor de cachette. Séquence
   scriptée courte : Al3x1A reconnaissant·e, remise du remède,
   bouton pour repartir au futur (déclenche l'écran de fin jeu 2).
   ============================================================ */

/* Portrait proche du cadre-photo, mais plus expressif (Al3x1A vit). */
export function PortraitAl3x1AVivant({ mood = "content" }) {
  const eyes = mood === "content" ? -1 : mood === "vexe" ? 1 : 0;
  return (
    <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="alv-tunique" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a0a0b0" /><stop offset="100%" stopColor="#606878" /></linearGradient>
      </defs>
      <rect width="200" height="240" fill="#1a2030" />
      <circle cx="100" cy="90" r="80" fill="#7fd8ff" opacity="0.18" />
      {/* tunique de voyage grise, un peu usée */}
      <path d="M20 240 L20 185 Q20 155 55 148 L145 148 Q180 155 180 185 L180 240 Z" fill="url(#alv-tunique)" stroke="#3a4048" strokeWidth="1.2" />
      {/* insigne chronaute */}
      <circle cx="55" cy="172" r="7" fill="#c8a848" stroke="#5a4020" strokeWidth="0.8" />
      <path d="M55 167 L55 177 M50 172 L60 172" stroke="#5a4020" strokeWidth="0.8" />
      {/* accrocs de voyage sur la tunique */}
      <path d="M40 200 l6 10 M150 210 l-4 8" stroke="#3a3848" strokeWidth="1" />
      {/* cou */}
      <ellipse cx="100" cy="132" rx="15" ry="12" fill="#d0a888" />
      {/* tête ovale */}
      <ellipse cx="100" cy="80" rx="48" ry="56" fill="#d0a888" stroke="#5a3818" strokeWidth="1.2" />
      {/* cheveux mi-longs androgynes */}
      <path d="M55 62 Q60 25 100 22 Q140 25 145 62 L148 90 L140 88 Q142 60 132 45 Q100 30 68 45 Q58 60 60 88 L52 90 Z" fill="#4a3828" />
      <path d="M65 55 Q75 40 100 42 Q125 40 135 55 Q125 62 100 60 Q75 62 65 55 Z" fill="#3a2818" />
      <ellipse cx="145" cy="70" rx="8" ry="6" fill="#4a3828" />
      {/* yeux vivants */}
      <ellipse cx="82" cy="82" rx="6" ry="4" fill="#f8f4e8" />
      <ellipse cx="118" cy="82" rx="6" ry="4" fill="#f8f4e8" />
      <circle cx={82 + eyes} cy="82" r="2.6" fill="#3a2818" />
      <circle cx={118 + eyes} cy="82" r="2.6" fill="#3a2818" />
      {/* sourcils */}
      <path d="M74 74 q8 -3 16 -1 M112 73 q8 -3 16 1" stroke="#3a2818" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* nez */}
      <path d="M100 88 L98 105 L102 105" stroke="#8a5828" strokeWidth="0.8" fill="none" />
      {/* sourire large */}
      {mood === "content" ? (
        <path d="M82 122 Q100 138 118 122" stroke="#5a2818" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M86 128 Q100 122 114 128" stroke="#5a2818" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* petite cicatrice */}
      <path d="M124 92 l4 8" stroke="#8a5828" strokeWidth="0.6" opacity="0.6" />
      {/* Larme d'émotion */}
      {mood === "content" && <circle cx="80" cy="94" r="1.5" fill="#7fd8ff" opacity="0.85" />}
    </svg>
  );
}

const DIALOGUES = [
  { mood: "neutre",
    text: "Toi… ?" },
  { mood: "neutre",
    text: "Ton visage… je le connais. Mais tu es beaucoup trop jeune. Comment… non, laisse tomber. Je dois délirer. Dix ans toute seule ici, c'est long." },
  { mood: "content",
    text: "Elias t'a envoyé·e ? Bien sûr, qui d'autre. Ma MARTINE est cassée depuis longtemps. Je pensais mourir sans que personne ne le sache. Tu m'as retrouvé·e, {prenom}. Je n'en reviens pas." },
  { mood: "neutre",
    text: "J'ai trouvé le remède, oui. Tiens — prends-le, il est à toi. Ramène-le à Elias, à Mira, à tous ceux qui commencent à oublier. Vite." },
  { mood: "neutre",
    text: "Attends. Regarde-moi encore une seconde. Non… rien. Il y a des règles, tu sais. Je te le dirai peut-être quand on sera rentré·e·s. Peut-être pas. Allez, viens." },
  { mood: "content",
    text: "On monte dans ta MARTINE. Repartons chez nous." },
];

export default function RetrouvaillesAl3x1A({ prenom, remede, chapitreNom, onDone }) {
  const [idx, setIdx] = useState(0);
  const step = DIALOGUES[idx];
  const isLast = idx >= DIALOGUES.length - 1;
  const advance = () => { if (isLast) onDone?.(); else setIdx(idx + 1); };

  return (
    <div onClick={advance} style={{ position: "fixed", inset: 0, background: "rgba(4,8,16,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 95, cursor: "pointer" }} title="Cliquer pour continuer">
      <div style={{ maxWidth: 640, width: "100%", background: "#0e1420", border: "3px solid #7fd8ff", borderRadius: 16, padding: 20, boxShadow: "0 12px 48px rgba(0,0,0,0.75), 0 0 40px rgba(127,216,255,0.35)", animation: "fadein 0.35s ease-out" }}>
        {/* Bandeau lieu */}
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#7fd8ff", textAlign: "center", marginBottom: 10 }}>
          🌀 RETROUVAILLES · {chapitreNom.toUpperCase()}
        </div>
        {/* Portrait + dialogue */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 150, height: 180, flex: "0 0 auto", borderRadius: 12, overflow: "hidden", border: "2px solid #7fd8ff", boxShadow: "0 6px 22px rgba(0,0,0,0.6)" }}>
            <PortraitAl3x1AVivant mood={step.mood} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#7fd8ff", marginBottom: 8 }}>AL3X1A</div>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "#e8eef5", margin: 0 }}>
              « {step.text.replace("{prenom}", prenom || "chronaute")} »
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, color: "#8fa3bd" }}>{idx + 1} / {DIALOGUES.length}</div>
              {!isLast ? (
                <button onClick={(e) => { e.stopPropagation(); setIdx(idx + 1); }}
                  style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
                  Suite ▸
                </button>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); onDone?.(); }}
                  style={{ background: "#e8934a", color: "#160c02", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 800, cursor: "pointer", fontSize: 14, fontFamily: "ui-monospace,monospace", letterSpacing: 1, boxShadow: "0 0 18px rgba(232,150,74,0.55)", animation: "glow 2.4s ease-in-out infinite" }}>
                  🌀 REPARTIR AU FUTUR
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Aperçu du remède récupéré */}
        {isLast && remede && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#0a1820", border: "1px dashed #7fd8ff", borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 34 }}>{remede.emoji}</div>
            <div>
              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 2, color: "#7fd8ff" }}>REMÈDE RÉCUPÉRÉ</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eef5" }}>{remede.name}</div>
              <div style={{ fontSize: 12, color: "#c8d4e2", opacity: 0.85, marginTop: 2 }}>{remede.desc}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
