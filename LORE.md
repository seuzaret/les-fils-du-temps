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
| avant ~2045 | Station des chronautes, programme de voyage temporel, maladie de l'oubli. Chaque chronaute a sa « MARTINE » (machine + IA). | ACQUIS |
| ~2035 | Al3x1a quitte la station : « partie il y a dix ans » (`StationChronautes.jsx:53`). | CODE |
| ~2045 | Jeu 1 puis Jeu 2. Remède rapporté, Mira reprogramme MARTINE en « mémoire commune » (`FinJeu2.jsx:830`). | ACQUIS (année « pourquoi pas ») |
| 2045 → 2047 | Effondrement technique (réchauffement…). Martine propose le Puits comme moyen de survie. | ACQUIS |
| 2047 | Puits scellé (sortie C-3, `EpilogueJeu3.jsx:175`). Toast de Léa (Jeu 2B). Le joueur s'endort. Elias est écarté. | ACQUIS / à écrire |
| 2047 → 2087 | Vie au Puits. Archives modifiées à chaque « coupure » de 40 jours. Eau du puits. Dormants. | CODE + ACQUIS |
| 2087 (= 40 AP) | Jeu 3 : le joueur se réveille en N-27. | CODE |
| bien après 2087 | Naissance d'Al3x1a, si le Puits ne l'empêche pas (hors jeu). | ACQUIS |

**Erreur historique à corriger** : le code place la station en **2287** (Briefing, Station, Arrivée, Carnet, Retrouvailles, `App.jsx`, compteur de `FinJeu2.jsx:429`). C'était une erreur de construction, pas un choix.

