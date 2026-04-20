import { useState } from "react";
import { addJournal, getUserJournals } from "../services/journalService.js";

export default function TestJournal({ user }) {
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState([]);

  const handleAddJournal = async () => {
    if (!content) return alert("Enter journal content!");
    try {
      const id = await addJournal(user.uid, content);
      alert("Journal added: " + id);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Error adding journal: " + err.message);
    }
  };

  const handleFetchJournals = async () => {
    try {
      const data = await getUserJournals(user.uid);
      setJournals(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching journals: " + err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Test Journals</h2>
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        rows={3}
      />
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAddJournal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add
        </button>
        <button
          onClick={handleFetchJournals}
          className="text-green-600 hover:underline"
        >
          Fetch Journals
        </button>
      </div>
      <ul className="list-disc list-inside text-gray-700">
        {journals.map((j) => (
          <li key={j.id}>
            {j.content} —{" "}
            {j.timestamp
              ? new Date(j.timestamp.seconds * 1000).toLocaleString()
              : "No timestamp"}
          </li>
        ))}
      </ul>
    </div>
  );
}