// Funcionalidades / Libs:
import { Routes, Route } from "react-router-dom";

// Pages:
import Home from "./pages/Home";
import Voucher from "./pages/Voucher";
import Game from "./pages/Game";
// import Fim from "./pages/Fim";
// import Brocked from "./pages/Brocked";

// Components:
// import PrivateRoute from "./utils/PrivateRoute";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={ <Home/> } />

            <Route path="/voucher" element={ <Voucher/> } />

            <Route path="/game" element={ <Game/> } />
        </Routes>
    )
}