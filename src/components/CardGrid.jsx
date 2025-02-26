import CardSelectTrade from './CardSelectTrade.jsx';

const CardGrid = ({
                      cards,
                      selectedCardId,
                      onCardClick,
                      showSelectButton = false,
                      onCardSelect = null,
                      selectedCards = [],
                      displayRarity,
                      columnsConfig = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
                      maxHeight = null
                  }) => {
    if (!cards || cards.length === 0) {
        return (
            <p className="text-center text-gray-700 mt-4">
                Aucune carte disponible.
            </p>
        );
    }

    const gridClassName = `grid ${columnsConfig} gap-4 mt-2 ${maxHeight ? `max-h-${maxHeight} overflow-y-auto p-2` : ''}`;

    return (
        <div className={gridClassName}>
            {cards.map(card => (
                <CardSelectTrade
                    key={card.id}
                    card={card}
                    isSelected={showSelectButton ? selectedCards.includes(card.id) : selectedCardId === card.id}
                    onClick={onCardClick ? () => onCardClick(card.id) : null}
                    onSelect={onCardSelect}
                    displayRarity={displayRarity}
                    showSelectButton={showSelectButton}
                />
            ))}
        </div>
    );
};

export default CardGrid;