import { useState, useEffect, useRef } from "react";
import { Plus, Check, Clock } from "lucide-react";
import { fetchTradeOffers } from "../api/tradeApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { enrichOffersWithCards } from "../utils/tradeUtils";
import OfferCard from "../components/cards/OfferCard";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const MyTrades = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "pending";
    const highlightedOfferId = queryParams.get("offerId");

    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(initialTab);

    const offerRefs = useRef({});

    const loadTradeOffers = async () => {
        setIsLoading(true);
        try {
            const data = await fetchTradeOffers();

            const enrichedOffers = enrichOffersWithCards(data);

            setOffers(enrichedOffers);
        } catch (err) {
            console.error("Erreur détaillée:", err);
            setError(
                "Impossible de charger les détails de l'échange. Veuillez réessayer plus tard."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTradeOffers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner message="Chargement des échanges..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-4 py-4 sm:py-8 ">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Mes Échanges
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gérez vos propositions et suivez vos échanges en cours
                    </p>
                </div>
                <a
                    className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap "
                    href="/create-trade"
                >
                    <Plus
                        size={16}
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
                    />
                    <span className="hidden sm:inline">Nouvel échange</span>
                    <span className="sm:hidden">Nouveau</span>
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-blue-50 text-blue-700 rounded-lg p-3 sm:p-4">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                        {offers.length}
                    </p>
                </div>
                <div className="bg-yellow-50 text-yellow-700 rounded-lg p-3 sm:p-4">
                    <p className="text-sm font-medium">En attente</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                        {
                            offers.filter((offer) => offer.status === "pending")
                                .length
                        }
                    </p>
                </div>
                <div className="bg-green-50 text-green-700 rounded-lg p-3 sm:p-4">
                    <p className="text-sm font-medium">Acceptés</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                        {
                            offers.filter(
                                (offer) => offer.status === "accepted"
                            ).length
                        }
                    </p>
                </div>
                <div className="bg-purple-50 text-purple-700 rounded-lg p-3 sm:p-4">
                    <p className="text-sm font-medium">Complétés</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                        {
                            offers.filter(
                                (offer) => offer.status === "completed"
                            ).length
                        }
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 sm:px-6 bg-white shadow mb-6 rounded-lg">
                <nav className="flex w-full p-4" aria-label="Tabs">
                    <button
                        className={`
                    flex-1 py-3 sm:py-4 px-3 sm:px-6 border-b-2 font-medium text-xs sm:text-sm flex items-center justify-center
                   ${
                       filter === "pending"
                           ? "border-blue-500 text-blue-600"
                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                   }
                  `}
                        onClick={() => setFilter("pending")}
                    >
                        <div className="flex flex-col items-center sm:flex-row sm:items-center">
                            <Plus
                                size={16}
                                className="w-5 h-5 mb-1 sm:mb-0 sm:mr-2"
                            />
                            <span>Mes offres</span>
                            <span className="ml-1">
                                (
                                {
                                    offers.filter(
                                        (offer) => offer.status === "pending"
                                    ).length
                                }
                                )
                            </span>
                        </div>
                    </button>

                    <button
                        className={`
                    flex-1 py-3 sm:py-4 px-3 sm:px-6 border-b-2 font-medium text-xs sm:text-sm flex items-center justify-center
                   ${
                       filter === "accepted"
                           ? "border-blue-500 text-blue-600"
                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                   }
                  `}
                        onClick={() => setFilter("accepted")}
                    >
                        <div className="flex flex-col items-center sm:flex-row sm:items-center">
                            <Clock
                                size={16}
                                className="w-5 h-5 mb-1 sm:mb-0 sm:mr-2"
                            />
                            <span>Offres validées</span>
                            <span className="ml-1">
                                (
                                {
                                    offers.filter(
                                        (offer) => offer.status === "accepted"
                                    ).length
                                }
                                )
                            </span>
                        </div>
                    </button>
                    <button
                        className={`
                            flex-1 py-3 sm:py-4 px-3 sm:px-6 border-b-2 font-medium text-xs sm:text-sm flex items-center justify-center
                           ${
                               filter === "completed"
                                   ? "border-blue-500 text-blue-600"
                                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           }
                          `}
                        onClick={() => setFilter("completed")}
                    >
                        <div className="flex flex-col items-center sm:flex-row sm:items-center">
                            <Check
                                size={16}
                                className="w-5 h-5 mb-1 sm:mb-0 sm:mr-2"
                            />
                            <span>Echanges effectués</span>
                            <span className="ml-1">
                                (
                                {
                                    offers.filter(
                                        (offer) => offer.status === "completed"
                                    ).length
                                }
                                )
                            </span>
                        </div>
                    </button>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow p-12 text-center">
                {offers.filter((offer) => offer.status === filter).length ===
                0 ? (
                    <>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {filter === "pending" && (
                                <Plus
                                    size={16}
                                    className="w-8 h-8 text-gray-400"
                                />
                            )}
                            {filter === "completed" && (
                                <Check
                                    size={16}
                                    className="w-8 h-8 text-gray-400"
                                />
                            )}
                            {filter === "accepted" && (
                                <Clock
                                    size={16}
                                    className="w-8 h-8 text-gray-400"
                                />
                            )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === "pending" &&
                                "Aucune proposition d'échange"}
                            {filter === "completed" && "Aucun échange effectué"}
                            {filter === "accepted" && "Aucune offre en cours"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {filter === "pending" &&
                                "Proposez un échange pour une carte que vous recherchez"}
                            {filter === "completed" &&
                                "Vous n'avez pas encore d'échanges effectués"}
                            {filter === "accepted" &&
                                "Vous n'avez pas d'offres en cours"}
                        </p>
                    </>
                ) : (
                    <div>
                        {offers
                            .filter((offer) => offer.status === filter)
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                            )
                            .map((offer) => (
                                <div
                                    key={offer._id}
                                    ref={(el) =>
                                        (offerRefs.current[offer._id] = el)
                                    }
                                >
                                    <OfferCard
                                        offer={offer}
                                        requestedCard={offer.requestedCard}
                                        tradeId={offer._id}
                                        refreshOffers={loadTradeOffers}
                                        isHighlighted={
                                            offer.tradeId === highlightedOfferId
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrades;
