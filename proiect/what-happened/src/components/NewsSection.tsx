import React from "react";
import './styles.css'

export interface SearchNewsItem {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
    pagemap?: {
        cse_image?: { src: string }[];
    };
}

interface NewsSectionProps {
    newsItems: SearchNewsItem[] | undefined;
    isLoading?: boolean;
}

const skeletonCard = (
    <div
        style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "1.2rem",
        flex: "1 1 300px",
        boxSizing: "border-box",
        height: "300px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        animation: "pulse 1.5s infinite",
        }}
    >
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#e0e0e0" }} />
        <div style={{ width: "70%", height: "18px", background: "#e0e0e0", borderRadius: "4px" }} />
        <div style={{ width: "90%", height: "14px", background: "#e0e0e0", borderRadius: "4px" }} />
        <div style={{ width: "80%", height: "14px", background: "#e0e0e0", borderRadius: "4px" }} />
        <div style={{ width: "60%", height: "12px", background: "#e0e0e0", borderRadius: "4px" }} />
    </div>
);

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems, isLoading = false }) => {
    return (
        <section
        style={{
            width: "100%",
            background: "#f1f8f4",
            padding: "2rem 3rem",
            fontFamily: "'Poppins', sans-serif",
            boxSizing: "border-box",
            overflowX: "hidden"
        }}
        >
        <h2
            style={{
            color: "#1b5e20",
            fontSize: "2rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            textAlign: "center"
            }}
        >
            📰 News Search Results
        </h2>

        <div
            style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "center",
            boxSizing: "border-box"
            }}
        >
            {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => <React.Fragment key={idx}>{skeletonCard}</React.Fragment>)
            : newsItems?.map((item, index) => {
                const image =
                    item.pagemap?.cse_image?.[0]?.src ||
                    "https://via.placeholder.com/300x150?text=No+Image";

                return (
                    <div
                    key={index}
                    style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        padding: "1.2rem",
                        flex: "1 1 300px",
                        boxSizing: "border-box",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "left",
                        minHeight: "350px"
                    }}
                    >
                    <img
                        src={image}
                        alt={item.title}
                        style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "1rem"
                        }}
                    />
                    <h3 style={{ color: "#2e7d32", fontSize: "1.1rem", fontWeight: 600 }}>
                        {item.title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "#444", margin: "0.5rem 0" }}>
                        {item.snippet}
                    </p>
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                        fontSize: "0.85rem",
                        color: "#2e7d32",
                        textDecoration: "underline",
                        marginTop: "auto"
                        }}
                    >
                        {item.displayLink}
                    </a>
                    </div>
                );
                })}
        </div>
        </section>
    );
};

export default NewsSection;
