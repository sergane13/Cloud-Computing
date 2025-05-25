const admin = require('firebase-admin');
const fetch = require("node-fetch");

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const cacheCollection = db.collection("news-search");

exports.searchNews = async (req, res) => {
    const query = req.query.q?.trim().toLowerCase();

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    let cacheDoc;
    try {
        cacheDoc = await cacheCollection.doc(query).get();
    } catch (err) {
        res.status(501).json({
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

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch search results",
            content: err,
        });
    }
};
