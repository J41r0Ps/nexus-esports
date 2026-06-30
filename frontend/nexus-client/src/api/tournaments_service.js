import apiClient from './api_client';

const TournamentsService = {
    getAllTournaments(params) {
        return apiClient.get('/tournaments', { params });
    },
    getTournamentById(id) {
        return apiClient.get(`/tournaments/${id}`);
    },
    getRegistrations(tournamentId) {
        return apiClient.get(`/tournaments/${tournamentId}/registrations`);
    },
    getStages(tournamentId) {
        return apiClient.get(`/tournaments/${tournamentId}/stages`);
    },
    getMatches(tournamentId) {
        return apiClient.get(`/tournaments/${tournamentId}/matches`);
    },
    async createTournament(data, token) {
        return apiClient.post('/tournaments', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async updateTournament(id, data, token) {
        return apiClient.put(`/tournaments/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async deleteTournament(id, token) {
        return apiClient.delete(`/tournaments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async registerTeam(tournamentId, data, token) {
        return apiClient.post(`/tournaments/${tournamentId}/registrations`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default TournamentsService;