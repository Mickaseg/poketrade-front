import { useState, useEffect } from "react";
import { isSameRarity, isCardExchangeable } from "../utils/tradeUtils";
import { fetchAllCards, createTrade } from "../api/tradeApi";
import { useNavigate } from "react-router-dom";
import CardGrid from "../components/layout/CardGrid";
import StepNavigation from "../components/common/StepNavigation.jsx";
import { toast } from "react-hot-toast";
import Filter from "../components/filters/Filter";

const CreateTrade = () => {
    const [step, setStep] = useState(1);
    const [requestedCards, setRequestedCards] = useState([]);
    const [requestedCardDetails, setRequestedCardDetails] = useState([]);
    const [offeredCards, setOfferedCards] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState({
        term: "",
        set: "",
        showSelected: false,
    });
    const [searchStep2, setSearchStep2] = useState({
        term: "",
        set: "",
        showSelected: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Charger les cartes au démarrage
    useEffect(() => {
        document.title = "Créer un échange - TradeHelper";
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

    // Modifier la fonction de filtrage pour l'étape 1
    const getFilteredCardsBySearch = () => {
        let filteredCards = allCards.filter((card) => {
            const matchesSearch =
                card.name.toLowerCase().includes(search.term.toLowerCase()) ||
                card.number.includes(search.term);
            const matchesSet = !search.set || card.setName === search.set;
            const matchesSelected =
                !search.showSelected || requestedCards.includes(card.id);

            return (
                matchesSearch &&
                matchesSet &&
                (search.showSelected ? matchesSelected : true)
            );
        });

        // Si au moins une carte est sélectionnée, filtrer par rareté
        if (requestedCards.length > 0) {
            const firstSelectedCard = allCards.find(
                (card) => card.id === requestedCards[0]
            );
            if (firstSelectedCard) {
                return filteredCards.filter(
                    (card) => card.rarity === firstSelectedCard.rarity
                );
            }
        }

        return filteredCards;
    };

    // Modifier la fonction de filtrage pour l'étape 2
    const getFilteredCardsForStep2 = () => {
        const firstRequestedCard = requestedCardDetails[0];
        if (!firstRequestedCard) return [];

        return filteredCards.filter((card) => {
            const matchesSearch =
                card.name
                    .toLowerCase()
                    .includes(searchStep2.term.toLowerCase()) ||
                card.number.includes(searchStep2.term);
            const matchesSet =
                !searchStep2.set || card.setName === searchStep2.set;
            const matchesSelected =
                !searchStep2.showSelected || offeredCards.includes(card.id);

            return (
                matchesSearch &&
                matchesSet &&
                (searchStep2.showSelected ? matchesSelected : true)
            );
        });
    };

    // Gestionnaires de mise à jour des filtres
    const handleSearchUpdate = (field, value) => {
        setSearch((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearchStep2Update = (field, value) => {
        setSearchStep2((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Gestionnaires de réinitialisation
    const resetFilters = () => {
        setSearch({
            term: "",
            set: "",
            showSelected: false,
        });
    };

    const resetFiltersStep2 = () => {
        setSearchStep2({
            term: "",
            set: "",
            showSelected: false,
        });
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

            toast.success("Échange créé avec succès!");

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

    // console.log(requestedCards);

    return (
        <div className="max-w-3xl md:max-w-4xl lg:max-w-7xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden mt-8 sm:mt-4 md:mt-6">
            <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Créer un échange
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Proposez vos cartes à échanger
                </p>
            </div>

            <div className="p-4 sm:p-6 space-y-6 bg-gray-50">
                {/* ********** STEP 1 ********** */}
                {step === 1 && (
                    <>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                                    Sélectionnez les cartes que vous souhaitez
                                    obtenir
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Choisissez les carte que vous recherchez
                                </p>
                            </div>
                        </div>

                        {requestedCards.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 bg-gradient-to-r from-blue-50 to-white rounded-lg p-3 sm:p-4 border border-blue-100 mb-4">
                                {requestedCardDetails.map((card) => (
                                    <div className="flex items-center">
                                        <div className="shrink-0">
                                            <img
                                                src={`images/${card.img}`}
                                                alt="Évoli"
                                                className="w-30 h-30 sm:w-30 sm:h-30 object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white shadow rounded-lg p-3 sm:p-6">
                            {/* search bar */}
                            <Filter
                                search={search}
                                handleSearchUpdate={handleSearchUpdate}
                                resetFilters={resetFilters}
                            />

                            <div className="flex flex-col gap-4">
                                <div className="mt-4 shadow-md rounded-md p-4">
                                    {requestedCards.length > 0 && (
                                        <div className="mt-2 mb-4 p-2 bg-blue-50 rounded-md">
                                            <p className="text-sm text-blue-700">
                                                Vous ne pouvez sélectionner que
                                                des cartes de rareté{" "}
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
                                    <div className="max-h-[600px] overflow-y-auto">
                                        <CardGrid
                                            cards={getFilteredCardsBySearch()}
                                            selectedCards={requestedCards}
                                            onCardClick={
                                                handleRequestedCardSelect
                                            }
                                            showSelectButton={true}
                                        />
                                    </div>
                                </div>

                                <StepNavigation
                                    onPrevious={handlePreviousStep}
                                    onNext={handleNextStep}
                                    nextDisabled={requestedCards.length === 0}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* ********** STEP 2 ********** */}
                {step === 2 && (
                    <>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                                    Sélectionnez les cartes que vous proposez
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Proposez une ou plusieurs cartes en échange
                                </p>
                            </div>
                        </div>

                        {requestedCards.length > 0 && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-white rounded-lg p-3 sm:p-4 border border-blue-100 mb-4">
                                {requestedCardDetails.map((card) => (
                                    <div className="flex items-center">
                                        <div className="shrink-0">
                                            <img
                                                src={`images/${card.img}`}
                                                alt="Évoli"
                                                className="w-30 h-30 sm:w-30 sm:h-30 object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white shadow rounded-lg p-3 sm:p-6">
                            {/* search bar */}
                            <Filter
                                search={searchStep2}
                                handleSearchUpdate={handleSearchStep2Update}
                                resetFilters={resetFiltersStep2}
                            />

                            {/* <div className="flex flex-col gap-4"> */}
                            {/* <div className="flex flex-wrap gap-2 mt-3">
                            <button className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-gray-900 text-white">
                                Toutes les cartes
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-purple-50 text-purple-700 hover:bg-purple-100">
                                Cartes peu possédées (0-1 ex.)
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-orange-50 text-orange-700 hover:bg-orange-100">
                                Cartes manquantes
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors inline-flex items-center bg-red-50 text-red-700 hover:bg-red-100">
                               <Heart size={16} />  
                                Souhaitée
                            </button>
                        </div> */}
                            {/* </div> */}

                            <div className="flex flex-col gap-4">
                                <div className="shadow-md rounded-md p-4">
                                    <div className="max-h-[600px] overflow-y-auto">
                                        <CardGrid
                                            cards={getFilteredCardsForStep2()}
                                            selectedCards={offeredCards}
                                            onCardClick={
                                                handleOfferedCardSelect
                                            }
                                            showSelectButton={true}
                                        />
                                    </div>
                                </div>

                                <StepNavigation
                                    onPrevious={handlePreviousStep}
                                    onNext={handleSubmit}
                                    nextLabel="Créer l'échange"
                                    nextButtonColor="green"
                                    nextDisabled={offeredCards.length === 0}
                                    isSubmitButton={true}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* {step === 2 && (
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
                                            onCardClick={
                                                handleOfferedCardSelect
                                            }
                                            displayRarity={displayRarity}
                                            showSelectButton={true}
                                        />
                                    ) : (
                                        <p className="text-center text-gray-700 mt-4">
                                            Aucune carte de même rareté
                                            disponible pour l'échange.
                                        </p>
                                    )}

                                    {requestedCardDetails.length > 0 && (
                                        <MultiTradePreview
                                            requestedCards={
                                                requestedCardDetails
                                            }
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
                       */}
            </div>
        </div>
    );
};

export default CreateTrade;
