import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { enrichTradeWithCards } from "../utils/tradeUtils";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import TradeCard from "../components/cards/TradeCard";
import { fetchUserTrades, deleteTrade } from "../api/tradeApi";
import Filter from "../components/filters/Filter";
import SEOHead from "../components/SEO/SEOHead";
import { toast } from "react-hot-toast";

const MyTrades = () => {
    // État pour stocker les transactions de l'utilisateur
    const [trades, setTrades] = useState([]);
    // État pour gérer le chargement
    const [loading, setLoading] = useState(true);
    // État pour gérer les erreurs
    const [error, setError] = useState(null);
    const [search, setSearch] = useState({
        term: "",
        set: "",
    });
    const [filteredTrades, setFilteredTrades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTradeId, setSelectedTradeId] = useState(null);

    // Fonction pour gérer les mises à jour de recherche
    const handleSearchUpdate = (field, value) => {
        setSearch((prev) => ({ ...prev, [field]: value }));
    };

    // Fonction pour récupérer les transactions - déplacer en dehors du useEffect pour pouvoir l'appeler ailleurs
    const fetchTrades = async () => {
        try {
            setLoading(true);
            // Utilisation de l'API spécifique pour mes échanges
            const data = await fetchUserTrades();

            // Enrichir les données avec les informations de cartes
            const enrichedTrades = data.map((trade) =>
                enrichTradeWithCards(trade)
            );

            setTrades(enrichedTrades);
            setFilteredTrades(enrichedTrades);
            setError(null);
        } catch (err) {
            setError(err.message || "Impossible de récupérer vos échanges");
            console.error("Erreur lors du chargement des échanges:", err);
        } finally {
            setLoading(false);
        }
    };

    // Appel initial pour charger les échanges
    useEffect(() => {
        fetchTrades();
    }, []);

    // Gestion de la suppression
    const handleDeleteTrade = async (tradeId) => {
        try {
            await deleteTrade(tradeId);
            // Rafraîchir la liste des échanges
            fetchTrades();
            toast.success("Échange supprimé avec succès");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    // Filtrer les échanges lorsque les critères de recherche changent
    useEffect(() => {
        setFilteredTrades(getFilteredTrades());
    }, [search, trades]);

    // Fonction de filtrage des échanges
    const getFilteredTrades = () => {
        return trades.filter((trade) => {
            const matchesSearch =
                trade.requestedCard?.name
                    ?.toLowerCase()
                    ?.includes(search.term.toLowerCase()) ||
                trade.requestedCard?.number?.includes(search.term) ||
                trade.creator?.username
                    ?.toLowerCase()
                    ?.includes(search.term.toLowerCase());
            const matchesSet =
                !search.set || trade.requestedCard?.setName === search.set;

            return matchesSearch && matchesSet;
        });
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearch({ term: "", set: "" });
        setFilteredTrades(trades);
    };

    if (loading) {
        return (
            <div
                className="flex justify-center items-center"
                style={{ minHeight: "calc(100vh - 80px)" }}
            >
                <LoadingSpinner message="Chargement de vos échanges..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchUserTrades()}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* SEO */}
            <SEOHead
                title="Mes Échanges"
                description="Gérez vos échanges de cartes sur TradeHelper"
                canonicalUrl="https://tradehelper.seguin.cefim.o2switch.site/mytrades"
            />

            <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4 mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Mes Échanges
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Gérez vos échanges en cours
                </p>
            </div>

            <Filter
                placeholder="Rechercher une carte, un utilisateur..."
                search={search}
                handleSearchUpdate={handleSearchUpdate}
                resetFilters={resetFilters}
            />

            {filteredTrades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    {filteredTrades.map((trade) => (
                        <TradeCard
                            key={trade._id}
                            trade={trade}
                            onDelete={handleDeleteTrade}
                            canEdit={true}
                            editUrl={`/edit-trade/${trade._id}`}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg mt-4">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Vous n'avez pas encore d'échanges
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Commencez par proposer un échange ou participez à un
                        échange existant
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/create-trade"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Créer un échange
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTrades;
