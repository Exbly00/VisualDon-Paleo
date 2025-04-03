import data from '../data/editions.json';


function displayEdition() {
    const section = document.querySelector(`#editions`);

    data.forEach(element => {
        const p = document.createElement("p");
        p.innerText = element.year;

        section.append(p);

    });
    }

export { displayEdition }