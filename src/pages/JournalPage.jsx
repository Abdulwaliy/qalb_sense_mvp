import { useState } from "react";

export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (entry.trim()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000); // reset after 2s
      setEntry(""); // clear input
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Journal Your Mood</h2>
        <textarea
          className="w-full border border-gray-300 rounded p-3 mb-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Entry
        </button>

        {saved && <p className="text-green-600 mt-4">✅ Entry saved!</p>}
      </div>
    </div>
  );
}
 
