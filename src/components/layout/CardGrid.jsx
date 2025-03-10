import CardSelectTrade from "../cards/CardSelectTrade.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const CardGrid = ({
    cards,
    selectedCardId,
    onCardClick,
    showSelectButton = false,
    onCardSelect = null,
    selectedCards = [],

    
}) => {
    if (!cards || cards.length === 0) {
        return (
            <p className="text-center text-gray-700 mt-4">
                <LoadingSpinner message="Chargement des cartes..." />
            </p>
        );
    }

    

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card) => (
                <CardSelectTrade
                    key={card.id}
                    card={card}
                    isSelected={
                        showSelectButton
                            ? selectedCards.includes(card.id)
                            : selectedCardId === card.id
                    }
                    onClick={onCardClick ? () => onCardClick(card.id) : null}
                    onSelect={onCardSelect}
                    showSelectButton={showSelectButton}
                />
            ))}
        </div>
    );
};

export default CardGrid;
