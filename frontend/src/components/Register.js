// src/components/Register.js
import React, { useState } from "react";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import { cognitoConfig } from "../cognitoConfig";

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId,
});

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();

        // Generate a unique username using the email (without the "@" symbol)
        const username = email.replace(/@/g, "_");

        const attributeEmail = new CognitoUserAttribute({
            Name: "email",
            Value: email,
        });

        userPool.signUp(username, password, [attributeEmail], null, (err, data) => {
            if (err) {
                console.error("Error signing up:", err);
                alert("Error registering: " + err.message);
                return;
            }
            setIsConfirming(true);
            alert("Registration successful! Check your email for the confirmation code.");
        });
    };

    const handleConfirm = (e) => {
        e.preventDefault();

        const user = new CognitoUser({
            Username: email.replace(/@/g, "_"), // Use the same username transformation as in sign-up
            Pool: userPool,
        });

        user.confirmRegistration(confirmationCode, true, (err, result) => {
            if (err) {
                console.error("Error confirming sign-up:", err);
                alert("Error confirming account: " + err.message);
                return;
            }
            alert("Account confirmed! You can now log in.");
        });
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {!isConfirming ? (
                <form onSubmit={handleRegister} className="space-y-4">
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
                        Register
                    </button>
                </form>
            ) : (
                <form onSubmit={handleConfirm} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Confirmation Code</label>
                        <input
                            type="text"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        Confirm Account
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;
