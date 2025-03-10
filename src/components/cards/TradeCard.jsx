import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PlaceholderAvatar from "../common/PlaceholderAvatar";
import { getTimeDisplay } from "../../utils/timeUtils";
const TradeCard = ({ trade }) => {
    const { isAuthenticated } = useAuth();

    // Limiter le nombre de cartes affichées en aperçu
    const getPreviewCards = (cards, limit = 3) => {
        const visibleCards = cards.slice(0, limit);
        const remainingCount = cards.length - limit;

        return {
            visibleCards,
            remainingCount: remainingCount > 0 ? remainingCount : 0,
        };
    };

    const { visibleCards, remainingCount } = getPreviewCards(
        trade.proposedCards
    );

    return (
        <div
            key={trade._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
        >
            {/* En-tête avec info de base */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <PlaceholderAvatar name={trade.creator.username} />

                        <h2 className="text-lg font-semibold text-gray-800">
                            {trade.creator.username}
                        </h2>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                        {getTimeDisplay(trade.createdAt)}
                    </span>
                </div>
            </div>

            {/* Carte demandée */}
            <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-[70%] overflow-hidden">
                        <img
                            src={`/images/${trade.requestedCard.img}`}
                            alt={trade.proposedCards.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/placeholder-card.png";
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Aperçu des cartes proposées */}
            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Cartes proposées ({trade.proposedCards.length}):
                </h3>

                <div className="flex gap-2 mb-3">
                    {visibleCards.map((card) => (
                        <div
                            key={card.id}
                            className="w-16 h-22 bg-gray-200 rounded overflow-hidden relative"
                        >
                            <img
                                src={`/images/${card.img}`}
                                alt={card.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/placeholder-card.png";
                                }}
                            />
                        </div>
                    ))}

                    {remainingCount > 0 && (
                        <div className="w-16 h-22 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-600">
                                +{remainingCount}
                            </span>
                        </div>
                    )}
                </div>

                {/* Lien vers la page de détails */}
                {isAuthenticated && (
                    <Link
                        to={`/trade/${trade._id}`}
                        className="btn btn-primary w-full text-center "
                    >
                        Voir les détails
                    </Link>
                )}
            </div>
        </div>
    );
};

export default TradeCard;
