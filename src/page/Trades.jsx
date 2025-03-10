import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enrichTradeWithCards } from "../utils/tradeUtils";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import TradeCard from "../components/cards/TradeCard";
import { useAuth } from "../context/AuthContext";
import { fetchAllTrades, fetchTradesByUser } from "../api/tradeApi";
import Filter from "../components/filters/Filter";

export const Trades = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, loadingAuth } = useAuth();
    const [search, setSearch] = useState({
        term: "",
        set: "",
    });
    const [filteredTrades, setFilteredTrades] = useState([]);

    const handleSearchUpdate = (field, value) => {
        setSearch((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        setFilteredTrades(getFilteredTrades());
    }, [search]);

    const getFilteredTrades = () => {
        return trades.filter((trade) => {
            const matchesSearch =
                trade.requestedCard.name
                    .toLowerCase()
                    .includes(search.term.toLowerCase()) ||
                trade.requestedCard.number.includes(search.term);
            const matchesSet =
                !search.set || trade.requestedCard.setName === search.set;

            return matchesSearch && matchesSet;
        });
    };

    const resetFilters = () => {
        setSearch({ term: "", set: "" });
        setFilteredTrades(trades);
    };

    const fetchTrades = async () => {
        setLoading(true);
        try {
            const data = isAuthenticated
                ? await fetchTradesByUser()
                : await fetchAllTrades();

            const enrichedTrades = data.map((trade) =>
                enrichTradeWithCards(trade)
            );
            setTrades(enrichedTrades);
            setError(null);
        } catch (err) {
            console.error("Erreur détaillée:", err);

            setError(
                err.message ||
                    "Impossible de charger les échanges. Veuillez réessayer plus tard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingAuth) {
            if (isAuthenticated) {
                fetchTrades();
            } else {
                fetchTrades();
            }
        }
    }, [isAuthenticated, loadingAuth]);

    useEffect(() => {
        setFilteredTrades(trades);
    }, [trades]);

    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner message="Chargement des échanges..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            fetchTrades();
                        }}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    console.log(loadingAuth)

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4 mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Echangez vos cartes
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Trouvez un échange qui vous correspond
                </p>
            </div>

            <Filter
                search={search}
                handleSearchUpdate={handleSearchUpdate}
                resetFilters={resetFilters}
            />

            {trades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    {filteredTrades.map((trade) => (
                        <TradeCard key={trade._id} trade={trade} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg ">
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
                        Aucun échange disponible
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {isAuthenticated
                            ? "Soyez le premier à proposer un échange!"
                            : "Inscrivez-vous pour proposer vos propres échanges!"}
                    </p>
                    <div className="mt-6 space-y-3">
                        {isAuthenticated ? (
                            <Link
                                to="/create-trade"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Créer un échange
                            </Link>
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row justify-center gap-3">
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        S'inscrire
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Se connecter
                                    </Link>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    L'inscription vous permet de créer et de
                                    participer aux échanges
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trades;
