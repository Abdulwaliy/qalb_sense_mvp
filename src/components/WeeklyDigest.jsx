import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLandingUrl } from "../utils/domain.js";
import { getCachedWeeklyDigest, generateWeeklyDigest } from "../services/weeklyDigestService.js";

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

export default function WeeklyDigest({ user }) {
  const location = useLocation();
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    getCachedWeeklyDigest(user.uid)
      .then((cached) => {
        if (cached) setDigest(cached);
      })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleGenerate = async () => {
    if (!user?.uid || generating) return;
    setGenerating(true);
    setError("");
    try {
      const fresh = await generateWeeklyDigest(user.uid);
      setDigest(fresh);
    } catch (err) {
      setError(err.message || "Could not prepare your weekly mirror right now.");
    } finally {
      setGenerating(false);
    }
  };

  const blogHref = (slug) => {
    const base = getLandingUrl().replace(/#.*$/, "").replace(/\/$/, "");
    return `${base}/blog/${slug}`;
  };

  const activeMoments =
    (digest?.stats?.moodCheckIns || 0) +
    (digest?.stats?.reflectionsCount || 0) +
    (digest?.stats?.blogsReadThisWeek || 0);
  const rhythmPct = Math.min(100, Math.round((activeMoments / 7) * 100));

  return (
    <>
      <style>{`
        .qalb-digest-root {
          min-height: 100vh;
          background: radial-gradient(circle at 20% 0%, rgba(22, 119, 84, 0.09), transparent 48%), #f5f7f0;
          color: #1d3129;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 112px;
        }
        .qalb-digest-wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 28px 20px 0;
        }
        .qalb-digest-kicker {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          background: #eef6f0;
          border: 1px solid #cde0cf;
          color: #167754;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .qalb-digest-head h1 {
          margin: 0 0 6px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 600;
          color: #112117;
        }
        .qalb-digest-head p {
          margin: 0 0 18px;
          font-size: 13.5px;
          line-height: 1.65;
          color: #4b6154;
          max-width: 600px;
        }
        .qalb-digest-hero {
          border-radius: 22px;
          border: 1px solid #cfe0cf;
          background: linear-gradient(180deg, #ffffff 0%, #f7fbf5 100%);
          padding: 22px 22px 24px;
          box-shadow: 0 10px 32px rgba(22, 119, 84, 0.06);
          animation: digestRise 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .qalb-digest-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .qalb-digest-btn {
          padding: 9px 18px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #167754, #0c533c);
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(22, 119, 84, 0.24);
          transition: transform 0.16s ease, box-shadow 0.16s ease;
        }
        .qalb-digest-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(22, 119, 84, 0.32);
        }
        .qalb-digest-btn:disabled {
          opacity: 0.65;
          cursor: default;
        }
        .qalb-rhythm-bar {
          margin-bottom: 16px;
          padding: 12px 14px;
          border-radius: 14px;
          background: #f5faf4;
          border: 1px solid #dce9dc;
        }
        .qalb-rhythm-track {
          height: 7px;
          border-radius: 999px;
          background: #e1ece0;
          overflow: hidden;
          margin-top: 8px;
        }
        .qalb-rhythm-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #167754, #4ca77d);
          transition: width 0.5s ease;
        }
        .qalb-digest-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }
        .qalb-digest-stat {
          padding: 12px 10px;
          border-radius: 14px;
          border: 1px solid #e1ebe0;
          background: #ffffff;
          text-align: center;
        }
        .qalb-digest-stat strong {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          color: #112117;
        }
        .qalb-digest-stat span {
          font-size: 11px;
          font-weight: 600;
          color: #53695c;
        }
        .qalb-digest-summary {
          position: relative;
          padding: 18px 20px;
          border-radius: 16px;
          background: #fcfdfa;
          border: 1px solid #dce8db;
          border-left: 4px solid #167754;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          line-height: 1.85;
          color: #1d3129;
          margin-bottom: 16px;
        }
        .qalb-digest-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        .qalb-digest-subcard {
          padding: 14px 15px;
          border-radius: 14px;
          border: 1px solid #e2ebe1;
          background: #ffffff;
        }
        .qalb-digest-subcard h3 {
          margin: 0 0 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #167754;
        }
        .qalb-digest-rec {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 16px;
          border: 1px solid #c9dec9;
          background: #eef6f0;
          text-decoration: none;
          transition: transform 0.16s ease, border-color 0.16s ease;
        }
        .qalb-digest-rec:hover {
          transform: translateY(-2px);
          border-color: #167754;
        }
        .qalb-digest-hadith {
          margin-top: 16px;
          text-align: center;
          font-size: 12px;
          font-style: italic;
          color: #53695c;
        }
        @media (max-width: 640px) {
          .qalb-digest-stats,
          .qalb-digest-cols {
            grid-template-columns: 1fr 1fr;
          }
          .qalb-digest-cols {
            grid-template-columns: 1fr;
          }
          .qalb-digest-rec {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @keyframes digestRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
          padding: 8px max(8px, calc((100% - 620px) / 2)) 14px;
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
          width: 36px;
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
          font-size: 8.8px;
          font-weight: 500;
          letter-spacing: 0.02em;
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

      <div className="qalb-digest-root">
        <div className="qalb-digest-wrap">
          <header className="qalb-digest-head">
            <span className="qalb-digest-kicker">Weekly Sanctuary Review</span>
            <h1>Your 7-Day Heart &amp; Learning Mirror</h1>
            <p>
              A quiet pause to notice how your Qalb shifted this week, revisit what you practiced, and continue your Tazkiyah reading.
            </p>
          </header>

          <section className="qalb-digest-hero">
            <div className="qalb-digest-top">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#167754", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {digest?.weekKey ? `Week ${digest.weekKey}` : "This Week"}
                </div>
                <div style={{ fontSize: 13, color: "#4d6155", marginTop: 2 }}>
                  {digest
                    ? "A quiet look back at your past 7 days of Muḥāsabah and learning."
                    : "Ready whenever you want to pause and review your week."}
                </div>
              </div>
              <button
                type="button"
                className="qalb-digest-btn"
                onClick={handleGenerate}
                disabled={generating || loading}
              >
                {generating ? "Preparing review…" : digest ? "Update Mirror" : "Open Weekly Mirror"}
              </button>
            </div>

            {error && (
              <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#9c2f2f", fontWeight: 600 }}>{error}</p>
            )}

            {loading ? (
              <p style={{ margin: 0, fontSize: 13, color: "#586b61" }}>Opening your weekly mirror…</p>
            ) : digest ? (
              <>
                <div className="qalb-rhythm-bar">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: "#1d3129" }}>
                    <span>Weekly Istiqāmah Rhythm</span>
                    <span style={{ color: "#167754" }}>{activeMoments} gentle touchpoints</span>
                  </div>
                  <div className="qalb-rhythm-track">
                    <div className="qalb-rhythm-fill" style={{ width: `${Math.max(12, rhythmPct)}%` }} />
                  </div>
                </div>

                <div className="qalb-digest-stats">
                  <div className="qalb-digest-stat">
                    <strong>{digest.stats?.moodCheckIns || 0}</strong>
                    <span>Mood Check-ins</span>
                  </div>
                  <div className="qalb-digest-stat">
                    <strong>{digest.stats?.reflectionsCount || 0}</strong>
                    <span>Reflections</span>
                  </div>
                  <div className="qalb-digest-stat">
                    <strong>{digest.stats?.sunnahsPracticed || 0}</strong>
                    <span>Sunnahs Practiced</span>
                  </div>
                  <div className="qalb-digest-stat">
                    <strong>{digest.stats?.blogsReadThisWeek || 0}</strong>
                    <span>Essays Read</span>
                  </div>
                </div>

                <div className="qalb-digest-summary">{digest.summary}</div>

                <div className="qalb-digest-cols">
                  <div className="qalb-digest-subcard">
                    <h3>What Your Heart Carried</h3>
                    {digest.topMoods?.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {digest.topMoods.map((m) => (
                          <span
                            key={m.mood}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: "#eef6f0",
                              border: "1px solid #cde0ce",
                              color: "#167754",
                              fontSize: 11.5,
                              fontWeight: 600,
                            }}
                          >
                            {m.mood} · {m.count}×
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: 12, color: "#586b61" }}>No moods logged yet this week.</p>
                    )}
                  </div>

                  <div className="qalb-digest-subcard">
                    <h3>Tazkiyah Essays Read</h3>
                    {digest.readThisWeek?.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#294134", lineHeight: 1.55 }}>
                        {digest.readThisWeek.map((b) => (
                          <li key={b.slug}>{b.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, fontSize: 12, color: "#586b61" }}>Start with the suggested reading below.</p>
                    )}
                  </div>
                </div>

                {digest.recommendedBlog?.slug && (
                  <a className="qalb-digest-rec" href={blogHref(digest.recommendedBlog.slug)}>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#167754" }}>
                        Suggested Reading · {digest.recommendedBlog.category}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16.5, fontWeight: 600, color: "#112117", marginTop: 4 }}>
                        {digest.recommendedBlog.title}
                      </div>
                      {digest.recommendedBlog.excerpt && (
                        <p style={{ margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.55, color: "#3d5346" }}>
                          {digest.recommendedBlog.excerpt}
                        </p>
                      )}
                    </div>
                    <span style={{
                      flexShrink: 0,
                      padding: "7px 14px",
                      borderRadius: 999,
                      background: "#167754",
                      color: "#ffffff",
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}>
                      Read Essay →
                    </span>
                  </a>
                )}

                <p className="qalb-digest-hadith">
                  “The most beloved deeds to Allah are those done consistently, even if small.” — Sahih al-Bukhari &amp; Muslim
                </p>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "#4e6457" }}>
                Tap <strong>Open Weekly Mirror</strong> above for a calm summary of your week’s heart states, Sunnah steps practiced, and a suggested essay from the Tazkiyah Blog.
              </p>
            )}
          </section>
        </div>

        {/* ── BOTTOM NAV ── */}
        <nav className="qalb-nav">
          {[
            { to: "/",                   label: "Home",        Icon: NavHome    },
            { to: "/mood-history",       label: "Mood",        Icon: NavMood    },
            { to: "/journal-history",    label: "Journal",     Icon: NavJournal },
            { to: "/reflection-history", label: "Reflect",     Icon: NavReflect },
            { to: "/weekly-digest",      label: "Digest",      Icon: NavDigest  },
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
