import { useState, useEffect, useRef } from "react";
import { logMood } from "../services/moodService.js";
import { addJournal } from "../services/journalService.js";
import { saveReflection, toggleReflectionFlag } from "../services/reflectionService.js";
import { generateReflection, fetchMoodAyah } from "../services/aiService.js";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService.js";
import { getLandingUrl } from "../utils/domain.js";
import StructuredReflection from "./StructuredReflection.jsx";
import AyahActions from "./AyahActions.jsx";
import { MOOD_OPTIONS, CORE_MOOD_STATES, INTENSITY_OPTIONS, JOURNAL_PROMPTS } from "../constants/moods.js";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
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
    <path d="M3 9.2 10 3.2l7 6v7.1a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 16.3V9.2Z"
      fill={active ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinejoin="round" />
    <path d="M8 17.8v-4.2a2 2 0 0 1 4 0v4.2"
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinecap="round" />
  </svg>
);
const NavMood = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 16.6s-5.8-3.5-6.8-7.3a3.7 3.7 0 0 1 6.8-3 3.7 3.7 0 0 1 6.8 3c-1 3.8-6.8 7.3-6.8 7.3Z"
      fill={active ? "rgba(22, 119, 84, 0.16)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinejoin="round" />
  </svg>
);
const NavJournal = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3.2 4.8A1.8 1.8 0 0 1 5 3h3.6c.8 0 1.4.6 1.4 1.4v12.2c-.5-.5-1.2-.8-2-.8H5a1.8 1.8 0 0 1-1.8-1.8V4.8Z"
      fill={active ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M16.8 4.8A1.8 1.8 0 0 0 15 3h-3.6c-.8 0-1.4.6-1.4 1.4v12.2c.5-.5 1.2-.8 2-.8H15a1.8 1.8 0 0 0 1.8-1.8V4.8Z"
      fill={active ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const NavReflect = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5 11.7 8.3 17.5 10l-5.8 1.7L10 17.5l-1.7-5.8L2.5 10l5.8-1.7L10 2.5Z"
      fill={active ? "rgba(22, 119, 84, 0.16)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="15.4" cy="4.6" r="1" fill={active ? "#167754" : "#6b7d72"} />
  </svg>
);
const NavDigest = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3.2" y="4.2" width="13.6" height="12.6" rx="2.5"
      fill={active ? "rgba(22, 119, 84, 0.14)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.5" />
    <path d="M6.8 2.8v2.6M13.2 2.8v2.6M6.2 9.2h7.6M6.2 12.6h4.8"
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const NavSoon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4.5" y="8.8" width="11" height="8" rx="2.4"
      fill={active ? "rgba(22, 119, 84, 0.16)" : "none"}
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.55" />
    <path d="M7 8.8V6.7a3 3 0 0 1 6 0v2.1"
      stroke={active ? "#167754" : "#6b7d72"} strokeWidth="1.55" strokeLinecap="round" />
    <circle cx="10" cy="12.8" r="1.1" fill={active ? "#167754" : "#6b7d72"} />
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

  const [selectedCore, setSelectedCore]       = useState(null);
  const [selectedMood, setSelectedMood]       = useState(null);
  const [selectedIntensity, setSelectedIntensity] = useState("Moderate");
  const draftKey = `qalbsense_journal_draft_${user?.uid || "guest"}`;
  const [journalContent, setJournalContent]   = useState(() => {
    try { return localStorage.getItem(`qalbsense_journal_draft_${user?.uid || "guest"}`) || ""; } catch { return ""; }
  });
  const [promptIdx, setPromptIdx]             = useState(0);
  const [reflection, setReflection]           = useState("");
  const [verifiedAyah, setVerifiedAyah]       = useState(null);
  const [verifiedSunnah, setVerifiedSunnah]   = useState(null);
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [savedReflectionId, setSavedReflectionId] = useState(null);
  const [reflectionFeedback, setReflectionFeedback] = useState(null);
  const [scopeNotice, setScopeNotice]         = useState("");
  const [closingDua, setClosingDua]           = useState("");
  const [duaSaved, setDuaSaved]               = useState(false);
  const [isReflecting, setIsReflecting]       = useState(false);
  const [isListening, setIsListening]         = useState(false);
  const textareaRef                           = useRef(null);
  const recognitionRef                        = useRef(null);
  const speechSupported = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const ayahStorageKey = `qalbsense_last_ayah_${user?.uid || "guest"}`;
  const [ayahOfTheDay, setAyahOfTheDay]       = useState(() => {
    try {
      const saved = localStorage.getItem(`qalbsense_last_ayah_${user?.uid || "guest"}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.arabic) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return {
      verseKey: "91:9",
      arabic: "قَدْ أَفْلَحَ مَن زَكَّاهَا",
      translation: "He has succeeded who purifies the soul.",
      source: "Ash-Shams 91:9",
      theme: "At-Tazkiyah · Soul Purification",
      audioUrl: "https://verses.quran.com/Alafasy/mp3/091009.mp3",
      verified: false,
    };
  });
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

  useEffect(() => () => {
    clearTimeout(toastTimer.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    setPromptIdx(0);
    if (!selectedMood) {
      try {
        if (localStorage.getItem(ayahStorageKey)) return;
      } catch {
        // ignore storage errors
      }
    }
    let cancelled = false;
    fetchMoodAyah(selectedMood || "neutral").then((data) => {
      if (!cancelled && data?.arabic) {
        setAyahOfTheDay(data);
        try {
          localStorage.setItem(ayahStorageKey, JSON.stringify(data));
        } catch {
          // ignore storage errors
        }
      }
    });
    return () => { cancelled = true; };
  }, [selectedMood, ayahStorageKey]);

  useEffect(() => {
    try {
      if (journalContent) {
        localStorage.setItem(draftKey, journalContent);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // ignore storage errors
    }
  }, [journalContent, draftKey]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(120, Math.min(el.scrollHeight, 340))}px`;
  }, [journalContent]);

  /* ── Mood ── */
  const handleMoodSelect = async (mood) => {
    try {
      await logMood(user.uid, mood.label, selectedIntensity);
      setSelectedMood(mood.label);
      showToast(`Mood logged: ${mood.label}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to log mood");
    }
  };

  /* ── Voice Journaling ── */
  const handleToggleVoice = () => {
    if (!speechSupported) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      const clean = transcript.trim();
      if (clean) {
        setJournalContent((prev) => (prev ? `${prev.trimEnd()} ${clean}` : clean));
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        showToast("Microphone permission denied");
      } else if (event.error !== "aborted") {
        showToast("Voice input paused");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    showToast("Listening… speak from your heart");
  };

  /* ── Journal ── */
  const handleSaveJournal = async () => {
    if (!journalContent.trim()) return;
    try {
      await addJournal(user.uid, journalContent);
      try { localStorage.removeItem(draftKey); } catch {}
      showToast("Journal entry saved ✓");
    } catch (err) {
      console.error(err);
      showToast("Failed to save journal");
    }
  };

  /* ── Reflection ── */
  const handleReflection = async () => {
    const trimmed = journalContent.trim();
    if (!trimmed || isReflecting) return;

    setScopeNotice("");
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (trimmed.length < 10 || words.length < 2 || /(.)\1{5,}/.test(trimmed)) {
      setScopeNotice("Please share a few honest words about what is on your heart or how your day feels so QalbSense can reflect with you.");
      return;
    }

    setIsReflecting(true);
    try {
      const result = await generateReflection({
        mood: selectedMood || "neutral",
        intensity: selectedMood ? selectedIntensity : undefined,
        journal: journalContent,
        userId: user?.uid,
      });

      if (result.outOfScope) {
        setScopeNotice(
          result.message ||
            "QalbSense is a sanctuary for Muhāsabah, emotional awareness, and spiritual reflection. Share what is on your heart or how your day feels."
        );
        return;
      }

      const text = result.reflection;
      setReflection(text);
      setVerifiedAyah(result.verifiedAyah || null);
      setVerifiedSunnah(result.verifiedSunnah || null);
      setReflectionModalOpen(true);
      setSavedReflectionId(null);
      setReflectionFeedback(null);
      setClosingDua("");
      setDuaSaved(false);

      try {
        if (user?.uid) {
          const [savedRef] = await Promise.all([
            saveReflection(user.uid, {
              text,
              journalContent,
              mood: selectedMood || "neutral",
              verifiedAyah: result.verifiedAyah || null,
              verifiedSunnah: result.verifiedSunnah || null,
            }),
            addJournal(user.uid, journalContent, text),
          ]);
          if (savedRef?.id) setSavedReflectionId(savedRef.id);
          try { localStorage.removeItem(draftKey); } catch {}
          showToast("Reflection & journal saved ✓");
        } else {
          showToast("Reflection generated ✓");
        }
      } catch (saveErr) {
        console.error("Failed to save reflection:", saveErr);
        showToast("Reflection generated (could not save to history)");
      }
    } catch (err) {
      console.error("Reflection generation error:", err);
      showToast(err?.message || "Failed to generate reflection");
    } finally {
      setIsReflecting(false);
    }
  };

  /* ── Closing Du'a & Reset ── */
  const handleSaveDua = async () => {
    if (!closingDua.trim()) return;
    try {
      if (user?.uid) {
        await addJournal(user.uid, `🤲 Closing Du‘ā’: ${closingDua.trim()}`);
      }
      setDuaSaved(true);
      showToast("Du‘ā’ saved — Āmīn 🤲");
    } catch (err) {
      console.error(err);
      showToast("Could not save Du‘ā’");
    }
  };

  const handleReflectionFeedback = async (val) => {
    if (!savedReflectionId) return;
    const next = reflectionFeedback === val ? null : val;
    setReflectionFeedback(next);
    try {
      await toggleReflectionFlag(savedReflectionId, "feedback", next);
      if (next) showToast("Thank you for your feedback");
    } catch {
      setReflectionFeedback(reflectionFeedback);
    }
  };

  const handleNewCheckIn = () => {
    setJournalContent("");
    setReflection("");
    setVerifiedAyah(null);
    setSavedReflectionId(null);
    setReflectionFeedback(null);
    setScopeNotice("");
    setClosingDua("");
    setDuaSaved(false);
    try { localStorage.removeItem(draftKey); } catch {}
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
        .qalb-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; align-items: center; gap: 2px; padding: 8px max(8px, calc((100% - 620px) / 2)) 14px; background: rgba(245,247,240,0.96); border-top: 1px solid #dce5da; box-shadow: 0 -4px 20px rgba(17,33,23,0.04); backdrop-filter: blur(16px); z-index: 50; }
        .qalb-nav-item { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 2px; border-radius: 12px; text-decoration: none; transition: all 0.2s; }
        .qalb-nav-icon-wrap { width: 38px; height: 34px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; transition: background 0.2s, border-color 0.2s; }
        .qalb-nav-item:hover .qalb-nav-icon-wrap { background: rgba(22,119,84,0.06); }
        .qalb-nav-item.active .qalb-nav-icon-wrap { background: #e6f4ea; border-color: rgba(22,119,84,0.16); }
        .qalb-nav-item:focus-visible { outline: 2px solid #167754; outline-offset: 2px; }
        .qalb-nav-label { font-size: 8.8px; font-weight: 500; letter-spacing: 0.02em; color: #65776c; font-family: 'DM Sans', sans-serif; text-transform: uppercase; white-space: nowrap; }
        .qalb-nav-item.active .qalb-nav-label { color: #167754; font-weight: 700; }

        /* Animations */
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes stepPop { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .qalb-step-pop { animation: stepPop 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .qalb-nuance-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(29, 49, 41, 0.08); }
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

          {/* ── MOOD (OPTION A: STEP-BY-STEP POP-OUT FLOW) ── */}
          <div className="qalb-section-1" style={{ margin: "18px 20px 0", border: "1px solid #e2e9df", borderRadius: 20, background: "#ffffff", boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
              <SectionHeader icon={<IconHeart />} title="State of your heart" />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[1, 2, 3].map(stepNum => {
                  const done =
                    (stepNum === 1 && selectedCore) ||
                    (stepNum === 2 && selectedMood) ||
                    (stepNum === 3 && selectedMood);
                  const active =
                    (stepNum === 1 && !selectedCore) ||
                    (stepNum === 2 && selectedCore && !selectedMood) ||
                    (stepNum === 3 && selectedMood);
                  return (
                    <span
                      key={stepNum}
                      style={{
                        width: active ? 18 : 7,
                        height: 7,
                        borderRadius: 999,
                        background: done ? "#167754" : active ? "#74b896" : "#dce5da",
                        transition: "all 0.25s ease",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Step 1: 5 Calm Core States */}
            <div style={{ padding: "14px 20px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#167754", background: "#eef6f0", padding: "2px 7px", borderRadius: 999 }}>
                  01
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#3d5446" }}>
                  Sense your overall state
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                {CORE_MOOD_STATES.map(core => {
                  const isSelected = selectedCore === core.id;
                  return (
                    <button
                      key={core.id}
                      type="button"
                      className={`qalb-mood-btn${isSelected ? " selected" : ""}`}
                      style={{
                        flex: "1 1 28%",
                        minWidth: 92,
                        maxWidth: 140,
                        transform: isSelected ? "scale(1.03)" : undefined,
                      }}
                      onClick={() => setSelectedCore(isSelected ? null : core.id)}
                    >
                      <span className="qalb-mood-emoji">{core.emoji}</span>
                      <span>{core.label}</span>
                      <span style={{ fontSize: 10, color: isSelected ? "#167754" : "#7b8d82", fontStyle: "italic", fontWeight: 500 }}>
                        {core.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Granular Nuances (pops out on core select) */}
            {selectedCore && (
              <div
                key={`step2-${selectedCore}`}
                className="qalb-step-pop"
                style={{
                  margin: "0 16px 16px",
                  padding: "14px 14px",
                  borderRadius: 16,
                  border: "1px solid #d9e6d8",
                  background: "#f8fbf7",
                  boxShadow: "0 6px 18px rgba(22, 119, 84, 0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#ffffff", background: "#167754", padding: "2px 7px", borderRadius: 999 }}>
                    02
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "#1d3129" }}>
                    Name what fits closest right now
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {CORE_MOOD_STATES.find(c => c.id === selectedCore)?.nuances.map(n => {
                    const active = selectedMood === n.label;
                    return (
                      <button
                        key={n.label}
                        type="button"
                        className="qalb-nuance-btn"
                        onClick={() => handleMoodSelect(n)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: active ? `1.5px solid ${n.color}` : "1px solid #dce5da",
                          background: active ? n.bg : "#ffffff",
                          color: active ? n.color : "#2f4437",
                          cursor: "pointer",
                          textAlign: "left",
                          boxShadow: active ? "0 4px 12px rgba(22, 119, 84, 0.12)" : "none",
                          transition: "all 0.18s",
                        }}
                      >
                        <span style={{ fontSize: 17 }}>{n.emoji}</span>
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                          <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 600 }}>{n.label}</span>
                          <span style={{ fontSize: 10, fontStyle: "italic", opacity: 0.82 }}>{n.sub}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Intensity (pops out on nuance select) */}
            {selectedMood && (
              <div
                key={`step3-${selectedMood}`}
                className="qalb-step-pop"
                style={{
                  margin: "0 16px 18px",
                  padding: "12px 14px",
                  borderRadius: 16,
                  border: "1px solid #d5e4d6",
                  background: "#eef6f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#ffffff", background: "#167754", padding: "2px 7px", borderRadius: 999 }}>
                      03
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#1d3129", letterSpacing: "0.02em" }}>
                      How heavy is {selectedMood}?
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: "#167754" }}>
                    {INTENSITY_OPTIONS.find(i => i.label === selectedIntensity)?.hint}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {INTENSITY_OPTIONS.map(opt => {
                    const active = selectedIntensity === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedIntensity(opt.label)}
                        style={{
                          padding: "7px 10px",
                          borderRadius: 999,
                          border: active ? "1.5px solid #167754" : "1px solid #cce0ce",
                          background: active ? "#167754" : "#ffffff",
                          color: active ? "#ffffff" : "#3a5445",
                          fontSize: 12,
                          fontWeight: active ? 700 : 600,
                          cursor: "pointer",
                          transition: "all 0.18s",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── AYAH OF THE MOMENT ── */}
          <div className="qalb-section-2" style={{ margin: "18px 20px 0", border: "1px solid #e2e9df", borderRadius: 20, background: "#ffffff", boxShadow: "0 4px 20px rgba(29, 49, 41, 0.04)", overflow: "hidden" }}>
            <SectionHeader icon={<IconAyah />} title="Ayah of the moment" />
            <div className="qalb-ayah-card" style={{ margin: "14px 20px 20px" }}>
              {ayahOfTheDay.theme && (
                <div style={{
                  display: "inline-block",
                  marginBottom: 10,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: "#eef6f0",
                  color: "#167754",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}>
                  {ayahOfTheDay.theme}
                </div>
              )}
              <p className="qalb-arabic">{ayahOfTheDay.arabic}</p>
              <p className="qalb-translation">"{ayahOfTheDay.translation}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span className="qalb-ayah-source">{ayahOfTheDay.source}</span>
                {ayahOfTheDay.verified && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#167754", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    ✓ Verified
                  </span>
                )}
              </div>
              <AyahActions verseKey={ayahOfTheDay.verseKey} audioUrl={ayahOfTheDay.audioUrl} />
            </div>
          </div>

          {/* ── JOURNAL ── */}
          <SectionCard style={{ marginTop: 18 }} className="qalb-section-3">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
              <SectionHeader
                icon={<IconBook />}
                title="Muhāsabah Journal"
                badge={activeMood ? activeMood.emoji : "✎"}
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 11px",
                    borderRadius: 999,
                    border: isListening ? "1.5px solid #c0392b" : "1px solid #d5e0d5",
                    background: isListening ? "#fdf2f0" : "#ffffff",
                    color: isListening ? "#c0392b" : "#167754",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{isListening ? "●" : "🎙️"}</span>
                  <span>{isListening ? "Listening…" : "Speak"}</span>
                </button>
              )}
            </div>
            <div style={{ padding: "12px 20px 20px" }}>
              <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#687b6f", fontStyle: "italic" }}>
                Begin with Bismillah — this sanctuary is private between you and Allah.
              </p>

              {/* Mood-Aware Guided Prompt */}
              {(() => {
                const prompts = JOURNAL_PROMPTS[selectedMood] || JOURNAL_PROMPTS.default;
                const activePrompt = prompts[promptIdx % prompts.length];
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 12,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "#f5f8f3",
                      border: "1px solid #e0e9dd",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "#2d4537", fontWeight: 500 }}>
                      “{activePrompt}”
                    </p>
                    {prompts.length > 1 && (
                      <button
                        type="button"
                        title="Another prompt"
                        onClick={() => setPromptIdx(i => i + 1)}
                        style={{
                          flexShrink: 0,
                          border: "1px solid #d2dfd0",
                          background: "#ffffff",
                          color: "#167754",
                          borderRadius: 999,
                          padding: "3px 9px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        ↻
                      </button>
                    )}
                  </div>
                );
              })()}

              <textarea
                ref={textareaRef}
                className="qalb-textarea"
                rows={4}
                placeholder="Write what is on your heart…"
                value={journalContent}
                onChange={e => {
                  setJournalContent(e.target.value);
                  if (scopeNotice) setScopeNotice("");
                }}
              />
              {scopeNotice && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: "1px solid #e3decb",
                    background: "#fcfaf3",
                    color: "#5b481b",
                    fontSize: 12.5,
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8c6d23", marginBottom: 3 }}>
                    Gentle Reminder
                  </strong>
                  {scopeNotice}
                </div>
              )}
              <div className="qalb-btn-row">
                <button className="qalb-btn-save" onClick={handleSaveJournal}>
                  Save only
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
          {reflection && !reflectionModalOpen && (
            <div style={{ margin: "14px 20px 0", display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setReflectionModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1px solid #bfdeca",
                  background: "#eef6f0",
                  color: "#167754",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✦ Open your reflection
              </button>
            </div>
          )}

          {reflection && reflectionModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Your reflection"
              onClick={() => setReflectionModalOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 120,
                background: "rgba(17, 33, 23, 0.48)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 16px",
              }}
            >
              <div
                ref={reflectionRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 580,
                  maxHeight: "86vh",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 22,
                  border: "1px solid #d5e2d3",
                  background: "#ffffff",
                  boxShadow: "0 24px 70px rgba(17, 33, 23, 0.25)",
                  overflow: "hidden",
                  animation: "stepPop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <div style={{ height: 3, background: "linear-gradient(90deg, #167754, #a48a49, #167754)" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 16, borderBottom: "1px solid #edf1ea", background: "#fcfdfa" }}>
                  <SectionHeader icon={<IconStar />} title="Your reflection" badge={selectedMood || undefined} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setReflectionModalOpen(false);
                        handleNewCheckIn();
                      }}
                      style={{
                        border: "1px solid #dce5da",
                        background: "#ffffff",
                        color: "#4c6255",
                        borderRadius: 999,
                        padding: "5px 11px",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      New check-in
                    </button>
                    <button
                      type="button"
                      aria-label="Close reflection"
                      onClick={() => setReflectionModalOpen(false)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        border: "1px solid #dce5da",
                        background: "#ffffff",
                        color: "#4c6255",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div style={{ padding: "16px 20px 22px", overflowY: "auto" }}>
                  <StructuredReflection text={reflection} verifiedAyah={verifiedAyah} verifiedSunnah={verifiedSunnah} />

                  {/* Privacy-safe AI Feedback */}
                  {savedReflectionId && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, padding: "8px 4px 0" }}>
                      <span style={{ fontSize: 11.5, color: "#687b6f" }}>Was this reflection helpful?</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[
                          { val: "helpful", label: "👍 Helpful" },
                          { val: "needs_work", label: "👎 Missed" },
                        ].map(btn => {
                          const active = reflectionFeedback === btn.val;
                          return (
                            <button
                              key={btn.val}
                              type="button"
                              onClick={() => handleReflectionFeedback(btn.val)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 999,
                                border: active ? "1px solid #167754" : "1px solid #dce5da",
                                background: active ? "#eef6f0" : "#ffffff",
                                color: active ? "#167754" : "#586b61",
                                fontSize: 11,
                                fontWeight: active ? 700 : 500,
                                cursor: "pointer",
                              }}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Closing Du'a */}
                  <div
                    style={{
                      marginTop: 14,
                      padding: "12px 14px",
                      borderRadius: 14,
                      border: "1px solid #e2e9df",
                      background: "#fbfcf9",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#167754", letterSpacing: "0.04em", marginBottom: 6 }}>
                      🤲 Seal with a personal Du‘ā’
                    </div>
                    {duaSaved ? (
                      <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: "#2d4537" }}>
                        “{closingDua}” — Āmīn.
                      </p>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          value={closingDua}
                          onChange={e => setClosingDua(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") handleSaveDua(); }}
                          placeholder="Ya Allah, grant my heart…"
                          style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "8px 12px",
                            borderRadius: 999,
                            border: "1px solid #d5e0d5",
                            background: "#ffffff",
                            color: "#1d3129",
                            fontSize: 12.5,
                            outline: "none",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleSaveDua}
                          disabled={!closingDua.trim()}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 999,
                            border: "none",
                            background: closingDua.trim() ? "#167754" : "#cbd8cd",
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: closingDua.trim() ? "pointer" : "default",
                          }}
                        >
                          Save Du‘ā’
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
            <Link to="/weekly-digest" className={`qalb-nav-item${location.pathname === "/weekly-digest" ? " active" : ""}`}>
              <div className="qalb-nav-icon-wrap"><NavDigest active={location.pathname === "/weekly-digest"} /></div>
              <span className="qalb-nav-label">Digest</span>
            </Link>
            <Link to="/coming-soon" className={`qalb-nav-item${location.pathname === "/coming-soon" ? " active" : ""}`}>
              <div className="qalb-nav-icon-wrap"><NavSoon active={location.pathname === "/coming-soon"} /></div>
              <span className="qalb-nav-label">Coming Soon</span>
            </Link>
          </nav>

        </div>

        {/* ── TOAST ── */}
        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </>
  );
}
