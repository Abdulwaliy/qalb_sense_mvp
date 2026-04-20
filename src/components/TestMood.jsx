import { useState } from "react";
import { logMood, getUserMoods } from "../services/moodService.js";

export default function TestMood({ user }) {
  const [mood, setMood] = useState("");
  const [moods, setMoods] = useState([]);

  const handleLogMood = async () => {
    if (!mood) return alert("Enter a mood!");
    try {
      const id = await logMood(user.uid, mood, "Testing mood logging"); // Fixed
      alert("Mood logged: " + id);
      setMood("");
    } catch (err) {
      console.error(err);
      alert("Error logging mood: " + err.message);
    }
  };

  const handleFetchMoods = async () => {
    try {
      const userMoods = await getUserMoods(user.uid);
      setMoods(userMoods);
    } catch (err) {
      console.error(err);
      alert("Error fetching moods: " + err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Test Mood Logging
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter mood"
        />
        <button
          onClick={handleLogMood}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Log
        </button>
      </div>
      <button
        onClick={handleFetchMoods}
        className="text-blue-600 hover:underline mb-4"
      >
        Fetch Moods
      </button>
      <ul className="list-disc list-inside text-gray-700">
        {moods.map((m) => (
          <li key={m.id}>
            {m.mood} — {m.note} —{" "}
            {m.timestamp
              ? new Date(m.timestamp.seconds * 1000).toLocaleString()
              : "No timestamp"}
          </li>
        ))}
      </ul>
    </div>
  );
}