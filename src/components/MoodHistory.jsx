import { useEffect, useState } from "react";
import { getUserMoods } from "../services/moodService.js";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService.js";
import { getLandingUrl } from "../utils/domain.js";

/* ─────────────────────────────────────────
   MOOD CONFIG
───────────────────────────────────────── */
const MOOD_META = {
  Happy:   { emoji: "😄", color: "#b8871b", bg: "#fdf8ec", border: "#f3e1b7", label: "Happy"   },
  Sad:     { emoji: "😢", color: "#326eb8", bg: "#eff5fc", border: "#c8ddf4", label: "Sad"     },
  Angry:   { emoji: "😡", color: "#c0392b", bg: "#fdf2f0", border: "#f5c6cb", label: "Angry"   },
  Anxious: { emoji: "😰", color: "#774eb0", bg: "#f6f1fc", border: "#dacaf0", label: "Anxious" },
  Calm:    { emoji: "😌", color: "#167754", bg: "#eef6f0", border: "#c0decb", label: "Calm"    },
  Tired:   { emoji: "😴", color: "#617378", bg: "#f2f5f6", border: "#d4dee0", label: "Tired"   },
};
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
    <path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z" stroke={a ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const NavMood = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="8" r="5" stroke={a ? "#167754" : "#718276"} strokeWidth="1.4" />
    <path d="M10 13v5M7 16h6" stroke={a ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const NavJournal = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4" y="3" width="12" height="14" rx="2" stroke={a ? "#167754" : "#718276"} strokeWidth="1.4" />
    <path d="M7 8h6M7 11h4" stroke={a ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const NavReflect = ({ a }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <polygon points="10,2 12,7.5 18,7.5 13.5,11.5 15.5,17 10,13 4.5,17 6.5,11.5 2,7.5 8,7.5" stroke={a ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinejoin="round" />
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
function MoodCard({ entry, index }) {
  const meta = MOOD_META[entry.mood] || { emoji: entry.note || "🙂", color: "#167754", bg: "#eef6f0", border: "#c0decb", label: entry.mood };
  const { date, time } = fmt(entry.timestamp?.seconds);

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
        <span className="qalb-mood-name" style={{ color: meta.color }}>{meta.label}</span>
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

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserMoods(user.uid);
        setMoods(data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const visible = filter === "All" ? moods : moods.filter(m => m.mood === filter);

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
          </header>

          {/* ── DONUT CHART ── */}
          {!loading && moods.length > 0 && (
            <div className="qalb-chart-card">
              <div className="qalb-card-top-rule" />
              <p className="qalb-chart-title">Overview</p>
              <MoodDonut moods={moods} />
            </div>
          )}

          {/* ── FILTER CHIPS ── */}
          {!loading && moods.length > 0 && (
            <div className="qalb-chip-row">
              <button
                className={`qalb-chip${filter === "All" ? " active" : ""}`}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              {presentMoods.map(m => (
                <button
                  key={m}
                  className={`qalb-chip${filter === m ? " active" : ""}`}
                  style={filter === m ? { borderColor: MOOD_META[m].border, color: MOOD_META[m].color, background: MOOD_META[m].bg } : {}}
                  onClick={() => setFilter(m)}
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
              {entries.map((e, i) => <MoodCard key={e.id} entry={e} index={i} />)}
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
.qalb-legend-name { font-size: 12px; color: #1d3129; font-weight: 500; min-width: 52px; }
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
  display: flex; justify-content: space-around; align-items: center;
  padding: 10px 0 18px;
  background: rgba(245,247,240,0.95);
  border-top: 1px solid #e2e9df;
  backdrop-filter: blur(16px);
  z-index: 50;
}
.qalb-nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  cursor: pointer; padding: 4px 16px; text-decoration: none; transition: all 0.2s;
}
.qalb-nav-icon-wrap {
  width: 36px; height: 36px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.qalb-nav-item.active .qalb-nav-icon-wrap { background: #eef6f0; }
.qalb-nav-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.04em;
  color: #718276; font-family: 'DM Sans', sans-serif; text-transform: uppercase;
}
.qalb-nav-item.active .qalb-nav-label { color: #167754; font-weight: 700; }

@keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cardIn    { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer   { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
`;
