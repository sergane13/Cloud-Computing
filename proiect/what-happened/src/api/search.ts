export const searchNews = async (query: string) => {
    try {
        const response = await fetch(
            `https://us-central1-news-maps-455910.cloudfunctions.net/searchNews?q=${encodeURIComponent(query)}`
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
