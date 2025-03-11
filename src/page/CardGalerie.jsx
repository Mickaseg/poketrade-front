import React, { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "../utils/utils.js";
import { SetSelector } from "../components/filters/SetSelector.jsx";
import { getLocalCards } from "../data/localData.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const CardGalerie = () => {
    const [currentSet, setCurrentSet] = useState("puissance-genetique");
    const [allCards, setAllCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        rarity: "",
    });
    const [isChangingSet, setIsChangingSet] = useState(false);

    const fetchCards = async (setId) => {
        try {
            const cards = getLocalCards(setId);

            setAllCards(cards);
            setFilteredCards(cards);
            setLoading(false);
        } catch (err) {
            console.error("Erreur:", err);
        }
    };

    useEffect(() => {
        document.title = "Galerie de cartes - TradeHelper";
        fetchCards(currentSet);
    }, []);

    useEffect(() => {
        const filteredResults = allCards.filter((card) => {
            const matchSearch =
                card.name
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                card.number.includes(filters.search);
            const matchType = !filters.type || card.type === filters.type;
            const matchRarity =
                !filters.rarity || card.rarity === filters.rarity;
            return matchSearch && matchType && matchRarity;
        });
        setFilteredCards(filteredResults);
    }, [filters, allCards]);

    const uniqueRarities = useMemo(() => {
        const rarities = new Set();
        allCards.forEach((card) => {
            if (card.rarity) {
                rarities.add(card.rarity);
            }
        });
        return [...rarities];
    }, [allCards]);

    // Gestion des filtres
    const handleSearchChange = debounce((value) => {
        setFilters((prev) => ({ ...prev, search: value }));
    }, 300);

    const resetFilters = () => {
        setFilters({
            search: "",
            type: "",
            rarityType: "",
            rarityValue: "",
        });
    };

    const handleSetChange = async (setId) => {
        setIsChangingSet(true);
        setCurrentSet(setId);

        await fetchCards(setId);
        setIsChangingSet(false);

        resetFilters();
    };

    if (loading)
        return (
            <LoadingSpinner message="Chargement des cartes..." />
        );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Sélecteur de sets */}
            <SetSelector
                currentSet={currentSet}
                onSetChange={handleSetChange}
            />

            {/* Barre de recherche et filtres */}
            <div className="flex justify-between items-center mb-12">
                <div className="relative min-w-[300px]">
                    <input
                        type="text"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Rechercher une carte..."
                        className="w-full p-3 pl-10 border rounded-lg"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="flex gap-2 items-center">
                    {(filters.search || filters.type || filters.rarity) && (
                        <button
                            onClick={resetFilters}
                            className="btn btn-outline btn-info btn-sm"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                    {uniqueRarities.map((rarity, index) => (
                        <button
                            className={`btn btn-outline btn-primary btn-sm transition-all duration-300 ${
                                filters.rarity === rarity ? "btn-active" : ""
                            }`}
                            key={index}
                            value={rarity}
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    rarity: rarity,
                                });
                            }}
                        >
                            {rarity}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grille de cartes */}
            <div className="min-h-[800px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSet}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12"
                    >
                        {!isChangingSet &&
                            filteredCards.map((card) => (
                                <motion.div
                                    key={`${currentSet}-${card.id}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl cursor-pointer"
                                >
                                    <img
                                        src={`images/${card.img}`}
                                        alt={card.name}
                                        className=" object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                    </motion.div>
                </AnimatePresence>

                {/* Loading overlay */}
                {isChangingSet && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Message si aucun résultat */}
            <AnimatePresence>
                {filteredCards.length === 0 && !isChangingSet && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8 text-gray-500"
                    >
                        Aucune carte ne correspond à vos critères
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CardGalerie;
