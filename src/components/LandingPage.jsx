import { Link } from "react-router-dom";
import "./LandingPage.css";

function BrandMark() {
  return (
    <span className="landing-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <path d="M18 4.5 21.3 13l8.2-3.1-3.1 8.2 8.5 3.3-8.5 3.3 3.1 8.2-8.2-3.1L18 36l-3.3-8.2-8.2 3.1 3.1-8.2L1 19.4l8.5-3.3-3.1-8.2 8.2 3.1L18 4.5Z" />
        <circle cx="18" cy="19.4" r="5.1" />
      </svg>
    </span>
  );
}

function FeatureIcon({ type }) {
  if (type === "mood") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="11.5" />
        <path d="M11.5 18.5c1.1 1.7 2.6 2.5 4.5 2.5s3.4-.8 4.5-2.5M12 13h.1m7.8 0h.1" />
      </svg>
    );
  }
  if (type === "journal") {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9 5.5h11l4 4v17H9v-21Z" />
        <path d="M19.5 5.5v5h4.5M13 15h7m-7 4h7m-7 4h4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4.5 19 12l7.5-2.8-2.8 7.5 7.8 3-7.8 3 2.8 7.5L19 27.4 16 35l-3-7.6-7.5 2.8 2.8-7.5-7.8-3 7.8-3-2.8-7.5 7.5 2.8 3-7.5Z" transform="translate(0 -3.5)" />
      <circle cx="16" cy="16" r="4" />
    </svg>
  );
}

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="QalbSense home">
          <BrandMark />
          <span>qalb<span className="landing-brand-accent">sense</span></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#features">The experience</a>
          <a href="#how-it-works">How it works</a>
          <a href="#our-intention">Our intention</a>
        </nav>
        <Link className="landing-nav-cta" to="/login">Sign in <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span /> A little space for your heart</div>
          <h1>A calmer heart begins with <em>a moment for you.</em></h1>
          <p className="landing-hero-description">
            A gentle place to check in, write what is on your mind, and find
            faith-centered reflections for the moments in between.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-button landing-button-primary" to="/signup">
              Begin your journey <span aria-hidden="true">→</span>
            </Link>
            <a className="landing-text-link" href="#features">Get to know QalbSense</a>
          </div>
          <p className="landing-privacy-note">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="2" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            Your reflections are yours. Always.
          </p>
        </div>

        <div className="landing-hero-art" aria-label="A preview of the QalbSense daily check-in">
          <div className="landing-art-halo" />
          <div className="landing-art-spark landing-art-spark-one">✳</div>
          <div className="landing-art-spark landing-art-spark-two">✦</div>
          <div className="landing-reminder-card">
            <span className="landing-reminder-icon">✧</span>
            <span><strong>A gentle reminder</strong><small>Take a breath. You are here.</small></span>
          </div>
          <div className="landing-checkin-card">
            <div className="landing-checkin-top">
              <span className="landing-mini-mark"><BrandMark /></span>
              <span>YOUR DAILY CHECK-IN</span>
              <span className="landing-checkin-dots" aria-hidden="true">···</span>
            </div>
            <div className="landing-checkin-greeting">
              <span>Tuesday, 17 November</span>
              <h2>How is your heart<br />feeling today?</h2>
            </div>
            <div className="landing-mood-row" aria-hidden="true">
              <span><i>😊</i><small>Good</small></span>
              <span className="landing-mood-selected"><i>😌</i><small>Calm</small></span>
              <span><i>😔</i><small>Low</small></span>
              <span><i>😰</i><small>Anxious</small></span>
            </div>
            <div className="landing-checkin-divider" />
            <div className="landing-note-preview">
              <span className="landing-note-icon">✎</span>
              <span><strong>A moment to reflect</strong><small>Give your thoughts a place to land...</small></span>
              <span className="landing-note-arrow">↗</span>
            </div>
            <div className="landing-checkin-footer">
              <span>One moment at a time</span><span className="landing-footer-spark">✦</span>
            </div>
          </div>
          <div className="landing-verse-card">
            <span className="landing-verse-ornament" aria-hidden="true">۞</span>
            <span>“Surely in the remembrance of Allah<br />do hearts find comfort.”</span>
            <small>Qur’an 13:28</small>
          </div>
        </div>
        <a className="landing-scroll-cue" href="#features"><span /> Scroll to explore</a>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">A practice, not a pressure</span>
          <h2>Meet yourself where <em>you are.</em></h2>
          <p>Small, meaningful moments can make space for a little more understanding and a little more ease.</p>
        </div>
        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="mood" /></span>
            <span className="landing-feature-number">01 / CHECK IN</span>
            <h3>Name what you feel</h3>
            <p>Pause and notice your mood without judgment. Over time, gentle check-ins can help you see your patterns more clearly.</p>
            <span className="landing-feature-decoration" aria-hidden="true">☼</span>
          </article>
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="journal" /></span>
            <span className="landing-feature-number">02 / JOURNAL</span>
            <h3>Let your thoughts land</h3>
            <p>Put the day into words in a private journal, whether you have a lot to say or just a little.</p>
            <span className="landing-feature-decoration" aria-hidden="true">⌁</span>
          </article>
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="reflection" /></span>
            <span className="landing-feature-number">03 / REFLECT</span>
            <h3>Find a thoughtful pause</h3>
            <p>Receive a compassionate, faith-centered reflection to help you sit with what is on your heart.</p>
            <span className="landing-feature-decoration" aria-hidden="true">✧</span>
          </article>
        </div>
      </section>

      <section className="landing-intention" id="our-intention">
        <span className="landing-intention-symbol" aria-hidden="true">۞</span>
        <p>“And He is with you wherever you are.”</p>
        <span className="landing-intention-reference">Al-Hadid 57:4</span>
        <span className="landing-intention-note">A quiet reminder to carry into the day.</span>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="landing-how-copy">
          <span className="landing-section-kicker">Your own gentle rhythm</span>
          <h2>Come as you are.<br /><em>Start wherever you are.</em></h2>
          <p>There is no perfect way to begin. QalbSense is here for the real, ordinary moments that make up a life.</p>
          <Link className="landing-text-link landing-how-link" to="/signup">Make space for yourself <span aria-hidden="true">→</span></Link>
        </div>
        <div className="landing-steps">
          <article className="landing-step">
            <span className="landing-step-number">01</span>
            <div><h3>Take a breath</h3><p>Arrive just as you are. There is no score and nothing to get right.</p></div>
          </article>
          <article className="landing-step">
            <span className="landing-step-number">02</span>
            <div><h3>Check in honestly</h3><p>Choose a mood, write a few words, or simply notice what is present.</p></div>
          </article>
          <article className="landing-step">
            <span className="landing-step-number">03</span>
            <div><h3>Carry a little clarity</h3><p>Reflect on your experience with a gentle reminder rooted in faith.</p></div>
          </article>
        </div>
      </section>

      <section className="landing-final-cta">
        <span className="landing-section-kicker">Your heart deserves this care</span>
        <h2>A softer moment can<br /><em>start right here.</em></h2>
        <Link className="landing-button landing-button-light" to="/signup">Create your space <span aria-hidden="true">→</span></Link>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
        <span className="landing-cta-ornament" aria-hidden="true">✳</span>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" to="/" aria-label="QalbSense home">
          <BrandMark />
          <span>qalb<span className="landing-brand-accent">sense</span></span>
        </Link>
        <span>A little space for your heart.</span>
        <span>Made with care <span aria-hidden="true">✦</span></span>
      </footer>
    </main>
  );
}

export default LandingPage;
