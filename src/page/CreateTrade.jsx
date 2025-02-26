import {useState, useEffect} from "react";
import CardDetails from "../components/CardDetails";
import SearchInput from "../components/SearchInput";
import StepNavigation from "../components/StepNavigation";
import {isSameRarity, isCardExchangeable, getTokenInfo, displayRarity} from "../utils/tradeUtils";
import {fetchAllCards, createTrade} from "../api/tradeApi";
import CardGrid from "../components/CardGrid.jsx";

const CreateTrade = () => {
    const [step, setStep] = useState(1);
    const [requester, setRequester] = useState("");
    const [requestedCard, setRequestedCard] = useState("");
    const [requestedCardDetails, setRequestedCardDetails] = useState(null);
    const [offeredCards, setOfferedCards] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchTermStep3, setSearchTermStep3] = useState("");

    // Charger les cartes au démarrage
    useEffect(() => {
        const loadCards = async () => {
            try {
                setIsLoading(true);
                const cards = await fetchAllCards();
                setAllCards(cards);
            } catch (error) {
                setErrorMessage("Erreur lors du chargement des cartes. Veuillez réessayer.");
            } finally {
                setIsLoading(false);
            }
        };

        loadCards();
    }, []);

    // Mettre à jour les détails de la carte sélectionnée
    useEffect(() => {
        if (requestedCard && allCards.length > 0) {
            const selected = allCards.find(card => card.id === requestedCard);
            if (selected) {
                setRequestedCardDetails(selected);
            }
        } else {
            setRequestedCardDetails(null);
        }
    }, [requestedCard, allCards]);

    // Filtrer les cartes offertes en fonction de la carte demandée
    useEffect(() => {
        if (step === 3 && requestedCardDetails) {
            // Vérifier si la carte demandée peut être échangée
            if (!isCardExchangeable(requestedCardDetails.rarity)) {
                setErrorMessage("Cette carte ne peut pas être échangée selon les règles du jeu.");
                setFilteredCards([]);
                return;
            }

            // Filtrer les cartes de même rareté que la carte demandée
            setFilteredCards(allCards.filter(card =>
                card.id !== requestedCard &&
                isSameRarity(card.rarity, requestedCardDetails.rarity) &&
                isCardExchangeable(card.rarity)
            ));
        }
    }, [step, requestedCardDetails, requestedCard, allCards]);

    // Réinitialiser les cartes offertes lors du changement de carte demandée
    useEffect(() => {
        setOfferedCards([]);
        setErrorMessage("");
    }, [requestedCard]);

    // Filtrer les cartes basées sur le terme de recherche
    const getFilteredCardsBySearch = () => {
        if (!searchTerm.trim()) return allCards;

        return allCards.filter(card =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (card.setName && card.setName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.setId && card.setId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    // Filtrer les cartes basées sur le terme de recherche et la rareté
    const getFilteredCardsForStep3 = () => {
        if (!requestedCardDetails) return [];

        return filteredCards.filter(card =>
            (card.name.toLowerCase().includes(searchTermStep3.toLowerCase()) ||
            (card.setId && card.setId.toLowerCase().includes(searchTermStep3.toLowerCase())) ||
            card.number.includes(searchTermStep3))
        );
    };

    const handleNextStep = () => {
        if (step === 1 && !requester.trim()) {
            setErrorMessage("Veuillez entrer un pseudo");
            return;
        }
        if (step === 2 && !requestedCard) {
            setErrorMessage("Veuillez sélectionner une carte");
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
        if (offeredCards.length === 0) {
            setErrorMessage("Veuillez sélectionner au moins une carte à offrir");
            return;
        }

        const tradeData = {
            requester,
            requestedCardId: requestedCard,
            offeredCards,
            requestedCardRarity: requestedCardDetails?.rarity
        };

        try {
            setIsLoading(true);
            await createTrade(tradeData);

            // Réinitialiser le formulaire
            setStep(1);
            setRequester("");
            setRequestedCard("");
            setRequestedCardDetails(null);
            setOfferedCards([]);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Erreur lors de la création de l'échange. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    // Gérer la sélection des cartes offertes
    const handleOfferedCardSelect = (cardId) => {
        setOfferedCards(prev =>
            prev.includes(cardId)
                ? prev.filter(c => c !== cardId)
                : [...prev, cardId]
        );
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Créer un échange</h1>

            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {!isLoading && (
                <>
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Étape 1 : Choisissez un pseudo</h2>
                            <input
                                type="text"
                                value={requester}
                                onChange={(e) => setRequester(e.target.value)}
                                className="w-full p-2 border rounded mt-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
                                placeholder="Entrez votre pseudo"
                            />

                            <StepNavigation
                                onNext={handleNextStep}
                                nextDisabled={!requester.trim()}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Étape 2 : Choisissez la carte souhaitée</h2>

                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Rechercher une carte..."
                            />

                            <CardGrid
                                cards={getFilteredCardsBySearch()}
                                selectedCardId={requestedCard}
                                onCardClick={(cardId) => setRequestedCard(cardId)}
                                displayRarity={displayRarity}
                                maxHeight="96"
                            />

                            {requestedCardDetails && (
                                <CardDetails
                                    card={requestedCardDetails}
                                    displayRarity={displayRarity}
                                    getTokenInfo={getTokenInfo}
                                    showExchangeInfo={false}
                                />
                            )}

                            <StepNavigation
                                onPrevious={handlePreviousStep}
                                onNext={handleNextStep}
                                nextDisabled={!requestedCard}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Étape 3 : Choisissez vos cartes proposées</h2>

                            {requestedCardDetails && (
                                <CardDetails
                                    card={requestedCardDetails}
                                    displayRarity={displayRarity}
                                    getTokenInfo={getTokenInfo}
                                    showExchangeInfo={true}
                                />
                            )}

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
                                    onCardSelect={handleOfferedCardSelect}
                                    displayRarity={displayRarity}
                                    showSelectButton={true}
                                />
                            ) : (
                                <p className="text-center text-gray-700 mt-4">
                                    Aucune carte de même rareté disponible pour l'échange.
                                </p>
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
                        <p className="mt-4 text-center text-red-500">{errorMessage}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CreateTrade;