export const CORE_MOOD_STATES = [
  {
    id: "Uplifted",
    label: "Uplifted",
    sub: "Al-Basṭ",
    emoji: "🌿",
    color: "#167754",
    bg: "#eef6f0",
    border: "#c0decb",
    nuances: [
      { label: "Grateful", sub: "Shākir",   emoji: "🌿", color: "#167754", bg: "#eef6f0", border: "#c0decb" },
      { label: "Hopeful",  sub: "Rajā’",    emoji: "✨", color: "#b8871b", bg: "#fdf8ec", border: "#f3e1b7" },
      { label: "Inspired", sub: "Himmah",   emoji: "🌟", color: "#2d7a4f", bg: "#eef7f1", border: "#bfe0ca" },
      { label: "Joyful",   sub: "Faraḥ",    emoji: "☀️", color: "#c28416", bg: "#fef8ea", border: "#f3dfb2" },
    ],
  },
  {
    id: "Grounded",
    label: "Grounded",
    sub: "As-Sakīnah",
    emoji: "🕊️",
    color: "#0d6e5a",
    bg: "#ebf6f3",
    border: "#b8dfd6",
    nuances: [
      { label: "Serene",   sub: "Sakīnah",  emoji: "🕊️", color: "#0d6e5a", bg: "#ebf6f3", border: "#b8dfd6" },
      { label: "Content",  sub: "Riḍā",     emoji: "🤍", color: "#4d7c58", bg: "#f0f6f0", border: "#cde0ce" },
      { label: "Relieved", sub: "Faraj",    emoji: "🌤️", color: "#2b7a78", bg: "#edf6f6", border: "#bee0df" },
      { label: "Present",  sub: "Khushū‘",  emoji: "🤲", color: "#167754", bg: "#eef6f0", border: "#c0decb" },
    ],
  },
  {
    id: "Agitated",
    label: "Agitated",
    sub: "Al-Qalaq",
    emoji: "🌊",
    color: "#774eb0",
    bg: "#f6f1fc",
    border: "#dacaf0",
    nuances: [
      { label: "Anxious",     sub: "Khawf",   emoji: "🌊", color: "#774eb0", bg: "#f6f1fc", border: "#dacaf0" },
      { label: "Overwhelmed", sub: "Ḍīq",     emoji: "🌪️", color: "#9a4c8a", bg: "#faf0f8", border: "#e6c8e0" },
      { label: "Frustrated",  sub: "Ghaḍab",  emoji: "🔥", color: "#c0392b", bg: "#fdf2f0", border: "#f5c6cb" },
      { label: "Restless",    sub: "Waswās",  emoji: "⚡", color: "#b45309", bg: "#fef6ec", border: "#f5dbb8" },
    ],
  },
  {
    id: "Heavy",
    label: "Heavy",
    sub: "Al-Qabḍ",
    emoji: "🌧️",
    color: "#326eb8",
    bg: "#eff5fc",
    border: "#c8ddf4",
    nuances: [
      { label: "Grieving",    sub: "Ḥuzn",    emoji: "🌧️", color: "#326eb8", bg: "#eff5fc", border: "#c8ddf4" },
      { label: "Lonely",      sub: "Waḥshah", emoji: "🌙", color: "#4f5d95", bg: "#f0f2f9", border: "#cdd3e8" },
      { label: "Remorseful",  sub: "Nadam",   emoji: "💧", color: "#2d6a8e", bg: "#eef5f9", border: "#c3dce9" },
      { label: "Discouraged", sub: "Ya’s",    emoji: "🍂", color: "#6d5b7b", bg: "#f5f2f7", border: "#dcd3e3" },
    ],
  },
  {
    id: "Depleted",
    label: "Depleted",
    sub: "Al-Fatrah",
    emoji: "🕯️",
    color: "#617378",
    bg: "#f2f5f6",
    border: "#d4dee0",
    nuances: [
      { label: "Exhausted",   sub: "Ta‘ab",   emoji: "🕯️", color: "#617378", bg: "#f2f5f6", border: "#d4dee0" },
      { label: "Numb",        sub: "Fatrah",  emoji: "🌫️", color: "#68736c", bg: "#f2f4f2", border: "#d5dbd6" },
      { label: "Unmotivated", sub: "Kasal",   emoji: "🪨", color: "#6c6f75", bg: "#f3f4f5", border: "#d8dadf" },
      { label: "Burnt Out",   sub: "Ijhād",   emoji: "🪫", color: "#7a5c58", bg: "#f7f3f2", border: "#e2d4d2" },
    ],
  },
];

export const MOOD_OPTIONS = CORE_MOOD_STATES.flatMap((core) =>
  core.nuances.map((n) => ({ ...n, core: core.id }))
);

