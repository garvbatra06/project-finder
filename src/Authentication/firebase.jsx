import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD0u1-huEWLv5nBm7pAPVX3j3zCN6brm7I",
  authDomain: "campus-link-f30b1.firebaseapp.com",
  projectId: "campus-link-f30b1",
  storageBucket: "campus-link-f30b1.appspot.com",
  messagingSenderId: "890028764195",
  appId: "1:890028764195:web:9f50794a03c81c5f69d596",
  measurementId: "G-8G5E9C2SSJ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Force login every time the page loads
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Auth persistence set to session. User must login each time.");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export default app;
