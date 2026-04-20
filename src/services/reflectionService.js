import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";

/* ---------------- SAVE REFLECTION ---------------- */
export const saveReflection = async (userId, data) => {
  try {
    console.log("🔥 Saving reflection for:", userId);

    const refCollection = collection(db, "reflections");

    const docRef = await addDoc(refCollection, {
      userId,
      text: data.text,
      journalContent: data.journalContent || "",
      mood: data.mood || "",
      createdAt: new Date()
    });

    console.log("✅ Reflection saved with ID:", docRef.id);

    return docRef;
  } catch (err) {
    console.error("❌ Error saving reflection:", err);
    throw err;
  }
};

/* ---------------- GET USER REFLECTIONS ---------------- */
export const getUserReflections = async (userId) => {
  try {
    const refCollection = collection(db, "reflections");

    const q = query(
      refCollection,
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    const reflections = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort safely by createdAt (handles Firestore + JS Date)
    return reflections.sort((a, b) => {
      const aTime = a.createdAt?.toDate
        ? a.createdAt.toDate().getTime()
        : new Date(a.createdAt || 0).getTime();

      const bTime = b.createdAt?.toDate
        ? b.createdAt.toDate().getTime()
        : new Date(b.createdAt || 0).getTime();

      return bTime - aTime;
    });

  } catch (err) {
    console.error("❌ Error fetching reflections:", err);
    return [];
  }
};