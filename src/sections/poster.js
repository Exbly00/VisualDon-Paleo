import data from '../data/editions.json';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function displayPoster() {
    const svg = d3.select("#canvas");

    const squareSize = 100;
    const svgWidth = 150;
    const svgHeight = 150;

    svg.attr("width", svgWidth).attr("height", svgHeight);

    const square = svg.append("rect")
        .attr("x", (svgWidth - squareSize) / 2)
        .attr("y", (svgHeight - squareSize) / 2)
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", "#eee");

    let previousColor = "#3498db";
    let currentIndex = data.length - 1;

    // Création du gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    const stopNew = gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", previousColor);

    const stopOld = gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", previousColor);

    square.attr("fill", "url(#gradient)");

    const interval = setInterval(() => {
        const newColor = data[currentIndex].details.dominantColor || "#3498db";

        // Réinitialise les offsets
        stopNew
            .attr("offset", "0%")
            .attr("stop-color", newColor);

        stopOld
            .attr("offset", "0%")
            .attr("stop-color", previousColor);

        // Anime l'ancienne couleur vers le bas
        stopOld.transition()
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .attr("offset", "100%");

        previousColor = newColor;
        currentIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    }, 4000);
}

export { displayPoster };
