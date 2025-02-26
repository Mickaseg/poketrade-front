import React, {useEffect, useState} from 'react';
import {Link, useSearchParams, useNavigate} from 'react-router-dom';
import { getCardImageUrl } from '../utils/imageUtils';
import { enrichTradeWithCards } from '../utils/tradeUtils';
const ShareExchange = () => {
    const [searchParams] = useSearchParams();
    const [exchangeData, setExchangeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendCode, setFriendCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExchangeData = async () => {
            setLoading(true);
            try {
                // Récupérer les paramètres de l'URL
                const tradeId = searchParams.get('trade');
                const selectedCardId = searchParams.get('card');
                const friendCodeParam = searchParams.get('friendCode');

                if (friendCodeParam) {
                    setFriendCode(decodeURIComponent(friendCodeParam));
                }

                if (!tradeId || !selectedCardId) {
                    throw new Error("Informations d'échange manquantes");
                }

                // Récupérer les données de l'échange
                const response = await fetch(`https://poketrade-back-production.up.railway.app/api/trades/${tradeId}`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                const trade = enrichTradeWithCards(data);
                // Trouver la carte sélectionnée
                const selectedCard = trade.offeredCards.find(card => card.id === selectedCardId);
                console.log(selectedCard);

                if (!selectedCard) {
                    throw new Error("Carte sélectionnée non trouvée dans l'échange");
                }

                // Construire les données d'échange
                setExchangeData({
                    requester: trade.requester,
                    requestedCard: trade.requestedCard,
                    selectedCard: selectedCard,
                    tradeId: tradeId
                });

            } catch (err) {
                console.error('Erreur:', err);
                setError(err.message || "Une erreur s'est produite lors du chargement des données d'échange");
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeData();
    }, [searchParams]);

    // Copier le code ami dans le presse-papier
    const copyFriendCode = () => {
        navigator.clipboard.writeText(friendCode).then(
            () => {
                // Vous pourriez ajouter un état pour montrer un message de succès
                alert("Code ami copié!");
            },
            (err) => {
                console.error('Erreur lors de la copie: ', err);
            }
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <p className="mt-4 text-gray-600">Chargement des détails de l'échange...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-2xl mx-auto">
                    <p className="font-bold">Erreur</p>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/trades')}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retour aux échanges
                    </button>
                </div>
            </div>
        );
    }

    if (!exchangeData) {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <p>Aucune donnée d'échange trouvée</p>
                <Link to="/trades" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                    Retour aux échanges
                </Link>
            </div>
        );
    }

    const {requester, requestedCard, selectedCard} = exchangeData;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 bg-blue-500 text-white">
                    <h1 className="text-2xl font-bold">{requester} te propose cet échange</h1>
                    <p className="mt-2 text-blue-100">
                        Utilise ces informations pour effectuer l'échange dans l'application Pokémon TCG Pocket
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <div className="mb-3 text-center">
                                <h3 className="font-bold text-lg text-gray-800">On te propose</h3>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 w-full max-w-xs">
                                <img
                                    src={getCardImageUrl(selectedCard)}
                                    alt={selectedCard.name}
                                    className="w-full h-auto rounded"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-card.png";
                                    }}
                                />
                                <div className="mt-3 text-center">
                                    <h4 className="font-semibold text-gray-900">{selectedCard.name}</h4>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <p>Set: {selectedCard.setName || selectedCard.setId}</p>
                                        <p>Numéro: {selectedCard.number}</p>
                                        {selectedCard.rarity && (
                                            <p>Rareté: {selectedCard.rarity.text || `${selectedCard.rarity.diamonds || 0} diamants, ${selectedCard.rarity.stars || 0} étoiles`}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="bg-gray-200 rounded-full p-3">
                                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                </svg>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <div className="mb-3 text-center">
                                <h3 className="font-bold text-lg text-gray-800">Pour</h3>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 w-full max-w-xs">
                                <img
                                    src={getCardImageUrl(requestedCard)}
                                    alt={requestedCard.name}
                                    className="w-full h-auto rounded"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-card.png";
                                    }}
                                />
                                <div className="mt-3 text-center">
                                    <h4 className="font-semibold text-gray-900">{requestedCard.name}</h4>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <p>Set: {requestedCard.setName || requestedCard.setId}</p>
                                        <p>Numéro: {requestedCard.number}</p>
                                        {requestedCard.rarity && (
                                            <p>Rareté: {requestedCard.rarity.text || `${requestedCard.rarity.diamonds || 0} diamants, ${requestedCard.rarity.stars || 0} étoiles`}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section code ami */}
                    {friendCode && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                            <h3 className="font-medium text-blue-800 flex items-center mb-2">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                Code ami
                            </h3>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <code
                                    className="bg-white px-4 py-2 rounded border border-blue-200 font-mono text-lg text-blue-800">
                                    {friendCode}
                                </code>
                                <button
                                    onClick={copyFriendCode}
                                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                    title="Copier le code ami"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm text-blue-600 mt-2">
                                Utilise ce code ami pour trouver {requester} dans le jeu
                            </p>
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-yellow-50 rounded-md border border-yellow-100">
                        <h3 className="font-medium text-yellow-800 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Comment procéder à l'échange
                        </h3>
                        <ol className="mt-2 ml-6 list-decimal text-sm text-yellow-700 space-y-1">
                            <li>Ouvre l'application Pokémon TCG Pocket sur ton appareil</li>
                            <li>Va dans la section échange du jeu</li>
                            <li>Trouve le joueur <span className="font-semibold">{requester}</span> et propose l'échange
                            </li>
                            <li>Sélectionne la carte <span
                                className="font-semibold">{requestedCard.name}</span> (#{requestedCard.number}) du
                                set <span
                                    className="font-semibold">{requestedCard.setName || requestedCard.setId}</span> que
                                tu vas donner
                            </li>
                        </ol>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Retour aux échanges
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareExchange;