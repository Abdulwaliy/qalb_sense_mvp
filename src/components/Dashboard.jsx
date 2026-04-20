import { useState } from "react";
import { logMood } from "../services/moodService.js";
import { addJournal } from "../services/journalService.js";
import { saveReflection } from "../services/reflectionService.js";
import { generateReflection } from "../services/aiService.js";
import { Link } from "react-router-dom";

/* ---------------- Mood Options ---------------- */
const moodOptions = [
  { emoji: "😄", label: "Happy",   color: "#d97706", bg: "rgba(251,191,36,0.12)",  border: "rgba(217,119,6,0.35)"  },
  { emoji: "😢", label: "Sad",     color: "#2563eb", bg: "rgba(96,165,250,0.1)",   border: "rgba(37,99,235,0.3)"   },
  { emoji: "😡", label: "Angry",   color: "#dc2626", bg: "rgba(248,113,113,0.1)",  border: "rgba(220,38,38,0.3)"   },
  { emoji: "😰", label: "Anxious", color: "#7c3aed", bg: "rgba(167,139,250,0.1)",  border: "rgba(124,58,237,0.3)"  },
  { emoji: "😌", label: "Calm",    color: "#059669", bg: "rgba(52,211,153,0.1)",   border: "rgba(5,150,105,0.3)"   },
  { emoji: "😴", label: "Tired",   color: "#64748b", bg: "rgba(148,163,184,0.12)", border: "rgba(100,116,139,0.3)" },
];

const STAR = "M12 0 L14.4 8.4 L22.4 6.4 L17.6 13.6 L24 18 L15.6 18.4 L15.2 27.2 L12 19.6 L8.8 27.2 L8.4 18.4 L0 18 L6.4 13.6 L1.6 6.4 L9.6 8.4 Z";

export default function Dashboard({ user }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalContent, setJournalContent] = useState("");
  const [reflection, setReflection] = useState("");
  const [status, setStatus] = useState("");

  const handleMoodSelect = async (m) => {
    try {
      await logMood(user.uid, m.label, m.emoji);
      setSelectedMood(m.label);
      setStatus(`You feel ${m.label.toLowerCase()}`);
      setJournalContent("");
      setReflection("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to log mood");
    }
  };

  const handleAddJournal = async () => {
    if (!journalContent.trim()) return;
    try {
      await addJournal(user.uid, journalContent);
      setStatus("Journal saved");
    } catch (err) {
      console.error(err);
      setStatus("Failed to save journal");
    }
  };

