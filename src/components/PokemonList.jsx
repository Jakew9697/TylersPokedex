// this parent component fetches the pokemon (currently just the first 151 based on index) and maps over them to display each one in their card which is made in the pokemonitem.jsx component.
import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import PokemonItem from './PokemonItem';
import PokemonDetailsModal from './PokemonDetailsModal';
import React from 'react';

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
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

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsShiny(false);  // Reset shiny state to show regular sprite
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
  };

  const resetShinyState = () => {
    setIsShiny(false);  // Reset shiny state
  };

  const resetEvolutionChain = () => {
    setEvolutionChain([]);  // Reset evolution chain
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        {pokemonList.map((pokemon) => (
          <PokemonItem
            key={pokemon.id}
            pokemon={pokemon}
            onCardClick={handleCardClick}
          />
        ))}
      </Row>

      {/* Modal for Pokémon Details */}
      <PokemonDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        pokemon={selectedPokemon}
        resetShinyState={resetShinyState}  // Pass reset function
        resetEvolutionChain={resetEvolutionChain}  // Pass reset function
      />
    </Container>
  );
}


