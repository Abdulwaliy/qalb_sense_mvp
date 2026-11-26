import { useState } from "react";

const TABS = [
  { id: "home",    label: "Home",    icon: "⌂" },
  { id: "mood",    label: "Mood",    icon: "♡" },
  { id: "journal", label: "Journal", icon: "▤" },
  { id: "reflect", label: "Reflect", icon: "✦" },
];

export default function AppPreviewShowcase() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <section
      id="preview"
      style={{
        padding: "92px 24px",
        background: "linear-gradient(180deg, #f4f6ee 0%, #eef4ea 100%)",
        borderTop: "1px solid #d4e2d2",
        borderBottom: "1px solid #d4e2d2",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <span className="landing-section-kicker">Inside QalbSense</span>
        <h2
          style={{
            margin: "12px 0 12px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 44px)",
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#112117",
          }}
        >
          See Ahmad’s <em style={{ color: "#0d5f3f", fontStyle: "italic" }}>daily sanctuary</em> in action.
        </h2>
        <p
          style={{
            maxWidth: 560,
            margin: "0 auto 28px",
            color: "#24392c",
            fontSize: 15,
            lineHeight: 1.8,
          }}
        >
          Click through the four tabs below to preview how QalbSense guides a real check-in—from naming your heart’s state to verified Qur’anic reflection.
        </p>

        {/* Tab Selector */}
        <div
          role="tablist"
          aria-label="App preview tabs"
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginBottom: 28,
            padding: 6,
            borderRadius: 999,
            background: "#ffffff",
            border: "1px solid #cfded0",
            boxShadow: "0 4px 16px rgba(16, 48, 30, 0.05)",
          }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "none",
                  background: active ? "#0d5f3f" : "transparent",
                  color: active ? "#ffffff" : "#2f4437",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Phone-Framed App Preview */}
        <div
          style={{
            maxWidth: 440,
            margin: "0 auto",
            borderRadius: 28,
            border: "1px solid #c3d6c1",
            background: "#f5f7f0",
            boxShadow: "0 24px 64px rgba(17, 33, 23, 0.13)",
            overflow: "hidden",
            textAlign: "left",
          }}
        >
          {/* App Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid #e2e9df",
              background: "#f5f7f0",
              fontSize: 11,
            }}
          >
            <span style={{ fontWeight: 700, color: "#167754", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ← QalbSense Home
            </span>
            <span style={{ color: "#4c6255", fontWeight: 600 }}>ahmad</span>
          </div>

          {/* App Body */}
          <div style={{ padding: "16px 16px 18px", minHeight: 375 }}>
            {activeTab === "home" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ textAlign: "center", paddingBottom: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#167754" }}>
                    Bismillah
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: "#112117" }}>
                    Assalamu Alaykum, Ahmad
                  </div>
                </div>

                {/* State of heart */}
                <div style={{ padding: 14, borderRadius: 16, background: "#ffffff", border: "1px solid #dce5da" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#112117", marginBottom: 8 }}>
                    ♥ State of your heart
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ padding: "5px 10px", borderRadius: 10, background: "#eef6f0", border: "1px solid #167754", fontSize: 11, fontWeight: 700, color: "#167754" }}>
                      🌧️ Heavy · Al-Qabḍ
                    </span>
                    <span style={{ padding: "5px 10px", borderRadius: 10, background: "#eef5f9", border: "1px solid #2d6a8e", fontSize: 11, fontWeight: 700, color: "#2d6a8e" }}>
                      💧 Remorseful · Nadam
                    </span>
                    <span style={{ padding: "5px 10px", borderRadius: 999, background: "#167754", fontSize: 11, fontWeight: 700, color: "#ffffff" }}>
                      Moderate
                    </span>
                  </div>
                </div>

                {/* Ayah of the moment */}
                <div style={{ padding: 14, borderRadius: 16, background: "#ffffff", border: "1px solid #dce5da" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#167754", background: "#eef6f0", padding: "2px 8px", borderRadius: 999 }}>
                      At-Tawbah & Ar-Raḥmah
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#167754" }}>✓ Verified</span>
                  </div>
                  <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: 18, fontWeight: 700, textAlign: "right", color: "#112117", marginBottom: 4 }}>
                    لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontStyle: "italic", color: "#2f4437", marginBottom: 8 }}>
                    “Do not despair of the mercy of Allah.” — Az-Zumar 39:53
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, border: "1px solid #cde0ce", fontSize: 10.5, fontWeight: 600, color: "#167754" }}>▶ Listen</span>
                    <span style={{ padding: "3px 10px", borderRadius: 999, border: "1px solid #dce4d8", fontSize: 10.5, fontWeight: 600, color: "#4b6154" }}>Read Tafsir</span>
                  </div>
                </div>

                {/* Journal snippet */}
                <div style={{ padding: 12, borderRadius: 16, background: "#ffffff", border: "1px solid #dce5da" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#112117" }}>Muhāsabah Journal</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#167754", border: "1px solid #d5e0d5", padding: "2px 8px", borderRadius: 999 }}>🎙️ Speak</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#3b5042", lineHeight: 1.5, background: "#fbfcf9", padding: "8px 10px", borderRadius: 10, border: "1px solid #e2e9df" }}>
                    “I let my temper get the better of me today and my chest feels tight. I want to return to Allah with sincerity tonight…”
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mood" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "10px 16px", borderRadius: 999, background: "rgba(22,119,84,0.08)", border: "1px solid rgba(22,119,84,0.24)", textAlign: "center" }}>
                  <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: 16, fontWeight: 700, color: "#0b5e3f" }}>
                    أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
                  </div>
                  <div style={{ fontSize: 11, color: "#1d3129" }}>
                    “Verily, in the remembrance of Allah do hearts find rest.” · <strong>Ar-Ra'd 13:28</strong>
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 16, background: "#ffffff", border: "1px solid #dce5da" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#167754", marginBottom: 8 }}>
                    Heart Overview
                  </div>
                  <div style={{ padding: "8px 10px", borderRadius: 10, background: "#f8fbf7", border: "1px solid #e0e9dd", fontSize: 12, color: "#2d4537", marginBottom: 10 }}>
                    Most frequent state: <strong style={{ color: "#0d6e5a" }}>🕊️ Grounded (As-Sakīnah)</strong>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 9px", borderRadius: 999, background: "#ebf6f3", border: "1px solid #b8dfd6", color: "#0d6e5a", fontSize: 11, fontWeight: 600 }}>🕊️ Grounded (6)</span>
                    <span style={{ padding: "4px 9px", borderRadius: 999, background: "#eef6f0", border: "1px solid #c0decb", color: "#167754", fontSize: 11, fontWeight: 600 }}>🌿 Uplifted (4)</span>
                    <span style={{ padding: "4px 9px", borderRadius: 999, background: "#eff5fc", border: "1px solid #c8ddf4", color: "#326eb8", fontSize: 11, fontWeight: 600 }}>🌧️ Heavy (3)</span>
                  </div>
                </div>

                {[
                  { emoji: "💧", label: "Remorseful", core: "Heavy", intensity: "Moderate", time: "Tonight · 9:40 PM", color: "#2d6a8e" },
                  { emoji: "🕊️", label: "Serene", core: "Grounded", intensity: "Gentle", time: "Yesterday · Fajr", color: "#0d6e5a" },
                ].map((m, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 14, background: "#ffffff", border: "1px solid #e2e9df" }}>
                    <span style={{ fontSize: 20 }}>{m.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <strong style={{ fontSize: 13.5, color: m.color }}>{m.label}</strong>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: "#fdf8ec", color: "#8c6d23", border: "1px solid #f0dfb5" }}>{m.intensity}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#687b6f" }}>{m.time} · {m.core}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "journal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 16, background: "#ffffff", border: "1px solid #dce5da" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#167754", marginBottom: 10 }}>
                    Journal Overview
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, textAlign: "center" }}>
                    <div style={{ padding: 8, borderRadius: 10, background: "#f8fbf7", border: "1px solid #e3ebe1" }}>
                      <strong style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#112117" }}>12</strong>
                      <div style={{ fontSize: 10, color: "#586b61", fontWeight: 600 }}>Entries</div>
                    </div>
                    <div style={{ padding: 8, borderRadius: 10, background: "#eef6f0", border: "1px solid #cde0ce" }}>
                      <strong style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#167754" }}>9</strong>
                      <div style={{ fontSize: 10, color: "#167754", fontWeight: 600 }}>Reflected</div>
                    </div>
                    <div style={{ padding: 8, borderRadius: 10, background: "#fdf8ec", border: "1px solid #f0dfb5" }}>
                      <strong style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#8c6d23" }}>5</strong>
                      <div style={{ fontSize: 10, color: "#8c6d23", fontWeight: 600 }}>Du‘ā’s</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 16, background: "#f7fbf6", border: "1px solid #cde2ce" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#687b6f" }}>Today · 9:45 PM</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#167754", background: "#eef6f0", padding: "2px 8px", borderRadius: 999 }}>🤲 Du‘ā’</span>
                  </div>
                  <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13.5, color: "#123825", lineHeight: 1.6 }}>
                    “Ya Allah, forgive my haste today, soften my tongue with my family, and grant me a sound heart.”
                  </p>
                </div>

                <div style={{ padding: 14, borderRadius: 16, background: "#ffffff", border: "1px solid #e2e9df" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#687b6f" }}>Today · 9:41 PM</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#167754" }}>Remorseful</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 12.5, color: "#1d3129", lineHeight: 1.55 }}>
                    “I let my temper get the better of me today and my chest feels tight…”
                  </p>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#167754" }}>✦ View reflection ↗</span>
                </div>
              </div>
            )}

            {activeTab === "reflect" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 16, background: "#ffffff", border: "1px solid #dce5da" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#167754", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Reflection Overview
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#8c6d23" }}>★ 4 Saved · ✓ 7 Practiced</span>
                  </div>

                  <div style={{ padding: 12, borderRadius: 12, background: "#fcfdfa", border: "1px solid #e6ede4", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#167754", marginBottom: 4 }}>01 · Mirror of the Heart</div>
                    <div style={{ fontSize: 12.5, color: "#283c30", lineHeight: 1.55 }}>
                      That tightness in your chest is a sign of a living conscience (<em>Nadam</em>)—your heart dislikes hurting others and longs to return to gentle character.
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 12, background: "#f0f7ef", border: "1px solid #bfdeca", borderLeft: "3.5px solid #167754", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0b5e3f", marginBottom: 4 }}>05 · Spiritual Anchor · Surah 39:53</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12.5, color: "#123825" }}>
                      “Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.”
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 999, background: "#eef6f0", border: "1px solid #167754", color: "#167754", fontSize: 11, fontWeight: 700 }}>
                      ✓ Sunnah step practiced
                    </span>
                    <span style={{ fontSize: 12, color: "#167754", fontWeight: 700 }}>👍 Helpful</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* App Bottom Nav */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid #e2e9df",
              background: "#ffffff",
              padding: "8px 0",
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    border: "none",
                    background: "transparent",
                    color: active ? "#167754" : "#718276",
                    fontSize: 10,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
