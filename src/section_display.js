// Cache la section en cours et affiche celle correspondant à l'id passé en paramètre
const displaySection = (id) => {
  // On essaie de trouver la section active et on enlève la classe "active"
  document.querySelector('section.active')?.classList.remove('active')

  // On essaie de trouver la section qui correspond à l'id passé
  document.querySelector(id)?.classList.add('active')
}

// Active le lien correspondant à la section affichée
const activateLink = (id) => {
  document.querySelector(`nav a.active`)?.classList.remove('active')
  document.querySelector(`nav a[href="${id}"]`)?.classList.add('active')
}

// Partie recherche, côté UI
const searchButton = document.querySelector('#search-trigger')
const searchInput = document.querySelector('#search-input')

if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
      searchInput.classList.toggle('active')
      if (searchInput.classList.contains('active')) {
          searchInput.focus()
      }
  })

  searchInput.addEventListener('change', () => {
      window.location.hash = `#search-${encodeURIComponent(searchInput.value)}`
  })
}

export { displaySection, activateLink }
