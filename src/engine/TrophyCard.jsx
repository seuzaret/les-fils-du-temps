/* ============================================================
   TROPHYCARD — carte « Chronaute » (façon Mediadex)
   ------------------------------------------------------------
   Une carte spéciale, sans photo Wikimedia, qui représente le
   niveau atteint par le joueur : apprenti → confirmé → expert →
   maître. Affichée en tête de Mediadex, elle progresse avec le
   voyage (elle est déjà cliquable dès qu'on a joué un peu).
   ============================================================ */

const NIVEAUX = [
  { name: "Chronaute apprenti",  emoji: "🎓", color: "#c8d4e2", bg: "#1a2838", accent: "#8fa3bd",
    desc: "Tu as bouclé le voyage : le strict nécessaire, et c'est déjà beaucoup.", mini: 150 },
  { name: "Chronaute confirmé",  emoji: "🏅", color: "#7fd8ff", bg: "#0e2a48", accent: "#3a80c8",
    desc: "Tu as goûté aux à-côtés — anachronismes, SOS, mini-jeux — pas seulement au chemin balisé.", mini: 200 },
  { name: "Chronaute expert",    emoji: "🎖️", color: "#ffb060", bg: "#3a1e10", accent: "#c8630e",
    desc: "Presque tous les bonus rassemblés. Tu as vraiment exploré chaque époque.", mini: 250 },
  { name: "Chronaute maître",    emoji: "🌟", color: "#ffd166", bg: "#3a2810", accent: "#e8934a",
    desc: "Tout fait, sans presque une erreur. Ta jauge a débordé à chaque étape.", mini: Infinity },
];

/* Résout un niveau depuis le pourcentage. */
function nivFromPct(pct) {
  if (pct >= 250) return NIVEAUX[3];
  if (pct >= 200) return NIVEAUX[2];
  if (pct >= 150) return NIVEAUX[1];
  return NIVEAUX[0];
}

/* ============================================================
   Portrait de MARTINE recevant sa médaille (SVG, sans asset).
   ============================================================ */
function MartineTrophy({ niv, animated }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* fond radial d'aura */}
      <defs>
        <radialGradient id="tr-aura" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={niv.color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={niv.color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tr-noix" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a06838" />
          <stop offset="100%" stopColor="#5a3818" />
        </linearGradient>
        <linearGradient id="tr-medal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={niv.color} />
          <stop offset="100%" stopColor={niv.accent} />
        </linearGradient>
      </defs>

      <rect width="200" height="200" fill={niv.bg} />
      <circle cx="100" cy="90" r="90" fill="url(#tr-aura)" />

      {/* étoiles/rayons de fond */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return <line key={i} x1={100 + Math.cos(rad) * 40} y1={90 + Math.sin(rad) * 40}
          x2={100 + Math.cos(rad) * 80} y2={90 + Math.sin(rad) * 80}
          stroke={niv.accent} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />;
      })}

      {/* MARTINE, avatar noix stylisé */}
      <g transform="translate(100,100)">
        {/* antenne + boule verte */}
        <path d="M0 -46 L0 -60" stroke="#3a2818" strokeWidth="1.5" />
        <circle cx="0" cy="-64" r="4" fill="#5eff9e" style={animated ? { animation: "pulse 1.2s infinite" } : undefined} />
        <circle cx="0" cy="-64" r="7" fill="#5eff9e" opacity="0.35" />
        {/* coque de noix (corps) */}
        <ellipse cx="0" cy="0" rx="40" ry="44" fill="url(#tr-noix)" stroke="#2a1810" strokeWidth="2" />
        {/* nervures de la noix */}
        <path d="M-30 -20 q30 -12 60 0 M-32 0 q32 -8 64 0 M-30 20 q30 -12 60 0" stroke="#3a2010" strokeWidth="0.6" fill="none" opacity="0.6" />
        {/* œil unique cyclopéen */}
        <circle cx="0" cy="-8" r="14" fill="#f8f4e8" stroke="#2a1810" strokeWidth="1.5" />
        <circle cx="0" cy="-6" r="6" fill="#2a1810" />
        <circle cx="2" cy="-8" r="1.4" fill="#f8f4e8" />
        {/* écran ventral avec la date */}
        <rect x="-18" y="18" width="36" height="14" rx="2" fill="#0a1119" stroke="#3a2010" strokeWidth="0.8" />
        <text x="0" y="28" textAnchor="middle" fontSize="7" fontFamily="ui-monospace,monospace" fontWeight="700" fill={niv.color}>{niv.name.slice(10).toUpperCase()}</text>
        {/* propulseurs latéraux (petites flammes) */}
        <path d="M-40 10 q-8 4 -10 -2 q6 -2 10 2 Z" fill="#7fd8ff" opacity="0.8" />
        <path d="M40 10 q8 4 10 -2 q-6 -2 -10 2 Z" fill="#e86028" opacity="0.8" />
      </g>

      {/* MÉDAILLE au cou */}
      <g transform="translate(100,148)">
        {/* ruban */}
        <path d="M-14 -18 L-4 6 L4 6 L14 -18 Z" fill={niv.accent} opacity="0.9" />
        {/* disque */}
        <circle r="18" fill="url(#tr-medal)" stroke="#2a1810" strokeWidth="1.5" style={animated ? { animation: "glow 2.4s ease-in-out infinite" } : undefined} />
        <circle r="14" fill="none" stroke="#2a1810" strokeWidth="0.6" />
        <text y="6" textAnchor="middle" fontSize="18">{niv.emoji}</text>
      </g>
    </svg>
  );
}

