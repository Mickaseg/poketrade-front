export const RequestedCard = ({ card }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 text-sm font-bold flex-shrink-0">1</span>
            <span className="truncate">Carte recherchée</span>
        </h2>
        <div className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-md transform transition-transform group-hover:scale-[1.02]">
                <img src={`/images/${card.img}`} alt={card.name} className="w-full h-full object-contain p-4" />
            </div>
        </div>
        <div className="mt-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{card.name}</h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                <span className="text-sm font-medium">{card.setName} • {card.rarity}</span>
            </div>
        </div>
    </div>
); 