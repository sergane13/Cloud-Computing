import React, { useState } from "react";
import Header from "./components/Header";
import NewsMap from "./components/NewsMap";
import Explanation from "./components/Explanations";
import NewsList, { NewsItem } from "./components/NewsList.tsx";
import { searchNews } from "./api/search";
import { useLocationContext } from "./context/LocationContext";

const App: React.FC = () => {
  const [newsResults, setNewsResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { country, region, city, continent } = useLocationContext();

  const handleSearchClick = async () => {
    let queryParts: string[] = [country];
    if (region) queryParts.push(region);
    if (city) queryParts.push(city);
    if (continent) queryParts.push(`(${continent})`);

    const finalQuery = `${queryParts.join(" ")} news`;
    console.log("Final query:", finalQuery);

    setLoading(true);
    try {
      const results = await searchNews(finalQuery);
      console.log("Search results:", results);
      setNewsResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "100vw", height: "100vh" }}>
      <Header />

      <div style={{ display: "flex", width: "100%", height: "auto" }}>
        <NewsList items={newsResults} isLoading={loading} />
        <div style={{ width: "70%" }}>
          <NewsMap />
        </div>
      </div>

      <Explanation
        onSearchClick={handleSearchClick}
        location={{ city, region, country, continent }}
      />
    </div>
  );
};

export default App;
