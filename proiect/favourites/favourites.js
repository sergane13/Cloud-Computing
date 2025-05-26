const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.manageFavorites = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST" && req.method !== "DELETE") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { uid, favoriteId } = req.body;

        if (!favoriteId || !uid) {
            return res.status(400).json({ error: "Missing favoriteId or uid in request body" });
        }

        try {
            const userDocRef = db.collection("users").doc(uid);

            if (req.method === "POST") {
                await userDocRef.set(
                {
                    favorites: admin.firestore.FieldValue.arrayUnion(favoriteId),
                },
                { merge: true }
                );
                return res.status(200).json({ message: `Added ${favoriteId} to favorites for user ${uid}` });
            } else if (req.method === "DELETE") {
                await userDocRef.update({
                    favorites: admin.firestore.FieldValue.arrayRemove(favoriteId),
                });
                return res.status(200).json({ message: `Removed ${favoriteId} from favorites` });
            }
        } catch (error) {
            console.error("Error managing favorites:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
});