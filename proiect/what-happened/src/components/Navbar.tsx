import React, { useEffect, useRef, useState } from "react";
import './styles.css';

interface NavbarProps {
    user: string | null;
    onLogout: () => void;
    activeFilter: "None" | "Favorites";
    setFilter: (filter: "None" | "Favorites") => void;
}

const filters: ("None" | "Favorites")[] = ["None", "Favorites"];

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, activeFilter, setFilter }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#006400",
        color: "white",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        fontFamily: "'Poppins', sans-serif",
        position: "relative"
    };

    const filterContainerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
    };

    const userMenuStyle: React.CSSProperties = {
        position: "relative",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 600,
        userSelect: "none"
    };

    const dropdownStyle: React.CSSProperties = {
        position: "absolute",
        top: "100%",
        right: 0,
        backgroundColor: "white",
        color: "#006400",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginTop: "0.5rem",
        minWidth: "150px",
        zIndex: 10,
        fontWeight: 500
    };

    const dropdownItemStyle: React.CSSProperties = {
        padding: "0.5rem 1rem",
        cursor: "pointer",
        borderBottom: "1px solid #eee"
    };

    const buttonStyle: React.CSSProperties = {
        padding: "0.5rem 1rem",
        borderRadius: "20px",
        fontSize: "0.9rem",
        fontWeight: 500,
        background: "#228B22",
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
                        onClick={() => setFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {user && (
                <div style={userMenuStyle} ref={dropdownRef}>
                    <span onClick={() => setShowDropdown((prev) => !prev)}>
                        User: {user} ⌄
                    </span>
                    {showDropdown && (
                        <div className='user' style={dropdownStyle}>
                            <div style={dropdownItemStyle} onClick={onLogout}>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
