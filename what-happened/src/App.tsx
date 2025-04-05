import React from "react";
import Header from "./components/Header";
import NewsMap from "./components/NewsMap";
import Explanations from "./components/Explanations";

const App: React.FC = () => {
  return (
    <div style={{
      maxWidth: "80vw",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <Header />
      <NewsMap />
      <Explanations />
    </div>
  );
};

export default App;


