import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_CATEGORIES } from "../data/blogPosts.js";
import {
  deleteBlogPost,
  getAllBlogsAdmin,
  saveBlogPost,
  seedInitialBlogs,
  slugifyTitle,
} from "../services/blogService.js";
import "./LandingPage.css";
import "./BlogPage.css";

const MOOD_TAG_OPTIONS = [
  "Al-Qabḍ",
  "Al-Basṭ",
  "Sakīnah",
  "Al-Qalaq",
  "Grieving",
  "Anxious",
  "Grateful",
  "Guilty",
  "Lonely",
  "Overwhelmed",
];

function createEmptyPost() {
  return {
    slug: "",
    title: "",
    arabicTitle: "",
    category: "Foundations",
    readTime: "4 min read",
    date: "",
    author: "QalbSense Research",
    excerpt: "",
    linkedMoods: [],
    keyTakeaways: [""],
    sections: [
      {
        heading: "",
        quote: { arabic: "", text: "", source: "" },
        bodyText: "",
      },
    ],
    published: true,
  };
}

function toEditorPost(post) {
  return {
    ...post,
    linkedMoods: Array.isArray(post.linkedMoods) ? post.linkedMoods : [],
    keyTakeaways: post.keyTakeaways?.length ? [...post.keyTakeaways] : [""],
    sections: post.sections?.length
      ? post.sections.map((s) => ({
          heading: s.heading || "",
          quote: {
            arabic: s.quote?.arabic || "",
            text: s.quote?.text || "",
            source: s.quote?.source || "",
          },
          bodyText: Array.isArray(s.body) ? s.body.join("\n\n") : "",
        }))
      : [{ heading: "", quote: { arabic: "", text: "", source: "" }, bodyText: "" }],
    published: post.published !== false,
  };
}

