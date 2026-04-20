import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { observeAuthState } from "./services/authService.js";
import Auth from "./components/Auth.jsx";
import TestMood from "./components/TestMood.jsx";
import TestJournal from "./components/TestJournal.jsx";
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
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        QalbSense MVP
      </h1>

      <div className="max-w-xl mx-auto space-y-8">
        <Auth user={user} />

        {user && (
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/mood-history" element={<MoodHistory user={user} />} />
              <Route path="/journal-history" element={<JournalHistory user={user} />} />
              <Route path="/reflection-history" element={<ReflectionHistory user={user} />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;