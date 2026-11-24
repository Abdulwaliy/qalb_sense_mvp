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
    "Journaling",
    "Emotional awareness",
    "Guided reflection",
    "Islamic reflection practices",
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
    <main className="waitlist-page">
      <header className="waitlist-header">
        <Link className="landing-brand" to="/" aria-label="QalbSense home">
          <span className="landing-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <path d="M18 4.5 21.3 13l8.2-3.1-3.1 8.2 8.5 3.3-8.5 3.3 3.1 8.2-8.2-3.1L18 36l-3.3-8.2-8.2 3.1 3.1-8.2L1 19.4l8.5-3.3-3.1-8.2 8.2 3.1L18 4.5Z" />
              <circle cx="18" cy="19.4" r="5.1" />
            </svg>
          </span>
          <span>qalb<span className="landing-brand-accent">sense</span></span>
        </Link>
        <Link className="waitlist-back-link" to="/">Back to home</Link>
      </header>

      <section className="waitlist-content" aria-labelledby="waitlist-title">
        <div className="waitlist-mark" aria-hidden="true">۞</div>
        <span className="landing-section-kicker">A little space for your heart</span>
        {status === "success" || status === "duplicate" ? (
          <div className="waitlist-success" role="status">
            <h1 id="waitlist-title">
              {status === "duplicate"
                ? "You're already on the list."
                : "You're on the list!"}
            </h1>
            <p>
              {status === "duplicate"
                ? "We'll be in touch soon."
                : "We'll be in touch when QalbSense is ready."}
            </p>

            {!showFollowup ? (
              <button
                className="landing-button landing-button-primary waitlist-followup-start"
                type="button"
                onClick={() => setShowFollowup(true)}
              >
                Help shape QalbSense <span aria-hidden="true">→</span>
              </button>
            ) : followupStatus === "success" ? (
              <p className="waitlist-followup-thanks" role="status">
                Thank you. Your feedback helps us build something meaningful.
              </p>
            ) : (
              <form className="waitlist-followup" onSubmit={handleFollowupSubmit}>
                <h2>What interests you most?</h2>
                <div className="waitlist-interest-grid">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      className={interests.includes(interest) ? "selected" : ""}
                      type="button"
                      aria-pressed={interests.includes(interest)}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {followupStatus === "error" && (
                  <p className="waitlist-error" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}
                <div className="waitlist-followup-actions">
                  <button
                    className="landing-button landing-button-primary"
                    type="submit"
                    disabled={interests.length === 0 || followupStatus === "submitting"}
                  >
                    {followupStatus === "submitting" ? "Submitting…" : "Submit"}
                  </button>
                  <button
                    className="waitlist-skip"
                    type="button"
                    onClick={() => setShowFollowup(false)}
                  >
                    Skip for now
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            <h1 id="waitlist-title">Begin your journey with QalbSense.</h1>
            <p className="waitlist-description">
              Be among the first to experience a more intentional approach to
              reflection and wellbeing.
            </p>
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <label htmlFor="waitlist-email">Email address</label>
              <div className="waitlist-input-row">
                <input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={status === "submitting"}
                  aria-invalid={status === "invalid"}
                />
                <button
                  className="landing-button landing-button-primary"
                  type="submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Adding you…" : "Join the Waitlist"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="waitlist-note">
                By joining, you agree to receive updates about QalbSense.
                {" "}
                <Link to="/#privacy">See our Privacy Policy.</Link>
              </p>
              <p className="waitlist-error" role="alert" aria-live="polite">
                {(status === "error" || status === "invalid") ? errorMessage : ""}
              </p>
            </form>
          </>
        )}
      </section>

      <footer className="waitlist-footer">
        <div className="waitlist-footer-brand">
          <span>QalbSense is a product by Fitrah.</span>
          <span>© 2026 Fitrah. All rights reserved.</span>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/#privacy">Privacy Policy</Link>
          <Link to="/#terms">Terms</Link>
          <Link to="/#foundation">Contact</Link>
        </nav>
      </footer>
    </main>
  );
}

export default WaitlistPage;
