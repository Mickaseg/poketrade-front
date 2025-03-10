import { Link, useLocation } from "react-router-dom";
import pokeball from "../../assets/824565.png";
import { Power, Plus, LogIn, UserPlus, Repeat, LayoutGrid, FilePlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user);

    return (
        <nav className="bg-gray-900 shadow-lg px-12 py-5 text-white">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo and Title */}
                <div className="font-bold text-xl">
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-90 transition-all duration-200"
                        aria-label="Return to homepage"
                    >
                        <img
                            src={pokeball}
                            className="w-6 h-6"
                            alt="Pokeball logo"
                            loading="eager"
                        />
                        <span>TradeHelper</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex gap-4 items-center">
                    <Link
                        to="/galerie"
                        className={`btn btn-primary px-4 py-2 rounded-md transition-all duration-200 ${
                            location.pathname === "/galerie" ? "btn-active" : ""
                        }`}
                    >
                        <LayoutGrid size={16} /> Galerie
                    </Link>
                    <Link
                        to="/"
                        className={`btn btn-primary px-4 py-2 rounded-md transition-all duration-200 ${
                            location.pathname === "/" ? "btn-active" : ""
                        }`}
                    >
                        <Repeat size={16} /> Echanges
                    </Link>
                    {isAuthenticated && (
                        <>
                    <Link
                        to="/mytrades"
                        className={`btn btn-primary px-4 py-2 rounded-md transition-all duration-200 ${
                            location.pathname === "/mytrades"
                                ? "btn-active"
                                : ""
                        }`}
                    >
                        <FilePlus size={16} /> Mes offres
                    </Link>
                        <Link
                            to="/create-trade"
                            className={`px-4 py-2 btn btn-accent transition-all duration-200 shadow-sm text-white ${
                                location.pathname === "/create-trade"
                                    ? "btn-active"
                                    : ""
                            }`}
                            aria-label="Créer un nouvel échange"
                        >
                            <Plus size={16} />
                            Créer un échange
                        </Link>
                        </>
                    )}
                </div>

                {/* User Menu */}
                <div className="hidden md:flex items-center gap-2">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <Link to="/notifications" className="">
                                {isAuthenticated && <NotificationBell />}
                            </Link>

                            <span className="text-lg">{user.username}{" "}{user.email}</span>
                            <button
                                onClick={logout}
                                className="btn btn-error btn-circle"
                            >
                                <Power size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="btn btn-primary flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200"
                            >
                                <LogIn size={18} />
                                <span className="hidden sm:inline">
                                    Connexion
                                </span>
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-accent flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200"
                            >
                                <UserPlus size={18} />
                                <span className="hidden sm:inline">
                                    Inscription
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
