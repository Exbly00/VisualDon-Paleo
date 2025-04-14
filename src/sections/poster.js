import data from "../data/editions.json";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Variables globales pour l'intervalle et les indices des posters
let interval = null;
let previousPosterIndex = 1976;
let nextPosterIndex = 1977;

function displayPoster() {
  const previousPoster = document.querySelector("#previous-poster img");
  const nextPoster = document.querySelector("#next-poster img");
  const previousPosterLabel = document.querySelector("#previous-poster h3");
  const nextPosterLabel = document.querySelector("#next-poster h3");

  // Mise à jour des posters
  previousPoster.setAttribute(
    "src",
    `../assets/posters/${previousPosterIndex}.jpg`
  );
  previousPosterLabel.innerText = previousPosterIndex;
  nextPoster.setAttribute("src", `../assets/posters/${nextPosterIndex}.jpg`);
  nextPosterLabel.innerText = nextPosterIndex;

  // Incrémentation des indices
  previousPosterIndex++;
  nextPosterIndex++;

  // Sauter 2020 et 2021
  if (previousPosterIndex === 2020) previousPosterIndex = 2022;
  if (nextPosterIndex === 2020) nextPosterIndex = 2022;

  // Arrêter après 2025
  if (nextPosterIndex > 2025) {
    stopCarousel();
  }
}

// Démarrer le carousel
function startCarousel() {
  if (!interval) {
    // Pour éviter plusieurs intervalles en parallèle
    interval = setInterval(displayPoster, 3000); // Intervalle de 3000 ms
  }
}

// Arrêter le carousel
function stopCarousel() {
  clearInterval(interval);
  interval = null;
}

// Fonction de contrôle Play/Pause
function togglePlayPause() {
  const playButton = document.querySelector("#play-button");

  if (interval) {
    stopCarousel();
    playButton.textContent = "Play"; // Met à jour le texte du bouton
  } else {
    startCarousel();
    playButton.textContent = "Pause"; // Met à jour le texte du bouton
  }
}

// Ajouter un événement sur le bouton Play/Pause
document
  .querySelector("#play-button")
  .addEventListener("click", togglePlayPause);

// Initialiser le carousel au départ (si tu veux qu'il démarre automatiquement à l'ouverture)
startCarousel();

export { displayPoster };
