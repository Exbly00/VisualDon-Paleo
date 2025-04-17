import data from "../data/editions.json";

const previousButton = document.querySelector(".previous-button");
const nextButton = document.querySelector(".next-button");
const posterImage = document.querySelector("#poster-program img");
const descriptionElement = document.querySelector("#description p");
const scenesElement = document.querySelector(".data-scenes");
const concertsElement = document.querySelector(".data-concerts");
const visitorsElement = document.querySelector(".data-visitors");
const volunteersElement = document.querySelector(".data-volunteers");
const genresElement = document.querySelector(".data-genres");
const headlinersElement = document.querySelector(".data-headliners");
const rangeInput = document.querySelector("#edition-range");
const editionYearTitle = document.querySelector("#edition-year");
const popupContent = document.querySelector(`.popup-content p`);
const body = document.querySelector("body");

// Liste des éditions disponibles (de 1976 à 2025, excluant 2020 et 2021)
const availableYears = Array.from({ length: 50 }, (_, i) => 1976 + i).filter(
  (year) => year !== 2020 && year !== 2021
);

let currentEditionIndex = 0;

// Fonction pour afficher une édition
function displayEdition(index) {
  const editionYear = availableYears[index];
  const edition = data.find((ed) => ed.year === editionYear);

  if (!edition) {
    console.error(`Aucune donnée pour l'année ${editionYear}`);
    return;
  }

  if (!edition.details) {
    console.error(`Détails manquants pour l'édition ${editionYear}`);
    return;
  }

  if (edition && edition.details) {
    editionYearTitle.innerText = editionYear;
    // Poster image
    posterImage.src = `../assets/posters/${editionYear}.jpg` || "";
    posterImage.alt = `Affiche de l'édition ${editionYear}`;

    // Data
    scenesElement.textContent = edition.details.scenes || "N/A";
    concertsElement.textContent = edition.details.concerts || "N/A";
    visitorsElement.textContent = edition.details.visitors || "N/A";
    volunteersElement.textContent = edition.details.volunteers || "N/A";
    descriptionElement.textContent = "Ceci est un point notable.";
    // Genres uniques
    if (edition.artists && edition.artists.length > 0) {
      const uniqueGenres = [
        ...new Set(edition.artists.map((artist) => artist.genre)),
      ];
      genresElement.textContent = uniqueGenres.join(", ");
    } else {
      genresElement.textContent = "N/A";
    }

    const artists = edition.artists.map((artist) => artist.name).join(", ");
    popupContent.innerText = artists;

    // Headliners
    headlinersElement.textContent = edition.artists
      ? edition.artists
          .slice(0, 5)
          .map((artist) => artist.name)
          .join(", ")
      : "N/A";
  } else {
    console.error("Données manquantes pour l'édition", edition);
  }

  body.style.setProperty("background-color", hexToRgba(edition.details.dominantColor) || "#444");

 
}

function hexToRgba(hex, alpha = 0.3) {
  // Retire le # si présent
  hex = hex.replace(/^#/, "");

  // Si format court (#abc), on l'étend en #aabbcc
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Fonction pour mettre à jour les boutons de navigation
function updateButtons() {
  previousButton.disabled = currentEditionIndex === 0;
  nextButton.disabled = currentEditionIndex === availableYears.length - 1;
}

// Mettre à jour la valeur du range
function updateRange() {
  rangeInput.value = currentEditionIndex + 1; // Plage 1-48
}

previousButton.addEventListener("click", () => {
  if (currentEditionIndex > 0) {
    currentEditionIndex--;
    displayEdition(currentEditionIndex);
    updateButtons();
    updateRange();
  }
});

nextButton.addEventListener("click", () => {
  if (currentEditionIndex < availableYears.length - 1) {
    currentEditionIndex++;
    displayEdition(currentEditionIndex);
    updateButtons();
    updateRange();
  }
});

// Gestion du changement dans le range
rangeInput.addEventListener("input", (event) => {
  currentEditionIndex = event.target.value - 1; // Conversion de 1-48 à 0-47
  displayEdition(currentEditionIndex);
  updateButtons();
});

// Initialiser la première édition
displayEdition(currentEditionIndex);
updateButtons();
updateRange();



export function initPopup() {
  const popup = document.getElementById("popup");
  const openBtn = document.querySelector(".programmation-button");
  const closeBtn = popup.querySelector(".close-button");

  openBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Optionnel : fermer avec Échap ou clic en dehors
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      popup.classList.add("hidden");
    }
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.add("hidden");
    }
  });
}

export { displayEdition };
