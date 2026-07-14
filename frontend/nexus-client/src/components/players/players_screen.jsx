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
    const [totalCount, setTotalCount] = useState(0);
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
        <Layout title="Players" subtitle={`${totalCount} pro players from around the world`}>
            {isAdmin && (
                <div className="fade-in-up flex items-center justify-between gap-4 flex-wrap py-4 px-6 rounded-md mb-6 bg-[linear-gradient(135deg,rgba(176,38,255,0.08),rgba(255,46,136,0.05))] border border-neon-violet/30">
                    <span className="inline-flex items-center gap-2 text-neon-violet font-heading text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
                        <i className="bi bi-shield-lock-fill"></i> Admin Panel
                    </span>
                    <button className="btn-neon-primary" onClick={() => setCreateOpen(true)}>
                        <i className="bi bi-plus-lg me-2"></i> Add Player
                    </button>
                </div>
            )}

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

            {pageCount > 1 && (
                <Pagination
                    currentPage={filters.pageNumber}
                    totalPages={pageCount}
                    onPageChange={(p) => setFilters({ ...filters, pageNumber: p })}
                />
            )}

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