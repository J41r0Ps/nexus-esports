import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/home/home_screen';
import { LoadingState } from '@/components/ui/states';

// Route-level code splitting: only the home screen ships in the initial bundle.
// Heavy screens (recharts on player detail, the bracket, admin forms) load on demand.
const TeamsScreen = lazy(() => import('./components/teams/teams_screen'));
const PlayersScreen = lazy(() => import('./components/players/players_screen'));
const TournamentsScreen = lazy(() => import('./components/tournaments/tournaments_screen'));
const TournamentDetailScreen = lazy(() => import('./components/tournaments/tournament_detail_screen'));
const PlayerDetailScreen = lazy(() => import('./components/players/player_detail_screen'));
const NotFoundScreen = lazy(() => import('./components/not_found_screen'));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><LoadingState /></div>}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/teams" element={<TeamsScreen />} />
        <Route path="/players" element={<PlayersScreen />} />
        <Route path="/tournaments" element={<TournamentsScreen />} />
        <Route path="/tournaments/:id" element={<TournamentDetailScreen />} />
        <Route path="/players/:id" element={<PlayerDetailScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  );
}

export default App;
