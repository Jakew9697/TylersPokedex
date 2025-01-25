// this child component is used to display each pokemon in their own card 
// TODO: When you click a pokemon, display the PokemonDetailsModal component... (Hint: You'll need to pass the pokemon object to the modal, and import the modal into this component)
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export default function PokemonItem({ pokemon }) {
  return (
    <Col xs={6} sm={4} md={3} lg={2} className="mb-4">
      <Card className="text-center">
        {pokemon.sprites?.front_default && (
          <Card.Img
            variant="top"
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
        )}
        <Card.Body>
          <Card.Title className="text-capitalize">
            {pokemon.name}
          </Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

PokemonItem.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sprites: PropTypes.shape({
      front_default: PropTypes.string,
    }),
  }).isRequired,
};
