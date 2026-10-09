/* ============================================================
   JEU 3 — SCÈNE : « Salle des Archives » (A-01) — refonte J3-K
   ------------------------------------------------------------
   Grande salle en profondeur : allées d'étagères de dossiers vues
   en perspective vers le fond, échelle qui court sur rails, dalles
   phosphorescentes au sol, terminal cubique cerclé de LED avec
   affichage cathodique, chariot de dossiers oublié, mote de
   poussière en suspension. Mission A : le record corrompu apparaît
   après Kova, l'enquête temporelle se lance vers BunkerVoyage.
   ============================================================ */
import { useState } from "react";
import PnjSprite from "../PnjSprite.jsx";
import ArchivistQuest from "../archives/ArchivistQuest.jsx";

export default function BunkerArchives({ onGo, j3 }) {
  const mission = j3.missions.appel;
  const unlocked = !!j3.flags[mission?.prerequisite];
  const done = !!j3.flags[mission?.flag];
  const [questOpen, setQuestOpen] = useState(false);
  /* Trois passes de tri successives chez Jorge, en alternance avec
     les enquêtes de Vez. */
  const tri1 = !!j3.flags.archives_tri_1_done;
  const tri2 = !!j3.flags.archives_tri_2_done;
  const tri3 = !!j3.flags.archives_tri_3_done;
  const nextTri = !tri1 ? 1 : !tri2 ? 2 : !tri3 ? 3 : null;
  /* Compte le nombre d'enquêtes Vez résolues (parmi mission_order). */
  const missionOrder = j3.flags.mission_order || [];
  const missions = j3.missions || {};
  const nbEnqueteDone = missionOrder.filter((id) => missions[id] && j3.flags[missions[id].flag]).length;
  /* Chaque tri Jorge requiert d'avoir fini le même numéro d'enquête Vez
     (tri 1 après Kova, tri 2 après enquête 2, tri 3 après enquête 3). */
  const triReady = nextTri !== null && nbEnqueteDone >= nextTri;
  const jorgeDone = nextTri === null;
  const jorgeArrete = !!j3.flags.jorge_arrete;
  const jorgePresent = !jorgeArrete;
  const openJorge = () => {
    if (triReady) setQuestOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 1600 }}>
      <svg viewBox="0 0 1000 520" style={{ display: "block", width: "100%", height: "auto", maxHeight: "100%" }}>
        <defs>
          <linearGradient id="ar-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2028" />
            <stop offset="100%" stopColor="#050810" />
          </linearGradient>
          <linearGradient id="ar-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141c26" />
            <stop offset="100%" stopColor="#050810" />
          </linearGradient>
          <radialGradient id="ar-terminal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5eff9e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#5eff9e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ar-shelf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4048" />
            <stop offset="100%" stopColor="#141c26" />
          </linearGradient>
          <radialGradient id="ar-dust" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c8b090" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c8b090" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Murs + sol */}
        <rect width="1000" height="520" fill="url(#ar-wall)" />
        <rect y="380" width="1000" height="140" fill="url(#ar-floor)" />
        {/* Plafond avec caillebotis technique */}
        <rect x="0" y="0" width="1000" height="60" fill="#0a0e14" />
        {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="60" stroke="#141c26" strokeWidth="1" />
        ))}
        {[20, 40].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#141c26" strokeWidth="0.5" />
        ))}
        {/* Néons verts entre les caillebotis */}
        {[180, 500, 820].map((x, i) => (
          <g key={i}>
            <rect x={x - 30} y="30" width="60" height="6" rx="1" fill="#5eff9e" opacity="0.6" />
            <circle cx={x} cy="80" r="90" fill="#5eff9e" opacity="0.05" />
          </g>
        ))}
        {/* Rail supérieur horizontal (pour l'échelle roulante) */}
        <rect x="80" y="90" width="840" height="6" fill="#3a4048" stroke="#0a0e14" strokeWidth="0.6" />
        <rect x="80" y="94" width="840" height="2" fill="#5a6270" />

        {/* ALLÉES D'ÉTAGÈRES EN PERSPECTIVE — deux allées de chaque côté */}
        {/* Allée gauche : 3 rangées qui reculent vers le fond */}
        {[
          { x: 40,  y: 130, w: 130, h: 250, depth: 0 },
          { x: 60,  y: 170, w: 110, h: 210, depth: 1 },
          { x: 90,  y: 200, w: 90,  h: 170, depth: 2 },
        ].map((s, i) => (
          <g key={`L${i}`} opacity={1 - s.depth * 0.15}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#ar-shelf)" stroke="#0a0e14" strokeWidth="1.5" />
            {/* Rangées horizontales */}
            {Array.from({ length: 6 }).map((_, r) => (
              <g key={r} transform={`translate(${s.x + 4},${s.y + 8 + r * (s.h / 6)})`}>
                <line x1="0" y1="0" x2={s.w - 8} y2="0" stroke="#0a0e14" strokeWidth="0.6" />
                {/* Dossiers de couleurs variées serrés */}
                {Array.from({ length: Math.max(2, Math.floor(s.w / 12) - 1) }).map((_, k) => (
                  <rect key={k} x={2 + k * 12} y={2}
                    width={10 - s.depth}
                    height={Math.max(14, (s.h / 6) - 6)}
                    fill={["#8a3820", "#5a2818", "#8a5030", "#5a4028", "#3a2818", "#8a3820"][(r + k + i) % 6]}
                    stroke="#0a0e14" strokeWidth="0.3" opacity={0.9 - s.depth * 0.1} />
                ))}
              </g>
            ))}
            {/* Étiquette de la rangée */}
            <rect x={s.x + 4} y={s.y - 8} width={40} height="6" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.3" />
            <text x={s.x + 24} y={s.y - 3} textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fill="#3a2010">
              L{i + 1} / {["A-C", "D-G", "H-M"][i]}
            </text>
          </g>
        ))}
        {/* Allée droite : symétrique */}
        {[
          { x: 830, y: 130, w: 130, h: 250, depth: 0 },
          { x: 830, y: 170, w: 110, h: 210, depth: 1 },
          { x: 820, y: 200, w: 90,  h: 170, depth: 2 },
        ].map((s, i) => (
          <g key={`R${i}`} opacity={1 - s.depth * 0.15}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#ar-shelf)" stroke="#0a0e14" strokeWidth="1.5" />
            {Array.from({ length: 6 }).map((_, r) => (
              <g key={r} transform={`translate(${s.x + 4},${s.y + 8 + r * (s.h / 6)})`}>
                <line x1="0" y1="0" x2={s.w - 8} y2="0" stroke="#0a0e14" strokeWidth="0.6" />
                {Array.from({ length: Math.max(2, Math.floor(s.w / 12) - 1) }).map((_, k) => (
                  <rect key={k} x={2 + k * 12} y={2}
                    width={10 - s.depth}
                    height={Math.max(14, (s.h / 6) - 6)}
                    fill={["#5a4028", "#8a5030", "#5a2818", "#8a3820", "#5a4028", "#3a2818"][(r + k + i) % 6]}
                    stroke="#0a0e14" strokeWidth="0.3" opacity={0.9 - s.depth * 0.1} />
                ))}
              </g>
            ))}
            <rect x={s.x + 4} y={s.y - 8} width={40} height="6" fill="#e8dfc8" stroke="#3a2818" strokeWidth="0.3" />
            <text x={s.x + 24} y={s.y - 3} textAnchor="middle" fontSize="4" fontFamily="ui-monospace,monospace" fill="#3a2010">
              R{i + 1} / {["N-R", "S-U", "V-Z"][i]}
            </text>
          </g>
        ))}

        {/* Ouverture centrale : couloir de perspective vers le fond */}
        <path d="M 200 380 L 800 380 L 620 130 L 380 130 Z" fill="#0a0e14" />
        {/* Dalles phosphorescentes du couloir central */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y1 = 380 - i * 50;
          const y2 = 380 - (i + 1) * 50;
          const s1 = (380 - y1) / 250;
          const s2 = (380 - y2) / 250;
          const lx1 = 200 + s1 * 180;
          const rx1 = 800 - s1 * 180;
          const lx2 = 200 + s2 * 180;
          const rx2 = 800 - s2 * 180;
          return (
            <path key={i} d={`M ${lx1} ${y1} L ${rx1} ${y1} L ${rx2} ${y2} L ${lx2} ${y2} Z`}
              fill={i % 2 === 0 ? "#0a1a10" : "#0a0e14"}
              stroke="#5eff9e" strokeWidth="0.6" opacity={0.55 - i * 0.08} />
          );
        })}

        {/* Point de fuite tout au fond : petite arche */}
        <path d="M 460 130 L 460 100 Q 500 80 540 100 L 540 130 Z" fill="#141c26" stroke="#3a4048" strokeWidth="1" />
        <text x="500" y="118" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#5eff9e" letterSpacing="2">FOND</text>

        {/* ÉCHELLE ROULANTE sur le rail (côté droit) */}
        <g transform="translate(720,96)">
          <rect x="-3" y="0" width="6" height="4" fill="#c8a848" stroke="#0a0806" strokeWidth="0.4" />
          <line x1="0" y1="4" x2="0" y2="260" stroke="#5a6270" strokeWidth="2.5" />
          <line x1="-14" y1="4" x2="-14" y2="260" stroke="#5a6270" strokeWidth="2" />
          {/* Barreaux */}
          {[30, 70, 110, 150, 190, 230].map((y) => (
            <line key={y} x1="-14" y1={y} x2="0" y2={y} stroke="#5a6270" strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>

        {/* PASSAGE SECRET — retiré pour l'instant : l'accès à la salle
            temporelle se fera depuis l'ascenseur (niveau K), pas d'ici. */}

        {/* CHARIOT de dossiers oublié au sol, allée centrale */}
        <g transform="translate(560,370)">
          <rect x="-30" y="-14" width="60" height="16" fill="#3a4048" stroke="#0a0806" strokeWidth="1" />
          <rect x="-28" y="-30" width="56" height="16" fill="#5a4028" stroke="#0a0806" strokeWidth="0.8" />
          {/* Dossiers empilés dessus */}
          {[[-24, "#8a3820"], [-12, "#5a2818"], [0, "#8a5030"], [12, "#5a4028"]].map(([x, c], i) => (
            <rect key={i} x={x} y="-42" width="10" height="12" fill={c} stroke="#0a0806" strokeWidth="0.4" />
          ))}
          {/* Roues */}
          <circle cx="-24" cy="6" r="4" fill="#141c26" stroke="#5a6270" strokeWidth="0.8" />
          <circle cx="24" cy="6" r="4" fill="#141c26" stroke="#5a6270" strokeWidth="0.8" />
        </g>

        {/* MOTES DE POUSSIÈRE en suspension (halos + points) */}
        <ellipse cx="360" cy="270" rx="60" ry="18" fill="url(#ar-dust)" opacity="0.4" />
        <ellipse cx="640" cy="240" rx="70" ry="16" fill="url(#ar-dust)" opacity="0.3" />
        {[[300, 200], [400, 260], [500, 220], [620, 280], [720, 200]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1} fill="#e8dfc8" opacity="0.55">
            <animate attributeName="cy" values={`${y};${y - 8};${y}`} dur={`${5 + (i % 3)}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${5 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* TERMINAL D'ARCHIVE au centre — surélevé sur socle avec câbles */}
        <g transform="translate(500,300)">
          <circle cx="0" cy="30" r="100" fill="url(#ar-terminal)" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Socle */}
          <rect x="-60" y="30" width="120" height="10" fill="#3a4048" stroke="#0a0806" strokeWidth="1" />
          <rect x="-50" y="40" width="100" height="42" fill="#141c26" stroke="#0a0806" strokeWidth="1" />
          {/* Écran cathodique (cerclé de LED clignotantes) */}
          <rect x="-60" y="-40" width="120" height="72" fill="#141c26" stroke="#5eff9e" strokeWidth="2" />
          <rect x="-56" y="-36" width="112" height="64" fill="#0a1a10" />
          {/* Contenu de l'écran selon l'état de la mission */}
          <text x="0" y="-22" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7" fill="#5eff9e" letterSpacing="1">RÉSEAU M · ARCHIVES</text>
          <line x1="-52" y1="-16" x2="52" y2="-16" stroke="#144030" strokeWidth="0.5" />
          <text x="-52" y="-6" fontSize="6" fontFamily="ui-monospace,monospace" fill="#5eff9e">◆ 12 042 entrées</text>
          {unlocked && !done && (
            <text x="-52" y="6" fontSize="6" fontFamily="ui-monospace,monospace" fill="#5a6678">
              ◇ VERROUILLÉ · MARTINE
            </text>
          )}
          {done && (
            <>
              <text x="-52" y="6" fontSize="6" fontFamily="ui-monospace,monospace" fill="#5eff9e">
                ✓ Dossiers restaurés
              </text>
              <text x="-52" y="16" fontSize="5.5" fontFamily="ui-monospace,monospace" fill="#5eff9e">
                3 / 3 — source vérifiée
              </text>
            </>
          )}
          {/* Curseur clignotant en bas */}
          <rect x="46" y="20" width="4" height="6" fill="#5eff9e">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
          </rect>
          {/* Halo de LED autour de l'écran */}
          {[[-60, -40], [60, -40], [-60, 32], [60, 32]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="#ffd870" stroke="#0a0806" strokeWidth="0.4">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.4 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Clavier à touches */}
          <rect x="-48" y="42" width="96" height="12" fill="#28303a" stroke="#0a0806" strokeWidth="0.5" />
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={-46 + i * 9.6} y={44} width="8" height="4" fill="#5a6270" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={-46 + i * 9.6} y={49} width="8" height="4" fill="#5a6270" />
          ))}
          {/* Câbles qui pendent du socle vers le sol */}
          <path d="M-30 82 Q-40 90 -20 100" stroke="#0a0806" strokeWidth="2" fill="none" />
          <path d="M0 82 Q10 92 -6 100" stroke="#3a4048" strokeWidth="2" fill="none" />
          <path d="M30 82 Q30 94 40 100" stroke="#0a0806" strokeWidth="2" fill="none" />
        </g>

        {/* Plaque murale d'archives au fond */}
        <g transform="translate(500,60)">
          <rect x="-40" y="0" width="80" height="14" fill="#e8dfc8" stroke="#3a2010" strokeWidth="1" />
          <text x="0" y="10" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fontWeight="700" fill="#0a0806" letterSpacing="2">A-01 · ARCHIVES</text>
        </g>

        {/* Titre au sol phosphorescent */}
        <text x="500" y="500" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#5eff9e" letterSpacing="3" opacity="0.7">
          SILENCE — SECTEUR MÉMOIRE
        </text>

        {/* Jorge, l'archiviste : vieux, chauve, barbe grise. Toujours
            présent dans les Archives (sauf après arrestation). Clic →
            smalltalk (si rien à faire) ou mission (si Kova faite et
            rangement pas encore donné). Loupe sur hover → 3 questions
            d'orientation, SEULEMENT avant que la mission soit finie.
            Après, Jorge est redevenu bougon et il ne cause plus. */}
        {jorgePresent && (
          <PnjSprite x={700} y={400}
            color="#3a2818" pants="#1a1408" hair="#8a8070" skin="#c8a888"
            bald beard="#8a8070"
            facing="front" accessory="coat" activity="write"
            nom="Jorge" role="Archiviste"
            heard={!triReady && (tri1 || tri2 || tri3)}
            active={triReady}
            onClick={triReady ? openJorge : undefined} />
        )}
      </svg>

      {/* Panneau bas : indicateur contextuel */}
      <div style={{ maxWidth: 1200, width: "100%" }}>
        {done ? (
          <div style={{ background: "#0e2818", border: "1px solid #5eff9e", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, letterSpacing: 2, color: "#5eff9e" }}>
              ✓ TOUS LES DOSSIERS RESTAURÉS
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#c8ffdd", lineHeight: 1.55, fontStyle: "italic" }}>
              {mission.succes}
            </p>
          </div>
        ) : unlocked ? (
          <div style={{ background: "#0a0e14", border: "1px dashed #c8a848", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#c8d4e2", lineHeight: 1.55 }}>
              Le terminal des Archives affiche <strong style={{ color: "#5a6678" }}>VERROUILLÉ · MARTINE</strong>. Impossible de consulter les dossiers d'ici.
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#c8a848", fontStyle: "italic" }}>
              L'archiviste Jorge, assis au bureau, lève à peine la tête quand tu entres.
            </p>
          </div>
        ) : (
          <div style={{ background: "#0a0e14", border: "1px dashed #3a4048", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#7a879e", fontStyle: "italic" }}>
              L'archiviste Jorge est là, bougon, le nez dans ses dossiers. Il ne semble pas avoir de travail à te confier pour l'instant.
            </p>
          </div>
        )}
      </div>

      <button onClick={() => onGo(j3.hubRoom || "hub")}
        style={{ background: "#141b26", color: "#7fd8ff", border: "1px solid #3a80c8", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 12.5, fontFamily: "ui-monospace,monospace", letterSpacing: 1 }}>
        ← Retour au couloir
      </button>

      {questOpen && (
        <ArchivistQuest j3={j3} triIdx={nextTri || 1}
          onDone={() => {
            j3.setFlag(`archives_tri_${nextTri}_done`);
            setQuestOpen(false);
          }}
          onCancel={() => setQuestOpen(false)} />
      )}
    </div>
  );
}

