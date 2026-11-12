import { useState, useEffect, useRef } from "react";
import { logMood } from "../services/moodService.js";
import { addJournal } from "../services/journalService.js";
import { saveReflection } from "../services/reflectionService.js";
import { generateReflection } from "../services/aiService.js";
import { Link, useLocation } from "react-router-dom";

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

const PRAYER_TIMES = [
  { name: "Fajr",    time: "5:14" },
  { name: "Dhuhr",   time: "12:58" },
  { name: "Asr",     time: "16:32" },
  { name: "Maghrib", time: "18:47" },
  { name: "Isha",    time: "20:15" },
];
const NEXT_PRAYER = "Asr"; // swap with live prayer-time logic as needed

const DAYS    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 13.5S2 9.8 2 5.5A3.5 3.5 0 018 3.1 3.5 3.5 0 0114 5.5C14 9.8 8 13.5 8 13.5z"
      stroke="#c9a346" strokeWidth="0.9" />
  </svg>
);
const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 2h6l3 3v9H4V2z" stroke="#c9a346" strokeWidth="0.9" />
    <path d="M10 2v3h3M6 7h5M6 9.5h3" stroke="#c9a346" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);
const IconAyah = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="#c9a346" strokeWidth="0.9" />
    <path d="M5 6h6M5 8.5h4" stroke="#c9a346" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polygon points="8,1 9.5,5.5 14,5.5 10.5,8.5 12,13 8,10 4,13 5.5,8.5 2,5.5 6.5,5.5"
      stroke="#c9a346" strokeWidth="0.9" strokeLinejoin="round" />
  </svg>
);
const NavHome = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 8v10h5v-5h4v5h5V8L10 2z"
      stroke={active ? "#c9a346" : "#e8c97a"} strokeWidth="1" strokeLinejoin="round" />
  </svg>
);
const NavMood = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="8" r="5" stroke={active ? "#c9a346" : "#e8c97a"} strokeWidth="1" />
    <path d="M10 13v5M7 16h6" stroke={active ? "#c9a346" : "#e8c97a"} strokeWidth="1" strokeLinecap="round" />
  </svg>
);
const NavJournal = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4" y="3" width="12" height="14" rx="2" stroke={active ? "#c9a346" : "#e8c97a"} strokeWidth="1" />
    <path d="M7 8h6M7 11h4" stroke={active ? "#c9a346" : "#e8c97a"} strokeWidth="1" strokeLinecap="round" />
  </svg>
);
const NavReflect = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <polygon points="10,2 12,7.5 18,7.5 13.5,11.5 15.5,17 10,13 4.5,17 6.5,11.5 2,7.5 8,7.5"
      stroke={active ? "#c9a346" : "#e8c97a"} strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function SectionCard({ children, style }) {
  return (
    <div style={{
      margin: "20px 20px 0",
      border: "0.5px solid rgba(180,140,60,0.22)",
      borderRadius: 20,
      background: "rgba(255,255,255,0.04)",
      overflow: "hidden",
      backdropFilter: "blur(8px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, badge }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 14px" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(201,163,70,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 500, color: "#f0e6cc", letterSpacing: "0.02em" }}>
          {title}{badge && <span style={{ marginLeft: 6, fontSize: 18 }}>{badge}</span>}
        </span>
      </div>
      <div style={{ height: "0.5px", background: "rgba(180,140,60,0.22)", margin: "0 20px" }} />
    </>
  );
}

function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 110, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 10}px)`,
      opacity: visible ? 1 : 0,
      background: "rgba(15,34,25,0.95)",
      border: "0.5px solid #c9a346",
      borderRadius: 12,
      padding: "10px 22px",
      fontSize: 13,
      color: "#e8c97a",
      letterSpacing: "0.06em",
      backdropFilter: "blur(12px)",
      transition: "all 0.4s",
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
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .qalb-root { background: #0a1a13; min-height: 100vh; color: #f0e6cc; font-family: 'Lora', serif; overflow-x: hidden; }

        .qalb-bg-pattern {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23c9a346' stroke-width='0.8'%3E%3Cpolygon points='40,4 47,18 62,18 51,27 55,42 40,33 25,42 29,27 18,18 33,18'/%3E%3Crect x='10' y='10' width='60' height='60' transform='rotate(45 40 40)'/%3E%3Ccircle cx='40' cy='40' r='25'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 80px 80px;
        }
        .qalb-glow { position: fixed; top: -200px; left: 50%; transform: translateX(-50%); width: 700px; height: 400px; background: radial-gradient(ellipse, rgba(20,80,45,0.55) 0%, transparent 70%); pointer-events: none; }

        .qalb-app { max-width: 480px; margin: 0 auto; padding: 0 0 100px; position: relative; z-index: 1; }

        /* Header */
        .qalb-header { text-align: center; padding: 52px 24px 36px; animation: fadeSlide 0.7s ease both; }
        .qalb-greeting { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; color: #c9a346; margin-bottom: 8px; }
        .qalb-title { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300; color: #f0e6cc; line-height: 1.15; margin-bottom: 6px; }
        .qalb-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; color: rgba(240,230,204,0.65); font-weight: 300; }
        .qalb-date-badge { display: inline-flex; align-items: center; gap: 8px; margin-top: 18px; padding: 6px 16px; border: 0.5px solid rgba(180,140,60,0.22); border-radius: 20px; font-size: 12px; letter-spacing: 0.1em; color: #6b9b80; background: rgba(255,255,255,0.04); }
        .qalb-rule { flex: 1; height: 0.5px; background: linear-gradient(90deg, transparent, rgba(180,140,60,0.22), transparent); }
        .qalb-crescent-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 20px; }
        .qalb-crescent { animation: shimmer 3s ease-in-out infinite; opacity: 0.85; }

        /* Prayer strip */
        .qalb-prayer-strip { display: flex; overflow-x: auto; gap: 8px; padding: 0 20px; scrollbar-width: none; margin-bottom: 8px; animation: fadeSlide 0.7s 0.12s ease both; opacity: 0; animation-fill-mode: forwards; }
        .qalb-prayer-strip::-webkit-scrollbar { display: none; }
        .qalb-prayer-pill { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 14px; border-radius: 12px; border: 0.5px solid rgba(180,140,60,0.22); background: rgba(255,255,255,0.04); }
        .qalb-prayer-pill.next { background: rgba(201,163,70,0.18); border-color: #c9a346; }
        .qalb-prayer-name { font-size: 11px; letter-spacing: 0.08em; color: #6b9b80; font-family: 'Lora', serif; }
        .qalb-prayer-time { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #f0e6cc; }
        .qalb-prayer-pill.next .qalb-prayer-name, .qalb-prayer-pill.next .qalb-prayer-time { color: #e8c97a; }
        .qalb-next-label { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #c9a346; }

        /* Mood */
        .qalb-mood-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 14px 20px 20px; }
        .qalb-mood-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 8px; border-radius: 14px; border: 0.5px solid transparent; background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.22s; color: rgba(240,230,204,0.65); font-family: 'Lora', serif; font-size: 12px; letter-spacing: 0.04em; }
        .qalb-mood-btn:hover { background: rgba(201,163,70,0.1); border-color: rgba(201,163,70,0.3); transform: translateY(-2px); }
        .qalb-mood-btn.selected { background: rgba(201,163,70,0.18); border-color: #c9a346; color: #e8c97a; }
        .qalb-mood-emoji { font-size: 22px; line-height: 1; }

        /* Ayah */
        .qalb-ayah-card { background: rgba(0,0,0,0.2); border: 0.5px solid rgba(180,140,60,0.22); border-radius: 14px; padding: 18px 20px; margin: 0 20px 20px; position: relative; overflow: hidden; }
        .qalb-ayah-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #c9a346, transparent); }
        .qalb-arabic { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; text-align: right; color: #f0e6cc; line-height: 1.8; margin-bottom: 12px; direction: rtl; }
        .qalb-translation { font-size: 13px; font-style: italic; color: rgba(240,230,204,0.65); line-height: 1.7; margin-bottom: 8px; }
        .qalb-ayah-source { font-size: 11px; letter-spacing: 0.1em; color: #c9a346; text-transform: uppercase; }

        /* Journal */
        .qalb-textarea { width: 100%; background: rgba(0,0,0,0.25); border: 0.5px solid rgba(180,140,60,0.22); border-radius: 14px; color: #f0e6cc; font-family: 'Lora', serif; font-size: 14.5px; line-height: 1.75; padding: 14px 16px; resize: none; outline: none; transition: border-color 0.2s; }
        .qalb-textarea::placeholder { color: rgba(107,155,128,0.55); font-style: italic; }
        .qalb-textarea:focus { border-color: rgba(201,163,70,0.45); }
        .qalb-btn-row { display: flex; gap: 10px; margin-top: 12px; }
        .qalb-btn-save { padding: 10px 22px; border-radius: 10px; font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 500; letter-spacing: 0.05em; cursor: pointer; transition: all 0.22s; background: rgba(255,255,255,0.05); border: 0.5px solid rgba(180,140,60,0.22); color: #6b9b80; flex: 1; }
        .qalb-btn-save:hover { background: rgba(255,255,255,0.09); color: #f0e6cc; }
        .qalb-btn-reflect { padding: 10px 22px; border-radius: 10px; font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 600; letter-spacing: 0.08em; cursor: pointer; transition: all 0.22s; background: linear-gradient(135deg, #b8892e, #d4a84b); color: #1a0e00; flex: 2; border: none; box-shadow: 0 4px 20px rgba(201,163,70,0.25); }
        .qalb-btn-reflect:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(201,163,70,0.38); }
        .qalb-btn-reflect:active:not(:disabled) { transform: translateY(0); }
        .qalb-btn-reflect:disabled { opacity: 0.6; cursor: default; }

        /* Reflection */
        .qalb-reflection-box { background: rgba(0,0,0,0.2); border-left: 2px solid #c9a346; border-radius: 0 14px 14px 0; padding: 16px 18px; margin: 0 20px 20px; position: relative; }
        .qalb-reflection-text { font-size: 14px; line-height: 1.8; color: rgba(240,230,204,0.65); font-style: italic; }
        .qalb-reflection-star { position: absolute; top: 12px; right: 14px; color: #c9a346; font-size: 14px; opacity: 0.7; }

        /* Bottom Nav */
        .qalb-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; align-items: center; padding: 12px 0 20px; background: rgba(10,26,19,0.92); border-top: 0.5px solid rgba(180,140,60,0.22); backdrop-filter: blur(16px); z-index: 50; }
        .qalb-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 16px; text-decoration: none; transition: all 0.2s; }
        .qalb-nav-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .qalb-nav-item.active .qalb-nav-icon-wrap { background: rgba(201,163,70,0.18); }
        .qalb-nav-label { font-size: 10px; letter-spacing: 0.08em; color: #6b9b80; text-transform: uppercase; font-family: 'Lora', serif; }
        .qalb-nav-item.active .qalb-nav-label { color: #c9a346; }

        /* Animations */
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity: 0.75; } 50% { opacity: 1; } }
        .qalb-section-1 { animation: fadeSlide 0.7s 0.22s ease both; opacity: 0; animation-fill-mode: forwards; }
        .qalb-section-2 { animation: fadeSlide 0.7s 0.32s ease both; opacity: 0; animation-fill-mode: forwards; }
        .qalb-section-3 { animation: fadeSlide 0.7s 0.42s ease both; opacity: 0; animation-fill-mode: forwards; }
        .qalb-section-4 { animation: fadeSlide 0.7s 0.52s ease both; opacity: 0; animation-fill-mode: forwards; }
      `}</style>

      <div className="qalb-root">
        <div className="qalb-bg-pattern" />
        <div className="qalb-glow" />

        <div className="qalb-app">

          {/* ── HEADER ── */}
          <header className="qalb-header">
            <p className="qalb-greeting">Bismillah</p>
            <div className="qalb-crescent-row">
              <div className="qalb-rule" />
              <svg className="qalb-crescent" width="36" height="36" viewBox="0 0 36 36">
                <path d="M18 4 C10.3 4 4 10.3 4 18 C4 25.7 10.3 32 18 32 C14.2 32 11 28.8 11 24 C11 18 15 13.5 18 12 C15 11 11.5 12 9 14 C10.8 8.5 16 4 18 4 Z" fill="#c9a346" opacity="0.85" />
                <circle cx="23" cy="9" r="1.8" fill="#c9a346" opacity="0.7" />
              </svg>
              <div className="qalb-rule" />
            </div>
            <h1 className="qalb-title">Assalamu<br />Alaykum</h1>
            <p className="qalb-subtitle">How is your qalb today?</p>
            <div className="qalb-date-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#6b9b80" strokeWidth="0.8" />
                <path d="M6 3v3l2 1.5" stroke="#6b9b80" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              {dateLabel}
            </div>
          </header>

          {/* ── PRAYER TIMES ── */}
          <div className="qalb-prayer-strip">
            {PRAYER_TIMES.map(p => (
              <div key={p.name} className={`qalb-prayer-pill${p.name === NEXT_PRAYER ? " next" : ""}`}>
                <span className="qalb-prayer-name">{p.name}</span>
                <span className="qalb-prayer-time">{p.time}</span>
                {p.name === NEXT_PRAYER && <span className="qalb-next-label">Next</span>}
              </div>
            ))}
          </div>

          {/* ── MOOD ── */}
          <div className="qalb-section-1" style={{ margin: "20px 20px 0", border: "0.5px solid rgba(180,140,60,0.22)", borderRadius: 20, background: "rgba(255,255,255,0.04)", overflow: "hidden", backdropFilter: "blur(8px)" }}>
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
          <div className="qalb-section-2" style={{ margin: "20px 20px 0", border: "0.5px solid rgba(180,140,60,0.22)", borderRadius: 20, background: "rgba(255,255,255,0.04)", overflow: "hidden", backdropFilter: "blur(8px)" }}>
            <SectionHeader icon={<IconAyah />} title="Ayah of the day" />
            <div className="qalb-ayah-card" style={{ margin: "14px 20px 20px" }}>
              <p className="qalb-arabic">إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
              <p className="qalb-translation">"Verily, with every hardship comes ease."</p>
              <span className="qalb-ayah-source">Al-Inshirah 94:6</span>
            </div>
          </div>

          {/* ── JOURNAL ── */}
          <SectionCard style={{ marginTop: 20 }} className="qalb-section-3">
            <SectionHeader
              icon={<IconBook />}
              title="Journal"
              badge={activeMood ? activeMood.emoji : "🧠"}
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
            <div ref={reflectionRef} style={{ margin: "16px 20px 0", border: "0.5px solid rgba(180,140,60,0.22)", borderRadius: 20, background: "rgba(255,255,255,0.04)", overflow: "hidden", backdropFilter: "blur(8px)", animation: "fadeSlide 0.6s ease both" }}>
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