export default function TrophyCard({ fluxTotal, totalTarget, bonusChapters = [], onClose, animated = true }) {
  const pct = totalTarget ? Math.round((fluxTotal / totalTarget) * 100) : 0;
  const niv = nivFromPct(pct);

  /* prochain palier : de combien il manque en flux */
  const nextThreshold = pct < 150 ? 150 : pct < 200 ? 200 : pct < 250 ? 250 : null;
  const nextName = nextThreshold ? nivFromPct(nextThreshold).name : null;
  const nextFlux = nextThreshold ? Math.ceil((nextThreshold / 100) * totalTarget) - fluxTotal : 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 90, padding: 20, backdropFilter: 'blur(4px)',
        animation: 'cardFadeIn 1.6s ease-out',
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 340, maxWidth: '100%', maxHeight: '95vh', overflowY: 'auto',
          background: `linear-gradient(180deg, ${niv.accent} 0%, ${niv.bg} 100%)`,
          border: `4px solid ${niv.color}`, borderRadius: 20,
          boxShadow: `0 0 40px ${niv.color}aa, 0 12px 48px rgba(0,0,0,0.7)`,
          padding: 10, position: 'relative',
          animation: 'cardPop 1.4s cubic-bezier(0.34, 1.4, 0.5, 1) both',
          fontFamily: '"Segoe UI", system-ui, sans-serif', color: '#f8efdd',
        }}>

        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 8px' }}>
          <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.1, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: 18, marginRight: 4 }}>{niv.emoji}</span> {niv.name}
          </div>
          <div style={{ fontSize: 12, fontFamily: 'ui-monospace,monospace', color: niv.color, fontWeight: 700 }}>TROPHÉE</div>
        </div>

        {/* Portrait de MARTINE décoré */}
        <div style={{
          background: '#0a0604', border: `2px solid ${niv.color}`, borderRadius: 10,
          overflow: 'hidden', height: 200, position: 'relative',
        }}>
          <MartineTrophy niv={niv} animated={animated} />
          <div style={{
            position: 'absolute', bottom: 6, right: 6,
            background: niv.color, color: '#1a0e04', fontSize: 11.5, fontWeight: 800,
            padding: '2px 8px', borderRadius: 10, letterSpacing: 1,
            fontFamily: 'ui-monospace, monospace',
          }}>
            NIVEAU {(pct >= 250 ? 4 : pct >= 200 ? 3 : pct >= 150 ? 2 : 1)}
          </div>
        </div>

        {/* Barre de score + jalons */}
        <div style={{ padding: '10px 6px 4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, marginBottom: 4 }}>
            <span style={{ color: niv.color, fontWeight: 700 }}>⚡ SCORE</span>
            <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>{fluxTotal} / {totalTarget} ({pct}%)</span>
          </div>
          <div style={{ height: 12, background: 'rgba(0,0,0,0.4)', border: `1px solid ${niv.color}66`, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${Math.min(100, pct / 3)}%`, height: '100%', background: niv.color, transition: 'width .6s ease-out' }} />
            {/* jalons de palier : 150, 200, 250 → sur une échelle 0-300 */}
            {[150, 200, 250].map((t) => (
              <div key={t} style={{ position: 'absolute', left: `${(t / 300) * 100}%`, top: 0, bottom: 0, width: 1, background: '#00000088' }} />
            ))}
          </div>
        </div>

        {/* Description du niveau */}
        <div style={{
          margin: '8px 6px 4px', padding: '8px 10px',
          background: 'rgba(0,0,0,0.35)', borderRadius: 6,
          fontSize: 12.5, fontStyle: 'italic', lineHeight: 1.45, color: '#e8dfc8',
        }}>
          « {niv.desc} »
        </div>

        {/* Prochain palier + bonus chapitres */}
        <div style={{ padding: '4px 6px', fontSize: 12, color: '#c8c0a8', lineHeight: 1.6 }}>
          {nextName && (
            <div>➜ Prochain palier : <b style={{ color: nivFromPct(nextThreshold).color }}>{nextName}</b> dans {nextFlux}⚡</div>
          )}
          {!nextName && (
            <div>🏆 Palier maximum atteint ! Bravo, chronaute.</div>
          )}
          {bonusChapters.length > 0 && (
            <div style={{ marginTop: 4 }}>✨ Cartes bonus : {bonusChapters.length} chapitre(s) débordé(s)</div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cardFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardPop { 0% { transform: scale(0.7) rotate(-4deg); opacity: 0; } 60% { transform: scale(1.02) rotate(1deg); opacity: 1; } 100% { transform: scale(1) rotate(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

/* Version « vignette » pour l'intégration dans la grille Mediadex. */
export function TrophyTile({ fluxTotal, totalTarget, onClick }) {
  const pct = totalTarget ? (fluxTotal / totalTarget) * 100 : 0;
  const niv = nivFromPct(pct);
  const played = fluxTotal > 0;
  return (
    <button onClick={onClick} disabled={!played}
      style={{
        background: played ? niv.bg : '#1a1408',
        border: `2px solid ${played ? niv.color : '#3a2818'}`,
        borderRadius: 10, padding: 8, cursor: played ? 'pointer' : 'not-allowed',
        color: 'inherit', fontFamily: 'inherit', textAlign: 'left',
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
      onMouseEnter={(e) => { if (played) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${niv.color}66`; } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{
        background: '#0a0604', border: `1px solid ${played ? niv.color : '#3a2818'}`, borderRadius: 6,
        height: 100, overflow: 'hidden', position: 'relative',
      }}>
        {played ? (
          <MartineTrophy niv={niv} animated={false} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#5a4028', fontWeight: 800,
          }}>?</div>
        )}
      </div>
      <div style={{
        marginTop: 6, fontSize: 13.5, fontWeight: 700,
        color: played ? niv.color : '#5a4028', lineHeight: 1.25,
      }}>
        {played ? niv.name : '???'}
      </div>
    </button>
  );
}
