import * as d3 from "d3";
import rawData from "../data/editions.json";

// Fonction appelée par le router pour afficher les genres
export async function displayGenres() {
  const container = document.querySelector("#genres .viz"); // Sélectionne l'élément où afficher le graphique
  container.innerHTML = ""; // Efface tout contenu précédent dans le conteneur

  const svg = await chart(); // Appelle la fonction chart() pour générer le graphique
  container.appendChild(svg); // Ajoute le graphique généré dans le conteneur
}

// Fonction principale qui génère le graphique
async function chart() {
  const width = 928; // Largeur du graphique
  const height = width; // Hauteur du graphique (carré)
  const innerRadius = 180; // Rayon interne de la forme
  const outerRadius = Math.min(width, height) / 2; // Rayon externe de la forme

  const data = prepareData(Object.values(rawData)); // Prépare les données à partir du fichier JSON
  const genres = getAllGenres(data); // Récupère la liste des genres disponibles dans les données

  // Crée les séries de données empilées pour chaque genre
  const series = d3
    .stack()
    .keys(genres) // Chaque genre devient une "clé" dans la pile
    .value(([year, genreData], genre) => genreData.get(genre) || 0)(
    // Valeur par défaut à 0 si genre non trouvé
    d3.index(
      data,
      (d) => d.year, // Utilise l'année comme clé principale
      (d) => d.genre // Utilise le genre comme clé secondaire
    )
  );

  // Échelle pour les angles (de 0 à 2π) en fonction de l'année
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year)) // Définir l'échelle pour les années
    .range([0, 2 * Math.PI]) // L'intervalle de 0 à 2π pour un graphique circulaire
    .align(0);

  // Échelle radiale pour la hauteur en fonction du nombre d'artistes
  const y = d3
    .scaleRadial()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))]) // Définir les limites du rayon
    .range([innerRadius, outerRadius]); // Plage de l'échelle entre le rayon intérieur et extérieur

  // Palette de couleurs pour chaque genre
  const color = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.key)) // Associe chaque genre à une couleur
    .range(d3.quantize((t) => d3.interpolateSpectral(1 - t), genres.length)) // Crée une palette de couleurs
    .unknown("#ccc"); // Si le genre est inconnu, utiliser une couleur grise

  // Fonction pour dessiner les arcs du graphique
  const arc = d3
    .arc()
    .innerRadius((d) => y(d[0])) // Rayon interne pour chaque segment
    .outerRadius((d) => y(d[1])) // Rayon externe pour chaque segment
    .startAngle((d) => x(d.data[0])) // Angle de début de chaque segment
    .endAngle((d) => x(d.data[0]) + x.bandwidth()) // Angle de fin de chaque segment
    .padAngle(1.5 / innerRadius) // Espacement entre les segments
    .padRadius(innerRadius); // Rayon du "padding"

  // Création de l'élément SVG pour afficher le graphique
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]) // Centrer l'élément dans l'SVG
    .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

  // Ajout des arcs empilés pour chaque genre
  svg
    .append("g")
    .selectAll()
    .data(series) // Données des séries empilées
    .join("g")
    .attr("fill", (d) => color(d.key)) // Applique la couleur de chaque genre
    .selectAll("path")
    .data((D) => D.map((d) => ((d.key = D.key), d))) // Associe chaque donnée à sa série
    .join("path")
    .attr("d", arc) // Dessine chaque arc
    .append("title") // Ajoute des infobulles au survol
    .text(
      (d) => `${d.data[0]} - ${d.key}\n${formatValue(getCount(d))} artistes`
    );

  // Ajout des lignes pour chaque année
  svg
    .append("g")
    .attr("text-anchor", "middle")
    .selectAll()
    .data(x.domain()) // Années
    .join("g")
    .attr(
      "transform",
      (d) =>
        `rotate(${
          ((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90
        }) translate(${innerRadius},0)` // Rotation pour positionner les labels des années
    )
    .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#000")) // Lignes pour chaque année
    .call(
      (g) =>
        g
          .append("text")
          .attr("transform", (d) =>
            (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
              ? "rotate(90)translate(0,16)"
              : "rotate(-90)translate(0,-9)"
          )
          .text((d) => d) // Affiche l'année
    );

  // Ajout du texte indiquant le nombre d'artistes
  svg
    .append("g")
    .attr("text-anchor", "middle")
    .call(
      (g) =>
        g
          .append("text")
          .attr("y", (d) => -y(y.ticks(5).pop())) // Positionne le texte au-dessus du graphique
          .attr("dy", "-1em")
          .text("Nombre d'artistes") // Texte de légende
    )
    .call((g) =>
      g
        .selectAll("g")
        .data(y.ticks(5).slice(1)) // Crée des cercles à intervalles réguliers pour les ticks
        .join("g")
        .attr("fill", "none")
        .call(
          (g) =>
            g
              .append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.5)
              .attr("r", y) // Trace les cercles
        )
        .call((g) =>
          g
            .append("text")
            .attr("y", (d) => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s")) // Affiche les valeurs des ticks
            .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")
        )
    );

  // Ajout de la légende pour les genres
  svg
    .append("g")
    .selectAll()
    .data(color.domain())
    .join("g")
    .attr(
      "transform",
      (d, i, nodes) => `translate(-40,${(nodes.length / 2 - i - 1) * 20})`
    )
    .call(
      (g) =>
        g
          .append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", color) // Rectangle coloré pour chaque genre
    )
    .call(
      (g) =>
        g
          .append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text((d) => d) // Affiche le nom du genre
    );

  return svg.node(); // Retourne l'élément SVG créé
}

// Fonctions utilitaires

// Prépare les données en groupant par année et genre
function prepareData(festivalData) {
  const grouped = d3.group(
    festivalData.flatMap((yearData) => {
      return (yearData.artists || []).map((artist) => ({
        year: yearData.year,
        genre: artist.genre,
      }));
    }),
    (d) => d.year // Groupement par année
  );

  return Array.from(grouped, ([year, records]) => {
    const genreMap = d3.rollup(
      records,
      (v) => v.length, // Compte le nombre d'artistes par genre
      (d) => d.genre // Clé par genre
    );
    return { year, genre: genreMap };
  });
}

// Récupère la liste de tous les genres
function getAllGenres(data) {
  const all = [];
  data.forEach((d) => {
    for (let genre of d.genre.keys()) {
      if (genre && !all.includes(genre)) all.push(genre); // Ajoute les genres uniques
    }
  });
  return all;
}

// Récupère le nombre d'artistes pour une série donnée
function getCount(d) {
  return d.data[1].get(d.key) || 0;
}

// Formate les valeurs numériques avec une séparation de milliers
function formatValue(x) {
  return isNaN(x) ? "N/A" : x.toLocaleString("fr-FR"); // Formate les nombres en style français
}
