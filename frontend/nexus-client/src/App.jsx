import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/home/home_screen';
import TeamsScreen from './components/teams/teams_screen';
import PlayersScreen from './components/players/players_screen';
import TournamentsScreen from './components/tournaments/tournaments_screen';
import TournamentDetailScreen from './components/tournaments/tournament_detail_screen';
import PlayerDetailScreen from './components/players/player_detail_screen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/teams" element={<TeamsScreen />} />
      <Route path="/players" element={<PlayersScreen />} />
      <Route path="/tournaments" element={<TournamentsScreen />} />
      <Route path="/tournaments/:id" element={<TournamentDetailScreen />} />
      <Route path="/players/:id" element={<PlayerDetailScreen />} />
    </Routes>
  );
}

export default App;