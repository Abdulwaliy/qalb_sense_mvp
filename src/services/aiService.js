const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://qalb-sense-mvp.onrender.com";

export const generateReflection = async ({ mood, journal, userId }) => {
  const res = await fetch(`${API_BASE_URL}/api/reflection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mood,
      journal,
      userId,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Reflection API error:", error);
    throw new Error(error?.error || error?.details || "Failed to generate reflection");
  }

  return await res.json();
};
