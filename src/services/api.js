import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',  // 使用 php artisan serve 的默認地址
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const restaurantService = {
    async searchRestaurants(latitude, longitude, radius = 1000) {
        try {
            console.log('Sending request with params:', { latitude, longitude, radius });
            const response = await api.get('/餐廳/搜尋', {
                params: {
                    latitude,
                    longitude,
                    radius
                }
            });
            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                console.error('Network error: 無法連接到後端服務。請確保後端服務正在運行。');
                throw new Error('無法連接到後端服務。請確保後端服務正在運行。');
            }
            if (error.response) {
                console.error('API error:', error.response.data);
                throw new Error(error.response.data.message || '服務器錯誤');
            }
            console.error('Error fetching restaurants:', error);
            throw new Error('發生未知錯誤');
        }
    }
};

export default api;
