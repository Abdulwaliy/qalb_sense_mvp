import { useEffect, useState } from "react";
import { getUserJournals } from "../services/journalService.js";
import { Link, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 2h6l3 3v9H4V2z" stroke="#c9a346" strokeWidth="0.9" />
    <path d="M10 2v3h3M6 7h5M6 9.5h3" stroke="#c9a346" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <polygon points="6.5,1 8,4.5 12,4.5 9,7 10.2,11 6.5,8.5 2.8,11 4,7 1,4.5 5,4.5"
      stroke="#c9a346" strokeWidth="0.85" strokeLinejoin="round" fill="rgba(201,163,70,0.15)" />
  </svg>
);
const IconClock = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <circle cx="5.5" cy="5.5" r="4.5" stroke="#6b9b80" strokeWidth="0.8" />
    <path d="M5.5 3v2.5l1.5 1" stroke="#6b9b80" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);
const IconEmpty = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="12" y="8" width="32" height="40" rx="4" stroke="rgba(201,163,70,0.35)" strokeWidth="1" />
    <path d="M20 20h16M20 26h12M20 32h8" stroke="rgba(201,163,70,0.3)" strokeWidth="1" strokeLinecap="round" />
    <circle cx="42" cy="42" r="10" fill="#0a1a13" stroke="rgba(180,140,60,0.3)" strokeWidth="0.8" />
    <path d="M42 38v4M42 44v1" stroke="rgba(201,163,70,0.6)" strokeWidth="1.2" strokeLinecap="round" />
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
const NavHome    = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinejoin="round"/></svg>;
const NavMood    = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="5" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1"/><path d="M10 13v5M7 16h6" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinecap="round"/></svg>;
const NavJournal = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="2" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1"/><path d="M7 8h6M7 11h4" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinecap="round"/></svg>;
const NavReflect = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,2 12,7.5 18,7.5 13.5,11.5 15.5,17 10,13 4.5,17 6.5,11.5 2,7.5 8,7.5" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinejoin="round"/></svg>;

/* ─────────────────────────────────────────
   JOURNAL CARD
───────────────────────────────────────── */
function JournalCard({ journal, index }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = journal.content?.length > 180;
  const preview = isLong && !expanded
    ? journal.content.slice(0, 180) + "…"
    : journal.content;

  return (
    <article
      className="qalb-journal-card"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Gold top rule */}
      <div className="qalb-card-top-rule" />

      {/* Date row */}
      <div className="qalb-card-meta">
        <div className="qalb-card-date-row">
          <IconClock />
          <span className="qalb-card-date">{formatDate(journal.timestamp?.seconds)}</span>
          <span className="qalb-card-time">{formatTime(journal.timestamp?.seconds)}</span>
        </div>
        {journal.mood && (
          <span className="qalb-card-mood-badge">{journal.mood}</span>
        )}
      </div>

      {/* Journal content */}
      <p className="qalb-card-content">{preview}</p>
      {isLong && (
        <button className="qalb-card-expand" onClick={() => setExpanded(e => !e)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Reflection */}
      {journal.reflection && (
        <div className="qalb-card-reflection">
          <div className="qalb-reflection-label">
            <IconStar />
            <span>Reflection</span>
          </div>
          <p className="qalb-reflection-body">{journal.reflection}</p>
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
  const [filter, setFilter]     = useState("all"); // "all" | "with-reflection"

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserJournals(user.uid);
        setJournals(data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const visible = filter === "with-reflection"
    ? journals.filter(j => j.reflection)
    : journals;

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

          {/* ── HEADER ── */}
          <header className="qalb-jh-header">
            <div className="qalb-auth-rule-row" style={{ marginBottom: 18 }}>
              <div className="qalb-rule" />
              <svg width="28" height="28" viewBox="0 0 28 28" className="qalb-crescent">
                <path d="M14 3C8.5 3 4 7.5 4 13s4.5 10 10 10c-3 0-5-2.5-5-5.5 0-4.5 3-7.5 5-8.5C11.5 8 9 9 7 11 8.5 5.5 11 3 14 3z" fill="#c9a346" opacity="0.85"/>
                <circle cx="19" cy="6" r="1.5" fill="#c9a346" opacity="0.7"/>
              </svg>
              <div className="qalb-rule" />
            </div>
            <p className="qalb-jh-eyebrow">Your words</p>
            <h1 className="qalb-jh-title">Journal History</h1>
            <p className="qalb-jh-subtitle">
              {loading ? "Loading…" : `${journals.length} entr${journals.length === 1 ? "y" : "ies"} written`}
            </p>
          </header>

          {/* ── FILTER TABS ── */}
          {!loading && journals.length > 0 && (
            <div className="qalb-filter-row">
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
              {entries.map((j, i) => (
                <JournalCard key={j.id} journal={j} index={i} />
              ))}
            </section>
          ))}

          {/* ── BOTTOM SPACER ── */}
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
.qalb-glow {
  position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 400px;
  background: radial-gradient(ellipse, rgba(20,80,45,0.5) 0%, transparent 70%);
  pointer-events: none;
}

.qalb-app { max-width: 480px; margin: 0 auto; padding: 0 0 110px; position: relative; z-index: 1; }

/* Header */
.qalb-jh-header { text-align: center; padding: 48px 24px 28px; animation: fadeSlide 0.7s ease both; }
.qalb-jh-eyebrow { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #c9a346; margin-bottom: 6px; }
.qalb-jh-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #f0e6cc; margin-bottom: 6px; }
.qalb-jh-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-style: italic; color: rgba(107,155,128,0.8); }
.qalb-auth-rule-row { display: flex; align-items: center; gap: 12px; }
.qalb-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, transparent, rgba(180,140,60,0.3), transparent); }
.qalb-crescent { animation: shimmer 3s ease-in-out infinite; }

/* Filter */
.qalb-filter-row { display: flex; gap: 8px; padding: 0 20px 4px; animation: fadeSlide 0.7s 0.1s ease both; opacity: 0; animation-fill-mode: forwards; }
.qalb-filter-btn { flex: 1; padding: 9px 0; border-radius: 12px; border: 0.5px solid rgba(180,140,60,0.2); background: rgba(255,255,255,0.03); color: rgba(240,230,204,0.45); font-family: 'Cormorant Garamond', serif; font-size: 14px; letter-spacing: 0.04em; cursor: pointer; transition: all 0.22s; }
.qalb-filter-btn.active { background: rgba(201,163,70,0.16); border-color: rgba(180,140,60,0.38); color: #e8c97a; }
.qalb-filter-btn:not(.active):hover { color: rgba(240,230,204,0.7); background: rgba(255,255,255,0.05); }

/* Month group */
.qalb-month-group { padding: 0 20px; }
.qalb-month-label { display: flex; align-items: center; gap: 12px; margin: 28px 0 14px; }
.qalb-month-label span { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a346; white-space: nowrap; }
.qalb-month-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, rgba(180,140,60,0.25), transparent); }

/* Journal card */
.qalb-journal-card {
  position: relative;
  background: rgba(255,255,255,0.035);
  border: 0.5px solid rgba(180,140,60,0.2);
  border-radius: 18px;
  padding: 18px 20px 20px;
  margin-bottom: 12px;
  backdrop-filter: blur(8px);
  overflow: hidden;
  animation: cardIn 0.55s ease both;
}
.qalb-card-top-rule {
  position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,163,70,0.5), transparent);
}

