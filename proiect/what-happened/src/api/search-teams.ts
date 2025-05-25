export const searchTeams = async (city: string, country: string) => {
    try {
        let url = "https://us-central1-news-maps-455910.cloudfunctions.net/getTeamsByCity";

        if (country !== "Worldwide") {
            const params = new URLSearchParams();
            params.append("country", country);
            if (city.trim() !== "") {
                params.append("city", city);
            }
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
        throw new Error("Failed to fetch teams");
        }

        const data = await response.json();
        return [data.teams || [], data.matches || []];
    } catch (error) {
        console.error("searchTeams error:", error);
        return [];
    }
};