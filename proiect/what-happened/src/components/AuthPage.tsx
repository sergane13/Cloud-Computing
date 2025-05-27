import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f1f8f4",
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif"
    };

    const toggleButtonStyle: React.CSSProperties = {
        marginTop: "1rem",
        background: "none",
        border: "none",
        color: "#2e7d32",
        fontSize: "0.95rem",
        cursor: "pointer",
        textDecoration: "underline",
        fontWeight: 500
    };

    return (
        <div style={containerStyle}>
            {isLogin ? <Login /> : <Register />}
            <button onClick={() => setIsLogin(!isLogin)} style={toggleButtonStyle}>
                {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
            </button>
        </div>
    );
};
