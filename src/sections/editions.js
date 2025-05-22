import data from "../data/editions.json";

const previousButton = document.querySelector(".previous-button");
const previousNavigation = document.querySelectorAll(".nav-button")[0]; 
const nextNavigation = document.querySelectorAll(".nav-button")[1]; 
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
const nextArrow = document.querySelector("#next-arrow");
const previousArrow = document.querySelector("#previous-arrow");
const body = document.querySelector("body");

const availableYears = Array.from({ length: 50 }, (_, i) => 1976 + i).filter(
  (year) => year !== 2020 && year !== 2021
);

let currentEditionYear = 1976;

// Fonction pour afficher une édition
function displayEdition(year) {
  currentEditionYear = year;
  updateButtons();
  updateRange();

  const editionYear = Number(year);
  const edition = data.find((ed) => ed.year === editionYear);

  if (!edition) {
    console.error(`Aucune donnée pour l'année ${editionYear}`);
    return;
  } 

  if (!edition.details) {
    console.error(`Détails manquants pour l'édition ${editionYear}`);
    return;
  }
  
    editionYearTitle.innerText = editionYear;
    // Poster image
    posterImage.src = `../assets/posters/${editionYear}.jpg` || "";
    posterImage.alt = `Affiche de l'édition ${editionYear}`;

    // Data
    scenesElement.textContent = edition.details.scenes || "?";
    concertsElement.textContent = edition.details.concerts || "?";
    visitorsElement.textContent = edition.details.visitors || "?";
    volunteersElement.textContent = edition.details.volunteers || "?";
    descriptionElement.textContent = edition.description;
    
    // Genres uniques
    if (edition.artists && edition.artists.length > 0) {
      const uniqueGenres = [
        ...new Set(edition.artists.map((artist) => artist.genre)),
      ];
      genresElement.textContent = uniqueGenres.join(", ");
    } else {
      genresElement.textContent = "?";
    }

    const artists = edition.artists.map((artist) => artist.name).join(", ");
    popupContent.innerText = artists;

    // Headliners
    headlinersElement.textContent = edition.headline.join(", ");;

  body.style.setProperty("background-color", hexToRgba(edition.details.dominantColor) || "#444");

  window.location.hash = `#editions-${editionYear}`;
  rangeInput.value = availableYears.indexOf(editionYear) + 1; }

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
  previousButton.style.display = "block";
  nextButton.style.display = "block";
  previousArrow.style.display = "block";
  nextArrow.style.display = "block";  

  const yearIndex = availableYears.indexOf(currentEditionYear);

  previousButton.disabled = yearIndex === 0;
  nextButton.disabled = yearIndex === availableYears.length - 1;
  previousButton.innerText = `${availableYears[yearIndex - 1]}`;
  nextButton.innerText = `${availableYears[yearIndex + 1]}`;

  if(yearIndex === 0) {
    previousButton.style.display = "none";
    previousArrow.style.display = "none";

  }
  if(yearIndex === availableYears.length - 1) {
    nextButton.style.display = "none";
    nextArrow.style.display = "none";

  }
}

// Mettre à jour la valeur du range
function updateRange() {
  const yearIndex = availableYears.indexOf(currentEditionYear);
  rangeInput.value = yearIndex + 1; 
}

previousNavigation.addEventListener("click", () => {
  const yearIndex = availableYears.indexOf(currentEditionYear);
  if (yearIndex > 0) {
    currentEditionYear = availableYears[yearIndex - 1];
    displayEdition(currentEditionYear);
    updateButtons();
    updateRange();
  }
});

nextNavigation.addEventListener("click", () => {
  const yearIndex = availableYears.indexOf(currentEditionYear);
  if (yearIndex < availableYears.length - 1) {
    currentEditionYear = availableYears[yearIndex + 1];
    displayEdition(currentEditionYear);
    updateButtons();
    updateRange();}
});

// Gestion du changement dans le range
rangeInput.addEventListener("input", (event) => {
  const yearIndex = event.target.value - 1;
  currentEditionYear = availableYears[yearIndex];
  displayEdition(currentEditionYear);
  updateButtons();
});

// Initialiser la première édition
displayEdition(currentEditionYear);
updateButtons();
updateRange();


//Fonction pour afficher la popup
function initPopup() {
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

export { displayEdition, availableYears, hexToRgba, initPopup};
