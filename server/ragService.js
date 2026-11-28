// server/ragService.js
// Standard Semantic Vector RAG using Gemini embeddings (gemini-embedding-001),
// article chunking, in-memory vector caching, and cosine similarity with keyword fallback.

const EMBED_MODEL = "gemini-embedding-001";
const embeddingCache = new Map();

function cosineSimilarity(a = [], b = []) {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom ? dot / denom : 0;
}

async function embedText(text, useCache = true) {
  const key = String(text || "").trim();
  if (!key) return null;
  if (useCache && embeddingCache.has(key)) {
    return embeddingCache.get(key);
  }
  if (!process.env.GEMINI_API_KEY) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text: key.slice(0, 2000) }] },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Gemini embedding error (${res.status})`);
  }

  const data = await res.json();
  const vec = data?.embedding?.values;
  if (!Array.isArray(vec) || !vec.length) return null;

  if (useCache) {
    embeddingCache.set(key, vec);
  }
  return vec;
}

/**
 * Splits each Tazkiyah blog article into semantic chunks:
 * 1) Overview + Key Takeaways chunk
 * 2) One chunk per article section (heading + body)
 */
export function chunkBlogs(blogs = []) {
  const chunks = [];
  for (const blog of blogs) {
    const takeawaysText = Array.isArray(blog.keyTakeaways)
      ? blog.keyTakeaways.join(" ")
      : "";
    chunks.push({
      id: `${blog.slug}::overview`,
      slug: blog.slug,
      title: blog.title,
      category: blog.category || "Tazkiyah",
      excerpt: blog.excerpt || "",
      linkedMoods: Array.isArray(blog.linkedMoods) ? blog.linkedMoods : [],
      sectionHeading: "Overview & Key Takeaways",
      text: `${blog.title}. Category: ${blog.category}. ${blog.excerpt || ""} ${takeawaysText}`.trim(),
    });

    if (Array.isArray(blog.sections)) {
      blog.sections.forEach((sec, idx) => {
        const bodyText = Array.isArray(sec.body) ? sec.body.join(" ") : String(sec.body || "");
        if (!bodyText.trim()) return;
        chunks.push({
          id: `${blog.slug}::sec-${idx}`,
          slug: blog.slug,
          title: blog.title,
          category: blog.category || "Tazkiyah",
          excerpt: blog.excerpt || "",
          linkedMoods: Array.isArray(blog.linkedMoods) ? blog.linkedMoods : [],
          sectionHeading: sec.heading || `Section ${idx + 1}`,
          text: `${blog.title} — ${sec.heading || ""}: ${bodyText}`.trim(),
        });
      });
    }
  }
  return chunks;
}

/**
 * Retrieves the best unread blog article & matching section chunk via
 * Gemini vector cosine similarity (+ fallback to keyword/tag matching if needed).
 */
export async function retrieveSemanticBlogRecommendation({
  blogs = [],
  readSlugs = [],
  topMoods = [],
  journalSummary = "",
}) {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { recommendedBlog: null, retrievedChunks: [], retrievalMode: "none" };
  }

  const readSet = new Set(readSlugs);
  const unreadBlogs = blogs.filter((b) => !readSet.has(b.slug));
  const targetBlogs = unreadBlogs.length > 0 ? unreadBlogs : blogs;
  const chunks = chunkBlogs(targetBlogs);

  const moodText = topMoods.map((m) => `${m.mood} (${m.count}x)`).join(", ");
  const queryText = `User's 7-day heart states: ${moodText || "mixed"}. Recent journal themes: ${journalSummary || "seeking spiritual peace and consistency."}`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const queryVec = await embedText(queryText, false);
      if (queryVec) {
        const chunkVecs = await Promise.all(chunks.map((c) => embedText(c.text, true)));
        const topMoodLower = topMoods.map((m) => String(m.mood).toLowerCase());

        const scored = chunks
          .map((chunk, i) => {
            const vec = chunkVecs[i];
            const sim = vec ? cosineSimilarity(queryVec, vec) : 0;
            const moodBoost = chunk.linkedMoods.some((lm) =>
              topMoodLower.includes(String(lm).toLowerCase())
            )
              ? 0.06
              : 0;
            return { chunk, score: sim + moodBoost, similarity: sim };
          })
          .sort((a, b) => b.score - a.score);

        const top = scored[0]?.chunk;
        if (top) {
          return {
            recommendedBlog: {
              slug: top.slug,
              title: top.title,
              category: top.category,
              excerpt: top.excerpt,
              matchedSection: top.sectionHeading,
              similarity: Number((scored[0].similarity || 0).toFixed(3)),
            },
            retrievedChunks: scored.slice(0, 2).map((s) => ({
              slug: s.chunk.slug,
              title: s.chunk.title,
              sectionHeading: s.chunk.sectionHeading,
              snippet: s.chunk.text.slice(0, 320),
            })),
            retrievalMode: "semantic-vector",
          };
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ Semantic RAG embedding fallback to keyword:", err.message);
  }

  // Fallback keyword/mood scoring
  const lowerQuery = queryText.toLowerCase();
  const scoredFallback = chunks
    .map((chunk) => {
      let score = 0;
      const lowerChunk = chunk.text.toLowerCase();
      for (const m of topMoods) {
        if (lowerChunk.includes(String(m.mood).toLowerCase())) score += 2;
      }
      if (lowerQuery.includes("anxious") || lowerQuery.includes("worry") || lowerQuery.includes("qalaq")) {
        if (lowerChunk.includes("sakīnah") || lowerChunk.includes("qalb") || lowerChunk.includes("tawakkul")) score += 2;
      }
      if (lowerQuery.includes("guilt") || lowerQuery.includes("prayer") || lowerQuery.includes("mistake")) {
        if (lowerChunk.includes("tazkiyah") || lowerChunk.includes("muḥāsabah")) score += 2;
      }
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scoredFallback[0]?.chunk || chunks[0];
  return {
    recommendedBlog: best
      ? {
          slug: best.slug,
          title: best.title,
          category: best.category,
          excerpt: best.excerpt,
          matchedSection: best.sectionHeading,
        }
      : null,
    retrievedChunks: best
      ? [
          {
            slug: best.slug,
            title: best.title,
            sectionHeading: best.sectionHeading,
            snippet: best.text.slice(0, 320),
          },
        ]
      : [],
    retrievalMode: "keyword-fallback",
  };
}
