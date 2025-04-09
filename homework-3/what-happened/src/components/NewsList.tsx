import React from "react";

export interface NewsItem {
    title: string;
    snippet: string;
    link: string;
}

interface NewsListProps {
    items: NewsItem[];
    isLoading?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ items, isLoading = false }) => {
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
                background: "#f0f2f5",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                boxShadow: "inset -2px 0 5px rgba(0,0,0,0.05)",
            }}
        >
            {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>)
                : items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: "1rem",
                            padding: "1rem",
                            borderRadius: "8px",
                            background: "#fff",
                            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontWeight: "bold",
                                textDecoration: "none",
                                color: "#007bff",
                            }}
                        >
                            {item.title}
                        </a>
                        <p style={{ marginTop: "0.5rem", color: "#444" }}>{item.snippet}</p>
                    </div>
                ))}
        </div>
    );
};

export default NewsList;
