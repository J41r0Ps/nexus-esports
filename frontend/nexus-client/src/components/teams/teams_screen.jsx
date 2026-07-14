import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '@/layout_template';
import TeamsList from './teams_list';
import TeamsFilter from './teams_filter';
import TeamForm from './team_form';
import Pagination from '@/components/ui/pagination';
import Modal from '@/components/ui/modal';
import ConfirmDelete from '@/components/ui/confirm_delete';
import Toast from '@/components/ui/toast';
import TeamsService from '@/api/teams_service';
import GamesService from '@/api/games_service';
import { useIsAdmin } from '@/hooks/use_is_admin';

function TeamsScreen() {
    const { getAccessTokenSilently } = useAuth0();
    const isAdmin = useIsAdmin();

    const [teams, setTeams] = useState([]);
    const [games, setGames] = useState([]);
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 10 });
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const getTeams = async () => {
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

    useEffect(() => {
        GamesService.getAllGames().then(r => setGames(r.data));
    }, []);

    useEffect(() => { getTeams(); }, [filters]);

    const handleCreate = async (data) => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await TeamsService.createTeam(data, token);
            showToast('Team created successfully!');
            setCreateOpen(false);
            getTeams();
        } catch (error) {
            showToast(error.response?.data || 'Failed to create team', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await TeamsService.updateTeam(editing.id, data, token);
            setEditing(null);
            showToast('Team updated successfully!');
            getTeams();
        } catch (error) {
            showToast(error.response?.data || 'Failed to update team', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const token = await getAccessTokenSilently();
            await TeamsService.deleteTeam(deleting.id, token);
            setDeleting(null);
            showToast('Team deleted successfully!');
            getTeams();
        } catch (error) {
            showToast(error.response?.data || 'Failed to delete team', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Teams" subtitle={`${totalCount} teams competing across all regions`}>
            {isAdmin && (
                <div className="fade-in-up flex items-center justify-between gap-4 flex-wrap py-4 px-6 rounded-md mb-6 bg-[linear-gradient(135deg,rgba(176,38,255,0.08),rgba(255,46,136,0.05))] border border-neon-violet/30">
                    <span className="inline-flex items-center gap-2 text-neon-violet font-heading text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
                        <i className="bi bi-shield-lock-fill"></i> Admin Panel
                    </span>
                    <button
                        className="btn-neon-primary"
                        onClick={() => setCreateOpen(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Add Team
                    </button>
                </div>
            )}

            <TeamsFilter
                filters={filters}
                onFilterChange={setFilters}
                games={games}
            />

            <TeamsList
                teams={teams}
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

            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Team" size="lg">
                <TeamForm
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={`Edit Team: ${editing?.name}`} size="lg">
                {editing && (
                    <TeamForm
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

export default TeamsScreen;