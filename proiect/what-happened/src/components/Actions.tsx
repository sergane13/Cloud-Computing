import React from "react";
import { TeamItem } from "./TeamLists";
import './styles.css';

interface ExplanationProps {
    onSearchClick: () => void;
    location: {
        city: string;
        region: string;
        country: string;
        continent: string;
    };
    selectedTeam: TeamItem | undefined;
    handleFindNews: () => void;
}

const Actions: React.FC<ExplanationProps> = ({ onSearchClick, location, selectedTeam, handleFindNews }) => {
    const { city, region, country, continent } = location;

    return (
        <div
        style={{
            width: "100%",
            padding: "2rem",
            background: "#e8f5e9",
            fontFamily: "'Poppins', sans-serif",
            boxSizing: "border-box",
            overflowX: "hidden"
        }}
        >
        <div
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            maxWidth: "100%",
            boxSizing: "border-box"
            }}
        >
            <div style={{ flexShrink: 0 }}>
            <button
                onClick={handleFindNews}
                disabled={!selectedTeam?.team?.name}
                className="zoom-hover-button"
                style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "10px",
                    border: "none",
                    background: selectedTeam?.team?.name ? "#1b5e20" : "#9e9e9e",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: selectedTeam?.team?.name ? "pointer" : "not-allowed",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    opacity: selectedTeam?.team?.name ? 1 : 0.7,
                    transition: "opacity 0.3s"
                }}
                >
                {selectedTeam?.team?.name
                    ? `Search News about '${selectedTeam.team.name}'`
                    : "Choose a team!"}
            </button>

            </div>

            <div
            style={{
                flexGrow: 1,
                minWidth: 0,
                background: "#ffffff",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #c8e6c9",
                textAlign: "center",
                overflowWrap: "break-word"
            }}
            >
            <p
                style={{
                margin: 0,
                fontSize: "1.2rem",
                color: "#2e7d32",
                fontWeight: 500
                }}
            >
                📍 {city && `${city}, `}{region && `${region}, `}{country} {continent && `(${continent})`}
            </p>
            </div>

            <div style={{ flexShrink: 0 }}>
            <button
                className="zoom-hover-button"
                onClick={onSearchClick}
                style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                background: "#66bb6a",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                }}
            >
                Search Soccer Teams
            </button>
            </div>
        </div>
        </div>
    );
};

export default Actions;
