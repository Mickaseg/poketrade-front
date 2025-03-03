import "./App.css";

import { Trades } from "./page/Trades.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import CreateTrade from "./page/CreateTrade.jsx";
import TradeDetails from "./page/TradeDetails.jsx";
import ShareExchange from "./page/ShareExchange.jsx";
import CardGrid from "./page/CardGalerie.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RegisterPrompt from "./components/RegisterPrompt.jsx";

// Composant Protected Route
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
                <BrowserRouter>
                    <RegisterPrompt />
                    <Navbar />
            <div className="w-full mx-auto px-1 sm:px-4 lg:px-8 py-4 sm:py-6">
                    <Routes>
                        <Route path="/galerie" element={<CardGrid />} />
                        <Route path="/" element={<Trades />} />
                        <Route
                            path="/trade/:tradeId"
                            element={<TradeDetails />}
                        />

                        <Route
                            path="/create-trade"
                            element={
                                <ProtectedRoute>
                                    <CreateTrade />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/share-exchange"
                            element={<ShareExchange />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
            </div>
                    {/* <Footer /> */}
                </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