/* Card meta */
.qalb-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.qalb-card-date-row { display: flex; align-items: center; gap: 6px; }
.qalb-card-date { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: rgba(240,230,204,0.55); letter-spacing: 0.04em; }
.qalb-card-time { font-size: 11px; color: rgba(107,155,128,0.6); letter-spacing: 0.06em; }
.qalb-card-mood-badge { font-size: 13px; padding: 2px 10px; border-radius: 20px; border: 0.5px solid rgba(180,140,60,0.22); background: rgba(201,163,70,0.1); color: #e8c97a; font-family: 'Lora', serif; }

/* Content */
.qalb-card-content { font-size: 14.5px; line-height: 1.78; color: rgba(240,230,204,0.82); font-family: 'Lora', serif; }
.qalb-card-expand { margin-top: 8px; background: none; border: none; color: #c9a346; font-family: 'Cormorant Garamond', serif; font-size: 13px; letter-spacing: 0.08em; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 3px; }

/* Reflection */
.qalb-card-reflection { margin-top: 16px; padding-top: 14px; border-top: 0.5px solid rgba(180,140,60,0.18); }
.qalb-reflection-label { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
.qalb-reflection-label span { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #c9a346; }
.qalb-reflection-body { font-size: 13.5px; line-height: 1.75; color: rgba(240,230,204,0.58); font-style: italic; border-left: 2px solid rgba(201,163,70,0.4); padding-left: 12px; }

/* Loading dots */
.qalb-loading { display: flex; justify-content: center; gap: 8px; padding: 60px 0; }
.qalb-loading-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(201,163,70,0.5); animation: pulse 1.2s ease-in-out infinite; }

/* Empty state */
.qalb-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px 32px; text-align: center; }
.qalb-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: rgba(240,230,204,0.7); }
.qalb-empty-sub { font-size: 13.5px; color: rgba(107,155,128,0.65); line-height: 1.65; max-width: 240px; font-style: italic; }
.qalb-empty-btn { margin-top: 8px; padding: 11px 28px; border-radius: 12px; border: 0.5px solid rgba(180,140,60,0.35); background: rgba(201,163,70,0.12); color: #e8c97a; font-family: 'Cormorant Garamond', serif; font-size: 15px; letter-spacing: 0.06em; text-decoration: none; transition: all 0.22s; }
.qalb-empty-btn:hover { background: rgba(201,163,70,0.22); }

/* Bottom nav */
.qalb-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px; background: rgba(10,26,19,0.92); border-top: 0.5px solid rgba(180,140,60,0.22); backdrop-filter: blur(16px); z-index: 50; }
.qalb-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 16px; text-decoration: none; transition: all 0.2s; }
.qalb-nav-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.qalb-nav-item.active .qalb-nav-icon-wrap { background: rgba(201,163,70,0.18); }
.qalb-nav-label { font-size: 10px; letter-spacing: 0.08em; color: #6b9b80; text-transform: uppercase; font-family: 'Lora', serif; }
.qalb-nav-item.active .qalb-nav-label { color: #c9a346; }

/* Animations */
@keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cardIn    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer   { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
`;
