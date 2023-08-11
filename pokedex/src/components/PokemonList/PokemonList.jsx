import { useEffect, useState} from "react";
import axios from 'axios';
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList()
{
    const [PokemonList,setPokemonList] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    // pokemon API url
    const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon'); //this downloads list of 20 pokemons

    const [nextUrl,setNextUrl] = useState('');
    const [prevUrl, setPrevUrl] = useState('');
    
    async function downloadPokemons()
    {
        setIsLoading(true);
        const response = await axios.get(pokedexUrl);
        
        const pokemonResults = response.data.results; //we get the array of pokemons from results

        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);
       

        // iterating over the array of pokemon, and using their url,to create an array of promises
        // that will download those 20 pokemons

        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));
        // console.log(pokemonResultPromise);

        // passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise);
        // console.log(pokemonData);
        
        console.log(response.data);

        // next and prev url already given in api

      
        // fetch data from api
        // extract image,id ,name
        const res = pokemonData.map((pokeData)=>{
            const pokemon = pokeData.data;

            return{
                id:pokemon.id,
                name: pokemon.name, 
                image: pokemon.sprites.other.dream_world.front_default, 
                types: pokemon.types
            }
        })

        // console.log(res);
       setPokemonList(res);



        setIsLoading(false);
    }

    useEffect(()=>{
       downloadPokemons();
    },[pokedexUrl]);

    return(
      
        <div className="pokemon-list-wrapper">

            <div className="pokemon-wrapper" >

             {(isLoading)?'Loading..':
             PokemonList.map((p)=><Pokemon name ={p.name} image={p.image} key={p.id} id={p.id} />)
             }
            </div>
{/* previous and next button */}
            <div className="controls">
                <button disabled = {prevUrl == null} onClick={()=>setPokedexUrl(prevUrl)}>Prev</button>
                <button disabled={nextUrl == null} onClick={()=>setPokedexUrl(nextUrl)}>Next</button>
            </div>

         </div>
       
    )
}

export default PokemonList;