const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const API_KEY = "";

exports.loginUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { idToken, refreshToken, localId } = response.data;

      return res.status(200).json({
        uid: localId,
        email,
        idToken,
        refreshToken,
      });
    } catch (error) {
      const message = error?.response?.data?.error?.message;

      let status = 400;
      if (message === "EMAIL_NOT_FOUND" || message === "INVALID_PASSWORD") {
        status = 401;
      } else if (message === "USER_DISABLED") {
        status = 403;
      }

      return res.status(status).json({ error: message || "Login failed" });
    }
  });
});