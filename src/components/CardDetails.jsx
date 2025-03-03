import { getCardImageUrl } from "../utils/imageUtils";
const CardDetails = ({ cards, showExchangeInfo = true }) => {
    return (
        <div className="mb-6 mt-4 p-4 bg-gray-100 rounded border-t-2 border-blue-500">
            <div className="flex flex-col items-start gap-4 min-h-[368px]">
                <h3 className="text-lg font-bold flex justify-center w-full">
                    Votre séléction
                </h3>
                <div className="flex justify-center items-center w-full">
                    {cards && (
                        cards.map((card) => (
                        <div className="">
                            <h3 className="text-lg font-bold">
                                {card.name} #{card.number}
                            </h3>
                            <img
                                src={`/images/${card.img}`}
                                alt={card.name}
                                className="w-[200px] h-[280px] rounded shadow"
                                onError={(e) => {
                                    e.target.src = `/api/placeholder/200/280`;
                                }}
                            />
                            </div>
                        ))
                    )}
                </div>
                <div className="flex-1">
                    {showExchangeInfo && (
                        <>
                            <p className="text-sm text-gray-600 mt-4">
                                Seules les cartes de même rareté peuvent être
                                proposées pour l'échange.
                            </p>
                            <p className="text-red-600">
                                N'oubliez pas qu'il vous faut plus d'un
                                exemplaire de la carte pour pouvoir l'échanger !
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetails;
