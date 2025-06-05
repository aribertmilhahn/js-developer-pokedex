
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

function convertPokeApiDetailToStats(pokeDetail) {
    const stats = new PokemonStats()
    stats.number = pokeDetail.id
    stats.name = pokeDetail.name
    stats.hp = pokeDetail.stats[0]
    stats.attack = pokeDetail.stats[1]
    stats.defense = pokeDetail.stats[2]
    stats.specialAttack = pokeDetail.stats[3]
    stats.specialDefense = pokeDetail.stats[4]
    stats.speed = pokeDetail.stats[5]
    stats.sprite = pokeDetail.sprites.other.dream_world.front_default;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    stats.types = types
    stats.type = type
    return stats
}

pokeApi.getPokemonStats = (number) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`

    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToStats)
}