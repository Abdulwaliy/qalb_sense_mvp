import { useEffect, useState } from "react";
import { getUserJournals } from "../services/journalService.js";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService.js";
import { getLandingUrl } from "../utils/domain.js";
import ReflectionModal from "./ReflectionModal.jsx";
import TabAyahBanner from "./TabAyahBanner.jsx";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <polygon points="6.5,1 8,4.5 12,4.5 9,7 10.2,11 6.5,8.5 2.8,11 4,7 1,4.5 5,4.5"
      stroke="#a48a49" strokeWidth="1" strokeLinejoin="round" fill="rgba(164,138,73,0.18)" />
  </svg>
);
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
    <circle cx="5.5" cy="5.5" r="4.5" stroke="#718276" strokeWidth="0.9" />
    <path d="M5.5 3v2.5l1.5 1" stroke="#718276" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);
const IconEmpty = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="12" y="8" width="32" height="40" rx="4" stroke="#167754" strokeWidth="1.2" opacity="0.35" />
    <path d="M20 20h16M20 26h12M20 32h8" stroke="#167754" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    <circle cx="42" cy="42" r="10" fill="#f5f7f0" stroke="#167754" strokeWidth="1" opacity="0.4" />
    <path d="M42 38v4M42 44v1" stroke="#167754" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
  </svg>
);

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(seconds) {
  if (!seconds) return "No date";
  const d = new Date(seconds * 1000);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(seconds) {
  if (!seconds) return "";
  const d = new Date(seconds * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
const NavDigest = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3.2" y="4.2" width="13.6" height="12.6" rx="2.5"
      fill={a ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.5" />
    <path d="M6.8 2.8v2.6M13.2 2.8v2.6M6.2 9.2h7.6M6.2 12.6h4.8"
      stroke={a ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinecap="round" />
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
   JOURNAL CARD
───────────────────────────────────────── */
function JournalCard({ journal, index, onOpenReflection }) {
  const [expanded, setExpanded] = useState(false);
  const isDua = journal.content?.startsWith("🤲 Closing Du‘ā’:");
  const displayContent = isDua
    ? journal.content.replace(/^🤲 Closing Du‘ā’:\s*/, "")
    : journal.content;
  const isLong = displayContent?.length > 180;
  const preview = isLong && !expanded
    ? displayContent.slice(0, 180) + "…"
    : displayContent;

  return (
    <article
      className="qalb-journal-card"
      style={{
        animationDelay: `${index * 0.05}s`,
        ...(isDua ? { background: "#f7fbf6", borderColor: "#cde2ce" } : {}),
      }}
    >
      {/* Top accent rule */}
      <div className="qalb-card-top-rule" />

      {/* Date row */}
      <div className="qalb-card-meta">
        <div className="qalb-card-date-row">
          <IconClock />
          <span className="qalb-card-date">{formatDate(journal.timestamp?.seconds)}</span>
          <span className="qalb-card-time">{formatTime(journal.timestamp?.seconds)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isDua && (
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 999,
                background: "#eef6f0",
                border: "1px solid #bfdeca",
                color: "#167754",
                fontSize: 10.5,
                fontWeight: 700,
              }}
            >
              🤲 Du‘ā’
            </span>
          )}
          {journal.mood && (
            <span className="qalb-card-mood-badge">{journal.mood}</span>
          )}
        </div>
      </div>

      {/* Journal content */}
      <p
        className="qalb-card-content"
        style={isDua ? { fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "#123825" } : undefined}
      >
        {preview}
      </p>
      {isLong && (
        <button className="qalb-card-expand" onClick={() => setExpanded(e => !e)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Reflection (opens overlay modal) */}
      {journal.reflection && (
        <div className="qalb-card-reflection">
          <button
            type="button"
            onClick={() => onOpenReflection(journal)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              color: "#167754",
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            <IconStar />
            <span>View reflection ↗</span>
          </button>
        </div>
      )}
    </article>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function JournalHistory({ user }) {
  const location = useLocation();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJournalModal, setActiveJournalModal] = useState(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserJournals(user.uid);
        setJournals(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const totalDuas = journals.filter(j => j.content?.startsWith("🤲 Closing Du‘ā’:")).length;
  const totalReflected = journals.filter(j => j.reflection).length;

  const q = searchQuery.trim().toLowerCase();
  const visible = journals.filter(j => {
    if (filter === "with-reflection" && !j.reflection) return false;
    if (filter === "duas" && !j.content?.startsWith("🤲 Closing Du‘ā’:")) return false;
    if (q) {
      const hay = `${j.content || ""} ${j.reflection || ""} ${j.mood || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  /* Group by month */
  const grouped = visible.reduce((acc, j) => {
    const key = j.timestamp?.seconds
      ? (() => { const d = new Date(j.timestamp.seconds * 1000); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; })()
      : "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(j);
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
          <header className="qalb-jh-header">
            <div className="qalb-rule-row">
              <div className="qalb-rule" />
              <svg width="24" height="24" viewBox="0 0 28 28" className="qalb-crescent">
                <path d="M14 3C8.5 3 4 7.5 4 13s4.5 10 10 10c-3 0-5-2.5-5-5.5 0-4.5 3-7.5 5-8.5C11.5 8 9 9 7 11 8.5 5.5 11 3 14 3z" fill="#167754" opacity="0.9"/>
                <circle cx="19" cy="6" r="1.5" fill="#a48a49" opacity="0.8"/>
              </svg>
              <div className="qalb-rule" />
            </div>
            <p className="qalb-jh-eyebrow">Your words</p>
            <h1 className="qalb-jh-title">Journal History</h1>
            <p className="qalb-jh-subtitle">
              {loading ? "Loading…" : `${journals.length} entr${journals.length === 1 ? "y" : "ies"} written`}
            </p>
            {!loading && journals.length > 0 && (
              <TabAyahBanner
                arabic="وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ"
                translation="Let every soul look to what it has sent forth for tomorrow."
                reference="Surah Al-Hashr 59:18"
              />
            )}
          </header>

          {/* ── JOURNAL OVERVIEW CARD ── */}
          {!loading && journals.length > 0 && (
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
              <div className="qalb-card-top-rule" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#167754" }}>
                  Journal Overview
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
                  + Write entry
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                <div style={{ padding: "10px 8px", borderRadius: 12, background: "#f8fbf7", border: "1px solid #e3ebe1", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#1d3129" }}>{journals.length}</div>
                  <div style={{ fontSize: 10.5, color: "#586b61", fontWeight: 600 }}>Entries</div>
                </div>
                <div style={{ padding: "10px 8px", borderRadius: 12, background: "#eef6f0", border: "1px solid #cde0ce", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#167754" }}>{totalReflected}</div>
                  <div style={{ fontSize: 10.5, color: "#167754", fontWeight: 600 }}>Reflected</div>
                </div>
                <div style={{ padding: "10px 8px", borderRadius: 12, background: "#fdf8ec", border: "1px solid #f0dfb5", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#8c6d23" }}>{totalDuas}</div>
                  <div style={{ fontSize: 10.5, color: "#8c6d23", fontWeight: 600 }}>Du‘ā’s</div>
                </div>
              </div>
            </div>
          )}

          {/* ── SEARCH & FILTER TABS ── */}
          {!loading && journals.length > 0 && (
            <div style={{ padding: "0 20px 6px" }}>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your journal entries or Du‘ā’s…"
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
              <div className="qalb-filter-row" style={{ padding: 0 }}>
                <button
                  className={`qalb-filter-btn${filter === "all" ? " active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All entries
                </button>
                <button
                  className={`qalb-filter-btn${filter === "with-reflection" ? " active" : ""}`}
                  onClick={() => setFilter("with-reflection")}
                >
                  ✦ With reflection
                </button>
                <button
                  className={`qalb-filter-btn${filter === "duas" ? " active" : ""}`}
                  onClick={() => setFilter("duas")}
                >
                  🤲 Du‘ā’s
                </button>
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div className="qalb-loading">
              <div className="qalb-loading-dot" style={{ animationDelay: "0s" }} />
              <div className="qalb-loading-dot" style={{ animationDelay: "0.2s" }} />
              <div className="qalb-loading-dot" style={{ animationDelay: "0.4s" }} />
            </div>
          )}

          {/* ── EMPTY ── */}
          {!loading && visible.length === 0 && (
            <div className="qalb-empty">
              <IconEmpty />
              <p className="qalb-empty-title">
                {filter === "with-reflection" ? "No reflected entries yet" : "No journal entries yet"}
              </p>
              <p className="qalb-empty-sub">
                {filter === "with-reflection"
                  ? "Write a journal entry and tap Reflect to begin"
                  : "Your heart has much to say — begin writing today"}
              </p>
              <Link to="/" className="qalb-empty-btn">Write your first entry</Link>
            </div>
          )}

          {/* ── JOURNAL LIST ── */}
          {!loading && Object.entries(grouped).map(([month, entries]) => (
            <section key={month} className="qalb-month-group">
              <div className="qalb-month-label">
                <div className="qalb-month-rule" />
                <span>{month}</span>
                <div className="qalb-month-rule" />
              </div>
              <div className="qalb-history-grid">
                {entries.map((j, i) => (
                  <JournalCard key={j.id} journal={j} index={i} onOpenReflection={setActiveJournalModal} />
                ))}
              </div>
            </section>
          ))}

          {/* ── BOTTOM SPACER ── */}
          <div style={{ height: 24 }} />

        </div>

        {/* ── REFLECTION MODAL ── */}
        <ReflectionModal
          isOpen={Boolean(activeJournalModal)}
          onClose={() => setActiveJournalModal(null)}
          mood={activeJournalModal?.mood}
          date={formatDate(activeJournalModal?.timestamp?.seconds)}
          time={formatTime(activeJournalModal?.timestamp?.seconds)}
          text={activeJournalModal?.reflection}
          journalContent={activeJournalModal?.content}
        />

        {/* ── BOTTOM NAV ── */}
        <nav className="qalb-nav">
          {[
            { to: "/",                  label: "Home",    Icon: NavHome    },
            { to: "/mood-history",      label: "Mood",    Icon: NavMood    },
            { to: "/journal-history",   label: "Journal", Icon: NavJournal },
            { to: "/reflection-history",label: "Reflect", Icon: NavReflect },
            { to: "/weekly-digest",     label: "Digest",  Icon: NavDigest  },
            { to: "/coming-soon",       label: "Coming Soon", Icon: NavSoon    },
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
.qalb-jh-header { text-align: center; padding: 36px 24px 24px; animation: fadeSlide 0.7s ease both; }
.qalb-jh-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #167754; margin-bottom: 8px; }
.qalb-jh-title { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 600; color: #1d3129; line-height: 1.15; margin-bottom: 6px; letter-spacing: -0.02em; }
.qalb-jh-subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-style: italic; color: #586b61; font-weight: 400; }
.qalb-rule-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.qalb-rule { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d8e2d5, transparent); }
.qalb-crescent { animation: shimmer 3s ease-in-out infinite; }

/* Filter */
.qalb-filter-row { display: flex; gap: 8px; padding: 0 20px 4px; animation: fadeSlide 0.7s 0.1s ease both; opacity: 0; animation-fill-mode: forwards; }
.qalb-filter-btn { flex: 1; padding: 9px 0; border-radius: 999px; border: 1px solid #e2e9df; background: #ffffff; color: #586b61; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.22s; box-shadow: 0 1px 4px rgba(29, 49, 41, 0.02); }
.qalb-filter-btn.active { background: #eef6f0; border-color: #167754; color: #167754; font-weight: 600; box-shadow: 0 2px 8px rgba(22, 119, 84, 0.08); }
.qalb-filter-btn:not(.active):hover { color: #1d3129; background: #fbfcf9; border-color: #d0dbcc; }

/* Month group */
.qalb-month-group { padding: 0 20px; }
.qalb-month-label { display: flex; align-items: center; gap: 12px; margin: 24px 0 12px; }
.qalb-month-label span { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #167754; white-space: nowrap; }
.qalb-month-rule { flex: 1; height: 1px; background: linear-gradient(90deg, #d8e2d5, transparent); }

/* Journal card */
.qalb-journal-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e9df;
  border-radius: 18px;
  padding: 18px 20px 20px;
  margin-bottom: 12px;
  box-shadow: 0 4px 18px rgba(29, 49, 41, 0.04);
  overflow: hidden;
  animation: cardIn 0.55s ease both;
  transition: all 0.2s;
}
.qalb-journal-card:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(29, 49, 41, 0.06); }
.qalb-card-top-rule {
  position: absolute; top: 0; left: 15%; right: 15%; height: 2px;
  background: linear-gradient(90deg, transparent, #a48a49, transparent);
}

/* Card meta */
.qalb-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.qalb-card-date-row { display: flex; align-items: center; gap: 6px; }
.qalb-card-date { font-size: 12px; color: #718276; font-weight: 500; }
.qalb-card-time { font-size: 11px; font-weight: 600; color: #167754; background: #eef6f0; border-radius: 6px; padding: 1px 6px; }
.qalb-card-mood-badge { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 999px; border: 1px solid #c0decb; background: #eef6f0; color: #167754; }

/* Content */
.qalb-card-content { font-size: 14px; line-height: 1.75; color: #1d3129; }
.qalb-card-expand { margin-top: 8px; background: none; border: none; color: #167754; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 3px; }

/* Reflection */
.qalb-card-reflection { margin-top: 14px; padding: 12px 14px; background: #fcfdfa; border: 1px solid #d8e6db; border-left: 3px solid #167754; border-radius: 0 12px 12px 0; }
.qalb-reflection-label { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.qalb-reflection-label span { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #a48a49; }
.qalb-reflection-body { font-family: 'Playfair Display', Georgia, serif; font-size: 13.5px; line-height: 1.7; color: #1d3129; font-style: italic; }

/* Loading dots */
.qalb-loading { display: flex; justify-content: center; gap: 8px; padding: 60px 0; }
.qalb-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: #167754; animation: pulse 1.2s ease-in-out infinite; }

/* Empty state */
.qalb-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px 32px; text-align: center; }
.qalb-empty-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 600; color: #1d3129; }
.qalb-empty-sub { font-size: 14px; color: #586b61; line-height: 1.65; max-width: 250px; font-style: italic; }
.qalb-empty-btn { margin-top: 8px; padding: 11px 26px; border-radius: 999px; background: linear-gradient(135deg, #167754, #0c533c); color: #ffffff; font-size: 13.5px; font-weight: 600; letter-spacing: 0.02em; text-decoration: none; box-shadow: 0 4px 16px rgba(22, 119, 84, 0.25); transition: all 0.22s; }
.qalb-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22, 119, 84, 0.35); }

/* Bottom nav */
.qalb-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: center; align-items: center; gap: 2px;
  padding: 8px max(8px, calc((100% - 620px) / 2)) 14px;
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
  font-size: 8.8px; font-weight: 500; letter-spacing: 0.02em;
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
  .qalb-journal-card { margin-bottom: 0; }
}
`;
