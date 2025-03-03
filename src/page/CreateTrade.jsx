import { useState, useEffect } from "react";
import {
    isSameRarity,
    isCardExchangeable,
    getTokenInfo,
    displayRarity,
} from "../utils/tradeUtils";
import { fetchAllCards, createTrade } from "../api/tradeApi";
import { useNavigate } from "react-router-dom";
import CardGrid from "../components/CardGrid.jsx";
import CardDetails from "../components/CardDetails";
import SearchInput from "../components/SearchInput";
import StepNavigation from "../components/StepNavigation";
import LoadingSpinner from "../components/LoadingSpinner";
import MultiTradePreview from "../components/MultiTradePreview";

const CreateTrade = () => {
    const [step, setStep] = useState(1);
    const [requestedCards, setRequestedCards] = useState([]);
    const [requestedCardDetails, setRequestedCardDetails] = useState([]);
    const [offeredCards, setOfferedCards] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchTermStep3, setSearchTermStep3] = useState("");
    const navigate = useNavigate();

    // Charger les cartes au démarrage
    useEffect(() => {
        const loadCards = async () => {
            try {
                setIsLoading(true);
                const cards = await fetchAllCards();
                setAllCards(cards);
            } catch (error) {
                setErrorMessage(
                    "Erreur lors du chargement des cartes. Veuillez réessayer."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadCards();
    }, []);

    // Mettre à jour les détails des cartes sélectionnées
    useEffect(() => {
        if (requestedCards.length > 0 && allCards.length > 0) {
            const selectedDetails = requestedCards
                .map((cardId) => allCards.find((card) => card.id === cardId))
                .filter(Boolean);
            setRequestedCardDetails(selectedDetails);
        } else {
            setRequestedCardDetails([]);
        }
    }, [requestedCards, allCards]);

    // Filtrer les cartes offertes en fonction des cartes demandées
    useEffect(() => {
        if (step === 2 && requestedCardDetails.length > 0) {
            // Vérifier si toutes les cartes demandées peuvent être échangées
            const nonExchangeableCards = requestedCardDetails.filter(
                (card) => !isCardExchangeable(card.rarity)
            );

            if (nonExchangeableCards.length > 0) {
                setErrorMessage(
                    "Certaines cartes sélectionnées ne peuvent pas être échangées selon les règles du jeu."
                );
                setFilteredCards([]);
                return;
            }

            // Utiliser la rareté de la première carte demandée
            const firstCardRarity = requestedCardDetails[0].rarity;

            setFilteredCards(
                allCards.filter(
                    (card) =>
                        !requestedCards.includes(card.id) &&
                        isSameRarity(card.rarity, firstCardRarity) &&
                        isCardExchangeable(card.rarity)
                )
            );
        }
    }, [step, requestedCardDetails, requestedCards, allCards]);

    // Réinitialiser les cartes offertes lors du changement des cartes demandées
    useEffect(() => {
        setOfferedCards([]);
        setErrorMessage("");
    }, [requestedCards]);

    // Fonction pour filtrer les cartes par recherche à l'étape 1
    const getFilteredCardsBySearch = () => {
        // Si aucune carte n'est sélectionnée, on filtre juste par le terme de recherche
        const searchFiltered = allCards.filter(
            (card) =>
                card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.number.includes(searchTerm)
        );

        // Si au moins une carte est sélectionnée, on filtre aussi par rareté
        if (requestedCards.length > 0) {
            const firstSelectedCard = allCards.find(
                (card) => card.id === requestedCards[0]
            );
            if (firstSelectedCard) {
                return searchFiltered.filter(
                    (card) => card.rarity === firstSelectedCard.rarity
                );
            }
        }

        return searchFiltered;
    };

    // Filtrer les cartes basées sur le terme de recherche et la rareté
    const getFilteredCardsForStep3 = () => {
        const firstRequestedCard = requestedCardDetails[0];
        if (!firstRequestedCard) return [];

        return filteredCards.filter(
            (card) => card.rarity === firstRequestedCard.rarity
        );
    };

    const handleNextStep = () => {
        if (step === 1 && requestedCards.length === 0) {
            setErrorMessage("Veuillez sélectionner au moins une carte");
            return;
        }

        setErrorMessage("");
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setErrorMessage("");
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (requestedCards.length === 0) {
            setErrorMessage(
                "Veuillez sélectionner au moins une carte demandée"
            );
            return;
        }

        if (offeredCards.length === 0) {
            setErrorMessage(
                "Veuillez sélectionner au moins une carte à offrir"
            );
            return;
        }

        try {
            setIsLoading(true);

            // Créer un échange pour chaque carte demandée
            const promises = requestedCards.map((cardId) => {
                const tradeData = {
                    wantedCard: cardId,
                    proposedCards: offeredCards,
                };
                return createTrade(tradeData);
            });

            await Promise.all(promises);

            // Réinitialiser le formulaire
            setStep(1);
            setRequestedCards([]);
            setRequestedCardDetails([]);
            setOfferedCards([]);
            setErrorMessage("");
            
            navigate("/");
        } catch (error) {
            setErrorMessage(
                "Erreur lors de la création des échanges. Veuillez réessayer."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Gestionnaire de sélection de carte pour l'étape 1
    const handleRequestedCardSelect = (cardId) => {
        const selectedCard = allCards.find((card) => card.id === cardId);
        if (!selectedCard) return;

        setRequestedCards((prev) => {
            // Si la carte est déjà sélectionnée, on la retire
            if (prev.includes(cardId)) {
                const newSelection = prev.filter((id) => id !== cardId);
                // Mise à jour des détails des cartes
                setRequestedCardDetails(
                    newSelection.map((id) =>
                        allCards.find((card) => card.id === id)
                    )
                );
                return newSelection;
            }

            // Si c'est la première carte sélectionnée, on l'ajoute simplement
            if (prev.length === 0) {
                setRequestedCardDetails([selectedCard]);
                return [cardId];
            }

            // Sinon, on vérifie si la rareté correspond
            const firstCardId = prev[0];
            const firstCard = allCards.find((card) => card.id === firstCardId);

            if (firstCard && firstCard.rarity === selectedCard.rarity) {
                const newSelection = [...prev, cardId];
                setRequestedCardDetails(
                    newSelection.map((id) =>
                        allCards.find((card) => card.id === id)
                    )
                );
                return newSelection;
            } else {
                setErrorMessage(
                    "Vous ne pouvez sélectionner que des cartes de même rareté"
                );
                return prev;
            }
        });
    };

    const handleOfferedCardSelect = (cardId) => {
        const selectedCard = allCards.find((card) => card.id === cardId);
        if (!selectedCard) return;

        setOfferedCards((prev) => {
            if (prev.includes(cardId)) {
                return prev.filter((id) => id !== cardId);
            }
            return [...prev, cardId];
        });
    };

    // Vérifier la structure des données de carte au chargement
    useEffect(() => {
        if (allCards.length > 0) {
            const cardsWithoutRarity = allCards.filter((card) => !card.rarity);
            if (cardsWithoutRarity.length > 0) {
                console.error("Cartes sans rareté:", cardsWithoutRarity);
            }
        }
    }, [allCards]);

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Créer un échange
            </h1>

            {isLoading && <LoadingSpinner />}

            {!isLoading && (
                <>
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Étape 1 : Choisissez les cartes souhaitées
                            </h2>
                            <div className="shadow-md rounded-md p-4">
                                <SearchInput
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Rechercher une carte..."
                                />

                                {requestedCards.length > 0 && (
                                    <div className="mt-2 mb-4 p-2 bg-blue-50 rounded-md">
                                        <p className="text-sm text-blue-700">
                                            Vous ne pouvez sélectionner que des
                                            cartes de rareté{" "}
                                            {
                                                allCards.find(
                                                    (card) =>
                                                        card.id ===
                                                        requestedCards[0]
                                                )?.rarity
                                            }
                                        </p>
                                    </div>
                                )}

                                <CardGrid
                                    cards={getFilteredCardsBySearch()}
                                    selectedCards={requestedCards}
                                    onCardClick={handleRequestedCardSelect}
                                    displayRarity={displayRarity}
                                    showSelectButton={true}
                                    maxHeight="96"
                                />
                            </div>

                            <CardDetails
                                cards={requestedCardDetails}
                                displayRarity={displayRarity}
                                getTokenInfo={getTokenInfo}
                                showExchangeInfo={false}
                            />

                            <StepNavigation
                                onPrevious={handlePreviousStep}
                                onNext={handleNextStep}
                                nextDisabled={requestedCards.length === 0}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Étape 2 : Proposez vos cartes
                            </h2>
                            <SearchInput
                                value={searchTermStep3}
                                onChange={setSearchTermStep3}
                                placeholder="Rechercher parmi les cartes disponibles..."
                                className="mb-4"
                            />

                            {filteredCards.length > 0 ? (
                                <CardGrid
                                    cards={getFilteredCardsForStep3()}
                                    selectedCards={offeredCards}
                                    onCardClick={handleOfferedCardSelect}
                                    displayRarity={displayRarity}
                                    showSelectButton={true}
                                />
                            ) : (
                                <p className="text-center text-gray-700 mt-4">
                                    Aucune carte de même rareté disponible pour
                                    l'échange.
                                </p>
                            )}

                            {requestedCardDetails.length > 0 && (
                                <MultiTradePreview
                                    requestedCards={requestedCardDetails}
                                    offeredCards={offeredCards}
                                    allCards={allCards}
                                    displayRarity={displayRarity}
                                    getTokenInfo={getTokenInfo}
                                    onRemoveOfferedCard={
                                        handleOfferedCardSelect
                                    }
                                />
                            )}

                            <StepNavigation
                                onPrevious={handlePreviousStep}
                                onNext={handleSubmit}
                                nextLabel="Créer l'échange"
                                nextButtonColor="green"
                                nextDisabled={offeredCards.length === 0}
                                isSubmitButton={true}
                            />
                        </div>
                    )}

                    {errorMessage && (
                        <p className="mt-4 text-center text-red-500">
                            {errorMessage}
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default CreateTrade;
