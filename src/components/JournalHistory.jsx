import { useEffect, useState } from "react";
import { getUserJournals } from "../services/journalService.js";

export default function JournalHistory({ user }) {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const data = await getUserJournals(user.uid);
        // Sort by timestamp descending
        setJournals(data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Journal History</h1>
      <div className="space-y-2 max-w-xl mx-auto">
        {journals.map((j) => (
          <div
            key={j.id}
            className="p-3 rounded-lg shadow-sm border-l-4 border-green-500 bg-green-50"
          >
            <p><strong>Journal:</strong> {j.content}</p>
            
            {j.reflection && (
              <p className="mt-1 text-gray-700"><strong>Reflection:</strong> {j.reflection}</p>
            )}
            
            <p className="text-xs text-gray-500">
              {j.timestamp
                ? new Date(j.timestamp.seconds * 1000).toLocaleString()
                : "No timestamp"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}