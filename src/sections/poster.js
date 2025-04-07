import data from '../data/editions.json';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function displayPoster() {
    const svg = d3.select("#canvas");

    const squareSize = 10;
    const padding = 10;
    const squaresPerRow = 48;
    const total = data.length;

    const svgWidth = (squareSize + padding) * squaresPerRow;
    const svgHeight = Math.ceil(total / squaresPerRow) * (squareSize + padding);

    svg.attr("width", svgWidth)
       .attr("height", svgHeight);

    data.forEach((element, i) => {
        const col = i % squaresPerRow;
        const row = Math.floor(i / squaresPerRow);

        svg.append("rect")
            .attr("x", padding + col * (squareSize + padding))
            .attr("y", padding + row * (squareSize + padding))
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("fill", element.details.dominantColor || "#3498db");
    });
}

export { displayPoster };
