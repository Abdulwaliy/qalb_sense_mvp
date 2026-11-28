import { useEffect, useState } from "react";
import { getUserReflections, toggleReflectionFlag } from "../services/reflectionService.js";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService.js";
import { getLandingUrl } from "../utils/domain.js";
import StructuredReflection from "./StructuredReflection.jsx";
import ReflectionModal from "./ReflectionModal.jsx";
import TabAyahBanner from "./TabAyahBanner.jsx";
import { cleanMarkdownText, parseReflectionSections } from "../utils/parseReflection.js";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function resolveMs(timestamp) {
  if (!timestamp) return 0;
  if (typeof timestamp.toDate === "function") return timestamp.toDate().getTime();
  if (typeof timestamp.seconds === "number") return timestamp.seconds * 1000;
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === "number") return timestamp;
  if (typeof timestamp === "string") {
    const t = new Date(timestamp).getTime();
    return isNaN(t) ? 0 : t;
  }
  return 0;
}

function formatDate(ms) {
  if (!ms) return "No date";
  const d = new Date(ms);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function monthKey(ms) {
  if (!ms) return "Unknown";
  const d = new Date(ms);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─────────────────────────────────────────
   NAV ICONS
───────────────────────────────────────── */
const NavHome = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 9.2 10 3.2l7 6v7.1a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 16.3V9.2Z"
      fill={a ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinejoin="round" />
    <path d="M8 17.8v-4.2a2 2 0 0 1 4 0v4.2"
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinecap="round" />
  </svg>
);
const NavMood = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 16.6s-5.8-3.5-6.8-7.3a3.7 3.7 0 0 1 6.8-3 3.7 3.7 0 0 1 6.8 3c-1 3.8-6.8 7.3-6.8 7.3Z"
      fill={a ? "rgba(22, 119, 84, 0.16)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinejoin="round" />
  </svg>
);
const NavJournal = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3.2 4.8A1.8 1.8 0 0 1 5 3h3.6c.8 0 1.4.6 1.4 1.4v12.2c-.5-.5-1.2-.8-2-.8H5a1.8 1.8 0 0 1-1.8-1.8V4.8Z"
      fill={a ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M16.8 4.8A1.8 1.8 0 0 0 15 3h-3.6c-.8 0-1.4.6-1.4 1.4v12.2c.5-.5 1.2-.8 2-.8H15a1.8 1.8 0 0 0 1.8-1.8V4.8Z"
      fill={a ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const NavReflect = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5 11.7 8.3 17.5 10l-5.8 1.7L10 17.5l-1.7-5.8L2.5 10l5.8-1.7L10 2.5Z"
      fill={a ? "rgba(22, 119, 84, 0.16)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="15.4" cy="4.6" r="1" fill={a ? "#167754" : "#6b7d72"} />
  </svg>
);
const NavSoon = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4.5" y="8.8" width="11" height="8" rx="2.4"
      fill={a ? "rgba(22, 119, 84, 0.16)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.55" />
    <path d="M7 8.8V6.7a3 3 0 0 1 6 0v2.1"
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinecap="round" />
    <circle cx="10" cy="12.8" r="1.1" fill={a ? "#167754" : "#6b7d72"} />
  </svg>
);

/* ─────────────────────────────────────────
   STAR ROW
───────────────────────────────────────── */
function StarRow({ count = 3 }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <polygon
            points="5,0.5 6.1,3.5 9.5,3.5 6.8,5.6 7.9,8.5 5,6.8 2.1,8.5 3.2,5.6 0.5,3.5 3.9,3.5"
            fill="rgba(164,138,73,0.25)" stroke="#a48a49" strokeWidth="0.6"
          />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   REFLECTION CARD
───────────────────────────────────────── */
function ReflectionCard({ item, index, onToggleBookmark, onToggleAction, onFeedback, onOpenModal, onOpenJournalModal }) {
  const ms = resolveMs(item.createdAt || item.timestamp);
  const parsedSections    = parseReflectionSections(item.text);
  const isLongReflection  = Boolean(parsedSections) || (item.text?.length > 220);
  const journalSnippet    = item.journalContent || item.journal;

  const mirrorPreview = parsedSections?.[0]?.body;
  const anchorPreview = parsedSections?.[4]?.body;

  return (
    <article
      className="qalb-ref-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Accent top border */}
      <div className="qalb-card-shimmer" />

      {/* Meta row */}
      <div className="qalb-ref-meta">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="#718276" strokeWidth="0.9"/>
            <path d="M5 3v2l1.2 1" stroke="#718276" strokeWidth="0.9" strokeLinecap="round"/>
          </svg>
          <span className="qalb-ref-date">{formatDate(ms)}</span>
          {ms > 0 && <span className="qalb-ref-time">{formatTime(ms)}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {item.mood && (
            <span className="qalb-ref-mood-pill">{item.mood}</span>
          )}
          <button
            type="button"
            title={item.bookmarked ? "Remove bookmark" : "Save keepsake"}
            onClick={() => onToggleBookmark(item)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              color: item.bookmarked ? "#b8871b" : "#9aa99e",
              padding: "2px 4px",
              transition: "transform 0.15s, color 0.15s",
            }}
          >
            {item.bookmarked ? "★" : "☆"}
          </button>
        </div>
      </div>

      {/* Reflection block */}
      <div className="qalb-ref-body">
        <div className="qalb-ref-label-row">
          <StarRow count={3} />
          <span className="qalb-ref-label">Reflection</span>
        </div>
        <div className="qalb-ref-text-box">
          {!isLongReflection ? (
            <StructuredReflection
              text={item.text}
              verifiedAyah={item.verifiedAyah || null}
              verifiedSunnah={item.verifiedSunnah || null}
              compact
            />
          ) : mirrorPreview ? (
            <div>
              <p className="qalb-ref-text" style={{ marginBottom: anchorPreview ? 10 : 0 }}>
                {mirrorPreview}
              </p>
              {anchorPreview && (
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: "#eef6f0",
                    borderLeft: "3px solid #167754",
                    fontSize: 12,
                    fontStyle: "italic",
                    color: "#123825",
                  }}
                >
                  ۞ {anchorPreview.split("\n")[0]}
                </div>
              )}
            </div>
          ) : (
            <p className="qalb-ref-text">
              {cleanMarkdownText(item.text).slice(0, 220) + "…"}
            </p>
          )}
        </div>
        {isLongReflection && (
          <button className="qalb-expand-btn" onClick={() => onOpenModal(item)}>
            Expand full reflection ↗
          </button>
        )}

        {/* Sunnah Action Step ('Amal) & Privacy-Safe Feedback */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onToggleAction(item)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              border: item.actionCompleted ? "1px solid #167754" : "1px solid #dce5da",
              background: item.actionCompleted ? "#eef6f0" : "#ffffff",
              color: item.actionCompleted ? "#167754" : "#586b61",
              fontSize: 11.5,
              fontWeight: item.actionCompleted ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            <span>{item.actionCompleted ? "✓" : "○"}</span>
            <span>{item.actionCompleted ? "Sunnah step practiced" : "Mark Sunnah step practiced"}</span>
          </button>

          <div style={{ display: "flex", gap: 5 }}>
            {[
              { val: "helpful", icon: "👍" },
              { val: "needs_work", icon: "👎" },
            ].map(btn => {
              const active = item.feedback === btn.val;
              return (
                <button
                  key={btn.val}
                  type="button"
                  title={btn.val === "helpful" ? "Helpful reflection" : "Needs improvement"}
                  onClick={() => onFeedback(item, btn.val)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: active ? "1px solid #167754" : "1px solid #dce5da",
                    background: active ? "#eef6f0" : "#ffffff",
                    fontSize: 11.5,
                    cursor: "pointer",
                    opacity: item.feedback && !active ? 0.5 : 1,
                  }}
                >
                  {btn.icon}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Journal source (opens overlay modal) */}
      {journalSnippet && (
        <div className="qalb-ref-journal">
          <button className="qalb-journal-toggle" onClick={() => onOpenJournalModal(item)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="1.5" width="8" height="9" rx="1" stroke="#167754" strokeWidth="1"/>
              <path d="M4 4.5h4M4 6.5h3" stroke="#167754" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span>From journal ↗</span>
          </button>
        </div>
      )}
    </article>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function ReflectionHistory({ user }) {
  const location = useLocation();
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [activeJournalModal, setActiveJournalModal] = useState(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserReflections(user.uid);
        const sorted = data.sort((a, b) => resolveMs(b.createdAt || b.timestamp) - resolveMs(a.createdAt || a.timestamp));
        setReflections(sorted);
      } catch (err) {
        console.error("Error fetching reflections:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleToggleBookmark = async (item) => {
    const next = !item.bookmarked;
    setReflections(prev => prev.map(r => (r.id === item.id ? { ...r, bookmarked: next } : r)));
    try {
      await toggleReflectionFlag(item.id, "bookmarked", next);
    } catch {
      setReflections(prev => prev.map(r => (r.id === item.id ? { ...r, bookmarked: !next } : r)));
    }
  };

  const handleToggleAction = async (item) => {
    const next = !item.actionCompleted;
    setReflections(prev => prev.map(r => (r.id === item.id ? { ...r, actionCompleted: next } : r)));
    try {
      await toggleReflectionFlag(item.id, "actionCompleted", next);
    } catch {
      setReflections(prev => prev.map(r => (r.id === item.id ? { ...r, actionCompleted: !next } : r)));
    }
  };

  const handleFeedback = async (item, val) => {
    const next = item.feedback === val ? null : val;
    setReflections(prev => prev.map(r => (r.id === item.id ? { ...r, feedback: next } : r)));
    try {
      await toggleReflectionFlag(item.id, "feedback", next);
    } catch {
      setReflections(prev => prev.map(r => (r.id === item.id ? { ...r, feedback: item.feedback || null } : r)));
    }
  };

  const practicedCount = reflections.filter(r => r.actionCompleted).length;
  const savedCount = reflections.filter(r => r.bookmarked).length;
  const helpfulCount = reflections.filter(r => r.feedback === "helpful").length;
  const moodCounts = reflections.reduce((acc, r) => {
    if (r.mood && r.mood !== "neutral") acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const uniqueMoods = Array.from(new Set(reflections.map(r => r.mood).filter(Boolean)));
  const q = searchQuery.trim().toLowerCase();
  const filtered = reflections.filter((r) => {
    if (filter === "Saved" && !r.bookmarked) return false;
    if (filter !== "All" && filter !== "Saved" && r.mood !== filter) return false;
    if (q) {
      const hay = `${r.text || ""} ${r.journalContent || ""} ${r.mood || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  /* Group by month */
  const grouped = filtered.reduce((acc, r) => {
    const key = monthKey(resolveMs(r.createdAt || r.timestamp));
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <>
      <style>{STYLES}</style>

      <div className="qalb-root">
        <div className="qalb-bg-pattern" />
        <div className="qalb-glow" />

        <div className="qalb-app">

          {/* ── TOP UTILITY BAR ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 0" }}>
            <a href={getLandingUrl()} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#167754", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ← QalbSense Home
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {user?.email && <span style={{ fontSize: 11, color: "#718276", letterSpacing: "0.02em" }}>{user.email.split("@")[0]}</span>}
              <button onClick={logout} style={{ background: "#ffffff", border: "1px solid #d5e0d5", borderRadius: 999, padding: "5px 12px", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#586b61", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.borderColor = "#c0392b"} onMouseLeave={e => e.target.style.borderColor = "#d5e0d5"}>
                Sign out
              </button>
            </div>
          </div>

          {/* ── HEADER ── */}
          <header className="qalb-rh-header">
            <div className="qalb-rule-row">
              <div className="qalb-rule" />
              {/* Crescent + stars emblem */}
              <svg width="36" height="26" viewBox="0 0 44 32" className="qalb-emblem">
                <path d="M16 2C9.4 2 4 7.4 4 14s5.4 12 12 12c-3.6 0-6-3-6-6.5C10 14 13.5 10 16 8.5c-3.5-1-6.5-.5-9 1.5C8.5 4.5 12 2 16 2z" fill="#167754" opacity="0.9"/>
                <circle cx="22" cy="5"  r="1.6" fill="#a48a49" opacity="0.8"/>
                <circle cx="27" cy="11" r="1.1" fill="#a48a49" opacity="0.6"/>
              </svg>
              <div className="qalb-rule" />
            </div>
            <p className="qalb-rh-eyebrow">Inner light</p>
            <h1 className="qalb-rh-title">Reflections</h1>
            <p className="qalb-rh-subtitle">
              {loading
                ? "Loading…"
                : `${reflections.length} reflection${reflections.length !== 1 ? "s" : ""} gathered`}
            </p>

            {/* Decorative ayah */}
            {!loading && reflections.length > 0 && (
              <TabAyahBanner
                arabic="كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ"
                translation="A blessed Book which We have revealed to you, that they may reflect upon its verses."
                reference="Surah Ṣād 38:29"
              />
            )}
          </header>

          {/* ── LOADING ── */}
          {loading && (
            <div className="qalb-loading">
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} className="qalb-loading-dot" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          )}

          {/* ── EMPTY ── */}
          {!loading && reflections.length === 0 && (
            <div className="qalb-empty">
              <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
                <polygon points="32,4 36,16 48,16 38,24 42,36 32,29 22,36 26,24 16,16 28,16" stroke="#167754" strokeWidth="1.2" opacity="0.4" fill="none"/>
                <polygon points="32,14 34.5,21 42,21 36,25.5 38.5,32.5 32,28.5 25.5,32.5 28,25.5 22,21 29.5,21" stroke="#a48a49" strokeWidth="0.9" opacity="0.5" fill="none"/>
              </svg>
              <p className="qalb-empty-title">No reflections yet</p>
              <p className="qalb-empty-sub">
                Write a journal entry and press Reflect — your inner wisdom will appear here.
              </p>
              <Link to="/" className="qalb-empty-btn">Begin reflecting</Link>
            </div>
          )}

          {/* ── REFLECTION OVERVIEW CARD ── */}
          {!loading && reflections.length > 0 && (
            <div style={{
              position: "relative",
              overflow: "hidden",
              margin: "0 20px 14px",
              padding: "18px 18px 16px",
              borderRadius: 20,
              background: "#ffffff",
              border: "1px solid #e2e9df",
              boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)",
            }}>
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: "linear-gradient(90deg, transparent, #a48a49, transparent)" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#167754" }}>
                  Reflection Overview
                </span>
                <Link
                  to="/"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#167754",
                    textDecoration: "none",
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "#eef6f0",
                  }}
                >
                  + New reflection
                </Link>
              </div>

              {topMood && (
                <div style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#f8fbf7",
                  border: "1px solid #e0e9dd",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "#2d4537",
                }}>
                  Most reflected state: <strong style={{ color: "#167754" }}>{topMood}</strong>
                  {helpfulCount > 0 && (
                    <span style={{ color: "#687b6f" }}> · 👍 {helpfulCount} marked helpful</span>
                  )}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                <div style={{ padding: "10px 8px", borderRadius: 12, background: "#f8fbf7", border: "1px solid #e3ebe1", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#1d3129" }}>{reflections.length}</div>
                  <div style={{ fontSize: 10.5, color: "#586b61", fontWeight: 600 }}>Reflections</div>
                </div>
                <div style={{ padding: "10px 8px", borderRadius: 12, background: "#eef6f0", border: "1px solid #cde0ce", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#167754" }}>{practicedCount}</div>
                  <div style={{ fontSize: 10.5, color: "#167754", fontWeight: 600 }}>Practiced</div>
                </div>
                <div style={{ padding: "10px 8px", borderRadius: 12, background: "#fdf8ec", border: "1px solid #f0dfb5", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#8c6d23" }}>{savedCount}</div>
                  <div style={{ fontSize: 10.5, color: "#8c6d23", fontWeight: 600 }}>★ Saved</div>
                </div>
              </div>
            </div>
          )}

          {/* ── SEARCH & FILTERS ── */}
          {!loading && reflections.length > 0 && (
            <div style={{ padding: "12px 20px 4px" }}>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reflections, feelings, or verses…"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid #d8e2d5",
                  background: "#ffffff",
                  color: "#1d3129",
                  fontSize: 13,
                  outline: "none",
                  marginBottom: 10,
                }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["All", "Saved", ...uniqueMoods].map((pill) => {
                  const active = filter === pill;
                  return (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setFilter(pill)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        border: active ? "1px solid #167754" : "1px solid #d8e2d5",
                        background: active ? "#167754" : "#ffffff",
                        color: active ? "#ffffff" : "#4c6255",
                        fontSize: 11.5,
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                      }}
                    >
                      {pill === "Saved" ? "★ Saved" : pill}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── REFLECTION LIST ── */}
          {!loading && reflections.length > 0 && filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#687b6f", fontSize: 13, padding: "28px 20px" }}>
              No reflections match this filter yet.
            </p>
          )}
          {!loading && Object.entries(grouped).map(([month, entries]) => (
            <section key={month} className="qalb-month-section">
              <div className="qalb-month-label">
                <div className="qalb-month-rule" />
                <span>{month}</span>
                <div className="qalb-month-rule" />
              </div>
              <div className="qalb-history-grid">
                {entries.map((r, i) => (
                  <ReflectionCard
                    key={r.id}
                    item={r}
                    index={i}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleAction={handleToggleAction}
                    onFeedback={handleFeedback}
                    onOpenModal={setActiveModalItem}
                    onOpenJournalModal={setActiveJournalModal}
                  />
                ))}
              </div>
            </section>
          ))}

          <div style={{ height: 24 }} />
        </div>

        {/* ── FULL REFLECTION MODAL ── */}
        <ReflectionModal
          isOpen={Boolean(activeModalItem)}
          onClose={() => setActiveModalItem(null)}
          mood={activeModalItem?.mood}
          date={activeModalItem ? formatDate(resolveMs(activeModalItem.createdAt || activeModalItem.timestamp)) : ""}
          time={activeModalItem ? formatTime(resolveMs(activeModalItem.createdAt || activeModalItem.timestamp)) : ""}
          text={activeModalItem?.text}
          verifiedAyah={activeModalItem?.verifiedAyah || null}
          verifiedSunnah={activeModalItem?.verifiedSunnah || null}
          journalContent={activeModalItem?.journalContent || activeModalItem?.journal || ""}
        />

        {/* ── JOURNAL SOURCE MODAL ── */}
        <ReflectionModal
          isOpen={Boolean(activeJournalModal)}
          onClose={() => setActiveJournalModal(null)}
          mood={activeJournalModal?.mood}
          date={activeJournalModal ? formatDate(resolveMs(activeJournalModal.createdAt || activeJournalModal.timestamp)) : ""}
          time={activeJournalModal ? formatTime(resolveMs(activeJournalModal.createdAt || activeJournalModal.timestamp)) : ""}
          text={null}
          journalContent={activeJournalModal?.journalContent || activeJournalModal?.journal || ""}
        />

        {/* ── BOTTOM NAV ── */}
        <nav className="qalb-nav">
          {[
            { to: "/",                   label: "Home",    Icon: NavHome    },
            { to: "/mood-history",       label: "Mood",    Icon: NavMood    },
            { to: "/journal-history",    label: "Journal", Icon: NavJournal },
            { to: "/reflection-history", label: "Reflect", Icon: NavReflect },
            { to: "/coming-soon",        label: "Coming Soon", Icon: NavSoon    },
          ].map(({ to, label, Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`qalb-nav-item${active ? " active" : ""}`}>
                <div className="qalb-nav-icon-wrap"><Icon a={active} /></div>
                <span className="qalb-nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.qalb-root {
  background: #f5f7f0;
  min-height: 100vh;
  color: #1d3129;
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}

.qalb-bg-pattern {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23167754' stroke-width='0.9'%3E%3Cpolygon points='40,4 47,18 62,18 51,27 55,42 40,33 25,42 29,27 18,18 33,18'/%3E%3Crect x='10' y='10' width='60' height='60' transform='rotate(45 40 40)'/%3E%3Ccircle cx='40' cy='40' r='25'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 80px 80px;
}
.qalb-glow {
  position: fixed; top: -180px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 380px;
  background: radial-gradient(ellipse, rgba(22, 119, 84, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.qalb-app { max-width: 480px; margin: 0 auto; padding: 0 0 100px; position: relative; z-index: 1; }

/* Header */
.qalb-rh-header { text-align: center; padding: 36px 24px 24px; animation: fadeSlide 0.7s ease both; }
.qalb-rule-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.qalb-rule { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d8e2d5, transparent); }
.qalb-emblem { animation: shimmer 3.5s ease-in-out infinite; }
.qalb-rh-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #167754; margin-bottom: 8px; }
.qalb-rh-title { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 600; color: #1d3129; line-height: 1.15; margin-bottom: 6px; letter-spacing: -0.02em; }
.qalb-rh-subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-style: italic; color: #586b61; margin-bottom: 16px; }

/* Ayah strip in header */
.qalb-rh-ayah-strip { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
.qalb-rh-arabic { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; color: #1d3129; direction: rtl; white-space: nowrap; letter-spacing: 0.02em; }
.qalb-rh-trans { font-family: 'Playfair Display', serif; font-size: 12px; font-style: italic; color: #586b61; letter-spacing: 0.02em; line-height: 1.5; padding: 0 20px; }

/* Month section */
.qalb-month-section { padding: 0 20px; }
.qalb-month-label { display: flex; align-items: center; gap: 12px; margin: 24px 0 12px; }
.qalb-month-label span { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #167754; white-space: nowrap; }
.qalb-month-rule { flex: 1; height: 1px; background: linear-gradient(90deg, #d8e2d5, transparent); }

/* Reflection card */
.qalb-ref-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e9df;
  border-radius: 20px;
  padding: 20px 20px 18px;
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(29, 49, 41, 0.04);
  animation: cardIn 0.55s ease both;
  transition: all 0.2s;
}
.qalb-ref-card:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(29, 49, 41, 0.06); }

/* Shimmer top */
.qalb-card-shimmer {
  position: absolute; top: 0; left: 15%; right: 15%; height: 2px;
  background: linear-gradient(90deg, transparent, #a48a49, transparent);
}

/* Meta */
.qalb-ref-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.qalb-ref-date { font-size: 12px; color: #718276; font-weight: 500; }
.qalb-ref-time { font-size: 10.5px; font-weight: 600; color: #167754; background: #eef6f0; border-radius: 6px; padding: 1px 7px; }
.qalb-ref-mood-pill { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 999px; border: 1px solid #c0decb; background: #eef6f0; color: #167754; }

/* Reflection body */
.qalb-ref-body { margin-bottom: 14px; }
.qalb-ref-label-row { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
.qalb-ref-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #a48a49; }
.qalb-ref-text-box {
  background: #fcfdfa;
  border: 1px solid #d8e6db;
  border-left: 4px solid #167754;
  border-radius: 0 14px 14px 0;
  padding: 14px 16px;
  position: relative;
}
.qalb-ref-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px;
  font-style: italic;
  line-height: 1.8;
  color: #1d3129;
}
.qalb-expand-btn { margin-top: 8px; background: none; border: none; color: #167754; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 3px; }

/* Journal source */
.qalb-ref-journal { border-top: 1px solid #edf1ea; padding-top: 12px; }
.qalb-journal-toggle { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; padding: 0; }
.qalb-journal-toggle span { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #586b61; }
.qalb-journal-toggle:hover span { color: #167754; }
.qalb-journal-text { margin-top: 10px; font-size: 13px; line-height: 1.7; color: #55685d; padding: 10px 12px; background: #fbfcf8; border-radius: 10px; border: 1px solid #e7ede2; animation: fadeSlide 0.3s ease both; }

/* Loading */
.qalb-loading { display: flex; justify-content: center; gap: 8px; padding: 70px 0; }
.qalb-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: #167754; animation: pulse 1.2s ease-in-out infinite; }

/* Empty */
.qalb-empty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 64px 32px; text-align: center; }
.qalb-empty-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 600; color: #1d3129; }
.qalb-empty-sub { font-size: 14px; color: #586b61; line-height: 1.65; max-width: 250px; font-style: italic; }
.qalb-empty-btn { margin-top: 8px; padding: 11px 26px; border-radius: 999px; background: linear-gradient(135deg, #167754, #0c533c); color: #ffffff; font-size: 13.5px; font-weight: 600; letter-spacing: 0.02em; text-decoration: none; box-shadow: 0 4px 16px rgba(22, 119, 84, 0.25); transition: all 0.22s; }
.qalb-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22, 119, 84, 0.35); }

/* Nav */
.qalb-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: center; align-items: center; gap: 2px;
  padding: 8px max(10px, calc((100% - 560px) / 2)) 14px;
  background: rgba(245,247,240,0.96);
  border-top: 1px solid #dce5da;
  box-shadow: 0 -4px 20px rgba(17,33,23,0.04);
  backdrop-filter: blur(16px);
  z-index: 50;
}
.qalb-nav-item {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  cursor: pointer; padding: 4px 2px; border-radius: 12px; text-decoration: none; transition: all 0.2s;
}
.qalb-nav-icon-wrap {
  width: 38px; height: 34px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.qalb-nav-item:hover .qalb-nav-icon-wrap { background: rgba(22,119,84,0.06); }
.qalb-nav-item.active .qalb-nav-icon-wrap { background: #e6f4ea; border-color: rgba(22,119,84,0.16); }
.qalb-nav-item:focus-visible { outline: 2px solid #167754; outline-offset: 2px; }
.qalb-nav-label {
  font-size: 9.5px; font-weight: 500; letter-spacing: 0.03em;
  color: #65776c; font-family: 'DM Sans', sans-serif; text-transform: uppercase; white-space: nowrap;
}
.qalb-nav-item.active .qalb-nav-label { color: #167754; font-weight: 700; }

@keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cardIn    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer   { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }

.qalb-history-grid { display: flex; flex-direction: column; gap: 12px; }
@media (min-width: 768px) {
  .qalb-app { max-width: 960px; }
  .qalb-history-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; align-items: start; }
  .qalb-ref-card { margin-bottom: 0; }
}
`;
