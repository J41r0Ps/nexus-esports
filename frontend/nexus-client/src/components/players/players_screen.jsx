import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '@/layout_template';
import PlayersList from './players_list';
import PlayersFilter from './players_filter';
import PlayerForm from './player_form';
import Pagination from '@/components/ui/pagination';
import Modal from '@/components/ui/modal';
import ConfirmDelete from '@/components/ui/confirm_delete';
import Toast from '@/components/ui/toast';
import AdminBar from '@/components/ui/admin_bar';
import PlayersService from '@/api/players_service';
import TeamsService from '@/api/teams_service';
import CountriesService from '@/api/countries_service';
import { useIsAdmin } from '@/hooks/use_is_admin';

function PlayersScreen() {
    const { getAccessTokenSilently } = useAuth0();
    const isAdmin = useIsAdmin();

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 12 });
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(null);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const getPlayers = async () => {
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

    useEffect(() => {
        TeamsService.getAllTeams({ pageSize: 50 }).then(r => setTeams(r.data));
        CountriesService.getCountriesWithPlayers().then(r => setCountries(r.data));
    }, []);

    useEffect(() => { getPlayers(); }, [filters]);

    const handleCreate = async (data) => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await PlayersService.createPlayer(data, token);
            showToast('Player created successfully!');
            setCreateOpen(false);
            getPlayers();
        } catch (error) {
            showToast(error.response?.data || 'Failed to create player', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await PlayersService.updatePlayer(editing.id, data, token);
            showToast('Player updated successfully!');
            setEditing(null);
            getPlayers();
        } catch (error) {
            showToast(error.response?.data || 'Failed to update player', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await PlayersService.deletePlayer(deleting.id, token);
            showToast('Player deleted successfully!');
            setDeleting(null);
            getPlayers();
        } catch (error) {
            showToast(error.response?.data || 'Failed to delete player', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Players" subtitle={totalCount == null ? undefined : `${totalCount} pro players from around the world`}>
            {isAdmin && <AdminBar addLabel="Add Player" onAdd={() => setCreateOpen(true)} />}

            <PlayersFilter
                filters={filters}
                onFilterChange={setFilters}
                teams={teams}
                countries={countries}
            />

            <PlayersList
                players={players}
                loading={loading}
                isAdmin={isAdmin}
                onEdit={setEditing}
                onDelete={setDeleting}
            />

            <Pagination
                currentPage={filters.pageNumber}
                totalPages={pageCount}
                onPageChange={(p) => setFilters({ ...filters, pageNumber: p })}
            />

            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Player" size="lg">
                <PlayerForm
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Edit Player: ${editing?.gamertag}`} size="lg">
                {editing && (
                    <PlayerForm
                        initialData={editing}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditing(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            <ConfirmDelete
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={handleDelete}
                itemName={deleting?.gamertag}
                isDeleting={isSubmitting}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </Layout>
    );
}

export default PlayersScreen;