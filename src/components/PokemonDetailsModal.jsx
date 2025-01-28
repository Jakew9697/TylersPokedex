//TODO: display this modal when a pokemon is clicked on. Please provide the Pokemon type, and shiny image in the modal.

// import {Button, Row, Col, Modal} from 'react-bootstrap';
// Fixed a bug where if you had the shiny toggled on while closing the modal, the next card you clicked on would display the shiny version first
import './css/PokemonDetailsModal.css';
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function PokemonDetailsModal({ show, handleClose, pokemon, resetShinyState, resetEvolutionChain }) {
  const [isShiny, setIsShiny] = useState(false);
  const [moveDetails, setMoveDetails] = useState([]);
  const [loadingMoves, setLoadingMoves] = useState(true);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loadingEvolution, setLoadingEvolution] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);

  useEffect(() => {
    if (!pokemon) return;

    setIsShiny(false);
    setLoadingMoves(true);
    setMoveDetails([]);
    setEvolutionChain([]);
    setShowEvolution(false);

    const fetchMoveDetails = async () => {
      try {
        const moveDetailsPromises = pokemon.moves.slice(0, 4).map(async (move) => {
          const response = await fetch(move.move.url);
          const moveData = await response.json();
          const moveType = moveData.type.name;
          const movePower = moveData.power == null ? 'Ability' : moveData.power;

          return { name: move.move.name, type: moveType, damage: movePower };
        });

        const moves = await Promise.all(moveDetailsPromises);
        setMoveDetails(moves);
        setLoadingMoves(false);
      } catch (error) {
        console.error('Error fetching move details:', error);
      }
    };

    fetchMoveDetails();
  }, [pokemon]);

  const fetchEvolutionData = async () => {
    if (!pokemon) return;
    setLoadingEvolution(true);

    try {
      const speciesResponse = await fetch(pokemon.species.url);
      const speciesData = await speciesResponse.json();
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      const evolutionLine = [];
      let currentPokemon = evolutionData.chain;

      const processEvolutions = async (evolutions, isFirst = true) => {
        for (const nextEvolution of evolutions) {
          const pokemonDetails = await fetchPokemonDetails(nextEvolution.species.name);
      
          // Only process evolutions that belong to Gen 1 (ID 1 to 151)
          if (pokemonDetails.id <= 151) {
            // Check if evolution requires a trade or item
            const evolutionDetails = nextEvolution.evolution_details[0];
            let evolutionMethod = "N/A";
      
            if (evolutionDetails) {
              if (evolutionDetails.min_level) {
                evolutionMethod = `Level: ${evolutionDetails.min_level}`;
              } else if (evolutionDetails.trigger.name === "trade") {
                evolutionMethod = "Trade";
              } else if (evolutionDetails.item) {
                evolutionMethod = `Item: ${evolutionDetails.item.name}`;
              }
            }
      
            // Add evolutions, skipping the first one (base Pokémon)
            if (evolutionLine.length > 0 || nextEvolution.species.name !== pokemon.name) {
              // If this is the first evolution in the chain, set evolutionMethod to ""
              if (isFirst) {
                evolutionMethod = "";
              }
      
              evolutionLine.push({
                name: nextEvolution.species.name,
                sprite: isShiny ? pokemonDetails.sprites.front_shiny : pokemonDetails.sprites.front_default,
                evolutionMethod,
              });
            }
          }
      
          // Recursively process further evolutions if they exist
          if (nextEvolution.evolves_to.length > 0) {
            await processEvolutions(nextEvolution.evolves_to, false);  // Pass false for subsequent evolutions
          }
        }
      };
      

      // Start processing evolutions
      await processEvolutions([currentPokemon]);

      setEvolutionChain(evolutionLine);
      setLoadingEvolution(false);
    } catch (error) {
      console.error('Error fetching evolution data:', error);
      setLoadingEvolution(false);
    }
  };

  const fetchPokemonDetails = async (name) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
  };

  const handleToggleShiny = (event) => {
    setIsShiny(event.target.checked);
  };

  const handleCloseModal = () => {
    setEvolutionChain([]); // Reset evolution chain
    setIsShiny(false); // Reset shiny state
    setShowEvolution(false); // Hide evolution details
    handleClose(); // Close the modal
  };

  useEffect(() => {
    if (showEvolution) {
      fetchEvolutionData(); // Re-fetch evolution data when shiny state or visibility changes
    }
  }, [isShiny, showEvolution, pokemon]);

  if (!pokemon) return null;

  const modalWidth = evolutionChain.length > 5 ? '100vw' : '90vw';
  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="custom-modal"
      style={{ width: modalWidth, maxWidth: modalWidth, height: 'auto' }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-capitalize">{pokemon.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {pokemon.sprites?.front_default && (
          <img
            src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
            alt={pokemon.name}
            className="pokemon-image"
          />
        )}
        <p>Type: {pokemon.types?.map((type) => type.type.name).join(', ')}</p>

        <h5>Moves:</h5>
        {loadingMoves ? (
          <p>Loading moves...</p>
        ) : (
          moveDetails.map((move, index) => (
            <div key={index}>
              <p><strong>{move.name}</strong> (Type: {move.type}, {move.damage === 'Ability' ? 'Ability' : `Damage: ${move.damage}`})</p>
            </div>
          ))
        )}

        <Button variant="info" onClick={() => setShowEvolution(!showEvolution)}>
          {showEvolution ? 'Show Regular Details' : 'Show Evolution Line'}
        </Button>

        {showEvolution ? (
          loadingEvolution ? (
            <p>Loading evolution...</p>
          ) : (
            evolutionChain.length > 0 && (
              <div>
                <h5>Evolution Line:</h5>
                <div className="evolution-line">
                  {evolutionChain.map((evolution, index) => (
                    <div key={index} className="evolution-detail">
                      <div className="evolution-info-container">
                        <img
                          src={evolution.sprite}
                          alt={evolution.name}
                          className="evolution-sprite"
                        />
                        <p className="evolution-name">{evolution.name}</p>
                        <p className="evolution-method">{evolution.evolutionMethod}</p>
                      </div>
                      {index < evolutionChain.length - 1 && (
                        <div className="evolution-arrow">
                          <span>➡</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        ) : null}

        <Form.Check
          type="switch"
          id="shiny-toggle"
          label={isShiny ? 'Shiny' : 'Regular'}
          checked={isShiny}
          onChange={handleToggleShiny}
          className="shiny-toggle-switch"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

PokemonDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  pokemon: PropTypes.object,
  resetShinyState: PropTypes.func.isRequired,
  resetEvolutionChain: PropTypes.func.isRequired,
};
