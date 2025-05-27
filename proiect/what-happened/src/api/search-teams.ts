import { User } from "firebase/auth";

export const searchTeams = async (user: User | null ,city: string, country: string) => {
    const token = await user?.getIdToken();

    try {
        let url = "https://newsmaps-gateway-9p2v495a.uc.gateway.dev/getTeamsByCity";

        if (country !== "Worldwide") {
            const params = new URLSearchParams();
            params.append("country", country);
            if (city.trim() !== "") {
                params.append("city", city);
            }
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

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