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
  container.style.background = "transparent"; // Fond transparent pour le conteneur
  container.style.overflow = "visible";

  const svg = await chart();
  container.appendChild(svg);
}

// Fonction principale qui construit le graphique
async function chart() {
  const width = 3200;
  const height = 1600;
  const innerRadius = 300;
  const outerRadius = Math.min(width, height) / 2 - 150;

  // Préparation des données
  const data = prepareData(Object.values(rawData));
  const genres = getAllGenres(data);

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

  // Échelle circulaire (pour placer les années en cercle)
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, 2 * Math.PI])
    .align(0)
    .paddingInner(0.1); // Augmentation de l'espace entre les segments

  // Échelle radiale (pour déterminer la hauteur des arcs)
  const y = d3
    .scaleRadial()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
    .range([innerRadius, outerRadius]);

  // Définition des formes d'arc pour chaque segment du graphique
  const arc = d3
    .arc()
    .innerRadius((d) => y(d[0]))
    .outerRadius((d) => y(d[1]))
    .startAngle((d) => x(d.data[0]))
    .endAngle((d) => x(d.data[0]) + x.bandwidth())
    .padAngle(0.03)
    .padRadius(innerRadius);

  // Palette de couleurs associée à chaque genre
  const color = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.key))
    .range(d3.quantize((t) => d3.interpolateSpectral(1 - t), genres.length))
    .unknown("#ccc");

  // Création de l'élément SVG principal avec fond transparent
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, -height / 2, width, height])
    .attr(
      "style",
      "width: 100%; height: auto; font: 12px sans-serif; background: transparent;"
    );

  // Création d'un groupe principal pour tous les éléments avec un décalage
  const mainGroup = svg
    .append("g")
    .attr("transform", `translate(${width / 4}, 0)`);

  // Ajouter un cercle noir comme fond pour le graphique radial
  mainGroup
    .append("circle")
    .attr("r", outerRadius + 20)
    .attr("fill", "black")
    .attr("cx", 0)
    .attr("cy", 0);

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

  // Créer un groupe pour les éléments interactifs par année
  const yearInteractionGroup = mainGroup.append("g");

  // Ajout d'éléments invisibles mais cliquables pour chaque année
  yearInteractionGroup
    .selectAll("path.year-interaction")
    .data(x.domain())
    .join("path")
    .attr("class", "year-interaction")
    .attr("d", (year) => {
      // Créer un arc invisible qui couvre toute la hauteur pour chaque année
      const yearArc = d3
        .arc()
        .innerRadius(innerRadius - 10)
        .outerRadius(outerRadius + 10)
        .startAngle(x(year))
        .endAngle(x(year) + x.bandwidth());

      return yearArc();
    })
    .attr("fill", "transparent")
    .attr("cursor", "pointer")
    .on("click", function (event, year) {
      updateLegend(year, data, color, mainGroup, outerRadius, height);
    });

  // Ajout d'un cercle blanc au centre
  mainGroup
    .append("circle")
    .attr("r", innerRadius)
    .attr("fill", "white")
    .attr("cx", 0)
    .attr("cy", 0);

  // Ajout d'un petit point noir au centre du cercle blanc
  mainGroup
    .append("circle")
    .attr("r", 18)
    .attr("fill", "black")
    .attr("cx", 0)
    .attr("cy", 0);

  // Ajout des lignes et textes pour chaque année (à l'extérieur du cercle)
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
        }) translate(${outerRadius + 30},0)` // Déplacé vers l'extérieur
    )
    .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#fff")) // Ligne blanche
    .call((g) =>
      g
        .append("text")
        .attr("transform", (d) =>
          (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
            ? "rotate(90)translate(0,16)"
            : "rotate(-90)translate(0,-9)"
        )
        .attr("fill", "#fff") // Texte blanc pour les années
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
        .attr("fill", "#fff") // Texte blanc
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
            .attr("stroke", "#fff") // Cercles blancs
            .attr("stroke-opacity", 0.5)
            .attr("r", y)
        )
        .call((g) =>
          g
            .append("text")
            .attr("y", (d) => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#000") // Contour noir
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"))
            .clone(true)
            .attr("fill", "#fff") // Texte blanc
            .attr("stroke", "none")
        )
    );

  // Créer un groupe pour la légende (qui sera mis à jour lors des clics)
  const legendContainer = mainGroup
    .append("g")
    .attr("class", "legend-container");

  // Afficher la légende par défaut avec l'année la plus récente
  const mostRecentYear = data[data.length - 1].year;
  updateLegend(mostRecentYear, data, color, mainGroup, outerRadius, height);

  return svg.node();
}

// Fonction pour mettre à jour la légende avec les données d'une année spécifique
function updateLegend(
  selectedYear,
  data,
  color,
  mainGroup,
  outerRadius,
  height
) {
  // Supprimer l'ancienne légende si elle existe
  mainGroup.select(".legend-container").selectAll("*").remove();

  // Créer un nouveau conteneur pour la légende
  const legendContainer = mainGroup.select(".legend-container");

  // Trouver les données de l'année sélectionnée
  const yearData = data.find((d) => d.year === selectedYear);
  if (!yearData) return; // Si l'année n'est pas trouvée, ne rien faire

  // Calcul du total des artistes pour cette année
  let totalArtists = 0;
  yearData.genre.forEach((count) => {
    totalArtists += count;
  });

  // Créez un tableau d'objets avec les genres et leurs pourcentages
  const genrePercentages = Array.from(yearData.genre.entries())
    .map(([genre, count]) => {
      return {
        genre,
        percentage: Math.round((count / totalArtists) * 100),
      };
    })
    .sort((a, b) => b.percentage - a.percentage); // Tri par pourcentage décroissant

  // Ajout du titre de l'année avec une animation
  legendContainer
    .append("text")
    .attr("transform", `translate(${outerRadius + 100}, -${height / 3})`)
    .attr("font-size", "36px")
    .attr("font-weight", "bold")
    .attr("fill", "#000") // Couleur noire pour le texte de la légende
    .text(selectedYear);

  // Ajout du titre de la légende
  legendContainer
    .append("text")
    .attr("transform", `translate(${outerRadius + 100}, -${height / 3 - 60})`)
    .attr("font-size", "24px")
    .attr("fill", "#000") // Couleur noire pour le texte de la légende
    .text("Les différents genres pendant les");

  legendContainer
    .append("text")
    .attr("transform", `translate(${outerRadius + 100}, -${height / 3 - 90})`)
    .attr("font-size", "24px")
    .attr("fill", "#000") // Couleur noire pour le texte de la légende
    .text("éditions Paléo festival");

  // Groupe pour les pourcentages et genres
  const legendGroup = legendContainer
    .append("g")
    .attr("transform", `translate(${outerRadius + 100}, -${height / 3 - 150})`);

  // Animation pour faire apparaître progressivement les éléments de la légende
  genrePercentages.forEach((item, i) => {
    const yPos = i * 40;

    // Pourcentage
    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", yPos)
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", d3.color(color(item.genre)).darker(0.5))
      .attr("opacity", 0) // Commencer invisible
      .text(`${item.percentage} %`)
      .transition()
      .duration(300)
      .delay(i * 50) // Décaler l'animation pour chaque élément
      .attr("opacity", 1); // Devenir visible progressivement

    // Genre
    legendGroup
      .append("text")
      .attr("x", 100)
      .attr("y", yPos)
      .attr("font-size", "18px")
      .attr("fill", "#000") // Couleur noire pour le texte du genre
      .attr("opacity", 0) // Commencer invisible
      .text(item.genre)
      .transition()
      .duration(300)
      .delay(i * 50 + 100) // Décaler davantage pour apparaître après le pourcentage
      .attr("opacity", 1); // Devenir visible progressivement
  });
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
