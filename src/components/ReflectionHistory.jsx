import { useEffect, useState } from "react";
import { getUserReflections } from "../services/reflectionService.js";

export default function ReflectionHistory({ user }) {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchReflections = async () => {
      try {
        const data = await getUserReflections(user.uid);

        // Sort descending by timestamp
        const sorted = data.sort((a, b) => {
          const aTime = a.timestamp?.toDate
            ? a.timestamp.toDate().getTime()
            : a.timestamp?.seconds
            ? a.timestamp.seconds * 1000
            : 0;
          const bTime = b.timestamp?.toDate
            ? b.timestamp.toDate().getTime()
            : b.timestamp?.seconds
            ? b.timestamp.seconds * 1000
            : 0;
          return bTime - aTime;
        });

        setReflections(sorted);
      } catch (err) {
        console.error("Error fetching reflections:", err);
      }
    };

    fetchReflections();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Reflection History</h1>

      <div className="space-y-4 max-w-xl mx-auto">
        {reflections.length === 0 && (
          <p className="text-gray-500 text-center">No reflections yet.</p>
        )}

        {reflections.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-lg shadow-sm border-l-4 border-purple-500 bg-purple-50"
          >
            <p><strong>Reflection:</strong> {r.text}</p>
            {r.journalContent && (
              <p className="mt-2 text-gray-700"><strong>Journal:</strong> {r.journalContent}</p>
            )}
            {r.createdAt && (
              <p className="text-xs text-gray-500 mt-1">
                {r.createdAt.toDate
                  ? r.createdAt.toDate().toLocaleString()
                  : new Date(r.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}