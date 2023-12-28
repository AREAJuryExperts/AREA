import React, { useEffect } from "react";

//Import for navigation through pages
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import LoginPage from "./LoginPage/LoginPage";
import HomePage from "./HomePage/HomePage";
import RegisterPage from "./RegisterPage/RegisterPage";
import Confirm from "./Confirm/confirm";
import WaitingPage from "./RegisterPage/WaitingPage";
import ConfirmTrello from "./Confirm/confirmTrello";
import ConfirmDiscord from "./Confirm/confirmDiscord";
import ConfirmGithub from "./Confirm/confirmGithub";
import ConfirmAsana from "./Confirm/confirmAsana";
import ConfirmDiscordLogin from "./Confirm/confirmDiscordLogin";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/confirm" element={<Confirm />} />
                <Route path="/confirmTrello" element={<ConfirmTrello />} />
                <Route path="/confirmDiscord" element={<ConfirmDiscord />} />
                <Route path="/confirmDiscordLogin" element={<ConfirmDiscordLogin />} />
                <Route path="/confirmGithub" element={<ConfirmGithub />} />
                <Route path="/confirmAsana" element={<ConfirmAsana />} />
                <Route path="/waitingConfirmation" element={<WaitingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
