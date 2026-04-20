import React, { useState } from "react";
import { logMood } from "../services/moodService";

function MoodLogger({ userId, onNext }) {
  const [mood, setMood] = useState("");

  const handleSubmit = async () => {
    if (!mood) return;
    await logMood(userId, mood);
    onNext(mood); // Pass mood to next step
    setMood("");
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">How are you feeling today?</h2>
      <input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Enter mood..."
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Log Mood
      </button>
    </div>
  );
}

export default MoodLogger;