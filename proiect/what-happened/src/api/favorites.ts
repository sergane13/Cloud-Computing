import { User } from "firebase/auth";

export async function toggleFavoriteRequest(teamName: string, uid: string, shouldAdd: boolean, user: User | null): Promise<"added" | "removed"> {
    const token = await user?.getIdToken();

    const endpoint = "https://newsmaps-gateway-9p2v495a.uc.gateway.dev/manageFavorites";

    const response = await fetch(endpoint, {
            method: shouldAdd ? "POST" : "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        body: JSON.stringify({
        uid,
        favoriteId: teamName,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to ${shouldAdd ? "add" : "remove"} favorite`);
    }

    return shouldAdd ? "added" : "removed";
}