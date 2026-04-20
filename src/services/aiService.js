export const generateReflection = async ({ mood, journal }) => {
  const res = await fetch("http://localhost:5000/api/reflection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mood, journal }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate reflection");
  }

  return await res.json();
};