import { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { observeAuthState } from "./services/authService.js";
import Auth from "./components/Auth.jsx";
import LandingPage from "./components/LandingPage.jsx";
import MoodHistory from "./components/MoodHistory.jsx";
import JournalHistory from "./components/JournalHistory.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ReflectionHistory from "./components/ReflectionHistory.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = observeAuthState(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {user ? (
        <div className="min-h-screen bg-gray-50 p-8">
          <h1 className="mb-8 text-center text-3xl font-bold">QalbSense</h1>
          <div className="mx-auto max-w-xl space-y-8">
            <Auth user={user} />
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/mood-history" element={<MoodHistory user={user} />} />
              <Route path="/journal-history" element={<JournalHistory user={user} />} />
              <Route path="/reflection-history" element={<ReflectionHistory user={user} />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth initialMode="login" />} />
          <Route path="/signup" element={<Auth initialMode="signup" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
