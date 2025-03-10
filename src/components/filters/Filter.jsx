import { RotateCcw } from "lucide-react";

const Filter = ({ search, handleSearchUpdate, resetFilters }) => {
    return (
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher une carte..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={search.term}
                        onChange={(e) =>
                            handleSearchUpdate("term", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={search.set}
                        onChange={(e) =>
                            handleSearchUpdate("set", e.target.value)
                        }
                    >
                        <option value="">Tous les sets</option>
                        <option value="l-ile-fabuleuse">Île Fabuleuse</option>
                        <option value="puissance-genetique">
                            Puissance Génétique
                        </option>
                        <option value="choc-spatio-temporel">
                            Choc Spatio-temporel
                        </option>
                    </select>
                </div>
            </div>
            {search.showSelected && (
                <div className="flex flex-wrap gap-2 mt-3">
                    <button
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                            search.showSelected
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() =>
                            handleSearchUpdate(
                                "showSelected",
                                !search.showSelected
                            )
                        }
                    >
                        Cartes sélectionnées
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between pt-2">
                <button
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                    onClick={resetFilters}
                >
                    <RotateCcw size={16} />
                    Réinitialiser les filtres
                </button>
            </div>
        </div>
    );
};

export default Filter;
