import { useMemo, useState } from 'react';
import { allCards } from './mediadex.js';
import MediaCard from './MediaCard.jsx';
import TrophyCard, { TrophyTile } from './TrophyCard.jsx';
import { CHAPTERS } from '../chapters/index.js';

/* ============================================================
   MEDIADEX — écran de collection façon Pokédex
   ============================================================
   Grille de vignettes carte-inventions. Les cartes déjà
   découvertes s'affichent en couleur ; les autres sont
   silhouettées et grisées (« ??? »). Clic sur une découverte
   → carte détaillée en plein écran.
   Accessible depuis le menu titre ET depuis le jeu.
   ============================================================ */

/* Récupère l'objet message correspondant à un msg_id, en cherchant
   dans tous les chapitres du jeu. */
function findMessage(msgId) {
  for (const ch of CHAPTERS) {
    const m = ch.messages?.[msgId];
    if (m) return m;
  }
  return null;
}

export default function Mediadex({ unlocked = [], onClose, fluxTotal = 0, bonusChapters = [] }) {
  const cards = useMemo(() => allCards(), []);
  const [open, setOpen] = useState(null); // {card, message} ou null
  const [trophyOpen, setTrophyOpen] = useState(false);
  const unlockedSet = new Set(unlocked);
  /* Cible totale du voyage : somme des cibles chapitre (required × 5). */
  const totalTarget = useMemo(() => CHAPTERS.reduce((s, c) => s + (c.required || 3) * 5, 0), []);

  const byChapter = {};
  for (const c of cards) (byChapter[c.chapter] ||= []).push(c);
  const totalUnlocked = cards.filter((c) => unlockedSet.has(c.msgId)).length;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0f0a04',
      overflowY: 'auto', zIndex: 80, color: '#f8efdd',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* barre d'en-tête */}
      <div style={{
        position: 'sticky', top: 0, background: 'rgba(15,10,4,0.95)', backdropFilter: 'blur(6px)',
        borderBottom: '2px solid #c8963e', padding: '12px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: '#ffd166', letterSpacing: 2 }}>
            🃏 MEDIADEX
          </h1>
          <div style={{ fontSize: 12, color: '#c8963e', marginTop: 2 }}>
            {totalUnlocked} / {cards.length} médias trouvés
          </div>
        </div>
        <button onClick={onClose}
          style={{
            background: '#3a2010', color: '#ffd166', border: '1px solid #c8963e',
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            fontSize: 14, fontFamily: 'inherit',
          }}>
          Fermer ✕
        </button>
      </div>

      <div style={{ padding: '20px 24px 60px' }}>
        <p style={{ maxWidth: 720, fontSize: 13, lineHeight: 1.6, color: '#c8b090' }}>
          Chaque invention de communication transmise à MARTINE t'a offert une carte.
          Trouve-les toutes pour compléter ton Mediadex. Clique une carte connue pour la revoir.
        </p>

        {/* SECTION TROPHÉE : la carte spéciale « Chronaute », visible dès qu'on a
            joué. Évolue avec le score cumulé du voyage (fluxTotal). */}
        <section style={{ margin: '28px 0 0' }}>
          <h2 style={{
            color: '#ffd166', fontSize: 15, letterSpacing: 2, fontFamily: 'ui-monospace, monospace',
            borderBottom: '1px solid #5a4028', paddingBottom: 4,
          }}>
            TROPHÉE
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12, marginTop: 12,
          }}>
            <TrophyTile fluxTotal={fluxTotal} totalTarget={totalTarget} onClick={() => setTrophyOpen(true)} />
          </div>
        </section>

        {Object.keys(byChapter).sort((a, b) => a - b).map((chap) => (
          <section key={chap} style={{ margin: '28px 0 0' }}>
            <h2 style={{
              color: '#e0a848', fontSize: 15, letterSpacing: 2, fontFamily: 'ui-monospace, monospace',
              borderBottom: '1px solid #5a4028', paddingBottom: 4,
            }}>
              CHAPITRE {chap}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 12, marginTop: 12,
            }}>
              {byChapter[chap].map((c) => {
                const found = unlockedSet.has(c.msgId);
                const dateLabel = c.date || CHAPTERS[c.chapter - 1]?.date;
                return (
                  <button key={c.msgId}
                    disabled={!found}
                    onClick={() => {
                      if (!found) return;
                      const m = findMessage(c.msgId);
                      if (m) setOpen({ card: c, message: m });
                    }}
                    style={{
                      background: found ? '#2a1608' : '#1a1408',
                      border: `2px solid ${found ? '#c8963e' : '#3a2818'}`,
                      borderRadius: 10, padding: 8, cursor: found ? 'pointer' : 'not-allowed',
                      color: 'inherit', fontFamily: 'inherit', textAlign: 'left',
                      transition: 'transform .15s ease, box-shadow .15s ease',
                    }}
                    onMouseEnter={(e) => { if (found) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,150,62,0.4)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <div style={{
                      background: '#0a0604', border: '1px solid #3a2818', borderRadius: 6,
                      height: 100, overflow: 'hidden', position: 'relative',
                    }}>
                      <img src={`assets/inventions/${c.filename}`} alt=""
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          filter: found ? 'none' : 'grayscale(1) brightness(0.15) contrast(2)',
                          opacity: found ? 1 : 0.5,
                        }} />
                      {!found && (
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 32, color: '#5a4028', fontWeight: 800,
                        }}>?</div>
                      )}
                      {found && dateLabel && (
                        <div style={{
                          position: 'absolute', right: 4, bottom: 4,
                          background: 'rgba(10,6,4,0.85)', border: '1px solid #c8963e',
                          borderRadius: 4, padding: '2px 6px',
                          fontFamily: 'ui-monospace, monospace', fontSize: 10, fontWeight: 700,
                          color: '#ffd166', letterSpacing: 0.5,
                        }}>
                          {dateLabel}
                        </div>
                      )}
                    </div>
                    <div style={{
                      marginTop: 6, fontSize: 12, fontWeight: 700,
                      color: found ? '#ffd166' : '#5a4028',
                      lineHeight: 1.25,
                    }}>
                      {found ? c.title : '???'}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {open && (
        <MediaCard card={open.card} message={open.message}
          autoCloseMs={0}
          onClose={() => setOpen(null)} />
      )}
      {trophyOpen && (
        <TrophyCard fluxTotal={fluxTotal} totalTarget={totalTarget}
          bonusChapters={bonusChapters} onClose={() => setTrophyOpen(false)} />
      )}
    </div>
  );
}
