import apiClient from './api_client';

const CountriesService = {
    getAllCountries() {
        return apiClient.get('/countries');
    },
    getCountriesWithPlayers() {
        return apiClient.get('/countries/with-players');
    }
};

export default CountriesService;