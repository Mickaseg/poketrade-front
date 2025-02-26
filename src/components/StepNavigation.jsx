import React from 'react';

const StepNavigation = ({
                            onPrevious,
                            onNext,
                            nextLabel = "Suivant",
                            previousLabel = "Retour",
                            nextDisabled = false,
                            nextButtonColor = "blue",
                            isSubmitButton = false
                        }) => {
    const getButtonColorClass = (color) => {
        switch (color) {
            case 'green':
                return 'bg-green-500 hover:bg-green-600';
            case 'blue':
            default:
                return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    const nextColorClass = getButtonColorClass(nextButtonColor);

    return (
        <div className="mt-4 flex justify-between">
            {onPrevious && (
                <button
                    onClick={onPrevious}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    {previousLabel}
                </button>
            )}
            {onNext && (
                <button
                    onClick={onNext}
                    className={`px-4 py-2 ${nextColorClass} text-white rounded transition-colors ${nextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={nextDisabled}
                >
                    {nextLabel}
                </button>
            )}
        </div>
    );
};

export default StepNavigation;