const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({ origin: true });

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const API_KEY = "e190c69d7fe49e7e07761c638d436a4d";

exports.getTeamsByCity = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const { city, country } = req.query;

        if (!country) {
            return res.status(400).json({
                error: "Missing required parameter: country"
            });
        }

        try {
            const cacheRef = db.collection("team_cache").doc(country);
            const doc = await cacheRef.get();

            let teams;
            if (doc.exists) {
                teams = doc.data().teams;
            } else {
                const response = await axios.get(
                    `https://v3.football.api-sports.io/teams?country=${encodeURIComponent(country)}`,
                    {
                        headers: {
                            "x-apisports-key": API_KEY
                        }
                    }
                );
                teams = response.data.response;
                await cacheRef.set({ teams });
            }

            let filteredTeams = teams;
            if (city) {
                filteredTeams = teams.filter(
                    (t) =>
                        t.venue &&
                        t.venue.city &&
                        t.venue.city.toLowerCase() === city.toLowerCase()
                );
            }

            filteredTeams = filteredTeams.slice(0, 200);

            return res.status(200).json({
                city: city || null,
                country,
                teams: filteredTeams
            });
        } catch (err) {
            console.error("Error:", err.message);
            return res.status(500).json({
                error: "Internal server error",
                message: err.message
            });
        }
    });
});
