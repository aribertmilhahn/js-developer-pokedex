const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const backButton = document.getElementById('back-button')

const pokemonDetail = document.getElementById('detail-panel')
let currentPokemonType = "grass"

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <button id="pokebutton-${pokemon.number}">
                <span class="number">#${('000' + pokemon.number).substr(-3)}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </button>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.insertAdjacentHTML('beforeend', newHtml)
    })
    setTimeout(() => {
        addEventListenerToPokemonButtons(offset, limit);
    }, 2000);
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

backButton.addEventListener('click', () => {
    pokemonList.classList.remove("hidden")
    loadMoreButton.classList.remove("hidden")
    backButton.classList.add("hidden")
    pokemonDetail.classList.add("hidden")
    pokemonDetail.innerHTML = "";
})

function addEventListenerToPokemonButtons(offset, limit) {
    for (let i = offset + 1; i <= offset + limit; i++) {
        const button = document.getElementById(`pokebutton-${i}`);
        button.addEventListener('click', () => {
            pokemonList.classList.add("hidden")
            loadMoreButton.classList.add("hidden")
            backButton.classList.remove("hidden")
            pokemonDetail.classList.remove("hidden")

            pokeApi.getPokemonStats(i).then((details) => {
                const pokemonDetailHTML = convertDetailsToHTML(details)
                pokemonDetail.classList.remove(currentPokemonType)
                currentPokemonType = details.type
                pokemonDetail.classList.add(currentPokemonType)
                pokemonDetail.innerHTML = pokemonDetailHTML
            })
        })
    }
}

function convertDetailsToHTML(details) {
    return `
        <div class="general-detail">
            <div id="general-detail-left">
                <div class="name">${details.name}</div>
                <ol class="types">
                     ${details.types.map((type) => `<li class="detail-type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            <div id="general-detail-right">
                <span class="dateil-number">#${('000' + details.number).substr(-3)}</span>
            </div>
        </div>

        <div id="pokemon-pic">
            <img id="pokemon-detail-picture" src="${details.sprite}" alt="bulbasaur">
        </div>
        
        <div class="stats-panel">
            <h2>Base Stats</h2>
            <span class="stats-text">hp: ${details.hp.base_stat}</span>
            <span class="stats-text">attack: ${details.attack.base_stat}</span>
            <span class="stats-text">defense: ${details.defense.base_stat}</span>
            <span class="stats-text">sp. attack: ${details.specialAttack.base_stat}</span>
            <span class="stats-text">sp. defense: ${details.specialDefense.base_stat}</span>
            <span class="stats-text">speed: ${details.speed.base_stat}</span>
        </div>
    `
}