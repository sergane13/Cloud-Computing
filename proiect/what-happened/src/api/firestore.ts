import { getAuth } from "firebase/auth";

export async function getUserFavorites(): Promise<string[]> {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    const token = await auth.currentUser?.getIdToken();

    if (!uid) {
        console.warn("No user is currently authenticated.");
        return [];
    }

    try {
        const response = await fetch(
            `https://newsmaps-gateway-9p2v495a.uc.gateway.dev/manageFavorites?uid=${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch favorites: ${response.statusText}`);
        }

        const data = await response.json();
        return data.favorites || [];
    } catch (err) {
        console.error("Error fetching favorites from Cloud Function:", err);
        return [];
    }
}
