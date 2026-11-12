import { useEffect, useState } from "react";
import { getUserMoods } from "../services/moodService.js";
import { Link, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────
   MOOD CONFIG
───────────────────────────────────────── */
const MOOD_META = {
  Happy:   { emoji: "😄", color: "#d4a84b", bg: "rgba(212,168,75,0.12)",  border: "rgba(212,168,75,0.35)",  label: "Happy"   },
  Sad:     { emoji: "😢", color: "#5b8dd9", bg: "rgba(91,141,217,0.1)",   border: "rgba(91,141,217,0.3)",   label: "Sad"     },
  Angry:   { emoji: "😡", color: "#c0392b", bg: "rgba(192,57,43,0.1)",    border: "rgba(192,57,43,0.3)",    label: "Angry"   },
  Anxious: { emoji: "😰", color: "#8e6bbf", bg: "rgba(142,107,191,0.1)",  border: "rgba(142,107,191,0.3)",  label: "Anxious" },
  Calm:    { emoji: "😌", color: "#3a9e78", bg: "rgba(58,158,120,0.1)",   border: "rgba(58,158,120,0.3)",   label: "Calm"    },
  Tired:   { emoji: "😴", color: "#7a8a8e", bg: "rgba(122,138,142,0.1)",  border: "rgba(122,138,142,0.3)",  label: "Tired"   },
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
const NavHome    = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinejoin="round"/></svg>;
const NavMood    = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="5" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1"/><path d="M10 13v5M7 16h6" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinecap="round"/></svg>;
const NavJournal = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="2" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1"/><path d="M7 8h6M7 11h4" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinecap="round"/></svg>;
const NavReflect = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,2 12,7.5 18,7.5 13.5,11.5 15.5,17 10,13 4.5,17 6.5,11.5 2,7.5 8,7.5" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinejoin="round"/></svg>;

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
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
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
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="rgba(240,230,204,0.5)" fontFamily="Lora,serif" letterSpacing="0.08em">{meta.label}</text>
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
  const meta = MOOD_META[entry.mood] || { emoji: entry.note || "🙂", color: "#c9a346", bg: "rgba(201,163,70,0.1)", border: "rgba(201,163,70,0.25)", label: entry.mood };
  const { date, time } = fmt(entry.timestamp?.seconds);

  return (
    <div
      className="qalb-mood-card"
      style={{
        borderColor: meta.border,
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {/* Left accent bar */}
      <div className="qalb-mood-accent" style={{ background: meta.color }} />

      {/* Emoji bubble */}
      <div className="qalb-mood-bubble" style={{ background: meta.bg, border: `0.5px solid ${meta.border}` }}>
        <span className="qalb-mood-emoji">{meta.emoji}</span>
      </div>

      {/* Content */}
      <div className="qalb-mood-body">
        <span className="qalb-mood-name" style={{ color: meta.color }}>{meta.label}</span>
        <div className="qalb-mood-time-row">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="rgba(107,155,128,0.6)" strokeWidth="0.8"/>
            <path d="M5 3v2l1.2 1" stroke="rgba(107,155,128,0.6)" strokeWidth="0.8" strokeLinecap="round"/>
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
  const [filter, setFilter]   = useState("All"); // "All" | mood label

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

          {/* ── HEADER ── */}
          <header className="qalb-mh-header">
            <div className="qalb-rule-row">
              <div className="qalb-rule" />
              <svg width="28" height="28" viewBox="0 0 28 28" className="qalb-crescent">
                <path d="M14 3C8.5 3 4 7.5 4 13s4.5 10 10 10c-3 0-5-2.5-5-5.5 0-4.5 3-7.5 5-8.5C11.5 8 9 9 7 11 8.5 5.5 11 3 14 3z" fill="#c9a346" opacity="0.85"/>
                <circle cx="19" cy="6" r="1.5" fill="#c9a346" opacity="0.7"/>
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
              <span style={{ fontSize: 48 }}>{filter !== "All" ? MOOD_META[filter]?.emoji : "🌙"}</span>
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.qalb-root { background: #0a1a13; min-height: 100vh; color: #f0e6cc; font-family: 'Lora', serif; overflow-x: hidden; }

.qalb-bg-pattern {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23c9a346' stroke-width='0.8'%3E%3Cpolygon points='40,4 47,18 62,18 51,27 55,42 40,33 25,42 29,27 18,18 33,18'/%3E%3Crect x='10' y='10' width='60' height='60' transform='rotate(45 40 40)'/%3E%3Ccircle cx='40' cy='40' r='25'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 80px 80px;
}
.qalb-glow { position: fixed; top: -200px; left: 50%; transform: translateX(-50%); width: 700px; height: 400px; background: radial-gradient(ellipse, rgba(20,80,45,0.5) 0%, transparent 70%); pointer-events: none; }

.qalb-app { max-width: 480px; margin: 0 auto; padding: 0 0 110px; position: relative; z-index: 1; }

/* Header */
.qalb-mh-header { text-align: center; padding: 48px 24px 24px; animation: fadeSlide 0.7s ease both; }
.qalb-rule-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.qalb-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, transparent, rgba(180,140,60,0.3), transparent); }
.qalb-crescent { animation: shimmer 3s ease-in-out infinite; }
.qalb-mh-eyebrow { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #c9a346; margin-bottom: 6px; }
.qalb-mh-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #f0e6cc; margin-bottom: 6px; }
.qalb-mh-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-style: italic; color: rgba(107,155,128,0.8); }

/* Chart card */
.qalb-chart-card {
  position: relative; overflow: hidden;
  margin: 8px 20px 0;
  background: rgba(255,255,255,0.035);
  border: 0.5px solid rgba(180,140,60,0.2);
  border-radius: 20px;
  padding: 20px 20px 18px;
  backdrop-filter: blur(8px);
  animation: fadeSlide 0.7s 0.1s ease both; opacity: 0; animation-fill-mode: forwards;
}
.qalb-card-top-rule { position: absolute; top: 0; left: 20%; right: 20%; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,163,70,0.5), transparent); }
.qalb-chart-title { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a346; margin-bottom: 16px; }

/* Donut */
.qalb-donut-wrap { display: flex; align-items: center; gap: 20px; }
.qalb-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.qalb-legend-row { display: flex; align-items: center; gap: 7px; }
.qalb-legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.qalb-legend-name { font-size: 12px; color: rgba(240,230,204,0.65); font-family: 'Lora', serif; min-width: 52px; }
.qalb-legend-count { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: rgba(240,230,204,0.5); min-width: 18px; text-align: right; }
.qalb-legend-bar-track { flex: 1; height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
.qalb-legend-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; opacity: 0.75; }

/* Filter chips */
.qalb-chip-row { display: flex; overflow-x: auto; gap: 7px; padding: 16px 20px 4px; scrollbar-width: none; animation: fadeSlide 0.7s 0.18s ease both; opacity: 0; animation-fill-mode: forwards; }
.qalb-chip-row::-webkit-scrollbar { display: none; }
.qalb-chip { flex-shrink: 0; padding: 7px 14px; border-radius: 20px; border: 0.5px solid rgba(180,140,60,0.2); background: rgba(255,255,255,0.03); color: rgba(240,230,204,0.45); font-family: 'Lora', serif; font-size: 12.5px; letter-spacing: 0.03em; cursor: pointer; transition: all 0.22s; white-space: nowrap; }
.qalb-chip.active { background: rgba(201,163,70,0.16); border-color: rgba(180,140,60,0.38); color: #e8c97a; }
.qalb-chip:not(.active):hover { color: rgba(240,230,204,0.7); background: rgba(255,255,255,0.05); }

/* Month section */
.qalb-month-section { padding: 0 20px; }
.qalb-month-label { display: flex; align-items: center; gap: 12px; margin: 24px 0 12px; }
.qalb-month-label span { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a346; white-space: nowrap; }
.qalb-month-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, rgba(180,140,60,0.25), transparent); }

/* Mood card */
.qalb-mood-card {
  position: relative;
  display: flex; align-items: center; gap: 14px;
  background: rgba(255,255,255,0.03);
  border: 0.5px solid rgba(180,140,60,0.15);
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 9px;
  overflow: hidden;
  animation: cardIn 0.5s ease both;
  transition: background 0.2s;
}
.qalb-mood-card:hover { background: rgba(255,255,255,0.05); }
.qalb-mood-accent { position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; border-radius: 0 3px 3px 0; opacity: 0.75; }
.qalb-mood-bubble { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qalb-mood-emoji { font-size: 20px; line-height: 1; }
.qalb-mood-body { flex: 1; min-width: 0; }
.qalb-mood-name { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 500; display: block; margin-bottom: 4px; letter-spacing: 0.02em; }
.qalb-mood-time-row { display: flex; align-items: center; gap: 5px; }
.qalb-mood-date { font-size: 11.5px; color: rgba(240,230,204,0.4); font-family: 'Lora', serif; }
.qalb-mood-time-badge { font-size: 10.5px; color: rgba(107,155,128,0.65); background: rgba(107,155,128,0.1); border-radius: 6px; padding: 1px 6px; font-family: 'Lora', serif; }

/* Loading */
.qalb-loading { display: flex; justify-content: center; gap: 8px; padding: 60px 0; }
.qalb-loading-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(201,163,70,0.5); animation: pulse 1.2s ease-in-out infinite; }

/* Empty */
.qalb-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 32px; text-align: center; }
.qalb-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: rgba(240,230,204,0.7); }
.qalb-empty-sub { font-size: 13.5px; color: rgba(107,155,128,0.65); line-height: 1.65; max-width: 240px; font-style: italic; }
.qalb-empty-btn { margin-top: 8px; padding: 11px 28px; border-radius: 12px; border: 0.5px solid rgba(180,140,60,0.35); background: rgba(201,163,70,0.12); color: #e8c97a; font-family: 'Cormorant Garamond', serif; font-size: 15px; letter-spacing: 0.06em; text-decoration: none; transition: all 0.22s; }
.qalb-empty-btn:hover { background: rgba(201,163,70,0.22); }

/* Nav */
.qalb-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px; background: rgba(10,26,19,0.92); border-top: 0.5px solid rgba(180,140,60,0.22); backdrop-filter: blur(16px); z-index: 50; }
.qalb-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 16px; text-decoration: none; transition: all 0.2s; }
.qalb-nav-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.qalb-nav-item.active .qalb-nav-icon-wrap { background: rgba(201,163,70,0.18); }
.qalb-nav-label { font-size: 10px; letter-spacing: 0.08em; color: #6b9b80; text-transform: uppercase; font-family: 'Lora', serif; }
.qalb-nav-item.active .qalb-nav-label { color: #c9a346; }

@keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cardIn    { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer   { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
`;
