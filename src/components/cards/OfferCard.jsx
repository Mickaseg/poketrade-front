import PlaceholderAvatar from "../common/PlaceholderAvatar";
import { ArrowRightLeft } from "lucide-react";
import { acceptTradeOffer } from "../../api/tradeApi";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { validateTrade } from "../../api/tradeApi";
import { useNotifications } from "../../context/NotificationContext";

const OfferCard = ({ offer, refreshOffers, isHighlighted }) => {
    const [statusColor, setStatusColor] = useState("");
    const { addNotification } = useNotifications();
    useEffect(() => {
        if (offer.status === "pending") {
            setStatusColor("bg-yellow-100 text-yellow-800");
        } else if (offer.status === "accepted") {
            setStatusColor("bg-green-100 text-green-800");
        } else if (offer.status === "declined") {
            setStatusColor("bg-red-100 text-red-800");
        }else if (offer.status === "completed") {
            setStatusColor("bg-green-100 text-green-800");
        }
    }, [offer.status]);

    const handleAcceptOffer = async () => {
        try {
            await acceptTradeOffer(offer.tradeId, offer._id);
            refreshOffers();

            await addNotification({
                message: `Votre offre d'échange a été acceptée par ${offer.creator.username}`,
                type: "offer_accepted",
                trade_id: offer.tradeId,
                offer_id: offer._id,
            });

            toast.success("Offre acceptée avec succès!");
        } catch (error) {
            toast.error("Erreur lors de l'acceptation de l'offre:", error);
            navigate("/mytrades");
            // console.error("Erreur lors de l'acceptation de l'offre:", error);
        }
    };

    const handleValidateTrade = async () => {
        try {
            await validateTrade(offer.tradeId, offer._id);
            refreshOffers();
            toast.success(" Echange validé avec succès!");
        } catch (error) {
            toast.error("Erreur lors de la validation de l'échange:", error);
            navigate("/mytrades");
            // console.error("Erreur lors de la validation de l'échange:", error);
        }
    };

    

    return (
        <div className={` rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-6 ${isHighlighted ? 'border-2 border-blue-500 bg-blue-50' : 'bg-white'}`}>
            <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex flex-row-reverse justify-between mb-4 w-full">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                    >
                        {offer.status === "pending" ? "En attente" : offer.status === "accepted" ? "Accepté" : "Complété"}
                    </span>
                    <div className="flex items-center gap-2">
                        <PlaceholderAvatar name={offer.user.username} />
                        <p className="text-sm text-gray-500 mt-1">
                            {offer.role === "participant"
                                ? "Proposé à "
                                : "Proposé par "}
                            {offer.role === "participant"
                                ? offer.creator.username
                                : offer.user.username}
                        </p>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Carte demandée */}
                    <div className="flex-1 flex flex-col items-center">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Carte recherchée
                        </h3>
                        <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50 w-48">
                            <img
                                src={`/images/${offer.wantedCard.img}`}
                                alt={offer.wantedCard.name}
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-medium text-gray-900">
                                {offer.wantedCard.name}
                            </p>
                            <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                                {offer.wantedCard.setName} •{" "}
                                {offer.wantedCard.rarity}
                            </p>
                        </div>
                    </div>

                    {/* Flèche d'échange */}
                    <div className="flex items-center justify-center">
                        <ArrowRightLeft className="w-10 h-10 text-gray-400" />
                    </div>

                    {/* Carte proposée */}
                    <div className="flex-1 flex flex-col items-center">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Carte proposée
                        </h3>
                        <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50 w-48">
                            <img
                                src={`/images/${offer.selectedCard.img}`}
                                alt={offer.selectedCard.name}
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-medium text-gray-900">
                                {offer.selectedCard.name}
                            </p>
                            <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                                {offer.selectedCard.setName} •{" "}
                                {offer.selectedCard.rarity}
                            </p>
                        </div>
                    </div>
                </div>

                {offer.status === "pending" && offer.role === "creator" && (
                    <button
                        className="btn btn-wide btn-success mt-4"
                        onClick={() => {
                            handleAcceptOffer();
                        }}
                    >
                        Accepter la proposition
                    </button>
                )}
                {offer.status === "accepted" && (
                    <button
                        className="btn btn-wide btn-success mt-4"
                        onClick={() => {
                            handleValidateTrade();
                        }}
                    >
                        Echange effectué
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfferCard;
