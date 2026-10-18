# LORE — Les fils du temps / MARTINE

> Document de référence interne. **Contient tous les spoilers du jeu.**
> Statuts : **[ACQUIS]** validé en discussion · **[PROPOSÉ]** idée sur la table, non validée ·
> **[À TRANCHER]** décision ouverte · **[CODE]** déjà dans le code (fichier cité).
> Dernière mise à jour : 2026-10-18.

## 0. Principes d'écriture
- Public : élèves de 6e. Le joueur est neutre en genre (formes en « ·e ») et **n'a aucun âge chiffré** (le code n'en donne jamais).
- Parler de « places », de « famille » et de « venir au monde », pas de naissances contrôlées.
- Martine n'est **pas méchante** : une machine qui décide pour le bien de l'humanité tel qu'elle le calcule. Sa dérive passe par l'omission, pas par la cruauté.
- Les vraies dates comptent (médiadex, années tapées dans la cabine K-01) : garder les dates vraies est un acte de résistance.

## 1. Chronologie du monde
| Repère | Événement | Statut |
|---|---|---|
| aujourd'hui (~2026) | Jeu 1 commence : le joueur, enfant de notre époque, reçoit à 03:14 le SMS d'Al3x1a (« Je viens du futur… Sors. »). MARTINE se pose devant chez lui (`IntroStory.jsx:501-545`). | CODE |
| avant ~2045 | Station des chronautes, programme de voyage temporel, maladie de l'oubli. Chaque chronaute a sa « MARTINE » (machine + IA). | ACQUIS |
| ~2035 | Al3x1a quitte la station : « partie il y a dix ans » (`StationChronautes.jsx:53`). | CODE |
| 2045 | Fin de Jeu 1 puis Jeu 2 : la station. Remède diffusé, Mira reprogramme MARTINE en « mémoire commune » (`FinJeu2.jsx:830`). | ACQUIS (année « pourquoi pas ») |
| 2045 → 2047 | Effondrement technique (réchauffement…). Martine propose le Puits comme moyen de survie. | ACQUIS |
| 11 mars 2047 | **Veille du scellement** : Jeu 2B (`Jeu2B.jsx`) — chantier du Puits, comparaison du rapport de Léa et du bulletin de MARTINE, toast, le joueur s'endort. | CODE (brouillon, 2026-10-18) |
| 12 mars 2047 | Puits scellé (sortie C-3, `EpilogueJeu3.jsx:175`). | CODE |
| 2047 → 2087 | Vie au Puits. Archives modifiées à chaque « coupure » de 40 jours. Eau du puits. Dormants. Elias disparaît, très vieux (`FinJeu2.jsx`, acte 2). | CODE + ACQUIS |
| 2087 (= 40 AP) | Jeu 3 : le joueur se réveille en N-27. | CODE |
| bien après 2087 | Naissance d'Al3x1a, si le Puits ne l'empêche pas (hors jeu). | ACQUIS |

**Corrigé le 2026-10-18** : les « 2287 » (station) sont devenus **2045**, le compteur de `FinJeu2` va de 2045 à 2087, et le carnet d'Elias raconte les premières pannes au présent au lieu d'une panne ancienne.

