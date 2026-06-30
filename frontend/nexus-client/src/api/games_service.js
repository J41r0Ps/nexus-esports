import apiClient from './api_client';

const GamesService = {
    getAllGames() {
        return apiClient.get('/games');
    }
};

export default GamesService;