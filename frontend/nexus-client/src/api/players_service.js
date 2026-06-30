import apiClient from './api_client';

const PlayersService = {
    getAllPlayers(params) {
        return apiClient.get('/players', { params });
    },
    getPlayerById(id) {
        return apiClient.get(`/players/${id}`);
    },
    async createPlayer(playerData, token) {
        return apiClient.post('/players', playerData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async updatePlayer(id, playerData, token) {
        return apiClient.put(`/players/${id}`, playerData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    async deletePlayer(id, token) {
        return apiClient.delete(`/players/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default PlayersService;