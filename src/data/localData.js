import puissanceGenetique from './puissance-genetique.json';
import chocSpatioTemporel from './choc-spatio-temporel.json';
import ileFabuleuse from './ile-fabuleuse.json';

const sets = {
  'puissance-genetique': puissanceGenetique,
  'choc-spatio-temporel': chocSpatioTemporel,
  'ile-fabuleuse': ileFabuleuse
};

// Extrait le nom du set à partir du setId complet (ex: "bh6swrnbnb0xqp7-lle-fabuleuse" -> "ile-fabuleuse")
const getSimpleSetId = (fullSetId) => {
  const match = fullSetId.match(/^[^-]+-(.+)$/);
  return match ? match[1] : fullSetId;
};

// Ajoute uniquement le setId simplifié à chaque carte
Object.entries(sets).forEach(([_, setData]) => {
  const simpleSetId = getSimpleSetId(setData.setId);
  setData.cards.forEach(card => {
    card.setId = simpleSetId.toLowerCase();
  });
});

export const getLocalCards = (setId) => {
  return sets[setId]?.cards || [];
};

export const getAllLocalCards = () => {
  return Object.values(sets).flatMap(set => set.cards);
};

export const getCardById = (cardId) => {
  return getAllLocalCards().find(card => card.id === cardId);
};

export const getTradeableCards = () => {
  return getAllLocalCards().filter(card => {
    // Une carte est échangeable si elle a :
    // - 1 à 4 diamants et pas d'étoiles ni de couronnes
    // - OU exactement 1 étoile et pas de diamants ni de couronnes
    return (
      (card.rarity.diamonds > 0 && card.rarity.stars === 0 && card.rarity.crowns === 0) ||
      (card.rarity.diamonds === 0 && card.rarity.stars === 1 && card.rarity.crowns === 0)
    );
  });
};