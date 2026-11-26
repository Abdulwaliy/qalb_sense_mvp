import { Link } from "react-router-dom";
import AppPreviewShowcase from "./AppPreviewShowcase.jsx";
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

const PSYCHOLOGY_TERMS = [
  { ar: "القلب", en: "Al-Qalb", sub: "The Spiritual Heart", top: "2.2%", left: "2.5%", deg: "-2deg", type: "emerald" },
  { ar: "السكينة", en: "As-Sakīnah", sub: "Divine Tranquility", top: "7%", right: "2.5%", deg: "3deg", type: "gold" },
  { ar: "المحاسبة", en: "Al-Muḥāsabah", sub: "Mindful Self-Reckoning", top: "13.5%", left: "2.5%", deg: "1deg" },
  { ar: "التزكية", en: "At-Tazkiyah", sub: "Soul Purification", top: "19%", right: "2.5%", deg: "-3deg", type: "emerald" },
  { ar: "الفطرة", en: "Al-Fiṭrah", sub: "Primordial Pure State", top: "24.5%", left: "2.5%", deg: "-1deg", type: "gold" },
  { ar: "المراقبة", en: "Al-Murāqabah", sub: "Constant Divine Presence", top: "30.5%", right: "2.5%", deg: "2deg" },
  { ar: "التفكر", en: "At-Tafakkur", sub: "Deep Reflection", top: "35.5%", left: "2.5%", deg: "-2deg", type: "emerald" },
  { ar: "التدبر", en: "At-Tadabbur", sub: "Sacred Contemplation", top: "41%", left: "2.5%", deg: "2deg", type: "gold" },
  { ar: "الاطمئنان", en: "Iṭmi’nān", sub: "Deep Inner Serenity", top: "45.5%", right: "2.5%", deg: "2deg", type: "gold" },
  { ar: "البصيرة", en: "Al-Baṣīrah", sub: "Spiritual Inner Sight", top: "50.5%", left: "2.5%", deg: "-1deg" },
  { ar: "الروح والعقل", en: "Ar-Rūḥ wal-‘Aql", sub: "Spirit & Intellect", top: "63.5%", right: "2.5%", deg: "3deg", type: "emerald" },
  { ar: "الإخلاص", en: "Al-Ikhlāṣ", sub: "Purity of Intention", top: "67.5%", left: "2.5%", deg: "-2deg", type: "gold" },
  { ar: "التوكل", en: "At-Tawakkul", sub: "Sacred Reliance on Allah", top: "72%", right: "2.5%", deg: "1deg" },
  { ar: "الصبر والشكر", en: "Ṣabr & Shukr", sub: "Patience & Gratitude", top: "76.5%", left: "2.5%", deg: "-2deg", type: "emerald" },
  { ar: "الرضا", en: "Ar-Riḍā", sub: "Divine Contentment", top: "80.5%", right: "2.5%", deg: "2deg", type: "gold" },
  { ar: "الاستقامة", en: "Al-Istiqāmah", sub: "Steadfast Consistency", top: "94.5%", left: "2.5%", deg: "1deg" },
  { ar: "سلام القلب", en: "Salām al-Qalb", sub: "Peace of the Heart", top: "95.5%", right: "2.5%", deg: "-2deg", type: "emerald" },
];

