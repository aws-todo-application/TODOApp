// src/components/Login.js
import React, { useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { cognitoConfig } from "../cognitoConfig";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useNavigate, Link } from "react-router-dom";

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId,
});

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = (e) => {
        e.preventDefault();

        const username = email.replace(/@/g, "_"); // Convert email to username format used in registration
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const user = new CognitoUser({
            Username: username,
            Pool: userPool,
        });

        user.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
                console.log("Login successful!", session);
                if (onLogin) onLogin(session);
                navigate("/"); // Redirect to the home route upon success
            },
            onFailure: (err) => {
                console.error("Login failed:", err);
                setErrorMessage(err.message || "Failed to log in. Please try again.");
            },
        });
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto min-w-[28rem]">
                <h2 className="text-2xl font-bold mb-4">Log In</h2>
                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                        Log In
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
