import { getCardImageUrl } from '../utils/imageUtils';
const CardDetails = ({
                         card,
                         displayRarity,
                         getTokenInfo,
                         showExchangeInfo = true
                     }) => {
    if (!card) return null;

    const tokenInfo = getTokenInfo(card.rarity);

    return (
        <div className="mb-6 p-4 bg-gray-100 rounded">
            <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <img
                        src={getCardImageUrl(card)}
                        alt={card.name}
                        className="w-full h-auto rounded shadow"
                        onError={(e) => {
                            e.target.src = `/api/placeholder/200/280`;
                        }}
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{card.name}</h3>
                    <p className="text-gray-600 mt-1">
                        Set: {card.setName || card.setId || "Non spécifié"}
                    </p>
                    <p className="mt-2">
                        Rareté: {displayRarity(card.rarity)} {card.rarity.text}
                    </p>

                    {tokenInfo && (
                        <div className="mt-4 p-3 bg-white rounded shadow-sm">
                            <p className="font-medium">Information sur les jetons:</p>
                            {/*<p className="mt-1">*/}
                            {/*    Valeur de conversion: {tokenInfo.sellValue} Jetons d'Échange*/}
                            {/*</p>*/}
                            <p>
                                Coût
                                d'échange: {tokenInfo.exchangeCost > 0 ? `${tokenInfo.exchangeCost} Jetons d'Échange` : 'Gratuit'}
                            </p>
                        </div>
                    )}

                    {showExchangeInfo && (
                        <>
                        <p className="text-sm text-gray-600 mt-4">
                            Seules les cartes de même rareté peuvent être proposées pour l'échange.

                        </p>
                        <p className="text-red-600">
                        N'oubliez pas qu'il vous faut plus d'un exemplaire de la carte pour pouvoir l'échanger !
                        </p>
                        </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default CardDetails;