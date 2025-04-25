//* NOTE:-
// jb pheli baar data milti hai tb weh null hoti h isliye jb tk meri data poori nhi ho jaati tb tk return waali line na chalao
import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";


export const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]  =useState(null);
    const [search, setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=124"

    //Jab bhi aap fetch API ke saath kheloge woh aapko promise return krke deta h 
    const fetchPokemon = async() => {
        try {
            const res = await fetch(API)
            const data = await res.json();
            //console.log(data);

            const detailedPokemonData = data.results.map(async(curPokemon) => {
               // console.log(curPokemon.url);
               const res = await fetch(curPokemon.url);
               const data = await res.json();
               //console.log(data);
               return data;
            });
            //console.log(detailedPokemonData);

            //* Promise.all(all promises) --> iski wajeh se sabhi promise se data ek saath nikal skhte h ,
            //* aur agr ek bhi promise ki data fail hui toh sb fail ho jayega
            const detailedResponses = await Promise.all(detailedPokemonData)
            //console.log(detailedResponses);
            setPokemon(detailedResponses);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error);
        }
    };

    //API se data fetch krne ko bolte hai side Effect aur usko handle krne ke liye hota h useSideEffect state.
    useEffect(() => {
        fetchPokemon();
    },[]);

    // search functionality
    const searchData = pokemon.filter((curPokemon) => 
        curPokemon.name.toLowerCase().includes(search.toLowerCase()))


    if(loading){
        return (
            <div>
                <h1>Loading...</h1>
            </div>
    )}
    if(error)
    {
        return (
            <div>
                <h1>{error.message}</h1>
            </div>
    )
    }
    return(
        <>
        <section className="container">
            <header>
                <h1>Lets Catch Pokemon</h1>
            </header>
            <div className="pokemon-search">
                <input 
                    type="text" 
                    placeholder="Search Pokemon" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div>
                <ul className="cards">
                {/* {pokemon.map((curPokemon) => { */}
                {searchData.map((curPokemon) => {
                        return (<PokemonCards key={curPokemon.id} PokemonData = 
                            {curPokemon}/>
                    );
                    })}       
                </ul>
            </div>
        </section>
        </>
    );
}