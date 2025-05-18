/* Implémentation du router */

// Les helpers pour cacher/afficher une section et colorier les liens du menu
import { displaySection, activateLink } from "./section_display.js";
import { displayEdition, initPopup, availableYears } from "./sections/editions.js";
import { displayGenres } from "./sections/genres.js";
import { displayPoster } from "./sections/poster.js";

const router = () => {
  const hash = window.location.hash || "#home";
  const hashSplit = hash.split("-");

  // Colorie le lien (la première partie de l'url match toujours avec un élément du menu,
  // par choix de consistence dans le nommage)
  activateLink(hashSplit[0]);

  switch (hashSplit[0]) {
    case "#home":
      displaySection("#home");
      break;

        case "#editions":
          displaySection("#editions");
          const year = Number(hashSplit[1]);
          if (availableYears.includes(year)) {
            displayEdition(year);
          } else {
            displayEdition(1976);
          }
          initPopup();
          break;
        

    case "#posters":
      displaySection("#posters");
      displayPoster();
      break;

    case "#genres":
      displaySection("#genres");
      displayGenres();
      break;
  }
};

window.addEventListener("hashchange", router);

router();
