import React, { useState } from "react";
import Header from "./components/Header";
import TeamsMap from "./components/TeamsMap.tsx";
import Actions from "./components/Actions.tsx";
import TeamsLists, { TeamItem } from "./components/TeamLists.tsx";
import { searchTeams } from "./api/search-teams.ts";
import { useLocationContext } from "./context/LocationContext";
import { geocodeAddresses } from "./api/geocode.ts";
import Navbar from "./components/Navbar.tsx";
import NewsSection, { SearchNewsItem } from "./components/NewsSection.tsx";
import { searchNews } from "./api/search.ts";

const App: React.FC = () => {
  const [selectedClusterTeams, setSelectedClusterTeams] = useState<TeamItem[]>([]);
  const [teamsResults, setTeamsResults] = useState<TeamItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);

  const { country, region, city, continent } = useLocationContext();
  const [news, setNews] = useState<SearchNewsItem[]>()

  const handleFindTeamsClick = async () => {
    setLoading(true);
    try {
      const [teams] = await searchTeams(city, country);
      const markers = await geocodeAddresses(teams, country);
      setTeamsResults(markers)
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  };

  function buildNewsQuery(team: TeamItem | undefined): string {
    const name = team?.team?.name || "";
    const country = team?.team?.country || "";
    return `${name} ${country} football news`.trim();
  }

  const handleFindNews = async () => {
    setLoadingNews(true);
    try {
      const query = buildNewsQuery(selectedTeam);
      const results = await searchNews(query);
      setNews(results)
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoadingNews(false);
  };

  return (
    <div style={{ maxWidth: "100vw", height: "100vh" }}>
      <Header />
      <Navbar />
      <div style={{ display: "flex", width: "100%", height: "auto" }}>
        <TeamsLists items={selectedClusterTeams} isLoading={loading} setSelectedTeam={setSelectedTeam}/>
        <div style={{ width: "100%" }}>
          <TeamsMap items={teamsResults} onClusterTeamsSelect={setSelectedClusterTeams}/>
        </div>
      </div>

      <Actions
        onSearchClick={handleFindTeamsClick}
        location={{ city, region, country, continent }}
        selectedTeam = {selectedTeam}
        handleFindNews = {handleFindNews}
      />
      <NewsSection
        newsItems={news}
        isLoading={loadingNews}
      />
    </div>
  );
};

export default App;
