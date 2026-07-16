import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '@/layout_template';
import TournamentsList from './tournaments_list';
import TournamentsFilter from './tournaments_filter';
import TournamentForm from './tournament_form';
import Pagination from '@/components/ui/pagination';
import Modal from '@/components/ui/modal';
import ConfirmDelete from '@/components/ui/confirm_delete';
import Toast from '@/components/ui/toast';
import AdminBar from '@/components/ui/admin_bar';
import TournamentsService from '@/api/tournaments_service';
import GamesService from '@/api/games_service';
import { useIsAdmin } from '@/hooks/use_is_admin';

function TournamentsScreen() {
    const { getAccessTokenSilently } = useAuth0();
    const isAdmin = useIsAdmin();

    const [tournaments, setTournaments] = useState([]);
    const [games, setGames] = useState([]);
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 8 });
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(null);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const getTournaments = async () => {
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

    useEffect(() => {
        GamesService.getAllGames().then(r => setGames(r.data));
    }, []);

    useEffect(() => { getTournaments(); }, [filters]);

    const handleCreate = async (data) => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await TournamentsService.createTournament(data, token);
            showToast('Tournament created successfully!');
            setCreateOpen(false);
            getTournaments();
        } catch (error) {
            showToast(error.response?.data || 'Failed to create tournament', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await TournamentsService.updateTournament(editing.id, data, token);
            showToast('Tournament updated successfully!');
            setEditing(null);
            getTournaments();
        } catch (error) {
            showToast(error.response?.data || 'Failed to update tournament', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await TournamentsService.deleteTournament(deleting.id, token);
            showToast('Tournament deleted successfully!');
            setDeleting(null);
            getTournaments();
        } catch (error) {
            showToast(error.response?.data || 'Failed to delete tournament', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Tournaments" subtitle={totalCount == null ? undefined : `${totalCount} competitions across all titles`}>
            {isAdmin && <AdminBar addLabel="Add Tournament" onAdd={() => setCreateOpen(true)} />}

            <TournamentsFilter
                filters={filters}
                onFilterChange={setFilters}
                games={games}
            />

            <TournamentsList
                tournaments={tournaments}
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

            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Tournament" size="lg">
                <TournamentForm
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Edit Tournament: ${editing?.name}`} size="lg">
                {editing && (
                    <TournamentForm
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
                itemName={deleting?.name}
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

export default TournamentsScreen;