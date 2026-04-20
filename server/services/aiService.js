import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // or GROQ equivalent
});

export const generateReflection = async ({ mood, journal }) => {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a calm Islamic emotional reflection assistant.",
      },
      {
        role: "user",
        content: `
Mood: ${mood}

Journal:
${journal}

Return:
1. Emotional Mirror
2. Insight
3. Reframe
4. Action Step
5. Spiritual Reminder
        `,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};