export default function BlogAdmin({ user }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(createEmptyPost);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [permissionDenied, setPermissionDenied] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    setPermissionDenied(false);
    try {
      const list = await getAllBlogsAdmin();
      setPosts(list);
    } catch (err) {
      if (err?.code === "permission-denied" || /permission/i.test(err?.message || "")) {
        setPermissionDenied(true);
      } else {
        setStatus({ type: "error", text: err.message || "Could not load blog posts." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMood = (mood) => {
    setForm((prev) => {
      const exists = prev.linkedMoods.includes(mood);
      return {
        ...prev,
        linkedMoods: exists
          ? prev.linkedMoods.filter((m) => m !== mood)
          : [...prev.linkedMoods, mood],
      };
    });
  };

  const updateTakeaway = (idx, value) => {
    setForm((prev) => {
      const next = [...prev.keyTakeaways];
      next[idx] = value;
      return { ...prev, keyTakeaways: next };
    });
  };

  const updateSection = (idx, patch) => {
    setForm((prev) => {
      const next = [...prev.sections];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, sections: next };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setStatus({ type: "error", text: "Please enter an article title." });
      return;
    }

    setSaving(true);
    setStatus({ type: "", text: "" });
    try {
      const savedSlug = await saveBlogPost({
        ...form,
        slug: form.slug.trim() || slugifyTitle(form.title),
        sections: form.sections.map((s) => ({
          heading: s.heading,
          quote: s.quote,
          body: s.bodyText.split(/\n\s*\n/).filter((p) => p.trim()),
        })),
      });
      setStatus({
        type: "ok",
        text: form.published
          ? `Published “${form.title}” (/blog/${savedSlug}).`
          : `Saved draft “${form.title}”.`,
      });
      await loadPosts();
      handleField("slug", savedSlug);
    } catch (err) {
      if (err?.code === "permission-denied" || /permission/i.test(err?.message || "")) {
        setPermissionDenied(true);
      } else {
        setStatus({ type: "error", text: err.message || "Failed to save post." });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Delete “${title}” from Firestore?`)) return;
    try {
      await deleteBlogPost(slug);
      setStatus({ type: "ok", text: `Deleted “${title}”.` });
      if (form.slug === slug) setForm(createEmptyPost());
      await loadPosts();
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Failed to delete post." });
    }
  };

  const handleSeed = async () => {
    setSaving(true);
    try {
      const count = await seedInitialBlogs();
      setStatus({ type: "ok", text: `Imported ${count} starter essays into Firestore.` });
      await loadPosts();
    } catch (err) {
      if (err?.code === "permission-denied" || /permission/i.test(err?.message || "")) {
        setPermissionDenied(true);
      } else {
        setStatus({ type: "error", text: err.message || "Failed to import starter posts." });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="blog-page">
        <div className="blog-article-wrap" style={{ textAlign: "center", paddingTop: 80 }}>
          <span className="landing-section-kicker">QalbSense Blog CMS</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", marginTop: 10 }}>Sign in to open the Studio</h1>
          <p style={{ color: "#31493b", marginBottom: 24 }}>
            Only authorized admin accounts can write or publish Tazkiyah Journal essays.
          </p>
          <Link className="landing-button landing-button-primary" to="/login">
            Sign In <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-page" style={{ paddingBottom: 72 }}>
      <header className="landing-header">
        <Link className="landing-brand" to="/blog">
          <span>qalb<span className="landing-brand-accent">sense</span> · CMS</span>
        </Link>
        <nav className="landing-nav">
          <Link to="/blog">View Live Blog</Link>
          <Link to="/">Home</Link>
        </nav>
        <button
          type="button"
          className="landing-nav-cta"
          onClick={() => {
            setForm(createEmptyPost());
            setStatus({ type: "", text: "" });
          }}
        >
          + New Essay
        </button>
      </header>

      <div style={{ width: "min(1120px, calc(100% - 40px))", margin: "24px auto 0" }}>
        {permissionDenied && (
          <div style={{
            padding: "18px 20px",
            borderRadius: 14,
            background: "#fff8eb",
            border: "1px solid #e6cb91",
            marginBottom: 22,
            color: "#4d3808",
          }}>
            <strong>Admin access not yet enabled for this account.</strong>
            <p style={{ margin: "6px 0 8px", fontSize: 13.5, lineHeight: 1.6 }}>
              To grant yourself CMS write access in Firebase Console → <strong>Firestore Database</strong>, create a document in collection <code>admins</code> with Document ID equal to your UID:
            </p>
            <code style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 8,
              background: "#ffffff",
              border: "1px solid #dfd2b2",
              fontSize: 12.5,
              userSelect: "all",
            }}>
              {user.uid}
            </code>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6a5216" }}>
              Signed in as {user.email}. Refresh this page after creating the <code>admins/{user.uid}</code> document.
            </p>
          </div>
        )}

        {status.text && (
          <div style={{
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 18,
            background: status.type === "error" ? "#fdecec" : "#e8f6ec",
            border: `1px solid ${status.type === "error" ? "#f2b8b8" : "#b8dfc2"}`,
            color: status.type === "error" ? "#7e1d1d" : "#0b5236",
            fontSize: 13.5,
            fontWeight: 600,
          }}>
            {status.text}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(250px, 300px) 1fr",
          gap: 22,
          alignItems: "start",
        }}>
          {/* ── POSTS LIST SIDEBAR ── */}
          <aside style={{
            background: "#ffffff",
            border: "1px solid #d5e2d4",
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <strong style={{ fontSize: 13, color: "#112117" }}>Articles ({posts.length})</strong>
              <button
                type="button"
                onClick={handleSeed}
                disabled={saving}
                style={{
                  padding: "4px 9px",
                  borderRadius: 999,
                  border: "1px solid #cbd8cd",
                  background: "#f6f8f4",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Import Starter
              </button>
            </div>

            {loading ? (
              <p style={{ fontSize: 13, color: "#4d6155" }}>Loading articles…</p>
            ) : posts.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "#4d6155", lineHeight: 1.55 }}>
                No Firestore articles yet. Click <strong>Import Starter</strong> or write a new essay on the right.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {posts.map((p) => (
                  <div
                    key={p.slug}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: form.slug === p.slug ? "1.5px solid #0d5f3f" : "1px solid #e1ebe0",
                      background: form.slug === p.slug ? "#eff7f0" : "#fbfcf9",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setForm(toEditorPost(p))}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: 0,
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#112117", marginBottom: 3 }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#52685b" }}>
                        {p.published ? "Published" : "Draft"} · {p.category}
                      </div>
                    </button>
                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                      <Link to={`/blog/${p.slug}`} style={{ fontSize: 11, color: "#0d5f3f", fontWeight: 600 }}>
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.slug, p.title)}
                        style={{
                          border: 0,
                          background: "transparent",
                          padding: 0,
                          fontSize: 11,
                          color: "#9a2d2d",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* ── ARTICLE EDITOR FORM ── */}
          <form
            onSubmit={handleSave}
            style={{
              background: "#ffffff",
              border: "1px solid #d5e2d4",
              borderRadius: 16,
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22 }}>
                {form.slug ? "Edit Essay" : "Write New Essay"}
              </h1>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => handleField("published", e.target.checked)}
                />
                Published (visible on /blog)
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
                Title *
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleField("title", e.target.value)}
                  placeholder="e.g. Finding Sakīnah in Times of Anxiety"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
                Arabic Title
                <input
                  type="text"
                  dir="rtl"
                  value={form.arabicTitle}
                  onChange={(e) => handleField("arabicTitle", e.target.value)}
                  placeholder="السكينة في أوقات القلق"
                  style={inputStyle}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
                URL Slug
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleField("slug", e.target.value)}
                  placeholder="auto-from-title"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
                Category
                <select
                  value={form.category}
                  onChange={(e) => handleField("category", e.target.value)}
                  style={inputStyle}
                >
                  {BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
                Read Time
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => handleField("readTime", e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
                Date Label
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => handleField("date", e.target.value)}
                  placeholder="e.g. Jumādā II 1448"
                  style={inputStyle}
                />
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 700 }}>
              Short Excerpt
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => handleField("excerpt", e.target.value)}
                placeholder="1–2 sentence summary shown on the blog card…"
                style={inputStyle}
              />
            </label>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                Linked Moods (for mood-matched blog recommendations)
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOOD_TAG_OPTIONS.map((mood) => {
                  const active = form.linkedMoods.includes(mood);
                  return (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => toggleMood(mood)}
                      style={{
                        padding: "5px 11px",
                        borderRadius: 999,
                        border: active ? "1px solid #0d5f3f" : "1px solid #d2ded2",
                        background: active ? "#0d5f3f" : "#f7faf6",
                        color: active ? "#ffffff" : "#243b2d",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Key Takeaways</span>
                <button
                  type="button"
                  onClick={() => handleField("keyTakeaways", [...form.keyTakeaways, ""])}
                  style={smallBtnStyle}
                >
                  + Add Takeaway
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {form.keyTakeaways.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6 }}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateTakeaway(idx, e.target.value)}
                      placeholder={`Takeaway ${idx + 1}`}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    {form.keyTakeaways.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleField(
                            "keyTakeaways",
                            form.keyTakeaways.filter((_, i) => i !== idx)
                          )
                        }
                        style={smallBtnStyle}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Article Sections</span>
                <button
                  type="button"
                  onClick={() =>
                    handleField("sections", [
                      ...form.sections,
                      { heading: "", quote: { arabic: "", text: "", source: "" }, bodyText: "" },
                    ])
                  }
                  style={smallBtnStyle}
                >
                  + Add Section
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {form.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: "1px solid #dce6db",
                      background: "#fafcf8",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => updateSection(idx, { heading: e.target.value })}
                        placeholder={`Section ${idx + 1} Heading`}
                        style={{ ...inputStyle, flex: 1, fontWeight: 600 }}
                      />
                      {form.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleField(
                              "sections",
                              form.sections.filter((_, i) => i !== idx)
                            )
                          }
                          style={smallBtnStyle}
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      value={sec.bodyText}
                      onChange={(e) => updateSection(idx, { bodyText: e.target.value })}
                      placeholder="Write paragraphs here (separate paragraphs with a blank line)…"
                      style={inputStyle}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <input
                        type="text"
                        dir="rtl"
                        value={sec.quote?.arabic || ""}
                        onChange={(e) =>
                          updateSection(idx, { quote: { ...sec.quote, arabic: e.target.value } })
                        }
                        placeholder="Optional Arabic quote"
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        value={sec.quote?.text || ""}
                        onChange={(e) =>
                          updateSection(idx, { quote: { ...sec.quote, text: e.target.value } })
                        }
                        placeholder="Optional quote translation"
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        value={sec.quote?.source || ""}
                        onChange={(e) =>
                          updateSection(idx, { quote: { ...sec.quote, source: e.target.value } })
                        }
                        placeholder="Source (e.g. Surah Ar-Ra'd 13:28)"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 6 }}>
              <button
                type="submit"
                disabled={saving}
                className="landing-button landing-button-primary"
                style={{ border: 0, cursor: saving ? "default" : "pointer" }}
              >
                {saving ? "Saving…" : form.published ? "Publish Essay" : "Save Draft"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "9px 11px",
  borderRadius: 10,
  border: "1px solid #d1ddd0",
  background: "#ffffff",
  color: "#112117",
  fontFamily: "inherit",
  fontSize: 13,
  outline: "none",
};

const smallBtnStyle = {
  padding: "5px 10px",
  borderRadius: 8,
  border: "1px solid #cbd8cd",
  background: "#ffffff",
  color: "#1d3129",
  fontSize: 11.5,
  fontWeight: 600,
  cursor: "pointer",
};
