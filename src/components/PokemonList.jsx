// this parent component fetches the pokemon (currently just the first 151 based on index) and maps over them to display each one in their card which is made in the pokemonitem.jsx component.

import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import PokemonItem from './PokemonItem';
import PokemonDetailsModal from './PokemonDetailsModal';
import React from 'react';
//import PokemonCry from './PokemonCry'; //Eventually want to make it so that when you click on the pokemon sprite in the modal, it will play the audio for the pokemon's cry.

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Store selected pokemon
  const [showModal, setShowModal] = useState(false); // Controls modal visibility

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

  // Function to show the modal with selected pokemon data
  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);  // Set selected pokemon
    setShowModal(true);           // Show the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);          // Hide the modal
    setSelectedPokemon(null);     // Clear selected pokemon
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        {pokemonList.map((pokemon) => (
          <PokemonItem
            key={pokemon.id}
            pokemon={pokemon}
            onCardClick={handleCardClick} // Pass the function to PokemonItem
          />
        ))}
      </Row>

      {/* Modal for Pokémon Details */}
      <PokemonDetailsModal
        show={showModal}             // Control modal visibility
        handleClose={handleCloseModal} // Function to close the modal
        pokemon={selectedPokemon}   // Pass selected Pokémon data to the modal
      />
    </Container>
  );
}
