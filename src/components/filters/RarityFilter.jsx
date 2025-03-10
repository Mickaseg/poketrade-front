// Filtre de rareté avancé
export const RarityFilter = ({ value, onChange, rarityTypes }) => {
    return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-semibold mb-2">Filtrer par rareté</h3>

            {rarityTypes.map(type => (
                <div key={type.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${type.color}`}>{type.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={value[type.id]}
                            onChange={(e) => onChange(type.id, e.target.value)}
                            className="p-2 border rounded-lg"
                        >
                            <option value="">Tous</option>
                            {[...Array(4)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    {type.id === 'diamond' ? '♦'.repeat(i + 1) :
                                        type.id === 'star' ? '★'.repeat(i + 1) :
                                            '👑'.repeat(i + 1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};