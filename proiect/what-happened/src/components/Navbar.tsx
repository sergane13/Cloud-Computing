import React, { useState } from "react";

const filters = ["Soccer", "BasketBall", "Favorites"];

const Navbar: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState("None");

    const navStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#006400", // dark green
        color: "white",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        fontFamily: "'Poppins', sans-serif"
    };

    const filterContainerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
    };

    const buttonStyle: React.CSSProperties = {
        padding: "0.5rem 1rem",
        borderRadius: "20px",
        fontSize: "0.9rem",
        fontWeight: 500,
        background: "#228B22", // forest green
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "background 0.3s"
    };

    const activeButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        background: "white",
        color: "#006400",
        border: "1px solid #006400"
    };

    return (
        <nav style={navStyle}>
            <div style={filterContainerStyle}>
                <span style={{ fontWeight: "bold" }}>Filter:</span>
                {filters.map((filter) => (
                    <button
                        key={filter}
                        style={activeFilter === filter ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
