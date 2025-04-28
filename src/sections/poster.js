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
  const body = document.querySelector("body");


  body.style.setProperty("background-color", "white");
  console.log("ok");

}

export { displayPoster };
