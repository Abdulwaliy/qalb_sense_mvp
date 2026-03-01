// src/services/moodService.js
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase.js";

const moodCollection = collection(db, "moods");

export async function logMood(userId, mood, note = "") {
  try {
    const docRef = await addDoc(moodCollection, {
      userId,
      mood,
      note,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error logging mood:", error);
    throw error;
  }
}

export async function getUserMoods(userId) {
  try {
    const q = query(moodCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching moods:", error);
    throw error;
  }
}