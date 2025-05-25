import React from "react";
import './styles.css';

export interface TeamItem {
    position: {
        lat: number,
        lng: number,
    },
    team: {
        country: string,
        founded: string,
        logo: string,
        name: string,
    };
    venue: {
        address: string,
        city: string,
    };
}

interface NewsListProps {
    items: TeamItem[];
    isLoading: boolean;
    setSelectedTeam: (team: TeamItem) => void;
}

const TeamsLists: React.FC<NewsListProps> = ({ items, isLoading = false, setSelectedTeam }) => {
    const renderSkeleton = () => (
        <div
        style={{
            marginBottom: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            background: "#eee",
            animation: "pulse 1.5s infinite",
        }}
        >
        <div style={{ height: "20px", width: "80%", background: "#ddd", borderRadius: "4px" }}></div>
        <div style={{ height: "14px", width: "100%", background: "#ddd", borderRadius: "4px", marginTop: "0.5rem" }}></div>
        </div>
    );

    return (
        <div
        style={{
            width: "30%",
            height: "60vh",
            overflowY: "scroll",
            padding: "1rem",
            borderRight: "1px solid #ddd",
            boxSizing: "border-box",
            background: "#fff",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
            boxShadow: "inset -2px 0 5px rgba(0,0,0,0.05)",
        }}
        >
        {isLoading
            ? Array.from({ length: 10 }).map((_, idx) => <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>)
            : items.map((item, index) => (
                <div
                    className="zoom-hover-button"
                    key={index}
                    onClick={() => setSelectedTeam(item)}
                    style={{
                        marginBottom: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                        background: "#e8f5e9",
                        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "bold", color: "#333", fontSize: "1.23rem" }}>
                        {item.team.name}
                        </span>
                        <img
                        src={item.team.logo}
                        alt={`${item.team.name} logo`}
                        style={{ height: "40px", width: "40px", objectFit: "contain", marginLeft: "0.5rem" }}
                        />
                    </div>

                    <div style={{ marginTop: "0.5rem", color: "#555", fontSize: "0.9rem" }}>
                        {item.venue.address}, {item.venue.city}
                    </div>

                    <div style={{ color: "#777", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                        Founded: {item.team.founded}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeamsLists;