import { getCardImageUrl } from '../utils/imageUtils';

const CardSelectTrade = ({
                  card,
                  isSelected = false,
                  onClick = null,
                  onSelect = null,
                  displayRarity,
                  showSelectButton = false
              }) => {
    return (
        <div
            className={`border rounded overflow-hidden ${isSelected ? "border-blue-500 shadow-md" : "border-gray-300"} ${onClick ? "cursor-pointer transition-transform hover:shadow-md" : ""}`}
            onClick={onClick}
        >
            <div className="flex flex-col">
                <div className="relative">
                    {/* En-tête avec le set */}
                    <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white p-1 text-xs flex justify-between items-center">
                        <span>{card.setId}</span>
                        <span className="ml-2">{card.rarity.text || displayRarity(card.rarity)}</span>
                    </div>

                    {/* Image de la carte */}
                    <img
                        src={getCardImageUrl(card)}
                        alt={card.name}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                            e.target.src = `/api/placeholder/200/280`;
                        }}
                    />
                </div>

                {/* Nom de la carte et bouton de sélection */}
                <div className="p-2 bg-white">
                    <p className="font-medium text-sm truncate">{card.name}</p>

                    {isSelected && !showSelectButton && (
                        <div className="mt-1 text-xs text-blue-500 font-medium">
                            Carte sélectionnée
                        </div>
                    )}

                    {showSelectButton && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(card.id);
                            }}
                            className={`mt-2 w-full p-1 text-sm rounded ${
                                isSelected
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {isSelected ? "Sélectionnée" : "Sélectionner"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardSelectTrade;