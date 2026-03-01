import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase.js";

const journalCollectionRef = collection(db, "journals"); // just once

export async function addJournal(userId, content) {
  try {
    const docRef = await addDoc(journalCollectionRef, { // ✅ no extra (db, "journals")
      userId,   // ✅ use correct variable name
      content,  // same name as your component state
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding journal:", error);
    throw error;
  }
}

export async function getUserJournals(userId) {
  try {
    const q = query(
      journalCollectionRef,         // ✅ use the ref directly
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching journals:", error);
    throw error;
  }
}