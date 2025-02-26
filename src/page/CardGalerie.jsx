import React, {useState, useEffect, useMemo} from 'react';
import {Search, X} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {debounce} from '../utils/utils.js';
import {SetSelector} from "../components/SetSelector.jsx";
import {getCardImageUrl} from '../utils/imageUtils.js';
import {getLocalCards} from '../data/localData.js';

const CardGrid = () => {
    const [currentSet, setCurrentSet] = useState('puissance-genetique');
    const [allCards, setAllCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', type: '', rarityType: '', rarityValue: '' });
    const [isChangingSet, setIsChangingSet] = useState(false);
    // États pour la modal
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCards = async (setId) => {
        try {
            const cards = getLocalCards(setId);
            
            setAllCards(cards);
            setFilteredCards(cards);
            setLoading(false)
        } catch (err) {
            console.error('Erreur:', err);
        }
    };
   
    useEffect(() => {
        fetchCards(currentSet);
    }, []);

    useEffect(() => {
        const filteredResults = allCards.filter(card => {
            const matchSearch = card.name.toLowerCase().includes(filters.search.toLowerCase()) || card.number.includes(filters.search);
            const matchType = !filters.type || card.type === filters.type;
            const matchRarity = !filters.rarityType || !filters.rarityValue ||
                card.rarity[filters.rarityType] === parseInt(filters.rarityValue);
            return matchSearch && matchType && matchRarity;
        });
        setFilteredCards(filteredResults);
    }, [filters, allCards]);

    const uniqueRarities = useMemo(() => {
        const rarities = new Set();
        allCards.forEach(card => {
            Object.keys(card.rarity).forEach(type => {
                if (['diamonds', 'stars', 'crowns'].includes(type) && card.rarity[type] > 0) {
                    rarities.add(`${card.rarity[type]} ${type}`);
                }
            });
        });
        return [...rarities];
    }, [allCards]);

    // Gestion des filtres
    const handleSearchChange = debounce((value) => {
        setFilters(prev => ({...prev, search: value}));
    }, 300);

    const resetFilters = () => {
        setFilters({
            search: '',
            type: '',
            rarityType: '',
            rarityValue: ''
        });
    };

    const handleSetChange = async (setId) => {
        setIsChangingSet(true);
        setCurrentSet(setId);

        await fetchCards(setId);
        setIsChangingSet(false);

        resetFilters()
    };

    // Fonctions pour gérer la modal
    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
        // Empêcher le scroll de la page quand la modal est ouverte
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
        // Réactiver le scroll quand la modal est fermée
        document.body.style.overflow = 'auto';
    };

    // Gestion des touches clavier pour la modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen]);

    if (loading) return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="flex justify-center items-center h-screen"
        >
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </motion.div>
    );

    return (
        <div className="container mx-auto px-4 py-8">

            {/* Sélecteur de sets */}
            <SetSelector
                currentSet={currentSet}
                onSetChange={handleSetChange}
            />

            {/* Barre de recherche et filtres */}
            <div
                className="mb-8 space-y-4"
            >
                <div className="relative">
                    <input
                        type="text"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Rechercher une carte..."
                        className="w-full p-3 pl-10 border rounded-lg"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                </div>

                <div className="flex flex-wrap gap-4">

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Filtrer par rareté :</label>
                        <select
                            onChange={(e) => {
                                const [value, type] = e.target.value.split(' ');
                                setFilters({ ...filters, rarityType: type, rarityValue: value });
                            }}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Toutes raretés</option>
                            {uniqueRarities.map((rarity, index) => (
                                <option key={index} value={rarity}>{rarity}</option>
                            ))}
                        </select>
                    </div>


                    {(filters.search || filters.type || filters.rarityType || filters.rarityValue) && (
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>

                <div
                    className="text-gray-600"
                >
                    {filteredCards.length} cartes trouvées
                </div>
            </div>

            {/* Grille de cartes */}
            <div className="min-h-[800px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSet}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    >
                        {!isChangingSet && filteredCards.map(card => (
                            <motion.div
                                key={`${currentSet}-${card.id}`}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3}}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl cursor-pointer"
                                onClick={() => openModal(card)}
                            >
                                <motion.div
                                    className="relative pb-[100%]"
                                    whileHover={{scale: 1.05}}
                                    transition={{duration: 0.2}}
                                >
                                    <img
                                        src={getCardImageUrl(card)}
                                        alt={card.name}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                                <div className="flex justify-between items-center p-3">
                                    <span className="text-sm text-gray-600">#{card.number.padStart(3, '0')}</span>
                                    <h3 className="font-bold truncate">{card.name}</h3>
                                    <div className="mt-1 text-yellow-400">
                                        {card.rarity.diamonds > 0 && (
                                            <span className="text-blue-400">{'♦'.repeat(card.rarity.diamonds)}</span>
                                        )}
                                        {card.rarity.stars > 0 && (
                                            <span className="text-yellow-400 ml-1">{'★'.repeat(card.rarity.stars)}</span>
                                        )}
                                        {card.rarity.crowns > 0 && (
                                            <span className="text-amber-600 ml-1">{'👑'.repeat(card.rarity.crowns)}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Loading overlay */}
                {isChangingSet && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <div
                            className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Message si aucun résultat */}
            <AnimatePresence>
                {filteredCards.length === 0 && !isChangingSet && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="text-center py-8 text-gray-500"
                    >
                        Aucune carte ne correspond à vos critères
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal pour afficher l'image en grand */}
            {/* <AnimatePresence>
                {isModalOpen && selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-2 right-2 z-10">
                                <button
                                    onClick={closeModal}
                                    className="p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
                                >
                                    <X className="h-6 w-6 text-gray-800" />
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                {/* Image de la carte */}
                                {/* <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                                    <img
                                        src={`http://localhost:5000${selectedCard.imageUrl}`}
                                        alt={selectedCard.name}
                                        className="max-h-[80vh] object-contain"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence> */} 

        </div>
    );
};

export default CardGrid;