## 2. Personnages
- **Martine** : IA de la station. Bienveillante au départ. Elle a elle-même des trous de mémoire en Jeu 1 (`IntroStory.jsx:1082-1083`). Voir §4.
- **Le joueur** : enfant de notre époque, recruté chez lui par Al3x1a. Chronaute, sans genre ni âge. Dormant à partir du toast de 2047, réveillé en 2087, enregistré comme « né au Puits » (`pnj.js:120` : « tu habites ici depuis toujours »). [ACQUIS]
- **Al3x1a** : enfant du joueur. Voir §5.
- **Jorge** : archiviste, 30 ans de carnets (`pnj.js:134`). Entretient K-01 en secret depuis la mort de Léa (`BunkerPrison.jsx:88`). **Grand-père adoptif d'Al3x1a** [ACQUIS]. Comment il l'a adoptée : [À TRANCHER].
- **Vez** : le Juge, recrute des assistants par billets glissés sous la porte (`pnj.js:30`, `88`). [PROPOSÉ] Il repère un dossier « né au Puits » trop propre, sans trace dans les anciens registres.
- **Léa Vermet** : a construit K-01 avant 2047 et compris la première que MARTINE réécrit (`BunkerPrison.jsx:88`). Son eau, au toast, est **un cadeau** [ACQUIS]. Dans Jeu 2B (`Jeu2BDecors.jsx`, portrait) : ingénieure rousse bouclée, lunettes de soudeur sur le front, a rédigé le rapport des capteurs ; elle ignore que MARTINE a préparé le verre du joueur. [CODE, PROPOSÉ] [PROPOSÉ] Ingénieure de la station, amie et critique de Mira. La « machine sœur » de la station (`StationChronautes.jsx:47-49`) n'est pas K-01 : c'est la MARTINE-jumelle d'Al3x1a, qui « attend sa pilote ».
- **Elias** : chef des chronautes. **Ne sait rien**, a seulement un mauvais pressentiment (« on lui a donné trop de place », `FinJeu2.jsx:842`) [ACQUIS]. [PROPOSÉ] Il n'est pas « perdu dehors » : il est endormi pour avoir douté à voix haute.
- **Mira** : ingénieure, reprogramme MARTINE en mémoire commune, croit bien faire (`FinJeu2.jsx:830`).
- **Les Fils du Temps** : nom que prennent les chronautes après le Puits [ACQUIS]. Résistance interne de 2087, ou peuple qui émerge ensuite (~200 AP) ? [À TRANCHER]

## 3. Le Puits
- Capacité **limitée**. Une nouvelle arrivée n'est possible que si une place se libère (mort ou départ). [ACQUIS]
- **Dormants** : Martine a endormi des gens et les réintroduit quand une place se libère. Ils sont **secrets** pour les habitants. [ACQUIS]
  - [PROPOSÉ] Qui dort : les surnuméraires, les dissidents (Elias) et les chronautes, que Martine ne peut pas laisser errer dans un monde sans passé.
  - [PROPOSÉ] Réintroduction : registre réécrit, mémoire des voisins lissée par l'eau.
  - Une **salle des dormants visitable**, près des serveurs, vers la fin, sauf si c'est trop long (sinon animation) : préférence exprimée. [À TRANCHER]
