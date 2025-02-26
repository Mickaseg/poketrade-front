export const SetSelector = ({currentSet, onSetChange}) => {
    const sets = [
        {id: 'puissance-genetique', name: "Puissance Genetique"},
        {id: 'ile-fabuleuse', name: "Île Fabuleuse"},
        {id: 'choc-spatio-temporel', name: "Choc Spatio-Temporel"}
    ];

    return (
        <div className="flex gap-4 mb-8">
            {sets.map((set) => (
                <button
                    key={set.id}
                    onClick={() => onSetChange(set.id)}
                    className={`px-6 py-3 rounded-lg transition-all ${
                        currentSet === set.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                    {set.name}
                </button>
            ))}
        </div>
    );
};