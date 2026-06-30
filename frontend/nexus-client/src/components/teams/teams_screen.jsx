import { useState, useEffect } from 'react';
import Layout from '@/layout_template';
import TeamsList from './teams_list';
import TeamsFilter from './teams_filter';
import Pagination from '@/components/ui/pagination';
import TeamsService from '@/api/teams_service';
import GamesService from '@/api/games_service';

function TeamsScreen() {
    const [teams, setTeams] = useState([]);
    const [games, setGames] = useState([]);
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 12 });
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const getTeams = async (filters) => {
        try {
            setLoading(true);
            const result = await TeamsService.getAllTeams(filters);
            setTeams(result.data);

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
    useEffect(() => { getTeams(filters); }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, pageNumber: newPage });
    };

    return (
        <Layout title="Teams" subtitle={`${totalCount} teams competing across all regions`}>
            <TeamsFilter
                filters={filters}
                onFilterChange={setFilters}
                games={games}
            />

            <TeamsList teams={teams} loading={loading} />

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

export default TeamsScreen;