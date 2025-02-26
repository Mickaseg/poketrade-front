export const RarityDisplay = ({ rarity }) => {
    if (!rarity) return null;

    return (
        <div className="flex">
            {rarity.diamonds > 0 && (
                <span className="text-blue-400">{'♦'.repeat(rarity.diamonds)}</span>
            )}
            {rarity.stars > 0 && (
                <span className="text-yellow-400 ml-1">{'★'.repeat(rarity.stars)}</span>
            )}
            {rarity.crowns > 0 && (
                <span className="text-amber-600 ml-1">{'👑'.repeat(rarity.crowns)}</span>
            )}
        </div>
    );
};