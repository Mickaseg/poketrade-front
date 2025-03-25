import "./App.css";
import { NotificationProvider } from "./context/NotificationContext";
import { Trades } from "./page/Trades.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import CreateTrade from "./page/CreateTrade.jsx";
import TradeDetails from "./page/TradeDetails.jsx";
import CardGalerie from "./page/CardGalerie.jsx";
import Footer from "./components/layout/Footer.jsx";
import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RegisterPrompt from "./components/auth/RegisterPrompt.jsx";
import Offers from "./page/Offers.jsx";
import NotificationsPage from "./page/NotificationsPage.jsx";
import MyTrades from "./page/MyTrades.jsx";
import ProfilePage from "./page/ProfilePage.jsx";
// Composant Protected Route
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loadingAuth } = useAuth();

    // Attendre que la vérification d'authentification soit terminée
    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center h-screen">
                Chargement...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <RegisterPrompt />
                    <Navbar />
                    <div
                        className="bg-gray-100 w-full mx-auto px-1 sm:px-4 lg:px-8 py-4 sm:py-6"
                        style={{ minHeight: "calc(100vh - 80px)" }}
                    >
                        <Routes>
                            <Route path="/galerie" element={<CardGalerie />} />
                            <Route path="/" element={<Trades />} />
                            <Route
                                path="/trade/:tradeId"
                                element={
                                    <ProtectedRoute>
                                        <TradeDetails />
                                    </ProtectedRoute>
                                }
                            />
                            {/* <Route
                                path="/trade/:tradeId/edit"
                                element={
                                    <ProtectedRoute>
                                        <EditTrade />
                                    </ProtectedRoute>
                                }
                            /> */}
                            <Route
                                path="/create-trade"
                                element={
                                    <ProtectedRoute>
                                        <CreateTrade />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/offers"
                                element={
                                    <ProtectedRoute>
                                        <Offers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/mytrades"
                                element={
                                    <ProtectedRoute>
                                        <MyTrades />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/notifications"
                                element={
                                    <ProtectedRoute>
                                        <NotificationsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                    </div>
                    {/* <Footer /> */}
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
