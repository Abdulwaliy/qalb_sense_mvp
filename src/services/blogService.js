import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase.js";
import { BLOG_POSTS } from "../data/blogPosts.js";

const BLOG_COLLECTION = "blogPosts";

function toSortableMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
}

export function slugifyTitle(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['’‘`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fetches published blog posts from Firestore, merging seamlessly with
 * static seed posts in src/data/blogPosts.js (Firestore takes precedence by slug).
 */
export async function getPublishedBlogs() {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("published", "==", true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return BLOG_POSTS;
    }

    const remotePosts = snapshot.docs
      .map((d) => ({ slug: d.id, ...d.data() }))
      .sort((a, b) => toSortableMillis(b.updatedAt || b.createdAt) - toSortableMillis(a.updatedAt || a.createdAt));

    const remoteSlugs = new Set(remotePosts.map((p) => p.slug));
    const remainingSeed = BLOG_POSTS.filter((p) => !remoteSlugs.has(p.slug));
    return [...remotePosts, ...remainingSeed];
  } catch (err) {
    console.warn("Blog CMS fetch fallback to local posts:", err.message);
    return BLOG_POSTS;
  }
}

/**
 * Fetches all blog posts (including drafts) for the /admin/blog CMS studio.
 */
export async function getAllBlogsAdmin() {
  const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
  return snapshot.docs
    .map((d) => ({ slug: d.id, ...d.data() }))
    .sort((a, b) => toSortableMillis(b.updatedAt || b.createdAt) - toSortableMillis(a.updatedAt || a.createdAt));
}

/**
 * Creates or updates a blog post in Firestore using its slug as the document ID.
 */
export async function saveBlogPost(post) {
  const cleanSlug = slugifyTitle(post.slug || post.title);
  if (!cleanSlug) {
    throw new Error("A valid title or slug is required.");
  }

  const ref = doc(db, BLOG_COLLECTION, cleanSlug);
  const payload = {
    slug: cleanSlug,
    title: String(post.title || "").trim(),
    arabicTitle: String(post.arabicTitle || "").trim(),
    category: post.category || "Foundations",
    readTime: String(post.readTime || "4 min read").trim(),
    date: String(post.date || "").trim(),
    author: String(post.author || "QalbSense Research").trim(),
    excerpt: String(post.excerpt || "").trim(),
    linkedMoods: Array.isArray(post.linkedMoods) ? post.linkedMoods : [],
    keyTakeaways: Array.isArray(post.keyTakeaways)
      ? post.keyTakeaways.map((t) => t.trim()).filter(Boolean)
      : [],
    sections: Array.isArray(post.sections)
      ? post.sections
          .filter((s) => s.heading?.trim() || s.body?.some((p) => p.trim()))
          .map((s) => {
            const cleanSection = {
              heading: String(s.heading || "").trim(),
              body: (Array.isArray(s.body) ? s.body : String(s.body || "").split(/\n\s*\n/))
                .map((p) => p.trim())
                .filter(Boolean),
            };
            if (s.quote && (s.quote.arabic?.trim() || s.quote.text?.trim())) {
              cleanSection.quote = {
                arabic: String(s.quote.arabic || "").trim(),
                text: String(s.quote.text || "").trim(),
                source: String(s.quote.source || "").trim(),
              };
            }
            return cleanSection;
          })
      : [],
    published: Boolean(post.published),
    updatedAt: serverTimestamp(),
  };

  if (!post.createdAt) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
  return cleanSlug;
}

export async function deleteBlogPost(slug) {
  await deleteDoc(doc(db, BLOG_COLLECTION, slug));
}

/**
 * Seeds the initial static blogPosts.js entries into Firestore so they can be edited in /admin/blog.
 */
export async function seedInitialBlogs() {
  for (const post of BLOG_POSTS) {
    await saveBlogPost({ ...post, published: true });
  }
  return BLOG_POSTS.length;
}
