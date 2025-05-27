const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.manageFavorites = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method === "OPTIONS") {
            res.status(204).send("");
            return;
        }

        const { uid, favoriteId } = req.method === "GET" ? req.query : req.body;

        if (!uid) {
        return res.status(400).json({ error: "Missing uid in request" });
        }

        try {
        const userDocRef = db.collection("users").doc(uid);

        if (req.method === "GET") {
            const userDocSnap = await userDocRef.get();

            if (!userDocSnap.exists) {
            return res.status(200).json({ favorites: [] });
            }

            const data = userDocSnap.data();
            return res.status(200).json({ favorites: data.favorites || [] });
        }

        if (req.method === "POST") {
            if (!favoriteId) {
            return res.status(400).json({ error: "Missing favoriteId in request body" });
            }

            await userDocRef.set(
            {
                favorites: admin.firestore.FieldValue.arrayUnion(favoriteId),
            },
            { merge: true }
            );

            return res.status(200).json({ message: `Added ${favoriteId} to favorites for user ${uid}` });
        }

        if (req.method === "DELETE") {
            if (!favoriteId) {
            return res.status(400).json({ error: "Missing favoriteId in request body" });
            }

            await userDocRef.update({
            favorites: admin.firestore.FieldValue.arrayRemove(favoriteId),
            });

            return res.status(200).json({ message: `Removed ${favoriteId} from favorites` });
        }

        return res.status(405).json({ error: "Method not allowed" });
        } catch (error) {
        console.error("Error managing favorites:", error);
        return res.status(500).json({ error: "Internal server error" });
        }
    });
});
