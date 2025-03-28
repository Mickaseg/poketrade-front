import { Link, useLocation } from "react-router-dom";
import pokeball from "../../assets/824565.png";
import {
    Power,
    Plus,
    LogIn,
    UserPlus,
    Repeat,
    LayoutGrid,
    FilePlus,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import { useState } from "react";

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExchangeDropdownOpen, setIsExchangeDropdownOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleExchangeDropdown = () => {
        setIsExchangeDropdownOpen(!isExchangeDropdownOpen);
    };

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

                {/* Hamburger Menu Button */}
                <button
                    className="lg:hidden btn btn-square btn-ghost"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile and Tablet Menu */}
                <div
                    className={`fixed inset-0 bg-gray-900 z-50 pt-20 px-6 lg:hidden transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <button
                        className="absolute top-5 right-5 btn btn-square btn-ghost"
                        onClick={toggleMenu}
                        aria-label="Fermer le menu"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col gap-4">
                        <Link
                            to="/galerie"
                            className={`btn btn-primary w-full py-2 rounded-md transition-all duration-200 ${
                                location.pathname === "/galerie"
                                    ? "btn-active"
                                    : ""
                            }`}
                            onClick={toggleMenu}
                        >
                            <LayoutGrid size={16} /> Galerie
                        </Link>

                        {/* Menu déroulant pour les échanges - version mobile */}
                        <div className="relative w-full">
                            <button
                                className={`btn btn-primary w-full py-2 rounded-md transition-all duration-200 flex justify-between items-center ${
                                    location.pathname === "/"
                                        ? "btn-active"
                                        : ""
                                }`}
                                onClick={toggleExchangeDropdown}
                            >
                                <div className="flex items-center">
                                    <Repeat size={16} />
                                    <span className="ml-2">Echanges</span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`transform transition-transform ${
                                        isExchangeDropdownOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {isExchangeDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700 overflow-hidden animate-fadeIn">
                                    <Link
                                        to="/"
                                        className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700 flex items-center gap-2"
                                        onClick={() => {
                                            toggleExchangeDropdown();
                                            toggleMenu();
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Tous les échanges
                                    </Link>
                                    <Link
                                        to="/mytrades"
                                        className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                                        onClick={() => {
                                            toggleExchangeDropdown();
                                            toggleMenu();
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Mes échanges
                                    </Link>
                                </div>
                            )}
                        </div>

                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/offers"
                                    className={`btn btn-primary w-full py-2 rounded-md transition-all duration-200 ${
                                        location.pathname === "/offers"
                                            ? "btn-active"
                                            : ""
                                    }`}
                                    onClick={toggleMenu}
                                >
                                    <FilePlus size={16} /> Mes offres
                                </Link>
                                <Link
                                    to="/create-trade"
                                    className={`w-full py-2 btn btn-accent transition-all duration-200 shadow-sm text-white ${
                                        location.pathname === "/create-trade"
                                            ? "btn-active"
                                            : ""
                                    }`}
                                    onClick={toggleMenu}
                                >
                                    <Plus size={16} />
                                    Créer un échange
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <div className="flex flex-col-reverse justify-center items-center gap-4 mt-4">
                                <span className="text-lg">{user.username}</span>
                                <div className="flex flex-row-reverse items-center gap-6">
                                    <button
                                        onClick={() => {
                                            logout();
                                            toggleMenu();
                                        }}
                                        className="btn btn-error btn-circle"
                                    >
                                        <Power size={20} />
                                    </button>
                                    <Link
                                        to="/notifications"
                                        className="flex justify-center bg-gray-800 p-2 rounded-md"
                                        onClick={toggleMenu}
                                    >
                                        <NotificationBell />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 mt-4">
                                <Link
                                    to="/login"
                                    className="btn btn-primary flex items-center justify-center gap-1 py-2 rounded-md transition-all duration-200"
                                    onClick={toggleMenu}
                                >
                                    <LogIn size={18} />
                                    <span>Connexion</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-accent flex items-center justify-center gap-1 py-2 rounded-md transition-all duration-200"
                                    onClick={toggleMenu}
                                >
                                    <UserPlus size={18} />
                                    <span>Inscription</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex gap-4 items-center">
                    <Link
                        to="/galerie"
                        className={`btn btn-primary px-4 py-2 rounded-md transition-all duration-200 ${
                            location.pathname === "/galerie" ? "btn-active" : ""
                        }`}
                    >
                        <LayoutGrid size={16} /> Galerie
                    </Link>

                    {/* Menu déroulant pour les échanges - version desktop */}
                    <div className="relative">
                        <button
                            className={`btn btn-primary px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-1 ${
                                location.pathname === "/" ? "btn-active" : ""
                            }`}
                            onClick={toggleExchangeDropdown}
                        >
                            <Repeat size={16} />
                            <span>Echanges</span>
                            <ChevronDown
                                size={16}
                                className={`transform transition-transform ${
                                    isExchangeDropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isExchangeDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-md shadow-lg z-10 w-56 border border-gray-700 overflow-hidden animate-fadeIn">
                                <Link
                                    to="/"
                                    className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700 flex items-center gap-2"
                                    onClick={toggleExchangeDropdown}
                                >
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Tous les échanges
                                </Link>
                                <Link
                                    to="/mytrades"
                                    className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                                    onClick={toggleExchangeDropdown}
                                >
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Mes échanges
                                </Link>
                            </div>
                        )}
                    </div>

                    {isAuthenticated && (
                        <>
                            <Link
                                to="/offers"
                                className={`btn btn-primary px-4 py-2 rounded-md transition-all duration-200 ${
                                    location.pathname === "/offers"
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

                {/* User Menu - Desktop */}
                <div className="hidden lg:flex items-center gap-2">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <Link to="/notifications" className="">
                                {isAuthenticated && <NotificationBell />}
                            </Link>

                            <span className="text-lg">{user.username}</span>
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
