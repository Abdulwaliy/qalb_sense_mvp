import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { observeAuthState } from "./services/authService.js";
import { isAppHost } from "./utils/domain.js";

const Auth = lazy(() => import("./components/Auth.jsx"));
const LandingPage = lazy(() => import("./components/LandingPage.jsx"));
const WaitlistPage = lazy(() => import("./components/WaitlistPage.jsx"));
const BlogPage = lazy(() => import("./components/BlogPage.jsx"));
const BlogAdmin = lazy(() => import("./components/BlogAdmin.jsx"));
const MoodHistory = lazy(() => import("./components/MoodHistory.jsx"));
const JournalHistory = lazy(() => import("./components/JournalHistory.jsx"));
const Dashboard = lazy(() => import("./components/Dashboard.jsx"));
const ReflectionHistory = lazy(() => import("./components/ReflectionHistory.jsx"));
const ComingSoon = lazy(() => import("./components/ComingSoon.jsx"));

function RouteFallback() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6ee" }} />
  );
}

function AppRoutes({ user }) {
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Auth user={user} initialMode="login" />} />
        <Route path="/signup" element={<Auth user={user} initialMode="signup" />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} />} />
      <Route path="/mood-history" element={<MoodHistory user={user} />} />
      <Route path="/journal-history" element={<JournalHistory user={user} />} />
      <Route path="/reflection-history" element={<ReflectionHistory user={user} />} />
      <Route path="/coming-soon" element={<ComingSoon user={user} />} />
      <Route path="/admin/blog" element={<BlogAdmin user={user} />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const isApp = isAppHost();
  const rawBase = import.meta.env.BASE_URL || "/";
  const baseUrl = rawBase.endsWith("/") && rawBase.length > 1 ? rawBase.slice(0, -1) : rawBase;
  const appPath = baseUrl === "/" ? "/app" : `${baseUrl}/app`;
  const isAppRoute =
    isApp ||
    window.location.pathname.startsWith(appPath) ||
    window.location.pathname.startsWith("/app");

  useEffect(() => {
    const unsubscribe = observeAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAppRoute) {
      setSplashDone(true);
      return;
    }
    const timer = setTimeout(() => setSplashDone(true), 5000);
    return () => clearTimeout(timer);
  }, [isAppRoute]);

  if ((loading || !splashDone) && isAppRoute) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 42%, rgba(22, 119, 84, 0.10), transparent 60%), #f5f7f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            width: 44,
            height: 44,
            margin: "0 auto 18px",
            borderRadius: 14,
            background: "#eef6f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 36 36">
              <path d="M18 4.5 21.3 13l8.2-3.1-3.1 8.2 8.5 3.3-8.5 3.3 3.1 8.2-8.2-3.1L18 36l-3.3-8.2-8.2 3.1 3.1-8.2L1 19.4l8.5-3.3-3.1-8.2 8.2 3.1L18 4.5Z" fill="#167754" />
              <circle cx="18" cy="19.4" r="5.1" fill="#eef6f0" />
            </svg>
          </div>
          <p dir="rtl" lang="ar" style={{
            margin: "0 0 12px",
            fontFamily: "'Amiri', 'Playfair Display', serif",
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1.7,
            color: "#112117",
          }}>
            إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ
          </p>
          <p style={{
            margin: "0 0 14px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "16.5px",
            fontStyle: "italic",
            lineHeight: 1.6,
            color: "#24392c",
          }}>
            “Except one who comes to Allah with a sound heart.”
          </p>
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 999,
            background: "#f5f8f3",
            border: "1px solid #dbe6d8",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#167754",
          }}>
            Surah Ash-Shu‘arā’ 26:89
          </span>
          <p style={{
            margin: "20px 0 0",
            fontSize: "11.5px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6c8073",
            fontWeight: 600,
          }}>
            Preparing your sanctuary…
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 1. LOCAL DEV / REPO PATH FALLBACK (e.g. /app or /qalb_sense_mvp/app)
  // ─────────────────────────────────────────────────────────────
  if (window.location.pathname.startsWith(appPath) || window.location.pathname.startsWith("/app")) {
    return (
      <Router basename={appPath}>
        <Suspense fallback={<RouteFallback />}>
          <AppRoutes user={user} />
        </Suspense>
      </Router>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. APP SUBDOMAIN (e.g. app.qalbsense.com / app.localhost:5173)
  // ─────────────────────────────────────────────────────────────
  if (isApp) {
    return (
      <Router basename="/">
        <Suspense fallback={<RouteFallback />}>
          <AppRoutes user={user} />
        </Suspense>
      </Router>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. LANDING PAGE DOMAIN (e.g. qalbsense.com / localhost / GitHub Pages)
  // ─────────────────────────────────────────────────────────────
  return (
    <Router basename={baseUrl}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/admin/blog" element={<BlogAdmin user={user} />} />
          <Route path="/login" element={<Auth user={user} initialMode="login" />} />
          <Route path="/signup" element={<Auth user={user} initialMode="signup" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
