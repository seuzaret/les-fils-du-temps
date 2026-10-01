import { useState } from "react";
import PnjSprite from "../PnjSprite.jsx";
import EnqueteCarnet from "../EnqueteCarnet.jsx";

/* ============================================================
   JEU 3 — SCÈNE : « Bureau des Rumeurs » (R-01)
   ------------------------------------------------------------
   Pilote : la mission Kova avec la nouvelle mécanique.
   - Juge Vez donne le briefing au comptoir.
   - Les 3 témoins (Marek, Séra, Yol) sont dans la salle (pour ce
     pilote — on maillera inter-pièces sur l'enquête 2).
   - Cliquer un témoin ouvre son interview : 3 questions type
     (« as-tu vu ? qui te l'a dit ? depuis quand ? »).
   - Chaque réponse alimente le CARNET (📓 en haut à droite) :
     colonnes brutes A VU / RAPPORTE / notes, sans note d'autorité.
   - Une fois les 3 témoins entendus, retourner voir Vez déclenche
     l'écran VERDICT : 3 choix + cocher les témoins jugés fiables.
   ============================================================ */
export default function BunkerRumeurs({ onGo, j3 }) {
  const mission = j3.missions.kova;
  const done = j3.flags[mission.flag];
  const billetRecu = j3.flags.puits_billet;

  /* Bureau verrouillé tant que le joueur n'a pas trouvé le billet qui
     l'invite à devenir assistant du Juge. */
  if (!billetRecu) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", height: "100%", padding: 20, boxSizing: "border-box", justifyContent: "center", background: "#0a0806" }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 3, color: "#8a5030", textAlign: "center" }}>
          BUREAU DES RUMEURS · R-01
        </div>
        <div style={{ maxWidth: 480, textAlign: "center", background: "#141008", border: "1px solid #3a2010", borderRadius: 12, padding: "22px 24px", color: "#c8b090" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🔒</div>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, fontStyle: "italic" }}>
            La porte est fermée. Un petit mot y est punaisé :
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.5, fontFamily: "Georgia, serif", color: "#e8dfc8" }}>
            « Je reçois les habitants qui savent déjà pourquoi ils viennent. Prends le temps d'écouter les autres. — V. »
          </p>
        </div>
        <button onClick={() => onGo(j3.hubRoom || "hubBas")}
          style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
          ← Retour au couloir
        </button>
      </div>
    );
  }

  // phase: "briefing" (Vez actif) | "enquete" (témoins actifs) | "verdict" (choix + cochage) | "feedback" (retour Vez)
  const [phase, setPhase] = useState(done ? "done" : "briefing");
  // Interview courante : { temoinId, questionIdx | null }
  const [selected, setSelected] = useState(null);
  // Réponses déjà données : { [temoinId]: Set<number> }
  const [answered, setAnswered] = useState({});
  // Carnet ouvert
  const [carnet, setCarnet] = useState(false);
  // Verdict UI
  const [verdictChoice, setVerdictChoice] = useState(null);
  const [reliablePicks, setReliablePicks] = useState(new Set());
  // Feedback à afficher après verdict
  const [feedback, setFeedback] = useState(null);

  const nbInterroges = mission.temoins.filter((t) => (answered[t.id] || new Set()).size > 0).length;
  const allAsked = nbInterroges >= mission.temoins.length;

  const openTemoin = (t) => {
    if (phase !== "enquete") return;
    // Marque au moins la 1re question comme disponible (l'interview ne remplit le carnet qu'après clic)
    if (!answered[t.id]) {
      setAnswered((a) => ({ ...a, [t.id]: new Set() }));
    }
    setSelected({ temoinId: t.id, questionIdx: null });
    j3.hear(t.id);
  };

  const askQuestion = (temoinId, idx) => {
    setAnswered((a) => {
      const next = { ...a };
      const set = new Set(next[temoinId] || []);
      set.add(idx);
      next[temoinId] = set;
      return next;
    });
    setSelected({ temoinId, questionIdx: idx });
  };

  const togglePick = (id) => {
    setReliablePicks((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const submitVerdict = () => {
    const v = mission.verdicts.find((x) => x.id === verdictChoice);
    if (!v) return;
    // Calcul du feedback sur le cochage
    const attendus = new Set(mission.temoinsFiables);
    const picks = reliablePicks;
    const bonsCoches = [...picks].filter((id) => attendus.has(id)).length;
    const mauvaisCoches = [...picks].filter((id) => !attendus.has(id)).length;
    let fbType;
    if (bonsCoches === attendus.size && mauvaisCoches === 0) fbType = "parfait";
    else if (bonsCoches >= 1 && mauvaisCoches === 0) fbType = "partiel";
    else fbType = "mauvais";
    const fbFiables = v.ok ? mission.fiablesFeedback[fbType] : null;
    setFeedback({ verdict: v, fbType, fbFiables });
    if (v.ok) {
      j3.setFlag(mission.flag);
      setPhase("feedback");
    } else {
      setPhase("feedback");
    }
  };

  const retryFromFeedback = () => {
    setFeedback(null);
    setVerdictChoice(null);
    setReliablePicks(new Set());
    setPhase("enquete");
  };

  const currentTemoin = selected ? mission.temoins.find((t) => t.id === selected.temoinId) : null;
  const currentAnswer = currentTemoin && selected.questionIdx !== null
    ? currentTemoin.questions[selected.questionIdx] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", height: "100%", padding: 4, boxSizing: "border-box", overflowY: "auto" }}>
      {/* Bandeau titre + bouton carnet */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 1200, padding: "0 4px", flexShrink: 0 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848" }}>
          🎯 MISSION 1 · {mission.titre.toUpperCase()}
        </div>
        <button onClick={() => setCarnet(true)}
          style={{ background: "#f2e6cc", color: "#3a2010", border: "2px solid #5a3818", borderRadius: 6, padding: "5px 12px", fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          📓 Carnet ({nbInterroges}/{mission.temoins.length})
        </button>
      </div>

      <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", flexShrink: 1, minHeight: 0 }}>
        <defs>
          <linearGradient id="br-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2418" /><stop offset="100%" stopColor="#141008" /></linearGradient>
          <linearGradient id="br-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a2818" /><stop offset="100%" stopColor="#0e0a04" /></linearGradient>
          <radialGradient id="br-lamp" cx="50%" cy="0%" r="60%"><stop offset="0%" stopColor="#c8a848" stopOpacity="0.35" /><stop offset="100%" stopColor="#c8a848" stopOpacity="0" /></radialGradient>
          <linearGradient id="br-counter" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a5030" /><stop offset="100%" stopColor="#3a2010" /></linearGradient>
          <linearGradient id="br-cabinet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a4028" /><stop offset="100%" stopColor="#2a1808" /></linearGradient>
        </defs>

        {/* Mur + sol */}
        <rect width="1200" height="620" fill="url(#br-wall)" />
        <rect y="440" width="1200" height="180" fill="url(#br-floor)" />
        <path d="M0 440 L1200 440" stroke="#0a0806" strokeWidth="1.5" />
        {[80, 260, 460, 740, 940, 1120].map((x, i) => (
          <path key={i} d={`M${x} 440 L${x + (x - 600) * 0.14} 620`} stroke="#0a0604" strokeWidth="0.8" opacity="0.55" />
        ))}
        <rect y="436" width="1200" height="6" fill="#1a0e08" />

        {/* Plafond + poutre + tuyaux + 4 lampes */}
        <rect x="0" y="0" width="1200" height="60" fill="#1a1408" />
        <path d="M0 60 L1200 60" stroke="#3a2010" strokeWidth="3" />
        <path d="M0 26 L1200 26" stroke="#c8a848" strokeWidth="6" opacity="0.85" />
        <path d="M0 42 L1200 42" stroke="#5a4028" strokeWidth="2" opacity="0.75" />
        {[120, 340, 600, 860, 1080].map((x, i) => (
          <rect key={i} x={x - 6} y="22" width="12" height="12" fill="#3a2010" stroke="#0a0806" strokeWidth="0.5" />
        ))}
        <g transform="translate(600,80)">
          <line x1="0" y1="0" x2="0" y2="-24" stroke="#3a2010" strokeWidth="2" />
          <circle r="10" fill="#28303a" stroke="#0a0806" strokeWidth="1" />
          <g style={{ transformOrigin: "0 0", animation: "brFan 5s linear infinite" }}>
            {[0, 90, 180, 270].map((a) => (
              <path key={a} d="M0 0 L60 -6 L64 0 L60 6 Z" fill="#c8b090" stroke="#0a0806" strokeWidth="0.6" transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r="4" fill="#c8a848" />
        </g>
        {[200, 400, 800, 1000].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="60" x2={x} y2="98" stroke="#3a2010" strokeWidth="2" />
            <path d={`M${x - 26} 98 L${x + 26} 98 L${x + 20} 118 L${x - 20} 118 Z`} fill="#5a4028" stroke="#0a0806" strokeWidth="1" />
            <circle cx={x} cy="116" r="5" fill="#ffd870"><animate attributeName="opacity" values="0.6;1;0.6" dur={`${2.4 + i * 0.2}s`} repeatCount="indefinite" /></circle>
            <ellipse cx={x} cy="150" rx="90" ry="30" fill="url(#br-lamp)" />
          </g>
        ))}

        {/* Enseigne */}
        <g transform="translate(600,90)">
          <rect x="-220" y="-22" width="440" height="44" fill="#0e0a04" stroke="#e0a848" strokeWidth="2" rx="4" />
          <text x="0" y="8" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="800" fill="#e0a848" letterSpacing="6" style={{ filter: "drop-shadow(0 0 4px #c8a848)" }}>
            BUREAU DES RUMEURS · R-01
          </text>
        </g>

        {/* Bibliothèque à gauche (simplifiée) */}
        <g transform="translate(30,140)">
          <rect x="-4" y="-6" width="120" height="294" fill="#2a1808" stroke="#0a0604" strokeWidth="2" />
          {[0, 40, 80, 120, 160, 200, 240].map((y, k) => (
            <g key={y}>
              <rect x="0" y={y} width="112" height="4" fill="#3a2010" />
              {[0, 15, 30, 45, 60, 75, 90].map((x, i) => (
                <rect key={x} x={x} y={y - 34} width="13" height="34"
                  fill={["#8a3820", "#5a2818", "#8a5030", "#5a4028", "#c8a848", "#8a3820", "#3a2818"][(i + k) % 7]}
                  stroke="#1a0e08" strokeWidth="0.4" />
              ))}
            </g>
          ))}
          <text x="56" y="298" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#c8a848" letterSpacing="2">DOSSIERS A-Z</text>
        </g>

        {/* Comptoir massif — c'est là que Vez officie */}
        <g transform="translate(180,400)">
          <rect x="0" y="0" width="820" height="42" fill="url(#br-counter)" stroke="#1a0e08" strokeWidth="2" />
          <path d="M0 0 L820 0" stroke="#c8a848" strokeWidth="2" opacity="0.5" />
          {[0, 180, 360, 540, 720, 820].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="42" stroke="#3a2010" strokeWidth="0.8" opacity="0.7" />
          ))}
          {/* Registre + encrier + tampon */}
          <g transform="translate(120,-22)">
            <path d="M-38 0 L38 0 L38 22 L-38 22 Z" fill="#e8dfc8" stroke="#5a4028" strokeWidth="1" />
            <path d="M0 0 L0 22" stroke="#5a4028" strokeWidth="0.8" />
            {[6, 12, 18].map((y) => (
              <g key={y}>
                <line x1="-32" y1={y} x2="-6" y2={y} stroke="#5a4028" strokeWidth="0.4" />
                <line x1="6" y1={y} x2="32" y2={y} stroke="#5a4028" strokeWidth="0.4" />
              </g>
            ))}
            <path d="M30 -2 L40 -12 L38 -4 Z" fill="#3a2818" />
          </g>
          <g transform="translate(300,-14)">
            <rect x="-8" y="0" width="16" height="14" fill="#28303a" stroke="#0a0806" strokeWidth="0.8" />
            <ellipse cx="0" cy="0" rx="6" ry="2" fill="#0a0806" />
            <rect x="18" y="4" width="22" height="10" fill="#8a1010" stroke="#0a0806" strokeWidth="0.6" />
            <text x="29" y="12" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fontWeight="800" fill="#e8dfc8">VU</text>
          </g>
          {/* Étiquette « COMPTOIR DU JUGE » */}
          <rect x="580" y="14" width="130" height="14" fill="#e8dfc8" stroke="#3a2010" strokeWidth="0.5" />
          <text x="645" y="24" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fontWeight="800" fill="#3a2010">COMPTOIR DU JUGE</text>
        </g>

        {/* Juge Vez, derrière le comptoir, au centre */}
        <PnjSprite
          x={600} y={400}
          color="#3a2818" pants="#1a1408" hair="#c8b090" skin="#c8a888"
          facing="front" accessory="robe" activity="write"
          nom="Juge Vez" role="Juge des Rumeurs"
          heard={phase !== "briefing"}
          active={phase === "briefing" || (phase === "enquete" && allAsked) || phase === "verdict"}
          onClick={() => {
            if (phase === "briefing") setSelected({ temoinId: "vez_briefing", questionIdx: null });
            else if (phase === "enquete" && allAsked) setPhase("verdict");
            else if (phase === "enquete") setSelected({ temoinId: "vez_rappel", questionIdx: null });
          }} />

        {/* Les 3 témoins */}
        {mission.temoins.map((t) => (
          <PnjSprite key={t.id}
            x={t.pose.x} y={t.pose.y}
            color={t.color} pants={t.pants} hair={t.hair}
            facing={t.facing || "front"} accessory={t.accessory || null}
            activity={t.activity || null}
            nom={t.nom} role={t.role}
            heard={!!(answered[t.id] && answered[t.id].size > 0)}
            active={selected?.temoinId === t.id}
            onClick={phase === "enquete" ? () => openTemoin(t) : undefined} />
        ))}

        <style>{`@keyframes brFan { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
      </svg>

      {/* PANEL BAS : contextuel selon phase */}
      <div style={{ maxWidth: 900, width: "100%", minHeight: 120 }}>
        {phase === "done" && (
          <div style={{ background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#5eff9e" }}>✓ MISSION ACCOMPLIE</div>
            <p style={{ margin: "4px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#e8eef5" }}>{mission.succes}</p>
          </div>
        )}

        {phase === "briefing" && selected?.temoinId === "vez_briefing" && (
          <VezPanel titre="Briefing" lignes={mission.briefing}
            action={{ label: "Prendre l'affaire ▸", on: () => { setPhase("enquete"); setSelected(null); } }} />
        )}
        {phase === "briefing" && !selected && (
          <IntroPanel affirmation={mission.affirmation}
            onGoVez={() => setSelected({ temoinId: "vez_briefing", questionIdx: null })} />
        )}

        {phase === "enquete" && !selected && (
          <EnquetePanel
            mission={mission}
            nbInterroges={nbInterroges}
            allAsked={allAsked} />
        )}
        {phase === "enquete" && selected?.temoinId === "vez_rappel" && (
          <VezPanel titre="Retour vers le Juge"
            lignes={[
              `Il te reste ${mission.temoins.length - nbInterroges} personne(s) à interroger avant de rendre ton verdict.`,
              "Passe voir Marek, Séra et Yol dans la salle. Ouvre le carnet 📓 si tu veux relire leurs fiches.",
            ]}
            action={{ label: "OK, je continue", on: () => setSelected(null) }} />
        )}
        {phase === "enquete" && currentTemoin && (
          <InterviewPanel
            temoin={currentTemoin}
            asked={answered[currentTemoin.id] || new Set()}
            answer={currentAnswer}
            onAsk={(idx) => askQuestion(currentTemoin.id, idx)}
            onClose={() => setSelected(null)}
          />
        )}

        {phase === "verdict" && !feedback && (
          <VerdictPanel
            mission={mission}
            verdictChoice={verdictChoice}
            setVerdictChoice={setVerdictChoice}
            reliablePicks={reliablePicks}
            togglePick={togglePick}
            onSubmit={submitVerdict}
            onCancel={() => setPhase("enquete")} />
        )}

        {phase === "feedback" && feedback && (
          <FeedbackPanel feedback={feedback} onRetry={retryFromFeedback}
            onNext={() => { setPhase("done"); setSelected(null); }} />
        )}
      </div>

      <button onClick={() => onGo(j3.hubRoom || "hub")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "ui-monospace,monospace", letterSpacing: 1, marginTop: 4 }}>
        ← Retour au couloir
      </button>

      {carnet && (
        <EnqueteCarnet temoins={mission.temoins} answered={answered} onClose={() => setCarnet(false)} />
      )}
    </div>
  );
}

/* --------- Panneaux d'interface --------- */

function IntroPanel({ affirmation, onGoVez }) {
  return (
    <div style={{ background: "#0a0e14", border: "1px dashed #e0a848", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848", marginBottom: 6 }}>
        AFFIRMATION À VÉRIFIER
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#e8eef5", fontStyle: "italic" }}>
        « {affirmation} »
      </p>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onGoVez}
          style={{ background: "#e0a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
          Voir le Juge Vez ▸
        </button>
      </div>
    </div>
  );
}

function VezPanel({ titre, lignes, action }) {
  return (
    <div style={{ background: "#141020", border: "1px solid #e0a848", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848", marginBottom: 6 }}>
        JUGE VEZ · {titre.toUpperCase()}
      </div>
      {lignes.map((l, i) => (
        <p key={i} style={{ margin: i === 0 ? 0 : "6px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#e8eef5" }}>
          {l}
        </p>
      ))}
      {action && (
        <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={action.on}
            style={{ background: "#e0a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}

function EnquetePanel({ mission, nbInterroges, allAsked }) {
  return (
    <div style={{ background: "#0a0e14", border: "1px dashed #3a80c8", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#7fd8ff", marginBottom: 6 }}>
        ENQUÊTE EN COURS · {nbInterroges}/{mission.temoins.length} interrogé{nbInterroges > 1 ? "s" : ""}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#c8d4e2", lineHeight: 1.5 }}>
        Clique sur chaque témoin dans la salle. Pose-lui les questions de ton choix. Ouvre le carnet 📓 en haut à droite pour relire les fiches quand tu veux.
      </p>
      {allAsked && (
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#e0a848", fontWeight: 700 }}>
          ▸ Tu as interrogé tout le monde. Retourne voir le Juge Vez pour rendre ton verdict.
        </p>
      )}
    </div>
  );
}

function InterviewPanel({ temoin, asked, answer, onAsk, onClose }) {
  return (
    <div style={{ background: "#141020", border: "1px solid #3a80c8", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, letterSpacing: 2, color: "#7fd8ff" }}>
          {temoin.nom.toUpperCase()} · {temoin.role}
        </div>
        <button onClick={onClose}
          style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 6, padding: "2px 8px", fontFamily: "ui-monospace,monospace", fontSize: 10, cursor: "pointer" }}>
          Terminer ✕
        </button>
      </div>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, color: "#8fa3bd", marginBottom: 8 }}>
        Au Puits depuis {temoin.ancienneteAns} ans · {temoin.lieu}
      </div>

      {answer && (
        <div style={{ background: "#0a0e14", borderLeft: "3px solid #7fd8ff", padding: "8px 12px", marginBottom: 10, borderRadius: 4 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "#e8eef5", fontStyle: "italic" }}>« {answer.r} »</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {temoin.questions.map((q, i) => {
          const doneQ = asked.has(i);
          return (
            <button key={i} onClick={() => onAsk(i)}
              style={{
                background: doneQ ? "#0e1420" : "#1a2436",
                color: doneQ ? "#7a879e" : "#e8eef5",
                border: `1px solid ${doneQ ? "#2a3648" : "#3a80c8"}`,
                borderRadius: 6, padding: "8px 12px", textAlign: "left",
                fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer",
              }}>
              {doneQ ? "✓ " : "▸ "}{q.q}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VerdictPanel({ mission, verdictChoice, setVerdictChoice, reliablePicks, togglePick, onSubmit, onCancel }) {
  const canSubmit = verdictChoice && reliablePicks.size >= 1;
  return (
    <div style={{ background: "#1a1408", border: "2px solid #e0a848", borderRadius: 10, padding: "14px 18px" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#e0a848", marginBottom: 8 }}>
        🎯 RENDS TON VERDICT
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#c8d4e2", fontStyle: "italic" }}>
        Affirmation : « {mission.affirmation} »
      </p>

      <div style={{ marginTop: 12, fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 1.5, color: "#c8a848", fontWeight: 700 }}>
        1. QUEL VERDICT ?
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
        {mission.verdicts.map((v) => (
          <button key={v.id} onClick={() => setVerdictChoice(v.id)}
            title={v.desc}
            style={{
              background: verdictChoice === v.id ? "#e0a848" : "#141b26",
              color: verdictChoice === v.id ? "#1a0e08" : "#e8eef5",
              border: `1px solid ${verdictChoice === v.id ? "#e0a848" : "#3a4048"}`,
              borderRadius: 8, padding: "10px 16px",
              fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800,
              cursor: "pointer", letterSpacing: 1, flex: "1 1 200px",
            }}>
            {v.label}
            <div style={{ fontSize: 10, fontWeight: 500, marginTop: 4, opacity: 0.85 }}>{v.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14, fontFamily: "ui-monospace,monospace", fontSize: 10, letterSpacing: 1.5, color: "#c8a848", fontWeight: 700 }}>
        2. QUEL·S TÉMOIN·S JUGES-TU LE·S PLUS FIABLE·S SUR CE SUJET ?
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
        {mission.temoins.map((t) => {
          const picked = reliablePicks.has(t.id);
          return (
            <button key={t.id} onClick={() => togglePick(t.id)}
              style={{
                background: picked ? "#0e2818" : "#141b26",
                color: picked ? "#5eff9e" : "#c8d4e2",
                border: `1px solid ${picked ? "#5eff9e" : "#3a4048"}`,
                borderRadius: 8, padding: "8px 14px",
                fontFamily: "ui-monospace,monospace", fontSize: 12, cursor: "pointer", letterSpacing: 1,
              }}>
              {picked ? "☑ " : "☐ "}{t.nom}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        <button onClick={onCancel}
          style={{ background: "transparent", color: "#8fa3bd", border: "1px solid #2a3648", borderRadius: 8, padding: "8px 14px", fontFamily: "ui-monospace,monospace", fontSize: 11, cursor: "pointer" }}>
          ← Continuer d'enquêter
        </button>
        <button onClick={onSubmit} disabled={!canSubmit}
          style={{
            background: canSubmit ? "#5eff9e" : "#2a3648",
            color: canSubmit ? "#06110b" : "#5a6678",
            border: "none", borderRadius: 8, padding: "10px 22px",
            fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800,
            cursor: canSubmit ? "pointer" : "default", letterSpacing: 1,
          }}>
          ▶ Rendre le verdict
        </button>
      </div>
    </div>
  );
}

function FeedbackPanel({ feedback, onRetry, onNext }) {
  const ok = feedback.verdict.ok;
  return (
    <div style={{ background: ok ? "#0e2818" : "#2a1408", border: `1px solid ${ok ? "#5eff9e" : "#e0a848"}`, borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: ok ? "#5eff9e" : "#e0a848", marginBottom: 6 }}>
        {ok ? "✓ VERDICT CORRECT" : "✗ RECOMMENCE"}
      </div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#e8eef5" }}>{feedback.verdict.retour}</p>
      {feedback.fbFiables && (
        <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.5, color: "#c8d4e2", fontStyle: "italic" }}>
          {feedback.fbFiables}
        </p>
      )}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
        {ok ? (
          <button onClick={onNext}
            style={{ background: "#5eff9e", color: "#06110b", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
            Continuer ▸
          </button>
        ) : (
          <button onClick={onRetry}
            style={{ background: "#e0a848", color: "#1a0e08", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1 }}>
            ↺ Retour à l'enquête
          </button>
        )}
      </div>
    </div>
  );
}
