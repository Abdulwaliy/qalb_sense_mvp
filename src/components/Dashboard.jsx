import { useState, useEffect, useRef } from "react";
import { logMood } from "../services/moodService.js";
import { addJournal } from "../services/journalService.js";
import { saveReflection } from "../services/reflectionService.js";
import { generateReflection } from "../services/aiService.js";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService.js";
import { getLandingUrl } from "../utils/domain.js";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const MOOD_OPTIONS = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
];

const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 13.5S2 9.8 2 5.5A3.5 3.5 0 018 3.1 3.5 3.5 0 0114 5.5C14 9.8 8 13.5 8 13.5z"
      stroke="#167754" strokeWidth="1.2" />
  </svg>
);
const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 2h6l3 3v9H4V2z" stroke="#167754" strokeWidth="1.2" />
    <path d="M10 2v3h3M6 7h5M6 9.5h3" stroke="#167754" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IconAyah = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="#167754" strokeWidth="1.2" />
    <path d="M5 6h6M5 8.5h4" stroke="#167754" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 9.5,5.5 14,5.5 10.5,8.5 12,13 8,10 4,13 5.5,8.5 2,5.5 6.5,5.5"
      stroke="#a48a49" strokeWidth="1.1" strokeLinejoin="round" fill="rgba(164,138,73,0.15)" />
  </svg>
);
const NavHome = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z"
      stroke={active ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const NavMood = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="8" r="5" stroke={active ? "#167754" : "#718276"} strokeWidth="1.4" />
    <path d="M10 13v5M7 16h6" stroke={active ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const NavJournal = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4" y="3" width="12" height="14" rx="2" stroke={active ? "#167754" : "#718276"} strokeWidth="1.4" />
    <path d="M7 8h6M7 11h4" stroke={active ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const NavReflect = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <polygon points="10,2 12,7.5 18,7.5 13.5,11.5 15.5,17 10,13 4.5,17 6.5,11.5 2,7.5 8,7.5"
      stroke={active ? "#167754" : "#718276"} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function SectionCard({ children, style }) {
  return (
    <div style={{
      margin: "18px 20px 0",
      border: "1px solid #e2e9df",
      borderRadius: 20,
      background: "#ffffff",
      boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, badge }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 13px" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "#eef6f0",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1d3129", letterSpacing: "-0.01em" }}>
          {title}{badge && <span style={{ marginLeft: 6, fontSize: 17 }}>{badge}</span>}
        </span>
      </div>
      <div style={{ height: "1px", background: "#edf1ea", margin: "0 20px" }} />
    </>
  );
}

function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 95, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 10}px)`,
      opacity: visible ? 1 : 0,
      background: "#1d3129",
      border: "1px solid #2d483c",
      borderRadius: 999,
      padding: "10px 22px",
      fontSize: 13,
      fontWeight: 500,
      color: "#f5f7f0",
      letterSpacing: "0.02em",
      boxShadow: "0 8px 24px rgba(29, 49, 41, 0.18)",
      transition: "all 0.35s ease",
      zIndex: 99,
      pointerEvents: "none",
      whiteSpace: "nowrap",
    }}>
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
export default function Dashboard({ user }) {
  const location = useLocation();

  const [selectedMood, setSelectedMood]       = useState(null);
  const [journalContent, setJournalContent]   = useState("");
  const [reflection, setReflection]           = useState("");
  const [isReflecting, setIsReflecting]       = useState(false);
  const [toast, setToast]                     = useState({ message: "", visible: false });
  const toastTimer                            = useRef(null);
  const reflectionRef                         = useRef(null);

  const now       = new Date();
  const dateLabel = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;

  /* ── Helpers ── */
  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ── Mood ── */
  const handleMoodSelect = async (mood) => {
    try {
      await logMood(user.uid, mood.label, mood.emoji);
      setSelectedMood(mood.label);
      showToast(`Mood logged: ${mood.label}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to log mood");
    }
  };

  /* ── Journal ── */
  const handleSaveJournal = async () => {
    if (!journalContent.trim()) return;
    try {
      await addJournal(user.uid, journalContent);
      showToast("Journal entry saved ✓");
    } catch (err) {
      console.error(err);
      showToast("Failed to save journal");
    }
  };

  /* ── Reflection ── */
  const handleReflection = async () => {
    if (!journalContent.trim() || isReflecting) return;
    setIsReflecting(true);
    try {
      const result = await generateReflection({
        mood: selectedMood || "neutral",
        journal: journalContent,
        userId: user.uid,
      });
      const text = result.reflection;
      await saveReflection(user.uid, {
        text,
        journalContent,
        mood: selectedMood || "neutral",
      });
      setReflection(text);
      showToast("Reflection generated & saved ✓");
      setTimeout(() => reflectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
    } catch (err) {
      console.error(err);
      showToast("Failed to generate reflection");
    } finally {
      setIsReflecting(false);
    }
  };

  const activeMood = MOOD_OPTIONS.find(m => m.label === selectedMood);

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <>
      {/* ── Theme Fonts & Global App Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

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
        .qalb-header { text-align: center; padding: 36px 24px 28px; animation: fadeSlide 0.7s ease both; }
        .qalb-greeting { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #167754; margin-bottom: 8px; }
        .qalb-title { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 600; color: #1d3129; line-height: 1.15; margin-bottom: 6px; letter-spacing: -0.02em; }
        .qalb-subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-style: italic; color: #586b61; font-weight: 400; }
        .qalb-date-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 16px; padding: 6px 14px; border: 1px solid #d8e2d5; border-radius: 999px; font-size: 11.5px; font-weight: 500; color: #586b61; background: #ffffff; box-shadow: 0 2px 8px rgba(29, 49, 41, 0.03); }
        .qalb-rule { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d8e2d5, transparent); }
        .qalb-crescent-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px; }
        .qalb-crescent { opacity: 0.9; }

        /* Mood */
        .qalb-mood-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 14px 20px 20px; }
        .qalb-mood-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 8px; border-radius: 14px; border: 1px solid #e2e9df; background: #fbfcf9; cursor: pointer; transition: all 0.22s; color: #586b61; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; }
        .qalb-mood-btn:hover { background: #f0f7ef; border-color: #bfdeca; transform: translateY(-2px); }
        .qalb-mood-btn.selected { background: #eef6f0; border-color: #167754; color: #167754; font-weight: 600; box-shadow: 0 4px 12px rgba(22, 119, 84, 0.1); }
        .qalb-mood-emoji { font-size: 22px; line-height: 1; }

        /* Ayah */
        .qalb-ayah-card { background: #fbfcf8; border: 1px solid #e7ede2; border-radius: 16px; padding: 18px 20px; margin: 0 20px 20px; position: relative; overflow: hidden; box-shadow: 0 2px 10px rgba(29, 49, 41, 0.02); }
        .qalb-ayah-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #a48a49, transparent); }
        .qalb-arabic { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; text-align: right; color: #1d3129; line-height: 1.8; margin-bottom: 8px; direction: rtl; }
        .qalb-translation { font-family: 'Playfair Display', serif; font-size: 13.5px; font-style: italic; color: #55685d; line-height: 1.6; margin-bottom: 8px; }
        .qalb-ayah-source { font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; color: #a48a49; text-transform: uppercase; }

        /* Journal */
        .qalb-textarea { width: 100%; background: #fbfcf9; border: 1px solid #d8e2d5; border-radius: 14px; color: #1d3129; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7; padding: 14px 16px; resize: none; outline: none; transition: all 0.2s; }
        .qalb-textarea::placeholder { color: #8c9d91; font-style: italic; }
        .qalb-textarea:focus { border-color: #167754; background: #ffffff; box-shadow: 0 0 0 3px rgba(22, 119, 84, 0.1); }
        .qalb-btn-row { display: flex; gap: 10px; margin-top: 12px; }
        .qalb-btn-save { padding: 11px 22px; border-radius: 999px; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.22s; background: #ffffff; border: 1px solid #d5e0d5; color: #167754; flex: 1; }
        .qalb-btn-save:hover { background: #f5f7f0; color: #0c533c; border-color: #bfdeca; }
        .qalb-btn-reflect { padding: 11px 22px; border-radius: 999px; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600; letter-spacing: 0.02em; cursor: pointer; transition: all 0.22s; background: linear-gradient(135deg, #167754, #0c533c); color: #ffffff; flex: 2; border: none; box-shadow: 0 4px 16px rgba(22, 119, 84, 0.25); }
        .qalb-btn-reflect:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22, 119, 84, 0.35); }
        .qalb-btn-reflect:active:not(:disabled) { transform: translateY(0); }
        .qalb-btn-reflect:disabled { opacity: 0.6; cursor: default; }

        /* Reflection */
        .qalb-reflection-box { background: #fcfdfa; border: 1px solid #d8e6db; border-left: 4px solid #167754; border-radius: 0 16px 16px 0; padding: 18px 20px; margin: 0 20px 20px; position: relative; box-shadow: 0 4px 20px rgba(22, 119, 84, 0.05); }
        .qalb-reflection-text { font-family: 'Playfair Display', Georgia, serif; font-size: 14.5px; line-height: 1.8; color: #1d3129; white-space: pre-line; }
        .qalb-reflection-star { position: absolute; top: 12px; right: 14px; color: #a48a49; font-size: 14px; opacity: 0.8; }

        /* Bottom Nav */
        .qalb-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; align-items: center; padding: 10px 0 18px; background: rgba(245,247,240,0.95); border-top: 1px solid #e2e9df; backdrop-filter: blur(16px); z-index: 50; }
        .qalb-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; text-decoration: none; transition: all 0.2s; }
        .qalb-nav-icon-wrap { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .qalb-nav-item.active .qalb-nav-icon-wrap { background: #eef6f0; }
        .qalb-nav-label { font-size: 10px; font-weight: 500; letter-spacing: 0.04em; color: #718276; font-family: 'DM Sans', sans-serif; text-transform: uppercase; }
        .qalb-nav-item.active .qalb-nav-label { color: #167754; font-weight: 700; }

        /* Animations */
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .qalb-section-1 { animation: fadeSlide 0.7s 0.18s ease both; opacity: 0; animation-fill-mode: forwards; }
        .qalb-section-2 { animation: fadeSlide 0.7s 0.28s ease both; opacity: 0; animation-fill-mode: forwards; }
        .qalb-section-3 { animation: fadeSlide 0.7s 0.38s ease both; opacity: 0; animation-fill-mode: forwards; }
      `}</style>

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
          <header className="qalb-header">
            <p className="qalb-greeting">Bismillah</p>
            <div className="qalb-crescent-row">
              <div className="qalb-rule" />
              <svg className="qalb-crescent" width="34" height="34" viewBox="0 0 36 36">
                <path d="M18 4.5 21.3 13l8.2-3.1-3.1 8.2 8.5 3.3-8.5 3.3 3.1 8.2-8.2-3.1L18 36l-3.3-8.2-8.2 3.1 3.1-8.2L1 19.4l8.5-3.3-3.1-8.2 8.2 3.1L18 4.5Z" fill="#167754" />
                <circle cx="18" cy="19.4" r="5.1" fill="#f5f7f0" />
              </svg>
              <div className="qalb-rule" />
            </div>
            <h1 className="qalb-title">Assalamu<br />Alaykum</h1>
            <p className="qalb-subtitle">How is your qalb today?</p>
            <div className="qalb-date-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#167754" strokeWidth="1" />
                <path d="M6 3v3l2 1.5" stroke="#167754" strokeWidth="1" strokeLinecap="round" />
              </svg>
              {dateLabel}
            </div>
          </header>

          {/* ── MOOD ── */}
          <div className="qalb-section-1" style={{ margin: "18px 20px 0", border: "1px solid #e2e9df", borderRadius: 20, background: "#ffffff", boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)", overflow: "hidden" }}>
            <SectionHeader icon={<IconHeart />} title="Your mood" />
            <div className="qalb-mood-grid">
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.label}
                  className={`qalb-mood-btn${selectedMood === m.label ? " selected" : ""}`}
                  onClick={() => handleMoodSelect(m)}
                >
                  <span className="qalb-mood-emoji">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── AYAH OF THE DAY ── */}
          <div className="qalb-section-2" style={{ margin: "18px 20px 0", border: "1px solid #e2e9df", borderRadius: 20, background: "#ffffff", boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)", overflow: "hidden" }}>
            <SectionHeader icon={<IconAyah />} title="Ayah of the day" />
            <div className="qalb-ayah-card" style={{ margin: "14px 20px 20px" }}>
              <p className="qalb-arabic">إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
              <p className="qalb-translation">"Verily, with every hardship comes ease."</p>
              <span className="qalb-ayah-source">Al-Inshirah 94:6</span>
            </div>
          </div>

          {/* ── JOURNAL ── */}
          <SectionCard style={{ marginTop: 18 }} className="qalb-section-3">
            <SectionHeader
              icon={<IconBook />}
              title="Journal"
              badge={activeMood ? activeMood.emoji : "✎"}
            />
            <div style={{ padding: "14px 20px 20px" }}>
              <textarea
                className="qalb-textarea"
                rows={5}
                placeholder="Write what is on your heart…"
                value={journalContent}
                onChange={e => setJournalContent(e.target.value)}
              />
              <div className="qalb-btn-row">
                <button className="qalb-btn-save" onClick={handleSaveJournal}>
                  Save
                </button>
                {journalContent.trim() && (
                  <button
                    className="qalb-btn-reflect"
                    onClick={handleReflection}
                    disabled={isReflecting}
                  >
                    {isReflecting ? "Reflecting…" : "✦ Reflect"}
                  </button>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── REFLECTION ── */}
          {reflection && (
            <div ref={reflectionRef} style={{ margin: "16px 20px 0", border: "1px solid #e2e9df", borderRadius: 20, background: "#ffffff", boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)", overflow: "hidden", animation: "fadeSlide 0.6s ease both" }}>
              <SectionHeader icon={<IconStar />} title="Your reflection" />
              <div className="qalb-reflection-box">
                <span className="qalb-reflection-star">✦</span>
                <p className="qalb-reflection-text">{reflection}</p>
              </div>
            </div>
          )}

          {/* ── BOTTOM NAV ── */}
          <nav className="qalb-nav">
            <Link to="/" className={`qalb-nav-item${location.pathname === "/" ? " active" : ""}`}>
              <div className="qalb-nav-icon-wrap"><NavHome active={location.pathname === "/"} /></div>
              <span className="qalb-nav-label">Home</span>
            </Link>
            <Link to="/mood-history" className={`qalb-nav-item${location.pathname === "/mood-history" ? " active" : ""}`}>
              <div className="qalb-nav-icon-wrap"><NavMood active={location.pathname === "/mood-history"} /></div>
              <span className="qalb-nav-label">Mood</span>
            </Link>
            <Link to="/journal-history" className={`qalb-nav-item${location.pathname === "/journal-history" ? " active" : ""}`}>
              <div className="qalb-nav-icon-wrap"><NavJournal active={location.pathname === "/journal-history"} /></div>
              <span className="qalb-nav-label">Journal</span>
            </Link>
            <Link to="/reflection-history" className={`qalb-nav-item${location.pathname === "/reflection-history" ? " active" : ""}`}>
              <div className="qalb-nav-icon-wrap"><NavReflect active={location.pathname === "/reflection-history"} /></div>
              <span className="qalb-nav-label">Reflect</span>
            </Link>
          </nav>

        </div>

        {/* ── TOAST ── */}
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </>
  );
}
