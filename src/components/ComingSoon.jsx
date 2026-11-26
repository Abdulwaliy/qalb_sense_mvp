import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────
   NAV ICONS (MATCHING APP SHELL)
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
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="3" y="7" width="10" height="7" rx="2" stroke="#5d7266" strokeWidth="1.35"/>
    <path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" stroke="#5d7266" strokeWidth="1.35" strokeLinecap="round"/>
  </svg>
);

const BigLockIcon = () => (
  <svg width="54" height="54" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="9" y="21" width="30" height="21" rx="6" fill="#eef6f0" stroke="#167754" strokeWidth="2.4"/>
    <path d="M16 21v-5.5a8 8 0 0 1 16 0V21" stroke="#167754" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="24" cy="31" r="2.6" fill="#167754"/>
    <path d="M24 33.5v3.5" stroke="#167754" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

const COMING_SOON_AREAS = [
  {
    id: "niyyah",
    category: "Intention",
    ar: "النِّيَّة",
    title: "Niyyah & Ikhlāṣ",
    sub: "Morning intention & Riyā’ audit",
    detail:
      "Start your day with a 30-second Niyyah reset before work or study, and reflect gently on keeping your deeds purely for Allah.",
  },
  {
    id: "khushu",
    category: "Worship",
    ar: "الْخُشُوع",
    title: "Khushū‘ in Ṣalāh",
    sub: "Post-prayer pulse & Tadabbur",
    detail:
      "Check in on your heart’s presence during prayer (Distracted, Trying, or Present) and record the Qur’anic Āyāt that moved you.",
  },
  {
    id: "amrad",
    category: "Purification",
    ar: "أَمْرَاضُ الْقُلُوب",
    title: "Amrāḍ al-Qulūb",
    sub: "Envy, pride & Ghaflah remedies",
    detail:
      "Private monthly self-diagnostics for subtle diseases of the heart—envy, pride, anger, and heedlessness—paired with classical remedies.",
  },
  {
    id: "istikhara",
    category: "Clarity",
    ar: "الْبَصِيرَة",
    title: "‘Aql & Istikhārah",
    sub: "Waswasah calm & decision log",
    detail:
      "Separate intrusive Waswasah from Tawakkul, and log major life decisions alongside your Istikhārah prayers and outcomes.",
  },
  {
    id: "courses",
    category: "Education",
    ar: "التَّزْكِيَة",
    title: "Tazkiyah Courses",
    sub: "5–7 day State-of-Heart tracks",
    detail:
      "Interactive micro-journeys matched to your logged heart state alongside structured classical Tazkiyah study from Ibn Taymiyyah & al-Ghazālī.",
  },
  {
    id: "pharmacy",
    category: "Community",
    ar: "الصُّحْبَة",
    title: "Heart Pharmacy & Ṣuḥbah",
    sub: "Answered Du‘ā’s & SOS Sakīnah",
    detail:
      "Bookmark Āyāt and Du‘ā’s by emotional need, track answered prayers over time, and invite trusted friends into private Ṣuḥbah circles.",
  },
];

export default function ComingSoon() {
  const location = useLocation();
  const [filter, setFilter] = useState("All");
  const [overlayLocked, setOverlayLocked] = useState(true);

  const categories = ["All", "Intention", "Worship", "Purification", "Clarity", "Education", "Community"];
  const visibleAreas = filter === "All"
    ? COMING_SOON_AREAS
    : COMING_SOON_AREAS.filter(a => a.category === filter);

  return (
    <>
      <style>{`
        .qalb-soon-root {
          min-height: 100vh;
          background: radial-gradient(circle at 18% 0%, rgba(22, 119, 84, 0.08), transparent 46%), #f5f7f0;
          color: #1d3129;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 112px;
        }
        .qalb-soon-wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 28px 20px 0;
        }
        .qalb-soon-head {
          margin-bottom: 20px;
        }
        .qalb-soon-head-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }
        .qalb-soon-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          background: #eef6f0;
          border: 1px solid #cde0cf;
          color: #167754;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .qalb-soon-peek-toggle {
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid #cbd8cd;
          background: #ffffff;
          color: #1d3129;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .qalb-soon-peek-toggle:hover {
          border-color: #167754;
          color: #167754;
        }
        .qalb-soon-head h1 {
          margin: 0 0 6px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 600;
          color: #112117;
        }
        .qalb-soon-head p {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.65;
          color: #4b6154;
          max-width: 640px;
        }
        .qalb-soon-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }
        .qalb-soon-chip {
          padding: 6px 13px;
          border-radius: 999px;
          border: 1px solid #d5e0d4;
          background: #ffffff;
          color: #465c50;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .qalb-soon-chip.active {
          background: #167754;
          border-color: #167754;
          color: #ffffff;
        }
        .qalb-soon-grid-wrap {
          position: relative;
          border-radius: 20px;
        }
        .qalb-soon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          transition: opacity 0.2s ease, filter 0.2s ease;
        }
        .qalb-soon-grid.is-locked {
          opacity: 0.62;
          filter: blur(1px);
          user-select: none;
        }
        .qalb-soon-big-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgba(245, 247, 240, 0.36);
          z-index: 20;
          padding: 20px;
        }
        .qalb-soon-big-lock-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          padding: 24px 28px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.94);
          border: 1.5px solid rgba(22, 119, 84, 0.28);
          box-shadow: 0 18px 46px rgba(17, 33, 23, 0.14);
          backdrop-filter: blur(10px);
          max-width: 310px;
        }
        .qalb-soon-big-lock-box strong {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          color: #112117;
        }
        .qalb-soon-big-lock-box span {
          font-size: 12px;
          color: #465d50;
          line-height: 1.5;
        }
        .qalb-soon-peek-btn {
          margin-top: 4px;
          padding: 7px 15px;
          border-radius: 999px;
          border: 1px solid #167754;
          background: #eef6f0;
          color: #167754;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .qalb-soon-peek-btn:hover {
          background: #167754;
          color: #ffffff;
        }
        .qalb-soon-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px 18px 16px;
          border-radius: 18px;
          border: 1px dashed #c6d6c7;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 16px rgba(29, 49, 41, 0.03);
        }
        .qalb-soon-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }
        .qalb-soon-ar {
          font-family: 'Amiri', 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #437059;
        }
        .qalb-soon-lock-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eef2ec;
          border: 1px solid #d5dfd4;
          color: #52675b;
        }
        .qalb-soon-card h2 {
          margin: 0 0 3px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: #1d3129;
        }
        .qalb-soon-sub {
          font-size: 11.5px;
          font-weight: 600;
          color: #7c6429;
          margin-bottom: 8px;
        }
        .qalb-soon-desc {
          margin: 0;
          font-size: 12.8px;
          line-height: 1.6;
          color: #4b5f53;
        }
        .qalb-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2px;
          padding: 8px max(10px, calc((100% - 560px) / 2)) 14px;
          background: rgba(245, 247, 240, 0.96);
          border-top: 1px solid #dce5da;
          box-shadow: 0 -4px 20px rgba(17, 33, 23, 0.04);
          backdrop-filter: blur(16px);
          z-index: 50;
        }
        .qalb-nav-item {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          padding: 4px 2px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .qalb-nav-icon-wrap {
          width: 38px;
          height: 34px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          transition: background 0.2s, border-color 0.2s;
        }
        .qalb-nav-item:hover .qalb-nav-icon-wrap {
          background: rgba(22, 119, 84, 0.06);
        }
        .qalb-nav-item.active .qalb-nav-icon-wrap {
          background: #e6f4ea;
          border-color: rgba(22, 119, 84, 0.16);
        }
        .qalb-nav-item:focus-visible {
          outline: 2px solid #167754;
          outline-offset: 2px;
        }
        .qalb-nav-label {
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: #65776c;
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .qalb-nav-item.active .qalb-nav-label {
          color: #167754;
          font-weight: 700;
        }
      `}</style>

      <div className="qalb-soon-root">
        <div className="qalb-soon-wrap">
          <header className="qalb-soon-head">
            <div className="qalb-soon-head-row">
              <span className="qalb-soon-kicker"><LockIcon /> Locked · Coming Soon</span>
              {!overlayLocked && (
                <button
                  type="button"
                  className="qalb-soon-peek-toggle"
                  onClick={() => setOverlayLocked(true)}
                >
                  Show Lock Overlay
                </button>
              )}
            </div>
            <h1>Expanding Your Sanctuary</h1>
            <p>
              The Qalb is more than emotions. Preview the upcoming spaces we are preparing for intention, worship presence, clarity, and classical <em>Tazkiyah</em>—unlocking after launch, bi’idhnillāh.
            </p>
          </header>

          <div className="qalb-soon-filters" role="tablist" aria-label="Filter upcoming features">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`qalb-soon-chip${filter === cat ? " active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="qalb-soon-grid-wrap">
            <div className={`qalb-soon-grid${overlayLocked ? " is-locked" : ""}`}>
              {visibleAreas.map(item => (
                <article key={item.id} className="qalb-soon-card" aria-disabled="true">
                  <div>
                    <div className="qalb-soon-card-top">
                      <span className="qalb-soon-ar" lang="ar" dir="rtl">{item.ar}</span>
                      <span className="qalb-soon-lock-pill">
                        <LockIcon /> Locked
                      </span>
                    </div>
                    <h2>{item.title}</h2>
                    <div className="qalb-soon-sub">{item.sub}</div>
                    <p className="qalb-soon-desc">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            {overlayLocked && (
              <div className="qalb-soon-big-overlay">
                <div className="qalb-soon-big-lock-box">
                  <BigLockIcon />
                  <strong>Locked Upon Launch</strong>
                  <span>These Qalb spaces are in preparation and will unlock after launch, bi’idhnillāh.</span>
                  <button
                    type="button"
                    className="qalb-soon-peek-btn"
                    onClick={() => setOverlayLocked(false)}
                  >
                    Peek Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <nav className="qalb-nav">
          {[
            { to: "/",                   label: "Home",        Icon: NavHome    },
            { to: "/mood-history",       label: "Mood",        Icon: NavMood    },
            { to: "/journal-history",    label: "Journal",     Icon: NavJournal },
            { to: "/reflection-history", label: "Reflect",     Icon: NavReflect },
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
