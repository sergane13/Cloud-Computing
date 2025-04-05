import React from "react";
import { useLocationContext } from "../context/LocationContext";
import { searchNews } from "../api/search";

const Explanation: React.FC = () => {
    const { country, region, city, continent } = useLocationContext();

    const handleSearchClick = async () => {
        let queryParts: string[] = [country];

        if (region) queryParts.push(region);
        if (city) queryParts.push(city);
        if (continent) queryParts.push(`(${continent})`);

        const finalQuery = `${queryParts.join(" ")} news`;

        console.log("Final query:", finalQuery);

        try {
            const results = await searchNews(finalQuery);
            console.log("Search results:", results);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    return (
        <div style={{
            marginTop: "1rem",
            padding: "1rem",
            textAlign: "center",
            fontSize: "1rem",
            color: "#333"
        }}>
            <p>This map displays real-time headlines from around the world.</p>
            <p>Please press the button to search news from current location.</p>
            <button
                onClick={handleSearchClick}
                style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#007bff",
                    color: "#fff",
                    cursor: "pointer"
                }}
            >
                Search News
            </button>
        </div>
    );
};

export default Explanation;
