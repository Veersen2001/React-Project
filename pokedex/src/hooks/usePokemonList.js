
import axios from 'axios';
import { useEffect, useState } from 'react';
function usePokemonList() {

    // custom hook

    // const [PokemonList,setPokemonList] = useState([]);
    // const [isLoading,setIsLoading] = useState(true);

    // // pokemon API url
    // const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon'); //this downloads list of 20 pokemons

    // const [nextUrl,setNextUrl] = useState('');
    // const [prevUrl, setPrevUrl] = useState('');

    // code cleanUp
  const [pokemonListState,setPokemonListState] = useState({
        pokemonList:[],
        isLoading:true,
        pokedexUrl:'https://pokeapi.co/api/v2/pokemon',
        nextUrl:'',
        prevUrl:''
    })

     async function downloadPokemons()
    {
        // setIsLoading(true);

        setPokemonListState({ ...pokemonListState,isLoading:true});
        const response = await axios.get(pokemonListState.pokedexUrl);
        
        const pokemonResults = response.data.results; //we get the array of pokemons from results

        setPokemonListState( (state) =>({
            ...state,
            nextUrl:response.data.next,
            prevUrl: response.data.previous
        }));
        
       

        // iterating over the array of pokemon, and using their url,to create an array of promises
        // that will download those 20 pokemons

        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));
        // console.log(pokemonResultPromise);

        // passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise);
        console.log(pokemonData);
        
        console.log(response.data);

        // next and prev url already given in api

      
        // fetch data from api
        // extract image,id ,name
        const pokeListResult = pokemonData.map((pokeData)=>{
            const pokemon = pokeData.data;

            return{
                id:pokemon.id,
                name: pokemon.name, 
                image: pokemon.sprites.other.dream_world.front_default, 
                types: pokemon.types
            }
        })

        // console.log(res);
       setPokemonListState( (state) => ({
        ...state,
        pokemonList:pokeListResult,
        isLoading:false
    }));



        
    }

    useEffect(() =>{
        downloadPokemons();

    },[pokemonListState.pokedexUrl]);

    return{
        pokemonListState,setPokemonListState
    }
}

export default usePokemonList;
