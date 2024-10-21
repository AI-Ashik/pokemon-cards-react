import { useEffect, useState } from "react";

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPokemon, setSearchPokemon] = useState("");
  const API = "https://pokeapi.co/api/v2/pokemon?limit=500";

  const fetchPokemonData = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const pokemonMainData = await Promise.all(
        data.results.map(async (mainPokemonData) => {
          const mainRes = await fetch(mainPokemonData.url);
          return mainRes.json();
        })
      );

      setPokemon(pokemonMainData);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const filteredPokemon = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-red-500 text-lg">{error.message}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 p-6">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
        Pokémon Cards
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchPokemon}
          onChange={(e) => setSearchPokemon(e.target.value)}
          className="p-3 border border-gray-400 rounded-lg w-full shadow-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemon.map((curPokemon) => (
          <div
            key={curPokemon.id}
            className="bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl p-4 relative overflow-hidden"
          >
            <div className="flex justify-center mb-4">
              <img
                src={curPokemon.sprites.front_default}
                alt={curPokemon.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">
              {curPokemon.name}
            </h3>
            <p className="text-sm text-center text-gray-600">
              Height: {curPokemon.height / 10} m
            </p>
            <p className="text-sm text-center text-gray-600">
              Weight: {curPokemon.weight / 10} kg
            </p>
            <p className="text-sm text-center text-gray-600 mb-2">
              Experience: {curPokemon.base_experience} XP
            </p>
            <p className="text-sm text-center text-gray-600">Abilities:</p>
            <p className="text-sm text-center text-gray-700 mb-4">
              {curPokemon.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default App;
