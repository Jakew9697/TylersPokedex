import Container from 'react-bootstrap/Container';
import PokemonList from './components/PokemonList';

export default function App() {
  return (
    <Container fluid className="text-center my-4">
      <h1>Tylers Pokédex</h1>
      <PokemonList />
    </Container>
  );
}
