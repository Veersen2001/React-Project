import { useEffect, useState} from "react";
import axios from 'axios';
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList()
{
    const [PokemonList,setPokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    // pokemon API url
    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon' //this downloads list of 20 pokemons
    
    async function downloadPokemons()
    {
        const response = await axios.get(POKEDEX_URL);
        
        const pokemonResults = response.data.results; //we get the array of pokemons from results

        // iterating over the array of pokemon, and using their url,to create an array of promises
        // that will download those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));
        // console.log(pokemonResultPromise);

        // passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise);
        // console.log(pokemonData);
        
        console.log(response.data);

        // fetch data from api
        // extract image,id ,name
        const res = pokemonData.map((pokeData)=>{
            const pokemon = pokeData.data;

            return{
                id:pokemon.id,
                name: pokemon.name, 
                image: pokemon.sprites.other.dream_world.front_default, 
                types: pokemon.types}
        })

        console.log(res);
       setPokemonList(res);



        setIsLoading(false);
    }

    useEffect(()=>{
       downloadPokemons();
    },[]);

    return(
        <>
         <div className="pokemon-list-wrapper">
                <div>pokemon List</div>
             {(isLoading)?'Loading..':
             PokemonList.map((p)=><Pokemon name ={p.name} image={p.image} key={p.id} />)
             }
         </div>
        </>
    )
}

export default PokemonList;