export const INTENSITY_OPTIONS = [
  { label: "Gentle",   hint: "Light on the heart" },
  { label: "Moderate", hint: "Present & felt" },
  { label: "Heavy",    hint: "Deeply weighing" },
];

const LEGACY_MOOD_META = {
  Happy: { emoji: "😄", color: "#b8871b", bg: "#fdf8ec", border: "#f3e1b7", label: "Happy" },
  Sad:   { emoji: "😢", color: "#326eb8", bg: "#eff5fc", border: "#c8ddf4", label: "Sad"   },
  Angry: { emoji: "😡", color: "#c0392b", bg: "#fdf2f0", border: "#f5c6cb", label: "Angry" },
  Calm:  { emoji: "😌", color: "#167754", bg: "#eef6f0", border: "#c0decb", label: "Calm"  },
  Tired: { emoji: "😴", color: "#617378", bg: "#f2f5f6", border: "#d4dee0", label: "Tired" },
};

export const MOOD_META_MAP = {
  ...LEGACY_MOOD_META,
  ...Object.fromEntries(MOOD_OPTIONS.map((m) => [m.label, m])),
};

export const JOURNAL_PROMPTS = {
  Grateful: [
    "Name one quiet blessing from today you don't want to take for granted.",
    "How did Allah's care show up in a small detail of your day?",
  ],
  Hopeful: [
    "What door are you asking Allah to open, and what small step can you take toward it?",
    "Where do you sense light returning in your life right now?",
  ],
  Inspired: [
    "What good deed or purpose is stirring in your heart right now?",
    "How can you channel this energy into something pleasing to Allah?",
  ],
  Joyful: [
    "What brought warmth to your heart today, and how can you thank Allah for it?",
    "Who could you share a piece of this goodness or kindness with today?",
  ],
  Serene: [
    "What helped your heart settle into Sakīnah today?",
    "Write a brief note of gratitude or a quiet Du‘ā’ from this stillness.",
  ],
  Content: [
    "What feels enough in your life right now, just as Allah has decreed it?",
    "Notice what you are no longer chasing today—how does that feel?",
  ],
  Relieved: [
    "What weight was just lifted from you, and what did that teach you about Allah's timing?",
    "Offer a moment of Alhamdulillah for getting through what once felt heavy.",
  ],
  Present: [
    "What is your heart most aware of in this moment before Allah?",
    "What distraction are you willing to set aside for the next hour?",
  ],
  Anxious: [
    "What is one burden you are carrying right now that you can place in Allah's hands?",
    "What is the worst-case scenario your mind is replaying, and what is actually in your control today?",
  ],
  Overwhelmed: [
    "If you only had to honor one responsibility today and leave the rest to Allah, what would it be?",
    "Write everything crowding your mind out here—no order needed.",
  ],
  Frustrated: [
    "What boundary, expectation, or hurt is sitting underneath this anger?",
    "What would responding with prophetic patience and dignity look like here?",
  ],
  Restless: [
    "What thought keeps circling your mind (Waswās), and what truth steadies you against it?",
    "What is your heart actually searching for beneath this restlessness?",
  ],
  Grieving: [
    "If you were speaking candidly to Allah in Sujood right now, what would you tell Him?",
    "What loss or ache needs space to be acknowledged without rushing to fix it?",
  ],
  Lonely: [
    "Even when people feel distant, what would you like to confide in Allah tonight?",
    "Who is one person you could reach out to with a simple Salam today?",
  ],
  Remorseful: [
    "What is weighing on your conscience, and what honest step of Tawbah or repair feels within reach?",
    "Speak to Allah with sincerity—remember His mercy is wider than any mistake.",
  ],
  Discouraged: [
    "Where do you feel like giving up, and what small effort can you still offer with Bismillah?",
    "Recall one past hardship Allah already carried you through.",
  ],
  Exhausted: [
    "What has been draining your soul and body lately, and where do you need gentle rest?",
    "Remember Allah does not burden a soul beyond its capacity—what can you pause today?",
  ],
  Numb: [
    "Even if your heart feels quiet or distant today, what is one thing you wish Allah would soften?",
    "Describe your day plainly—sometimes honesty is the first step back to feeling.",
  ],
  Unmotivated: [
    "What feels heavy to start right now, and what is a 2-minute Bismillah step?",
    "Is your soul asking for discipline, or is it asking for rest and renewal?",
  ],
  "Burnt Out": [
    "Where have you been pouring out without refilling your own heart?",
    "What obligation can wait so you can return to Allah and yourself gently?",
  ],
  default: [
    "What is sitting heaviest or brightest on your heart right now?",
    "If you spoke honestly to Allah in this moment, what would you say?",
    "What did your soul need today that it didn't get?",
  ],
};
