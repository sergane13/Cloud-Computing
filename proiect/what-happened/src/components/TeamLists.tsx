import React from "react";
import './styles.css';
import { User, getAuth } from "firebase/auth";

export interface TeamItem {
    position: { lat: number, lng: number },
    team: { country: string, founded: string, logo: string, name: string },
    venue: { address: string, city: string }
}

interface NewsListProps {
    items: TeamItem[];
    isLoading: boolean;
    setSelectedTeam: (team: TeamItem) => void;
    favorites: Set<string>;
    toggleFavorite: (team: TeamItem, user: User | null) => Promise<void>;
    filter: "None" | "Favorites";
}

const TeamsLists: React.FC<NewsListProps> = ({
    items,
    isLoading = false,
    setSelectedTeam,
    favorites,
    toggleFavorite,
    filter
}) => {

    const filteredItems =
        filter === "Favorites"
            ? items.filter(item => favorites.has(item.team.name))
            : items;

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
                : filteredItems.map((item, index) => (
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
                            position: "relative"
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

                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                const auth = getAuth();
                                const user = auth.currentUser;
                                toggleFavorite(item, user);
                            }}
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "25px",
                                cursor: "pointer",
                                height: "24px",
                                width: "24px",
                            }}
                            title={favorites.has(item.team.name) ? "Remove from favorites" : "Add to favorites"}
                        >
                            {favorites.has(item.team.name) ? (
                                <svg viewBox="0 0 24 24" fill="#e53935" width="24" height="24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                            2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                                            C13.09 3.81 14.76 3 16.5 3 
                                            19.58 3 22 5.42 22 8.5 
                                            c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" width="24" height="24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                                            2 5.42 4.42 3 7.5 3 
                                            c1.74 0 3.41 0.81 4.5 2.09 
                                            C13.09 3.81 14.76 3 16.5 3 
                                            19.58 3 22 5.42 22 8.5 
                                            c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            )}
                        </div>

                    </div>
                ))}
        </div>
    );
};

export default TeamsLists;
