import { useEffect, useState } from "react";
import { getUserReflections } from "../services/reflectionService.js";
import { Link, useLocation } from "react-router-dom";

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
const NavHome    = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinejoin="round"/></svg>;
const NavMood    = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="5" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1"/><path d="M10 13v5M7 16h6" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinecap="round"/></svg>;
const NavJournal = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="2" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1"/><path d="M7 8h6M7 11h4" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinecap="round"/></svg>;
const NavReflect = ({ a }) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,2 12,7.5 18,7.5 13.5,11.5 15.5,17 10,13 4.5,17 6.5,11.5 2,7.5 8,7.5" stroke={a?"#c9a346":"#e8c97a"} strokeWidth="1" strokeLinejoin="round"/></svg>;

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
            fill="rgba(201,163,70,0.45)" stroke="rgba(201,163,70,0.6)" strokeWidth="0.4"
          />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   REFLECTION CARD
───────────────────────────────────────── */
function ReflectionCard({ item, index }) {
  const [journalOpen, setJournalOpen] = useState(false);
  const ms = resolveMs(item.createdAt || item.timestamp);
  const isLongReflection  = item.text?.length > 220;
  const journalSnippet    = item.journalContent || item.journal;
  const isLongJournal     = journalSnippet?.length > 160;
  const [reflOpen, setReflOpen] = useState(false);

  return (
    <article
      className="qalb-ref-card"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Shimmer top border */}
      <div className="qalb-card-shimmer" />

      {/* Meta row */}
      <div className="qalb-ref-meta">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="rgba(107,155,128,0.6)" strokeWidth="0.8"/>
            <path d="M5 3v2l1.2 1" stroke="rgba(107,155,128,0.6)" strokeWidth="0.8" strokeLinecap="round"/>
          </svg>
          <span className="qalb-ref-date">{formatDate(ms)}</span>
          {ms > 0 && <span className="qalb-ref-time">{formatTime(ms)}</span>}
        </div>
        {item.mood && (
          <span className="qalb-ref-mood-pill">{item.mood}</span>
        )}
      </div>

      {/* Reflection block */}
      <div className="qalb-ref-body">
        <div className="qalb-ref-label-row">
          <StarRow count={3} />
          <span className="qalb-ref-label">Reflection</span>
        </div>
        <p className="qalb-ref-text">
          {isLongReflection && !reflOpen
            ? item.text.slice(0, 220) + "…"
            : item.text}
        </p>
        {isLongReflection && (
          <button className="qalb-expand-btn" onClick={() => setReflOpen(o => !o)}>
            {reflOpen ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Journal source (collapsible) */}
      {journalSnippet && (
        <div className="qalb-ref-journal">
          <button className="qalb-journal-toggle" onClick={() => setJournalOpen(o => !o)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="1.5" width="8" height="9" rx="1" stroke="rgba(107,155,128,0.6)" strokeWidth="0.8"/>
              <path d="M4 4.5h4M4 6.5h3" stroke="rgba(107,155,128,0.6)" strokeWidth="0.8" strokeLinecap="round"/>
            </svg>
            <span>From journal</span>
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ transform: journalOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
            >
              <path d="M2 4l3 3 3-3" stroke="rgba(107,155,128,0.5)" strokeWidth="0.9" strokeLinecap="round"/>
            </svg>
          </button>
          {journalOpen && (
            <p className="qalb-journal-text">
              {isLongJournal ? journalSnippet.slice(0, 160) + "…" : journalSnippet}
            </p>
          )}
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

  /* Group by month */
  const grouped = reflections.reduce((acc, r) => {
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

          {/* ── HEADER ── */}
          <header className="qalb-rh-header">
            <div className="qalb-rule-row">
              <div className="qalb-rule" />
              {/* Crescent + stars emblem */}
              <svg width="44" height="32" viewBox="0 0 44 32" className="qalb-emblem">
                <path d="M16 2C9.4 2 4 7.4 4 14s5.4 12 12 12c-3.6 0-6-3-6-6.5C10 14 13.5 10 16 8.5c-3.5-1-6.5-.5-9 1.5C8.5 4.5 12 2 16 2z" fill="#c9a346" opacity="0.85"/>
                <circle cx="22" cy="5"  r="1.6" fill="#c9a346" opacity="0.6"/>
                <circle cx="27" cy="11" r="1.1" fill="#c9a346" opacity="0.45"/>
                <polygon points="34,4 35.2,7.8 39,7.8 36,10 37.2,13.8 34,11.5 30.8,13.8 32,10 29,7.8 32.8,7.8" fill="#c9a346" opacity="0.55" transform="scale(0.65) translate(20,0)"/>
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
              <div className="qalb-rh-ayah-strip">
                <div className="qalb-rule" style={{ flex: "none", width: 28 }} />
                <span className="qalb-rh-arabic">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</span>
                <div className="qalb-rule" style={{ flex: "none", width: 28 }} />
              </div>
            )}
            {!loading && reflections.length > 0 && (
              <p className="qalb-rh-trans">"Verily, in the remembrance of Allah do hearts find rest." — Ar-Ra'd 13:28</p>
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
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <polygon points="32,4 36,16 48,16 38,24 42,36 32,29 22,36 26,24 16,16 28,16" stroke="rgba(201,163,70,0.35)" strokeWidth="1" fill="none"/>
                <polygon points="32,14 34.5,21 42,21 36,25.5 38.5,32.5 32,28.5 25.5,32.5 28,25.5 22,21 29.5,21" stroke="rgba(201,163,70,0.18)" strokeWidth="0.8" fill="none"/>
              </svg>
              <p className="qalb-empty-title">No reflections yet</p>
              <p className="qalb-empty-sub">
                Write a journal entry and press Reflect — your inner wisdom will appear here.
              </p>
              <Link to="/" className="qalb-empty-btn">Begin reflecting</Link>
            </div>
          )}

          {/* ── REFLECTION LIST ── */}
          {!loading && Object.entries(grouped).map(([month, entries]) => (
            <section key={month} className="qalb-month-section">
              <div className="qalb-month-label">
                <div className="qalb-month-rule" />
                <span>{month}</span>
                <div className="qalb-month-rule" />
              </div>
              {entries.map((r, i) => (
                <ReflectionCard key={r.id} item={r} index={i} />
              ))}
            </section>
          ))}

          <div style={{ height: 24 }} />
        </div>

        {/* ── BOTTOM NAV ── */}
        <nav className="qalb-nav">
          {[
            { to: "/",                   label: "Home",    Icon: NavHome    },
            { to: "/mood-history",       label: "Mood",    Icon: NavMood    },
            { to: "/journal-history",    label: "Journal", Icon: NavJournal },
            { to: "/reflection-history", label: "Reflect", Icon: NavReflect },
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
.qalb-rh-header { text-align: center; padding: 48px 24px 28px; animation: fadeSlide 0.7s ease both; }
.qalb-rule-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.qalb-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, transparent, rgba(180,140,60,0.3), transparent); }
.qalb-emblem { animation: shimmer 3.5s ease-in-out infinite; }
.qalb-rh-eyebrow { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #c9a346; margin-bottom: 6px; }
.qalb-rh-title { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300; color: #f0e6cc; margin-bottom: 6px; }
.qalb-rh-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-style: italic; color: rgba(107,155,128,0.8); margin-bottom: 20px; }

/* Ayah strip in header */
.qalb-rh-ayah-strip { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
.qalb-rh-arabic { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: rgba(201,163,70,0.65); direction: rtl; white-space: nowrap; letter-spacing: 0.03em; }
.qalb-rh-trans { font-family: 'Cormorant Garamond', serif; font-size: 11.5px; font-style: italic; color: rgba(107,155,128,0.5); letter-spacing: 0.03em; line-height: 1.5; padding: 0 24px; }

/* Month section */
.qalb-month-section { padding: 0 20px; }
.qalb-month-label { display: flex; align-items: center; gap: 12px; margin: 28px 0 14px; }
.qalb-month-label span { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a346; white-space: nowrap; }
.qalb-month-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, rgba(180,140,60,0.25), transparent); }

/* Reflection card */
.qalb-ref-card {
  position: relative;
  background: rgba(255,255,255,0.035);
  border: 0.5px solid rgba(180,140,60,0.2);
  border-radius: 20px;
  padding: 20px 20px 18px;
  margin-bottom: 14px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  animation: cardIn 0.55s ease both;
  transition: border-color 0.2s;
}
.qalb-ref-card:hover { border-color: rgba(180,140,60,0.38); }

/* Shimmer top */
.qalb-card-shimmer { position: absolute; top: 0; left: 15%; right: 15%; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,163,70,0.55), transparent); }

/* Meta */
.qalb-ref-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.qalb-ref-date { font-family: 'Cormorant Garamond', serif; font-size: 12.5px; color: rgba(240,230,204,0.45); letter-spacing: 0.04em; }
.qalb-ref-time { font-size: 10.5px; color: rgba(107,155,128,0.6); background: rgba(107,155,128,0.1); border-radius: 6px; padding: 1px 7px; font-family: 'Lora', serif; }
.qalb-ref-mood-pill { font-size: 12px; padding: 2px 10px; border-radius: 20px; border: 0.5px solid rgba(180,140,60,0.22); background: rgba(201,163,70,0.1); color: #e8c97a; font-family: 'Lora', serif; }

/* Reflection body */
.qalb-ref-body { margin-bottom: 14px; }
.qalb-ref-label-row { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; }
.qalb-ref-label { font-family: 'Cormorant Garamond', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a346; }
.qalb-ref-text {
  font-family: 'Lora', serif;
  font-size: 14.5px;
  font-style: italic;
  line-height: 1.82;
  color: rgba(240,230,204,0.8);
  padding: 14px 16px;
  background: rgba(0,0,0,0.18);
  border-left: 2px solid rgba(201,163,70,0.45);
  border-radius: 0 12px 12px 0;
  position: relative;
}
.qalb-ref-text::before {
  content: '201C';
  position: absolute;
  top: 6px; left: 10px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  color: rgba(201,163,70,0.3);
  line-height: 1;
}
.qalb-expand-btn { margin-top: 8px; background: none; border: none; color: #c9a346; font-family: 'Cormorant Garamond', serif; font-size: 13px; letter-spacing: 0.08em; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 3px; }

/* Journal source */
.qalb-ref-journal { border-top: 0.5px solid rgba(180,140,60,0.15); padding-top: 12px; }
.qalb-journal-toggle { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; padding: 0; }
.qalb-journal-toggle span { font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(107,155,128,0.65); }
.qalb-journal-toggle:hover span { color: rgba(107,155,128,0.9); }
.qalb-journal-text { margin-top: 10px; font-size: 13.5px; line-height: 1.72; color: rgba(240,230,204,0.48); font-family: 'Lora', serif; padding-left: 12px; border-left: 1px solid rgba(107,155,128,0.2); animation: fadeSlide 0.3s ease both; }

/* Loading */
.qalb-loading { display: flex; justify-content: center; gap: 8px; padding: 70px 0; }
.qalb-loading-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(201,163,70,0.5); animation: pulse 1.2s ease-in-out infinite; }

/* Empty */
.qalb-empty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 64px 32px; text-align: center; }
.qalb-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; color: rgba(240,230,204,0.7); }
.qalb-empty-sub { font-size: 13.5px; color: rgba(107,155,128,0.65); line-height: 1.7; max-width: 250px; font-style: italic; }
.qalb-empty-btn { margin-top: 6px; padding: 11px 28px; border-radius: 12px; border: 0.5px solid rgba(180,140,60,0.35); background: rgba(201,163,70,0.12); color: #e8c97a; font-family: 'Cormorant Garamond', serif; font-size: 15px; letter-spacing: 0.06em; text-decoration: none; transition: all 0.22s; }
.qalb-empty-btn:hover { background: rgba(201,163,70,0.22); }

/* Nav */
.qalb-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px; background: rgba(10,26,19,0.92); border-top: 0.5px solid rgba(180,140,60,0.22); backdrop-filter: blur(16px); z-index: 50; }
.qalb-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 16px; text-decoration: none; transition: all 0.2s; }
.qalb-nav-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.qalb-nav-item.active .qalb-nav-icon-wrap { background: rgba(201,163,70,0.18); }
.qalb-nav-label { font-size: 10px; letter-spacing: 0.08em; color: #6b9b80; text-transform: uppercase; font-family: 'Lora', serif; }
.qalb-nav-item.active .qalb-nav-label { color: #c9a346; }

@keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cardIn    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer   { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
`;
