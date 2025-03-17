// Cache la section en cours et affiche celle correspondant à l'id passé en paramètre
const displaySection = (id) => {

  // On essaie de trouver la section active et on enlève la classe "active"
  document.querySelector('section.active')?.classList.remove('active')

  // On essaie de trouver la section qui correspond à l'id passé
  document.querySelector(id)?.classList.add('active')
}

// Active le lien correspondant à la section affichée
const activateLink = (id) => {
  document.querySelector(`.header a.active`)?.classList.remove('active')
  document.querySelector(`.header a[href="${id}"]`)?.classList.add('active')
}

export { displaySection, activateLink }
