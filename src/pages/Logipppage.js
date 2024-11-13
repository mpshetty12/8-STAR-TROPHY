import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const teamPasswords = {
    1: "0password1",
    2: "1password2",
    3: "2password3",
    4: "3password4",
    5: "4password5",
    6: "5password6",
    7: "6password7",
    8: "7password8"
};

const LoginPage = () => {
    const [teamId, setTeamId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const teamPassword = teamPasswords[teamId];
        if (teamPassword && teamPassword === password) {
            sessionStorage.setItem("teamId", teamId);
            sessionStorage.setItem("loggedInTime", Date.now());
            navigate("/bidding");
        } else {
            setError("Invalid Team ID or Password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-banner">
                <h1>Welcome to KPL-2025 Bidding</h1>
                <p>Join the excitement and bid for your winning team! </p>
                <p><strong>will open on December 22nd 2pm</strong></p>
            </div>
            <div className="login-form">
                <h2>Team Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Team ID"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button onClick={handleLogin} className="login-button">Login</button>
            </div>
        </div>
    );
};

export default LoginPage;
