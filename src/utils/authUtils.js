import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        // // Vérifier si le token est expiré
        // if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        //     return null;
        // }
        return decoded;
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

export const isTokenValid = () => {
    const token = getAuthToken();
    if (!token) return false;
    
    const decoded = decodeToken(token);
    return decoded !== null;
}; 