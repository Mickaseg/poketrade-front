import React from "react";
import { ArrowRight, X } from "lucide-react";
import { getCardImageUrl } from "../utils/imageUtils";

const MultiTradePreview = ({
    requestedCards,
    offeredCards,
    onRemoveOfferedCard,
    displayRarity,
    allCards,
}) => {
    console.log(requestedCards);
    console.log(offeredCards);

    // Trouver les détails complets des cartes offertes
    const offeredCardDetails = offeredCards
        .map((cardId) => allCards.find((card) => card.id === cardId))
        .filter(Boolean);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 my-6">
            <h3 className="text-lg font-semibold text-center mb-4">
                Aperçu des échanges ({requestedCards.length})
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Cartes demandées */}
                <div className="flex-1 border-r-0 md:border-r border-gray-200 p-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                        Cartes demandées ({requestedCards.length})
                    </h4>

                    {requestedCards.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-2">
                            {requestedCards.map((card) => (
                                <div key={card.id} className="relative group">
                                    <img
                                        src={`/images/${card.img}`}
                                        alt={card.name}
                                        className="w-24 h-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-1 rounded-b-lg">
                                        <p className="text-xs font-semibold truncate">
                                            {card.name}
                                        </p>
                                        {displayRarity && card.rarity && (
                                            <p className="text-xs text-gray-200">
                                                {card.rarity}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500 text-sm">
                                Aucune carte sélectionnée
                            </p>
                        </div>
                    )}
                </div>

                {/* Flèche d'échange */}
                <div className="flex items-center justify-center">
                    <ArrowRight size={24} className="text-indigo-500" />
                </div>

                {/* Cartes offertes */}
                <div className="flex-1 border-l-0 md:border-l border-gray-200 p-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                        Cartes proposées ({offeredCardDetails.length})
                    </h4>

                    {offeredCardDetails.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-2">
                            {offeredCardDetails.map((card) => (
                                <div key={card.id} className="relative group">
                                    <img
                                        src={`/images/${card.img}`}
                                        alt={card.name}
                                        className="w-24 h-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                        onClick={() =>
                                            onRemoveOfferedCard &&
                                            onRemoveOfferedCard(card.id)
                                        }
                                        title="Cliquer pour retirer cette carte"
                                    />
                                    <button
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Retirer cette carte"
                                        onClick={() =>
                                            onRemoveOfferedCard &&
                                            onRemoveOfferedCard(card.id)
                                        }
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-1 rounded-b-lg">
                                        <p className="text-xs font-semibold truncate">
                                            {card.name}
                                        </p>
                                        {displayRarity && card.rarity && (
                                            <p className="text-xs text-gray-200">
                                                {card.rarity}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500 text-sm">
                                Aucune carte sélectionnée
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
                <p>
                    {requestedCards.length === 1
                        ? "1 échange sera créé"
                        : `${requestedCards.length} échanges seront créés, un pour
                    chaque carte demandée`}
                </p>
            </div>
        </div>
    );
};

export default MultiTradePreview;
