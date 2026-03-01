import { useState } from "react";
import { logMood } from "../services/moodService.js";
import { addJournal } from "../services/journalService.js";
import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  const [mood, setMood] = useState("");
  const [journalContent, setJournalContent] = useState("");

  const moodOptions = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😴", label: "Tired" },
  ];

  const handleAddJournal = async () => {
    if (!journalContent) return alert("Enter journal content!");
    try {
      await addJournal(user.uid, journalContent);
      setJournalContent("");
    } catch (err) {
      console.error(err);
      alert("Error adding journal: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">QalbSense Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mood Section */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Log Mood</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {moodOptions.map((m) => (
              <button
                key={m.label}
                onClick={async () => {
                  try {
                    await logMood(user.uid, m.label, m.emoji);
                    alert(`Mood logged: ${m.label}`);
                  } catch (err) {
                    console.error(err);
                    alert("Error logging mood: " + err.message);
                  }
                }}
                className="text-2xl p-2 bg-gray-100 rounded hover:bg-gray-200 transition flex items-center gap-2"
              >
                <span>{m.emoji}</span>
                <span className="text-sm">{m.label}</span>
              </button>
            ))}
          </div>
          <Link
            to="/mood-history"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View Mood History
          </Link>
        </div>

        {/* Journal Section */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Write Journal</h2>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Write your thoughts..."
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            rows={3}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-2"
            onClick={handleAddJournal}
          >
            Add
          </button>
          <Link
            to="/journal-history"
            className="text-green-600 hover:underline mt-2 inline-block"
          >
            View Journal History
          </Link>
        </div>
      </div>
    </div>
  );
}