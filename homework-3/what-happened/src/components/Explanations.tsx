import React from "react";

interface ExplanationProps {
    onSearchClick: () => void;
    location: {
        city: string;
        region: string;
        country: string;
        continent: string;
    };
}

const Explanation: React.FC<ExplanationProps> = ({ onSearchClick, location }) => {
    const { city, region, country, continent } = location;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "2rem",
                background: "#fafafa",
                borderTop: "1px solid #e0e0e0",
                fontFamily: "'Poppins', sans-serif",
                textAlign: "center"
            }}
        >
            <p style={{ marginTop: "1rem", fontSize: "1.5rem", color: "#666" }}>
                📍 Current Location: {city && `${city}, `}{region && `${region}, `}{country} {continent && `(${continent})`}
            </p>

            <h2 style={{ marginBottom: "0.5rem", color: "#333" }}>
                Discover Local and Global Headlines
            </h2>

            <p style={{ maxWidth: "500px", color: "#555" }}>
                This map displays real-time headlines from around the world. Zoom and pan to update the focus area, then press the button to fetch the most relevant news.
            </p>



            <button
                onClick={onSearchClick}
                style={{
                    marginTop: "1.5rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(to right, #007bff, #00c6ff)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background 0.3s ease"
                }}
            >
                🔍 Search News
            </button>
        </div>
    );
};

export default Explanation;
