import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RegisterPrompt = () => {
    const [dismissed, setDismissed] = useState(false);
    const { isAuthenticated } = useAuth();

    // Don't show the prompt if user is authenticated or has dismissed it
    if (isAuthenticated || dismissed) {
        return null;
    }

    return (
        <div className="bg-indigo-600 text-white p-3">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex-1 text-center">
                    <p className="text-sm md:text-base">
                        <span className="font-bold">Créez un compte</span> pour proposer vos propres échanges et accéder à toutes les fonctionnalités !
                        <Link to="/register" className="ml-2 underline font-semibold hover:text-indigo-200 transition-colors">
                            S'inscrire maintenant
                        </Link>
                    </p>
                </div>
                <button 
                    onClick={() => setDismissed(true)}
                    className="ml-2 p-1 rounded-full hover:bg-indigo-700 transition-colors"
                    aria-label="Fermer"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default RegisterPrompt; 