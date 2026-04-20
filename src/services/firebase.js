// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3AXsrmxZgX0ZLSRgluOQZqEqlseUgIiQ",
  authDomain: "qalbsense-mvp.firebaseapp.com",
  projectId: "qalbsense-mvp",
  storageBucket: "qalbsense-mvp.firebasestorage.app",
  messagingSenderId: "1099108125316",
  appId: "1:1099108125316:web:7c0cb9b9de8960a21190d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore for app usage
export const auth = getAuth(app);
export const db = getFirestore(app);