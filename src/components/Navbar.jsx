import { Link, useLocation } from 'react-router-dom';
import pokeball from "../assets/824565.png"
import { Plus } from "lucide-react";
const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg p-4 text-white">
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
                <div className="flex gap-3 items-center">
                    <Link
                        to="/galerie"
                        className={`px-4 py-2 rounded-md transition-all duration-200 ${location.pathname === '/galerie'
                                ? 'bg-white text-blue-700 font-medium'
                                : 'hover:bg-blue-600 hover:text-white'
                            }`}
                    >
                        Galerie
                    </Link>
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded-md transition-all duration-200 ${location.pathname === '/'
                                ? 'bg-white text-blue-700 font-medium'
                                : 'hover:bg-blue-600 hover:text-white'
                            }`}
                    >
                        Voir les échanges
                    </Link>
                    <Link
                        to="/create-trade"
                        className="px-4 py-2 bg-green-500 rounded-md font-medium flex items-center gap-1 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        aria-label="Créer un nouvel échange"
                    >
                        <Plus size={16} />
                        Créer un échange
                    </Link>
                </div>

                {/* User Menu - Optional */}
                <div className="hidden md:block">
                    {/*<button className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200">*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
                    {/*        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />*/}
                    {/*        <circle cx="12" cy="7" r="4" />*/}
                    {/*    </svg>*/}
                    {/*    <span>Profil</span>*/}
                    {/*</button>*/}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;