import { useEffect, useState } from "react";
import { getUserMoods } from "../services/moodService.js";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService.js";
import { getLandingUrl } from "../utils/domain.js";
import { MOOD_META_MAP, CORE_MOOD_STATES } from "../constants/moods.js";
import TabAyahBanner from "./TabAyahBanner.jsx";

/* ─────────────────────────────────────────
   MOOD CONFIG
───────────────────────────────────────── */
const MOOD_META = MOOD_META_MAP;
const ALL_MOODS = Object.keys(MOOD_META);

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt = (secs) => {
  if (!secs) return { date: "No date", time: "" };
  const d = new Date(secs * 1000);
  return {
    date: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};
const monthKey = (secs) => {
  if (!secs) return "Unknown";
  const d = new Date(secs * 1000);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

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
   MOOD DONUT CHART (SVG)
───────────────────────────────────────── */
function MoodDonut({ moods }) {
  const counts = ALL_MOODS.reduce((acc, m) => {
    acc[m] = moods.filter(e => e.mood === m).length;
    return acc;
  }, {});
  const total = moods.length || 1;
  const R = 54, stroke = 13, cx = 70, cy = 70;
  const circ = 2 * Math.PI * R;

  let offset = 0;
  const slices = ALL_MOODS
    .filter(m => counts[m] > 0)
    .map(m => {
      const pct = counts[m] / total;
      const dash = pct * circ;
      const gap  = circ - dash;
      const slice = { m, dash, gap, offset, color: MOOD_META[m].color };
      offset += dash + 1.5;
      return slice;
    });

  const dominant = ALL_MOODS.reduce((a, b) => counts[a] >= counts[b] ? a : b);
  const meta = MOOD_META[dominant];

  return (
    <div className="qalb-donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#edf1ea" strokeWidth={stroke} />
        {slices.map(s => (
          <circle
            key={s.m} cx={cx} cy={cy} r={R} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" dominantBaseline="middle">{meta.emoji}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#718276" fontFamily="'DM Sans', sans-serif" fontWeight="500" letterSpacing="0.04em">{meta.label}</text>
      </svg>

      <div className="qalb-donut-legend">
        {ALL_MOODS.filter(m => counts[m] > 0).map(m => (
          <div key={m} className="qalb-legend-row">
            <span className="qalb-legend-dot" style={{ background: MOOD_META[m].color }} />
            <span className="qalb-legend-name">{m}</span>
            <span className="qalb-legend-count">{counts[m]}</span>
            <div className="qalb-legend-bar-track">
              <div className="qalb-legend-bar-fill" style={{ width: `${(counts[m]/total)*100}%`, background: MOOD_META[m].color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOOD CARD
───────────────────────────────────────── */
const INTENSITY_STYLES = {
  Gentle:   { bg: "#eef6f0", color: "#167754", border: "#c0decb" },
  Moderate: { bg: "#fdf8ec", color: "#8c6d23", border: "#f0dfb5" },
  Heavy:    { bg: "#fdf2f0", color: "#a93226", border: "#f5c6cb" },
};

function MoodCard({ entry, index }) {
  const meta = MOOD_META[entry.mood] || { emoji: "🙂", color: "#167754", bg: "#eef6f0", border: "#c0decb", label: entry.mood };
  const { date, time } = fmt(entry.timestamp?.seconds);
  const intensityStyle = INTENSITY_STYLES[entry.note];

  return (
    <div
      className="qalb-mood-card"
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Left accent bar */}
      <div className="qalb-mood-accent" style={{ background: meta.color }} />

      {/* Emoji bubble */}
      <div className="qalb-mood-bubble" style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
        <span className="qalb-mood-emoji">{meta.emoji}</span>
      </div>

      {/* Content */}
      <div className="qalb-mood-body">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="qalb-mood-name" style={{ color: meta.color }}>{meta.label}</span>
          {intensityStyle && (
            <span style={{
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              background: intensityStyle.bg,
              color: intensityStyle.color,
              border: `1px solid ${intensityStyle.border}`,
            }}>
              {entry.note}
            </span>
          )}
          {meta.core && (
            <span style={{ fontSize: 10.5, color: "#718276", fontStyle: "italic" }}>
              · {meta.core}
            </span>
          )}
        </div>
        <div className="qalb-mood-time-row">
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="#718276" strokeWidth="0.9"/>
            <path d="M5 3v2l1.2 1" stroke="#718276" strokeWidth="0.9" strokeLinecap="round"/>
          </svg>
          <span className="qalb-mood-date">{date}</span>
          {time && <span className="qalb-mood-time-badge">{time}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function MoodHistory({ user }) {
  const location = useLocation();
  const [moods, setMoods]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [coreFilter, setCoreFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserMoods(user.uid);
        setMoods(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const visible = moods.filter(m => {
    if (coreFilter !== "All" && MOOD_META[m.mood]?.core !== coreFilter) return false;
    if (filter !== "All" && m.mood !== filter) return false;
    return true;
  });

  const coreCounts = CORE_MOOD_STATES.map(core => ({
    ...core,
    count: moods.filter(e => MOOD_META[e.mood]?.core === core.id).length,
  })).filter(c => c.count > 0);
  const topCore = [...coreCounts].sort((a, b) => b.count - a.count)[0] || null;
  const heavyCount = moods.filter(e => e.note === "Heavy").length;

  /* Group by month */
  const grouped = visible.reduce((acc, m) => {
    const key = monthKey(m.timestamp?.seconds);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  /* Moods that actually appear in data */
  const presentMoods = ALL_MOODS.filter(m => moods.some(e => e.mood === m));

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
          <header className="qalb-mh-header">
            <div className="qalb-rule-row">
              <div className="qalb-rule" />
              <svg width="24" height="24" viewBox="0 0 28 28" className="qalb-crescent">
                <path d="M14 3C8.5 3 4 7.5 4 13s4.5 10 10 10c-3 0-5-2.5-5-5.5 0-4.5 3-7.5 5-8.5C11.5 8 9 9 7 11 8.5 5.5 11 3 14 3z" fill="#167754" opacity="0.9"/>
                <circle cx="19" cy="6" r="1.5" fill="#a48a49" opacity="0.8"/>
              </svg>
              <div className="qalb-rule" />
            </div>
            <p className="qalb-mh-eyebrow">Your heart's journey</p>
            <h1 className="qalb-mh-title">Mood History</h1>
            <p className="qalb-mh-subtitle">
              {loading ? "Loading…" : `${moods.length} moment${moods.length !== 1 ? "s" : ""} recorded`}
            </p>
            {!loading && moods.length > 0 && (
              <TabAyahBanner
                arabic="أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
                translation="Verily, in the remembrance of Allah do hearts find rest."
                reference="Surah Ar-Ra'd 13:28"
              />
            )}
          </header>

          {/* ── DONUT CHART + CORE STATE TRENDS ── */}
          {!loading && moods.length > 0 && (
            <div className="qalb-chart-card">
              <div className="qalb-card-top-rule" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p className="qalb-chart-title" style={{ marginBottom: 0 }}>Heart Overview</p>
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
                  + Log state
                </Link>
              </div>

              {topCore && (
                <div style={{
                  marginBottom: 16,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#f8fbf7",
                  border: "1px solid #e0e9dd",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "#2d4537",
                }}>
                  Most frequent state: <strong style={{ color: topCore.color }}>{topCore.emoji} {topCore.label} ({topCore.sub})</strong>
                  {heavyCount > 0 && (
                    <span style={{ color: "#687b6f" }}> · {heavyCount} heavy moment{heavyCount !== 1 ? "s" : ""}</span>
                  )}
                </div>
              )}

              <MoodDonut moods={moods} />

              {/* Interactive Core State Filter Pills */}
              {coreCounts.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #edf1ea" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#718276", marginBottom: 8 }}>
                    Filter by Core State
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {coreCounts.map(core => {
                      const active = coreFilter === core.id;
                      return (
                        <button
                          key={core.id}
                          type="button"
                          onClick={() => {
                            setCoreFilter(active ? "All" : core.id);
                            setFilter("All");
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 11px",
                            borderRadius: 999,
                            background: active ? core.color : core.bg,
                            border: `1px solid ${active ? core.color : core.border}`,
                            color: active ? "#ffffff" : core.color,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.18s",
                          }}
                        >
                          <span>{core.emoji}</span>
                          <span>{core.label}</span>
                          <span style={{ opacity: 0.85 }}>({core.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FILTER CHIPS ── */}
          {!loading && moods.length > 0 && (
            <div className="qalb-chip-row">
              <button
                className={`qalb-chip${filter === "All" && coreFilter === "All" ? " active" : ""}`}
                onClick={() => {
                  setFilter("All");
                  setCoreFilter("All");
                }}
              >
                All
              </button>
              {presentMoods.map(m => (
                <button
                  key={m}
                  className={`qalb-chip${filter === m ? " active" : ""}`}
                  style={filter === m ? { borderColor: MOOD_META[m].border, color: MOOD_META[m].color, background: MOOD_META[m].bg } : {}}
                  onClick={() => {
                    setFilter(filter === m ? "All" : m);
                    setCoreFilter("All");
                  }}
                >
                  {MOOD_META[m].emoji} {m}
                </button>
              ))}
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div className="qalb-loading">
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} className="qalb-loading-dot" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          )}

          {/* ── EMPTY ── */}
          {!loading && visible.length === 0 && (
            <div className="qalb-empty">
              <span style={{ fontSize: 44 }}>{filter !== "All" ? MOOD_META[filter]?.emoji : "🌙"}</span>
              <p className="qalb-empty-title">
                {filter !== "All" ? `No "${filter}" entries yet` : "No moods logged yet"}
              </p>
              <p className="qalb-empty-sub">
                Checking in with your heart is the first step toward healing.
              </p>
              <Link to="/" className="qalb-empty-btn">Log your mood</Link>
            </div>
          )}

          {/* ── LIST ── */}
          {!loading && Object.entries(grouped).map(([month, entries]) => (
            <section key={month} className="qalb-month-section">
              <div className="qalb-month-label">
                <div className="qalb-month-rule" />
                <span>{month}</span>
                <div className="qalb-month-rule" />
              </div>
              <div className="qalb-history-grid">
                {entries.map((e, i) => <MoodCard key={e.id} entry={e} index={i} />)}
              </div>
            </section>
          ))}

          <div style={{ height: 24 }} />
        </div>

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
.qalb-mh-header { text-align: center; padding: 36px 24px 24px; animation: fadeSlide 0.7s ease both; }
.qalb-rule-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.qalb-rule { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d8e2d5, transparent); }
.qalb-crescent { animation: shimmer 3s ease-in-out infinite; }
.qalb-mh-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #167754; margin-bottom: 8px; }
.qalb-mh-title { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 600; color: #1d3129; line-height: 1.15; margin-bottom: 6px; letter-spacing: -0.02em; }
.qalb-mh-subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-style: italic; color: #586b61; font-weight: 400; }

/* Chart card */
.qalb-chart-card {
  position: relative; overflow: hidden;
  margin: 8px 20px 0;
  background: #ffffff;
  border: 1px solid #e2e9df;
  border-radius: 20px;
  padding: 20px 20px 18px;
  box-shadow: 0 4px 20px rgba(29, 49, 41, 0.04);
  animation: fadeSlide 0.7s 0.1s ease both; opacity: 0; animation-fill-mode: forwards;
}
.qalb-card-top-rule { position: absolute; top: 0; left: 15%; right: 15%; height: 2px; background: linear-gradient(90deg, transparent, #a48a49, transparent); }
.qalb-chart-title { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #167754; margin-bottom: 16px; }

/* Donut */
.qalb-donut-wrap { display: flex; align-items: center; gap: 20px; }
.qalb-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.qalb-legend-row { display: flex; align-items: center; gap: 7px; }
.qalb-legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.qalb-legend-name { font-size: 11.5px; color: #1d3129; font-weight: 600; min-width: 82px; }
.qalb-legend-count { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: #718276; min-width: 18px; text-align: right; }
.qalb-legend-bar-track { flex: 1; height: 4px; background: #eef2ec; border-radius: 999px; overflow: hidden; }
.qalb-legend-bar-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; opacity: 0.9; }

/* Filter chips */
.qalb-chip-row { display: flex; overflow-x: auto; gap: 8px; padding: 16px 20px 4px; scrollbar-width: none; animation: fadeSlide 0.7s 0.18s ease both; opacity: 0; animation-fill-mode: forwards; }
.qalb-chip-row::-webkit-scrollbar { display: none; }
.qalb-chip { flex-shrink: 0; padding: 7px 15px; border-radius: 999px; border: 1px solid #e2e9df; background: #ffffff; color: #586b61; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all 0.22s; white-space: nowrap; box-shadow: 0 1px 4px rgba(29, 49, 41, 0.02); }
.qalb-chip.active { background: #eef6f0; border-color: #167754; color: #167754; font-weight: 600; box-shadow: 0 2px 8px rgba(22, 119, 84, 0.08); }
.qalb-chip:not(.active):hover { color: #1d3129; background: #fbfcf9; border-color: #d0dbcc; }

/* Month section */
.qalb-month-section { padding: 0 20px; }
.qalb-month-label { display: flex; align-items: center; gap: 12px; margin: 24px 0 12px; }
.qalb-month-label span { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #167754; white-space: nowrap; }
.qalb-month-rule { flex: 1; height: 1px; background: linear-gradient(90deg, #d8e2d5, transparent); }

/* Mood card */
.qalb-mood-card {
  position: relative;
  display: flex; align-items: center; gap: 14px;
  background: #ffffff;
  border: 1px solid #e2e9df;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 9px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(29, 49, 41, 0.03);
  animation: cardIn 0.5s ease both;
  transition: all 0.2s;
}
.qalb-mood-card:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(29, 49, 41, 0.05); }
.qalb-mood-accent { position: absolute; left: 0; top: 18%; bottom: 18%; width: 3px; border-radius: 0 3px 3px 0; }
.qalb-mood-bubble { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qalb-mood-emoji { font-size: 21px; line-height: 1; }
.qalb-mood-body { flex: 1; min-width: 0; }
.qalb-mood-name { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; font-weight: 600; display: block; margin-bottom: 3px; }
.qalb-mood-time-row { display: flex; align-items: center; gap: 6px; }
.qalb-mood-date { font-size: 11.5px; color: #718276; }
.qalb-mood-time-badge { font-size: 10.5px; font-weight: 600; color: #167754; background: #eef6f0; border-radius: 6px; padding: 1px 7px; }

/* Loading */
.qalb-loading { display: flex; justify-content: center; gap: 8px; padding: 60px 0; }
.qalb-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: #167754; animation: pulse 1.2s ease-in-out infinite; }

/* Empty */
.qalb-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 32px; text-align: center; }
.qalb-empty-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 600; color: #1d3129; }
.qalb-empty-sub { font-size: 14px; color: #586b61; line-height: 1.65; max-width: 250px; font-style: italic; }
.qalb-empty-btn { margin-top: 8px; padding: 11px 26px; border-radius: 999px; background: linear-gradient(135deg, #167754, #0c533c); color: #ffffff; font-size: 13.5px; font-weight: 600; letter-spacing: 0.02em; text-decoration: none; box-shadow: 0 4px 16px rgba(22, 119, 84, 0.25); transition: all 0.22s; }
.qalb-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22, 119, 84, 0.35); }

/* Nav */
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
@keyframes cardIn    { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }

.qalb-history-grid { display: flex; flex-direction: column; gap: 9px; }
@media (min-width: 768px) {
  .qalb-app { max-width: 960px; }
  .qalb-history-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; align-items: start; }
  .qalb-mood-card { margin-bottom: 0; }
}
@media (min-width: 1024px) {
  .qalb-history-grid { grid-template-columns: repeat(3, 1fr); }
}
@keyframes shimmer   { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
`;
