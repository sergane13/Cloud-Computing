import React from "react";

const Header: React.FC = () => {
    return (
        <header
            style={{
                padding: "1.5rem",
                background: "linear-gradient(to right, #007bff, #00c6ff)",
                color: "white",
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px"
            }}
        >
            🌍 Global News Map
        </header>
    );
};

export default Header;
