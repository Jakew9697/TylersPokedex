//TODO: display this modal when a pokemon is clicked on. Please provide the Pokemon type, and shiny image in the modal.

// import {Button, Row, Col, Modal} from 'react-bootstrap';
import './css/PokemonDetailsModal.css';
import React, { useState } from 'react';  // Import useState
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function PokemonDetailsModal({ show, handleClose, pokemon }) {
  if (!pokemon) return null; // Return nothing if no pokemon is selected

  // State to track if shiny image is being shown
  const [isShiny, setIsShiny] = useState(false);

  // Toggle the shiny state
  const handleToggleShiny = () => {
    setIsShiny(!isShiny);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{pokemon.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {/* Displaying the correct image based on shiny state */}
        {pokemon.sprites?.front_default && (
          <img
            src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
            alt={pokemon.name}
            className="pokemon-image"
          />
        )}
        <p>Type: {pokemon.types?.map((type) => type.type.name).join(', ')}</p>
        
        {/* Button to toggle shiny image */}
        <Button variant="primary" onClick={handleToggleShiny}>
          {isShiny ? 'Regular' : 'Shiny'}
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

PokemonDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  pokemon: PropTypes.object, // The Pokémon object being passed
};

