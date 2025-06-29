import { useState } from "react";

export default function MoodSelector() {
  const moods = ['😡', '😕', '😐', '🙂', '😄'];
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-6 text-center">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">How are you feeling today?</h2>
      <div className="flex justify-between px-4">
        {moods.map((mood, i) => (
          <button
            key={i}
            onClick={() => setSelectedMood(mood)}
            className={`text-3xl transition-transform duration-200 ${
              selectedMood === mood
                ? "scale-125 border-2 border-blue-500 rounded-full"
                : "hover:scale-110"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="mt-4 text-gray-600">
          You selected: <span className="text-xl">{selectedMood}</span>
        </p>
      )}
    </div>
  );
}
