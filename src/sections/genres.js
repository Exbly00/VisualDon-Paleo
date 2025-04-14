import * as d3 from "d3";
import rawData from "../data/editions.json";

// Fonction appelée par le routeur pour afficher la visualisation des genres
export async function displayGenres() {
  const container = document.querySelector("#genres .viz");
  container.innerHTML = "";

  // Ajout du style pour aligner la visualisation à gauche
  container.style.textAlign = "left";
  container.style.display = "flex";
  container.style.justifyContent = "flex-start";

  const svg = await chart();
  container.appendChild(svg);
}

// Fonction principale qui construit le graphique
async function chart() {
  const width = 3000;
  const height = 1400;
  const innerRadius = 250;
  const outerRadius = Math.min(width, height) / 2;

  // Préparation des données
  const data = prepareData(Object.values(rawData));
  const genres = getAllGenres(data);

  console.log(data);
  console.log(genres);

  // Création des séries empilées (stacked data) pour chaque genre
  const genreCountsByYear = d3.rollup(
    data.flatMap((d) =>
      Array.from(d.genre, ([genre, count]) => ({ year: d.year, genre, count }))
    ),
    (v) => v[0].count,
    (d) => d.year,
    (d) => d.genre
  );

  const series = d3
    .stack()
    .keys(genres)
    .value(([, genreMap], genre) => genreMap.get(genre) || 0)(
    genreCountsByYear
  );

  // Définition des formes d'arc pour chaque segment du graphique
  const arc = d3
    .arc()
    .innerRadius((d) => y(d[0]))
    .outerRadius((d) => y(d[1]))
    .startAngle((d) => x(d.data[0]))
    .endAngle((d) => x(d.data[0]) + x.bandwidth())
    .padAngle(2 / innerRadius)
    .padRadius(innerRadius);

  // Échelle circulaire (pour placer les années en cercle)
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, 2 * Math.PI])
    .align(0);

  // Échelle radiale (pour déterminer la hauteur des arcs)
  const y = d3
    .scaleRadial()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
    .range([innerRadius, outerRadius]);

  // Palette de couleurs associée à chaque genre
  const color = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.key))
    .range(d3.quantize((t) => d3.interpolateSpectral(1 - t), genres.length))
    .unknown("#ccc");

  // Création de l'élément SVG principal
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, -height / 2, width, height]) // Modifié pour aligner à gauche
    .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

  // Création d'un groupe principal pour tous les éléments avec un décalage
  const mainGroup = svg
    .append("g")
    .attr("transform", `translate(${width / 4}, 0)`); // Décalage pour centrer visuellement le cercle

  // Ajout des arcs empilés (un arc = un genre pour une année)
  mainGroup
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("path")
    .data((D) => D.map((d) => ((d.key = D.key), d)))
    .join("path")
    .attr("d", arc)
    .append("title")
    .text(
      (d) => `${d.data[0]} - ${d.key}\n${formatValue(getCount(d))} artistes`
    );

  // Ajout des lignes et textes pour chaque année
  mainGroup
    .append("g")
    .attr("text-anchor", "middle")
    .selectAll("g")
    .data(x.domain())
    .join("g")
    .attr(
      "transform",
      (d) =>
        `rotate(${
          ((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90
        }) translate(${innerRadius},0)`
    )
    .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#000"))
    .call((g) =>
      g
        .append("text")
        .attr("transform", (d) =>
          (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
            ? "rotate(90)translate(0,16)"
            : "rotate(-90)translate(0,-9)"
        )
        .text((d) => d)
    );

  // Ajout des cercles et texte pour les niveaux de nombre d'artistes
  mainGroup
    .append("g")
    .attr("text-anchor", "middle")
    .call((g) =>
      g
        .append("text")
        .attr("y", (d) => -y(y.ticks(5).pop()))
        .attr("dy", "-1em")
        .text("Nombre d'artistes")
    )
    .call((g) =>
      g
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .join("g")
        .attr("fill", "none")
        .call((g) =>
          g
            .append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("r", y)
        )
        .call((g) =>
          g
            .append("text")
            .attr("y", (d) => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"))
            .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")
        )
    );

  // Légende : associer une couleur à chaque genre
  mainGroup
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .join("g")
    .attr(
      "transform",
      (d, i, nodes) => `translate(-40,${(nodes.length / 2 - i - 1) * 20})`
    )
    .call((g) =>
      g.append("rect").attr("width", 18).attr("height", 18).attr("fill", color)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text((d) => d)
    );

  return svg.node();
}

// ----------------------------------------
// Fonctions utilitaires
// ----------------------------------------

// Regroupe les artistes par année et par genre
function prepareData(festivalData) {
  const grouped = d3.group(
    festivalData.flatMap((yearData) =>
      (yearData.artists || []).map((artist) => ({
        year: yearData.year,
        genre: artist.genre,
      }))
    ),
    (d) => d.year
  );

  return Array.from(grouped, ([year, records]) => {
    const genreMap = d3.rollup(
      records,
      (v) => v.length,
      (d) => d.genre
    );
    return { year, genre: genreMap };
  });
}

// Extrait la liste des genres uniques
function getAllGenres(data) {
  const all = [];
  data.forEach((d) => {
    for (let genre of d.genre.keys()) {
      if (genre && !all.includes(genre)) all.push(genre);
    }
  });
  return all;
}

// Récupère le nombre d'artistes pour une tranche donnée
function getCount(d) {
  return d.data[1].get(d.key) || 0;
}

// Formate les valeurs numériques (ex : "1 000" en français)
function formatValue(x) {
  return isNaN(x) ? "N/A" : x.toLocaleString("fr-FR");
}
