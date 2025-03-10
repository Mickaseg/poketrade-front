import { Check } from "lucide-react";

export const ProposedCard = ({ card, isSelected, onClick }) => (
    <div
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group relative"
        onClick={() => onClick(card.id)}
    >
        {isSelected && (
            <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Check size={16} />
            </div>
        )}
        <div className="relative aspect-square">
            <img
                src={`/images/${card.img}`}
                alt={card.name}
                className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
            />
        </div>
        <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-gray-900 mb-1 truncate">{card.name}</h3>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                {card.setName} • {card.rarity}
            </div>
        </div>
    </div>
); 