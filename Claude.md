# MARTINE — Brief de conception & instructions de développement

> **Ce document sert de référence au projet.** Il peut être renommé `CLAUDE.md` à la racine
> du projet pour que Claude Code le lise automatiquement à chaque session.
> Jeu sérieux EMI (Éducation aux Médias et à l'Information) — collège, cycles 3 & 4.
> Auteur : professeur documentaliste. Public : élèves de 6e à 3e, usage en classe (vidéoprojecteur ou postes individuels) et en autonomie au CDI.

---

## 1. Pitch

MARTINE (**M**achine **À** **R**emonter le **T**emps **I**ntelligente **N**éanmoins **E**xcellente)
s'écrase en −18 000 avec le joueur à son bord. Pour recharger ses circuits et rentrer,
il faut lui fournir des **messages laissés pour le futur** : à chaque époque, le joueur
explore des tableaux en point-and-click, ramasse des éléments et les **combine**
(façon Little Alchemy) pour recréer les grandes inventions de la communication —
de la peinture rupestre au streaming.

**Ton** : MARTINE est pince-sans-rire, un peu vexée par son crash, très cultivée.
Elle commente chaque réussite avec une fiche documentaire et chaque échec avec humour.

---

## 2. Le fil rouge pédagogique (LA grande idée du jeu)

Chaque message transmis affiche **4 jauges** :

| Jauge | Question posée |
|---|---|
| 🏃 **Vitesse** | En combien de temps le message arrive-t-il ? |
| 🌍 **Portée** | Combien de personnes peut-il atteindre ? |
| 📦 **Capacité** | Quelle quantité d'information peut-il porter ? |
| ⏳ **Durabilité** | Combien de temps le support survivra-t-il ? |

Au fil des époques, le joueur VOIT la tendance : vitesse, portée et capacité explosent…
pendant que la **durabilité s'effondre**. L'écran final affiche la frise complète des jauges
et le paradoxe central :

> *« La paroi de Lascaux se lit encore après 20 000 ans. La disquette de 1995 est déjà
> illisible. Plus un support est moderne, plus il est petit, rapide, dense… et fragile,
> vite obsolète. Que restera-t-il de nous ? »*

**Mécanique associée — le "message perdu"** : certaines combinaisons valides produisent
un message qui **ne parvient PAS au futur** (bois gravé qui pourrit, bande magnétique
démagnétisée, format propriétaire abandonné…). Le joueur gagne un simple *fragment*
au lieu d'un cristal, avec une explication : **un message ne survit que si son support
survit ET reste lisible**. C'est un ressort de jeu ET une leçon d'archivistique.

---

## 3. Mécaniques à implémenter

### 3.1 Exploration
- 2 à 3 **tableaux** par chapitre, navigation par flèches ‹ › et mini-carte (points).
- Objets **dessinés dans le décor**, cliquables sans halo permanent.
- Bouton 👁 : révèle les zones 2 secondes (accessibilité / déblocage).
- Bouton 💡 : indice contextuel (analyse l'inventaire, suggère la prochaine étape ou le lieu à fouiller).

### 3.2 Inventaire & combinaison — **glisser-déposer**
- Inventaire persistant (icônes + noms), **placé selon la place disponible** :
  en **colonne à gauche** du décor sur écran large (le décor est en 16/9 : il y est
  bloqué par la hauteur, et l'espace latéral est perdu → on y loge la besace, ce qui
  rend ~40 % de surface au décor sur un 1366×768) ; en **barre en bas** sur tablette
  ou écran étroit, où la largeur manque et où le pouce atteint le bas.
- **Drag & drop** d'un élément vers l'autre OU vers la zone "creuset" de MARTINE.
- ⚠️ Implémenter avec les **Pointer Events** (`pointerdown/move/up`), PAS l'API HTML5
  drag-and-drop (inutilisable au doigt sur tablette — usage scolaire oblige).
- Un élément peut aussi être **glissé sur un objet du décor** (ex. charbon → paroi de la grotte) : c'est la combinaison la plus "point-and-click" possible.

### 3.3 Feedback ("game juice")
- **Réussite** : particules dorées, halo, petit son cristallin, l'objet créé "pop" dans l'inventaire, jauges qui s'animent, carte documentaire.
- **Échec** : tremblement, "bzzt", réplique de MARTINE (avec réponses spéciales aux erreurs logiques : arc sans flèche, etc.).
- **Message perdu** : le message s'envole puis se désintègre en poussière + explication.
- Sons : bibliothèque de petits SFX libres (freesound.org, CC0) + possibilité d'ambiances lofi par époque. Un bouton 🔇 global.

### 3.4 Sauvegarde & classe
- `localStorage` : progression, messages découverts, chapitre courant.
- Écran "Carnet de bord" imprimable (CSS print) : toutes les fiches découvertes → trace écrite pour l'élève.
- Mode "classe entière" : police plus grande, plein écran (API Fullscreen).

### 3.5 2D, 2.5D ou 3D ?
**Décision : rester en 2D avec effet 2.5D (parallaxe).**
- La 3D (Three.js / react-three-fiber) est techniquement possible mais multiplie
  par 10 le coût de production des décors pour un gain pédagogique nul.
- Le compromis retenu : décors SVG/PNG en **3-4 couches à parallaxe** (le fond bouge
  moins vite que le premier plan au survol/gyroscope) → sensation de profondeur,
  coût quasi nul. C'est l'esthétique des meilleurs point-and-click 2D (Machinarium…).

---

## 4. Architecture technique

```
martine/
├── CLAUDE.md                  ← ce document
├── index.html
├── package.json               (Vite + React)
├── src/
│   ├── main.jsx
│   ├── App.jsx                (routage écrans : titre / jeu / fin)
│   ├── engine/                ← MOTEUR GÉNÉRIQUE, indépendant du contenu
│   │   ├── Scene.jsx          (affichage tableau + hotspots + parallaxe)
│   │   ├── Inventory.jsx      (drag & drop pointer events)
│   │   ├── Crafting.js        (résolution des recettes)
│   │   ├── Martine.jsx        (console dialogue machine à écrire)
│   │   ├── Gauges.jsx         (les 4 jauges)
│   │   ├── save.js            (localStorage)
│   │   └── audio.js
│   ├── titre/                 (écran titre TitrePyramide, menu, musique ; TitrePellicule ?titre=c, pour le futur générique de fin)
│   ├── chapters/              ← UN DOSSIER PAR CHAPITRE, pur contenu
│   │   ├── 01-paleolithique/
│   │   │   ├── data.js        (items, recettes, dialogues, fiches, jauges)
│   │   │   └── scenes/        (composants SVG ou images PNG des tableaux)
│   │   ├── 02-neolithique/
│   │   └── …
│   └── styles/
└── public/assets/             (sons, images, polices)
```

**Principe clé : moteur ↔ contenu séparés.** Ajouter un chapitre = ajouter un dossier
de données + décors, sans toucher au moteur. Les `data.js` doivent être lisibles et
modifiables par un enseignant non-développeur (structures simples, commentaires en français).

**Déploiement** : `npm run build` → dossier statique `dist/` à déposer tel quel sur
n'importe quel hébergement (hébergement PHP mutualisé existant : parfait, aucun besoin
de PHP ; ou GitHub Pages / itch.io). Prévoir un chemin relatif (`base: './'` dans Vite).

---

## 5. LA PROGRESSION HISTORIQUE — bible du contenu

> Structure retenue : **9 chapitres, 2-3 tableaux chacun (≈ 22 tableaux au total)**.
> Chaque recette = 2 éléments. Les chaînes (A+B→C, C+D→E) créent la profondeur.
> ⭐ = message (cristal) · 💨 = message perdu (fragment) · les jauges indicatives sont sur 5.

### Chapitre 1 — Paléolithique (vers −18 000) — *déjà prototypé*
Tableaux : fond de grotte · devant la grotte · campement · rivière.

| Recette | Résultat | Note EMI |
|---|---|---|
| branche + liane | arc | chaîne de survie |
| branche + silex | flèche | |
| arc + flèche → + cerf | chasse → peau, os, ivoire, tendon | avant de communiquer : survivre |
| branche + feu | charbon | |
| charbon + paroi | ⭐ peinture rupestre (Lascaux) | V1 P1 C3 D5 — image = 1er média conservé |
| ocre + paroi | ⭐ mains négatives (Gargas, 65 !) | « j'existe » — la signature |
| ivoire + silex | ⭐ statuette sculptée (Vénus, art mobilier) | le message transportable |
| os + silex | ⭐ flûte (Isturitz, Hohle Fels) | émotion sans mots |
| os + silex (aiguille) puis aiguille + peau | ⭐ vêtement / parure | la mode = message d'identité et de statut |
| voix + feu | ⭐ veillée, langue partagée | un CODE commun est indispensable ; déformation orale |
| bois + silex | 💨 bâton gravé | le bois pourrit : aucune trace ne nous est parvenue |

### Chapitre 2 — Néolithique (vers −5000 → −3000)
Tableaux : village (maisons, four) · lande aux mégalithes (Bretagne) · l'homme des glaces.

| Recette | Résultat | Note EMI |
|---|---|---|
| argile + mains, puis pot + four | céramique | |
| céramique + pigments | ⭐ poterie décorée | motifs = identité du groupe, « marque » avant l'heure |
| grande pierre + clan (corde/rondins) | ⭐ mégalithe (cairn de Barnenez, ~−4500) | message monumental : pour les morts, pour le territoire, visible de loin, durable ×1000 |
| aiguille + suie | ⭐ tatouage (Ötzi, ~−3300, 61 tatouages) | le corps comme support ; message qu'on porte à vie |
| minerai + four | métal (cuivre) | nouveau support : gravable, refondable… falsifiable ! |
| troupeau + mémoire | 💨 comptage de tête | trop de bêtes pour la mémoire seule → il FAUDRAIT noter… (teasing ch. 3) |

### Chapitre 3 — Mésopotamie & Égypte : naître de l'écriture (−3300 → −1000)
Tableaux : cité d'Uruk (grenier, scribes) · bords du Nil.

| Recette | Résultat | Note EMI |
|---|---|---|
| jetons d'argile + bulle scellée | calculi | compter sans écrire |
| argile + calame | ⭐ tablette pictographique → cunéiforme | l'écriture naît de la COMPTABILITÉ ; l'Histoire commence |
| sceau-cylindre + argile | ⭐ signature/sceau | authentifier un message — l'ancêtre du certificat |
| papyrus + roseau & encre | ⭐ hiéroglyphes du scribe | support léger, transportable… fragile |
| 22 signes + navires marchands | ⭐ alphabet (Phéniciens ~−1100) | un code SIMPLE se diffuse mieux qu'un code complexe |

### Chapitre 4 — Antiquité classique (Grèce, Rome, Pompéi)
Tableaux : villa de Pompéi · bibliothèque d'Alexandrie · forum.

| Recette | Résultat | Note EMI |
|---|---|---|
| enduit frais + pigments | ⭐ fresque (Pompéi) | l'image publicitaire et décorative ; graffitis = réseaux sociaux antiques |
| cire + stylet | ⭐ tablette de cire | 1er support EFFAÇABLE et réinscriptible — le brouillon |
| papyrus + bâton (umbilicus) | volumen (rouleau) | lecture séquentielle : impossible de « sauter à la page 50 » |
| volumens + grand bâtiment | ⭐ bibliothèque (Alexandrie, ~700 000 rouleaux) | stocker le savoir ; l'incendie = leçon sur la copie de sauvegarde |
| peau + chaux & ponce | parchemin | rare et TRÈS cher |
| parchemin + grattoir | 💨 palimpseste | on gratte un texte pour en écrire un autre : des œuvres antiques perdues à jamais |
| marbre + burin | ⭐ inscription monumentale | la loi affichée, « nul n'est censé ignorer » |

### Chapitre 5 — Moyen Âge (1000 → 1450)
Tableaux : scriptorium · château (salle de la broderie) · place du bourg.

| Recette | Résultat | Note EMI |
|---|---|---|
| fil de laine + toile de lin | ⭐ broderie de Bayeux (~1070, 70 m) | un récit en images… commandé par le vainqueur : la propagande |
| parchemin plié + couture | ⭐ codex | LA révolution du format : des PAGES ; accès direct, index possible |
| codex + moine copiste | ⭐ manuscrit enluminé | des mois par livre → savoir rare, cher, contrôlé |
| voix + place du marché | ⭐ crieur public | l'info officielle pour les non-lecteurs (95 % des gens) |
| verre coloré + plomb | ⭐ vitrail | la « BD » de ceux qui ne lisent pas : un média s'adapte à son public |

### Chapitre 6 — Époque moderne (1450 → 1800)
Tableaux : atelier de Gutenberg · relais de poste · tour de Chappe.

| Recette | Résultat | Note EMI |
|---|---|---|
| caractères mobiles + presse à vis | ⭐ imprimerie (Mayence, ~1450) | ×100 plus vite ; les idées échappent au contrôle (Réforme) |
| feuilles imprimées + colporteur | ⭐ gazettes & libelles (La Gazette, 1631) | naissance de la presse — déjà sous influence du pouvoir (Richelieu) |
| lettre + relais de chevaux | ⭐ poste royale (Louis XI, 1477) | un RÉSEAU organisé de transmission |
| bras articulés + tours en ligne de vue | ⭐ télégraphe optique de Chappe (1794) | Paris-Lille en minutes ; un code secret d'État |
| grenouille + zinc & cuivre (Volta) | électricité (pile, 1800) | l'énergie qui va tout changer (objet-clé pour le ch. 7) |

### Chapitre 7 — XIXe siècle (1800 → 1900)
Tableaux : bureau du télégraphe · salon du phonographe · atelier des frères Lumière.

| Recette | Résultat | Note EMI |
|---|---|---|
| électricité + code Morse | ⭐ télégraphe électrique (1837) | l'info plus vite que l'homme ; naissance des agences (Havas 1835 → AFP) |
| câble + océan | ⭐ câble transatlantique (1858/1866) | le monde « rétrécit » |
| membrane + électricité | ⭐ téléphone (Bell, 1876) | la voix à distance, en direct |
| aiguille + feuille d'étain (la cire vers 1888), puis disque plat | ⭐ phonographe (1877) → gramophone/vinyle | LE SON ENREGISTRÉ : une voix survit à son locuteur |
| plaque sensible + lumière | ⭐ photographie (Niépce 1826, Daguerre 1839) | la « preuve » par l'image… truquée dès le début |
| photos + manivelle | ⭐ cinématographe (Lumière, 1895) | l'image animée, le spectacle de masse |
| antenne + ondes | TSF (Marconi) → | |
| TSF + navire | ⭐ le SOS du Titanic (1912) | la radio SAUVE des vies — et impose des règles mondiales |

### Chapitre 8 — XXe siècle (1900 → 1990)
Tableaux : studio de radio (1940) · salon TV (1969) · salle informatique.

| Recette | Résultat | Note EMI |
|---|---|---|
| ondes + micro | ⭐ radio (appel du 18 juin 1940) | média de guerre : information, propagande, résistance |
| tube cathodique + caméra | ⭐ télévision (1er JT français : 1949) | le monde en direct dans le salon — un monde CHOISI par une rédaction |
| tubes à vide + calcul | ⭐ ENIAC (1946, 30 tonnes) | l'ordinateur naît militaire et énorme |
| bande magnétique + boîtier | ⭐ cassette (1963), VHS, disquette | 💨 variante : la bande se démagnétise, la disquette devient illisible |
| laser + disque | ⭐ CD (1982), DVD (1995) | le numérique optique ; « indestructible »… vraiment ? |
| ordinateurs + réseau | ⭐ Internet (ARPANET 1969) & Web (1989, Berners-Lee) | chacun devient émetteur ET récepteur : plus de filtre |

### Chapitre 9 — XXIe siècle & conclusion (2000 → aujourd'hui)
Tableaux : chambre d'ado (multi-écrans) · datacenter.

| Recette | Résultat | Note EMI |
|---|---|---|
| mémoire flash + poche | ⭐ clé USB, carte SD, SSD | des bibliothèques d'Alexandrie dans une poche |
| écran tactile + réseau mobile | ⭐ smartphone (2007) | TOUS les médias précédents dans un seul objet |
| serveurs lointains + abonnement | ⭐ streaming / cloud | « plus de support » ? Si : il est CHEZ QUELQU'UN D'AUTRE. Question : posséder ou accéder ? Que devient ton message si le service ferme ? |
| disquette (héritée du ch. 8) + PC moderne | 💨 fichier illisible | l'obsolescence : 30 ans ont suffi |
| pierre de Lascaux + œil | ⭐⭐ ÉPILOGUE | le paradoxe final + frise des jauges de tout le voyage |

**Épilogue jouable** : MARTINE, rechargée, demande au joueur de choisir SON support pour
laisser un message aux humains de +20 000 ans. Chaque choix (pierre, papier, disque dur,
cloud…) déclenche une réponse argumentée → débat de classe tout trouvé.

---

## 6. Roadmap de développement (avec Claude Code)

| Étape | Contenu | Livrable |
|---|---|---|
| **M0** | Init Vite+React, migration du prototype `.jsx` existant, séparation moteur/contenu | jeu actuel qui tourne en local |
| **M1** | Drag & drop pointer-events + effets de réussite + sons | mécanique définitive |
| **M2** | Jauges + messages perdus + sauvegarde localStorage | fil rouge pédagogique en place |
| **M3** | Chapitre 2 (Néolithique) complet | valide le pipeline « nouveau chapitre » |
| **M4** | Chapitres 3-5 | |
| **M5** | Chapitres 6-9 + épilogue + carnet imprimable | |
| **M6** | Tests élèves, accessibilité (clavier, contrastes, dys), build & mise en ligne | version 1.0 |

**Conventions pour Claude Code :**
- Tout le texte visible en **français**, ton MARTINE conservé (fiches sérieuses, répliques drôles).
- Aucune dépendance lourde sans discussion ; privilégier React + CSS. `framer-motion` autorisé pour les animations si besoin.
- Chaque `data.js` de chapitre : commenté, relu pour l'exactitude historique (dates sourcées).
- Compatible tablette (tactile) et vidéoprojecteur (plein écran, texte lisible à 5 m).
- Commits atomiques par fonctionnalité ; pas de refonte du moteur sans validation.

---

## 7. Pistes d'extension (plus tard)
- Mode « défi » : retrouver toutes les recettes d'une époque en temps limité (séance de 55 min).
- Export des découvertes en PDF élève (nom + fiches trouvées) pour évaluation.
- Quiz de fin de chapitre (3 questions) généré depuis les fiches.
- Éditeur de chapitre simplifié (formulaire → data.js) pour que d'autres collègues documentalistes créent leurs époques.
