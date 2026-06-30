import { useState, useEffect } from 'react';
import Layout from '@/layout_template';
import TournamentsList from './tournaments_list';
import TournamentsFilter from './tournaments_filter';
import Pagination from '@/components/ui/pagination';
import TournamentsService from '@/api/tournaments_service';
import GamesService from '@/api/games_service';

function TournamentsScreen() {
    const [tournaments, setTournaments] = useState([]);
    const [games, setGames] = useState([]);
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 9 });
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const getTournaments = async (filters) => {
        try {
            setLoading(true);
            const result = await TournamentsService.getAllTournaments(filters);
            setTournaments(result.data);

            const pagination = JSON.parse(result.headers["x-pagination"]);
            setPageCount(pagination.TotalPageCount);
            setTotalCount(pagination.TotalItemCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getGames = async () => {
        try {
            const result = await GamesService.getAllGames();
            setGames(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { getGames(); }, []);
    useEffect(() => { getTournaments(filters); }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, pageNumber: newPage });
    };

    return (
        <Layout title="Tournaments" subtitle={`${totalCount} competitions across all titles`}>
            <TournamentsFilter
                filters={filters}
                onFilterChange={setFilters}
                games={games}
            />

            <TournamentsList tournaments={tournaments} loading={loading} />

            {pageCount > 1 && (
                <Pagination
                    currentPage={filters.pageNumber}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                />
            )}
        </Layout>
    );
}

export default TournamentsScreen;