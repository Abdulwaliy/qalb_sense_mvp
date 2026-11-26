import { useState } from "react";
import { Link } from "react-router-dom";
import {
  joinWaitlist,
  submitWaitlistFeedback,
} from "../services/waitlistService.js";
import "./WaitlistPage.css";

function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [waitlistId, setWaitlistId] = useState("");
  const [showFollowup, setShowFollowup] = useState(false);
  const [interests, setInterests] = useState([]);
  const [followupStatus, setFollowupStatus] = useState("idle");

  const interestOptions = [
    "Healing emotional exhaustion",
    "Spiritual grounding & Sakīnah",
    "Faith-based AI reflection",
    "Deeper Quranic ayah resonance",
    "Mindful Islamic journaling",
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setStatus("invalid");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await joinWaitlist(normalizedEmail);
      setWaitlistId(result.waitlistId || "");
      setStatus(result.duplicate ? "duplicate" : "success");
    } catch (error) {
      console.error("Unable to join the QalbSense waitlist:", error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  async function handleFollowupSubmit(event) {
    event.preventDefault();
    if (interests.length === 0) return;

    setFollowupStatus("submitting");
    try {
      await submitWaitlistFeedback(waitlistId, interests);
      setFollowupStatus("success");
    } catch (error) {
      console.error("Unable to save QalbSense waitlist feedback:", error);
      setFollowupStatus("error");
    }
  }

  return (
    <main className="qs-waitlist-page">
      <div className="qs-glow-bg" aria-hidden="true" />

      <div className="qs-wrap">
        {/* ── TOP NAV ── */}
        <nav className="qs-nav">
          <Link className="qs-logo" to="/" aria-label="QalbSense home">
            <span className="qs-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <path
                  d="M18 4.5 21.3 13l8.2-3.1-3.1 8.2 8.5 3.3-8.5 3.3 3.1 8.2-8.2-3.1L18 36l-3.3-8.2-8.2 3.1 3.1-8.2L1 19.4l8.5-3.3-3.1-8.2 8.2 3.1L18 4.5Z"
                  fill="#00e599"
                />
                <circle cx="18" cy="19.4" r="5.1" fill="#050d09" />
              </svg>
            </span>
            <span>qalb<span className="qs-logo-accent">sense</span></span>
          </Link>

          <div className="qs-nav-actions">
            <Link className="qs-nav-back" to="/">← Home</Link>
            <div className="qs-nav-pill">
              <span className="qs-pulse-dot" aria-hidden="true" />
              <span>Founding Cohort Open</span>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="qs-hero" aria-labelledby="qs-hero-title">
          <div className="qs-hero-eyebrow">
            <span>✦</span>
            <span>The modern world fractured your peace. We are building the sanctuary to reclaim it.</span>
          </div>

          <h1 id="qs-hero-title" className="qs-hero-title">
            An unsettled heart finds rest.<br />
            <span className="hl">Something profound is coming.</span>
          </h1>

          <p className="qs-subtitle">
            <strong>QalbSense</strong> is a breakthrough spiritual intelligence sanctuary designed to heal the scattered soul.
            We are weaving classical Islamic psychology (<em>Tazkiyat an-Nafs</em>), deep emotional awareness, and empathetic AI reflection
            to transform daily emotional chaos into unshakable <strong>Sakīnah</strong>.
            Not another habit tracker. A step closer to a sound heart (<em>Qalbin Salīm</em>) — by the will of Allah.
          </p>

          {/* ── FORM OR SUCCESS CARD ── */}
          {status === "success" || status === "duplicate" ? (
            <div className="qs-success-card" role="status">
              <div className="qs-s-icon" aria-hidden="true">✓</div>
              <h3>
                {status === "duplicate"
                  ? "You're already in the Founding Cohort."
                  : "You're on the Founding List!"}
              </h3>
              <p>
                {status === "duplicate"
                  ? "Your early reservation is confirmed. We will reach out as private access waves unlock."
                  : "Your spot is reserved. Watch your inbox — something extraordinary is preparing to launch."}
              </p>

              <div className="qs-signup-benefit">
                <strong>What you unlock:</strong>
                Priority Wave 1 beta access, a direct line to the founding creators, and grandfathered lifetime founding privileges.
              </div>

              {!showFollowup ? (
                <div style={{ marginTop: 20 }}>
                  <button
                    className="qs-btn-sub"
                    type="button"
                    onClick={() => setShowFollowup(true)}
                  >
                    Help shape QalbSense →
                  </button>
                </div>
              ) : followupStatus === "success" ? (
                <p style={{ marginTop: 18, color: "var(--qs-accent)", fontSize: 13 }} role="status">
                  ✓ Thank you. Your input directly influences what we build next.
                </p>
              ) : (
                <form className="qs-followup-box" onSubmit={handleFollowupSubmit}>
                  <p className="qs-followup-title">What part of your inner life needs the most healing?</p>
                  <div className="qs-interest-grid">
                    {interestOptions.map((item) => (
                      <button
                        key={item}
                        className={`qs-interest-btn${interests.includes(item) ? " selected" : ""}`}
                        type="button"
                        aria-pressed={interests.includes(item)}
                        onClick={() => toggleInterest(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="qs-followup-actions">
                    <button
                      className="qs-btn-sub"
                      type="submit"
                      disabled={interests.length === 0 || followupStatus === "submitting"}
                    >
                      {followupStatus === "submitting" ? "Saving…" : "Save Preferences"}
                    </button>
                    <button
                      className="qs-btn-skip"
                      type="button"
                      onClick={() => setShowFollowup(false)}
                    >
                      Skip
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="qs-form-box">
              <form onSubmit={handleSubmit} noValidate>
                <div className="qs-email-row">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Enter your personal email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "submitting"}
                    className={status === "invalid" ? "err" : ""}
                    aria-label="Email address"
                  />
                  <button
                    className="qs-cta-btn"
                    type="submit"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <div className="qs-spinner" aria-label="Loading..." />
                    ) : (
                      <>
                        <span>Get Early Access</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <div className="qs-err-msg" role="alert">
                    {errorMessage}
                  </div>
                )}

                <p className="qs-form-micro">
                  Strictly private. Zero noise. Founding cohort receives exclusive beta access + lifetime founder privileges.
                </p>
              </form>
            </div>
          )}

          {/* ── CURIOSITY TEASERS (Something Big is Coming) ── */}
          <div className="qs-teasers">
            <div className="qs-teaser-card">
              <span className="qs-teaser-tag">01 / The Blindspot</span>
              <h2 className="qs-teaser-title">Traditional apps track numbers. None understand your soul.</h2>
              <p className="qs-teaser-body">
                We live in chronic sensory overload. Streak counters and generic timers treat symptoms, not the underlying spiritual fatigue in your heart.
              </p>
            </div>

            <div className="qs-teaser-card">
              <span className="qs-teaser-tag">02 / The Breakthrough</span>
              <h2 className="qs-teaser-title">Sacred wisdom meets empathetic intelligence.</h2>
              <p className="qs-teaser-body">
                An intelligent companion that listens to your unspoken burdens, grounding you with tailored Quranic resonance and classical Tazkiyah frameworks.
              </p>
            </div>

            <div className="qs-teaser-card">
              <span className="qs-teaser-tag">03 / The Private Release</span>
              <h2 className="qs-teaser-title">Strictly staggered founding cohort.</h2>
              <p className="qs-teaser-body">
                Access opens in small, curated private waves to protect the depth of the experience. Early members test and shape the future of QalbSense.
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="qs-footer">
          <div className="qs-footer-copy">
            © 2026 QalbSense · Your heart is a trust.
          </div>
          <div className="qs-footer-links">
            <Link to="/">Home</Link>
            <Link to="/#privacy">Privacy</Link>
            <Link to="/#terms">Terms</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default WaitlistPage;
