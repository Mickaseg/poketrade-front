import { getCardImageUrl } from "../../utils/imageUtils";

const CardSelectTrade = ({
    card,
    isSelected = false,
    onClick = null,
    onSelect = null,
    
    showSelectButton = false,
}) => {
    return (
        <div
            className={`border rounded overflow-hidden ${
                isSelected ? "border-blue-500 border-4 shadow-md" : "border-gray-300"
            } ${
                onClick
                    ? "cursor-pointer transition-transform hover:shadow-md"
                    : ""
            }`}
            onClick={onClick}
        >
            <div className="flex flex-col">
                <div className="relative">
                    {/* Indication de sélection */}
                    {isSelected && (
                        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Image de la carte */}
                    <img
                        src={`/images/${card.img}`}
                        alt={card.name}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                            e.target.src = `/api/placeholder/200/280`;
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CardSelectTrade;
