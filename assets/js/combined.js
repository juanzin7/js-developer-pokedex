class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
  }
  
  
  const pokemonList = document.getElementById('pokemonList')
  const loadMoreButton = document.getElementById('loadMoreButton')
  
  const pokeApi = {}
  
  function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number =  pokeDetail.order
    pokemon.name = pokeDetail.name
    pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    pokemon.type = pokemon.types[0]
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
  
    return pokemon
  }
  function showPokemonDetails(pokemon) {
    const modalPokemonName = document.getElementById('modalPokemonName');
    const modalPokemonNumber = document.getElementById('modalPokemonNumber');
    const modalPokemonTypes = document.getElementById('modalPokemonTypes');
    const modalPokemonImage = document.getElementById('modalPokemonImage');
    const modalPokemonStats = document.getElementById('modalPokemonStats');
    const modalPokemonDescription = document.getElementById('modalPokemonDescription');
  
    modalPokemonName.textContent = pokemon.name;
    modalPokemonNumber.textContent = `#${pokemon.number}`;
    modalPokemonTypes.textContent = `Tipos: ${pokemon.types.join(', ')}`;
    modalPokemonImage.src = pokemon.photo
    modalPokemonTypes.style.backgroundColor = typeColors[pokemon.type]
  }
  
  function convertPokemonTypesToLi(types) {
      return types.map(type => `<li class="type">${type}</li>`).join('');
    }
  
    pokeApi.getPokemonDetail = (pokemonUrl) => {
      return fetch(pokemonUrl)
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`Failed to fetch: ${response.statusText}`);
              }
              return response.json();
          })
          .then((pokemonData) => convertPokeApiDetailToPokemon(pokemonData))
          
          .catch((error) => {
              console.error("Error fetching Pokemon detail:", error)
              throw error
          });
  }
                
  pokeApi.getPokemons = (offset = 0, limit = 5) => {
      const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
      return fetch(url)
          .then((response) => response.json())
          .then((jsonBody) => jsonBody.results)
          .then((pokemons) => pokemons.map(pokemon => pokeApi.getPokemonDetail(pokemon.url))) // Alteração aqui
          .then((detailRequests) => Promise.all(detailRequests))
          .then((pokemonsDetails) => pokemonsDetails)
    }
    
  const maxRecords = 150
  const limit = 10
  let offset = 0
  
  function convertPokemonToLi(pokemon) {
      return `
         <li class="pokemon ${pokemon.type}" data-pokemon-number="${pokemon.number}">
           <span class="number">#${pokemon.number}</span>
           <span class="name">${pokemon.name}</span>
  
          <div class="detail">
              <ol class="types">
              ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
  
          <img src="${pokemon.photo}"
              alt="${pokemon.name}">
            </div>
          </li>
      `;
  }
     
  function loadPokemonItens(offset, limit) {
         pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
          const newHtml = pokemons.map(convertPokemonToLi).join('')
           pokemonList.innerHTML += newHtml
    })
  }
  
  loadPokemonItens(offset, limit)
  
  loadMoreButton.addEventListener('click', async () => {
    offset += limit
    const qtdRecordsWihNextPage = offset + limit
  
    if (qtdRecordsWihNextPage >= maxRecords) {
      await loadPokemonItens(offset, maxRecords - offset)
      loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
      await loadPokemonItens(offset, limit)
    }
  })
  pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('li.pokemon')
    if (clickedPokemon) {
      const pokemonNumber = clickedPokemon.getAttribute('data-pokemon-number')
      
      pokeApi.getPokemonDetail(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`)
      .then((pokemon) => {
        showPokemonDetails(pokemon)
  
        const modal = document.getElementById('pokemonModal')
        modal.style.display = 'block'
      })
      .catch((error) =>{
        console.error("Error fetching Pokémon details:", error)
      })
      
    }
  })
  const closeButton = document.getElementById('closedModal')
  closeButton.addEventListener('click', () =>{
    const modal = document.getElementById('pokemonModal')
    modal.style.display = 'none'
  })
  
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  }