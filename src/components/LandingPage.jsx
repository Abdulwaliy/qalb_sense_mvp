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
          <a href="#home">Home</a>
          <a href="#experience">Experience</a>
          <a href="#approach">Our Approach</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <Link className="landing-nav-cta" to="/waitlist">
          Join the Waitlist <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section className="landing-hero" id="home">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span /> A little space for your heart</div>
          <h1>Understand yourself. Reflect with intention. Grow with purpose.</h1>
          <p className="landing-hero-description">
            Your personal space for journaling, emotional awareness and meaningful
            self-reflection, grounded in an Islamic understanding of wellbeing.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-button landing-button-primary" to="/waitlist">
              Join the Waitlist <span aria-hidden="true">→</span>
            </Link>
            <a className="landing-text-link" href="#experience">Explore QalbSense</a>
          </div>
          <p className="landing-privacy-note">
            Early access. No spam. Unsubscribe anytime.
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
        <a className="landing-scroll-cue" href="#experience"><span /> Scroll to explore</a>
      </section>

      <section className="landing-features landing-need" id="need-for-reflection">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Need for reflection</span>
          <h2>Understanding yourself begins with <em>paying attention.</em></h2>
          <p>
            We carry thoughts and feelings through every day, yet rarely pause to
            understand them. QalbSense gives you the space to do that, gently and
            on your own terms.
          </p>
        </div>
      </section>

      <section className="landing-features" id="experience">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">The QalbSense experience</span>
          <h2>A little space to <em>understand more.</em></h2>
        </div>
        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="journal" /></span>
            <span className="landing-feature-number">01 / JOURNAL</span>
            <h3>Write freely.</h3>
            <p>A private space for your thoughts, experiences and reflections.</p>
            <span className="landing-feature-decoration" aria-hidden="true">☼</span>
          </article>
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="mood" /></span>
            <span className="landing-feature-number">02 / EMOTIONS</span>
            <h3>Notice how you feel.</h3>
            <p>Log your emotions and see how they change over time.</p>
            <span className="landing-feature-decoration" aria-hidden="true">⌁</span>
          </article>
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="reflection" /></span>
            <span className="landing-feature-number">03 / GUIDED REFLECTION</span>
            <h3>Go deeper.</h3>
            <p>
              Explore your entries with thoughtful prompts that help you reflect.
              AI supports your reflection; it doesn't replace your own insight or
              scholarly guidance.
            </p>
            <span className="landing-feature-decoration" aria-hidden="true">✧</span>
          </article>
        </div>
      </section>

      <section className="landing-intention">
        <span className="landing-intention-symbol" aria-hidden="true">۞</span>
        <p>“And He is with you wherever you are.”</p>
        <span className="landing-intention-reference">Al-Hadid 57:4</span>
        <span className="landing-intention-note">A quiet reminder to carry into the day.</span>
      </section>

      <section className="landing-how" id="approach">
        <div className="landing-how-copy">
          <span className="landing-section-kicker">Our approach</span>
          <h2>Reflection, at <em>your own pace.</em></h2>
          <p>
            No perfect words or daily streaks required. QalbSense is a place to
            notice, write and reflect in a way that feels right for you.
          </p>
          <Link className="landing-text-link landing-how-link" to="/waitlist">
            Join the Waitlist <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="landing-steps">
          <article className="landing-step">
            <span className="landing-step-number">01</span>
            <div><h3>Make space</h3><p>Pause and notice what is on your mind, without pressure.</p></div>
          </article>
          <article className="landing-step">
            <span className="landing-step-number">02</span>
            <div><h3>Explore your thoughts</h3><p>Journal freely and check in with your emotions over time.</p></div>
          </article>
          <article className="landing-step">
            <span className="landing-step-number">03</span>
            <div><h3>Reflect with intention</h3><p>Use thoughtful prompts as a companion to your own insight.</p></div>
          </article>
        </div>
      </section>

      <section className="landing-privacy" id="privacy">
        <span className="landing-section-kicker">Privacy</span>
        <h2>Your reflections are personal.</h2>
        <p>
          We believe reflection should feel like your own. We’ll be clear about
          how your information is used as QalbSense grows.
        </p>
      </section>

      <section className="landing-foundation" id="foundation">
        <div className="landing-foundation-copy">
          <span className="landing-section-kicker">Islamic foundation</span>
          <h2>Rooted in an understanding of <em>the self.</em></h2>
          <p>
            QalbSense is informed by Islamic values that encourage reflection,
            self-awareness and accountability, brought into a modern wellbeing experience.
          </p>
        </div>
      </section>

      <section className="landing-trust" id="terms">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Privacy and trust</span>
          <h2>Your personal reflections <em>deserve care.</em></h2>
        </div>
        <div className="landing-trust-grid">
          <article><span>01</span><h3>How your entries are stored</h3></article>
          <article><span>02</span><h3>How AI uses your information</h3></article>
          <article><span>03</span><h3>Who can access your data</h3></article>
          <article><span>04</span><h3>Deleting your data</h3></article>
        </div>
        <p className="landing-trust-note">
          Read our Privacy Policy
          <br />
          <small>Privacy details should reflect verified product practices.</small>
        </p>
      </section>

      <section className="landing-final-cta">
        <span className="landing-section-kicker">A little space for your heart</span>
        <h2>Make room for<br /><em>meaningful reflection.</em></h2>
        <Link className="landing-button landing-button-light" to="/waitlist">
          Join the Waitlist <span aria-hidden="true">→</span>
        </Link>
        <p>Early access. No spam. Unsubscribe anytime.</p>
        <span className="landing-cta-ornament" aria-hidden="true">✳</span>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" to="/" aria-label="QalbSense home">
          <BrandMark />
          <span>qalb<span className="landing-brand-accent">sense</span></span>
        </Link>
        <span>QalbSense is a product by Fitrah.</span>
        <nav aria-label="Footer navigation">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
          <a href="#foundation">Contact</a>
        </nav>
        <span>© 2026 Fitrah. All rights reserved.</span>
      </footer>
    </main>
  );
}

export default LandingPage;
