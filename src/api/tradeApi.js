import { getTradeableCards } from "../data/localData";

const API_BASE_URL = "https://poketrade-back-production.up.railway.app";
// const API_BASE_URL = "http://localhost:3000";

// Récupérer toutes les cartes
export const fetchAllCards = async () => {
    try {
        return getTradeableCards();
    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
};

// Récupérer tous les échanges
export const fetchAllTrades = async () => {
    const response = await fetch(`${API_BASE_URL}/api/trades`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return response.json();
};

// Récupérer les échanges d'un utilisateur
export const fetchUserTrades = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/trades/my-trades`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return response.json();
};

// Récupérer les échanges lorsqu'un utilisateur est connecté
export const fetchTradesByUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/trades/user-trades`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return response.json();
};

// Récupérer les détails d'un échange
export const fetchTradeDetails = async (tradeId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/trades/${tradeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return response.json();
};

// Récupérer les offres d'échange
export const fetchTradeOffers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token d'authentification manquant");
    }
    const response = await fetch(`${API_BASE_URL}/api/trades/user-offers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des offres");
    }

    return response.json();
};

// Créer un nouvel échange
export const createTrade = async (tradeData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token d'authentification manquant");
        }

        const response = await fetch(`${API_BASE_URL}/api/trades`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tradeData),
        });

        if (response.status === 401) {
            throw new Error("Session expirée ou non autorisée");
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Erreur lors de la création de l'échange"
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
};

// Soumettre une offre d'échange
export const submitTradeOffer = async (tradeId, selectedCardId, token) => {
    const response = await fetch(
        `${API_BASE_URL}/api/trades/${tradeId}/offer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                selectedCard: selectedCardId,
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.message || "Une erreur est survenue lors de l'échange"
        );
    }
};

// Accepter une offre d'échange
export const acceptTradeOffer = async (tradeId, offerId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token d'authentification manquant");
    }
    const response = await fetch(
        `${API_BASE_URL}/api/trades/${tradeId}/offer/${offerId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "accepted" }),
        }
    );

    if (!response.ok) {
        throw new Error("Erreur lors de l'acceptation de l'offre");
    }

    return response.json();
};

// Valider un échange
export const validateTrade = async (tradeId, offerId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token d'authentification manquant");
    }
    const response = await fetch(
        `${API_BASE_URL}/api/trades/${tradeId}/offer/${offerId}/complete`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Erreur lors de la validation de l'échange");
    }

    return response.json();
};

// Supprimer un échange
export const deleteTrade = async (tradeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token d'authentification manquant");
    }
    const response = await fetch(`${API_BASE_URL}/api/trades/${tradeId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'échange");
    }

    return response.json();
};
