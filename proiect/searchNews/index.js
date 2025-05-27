const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const cacheCollection = db.collection("news-search");

exports.searchNews = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const query = req.query.q?.trim().toLowerCase();

        if (!query) {
            return res.status(400).json({ error: "Missing search query" });
        }

        let cacheDoc;
        try {
            cacheDoc = await cacheCollection.doc(query).get();
        } catch (err) {
            return res.status(501).json({
                error: "Failed to fetch cache.",
                content: err,
            });
        }

        try {
            if (cacheDoc.exists) {
                return res.status(200).json(cacheDoc.data().result);
            }

            const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
            const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

            const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            const data = await response.json();

            await cacheCollection.doc(query).set({
                result: data,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({
                error: "Failed to fetch search results",
                content: err,
            });
        }
    });
});
