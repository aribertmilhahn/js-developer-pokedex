const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const backButton = document.getElementById('back-button')

const pokemonDetail = document.getElementById('detail-panel')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <button id="pokebutton-${pokemon.number}">
                <span class="number">#${('000' + pokemon.number).substring(-3)}</span>
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
})

function addEventListenerToPokemonButtons(offset, limit) {
    for (let i = offset + 1; i <= offset + limit; i++) {
        const button = document.getElementById(`pokebutton-${i}`);
        button.addEventListener('click', () => {
            pokemonList.classList.add("hidden")
            loadMoreButton.classList.add("hidden")
            backButton.classList.remove("hidden")
            let details = pokeApi.getPokemonStats(i)
            console.log(details)
        })
    }
}