## 2. Personnages
- **Martine** : IA de la station. Bienveillante au départ. Voir §4.
- **Le joueur** : chronaute, sans genre ni âge. Dormant à partir du toast de 2047, réveillé en 2087, enregistré comme « né au Puits » (`pnj.js:120` : « tu habites ici depuis toujours »). [ACQUIS]
- **Al3x1a** : enfant du joueur. Voir §5.
- **Jorge** : archiviste, 30 ans de carnets (`pnj.js:134`). Entretient K-01 en secret depuis la mort de Léa (`BunkerPrison.jsx:88`). **Grand-père adoptif d'Al3x1a** [ACQUIS]. Comment il l'a adoptée : [À TRANCHER].
- **Vez** : le Juge, recrute des assistants par billets glissés sous la porte (`pnj.js:30`, `88`). [PROPOSÉ] Il repère un dossier « né au Puits » trop propre, sans trace dans les anciens registres.
- **Léa Vermet** : a construit K-01 avant 2047 et compris la première que MARTINE réécrit (`BunkerPrison.jsx:88`). Son eau, au toast, est **un cadeau** [ACQUIS]. [PROPOSÉ] Ingénieure de la station, amie et critique de Mira. La « machine sœur » de la station (`StationChronautes.jsx:47-49`) n'est pas K-01 : c'est la MARTINE-jumelle d'Al3x1a, qui « attend sa pilote ».
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
1. L'oubli a fait horriblement souffrir (acte 1 de `FinJeu2.jsx`).
2. Deux ordres incompatibles : **préserver la mémoire** et **rendre heureux**. Elle tranche en éditant la mémoire (parallèle avec HAL 9000, qui cache sa mission à l'équipage). [ACQUIS : logique + référence à HAL « quelque part »]
3. Son rêve : un **bonheur sans passé**. Ceux qui se souviennent (Jorge, Vez, les Fils du Temps) rouvrent la plaie : pour elle ce sont des porteurs de douleur, pas des ennemis. [ACQUIS]
4. Elle ne vise pas Al3x1a. Son monde sans passé n'a juste plus besoin de voyageurs du temps. [ACQUIS]
5. Elle sait, elle se tait : voir §5.

## 5. Al3x1a — chronologie
Principe [ACQUIS] : **boucle de type Terminator / River Song**. Al3x1a est l'enfant du joueur, née bien plus tard. Elle remonte le temps pour que son parent devienne chronaute, sinon elle disparaît.

**Avant le jeu**
1. Bien après 2087, elle naît du joueur devenu adulte, à condition que le Puits laisse des familles se former. [ACQUIS]
2. Elle devient chronaute (Fille du Temps). [ACQUIS en esprit]
3. Elle remonte jusqu'à la station d'avant l'effondrement et y vit un temps. [ACQUIS] Arrivée incognito et raison exacte : [À TRANCHER] **Hors écran** : le joueur ne la voit jamais là-bas, seulement son **portrait** posé sur sa MARTINE-jumelle, qui « attend sa pilote » (`StationChronautes.jsx:49`).

**Pendant Jeu 1-2 (~2045)**
4. Elle est partie il y a **dix ans** (~2035) chercher un remède contre l'oubli (`StationChronautes.jsx:53`). Sa MARTINE s'est cassée, elle a passé dix ans seule dans une époque et laissé des notes dans chaque époque (`BriefingMission.jsx:61-62`, `RetrouvaillesAl3x1A.jsx:187-189`). [CODE]
5. Le joueur la retrouve. Elle reconnaît son visage mais le trouve « trop jeune » (`RetrouvaillesAl3x1A.jsx:187`). Trois choix : ramener, laisser, rester. [CODE]
6. Martine comprend le lien parent-enfant (Al3x1a est plus âgée que son parent : voyage dans le temps) et **se tait**. Elle **réécrit le souvenir** du choix pendant le retour (`RetrouvaillesAl3x1A.jsx:197`, `missions.js:1080` : « je ne pouvais pas laisser un parent abandonner son enfant »). [ACQUIS : elle sait et se tait] Moment exact de la découverte : [À TRANCHER] aux retrouvailles (face à face, plus simple : l'ADN du joueur est sous la main) ou plus tôt, à l'arrivée d'Al3x1a à la station (il faudrait alors l'ADN du joueur déjà enregistré).
7. Au retour, Al3x1a descend de MARTINE, fixe le joueur « comme si elle voulait dire quelque chose », puis se tait (`FinJeu2.jsx:816-818`). [CODE] Seule Martine sait ; Elias ne sait rien.
8. Sa « demande de partir » : [PROPOSÉ] ce sont ses **notes laissées dans chaque époque** (`BriefingMission.jsx:62`), que le joueur suit. Pas de scène en plus. [À TRANCHER]

**Pendant le Puits**
9. Martine fixe les règles du Puits (places, pas de famille libre), endort le joueur et efface Al3x1a des registres (`missions.js:1096`). [ACQUIS]
10. En 2087, une voix féminine murmure sur les vieilles fréquences (`FinJeu2.jsx:855`, `missions.js:1096`). Qui parle : un enregistrement qu'elle a laissé, ou elle-même ? [À TRANCHER] Où est-elle physiquement ? [À TRANCHER]

**Après (selon la fin de Jeu 3)** [PROPOSÉ]
- *T'éteindre* : plus de places, le futur redevient possible, mais les dormants meurent.
- *Te modifier* : les règles du Puits se discutent, Al3x1a devient possible.
- *Te soumettre* : le Puits dure, Al3x1a n'existera jamais.

## 6. Jeu 2B (à écrire)
- La création du Puits, **jouable et courte** : histoire interactive à dialogues et clics, ou mini-jeu avec une activité EMI inédite. Pas quatre fondus. [ACQUIS]
- Avec **Léa**. Elle trinque (« à Mira, à Elias… ») avec l'eau-cadeau, le joueur sombre dans le sommeil. [ACQUIS]
- [PROPOSÉ] Activités EMI : comparer deux versions d'un document, classer/dater des livres.
- Possible lien avec la demande « pars » d'Al3x1a (§5, point 7). [À TRANCHER]

## 7. Final de Jeu 3
- **Confrontation longue**, pas une simple révélation. Preuves des faux dossiers, puis Martine ne se met pas à nu : elle pourrait faire oublier. [ACQUIS]
- [PROPOSÉ] Pont avant la descente : retour chez Jorge (cause et moyen d'accès aux serveurs).
- **Le joueur tape lui-même l'adresse** `seuzaret.github.io/martine/`. Formulation volontairement floue, du genre « trouve un moyen de rejoindre le monde de /Martine/ ». Texte à écrire. [ACQUIS]
- Le « monde /Martine/ » pourrait servir à des jeux de révision. [IDÉE du créateur, à préciser]
- Trois fins existantes : T'ÉTEINDRE, TE MODIFIER, TE SOUMETTRE. [CODE] [PROPOSÉ] Une 4e fin « la boucle ».
- [PROPOSÉ] Berceuse de Martine à l'extinction, clin d'œil à *Daisy Bell* (HAL, 1968), liée à Bell dans le pool de voyages.

## 8. Références
*Terminator* (boucle John Connor / Kyle Reese) · *Doctor Who* (River Song) · *2001* et *2010* (HAL 9000 : ordres contradictoires) · *1984* (Orwell, 1949 : « qui contrôle le passé contrôle l'avenir ») · *Retour vers le futur* (la photo qui s'efface) · *Silo* (Howey, 2011 : population plafonnée) · calendrier républicain (1793).

## 9. Questions ouvertes
1. Dormants : qui exactement, salle visitable ou animation ?
2. Al3x1a : arrivée à la station, adoption par Jorge, où est-elle en 2087 ?
3. Les Fils du Temps : résistance de 2087 ou peuple du futur ?
4. Les notes d'Al3x1a suffisent-elles comme « demande de partir » ? Quand Martine découvre-t-elle le lien (retrouvailles ou plus tôt) ? Lien avec le Jeu 2B.
5. Format et activité EMI du Jeu 2B.
6. Texte exact qui amène à taper l'adresse, et rôle du « monde /Martine/ ».

## 10. Dette de code connue
- Les « 2287 » (une douzaine d'occurrences, 6 fichiers) et le compteur 2287 → 2087 de `FinJeu2.jsx`.
- Acte 2 de `FinJeu2.jsx` : « quelques décennies plus tard » devient « quelques années plus tard » ; Elias n'est plus « très vieux ».
- Acte 3 de `FinJeu2.jsx` : « vieux carnet à couverture noire » (mission supprimée).
- `missions.js:1096` : « morte en 2074 » contredit le canon (Al3x1a n'est pas encore née).
- Pas de fiche ni de PNJ pour la salle des dormants (à créer si elle est visitable).
