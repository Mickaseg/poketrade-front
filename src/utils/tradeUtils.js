import { getCardById } from "../data/localData";

// Fonction pour vérifier si deux raretés sont identiques
export const isSameRarity = (rarity1, rarity2) => {
    if (!rarity1 || !rarity2) return false;
    return rarity1 === rarity2;
};

// Fonction pour vérifier si une carte peut être échangée
export const isCardExchangeable = (rarity) => {
    if (!rarity) return false;
    // Une carte est échangeable si elle a une ou deux étoiles
    return (
        rarity === "☆" ||
        rarity === "☆☆" ||
        rarity === "♢" ||
        rarity === "♢♢" ||
        rarity === "♢♢♢" ||
        rarity === "♢♢♢♢"
    );
};

// Obtenir la valeur en jetons basée sur la rareté
export const getTokenInfo = (rarity) => {
    if (!rarity) return null;

    // Définir les valeurs en fonction de la rareté
    switch (rarity) {
        case "♢":
            return { sellValue: 25, exchangeCost: 0 };
        case "♢♢":
            return { sellValue: 25, exchangeCost: 0 };
        case "♢♢♢":
            return { sellValue: 25, exchangeCost: 120 };
        case "♢♢♢♢":
            return { sellValue: 125, exchangeCost: 500 };
        case "☆":
            return { sellValue: 100, exchangeCost: 400 };
        default:
            // Pour les autres cartes échangeables
            if (isCardExchangeable(rarity)) {
                return {
                    sellValue: "Non spécifié",
                    exchangeCost: "Non spécifié",
                };
            }
            return null;
    }
};

// Enrichit un objet trade avec les informations complètes des cartes
export const enrichTradeWithCards = (trade) => {
    if (!trade) return null;

    // Enrichir la carte demandée
    const requestedCard = getCardById(trade.wantedCard);
    const requestedCardRarity = requestedCard.rarity;

    const tradeCost = getTokenInfo(requestedCardRarity);

    // Enrichir les cartes proposées
    const offeredCards = trade.proposedCards.map((card) => {
        const fullCard = getCardById(card);
        return fullCard || card; // Fallback sur la carte originale si non trouvée
    });

    return {
        ...trade,
        requestedCard: requestedCard || trade.wantedCard,
        proposedCards: offeredCards,
        tradeCost: tradeCost.exchangeCost,
    };
};

export const enrichOffersWithCards = (offers) => {
    // Check if offers is an array
    if (!Array.isArray(offers)) {
        console.error("Expected an array of offers, but got:", offers);
        return [];
    }

    if (offers.length === 0) return [];

    // Enrich each offer individually
    return offers.map((offer) => ({
        ...offer,
        wantedCard: getCardById(offer.wantedCard),
        selectedCard: getCardById(offer.selectedCard),
    }));
};
