import { useEffect, useState } from "react";
import { getUserMoods } from "../services/moodService.js";

const moodColors = {
  Happy: "bg-yellow-100 border-yellow-500",
  Sad: "bg-blue-100 border-blue-500",
  Angry: "bg-red-100 border-red-500",
  Anxious: "bg-purple-100 border-purple-500",
  Calm: "bg-green-100 border-green-500",
  Tired: "bg-gray-100 border-gray-500",
};

export default function MoodHistory({ user }) {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const data = await getUserMoods(user.uid);
        setMoods(data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Mood History</h1>
      <div className="space-y-2 max-w-xl mx-auto">
        {moods.map((m) => {
          const colorClass = moodColors[m.mood] || "bg-gray-50 border-gray-300";
          return (
            <div
              key={m.id}
              className={`p-3 rounded-lg shadow-sm border-l-4 flex items-center gap-2 ${colorClass}`}
            >
              <span className="text-xl">{m.note}</span>
              <span>{m.mood}</span>
              <span className="text-xs text-gray-500">
                {m.timestamp
                  ? new Date(m.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}