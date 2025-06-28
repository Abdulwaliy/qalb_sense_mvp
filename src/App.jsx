import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import MoodLogPage from './pages/MoodLogPage';
import Dashboard from './pages/Dashboard';
import ReflectionPage from './pages/ReflectionPage';
import './App.css';
import './firebase'; // keep your firebase init

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/log" element={<MoodLogPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reflect" element={<ReflectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
