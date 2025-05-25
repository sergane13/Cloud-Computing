const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const API_KEY = "17981d17cac9228e576d91513342c72a";

// Top soccer leagues supported by the Odds API
const LEAGUES = [
  "soccer_usa_mls",
  "soccer_uefa_european_championship",
  "soccer_sweden_superettan",
  "soccer_sweden_allsvenskan",
  "soccer_spain_segunda_division",
  "soccer_norway_eliteserien",
  "soccer_league_of_ireland",
  "soccer_japan_j_league",
  "soccer_denmark_superliga",
  "soccer_brazil_campeonato",
  "soccer_australia_aleague",
];

exports.fetchLiveSoccerMatches = functions.https.onRequest(async (req, res) => {
  const now = new Date().toISOString();
  console.log(`🔁 Starting fetch at ${now}`);

  let allMatches = [];

  try {
    for (const league of LEAGUES) {
      try {
        const url = `https://api.the-odds-api.com/v4/sports/${league}/odds/?regions=us,uk,eu&markets=h2h&oddsFormat=decimal&dateFormat=iso&apiKey=${API_KEY}`;
        const response = await axios.get(url);
        const matches = response.data || [];

        console.log(`📦 ${league}: ${matches.length} matches`);
        allMatches.push(...matches);
      } catch (err) {
        console.warn("No such league");
      }
    }

    console.log(`🧮 Total matches collected: ${allMatches.length}`);

    const ref = db.collection("live_matches");

    // 🧹 Clear existing matches
    const snapshot = await ref.get();
    const deleteBatch = db.batch();
    snapshot.docs.forEach((doc) => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log(`🧹 Cleared previous live_matches`);

    // 📝 Store new matches
    const writeBatch = db.batch();
    allMatches.forEach((match) => {
      const docId =
        match.id ||
        `${match.home_team || "unknown"}_vs_${match.away_team || "unknown"}_${match.commence_time || "unknown"}`;
      const cleanId = docId.replace(/[^a-zA-Z0-9_-]/g, "_");

      writeBatch.set(ref.doc(cleanId), {
        ...match,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await writeBatch.commit();

    console.log(`✅ Stored ${allMatches.length} matches in Firestore`);
    return res.status(200).json({
      message: `Stored ${allMatches.length} soccer matches across ${LEAGUES.length} leagues.`,
      timestamp: now
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});
