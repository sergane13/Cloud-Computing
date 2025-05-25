import React from "react";

const Header: React.FC = () => {
    return (
        <header
            style={{
                padding: "1.5rem",
                background: "linear-gradient(to right, #006400, #00c851)", // soccer green
                color: "white",
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                letterSpacing: "0.6px",
                borderBottom: "4px solid #ffffff33"
            }}
            >
            ⚽ Global Soccer Teams News ⚽
        </header>
    );
};

export default Header;
