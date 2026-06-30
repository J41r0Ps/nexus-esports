import apiClient from './api_client';

const CountriesService = {
    getAllCountries() {
        return apiClient.get('/countries');
    }
};

export default CountriesService;