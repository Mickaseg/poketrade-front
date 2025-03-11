import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/loginApi";
import { toast } from "react-hot-toast";
const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const data = await loginApi(credentials);
            login(data);
            toast.success("Connexion réussie!");
            navigate("/");
        } catch (err) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* SEO */}
                <SEOHead
                    title="Connexion - TradeHelper"
                    description="Connexion à votre compte TradeHelper"
                    canonicalUrl="https://tradehelper.seguin.cefim.o2switch.site/login"
                />

                {/* Logo et titre */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Connexion à votre compte
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ou{" "}
                        <a
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            créer un nouveau compte
                        </a>
                    </p>
                </div>

                {/* Formulaire de connexion */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md space-y-px flex flex-col gap-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Adresse e-mail
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Adresse e-mail"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mot de passe"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        {error}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="btn btn-primary btn-wide"
                            disabled={isLoading}
                        >
                            {isLoading ? "Connexion en cours..." : "Connexion"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
