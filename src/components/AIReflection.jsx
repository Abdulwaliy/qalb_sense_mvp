import React, { useState, useEffect } from "react";
import { logReflection, generateAIReflection } from "../services/reflectionService";

function AIReflection({ userId, mood, journal }) {
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    const generated = generateAIReflection(mood, journal);
    setReflection(generated);
  }, [mood, journal]);

  const handleSave = async () => {
    await logReflection(userId, reflection);
    alert("Reflection saved!");
  };

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-md mt-4">
      <h2 className="text-lg font-bold mb-2">Your AI Reflection</h2>
      <p className="mb-2">{reflection}</p>
      <button
        onClick={handleSave}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
      >
        Save Reflection
      </button>
    </div>
  );
}

export default AIReflection;