# Visualisation de données du Paléo Festival

## Contexte

Les données utilisées pour ce projet proviennent directement du site officiel du **Paléo Festival**. L'événement, incontournable en Suisse romande depuis sa création en 1976, met à disposition des informations sur chaque édition passée. Notre objectif est de réunir, structurer et visualiser ces données afin de raconter l'histoire du festival à travers une approche data-driven.

### Données collectées

Les données disponibles couvrent plusieurs aspects du festival :

- **Programmation** : Artistes ayant performé chaque année
- **Affluence** : Nombre de spectateurs·ice·s
- **Infrastructure** : Nombre de scènes, surface du terrain (en hectares)
- **Engagement bénévole** : Nombre de bénévoles
- **Concerts** : Nombre total de concerts par édition
- **Musique** : Evolution des genres musicaux représentés au fil des éditions
- **Design des affiches** : Evolution des couleurs et styles des affiches du festival


### Ressources

- [Rétrospective du Paléo](https://yeah.paleo.ch/fr/histoire)
- [Outil d'extraction des couleurs dominantes](https://lokeshdhakar.com/projects/color-thief/)

## Description

La première étape consiste à **réunir et structurer** toutes les données éparses sur le site du Paléo. Cette tâche implique :

- La récupération manuelle des informations disponibles
- L'extraction des **couleurs dominantes** des affiches par édition (en code hexadécimal)
- La collecte de données textuelles et numériques sur les artistes, genres musicaux et chiffres clés
- La structuration des données dans un fichier Json
- L'obtention du genre musical de chaque artiste à l'aide de l'IA
- La recherche de chanson à intégrer dans notre player dans la section featured track

La seconde étape consiste à **créer la structure de travail de notre projet** à l'aide de GitHub.En outre cette étape implique la création des différentes sections de notre site web et la distribution des tâches et des sections aux membres du groupe.

## Objectif

L'objectif principal est de **raconter l'évolution du Paléo Festival à travers ses données**. Le festival reflète non seulement des tendances artistiques mais aussi une transformation des goûts musicaux des contemporains.

Nos visualisations permettront d'illustrer :

- L'évolution des **genres musicaux** présents
- Les transformations de **l'identité visuelle** du festival via les affiches
- La fréquentation et l'envergure grandissante du festival

La présentation des données se fera de façon explicative : L’objectif n’est pas simplement de laisser l’utilisateur explorer librement l’ensemble des données, mais plutôt de mettre en évidence certains aspects clés de l’évolution du festival en guidant l'utilisateur à travers une narration visuelle structurée.

## Inspirations

Nous souhaitons nous inspirer des différentes manières de représenter des données musicales. Quelques pistes :

- **Stream Graphs** pour visualiser l'évolution des genres musicaux
- **Palette Color Extraction** pour dégager les couleurs dominantes des affiches
- **Timeline interactive** avec l'exposition chronologique de chaque édition

## Vision globale

Notre projet s'articulera autour de deux types de visualisations :

- **Ligne temporelle interactive** : Permettra de naviguer par année, avec affichage des affiches et des genres musicaux dominants
- **Vision globale récapitulative** : Synthèse des couleurs dominantes, des genres musicaux et des chiffres clés sur l'ensemble des éditions

## Nos wireframes

- [Notre prototype](https://www.figma.com/proto/KfhDY0c22NwpjEQN3f3alx/M52.2---VisualDon---Pal%C3%A9o---Wireframes?page-id=159%3A4&node-id=159-180&p=f&viewport=122%2C210%2C0.1&t=UYJFZwd688R7jW9Z-1&scaling=contain&content-scaling=fixed&starting-point-node-id=159%3A180)


## Références visuelles

Voici nos inspirations pour la représentation des données musicales.

- [Radial stacked bar chart](https://observablehq.com/@d3/radial-stacked-bar-chart/2)
- [Grouped bar chart](http://observablehq.com/@d3/grouped-bar-chart/2)
- [Streamgraph transition](https://observablehq.com/@d3/streamgraph-transitions)
- [Sankey](https://observablehq.com/@d3/sankey-component?collection=@d3/d3-sankey) 

## Notre présentation
- [Notre présentation](https://www.canva.com/design/DAGoAT6xl1c/owqz9dOzHQTocHXHjrIhOw/edit)

## Installer le projet
Après avoir cloné le projet vous pouvez effectuer la commande : 

```bash
npm install
```
Puis, pour lancer le serveur : 

```bash
npm run start
```