function LandingPage() {
  return (
    <main className="landing-page">
      {/* ── STILL BACKGROUND SCATTER OF ISLAMIC PSYCHOLOGY TERMS ── */}
      <div className="landing-bg-terms" aria-hidden="true">
        {PSYCHOLOGY_TERMS.map((term, i) => (
          <div
            key={i}
            className={`landing-term-item ${term.type || ""}`}
            style={{
              top: term.top,
              left: term.left || "auto",
              right: term.right || "auto",
              transform: `rotate(${term.deg || "0deg"})`,
            }}
          >
            <span className="ar">{term.ar}</span>
            <span className="en">{term.en}</span>
            <span className="sub">{term.sub}</span>
          </div>
        ))}
      </div>

      {/* ── HEADER ── */}
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="QalbSense home">
          <BrandMark />
          <span>qalb<span className="landing-brand-accent">sense</span></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#approach">Our Approach</a>
          <Link to="/blog">Tazkiyah Blog</Link>
          <a href="#privacy">Privacy</a>
        </nav>
        <Link className="landing-nav-cta" to="/waitlist">
          Join the Waitlist <span aria-hidden="true">→</span>
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow">
            <span /> Islamic Personal Development & Tazkiyat an-Nafs
          </div>
          <h1>
            Heal the heart.<br />
            Align the soul.<br />
            Grow with <em>prophetic purpose.</em>
          </h1>
          <p style={{
            margin: "16px 0 0",
            fontSize: 15,
            fontWeight: 700,
            color: "#0d5f3f",
            letterSpacing: "-0.01em",
          }}>
            Sense your heart. Learn <em>Tazkiyah</em>. Return to Allah.
            <span style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "#384e40", marginTop: 3 }}>
              Grounded in revelation. Dedicated to healing the heart.
            </span>
          </p>
          <p className="landing-hero-description">
            The modern world overstimulates the mind while starving the soul. QalbSense
            is your daily sanctuary for <strong>Muhāsabah</strong> (mindful self-reckoning),
            emotional awareness, and <strong>Tafakkur</strong> (sacred reflection)—grounded
            in classical Islamic psychology (<em>Tazkiyat an-Nafs</em>) according to the
            Quran and Sunnah.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-button landing-button-primary" to="/waitlist">
              Join the Waitlist <span aria-hidden="true">→</span>
            </Link>
            <a className="landing-text-link" href="#experience">Explore Our Method ↓</a>
          </div>
          <p className="landing-privacy-note">
            An Amanah of privacy. No noise. Strictly rooted in Quran & Sunnah.
          </p>
        </div>

        {/* ── HERO VISUAL MOCKUP ── */}
        <div className="landing-hero-art" aria-label="A preview of the QalbSense daily Muhasabah check-in">
          <div className="landing-art-halo" />
          <div className="landing-art-spark landing-art-spark-one">✳</div>
          <div className="landing-art-spark landing-art-spark-two">✦</div>

          <div className="landing-reminder-card">
            <span className="landing-reminder-icon">✧</span>
            <span>
              <strong>Prophetic Reminder</strong>
              <small>“In the body there is a piece of flesh: if sound, the whole body is sound... It is the Qalb.”</small>
            </span>
          </div>

          <div className="landing-checkin-card">
            <div className="landing-checkin-top">
              <span className="landing-mini-mark"><BrandMark /></span>
              <span>DAILY MUHĀSABAH · مُحَاسَبَة</span>
              <span className="landing-checkin-dots" aria-hidden="true">···</span>
            </div>
            <div className="landing-checkin-greeting">
              <span>Morning Check-in · الصباح</span>
              <h2>How is the state of<br />your Qalb today?</h2>
            </div>
            <div className="landing-mood-row" aria-hidden="true">
              <span><i>🌿</i><small>Al-Basṭ</small></span>
              <span className="landing-mood-selected"><i>🕊️</i><small>Sakīnah</small></span>
              <span><i>🌊</i><small>Al-Qalaq</small></span>
              <span><i>🌧️</i><small>Al-Qabḍ</small></span>
            </div>
            <div className="landing-checkin-divider" />
            <div className="landing-note-preview">
              <span className="landing-note-icon">🎙️</span>
              <span>
                <strong>Muḥāsabah · Write or Speak</strong>
                <small>Guided prompts & closing Du‘ā’…</small>
              </span>
              <span className="landing-note-arrow">↗</span>
            </div>
            <div className="landing-checkin-footer">
              <span>✓ Verified Qur’an · ▶ Audio · Tafsir</span>
              <span className="landing-footer-spark">✦</span>
            </div>
          </div>

          <div className="landing-verse-card">
            <span className="landing-verse-ornament" aria-hidden="true">۞</span>
            <span>
              “Surely in the remembrance of Allah<br />
              do hearts find comfort.”
            </span>
            <small>Surah Ar-Ra’d 13:28</small>
          </div>
        </div>

        <a className="landing-scroll-cue" href="#experience"><span /> Scroll to explore</a>
      </section>

      {/* ── THE NEED FOR ISLAMIC REFLECTION (THE DILEMMA) ── */}
      <section className="landing-features landing-need" id="need-for-reflection">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">The Lost Sunnah of Muhāsabah</span>
          <h2>Modern self-help feeds the ego.<br /><em>Islamic psychology purifies the heart.</em></h2>
          <p>
            Modern personal development focuses on worldly productivity, self-reliance, and algorithmic hustle—often
            leaving the soul fractured and spiritually depleted. True wellness begins within the <strong>Qalb</strong>.
            Sayyiduna Umar ibn al-Khattab (<span lang="ar" dir="rtl">رضي الله عنه</span>) counseled: <em>“Hold yourselves to account before you are held to account,
            and weigh your deeds before they are weighed for you.”</em> QalbSense revives this prophetic discipline,
            guiding the modern Muslim from the chaos of the ego (<em>Nafs</em>) to the serenity of divine contentment (<em>Rida</em>).
          </p>
        </div>
      </section>

      {/* ── THE THREE PILLARS OF TAZKIYAH ── */}
      <section className="landing-features" id="experience">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">The Three Pillars of Tazkiyah</span>
          <h2>A holistic sanctuary for <em>the heart and soul.</em></h2>
        </div>
        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="journal" /></span>
            <span className="landing-feature-number">01 / <span lang="ar" dir="rtl">المحاسبة</span> · MUHĀSABAH</span>
            <h3>Pour Out Your Burdens with Sincerity (Ikhlāṣ)</h3>
            <p>
              Write or speak hands-free with mood-aware <em>Muḥāsabah</em> prompts, auto-saved drafts, and a closing personal Du‘ā’—a quiet, unjudged space before your Lord.
            </p>
            <span className="landing-feature-decoration" aria-hidden="true">☼</span>
          </article>

          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="mood" /></span>
            <span className="landing-feature-number">02 / <span lang="ar" dir="rtl">فهم النفس</span> · FAHM AN-NAFS</span>
            <h3>Witness the Shifting Tides of Your Heart</h3>
            <p>
              Name your inner state across 20 nuanced Islamic psychology emotions—from <em>Qabḍ</em>, <em>Waswās</em>, and <em>Nadam</em> to <em>Sakīnah</em>—calibrated by intensity and tracked over time.
            </p>
            <span className="landing-feature-decoration" aria-hidden="true">⌁</span>
          </article>

          <article className="landing-feature-card">
            <span className="landing-feature-icon"><FeatureIcon type="reflection" /></span>
            <span className="landing-feature-number">03 / <span lang="ar" dir="rtl">التفكر</span> · AT-TAFAKKUR</span>
            <h3>Grounded Reflections from Qur’an & Sunnah</h3>
            <p>
              Receive 5-part <em>Tazkiyah</em> reflections paired with verified Qur’anic Ayat, recitation audio, Tafsir Ibn Kathir, and trackable Sunnah action steps (<em>‘Amal</em>).
            </p>
            <span className="landing-feature-decoration" aria-hidden="true">✧</span>
          </article>
        </div>
      </section>

      {/* ── INTERACTIVE APP PREVIEW (AHMAD'S SANCTUARY) ── */}
      <AppPreviewShowcase />

      {/* ── SACRED INTENTION AYAH BANNER ── */}
      <section className="landing-intention">
        <span className="landing-intention-symbol" aria-hidden="true">۞</span>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 28px)", marginBottom: 8, direction: "rtl" }}>
          قَدْ أَفْلَحَ مَن زَكَّاهَا ۝ وَقَدْ خَابَ مَن دَسَّاهَا
        </p>
        <p style={{ fontStyle: "italic", maxWidth: 680, margin: "0 auto 8px" }}>
          “He has succeeded who purifies the soul, and he has failed who corrupts it.”
        </p>
        <span className="landing-intention-reference">Surah Ash-Shams 91:9–10</span>
        <span className="landing-intention-note">The eternal divine blueprint for human development.</span>
      </section>

      {/* ── OUR APPROACH (THE PROPHETIC RHYTHM) ── */}
      <section className="landing-how" id="approach">
        <div className="landing-how-copy">
          <span className="landing-section-kicker">The Prophetic Rhythm</span>
          <h2>Gentle consistency, <em>not spiritual burnout.</em></h2>
          <p>
            Islam honors human limits. The Prophet Muhammad ﷺ taught: <em>“The most beloved of deeds to Allah are those that are consistent, even if they are few.”</em> QalbSense replaces guilt-driven productivity streaks with compassionate, lifelong spiritual calibration.
          </p>
          <Link className="landing-text-link landing-how-link" to="/waitlist">
            Join the Waitlist <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="landing-steps">
          <article className="landing-step">
            <span className="landing-step-number">01</span>
            <div>
              <h3>Waqfah (<span lang="ar" dir="rtl">وقفة</span> · The Mindful Pause)</h3>
              <p>Step away from the relentless digital noise. Recite Bismillah, breathe, and bring your heart into the present presence of Allah (<em>Muraqabah</em>).</p>
            </div>
          </article>

          <article className="landing-step">
            <span className="landing-step-number">02</span>
            <div>
              <h3>Kashf (<span lang="ar" dir="rtl">كشف</span> · Honest Self-Naming)</h3>
              <p>Acknowledge your emotional reality without shame. Whether wrestling with grief, anxiety, anger, or feeling spiritually numb, bring it into the light of divine mercy.</p>
            </div>
          </article>

          <article className="landing-step">
            <span className="landing-step-number">03</span>
            <div>
              <h3>Tadabbur (<span lang="ar" dir="rtl">التدبر</span>) & Du’a (Divine Realignment)</h3>
              <p>Receive an Ayah of the moment with audio recitation and Tafsir, practice a concrete Sunnah action step, and seal your session by saving a personal Du‘ā’.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ── QUR'AN AS A CURE (SHIFA) FOR THE HEART ── */}
      <section
        className="landing-features"
        style={{
          paddingTop: 84,
          paddingBottom: 84,
          background: "radial-gradient(ellipse at 50% 0%, rgba(22, 119, 84, 0.28), transparent 62%), #0b3325",
          color: "#ffffff",
          borderTop: "1px solid rgba(167, 220, 180, 0.16)",
          borderBottom: "1px solid rgba(167, 220, 180, 0.16)",
        }}
      >
        <div className="landing-section-heading" style={{ maxWidth: 820, marginBottom: 0 }}>
          <span className="landing-section-kicker" style={{ color: "#a7dcb4" }}>
            <span lang="ar" dir="rtl">شِفَاءٌ لِّمَا فِي الصُّدُورِ</span> · The Qur’an as a Cure
          </span>
          <h2 style={{ color: "#ffffff" }}>
            The Qur’an is not only recited—<em style={{ color: "#8de3b1" }}>it is a healing for the heart.</em>
          </h2>
          <p style={{ marginBottom: 28, color: "#dceadc" }}>
            Modern hearts ache from grief, doubt, and inner restlessness that worldly distractions cannot mend. Allah Himself revealed the Qur’an as a direct cure (<em>Shifā’</em>) for what weighs inside the heart:
          </p>

          <div
            style={{
              padding: "30px 28px",
              borderRadius: 20,
              border: "1px solid rgba(167, 220, 180, 0.28)",
              background: "rgba(255, 255, 255, 0.06)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.24)",
              textAlign: "center",
            }}
          >
            <p
              dir="rtl"
              lang="ar"
              style={{
                margin: "0 0 16px",
                fontFamily: "'Amiri', 'Playfair Display', serif",
                fontSize: "clamp(22px, 3vw, 29px)",
                fontWeight: 700,
                lineHeight: 1.9,
                color: "#ffffff",
              }}
            >
              يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ
            </p>
            <p
              style={{
                margin: "0 auto 16px",
                maxWidth: 700,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 15.5,
                fontStyle: "italic",
                lineHeight: 1.75,
                color: "#eef6ee",
              }}
            >
              “O mankind! There has come to you a good advice from your Lord (i.e. the Qur’ân, enjoining all that is good and forbidding all that is evil), and a healing for that (disease of ignorance, doubt, hypocrisy and differences) which is in your hearts, - a guidance and a mercy (explaining lawful and unlawful things) for the believers.”
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "5px 14px",
                borderRadius: 999,
                background: "rgba(141, 227, 177, 0.14)",
                border: "1px solid rgba(141, 227, 177, 0.35)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#a7dcb4",
              }}
            >
              Surah Yūnus 10:57 (Hilali–Khan)
            </span>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {[
                "1. Maw‘iẓah · Good Advice",
                "2. Shifā’ · Healing for the Hearts",
                "3. Hudan · Clear Guidance",
                "4. Raḥmah · Divine Mercy",
              ].map((pill) => (
                <span
                  key={pill}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#e6f4e2",
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ISLAMIC PSYCHOLOGY FOUNDATION ── */}
      <section className="landing-foundation" id="foundation">
        <div className="landing-foundation-copy">
          <span className="landing-section-kicker">Islamic Psychology Heritage</span>
          <h2>Rooted in 14 centuries of <em>sacred soul-care.</em></h2>
          <p>
            Centuries before modern psychology emerged, giants of Islamic thought—such as Imam Ibn Taymiyyah (<em>Amrad al-Qulub</em>), Imam al-Ghazali (<em>Ihya Ulum al-Din</em>), Ibn al-Qayyim (<em>Madarij al-Salikin</em>), and Abu Zayd al-Balkhi (<em>Sustenance of the Soul</em>)—mapped the intricate interplay between the mind (<em>‘Aql</em>), the emotions (<em>Nafs</em>), and the spiritual heart (<em>Qalb</em>).
          </p>
          <p style={{ marginTop: 14 }}>
            QalbSense synthesizes this profound prophetic heritage with intuitive modern technology—giving the modern Muslim an intentional daily companion that honors both human psychological depth and eternal spiritual destiny.
          </p>
          <Link className="landing-text-link landing-how-link" to="/blog" style={{ marginTop: 22, display: "inline-flex" }}>
            Explore Tazkiyah Journal (Blog) <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ── PRIVACY AND AMANAH ── */}
      <section className="landing-trust" id="privacy">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">An Amanah (Sacred Trust)</span>
          <h2>Your personal reflections <em>are private and protected.</em></h2>
          <p className="landing-trust-lead">
            In Islam, privacy is a solemn moral covenant (<em>Amanah</em>). What you share in your moments of vulnerability remains strictly between you and your Creator.
          </p>
        </div>
        <div className="landing-trust-grid">
          <article>
            <span>01</span>
            <h3>Confidential Sanctuary</h3>
            <p>
              Private to your account, protected by strict per-user access controls.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Faith-Anchored AI</h3>
            <p>
              Guided by strict Qur’an, Sunnah, and scope guardrails for genuine <em>Muḥāsabah</em>.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Your Journey, Your Keepsakes</h3>
            <p>
              Bookmark meaningful reflections, track practiced Sunnah steps, and revisit your Du‘ā’s anytime.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Zero Behavioral Advertising</h3>
            <p>
              No ad tracking, no algorithmic manipulation, and no selling of your data.
            </p>
          </article>
        </div>
        <p className="landing-trust-note">
          Read our Privacy Policy & Ethical Commitments
        </p>
      </section>

      {/* ── FINAL CALL TO ACTION ── */}
      <section className="landing-final-cta">
        <span className="landing-section-kicker">Begin with Bismillah</span>
        <h2>
          Move closer to a sound heart<br />
          <em>(Qalbin Salīm) — by the will of Allah.</em>
        </h2>
        <Link className="landing-button landing-button-light" to="/waitlist">
          Join the Waitlist <span aria-hidden="true">→</span>
        </Link>
        <p>Early founding cohort access. Rooted in Qur’an & Sunnah. One gentle step at a time, bi’idhnillāh.</p>
        <span className="landing-cta-ornament" aria-hidden="true">✳</span>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-top">
            <div className="landing-footer-brand">
              <Link className="landing-brand" to="/" aria-label="QalbSense home">
                <BrandMark />
                <span>qalb<span className="landing-brand-accent">sense</span></span>
              </Link>
              <p className="landing-footer-motto">
                Sense your heart. Learn Tazkiyah. Return to Allah.
              </p>
              <p className="landing-footer-desc">
                Grounded in revelation. Dedicated to healing the heart. An Islamic Personal Development Product by Fitrah.
              </p>
            </div>

            <nav className="landing-footer-col" aria-label="Explore sections">
              <span className="landing-footer-heading">Explore</span>
              <a href="#approach">Our Approach</a>
              <a href="#shifa">Qur’an as Shifā’</a>
              <a href="#foundation">Islamic Heritage</a>
              <a href="#privacy">Amanah & Privacy</a>
            </nav>

            <nav className="landing-footer-col" aria-label="Platform links">
              <span className="landing-footer-heading">Platform</span>
              <Link to="/blog">Tazkiyah Blog</Link>
              <Link to="/waitlist">Join the Waitlist</Link>
              <Link to="/auth">Sign In</Link>
              <button
                type="button"
                className="landing-footer-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top <span aria-hidden="true">↑</span>
              </button>
            </nav>
          </div>

          <div className="landing-footer-bottom">
            <span>© 2026 Fitrah. All rights reserved.</span>
            <span className="landing-footer-amanah">Built with care as an Amanah · Bi’idhnillāh</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