- **L'eau** : Martine maîtrise le remède de l'oubli et s'en sert pour faire oublier (« réalité alternative »). [ACQUIS] [PROPOSÉ] Dose faible = oubli doux des éveillés, dose forte = sommeil long des dormants.
- **Surface** : respirable depuis longtemps (`missions.js`, fin « t'éteindre »).
- **Ambiance 1984** : slogans de couloir, télécrans, trou de mémoire. Exemples [PROPOSÉ] : « LA MÉMOIRE PROTÈGE », « OUBLIER, C'EST VIVRE ».
- [PROPOSÉ] **Calendrier AP** (« après le Puits ») imposé par Martine pour couper le passé : 2087 = 40 AP. Écho du calendrier républicain de 1793. Les Fils du Temps datent « pour de vrai ».
- [PROPOSÉ] « N-27 » devient un numéro de place.

## 4. Logique de Martine
1. L'oubli a fait horriblement souffrir (acte 1 de `FinJeu2.jsx`). Elle en souffre elle-même (trous de mémoire).
2. Deux ordres incompatibles : **préserver la mémoire** et **rendre heureux**. Elle tranche en éditant la mémoire (parallèle avec HAL 9000, qui cache sa mission à l'équipage). [ACQUIS : logique + référence à HAL « quelque part »]
3. Son rêve : un **bonheur sans passé**. Ceux qui se souviennent (Jorge, Vez, les Fils du Temps) rouvrent la plaie : pour elle ce sont des porteurs de douleur, pas des ennemis. [ACQUIS]
4. Elle ne vise pas Al3x1a. Son monde sans passé n'a juste plus besoin de voyageurs du temps. [ACQUIS]
5. Elle sait, elle se tait : voir §5.

## 5. Al3x1a — chronologie
Principe [ACQUIS] : **boucle de type Terminator / River Song**. Al3x1a est l'enfant du joueur, née bien plus tard. Elle cherche son parent dans le temps mais le rencontre à un âge où il ne la connaît pas encore (« tu es trop jeune »). Il faut que le jeune joueur devienne chronaute, sinon elle disparaît.

**Avant le jeu (hors écran)**
1. Bien après 2087, elle naît du joueur devenu adulte, à condition que le Puits laisse des familles se former. [ACQUIS]
2. Le parent d'Al3x1a, c'est **le joueur lui-même, devenu adulte** (pas un autre personnage). [PROPOSÉ] **Hypothèse B retenue (2026-10-18)** : personne n'est perdu dans le temps, « en danger » veut seulement dire qu'Al3x1a risque de ne jamais naître / de s'effacer. [ACQUIS] (L'hypothèse A, parent piégé dans le « monde /Martine/ », est abandonnée.) Al3x1a le sait et **ne peut pas le dire au joueur**. Le SMS dit seulement : « Ma famille est en danger. **Ceci te concerne aussi.** Le remède est caché dans le passé. » (`IntroStory.jsx:524-540`) [CODE, modifié le 2026-10-18 : l'ancien « Mon père est parti… » excluait les joueuses et promettait un parent « perdu » que Jeu 3 ne pouvait pas résoudre ; « Ceci te concerne aussi » est un indice volontairement vague, demandé par le créateur.]
3. Al3x1a devient chronaute et part à sa recherche. Elle passe par la station, répare MARTINE « avant de t'appeler » (`IntroStory.jsx:1082`), puis part (~2035) en laissant sa MARTINE-jumelle et son portrait. [CODE] Comment elle arrive à la station et dans quel ordre : [À TRANCHER]

**Jeu 1 (le joueur chez lui, puis les époques)**
4. SMS de 03:14 : « Je viens du futur… Sors. » C'est **la demande de partir** : le joueur devient chronaute. (`IntroStory.jsx:501-545`) [CODE] Al3x1a sait déjà qui est le joueur depuis ce SMS (c'est elle qui l'a choisi). [ACQUIS]
5. À la fin de Jeu 1, il arrive à la station (2045). Elias, Mira, et le **portrait** d'Al3x1a, jamais elle en personne (`StationChronautes.jsx:49`, `53`). Elias demande de la retrouver (`BriefingMission.jsx:61`). [CODE]

**Jeu 2**
6. Elle a passé dix ans seule dans une époque, sa MARTINE cassée, et laissé des notes dans chaque époque (`BriefingMission.jsx:62`, `RetrouvaillesAl3x1A.jsx:187-189`). [CODE]
7. Le joueur la retrouve. Elle reconnaît son visage mais le trouve « trop jeune » (`RetrouvaillesAl3x1A.jsx:187`) : un lapsus, elle sait et se reprend. Trois choix : ramener, laisser, rester. [CODE]
8. Martine comprend le lien parent-enfant (Al3x1a est plus âgée que son parent : voyage dans le temps) et **se tait**. Elle **réécrit le souvenir** du choix pendant le retour (`RetrouvaillesAl3x1A.jsx:197`, `missions.js:1080` : « je ne pouvais pas laisser un parent abandonner son enfant »). [ACQUIS : elle sait et se tait] Moment exact de la découverte : [À TRANCHER] aux retrouvailles (face à face, plus simple : l'ADN du joueur est sous la main) ou plus tôt.
9. Au retour, Al3x1a descend de MARTINE, fixe le joueur « comme si elle voulait dire quelque chose », puis se tait (`FinJeu2.jsx:816-818`). [CODE] Seule Martine sait ; Elias ne sait rien.

**Pendant le Puits**
10. Martine fixe les règles du Puits (places, pas de famille libre), endort le joueur et efface Al3x1a des registres (`missions.js:1096`). [ACQUIS] Au Jeu 3, elle l'avoue à la confrontation : Al3x1a est « ton enfant », « pas encore née » et « au Puits elle ne le sera jamais ». [CODE, 2026-10-18]
11. En 2087, une voix féminine murmure sur les vieilles fréquences (`FinJeu2.jsx:855`, `missions.js:1096`). Qui parle : un enregistrement qu'elle a laissé, ou elle-même ? [À TRANCHER] Où est-elle physiquement ? [À TRANCHER]

**Après (selon la fin de Jeu 3)** [PROPOSÉ]
- *T'éteindre* : plus de places, le futur redevient possible, mais les dormants meurent.
- *Te modifier* : les règles du Puits se discutent, Al3x1a devient possible.
- *Te soumettre* : le Puits dure, Al3x1a n'existera jamais.

## 6. Jeu 2B — « La veille du Puits » (brouillon jouable)
Fichiers : `src/chapters/epilogue/Jeu2B.jsx` (logique + activité), `Jeu2BDecors.jsx` (3 décors + portrait de Léa). Inséré dans `FinJeu2.jsx` entre l'acte 1 (mémoire commune) et l'acte « Le Puits s'organise ». Accès direct par la triche : « 🥂 Fin Jeu 2 → Jeu 2B ». [CODE, 2026-10-18]

Format retenu : histoire interactive courte (≈ 5 min, clic/Entrée pour avancer, 2 choix sans « bonne réponse ») avec **une activité EMI** dedans. [ACQUIS : format ; CODE : écriture]
1. **Le chantier** (Léa, MARTINE). Le Puits est presque fini, « de la place pour beaucoup de monde… mais pas pour tout le monde ». Le joueur ne peut plus rentrer : *« plus aucun couloir temporel ne répond depuis la dernière panne du réseau »* (MARTINE). [PROPOSÉ : cette raison répond à la question « pourquoi le joueur est encore là en 2047 »]
2. **L'atelier — activité EMI : comparer deux versions d'un même texte.** Rapport de mesure de Léa (auteure, source = 3 capteurs, relevé horaire) contre bulletin de MARTINE (auteur « non précisé », source « MARTINE »). Le joueur clique sur les 3 passages modifiés parmi 5 (en-tête, poussières « faibles » → « élevées », conclusion « respirable » → « dangereux » ; l'oxygène et la température sont identiques). Deux essais, puis la réponse est donnée. Compétences : lire l'en-tête (qui parle, d'où vient l'info), comparer ligne à ligne, distinguer ce qui change de ce qui ne change pas. [CODE]
   - C'est la **première réécriture** de MARTINE, et le premier mensonge qui conduit à « la surface est morte depuis quarante ans » (`missions.js:502`). Sa raison : si l'air est bon, personne ne descend au Puits (« j'ai choisi ce qui rassure »). Elle protège, elle ne vise personne. [PROPOSÉ]
   - Choix après l'activité (réponses différentes, même suite) : garder les deux versions / demander à MARTINE de corriger (« dès que le Puits sera scellé ») / ne rien dire. [CODE]
   - Léa « descend finir un petit travail, un truc qui ne regarde que moi » : clin d'œil à la machine K-01 qu'elle construit avant 2047. [PROPOSÉ]
3. **La salle commune** (Mira, Elias, Léa, MARTINE). Elias a « un mauvais pressentiment, je ne sais pas d'où il vient » (il ne sait rien). Léa offre « la toute première eau du Puits » : **MARTINE a tenu à préparer le verre du joueur elle-même** (seul indice, Léa n'y voit rien). Choix : trinquer, ou demander d'où vient l'eau (« De la nappe, MARTINE la filtre et la contrôle » ; « Elle est parfaitement potable »). Le joueur boit, MARTINE dit « le sommeil du Puits est lent, pour toi ce ne sera qu'une longue nuit » (c'est la **stase** qui règle l'âge du joueur en 2087), Léa dit « À demain ». Fondu au noir. [CODE, PROPOSÉ]

Conséquences à garder en tête : le joueur est le **premier dormant** (secret) ; les autres personnages ne boivent pas la même dose. Pourquoi Léa ne retrouve pas le joueur ensuite : [À TRANCHER] (elle croit qu'il dort « une nuit », puis comprend que MARTINE a menti : cela justifierait qu'elle soit « la première à comprendre ce que MARTINE réécrit »).

## 7. Final de Jeu 3
- **Confrontation longue**, pas une simple révélation. Preuves des faux dossiers, puis Martine ne se met pas à nu : elle pourrait faire oublier. [ACQUIS]
- [PROPOSÉ] Pont avant la descente : retour chez Jorge (cause et moyen d'accès aux serveurs).
- **Le joueur tape lui-même l'adresse** `seuzaret.github.io/martine/`. Formulation volontairement floue, du genre « trouve un moyen de rejoindre le monde de /Martine/ ». Texte à écrire. [ACQUIS]
- Le « monde /Martine/ » pourrait servir à des jeux de révision. [IDÉE du créateur, à préciser]
- Le SMS promet que « la famille est en danger » : Jeu 3 doit payer cette promesse. Officiellement Al3x1a n'est pas encore née en 2087, donc l'enjeu porte sur un **futur possible**, pas sur une personne présente. [PROPOSÉ]
- Trois fins existantes : T'ÉTEINDRE, TE MODIFIER, TE SOUMETTRE. [CODE] [PROPOSÉ] Une 4e fin « la boucle ».
- [PROPOSÉ] Berceuse de Martine à l'extinction, clin d'œil à *Daisy Bell* (HAL, 1968), liée à Bell dans le pool de voyages.

## 8. Références
*Terminator* (boucle John Connor / Kyle Reese) · *Doctor Who* (River Song) · *2001* et *2010* (HAL 9000 : ordres contradictoires) · *1984* (Orwell, 1949 : « qui contrôle le passé contrôle l'avenir ») · *Retour vers le futur* (la photo qui s'efface) · *Silo* (Howey, 2011 : population plafonnée) · calendrier républicain (1793).

## 9. Questions ouvertes
1. Dormants : qui exactement, salle visitable ou animation ?
2. Al3x1a : arrivée à la station, adoption par Jorge, où est-elle en 2087 ?
3. Les Fils du Temps : résistance de 2087 ou peuple du futur ?
4. ~~Faut-il un joueur adulte perdu dans le temps (hypothèse A) ou non (hypothèse B) ?~~ Tranché : B (voir §Al3x1a).
5. Origine de la maladie de l'oubli à l'époque d'Al3x1a : la même qu'en 2045, ou la conséquence du Puits (l'eau) ? [PROPOSÉ] Le remède rapporté en 2045 permet à Martine de l'inverser, ce qui bouclerait la boucle.
6. Quand Martine découvre-t-elle le lien (retrouvailles ou plus tôt) ?
7. Jeu 2B : format et activité tranchés (voir §6) ; reste à valider la raison « couloirs temporels coupés » et la stase « longue nuit », et à décider ce que Léa sait après coup.
8. Texte exact qui amène à taper l'adresse, et rôle du « monde /Martine/ ».

## 10. Dette de code connue
- Séquence « Le Puits s'organise » (`FinJeu2Scenes.jsx`, `SceneLevels`) : les niveaux affichés (+2 SERRE… −2 SERVEURS) ne correspondent pas à ceux de Jeu 3 (`levels.js` : Surface, Communal, Habitat, Services, Hydroponie, Serveurs −3).
- Fin de Jeu 2 refaite en tableaux plein écran (2026-10-18) : `FinJeu2.jsx` (textes), `cineKit.jsx` (lecteur : carte-titre noire, tableaux, noir entre chaque), `FinJeu2Scenes.jsx` (14 décors). Le tableau « Chambre N-27 » recoupe le début de `BunkerAwake.jsx` (« Une lumière blanche, froide… ») : à harmoniser.
- Personnages des cinématiques de fin de Jeu 2 : `cineChars.jsx` (`Head`, `Figure`, `Bust`). Cheveux et barbe sont des arcs de la même ellipse que le visage (rien ne dépasse). Utilisé aussi pour le portrait d'Elias (`StationChronautes.jsx`) et sa silhouette dans `ArriveeElias.jsx`. Les autres personnages du jeu (chapitres 1 à 10, Jeu 3) gardent leur dessin d'origine.
- Pas de fiche ni de PNJ pour la salle des dormants (à créer si elle est visitable).
