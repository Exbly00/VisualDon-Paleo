import data from '../data/editions.json';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function displayPoster() {
    const previousPoster = document.querySelector("#previous-poster img");
    const nextPoster = document.querySelector("#next-poster img");
    const previousPosterLabel = document.querySelector("#previous-poster h3");
    const nextPosterLabel = document.querySelector("#next-poster h3");

    let previousPosterIndex = 1976;
    let nextPosterIndex = 1977;

    const interval = setInterval(() => {
        // Skip 2020 and 2021
        if (previousPosterIndex === 2020) previousPosterIndex = 2022;
        if (nextPosterIndex === 2020) nextPosterIndex = 2022;

        previousPoster.setAttribute("src", `../assets/posters/${previousPosterIndex}.jpg`);
        previousPosterLabel.innerText = previousPosterIndex;
        nextPoster.setAttribute("src", `../assets/posters/${nextPosterIndex}.jpg`);
        nextPosterLabel.innerText = nextPosterIndex;

        previousPosterIndex++;
        nextPosterIndex++;

        if (nextPosterIndex > 2025) {
            clearInterval(interval);
        }
    }, 4000);
}


export { displayPoster };
