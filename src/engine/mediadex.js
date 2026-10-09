/* ============================================================
   MEDIADEX — mapping messages → cartes-inventions
   ============================================================
   Chaque message pédagogique (msg_xxx) transmis dans le jeu
   peut avoir une CARTE (façon Pokémon) : image d'archive
   Wikimedia + attribution. La carte apparaît en bonus quand
   le joueur transmet le message.

   Les cartes découvertes sont mémorisées (save.mediadex) —
   l'écran Mediadex les affiche toutes, silhouettes grisées
   pour celles pas encore trouvées.
   ============================================================ */

import META from './inventions-meta.json';

/* Mapping msg_id → invention_id (nom du fichier dans _credits.json).
   Les messages sans entrée ici ne déclencheront PAS de carte
   (fiche pédagogique classique uniquement). */
export const MEDIADEX_MAP = {
  // Ch1 Paléolithique
  msg_peinture:      'lascaux',
  msg_mains:         'mains-negatives',
  msg_flute:         'flute-hohle-fels',
  // Ch2 Néolithique
  msg_megalithe:     'cairn-barnenez',
  msg_tatouage:      'otzi-tatouages',
  msg_poterie:       'poterie-neolithique',
  // Ch3 Mésopotamie/Égypte
  msg_cuneiforme:    'tablette-cuneiforme',
  msg_sceau:         'sceau-cylindre',
  msg_hieroglyphes:  'hieroglyphes',
  msg_alphabet:      'alphabet-phenicien',
  // Ch4 Antiquité
  msg_fresque:       'fresque-pompei',
  msg_cire:          'tablette-cire',
  msg_bibliotheque:  'bibliotheque-alexandrie',
  msg_inscription:   'inscription-romaine',
  // Ch5 Moyen Âge
  msg_broderie:      'tapisserie-bayeux',
  msg_manuscrit:     'manuscrit-enlumine',
  // Ch6 Époque moderne
  msg_imprimerie:    'presse-gutenberg',
  msg_gazettes:      'gazette-1631',
  msg_chappe:        'telegraphe-chappe',
  // Ch7 XIXe siècle
  msg_telegraphe:    'morse-key',
  msg_cable:         'cable-transatlantique',
  msg_daguerreotype: 'daguerreotype',
  msg_phonographe:   'phonographe-edison',
  msg_cinema:        'cinematographe-lumiere',
  msg_telephone:     'telephone-bell',
  msg_sos:           'tsf-marconi',
  // Ch8 XXe siècle guerre
  msg_radio_londres: 'radio-1920',
  msg_debarquement:  'poste-tsf-1940',
  msg_eniac:         'eniac',
  // Ch9 Médias de masse
  msg_tv_lune:       'tv-1969',
  msg_cassette:      'cassette-philips',
  msg_cd:            'cd-rom',
  msg_disquette:     'disquette',
};

/* Index par invention_id pour retrouver les métadonnées Wikimedia */
const META_BY_ID = {};
for (const m of META) META_BY_ID[m.id] = m;

/** Renvoie les métadonnées d'une invention pour un message, ou null. */
export function getCardMeta(msgId) {
  const invId = MEDIADEX_MAP[msgId];
  if (!invId) return null;
  const meta = META_BY_ID[invId];
  if (!meta) return null;
  return { ...meta, msgId };
}

/** Toutes les cartes possibles (pour l'écran Mediadex), triées par chapitre. */
export function allCards() {
  const cards = [];
  for (const [msgId, invId] of Object.entries(MEDIADEX_MAP)) {
    const meta = META_BY_ID[invId];
    if (meta) cards.push({ ...meta, msgId });
  }
  /* Tri : chapitre puis année (de la plus ancienne à la plus récente)
     puis titre en fallback. Les dates "av. J.-C." comptent en négatif. */
  const yearOf = (c) => {
    const s = String(c.date || "");
    const neg = /av\. J\.-C\./i.test(s) || /av\.J\.-C\./i.test(s);
    const compact = s.replace(/[\s  .]/g, "");
    const m = compact.match(/(\d{1,6})/);
    if (!m) return 0;
    const n = parseInt(m[1], 10);
    return neg ? -n : n;
  };
  cards.sort((a, b) => (a.chapter - b.chapter) || (yearOf(a) - yearOf(b)) || a.title.localeCompare(b.title, 'fr'));
  return cards;
}

/* Petit son « wow » quand une nouvelle carte est trouvée. */
let sfxCard = null;
export function playCardSound(muted = false) {
  if (muted) return;
  try {
    sfxCard = sfxCard || new Audio('assets/sounds/card-wow.mp3');
    sfxCard.currentTime = 0;
    sfxCard.volume = 0.15;
    sfxCard.play().catch(() => {});
  } catch { /* audio indisponible */ }
}
