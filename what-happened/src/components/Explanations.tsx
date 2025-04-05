import React from "react";

const Explanation: React.FC = () => {
    return (
        <div style={{
            marginTop: "1rem",
            padding: "1rem",
            textAlign: "center",
            fontSize: "1rem",
            color: "#333"
        }}>
            This map displays real-time headlines from around the world. Pan and zoom into any region to discover the latest local news.
        </div>
    );
};

export default Explanation;