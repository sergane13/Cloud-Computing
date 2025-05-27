import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch {
            setErrorMsg("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "1.2rem",
                width: "100%",
                maxWidth: "400px",
                boxSizing: "border-box",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
        <h2 style={{ color: "#1b5e20", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Login
        </h2>

        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem"
            }}
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem"
            }}
        />

        <button
            onClick={handleLogin}
            disabled={loading}
            style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "none",
            background: "#2e7d32",
            color: "#fff",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
            }}
        >
            {loading ? "Logging in..." : "Login"}
        </button>

        {errorMsg && (
            <div style={{ color: "red", fontSize: "0.9rem", textAlign: "center" }}>
            {errorMsg}
            </div>
        )}
        </div>
    );
};

export default Login;
