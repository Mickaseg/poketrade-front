import './App.css'

import {Trades} from "./page/Trades.jsx";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import CreateTrade from "./page/CreateTrade.jsx";
import TradeDetails from "./page/TradeDetails.jsx";
import ShareExchange from "./page/ShareExchange.jsx";
import CardGrid from "./page/CardGalerie.jsx";

function App() {


    return (
        <div className="min-h-screen bg-gray-100">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/galerie" element={ <CardGrid/>}/>
                    <Route path="/" element={<Trades/>}/>
                    <Route path="/trades/:tradeId" element={<TradeDetails />} />
                    <Route path="/create-trade" element={<CreateTrade />} />
                    <Route path="/share-exchange" element={<ShareExchange />} />
                </Routes>
            </BrowserRouter>
        </div>
)
}

export default App
