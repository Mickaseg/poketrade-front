export const getCardImageUrl = (card) => {
  // Utilise le setId simplifié de la carte
  const setId = card.setId || 'default';
  // Formate le numéro avec des zéros devant si nécessaire (1 -> 001, 99 -> 099)
  const formattedNumber = card.number.padStart(3, '0');
  // Retourne l'URL de l'image locale depuis le dossier public/images/[set]
  return `/images/${setId}/${formattedNumber}.webp`;
};
