import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateReflection = async ({ mood, journal }) => {
  const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `You are a structured Islamic emotional reflection assistant.
Do NOT repeat user text verbatim.
Do NOT say "you wrote".
Return ONLY the following 5 sections:

1. Emotional Mirror
2. Insight
3. Reframe
4. Action Step
5. Spiritual Reminder`,
      },
      {
        role: "user",
        content: `Mood: ${mood}\n\nJournal:\n${journal}`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};
