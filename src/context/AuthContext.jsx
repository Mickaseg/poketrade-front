import { createContext, useContext, useState, useEffect } from "react";
import {
    decodeToken,
    setAuthToken,
    getAuthToken
} from "../utils/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Vérifiez l'authentification (token dans localStorage, etc.)
        const checkAuth = async () => {
            setLoadingAuth(true);
            try {
                // Votre logique de vérification d'authentification
                const token = localStorage.getItem('token'); // ou autre méthode
                
                if (token) {
                    // Validez le token si nécessaire
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                        setIsAuthenticated(true);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Erreur de vérification d'authentification:", error);
                setIsAuthenticated(false);
            } finally {
                setLoadingAuth(false);
            }
        };
        
        checkAuth();
    }, []);

    const login = (userData) => {
        setAuthToken(userData.token);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
    };

    const getUserInfo = () => {
        const token = getAuthToken();
        if (token) {
            return decodeToken(token);
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout, getUserInfo, loadingAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
