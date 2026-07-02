import apiClient from './api_client';

const UploadService = {
    async uploadImage(file, folder, token) {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient.post(`/upload/image?folder=${folder}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default UploadService;