const handleReflection = async () => {
  if (!journalContent.trim()) return;

  try {
    const result = await generateReflection({
      mood: selectedMood,
      journal: journalContent,
    });

    const reflectionText = result.reflection;

    setReflection(reflectionText);

    // ✅ FIX: SAVE TO FIRESTORE (missing piece)
    await saveReflection(user.uid, {
      text: reflectionText,
      journalContent,
      mood: selectedMood,
    });

    setStatus("Reflection generated & saved");
  } catch (err) {
    console.error(err);
    setStatus("Failed to generate reflection");
  }
};


  const activeMood = moodOptions.find((m) => m.label === selectedMood);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .qalb-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          padding: 56px 16px 80px;
          position: relative;
          overflow: hidden;
          background: #faf7f2;
          background-image:
            radial-gradient(ellipse at 15% 0%,   rgba(134,172,140,0.22) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%,  rgba(212,168,83,0.16)  0%, transparent 50%),
            radial-gradient(ellipse at 60% 40%,  rgba(255,255,255,0.6)  0%, transparent 60%);
        }

        .geo-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.055;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpolygon points='40,4 52,28 78,28 58,44 66,70 40,54 14,70 22,44 2,28 28,28' fill='none' stroke='%23b08a2e' stroke-width='1.2'/%3E%3Crect x='30' y='30' width='20' height='20' fill='none' stroke='%23b08a2e' stroke-width='0.8' transform='rotate(45 40 40)'/%3E%3C/svg%3E");
          background-size: 80px 80px;
        }

        .qalb-inner {
          position: relative;
          z-index: 1;
          max-width: 580px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        /* ── Header ── */
        .qalb-header { text-align: center; padding-bottom: 4px; }

        .qalb-bismillah {
          font-family: 'Crimson Pro', serif;
          font-size: 1.05rem;
          color: #a07828;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 14px;
          opacity: 0.8;
        }

        .qalb-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(2rem, 6vw, 2.9rem);
          font-weight: 700;
          color: #1e3a2b;
          letter-spacing: 0.04em;
          line-height: 1.1;
        }

        .qalb-subtitle {
          font-family: 'Crimson Pro', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: #6b8f76;
          margin-top: 9px;
          letter-spacing: 0.02em;
        }

        .qalb-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 16px auto 0;
          width: fit-content;
        }
        .qdl   { width: 56px; height: 1px; background: linear-gradient(to right, transparent, #c8a454); }
        .qdl.r { background: linear-gradient(to left, transparent, #c8a454); }
        .qdd   { width: 5px; height: 5px; border-radius: 50%; background: #c8a454; }

        .qalb-status {
          margin-top: 14px;
          display: inline-block;
          padding: 5px 18px;
          border-radius: 999px;
          border: 1px solid rgba(5,120,70,0.25);
          background: rgba(5,120,70,0.07);
          color: #1a6b40;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* ── Cards ── */
        .qalb-card {
          background: rgba(255, 253, 248, 0.88);
          border: 1px solid rgba(196,164,100,0.25);
          border-radius: 22px;
          padding: 28px 28px 24px;
          backdrop-filter: blur(16px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.95) inset,
            0 4px 6px rgba(120,100,60,0.05),
            0 16px 40px rgba(100,80,40,0.09);
          position: relative;
          overflow: hidden;
        }

        /* gold corner filigree */
        .qalb-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 44px; height: 44px;
          border-top: 1.5px solid rgba(200,164,84,0.55);
          border-left: 1.5px solid rgba(200,164,84,0.55);
          border-radius: 22px 0 0 0;
          pointer-events: none;
        }
        .qalb-card::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 44px; height: 44px;
          border-bottom: 1.5px solid rgba(200,164,84,0.55);
          border-right: 1.5px solid rgba(200,164,84,0.55);
          border-radius: 0 0 22px 0;
          pointer-events: none;
        }

        .qalb-card-title {
          font-family: 'Cinzel', serif;
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #a07828;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .qalb-card-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(192,152,70,0.4), transparent);
        }

        /* ── Mood grid ── */
        .mood-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 11px;
        }

        .mood-btn {
          padding: 18px 8px 14px;
          border-radius: 14px;
          border: 1.5px solid rgba(0,0,0,0.07);
          background: rgba(255,255,255,0.6);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #8a9490;
          transition: all 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .mood-btn:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(0,0,0,0.13);
          transform: translateY(-4px) scale(1.03);
          color: #3d5045;
          box-shadow: 0 8px 24px rgba(80,100,80,0.13);
        }

        .mood-btn.active {
          transform: translateY(-3px);
          font-weight: 500;
          box-shadow: 0 6px 20px rgba(80,100,80,0.15);
        }

        .mood-emoji {
          font-size: 2.1rem;
          line-height: 1;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .mood-btn:hover .mood-emoji  { transform: scale(1.2) translateY(-2px); }
        .mood-btn.active .mood-emoji { transform: scale(1.15) translateY(-2px); }

        /* ── Journal ── */
        .qalb-textarea {
          width: 100%;
          border: 1.5px solid rgba(180,150,80,0.22);
          border-radius: 14px;
          padding: 18px;
          font-family: 'Crimson Pro', serif;
          font-size: 1.06rem;
          line-height: 1.78;
          color: #2d3d32;
          background: rgba(255,253,248,0.7);
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .qalb-textarea::placeholder { color: #bbb5a5; font-style: italic; }
        .qalb-textarea:focus {
          border-color: rgba(5,150,105,0.45);
          box-shadow: 0 0 0 3px rgba(5,150,105,0.08);
          background: #fff;
        }

        .btn-row { display: flex; gap: 11px; margin-top: 16px; }

        .btn-save {
          padding: 12px 26px;
          background: linear-gradient(135deg, #1a6b40 0%, #0f4a2a 100%);
          color: #c8f0d8;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 14px rgba(15,80,45,0.28);
        }
        .btn-save:hover {
          background: linear-gradient(135deg, #21854f 0%, #145c36 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(15,80,45,0.35);
        }

        .btn-reflect {
          padding: 12px 26px;
          background: linear-gradient(135deg, #5b2d8a 0%, #3d1a62 100%);
          color: #e0ccff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 14px rgba(70,30,120,0.28);
        }
        .btn-reflect:hover {
          background: linear-gradient(135deg, #6e38a8 0%, #4a2078 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(70,30,120,0.35);
        }

        /* ── Reflection ── */
        .reflection-inner {
          padding: 20px 22px;
          border-radius: 14px;
          background: rgba(100,60,160,0.05);
          border: 1px solid rgba(140,100,200,0.18);
          border-left: 3px solid rgba(140,100,200,0.5);
        }
        .reflection-text {
          font-family: 'Crimson Pro', serif;
          font-size: 1.08rem;
          font-style: italic;
          line-height: 1.9;
          color: #4a3570;
          white-space: pre-line;
          margin: 0;
        }

        /* ── Fade-in ── */
        .qalb-section-enter { animation: sectionIn 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes sectionIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Nav ── */
        .qalb-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 2px;
        }
        .qalb-nav a {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a09070;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
        }
        .qalb-nav a:hover {
          color: #1a6b40;
          border-bottom-color: rgba(26,107,64,0.35);
        }
        .qalb-nav-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(180,155,90,0.3); }
      `}</style>

      <div className="qalb-root">
        <div className="geo-bg" />

        <div className="qalb-inner">

          {/* ── Header ── */}
          <header className="qalb-header">
            <p className="qalb-bismillah">بِسْمِ اللَّهِ</p>
            <h1 className="qalb-title">Assalamu alaikum</h1>
            <p className="qalb-subtitle">How is your <em>qalb</em> today?</p>

            <div className="qalb-divider">
              <span className="qdl" />
              <span className="qdd" />
              <svg width="13" height="13" viewBox="0 0 28 28" fill="none">
                <path d={STAR} fill="#c8a454" opacity="0.9" />
              </svg>
              <span className="qdd" />
              <span className="qdl r" />
            </div>

            {status && <p className="qalb-status">{status}</p>}
          </header>

          {/* ── Mood Section ── */}
          <section className="qalb-card">
            <h2 className="qalb-card-title">Log your mood</h2>

            <div className="mood-grid">
              {moodOptions.map((m) => {
                const isActive = selectedMood === m.label;
                return (
                  <button
                    key={m.label}
                    onClick={() => handleMoodSelect(m)}
                    className={`mood-btn${isActive ? " active" : ""}`}
                    style={isActive ? {
                      background: m.bg,
                      borderColor: m.border,
                      color: m.color,
                    } : {}}
                  >
                    <span className="mood-emoji">{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Journal Section ── */}
          {selectedMood && (
            <section className="qalb-card qalb-section-enter">
              <h2 className="qalb-card-title">
                Journal
                {activeMood && <span style={{ marginLeft: -4, fontSize: "1rem" }}>{activeMood.emoji}</span>}
              </h2>

              <textarea
                className="qalb-textarea"
                rows={5}
                placeholder="What is weighing on your heart right now?"
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
              />

              <div className="btn-row">
                <button onClick={handleAddJournal} className="btn-save">Save</button>
                {journalContent.trim() && (
                  <button onClick={handleReflection} className="btn-reflect">✦ Reflect</button>
                )}
              </div>
            </section>
          )}

          {/* ── Reflection Section ── */}
          {reflection && (
            <section className="qalb-card qalb-section-enter">
              <h2 className="qalb-card-title">Reflection</h2>
              <div className="reflection-inner">
                <p className="reflection-text">{reflection}</p>
              </div>
            </section>
          )}

          {/* ── Nav Links ── */}
          <nav className="qalb-nav">
            <Link to="/mood-history">Mood history</Link>
            <span className="qalb-nav-dot" />
            <Link to="/journal-history">Journal history</Link>
            <span className="qalb-nav-dot" />
            <Link to="/reflection-history">Reflections</Link>
          </nav>

        </div>
      </div>
    </>
  );
}
