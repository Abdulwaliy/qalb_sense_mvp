import { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { observeAuthState } from "./services/authService.js";
import Auth from "./components/Auth.jsx";
import LandingPage from "./components/LandingPage.jsx";
import MoodHistory from "./components/MoodHistory.jsx";
import JournalHistory from "./components/JournalHistory.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ReflectionHistory from "./components/ReflectionHistory.jsx";
import { isAppHost } from "./utils/domain.js";

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
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isApp = isAppHost();
  const rawBase = import.meta.env.BASE_URL || "/";
  const baseUrl = rawBase.endsWith("/") && rawBase.length > 1 ? rawBase.slice(0, -1) : rawBase;

  useEffect(() => {
    const unsubscribe = observeAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a1a13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#c9a346",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "20px",
        letterSpacing: "0.1em"
      }}>
        Loading QalbSense…
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 1. LOCAL DEV / REPO PATH FALLBACK (e.g. /app or /qalb_sense_mvp/app)
  // ─────────────────────────────────────────────────────────────
  const appPath = baseUrl === "/" ? "/app" : `${baseUrl}/app`;
  if (window.location.pathname.startsWith(appPath) || window.location.pathname.startsWith("/app")) {
    return (
      <Router basename={appPath}>
        <AppRoutes user={user} />
      </Router>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. APP SUBDOMAIN (e.g. app.qalbsense.com / app.localhost:5173)
  // ─────────────────────────────────────────────────────────────
  if (isApp) {
    return (
      <Router basename="/">
        <AppRoutes user={user} />
      </Router>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. LANDING PAGE DOMAIN (e.g. qalbsense.com / localhost / GitHub Pages)
  // ─────────────────────────────────────────────────────────────
  return (
    <Router basename={baseUrl}>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<Auth user={user} initialMode="login" />} />
        <Route path="/signup" element={<Auth user={user} initialMode="signup" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
