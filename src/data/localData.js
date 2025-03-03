import puissanceGenetique from "./puissance-genetique.json";
import chocSpatioTemporel from "./choc-spatio-temporel.json";
import ileFabuleuse from "./ile-fabuleuse.json";
import lumiereTriomphale from "./lumiere-triomphale.json";
import PromoA from "./promo-a.json";

const sets = {
    "puissance-genetique": puissanceGenetique,
    "choc-spatio-temporel": chocSpatioTemporel,
    "ile-fabuleuse": ileFabuleuse,
    "lumiere-triomphale": lumiereTriomphale,
    "promo-a": PromoA,
};

export const getLocalCards = (setId) => {
    return sets[setId]?.cards || [];
};

export const getAllLocalCards = () => {
    return Object.values(sets).flatMap((set) => set.cards);
};

export const getCardById = (cardId) => {
    return getAllLocalCards().find((card) => card.id === cardId);
};

export const getTradeableCards = () => {
    return getAllLocalCards().filter((card) => {
        // Une carte est échangeable si elle a une ou deux étoiles
        return (
            card.rarity === "☆" ||
            card.rarity === "♢" ||
            card.rarity === "♢♢" ||
            card.rarity === "♢♢♢" ||
            card.rarity === "♢♢♢♢"
        );
    });
};
