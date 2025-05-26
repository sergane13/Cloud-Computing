const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.registerUser = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).send("Missing fields");
    }

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        await db.collection("users").doc(userRecord.uid).set({
            email,
            name,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(201).send({ message: "User registered", uid: userRecord.uid });
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
        return res.status(400).send({ error: "Email is already registered." });
        }

        console.error("Error registering user:", error);
        return res.status(500).send({ error: error.message });
    }
});