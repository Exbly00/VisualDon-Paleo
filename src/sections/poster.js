import data from "../data/editions.json";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const body = document.querySelector("body");
const previousPoster = document.querySelector("#previous-poster");
const posters = document.querySelector("#posters");
const squares = document.querySelector("#squares");
const year = document.querySelector("#posters h2");
const link = document.querySelector("#posters a");
const author = document.querySelector("#posters p");
const button = document.querySelector("#posters button");
previousPoster.style.setProperty("width", "350px");

let progress;
let Xaxis;
let interval = null;

function displayPoster() {
  // Si une animation est en cours, on la stoppe pour reset
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  // Reset des variables
  progress = data.length - 1;
  Xaxis = 300;
  squares.innerHTML = "";
  body.style.setProperty("background-color", "white");

  // Affiche la première image et carré tout de suite (pas d'attente)
  updateFrame();

  // Puis on relance l’animation en intervalle
  interval = setInterval(() => {
    updateFrame();
  }, 2000);
}

function updateFrame() {
  if (progress < 0) {
    progress = data.length - 1;
    Xaxis = 300;
    squares.innerHTML = "";
  }

  // Créer le petit carré
  d3.select(squares)
    .append("svg")
    .attr("width", 40)
    .attr("height", 60)
    .style("left", `${Xaxis}px`)
    .style("bottom", `200px`)
    .append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", data[progress].details.dominantColor)
    .append("title")
    .text(`Édition ${data[progress].year}`)
    .append("href")
    .text(`#editions-${data[progress].year}`);
    ;

  // Met à jour les posters
  previousPoster.src = `../assets/posters/${data[progress].year}.jpg`;
  link.href = `#editions-${data[progress].year}`;
  author.innerText = `Dessinée par ${data[progress].details.posterDesigner}`;
  posters.style.setProperty("background-color", `${data[progress].details.dominantColor}`);
  year.innerText = data[progress].year;

  // Prépare l'itération suivante
  progress--;
  Xaxis += 10;
}

// Gestion du bouton play/pause
button.addEventListener("click", () => {

  if (interval) {
    clearInterval(interval);
    interval = null;
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
  } else {
    interval = setInterval(() => {
      updateFrame();
    }, 2000);
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>`;
  }

});;


export { displayPoster };
