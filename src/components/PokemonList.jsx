// this parent component fetches the pokemon (currently just the first 151 based on index) and maps over them to display each one in their card which is made in the pokemonitem.jsx component.
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import PokemonItem from './PokemonItem';
import PokemonDetailsModal from './PokemonDetailsModal';
import React from 'react';

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');

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
        setFilteredPokemon(detailedPokemon);
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    filterPokemon(e.target.value, selectedType);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    filterPokemon(search, type);
  };

  const filterPokemon = (name, type) => {
    let filtered = pokemonList;

    if (name) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === type)
      );
    }

    setFilteredPokemon(filtered);
  };

  const resetFilter = () => {
    setSearch('');
    setSelectedType('');
    setFilteredPokemon(pokemonList);
  };

  return (
    <Container fluid>
      {/* Search and Filter Section */}
      <Row className="justify-content-between mb-4 align-items-center">
        <Col xs="6" md={3}>
          <img
            src="pokemonlogo2.png"  // Left image
            alt="Left Icon"
            style={{
              width: '250px',  // Set the image width
              height: '100px', // Set the image height
              marginLeft: '75px',
            }}
          />
        </Col>
  
        {/* Center section with search and filter */}
      <Col xs={12} md={6} className="d-flex justify-content-center">
        <div className="d-flex">
          <Form.Control
            type="text"
            placeholder="Search Pokémon by name"
            value={search}
            onChange={handleSearch}
            style={{
              marginRight: '10px', // Add space between search bar and dropdown
            }}
          />
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filter by Type
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => handleTypeFilter('fire')}>Fire</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTypeFilter('water')}>Water</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTypeFilter('grass')}>Grass</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTypeFilter('electric')}>Electric</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTypeFilter('bug')}>Bug</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTypeFilter('normal')}>Normal</Dropdown.Item>
              {/* Add more types as needed */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Col>
  
        <Col xs="6" md={3}>
          <img
            src="gottacatchthemall1.png"  // Right image
            alt="Right Icon"
            style={{
              width: '350px',  // Set the image width
              height: '75px', // Set the image height
              marginLeft: '-100px',  // Space between the button and image
            }}
          />
        </Col>
      </Row>
  
      {/* Reset Filter Button */}
      <Row className="justify-content-center mb-4">
        <Col size="auto">
          <Button variant="outline-primary" onClick={() => resetFilter()}>
            Reset Filters
          </Button>
        </Col>
      </Row>
  

      {/* Pokémon Cards */}
      <Row className="justify-content-center">
        {filteredPokemon.map((pokemon) => (
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
        resetShinyState={() => setIsShiny(false)}
        resetEvolutionChain={() => setEvolutionChain([])}
      />
    </Container>
  );
}
