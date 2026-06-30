import apiClient from './api_client';

const TeamsService = {
    // Public
    getAllTeams(params) {
        return apiClient.get('/teams', { params });
    },
    getTeamById(id) {
        return apiClient.get(`/teams/${id}`);
    },

    // Protected — admin only
    async createTeam(teamData, token) {
        return apiClient.post('/teams', teamData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async updateTeam(id, teamData, token) {
        return apiClient.put(`/teams/${id}`, teamData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async deleteTeam(id, token) {
        return apiClient.delete(`/teams/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default TeamsService;