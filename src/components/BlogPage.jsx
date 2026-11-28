import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../data/blogPosts.js";
import { getPublishedBlogs } from "../services/blogService.js";
import "./LandingPage.css";
import "./BlogPage.css";

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

function BlogHeader() {
  return (
    <header className="landing-header">
      <Link className="landing-brand" to="/" aria-label="QalbSense home">
        <BrandMark />
        <span>qalb<span className="landing-brand-accent">sense</span></span>
      </Link>
      <nav className="landing-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/#approach">Our Approach</Link>
        <Link to="/blog">Tazkiyah Blog</Link>
        <Link to="/#privacy">Privacy</Link>
      </nav>
      <Link className="landing-nav-cta" to="/waitlist">
        Join the Waitlist <span aria-hidden="true">→</span>
      </Link>
    </header>
  );
}

function BlogFooter() {
  return (
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
            <Link to="/">Home</Link>
            <Link to="/#approach">Our Approach</Link>
            <Link to="/#foundation">Islamic Heritage</Link>
            <Link to="/#privacy">Amanah & Privacy</Link>
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
  );
}

function BlogPage() {
  const { slug } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState(BLOG_POSTS);

  useEffect(() => {
    let active = true;
    getPublishedBlogs().then((loaded) => {
      if (active && Array.isArray(loaded) && loaded.length > 0) {
        setPosts(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (slug) {
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return (
        <main className="blog-page">
          <BlogHeader />
          <div className="blog-article-wrap" style={{ textAlign: "center" }}>
            <h1>Essay not found</h1>
            <p style={{ color: "#31493b", marginBottom: 24 }}>
              The essay you are looking for is not available.
            </p>
            <Link className="blog-back-link" to="/blog">
              ← Back to Tazkiyah Journal
            </Link>
          </div>
          <BlogFooter />
        </main>
      );
    }

    return (
      <main className="blog-page">
        <BlogHeader />
        <article className="blog-article-wrap">
          <Link className="blog-back-link" to="/blog">
            ← Back to all essays
          </Link>

          <div className="blog-article-card">
            <div className="blog-article-header">
              <span className="blog-category-tag">{post.category}</span>
              <div className="blog-card-arabic" style={{ marginTop: 14 }} dir="rtl" lang="ar">
                {post.arabicTitle}
              </div>
              <h1>{post.title}</h1>
              <div className="blog-article-byline">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            {post.keyTakeaways?.length > 0 && (
              <div className="blog-takeaways">
                <strong>Key Takeaways</strong>
                <ul>
                  {post.keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {post.sections.map((sec, idx) => (
              <section key={idx} className="blog-section">
                <h2>{sec.heading}</h2>
                {sec.quote && (
                  <div className="blog-quote-box">
                    {sec.quote.arabic && (
                      <p className="blog-quote-arabic" dir="rtl" lang="ar">
                        {sec.quote.arabic}
                      </p>
                    )}
                    <p className="blog-quote-text">{sec.quote.text}</p>
                    <span className="blog-quote-source">{sec.quote.source}</span>
                  </div>
                )}
                {sec.body.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </section>
            ))}

            <div className="blog-article-cta">
              <h3>Practice daily Muḥāsabah with QalbSense</h3>
              <p>
                Turn these timeless principles of Tazkiyat an-Nafs into a gentle, private daily habit grounded in the Qur’an and Sunnah.
              </p>
              <Link className="landing-button landing-button-light" to="/waitlist">
                Join the Waitlist <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>
        <BlogFooter />
      </main>
    );
  }

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <main className="blog-page">
      <BlogHeader />

      <section className="blog-hero">
        <div className="blog-arabic-motif" dir="rtl" lang="ar">
          التزكية والمعرفة
        </div>
        <span className="landing-section-kicker">Tazkiyah Journal · Educational Library</span>
        <h1>
          Essays on <em>Tazkiyat an-Nafs</em> & Islamic Psychology
        </h1>
        <p>
          Explore authentic teachings from the Qur’an, Sunnah, and 14 centuries of Islamic soul-care—written to help the modern Muslim understand and nurture the heart.
        </p>
      </section>

      <div className="blog-filters" role="tablist" aria-label="Blog categories">
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`blog-filter-pill${selectedCategory === cat ? " active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="blog-grid">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="blog-card">
            <div className="blog-card-top">
              <span className="blog-category-tag">{post.category}</span>
              <span className="blog-meta-time">{post.readTime}</span>
            </div>
            <div className="blog-card-arabic" dir="rtl" lang="ar">
              {post.arabicTitle}
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link className="blog-read-link" to={`/blog/${post.slug}`}>
              Read Essay <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      <BlogFooter />
    </main>
  );
}

export default BlogPage;
