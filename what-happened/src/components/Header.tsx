import React from "react";

const Header: React.FC = () => {
    return (
        <header style={{
            padding: "1rem",
            backgroundColor: "white",
            color: "grey",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold"
        }}>
            🌍 Global News Map
        </header>
    );
};

export default Header;