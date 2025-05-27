import React, { useEffect, useState } from "react";
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
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./api/firebase";
import { signOut } from "firebase/auth";
import { AuthPage } from "./components/AuthPage.tsx";
import { toggleFavoriteRequest } from "./api/favorites.ts";
import { getUserFavorites } from "./api/firestore.ts";


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const [selectedClusterTeams, setSelectedClusterTeams] = useState<TeamItem[]>([]);
  const [teamsResults, setTeamsResults] = useState<TeamItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamItem>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const { country, region, city, continent } = useLocationContext();
  const [news, setNews] = useState<SearchNewsItem[]>()

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"None" | "Favorites">("None");

  const toggleFavorite = async (team: TeamItem) => {
    if (!user) return;

    const updated = new Set(favorites);
    const name = team.team.name;
    const shouldAdd = !updated.has(name);

    try {
      const action = await toggleFavoriteRequest(name, user.uid, shouldAdd, user);

      if (action === "removed") {
        updated.delete(name);
      } else {
        updated.add(name);
      }

      setFavorites(updated);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleFindTeamsClick = async () => {
    setLoading(true);
    try {
      const [teams] = await searchTeams(user, city, country);
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
      const results = await searchNews(user, query);
      setNews(results)
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoadingNews(false);
  };

  const handleOnLogout = async () => {
    signOut(auth)
      .then(() => {
        setFavorites(new Set());
        setTeamsResults([]);
        setSelectedClusterTeams([]);
        setSelectedTeam(undefined);
        setNews(undefined);
        setUser(null);
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const favArray = await getUserFavorites();
        setFavorites(new Set(favArray));
      }
    };

    fetchFavorites();
  }, [user])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoadingUser(false);
    });

    return () => {
      unsubscribe();
    } 
  }, []);

  if (loadingUser) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f1f8f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AuthPage />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100vw", height: "100vh" }}>
      <Header />
      <Navbar user={user.email} onLogout={handleOnLogout} activeFilter={filter} setFilter={setFilter}/>
      <div style={{ display: "flex", width: "100%", height: "auto" }}>
        <TeamsLists 
          items={selectedClusterTeams} 
          isLoading={loading} 
          setSelectedTeam={setSelectedTeam}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          filter={filter}
        />
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
