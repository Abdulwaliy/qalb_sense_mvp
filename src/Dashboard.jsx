import React, { useState } from "react";
import MoodLogger from "./components/MoodLogger";
//import JournalLogger from "./components/JournalLogger";
import AIReflection from "./components/AIReflection";

// Replace this with actual Firebase Auth user UID later
const DUMMY_USER_ID = "user_123";

function Dashboard() {
  const [step, setStep] = useState(1);
  const [currentMood, setCurrentMood] = useState("");
  const [currentJournal, setCurrentJournal] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        QalbSense Dashboard
      </h1>

      {step === 1 && (
        <MoodLogger
          userId={DUMMY_USER_ID}
          onNext={(mood) => {
            setCurrentMood(mood);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <JournalLogger
          userId={DUMMY_USER_ID}
          onNext={(journal) => {
            setCurrentJournal(journal);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <AIReflection
          userId={DUMMY_USER_ID}
          mood={currentMood}
          journal={currentJournal}
        />
      )}
    </div>
  );
}

export default Dashboard;