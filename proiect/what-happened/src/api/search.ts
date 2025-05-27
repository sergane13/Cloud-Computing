import { User } from "firebase/auth";

export const searchNews = async (user: User | null, query: string) => {
    const token = await user?.getIdToken();

    try {
        const response = await fetch(
            `https://newsmaps-gateway-9p2v495a.uc.gateway.dev/searchNews?q=${encodeURIComponent(query)}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch news results");
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("searchNews error:", error);
        return [];
    }
};
