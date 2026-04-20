import React, { useState } from "react";
import { logJournal } from "../services/journalService";

function JournalLogger({ userId, onNext }) {
  const [entry, setEntry] = useState("");

  const handleSubmit = async () => {
    if (!entry) return;
    await logJournal(userId, entry);
    onNext(entry); // Pass journal to next step
    setEntry("");
  };

  return (
    <div className="p-4 border rounded shadow-md mt-4">
      <h2 className="text-lg font-bold mb-2">Write your journal entry</h2>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write here..."
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Log Journal
      </button>
    </div>
  );
}

export default JournalLogger;