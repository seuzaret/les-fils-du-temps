import { useEffect } from 'react';
import { assetUrl } from './assetUrl.js';

/* ============================================================
   MEDIACARD — carte façon Pokémon d'une invention/média découvert
   ============================================================
   Affichée en modale par-dessus la fiche pédagogique, avec :
   - grand bandeau image (photo Wikimedia)
   - titre + emoji + rareté (étoiles selon somme des jauges)
   - 4 barres de jauges (vitesse, portée, capacité, durabilité)
   - flavor text court (première phrase du fact)
   - chapitre + crédit auteur/licence en bas
   Couleurs des cartes variées par ÉPOQUE (comme les types
   Pokémon). Auto-close après ~4 s ou clic pour fermer.
   ============================================================ */

/* Palette par chapitre — chaque époque a « son type ». */
const TYPES = {
  1: { name: 'Grotte',      color: '#8a5828', accent: '#c8963e', bg: '#4a3020' }, // brun paléo
  2: { name: 'Argile',      color: '#8a7040', accent: '#c8a848', bg: '#4a3818' }, // ocre néo
  3: { name: 'Cité',        color: '#c8a848', accent: '#e0c060', bg: '#5a4028' }, // sable mésopotamien
  4: { name: 'Marbre',      color: '#a86a68', accent: '#c88880', bg: '#5a3438' }, // pourpre antique
  5: { name: 'Vitrail',     color: '#4a6a98', accent: '#7fa0d0', bg: '#243858' }, // bleu médiéval
  6: { name: 'Papier',      color: '#a08048', accent: '#c8a868', bg: '#4a3820' }, // parchemin moderne
  7: { name: 'Électrique',  color: '#a06840', accent: '#e0a848', bg: '#3a1e10' }, // cuivre XIXe
  8: { name: 'Ondes',       color: '#5a7a90', accent: '#8fb0d0', bg: '#2a3a4a' }, // gris guerre
  9: { name: 'Direct',      color: '#7040a0', accent: '#c8a8e0', bg: '#3a1e58' }, // néon TV
 10: { name: 'Cloud',       color: '#3a80c8', accent: '#7fc8e8', bg: '#0e2a48' }, // ciel numérique
};

/* Rareté (étoiles) selon la somme des jauges — c'est aussi une info
   pédagogique : plus il y a de jauges max, plus l'invention change tout. */
function computeStars(jauges) {
  const total = (jauges?.vitesse ?? 0) + (jauges?.portee ?? 0) + (jauges?.capacite ?? 0) + (jauges?.durabilite ?? 0);
  if (total >= 18) return 5;
  if (total >= 14) return 4;
  if (total >= 10) return 3;
  if (total >= 6) return 2;
  return 1;
}

const GAUGE_ROWS = [
  { key: 'vitesse',    emoji: '⚡', label: 'Vitesse' },
  { key: 'portee',     emoji: '🌍', label: 'Portée' },
  { key: 'capacite',   emoji: '📦', label: 'Capacité' },
  { key: 'durabilite', emoji: '⏳', label: 'Durabilité' },
];

export default function MediaCard({ card, message, onClose, autoCloseMs = 7000 }) {
  useEffect(() => {
    if (!autoCloseMs) return;
    const t = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, onClose]);

  if (!card || !message) return null;
  const t = TYPES[card.chapter] || TYPES[1];
  const stars = computeStars(message.jauges);
  const flavor = (message.fact || '').split(/[.!?]/).find((s) => s.trim().length > 20) || '';

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
          background: `linear-gradient(180deg, ${t.color} 0%, ${t.bg} 100%)`,
          border: `4px solid ${t.accent}`, borderRadius: 20,
          boxShadow: `0 0 40px ${t.accent}88, 0 12px 48px rgba(0,0,0,0.7)`,
          padding: 10, position: 'relative',
          animation: 'cardPop 1.4s cubic-bezier(0.34, 1.4, 0.5, 1) both',
          fontFamily: '"Segoe UI", system-ui, sans-serif', color: '#f8efdd',
        }}>

        {/* En-tête : titre + rareté */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 8px' }}>
          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.1, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: 18, marginRight: 4 }}>{message.emoji}</span> {message.title}
          </div>
          <div style={{ display: 'flex', gap: 1, fontSize: 12, color: '#ffd700', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </div>
        </div>

        {/* Grande image avec cadre */}
        <div style={{
          background: '#0a0604', border: `2px solid ${t.accent}`, borderRadius: 10,
          overflow: 'hidden', height: 200, position: 'relative',
        }}>
          <img src={assetUrl(`assets/inventions/${card.filename}`)}
            alt={card.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {/* étiquette type en bas de l'image */}
          <div style={{
            position: 'absolute', bottom: 6, right: 6,
            background: t.accent, color: '#1a0e04', fontSize: 10, fontWeight: 800,
            padding: '2px 8px', borderRadius: 10, letterSpacing: 1,
            fontFamily: 'ui-monospace, monospace',
          }}>
            {t.name}
          </div>
        </div>

        {/* Jauges */}
        <div style={{ padding: '10px 6px 4px', display: 'grid', gap: 4 }}>
          {GAUGE_ROWS.map((row) => {
            const v = message.jauges?.[row.key] ?? 0;
            return (
              <div key={row.key} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 24px', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                <span>{row.emoji} {row.label}</span>
                <div style={{ height: 10, background: 'rgba(0,0,0,0.4)', border: `1px solid ${t.accent}66`, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(v / 5) * 100}%`, height: '100%', background: t.accent }} />
                </div>
                <span style={{ textAlign: 'right', fontFamily: 'ui-monospace, monospace', fontSize: 10 }}>{v}/5</span>
              </div>
            );
          })}
        </div>

        {/* Flavor text */}
        {flavor && (
          <div style={{
            margin: '8px 6px 4px', padding: '8px 10px',
            background: 'rgba(0,0,0,0.35)', borderRadius: 6,
            fontSize: 11.5, fontStyle: 'italic', lineHeight: 1.45, color: '#e8dfc8',
          }}>
            « {flavor.trim()}. »
          </div>
        )}

        {/* Pied : chapitre + crédit */}
        <div style={{
          marginTop: 8, padding: '6px 6px 2px',
          borderTop: `1px solid ${t.accent}44`,
          fontSize: 10, color: '#c8c0a8', display: 'flex', justifyContent: 'space-between', gap: 8,
        }}>
          <span>Chapitre {card.chapter}</span>
          <span style={{ textAlign: 'right', flex: 1 }}>
            <a href={card.sourcePage} target="_blank" rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#c8c0a8', textDecoration: 'none' }}>
              {card.author} · {card.license}
            </a>
          </span>
        </div>
      </div>

      {/* animations globales injectées ici (petit hack pour ne pas polluer app.css) */}
      <style>{`
        @keyframes cardFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardPop { 0% { transform: scale(0.7) rotate(-4deg); opacity: 0; } 60% { transform: scale(1.02) rotate(1deg); opacity: 1; } 100% { transform: scale(1) rotate(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
