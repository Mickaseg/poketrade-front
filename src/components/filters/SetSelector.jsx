export const SetSelector = ({ currentSet, onSetChange }) => {
    const sets = [
        { id: "puissance-genetique", name: "Puissance Genetique" },
        { id: "ile-fabuleuse", name: "Île Fabuleuse" },
        { id: "choc-spatio-temporel", name: "Choc Spatio Temporel" },
        { id: "lumiere-triomphale", name: "Lumière Triomphale" },
        { id: "promo-a", name: "Promo A" },
    ];

    return (
        <div className="flex gap-4 mb-8">
            {sets.map((set) => (
                <button
                    key={set.id}
                    onClick={() => onSetChange(set.id)}
                    className={`btn btn-primary px-6 py-3 rounded-lg transition-all ${
                        currentSet === set.id ? "btn-active" : ""
                    }`}
                >
                    {set.name}
                </button>
            ))}
        </div>
    );
};
