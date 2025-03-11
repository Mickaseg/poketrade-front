import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { enrichTradeWithCards } from "../utils/tradeUtils";
import { Check } from "lucide-react";
import { fetchTradeDetails, submitTradeOffer } from "../api/tradeApi";
import { RequestedCard } from "../components/cards/RequestedCard";
import { ProposedCard } from "../components/cards/ProposedCard";
import { useNotifications } from "../context/NotificationContext";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TradeDetails = () => {
    const { tradeId } = useParams();
    const [trade, setTrade] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const { addNotification } = useNotifications();
    const user = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadTradeDetails = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTradeDetails(tradeId, token);
                setTrade(enrichTradeWithCards(data));
            } catch (err) {
                setError(
                    "Impossible de charger les détails de l'échange. Veuillez réessayer plus tard."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadTradeDetails();
    }, [tradeId, token]);

    const handleSelectedCard = (cardId) => {
        if (selectedCardId === cardId) {
            setSelectedCardId(null);
        } else {
            setSelectedCardId(cardId);
        }
    };

    const handleSubmitTrade = async () => {
        try {
            if (!selectedCardId) {
                throw new Error("Veuillez sélectionner une carte");
            }
            await submitTradeOffer(tradeId, selectedCardId, token);
            toast.success("Offre proposée avec succès!");

            //Créer une notification
            await addNotification({
                // userId: trade.creator._id,
                message: `Vous avez une nouvelle offre d'échange de la part de ${user.username}`,
                type: "trade_proposal",
                trade_id: tradeId,
            });

            navigate("/");
        } catch (error) {
            toast.error("Erreur lors de la proposition d'échange");
            navigate("/");
        }
    };

    if (isLoading) {
        return (
            <div
                className="flex justify-center items-center"
                style={{ minHeight: "calc(100vh - 80px)" }}
            >
                <LoadingSpinner message="Chargement des échanges..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p>{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Retour aux échanges
                    </button>
                </div>
            </div>
        );
    }

    if (!trade) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <p>Échange non trouvé</p>
                <Link
                    to="/"
                    className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retour aux échanges
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-2xl shadow-lg p-4 sm:p-8 max-w-7xl mx-auto">
            {/* SEO */}
            <SEOHead
                title="Détails de l'échange"
                description="Détails de l'échange"
                canonicalUrl="https://tradehelper.seguin.cefim.o2switch.site/trade/${tradeId}"
            />
            {/* Header */}
            <div className="mb-6 sm:mb-8 border-b border-gray-200 pb-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <a className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 hover:from-blue-600 hover:to-indigo-600 transition-all">
                        {trade.creator.username.charAt(0)}
                    </a>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="truncate">
                                Échange proposé par
                            </span>{" "}
                            <a className="text-blue-600 truncate hover:text-blue-700 hover:underline transition-colors">
                                {trade.creator.username}
                            </a>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1 truncate text-left">
                            Créé le lundi 3 mars 2025
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-12">
                {/* Colonne gauche */}
                <div className="lg:w-1/3">
                    <div className="sticky top-8 space-y-6">
                        {/*Carte Recherchée */}
                        <RequestedCard card={trade.requestedCard} />

                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span className="truncate">
                                    Détails de l'échange
                                </span>
                            </h3>
                            <div className="space-y-4 divide-y divide-gray-100">
                                <div className="flex justify-between items-center py-2 gap-4">
                                    <span className="text-sm font-medium text-gray-500 flex-shrink-0">
                                        Statut
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium truncate bg-yellow-100 text-yellow-800">
                                        En attente
                                    </span>
                                </div>
                                <div className="pt-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                            <img
                                                src="https://blog.pokemonpocket.fr/wp-content/uploads/2025/01/piece-echange.png"
                                                alt="Jeton d'échange"
                                                className="w-5 h-5 mr-2"
                                            />
                                            <span>Coût de l'échange</span>
                                        </h4>
                                        <div className="flex items-center justify-center bg-white rounded-lg p-3">
                                            <span className="text-lg font-medium text-gray-900">
                                                {trade.tradeCost}
                                            </span>
                                            <img
                                                src="https://blog.pokemonpocket.fr/wp-content/uploads/2025/01/piece-echange.png"
                                                alt="Jetons"
                                                className="w-5 h-5 ml-2"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-xs text-gray-500">
                                                Barème : ♢/♢♢ (0 jeton) • ♢♢♢
                                                (120 jetons) • ♢♢♢♢ (500 jetons)
                                                • ☆ (400 jetons) • ☆☆/☆☆☆/♛ (Non
                                                échangeable)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div class="pt-4">
                                    <button class="w-full inline-flex justify-center items-center px-4 py-2 text-blue-600 bg-white border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm font-medium mb-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-message-circle w-5 h-5 mr-2"
                                        >
                                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                                        </svg>
                                        Contacter le créateur
                                    </button>
                                    <a
                                        class="w-full inline-flex justify-center items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
                                        href="/users/mattouns"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-user w-5 h-5 mr-2"
                                        >
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle
                                                cx="12"
                                                cy="7"
                                                r="4"
                                            ></circle>
                                        </svg>
                                        Voir le profil
                                    </a>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne droite */}
                <div className="lg:w-2/3">
                    <div className="space-y-6 sm:space-y-8">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 text-sm font-bold flex-shrink-0">
                                    2
                                </span>
                                <span className="truncate">
                                    Cartes proposées
                                </span>
                            </h2>
                        </div>

                        {/* Grille cartes proposées */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {trade.proposedCards.map((card) => (
                                <ProposedCard
                                    key={card.id}
                                    card={card}
                                    isSelected={selectedCardId === card.id}
                                    onClick={handleSelectedCard}
                                />
                            ))}
                        </div>

                        {/* À propos de cet échange */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span className="truncate">
                                    À propos de cet échange
                                </span>
                            </h3>
                            <div className="prose prose-blue max-w-none">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm sm:text-base text-gray-700">
                                        Cet échange a été proposé par{" "}
                                        <a className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                            <strong className="truncate max-w-[150px]">
                                                {trade.creator.username}
                                            </strong>
                                        </a>
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-700">
                                        Il propose{" "}
                                        <strong className="text-blue-600">
                                            {trade.proposedCards.length}{" "}
                                            carte(s)
                                        </strong>{" "}
                                        au choix contre la carte{" "}
                                        <strong className="text-blue-600 break-words">
                                            {trade.requestedCard.name}
                                        </strong>
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 sm:p-6 my-6">
                                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            ></path>
                                        </svg>
                                        <span className="truncate">
                                            Comment fonctionne l'échange ?
                                        </span>
                                    </h4>
                                    <ol className="list-none space-y-4 text-sm sm:text-base text-gray-700">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                                1
                                            </span>
                                            <span>
                                                Vérifiez que vous possédez la
                                                carte recherchée{" "}
                                                <span className="text-blue-600 break-words font-medium">
                                                    {trade.requestedCard.name}
                                                </span>
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                                2
                                            </span>
                                            <span>
                                                Choisissez une carte parmi
                                                celles proposées
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                                3
                                            </span>
                                            <span>
                                                Assurez-vous d'avoir les jetons
                                                nécessaires pour effectuer
                                                l'échange
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                                4
                                            </span>
                                            <span>
                                                Cliquez sur "Accepter l'échange"
                                                et sélectionnez la carte que
                                                vous souhaitez recevoir
                                            </span>
                                        </li>
                                    </ol>
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-yellow-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm sm:text-base text-yellow-800">
                                                <strong className="font-medium block mb-1">
                                                    Important :
                                                </strong>
                                                <span className="block text-sm leading-relaxed">
                                                    Assurez-vous d'avoir
                                                    suffisamment de jetons
                                                    d'échange avant d'accepter.
                                                    Les jetons seront
                                                    automatiquement déduits de
                                                    votre solde lors de
                                                    l'échange.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm sm:text-base text-gray-500 italic text-center sm:text-left">
                        En acceptant cet échange, vous vous engagez à respecter
                        les conditions mentionnées ci-dessus.
                    </p>
                    <button
                        onClick={handleSubmitTrade}
                        disabled={!selectedCardId}
                        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-blue-600 text-white text-base sm:text-lg font-medium rounded-xl transition-all duration-300 shadow-md ${
                            selectedCardId
                                ? "hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
                                : "opacity-50 cursor-not-allowed"
                        }`}
                    >
                        <Check className="w-5 h-5 mr-2" />
                        <span className="truncate">Proposer l'échange</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeDetails;
