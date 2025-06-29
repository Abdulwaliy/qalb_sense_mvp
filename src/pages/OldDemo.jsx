import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import AuthPage from "./AuthPage";
import MoodLogPage from "./MoodLogPage";
import Dashboard from "./Dashboard";
import ReflectionPage from "./ReflectionPage";
import JournalPage from "./JournalPage";
import PrivateRoute from "../components/PrivateRoute";

function NavBar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to login after logout
  };

  return (
    <nav className="space-x-4 p-4 border-b flex justify-between items-center bg-white">
      <div className="space-x-4">
        <Link to="/log">Log Mood</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reflect">Reflect</Link>
        <Link to="/journal">Journal</Link>
      </div>

      {user && (
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      )}
    </nav>
  );
}

export default function OldDemo() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/log" element={<MoodLogPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reflect"
          element={
            <PrivateRoute>
              <ReflectionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <PrivateRoute>
              <JournalPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
