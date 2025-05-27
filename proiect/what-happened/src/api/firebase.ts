import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    authDomain: "news-maps-455910.uc.r.appspot.com",
    projectId: "news-maps-455910",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);