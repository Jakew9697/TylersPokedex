import Container from 'react-bootstrap/Container';
import PokemonList from './components/PokemonList';
import './App.css'

export default function App() {
  return (
    <Container fluid className="app-container text-center my-4">
      <div className="header">
      <h1>Tyler's Pokédex</h1>
      </div>
      <PokemonList />
    </Container>
  );
}
