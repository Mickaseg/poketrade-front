const API_BASE_URL = 'https://poketrade-back-production.up.railway.app/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Une erreur est survenue');
    }
    return response.json();
};

export const apiClient = {
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Erreur de connexion au serveur');
        }
    },

    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Erreur de connexion au serveur');
        }
    }
}; 