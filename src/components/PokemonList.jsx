// this parent component fetches the pokemon (currently just the first 151 based on index) and maps over them to display each one in their card which is made in the pokemonitem.jsx component.

import { useEffect, useState } from 'react';
import {Container, Row} from 'react-bootstrap';
import PokemonItem from './PokemonItem';

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        // Fetch detailed data for each Pokémon
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );

        setPokemonList(detailedPokemon);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-center">
        {pokemonList.map((pokemon) => (
          <PokemonItem key={pokemon.id} pokemon={pokemon} />
        ))}
      </Row>
    </Container>
  );
}
