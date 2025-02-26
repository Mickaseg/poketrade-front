import { getCardById } from '../data/localData';

// Fonction pour vérifier si deux raretés sont identiques
export const isSameRarity = (rarity1, rarity2) => {
    if (!rarity1 || !rarity2) return false;

    return (
        rarity1.diamonds === rarity2.diamonds &&
        rarity1.stars === rarity2.stars &&
        rarity1.crowns === rarity2.crowns
    );
};

// Fonction pour vérifier si une carte peut être échangée
export const isCardExchangeable = (rarity) => {
    if (!rarity) return false;

    // Les cartes avec 2+ étoiles ou couronne ne peuvent pas être échangées
    if (rarity.stars >= 2 || rarity.crowns > 0) {
        return false;
    }

    // Règles pour les cartes échangeables:
    // 1. Cartes avec diamants (1 ou 2 diamants aussi)
    // 2. Cartes avec exactement 1 étoile
    return (
        (rarity.diamonds > 0 && rarity.stars === 0 && rarity.crowns === 0) ||
        (rarity.diamonds === 0 && rarity.stars === 1 && rarity.crowns === 0)
    );
};

// Obtenir la valeur en jetons basée sur la rareté
export const getTokenInfo = (rarity) => {
    if (!rarity) return null;

    // Vérifier le type de rareté
    if (rarity.diamonds === 3 && rarity.stars === 0 && rarity.crowns === 0) {
        return { sellValue: 25, exchangeCost: 120 };
    }
    if (rarity.diamonds === 4 && rarity.stars === 0 && rarity.crowns === 0) {
        return { sellValue: 125, exchangeCost: 500 };
    }
    if (rarity.diamonds === 0 && rarity.stars === 1 && rarity.crowns === 0) {
        return { sellValue: 100, exchangeCost: 400 };
    }

    // Pour les autres cartes échangeables (1-2 diamants), pas de valeur spécifique en jetons
    if (isCardExchangeable(rarity)) {
        return { sellValue: "Non spécifié", exchangeCost: "Non spécifié" };
    }

    return null;
};

// Fonction pour afficher la rareté de façon lisible
export const displayRarity = (rarity) => {
    if (!rarity) return "Inconnue";

    let display = "";

    if (rarity.diamonds > 0) {
        display += `${rarity.diamonds} ${rarity.diamonds > 1 ? "diamants" : "diamant"}`;
    }

    if (rarity.stars > 0) {
        if (display) display += ", ";
        display += `${rarity.stars} ${rarity.stars > 1 ? "étoiles" : "étoile"}`;
    }

    if (rarity.crowns > 0) {
        if (display) display += ", ";
        display += `${rarity.crowns} ${rarity.crowns > 1 ? "couronnes" : "couronne"}`;
    }

    return display || "Base";
};

// Enrichit un objet trade avec les informations complètes des cartes
export const enrichTradeWithCards = (trade) => {
  if (!trade) return null;

  // Enrichir la carte demandée
  const requestedCard = getCardById(trade.requestedCardId);
  
  // Enrichir les cartes proposées
  const offeredCards = trade.offeredCards.map(card => {
    const fullCard = getCardById(card);
    return fullCard || card; // Fallback sur la carte originale si non trouvée
  });

  return {
    ...trade,
    requestedCard: requestedCard || trade.requestedCard,
    offeredCards
  };
};