import { useState, useEffect } from 'react';
import Layout from '@/layout_template';
import PlayersList from './players_list';
import PlayersFilter from './players_filter';
import Pagination from '@/components/ui/pagination';
import PlayersService from '@/api/players_service';
import TeamsService from '@/api/teams_service';
import CountriesService from '@/api/countries_service';

function PlayersScreen() {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 12 });
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const getPlayers = async (filters) => {
        try {
            setLoading(true);
            const result = await PlayersService.getAllPlayers(filters);
            setPlayers(result.data);

            const pagination = JSON.parse(result.headers["x-pagination"]);
            setPageCount(pagination.TotalPageCount);
            setTotalCount(pagination.TotalItemCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getTeams = async () => {
        try {
            const result = await TeamsService.getAllTeams({ pageSize: 50 });
            setTeams(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCountries = async () => {
        try {
            const result = await CountriesService.getAllCountries();
            setCountries(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTeams();
        getCountries();
    }, []);

    useEffect(() => { getPlayers(filters); }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, pageNumber: newPage });
    };

    return (
        <Layout title="Players" subtitle={`${totalCount} pro players from around the world`}>
            <PlayersFilter
                filters={filters}
                onFilterChange={setFilters}
                teams={teams}
                countries={countries}
            />

            <PlayersList players={players} loading={loading} />

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

export default PlayersScreen;