export const LoadingSpinner = ({ message = "Chargement..." }) => {
    return (
        <div className="container mx-auto px-6 py-16 text-center">
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

export default LoadingSpinner;

