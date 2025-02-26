import { isCardExchangeable } from '../utils/tradeUtils';
import { getTradeableCards } from '../data/localData';


const API_BASE_URL = 'https://poketrade-back-production.up.railway.app';

// Récupérer toutes les cartes
export const fetchAllCards = async () => {
    try {
      return getTradeableCards();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};

// Créer un nouvel échange
export const createTrade = async (tradeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tradeData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'échange');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};