const REMOTE_API_URL = "https://qalb-sense-mvp.onrender.com";

async function postReflection(baseUrl, payload, timeoutMs = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/api/reflection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      const err = new Error(error?.error || error?.details || `Server returned ${res.status}`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    if (!data?.reflection && !data?.outOfScope) {
      throw new Error("Empty reflection received from server");
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return "early morning (Fajr)";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export const generateReflection = async ({ mood, intensity, journal, userId }) => {
  const payload = { mood, intensity, journal, userId, timeOfDay: getTimeOfDay() };
  const configuredUrl = import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    return await postReflection(configuredUrl, payload);
  }

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (isLocalhost) {
    try {
      return await postReflection("http://localhost:5000", payload, 12000);
    } catch (localErr) {
      console.warn("Local reflection server unavailable or failed, falling back to remote:", localErr.message);
    }
  }

  try {
    return await postReflection(REMOTE_API_URL, payload, 45000);
  } catch (err) {
    // Retry once for Render cold-start 502/503/504 or transient network hiccup
    if (!err.status || err.status >= 502) {
      await new Promise((r) => setTimeout(r, 2500));
      return await postReflection(REMOTE_API_URL, payload, 45000);
    }
    throw err;
  }
};

export const fetchMoodAyah = async (mood = "neutral") => {
  const configuredUrl = import.meta.env.VITE_API_URL;
  const query = `mood=${encodeURIComponent(mood || "neutral")}`;
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const urls = configuredUrl
    ? [`${configuredUrl}/api/ayah?${query}`]
    : isLocalhost
    ? [`http://localhost:5000/api/ayah?${query}`, `${REMOTE_API_URL}/api/ayah?${query}`]
    : [`${REMOTE_API_URL}/api/ayah?${query}`];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // Try next URL
    }
  }
  return null;
};

export const fetchTafsir = async (verseKey) => {
  if (!verseKey) return null;
  const configuredUrl = import.meta.env.VITE_API_URL;
  const query = `key=${encodeURIComponent(verseKey)}`;
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const urls = configuredUrl
    ? [`${configuredUrl}/api/tafsir?${query}`]
    : isLocalhost
    ? [`http://localhost:5000/api/tafsir?${query}`, `${REMOTE_API_URL}/api/tafsir?${query}`]
    : [`${REMOTE_API_URL}/api/tafsir?${query}`];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // Try next URL
    }
  }
  return null;
};
