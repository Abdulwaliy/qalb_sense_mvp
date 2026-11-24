import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

function getWaitlistDocumentId(email) {
  return encodeURIComponent(email.trim().toLowerCase());
}

export async function joinWaitlist(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const waitlistRef = doc(db, "waitlist", getWaitlistDocumentId(normalizedEmail));
  const existing = await getDoc(waitlistRef);

  if (existing.exists()) {
    return {
      duplicate: true,
      waitlistId: waitlistRef.id,
    };
  }

  await setDoc(waitlistRef, {
    email: normalizedEmail,
    createdAt: serverTimestamp(),
    source: "landing-page",
  });

  return {
    duplicate: false,
    waitlistId: waitlistRef.id,
  };
}

export async function submitWaitlistFeedback(waitlistId, interests) {
  if (!waitlistId || interests.length === 0) {
    throw new Error("Waitlist feedback is incomplete.");
  }

  await updateDoc(doc(db, "waitlist", waitlistId), {
    interests,
    feedbackSubmittedAt: serverTimestamp(),
  });

  return { success: true };
}
