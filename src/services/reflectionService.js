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
    const now = new Date();

    const docRef = await addDoc(refCollection, {
      userId,
      text: data.text,
      journalContent: data.journalContent || data.journal || "",
      mood: data.mood || "",
      createdAt: now,
      timestamp: now,
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

    // Sort safely by createdAt or timestamp (handles Firestore + JS Date)
    return reflections.sort((a, b) => {
      const aRaw = a.createdAt || a.timestamp;
      const bRaw = b.createdAt || b.timestamp;

      const aTime = aRaw?.toDate
        ? aRaw.toDate().getTime()
        : aRaw?.seconds
        ? aRaw.seconds * 1000
        : new Date(aRaw || 0).getTime();

      const bTime = bRaw?.toDate
        ? bRaw.toDate().getTime()
        : bRaw?.seconds
        ? bRaw.seconds * 1000
        : new Date(bRaw || 0).getTime();

      return bTime - aTime;
    });

  } catch (err) {
    console.error("❌ Error fetching reflections:", err);
    return [];
  }
};
