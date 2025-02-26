import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { enrichTradeWithCards } from "../utils/tradeUtils";
import { getCardImageUrl } from "../utils/imageUtils";

const TradeDetails = () => {
    const { tradeId } = useParams();
    const [trade, setTrade] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [friendCode, setFriendCode] = useState("");
    const [exchangeLink, setExchangeLink] = useState("");
    const [linkCopied, setLinkCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTradeDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://poketrade-back-production.up.railway.app/api/trades/${tradeId}`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                const enrichedTrade = enrichTradeWithCards(data);
                setTrade(enrichedTrade);
            } catch (err) {
                console.error('Erreur:', err);
                setError("Impossible de charger les détails de l'échange. Veuillez réessayer plus tard.");
            } finally {
                setIsLoading(false);
            }
        };

        if (tradeId) {
            fetchTradeDetails();
        }
    }, [tradeId]);

    console.log(trade);

    // Générer le lien d'échange
    const generateExchangeLink = () => {
        if (!selectedCardId) {
            alert("Veuillez sélectionner une carte pour l'échange");
            return;
        }

        // Créer un lien avec les paramètres nécessaires
        const baseUrl = window.location.origin;
        let link = `${baseUrl}/share-exchange?trade=${tradeId}&card=${selectedCardId}`;

        // Ajouter le code ami s'il est renseigné
        if (friendCode.trim()) {
            link += `&friendCode=${encodeURIComponent(friendCode.trim())}`;
        }

        setExchangeLink(link);
    };
    console.log(selectedCardId);

    // Validation du code ami (format facultatif)
    // const isValidFriendCode = (code) => {
    //     // Le code est facultatif, donc une chaîne vide est valide
    //     if (!code.trim()) return true;
    //
    //     // Format typique d'un code ami (ajustez selon les spécifications du jeu)
    //     // Par exemple: XXXX-XXXX-XXXX ou XXXX XXXX XXXX
    //     const friendCodePattern = /^[\w\d]{4}[-\s]?[\w\d]{4}[-\s]?[\w\d]{4}$/;
    //     return friendCodePattern.test(code);
    // };

    // Copier le lien dans le presse-papier
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(exchangeLink).then(
            () => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 3000);
            },
            (err) => {
                console.error('Erreur lors de la copie: ', err);
            }
        );
    };

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

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <p className="mt-4 text-gray-600">Chargement des détails de l'échange...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/trades')}
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
                <Link to="/trades" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                    Retour aux échanges
                </Link>
            </div>
        );
    }

    const statusDisplay = getStatusDisplay(trade.status);
    const selectedCard = selectedCardId ? trade.offeredCards.find(card => card.id === selectedCardId) : null;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <Link to="/trades" className="text-blue-500 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour aux échanges
                </Link>
                <span className={`px-3 py-1 rounded text-sm text-white ${statusDisplay.bgColor}`}>
                    {statusDisplay.text}
                </span>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">

                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-900">
                        Détails de l'échange
                    </h1>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Proposé par: <span className="font-semibold">{trade.requester}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1 sm:mt-0">
                            Date de création: {new Date(trade.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Carte demandée */}
                <div className="p-6 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Carte demandée</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 lg:w-1/4">
                            <div className="bg-white p-2 rounded-lg shadow">
                                <img
                                    src={getCardImageUrl(trade.requestedCard)}
                                    alt={trade.requestedCard.name}
                                    className="w-full h-auto rounded"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-card.png";
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{trade.requestedCard.name}</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Set: {trade.requestedCard.setName || trade.requestedCard.setId}
                            </p>
                            <p className="text-sm text-gray-600">
                                Numéro: {trade.requestedCard.number}
                            </p>
                            {trade.requestedCard.rarity && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">
                                        Rareté: {trade.requestedCard.rarity.text || `${trade.requestedCard.rarity.diamonds || 0} diamants, ${trade.requestedCard.rarity.stars || 0} étoiles`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions pour sélectionner une carte */}
                <div className="p-4 bg-blue-50 border-y border-blue-100">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800">
                            Sélectionnez une carte ci-dessous pour générer un lien d'échange
                        </p>
                    </div>
                </div>

                {/* Cartes proposées avec sélection */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Cartes proposées ({trade.offeredCards.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {trade.offeredCards.map(card => (
                            <div
                                key={card.id}
                                className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedCardId === card.id
                                    ? "ring-2 ring-blue-500 shadow-md"
                                    : "hover:border-blue-300"
                                    }`}
                                onClick={() => setSelectedCardId(card.id)}
                            >
                                <div className="relative">
                                    {/* Indication de sélection */}
                                    {selectedCardId === card.id && (
                                        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Set indicator */}
                                    <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white p-1 text-xs">
                                        {card.setName || card.setId} - #{card.number}
                                    </div>
                                    <img
                                        src={getCardImageUrl(card)}
                                        alt={card.name}
                                        className="w-full h-auto"
                                        onError={(e) => {
                                            e.target.src = "/placeholder-card.png";
                                        }}
                                    />
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm truncate">{card.name}</h4>
                                    {card.rarity && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            {card.rarity.text || `${card.rarity.diamonds || 0} diamants, ${card.rarity.stars || 0} étoiles`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section pour générer et copier le lien */}
                <div className="p-6 bg-gray-50 border-t">
                    {/* Champ pour le code ami */}
                    <div className="mb-4">
                        <label htmlFor="friendCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Code ami (facultatif)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                id="friendCode"
                                value={friendCode}
                                onChange={(e) => setFriendCode(e.target.value)}
                                placeholder="Ex: 2677385793310841"
                                className={`border p-2 rounded w-full sm:w-64 border-gray-300'}`}
                            />
                            {/*{!isValidFriendCode(friendCode) && friendCode.trim() !== "" && (*/}
                            {/*    <p className="text-xs text-red-500">Format invalide. Utilisez le format XXXX-XXXX-XXXX</p>*/}
                            {/*)}*/}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Ajoutez votre code ami pour faciliter la recherche dans le jeu</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <button
                            onClick={generateExchangeLink}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                            disabled={!selectedCardId}
                        >
                            Générer un lien d'échange
                        </button>

                        {exchangeLink && (
                            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <input
                                    type="text"
                                    value={exchangeLink}
                                    readOnly
                                    className="flex-1 p-2 border rounded text-sm w-full sm:w-auto"
                                />
                                <button
                                    onClick={copyLinkToClipboard}
                                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm flex items-center"
                                >
                                    {linkCopied ? (
                                        <>
                                            <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copié!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copier
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {exchangeLink && selectedCard && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-md">
                            <h3 className="font-medium text-green-800 mb-2">Proposition d'échange</h3>
                            <p className="text-green-700">
                                <span className="font-semibold">{trade.requester}</span> te propose d'échanger <span className="font-semibold">{selectedCard.name}</span> contre <span className="font-semibold">{trade.requestedCard.name}</span>
                                {friendCode && <span> (Code ami: <span className="font-mono">{friendCode}</span>)</span>}
                            </p>
                            <p className="text-sm text-green-600 mt-2">
                                Partagez ce lien pour faciliter l'échange dans l'application du jeu.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TradeDetails;