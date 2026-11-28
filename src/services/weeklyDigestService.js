import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { getUserMoods } from "./moodService.js";
import { getUserReflections } from "./reflectionService.js";
import { getPublishedBlogs, getUserBlogReads } from "./blogService.js";

const REMOTE_API_URL = "https://qalb-sense-mvp.onrender.com";

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  return isLocalhost ? "http://localhost:5000" : REMOTE_API_URL;
}

function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.seconds === "number") return ts.seconds * 1000;
  const parsed = new Date(ts).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getCurrentWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Retrieval ("R") layer: gathers last 7 days of moods, reflections, Sunnah actions,
 * and Tazkiyah blog reading progress, then retrieves the best unread essay(s) to recommend.
 */
export async function retrieveWeeklyContext(userId) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const [allMoods, allReflections, blogReads, allBlogs] = await Promise.all([
    getUserMoods(userId).catch(() => []),
    getUserReflections(userId).catch(() => []),
    getUserBlogReads(userId).catch(() => []),
    getPublishedBlogs().catch(() => []),
  ]);

  const weeklyMoods = allMoods.filter((m) => toMillis(m.timestamp || m.createdAt) >= sevenDaysAgo);
  const weeklyReflections = allReflections.filter((r) => toMillis(r.timestamp || r.createdAt) >= sevenDaysAgo);
  const weeklyReads = blogReads.filter((b) => toMillis(b.readAt) >= sevenDaysAgo);

  const moodCounts = {};
  for (const m of weeklyMoods) {
    const label = m.mood || m.coreState;
    if (label) moodCounts[label] = (moodCounts[label] || 0) + 1;
  }
  for (const r of weeklyReflections) {
    if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
  }

  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([mood, count]) => ({ mood, count }));

  const practicedCount = weeklyReflections.filter((r) => Boolean(r.actionCompleted)).length;
  const readSlugsAllTime = new Set(blogReads.map((b) => b.slug));

  const unreadBlogs = allBlogs.filter((b) => !readSlugsAllTime.has(b.slug));
  const candidatePool = unreadBlogs.length > 0 ? unreadBlogs : allBlogs;

  const topMoodNames = topMoods.map((m) => m.mood.toLowerCase());
  const journalBlob = weeklyReflections
    .map((r) => `${r.mood || ""} ${r.journalContent || ""}`)
    .join(" ")
    .toLowerCase();

  const scoredBlogs = candidatePool
    .map((blog) => {
      let score = 0;
      const linked = Array.isArray(blog.linkedMoods) ? blog.linkedMoods : [];
      for (const lm of linked) {
        if (topMoodNames.includes(String(lm).toLowerCase())) score += 4;
      }
      const text = `${blog.title} ${blog.excerpt} ${blog.category} ${(blog.keyTakeaways || []).join(" ")}`.toLowerCase();
      for (const m of topMoodNames) {
        if (text.includes(m)) score += 2;
      }
      if (journalBlob.includes("anxious") || journalBlob.includes("worry") || journalBlob.includes("qalaq")) {
        if (text.includes("sakīnah") || text.includes("qalb") || text.includes("tawakkul")) score += 2;
      }
      if (journalBlob.includes("guilt") || journalBlob.includes("mistake") || journalBlob.includes("prayer")) {
        if (text.includes("tazkiyah") || text.includes("muḥāsabah")) score += 2;
      }
      return { blog, score };
    })
    .sort((a, b) => b.score - a.score);

  const recommendedBlogs = scoredBlogs.slice(0, 2).map((s) => ({
    slug: s.blog.slug,
    title: s.blog.title,
    arabicTitle: s.blog.arabicTitle || "",
    category: s.blog.category || "Tazkiyah",
    readTime: s.blog.readTime || "4 min read",
    excerpt: s.blog.excerpt || "",
    keyTakeaways: (s.blog.keyTakeaways || []).slice(0, 2),
  }));

  const journalSummary = weeklyReflections
    .slice(0, 5)
    .map((r) => `${r.mood ? `[${r.mood}] ` : ""}${String(r.journalContent || "").slice(0, 140)}`)
    .filter(Boolean)
    .join(" | ");

  return {
    weekKey: getCurrentWeekKey(),
    stats: {
      moodCheckIns: weeklyMoods.length,
      reflectionsCount: weeklyReflections.length,
      sunnahsPracticed: practicedCount,
      blogsReadThisWeek: weeklyReads.length,
      totalBlogsRead: blogReads.length,
    },
    topMoods,
    readThisWeek: weeklyReads.map((b) => ({ slug: b.slug, title: b.title, category: b.category })),
    readSlugs: Array.from(readSlugsAllTime),
    journalSummary,
    candidateBlogs: allBlogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      category: b.category,
      excerpt: b.excerpt,
      linkedMoods: b.linkedMoods || [],
      keyTakeaways: b.keyTakeaways || [],
      sections: b.sections || [],
    })),
    recommendedBlogs,
  };
}

export async function getCachedWeeklyDigest(userId) {
  if (!userId) return null;
  try {
    const weekKey = getCurrentWeekKey();
    const snap = await getDoc(doc(db, "weeklyDigests", `${userId}_${weekKey}`));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn("Could not load cached weekly digest:", err.message);
    return null;
  }
}

/**
 * Generation ("G") layer: sends retrieved weekly context to /api/weekly-digest
 * and caches the result for the current week in Firestore.
 */
export async function generateWeeklyDigest(userId) {
  const context = await retrieveWeeklyContext(userId);
  const baseUrl = getApiBaseUrl();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);

  try {
    const res = await fetch(`${baseUrl}/api/weekly-digest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || errData?.details || `Server returned ${res.status}`);
    }

    const data = await res.json();
    const payload = {
      userId,
      weekKey: context.weekKey,
      summary: data.summary,
      stats: context.stats,
      topMoods: context.topMoods,
      readThisWeek: context.readThisWeek,
      recommendedBlog: data.recommendedBlog || context.recommendedBlogs[0] || null,
      retrievalMode: data.retrievalMode || "semantic-vector",
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "weeklyDigests", `${userId}_${context.weekKey}`), payload, { merge: true });
    } catch (saveErr) {
      console.warn("Could not cache weekly digest:", saveErr.message);
    }

    return payload;
  } finally {
    clearTimeout(timer);
  }
}
