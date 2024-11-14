// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
    const [userSession, setUserSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state to handle session check

    useEffect(() => {
        // Check if there's a saved session in localStorage
        const savedSession = localStorage.getItem("userSession");
        if (savedSession) {
            setUserSession(JSON.parse(savedSession));
        }
        setIsLoading(false); // Set loading to false once session check is complete
    }, []);

    const handleLogin = (session) => {
        setUserSession(session);
        localStorage.setItem("userSession", JSON.stringify(session));
    };

    const handleLogout = () => {
        setUserSession(null);
        localStorage.removeItem("userSession");
    };

    // Display a loading state until the session is checked
    if (isLoading) {
        return <div></div>; // You could add a spinner or other loading indicator here
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={userSession ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
        </Router>
    );
}

export default App;
