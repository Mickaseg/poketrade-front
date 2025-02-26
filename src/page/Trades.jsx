import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enrichTradeWithCards } from '../utils/tradeUtils';
import { getCardImageUrl } from '../utils/imageUtils';
import { LoadingSpinner } from "../components/LoadingSpinner";

export const Trades = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrades = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://poketrade-back-production.up.railway.app/api/trades', {
                    method: 'GET',
                    credentials: 'include', // Important si vous utilisez des cookies/sessions
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();


                // Vérifier que data est un tableau
                if (!Array.isArray(data)) {
                    console.error('Les données reçues ne sont pas un tableau:', data);
                    throw new Error('Format de données invalide');
                }

                // Enrichir chaque trade avec les informations complètes des cartes
                const enrichedTrades = data.map(trade => {
                    const enriched = enrichTradeWithCards(trade);

                    return enriched;
                });

                setTrades(enrichedTrades);
            } catch (err) {
                console.error('Erreur détaillée:', err);
                setError("Impossible de charger les échanges. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, []);

    // Fonction pour obtenir le statut avec le bon libellé et couleur
    const getStatusDisplay = (status) => {
        switch (status) {
            case "pending":
                return { text: "En attente", bgColor: "bg-yellow-500" };
            case "accepted":
                return { text: "Accepté", bgColor: "bg-green-500" };
            case "rejected":
                return { text: "Refusé", bgColor: "bg-red-500" };
            default:
                return { text: status, bgColor: "bg-gray-500" };
        }
    };

    // Limiter le nombre de cartes affichées en aperçu
    const getPreviewCards = (cards, limit = 5) => {
        const visibleCards = cards.slice(0, limit);
        const remainingCount = cards.length - limit;

        return {
            visibleCards,
            remainingCount: remainingCount > 0 ? remainingCount : 0
        };
    };

    if (loading) {
        return (
            <LoadingSpinner message="Chargement des échanges..." />
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            const fetchTrades = async () => {
                                setLoading(true);
                                try {
                                    const response = await fetch('http://localhost:5000/api/trades');

                                    if (!response.ok) {
                                        throw new Error(`Erreur HTTP: ${response.status}`);
                                    }

                                    const data = await response.json();

                                    // Vérifier que data est un tableau
                                    if (!Array.isArray(data)) {
                                        console.error('Les données reçues ne sont pas un tableau:', data);
                                        throw new Error('Format de données invalide');
                                    }

                                    // Enrichir chaque trade avec les informations complètes des cartes
                                    const enrichedTrades = data.map(trade => {
                                        const enriched = enrichTradeWithCards(trade);
                                        return enriched;
                                    });


                                    setTrades(enrichedTrades);
                                } catch (err) {
                                    console.error('Erreur détaillée:', err);
                                    setError("Impossible de charger les échanges. Veuillez réessayer plus tard.");
                                } finally {
                                    setLoading(false);
                                }
                            };

                            fetchTrades();
                        }}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Échanges disponibles</h1>

            {trades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trades.map(trade => {
                        const { visibleCards, remainingCount } = getPreviewCards(trade.offeredCards);
                        const statusDisplay = getStatusDisplay(trade.status);

                        return (
                            <div key={trade._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                                {/* En-tête avec info de base */}
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Demande de {trade.requester}
                                        </h2>
                                        <span className={`px-2 py-1 rounded text-xs text-white ${statusDisplay.bgColor}`}>
                                            {statusDisplay.text}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Création: {new Date(trade.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Carte demandée */}
                                <div className="p-4 bg-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Carte demandée:</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden">
                                            <img
                                                src={getCardImageUrl(trade.requestedCard)}
                                                alt={trade.requestedCard.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/placeholder-card.png";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{trade.requestedCard.name}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Set: {trade.requestedCard.setName || trade.requestedCard.setId}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Aperçu des cartes proposées */}
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Cartes proposées ({trade.offeredCards.length}):
                                    </h3>

                                    <div className="flex gap-2 mb-3">
                                        {visibleCards.map(card => (
                                            <div key={card.id} className="w-16 h-22 bg-gray-200 rounded overflow-hidden relative">
                                                <img
                                                    src={getCardImageUrl(card)}
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
                                                <span className="text-sm font-semibold text-gray-600">+{remainingCount}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lien vers la page de détails */}
                                    <Link
                                        to={`/trades/${trade._id}`}
                                        className="block w-full text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        Voir les détails
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun échange disponible</h3>
                    <p className="mt-1 text-sm text-gray-500">Soyez le premier à proposer un échange!</p>
                    <div className="mt-6">
                        <Link
                            to="/create-trade"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Créer un échange
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trades;